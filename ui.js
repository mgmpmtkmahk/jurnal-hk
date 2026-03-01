// ==========================================
// FILE 2: ui.js (REFACTORED)
// Fungsi: Navigasi Halaman, Modals, Event Listeners, UI Helpers
// ==========================================

function goToStep(step) {
    for (let i = 1; i <= 5; i++) {
        document.getElementById('step' + i).classList.remove('visible-section');
        document.getElementById('step' + i).classList.add('hidden-section');
        const indicator = document.getElementById('step' + i + '-indicator');
        if (i <= step) { indicator.classList.remove('step-inactive'); indicator.classList.add('step-active'); } 
        else { indicator.classList.remove('step-active'); indicator.classList.add('step-inactive'); }
    }
    document.getElementById('step' + step).classList.remove('hidden-section');
    document.getElementById('step' + step).classList.add('visible-section');
    document.getElementById('progress-line').style.width = ((step - 1) / 4) * 100 + '%';
    
    AppState.currentStep = step; 
    
    // Smooth Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (step === 5) { 
        const titleDisplay = document.getElementById('selectedTitleDisplayStep5'); 
        if (titleDisplay) titleDisplay.textContent = AppState.selectedTitle || '-'; 
    }
    updateSidebarLock(step); 
    saveStateToLocal(); 
}

function updateSidebarLock(step) {
    const sidebar = document.getElementById('btn-mode-proposal')?.parentElement;
    if (!sidebar) return;

    // Kunci sidebar HANYA JIKA di Langkah 5 DAN judul sudah dipilih
    if (step >= 5 && AppState.selectedTitle && AppState.selectedTitle.trim() !== '') {
        sidebar.classList.add('opacity-50', 'pointer-events-none', 'grayscale');
        sidebar.title = "Mode dokumen terkunci. Kembali ke langkah sebelumnya jika ingin mengubah mode.";
    } else {
        // Buka kunci jika user berada di Langkah 1-4, atau belum memilih judul
        sidebar.classList.remove('opacity-50', 'pointer-events-none', 'grayscale');
        sidebar.removeAttribute('title');
    }
}

