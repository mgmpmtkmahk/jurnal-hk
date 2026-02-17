// ==========================================
// STATE MANAGEMENT
// ==========================================
let currentStep = 1;
let journals = [];
let analysisData = {};
let generatedTitles = [];
let selectedTitle = '';
let proposalData = {
    latar: '',
    rumusan: '',
    tujuan: '',
    manfaat: '',
    metode: '',
    landasan: '',
    hipotesis: '',
    jadwal: '',
    daftar: ''
};
let currentProposalSection = 'latar';

// ==========================================
// CUSTOM MODAL CONTROLLERS
// ==========================================

function showCustomAlert(type, title, message) {
    const modal = document.getElementById('customAlertModal');
    const card = document.getElementById('customAlertCard');
    const iconDiv = document.getElementById('customAlertIcon');
    const titleEl = document.getElementById('customAlertTitle');
    const messageEl = document.getElementById('customAlertMessage');

    iconDiv.className = 'w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto';
    
    if (type === 'success') {
        iconDiv.classList.add('bg-green-100', 'text-green-600');
        iconDiv.innerHTML = '<i class="fas fa-check"></i>';
    } else if (type === 'error') {
        iconDiv.classList.add('bg-red-100', 'text-red-600');
        iconDiv.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        iconDiv.classList.add('bg-yellow-100', 'text-yellow-600');
        iconDiv.innerHTML = '<i class="fas fa-exclamation"></i>';
    }

    titleEl.innerText = title;
    messageEl.innerText = message;

    modal.classList.remove('hidden');
    void modal.offsetWidth; 
    
    card.classList.remove('scale-95', 'opacity-0');
    card.classList.add('scale-100', 'opacity-100');
}

function closeCustomAlert() {
    const modal = document.getElementById('customAlertModal');
    const card = document.getElementById('customAlertCard');

    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function showConfirmModal() {
    const modal = document.getElementById('customConfirmModal');
    const card = document.getElementById('customConfirmCard');
    
    modal.classList.remove('hidden');
    void modal.offsetWidth;
    
    card.classList.remove('scale-95', 'opacity-0');
    card.classList.add('scale-100', 'opacity-100');
}

function closeConfirmModal() {
    const modal = document.getElementById('customConfirmModal');
    const card = document.getElementById('customConfirmCard');
    
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

function executeReset() {
    location.reload(); 
}

// ==========================================
// HELPER FUNCTIONS (Parsing & Formatting)
// ==========================================

function cleanMarkdown(str) {
    if (!str) return '';
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>'); 
}

function renderMarkdownTable(mdText) {
    if (!mdText) return '<p class="text-gray-500 text-sm italic">Tidak ada data tabel.</p>';
    
    const lines = mdText.replace(/\r\n/g, '\n').split('\n');
    
    let html = '<div class="mt-3 overflow-hidden rounded-lg border border-gray-200 shadow-sm"><div class="overflow-x-auto"><table class="min-w-full text-sm text-left border-collapse bg-white">';
    let isHeader = true;
    let hasTable = false;

    lines.forEach(line => {
        let trimmed = line.trim();
        
        if (trimmed === '---' || trimmed === '***') {
            if (hasTable) {
                html += '</table></div></div><div class="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow-sm"><div class="overflow-x-auto"><table class="min-w-full text-sm text-left border-collapse bg-white">';
                isHeader = true; 
            }
            return;
        }

        if (/^\|?[\-\:\s\|]+\|?$/.test(trimmed) && trimmed.includes('-')) {
            if (hasTable && isHeader) {
                isHeader = false; 
            }
            return; 
        }

        if (trimmed.startsWith('|') || trimmed.endsWith('|')) {
            hasTable = true;

            if (trimmed.startsWith('|')) trimmed = trimmed.substring(1);
            if (trimmed.endsWith('|')) trimmed = trimmed.substring(0, trimmed.length - 1);

            const cells = trimmed.split('|').map(cell => cell.trim());

            html += '<tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">';
            
            cells.forEach((cellText, index) => {
                const safeText = cellText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                
                if (isHeader) {
                    const widthClass = index === 0 ? 'w-1/3 md:w-1/4' : '';
                    html += `<th class="bg-gray-50/80 px-4 py-3 font-semibold text-gray-700 border-r border-gray-100 last:border-0 align-top ${widthClass}">${safeText}</th>`;
                } else {
                    html += `<td class="px-4 py-3 text-gray-600 border-r border-gray-100 last:border-0 align-top whitespace-pre-line break-words">${safeText}</td>`;
                }
            });
            html += '</tr>';
        }
    });

    html += '</table></div></div>';
    return hasTable ? html : `<div class="p-4 mt-2 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 shadow-inner">${mdText}</div>`;
}

function extractVariablesFromRumusan(rumusanText) {
    if (!rumusanText) return '[VARIABEL KOSONG]';
    const variables = [];
    const lines = rumusanText.split('\n');
    let isVarTable = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.includes('| Variabel |') || trimmed.includes('| Independen |') || trimmed.includes('| Dependen |')) {
            isVarTable = true;
        }
        if (isVarTable && trimmed.startsWith('|') && !trimmed.includes('|---') && !trimmed.includes('| Variabel |')) {
            const parts = trimmed.split('|');
            if (parts.length >= 3) {
                const varName = parts[2].trim(); 
                if (varName) variables.push(varName);
            }
        }
    });
    return variables.length > 0 ? variables.join(', ') : '[VARIABEL KOSONG]';
}

