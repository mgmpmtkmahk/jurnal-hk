// ==========================================
// FILE: plagiarism-service.js
// Fungsi: Integrasi Copyleaks API + Local Similarity
// ==========================================

const PlagiarismService = {
    // Konfigurasi default
    config: {
        baseUrl: 'https://api.copyleaks.com/v3',
        similarityThreshold: 15, // % di bawah ini = dianggap aman
        maxTextLength: 25000, // Copyleaks limit
        pollingInterval: 3000, // 3 detik
        maxPollingAttempts: 20 // 60 detik timeout
    },

    // State tracking untuk polling
    activeScans: new Map(),

    // ==========================================
    // PUBLIC API METHODS
    // ==========================================

    /**
     * Entry point utama - route ke method yang sesuai
     */
    async check(text, method = 'copyleaks', options = {}) {
        if (!text || text.trim().length < 50) {
            throw new Error('Teks minimal 50 karakter untuk plagiarism check.');
        }

        const cleanText = this.sanitizeText(text);
        
        switch(method) {
            case 'local':
                return this.checkLocalSimilarity(cleanText, options.references || []);
            case 'copyleaks':
                return this.checkWithCopyleaks(cleanText, options.apiKey);
            case 'quick':
                // Cek lokal dulu, kalau > threshold baru ke Copyleaks
                const localResult = await this.checkLocalSimilarity(cleanText, options.references || []);
                if (localResult.overallScore > 0.3) { // 30% similar locally
                    return this.checkWithCopyleaks(cleanText, options.apiKey);
                }
                return localResult;
            default:
                throw new Error(`Method "${method}" tidak didukung.`);
        }
    },

    // ==========================================
    // COPYLEAKS API INTEGRATION
    // ==========================================

    /**
     * Step 1: Submit text ke Copyleaks
     */
    async checkWithCopyleaks(text, apiKey) {
        if (!apiKey) throw new Error('Copyleaks API Key diperlukan.');

        // Bagi text jika terlalu panjang
        const chunks = this.chunkText(text, this.config.maxTextLength);
        const results = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunkResult = await this.submitAndPollChunk(chunks[i], apiKey, i + 1, chunks.length);
            results.push(chunkResult);
        }

        // Merge results
        return this.mergeResults(results);
    },

    /**
     * Submit chunk dan poll hasilnya
     */
    async submitAndPollChunk(text, apiKey, chunkNum, totalChunks) {
        // Generate unique ID untuk scan ini
        const scanId = `sci-doc-${Date.now()}-${chunkNum}`;
        
        try {
            // Step 1: Submit
            const submitResponse = await fetch(`${this.config.baseUrl}/scans/submit/file`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    base64: this.textToBase64(text),
                    filename: `chunk-${chunkNum}.txt`,
                    properties: {
                        action: 0, // 0 = plagiarism check
                        includeHtml: false,
                        sandbox: false,
                        filters: {
                            identicalEnabled: true,
                            minorChangesEnabled: true,
                            relatedMeaningEnabled: true
                        }
                    }
                })
            });

            if (!submitResponse.ok) {
                const error = await submitResponse.json();
                throw new Error(`Copyleaks Error: ${error.message || 'Submit failed'}`);
            }

            const { id: copyleaksScanId } = await submitResponse.json();
            
            // Step 2: Poll untuk hasil
            return await this.pollResult(copyleaksScanId, apiKey, chunkNum, totalChunks);

        } catch (error) {
            console.error(`[Copyleaks] Chunk ${chunkNum} failed:`, error);
            throw error;
        }
    },

    /**
     * Polling loop untuk mendapatkan hasil scan
     */
    async pollResult(scanId, apiKey, chunkNum, totalChunks) {
        let attempts = 0;
        
        while (attempts < this.config.maxPollingAttempts) {
            await this.delay(this.config.pollingInterval);
            attempts++;

            try {
                const response = await fetch(`${this.config.baseUrl}/scans/${scanId}/result`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                });

                if (response.status === 200) {
                    const result = await response.json();
                    return this.parseCopyleaksResult(result, chunkNum, totalChunks);
                }

                // 202 = still processing, continue polling
                if (response.status === 202) {
                    console.log(`[Copyleaks] Chunk ${chunkNum}/${totalChunks}: Scanning... (${attempts}/${this.config.maxPollingAttempts})`);
                    continue;
                }

                // Error
                const error = await response.json();
                throw new Error(error.message || 'Polling failed');

            } catch (error) {
                if (attempts >= this.config.maxPollingAttempts) {
                    throw new Error('Timeout: Scan terlalu lama, coba lagi nanti.');
                }
                // Continue polling on network errors
                console.warn(`[Copyleaks] Polling error, retrying: ${error.message}`);
            }
        }

        throw new Error('Polling timeout');
    },

    /**
     * Parse response Copyleaks ke format internal
     */
    parseCopyleaksResult(raw, chunkNum, totalChunks) {
        const statistics = raw.statistics || {};
        const similarity = statistics.similarity || 0;
        const sources = (raw.results || []).map(r => ({
            url: r.url,
            title: r.title || 'Unknown Source',
            similarity: r.similarity || 0,
            matchedWords: r.matchedWords || 0,
            type: r.type || 'internet', // internet, database, etc
            snippet: r.snippet || null
        }));

        return {
            method: 'copyleaks',
            chunk: chunkNum,
            totalChunks: totalChunks,
            overallScore: similarity,
            totalWords: statistics.totalWords || 0,
            sources: sources,
            raw: raw // untuk debugging
        };
    },

    // ==========================================
    // LOCAL SIMILARITY (FALLBACK/QUICK CHECK)
    // ==========================================

    /**
     * TF-IDF + Cosine Similarity dengan jurnal lokal
     */
    async checkLocalSimilarity(text, references) {
        this.reportProgress({ status: 'Menganalisis Teks...', detail: 'Memecah kalimat dan tokenisasi' });
        if (!references || references.length === 0) {
            // Kalau tidak ada referensi, cek internal repetition
            return this.checkInternalRepetition(text);
        }

        const textTokens = this.tokenize(text);
        const textVector = this.computeTFIDF(textTokens, [textTokens]);

        const matches = references.map(ref => {
            const refTokens = this.tokenize(ref.content || ref.raw || '');
            const refVector = this.computeTFIDF(refTokens, [refTokens, textTokens]);
            
            this.reportProgress({ status: 'Membandingkan Database...', detail: `Mencocokkan dengan ${references.length} jurnal lokal` });
            
            const similarity = this.cosineSimilarity(textVector, refVector);
            
            // Extract similar phrases untuk highlight
            const similarPhrases = this.extractSimilarPhrases(text, ref.content || ref.raw || '', similarity);

            return {
                title: ref.title || ref.parsed?.title || 'Jurnal Referensi Lokal',
                similarity: similarity,
                matchedPhrases: similarPhrases,
                type: 'local-reference'
            };
        });

        const overallScore = Math.max(...matches.map(m => m.similarity), 0);

        return {
            method: 'local',
            overallScore: overallScore,
            sources: matches.filter(m => m.similarity > 0.05), // Filter noise
            internalRepetition: this.checkInternalRepetition(text).repetitionScore
        };
    },

    /**
     * Cek pengulangan internal dalam teks (redundancy)
     */
    checkInternalRepetition(text) {
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        const uniqueSentences = new Set(sentences.map(s => s.trim().toLowerCase()));
        
        const repetitionScore = sentences.length > 0 
            ? (sentences.length - uniqueSentences.size) / sentences.length 
            : 0;

        return {
            method: 'internal',
            repetitionScore: repetitionScore,
            totalSentences: sentences.length,
            uniqueSentences: uniqueSentences.size
        };
    },

    // ==========================================
    // ALGORITHMS & HELPERS
    // ==========================================

    tokenize(text) {
        return text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 3 && !this.isStopWord(w));
    },

    isStopWord(word) {
        const stopWords = new Set([
            'yang', 'dan', 'dengan', 'untuk', 'dari', 'pada', 'dalam', 'ini', 'itu',
            'the', 'and', 'for', 'with', 'from', 'that', 'this', 'are', 'was', 'were'
        ]);
        return stopWords.has(word);
    },

    computeTFIDF(tokens, allDocuments) {
        const tf = {};
        tokens.forEach(t => tf[t] = (tf[t] || 0) + 1);
        
        const idf = {};
        const uniqueTokens = [...new Set(tokens)];
        uniqueTokens.forEach(token => {
            const docsWithToken = allDocuments.filter(doc => doc.includes(token)).length;
            idf[token] = Math.log((allDocuments.length + 1) / (docsWithToken + 1)) + 1;
        });

        const vector = {};
        uniqueTokens.forEach(token => {
            vector[token] = (tf[token] || 0) * (idf[token] || 0);
        });

        return vector;
    },

    cosineSimilarity(vecA, vecB) {
        const allKeys = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
        
        let dotProduct = 0;
        let magA = 0;
        let magB = 0;

        allKeys.forEach(key => {
            const a = vecA[key] || 0;
            const b = vecB[key] || 0;
            dotProduct += a * b;
            magA += a * a;
            magB += b * b;
        });

        magA = Math.sqrt(magA);
        magB = Math.sqrt(magB);

        return magA && magB ? dotProduct / (magA * magB) : 0;
    },

    extractSimilarPhrases(text1, text2, threshold = 0.6) {
        // Simplified: cari n-gram yang sama
        const phrases = [];
        const words1 = text1.split(/\s+/).slice(0, 100); // Limit untuk performa
        
        for (let i = 0; i < words1.length - 3; i++) {
            const phrase = words1.slice(i, i + 4).join(' ');
            if (text2.toLowerCase().includes(phrase.toLowerCase()) && phrase.length > 15) {
                phrases.push(phrase);
                i += 3; // Skip overlap
            }
            if (phrases.length >= 5) break; // Limit output
        }

        return phrases;
    },

    // ==========================================
    // UTILITIES
    // ==========================================

    chunkText(text, maxLength) {
        if (text.length <= maxLength) return [text];
        
        const chunks = [];
        let start = 0;
        
        while (start < text.length) {
            let end = start + maxLength;
            
            // Cari batas kalimat terdekat
            if (end < text.length) {
                const nextPeriod = text.indexOf('.', end);
                const nextNewline = text.indexOf('\n', end);
                end = Math.min(
                    nextPeriod > 0 ? nextPeriod + 1 : end,
                    nextNewline > 0 ? nextNewline : end
                );
            }
            
            chunks.push(text.slice(start, end).trim());
            start = end;
        }
        
        return chunks;
    },

    textToBase64(text) {
        return btoa(unescape(encodeURIComponent(text)));
    },

    sanitizeText(text) {
        // Hapus markdown syntax untuk plagiarism check
        return text
            .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
            .replace(/\*(.*?)\*/g, '$1')      // Italic
            .replace(/\[(.*?)\]\((.*?)\)/g, '$1') // Links
            .replace(/#{1,6}\s?/g, '')        // Headers
            .replace(/`{3}[\s\S]*?`{3}/g, '') // Code blocks
            .replace(/`([^`]+)`/g, '$1');     // Inline code
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    mergeResults(results) {
        if (results.length === 1) return results[0];

        // Weighted average berdasarkan word count
        const totalWords = results.reduce((sum, r) => sum + (r.totalWords || 0), 0);
        const weightedScore = results.reduce((sum, r) => {
            return sum + (r.overallScore * (r.totalWords || 0));
        }, 0) / totalWords;

        // Merge dan deduplicate sources
        const allSources = results.flatMap(r => r.sources || []);
        const uniqueSources = this.deduplicateSources(allSources);

        // Sort by similarity
        uniqueSources.sort((a, b) => b.similarity - a.similarity);

        return {
            method: 'copyleaks-merged',
            overallScore: weightedScore,
            totalWords: totalWords,
            sources: uniqueSources.slice(0, 10), // Top 10 sources
            chunksProcessed: results.length,
            raw: results.map(r => r.raw) // Preserve raw untuk detail view
        };
    },

    deduplicateSources(sources) {
        const seen = new Map();
        sources.forEach(s => {
            const key = s.url || s.title;
            if (!seen.has(key) || seen.get(key).similarity < s.similarity) {
                seen.set(key, s);
            }
        });
        return [...seen.values()];
    },

    // ==========================================
    // PROGRESS CALLBACK
    // ==========================================

    onProgress(callback) {
        this.progressCallback = callback;
    },

    reportProgress(data) {
        if (this.progressCallback) {
            this.progressCallback(data);
        }
    }
};