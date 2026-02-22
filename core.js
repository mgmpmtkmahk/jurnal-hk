// ==========================================
// FILE 3: core.js (REFACTORED)
// Fungsi: Core Logic, Prompt Generator, Export Word, Auto-Memory
// ==========================================

function searchJournals() {
    const keyword = document.getElementById('searchKeyword').value;
    if (!keyword) { showCustomAlert('warning', 'Input Kosong', 'Masukkan keyword jurnal!'); return; }
    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i><p class="mt-2 text-gray-600">Mencari jurnal...</p></div>';

    setTimeout(() => {
        const intlSources = [
            { name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(keyword), icon: 'fa-graduation-cap', color: 'blue' },
            { name: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=' + encodeURIComponent(keyword), icon: 'fa-microchip', color: 'purple' },
            { name: 'ScienceDirect', url: 'https://www.sciencedirect.com/search?qs=' + encodeURIComponent(keyword), icon: 'fa-atom', color: 'orange' },
            { name: 'DOAJ (Open Access)', url: 'https://doaj.org/search/articles?q=' + encodeURIComponent(keyword), icon: 'fa-unlock-alt', color: 'teal' }
        ];
        
        const indoSources = [
            { name: 'Google Scholar ID', url: 'https://scholar.google.co.id/scholar?q=filetype:pdf ' + encodeURIComponent(keyword) + '&lr=lang_id', icon: 'fa-graduation-cap', color: 'red', desc: 'Google Cendikia' },
            { name: 'SINTA', url: 'https://sinta.kemdiktisaintek.go.id/', icon: 'fa-university', color: 'green', desc: 'Science and Technology Index' },
            { name: 'Garuda', url: 'https://garuda.kemdiktisaintek.go.id/documents?q=' + encodeURIComponent(keyword), icon: 'fa-book', color: 'yellow', desc: 'Garba Rujukan Digital' },
            { name: 'Neliti Indonesia', url: 'https://www.neliti.com/id/search?q=' + encodeURIComponent(keyword), icon: 'fa-search', color: 'teal', desc: 'Repository, Jurnal, dan Konferensi' },
            { name: 'UI Scholars Hub', url: 'https://scholarhub.ui.ac.id/do/search/?q=' + encodeURIComponent(keyword), icon: 'fa-university', color: 'blue', desc: 'Scholarhub UI' },
            { name: 'E-Jurnal UNDIP', url: 'https://ejournal.undip.ac.id/index.php/index/search?query=' + encodeURIComponent(keyword), icon: 'fa-book-open', color: 'purple', desc: 'Jurnal Multidisiplin UNDIP' },
            { name: 'Jurnal Online UGM', url: 'https://journal.ugm.ac.id/index/search/search?query=' + encodeURIComponent(keyword), icon: 'fa-graduation-cap', color: 'green', desc: 'Repositori UGM' },
            { name: 'Perpustakaan Digital ITB', url: 'https://digilib.itb.ac.id/gdl/go/' + encodeURIComponent(keyword), icon: 'fa-flask', color: 'orange', desc: 'Digital Library (digilib) ITB' }
        ];

        const buildHTML = (sources) => sources.map(s => `
            <a href="${s.url}" target="_blank" class="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-${s.color}-500 hover:bg-${s.color}-50 transition-all group">
            <div class="w-10 h-10 bg-${s.color}-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0"><i class="fas ${s.icon} text-${s.color}-600 text-sm"></i></div>
            <div class="flex-1 min-w-0"><h4 class="font-semibold text-gray-800 text-sm truncate">${s.name}</h4>${s.desc ? `<p class="text-xs text-gray-500 mt-0.5">${s.desc}</p>` : ''}</div></a>`).join('');

        resultsDiv.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-red-500"><h3 class="font-bold text-lg mb-4 text-red-600 flex items-center"><i class="fas fa-flag mr-2"></i>Nasional</h3><div class="grid md:grid-cols-2 gap-4">${buildHTML(indoSources)}</div></div>
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-500"><h3 class="font-bold text-lg mb-4 text-blue-600 flex items-center"><i class="fas fa-globe mr-2"></i>Internasional</h3><div class="grid md:grid-cols-2 gap-4">${buildHTML(intlSources)}</div></div>`;
            
        const navStep1 = document.getElementById('nav-step1');
        if(navStep1) navStep1.classList.remove('hidden');
    }, 1000);
}

function extractJSON(text) {
    if (!text || typeof text !== 'string') {
        throw new Error("Teks respons AI kosong atau tidak valid.");
    }
    
    let jsonStr = text.trim();

    // Skenario 1: Ambil secara spesifik dari dalam blok markdown ```json ... ```
    const match = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (match) {
        jsonStr = match[1].trim();
    } else {
        // Skenario 2: Pembersihan manual jika AI tidak memakai blok markdown
        // Kita cari kurung pertama dan terakhir yang logis
        const firstBrace = jsonStr.indexOf('{');
        const lastBrace = jsonStr.lastIndexOf('}');
        const firstBracket = jsonStr.indexOf('[');
        const lastBracket = jsonStr.lastIndexOf(']');

        let startIdx = -1;
        let endIdx = -1;

        // Tentukan apakah output utamanya Object {} atau Array []
        if (firstBrace !== -1 && firstBracket !== -1) {
            // Jika ada keduanya, lihat mana yang muncul LEBIH DULU
            if (firstBrace < firstBracket) {
                startIdx = firstBrace; endIdx = lastBrace;
            } else {
                startIdx = firstBracket; endIdx = lastBracket;
            }
        } else if (firstBrace !== -1) {
            startIdx = firstBrace; endIdx = lastBrace;
        } else if (firstBracket !== -1) {
            startIdx = firstBracket; endIdx = lastBracket;
        }

        // Potong string hanya pada area yang mengandung format JSON
        if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
            jsonStr = jsonStr.substring(startIdx, endIdx + 1);
        }
    }

    // Skenario 3: Parsing dengan Proteksi dan Pembersihan (Sanitization)
    try {
        // AI sering melakukan kesalahan kecil: menaruh koma sebelum tutup kurung.
        // Regex ini akan menghapus koma berlebih tersebut (contoh: "data",} menjadi "data"} )
        jsonStr = jsonStr.replace(/,\s*([\]}])/g, '$1'); 
        
        // Hapus karakter kontrol yang tersembunyi (non-printable) jika AI berhalusinasi
        jsonStr = jsonStr.replace(/[\u0000-\u0019]+/g, ""); 

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Gagal parse JSON. Teks mentah setelah dibersihkan:", jsonStr);
        throw new Error("Format JSON dari AI terpotong atau rusak. Silakan coba klik 'Auto API' sekali lagi.");
    }
}

function extractVariablesFromRumusan(rumusanText) {
    if (!rumusanText) return '[VARIABEL KOSONG]';
    const variables = []; let isVarTable = false;
    rumusanText.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes('| Variabel |') || trimmed.includes('| Independen |') || trimmed.includes('| Dependen |')) isVarTable = true;
        if (isVarTable && trimmed.startsWith('|') && !trimmed.includes('|---') && !trimmed.includes('| Variabel |')) {
            const parts = trimmed.split('|');
            if (parts.length >= 3 && parts[2].trim()) variables.push(parts[2].trim());
        }
    });
    return variables.length > 0 ? variables.join(', ') : '[VARIABEL KOSONG]';
}

// ==========================================
// FITUR OTOMATISASI VIA API (BYOK)
// ==========================================

function openApiSettings() {
    document.getElementById('geminiApiKeyInput').value = AppState.geminiApiKey || '';
    document.getElementById('aiToneSelect').value = AppState.tone || 'akademis'; // Load gaya bahasa
    document.getElementById('apiSettingsModal').classList.remove('hidden');
}

function closeApiSettings() {
    document.getElementById('apiSettingsModal').classList.add('hidden');
}

