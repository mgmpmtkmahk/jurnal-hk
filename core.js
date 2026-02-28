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
            { 
                name: 'Google Scholar', 
                url: 'https://scholar.google.com/scholar?q=filetype:pdf ' + encodeURIComponent(keyword), 
                icon: 'fa-graduation-cap', 
                color: 'blue' 
            },
            { 
                name: 'IEEE Xplore', 
                url: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=' + encodeURIComponent(keyword), 
                icon: 'fa-microchip', 
                color: 'purple' 
            },
            { 
                name: 'ScienceDirect', 
                url: 'https://www.sciencedirect.com/', 
                icon: 'fa-atom', 
                color: 'orange' 
            },
            { 
                name: 'DOAJ', 
                url: 'https://doaj.org/search/articles?ref=homepage-box&source=' + encodeURIComponent('{"query":{"query_string":{"query":"' + keyword + '"}}}'), 
                icon: 'fa-unlock-alt', 
                color: 'teal' 
            },
            { 
                name: 'Scopus', 
                url: 'https://www.scopus.com/sources', 
                icon: 'fa-search', 
                color: 'orange'
            },
            { 
                name: 'Web of Science', 
                url: 'https://mjl.clarivate.com/home', 
                icon: 'fa-network-wired', 
                color: 'yellow'
            }
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

window.toggleApiProvider = function() {
    const provider = document.getElementById('aiProviderSelect').value;
    const pSelect = document.getElementById('aiProviderSelect');
    
    document.getElementById('geminiInputGroup').classList.add('hidden');
    document.getElementById('mistralInputGroup').classList.add('hidden');
    document.getElementById('groqInputGroup').classList.add('hidden');

    if (provider === 'mistral') {
        document.getElementById('mistralInputGroup').classList.remove('hidden');
        pSelect.className = "w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 outline-none text-sm font-bold text-purple-700 bg-purple-50";
    } else if (provider === 'groq') {
        document.getElementById('groqInputGroup').classList.remove('hidden');
        pSelect.className = "w-full p-3 border-2 border-gray-200 rounded-xl focus:border-red-500 outline-none text-sm font-bold text-red-700 bg-red-50";
    } else {
        document.getElementById('geminiInputGroup').classList.remove('hidden');
        pSelect.className = "w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-bold text-indigo-700 bg-indigo-50";
    }
};

window.openApiSettings = function() {
    // 1. Cek apakah ada key terenkripsi, TAPI memori sementaranya kosong (Berarti terkunci)
    if ((AppState._encryptedGeminiKey || AppState._encryptedMistralKey) && 
        (!AppState._tempGeminiKey && !AppState._tempMistralKey)) {
        
        if (typeof showUnlockModal === 'function') {
            showUnlockModal(); // Minta PIN dulu
            return; // Berhenti di sini, jangan buka modal pengaturan
        }
    }

    // 2. Jika tidak terkunci, buka modal pengaturan dan isi datanya
    const geminiInput = document.getElementById('geminiApiKeyInput');
    if (geminiInput) geminiInput.value = AppState._tempGeminiKey || '';
    
    const mistralInput = document.getElementById('mistralApiKeyInput');
    if (mistralInput) mistralInput.value = AppState._tempMistralKey || '';
    
    const toneSelect = document.getElementById('aiToneSelect');
    if (toneSelect) toneSelect.value = AppState.tone || 'akademis';
    
    const providerSelect = document.getElementById('aiProviderSelect');
    if (providerSelect) providerSelect.value = AppState.aiProvider || 'gemini';
    
    const geminiModelSelect = document.getElementById('geminiModelSelect');
    if (geminiModelSelect) geminiModelSelect.value = AppState.geminiModel || 'gemini-2.5-flash';

    const mistralModel = document.getElementById('mistralModelSelect');
    if (mistralModel) mistralModel.value = AppState.mistralModel || 'mistral-large-latest';
    
    // Pastikan input PIN dikosongkan agar user tidak bingung
    const pinInput = document.getElementById('apiPinInput');
    if (pinInput) pinInput.value = '';
    
    if (typeof toggleApiProvider === 'function') toggleApiProvider(); 
    
    const modal = document.getElementById('apiSettingsModal');
    if (modal) modal.classList.remove('hidden');
};

function closeApiSettings() {
    document.getElementById('apiSettingsModal').classList.add('hidden');
}

async function saveApiKey() {
    const gemini = document.getElementById('geminiApiKeyInput').value.trim();
    const mistral = document.getElementById('mistralApiKeyInput').value.trim();
    const groqEl = document.getElementById('groqApiKeyInput');
    const groq = groqEl ? groqEl.value.trim() : '';
    const pin = document.getElementById('apiPinInput').value.trim();
    
    if ((gemini || mistral || groq) && !pin) {
        showCustomAlert('warning', 'PIN Diperlukan', 'Harap buat PIN keamanan (wajib) untuk mengenkripsi API Key Anda.');
        return;
    }

    AppState.tone = document.getElementById('aiToneSelect').value;
    AppState.aiProvider = document.getElementById('aiProviderSelect').value;
    
    if(document.getElementById('geminiModelSelect')) AppState.geminiModel = document.getElementById('geminiModelSelect').value;
    if(document.getElementById('mistralModelSelect')) AppState.mistralModel = document.getElementById('mistralModelSelect').value;
    if(document.getElementById('groqModelSelect')) AppState.groqModel = document.getElementById('groqModelSelect').value;
    
    // PERBAIKAN URUTAN: (gemini, mistral, groq, pin)
    await AppState.setAndEncryptKeys(gemini, mistral, groq, pin);
    await saveStateToLocal();
    
    closeApiSettings();
    showCustomAlert('success', 'Tersimpan', `Pengaturan AI diperbarui. Provider saat ini: ${AppState.aiProvider.toUpperCase()}`);
}

