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
            case 'edenai':
                return this.checkWithEdenAi(cleanText, options.apiKey);
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
    // EDEN AI API INTEGRATION
    // ==========================================

    async checkWithEdenAi(text, apiKey) {
        if (!apiKey) throw new Error('API Key Eden AI diperlukan.');

        this.reportProgress({ status: 'Menganalisis...', detail: 'Mengecek Turnitin AI Score via Eden AI (Sapling)' });

        try {
            // Menggunakan endpoint AI Detection yang ramah Free Tier
            const response = await fetch('https://api.edenai.run/v2/text/ai_detection', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    providers: "sapling", // Provider alternatif yang lebih stabil untuk akun gratis
                    text: text
                })
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || `Error Server: ${response.status}`);
                } else {
                    throw new Error(`Endpoint dikunci oleh Eden AI (Error ${response.status}).`);
                }
            }

            const data = await response.json();
            const providerResult = data['sapling'] || Object.values(data)[0];

            if (!providerResult || providerResult.status !== "success") {
                throw new Error('Provider Sapling gagal memproses teks ini.');
            }

            // Mengekstrak skor dari berbagai kemungkinan format response Eden AI
            let aiScore = 0;
            if (providerResult.ai_score !== undefined) {
                aiScore = providerResult.ai_score;
            } else if (providerResult.items && providerResult.items.length > 0) {
                aiScore = providerResult.items[0].ai_score || providerResult.items[0].score || 0;
            }

            // Memastikan skor berupa desimal (0.0 - 1.0) agar tidak error saat dikalikan 100 di UI
            if (aiScore > 1) {
                aiScore = aiScore / 100;
            }

            return {
                method: 'edenai',
                overallScore: aiScore,
                sources: [{
                    title: 'Indikasi Teks Buatan AI (Turnitin AI Score)',
                    url: null,
                    similarity: aiScore,
                    type: 'ai-detection',
                    snippet: 'Skor ini menunjukkan seberapa mirip gaya tulisan Anda dengan pola AI. Semakin rendah skornya (< 20%), tulisan Anda semakin natural layaknya manusia.'
                }],
                raw: data
            };

        } catch (error) {
            console.error("[Eden AI Error]:", error);
            if (error.message.includes('404')) {
                throw new Error("Provider Sapling sedang tidak tersedia atau saldo API gratis Anda telah habis. Silakan gunakan tombol Lokal atau Web.");
            }
            throw error; 
        }
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
        const phrases = [];
        // Hapus batasan 100 kata agar seluruh teks di-scan
        const words1 = text1.split(/\s+/); 
        
        for (let i = 0; i < words1.length - 3; i++) {
            const phrase = words1.slice(i, i + 5).join(' ');
            
            if (text2.toLowerCase().includes(phrase.toLowerCase()) && phrase.length > 20) {
                phrases.push(phrase);
                i += 4; 
            }
            if (phrases.length >= 5) break; 
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