function saveApiKey() {
    AppState.geminiApiKey = document.getElementById('geminiApiKeyInput').value.trim();
    AppState.tone = document.getElementById('aiToneSelect').value; // Save gaya bahasa
    saveStateToLocal();
    closeApiSettings();
    showCustomAlert('success', 'Tersimpan', 'API Key dan Gaya Bahasa AI berhasil diperbarui!');
}

function removeApiKey() {
    AppState.geminiApiKey = '';
    document.getElementById('geminiApiKeyInput').value = '';
    saveStateToLocal();
    closeApiSettings();
    showCustomAlert('success', 'Terhapus', 'API Key telah dihapus dari browser ini demi keamanan.');
}

async function generateWithAPI(promptId, targetTextareaId) {
    const apiKey = AppState.geminiApiKey;
    if (!apiKey) {
        showCustomAlert('warning', 'API Key Dibutuhkan', 'Harap masukkan API Key Gemini Anda terlebih dahulu.');
        openApiSettings();
        return;
    }
    
    if (promptId === 'step2-prompt') {
        let rawInput = document.getElementById('rawJournalInput').value.trim();
        if (!rawInput) {
            showCustomAlert('warning', 'Teks Jurnal Kosong', 'Harap paste teks dari file PDF jurnal ke dalam kotak input yang disediakan sebelum menekan tombol Auto API.');
            return;
        }

        const MAX_CHARS = 40000; 
        if (rawInput.length > MAX_CHARS) {
            showCustomAlert('warning', 'Teks Terlalu Panjang', `Teks jurnal Anda mencapai ${rawInput.length.toLocaleString()} karakter. Sistem memotong otomatis menjadi ${MAX_CHARS.toLocaleString()} karakter pertama agar API tidak error.`);
            rawInput = rawInput.substring(0, MAX_CHARS);
            document.getElementById('rawJournalInput').value = rawInput;
        }
    }

    const promptText = getDynamicPromptText(promptId, true); 
    const targetEl = document.getElementById(targetTextareaId);
    
    const originalVal = targetEl.value; 
    
    targetEl.value = "Menghubungkan ke satelit AI... Memulai streaming teks...";
    targetEl.disabled = true;
    targetEl.classList.add('bg-indigo-50', 'border-indigo-400');

    const isJsonExpected = promptId === 'step2-prompt' || promptId === 'step3-prompt' || promptId === 'step4-prompt';
    const genConfig = { temperature: 0.7 };
    
    if (isJsonExpected) {
        genConfig.responseMimeType = "application/json";
    }

    try {
        let maxRetries = 3;
        let attempt = 0;
        let response = null;

        while (attempt < maxRetries) {
            try {
                if (attempt > 0) targetEl.value = `Server Google sibuk. Mencoba ulang (Percobaan ${attempt + 1} dari ${maxRetries})...`;

                response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptText }] }],
                        generationConfig: genConfig 
                    })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error?.message || "Gagal menghubungi API Google.");
                }
                
                break; 
                
            } catch (err) {
                attempt++;
                console.warn(`Percobaan API ke-${attempt} gagal:`, err.message);
                if (attempt >= maxRetries || err.message.includes('API key') || err.message.includes('keamanan')) {
                    throw err; 
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        // --- 🌟 LOGIKA BARU: MEMBACA STREAMING (LEBIH AMAN & ROBUST) ---
        targetEl.value = ""; 
        if (window.mdeEditors && window.mdeEditors[targetTextareaId]) {
            window.mdeEditors[targetTextareaId].value("");
            window.mdeEditors[targetTextareaId].codemirror.setOption("readOnly", true); // Kunci editor saat AI mengetik
        } 
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            // PERBAIKAN: Pisahkan buffer baris demi baris (menangani \n maupun \r\n)
            const lines = buffer.split(/\r?\n/);
            
            // Simpan elemen terakhir (yang mungkin belum 1 baris utuh) kembali ke buffer
            buffer = lines.pop();
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.slice(6).trim();
                    
                    // Lewati jika kosong atau penanda selesai
                    if (!jsonStr || jsonStr === '[DONE]') continue;
                    
                    try {
                        const dataObj = JSON.parse(jsonStr);
                        if (dataObj.candidates && dataObj.candidates[0].content?.parts[0]?.text) {
                            const newText = dataObj.candidates[0].content.parts[0].text;
                            targetEl.value += newText;
                            
                            // 🌟 Inject teks ke dalam Visual Editor secara realtime
                            if (window.mdeEditors && window.mdeEditors[targetTextareaId]) {
                                const cm = window.mdeEditors[targetTextareaId].codemirror;
                                const doc = cm.getDoc();
                                doc.replaceRange(newText, {line: doc.lastLine(), ch: doc.getLine(doc.lastLine()).length});
                                cm.scrollTo(null, cm.getScrollInfo().height);
                            } else {
                                targetEl.scrollTop = targetEl.scrollHeight;
                            }
                        }
                    } catch (e) {
                        // Abaikan jika ada potongan JSON yang tidak utuh, biarkan stream lanjut
                    }
                }
            }
        }
        
        // Pemicu update word counter
        const event = new Event('input', { bubbles: true });
        targetEl.dispatchEvent(event);

        showCustomAlert('success', 'Generate Selesai!', 'Proses penyusunan teks oleh AI telah selesai.');
        
    } catch (error) {
        console.error("API Error Final:", error);
        targetEl.value = originalVal; 
        
        if (error.message.includes('API key')) {
            showCustomAlert('error', 'API Key Salah', 'API Key tidak valid atau kuota habis.');
            openApiSettings();
        } else {
            showCustomAlert('error', 'Gagal Generate', error.message);
        }
    } finally {
        targetEl.disabled = false;
        targetEl.classList.remove('bg-indigo-50', 'border-indigo-400');
        // Buka kembali kunci editor
        if (window.mdeEditors && window.mdeEditors[targetTextareaId]) {
            window.mdeEditors[targetTextareaId].codemirror.setOption("readOnly", false);
        }
    }
}