async function removeApiKey() {
    // PERBAIKAN URUTAN: 4 Parameter Kosong
    await AppState.setAndEncryptKeys('', '', '', ''); 
    
    document.getElementById('geminiApiKeyInput').value = '';
    document.getElementById('mistralApiKeyInput').value = '';
    if(document.getElementById('groqApiKeyInput')) document.getElementById('groqApiKeyInput').value = '';
    document.getElementById('apiPinInput').value = '';
    
    await saveStateToLocal();
    closeApiSettings();
    
    const unlockModal = document.getElementById('unlockModal');
    if (unlockModal) unlockModal.remove();
    
    showCustomAlert('success', 'Terhapus', 'Semua API Key telah dihapus dari sistem dengan aman.');
}

// ==========================================
// 🌟 FUNGSI GENERATE MULTI-PROVIDER (GEMINI, MISTRAL, GROQ)
// ==========================================
async function generateWithAPI(promptId, targetTextareaId) {
    const provider = AppState.aiProvider || 'gemini';
    
    // Langsung ambil kunci yang ter-dekripsi dari memori aktif
    let apiKey = AppState.getActiveApiKey(); 
    
    if (!apiKey) {
        // Cek apakah sebenarnya ada key yang tersimpan, tapi sedang terkunci (belum masukin PIN)
        if (provider === 'gemini' && AppState._encryptedGeminiKey) { showUnlockModal(); return; }
        if (provider === 'mistral' && AppState._encryptedMistralKey) { showUnlockModal(); return; }
        if (provider === 'groq' && AppState._encryptedGroqKey) { showUnlockModal(); return; }
        
        showCustomAlert('warning', 'API Key Dibutuhkan', `Harap masukkan API Key ${provider.toUpperCase()} Anda di pengaturan (Ikon Kunci).`);
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
    
    targetEl.value = `Menghubungkan ke satelit ${provider.toUpperCase()}... Memulai streaming teks...`;
    targetEl.disabled = true;
    targetEl.classList.add('bg-indigo-50', 'border-indigo-400');

    const isJsonExpected = promptId === 'step2-prompt' || promptId === 'step3-prompt' || promptId === 'step4-prompt';

    try {
        let endpoint, options;

        // 🚀 ROUTING BERDASARKAN PROVIDER
        if (provider === 'gemini') {
            const gModel = AppState.geminiModel || 'gemini-2.5-flash';
            endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
            const genConfig = { temperature: 0.7 };
            if (isJsonExpected) genConfig.responseMimeType = "application/json";

            options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: promptText }] }],
                    generationConfig: genConfig 
                })
            };
        } else if (provider === 'mistral') {
            endpoint = `https://api.mistral.ai/v1/chat/completions`;
            const reqBody = {
                model: AppState.mistralModel || 'mistral-large-latest',
                messages: [{ role: 'user', content: promptText }],
                temperature: 0.7,
                stream: true
            };
            if (isJsonExpected) reqBody.response_format = { type: "json_object" };

            options = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream',
                    'Authorization': `Bearer ${apiKey}` 
                },
                body: JSON.stringify(reqBody)
            };
        } else if (provider === 'groq') {
            endpoint = `https://api.groq.com/openai/v1/chat/completions`;
            const reqBody = {
                model: AppState.groqModel || 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: promptText }],
                temperature: 0.7,
                stream: true
            };
            if (isJsonExpected) reqBody.response_format = { type: "json_object" };

            options = {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}` 
                },
                body: JSON.stringify(reqBody)
            };
        }

        const response = await fetch(endpoint, options);

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || errData.message || `Gagal menghubungi API ${provider}`);
        }

        targetEl.value = ""; 
        if (window.mdeEditors && window.mdeEditors[targetTextareaId]) {
            window.mdeEditors[targetTextareaId].value("");
            window.mdeEditors[targetTextareaId].codemirror.setOption("readOnly", true);
        } 
        
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
                        let newText = "";

                        // 🔍 PARSING STREAMING GEMINI VS MISTRAL VS GROQ
                        if (provider === 'gemini' && dataObj.candidates && dataObj.candidates[0].content?.parts[0]?.text) {
                            newText = dataObj.candidates[0].content.parts[0].text;
                        } else if ((provider === 'mistral' || provider === 'groq') && dataObj.choices && dataObj.choices[0].delta?.content) {
                            newText = dataObj.choices[0].delta.content;
                        }

                        if (newText) {
                            targetEl.value += newText;
                            if (window.mdeEditors && window.mdeEditors[targetTextareaId]) {
                                const cm = window.mdeEditors[targetTextareaId].codemirror;
                                const doc = cm.getDoc();
                                doc.replaceRange(newText, {line: doc.lastLine(), ch: doc.getLine(doc.lastLine()).length});
                                cm.scrollTo(null, cm.getScrollInfo().height);
                            } else {
                                targetEl.scrollTop = targetEl.scrollHeight;
                            }
                        }
                    } catch (e) {}
                }
            }
        }
        
        const event = new Event('input', { bubbles: true });
        targetEl.dispatchEvent(event);
        showCustomAlert('success', 'Generate Selesai!', `AI ${provider.toUpperCase()} berhasil menyusun teks.`);
        
    } catch (error) {
        console.error("API Error Final:", error);
        targetEl.value = originalVal; 
        
        if (typeof ErrorHandler !== 'undefined') {
            ErrorHandler.show(error);
        } else {
            showCustomAlert('error', 'Gagal Generate', error.message);
        }
    } finally {
        targetEl.disabled = false;
        targetEl.classList.remove('bg-indigo-50', 'border-indigo-400');
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
    
    const exceptions = ['latar', 'mpendahuluan', 'jpendahuluan', 'slrpendahuluan', 'rpendahuluan', 'sdeskripsi', 'daftar', 'mdaftar', 'jdaftar', 'sdaftar', 'slrdaftar', 'jabstrak', 'slrabstrak'];

    let memoryText = "";
    if (currentIndex > 0 && !exceptions.includes(currentKey) && !elementId.includes('step')) {
        
        // --- LOGIKA PEMISAHAN MANUAL VS API ---
        const startIndex = isForAPI ? Math.max(0, currentIndex - 2) : 0;
        
        for (let i = startIndex; i < currentIndex; i++) {
            const secKey = sectionsList[i];
            let sectionText = AppState.proposalData[secKey];
            
            if (sectionText && sectionText.trim() !== '') {
                if (sectionText.length > 1500) {
                    sectionText = sectionText.substring(0, 1500) + "\n... [teks dipotong otomatis oleh sistem untuk efisiensi]";
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
        
        if (fullDraft.length > 35000) {
             fullDraft = fullDraft.substring(0, 35000) + "\n\n[... SEBAGIAN TEKS DIPOTONG KARENA BATAS MAKSIMAL ...]";
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

    // =========================================================
    // 1. ATURAN SITASI GLOBAL (HIBRIDA VS KETAT)
    // =========================================================
    // Pastikan aturan ini HANYA ditambahkan pada prompt Langkah 5 (yang diawali 'prompt-')
    if (elementId.startsWith('prompt-')) {
        let citationRule = "";
        if (AppState.documentType === 'slr') {
            citationRule = "ATURAN SITASI MUTLAK: Anda HANYA BOLEH menggunakan sitasi dari Referensi Jurnal yang dilampirkan. DILARANG KERAS menambahkan referensi eksternal dari luar untuk menjaga keabsahan metodologi SLR.";
        } else {
            citationRule = "ATURAN SITASI HIBRIDA: Jadikan Referensi Jurnal yang dilampirkan sebagai rujukan wajib. Namun, Anda SANGAT DIWAJIBKAN untuk MENAMBAHKAN teori, buku, atau sitasi jurnal eksternal lain secara mandiri yang valid dan relevan untuk memperkaya pembahasan. Jangan membatasi diri hanya pada referensi yang dilampirkan.";
        }
        text += "\n\n" + citationRule;

        // =========================================================
        // 2. ATURAN KHUSUS DAFTAR PUSTAKA (PENGUMPULAN SITASI)
        // =========================================================
        if (elementId.includes('daftar')) {
            text += "\n\nINSTRUKSI KHUSUS DAFTAR PUSTAKA: Baca seluruh memori teks bab sebelumnya. Kumpulkan SEMUA sitasi yang telah Anda tulis (baik dari rujukan wajib maupun referensi eksternal tambahan yang Anda masukkan sendiri). Susun semuanya menjadi Daftar Pustaka berformat APA 7th Style secara alfabetis.";
        }
    }

    // =========================================================
    // 3. HUMANIZER & TONE SETTING
    // =========================================================
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

function exportToRIS() {
    if (!AppState.journals || AppState.journals.length === 0) {
        showCustomAlert('warning', 'Kosong', 'Belum ada data jurnal tersimpan.');
        return;
    }
    let risContent = "";
    AppState.journals.forEach(j => {
        risContent += "TY  - JOUR\r\n";
        risContent += `TI  - ${j.parsed?.title || 'Untitled'}\r\n`;
        risContent += `AU  - ${j.parsed?.authors || 'Unknown'}\r\n`;
        if (j.parsed?.year) risContent += `PY  - ${j.parsed.year}\r\n`;
        if (j.fullJson?.nama_jurnal) risContent += `T2  - ${j.fullJson.nama_jurnal}\r\n`;
        if (j.fullJson?.hasil_utama) risContent += `AB  - Hasil: ${j.fullJson.hasil_utama} | Gap: ${j.fullJson.research_gap || ''}\r\n`;
        risContent += "ER  - \r\n\r\n";
    });
    
    const blob = new Blob([risContent], { type: 'application/x-research-info-systems' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `Referensi_Penelitian_${new Date().getFullYear()}.ris`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    showCustomAlert('success', 'Berhasil', 'File .RIS berhasil diunduh. Silakan import ke Mendeley atau Zotero Anda.');
}

function updateSavedJournalsList() {
    const container = document.getElementById('savedJournalsList');
    if(!container) return;
    
    // Injeksi tombol Export RIS di Header
    const headerContainer = container.previousElementSibling; 
    if (headerContainer && !document.getElementById('btn-export-ris')) {
        headerContainer.classList.add('flex', 'justify-between', 'items-center');
        headerContainer.innerHTML = `Data Jurnal Tersimpan <button id="btn-export-ris" onclick="exportToRIS()" class="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-lg hover:bg-blue-200 transition-all shadow-sm"><i class="fas fa-file-export mr-2"></i>Export .RIS (Mendeley)</button>`;
    }

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
        
        // Mapping langsung ke State Array kita (+ PENAMBAHAN ALASAN)
        const titles = jsonArray.map((item, index) => ({
            no: item.no || (index + 1),
            title: item.judul || item.title || "Judul Tidak Diketahui",
            alasan: item.alasan || item.reason || "Direkomendasikan berdasarkan research gap dari literatur sebelumnya."
        }));
        
        AppState.generatedTitles = titles; 
        saveStateToLocal();
        displayTitleSelection();
        
        document.getElementById('geminiOutputStep4').value = '';
        showCustomAlert('success', 'Berhasil', 'Daftar judul beserta alasannya berhasil diekstrak!');
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
        const cleanT = cleanMarkdown(item.title); 
        const escT = cleanT.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const alasanText = item.alasan ? cleanMarkdown(item.alasan) : '';
        
        return `
        <div class="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 cursor-pointer transition-all card-hover title-card group" data-title="${escT}" data-index="${index}">
            <div class="flex items-start">
                <div class="bg-yellow-100 text-yellow-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-lg shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                    ${item.no}
                </div>
                <div class="flex-1">
                    <h4 class="text-gray-800 font-bold text-lg mb-2 leading-snug group-hover:text-yellow-700 transition-colors">${cleanT}</h4>
                    
                    <div class="mt-3 bg-yellow-50/50 p-3 rounded-lg border border-yellow-100/50">
                        <p class="text-sm text-gray-600 leading-relaxed"><i class="fas fa-lightbulb text-yellow-500 mr-2"></i><strong>Alasan:</strong> ${alasanText}</p>
                    </div>
                </div>
                
                <div class="ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center h-full pt-2">
                    <span class="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-yellow-200 shadow-sm">Pilih <i class="fas fa-check ml-1"></i></span>
                </div>
            </div>
        </div>`;
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

// ==========================================
// FITUR EKSPOR DAFTAR PUSTAKA FINAL KE MENDELEY (.RIS)
// ==========================================
function exportFinalRISToMendeley(sectionId) {
    const editor = window.mdeEditors[`output-${sectionId}`];
    if (!editor) return;

    const text = editor.value();
    if (!text || text.trim() === '') {
        showCustomAlert('warning', 'Teks Kosong', 'Daftar pustaka masih kosong. Generate dan simpan teks dari AI terlebih dahulu.');
        return;
    }

    // Pisahkan per baris/paragraf, dan bersihkan teks kosong
    const lines = text.split('\n').filter(line => line.trim().length > 10);
    let risContent = "";

    lines.forEach(line => {
        // Hapus penomoran atau bullet jika ada
        let cleanLine = line.trim().replace(/^-\s*/, '').replace(/^\d+\.\s*/, ''); 
        // Hapus syntax bold/italic dari Markdown
        cleanLine = cleanLine.replace(/\*\*/g, '').replace(/\*/g, ''); 
        
        // 1. Ekstrak Tahun (Cari angka 4 digit di dalam kurung)
        let yearMatch = cleanLine.match(/\((\d{4})\)/);
        let year = yearMatch ? yearMatch[1] : '';
        
        // 2. Pisahkan Author dan sisanya menggunakan patokan (Tahun).
        let partsByYear = cleanLine.split(/\(\d{4}\)\./);
        
        let authors = partsByYear[0] ? partsByYear[0].trim() : 'Unknown Author';
        let restOfLine = partsByYear[1] ? partsByYear[1].trim() : cleanLine;
        
        // 3. Pisahkan Judul dan Nama Jurnal berdasarkan titik setelah judul
        let titleParts = restOfLine.split(/\.\s/);
        let title = titleParts[0] ? titleParts[0].trim() : 'Unknown Title';
        let journal = titleParts[1] ? titleParts[1].trim() : '';

        // 4. Ekstrak URL/DOI (Mendukung link biasa atau format markdown [link](url))
        let urlMatch = line.match(/https?:\/\/[^\s)]+/);
        let url = urlMatch ? urlMatch[0] : '';

        // Mulai merakit format RIS
        risContent += "TY  - JOUR\r\n";
        risContent += `TI  - ${title}\r\n`;
        
        // Pisahkan multiple authors dan bersihkan
        let authorList = authors.split(/,|&/).map(a => a.trim()).filter(a => a.length > 2);
        authorList.forEach(auth => {
            risContent += `AU  - ${auth}\r\n`;
        });

        if (year) risContent += `PY  - ${year}\r\n`;
        if (journal) risContent += `T2  - ${journal}\r\n`;
        if (url) risContent += `UR  - ${url.replace(']', '')}\r\n`;
        risContent += "ER  - \r\n\r\n";
    });

    if (!risContent) {
        showCustomAlert('error', 'Gagal Parsing', 'Tidak dapat mengenali format referensi APA. Pastikan AI menggunakan format yang benar.');
        return;
    }

    // Unduh File
    const blob = new Blob([risContent], { type: 'application/x-research-info-systems' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); 
    a.href = url;
    a.download = `Daftar_Pustaka_Final_${new Date().getFullYear()}.ris`;
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a); 
    URL.revokeObjectURL(url);
    
    showCustomAlert('success', 'Export Berhasil', 'Daftar pustaka final berhasil diunduh sebagai .RIS! Silakan import ke Mendeley/Zotero.');
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
    else if (AppState.documentType === 'robotik') {
        docContent += `<div class="cover-page"><h2>PROPOSAL PROYEK ROBOTIK / IT</h2><div class="cover-title">${AppState.selectedTitle || 'Judul Belum Dipilih'}</div><div class="cover-author">Disusun Oleh:<br><strong>[ TIM PENYUSUN ]</strong></div><div class="cover-inst">EKSTRAKURIKULER ROBOTIK<br>PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div></div>`;
        docContent += `<div class="chapter-title">BAB I<br>PENDAHULUAN</div>`;
        if(AppState.proposalData.rpendahuluan) docContent += formatTextForWord(AppState.proposalData.rpendahuluan);
        docContent += `<div class="chapter-title page-break">BAB II<br>SPESIFIKASI DAN DESAIN SISTEM</div>`;
        if(AppState.proposalData.rspesifikasi) docContent += formatTextForWord(AppState.proposalData.rspesifikasi);
        docContent += `<div class="chapter-title page-break">BAB III<br>METODE PELAKSANAAN</div>`;
        if(AppState.proposalData.rmetode) docContent += formatTextForWord(AppState.proposalData.rmetode);
        docContent += `<div class="chapter-title page-break">BAB IV<br>TARGET LUARAN DAN MANFAAT</div>`;
        if(AppState.proposalData.rtarget) docContent += formatTextForWord(AppState.proposalData.rtarget);
        docContent += `<div class="chapter-title page-break">BAB V<br>JADWAL DAN RENCANA ANGGARAN</div>`;
        if(AppState.proposalData.rjadwal) docContent += formatTextForWord(AppState.proposalData.rjadwal);
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
    textarea.disabled = true;
    textarea.classList.add('animate-pulse', 'bg-red-50/50'); 
    
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = "";

        // Looping dengan Yielding (Anti-Freeze)
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            // Update UI secara realtime tanpa membuat browser macet
            textarea.value = `Mengekstrak teks... (Halaman ${pageNum} dari ${pdf.numPages})\nMohon tunggu, AI sedang membaca dokumen Anda...`;
            
            // Memberikan jeda waktu ke Main Thread agar browser tidak hang
            await new Promise(resolve => setTimeout(resolve, 15)); 

            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(" ");
            
            fullText += `\n\n--- Halaman ${pageNum} ---\n${pageText}`;
        }

        textarea.value = fullText.trim();
        showCustomAlert('success', 'Ekstraksi Selesai', `Berhasil mengekstrak ${pdf.numPages} halaman.`);
    } catch (error) {
        console.error("PDF Error:", error);
        textarea.value = ""; 
        showCustomAlert('error', 'Gagal', 'Dokumen rusak atau berupa gambar hasil scan.');
    } finally {
        textarea.disabled = false;
        textarea.classList.remove('animate-pulse', 'bg-red-50/50');
        event.target.value = '';
    }
}

// ==========================================
// 🌟 FITUR BARU: MICRO-EDITING MULTI-PROVIDER
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

    const provider = AppState.aiProvider || 'gemini';
    let apiKey = AppState.getActiveApiKey(); 

    if (!apiKey) {
        if (provider === 'gemini' && AppState._encryptedGeminiKey) { showUnlockModal(); return; }
        if (provider === 'mistral' && AppState._encryptedMistralKey) { showUnlockModal(); return; }
        if (provider === 'groq' && AppState._encryptedGroqKey) { showUnlockModal(); return; }
        
        showCustomAlert('warning', 'API Key Dibutuhkan', `Harap masukkan API Key ${provider.toUpperCase()} Anda di pengaturan.`);
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

    cm.setOption("readOnly", true); 
    const marker = `[⏳ ${provider.toUpperCase()} sedang ${actionLabel}]`;
    cm.replaceSelection(marker);
    
    const endCursor = cm.getCursor();
    cm.setSelection({line: endCursor.line, ch: endCursor.ch - marker.length}, endCursor);

    try {
        let endpoint, options;

        if (provider === 'gemini') {
            endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
            options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
            };
        } else if (provider === 'mistral') {
            endpoint = `https://api.mistral.ai/v1/chat/completions`;
            options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: AppState.mistralModel || 'mistral-large-latest',
                    messages: [{ role: 'user', content: promptText }],
                    stream: true
                })
            };
        } else if (provider === 'groq') {
            endpoint = `https://api.groq.com/openai/v1/chat/completions`;
            options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
                body: JSON.stringify({
                    model: AppState.groqModel || 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: promptText }],
                    stream: true
                })
            };
        }

        const response = await fetch(endpoint, options);
        if (!response.ok) throw new Error(`Gagal menghubungi API ${provider}.`);

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
                        let newText = "";
                        
                        if (provider === 'gemini' && dataObj.candidates && dataObj.candidates[0].content?.parts[0]?.text) {
                            newText = dataObj.candidates[0].content.parts[0].text;
                        } else if ((provider === 'mistral' || provider === 'groq') && dataObj.choices && dataObj.choices[0].delta?.content) {
                            newText = dataObj.choices[0].delta.content;
                        }
                        
                        if (newText) cm.replaceSelection(newText);
                        
                    } catch (e) {}
                }
            }
        }
        showCustomAlert('success', 'Berhasil', `Teks berhasil diedit oleh ${provider.toUpperCase()}.`);
    } catch (error) {
        console.error("Micro-edit error:", error);
        cm.replaceSelection(selectedText); 
        showCustomAlert('error', 'Gagal Edit', error.message);
    } finally {
        cm.setOption("readOnly", false); 
        document.getElementById(`output-${sectionId}`).value = cm.getValue(); 
    }
}