function extractTableData(text) {
    const data = {};
    
    const titleMatch = text.match(/\|\s*Judul Lengkap\s*\|\s*([^|]+)/i);
    const authorsMatch = text.match(/\|\s*Penulis & Afiliasi\s*\|\s*([^|]+)/i);
    const yearMatch = text.match(/\|\s*Tahun\s*\|\s*([^|]+)/i);
    const gapMatch = text.match(/\|\s*Research Gap\s*\|\s*([^|]+)/i);
    const journalMatch = text.match(/\|\s*Nama Jurnal\s*\|\s*([^|]+)/i);

    if (titleMatch) data.title = titleMatch[1].trim();
    if (authorsMatch) data.authors = authorsMatch[1].trim();
    if (yearMatch) data.year = yearMatch[1].trim();
    if (gapMatch) data.gap = gapMatch[1].trim();
    if (journalMatch) data.journal = journalMatch[1].trim();

    return data;
}

function getDynamicPromptText(elementId) {
    let text = document.getElementById(elementId).innerText;

    if (elementId === 'step3-prompt') {
        const allJournalsData = journals.map(j => j.raw).join('\n\n---\n\n');
        text = text.replace('[INSERT SEMUA DATA JURNAL DARI STEP 2]', allJournalsData || '[PERINGATAN: DATA JURNAL KOSONG]');
    }
    if (elementId === 'step4-prompt') {
        text = text.replace('[INSERT RESEARCH GAP DARI STEP 3]', analysisData.raw || '[PERINGATAN: DATA ANALISIS KOSONG]');
    }

    text = text.replace(/\[JUDUL\]/g, selectedTitle || '[PERINGATAN: JUDUL BELUM DIPILIH]');
    text = text.replace(/\[DATA JURNAL\]/g, journals.map(j => j.raw).join('\n') || '[DATA JURNAL KOSONG]');
    text = text.replace(/\[DATA JURNAL YANG DIKAJI\]/g, journals.map(j => `${j.parsed.title} (${j.parsed.authors}, ${j.parsed.year})`).join('; ') || '[DATA JURNAL KOSONG]');
    text = text.replace(/\[GAP\]/g, analysisData.raw || '[DATA GAP KOSONG]');
    
    const variables = extractVariablesFromRumusan(proposalData.rumusan);
    text = text.replace(/\[VARIABEL\]/g, variables);

    if(proposalData.rumusan) text = text.replace(/\[RUMUSAN\]/g, proposalData.rumusan);
    if(proposalData.tujuan) text = text.replace(/\[TUJUAN\]/g, proposalData.tujuan);

    // FITUR BARU: Logika Injeksi Mode Humanizer
    const humanizerToggle = document.getElementById('humanizerToggle');
    // Cek apakah toggle dicentang dan apakah ini prompt dari Langkah 5
    if (humanizerToggle && humanizerToggle.checked && elementId.startsWith('prompt-')) {
        const humanizerRules = `\n\nATURAN ANTI-PLAGIASI & HUMANIZER (SANGAT PENTING):\n1. Tulis dengan gaya bahasa natural manusia (Human-like text).\n2. Tingkatkan variasi struktur dan panjang kalimat (Burstiness) serta gunakan kosa kata yang lebih dinamis (Perplexity).\n3. HARAM menggunakan kata/frasa klise AI seperti: "Kesimpulannya", "Dalam era digital", "Penting untuk dicatat", "Artikel ini akan membahas", "Secara keseluruhan".\n4. Lakukan parafrase tingkat tinggi pada setiap teori/jurnal yang disitasi agar lolos uji Turnitin di bawah 5%.`;
        
        text += humanizerRules;
    }

    return text;
}

// ==========================================
// NAVIGATION & CORE ACTIONS
// ==========================================

function goToStep(step) {
    for (let i = 1; i <= 5; i++) {
        document.getElementById('step' + i).classList.remove('visible-section');
        document.getElementById('step' + i).classList.add('hidden-section');
        
        const indicator = document.getElementById('step' + i + '-indicator');
        if (i <= step) {
            indicator.classList.remove('step-inactive');
            indicator.classList.add('step-active');
        } else {
            indicator.classList.remove('step-active');
            indicator.classList.add('step-inactive');
        }
    }
    
    document.getElementById('step' + step).classList.remove('hidden-section');
    document.getElementById('step' + step).classList.add('visible-section');
    
    const progress = ((step - 1) / 4) * 100;
    document.getElementById('progress-line').style.width = progress + '%';
    
    currentStep = step;
    window.scrollTo(0, 0);
    
    if (step === 5) {
        const titleDisplay = document.getElementById('selectedTitleDisplayStep5');
        if (titleDisplay) {
            titleDisplay.textContent = selectedTitle || '-';
        }
    }
}