// MESIN PROMPT UTAMA
function getDynamicPromptText(elementId, isForAPI = false) {
    let text = document.getElementById(elementId).innerText;
    
    // AUTO-MEMORY INJECTION
    const currentKey = elementId.replace('prompt-', '');
    const sectionsList = typeof getActiveSections === 'function' ? getActiveSections() : [];
    const currentIndex = sectionsList.indexOf(currentKey);
    
    const exceptions = ['latar', 'mpendahuluan', 'jpendahuluan', 'slrpendahuluan', 'sdeskripsi', 'daftar', 'mdaftar', 'jdaftar', 'sdaftar', 'slrdaftar', 'jabstrak', 'slrabstrak'];

    let memoryText = "";
    if (currentIndex > 0 && !exceptions.includes(currentKey) && !elementId.includes('step')) {
        
        // --- LOGIKA PEMISAHAN MANUAL VS API ---
        const startIndex = isForAPI ? Math.max(0, currentIndex - 2) : 0;
        
        for (let i = startIndex; i < currentIndex; i++) {
            const secKey = sectionsList[i];
            let sectionText = AppState.proposalData[secKey];
            
            if (sectionText && sectionText.trim() !== '') {
                // Potong teks hanya jika diakses dari Auto API
                if (isForAPI && sectionText.length > 1500) {
                    sectionText = sectionText.substring(0, 1500) + "\n... [teks dipotong otomatis oleh sistem untuk efisiensi token API]";
                }
                memoryText += `\n\n--- BAB/BAGIAN: ${secKey.toUpperCase()} ---\n${sectionText}`;
            }
        }
    }

    if (memoryText !== "") {
        text = `=========================================\n🚨 INGATAN KONTEKS DRAF SAYA (WAJIB DIBACA DULU) 🚨\nAgar dokumen ini koheren dan logis, Anda WAJIB membaca draf bab-bab sebelumnya yang sudah saya tulis di bawah ini. Jawaban Anda saat ini HARUS menyambung secara logis dengan teks ini dan tidak boleh bertentangan:\n${memoryText}\n=========================================\n\n` + text;
    }  

    // REPLACEMENT MENGGUNAKAN CALLBACK
    if (elementId === 'step2-prompt') {
        const rawJournalEl = document.getElementById('rawJournalInput');
        const rawJournalText = rawJournalEl ? rawJournalEl.value.trim() : '';
        text = text.replace(/\[INSERT TEKS JURNAL DISINI\]/g, () => rawJournalText || '[PERINGATAN: TEKS JURNAL BELUM DIMASUKKAN]');
    }
    if (elementId === 'step3-prompt') {
        const allJournalsData = AppState.journals.map(j => j.raw).join('\n\n---\n\n');
        text = text.replace(/\[INSERT SEMUA DATA JURNAL DARI STEP 2\]/g, () => allJournalsData || '[PERINGATAN: DATA JURNAL KOSONG]');
    }
    if (elementId === 'step4-prompt') { 
        text = text.replace(/\[INSERT RESEARCH GAP DARI STEP 3\]/g, () => AppState.analysisData.raw || '[PERINGATAN: DATA ANALISIS KOSONG]'); 
    }

    const textLatar = AppState.proposalData.latar || AppState.proposalData.mpendahuluan || AppState.proposalData.jpendahuluan || AppState.proposalData.slrpendahuluan || '';
    text = text.replace(/\[KONTEKS_LATAR\]/g, () => textLatar);
    const textRumusan = AppState.proposalData.rumusan || ''; 
    text = text.replace(/\[KONTEKS_RUMUSAN\]/g, () => textRumusan);
    const textTeori = AppState.proposalData.landasan || AppState.proposalData.mpembahasan || '';
    text = text.replace(/\[KONTEKS_TEORI\]/g, () => textTeori);
    const textMetode = AppState.proposalData.metode || AppState.proposalData.jmetode || AppState.proposalData.slrmetode || '';
    text = text.replace(/\[KONTEKS_METODE\]/g, () => textMetode);
    const textHasil = (AppState.proposalData.sdeskripsi + '\n' + AppState.proposalData.sanalisis + '\n' + AppState.proposalData.spembahasan) || AppState.proposalData.jhasil || AppState.proposalData.slrhasil || '';
    text = text.replace(/\[KONTEKS_HASIL\]/g, () => textHasil);

    if (elementId.includes('daftar') || elementId.includes('abstrak')) {
        let fullDraft = "";
        Object.keys(AppState.proposalData).forEach(key => { 
            if (!key.includes('daftar') && !key.includes('abstrak') && AppState.proposalData[key]) {
                fullDraft += `\n\n--- BAGIAN ${key.toUpperCase()} ---\n${AppState.proposalData[key]}`; 
            }
        });
        
        // Proteksi API dari error batas maksimal token Google
        if (isForAPI && fullDraft.length > 35000) {
             fullDraft = fullDraft.substring(0, 35000) + "\n\n[... SEBAGIAN TEKS DIPOTONG KARENA BATAS MAKSIMAL API ...]";
        }
        
        text = text.replace(/\[DRAF_TULISAN\]/g, () => fullDraft || "[BELUM ADA TULISAN]");
    }

    text = text.replace(/\[JUDUL\]/g, () => AppState.selectedTitle || '[PERINGATAN: JUDUL BELUM DIPILIH]');
    text = text.replace(/\[DATA JURNAL\]/g, () => AppState.journals.map(j => j.raw).join('\n') || '[DATA JURNAL KOSONG]');
    
    const safeJurnalList = AppState.journals.map(j => {
        let t = j.parsed && j.parsed.title ? j.parsed.title : 'Judul';
        let a = j.parsed && j.parsed.authors ? j.parsed.authors : 'Penulis';
        let y = j.parsed && j.parsed.year ? j.parsed.year : 'Tahun';
        return `${t} (${a}, ${y})`;
    }).join('; ');
    text = text.replace(/\[DATA JURNAL YANG DIKAJI\]/g, () => safeJurnalList || '[DATA JURNAL KOSONG]');
    
    text = text.replace(/\[GAP\]/g, () => AppState.analysisData.raw || '[DATA GAP KOSONG]');
    text = text.replace(/\[VARIABEL\]/g, () => extractVariablesFromRumusan(AppState.proposalData.rumusan));
    
    if(AppState.proposalData.rumusan) text = text.replace(/\[RUMUSAN\]/g, () => AppState.proposalData.rumusan);
    if(AppState.proposalData.tujuan) text = text.replace(/\[TUJUAN\]/g, () => AppState.proposalData.tujuan);

    // HUMANIZER
    // HUMANIZER & TONE SETTING
    let toneInstruction = "Gunakan bahasa akademis yang sangat formal, objektif, baku, dan sesuai standar penulisan tugas akhir/jurnal ilmiah.";
    if (AppState.tone === 'populer') toneInstruction = "Gunakan bahasa semi-formal yang mengalir, mudah dipahami, dan tidak terlalu kaku, namun tetap menjaga substansi ilmiah.";
    if (AppState.tone === 'kritis') toneInstruction = "Gunakan gaya bahasa yang sangat kritis, analitis, dan tajam. Sering membandingkan pro dan kontra, serta memberikan evaluasi mendalam pada setiap argumen.";

    if (elementId.startsWith('prompt-')) {
        text += `\n\nATURAN NADA & GAYA BAHASA:\n- ${toneInstruction}\n\nATURAN ANTI-PLAGIASI & HUMANIZER:\n1. Tulis dengan gaya bahasa natural manusia (Human-like text).\n2. Tingkatkan variasi struktur kalimat (Burstiness) & kosa kata dinamis (Perplexity).\n3. HARAM menggunakan frasa AI klise: "Kesimpulannya", "Dalam era digital", "Secara keseluruhan".\n4. Lakukan parafrase tingkat tinggi agar lolos uji Turnitin < 5%.`;
    }
    
    return text;
}

function copyPromptText(elementId) {
    navigator.clipboard.writeText(getDynamicPromptText(elementId)).then(() => {
        const btn = document.querySelector(`[data-prompt-id="${elementId}"]`);
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            btn.classList.add('copy-success');
            setTimeout(() => { btn.innerHTML = originalHTML; btn.classList.remove('copy-success'); }, 2000);
        }
    }).catch(() => showCustomAlert('error', 'Gagal Copy', 'Silakan copy manual.'));
}

function openGeminiWithPrompt(promptId) {
    navigator.clipboard.writeText(getDynamicPromptText(promptId)).then(() => window.open('https://gemini.google.com', '_blank')).catch(() => { showCustomAlert('warning', 'Copy Gagal', 'Klik tombol Copy manual.'); window.open('https://gemini.google.com', '_blank'); });
}