function setDocumentType(type) {
    AppState.documentType = type;
    const titleStep5 = document.getElementById('step5-title');
    const btnStyles = {
        proposal: { id: 'btn-mode-proposal', active: "ring-indigo-300 bg-indigo-600 text-white", inactive: "bg-indigo-50 text-indigo-600" },
        robotik: { id: 'btn-mode-robotik', active: "ring-blue-300 bg-blue-600 text-white", inactive: "bg-blue-50 text-blue-600" },
        skripsi: { id: 'btn-mode-skripsi', active: "ring-yellow-300 bg-yellow-600 text-white", inactive: "bg-yellow-50 text-yellow-600" },
        makalah: { id: 'btn-mode-makalah', active: "ring-emerald-300 bg-emerald-600 text-white", inactive: "bg-emerald-50 text-emerald-600" },
        jurnal: { id: 'btn-mode-jurnal', active: "ring-teal-300 bg-teal-600 text-white", inactive: "bg-teal-50 text-teal-600" },
        slr: { id: 'btn-mode-slr', active: "ring-purple-300 bg-purple-600 text-white", inactive: "bg-purple-50 text-purple-600" }
    };

    Object.keys(btnStyles).forEach(key => {
        const btn = document.getElementById(btnStyles[key].id);
        // PERBAIKAN: Masukkan kembali class responsif layar kecil (w-10 h-10 dll)
        if(btn) btn.className = `w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-all group relative shadow-sm border ${btnStyles[key].inactive}`;
    });

    ['proposal', 'makalah', 'jurnal', 'skripsi', 'slr', 'robotik'].forEach(nav => {
        const el = document.getElementById(`${nav}-nav-buttons`);
        if(el) { el.classList.add('hidden'); el.classList.remove('grid'); }
    });
    
    const activeBtn = document.getElementById(btnStyles[type].id);
    // PERBAIKAN: Masukkan kembali class responsif layar kecil
    if(activeBtn) activeBtn.className = `w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center transition-all group relative shadow-lg transform scale-110 ring-2 ring-offset-1 border-transparent ${btnStyles[type].active}`;

    if (type === 'proposal') {
        const nav = document.getElementById('proposal-nav-buttons'); if(nav) { nav.classList.remove('hidden'); nav.classList.add('grid'); }
        if(titleStep5) titleStep5.innerText = "Langkah 5: Penyusunan Proposal (Bab 1-3)";
        if(typeof showProposalSection === 'function') showProposalSection('latar');
    } else if (type === 'robotik') {
        const nav = document.getElementById('robotik-nav-buttons'); if(nav) { nav.classList.remove('hidden'); nav.classList.add('grid'); }
        if(titleStep5) titleStep5.innerText = "Langkah 5: Penyusunan Proposal Proyek Robotik/IT";
        if(typeof showProposalSection === 'function') showProposalSection('rpendahuluan');
    } else if (type === 'makalah') {
        const nav = document.getElementById('makalah-nav-buttons'); if(nav) { nav.classList.remove('hidden'); nav.classList.add('grid'); }
        if(titleStep5) titleStep5.innerText = "Langkah 5: Penyusunan Makalah (Standar Akademik)";
        if(typeof showProposalSection === 'function') showProposalSection('mpendahuluan');
    } else if (type === 'jurnal') {
        const nav = document.getElementById('jurnal-nav-buttons'); if(nav) { nav.classList.remove('hidden'); nav.classList.add('grid'); }
        if(titleStep5) titleStep5.innerText = "Langkah 5: Penyusunan Artikel Jurnal";
        if(typeof showProposalSection === 'function') showProposalSection('jpendahuluan');
    } else if (type === 'skripsi') {
        const nav = document.getElementById('skripsi-nav-buttons'); if(nav) { nav.classList.remove('hidden'); nav.classList.add('grid'); }
        if(titleStep5) titleStep5.innerText = "Langkah 5: Penyusunan Skripsi Akhir (Bab 4 & 5)";
        if(typeof showProposalSection === 'function') showProposalSection('sdeskripsi');
    } else if (type === 'slr') {
        const nav = document.getElementById('slr-nav-buttons'); if(nav) { nav.classList.remove('hidden'); nav.classList.add('grid'); }
        if(titleStep5) titleStep5.innerText = "Langkah 5: Penyusunan SLR";
        if(typeof showProposalSection === 'function') showProposalSection('slrpendahuluan');
    }
    saveStateToLocal(); 
    showCustomAlert('success', 'Mode Diperbarui', `Sistem dialihkan ke Mode ${type.toUpperCase()}.`);
}

function getActiveSections() {
    if (AppState.documentType === 'proposal') return ['latar', 'rumusan', 'tujuan', 'manfaat', 'metode', 'landasan', 'hipotesis', 'jadwal', 'daftar', 'final'];
    if (AppState.documentType === 'robotik') return ['rpendahuluan', 'rtinjauan', 'rspesifikasi', 'rmetode', 'rjadwal', 'rdaftar', 'final'];
    if (AppState.documentType === 'makalah') return ['mpendahuluan', 'mpembahasan', 'mpenutup', 'mdaftar', 'final'];
    if (AppState.documentType === 'jurnal') return ['jpendahuluan', 'jmetode', 'jhasil', 'jkesimpulan', 'jabstrak', 'jdaftar', 'final'];
    if (AppState.documentType === 'skripsi') return ['sdeskripsi', 'sanalisis', 'spembahasan', 'skesimpulan', 'ssaran', 'sdaftar', 'final'];
    if (AppState.documentType === 'slr') return ['slrpendahuluan', 'slrmetode', 'slrhasil', 'slrpembahasan', 'slrkesimpulan', 'slrabstrak', 'slrdaftar', 'final'];
}

