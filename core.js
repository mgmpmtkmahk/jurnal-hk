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
            { name: 'Google Scholar Indonesia', url: 'https://scholar.google.co.id/scholar?q=' + encodeURIComponent(keyword) + '&lr=lang_id', icon: 'fa-graduation-cap', color: 'red', desc: 'Pencarian Jurnal di Google Cendikia' },
            { name: 'SINTA (Kemdiktisaintek)', url: 'https://sinta.kemdiktisaintek.go.id/', icon: 'fa-university', color: 'green', desc: 'Pencarian Jurnal di Web SINTA' },
            { name: 'Garuda (Kemdiktisaintek)', url: 'https://garuda.kemdiktisaintek.go.id/documents?q=' + encodeURIComponent(keyword), icon: 'fa-book', color: 'yellow', desc: 'Pencarian Jurnal di Web Garuda' },
            { name: 'Neliti Indonesia', url: 'https://www.neliti.com/id/search?q=' + encodeURIComponent(keyword), icon: 'fa-search', color: 'teal', desc: 'Pencarian di Repository Jurnal Indonesia' },
            { name: 'UI Scholars Hub', url: 'https://scholarhub.ui.ac.id/do/search/?q=' + encodeURIComponent(keyword), icon: 'fa-university', color: 'blue', desc: 'Pencarian Jurnal di Scholarhub UI' },
            { name: 'E-Jurnal System Portal UNDIP', url: 'https://ejournal.undip.ac.id/index.php/index/search?query=' + encodeURIComponent(keyword), icon: 'fa-book-open', color: 'purple', desc: 'Pencarian Jurnal di Portal UNDIP' },
            { name: 'Jurnal Online UGM', url: 'https://journal.ugm.ac.id/index/search/search?query=' + encodeURIComponent(keyword), icon: 'fa-graduation-cap', color: 'green', desc: 'Pencarian Jurnal di Laman UGM' },
            { name: 'Perpustakaan Digital ITB', url: 'https://digilib.itb.ac.id/gdl/go/' + encodeURIComponent(keyword), icon: 'fa-flask', color: 'orange', desc: 'Pencarian Jurnal di Repositori ITB' }
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
        Object.keys(proposalData).forEach(key => { if (!key.includes('daftar') && proposalData[key]) fullDraft += `\n\n--- BAGIAN ${key.toUpperCase()} ---\n${proposalData[key]}`; });
        text = text.replace(/\[DRAF_TULISAN\]/g, fullDraft.substring(0, 25000) || "[BELUM ADA TULISAN]");
    }

    text = text.replace(/\[JUDUL\]/g, selectedTitle || '[BELUM DIPILIH]');
    text = text.replace(/\[DATA JURNAL\]/g, journals.map(j => j.raw).join('\n') || '[DATA KOSONG]');
    text = text.replace(/\[DATA JURNAL YANG DIKAJI\]/g, journals.map(j => `${j.parsed.title} (${j.parsed.authors}, ${j.parsed.year})`).join('; ') || '[DATA KOSONG]');
    text = text.replace(/\[GAP\]/g, analysisData.raw || '[DATA GAP KOSONG]');
    text = text.replace(/\[VARIABEL\]/g, extractVariablesFromRumusan(proposalData.rumusan));
    
    if(proposalData.rumusan) text = text.replace(/\[RUMUSAN\]/g, proposalData.rumusan);
    if(proposalData.tujuan) text = text.replace(/\[TUJUAN\]/g, proposalData.tujuan);

    const humanizerToggle = document.getElementById('humanizerToggle');
    if (humanizerToggle && humanizerToggle.checked && elementId.startsWith('prompt-')) {
        text += `\n\nATURAN ANTI-PLAGIASI & HUMANIZER:\n1. Tulis dengan gaya bahasa natural manusia (Human-like text).\n2. Tingkatkan variasi struktur (Burstiness) & kosa kata (Perplexity).\n3. HARAM menggunakan frasa AI klise: "Kesimpulannya", "Dalam era digital".\n4. Lakukan parafrase tingkat tinggi pada setiap teori/jurnal agar lolos Turnitin < 5%.`;
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
        if (!parsedData.title) { showCustomAlert('error', 'Format Salah', 'Gagal membaca tabel.'); return; }
        journals.push({ id: Date.now(), raw: output, parsed: parsedData });
        saveStateToLocal(); // Auto Save
        updateSavedJournalsList();
        document.getElementById('geminiOutputStep2').value = '';
        showCustomAlert('success', 'Berhasil', 'Data jurnal direkam!');
    } catch (error) { showCustomAlert('error', 'Error', 'Gagal memproses teks.'); }
}