// STEP 1: Search Journals (UPDATE LINK TERBARU)
function searchJournals() {
    const keyword = document.getElementById('searchKeyword').value;
    if (!keyword) {
        showCustomAlert('warning', 'Input Kosong', 'Masukkan keyword jurnal terlebih dahulu!');
        return;
    }

    const resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-indigo-600"></i><p class="mt-2 text-gray-600">Mencari jurnal...</p></div>';

    setTimeout(function() {
        const intlSources = [
            { name: 'Google Scholar', url: 'https://scholar.google.com/scholar?q=' + encodeURIComponent(keyword), icon: 'fa-graduation-cap', color: 'blue' },
            { name: 'IEEE Xplore', url: 'https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=' + encodeURIComponent(keyword), icon: 'fa-microchip', color: 'purple' },
            { name: 'ScienceDirect', url: 'https://www.sciencedirect.com/search?qs=' + encodeURIComponent(keyword), icon: 'fa-atom', color: 'orange' },
            { name: 'DOAJ (Open Access)', url: 'https://doaj.org/search/articles?q=' + encodeURIComponent(keyword), icon: 'fa-unlock-alt', color: 'teal' }
        ];

        // URL Kemdiktisaintek, UI, dan UGM diperbarui. ITS dan RESTI dihapus.
        const indoSources = [
            { name: 'Google Scholar Indonesia', url: 'https://scholar.google.co.id/scholar?q=' + encodeURIComponent(keyword) + '&lr=lang_id', icon: 'fa-graduation-cap', color: 'red', desc: 'Filter Bahasa Indonesia' },
            { name: 'SINTA (Kemdiktisaintek)', url: 'https://sinta.kemdiktisaintek.go.id/', icon: 'fa-university', color: 'green', desc: 'Pencarian Manual di Web SINTA' },
            { name: 'Garuda (Kemdiktisaintek)', url: 'https://garuda.kemdiktisaintek.go.id/', icon: 'fa-book', color: 'yellow', desc: 'Pencarian Manual di Web Garuda' },
            { name: 'Neliti Indonesia', url: 'https://www.neliti.com/id/search?q=' + encodeURIComponent(keyword), icon: 'fa-search', color: 'teal', desc: 'Repository Jurnal Indonesia' },
            { name: 'Jurnal UI', url: 'https://scholarhub.ui.ac.id/do/search/', icon: 'fa-university', color: 'blue', desc: 'Pencarian Manual di Scholarhub UI' },
            { name: 'Jurnal UNDIP', url: 'https://ejournal.undip.ac.id/?s=' + encodeURIComponent(keyword), icon: 'fa-book-open', color: 'purple', desc: 'Multidisiplin - SINTA 2' },
            { name: 'Jurnal UGM', url: 'https://journal.ugm.ac.id/index/search/', icon: 'fa-graduation-cap', color: 'green', desc: 'Pencarian Manual di Jurnal UGM' },
            { name: 'Repository ITB', url: 'https://digilib.itb.ac.id/', icon: 'fa-flask', color: 'orange', desc: 'Pencarian Manual di Repositori ITB' }
        ];

        let indoHtml = '';
        for (let i = 0; i < indoSources.length; i++) {
            const s = indoSources[i];
            indoHtml += '<a href="' + s.url + '" target="_blank" class="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-' + s.color + '-500 hover:bg-' + s.color + '-50 transition-all group">';
            indoHtml += '<div class="w-12 h-12 bg-' + s.color + '-100 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform flex-shrink-0"><i class="fas ' + s.icon + ' text-' + s.color + '-600 text-xl"></i></div>';
            indoHtml += '<div class="flex-1 min-w-0"><h4 class="font-semibold text-gray-800 text-sm truncate">' + s.name + '</h4><p class="text-xs text-gray-500 mt-0.5">' + s.desc + '</p><span class="inline-block mt-1.5 px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded font-medium">Bahasa Indonesia</span></div></a>';
        }

        let intlHtml = '';
        for (let i = 0; i < intlSources.length; i++) {
            const s = intlSources[i];
            intlHtml += '<a href="' + s.url + '" target="_blank" class="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-' + s.color + '-500 hover:bg-' + s.color + '-50 transition-all group">';
            intlHtml += '<div class="w-10 h-10 bg-' + s.color + '-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0"><i class="fas ' + s.icon + ' text-' + s.color + '-600 text-sm"></i></div>';
            intlHtml += '<div class="flex-1 min-w-0"><h4 class="font-semibold text-gray-800 text-sm truncate">' + s.name + '</h4><span class="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded font-medium">English</span></div></a>';
        }

        let html = '<div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-red-500 fade-in">';
        html += '<h3 class="font-bold text-lg mb-4 text-red-600 flex items-center"><i class="fas fa-flag mr-2"></i>Sumber Jurnal Bahasa Indonesia (Rekomendasi)</h3>';
        html += '<div class="grid md:grid-cols-2 gap-4">' + indoHtml + '</div></div>';

        html += '<div class="bg-white rounded-xl shadow-lg p-6 mb-6 border-l-4 border-blue-500 fade-in">';
        html += '<h3 class="font-bold text-lg mb-4 text-blue-600 flex items-center"><i class="fas fa-globe mr-2"></i>Sumber Internasional (Bahasa Inggris)</h3>';
        // PERUBAHAN GRID DARI 3 KOLOM MENJADI 2 KOLOM (Agar ScienceDirect & DOAJ sejajar di bawah)
        html += '<div class="grid md:grid-cols-2 gap-4">' + intlHtml + '</div></div>';

        html += '<div class="mt-8 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden fade-in">';
        html += '<div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">';
        html += '<h3 class="font-bold text-lg text-white flex items-center"><i class="fas fa-award text-yellow-400 mr-3"></i>Panduan & Standar Kualitas Jurnal</h3>';
        html += '</div>';
        
        html += '<div class="p-6 grid md:grid-cols-3 gap-6">';
        
        html += '<div class="bg-green-50/50 p-4 rounded-xl border border-green-100">';
        html += '<h4 class="font-bold text-green-700 flex items-center border-b border-green-200 pb-2 mb-3"><i class="fas fa-flag-id mr-2"></i>Standar Nasional</h4>';
        html += '<ul class="text-sm text-gray-700 space-y-3">';
        html += '<li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i><span><strong>SINTA 1 & 2:</strong> Kualitas unggul/internasional (Sangat direkomendasikan).</span></li>';
        html += '<li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i><span><strong>SINTA 3 & 4:</strong> Kualitas menengah (Standar minimal skripsi S1).</span></li>';
        html += '<li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i><span>Wajib memiliki <strong>ISSN</strong> (p-ISSN cetak / e-ISSN online).</span></li>';
        html += '<li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i><span>Terindeks di <strong>Garuda</strong> atau <strong>Google Scholar</strong>.</span></li>';
        html += '</ul>';
        html += '</div>';

        html += '<div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100">';
        html += '<h4 class="font-bold text-blue-700 flex items-center border-b border-blue-200 pb-2 mb-3"><i class="fas fa-globe-americas mr-2"></i>Standar Internasional</h4>';
        html += '<ul class="text-sm text-gray-700 space-y-3">';
        html += '<li class="flex items-start"><i class="fas fa-check-circle text-blue-500 mr-2 mt-0.5"></i><span>Terindeks <strong>Scopus</strong> (Q1-Q4) atau <strong>Web of Science (WoS)</strong>.</span></li>';
        html += '<li class="flex items-start"><i class="fas fa-check-circle text-blue-500 mr-2 mt-0.5"></i><span>Memiliki matriks <strong>SJR</strong> (SCImago Journal Rank).</span></li>';
        html += '<li class="flex items-start"><i class="fas fa-check-circle text-blue-500 mr-2 mt-0.5"></i><span>Terdaftar di <strong>DOAJ</strong> (Untuk jurnal <em>Open Access</em>).</span></li>';
        html += '<li class="flex items-start"><i class="fas fa-check-circle text-blue-500 mr-2 mt-0.5"></i><span>Memiliki tautan <strong>DOI</strong> (Digital Object Identifier) yang aktif.</span></li>';
        html += '</ul>';
        html += '</div>';

        html += '<div class="bg-purple-50/50 p-4 rounded-xl border border-purple-100">';
        html += '<h4 class="font-bold text-purple-700 flex items-center border-b border-purple-200 pb-2 mb-3"><i class="fas fa-lightbulb mr-2"></i>Tips Efektif</h4>';
        html += '<ul class="text-sm text-gray-700 space-y-3">';
        html += '<li class="flex items-start"><i class="fas fa-angle-right text-purple-500 mr-2 mt-0.5 font-bold"></i><span>Gunakan filter publikasi <strong>5 tahun terakhir</strong> agar referensi up-to-date.</span></li>';
        html += '<li class="flex items-start"><i class="fas fa-angle-right text-purple-500 mr-2 mt-0.5 font-bold"></i><span>Gunakan <strong>Boolean ("AND", "OR")</strong> saat mengetik di kolom pencarian.</span></li>';
        html += '<li class="flex items-start"><i class="fas fa-angle-right text-purple-500 mr-2 mt-0.5 font-bold"></i><span>Gunakan fitur <strong>"Cited by" (Dirujuk oleh)</strong> pada Google Scholar untuk melacak riset turunan terbaru.</span></li>';
        html += '</ul>';
        html += '</div>';

        html += '</div></div>';

        resultsDiv.innerHTML = html;
        
        const navStep1 = document.getElementById('nav-step1');
        if(navStep1) navStep1.classList.remove('hidden');
        
    }, 1500);
}