function showCustomAlert(type, title, message) {
    const modal = document.getElementById('customAlertModal'); const card = document.getElementById('customAlertCard'); const iconDiv = document.getElementById('customAlertIcon');
    if(!modal || !card || !iconDiv) return;
    iconDiv.className = 'w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto';
    if (type === 'success') { iconDiv.classList.add('bg-green-100', 'text-green-600'); iconDiv.innerHTML = '<i class="fas fa-check"></i>'; } 
    else if (type === 'error') { iconDiv.classList.add('bg-red-100', 'text-red-600'); iconDiv.innerHTML = '<i class="fas fa-times"></i>'; } 
    else { iconDiv.classList.add('bg-yellow-100', 'text-yellow-600'); iconDiv.innerHTML = '<i class="fas fa-exclamation"></i>'; }
    document.getElementById('customAlertTitle').innerText = title; document.getElementById('customAlertMessage').innerText = message;
    modal.classList.remove('hidden'); void modal.offsetWidth; 
    card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100');
}

function closeCustomAlert() {
    const modal = document.getElementById('customAlertModal'); const card = document.getElementById('customAlertCard');
    if(card) { card.classList.remove('scale-100', 'opacity-100'); card.classList.add('scale-95', 'opacity-0'); }
    if(modal) setTimeout(() => modal.classList.add('hidden'), 300);
}