function updateSavedJournalsList() {
    const container = document.getElementById('savedJournalsList');
    if (journals.length === 0) { container.innerHTML = '<p class="text-gray-500 text-center py-4">Belum ada jurnal</p>'; return; }
    container.innerHTML = journals.map((j, index) => `<div class="bg-white border border-green-200 shadow-sm rounded-xl p-4 mb-4"><div class="flex justify-between items-center mb-3 pb-2 border-b border-gray-100"><h4 class="font-bold text-gray-800 text-lg">${index + 1}. ${j.parsed.title || 'Jurnal'}</h4><button onclick="removeJournal(${index})" class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded"><i class="fas fa-trash"></i></button></div><div class="text-sm max-h-60 overflow-y-auto custom-scrollbar">${renderMarkdownTable(j.raw)}</div></div>`).join('');
}

function removeJournal(index) { journals.splice(index, 1); saveStateToLocal(); updateSavedJournalsList(); }

function parseStep3Output() {
    const output = document.getElementById('geminiOutputStep3').value;
    if (!output.trim()) { showCustomAlert('warning', 'Kosong', 'Paste hasil Gemini!'); return; }
    analysisData = { raw: output, timestamp: new Date() };
    saveStateToLocal(); // Auto Save
    renderAnalysisSummaryPreview(); 
    document.getElementById('geminiOutputStep3').value = '';
}

function renderAnalysisSummaryPreview() {
    if(!analysisData.raw) return;
    document.getElementById('analysisSummary').innerHTML = `<div class="bg-white border-2 border-purple-200 shadow-sm rounded-xl p-4"><div class="flex items-center mb-3"><i class="fas fa-check-circle text-purple-600 mr-2 text-xl"></i><h4 class="font-bold text-purple-800 text-lg">Analisis Direkam</h4></div><div class="max-h-96 overflow-y-auto custom-scrollbar">${renderMarkdownTable(analysisData.raw)}</div></div>`;
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
        saveStateToLocal(); // Auto Save
        displayTitleSelection();
        document.getElementById('geminiOutputStep4').value = '';
        showCustomAlert('success', 'Berhasil', 'Judul diekstrak.');
    } catch (error) { showCustomAlert('error', 'Error', 'Gagal memproses teks.'); }
}