// ==========================================
// PLAGIARISM CHECKER FUNCTIONS
// ==========================================

/**
 * Entry point untuk plagiarism check dari UI
 */
async function runPlagiarismCheck(sectionId, method) {
    const editor = window.mdeEditors[`output-${sectionId}`];
    if (!editor) {
        showCustomAlert('error', 'Error', 'Editor tidak ditemukan.');
        return;
    }

    const text = editor.value();
    if (!text || text.trim().length < 50) {
        showCustomAlert('warning', 'Teks Terlalu Pendek', 'Minimal 50 karakter untuk plagiarism check.');
        return;
    }

    // UI State: Loading
    setPlagiarismLoading(sectionId, true);
    updatePlagiarismStatus(sectionId, 'Memulai scan...', 'Menyiapkan analisis');

    try {
        const options = {
            references: AppState.journals,
            apiKey: method === 'copyleaks' ? await getCopyleaksKeyWithUnlock() : null
        };

        // Progress callback
        PlagiarismService.onProgress((data) => {
            if (data.status) {
                updatePlagiarismStatus(sectionId, data.status, data.detail);
            }
        });

        const result = await PlagiarismService.check(text, method, options);
        
        // Simpan hasil
        AppState.plagiarismConfig.lastScanResults[sectionId] = result;
        saveStateToLocal();

        // Tampilkan hasil
        displayPlagiarismResult(sectionId, result);

    } catch (error) {
        console.error('Plagiarism check failed:', error);
        
        // Error handling spesifik
        if (error.message.includes('API Key')) {
            showCustomAlert('warning', 'API Key Diperlukan', 
                'Masukkan Copyleaks API Key di pengaturan. Daftar gratis di copyleaks.com');
            openPlagiarismSettings();
        } else {
            showCustomAlert('error', 'Scan Gagal', error.message);
        }
        
        // Reset UI
        document.getElementById(`plagiarism-result-${sectionId}`).classList.add('hidden');
    } finally {
        setPlagiarismLoading(sectionId, false);
    }
}