// BUKA GEMINI & COPY PROMPT
function copyPromptText(elementId) {
    const textToCopy = getDynamicPromptText(elementId);
    
    navigator.clipboard.writeText(textToCopy).then(function() {
        const btn = document.querySelector('[data-prompt-id="' + elementId + '"]');
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            btn.classList.add('copy-success');
            
            setTimeout(function() {
                btn.innerHTML = originalHTML;
                btn.classList.remove('copy-success');
            }, 2000);
        }
    }).catch(function(err) {
        console.error('Gagal copy:', err);
        showCustomAlert('error', 'Gagal Copy', 'Browser mencegah otomatis copy. Silakan block dan copy manual.');
    });
}

function openGeminiWithPrompt(promptId) {
    const textToCopy = getDynamicPromptText(promptId);
    navigator.clipboard.writeText(textToCopy).then(() => {
        window.open('https://gemini.google.com', '_blank');
    }).catch(() => {
        showCustomAlert('warning', 'Copy Gagal', 'Gagal otomatis copy. Silakan klik tombol Copy manual lalu buka Gemini.');
        window.open('https://gemini.google.com', '_blank');
    });
}

// ==========================================
// PARSING & UI UPDATE LOGIC
// ==========================================

// STEP 2: Parsing Jurnal
function parseStep2Output() {
    const output = document.getElementById('geminiOutputStep2').value;
    if (!output.trim()) {
        showCustomAlert('warning', 'Input Kosong', 'Silakan paste hasil dari Gemini terlebih dahulu!');
        return;
    }

    const journalData = {
        id: Date.now(),
        raw: output,
        parsed: extractTableData(output)
    };

    journals.push(journalData);
    updateSavedJournalsList();
    
    const statusDiv = document.getElementById('parseStatusStep2');
    if(statusDiv) statusDiv.classList.remove('hidden');
    document.getElementById('geminiOutputStep2').value = '';
    
    setTimeout(function() {
        if(statusDiv) statusDiv.classList.add('hidden');
    }, 3000);
}

