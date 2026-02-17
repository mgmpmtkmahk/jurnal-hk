// ==========================================
// STATE MANAGEMENT & SUPER-APP CORE
// ==========================================
let documentType = 'proposal'; // Bisa 'proposal', 'makalah', 'jurnal', 'skripsi', 'slr'
let currentStep = 1;
let journals = [];
let analysisData = {};
let generatedTitles = [];
let selectedTitle = '';
let proposalData = {
    // Field Proposal
    latar: '', rumusan: '', tujuan: '', manfaat: '', metode: '', landasan: '', hipotesis: '', jadwal: '', daftar: '',
    // Field Makalah
    mpendahuluan: '', mpembahasan: '', mpenutup: '', mdaftar: '',
    // Field Jurnal
    jpendahuluan: '', jmetode: '', jhasil: '', jkesimpulan: '', jabstrak: '', jdaftar: '',
    // Field Skripsi Bab 4-5
    sdeskripsi: '', sanalisis: '', spembahasan: '', skesimpulan: '', ssaran: '', sdaftar: '',
    // Field SLR (Systematic Literature Review)
    slrpendahuluan: '', slrmetode: '', slrhasil: '', slrpembahasan: '', slrkesimpulan: '', slrdaftar: ''
};

// Fungsi Switcher Mode Dokumen
function setDocumentType(type) {
    documentType = type;
    
    const btnProp = document.getElementById('btn-mode-proposal');
    const btnMak = document.getElementById('btn-mode-makalah');
    const btnJur = document.getElementById('btn-mode-jurnal');
    const btnSkrip = document.getElementById('btn-mode-skripsi');
    const btnSlr = document.getElementById('btn-mode-slr');
    const titleStep5 = document.getElementById('step5-title');
    
    const inactiveClass = "mode-btn border-2 border-gray-200 bg-white text-gray-600 font-bold py-4 px-3 rounded-xl flex items-center justify-center hover:border-indigo-300 transition-all";
    const activeClass = "mode-btn border-2 border-indigo-500 bg-indigo-50 text-indigo-700 font-bold py-4 px-3 rounded-xl flex items-center justify-center transition-all shadow-md transform scale-105";
    
    // Reset Kelas
    btnProp.className = inactiveClass;
    btnMak.className = inactiveClass;
    btnJur.className = inactiveClass;
    btnSkrip.className = inactiveClass;
    btnSlr.className = inactiveClass + " col-span-2 md:col-span-1 lg:col-span-1";

    // Sembunyikan Semua Menu Navigasi
    document.getElementById('proposal-nav-buttons').classList.add('hidden'); 
    document.getElementById('proposal-nav-buttons').classList.remove('grid');
    document.getElementById('makalah-nav-buttons').classList.add('hidden'); 
    document.getElementById('makalah-nav-buttons').classList.remove('grid');
    document.getElementById('jurnal-nav-buttons').classList.add('hidden'); 
    document.getElementById('jurnal-nav-buttons').classList.remove('grid');
    document.getElementById('skripsi-nav-buttons').classList.add('hidden'); 
    document.getElementById('skripsi-nav-buttons').classList.remove('grid');
    document.getElementById('slr-nav-buttons').classList.add('hidden'); 
    document.getElementById('slr-nav-buttons').classList.remove('grid');
    
    if (type === 'proposal') {
        btnProp.className = activeClass;
        document.getElementById('proposal-nav-buttons').classList.remove('hidden'); 
        document.getElementById('proposal-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Proposal (Bab 1-3)";
        showProposalSection('latar');
    } else if (type === 'makalah') {
        btnMak.className = activeClass;
        document.getElementById('makalah-nav-buttons').classList.remove('hidden'); 
        document.getElementById('makalah-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Makalah (Standar Akademik)";
        showProposalSection('mpendahuluan');
    } else if (type === 'jurnal') {
        btnJur.className = activeClass;
        document.getElementById('jurnal-nav-buttons').classList.remove('hidden'); 
        document.getElementById('jurnal-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Artikel Jurnal (Standar SINTA/Scopus)";
        showProposalSection('jpendahuluan');
    } else if (type === 'skripsi') {
        btnSkrip.className = activeClass;
        document.getElementById('skripsi-nav-buttons').classList.remove('hidden'); 
        document.getElementById('skripsi-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Skripsi Akhir (Bab 4 & 5)";
        showProposalSection('sdeskripsi');
    } else if (type === 'slr') {
        btnSlr.className = activeClass + " col-span-2 md:col-span-1 lg:col-span-1";
        document.getElementById('slr-nav-buttons').classList.remove('hidden'); 
        document.getElementById('slr-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Systematic Literature Review (SLR)";
        showProposalSection('slrpendahuluan');
    }
    showCustomAlert('success', 'Mode Diperbarui', `Sistem dialihkan ke Mode ${type.toUpperCase()}.`);
}

function getActiveSections() {
    if (documentType === 'proposal') return ['latar', 'rumusan', 'tujuan', 'manfaat', 'metode', 'landasan', 'hipotesis', 'jadwal', 'daftar', 'final'];
    if (documentType === 'makalah') return ['mpendahuluan', 'mpembahasan', 'mpenutup', 'mdaftar', 'final'];
    if (documentType === 'jurnal') return ['jpendahuluan', 'jmetode', 'jhasil', 'jkesimpulan', 'jabstrak', 'jdaftar', 'final'];
    if (documentType === 'skripsi') return ['sdeskripsi', 'sanalisis', 'spembahasan', 'skesimpulan', 'ssaran', 'sdaftar', 'final'];
    if (documentType === 'slr') return ['slrpendahuluan', 'slrmetode', 'slrhasil', 'slrpembahasan', 'slrkesimpulan', 'slrdaftar', 'final'];
}

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
    setTimeout(() => modal.classList.add('hidden'), 300);
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
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function executeReset() { 
    location.reload(); 
}

// ==========================================
// HELPER FUNCTIONS
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
    let isHeader = true, hasTable = false;
    
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
            if (hasTable && isHeader) isHeader = false; 
            return; 
        }
        if (trimmed.startsWith('|') || trimmed.endsWith('|')) {
            hasTable = true;
            if (trimmed.startsWith('|')) trimmed = trimmed.substring(1);
            if (trimmed.endsWith('|')) trimmed = trimmed.substring(0, trimmed.length - 1);
            const cells = trimmed.split('|').map(cell => cell.trim());
            html += '<tr class="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">';
            cells.forEach((cellText) => {
                const safeText = cellText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                if (isHeader) {
                    html += `<th class="bg-gray-50/80 px-4 py-3 font-semibold text-gray-700 border-r border-gray-100 last:border-0 align-top">${safeText}</th>`;
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
            if (parts.length >= 3 && parts[2].trim()) {
                variables.push(parts[2].trim());
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
    
    if (titleMatch) data.title = titleMatch[1].trim();
    if (authorsMatch) data.authors = authorsMatch[1].trim();
    if (yearMatch) data.year = yearMatch[1].trim();
    
    return data;
}

function getDynamicPromptText(elementId) {
    let text = document.getElementById(elementId).innerText;
    
    // Inject data Step 3 & 4
    if (elementId === 'step3-prompt') {
        const allJournalsData = journals.map(j => j.raw).join('\n\n---\n\n');
        text = text.replace('[INSERT SEMUA DATA JURNAL DARI STEP 2]', allJournalsData || '[PERINGATAN: DATA JURNAL KOSONG]');
    }
    if (elementId === 'step4-prompt') {
        text = text.replace('[INSERT RESEARCH GAP DARI STEP 3]', analysisData.raw || '[PERINGATAN: DATA ANALISIS KOSONG]');
    }

    // Inject data Step 5
    text = text.replace(/\[JUDUL\]/g, selectedTitle || '[PERINGATAN: JUDUL BELUM DIPILIH]');
    text = text.replace(/\[DATA JURNAL\]/g, journals.map(j => j.raw).join('\n') || '[DATA JURNAL KOSONG]');
    text = text.replace(/\[DATA JURNAL YANG DIKAJI\]/g, journals.map(j => `${j.parsed.title} (${j.parsed.authors}, ${j.parsed.year})`).join('; ') || '[DATA JURNAL KOSONG]');
    text = text.replace(/\[GAP\]/g, analysisData.raw || '[DATA GAP KOSONG]');
    text = text.replace(/\[VARIABEL\]/g, extractVariablesFromRumusan(proposalData.rumusan));
    
    if(proposalData.rumusan) text = text.replace(/\[RUMUSAN\]/g, proposalData.rumusan);
    if(proposalData.tujuan) text = text.replace(/\[TUJUAN\]/g, proposalData.tujuan);

    // Injeksi Mode Humanizer (Lolos Turnitin)
    const humanizerToggle = document.getElementById('humanizerToggle');
    if (humanizerToggle && humanizerToggle.checked && elementId.startsWith('prompt-')) {
        const humanizerRules = `\n\nATURAN ANTI-PLAGIASI & HUMANIZER (SANGAT PENTING):\n1. Tulis dengan gaya bahasa natural manusia (Human-like text).\n2. Tingkatkan variasi struktur dan panjang kalimat (Burstiness) serta gunakan kosa kata yang dinamis (Perplexity).\n3. HARAM menggunakan frasa AI klise: "Kesimpulannya", "Dalam era digital", "Penting untuk dicatat", "Secara keseluruhan".\n4. Lakukan parafrase tingkat tinggi pada setiap teori/jurnal yang disitasi agar lolos uji Turnitin < 5%.`;
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
    document.getElementById('progress-line').style.width = ((step - 1) / 4) * 100 + '%';
    currentStep = step;
    window.scrollTo(0, 0);
    
    if (step === 5) {
        const titleDisplay = document.getElementById('selectedTitleDisplayStep5');
        if (titleDisplay) titleDisplay.textContent = selectedTitle || '-';
    }
}

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
        
        // URL YANG SUDAH DIUPDATE OLEH USER
        const indoSources = [
            { name: 'Google Scholar Indonesia', url: 'https://scholar.google.co.id/scholar?q=' + encodeURIComponent(keyword) + '&lr=lang_id', icon: 'fa-graduation-cap', color: 'red', desc: 'Filter Bahasa Indonesia' },
            { name: 'SINTA (Kemdiktisaintek)', url: 'https://sinta.kemdiktisaintek.go.id/', icon: 'fa-university', color: 'green', desc: 'Pencarian Manual di Web SINTA' },
            { name: 'Garuda (Kemdiktisaintek)', url: 'https://garuda.kemdiktisaintek.go.id/documents?q=' + encodeURIComponent(keyword), icon: 'fa-book', color: 'yellow', desc: 'Pencarian Jurnal di Web Garuda' },
            { name: 'Neliti Indonesia', url: 'https://www.neliti.com/id/search?q=' + encodeURIComponent(keyword), icon: 'fa-search', color: 'teal', desc: 'Repository Jurnal Indonesia' },
            { name: 'UI Scholars Hub', url: 'https://scholarhub.ui.ac.id/do/search/?q=' + encodeURIComponent(keyword), icon: 'fa-university', color: 'blue', desc: 'Pencarian Jurnal di Scholarhub UI' },
            { name: 'E-Jurnal System Portal UNDIP', url: 'https://ejournal.undip.ac.id/index.php/index/search?query=' + encodeURIComponent(keyword), icon: 'fa-book-open', color: 'purple', desc: 'Pencarian Jurnal Multidisiplin (SINTA 2) di Portal UNDIP' },
            { name: 'Jurnal Online UGM', url: 'https://journal.ugm.ac.id/index/search/search?query=' + encodeURIComponent(keyword), icon: 'fa-graduation-cap', color: 'green', desc: 'Pencarian Jurnal di Laman UGM' },
            { name: 'Perpustakaan Digital ITB', url: 'https://digilib.itb.ac.id/gdl/go/' + encodeURIComponent(keyword), icon: 'fa-flask', color: 'orange', desc: 'Pencarian Jurnal di Repositori ITB' }
        ];

        let indoHtml = '';
        indoSources.forEach(s => {
            indoHtml += `<a href="${s.url}" target="_blank" class="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-${s.color}-500 hover:bg-${s.color}-50 transition-all group">
            <div class="w-12 h-12 bg-${s.color}-100 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform flex-shrink-0"><i class="fas ${s.icon} text-${s.color}-600 text-xl"></i></div>
            <div class="flex-1 min-w-0"><h4 class="font-semibold text-gray-800 text-sm truncate">${s.name}</h4><p class="text-xs text-gray-500 mt-0.5">${s.desc}</p></div></a>`;
        });

        let intlHtml = '';
        intlSources.forEach(s => {
            intlHtml += `<a href="${s.url}" target="_blank" class="flex items-center p-4 border-2 border-gray-100 rounded-xl hover:border-${s.color}-500 hover:bg-${s.color}-50 transition-all group">
            <div class="w-10 h-10 bg-${s.color}-100 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform flex-shrink-0"><i class="fas ${s.icon} text-${s.color}-600 text-sm"></i></div>
            <div class="flex-1 min-w-0"><h4 class="font-semibold text-gray-800 text-sm truncate">${s.name}</h4></div></a>`;
        });

        let html = `<div class="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-red-500"><h3 class="font-bold text-lg mb-4 text-red-600 flex items-center"><i class="fas fa-flag mr-2"></i>Sumber Jurnal Nasional</h3><div class="grid md:grid-cols-2 gap-4">${indoHtml}</div></div>`;
        html += `<div class="bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 border-blue-500"><h3 class="font-bold text-lg mb-4 text-blue-600 flex items-center"><i class="fas fa-globe mr-2"></i>Sumber Internasional</h3><div class="grid md:grid-cols-2 gap-4">${intlHtml}</div></div>`;
        
        // --- BLOK TIPS YANG DIKEMBALIKAN ---
        html += `<div class="mt-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"><div class="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4"><h3 class="font-bold text-lg text-white flex items-center"><i class="fas fa-award text-yellow-400 mr-3"></i>Panduan & Standar Kualitas Jurnal</h3></div><div class="p-6 grid md:grid-cols-3 gap-6"><div class="bg-green-50/50 p-4 rounded-xl border border-green-100"><h4 class="font-bold text-green-700 flex items-center border-b border-green-200 pb-2 mb-3"><i class="fas fa-flag-id mr-2"></i>Standar Nasional</h4><ul class="text-sm text-gray-700 space-y-3"><li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i><span><strong>SINTA 1 & 2:</strong> Kualitas unggul/internasional.</span></li><li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i><span><strong>SINTA 3 & 4:</strong> Kualitas menengah standar skripsi.</span></li><li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i><span>Wajib memiliki <strong>ISSN</strong>.</span></li><li class="flex items-start"><i class="fas fa-check-circle text-green-500 mr-2 mt-0.5"></i><span>Terindeks Garuda / Google Scholar.</span></li></ul></div><div class="bg-blue-50/50 p-4 rounded-xl border border-blue-100"><h4 class="font-bold text-blue-700 flex items-center border-b border-blue-200 pb-2 mb-3"><i class="fas fa-globe-americas mr-2"></i>Standar Internasional</h4><ul class="text-sm text-gray-700 space-y-3"><li class="flex items-start"><i class="fas fa-check-circle text-blue-500 mr-2 mt-0.5"></i><span>Terindeks <strong>Scopus</strong> (Q1-Q4) / Web of Science.</span></li><li class="flex items-start"><i class="fas fa-check-circle text-blue-500 mr-2 mt-0.5"></i><span>Memiliki matriks <strong>SJR</strong>.</span></li><li class="flex items-start"><i class="fas fa-check-circle text-blue-500 mr-2 mt-0.5"></i><span>Terdaftar di <strong>DOAJ</strong> (Open Access).</span></li><li class="flex items-start"><i class="fas fa-check-circle text-blue-500 mr-2 mt-0.5"></i><span>Memiliki tautan <strong>DOI</strong> aktif.</span></li></ul></div><div class="bg-purple-50/50 p-4 rounded-xl border border-purple-100"><h4 class="font-bold text-purple-700 flex items-center border-b border-purple-200 pb-2 mb-3"><i class="fas fa-lightbulb mr-2"></i>Tips Efektif</h4><ul class="text-sm text-gray-700 space-y-3"><li class="flex items-start"><i class="fas fa-angle-right text-purple-500 mr-2 mt-0.5 font-bold"></i><span>Gunakan filter publikasi <strong>5 tahun terakhir</strong>.</span></li><li class="flex items-start"><i class="fas fa-angle-right text-purple-500 mr-2 mt-0.5 font-bold"></i><span>Gunakan <strong>Boolean ("AND", "OR")</strong>.</span></li><li class="flex items-start"><i class="fas fa-check-circle text-purple-600 mr-2 mt-0.5 font-bold"></i><span><strong class="text-purple-800">Golden Rule:</strong> Jangan baca seluruh isi jurnal dulu! Baca <strong>Abstrak</strong> dan <strong>Kesimpulan</strong> untuk menemukan <em>Research Gap</em> dengan kilat.</span></li></ul></div></div></div>`;
        // --- AKHIR BLOK TIPS ---

        resultsDiv.innerHTML = html;
        
        const navStep1 = document.getElementById('nav-step1');
        if(navStep1) navStep1.classList.remove('hidden');
    }, 1500);
}

function copyPromptText(elementId) {
    const textToCopy = getDynamicPromptText(elementId);
    navigator.clipboard.writeText(textToCopy).then(function() {
        const btn = document.querySelector(`[data-prompt-id="${elementId}"]`);
        if (btn) {
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            btn.classList.add('copy-success');
            setTimeout(() => { 
                btn.innerHTML = originalHTML; 
                btn.classList.remove('copy-success'); 
            }, 2000);
        }
    }).catch(err => {
        showCustomAlert('error', 'Gagal Copy', 'Browser mencegah otomatis copy. Silakan block dan copy manual.');
    });
}

function openGeminiWithPrompt(promptId) {
    const textToCopy = getDynamicPromptText(promptId);
    navigator.clipboard.writeText(textToCopy).then(() => {
        window.open('https://gemini.google.com', '_blank');
    }).catch(() => {
        showCustomAlert('warning', 'Copy Gagal', 'Silakan klik tombol Copy manual lalu buka Gemini.');
        window.open('https://gemini.google.com', '_blank');
    });
}

// ==========================================
// PARSING & UI UPDATE LOGIC
// ==========================================
function parseStep2Output() {
    const output = document.getElementById('geminiOutputStep2').value;
    if (!output.trim()) { 
        showCustomAlert('warning', 'Input Kosong', 'Paste hasil dari Gemini terlebih dahulu!'); 
        return; 
    }
    journals.push({ id: Date.now(), raw: output, parsed: extractTableData(output) });
    updateSavedJournalsList();
    document.getElementById('geminiOutputStep2').value = '';
}

function updateSavedJournalsList() {
    const container = document.getElementById('savedJournalsList');
    if (journals.length === 0) { 
        container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada data jurnal yang tersimpan</p>'; 
        return; 
    }
    
    let html = '';
    journals.forEach((journal, index) => {
        html += `<div class="bg-white border border-green-200 shadow-sm rounded-xl p-4 mb-4"><div class="flex justify-between items-center mb-3 pb-2 border-b border-gray-100"><div><h4 class="font-bold text-gray-800 text-lg">${index + 1}. ${journal.parsed.title || 'Jurnal ' + (index + 1)}</h4></div><button onclick="removeJournal(${index})" class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded transition-colors"><i class="fas fa-trash"></i></button></div><div class="text-sm max-h-60 overflow-y-auto custom-scrollbar">${renderMarkdownTable(journal.raw)}</div></div>`;
    });
    container.innerHTML = html;
}

function removeJournal(index) { 
    journals.splice(index, 1); 
    updateSavedJournalsList(); 
}

function parseStep3Output() {
    const output = document.getElementById('geminiOutputStep3').value;
    if (!output.trim()) { 
        showCustomAlert('warning', 'Input Kosong', 'Paste hasil dari Gemini terlebih dahulu!'); 
        return; 
    }
    analysisData = { raw: output, timestamp: new Date() };
    renderAnalysisSummaryPreview(); 
    document.getElementById('geminiOutputStep3').value = '';
}

function renderAnalysisSummaryPreview() {
    if(!analysisData.raw) return;
    document.getElementById('analysisSummary').innerHTML = `<div class="bg-white border-2 border-purple-200 shadow-sm rounded-xl p-4"><div class="flex items-center mb-3"><i class="fas fa-check-circle text-purple-600 mr-2 text-xl"></i><h4 class="font-bold text-purple-800 text-lg">Analisis Direkam</h4></div><div class="max-h-96 overflow-y-auto custom-scrollbar">${renderMarkdownTable(analysisData.raw)}</div></div>`;
}

function parseStep4Output() {
    const output = document.getElementById('geminiOutputStep4').value;
    if (!output.trim()) { 
        showCustomAlert('warning', 'Input Kosong', 'Paste hasil dari Gemini terlebih dahulu!'); 
        return; 
    }
    
    const titles = []; 
    const lines = output.split('\n');
    
    lines.forEach(line => {
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
    generatedTitles.forEach((item, index) => {
        const cleanTitleText = cleanMarkdown(item.title);
        const escapedTitle = cleanTitleText.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        html += `<div class="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 cursor-pointer transition-all card-hover title-card" data-title="${escapedTitle}" data-index="${index}"><div class="flex items-start"><div class="bg-yellow-100 text-yellow-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-lg">${item.no}</div><div class="flex-1"><h4 class="text-gray-800 text-lg mb-2 leading-snug">${cleanTitleText}</h4></div></div></div>`;
    });
    container.innerHTML = html;
    
    document.querySelectorAll('.title-card').forEach(card => {
        card.addEventListener('click', function() {
            const title = this.getAttribute('data-title').replace(/<[^>]*>?/gm, ''); 
            selectTitleForProposal(title, this);
        });
    });
}

function selectTitleForProposal(title, element) {
    document.querySelectorAll('.title-card').forEach(div => { 
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
        btn.innerHTML = `Lanjut Menyusun Dokumen <i class="fas fa-arrow-right ml-2"></i>`;
        btn.onclick = function() { goToStep(5); };
        stickyNavStep4.appendChild(btn);
    }
}

// ==========================================
// STEP 5: DOCUMENT SECTION LOGIC
// ==========================================
function showProposalSection(section) {
    // Sembunyikan semua konten section
    document.querySelectorAll('.proposal-section').forEach(el => el.classList.add('hidden'));
    
    // Tampilkan section yang dituju
    const targetSection = document.getElementById('section-' + section);
    targetSection.classList.remove('hidden');
    
    // EFEK ANIMASI: Reset lalu jalankan animasi Fade In Up
    targetSection.classList.remove('animate-fade-in-up');
    void targetSection.offsetWidth; // Trik Javascript untuk me-restart animasi
    targetSection.classList.add('animate-fade-in-up');
    
    // Reset semua tombol navigasi ke state awal
    document.querySelectorAll('.proposal-nav-btn').forEach(btn => {
        btn.classList.remove('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
        if (!btn.classList.contains('bg-gradient-to-tr')) {
            btn.classList.add('border-gray-200', 'bg-white', 'text-gray-600');
        }
    });
    
    const sections = getActiveSections();
    const sectionIndex = sections.indexOf(section);
    
    let activeNavContainerId = 'proposal-nav-buttons';
    if (documentType === 'makalah') activeNavContainerId = 'makalah-nav-buttons';
    if (documentType === 'jurnal') activeNavContainerId = 'jurnal-nav-buttons';
    if (documentType === 'skripsi') activeNavContainerId = 'skripsi-nav-buttons';
    if (documentType === 'slr') activeNavContainerId = 'slr-nav-buttons';

    // Beri styling aktif pada tombol yang sedang diklik
    const navButtons = document.querySelectorAll(`#${activeNavContainerId} .proposal-nav-btn`);
    if (navButtons[sectionIndex]) {
        if (!navButtons[sectionIndex].classList.contains('bg-gradient-to-tr')) {
            navButtons[sectionIndex].classList.remove('border-gray-200', 'bg-white', 'text-gray-600');
            navButtons[sectionIndex].classList.add('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
        }
    }
    
    currentProposalSection = section;
    if (section === 'final') showFinalReview();

    // Auto-scroll ke panel navigasi agar user tidak bingung
    const navContainer = document.getElementById(activeNavContainerId);
    if(navContainer && section !== 'final') {
        const y = navContainer.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({top: y, behavior: 'smooth'});
    }
}

function prevProposalSection(current) {
    const sections = getActiveSections();
    const currentIndex = sections.indexOf(current);
    if (currentIndex > 0) showProposalSection(sections[currentIndex - 1]);
}

function saveProposalSection(section) {
    const content = document.getElementById('output-' + section).value;
    if (!content.trim() && section !== 'hipotesis') {
        showCustomAlert('warning', 'Konten Kosong', 'Isi konten terlebih dahulu sebelum menyimpan!');
        return;
    }
    proposalData[section] = content;
    
    const sections = getActiveSections();
    const currentIndex = sections.indexOf(section);
    
    let activeNavContainerId = 'proposal-nav-buttons';
    if (documentType === 'makalah') activeNavContainerId = 'makalah-nav-buttons';
    if (documentType === 'jurnal') activeNavContainerId = 'jurnal-nav-buttons';
    if (documentType === 'skripsi') activeNavContainerId = 'skripsi-nav-buttons';
    if (documentType === 'slr') activeNavContainerId = 'slr-nav-buttons';

    const navButtons = document.querySelectorAll(`#${activeNavContainerId} .proposal-nav-btn`);
    if (navButtons[currentIndex]) {
        navButtons[currentIndex].classList.add('bg-green-50', 'border-green-500');
    }

    if (currentIndex < sections.length - 1) {
        showProposalSection(sections[currentIndex + 1]);
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
        textarea.placeholder = 'Paste hasil teks hipotesis...';
        proposalData.hipotesis = '';
    }
}

function showFinalReview() {
    document.querySelectorAll('.proposal-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('section-final').classList.remove('hidden');
    
    // Logic untuk menyembunyikan/menampilkan opsi Struktur Bab dan Tombol Download yang sesuai
    const formatContainer = document.getElementById('proposalFormatContainer');
    const btnStandard = document.getElementById('btnDownloadStandard');
    const btnJurnal = document.getElementById('btnDownloadJurnal');

    if (documentType === 'jurnal' || documentType === 'slr') {
        formatContainer.classList.add('hidden'); // Jurnal tidak butuh Bab
        btnStandard.classList.add('hidden');
        btnJurnal.classList.remove('hidden'); // Tampilkan tombol 2 kolom
    } else if (documentType === 'skripsi' || documentType === 'makalah') {
        formatContainer.classList.add('hidden'); // Skripsi dan Makalah sudah di-hardcode Bab-nya
        btnStandard.classList.remove('hidden');
        btnStandard.innerHTML = '<i class="fas fa-file-word text-2xl mr-3"></i> Download ' + (documentType === 'skripsi' ? 'Skripsi' : 'Makalah') + ' (.docx)';
        btnJurnal.classList.add('hidden');
    } else {
        // Mode Proposal
        formatContainer.classList.remove('hidden'); // Proposal butuh pilihan Mini/Bab
        btnStandard.classList.remove('hidden');
        btnStandard.innerHTML = '<i class="fas fa-file-word text-2xl mr-3"></i> Download Proposal (.docx)';
        btnJurnal.classList.add('hidden');
    }
}

// ==========================================
// EXPORT KE MS WORD LOGIC (DENGAN CUSTOM FORMATTING)
// ==========================================
function downloadDOCX() {
    // 1. Ambil Nilai dari Panel Control Formatting
    const formatChoice = document.getElementById('proposalFormat') ? document.getElementById('proposalFormat').value : 'bab';
    const paperSize = document.getElementById('settingPaper').value;
    const pageMargin = document.getElementById('settingMargin').value;
    const fontName = document.getElementById('settingFont').value;
    const lineSpacing = document.getElementById('settingSpacing').value;

    // 2. Terapkan nilai dinamis tersebut ke dalam CSS
    const styles = `
        <style>
            @page { 
                size: ${paperSize}; 
                margin: ${pageMargin}; 
            } 
            body { 
                font-family: ${fontName}; 
                font-size: 12pt; 
                line-height: ${lineSpacing}; 
                color: #000; 
            }
            h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 24pt; text-transform: uppercase; }
            h2 { font-size: 12pt; font-weight: bold; margin-top: 24pt; margin-bottom: 12pt; text-transform: uppercase; page-break-after: avoid; }
            
            .chapter-title { text-align: center; font-size: 12pt; font-weight: bold; margin-top: 24pt; margin-bottom: 24pt; text-transform: uppercase; page-break-after: avoid; }
            h3 { font-size: 12pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; page-break-after: avoid; }
            
            p { margin-top: 0; margin-bottom: 10pt; text-align: justify; text-indent: 1.25cm; } 
            
            table { border-collapse: collapse; width: 100%; margin-top: 12pt; margin-bottom: 12pt; font-size: 11pt; line-height: 1.15; }
            th, td { border: 1pt solid black; padding: 6pt 8pt; text-align: left; vertical-align: top; }
            th { background-color: #e6e6e6; font-weight: bold; text-align: center; }
            td p { text-indent: 0; margin-bottom: 4pt; } 
            
            .cover-page { text-align: center; margin-top: 100pt; page-break-after: always; }
            .cover-page h2 { text-indent: 0; text-align: center; margin-bottom: 20pt; font-size: 16pt; }
            .cover-title { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 50pt; line-height: 1.5; text-indent: 0; }
            .cover-logo { margin-bottom: 50pt; text-align: center; text-indent: 0; }
            .cover-logo img { width: 180px; height: auto; } 
            .cover-author { margin-bottom: 80pt; font-size: 12pt; text-indent: 0; line-height: 1.5; }
            .cover-inst { font-size: 14pt; font-weight: bold; text-transform: uppercase; text-indent: 0; line-height: 1.5; }
            
            .page-break { page-break-before: always; }
            .list-item { text-indent: 0; padding-left: 1.25cm; margin-bottom: 4pt; }
            .biblio-item { text-indent: -1.25cm; margin-left: 1.25cm; margin-bottom: 8pt; }

            /* FORMAT KHUSUS JURNAL & SLR (2 KOLOM) */
            .jurnal-title { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 12pt; text-transform: capitalize; line-height: 1.2;}
            .jurnal-author { font-size: 11pt; text-align: center; margin-bottom: 24pt; font-style: italic;}
            .jurnal-abstract { font-size: 10pt; text-align: justify; margin-left: 1.5cm; margin-right: 1.5cm; margin-bottom: 24pt; padding: 10pt; border-top: 1pt solid #000; border-bottom: 1pt solid #000;}
            .jurnal-abstract p { text-indent: 0; font-size: 10pt; margin-bottom: 6pt; line-height: 1.15; }
            .jurnal-body { column-count: 2; column-gap: 0.8cm; text-align: justify; }
            .jurnal-body h2 { margin-top: 12pt; margin-bottom: 6pt; font-size: 11pt; }
            .jurnal-body p { font-size: 11pt; margin-bottom: 8pt; text-indent: 0.75cm; }
            .jurnal-body .list-item { font-size: 11pt; padding-left: 0.75cm; }
            .jurnal-body .biblio-item { text-indent: -0.75cm; margin-left: 0.75cm; font-size: 10pt; }
            .jurnal-body table { font-size: 10pt; }
        </style>
    `;

    function formatTextForWord(text) {
        if (!text) return '';
        let html = text.replace(/^(Tentu, berikut|Berikut adalah|Tentu saja|Ini dia).*?:/mi, '');
        html = html.replace(/^#+\s*(.*)$/gm, '<strong>$1</strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/<br>\s*<br>/g, '</p><p>');

        const lines = html.split('\n');
        let result = '';
        let inTable = false;

        lines.forEach(line => {
            const trimmed = line.trim();
            if (/^\|?[\-\:\s\|]+\|?$/.test(trimmed) && trimmed.includes('-')) return; 

            if (trimmed.startsWith('|') || trimmed.endsWith('|')) {
                if (!inTable) { result += '<table>'; inTable = true; }
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
                if (inTable) { result += '</table>'; inTable = false; }
                if (trimmed) {
                    if (/^(\d+\.|-|\*)\s/.test(trimmed)) result += `<p class="list-item">${trimmed}</p>`;
                    else result += `<p>${trimmed}</p>`;
                }
            }
        });
        if (inTable) result += '</table>'; 
        return result;
    }

    let docContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head><meta charset='utf-8'><title>Dokumen Akademik</title>${styles}</head>
        <body>
    `;

    // --- LOGIKA PERAKITAN ---
    if (documentType === 'jurnal') {
        docContent += `<div class="jurnal-title">${selectedTitle || 'Judul Artikel Belum Dipilih'}</div>`;
        docContent += `<div class="jurnal-author">[Nama Penulis Pertama]<sup>1</sup>, [Nama Penulis Kedua]<sup>2</sup><br><sup>1,2</sup>Pontren Husnul Khotimah, Indonesia<br>Email: author@husnulkhotimah.ac.id</div>`;
        if (proposalData.jabstrak) docContent += `<div class="jurnal-abstract"><strong>Abstract — </strong>${formatTextForWord(proposalData.jabstrak)}</div>`;
        docContent += `<div class="jurnal-body">`;
        if(proposalData.jpendahuluan) docContent += `<h2>1. INTRODUCTION</h2>` + formatTextForWord(proposalData.jpendahuluan);
        if(proposalData.jmetode) docContent += `<h2>2. METHODS</h2>` + formatTextForWord(proposalData.jmetode);
        if(proposalData.jhasil) docContent += `<h2>3. RESULTS AND DISCUSSION</h2>` + formatTextForWord(proposalData.jhasil);
        if(proposalData.jkesimpulan) docContent += `<h2>4. CONCLUSION</h2>` + formatTextForWord(proposalData.jkesimpulan);
        if(proposalData.jdaftar) {
            docContent += `<h2>REFERENCES</h2>`;
            let sectionHtml = formatTextForWord(proposalData.jdaftar);
            docContent += sectionHtml.replace(/<p>/g, '<p class="biblio-item">');
        }
        docContent += `</div>`;

    } else if (documentType === 'slr') {
        docContent += `<div class="jurnal-title">${selectedTitle || 'Review Article Title'}</div>`;
        docContent += `<div class="jurnal-author">[Nama Reviewer]<sup>1</sup><br><sup>1</sup>Pontren Husnul Khotimah, Indonesia<br>Email: author@husnulkhotimah.ac.id</div>`;
        docContent += `<div class="jurnal-body">`;
        if(proposalData.slrpendahuluan) docContent += `<h2>1. INTRODUCTION</h2>` + formatTextForWord(proposalData.slrpendahuluan);
        if(proposalData.slrmetode) docContent += `<h2>2. REVIEW METHODOLOGY</h2>` + formatTextForWord(proposalData.slrmetode);
        docContent += `</div>`; // Putus kolom untuk tabel panjang
        if(proposalData.slrhasil) docContent += `<h2>3. DATA EXTRACTION RESULTS</h2>` + formatTextForWord(proposalData.slrhasil);
        docContent += `<div class="jurnal-body">`; // Sambung kolom lagi
        if(proposalData.slrpembahasan) docContent += `<h2>4. DISCUSSION</h2>` + formatTextForWord(proposalData.slrpembahasan);
        if(proposalData.slrkesimpulan) docContent += `<h2>5. CONCLUSION</h2>` + formatTextForWord(proposalData.slrkesimpulan);
        if(proposalData.slrdaftar) {
            docContent += `<h2>REFERENCES</h2>`;
            let sectionHtml = formatTextForWord(proposalData.slrdaftar);
            docContent += sectionHtml.replace(/<p>/g, '<p class="biblio-item">');
        }
        docContent += `</div>`;

    } else if (documentType === 'skripsi') {
        docContent += `
            <div class="cover-page">
                <h2>BAB IV DAN V SKRIPSI</h2>
                <div class="cover-title">${selectedTitle || 'Judul Belum Dipilih'}</div>
                <div class="cover-logo"><img src="logo1.png" alt="Logo Pontren"></div>
                <div class="cover-author">Disusun Oleh:<br><strong>[ NAMA LENGKAP MAHASISWA ]</strong><br>[ NIM ]</div>
                <div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div>
            </div>
        `;
        docContent += `<div class="chapter-title">BAB IV<br>HASIL PENELITIAN DAN PEMBAHASAN</div>`;
        if(proposalData.sdeskripsi) docContent += `<h3>4.1 Deskripsi Data Penelitian</h3>` + formatTextForWord(proposalData.sdeskripsi);
        if(proposalData.sanalisis) docContent += `<h3>4.2 Analisis Data dan Hasil Pengujian</h3>` + formatTextForWord(proposalData.sanalisis);
        if(proposalData.spembahasan) docContent += `<h3>4.3 Pembahasan Hasil Penelitian</h3>` + formatTextForWord(proposalData.spembahasan);

        docContent += `<div class="chapter-title page-break">BAB V<br>KESIMPULAN DAN SARAN</div>`;
        if(proposalData.skesimpulan) docContent += `<h3>5.1 Kesimpulan</h3>` + formatTextForWord(proposalData.skesimpulan);
        if(proposalData.ssaran) docContent += `<h3>5.2 Saran</h3>` + formatTextForWord(proposalData.ssaran);

        if(proposalData.sdaftar) {
            docContent += `<div class="chapter-title page-break">DAFTAR PUSTAKA</div>`;
            let sectionHtml = formatTextForWord(proposalData.sdaftar);
            docContent += sectionHtml.replace(/<p>/g, '<p class="biblio-item">');
        }

    } else if (documentType === 'makalah') {
        docContent += `
            <div class="cover-page">
                <h2>MAKALAH AKADEMIK</h2>
                <div class="cover-title">${selectedTitle || 'Judul Belum Dipilih'}</div>
                <div class="cover-logo"><img src="logo1.png" alt="Logo Pontren"></div>
                <div class="cover-author">Disusun Oleh:<br><strong>[ NAMA LENGKAP PENULIS ]</strong><br>[ NIP / NIDN / NIM ]</div>
                <div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div>
            </div>
        `;
        docContent += `<div class="chapter-title">BAB I<br>PENDAHULUAN</div>`;
        if(proposalData.mpendahuluan) docContent += formatTextForWord(proposalData.mpendahuluan);
        docContent += `<div class="chapter-title page-break">BAB II<br>PEMBAHASAN</div>`;
        if(proposalData.mpembahasan) docContent += formatTextForWord(proposalData.mpembahasan);
        docContent += `<div class="chapter-title page-break">BAB III<br>PENUTUP</div>`;
        if(proposalData.mpenutup) docContent += formatTextForWord(proposalData.mpenutup);
        if(proposalData.mdaftar) {
            docContent += `<div class="chapter-title page-break">DAFTAR PUSTAKA</div>`;
            let sectionHtml = formatTextForWord(proposalData.mdaftar);
            docContent += sectionHtml.replace(/<p>/g, '<p class="biblio-item">');
        }

    } else {
        docContent += `
            <div class="cover-page">
                <h2>PROPOSAL PENELITIAN</h2>
                <div class="cover-title">${selectedTitle || 'Judul Belum Dipilih'}</div>
                <div class="cover-logo"><img src="logo1.png" alt="Logo Pontren"></div>
                <div class="cover-author">Disusun Oleh:<br><strong>[ NAMA LENGKAP PENELITI ]</strong><br>[ NIP / NIDN / NIM ]</div>
                <div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div>
            </div>
        `;
        if (formatChoice === 'mini') {
            const sectionNames = { latar: 'A. Latar Belakang', rumusan: 'B. Rumusan Masalah', tujuan: 'C. Tujuan', manfaat: 'D. Manfaat', metode: 'E. Metode', landasan: 'F. Landasan Teori', hipotesis: 'G. Hipotesis', jadwal: 'H. Jadwal', daftar: 'I. Daftar Pustaka' };
            Object.keys(proposalData).forEach(function(key) {
                if (proposalData[key] && sectionNames[key]) {
                    let extraClass = (key === 'daftar') ? ' class="page-break"' : '';
                    docContent += `<h2${extraClass}>${sectionNames[key]}</h2>`;
                    let sectionHtml = formatTextForWord(proposalData[key]);
                    if (key === 'daftar') sectionHtml = sectionHtml.replace(/<p>/g, '<p class="biblio-item">');
                    docContent += sectionHtml;
                }
            });
        } else {
            docContent += `<div class="chapter-title">BAB I<br>PENDAHULUAN</div>`;
            if(proposalData.latar) docContent += `<h3>1.1 Latar Belakang Masalah</h3>` + formatTextForWord(proposalData.latar);
            if(proposalData.rumusan) docContent += `<h3>1.2 Rumusan Masalah</h3>` + formatTextForWord(proposalData.rumusan);
            if(proposalData.tujuan) docContent += `<h3>1.3 Tujuan Penelitian</h3>` + formatTextForWord(proposalData.tujuan);
            if(proposalData.manfaat) docContent += `<h3>1.4 Manfaat Penelitian</h3>` + formatTextForWord(proposalData.manfaat);

            docContent += `<div class="chapter-title page-break">BAB II<br>TINJAUAN PUSTAKA</div>`;
            if(proposalData.landasan) docContent += `<h3>2.1 Landasan Teori dan Penelitian Terdahulu</h3>` + formatTextForWord(proposalData.landasan);
            if(proposalData.hipotesis) docContent += `<h3>2.2 Hipotesis Penelitian</h3>` + formatTextForWord(proposalData.hipotesis);

            docContent += `<div class="chapter-title page-break">BAB III<br>METODE PENELITIAN</div>`;
            if(proposalData.metode) docContent += `<h3>3.1 Desain dan Pendekatan Penelitian</h3>` + formatTextForWord(proposalData.metode);
            if(proposalData.jadwal) docContent += `<h3>3.2 Jadwal dan Anggaran</h3>` + formatTextForWord(proposalData.jadwal);

            if(proposalData.daftar) {
                docContent += `<div class="chapter-title page-break">DAFTAR PUSTAKA</div>`;
                let sectionHtml = formatTextForWord(proposalData.daftar);
                docContent += sectionHtml.replace(/<p>/g, '<p class="biblio-item">');
            }
        }
    }

    docContent += '</body></html>';

    const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    
    let formatLabel = 'Dokumen';
    if (documentType === 'jurnal') formatLabel = 'JURNAL_LAPANGAN';
    else if (documentType === 'slr') formatLabel = 'JURNAL_SLR';
    else if (documentType === 'makalah') formatLabel = 'MAKALAH';
    else if (documentType === 'skripsi') formatLabel = 'SKRIPSI_BAB4_5';
    else formatLabel = formatChoice === 'bab' ? 'PROPOSAL_LENGKAP' : 'PROPOSAL_MINI';
    
    let safeFilename = selectedTitle ? selectedTitle.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') : 'Akademik';
    a.download = `${formatLabel}_${safeFilename}.doc`;
    
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
        documentType, journals, analysisData, generatedTitles, selectedTitle, proposalData, currentStep 
    };
    const jsonString = JSON.stringify(dataToSave, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_${documentType}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); 
    a.click(); 
    document.body.removeChild(a); 
    URL.revokeObjectURL(url);
    showCustomAlert('success', 'Backup Berhasil', 'Data pekerjaan Anda berhasil di-download!');
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
            if (parsed.documentType) setDocumentType(parsed.documentType);
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
            showCustomAlert('error', 'Gagal Restore', 'Pastikan file yang diupload adalah format .json yang benar.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// FITUR ENTER PADA KOLOM PENCARIAN
document.getElementById('searchKeyword').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        searchJournals();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    updateSavedJournalsList();
    document.querySelectorAll('.proposal-nav-btn').forEach(btn => {
        btn.addEventListener('click', function() { 
            showProposalSection(this.getAttribute('data-section')); 
        });
    });
});