function displayTitleSelection() {
    const container = document.getElementById('titleSelectionList');
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
    const hasData = Object.values(proposalData).some(val => val.length > 10);
    const executeSwitch = () => {
        proposalData = { latar: '', rumusan: '', tujuan: '', manfaat: '', metode: '', landasan: '', hipotesis: '', jadwal: '', daftar: '', mpendahuluan: '', mpembahasan: '', mpenutup: '', mdaftar: '', jpendahuluan: '', jmetode: '', jhasil: '', jkesimpulan: '', jabstrak: '', jdaftar: '', sdeskripsi: '', sanalisis: '', spembahasan: '', skesimpulan: '', ssaran: '', sdaftar: '', slrpendahuluan: '', slrmetode: '', slrhasil: '', slrpembahasan: '', slrkesimpulan: '', slrdaftar: '' };
        document.querySelectorAll('textarea[id^="output-"]').forEach(el => el.value = '');
        document.querySelectorAll('.title-card').forEach(div => { div.classList.remove('border-yellow-500', 'bg-yellow-50'); div.classList.add('border-gray-200'); });
        element.classList.remove('border-gray-200'); element.classList.add('border-yellow-500', 'bg-yellow-50');
        
        selectedTitle = title;
        saveStateToLocal(); // Auto Save
        
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
    target.classList.remove('hidden', 'animate-fade-in-up'); void target.offsetWidth; target.classList.add('animate-fade-in-up');
    
    document.querySelectorAll('.proposal-nav-btn').forEach(btn => {
        btn.classList.remove('border-indigo-500', 'bg-indigo-50', 'text-indigo-700');
        if (!btn.classList.contains('bg-gradient-to-tr')) btn.classList.add('border-gray-200', 'bg-white', 'text-gray-600');
    });
    
    const sections = getActiveSections();
    let containerId = documentType === 'makalah' ? 'makalah-nav-buttons' : documentType === 'jurnal' ? 'jurnal-nav-buttons' : documentType === 'skripsi' ? 'skripsi-nav-buttons' : documentType === 'slr' ? 'slr-nav-buttons' : 'proposal-nav-buttons';
    
    const navBtn = document.querySelectorAll(`#${containerId} .proposal-nav-btn`)[sections.indexOf(section)];
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
    saveStateToLocal(); // Auto Save
    
    const s = getActiveSections(); const i = s.indexOf(section);
    let cid = documentType === 'makalah' ? 'makalah-nav-buttons' : documentType === 'jurnal' ? 'jurnal-nav-buttons' : documentType === 'skripsi' ? 'skripsi-nav-buttons' : documentType === 'slr' ? 'slr-nav-buttons' : 'proposal-nav-buttons';
    const btn = document.querySelectorAll(`#${cid} .proposal-nav-btn`)[i]; if (btn) btn.classList.add('bg-green-50', 'border-green-500');
    
    if (i < s.length - 1) showProposalSection(s[i + 1]); else showFinalReview();
}

function toggleHipotesis() {
    const cb = document.getElementById('skip-hipotesis'); const ta = document.getElementById('output-hipotesis');
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

// ==========================================
// EXPORT KE MS WORD LOGIC (.DOCX NATIVE)
// ==========================================
function downloadDOCX() {
    const formatChoice = document.getElementById('proposalFormat') ? document.getElementById('proposalFormat').value : 'bab';
    const paperSize = document.getElementById('settingPaper').value;
    const pageMargin = document.getElementById('settingMargin').value;
    const fontName = document.getElementById('settingFont').value;
    const lineSpacing = document.getElementById('settingSpacing').value;

    const styles = `<style>
        @page { size: ${paperSize}; margin: ${pageMargin}; } 
        body { font-family: ${fontName}; font-size: 12pt; line-height: ${lineSpacing}; } 
        h1, h2, h3 { font-weight: bold; page-break-after: avoid; } 
        p { text-align: justify; text-indent: 1.25cm; margin-bottom: 10pt; } 
        table { border-collapse: collapse; width: 100%; font-size: 11pt; } 
        th, td { border: 1pt solid black; padding: 6pt; text-align: left; } 
        th { background-color: #f2f2f2; text-align: center; } 
        .cover-page { text-align: center; margin-top: 100pt; page-break-after: always; } 
        .jurnal-body { column-count: 2; column-gap: 0.8cm; text-align: justify; } 
        .page-break { page-break-before: always; }
    </style>`;

    function formatTextForWord(text) {
        if (!text) return '';
        let html = text
            .replace(/^(Tentu, berikut|Berikut adalah|Tentu saja|Ini dia|Baik, ini).*?:/mi, '')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\*(.*?)\*/g, '<i>$1</i>')
            .replace(/^#+\s*(.*)$/gm, '<b>$1</b>')
            .replace(/\n\s*\n/g, '</p><p>');
            
        const lines = html.split('\n'); 
        let result = ''; 
        let inTable = false;
        
        lines.forEach(line => {
            let t = line.trim(); if (!t) return;
            if (t.startsWith('|') || t.endsWith('|')) {
                if (t.includes('---')) return;
                if (!inTable) { result += '<table>'; inTable = true; }
                let cells = t.split('|').map(c => c.trim().replace(/\*\*(.*?)\*\*/g, '<b>$1</b>'));
                if (cells[0] === '') cells.shift(); if (cells[cells.length - 1] === '') cells.pop();
                result += '<tr>' + cells.map(c => result.endsWith('<table>') ? `<th>${c}</th>` : `<td>${c}</td>`).join('') + '</tr>';
            } else {
                if (inTable) { result += '</table>'; inTable = false; }
                result += /^(\d+\.|-|\*)\s/.test(t) ? `<p style="text-indent:0; padding-left: 1.25cm;">• ${t.replace(/^(\d+\.|-|\*)\s/, '')}</p>` : `<p>${t}</p>`;
            }
        });
        if (inTable) result += '</table>'; 
        return result;
    }

    let docContent = `<!DOCTYPE html><html><head><meta charset='utf-8'><title>Doc</title>${styles}</head><body>`;

    if (documentType === 'jurnal' || documentType === 'slr') {
        docContent += `<h2 style="text-align:center;">${selectedTitle || 'Judul'}</h2><p style="text-align:center; text-indent:0;">Penulis<br>Institusi</p>`;
        docContent += `<div class="jurnal-body">` + Object.keys(proposalData).filter(k => proposalData[k]).map(k => `<h3>${k.toUpperCase()}</h3>` + formatTextForWord(proposalData[k])).join('') + `</div>`;
    } else {
        docContent += `<div class="cover-page"><h2>${documentType.toUpperCase()}</h2><br><br><br><h1>${selectedTitle || 'Judul'}</h1></div>`;
        Object.keys(proposalData).forEach(k => {
            if (proposalData[k]) docContent += `<h2 class="page-break">${k.toUpperCase()}</h2>` + formatTextForWord(proposalData[k]);
        });
    }

    docContent += '</body></html>';

    // Cek apakah library htmlDocx berhasil dimuat dari index.html
    if (typeof htmlDocx !== 'undefined') {
        // GENERATE .DOCX NATIVE
        const converted = htmlDocx.asBlob(docContent);
        const url = URL.createObjectURL(converted);
        const a = document.createElement('a');
        a.href = url;
        let safeFilename = selectedTitle ? selectedTitle.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_') : 'Dokumen';
        a.download = `${documentType.toUpperCase()}_${safeFilename}.docx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } else {
        // FALLBACK: Jika library gagal dimuat (misal karena internet putus), gunakan cara lama (.doc)
        console.warn("Library html-docx tidak ditemukan, menggunakan fallback ekspor .doc");
        const blob = new Blob(['\ufeff', docContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${documentType.toUpperCase()}_Dokumen.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}