function updateSavedJournalsList() {
    const container = document.getElementById('savedJournalsList');
    if (journals.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada data jurnal yang tersimpan</p>';
        return;
    }

    let html = '';
    journals.forEach(function(journal, index) {
        html += '<div class="bg-white border border-green-200 shadow-sm rounded-xl p-4 mb-4">';
        html += '<div class="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">';
        html += '<div><h4 class="font-bold text-gray-800 text-lg">' + (index + 1) + '. ' + (journal.parsed.title || 'Jurnal ' + (index + 1)) + '</h4>';
        html += '<p class="text-sm text-gray-500"><i class="fas fa-user-edit mr-1"></i> ' + (journal.parsed.authors || 'Unknown') + ' | <i class="fas fa-calendar mr-1"></i> ' + (journal.parsed.year || 'Unknown') + ' | <i class="fas fa-book-open mr-1"></i> ' + (journal.parsed.journal || 'Unknown') + '</p></div>';
        html += '<button onclick="removeJournal(' + index + ')" class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition-colors"><i class="fas fa-trash"></i></button></div>';
        html += '<div class="text-sm max-h-60 overflow-y-auto custom-scrollbar">' + renderMarkdownTable(journal.raw) + '</div></div>';
    });
    container.innerHTML = html;
}

function removeJournal(index) {
    journals.splice(index, 1);
    updateSavedJournalsList();
}

// STEP 3: Parsing Analisis Komparatif
function parseStep3Output() {
    const output = document.getElementById('geminiOutputStep3').value;
    if (!output.trim()) {
        showCustomAlert('warning', 'Input Kosong', 'Paste hasil analisis dari Gemini terlebih dahulu!');
        return;
    }

    analysisData = { raw: output, timestamp: new Date() };
    renderAnalysisSummaryPreview(); 
    
    const statusDiv = document.getElementById('parseStatusStep3');
    if(statusDiv) statusDiv.classList.remove('hidden');
    document.getElementById('geminiOutputStep3').value = '';
    
    setTimeout(function() {
        if(statusDiv) statusDiv.classList.add('hidden');
    }, 3000);
}

function renderAnalysisSummaryPreview() {
    if(!analysisData.raw) return;
    document.getElementById('analysisSummary').innerHTML = 
        '<div class="bg-white border-2 border-purple-200 shadow-sm rounded-xl p-4">' +
        '<div class="flex items-center mb-3"><i class="fas fa-check-circle text-purple-600 mr-2 text-xl"></i><h4 class="font-bold text-purple-800 text-lg">Analisis Direkam</h4></div>' +
        '<div class="max-h-96 overflow-y-auto custom-scrollbar">' + renderMarkdownTable(analysisData.raw) + '</div></div>';
}

// STEP 4: Parsing Generate Judul
function parseStep4Output() {
    const output = document.getElementById('geminiOutputStep4').value;
    if (!output.trim()) {
        showCustomAlert('warning', 'Input Kosong', 'Paste hasil generate judul dari Gemini terlebih dahulu!');
        return;
    }

    const titles = [];
    const lines = output.split('\n');
    
    lines.forEach(function(line) {
        if (line.match(/^\|\s*\d+\s*\|/)) {
            const parts = line.split('|');
            if (parts.length >= 3) {
                titles.push({
                    no: parts[1].trim(),
                    title: parts[2].trim(),
                    reason: parts[3] ? parts[3].trim() : '',
                    method: parts[4] ? parts[4].trim() : '',
                    population: parts[5] ? parts[5].trim() : ''
                });
            }
        }
    });

    generatedTitles = titles;
    displayTitleSelection();
    document.getElementById('geminiOutputStep4').value = '';
}