function parseStep2Output() {
    const rawOutput = document.getElementById('geminiOutputStep2').value;
    if (!rawOutput.trim()) { showCustomAlert('warning', 'Kosong', 'Paste hasil dari Gemini!'); return; }
    
    try {
        let parsedData = extractJSON(rawOutput);
        
        // 🌟 PERBAIKAN 1: REKURSIF EKSTRAKTOR (ANTI [object Object])
        // Fungsi ini akan menyelam sedalam mungkin ke dalam Array/Object untuk menyedot teks aslinya
        const safeExtractString = (prop) => {
            if (prop === undefined || prop === null || prop === "") return null;
            if (typeof prop === 'string') return prop.trim();
            if (typeof prop === 'number' || typeof prop === 'boolean') return String(prop);
            
            // Jika AI mengirim Array (misal: list penulis atau list temuan)
            if (Array.isArray(prop)) {
                const arrStrings = prop.map(item => safeExtractString(item)).filter(Boolean);
                return arrStrings.length > 0 ? arrStrings.join(', ') : null;
            }
            
            // Jika AI mengirim Object bersarang (seperti "hasil_dan_pembahasan" di kasus Anda)
            if (typeof prop === 'object') {
                const objStrings = Object.values(prop).map(val => safeExtractString(val)).filter(Boolean);
                return objStrings.length > 0 ? objStrings.join(' ') : null;
            }
            
            return String(prop);
        };

        // 🌟 PERBAIKAN 2: DEEP HUNTER YANG LEBIH CERDAS
        const findKeyLike = (obj, keywords) => {
            if (!obj || typeof obj !== 'object') return null;
            
            let bestMatch = null;
            
            for (let key in obj) {
                let lowerKey = key.toLowerCase();
                if (keywords.some(kw => lowerKey.includes(kw))) {
                    const extracted = safeExtractString(obj[key]);
                    if (extracted) {
                        // Prioritaskan teks string langsung (seperti "simpulan") daripada objek raksasa ("hasil_dan_pembahasan")
                        if (typeof obj[key] === 'string') return extracted; 
                        if (!bestMatch) bestMatch = extracted; 
                    }
                }
            }
            
            if (bestMatch) return bestMatch;

            // Selami lebih dalam jika belum ketemu
            for (let key in obj) {
                if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
                    let found = findKeyLike(obj[key], keywords);
                    if (found) return found;
                }
            }
            return null;
        };

        let finalData = { judul: "", penulis: "", tahun: "", nama_jurnal: "", hasil_utama: "", research_gap: "" };
        const identitas = parsedData.identitas_jurnal || parsedData.metadata || parsedData.info || parsedData;

        // Ekstraksi Identitas
        finalData.judul = safeExtractString(identitas.judul_artikel) || safeExtractString(identitas.judul) || safeExtractString(identitas.title) || findKeyLike(parsedData, ['judul', 'title']) || "Judul Tidak Ditemukan";
        finalData.penulis = safeExtractString(identitas.penulis) || safeExtractString(identitas.authors) || findKeyLike(parsedData, ['penulis', 'author']) || "Penulis Tidak Ditemukan";
        finalData.tahun = safeExtractString(identitas.tahun) || safeExtractString(identitas.year) || findKeyLike(parsedData, ['tahun', 'year']) || "Tahun Tidak Ditemukan";
        finalData.nama_jurnal = safeExtractString(identitas.nama_jurnal) || safeExtractString(identitas.journal_name) || findKeyLike(parsedData, ['jurnal', 'journal']) || "-";
        
        // Ekstraksi Hasil dan Gap (Mencoba kunci langsung dulu, baru pakai Hunter)
        finalData.hasil_utama = safeExtractString(parsedData.simpulan) || safeExtractString(parsedData.hasil_utama) || findKeyLike(parsedData, ['hasil', 'simpulan', 'kesimpulan', 'temuan', 'result', 'conclusion', 'inti_sari']) || "-";
        finalData.research_gap = safeExtractString(parsedData.research_gap) || findKeyLike(parsedData, ['gap', 'kekurangan', 'keterbatasan', 'limit', 'saran', 'future', 'rekomendasi', 'kebaruan']) || "-";

        if (!finalData.judul || finalData.judul === "Judul Tidak Ditemukan") { 
            throw new Error("Sistem tidak dapat menemukan properti Judul dalam JSON."); 
        }
        
        const displayMarkdown = `**Judul**: ${finalData.judul}
**Penulis**: ${finalData.penulis} (${finalData.tahun})
**Jurnal**: ${finalData.nama_jurnal}
**Hasil Utama**: ${finalData.hasil_utama}
**Research Gap**: ${finalData.research_gap}`;

        AppState.journals.push({ 
            id: Date.now(), 
            raw: displayMarkdown, 
            parsed: { title: finalData.judul, authors: finalData.penulis, year: finalData.tahun },
            fullJson: parsedData 
        });
        
        saveStateToLocal();
        updateSavedJournalsList();
        
        document.getElementById('geminiOutputStep2').value = '';
        showCustomAlert('success', 'Berhasil', 'Data jurnal direkam secara adaptif!');
    } catch (error) { 
        console.error("JSON Parse Error:", error);
        showCustomAlert('error', 'Error Parsing JSON', 'Format teks JSON dari AI melenceng terlalu jauh. Silakan periksa kembali JSON-nya.'); 
    }
}