/**
 * Dapatkan Copyleaks key dengan unlock jika perlu
 */
async function getCopyleaksKeyWithUnlock() {
    // Cek apakah sudah di-decrypt di memory
    if (AppState._tempCopyleaksKey) return AppState._tempCopyleaksKey;

    // Kalau encrypted, minta PIN
    if (AppState.plagiarismConfig.copyleaksApiKey) {
        return new Promise((resolve) => {
            showUnlockModalForCopyleaks((pin) => {
                AppState.getCopyleaksKey(pin).then(key => {
                    AppState._tempCopyleaksKey = key;
                    // Auto-expire setelah 1 jam
                    setTimeout(() => AppState._tempCopyleaksKey = null, 60 * 60 * 1000);
                    resolve(key);
                });
            });
        });
    }

    return null;
}

/**
 * Tampilkan hasil scan di UI
 */
function displayPlagiarismResult(sectionId, result) {
    const resultContainer = document.getElementById(`plagiarism-result-${sectionId}`);
    const badge = document.getElementById(`plagiarism-badge-${sectionId}`);
    const scoreEl = document.getElementById(`similarity-score-${sectionId}`);
    const barEl = document.getElementById(`similarity-bar-${sectionId}`);
    const interpEl = document.getElementById(`similarity-interpretation-${sectionId}`);
    const sourcesEl = document.getElementById(`similarity-sources-${sectionId}`);

    resultContainer.classList.remove('hidden');
    badge.classList.remove('hidden');

    const score = Math.round(result.overallScore * 100);
    scoreEl.textContent = `${score}%`;
    barEl.style.width = `${Math.min(score, 100)}%`;

    // Styling berdasarkan score
    badge.className = 'px-2.5 py-1 rounded-full text-xs font-bold ' + getScoreColorClass(score);
    badge.innerHTML = getScoreLabel(score);

    scoreEl.className = `text-3xl font-bold ${getScoreTextColor(score)}`;

    // Interpretasi
    interpEl.textContent = getScoreInterpretation(score, result.method);

    // Sources
    if (result.sources && result.sources.length > 0) {
        sourcesEl.innerHTML = result.sources.map((src, idx) => `
            <div class="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-all">
                <div class="w-8 h-8 rounded-full ${getSourceScoreColor(src.similarity)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    ${Math.round((src.similarity || 0) * 100)}%
                </div>
                <div class="flex-1 min-w-0">
                    <div class="font-semibold text-gray-800 text-sm truncate" title="${src.title || 'Unknown'}">
                        ${src.title || 'Unknown Source'}
                    </div>
                    <div class="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        <span class="px-1.5 py-0.5 bg-gray-100 rounded text-gray-600 capitalize">${src.type || 'internet'}</span>
                        ${src.matchedWords ? `<span>${src.matchedWords} kata cocok</span>` : ''}
                    </div>
                    ${src.snippet ? `<div class="mt-2 text-xs text-gray-600 italic bg-gray-50 p-2 rounded">"${src.snippet}"</div>` : ''}
                    ${src.url ? `<a href="${src.url}" target="_blank" class="mt-1 text-xs text-blue-600 hover:underline flex items-center gap-1"><i class="fas fa-external-link-alt"></i>Lihat sumber</a>` : ''}
                </div>
            </div>
        `).join('');
    } else {
        sourcesEl.innerHTML = `
            <div class="text-center py-4 text-gray-500 text-sm">
                <i class="fas fa-check-circle text-green-500 text-2xl mb-2"></i>
                <p>Tidak ditemukan kecocokan signifikan!</p>
            </div>
        `;
    }
}