function displayTitleSelection() {
    const container = document.getElementById('titleSelectionList');
    if (generatedTitles.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada judul yang di-generate</p>';
        return;
    }

    let html = '';
    generatedTitles.forEach(function(item, index) {
        const cleanTitleText = cleanMarkdown(item.title);
        const cleanMethod = cleanMarkdown(item.method);
        const cleanPopulation = cleanMarkdown(item.population);
        const cleanReason = cleanMarkdown(item.reason);
        
        const escapedTitle = cleanTitleText.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        
        html += '<div class="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 cursor-pointer transition-all card-hover title-card" data-title="' + escapedTitle + '" data-index="' + index + '">';
        html += '<div class="flex items-start">';
        html += '<div class="bg-yellow-100 text-yellow-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-lg">' + item.no + '</div>';
        html += '<div class="flex-1">';
        html += '<h4 class="text-gray-800 text-lg mb-2 leading-snug">' + cleanTitleText + '</h4>';
        html += '<div class="grid md:grid-cols-3 gap-2 text-sm">';
        html += '<div class="bg-blue-50 p-3 rounded"><span class="text-blue-600 font-semibold mb-1 block">Metode:</span> ' + cleanMethod + '</div>';
        html += '<div class="bg-green-50 p-3 rounded"><span class="text-green-600 font-semibold mb-1 block">Populasi:</span> ' + cleanPopulation + '</div>';
        html += '<div class="bg-purple-50 p-3 rounded"><span class="text-purple-600 font-semibold mb-1 block">Alasan:</span> ' + cleanReason + '</div>';
        html += '</div></div></div></div>';
    });

    container.innerHTML = html;

    document.querySelectorAll('.title-card').forEach(function(card) {
        card.addEventListener('click', function() {
            const title = this.getAttribute('data-title');
            const plainTextTitle = title.replace(/<[^>]*>?/gm, ''); 
            selectTitleForProposal(plainTextTitle, this);
        });
    });
}

function selectTitleForProposal(title, element) {
    document.querySelectorAll('.title-card').forEach(function(div) {
        div.classList.remove('border-yellow-500', 'bg-yellow-50');
        div.classList.add('border-gray-200');
    });
    
    element.classList.remove('border-gray-200');
    element.classList.add('border-yellow-500', 'bg-yellow-50');
    
    selectedTitle = title;
    
    const stickyNavStep4 = document.querySelector('#step4 .sticky');
    if (stickyNavStep4 && !document.getElementById('btn-continue-to-proposal')) {
        const btn = document.createElement('button');
        btn.id = 'btn-continue-to-proposal';
        btn.className = 'bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg shadow-green-400/50 transition-all';
        btn.innerHTML = 'Lanjut Menyusun Proposal <i class="fas fa-arrow-right ml-2"></i>';
        btn.onclick = function() { goToStep(5); };
        stickyNavStep4.appendChild(btn);
    }
}

// ==========================================
// STEP 5: PROPOSAL SECTION LOGIC
// ==========================================