function updateSavedJournalsList() {
    const container = document.getElementById('savedJournalsList');
    if(!container) return;
    if (AppState.journals.length === 0) { container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada jurnal</p>'; return; }
    container.innerHTML = AppState.journals.map((j, index) => `<div class="bg-white border border-green-200 shadow-sm rounded-xl p-4 mb-4"><div class="flex justify-between items-center mb-3 pb-2 border-b border-gray-100"><h4 class="font-bold text-gray-800 text-lg">${index + 1}. ${j.parsed.title || 'Jurnal'}</h4><button onclick="removeJournal(${index})" class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><i class="fas fa-trash"></i></button></div><div class="text-sm max-h-60 overflow-y-auto custom-scrollbar">${renderMarkdownTable(j.raw)}</div></div>`).join('');
}

function removeJournal(index) { AppState.journals.splice(index, 1); saveStateToLocal(); updateSavedJournalsList(); }

function parseStep3Output() {
    const output = document.getElementById('geminiOutputStep3').value;
    if (!output.trim()) { showCustomAlert('warning', 'Kosong', 'Paste hasil Gemini!'); return; }
    
    try {
        const parsedData = extractJSON(output);
        
        // Buat Ringkasan Markdown untuk dimunculkan di UI dan dimasukkan ke Prompt Step 4
        let summaryText = "### Analisis Research Gap\n\n";
        
        if (parsedData.research_gap && parsedData.research_gap.length > 0) {
            parsedData.research_gap.forEach(gap => {
                summaryText += `- **${gap.kategori}**: ${gap.detail}\n`;
            });
        }
        summaryText += "\n### Peluang Pengembangan\n\n";
        if (parsedData.peluang_baru && parsedData.peluang_baru.length > 0) {
            parsedData.peluang_baru.forEach(peluang => {
                summaryText += `- **${peluang.kategori}**: ${peluang.detail}\n`;
            });
        }

        AppState.analysisData = { raw: summaryText, json: parsedData, timestamp: new Date() };
        saveStateToLocal();
        renderAnalysisSummaryPreview(); 
        
        document.getElementById('geminiOutputStep3').value = '';
        showCustomAlert('success', 'Berhasil', 'Analisis komparatif berhasil direkam!');
    } catch (error) {
        console.error("JSON Parse Error:", error);
        showCustomAlert('error', 'Error', 'Gagal memproses JSON Analisis.'); 
    }
}

function renderAnalysisSummaryPreview() {
    if(!AppState.analysisData.raw) return;
    const container = document.getElementById('analysisSummary');
    if(!container) return;

    // Menyulap karakter Markdown menjadi HTML yang cantik dengan Tailwind
    let cleanHTML = AppState.analysisData.raw;
    
    // 1. Ubah "### Teks" menjadi Judul Sub-bab
    cleanHTML = cleanHTML.replace(/###\s+(.*)/g, '<h5 class="font-bold text-lg text-indigo-600 dark:text-indigo-400 mt-4 mb-1">$1</h5>');
    
    // 2. Ubah "**Teks**" menjadi Huruf Tebal
    cleanHTML = cleanHTML.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-white">$1</strong>');
    
    // 3. Ubah "- " menjadi Bullet Point (•) yang rapi
    cleanHTML = cleanHTML.replace(/^- /gm, '<span class="text-purple-500 font-bold mr-2 text-lg leading-none">•</span>');
    
    // 4. Ubah enter menjadi baris baru HTML (<br>)
    cleanHTML = cleanHTML.replace(/\n/g, '<br>');

    // Merender ke layar
    container.innerHTML = `
        <div class="bg-white border-2 border-purple-200 shadow-sm rounded-xl p-5 dark:bg-gray-800 dark:border-purple-500/30">
            <div class="flex items-center mb-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <i class="fas fa-check-circle text-purple-600 dark:text-purple-400 mr-2 text-xl"></i>
                <h4 class="font-bold text-purple-800 dark:text-purple-300 text-lg">Analisis Direkam</h4>
            </div>
            <div class="max-h-96 overflow-y-auto custom-scrollbar text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-2">
                ${cleanHTML}
            </div>
        </div>`;
}

function parseStep4Output() {
    const output = document.getElementById('geminiOutputStep4').value;
    if (!output.trim()) { showCustomAlert('warning', 'Kosong', 'Paste hasil Gemini!'); return; }
    
    try {
        const jsonArray = extractJSON(output);
        
        if (!Array.isArray(jsonArray) || jsonArray.length === 0) { 
            throw new Error("Data JSON bukan berupa Array Judul");
        }
        
        // Mapping langsung ke State Array kita
        const titles = jsonArray.map((item, index) => ({
            no: item.no || (index + 1),
            title: item.judul || item.title || "Judul Tidak Diketahui"
        }));
        
        AppState.generatedTitles = titles; 
        saveStateToLocal();
        displayTitleSelection();
        
        document.getElementById('geminiOutputStep4').value = '';
        showCustomAlert('success', 'Berhasil', 'Daftar judul berhasil diekstrak!');
    } catch (error) { 
        console.error("JSON Parse Error:", error);
        showCustomAlert('error', 'Error Format', 'Gagal memproses JSON daftar judul.'); 
    }
}

function displayTitleSelection() {
    const container = document.getElementById('titleSelectionList');
    if(!container) return;
    if (AppState.generatedTitles.length === 0) { container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada judul</p>'; return; }
    container.innerHTML = AppState.generatedTitles.map((item, index) => {
        const cleanT = cleanMarkdown(item.title); const escT = cleanT.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        return `<div class="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 cursor-pointer transition-all card-hover title-card" data-title="${escT}" data-index="${index}"><div class="flex items-start"><div class="bg-yellow-100 text-yellow-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-lg">${item.no}</div><div class="flex-1"><h4 class="text-gray-800 text-lg mb-2 leading-snug">${cleanT}</h4></div></div></div>`;
    }).join('');
    
    document.querySelectorAll('.title-card').forEach(card => card.addEventListener('click', function() {
        selectTitleForProposal(this.getAttribute('data-title').replace(/<[^>]*>?/gm, ''), this);
    }));
}

function selectTitleForProposal(title, element) {
    const hasData = Object.values(AppState.proposalData).some(val => val && val.length > 10);
    const executeSwitch = () => {
        AppState.proposalData = { latar: '', rumusan: '', tujuan: '', manfaat: '', metode: '', landasan: '', hipotesis: '', jadwal: '', daftar: '', mpendahuluan: '', mpembahasan: '', mpenutup: '', mdaftar: '', jpendahuluan: '', jmetode: '', jhasil: '', jkesimpulan: '', jabstrak: '', jdaftar: '', sdeskripsi: '', sanalisis: '', spembahasan: '', skesimpulan: '', ssaran: '', sdaftar: '', slrpendahuluan: '', slrmetode: '', slrhasil: '', slrpembahasan: '', slrkesimpulan: '', slrabstrak: '', slrdaftar: '' };
        document.querySelectorAll('textarea[id^="output-"]').forEach(el => el.value = '');
        document.querySelectorAll('.title-card').forEach(div => { div.classList.remove('border-yellow-500', 'bg-yellow-50'); div.classList.add('border-gray-200'); });
        element.classList.remove('border-gray-200'); element.classList.add('border-yellow-500', 'bg-yellow-50');
        
        AppState.selectedTitle = title;
        saveStateToLocal(); 
        
        const stickyNav = document.querySelector('#step4 .sticky');
        if (stickyNav && !document.getElementById('btn-continue')) {
            const btn = document.createElement('button'); btn.id = 'btn-continue';
            btn.className = 'bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all';
            btn.innerHTML = `Lanjut Menyusun Dokumen <i class="fas fa-arrow-right ml-2"></i>`;
            btn.onclick = () => goToStep(5);
            stickyNav.appendChild(btn);
        }
        showCustomAlert('success', 'Direset', 'Siap menyusun untuk judul baru.');
    };
    if (hasData && AppState.selectedTitle && AppState.selectedTitle !== title) showWarningModal(executeSwitch); else executeSwitch();
}

function showProposalSection(section) {
    document.querySelectorAll('.proposal-section').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById('section-' + section);
    if(target) {
        target.classList.remove('hidden', 'animate-fade-in-up'); void target.offsetWidth; target.classList.add('animate-fade-in-up');
    }
    
    document.querySelectorAll('.proposal-nav-btn').forEach(btn => {
        btn.classList.remove('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
        if (!btn.classList.contains('bg-gradient-to-tr')) btn.classList.add('border-gray-200', 'bg-white', 'text-gray-600');
    });
    
    const sections = getActiveSections();
    let containerId = AppState.documentType === 'makalah' ? 'makalah-nav-buttons' : AppState.documentType === 'jurnal' ? 'jurnal-nav-buttons' : AppState.documentType === 'skripsi' ? 'skripsi-nav-buttons' : AppState.documentType === 'slr' ? 'slr-nav-buttons' : 'proposal-nav-buttons';
    
    const navBtns = document.querySelectorAll(`#${containerId} .proposal-nav-btn`);
    const navBtn = navBtns[sections.indexOf(section)];
    if (navBtn && !navBtn.classList.contains('bg-gradient-to-tr')) {
        navBtn.classList.remove('border-gray-200', 'bg-white', 'text-gray-600'); navBtn.classList.add('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
    }
    
    if (section === 'final') showFinalReview();
    else { const navC = document.getElementById(containerId); if(navC) window.scrollTo({top: navC.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth'}); }
}

function prevProposalSection(current) { const s = getActiveSections(); const i = s.indexOf(current); if (i > 0) showProposalSection(s[i - 1]); }

function saveProposalSection(section) {
    const content = document.getElementById('output-' + section).value;
    if (!content.trim() && section !== 'hipotesis') { showCustomAlert('warning', 'Kosong', 'Isi konten terlebih dahulu!'); return; }
    
    AppState.proposalData[section] = content;
    saveStateToLocal(); 
    
    const s = getActiveSections(); const i = s.indexOf(section);
    let cid = AppState.documentType === 'makalah' ? 'makalah-nav-buttons' : AppState.documentType === 'jurnal' ? 'jurnal-nav-buttons' : AppState.documentType === 'skripsi' ? 'skripsi-nav-buttons' : AppState.documentType === 'slr' ? 'slr-nav-buttons' : 'proposal-nav-buttons';
    const btn = document.querySelectorAll(`#${cid} .proposal-nav-btn`)[i]; if (btn) btn.classList.add('bg-green-50', 'border-green-500');
    
    // VISUAL FEEDBACK
    showCustomAlert('success', 'Tersimpan', `Bagian berhasil disimpan.`);
    
    if (i < s.length - 1) {
        setTimeout(() => { showProposalSection(s[i + 1]); }, 600);
    } else {
        setTimeout(() => { showFinalReview(); }, 600);
    }
}

function toggleHipotesis() {
    const cb = document.getElementById('skip-hipotesis'); const ta = document.getElementById('output-hipotesis');
    if(!cb || !ta) return;
    if (cb.checked) { ta.disabled = true; ta.placeholder = 'Dilewati'; AppState.proposalData.hipotesis = '(Penelitian kualitatif)'; } 
    else { ta.disabled = false; ta.placeholder = 'Paste teks...'; AppState.proposalData.hipotesis = ''; }
}

function showFinalReview() {
    document.querySelectorAll('.proposal-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('section-final').classList.remove('hidden');
    
    const formatContainer = document.getElementById('proposalFormatContainer');
    const btnStandard = document.getElementById('btnDownloadStandard');
    const btnJurnal = document.getElementById('btnDownloadJurnal');

    if (AppState.documentType === 'jurnal' || AppState.documentType === 'slr') {
        formatContainer.classList.add('hidden'); btnStandard.classList.add('hidden'); btnJurnal.classList.remove('hidden');
    } else if (AppState.documentType === 'skripsi' || AppState.documentType === 'makalah') {
        formatContainer.classList.add('hidden'); btnStandard.classList.remove('hidden'); btnJurnal.classList.add('hidden');
        btnStandard.innerHTML = `<i class="fas fa-file-word text-2xl mr-3"></i> Download ${AppState.documentType === 'skripsi' ? 'Skripsi' : 'Makalah'} (.docx)`;
    } else {
        formatContainer.classList.remove('hidden'); btnStandard.classList.remove('hidden'); btnJurnal.classList.add('hidden');
        btnStandard.innerHTML = `<i class="fas fa-file-word text-2xl mr-3"></i> Download Proposal (.docx)`;
    }
}

function downloadDOCX() {
    const formatChoice = document.getElementById('proposalFormat') ? document.getElementById('proposalFormat').value : 'bab';
    const paperSize = document.getElementById('settingPaper').value;
    const pageMargin = document.getElementById('settingMargin').value;
    const fontName = document.getElementById('settingFont').value;
    const lineSpacing = document.getElementById('settingSpacing').value;

    const styles = `
        <style>
            @page { size: ${paperSize}; margin: ${pageMargin}; } 
            body { font-family: ${fontName}; font-size: 12pt; color: #000; }
            
            /* Tipografi Paragraf Standar Akademik */
            p { 
                margin-top: 0; 
                margin-bottom: 10pt; 
                text-align: justify; 
                line-height: ${lineSpacing}; 
                text-justify: inter-ideograph;
            } 
            
            /* Indentasi paragraf normal (kecuali judul/tabel/list) */
            p.indent { text-indent: 1.25cm; }

            h1, h2, h3 { font-family: ${fontName}; color: #000; page-break-after: avoid; }
            h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 24pt; text-transform: uppercase; }
            h2 { font-size: 12pt; font-weight: bold; margin-top: 24pt; margin-bottom: 12pt; text-transform: uppercase; }
            h3 { font-size: 12pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; }
            
            .chapter-title { text-align: center; font-size: 12pt; font-weight: bold; margin-top: 24pt; margin-bottom: 24pt; text-transform: uppercase; page-break-after: avoid; }
            
            /* Tabel yang lebih rapi untuk Word */
            table { border-collapse: collapse; width: 100%; margin-top: 12pt; margin-bottom: 12pt; font-size: 11pt; }
            th, td { border: 1pt solid windowtext; padding: 6pt 8pt; vertical-align: top; text-align: left; }
            th { background-color: #e2e8f0; font-weight: bold; text-align: center; }
            td p { text-indent: 0; margin-bottom: 4pt; } 
            
            /* Halaman Sampul Eksklusif */
            .cover-page { text-align: center; margin-top: 120pt; page-break-after: always; }
            .cover-title { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-top: 40pt; margin-bottom: 80pt; line-height: 1.5; text-indent: 0; }
            .cover-author { margin-bottom: 100pt; font-size: 12pt; text-indent: 0; line-height: 1.5; font-weight: normal; }
            .cover-inst { font-size: 14pt; font-weight: bold; text-transform: uppercase; text-indent: 0; line-height: 1.5; }
            .page-break { page-break-before: always; }
            
            /* Perbaikan List (Bullet & Numbering) */
            .list-item { text-indent: -0.63cm; margin-left: 1.25cm; margin-bottom: 4pt; text-align: justify; }
            .biblio-item { text-indent: -1.25cm; margin-left: 1.25cm; margin-bottom: 10pt; text-align: justify; }

            /* Jurnal Khusus */
            .jurnal-title { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 12pt; text-transform: capitalize; line-height: 1.2; text-indent: 0;}
            .jurnal-author { font-size: 11pt; text-align: center; margin-bottom: 24pt; font-style: italic; text-indent: 0;}
            .jurnal-abstract { font-size: 10pt; text-align: justify; margin-left: 1.5cm; margin-right: 1.5cm; margin-bottom: 24pt; padding: 10pt; border-top: 1pt solid windowtext; border-bottom: 1pt solid windowtext; }
            .jurnal-abstract p { text-indent: 0; font-size: 10pt; margin-bottom: 6pt; line-height: 1.15; }
            .jurnal-body { column-count: 2; column-gap: 0.8cm; text-align: justify; }
        </style>
    `;

    function formatTextForWord(text) {
        if (!text) return '';
        let html = text.replace(/^(Tentu, berikut|Berikut adalah|Tentu saja|Ini dia|Baik, ini|Ini adalah).*?:?\n/mi, '').trim();
        
        // BERSIHKAN LINK MARKDOWN: Ubah [teks](url) menjadi teks biasa
        html = html.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" style="color: #0563C1; text-decoration: underline;">$1</a>');
        
        html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
        html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');

        const lines = html.split('\n');
        let result = ''; let inTable = false;

        lines.forEach(line => {
            let trimmed = line.trim();
            if (!trimmed) return;
            
            if (trimmed.startsWith('#')) {
                let headingLevel = trimmed.match(/^#+/)[0].length;
                let headingText = trimmed.replace(/^#+\s*/, '');
                result += `<h${headingLevel}>${headingText}</h${headingLevel}>`;
                return;
            }
            
            if (trimmed.startsWith('|') || trimmed.endsWith('|')) {
                if (trimmed.replace(/\s/g, '').match(/^\|?[-:|]+\|?$/)) return;
                let cells = trimmed.split('|').map(c => c.trim());
                if (cells[0] === '') cells.shift(); 
                if (cells[cells.length - 1] === '') cells.pop();
                if (!inTable && cells.length > 1) { result += '<table border="1">'; inTable = true; }
                if (inTable) {
                    let rowHtml = '<tr>';
                    cells.forEach(cell => {
                        let cleanCell = cell.replace(/<br\s*\/?>/gi, '<br/>'); 
                        if (result.endsWith('<table border="1">')) rowHtml += `<th>${cleanCell}</th>`;
                        else rowHtml += `<td>${cleanCell}</td>`;
                    });
                    rowHtml += '</tr>'; result += rowHtml;
                }
            } else {
                if (inTable) { result += '</table>'; inTable = false; }
                
                // PERBAIKAN: Deteksi Bullet Point asli (•)
                let orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
                let unorderedMatch = trimmed.match(/^[-*•]\s+(.*)/); 
                
                if (orderedMatch) { 
                    result += `<p class="list-item">${orderedMatch[1]}. ${orderedMatch[2]}</p>`; 
                } else if (unorderedMatch) { 
                    result += `<p class="list-item">&#8226; ${unorderedMatch[1]}</p>`; 
                } 
                // PERBAIKAN: Jika satu baris penuh ditebalkan (biasanya Sub-Judul), jangan beri indent
                else if (trimmed.startsWith('<b>') && trimmed.endsWith('</b>')) {
                    result += `<p style="margin-top:12pt; margin-bottom:4pt; text-indent:0;">${trimmed}</p>`;
                } 
                // Paragraf normal
                else { 
                    result += `<p class="indent">${trimmed}</p>`; 
                }
            }
        });
        if (inTable) result += '</table>'; return result;
    }

    let docContent = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Doc</title>${styles}</head><body>`;

    if (AppState.documentType === 'jurnal') {
        docContent += `<div class="jurnal-title">${AppState.selectedTitle || 'Judul Artikel Belum Dipilih'}</div>`;
        docContent += `<div class="jurnal-author">[Nama Penulis]<sup>1</sup>, [Nama Penulis 2]<sup>2</sup><br><sup>1,2</sup>Pontren Husnul Khotimah, Indonesia<br>Email: author@husnulkhotimah.ac.id</div>`;
        if (AppState.proposalData.jabstrak) docContent += `<div class="jurnal-abstract"><strong>Abstract — </strong>${formatTextForWord(AppState.proposalData.jabstrak)}</div>`;
        docContent += `<div class="jurnal-body">`;
        if(AppState.proposalData.jpendahuluan) docContent += `<h2>1. INTRODUCTION</h2>` + formatTextForWord(AppState.proposalData.jpendahuluan);
        if(AppState.proposalData.jmetode) docContent += `<h2>2. METHODS</h2>` + formatTextForWord(AppState.proposalData.jmetode);
        if(AppState.proposalData.jhasil) docContent += `<h2>3. RESULTS AND DISCUSSION</h2>` + formatTextForWord(AppState.proposalData.jhasil);
        if(AppState.proposalData.jkesimpulan) docContent += `<h2>4. CONCLUSION</h2>` + formatTextForWord(AppState.proposalData.jkesimpulan);
        if(AppState.proposalData.jdaftar) {
            docContent += `<h2>REFERENCES</h2>`;
            let sectionHtml = formatTextForWord(AppState.proposalData.jdaftar);
            docContent += sectionHtml.replace(/<p[^>]*>/g, '<p class="biblio-item">');
        }
        docContent += `</div>`;
    } 
    else if (AppState.documentType === 'slr') {
        docContent += `<div class="jurnal-title">${AppState.selectedTitle || 'Review Article Title'}</div>`;
        docContent += `<div class="jurnal-author">[Nama Reviewer]<sup>1</sup><br><sup>1</sup>Pontren Husnul Khotimah, Indonesia</div>`;
        if (AppState.proposalData.slrabstrak) docContent += `<div class="jurnal-abstract"><strong>Abstract — </strong>${formatTextForWord(AppState.proposalData.slrabstrak)}</div>`;
        docContent += `<div class="jurnal-body">`;
        if(AppState.proposalData.slrpendahuluan) docContent += `<h2>1. INTRODUCTION</h2>` + formatTextForWord(AppState.proposalData.slrpendahuluan);
        if(AppState.proposalData.slrmetode) docContent += `<h2>2. REVIEW METHODOLOGY</h2>` + formatTextForWord(AppState.proposalData.slrmetode);
        docContent += `</div>`; 
        if(AppState.proposalData.slrhasil) docContent += `<h2>3. DATA EXTRACTION RESULTS</h2>` + formatTextForWord(AppState.proposalData.slrhasil);
        docContent += `<div class="jurnal-body">`;
        if(AppState.proposalData.slrpembahasan) docContent += `<h2>4. DISCUSSION</h2>` + formatTextForWord(AppState.proposalData.slrpembahasan);
        if(AppState.proposalData.slrkesimpulan) docContent += `<h2>5. CONCLUSION</h2>` + formatTextForWord(AppState.proposalData.slrkesimpulan);
        if(AppState.proposalData.slrdaftar) {
            docContent += `<h2>REFERENCES</h2>`;
            let sectionHtml = formatTextForWord(AppState.proposalData.slrdaftar);
            docContent += sectionHtml.replace(/<p[^>]*>/g, '<p class="biblio-item">');
        }
        docContent += `</div>`;
    }
    else if (AppState.documentType === 'skripsi') {
        docContent += `<div class="cover-page"><h2>BAB IV DAN V SKRIPSI</h2><div class="cover-title">${AppState.selectedTitle || 'Judul Belum Dipilih'}</div><div class="cover-author">Disusun Oleh:<br><strong>[ NAMA MAHASISWA ]</strong></div><div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div></div>`;
        docContent += `<div class="chapter-title">BAB IV<br>HASIL PENELITIAN DAN PEMBAHASAN</div>`;
        if(AppState.proposalData.sdeskripsi) docContent += `<h3>4.1 Deskripsi Data Penelitian</h3>` + formatTextForWord(AppState.proposalData.sdeskripsi);
        if(AppState.proposalData.sanalisis) docContent += `<h3>4.2 Analisis Data dan Hasil Pengujian</h3>` + formatTextForWord(AppState.proposalData.sanalisis);
        if(AppState.proposalData.spembahasan) docContent += `<h3>4.3 Pembahasan Hasil Penelitian</h3>` + formatTextForWord(AppState.proposalData.spembahasan);
        docContent += `<div class="chapter-title page-break">BAB V<br>KESIMPULAN DAN SARAN</div>`;
        if(AppState.proposalData.skesimpulan) docContent += `<h3>5.1 Kesimpulan</h3>` + formatTextForWord(AppState.proposalData.skesimpulan);
        if(AppState.proposalData.ssaran) docContent += `<h3>5.2 Saran</h3>` + formatTextForWord(AppState.proposalData.ssaran);
        if(AppState.proposalData.sdaftar) {
            docContent += `<div class="chapter-title page-break">DAFTAR PUSTAKA</div>`;
            let sectionHtml = formatTextForWord(AppState.proposalData.sdaftar);
            docContent += sectionHtml.replace(/<p[^>]*>/g, '<p class="biblio-item">');
        }
    }
    else if (AppState.documentType === 'makalah') {
        docContent += `<div class="cover-page"><h2>MAKALAH AKADEMIK</h2><div class="cover-title">${AppState.selectedTitle || 'Judul Belum Dipilih'}</div><div class="cover-author">Disusun Oleh:<br><strong>[ NAMA PENULIS ]</strong></div><div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div></div>`;
        docContent += `<div class="chapter-title">BAB I<br>PENDAHULUAN</div>`;
        if(AppState.proposalData.mpendahuluan) docContent += formatTextForWord(AppState.proposalData.mpendahuluan);
        docContent += `<div class="chapter-title page-break">BAB II<br>PEMBAHASAN</div>`;
        if(AppState.proposalData.mpembahasan) docContent += formatTextForWord(AppState.proposalData.mpembahasan);
        docContent += `<div class="chapter-title page-break">BAB III<br>PENUTUP</div>`;
        if(AppState.proposalData.mpenutup) docContent += formatTextForWord(AppState.proposalData.mpenutup);
        if(AppState.proposalData.mdaftar) {
            docContent += `<div class="chapter-title page-break">DAFTAR PUSTAKA</div>`;
            let sectionHtml = formatTextForWord(AppState.proposalData.mdaftar);
            docContent += sectionHtml.replace(/<p[^>]*>/g, '<p class="biblio-item">');
        }
    }
    else {
        docContent += `<div class="cover-page"><h2>PROPOSAL PENELITIAN</h2><div class="cover-title">${AppState.selectedTitle || 'Judul Belum Dipilih'}</div><div class="cover-author">Disusun Oleh:<br><strong>[ NAMA PENELITI ]</strong></div><div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div></div>`;
        if (formatChoice === 'mini') {
            const sectionNames = { latar: 'A. Latar Belakang', rumusan: 'B. Rumusan Masalah', tujuan: 'C. Tujuan', manfaat: 'D. Manfaat', metode: 'E. Metode', landasan: 'F. Landasan Teori', hipotesis: 'G. Hipotesis', jadwal: 'H. Jadwal', daftar: 'I. Daftar Pustaka' };
            Object.keys(AppState.proposalData).forEach(function(key) {
                if (AppState.proposalData[key] && sectionNames[key]) {
                    let extraClass = (key === 'daftar') ? ' class="page-break"' : '';
                    docContent += `<h2${extraClass}>${sectionNames[key]}</h2>`;
                    let sectionHtml = formatTextForWord(AppState.proposalData[key]);
                    if (key === 'daftar') sectionHtml = sectionHtml.replace(/<p[^>]*>/g, '<p class="biblio-item">');
                    docContent += sectionHtml;
                }
            });
        } else {
            docContent += `<div class="chapter-title">BAB I<br>PENDAHULUAN</div>`;
            if(AppState.proposalData.latar) docContent += `<h3>1.1 Latar Belakang Masalah</h3>` + formatTextForWord(AppState.proposalData.latar);
            if(AppState.proposalData.rumusan) docContent += `<h3>1.2 Rumusan Masalah</h3>` + formatTextForWord(AppState.proposalData.rumusan);
            if(AppState.proposalData.tujuan) docContent += `<h3>1.3 Tujuan Penelitian</h3>` + formatTextForWord(AppState.proposalData.tujuan);
            if(AppState.proposalData.manfaat) docContent += `<h3>1.4 Manfaat Penelitian</h3>` + formatTextForWord(AppState.proposalData.manfaat);
            docContent += `<div class="chapter-title page-break">BAB II<br>TINJAUAN PUSTAKA</div>`;
            if(AppState.proposalData.landasan) docContent += `<h3>2.1 Landasan Teori dan Penelitian Terdahulu</h3>` + formatTextForWord(AppState.proposalData.landasan);
            if(AppState.proposalData.hipotesis) docContent += `<h3>2.2 Hipotesis Penelitian</h3>` + formatTextForWord(AppState.proposalData.hipotesis);
            docContent += `<div class="chapter-title page-break">BAB III<br>METODE PENELITIAN</div>`;
            if(AppState.proposalData.metode) docContent += `<h3>3.1 Desain dan Pendekatan Penelitian</h3>` + formatTextForWord(AppState.proposalData.metode);
            if(AppState.proposalData.jadwal) docContent += `<h3>3.2 Jadwal dan Anggaran</h3>` + formatTextForWord(AppState.proposalData.jadwal);
            if(AppState.proposalData.daftar) {
                docContent += `<div class="chapter-title page-break">DAFTAR PUSTAKA</div>`;
                let sectionHtml = formatTextForWord(AppState.proposalData.daftar);
                docContent += sectionHtml.replace(/<p[^>]*>/g, '<p class="biblio-item">');
            }
        }
    }

    docContent += '</body></html>';

    if (typeof htmlDocx !== 'undefined') {
        const converted = htmlDocx.asBlob(docContent);
        const url = URL.createObjectURL(converted);
        const a = document.createElement('a'); a.href = url;
        let safeFilename = AppState.selectedTitle ? AppState.selectedTitle.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') : 'Dokumen';
        a.download = `${AppState.documentType.toUpperCase()}_${safeFilename}.docx`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } else {
        const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `${AppState.documentType.toUpperCase()}_Dokumen.doc`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    }
}

// ==========================================
// 🌟 FITUR BARU: EKSTRAKSI TEKS DARI PDF MENGGUNAKAN PDF.JS
// ==========================================

async function extractTextFromPDF(event) {
    const file = event.target.files[0];
    if (!file) return;

    const textarea = document.getElementById('rawJournalInput');
    
    // UI Feedback: Beritahu pengguna sistem sedang bekerja
    textarea.value = "Membaca file PDF... Sedang mengekstrak teks halaman demi halaman... Mohon tunggu...";
    textarea.disabled = true;
    textarea.classList.add('animate-pulse', 'bg-red-50/50'); // Efek kedap-kedip
    
    try {
        // Ubah file menjadi format biner yang bisa dibaca PDF.js
        const arrayBuffer = await file.arrayBuffer();
        
        // Load dokumen PDF
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = "";

        // Looping untuk membaca setiap halaman satu per satu
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            
            // Gabungkan setiap potongan teks di halaman tersebut
            const pageText = textContent.items.map(item => item.str).join(" ");
            
            // Tambahkan ke string utama dengan penanda halaman
            fullText += `\n\n--- Halaman ${pageNum} ---\n${pageText}`;
        }

        // Tampilkan hasilnya di dalam kotak teks
        textarea.value = fullText.trim();
        
        showCustomAlert('success', 'Ekstraksi Selesai', `Berhasil mengekstrak ${pdf.numPages} halaman dari file PDF. Silakan klik "Auto API" untuk mulai mengkaji.`);
        
    } catch (error) {
        console.error("PDF Extraction Error:", error);
        textarea.value = ""; // Kosongkan lagi jika gagal
        showCustomAlert('error', 'Gagal Membaca PDF', 'Dokumen PDF mungkin diproteksi password, rusak, atau merupakan hasil scan (berupa gambar tanpa teks). Silakan copy-paste manual.');
    } finally {
        // Kembalikan kotak teks ke kondisi normal
        textarea.disabled = false;
        textarea.classList.remove('animate-pulse', 'bg-red-50/50');
        
        // Reset input file agar pengguna bisa mengunggah file yang sama lagi jika perlu
        event.target.value = '';
    }
}

// ==========================================
// 🌟 FITUR BARU: MICRO-EDITING (RTE)
// ==========================================
async function handleMicroEdit(sectionId, action) {
    const editor = window.mdeEditors[`output-${sectionId}`];
    if (!editor) return;

    const cm = editor.codemirror;
    const selectedText = cm.getSelection();

    if (!selectedText || selectedText.trim() === '') {
        showCustomAlert('warning', 'Pilih Teks Dulu', 'Silakan blok (highlight) kalimat atau paragraf di dalam editor yang ingin diedit oleh AI.');
        return;
    }

    const apiKey = AppState.geminiApiKey;
    if (!apiKey) {
        showCustomAlert('warning', 'API Key Dibutuhkan', 'Harap masukkan API Key Gemini Anda di pengaturan.');
        openApiSettings();
        return;
    }

    let promptText = "";
    let actionLabel = "";
    if (action === 'perpanjang') {
        actionLabel = "Memperpanjang teks...";
        promptText = `Kembangkan dan perpanjang teks berikut agar lebih detail, mendalam, dan komprehensif secara akademis. Pertahankan konteks aslinya.\n\nTeks Asli:\n"${selectedText}"\n\nATURAN MUTLAK: Hanya berikan teks hasil pengembangannya saja tanpa kata pengantar/penutup.`;
    } else if (action === 'perbaiki') {
        actionLabel = "Memperbaiki tata bahasa...";
        promptText = `Perbaiki tata bahasa, ejaan (PUEBI), dan struktur kalimat pada teks berikut agar menjadi bahasa akademis yang baku dan profesional.\n\nTeks Asli:\n"${selectedText}"\n\nATURAN MUTLAK: Hanya berikan teks hasil perbaikannya saja tanpa kata pengantar/penutup.`;
    } else if (action === 'parafrase') {
        actionLabel = "Memparafrase teks...";
        promptText = `Lakukan parafrase tingkat tinggi pada teks berikut untuk menghindari plagiasi (Turnitin) namun tetap menjaga makna, substansi, dan sitasi aslinya.\n\nTeks Asli:\n"${selectedText}"\n\nATURAN MUTLAK: Hanya berikan teks hasil parafrase saja tanpa kata pengantar/penutup.`;
    }

    cm.setOption("readOnly", true); // Kunci editor sementara
    
    // Beri penanda visual bahwa AI sedang bekerja di teks yang diblok
    const marker = `[⏳ AI sedang ${actionLabel}]`;
    cm.replaceSelection(marker);
    
    // Pilih kembali (highlight) teks marker tersebut agar nanti tertimpa oleh jawaban AI
    const endCursor = cm.getCursor();
    cm.setSelection({line: endCursor.line, ch: endCursor.ch - marker.length}, endCursor);

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });

        if (!response.ok) throw new Error("Gagal menghubungi API Google.");

        // Hapus marker loading
        cm.replaceSelection(""); 

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop();
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonStr = line.slice(6).trim();
                    if (!jsonStr || jsonStr === '[DONE]') continue;
                    try {
                        const dataObj = JSON.parse(jsonStr);
                        if (dataObj.candidates && dataObj.candidates[0].content?.parts[0]?.text) {
                            // Ketik teks baru persis di titik kursor
                            cm.replaceSelection(dataObj.candidates[0].content.parts[0].text);
                        }
                    } catch (e) {}
                }
            }
        }
        showCustomAlert('success', 'Berhasil', 'Teks berhasil diedit oleh AI.');
    } catch (error) {
        console.error("Micro-edit error:", error);
        cm.replaceSelection(selectedText); // Kembalikan ke teks asli jika error
        showCustomAlert('error', 'Gagal Edit', 'Terjadi kesalahan saat memproses API.');
    } finally {
        cm.setOption("readOnly", false); // Buka kunci editor
        document.getElementById(`output-${sectionId}`).value = cm.getValue(); // Sinkronisasi state
    }
}