// Helper functions untuk styling
function getScoreColorClass(score) {
    if (score < 10) return 'bg-green-100 text-green-800';
    if (score < 20) return 'bg-blue-100 text-blue-800';
    if (score < 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
}

function getScoreTextColor(score) {
    if (score < 10) return 'text-green-600';
    if (score < 20) return 'text-blue-600';
    if (score < 30) return 'text-yellow-600';
    return 'text-red-600';
}

function getScoreLabel(score) {
    if (score < 10) return '<i class="fas fa-check-circle mr-1"></i>Aman';
    if (score < 20) return '<i class="fas fa-info-circle mr-1"></i>Baik';
    if (score < 30) return '<i class="fas fa-exclamation-circle mr-1"></i>Perhatian';
    return '<i class="fas fa-times-circle mr-1"></i>Bahaya';
}

function getScoreInterpretation(score, method) {
    const methodLabel = method === 'copyleaks' ? 'database internet & akademik' : 'jurnal referensi lokal';
    
    if (score < 10) return `✅ Excellent! Similarity sangat rendah terhadap ${methodLabel}. Dokumen ini sangat orisinal.`;
    if (score < 20) return `✓ Bagus. Ada kemiripan minor dengan ${methodLabel}, masih dalam batas aman untuk publikasi.`;
    if (score < 30) return `⚠️ Perhatian. Similaritas moderat terdeteksi. Pertimbangkan parafrase pada bagian yang ditandai.`;
    return `🚨 Bahaya Plagiat! Similaritas tinggi (${score}%) terdeteksi. Dokumen perlu revisi besar sebelum submit.`;
}

function getSourceScoreColor(similarity) {
    const score = (similarity || 0) * 100;
    if (score < 15) return 'bg-green-500';
    if (score < 30) return 'bg-yellow-500';
    return 'bg-red-500';
}

/**
 * UI Helpers
 */
function setPlagiarismLoading(sectionId, isLoading) {
    const loadingEl = document.getElementById(`plagiarism-loading-${sectionId}`);
    const resultEl = document.getElementById(`plagiarism-result-${sectionId}`);
    
    if (isLoading) {
        loadingEl.classList.remove('hidden');
        resultEl.classList.add('hidden');
    } else {
        loadingEl.classList.add('hidden');
    }
}

function updatePlagiarismStatus(sectionId, status, detail) {
    const statusEl = document.getElementById(`plagiarism-status-${sectionId}`);
    const detailEl = document.getElementById(`plagiarism-detail-${sectionId}`);
    
    if (statusEl) statusEl.textContent = status;
    if (detailEl) detailEl.textContent = detail;
}

/**
 * Highlight similar text di editor (SUPPORT HTML MARK)
 */
function highlightSimilarText(sectionId) {
    const result = AppState.plagiarismConfig.lastScanResults[sectionId];
    if (!result || !result.sources) {
        showCustomAlert('warning', 'Tidak Ada Data', 'Lakukan scan plagiarism terlebih dahulu.');
        return;
    }

    const editor = window.mdeEditors[`output-${sectionId}`];
    let text = editor.value();
    let matchCount = 0;

    // Bersihkan highlight lama jika user klik tombol berkali-kali
    text = text.replace(/<mark style="background-color: #fecaca; color: #991b1b; padding: 0 2px; border-radius: 4px;">(.*?)<\/mark>/gi, '$1');

    result.sources.forEach(src => {
        if (src.matchedPhrases) {
            src.matchedPhrases.forEach(phrase => {
                if (phrase.length > 15) {
                    // Cerdas: Ubah spasi biasa menjadi Regex agar kebal terhadap Enter (\n) di editor
                    const safePhrase = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
                    const regex = new RegExp(`(${safePhrase})`, 'gi');
                    
                    if (regex.test(text)) {
                        // Gunakan tag HTML <mark> agar dirender visual oleh EasyMDE
                        text = text.replace(regex, '<mark style="background-color: #fecaca; color: #991b1b; padding: 0 2px; border-radius: 4px;">$1</mark>');
                        matchCount++;
                    }
                }
            });
        }
    });

    if (matchCount > 0) {
        editor.value(text);
        showCustomAlert('success', 'Berhasil', `Menandai ${matchCount} blok kalimat plagiat dengan warna merah. Silakan perbaiki.`);
    } else {
        showCustomAlert('warning', 'Gagal Menandai', 'Sistem tidak dapat menemukan posisi kalimat. Teks mungkin sudah berubah.');
    }
}

/**
 * Auto-paraphrase bagian bermasalah (SUPPORT MULTI-PROVIDER)
 */
/**
 * Auto-paraphrase bagian bermasalah (SUPPORT MULTI-PROVIDER)
 */
async function autoParaphraseProblematic(sectionId) {
    const result = AppState.plagiarismConfig.lastScanResults[sectionId];
    if (!result || result.overallScore < 0.1) {
        showCustomAlert('info', 'Aman', 'Similarity sudah cukup rendah, tidak perlu auto-parafrase.');
        return;
    }

    const editor = window.mdeEditors[`output-${sectionId}`];
    const cm = editor.codemirror;
    
    const provider = AppState.aiProvider || 'gemini';
    const apiKey = AppState.getActiveApiKey(); 
    
    if (!apiKey) {
        if (provider === 'gemini' && AppState._encryptedGeminiKey) { showUnlockModal(); return; }
        if (provider === 'mistral' && AppState._encryptedMistralKey) { showUnlockModal(); return; }
        if (provider === 'groq' && AppState._encryptedGroqKey) { showUnlockModal(); return; }
        
        showCustomAlert('warning', 'API Key Diperlukan', `Fitur ini membutuhkan API Key ${provider.toUpperCase()}.`);
        openApiSettings();
        return;
    }

    // 1. Kumpulkan semua frasa yang bermasalah dari hasil scan
    const problematicPhrases = result.sources
        .flatMap(s => s.matchedPhrases || [])
        .filter(p => p.length > 15);

    if (problematicPhrases.length === 0) {
        showCustomAlert('warning', 'Tidak Terdeteksi', 'Sistem gagal menemukan kalimat spesifik untuk diblok otomatis. Silakan klik tombol "Tandai di Teks" lalu gunakan menu Edit Blok manual.');
        return;
    }

    showCustomAlert('info', 'Memproses...', `AI (${provider.toUpperCase()}) akan memparafrase ${Math.min(problematicPhrases.length, 5)} bagian bermasalah secara bertahap.`);

    // 2. Loop dan blok teks secara otomatis (Programmatic Selection)
    let successCount = 0;
    const textContent = cm.getValue();

    for (const phrase of problematicPhrases.slice(0, 5)) {
        // Cari posisi persis kalimat tersebut di dalam teks
        const index = textContent.indexOf(phrase);
        
        if (index !== -1) {
            // Konversi index string biasa menjadi posisi baris & kolom untuk CodeMirror
            const startPos = cm.posFromIndex(index);
            const endPos = cm.posFromIndex(index + phrase.length);
            
            // Blok teks secara otomatis layaknya kursor mouse user
            cm.setSelection(startPos, endPos);
            
            // Panggil fungsi micro-edit
            await handleMicroEdit(sectionId, 'parafrase');
            successCount++;
            
            // Delay 2.5 detik antar request agar API tidak marah (Rate Limit)
            await new Promise(r => setTimeout(r, 2500));
        }
    }

    if (successCount > 0) {
        // Re-check originalitas setelah AI selesai memparafrase
        showCustomAlert('success', 'Selesai', `Berhasil memparafrase ${successCount} bagian. Mengecek ulang originalitas...`);
        setTimeout(() => runPlagiarismCheck(sectionId, 'local'), 3000);
    } else {
        showCustomAlert('warning', 'Gagal Menandai', 'Kalimat mungkin sudah berubah secara manual sebelum tombol ditekan.');
    }
}