function showProposalSection(section) {
    document.querySelectorAll('.proposal-section').forEach(function(el) {
        el.classList.add('hidden');
    });
    
    document.getElementById('section-' + section).classList.remove('hidden');
    
    document.querySelectorAll('.proposal-nav-btn').forEach(function(btn) {
        btn.classList.remove('border-indigo-500');
        btn.classList.add('border-gray-200');
    });
    
    const navButtons = document.querySelectorAll('.proposal-nav-btn');
    const sections = ['latar', 'rumusan', 'tujuan', 'manfaat', 'metode', 'landasan', 'hipotesis', 'jadwal', 'daftar', 'final'];
    const sectionIndex = sections.indexOf(section);
    
    if (navButtons[sectionIndex]) {
        navButtons[sectionIndex].classList.remove('border-gray-200');
        navButtons[sectionIndex].classList.add('border-indigo-500');
    }
    
    currentProposalSection = section;

    // FIX: Eksekusi perangkum data JIKA tab yang dibuka adalah 'final'
    if (section === 'final') {
        showFinalReview();
    }

    const navContainer = document.getElementById('proposal-nav-buttons');
    if(navContainer) {
        const y = navContainer.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
}

function prevProposalSection(current) {
    const sections = ['latar', 'rumusan', 'tujuan', 'manfaat', 'metode', 'landasan', 'hipotesis', 'jadwal', 'daftar', 'final'];
    const currentIndex = sections.indexOf(current);
    if (currentIndex > 0) {
        const prev = sections[currentIndex - 1];
        document.querySelectorAll('.proposal-section').forEach(function(el) {
            el.classList.add('hidden');
        });
        document.getElementById('section-' + prev).classList.remove('hidden');
        
        const navButtons = document.querySelectorAll('.proposal-nav-btn');
        navButtons.forEach(btn => btn.classList.remove('border-indigo-500'));
        if(navButtons[currentIndex - 1]) navButtons[currentIndex - 1].classList.add('border-indigo-500');

        // Tambahan Auto-Scroll
        const navContainer = document.getElementById('proposal-nav-buttons');
        if(navContainer) {
            const y = navContainer.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({top: y, behavior: 'smooth'});
        }
    }
}

function saveProposalSection(section) {
    const content = document.getElementById('output-' + section).value;
    if (!content.trim() && section !== 'hipotesis') {
        showCustomAlert('warning', 'Konten Kosong', 'Isi konten terlebih dahulu sebelum menyimpan!');
        return;
    }

    proposalData[section] = content;
    
    const navButtons = document.querySelectorAll('.proposal-nav-btn');
    const sections = ['latar', 'rumusan', 'tujuan', 'manfaat', 'metode', 'landasan', 'hipotesis', 'jadwal', 'daftar', 'final'];
    const currentIndex = sections.indexOf(section);
    
    if (navButtons[currentIndex]) {
        navButtons[currentIndex].classList.add('bg-green-50', 'border-green-500');
    }

    if (currentIndex < sections.length - 1) {
        const nextSection = sections[currentIndex + 1];
        document.querySelectorAll('.proposal-section').forEach(function(el) {
            el.classList.add('hidden');
        });
        document.getElementById('section-' + nextSection).classList.remove('hidden');
        
        if (navButtons[currentIndex + 1]) {
            navButtons[currentIndex + 1].classList.remove('border-gray-200');
            navButtons[currentIndex + 1].classList.add('border-indigo-500');
        }

        // Tambahan Auto-Scroll: Memaksa layar naik ke atas setiap kali ganti tab
        const navContainer = document.getElementById('proposal-nav-buttons');
        if(navContainer) {
            // Offset -100px agar tidak tertutup sticky header
            const y = navContainer.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({top: y, behavior: 'smooth'});
        }

    } else {
        showFinalReview();
    }
}

function toggleHipotesis() {
    const checkbox = document.getElementById('skip-hipotesis');
    const textarea = document.getElementById('output-hipotesis');
    
    if (checkbox.checked) {
        textarea.disabled = true;
        textarea.placeholder = 'Bagian ini dilewati (penelitian kualitatif)';
        proposalData.hipotesis = '(Penelitian kualitatif - tidak menggunakan hipotesis)';
    } else {
        textarea.disabled = false;
        textarea.placeholder = 'Paste hasil tabel hipotesis...';
        proposalData.hipotesis = '';
    }
}

function showFinalReview() {
    // Sembunyikan semua section
    document.querySelectorAll('.proposal-section').forEach(function(el) {
        el.classList.add('hidden');
    });
    
    // Tampilkan section final
    document.getElementById('section-final').classList.remove('hidden');
}

function downloadDOCX() {
    // 1. Definisikan Style CSS standar Akademik Ekstra Rapi untuk MS Word
    const styles = `
        <style>
            /* Margin Standar Skripsi (Kiri 3cm, Atas 3cm, Kanan 2.5cm, Bawah 2.5cm) */
            @page { margin: 3cm 2.5cm 2.5cm 2.5cm; } 
            body { font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.5; color: #000; }
            h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 24pt; text-transform: uppercase; }
            h2 { font-size: 12pt; font-weight: bold; margin-top: 24pt; margin-bottom: 12pt; text-transform: uppercase; page-break-after: avoid; }
            
            /* Indensi (Menjorok) untuk paragraf standar */
            p { margin-top: 0; margin-bottom: 10pt; text-align: justify; text-indent: 1.25cm; } 
            
            /* Pengaturan Tabel agar rapi dan teksnya tidak ikut menjorok */
            table { border-collapse: collapse; width: 100%; margin-top: 12pt; margin-bottom: 12pt; }
            th, td { border: 1pt solid black; padding: 6pt 8pt; text-align: left; vertical-align: top; line-height: 1.15; }
            th { background-color: #e6e6e6; font-weight: bold; text-align: center; }
            td p { text-indent: 0; margin-bottom: 4pt; } /* Teks dalam tabel dinetralkan indensinya */
            
            /* Format Halaman Sampul (Cover) */
            .cover-page { text-align: center; margin-top: 100pt; page-break-after: always; }
            .cover-page h2 { text-indent: 0; text-align: center; margin-bottom: 20pt; font-size: 16pt; }
            .cover-title { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 50pt; line-height: 1.5; text-indent: 0; }
            .cover-logo { margin-bottom: 50pt; font-weight: normal; color: #333; text-indent: 0; font-size: 12pt;}
            .cover-author { margin-bottom: 80pt; font-size: 12pt; text-indent: 0; line-height: 1.5; }
            .cover-inst { font-size: 14pt; font-weight: bold; text-transform: uppercase; text-indent: 0; line-height: 1.5; }
            
            /* Kelas utilitas untuk Page Break */
            .page-break { page-break-before: always; }
            
            /* Kelas utilitas untuk List Item (Angka/Bullet) */
            .list-item { text-indent: 0; padding-left: 1.25cm; margin-bottom: 4pt; }
        </style>
    `;

    // 2. Fungsi untuk mengubah Teks Markdown AI menjadi HTML Word
    function formatTextForWord(text) {
        if (!text) return '';

        // Hapus basabasi awalan AI yang sering bocor (berjaga-jaga)
        let html = text.replace(/^(Tentu, berikut|Berikut adalah|Tentu saja|Ini dia).*?:/mi, '');
        
        // Bersihkan tag heading markdown (###) agar tidak dobel dengan header otomatis dari sistem
        html = html.replace(/^#+\s*(.*)$/gm, '<strong>$1</strong>');

        // Parsing Bold (**) dan Italic (*)
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Membersihkan tag <br> bawaan AI agar tidak merusak paragraf Word
        html = html.replace(/<br>\s*<br>/g, '</p><p>');

        const lines = html.split('\n');
        let result = '';
        let inTable = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            
            // Abaikan garis separator tabel
            if (/^\|?[\-\:\s\|]+\|?$/.test(trimmed) && trimmed.includes('-')) {
                return; 
            }

            if (trimmed.startsWith('|') || trimmed.endsWith('|')) {
                if (!inTable) {
                    result += '<table>';
                    inTable = true;
                }
                
                let rowHtml = '<tr>';
                let cells = trimmed.split('|').map(c => c.trim());
                
                if (cells[0] === '') cells.shift();
                if (cells[cells.length - 1] === '') cells.pop();

                cells.forEach(cell => {
                    if (result.endsWith('<table>')) {
                         rowHtml += `<th>${cell}</th>`;
                    } else {
                         let cellContent = cell.replace(/<br>/g, '<br style="mso-data-placement:same-cell;" />');
                         rowHtml += `<td>${cellContent}</td>`;
                    }
                });
                rowHtml += '</tr>';
                result += rowHtml;
                
            } else {
                if (inTable) {
                    result += '</table>';
                    inTable = false;
                }
                
                if (trimmed) {
                    if (/^(\d+\.|-|\*)\s/.test(trimmed)) {
                         result += `<p class="list-item">${trimmed}</p>`;
                    } else {
                         result += `<p>${trimmed}</p>`;
                    }
                }
            }
        });
        
        if (inTable) result += '</table>'; 
        
        return result;
    }

    // 3. Bangun Struktur HTML Dokumen Word
    let docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Proposal Penelitian</title>
            ${styles}
        </head>
        <body>
    `;

    // HALAMAN SAMPUL (COVER)
    docContent += `
        <div class="cover-page">
            <h2>PROPOSAL PENELITIAN</h2>
            <div class="cover-title">${selectedTitle || 'Judul Penelitian Belum Dipilih'}</div>
            
            <div class="cover-logo">
                [ TEMPAT KOSONG UNTUK LOGO ]<br>
                (Hapus teks ini dan Sisipkan Gambar Logo)
            </div>
            
            <div class="cover-author">
                Disusun Oleh:<br>
                <strong>[ NAMA LENGKAP PENELITI ]</strong><br>
                [ NIP / NIDN / NIM ]
            </div>
            
            <div class="cover-inst">
                PONTREN HUSNUL KHOTIMAH<br>
                ${new Date().getFullYear()}
            </div>
        </div>
    `;

    // ISI PROPOSAL
    const sectionNames = {
        latar: 'A. Latar Belakang Masalah',
        rumusan: 'B. Rumusan Masalah',
        tujuan: 'C. Tujuan Penelitian',
        manfaat: 'D. Manfaat Penelitian',
        metode: 'E. Metode Penelitian',
        landasan: 'F. Landasan Teori',
        hipotesis: 'G. Hipotesis / Pertanyaan Penelitian',
        jadwal: 'H. Jadwal & Anggaran',
        daftar: 'I. Daftar Pustaka'
    };

    Object.keys(proposalData).forEach(function(key) {
        if (proposalData[key]) {
            // Beri page break khusus untuk Daftar Pustaka agar pindah ke halaman baru
            let extraClass = (key === 'daftar') ? ' class="page-break"' : '';
            docContent += `<h2${extraClass}>${sectionNames[key]}</h2>`;
            docContent += formatTextForWord(proposalData[key]);
        }
    });

    docContent += '</body></html>';

    // 4. Proses Download File Word (.doc)
    // Penambahan \ufeff untuk mengatasi masalah karakter khusus
    const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    let safeFilename = selectedTitle ? selectedTitle.substring(0, 40).replace(/[^a-zA-Z0-9]/g, '_') : 'Proposal_Penelitian';
    a.download = `Proposal_${safeFilename}.doc`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ==========================================
// DATA MANAGEMENT (DOWNLOAD/UPLOAD)
// ==========================================

function downloadBackup() {
    const dataToSave = {
        journals: journals,
        analysisData: analysisData,
        generatedTitles: generatedTitles,
        selectedTitle: selectedTitle,
        proposalData: proposalData,
        currentStep: currentStep
    };
    
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `Proposal_Backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showCustomAlert('success', 'Backup Berhasil', 'Data proposal berhasil di-download!');
}

