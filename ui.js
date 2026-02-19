// ==========================================
// FILE 2: ui.js
// Fungsi: Navigasi Halaman, Modals, Event Listeners, UI Helpers
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

    updateSidebarLock(step);
    saveStateToLocal(); // Trigger Auto-save
}

function updateSidebarLock(step) {
    const sidebar = document.getElementById('btn-mode-proposal').parentElement;
    if (step >= 4) {
        sidebar.classList.add('opacity-50', 'pointer-events-none', 'grayscale');
    } else {
        sidebar.classList.remove('opacity-50', 'pointer-events-none', 'grayscale');
    }
}

function setDocumentType(type) {
    documentType = type;
    const titleStep5 = document.getElementById('step5-title');
    
    const btnStyles = {
        proposal: { id: 'btn-mode-proposal', active: "ring-indigo-300 bg-indigo-600 text-white", inactive: "bg-indigo-50 text-indigo-600" },
        skripsi: { id: 'btn-mode-skripsi', active: "ring-yellow-300 bg-yellow-600 text-white", inactive: "bg-yellow-50 text-yellow-600" },
        makalah: { id: 'btn-mode-makalah', active: "ring-emerald-300 bg-emerald-600 text-white", inactive: "bg-emerald-50 text-emerald-600" },
        jurnal: { id: 'btn-mode-jurnal', active: "ring-teal-300 bg-teal-600 text-white", inactive: "bg-teal-50 text-teal-600" },
        slr: { id: 'btn-mode-slr', active: "ring-purple-300 bg-purple-600 text-white", inactive: "bg-purple-50 text-purple-600" }
    };

    Object.keys(btnStyles).forEach(key => {
        const btn = document.getElementById(btnStyles[key].id);
        btn.className = `w-12 h-12 rounded-xl flex items-center justify-center transition-all group relative shadow-sm border ${btnStyles[key].inactive}`;
    });

    ['proposal', 'makalah', 'jurnal', 'skripsi', 'slr'].forEach(nav => {
        const el = document.getElementById(`${nav}-nav-buttons`);
        el.classList.add('hidden'); el.classList.remove('grid');
    });
    
    const activeBtn = document.getElementById(btnStyles[type].id);
    activeBtn.className = `w-12 h-12 rounded-xl flex items-center justify-center transition-all group relative shadow-lg transform scale-110 ring-2 ring-offset-1 border-transparent ${btnStyles[type].active}`;

    if (type === 'proposal') {
        document.getElementById('proposal-nav-buttons').classList.remove('hidden'); document.getElementById('proposal-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Proposal (Bab 1-3)";
        if(typeof showProposalSection === 'function') showProposalSection('latar');
    } else if (type === 'makalah') {
        document.getElementById('makalah-nav-buttons').classList.remove('hidden'); document.getElementById('makalah-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Makalah (Standar Akademik)";
        if(typeof showProposalSection === 'function') showProposalSection('mpendahuluan');
    } else if (type === 'jurnal') {
        document.getElementById('jurnal-nav-buttons').classList.remove('hidden'); document.getElementById('jurnal-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Artikel Jurnal";
        if(typeof showProposalSection === 'function') showProposalSection('jpendahuluan');
    } else if (type === 'skripsi') {
        document.getElementById('skripsi-nav-buttons').classList.remove('hidden'); document.getElementById('skripsi-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan Skripsi Akhir (Bab 4 & 5)";
        if(typeof showProposalSection === 'function') showProposalSection('sdeskripsi');
    } else if (type === 'slr') {
        document.getElementById('slr-nav-buttons').classList.remove('hidden'); document.getElementById('slr-nav-buttons').classList.add('grid');
        titleStep5.innerText = "Langkah 5: Penyusunan SLR";
        if(typeof showProposalSection === 'function') showProposalSection('slrpendahuluan');
    }
    
    saveStateToLocal(); // Trigger Auto-save
    showCustomAlert('success', 'Mode Diperbarui', `Sistem dialihkan ke Mode ${type.toUpperCase()}.`);
}

function getActiveSections() {
    if (documentType === 'proposal') return ['latar', 'rumusan', 'tujuan', 'manfaat', 'metode', 'landasan', 'hipotesis', 'jadwal', 'daftar', 'final'];
    if (documentType === 'makalah') return ['mpendahuluan', 'mpembahasan', 'mpenutup', 'mdaftar', 'final'];
    if (documentType === 'jurnal') return ['jpendahuluan', 'jmetode', 'jhasil', 'jkesimpulan', 'jabstrak', 'jdaftar', 'final'];
    if (documentType === 'skripsi') return ['sdeskripsi', 'sanalisis', 'spembahasan', 'skesimpulan', 'ssaran', 'sdaftar', 'final'];
    if (documentType === 'slr') return ['slrpendahuluan', 'slrmetode', 'slrhasil', 'slrpembahasan', 'slrkesimpulan', 'slrdaftar', 'final'];
}

function showCustomAlert(type, title, message) {
    const modal = document.getElementById('customAlertModal');
    const card = document.getElementById('customAlertCard');
    const iconDiv = document.getElementById('customAlertIcon');
    
    iconDiv.className = 'w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto';
    if (type === 'success') { 
        iconDiv.classList.add('bg-green-100', 'text-green-600'); iconDiv.innerHTML = '<i class="fas fa-check"></i>'; 
    } else if (type === 'error') { 
        iconDiv.classList.add('bg-red-100', 'text-red-600'); iconDiv.innerHTML = '<i class="fas fa-times"></i>'; 
    } else { 
        iconDiv.classList.add('bg-yellow-100', 'text-yellow-600'); iconDiv.innerHTML = '<i class="fas fa-exclamation"></i>'; 
    }
    
    document.getElementById('customAlertTitle').innerText = title; 
    document.getElementById('customAlertMessage').innerText = message;
    
    modal.classList.remove('hidden'); void modal.offsetWidth; 
    card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100');
}

function closeCustomAlert() {
    const modal = document.getElementById('customAlertModal'); const card = document.getElementById('customAlertCard');
    card.classList.remove('scale-100', 'opacity-100'); card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function showConfirmModal() {
    const modal = document.getElementById('customConfirmModal'); const card = document.getElementById('customConfirmCard');
    modal.classList.remove('hidden'); void modal.offsetWidth;
    card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100');
}

function closeConfirmModal() {
    const modal = document.getElementById('customConfirmModal'); const card = document.getElementById('customConfirmCard');
    card.classList.remove('scale-100', 'opacity-100'); card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function showWarningModal(onConfirm) {
    const modal = document.getElementById('customWarningModal');
    const card = document.getElementById('customWarningCard');
    const btnConfirm = document.getElementById('btnConfirmSwitchTitle');
    
    const newBtn = btnConfirm.cloneNode(true);
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
    newBtn.addEventListener('click', function() { closeWarningModal(); onConfirm(); });

    modal.classList.remove('hidden');
    setTimeout(() => { card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100'); }, 10);
}

function closeWarningModal() {
    const modal = document.getElementById('customWarningModal'); const card = document.getElementById('customWarningCard');
    card.classList.remove('scale-100', 'opacity-100'); card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}

function cleanMarkdown(str) {
    if (!str) return '';
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
              .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>'); 
}

function renderMarkdownTable(mdText) {
    if (!mdText) return '<p class="text-gray-500 text-sm italic">Tidak ada data.</p>';
    const lines = mdText.replace(/\r\n/g, '\n').split('\n');
    let html = '<div class="mt-3 overflow-hidden rounded-lg border border-gray-200 shadow-sm"><div class="overflow-x-auto"><table class="min-w-full text-sm text-left border-collapse bg-white">';
    let isHeader = true, hasTable = false;
    
    lines.forEach(line => {
        let trimmed = line.trim();
        if (/^\|?[\-\:\s\|]+\|?$/.test(trimmed) && trimmed.includes('-')) { if (hasTable && isHeader) isHeader = false; return; }
        if (trimmed === '---' || trimmed === '***') {
            if (hasTable) { html += '</table></div></div><div class="mt-4 overflow-hidden rounded-lg border border-gray-200 shadow-sm"><div class="overflow-x-auto"><table class="min-w-full text-sm text-left border-collapse bg-white">'; isHeader = true; }
            return;
        }
        if (trimmed.startsWith('|') || trimmed.endsWith('|')) {
            hasTable = true;
            if (trimmed.startsWith('|')) trimmed = trimmed.substring(1);
            if (trimmed.endsWith('|')) trimmed = trimmed.substring(0, trimmed.length - 1);
            
            const cells = trimmed.split('|').map(cell => cell.trim());
            const rowClass = isHeader ? "bg-gray-50 border-b border-gray-200" : "border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors";
            html += `<tr class="${rowClass}">`;
            
            cells.forEach((cellText) => {
                let content = cleanMarkdown(cellText.replace(/</g, "&lt;").replace(/>/g, "&gt;")); 
                if (isHeader) html += `<th class="px-4 py-3 font-semibold text-gray-700 border-r border-gray-200 last:border-0 align-top whitespace-nowrap">${content}</th>`;
                else html += `<td class="px-4 py-3 text-gray-600 border-r border-gray-100 last:border-0 align-top whitespace-pre-line break-words leading-relaxed">${content}</td>`;
            });
            html += '</tr>';
        }
    });
    html += '</table></div></div>';
    return hasTable ? html : `<div class="p-4 mt-2 bg-gray-50 rounded-lg text-sm text-gray-700 whitespace-pre-wrap border border-gray-200 shadow-inner">${cleanMarkdown(mdText)}</div>`;
}

// Event Listeners Initialization
document.addEventListener('DOMContentLoaded', function() {
    loadStateFromLocal(); 
    if(typeof updateSavedJournalsList === 'function') updateSavedJournalsList();
    
    document.querySelectorAll('.proposal-nav-btn').forEach(btn => {
        btn.addEventListener('click', function() { 
            if(typeof showProposalSection === 'function') showProposalSection(this.getAttribute('data-section')); 
        });
    });

    const searchInput = document.getElementById('searchKeyword');
    if(searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); if(typeof searchJournals === 'function') searchJournals(); }
        });
    }
});