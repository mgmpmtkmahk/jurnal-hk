// ==========================================
// FILE 3: core.js
// Fungsi: Core Logic, Prompt Generator, Export Word
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
            { name: 'Google Scholar ID', url: 'https://scholar.google.co.id/scholar?q=' + encodeURIComponent(keyword) + '&lr=lang_id', icon: 'fa-graduation-cap', color: 'red', desc: 'Google Cendikia' },
            { name: 'SINTA', url: 'https://sinta.kemdiktisaintek.go.id/', icon: 'fa-university', color: 'green', desc: 'Web SINTA' },
            { name: 'Garuda', url: 'https://garuda.kemdiktisaintek.go.id/documents?q=' + encodeURIComponent(keyword), icon: 'fa-book', color: 'yellow', desc: 'Jurnal Garuda' },
            { name: 'Neliti Indonesia', url: 'https://www.neliti.com/id/search?q=' + encodeURIComponent(keyword), icon: 'fa-search', color: 'teal', desc: 'Repository Jurnal' },
            { name: 'UI Scholars Hub', url: 'https://scholarhub.ui.ac.id/do/search/?q=' + encodeURIComponent(keyword), icon: 'fa-university', color: 'blue', desc: 'Scholarhub UI' },
            { name: 'E-Jurnal UNDIP', url: 'https://ejournal.undip.ac.id/index.php/index/search?query=' + encodeURIComponent(keyword), icon: 'fa-book-open', color: 'purple', desc: 'SINTA 2 UNDIP' },
            { name: 'Jurnal UGM', url: 'https://journal.ugm.ac.id/index/search/search?query=' + encodeURIComponent(keyword), icon: 'fa-graduation-cap', color: 'green', desc: 'Laman UGM' },
            { name: 'Digilib ITB', url: 'https://digilib.itb.ac.id/gdl/go/' + encodeURIComponent(keyword), icon: 'fa-flask', color: 'orange', desc: 'Repositori ITB' }
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
    
    if (elementId === 'step3-prompt') text = text.replace('[INSERT SEMUA DATA JURNAL DARI STEP 2]', journals.map(j => j.raw).join('\n\n---\n\n') || '[DATA KOSONG]');
    if (elementId === 'step4-prompt') text = text.replace('[INSERT RESEARCH GAP DARI STEP 3]', analysisData.raw || '[DATA GAP KOSONG]');

    const textLatar = proposalData.latar || proposalData.mpendahuluan || proposalData.jpendahuluan || proposalData.slrpendahuluan || '';
    text = text.replace(/\[KONTEKS_LATAR\]/g, textLatar.substring(0, 5000));
    text = text.replace(/\[KONTEKS_RUMUSAN\]/g, proposalData.rumusan || '');
    text = text.replace(/\[KONTEKS_TEORI\]/g, (proposalData.landasan || proposalData.mpembahasan || '').substring(0, 5000));
    text = text.replace(/\[KONTEKS_METODE\]/g, proposalData.metode || proposalData.jmetode || proposalData.slrmetode || '');
    const textHasil = (proposalData.sdeskripsi + '\n' + proposalData.sanalisis + '\n' + proposalData.spembahasan) || proposalData.jhasil || proposalData.slrhasil || '';
    text = text.replace(/\[KONTEKS_HASIL\]/g, textHasil.substring(0, 8000));

    if (elementId.includes('daftar') || elementId.includes('abstrak')) {
        let fullDraft = "";
        Object.keys(proposalData).forEach(key => { if (!key.includes('daftar') && !key.includes('abstrak') && proposalData[key]) fullDraft += `\n\n--- BAGIAN ${key.toUpperCase()} ---\n${proposalData[key]}`; });
        text = text.replace(/\[DRAF_TULISAN\]/g, fullDraft.substring(0, 25000) || "[BELUM ADA TULISAN]");
    }

    text = text.replace(/\[JUDUL\]/g, selectedTitle || '[BELUM DIPILIH]');
    text = text.replace(/\[DATA JURNAL\]/g, journals.map(j => j.raw).join('\n') || '[DATA KOSONG]');
    text = text.replace(/\[DATA JURNAL YANG DIKAJI\]/g, journals.map(j => `${j.parsed?.title || 'Judul'} (${j.parsed?.authors || 'Penulis'}, ${j.parsed?.year || 'Tahun'})`).join('; ') || '[DATA KOSONG]');
    text = text.replace(/\[GAP\]/g, analysisData.raw || '[DATA GAP KOSONG]');
    text = text.replace(/\[VARIABEL\]/g, extractVariablesFromRumusan(proposalData.rumusan));
    
    if(proposalData.rumusan) text = text.replace(/\[RUMUSAN\]/g, proposalData.rumusan);
    if(proposalData.tujuan) text = text.replace(/\[TUJUAN\]/g, proposalData.tujuan);

    const humanizerToggle = document.getElementById('humanizerToggle');
    if (humanizerToggle && humanizerToggle.checked && elementId.startsWith('prompt-')) {
        text += `\n\nATURAN ANTI-PLAGIASI & HUMANIZER:\n1. Tulis dengan gaya bahasa natural manusia (Human-like text).\n2. Tingkatkan variasi struktur (Burstiness) & kosa kata (Perplexity).\n3. HARAM menggunakan frasa AI klise: "Kesimpulannya", "Dalam era digital", "Secara keseluruhan".\n4. Lakukan parafrase tingkat tinggi pada setiap teori/jurnal agar lolos Turnitin < 5%.`;
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
    const output = document.getElementById('geminiOutputStep2').value;
    if (!output.trim()) { showCustomAlert('warning', 'Kosong', 'Paste hasil dari Gemini!'); return; }
    try {
        const parsedData = extractTableData(output);
        if (!parsedData.title) { showCustomAlert('error', 'Format Salah', 'Gagal membaca tabel. Pastikan copy utuh.'); return; }
        journals.push({ id: Date.now(), raw: output, parsed: parsedData });
        saveStateToLocal();
        updateSavedJournalsList();
        document.getElementById('geminiOutputStep2').value = '';
        showCustomAlert('success', 'Berhasil', 'Data jurnal direkam!');
    } catch (error) { showCustomAlert('error', 'Error', 'Gagal memproses teks.'); }
}