function showConfirmModal() {
    const modal = document.getElementById('customConfirmModal'); const card = document.getElementById('customConfirmCard');
    if(!modal) return; modal.classList.remove('hidden'); void modal.offsetWidth;
    if(card) { card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100'); }
}

function closeConfirmModal() {
    const modal = document.getElementById('customConfirmModal'); const card = document.getElementById('customConfirmCard');
    if(card) { card.classList.remove('scale-100', 'opacity-100'); card.classList.add('scale-95', 'opacity-0'); }
    if(modal) setTimeout(() => modal.classList.add('hidden'), 300);
}

function showWarningModal(onConfirm) {
    const modal = document.getElementById('customWarningModal'); const card = document.getElementById('customWarningCard'); const btnConfirm = document.getElementById('btnConfirmSwitchTitle');
    if(!modal) return;
    const newBtn = btnConfirm.cloneNode(true); btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
    newBtn.addEventListener('click', function() { closeWarningModal(); onConfirm(); });
    modal.classList.remove('hidden');
    setTimeout(() => { if(card) { card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100'); } }, 10);
}

function closeWarningModal() {
    const modal = document.getElementById('customWarningModal'); const card = document.getElementById('customWarningCard');
    if(card) { card.classList.remove('scale-100', 'opacity-100'); card.classList.add('scale-95', 'opacity-0'); }
    if(modal) setTimeout(() => modal.classList.add('hidden'), 300);
}

function cleanMarkdown(str) {
    if (!str) return '';
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>').replace(/\*(.*?)\*/g, '<em class="italic">$1</em>'); 
}

// HELPER FUNCTION: Mengontrol state EasyMDE Editor
function setEditorState(editorId, isReadOnly, textValue = null) {
    if (window.mdeEditors && window.mdeEditors[editorId]) {
        const editor = window.mdeEditors[editorId];
        editor.codemirror.setOption("readOnly", isReadOnly);
        if (textValue !== null) {
            editor.value(textValue);
        }
    }
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

// ==========================================
// UI Updates untuk Keamanan API Key (REFACTORED)
// ==========================================

// Tambahkan di openApiSettings atau buat modal terpisah
function openPlagiarismSettings() {
    // Hapus modal lama jika ada
    const oldModal = document.getElementById('plagiarismSettingsModal');
    if (oldModal) oldModal.remove();

    const isConfigured = !!AppState.plagiarismConfig.copyleaksApiKey;
    const currentProvider = AppState.plagiarismConfig.provider || 'local';

    const modal = document.createElement('div');
    modal.id = 'plagiarismSettingsModal';
    modal.className = 'fixed inset-0 z-[135] flex items-center justify-center';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onclick="closePlagiarismSettings()"></div>
        <div class="bg-white rounded-2xl shadow-2xl w-11/12 max-w-lg p-6 relative z-10 animate-fade-in-up max-h-[90vh] overflow-y-auto">
            
            <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <i class="fas fa-shield-virus text-orange-600 text-xl"></i>
                </div>
                <div>
                    <h3 class="text-xl font-bold text-gray-800">Pengaturan Plagiarism Checker</h3>
                    <p class="text-sm text-gray-500">Konfigurasi Copyleaks API & threshold</p>
                </div>
            </div>

            <!-- Provider Selection -->
            <div class="mb-5">
                <label class="block text-sm font-bold text-gray-700 mb-2">Provider Default</label>
                <div class="grid grid-cols-3 gap-2">
                    <button onclick="selectPlagiarismProvider('local')" 
                        class="provider-btn p-3 rounded-xl border-2 ${currentProvider === 'local' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'} transition-all text-center"
                        data-provider="local">
                        <i class="fas fa-bolt text-amber-500 text-lg mb-1"></i>
                        <div class="text-sm font-semibold">Lokal</div>
                        <div class="text-xs text-gray-500">Gratis</div>
                    </button>
                    <button onclick="selectPlagiarismProvider('edenai')" 
                        class="provider-btn p-3 rounded-xl border-2 ${currentProvider === 'edenai' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'} transition-all text-center"
                        data-provider="edenai">
                        <i class="fas fa-cloud text-orange-500 text-lg mb-1"></i>
                        <div class="text-sm font-semibold">Eden AI</div>
                        <div class="text-xs text-gray-500">Akurat</div>
                    </button>
                    <button onclick="selectPlagiarismProvider('quick')" 
                        class="provider-btn p-3 rounded-xl border-2 ${currentProvider === 'quick' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'} transition-all text-center"
                        data-provider="quick">
                        <i class="fas fa-rocket text-purple-500 text-lg mb-1"></i>
                        <div class="text-sm font-semibold">Hybrid</div>
                        <div class="text-xs text-gray-500">Cepat→Akurat</div>
                    </button>
                </div>
            </div>

            <!-- Copyleaks Configuration -->
            <div id="edenai-config-section" class="${currentProvider === 'edenai' || currentProvider === 'quick' ? '' : 'hidden'} mb-5 p-4 bg-orange-50 rounded-xl border border-orange-200">
                <div class="flex items-center justify-between mb-3">
                    <label class="text-sm font-bold text-orange-800">Eden AI API Key</label>
                    <span class="text-xs ${isConfigured ? 'text-green-600' : 'text-orange-600'} font-semibold">
                        ${isConfigured ? '<i class="fas fa-check-circle mr-1"></i>Tersimpan' : '<i class="fas fa-exclamation-circle mr-1"></i>Belum diatur'}
                    </span>
                </div>
                <div class="space-y-3">
                    <input type="password" id="edenAiKeyInput" 
                        class="w-full p-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 outline-none text-sm font-mono"
                        placeholder="Paste API Key dari app.edenai.run">
                    <div class="p-3 bg-white rounded-lg border border-orange-100">
                        <p class="text-xs text-gray-600 leading-relaxed">
                            <i class="fas fa-info-circle text-orange-500 mr-1"></i>
                            Daftar gratis di <a href="https://app.edenai.run/" target="_blank" class="text-orange-600 font-bold underline">Eden AI</a>. Key akan dienkripsi aman di browser.
                        </p>
                    </div>
                    <div class="${isConfigured ? '' : 'hidden'}">
                        <label class="block text-sm font-bold text-gray-700 mb-1">PIN Keamanan (untuk dekripsi)</label>
                        <input type="password" id="edenAiPinInput" 
                            class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none text-sm"
                            placeholder="Masukkan PIN yang sama saat menyimpan API Key">
                    </div>
                </div>
            </div>

            <!-- Threshold Setting -->
            <div class="mb-5">
                <label class="block text-sm font-bold text-gray-700 mb-2">Threshold Peringatan (%)</label>
                <div class="flex items-center gap-4">
                    <input type="range" id="similarityThreshold" min="5" max="50" 
                        value="${AppState.plagiarismConfig.similarityThreshold || 15}" 
                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                        oninput="document.getElementById('thresholdValue').textContent = this.value + '%'">
                    <span id="thresholdValue" class="w-16 text-center font-mono font-bold text-lg text-orange-600">
                        ${AppState.plagiarismConfig.similarityThreshold || 15}%
                    </span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Aplikasi akan memperingatkan jika similarity melebihi nilai ini.</p>
            </div>

            <!-- Usage Stats -->
            ${isConfigured ? `
            <div class="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 class="text-sm font-bold text-gray-700 mb-2">Status Akun Copyleaks</h4>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Sisa Scan Bulan Ini:</span>
                    <span class="font-semibold text-gray-800" id="copyleaks-quota">Memuat...</span>
                </div>
            </div>
            ` : ''}

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4 border-t border-gray-100">
                <button onclick="closePlagiarismSettings()" class="flex-1 bg-gray-100 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-200 transition-all">
                    Batal
                </button>
                ${isConfigured ? `
                ` : ''}
                <button onclick="savePlagiarismSettings()" class="flex-1 bg-orange-600 py-3 rounded-xl text-white font-bold hover:bg-orange-700 shadow-lg transition-all">
                    <i class="fas fa-save mr-1"></i>Simpan
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Pre-fill jika ada
    if (isConfigured) {
        // Tidak bisa pre-fill karena encrypted, user harus masukkan ulang atau pakai PIN
    }
}

function selectPlagiarismProvider(provider) {
    document.querySelectorAll('.provider-btn').forEach(btn => {
        const isSelected = btn.dataset.provider === provider;
        btn.className = `provider-btn p-3 rounded-xl border-2 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'} transition-all text-center`;
    });
    
    document.getElementById('copyleaks-config-section').classList.toggle('hidden', provider === 'local');
}

function closePlagiarismSettings() {
    const modal = document.getElementById('plagiarismSettingsModal');
    if (modal) modal.remove();
}

async function savePlagiarismSettings() {
    const provider = document.querySelector('.provider-btn.border-orange-500')?.dataset.provider || 'local';
    const threshold = parseInt(document.getElementById('similarityThreshold').value);
    
    // PERUBAHAN 1: Ubah ID input menjadi milik Eden AI
    const apiKey = document.getElementById('edenAiKeyInput').value.trim();
    const pin = document.getElementById('edenAiPinInput')?.value.trim();

    // PERUBAHAN 2: Ubah string 'copyleaks' menjadi 'edenai'
    if ((provider === 'edenai' || provider === 'quick') && apiKey && !pin) {
        showCustomAlert('warning', 'PIN Diperlukan', 'Buat PIN keamanan untuk mengenkripsi API Key Eden AI.');
        return;
    }

    try {
        // PERUBAHAN 3: Kita hapus blok testCopyleaksKey di sini karena fungsinya sudah kamu hapus sebelumnya

        // Simpan ke state
        AppState.plagiarismConfig.provider = provider;
        AppState.plagiarismConfig.similarityThreshold = threshold;
        
        // PERUBAHAN 4: Ganti pemanggilan fungsi ke setEdenAiKey
        if (apiKey && pin) {
            await AppState.setEdenAiKey(apiKey, pin);
        }

        await saveStateToLocal();
        
        closePlagiarismSettings();
        showCustomAlert('success', 'Tersimpan', 'Pengaturan Eden AI berhasil diperbarui.');
        
        // Refresh UI di semua section
        document.querySelectorAll('[id^="plagiarism-panel-"]').forEach(el => {
            const sectionId = el.id.replace('plagiarism-panel-', '');
            if (typeof injectPlagiarismPanel === 'function') injectPlagiarismPanel(sectionId);
        });

    } catch (error) {
        showCustomAlert('error', 'Gagal Menyimpan', error.message);
    }
}

window.checkPlagiarismExternal = function(sectionId) {
    const editor = window.mdeEditors[`output-${sectionId}`];
    if (!editor) return;
    const text = editor.value();
    
    // Auto-copy teks ke clipboard
    navigator.clipboard.writeText(text).then(() => {
        showCustomAlert('info', 'Teks Disalin', 'Teks berhasil disalin! Silakan paste (Ctrl+V) di website yang akan terbuka.');
        setTimeout(() => {
            window.open('https://smallseotools.com/plagiarism-checker/', '_blank');
        }, 1500);
    });
}

function showUnlockModal() {
    // Hapus modal lama jika ada
    const oldModal = document.getElementById('unlockModal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'unlockModal';
    modal.className = 'fixed inset-0 z-[140] flex items-center justify-center';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
        <div class="bg-white rounded-2xl shadow-2xl w-11/12 max-w-md p-6 relative z-10 animate-fade-in-up">
            <div class="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl mb-4 mx-auto shadow-sm">
                <i class="fas fa-lock"></i>
            </div>
            <h3 class="text-xl font-bold text-center text-gray-800 mb-2">Buka Kunci API</h3>
            <p class="text-gray-600 text-center text-sm mb-6">
                API Key Anda tersimpan aman. Masukkan PIN Keamanan yang Anda buat sebelumnya untuk membuka akses AI.
            </p>
            
            <div class="mb-4">
                <input type="password" id="unlockPassword" 
                    class="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 outline-none text-center text-lg tracking-widest font-mono"
                    placeholder="Masukkan PIN Anda" maxlength="20">
            </div>
            
            <div class="flex gap-3">
                <button onclick="closeUnlockModal()" class="flex-1 bg-gray-100 py-3 rounded-xl text-gray-700 font-bold hover:bg-gray-200 transition-all">
                    Batal
                </button>
                <button onclick="unlockApiKey()" class="flex-1 bg-indigo-600 py-3 rounded-xl text-white font-bold hover:bg-indigo-700 shadow-lg transition-all">
                    Buka Kunci
                </button>
            </div>
            
            <button onclick="removeApiKey()" class="w-full mt-5 text-red-500 text-sm font-semibold hover:underline">
                <i class="fas fa-trash-alt mr-1"></i>Lupa PIN? Hapus Data API
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('unlockPassword').focus(), 100);
}

function closeUnlockModal() {
    const modal = document.getElementById('unlockModal');
    if (modal) modal.remove();
}

window.unlockApiKey = async function() {
    const pin = document.getElementById('unlockPassword').value;
    if (!pin) {
        showCustomAlert('warning', 'PIN Kosong', 'Harap masukkan PIN Anda.');
        return;
    }
    
    try {
        await AppState.decryptKeys(pin);
        closeUnlockModal();
        showCustomAlert('success', 'Akses Terbuka', 'Kunci berhasil dibuka. Mesin AI siap digunakan!');
        
        // Panggil fungsi pembuka modal yang baru di core.js
        setTimeout(() => window.openApiSettings(), 500);
        
    } catch (e) {
        showCustomAlert('error', 'PIN Salah', 'Gagal membuka kunci. PIN yang Anda masukkan salah.');
    }
};

async function testApiKey(key) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API Key tidak valid atau telah kedaluwarsa.');
    }
    return true;
}

// FUNGSI BARU: Edit & Save Prompt Kustom (Power User)
window.toggleEditPrompt = function(id) {
    const preEl = document.getElementById(`prompt-${id}`);
    const btn = document.getElementById(`btn-edit-${id}`);
    
    if (preEl.contentEditable === "true") {
        // SIMPAN (Mode Baca)
        preEl.contentEditable = "false";
        preEl.classList.remove('bg-white', 'text-gray-900', 'p-4', 'border-2', 'border-indigo-500', 'rounded-xl');
        preEl.classList.add('text-green-400'); // Kembalikan warna teks terminal
        btn.innerHTML = '<i class="fas fa-edit mr-1"></i>Edit Prompt';
        btn.classList.replace('bg-green-600', 'bg-gray-600');
        
        // Simpan ke State
        if (!AppState.customPrompts) AppState.customPrompts = {};
        AppState.customPrompts[id] = preEl.innerText;
        saveStateToLocal();
        showCustomAlert('success', 'Prompt Disimpan', 'Instruksi kustom Anda berhasil disimpan dan akan terus digunakan untuk dokumen ini.');
    } else {
        // EDIT (Mode Tulis)
        preEl.contentEditable = "true";
        preEl.classList.remove('text-green-400');
        preEl.classList.add('bg-white', 'text-gray-900', 'p-4', 'border-2', 'border-indigo-500', 'rounded-xl');
        btn.innerHTML = '<i class="fas fa-save mr-1"></i>Simpan';
        btn.classList.replace('bg-gray-600', 'bg-green-600');
        preEl.focus();
        showCustomAlert('warning', 'Mode Edit Aktif', 'Hati-hati, mengubah tag seperti [JUDUL] atau [GAP] dapat membuat AI kehilangan konteks. Klik Simpan setelah selesai.');
    }
};

// ==========================================
// FITUR BACKUP, RESTORE & RESET DATA
// ==========================================

// 1. Fungsi Download Backup (JSON)
window.downloadBackup = async function() {
    try {
        // Ambil data terbaru dari LocalStorage
        const data = await localforage.getItem('scientificDocGenState');
        if (!data) {
            showCustomAlert('warning', 'Data Kosong', 'Belum ada data yang bisa di-backup.');
            return;
        }

        // Buat file JSON
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Buat nama file dinamis berdasarkan judul atau tanggal
        const dateStr = new Date().toISOString().split('T')[0];
        let fileName = AppState.selectedTitle ? AppState.selectedTitle.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_') : 'Draft';
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `Backup_SciDocGen_${fileName}_${dateStr}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showCustomAlert('success', 'Backup Berhasil', 'File backup (.json) berhasil diunduh. Simpan di tempat yang aman.');
    } catch (error) {
        console.error("Backup Error:", error);
        showCustomAlert('error', 'Gagal Backup', 'Terjadi kesalahan saat mengekspor data.');
    }
};

// 2. Fungsi Trigger Restore (Membuka dialog pilih file)
window.triggerRestore = function() {
    const fileInput = document.getElementById('file-restore-input');
    if (fileInput) {
        fileInput.click();
    } else {
        showCustomAlert('error', 'Error UI', 'Input file restore tidak ditemukan di HTML.');
    }
};

// 3. Fungsi Proses File Restore
window.processRestoreFile = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const parsedData = JSON.parse(e.target.result);
            
            // Validasi sederhana memastikan ini file backup yang benar
            if (parsedData.documentType === undefined || parsedData.currentStep === undefined) {
                throw new Error("Format file JSON tidak sesuai.");
            }

            // Timpa data di LocalStorage
            await localforage.setItem('scientificDocGenState', parsedData);
            
            showCustomAlert('success', 'Restore Berhasil', 'Data berhasil dipulihkan! Aplikasi akan dimuat ulang dalam 3 detik...');
            
            // Reload halaman agar state dan UI tersinkronisasi kembali
            setTimeout(() => {
                window.location.reload();
            }, 3000);

        } catch (error) {
            console.error("Restore Error:", error);
            showCustomAlert('error', 'File Rusak', 'Gagal membaca file backup. Pastikan file JSON tersebut berasal dari aplikasi ini.');
        } finally {
            // Reset input agar bisa dipakai memilih file yang sama lagi
            event.target.value = ''; 
        }
    };
    reader.readAsText(file);
};

// 4. Fungsi Reset Total Aplikasi
window.executeReset = async function() {
    try {
        // Hapus seluruh database LocalForage
        await localforage.clear();
        
        // Bersihkan LocalStorage bawaan (jika ada sisa seperti tema dark mode)
        // localStorage.removeItem('scientificDocDarkMode'); // Opsional jika ingin reset tema juga
        
        closeConfirmModal();
        
        // Tampilkan pesan dan reload
        document.body.innerHTML = `
            <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <i class="fas fa-trash-alt text-red-500 text-6xl mb-4 animate-bounce"></i>
                <h2 class="text-2xl font-bold text-gray-800">Mereset Aplikasi...</h2>
                <p class="text-gray-500 mt-2">Menghapus semua memori dan menyegarkan sistem.</p>
            </div>
        `;
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (error) {
        console.error("Reset Error:", error);
        showCustomAlert('error', 'Gagal Reset', 'Terjadi kesalahan saat menghapus database.');
    }
};

// ==========================================
// FITUR DARK MODE
// ==========================================
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    const isDark = body.classList.contains('dark-mode');
    localStorage.setItem('scientificDocDarkMode', isDark); // Simpan preferensi

    const icon = document.querySelector('#darkModeBtn i');
    if (icon) {
        if (isDark) {
            // Beri warna kuning menyala hanya saat mode gelap (Matahari)
            icon.className = 'fas fa-sun text-base md:text-xl transform group-hover:scale-110 transition-transform text-yellow-400';
        } else {
            // Kembali ke warna dasar abu-abu saat mode terang (Bulan)
            icon.className = 'fas fa-moon text-base md:text-xl transform group-hover:scale-110 transition-transform';
        }
    }
}

function initDarkMode() {
    const isDark = localStorage.getItem('scientificDocDarkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        const icon = document.querySelector('#darkModeBtn i');
        if (icon) {
            icon.className = 'fas fa-sun text-base md:text-xl transform group-hover:scale-110 transition-transform text-yellow-400';
        }
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // 1. Inisiasi Tema Gelap
    initDarkMode();
    
    // 2. WAJIB TUNGGU DATA DIMUAT DARI DATABASE SEBELUM MENGGAMBAR UI (ASYNC FIX)
    await loadStateFromLocal(); 
    
    // 3. RENDER ULANG DATA KE LAYAR
    if(typeof updateSavedJournalsList === 'function') updateSavedJournalsList();
    
    if(AppState.analysisData && AppState.analysisData.raw && typeof renderAnalysisSummaryPreview === 'function') {
        renderAnalysisSummaryPreview();
    }
    
    if(AppState.generatedTitles && AppState.generatedTitles.length > 0 && typeof displayTitleSelection === 'function') {
        displayTitleSelection();
    }

    // 4. KEMBALIKAN USER KE STEP & MODE DOKUMEN TERAKHIR
    if (AppState.documentType) {
        setDocumentType(AppState.documentType);
    }
    if (AppState.currentStep) {
        goToStep(AppState.currentStep);
    }

    // 5. KEMBALIKAN ISI TEKS EDITOR DI STEP 5
    // Beri jeda sejenak (500ms) agar file step5-ui.js selesai membangun kotak EasyMDE terlebih dahulu
    setTimeout(() => {
        if (window.mdeEditors) {
            Object.keys(AppState.proposalData).forEach(key => {
                if (AppState.proposalData[key] && window.mdeEditors[`output-${key}`]) {
                    // Masukkan kembali teks ke dalam editor
                    window.mdeEditors[`output-${key}`].value(AppState.proposalData[key]);
                }
            });
        }
        
        // Tampilkan kembali judul terpilih di layar Langkah 5
        const titleDisplay = document.getElementById('selectedTitleDisplayStep5'); 
        if (titleDisplay && AppState.selectedTitle) {
            titleDisplay.textContent = AppState.selectedTitle; 
        }
    }, 500);

    // 6. EVENT LISTENER BAWAAN APLIKASI
    const searchInput = document.getElementById('searchKeyword');
    if(searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') { e.preventDefault(); if(typeof searchJournals === 'function') searchJournals(); }
        });
    }

    // FITUR A11Y: Keyboard Shortcut (Ctrl + S) untuk Auto-Save Manual
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault(); // Mencegah browser memunculkan dialog 'Save Page As'
            
            // Cari bab (section) mana yang sedang aktif / terbuka di layar
            const activeSection = document.querySelector('.proposal-section:not(.hidden)');
            if (activeSection) {
                const sectionId = activeSection.id.replace('section-', '');
                if (sectionId !== 'final' && typeof saveProposalSection === 'function') {
                    saveProposalSection(sectionId);
                }
            }
        }
    });
});