function triggerRestore() {
    document.getElementById('file-restore-input').click();
}

function processRestoreFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            
            journals = parsed.journals || [];
            analysisData = parsed.analysisData || {};
            generatedTitles = parsed.generatedTitles || [];
            selectedTitle = parsed.selectedTitle || '';
            proposalData = Object.assign(proposalData, parsed.proposalData || {});
            currentStep = parsed.currentStep || 1;
            
            updateSavedJournalsList();
            renderAnalysisSummaryPreview();
            if (generatedTitles.length > 0) displayTitleSelection();
            
            Object.keys(proposalData).forEach(key => {
                const el = document.getElementById('output-' + key);
                if (el && proposalData[key]) el.value = proposalData[key];
            });

            const titleDisplay = document.getElementById('selectedTitleDisplayStep5');
            if (titleDisplay) titleDisplay.textContent = selectedTitle || '-';

            goToStep(currentStep);
            
            showCustomAlert('success', 'Berhasil Restore', 'Data Anda berhasil dipulihkan dari file JSON!');
        } catch (err) {
            console.error('Error saat parse JSON:', err);
            showCustomAlert('error', 'Gagal Restore', 'Gagal me-restore data. Pastikan file yang diupload adalah format .json yang benar.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// ==========================================
// INITIALIZATION
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    updateSavedJournalsList();
    
    document.querySelectorAll('.proposal-nav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const section = this.getAttribute('data-section');
            showProposalSection(section);
        });
    });
});