function updateSavedJournalsList() {
    const container = document.getElementById('savedJournalsList');
    if(!container) return;
    if (journals.length === 0) { container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada jurnal</p>'; return; }
    container.innerHTML = journals.map((j, index) => `<div class="bg-white border border-green-200 shadow-sm rounded-xl p-4 mb-4"><div class="flex justify-between items-center mb-3 pb-2 border-b border-gray-100"><h4 class="font-bold text-gray-800 text-lg">${index + 1}. ${j.parsed.title || 'Jurnal'}</h4><button onclick="removeJournal(${index})" class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><i class="fas fa-trash"></i></button></div><div class="text-sm max-h-60 overflow-y-auto custom-scrollbar">${renderMarkdownTable(j.raw)}</div></div>`).join('');
}

function removeJournal(index) { journals.splice(index, 1); saveStateToLocal(); updateSavedJournalsList(); }

function parseStep3Output() {
    const output = document.getElementById('geminiOutputStep3').value;
    if (!output.trim()) { showCustomAlert('warning', 'Kosong', 'Paste hasil Gemini!'); return; }
    analysisData = { raw: output, timestamp: new Date() };
    saveStateToLocal();
    renderAnalysisSummaryPreview(); 
    document.getElementById('geminiOutputStep3').value = '';
}

function renderAnalysisSummaryPreview() {
    if(!analysisData.raw) return;
    const container = document.getElementById('analysisSummary');
    if(container) container.innerHTML = `<div class="bg-white border-2 border-purple-200 shadow-sm rounded-xl p-4"><div class="flex items-center mb-3"><i class="fas fa-check-circle text-purple-600 mr-2 text-xl"></i><h4 class="font-bold text-purple-800 text-lg">Analisis Direkam</h4></div><div class="max-h-96 overflow-y-auto custom-scrollbar">${renderMarkdownTable(analysisData.raw)}</div></div>`;
}

function parseStep4Output() {
    const output = document.getElementById('geminiOutputStep4').value;
    if (!output.trim()) { showCustomAlert('warning', 'Kosong', 'Paste hasil Gemini!'); return; }
    try {
        const titles = []; 
        output.split('\n').forEach(line => {
            if (line.match(/^\|\s*\d+\s*\|/)) {
                const parts = line.split('|');
                if (parts.length >= 3) titles.push({ no: parts[1].trim(), title: parts[2].trim() });
            }
        });
        if (titles.length === 0) { showCustomAlert('error', 'Format Salah', 'Tabel judul tidak ditemukan.'); return; }
        generatedTitles = titles; 
        saveStateToLocal();
        displayTitleSelection();
        document.getElementById('geminiOutputStep4').value = '';
        showCustomAlert('success', 'Berhasil', 'Judul diekstrak.');
    } catch (error) { showCustomAlert('error', 'Error', 'Gagal memproses teks.'); }
}

function displayTitleSelection() {
    const container = document.getElementById('titleSelectionList');
    if(!container) return;
    if (generatedTitles.length === 0) { container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada judul</p>'; return; }
    container.innerHTML = generatedTitles.map((item, index) => {
        const cleanT = cleanMarkdown(item.title); const escT = cleanT.replace(/'/g, "\\'").replace(/"/g, "&quot;");
        return `<div class="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-yellow-500 cursor-pointer transition-all card-hover title-card" data-title="${escT}" data-index="${index}"><div class="flex items-start"><div class="bg-yellow-100 text-yellow-700 w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0 text-lg">${item.no}</div><div class="flex-1"><h4 class="text-gray-800 text-lg mb-2 leading-snug">${cleanT}</h4></div></div></div>`;
    }).join('');
    
    document.querySelectorAll('.title-card').forEach(card => card.addEventListener('click', function() {
        selectTitleForProposal(this.getAttribute('data-title').replace(/<[^>]*>?/gm, ''), this);
    }));
}

function selectTitleForProposal(title, element) {
    const hasData = Object.values(proposalData).some(val => val && val.length > 10);
    const executeSwitch = () => {
        proposalData = { latar: '', rumusan: '', tujuan: '', manfaat: '', metode: '', landasan: '', hipotesis: '', jadwal: '', daftar: '', mpendahuluan: '', mpembahasan: '', mpenutup: '', mdaftar: '', jpendahuluan: '', jmetode: '', jhasil: '', jkesimpulan: '', jabstrak: '', jdaftar: '', sdeskripsi: '', sanalisis: '', spembahasan: '', skesimpulan: '', ssaran: '', sdaftar: '', slrpendahuluan: '', slrmetode: '', slrhasil: '', slrpembahasan: '', slrkesimpulan: '', slrabstrak: '', slrdaftar: '' };
        document.querySelectorAll('textarea[id^="output-"]').forEach(el => el.value = '');
        document.querySelectorAll('.title-card').forEach(div => { div.classList.remove('border-yellow-500', 'bg-yellow-50'); div.classList.add('border-gray-200'); });
        element.classList.remove('border-gray-200'); element.classList.add('border-yellow-500', 'bg-yellow-50');
        
        selectedTitle = title;
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
    if (hasData && selectedTitle && selectedTitle !== title) showWarningModal(executeSwitch); else executeSwitch();
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
    let containerId = documentType === 'makalah' ? 'makalah-nav-buttons' : documentType === 'jurnal' ? 'jurnal-nav-buttons' : documentType === 'skripsi' ? 'skripsi-nav-buttons' : documentType === 'slr' ? 'slr-nav-buttons' : 'proposal-nav-buttons';
    
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
    
    proposalData[section] = content;
    saveStateToLocal(); 
    
    const s = getActiveSections(); const i = s.indexOf(section);
    let cid = documentType === 'makalah' ? 'makalah-nav-buttons' : documentType === 'jurnal' ? 'jurnal-nav-buttons' : documentType === 'skripsi' ? 'skripsi-nav-buttons' : documentType === 'slr' ? 'slr-nav-buttons' : 'proposal-nav-buttons';
    const btn = document.querySelectorAll(`#${cid} .proposal-nav-btn`)[i]; if (btn) btn.classList.add('bg-green-50', 'border-green-500');
    
    if (i < s.length - 1) showProposalSection(s[i + 1]); else showFinalReview();
}

function toggleHipotesis() {
    const cb = document.getElementById('skip-hipotesis'); const ta = document.getElementById('output-hipotesis');
    if(!cb || !ta) return;
    if (cb.checked) { ta.disabled = true; ta.placeholder = 'Dilewati'; proposalData.hipotesis = '(Penelitian kualitatif)'; } 
    else { ta.disabled = false; ta.placeholder = 'Paste teks...'; proposalData.hipotesis = ''; }
}

function showFinalReview() {
    document.querySelectorAll('.proposal-section').forEach(el => el.classList.add('hidden'));
    document.getElementById('section-final').classList.remove('hidden');
    
    const formatContainer = document.getElementById('proposalFormatContainer');
    const btnStandard = document.getElementById('btnDownloadStandard');
    const btnJurnal = document.getElementById('btnDownloadJurnal');

    if (documentType === 'jurnal' || documentType === 'slr') {
        formatContainer.classList.add('hidden'); btnStandard.classList.add('hidden'); btnJurnal.classList.remove('hidden');
    } else if (documentType === 'skripsi' || documentType === 'makalah') {
        formatContainer.classList.add('hidden'); btnStandard.classList.remove('hidden'); btnJurnal.classList.add('hidden');
        btnStandard.innerHTML = `<i class="fas fa-file-word text-2xl mr-3"></i> Download ${documentType === 'skripsi' ? 'Skripsi' : 'Makalah'} (.docx)`;
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
            body { font-family: ${fontName}; font-size: 12pt; line-height: ${lineSpacing}; color: #000; }
            h1 { font-size: 14pt; font-weight: bold; text-align: center; margin-bottom: 24pt; text-transform: uppercase; }
            h2 { font-size: 12pt; font-weight: bold; margin-top: 24pt; margin-bottom: 12pt; text-transform: uppercase; page-break-after: avoid; }
            .chapter-title { text-align: center; font-size: 12pt; font-weight: bold; margin-top: 24pt; margin-bottom: 24pt; text-transform: uppercase; page-break-after: avoid; }
            h3 { font-size: 12pt; font-weight: bold; margin-top: 18pt; margin-bottom: 6pt; page-break-after: avoid; }
            p { margin-top: 0; margin-bottom: 10pt; text-align: justify; text-indent: 1.25cm; } 
            table { border-collapse: collapse; width: 100%; margin-top: 12pt; margin-bottom: 12pt; font-size: 11pt; line-height: 1.15; }
            th, td { border: 1pt solid black; padding: 6pt 8pt; text-align: left; vertical-align: top; }
            th { background-color: #f2f2f2; font-weight: bold; text-align: center; }
            td p { text-indent: 0; margin-bottom: 4pt; } 
            .cover-page { text-align: center; margin-top: 100pt; page-break-after: always; }
            .cover-title { font-size: 16pt; font-weight: bold; text-transform: uppercase; margin-bottom: 50pt; line-height: 1.5; text-indent: 0; }
            .cover-author { margin-bottom: 80pt; font-size: 12pt; text-indent: 0; line-height: 1.5; font-weight: bold; }
            .cover-inst { font-size: 14pt; font-weight: bold; text-transform: uppercase; text-indent: 0; line-height: 1.5; }
            .page-break { page-break-before: always; }
            .list-item { text-indent: 0; padding-left: 1.25cm; margin-bottom: 4pt; }
            .biblio-item { text-indent: -1.25cm; margin-left: 1.25cm; margin-bottom: 8pt; }

            /* FORMAT JURNAL & SLR KHUSUS */
            .jurnal-title { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 12pt; text-transform: capitalize; line-height: 1.2; }
            .jurnal-author { font-size: 11pt; text-align: center; margin-bottom: 24pt; font-style: italic; }
            .jurnal-abstract { font-size: 10pt; text-align: justify; margin-left: 1.5cm; margin-right: 1.5cm; margin-bottom: 24pt; padding: 10pt; border-top: 1pt solid #000; border-bottom: 1pt solid #000; }
            .jurnal-abstract p { text-indent: 0; font-size: 10pt; margin-bottom: 6pt; line-height: 1.15; }
            .jurnal-body { column-count: 2; column-gap: 0.8cm; text-align: justify; }
            .jurnal-body h2 { margin-top: 12pt; margin-bottom: 6pt; font-size: 11pt; }
            .jurnal-body p { font-size: 11pt; margin-bottom: 8pt; text-indent: 0.75cm; }
            .jurnal-body .list-item { font-size: 11pt; padding-left: 0.75cm; }
            .jurnal-body .biblio-item { text-indent: -0.75cm; margin-left: 0.75cm; font-size: 10pt; }
            .jurnal-body table { font-size: 9pt; } 
        </style>
    `;

    function formatTextForWord(text) {
        if (!text) return '';
        let html = text.replace(/^(Tentu, berikut|Berikut adalah|Tentu saja|Ini dia|Baik, ini).*?:/mi, '');
        html = html.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'); 
        html = html.replace(/\*(.*?)\*/g, '<i>$1</i>');
        html = html.replace(/^#+\s*(.*)$/gm, '<b>$1</b>');
        html = html.replace(/\n\s*\n/g, '</p><p>');

        const lines = html.split('\n');
        let result = ''; let inTable = false;

        lines.forEach(line => {
            let trimmed = line.trim();
            if (!trimmed) return;
            if (trimmed.startsWith('|') || trimmed.endsWith('|')) {
                if (trimmed.includes('---')) return;
                if (!inTable) { result += '<table>'; inTable = true; }
                let rowHtml = '<tr>';
                let cells = trimmed.split('|').map(c => c.trim());
                if (cells[0] === '') cells.shift(); if (cells[cells.length - 1] === '') cells.pop();
                cells.forEach(cell => {
                    let cleanCell = cell.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/<br>/g, '<br/>'); 
                    if (result.endsWith('<table>')) rowHtml += `<th>${cleanCell}</th>`;
                    else rowHtml += `<td>${cleanCell}</td>`;
                });
                rowHtml += '</tr>'; result += rowHtml;
            } else {
                if (inTable) { result += '</table>'; inTable = false; }
                if (/^(\d+\.|-|\*)\s/.test(trimmed)) {
                    let content = trimmed.replace(/^(\d+\.|-|\*)\s/, '');
                    result += `<p class="list-item">• ${content}</p>`;
                } else { result += `<p>${trimmed}</p>`; }
            }
        });
        if (inTable) result += '</table>'; return result;
    }

    let docContent = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Doc</title>${styles}</head><body>`;

    // Logika Artikel Jurnal
    if (documentType === 'jurnal') {
        docContent += `<div class="jurnal-title">${selectedTitle || 'Judul Artikel Belum Dipilih'}</div>`;
        docContent += `<div class="jurnal-author">[Nama Penulis]<sup>1</sup>, [Nama Penulis 2]<sup>2</sup><br><sup>1,2</sup>Pontren Husnul Khotimah, Indonesia<br>Email: author@husnulkhotimah.ac.id</div>`;
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
    } 
    // Logika SLR (dengan penambahan Abstrak)
    else if (documentType === 'slr') {
        docContent += `<div class="jurnal-title">${selectedTitle || 'Review Article Title'}</div>`;
        docContent += `<div class="jurnal-author">[Nama Reviewer]<sup>1</sup><br><sup>1</sup>Pontren Husnul Khotimah, Indonesia</div>`;
        
        if (proposalData.slrabstrak) docContent += `<div class="jurnal-abstract"><strong>Abstract — </strong>${formatTextForWord(proposalData.slrabstrak)}</div>`;
        
        docContent += `<div class="jurnal-body">`;
        if(proposalData.slrpendahuluan) docContent += `<h2>1. INTRODUCTION</h2>` + formatTextForWord(proposalData.slrpendahuluan);
        if(proposalData.slrmetode) docContent += `<h2>2. REVIEW METHODOLOGY</h2>` + formatTextForWord(proposalData.slrmetode);
        docContent += `</div>`; // Break column 2 ke kolom 1 untuk mencegah tabel terpotong terlalu panjang
        
        if(proposalData.slrhasil) docContent += `<h2>3. DATA EXTRACTION RESULTS</h2>` + formatTextForWord(proposalData.slrhasil);
        
        docContent += `<div class="jurnal-body">`;
        if(proposalData.slrpembahasan) docContent += `<h2>4. DISCUSSION</h2>` + formatTextForWord(proposalData.slrpembahasan);
        if(proposalData.slrkesimpulan) docContent += `<h2>5. CONCLUSION</h2>` + formatTextForWord(proposalData.slrkesimpulan);
        if(proposalData.slrdaftar) {
            docContent += `<h2>REFERENCES</h2>`;
            let sectionHtml = formatTextForWord(proposalData.slrdaftar);
            docContent += sectionHtml.replace(/<p>/g, '<p class="biblio-item">');
        }
        docContent += `</div>`;
    }
    // Logika Skripsi
    else if (documentType === 'skripsi') {
        docContent += `<div class="cover-page"><h2>BAB IV DAN V SKRIPSI</h2><div class="cover-title">${selectedTitle || 'Judul Belum Dipilih'}</div><div class="cover-author">Disusun Oleh:<br><strong>[ NAMA MAHASISWA ]</strong></div><div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div></div>`;
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
    }
    // Logika Makalah
    else if (documentType === 'makalah') {
        docContent += `<div class="cover-page"><h2>MAKALAH AKADEMIK</h2><div class="cover-title">${selectedTitle || 'Judul Belum Dipilih'}</div><div class="cover-author">Disusun Oleh:<br><strong>[ NAMA PENULIS ]</strong></div><div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div></div>`;
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
    }
    // Logika Proposal
    else {
        docContent += `<div class="cover-page"><h2>PROPOSAL PENELITIAN</h2><div class="cover-title">${selectedTitle || 'Judul Belum Dipilih'}</div><div class="cover-author">Disusun Oleh:<br><strong>[ NAMA PENELITI ]</strong></div><div class="cover-inst">PONTREN HUSNUL KHOTIMAH<br>${new Date().getFullYear()}</div></div>`;
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

    // Eksekusi Download
    if (typeof htmlDocx !== 'undefined') {
        const converted = htmlDocx.asBlob(docContent);
        const url = URL.createObjectURL(converted);
        const a = document.createElement('a'); a.href = url;
        let safeFilename = selectedTitle ? selectedTitle.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') : 'Dokumen';
        a.download = `${documentType.toUpperCase()}_${safeFilename}.docx`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    } else {
        const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url;
        a.download = `${documentType.toUpperCase()}_Dokumen.doc`;
        document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    }
}