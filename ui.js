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

    // Mapping konfigurasi UI per dokumen
    const docConfigs = {
        proposal: { navId: 'proposal-nav-buttons', title: "Langkah 5: Penyusunan Proposal (Bab 1-3)", first: 'latar' },
        robotik: { navId: 'robotik-nav-buttons', title: "Langkah 5: Penyusunan Proposal Proyek Robotik/IT", first: 'rpendahuluan' },
        makalah: { navId: 'makalah-nav-buttons', title: "Langkah 5: Penyusunan Makalah (Standar Akademik)", first: 'mpendahuluan' },
        jurnal: { navId: 'jurnal-nav-buttons', title: "Langkah 5: Penyusunan Artikel Jurnal", first: 'jpendahuluan' },
        skripsi: { navId: 'skripsi-nav-buttons', title: "Langkah 5: Penyusunan Skripsi Akhir (Bab 4 & 5)", first: 'sdeskripsi' },
        slr: { navId: 'slr-nav-buttons', title: "Langkah 5: Penyusunan SLR", first: 'slrpendahuluan' }
    };

    const config = docConfigs[type] || docConfigs['proposal'];
    
    // Terapkan konfigurasi
    const nav = document.getElementById(config.navId);
    if(nav) { nav.classList.remove('hidden'); nav.classList.add('grid'); }
    if(titleStep5) titleStep5.innerText = config.title;
    if(typeof showProposalSection === 'function') showProposalSection(config.first);
    
    saveStateToLocal(); 
    showCustomAlert('success', 'Mode Diperbarui', `Sistem dialihkan ke Mode ${type.toUpperCase()}.`);
}

function getActiveSections() {
    const sectionsMap = {
        proposal: ['latar', 'rumusan', 'tujuan', 'manfaat', 'metode', 'landasan', 'hipotesis', 'jadwal', 'daftar', 'final'],
        robotik: ['rpendahuluan', 'rtinjauan', 'rspesifikasi', 'rmetode', 'rjadwal', 'rdaftar', 'final'],
        makalah: ['mpendahuluan', 'mpembahasan', 'mpenutup', 'mdaftar', 'final'],
        jurnal: ['jpendahuluan', 'jmetode', 'jhasil', 'jkesimpulan', 'jabstrak', 'jdaftar', 'final'],
        skripsi: ['sdeskripsi', 'sanalisis', 'spembahasan', 'skesimpulan', 'ssaran', 'sdaftar', 'final'],
        slr: ['slrpendahuluan', 'slrmetode', 'slrhasil', 'slrpembahasan', 'slrkesimpulan', 'slrabstrak', 'slrdaftar', 'final']
    };
    return sectionsMap[AppState.documentType] || sectionsMap['proposal'];
}

// HELPER: Mengontrol animasi semua modal
function toggleModalState(modalId, cardId, isShow) {
    const modal = document.getElementById(modalId);
    const card = document.getElementById(cardId);
    if (!modal) return;

    if (isShow) {
        modal.classList.remove('hidden');
        void modal.offsetWidth; // Trigger animasi
        if (card) {
            card.classList.remove('scale-95', 'opacity-0');
            card.classList.add('scale-100', 'opacity-100');
        }
    } else {
        if (card) {
            card.classList.remove('scale-100', 'opacity-100');
            card.classList.add('scale-95', 'opacity-0');
        }
        setTimeout(() => modal.classList.add('hidden'), 300);
    }
}

function showCustomAlert(type, title, message) {
    const iconDiv = document.getElementById('customAlertIcon');
    if (!iconDiv) return;
    
    iconDiv.className = 'w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto';
    if (type === 'success') { iconDiv.classList.add('bg-green-100', 'text-green-600'); iconDiv.innerHTML = '<i class="fas fa-check"></i>'; } 
    else if (type === 'error') { iconDiv.classList.add('bg-red-100', 'text-red-600'); iconDiv.innerHTML = '<i class="fas fa-times"></i>'; } 
    else { iconDiv.classList.add('bg-yellow-100', 'text-yellow-600'); iconDiv.innerHTML = '<i class="fas fa-exclamation"></i>'; }
    
    document.getElementById('customAlertTitle').innerText = title; 
    document.getElementById('customAlertMessage').innerText = message;
    
    toggleModalState('customAlertModal', 'customAlertCard', true);
}

function closeCustomAlert() { toggleModalState('customAlertModal', 'customAlertCard', false); }
function showConfirmModal() { toggleModalState('customConfirmModal', 'customConfirmCard', true); }
function closeConfirmModal() { toggleModalState('customConfirmModal', 'customConfirmCard', false); }
function closeWarningModal() { toggleModalState('customWarningModal', 'customWarningCard', false); }

function showWarningModal(onConfirm) {
    const btnConfirm = document.getElementById('btnConfirmSwitchTitle');
    if (!btnConfirm) return;
    
    const newBtn = btnConfirm.cloneNode(true); 
    btnConfirm.parentNode.replaceChild(newBtn, btnConfirm);
    newBtn.addEventListener('click', function() { closeWarningModal(); onConfirm(); });
    
    toggleModalState('customWarningModal', 'customWarningCard', true);
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


async function savePlagiarismSettings() {
    const provider = document.querySelector('.provider-btn.border-orange-500')?.dataset.provider || 'local';
    const threshold = parseInt(document.getElementById('similarityThreshold').value);
    
    AppState.plagiarismConfig.provider = provider;
    AppState.plagiarismConfig.similarityThreshold = threshold;
    
    await saveStateToLocal();
    closePlagiarismSettings();
    showCustomAlert('success', 'Tersimpan', 'Preferensi plagiasi diperbarui.');
}

function selectPlagiarismProvider(provider) {
    document.querySelectorAll('.provider-btn').forEach(btn => {
        const isSelected = btn.dataset.provider === provider;
        btn.className = `provider-btn p-3 rounded-xl border-2 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-200'} transition-all text-center`;
    });
    
    // Perbaikan Error null (Mencari elemen yang benar)
    const configSection = document.getElementById('edenai-config-section');
    if (configSection) {
        configSection.classList.toggle('hidden', provider === 'local');
    }
}

function closePlagiarismSettings() {
    const modal = document.getElementById('plagiarismSettingsModal');
    if (modal) modal.remove();
}

window.checkPlagiarismExternal = function(sectionId) {
    const editor = window.mdeEditors[`output-${sectionId}`];
    if (!editor) return;
    const text = editor.value();
    
    // Auto-copy teks ke clipboard
    navigator.clipboard.writeText(text).then(() => {
        
        const oldModal = document.getElementById('externalCheckModal');
        if (oldModal) oldModal.remove();

        const modal = document.createElement('div');
        modal.id = 'externalCheckModal';
        modal.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onclick="this.parentElement.remove()"></div>
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative z-10 animate-fade-in-up">
                <div class="flex items-center gap-3 mb-4">
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><i class="fas fa-external-link-alt text-blue-600 text-xl"></i></div>
                    <div>
                        <h3 class="text-xl font-bold text-gray-800">Pilih Layanan Web</h3>
                        <p class="text-xs text-green-600 font-bold"><i class="fas fa-check-circle mr-1"></i>Teks otomatis disalin (Tinggal Ctrl+V)</p>
                    </div>
                </div>
                <p class="text-sm text-gray-600 mb-5 leading-relaxed">Silakan pilih layanan web gratis di bawah ini. Teks Anda sudah disalin. Setelah web terbuka, klik di dalam kotaknya lalu tekan <strong>Ctrl+V (Paste)</strong>.</p>

                <div class="space-y-3">
                    <a href="https://smallseotools.com/id/plagiarism-checker/" target="_blank" onclick="document.getElementById('externalCheckModal').remove()" 
                        class="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group">
                        <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i class="fas fa-copy"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 group-hover:text-blue-700">Cek Plagiarisme (SmallSEOTools)</h4>
                            <p class="text-xs text-gray-500">Mengecek plagiat dari database internet (Limit: 1000 kata)</p>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-blue-500"></i>
                    </a>

                    <a href="https://quillbot.com/ai-content-detector" target="_blank" onclick="document.getElementById('externalCheckModal').remove()" 
                        class="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group">
                        <div class="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i class="fas fa-robot"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 group-hover:text-green-700">Cek Skor AI (Quillbot AI)</h4>
                            <p class="text-xs text-gray-500">Mendeteksi persentase teks buatan AI (Limit: Tanpa Batas)</p>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-green-500"></i>
                    </a>

                    <a href="https://www.editpad.org/tool/id/parafrase-online" target="_blank" onclick="document.getElementById('externalCheckModal').remove()" 
                        class="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all group">
                        <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i class="fas fa-sync-alt"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 group-hover:text-purple-700">Parafrase Pro (Editpad)</h4>
                            <p class="text-xs text-gray-500">Tata bahasa sangat natural bahasa Indonesia (Limit: 1000 Kata)</p>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-purple-500"></i>
                    </a>
                    
                    <a href="https://smallseotools.com/id/article-rewriter/" target="_blank" onclick="document.getElementById('externalCheckModal').remove()" 
                        class="flex items-center p-3 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all group">
                        <div class="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><i class="fas fa-bolt"></i></div>
                        <div class="flex-1">
                            <h4 class="font-bold text-gray-800 group-hover:text-orange-700">Parafrase Brutal (SmallSEOTools)</h4>
                            <p class="text-xs text-gray-500">Mengubah sinonim kata secara massal (Limit: 2000 Kata)</p>
                        </div>
                        <i class="fas fa-chevron-right text-gray-400 group-hover:text-orange-500"></i>
                    </a>
                </div>
                
                <button onclick="document.getElementById('externalCheckModal').remove()" class="w-full mt-5 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Tutup</button>
            </div>
        `;
        document.body.appendChild(modal);
    }).catch(() => {
        showCustomAlert('error', 'Gagal', 'Gagal menyalin teks secara otomatis. Silakan copy manual.');
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

// ==========================================
// TOOLS EKSTERNAL (Auto-copy output -> open tab)
// ==========================================
function getActiveSectionIdForTools() {
    if (window.__currentSectionId) return window.__currentSectionId;
    const visible = Array.from(document.querySelectorAll('.proposal-section'))
        .find(el => !el.classList.contains('hidden') && el.id && el.id.startsWith('section-'));
    if (visible) return visible.id.replace('section-', '');
    const any = document.querySelector('textarea[id^="output-"]');
    if (any) return any.id.replace('output-', '');
    return null;
}

async function copySectionOutputToClipboard(sectionId) {
    const editor = window.mdeEditors && window.mdeEditors[`output-${sectionId}`];
    const text = editor ? editor.value() : (document.getElementById(`output-${sectionId}`)?.value || '');
    if (!text || !text.trim()) {
        showCustomAlert('warning', 'Kosong', 'Tidak ada teks output untuk disalin.');
        return null;
    }
    try {
        await navigator.clipboard.writeText(text);
        return text;
    } catch (e) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        return text;
    }
}

const EXTERNAL_TOOL_URLS = {
    gptzero_ai: 'https://gptzero.me/',
    sapling_ai: 'https://sapling.ai/ai-content-detector',
    quetext_plag: 'https://www.quetext.com/plagiarism-checker',
    gptzero_plag: 'https://gptzero.me/plagiarism-checker',
    quillbot_para: 'https://quillbot.com/paraphrasing-tool',
    paperpal_para: 'https://edit.paperpal.com/'
};

async function openExternalWritingTool(toolKey) {
    const sectionId = getActiveSectionIdForTools();
    if (!sectionId) {
        showCustomAlert('warning', 'Tidak Ditemukan', 'Tidak dapat menentukan bagian aktif. Buka salah satu bagian dulu, lalu coba lagi.');
        return;
    }
    const url = EXTERNAL_TOOL_URLS[toolKey];
    if (!url) {
        showCustomAlert('error', 'Tool Tidak Valid', 'Mapping URL tool tidak ditemukan.');
        return;
    }

    // Buka URL tool *langsung* untuk menghindari tab blank (popup-safe).
    const newTab = window.open(url, '_blank', 'noopener,noreferrer');
    if (!newTab) {
        showCustomAlert('warning', 'Popup Diblokir', 'Browser memblokir tab baru. Izinkan pop-up untuk aplikasi ini, lalu coba lagi.');
        return;
    }

    try {
        const copied = await copySectionOutputToClipboard(sectionId);
        if (copied) {
            showCustomAlert('success', 'Disalin', 'Teks sudah disalin. Tempelkan (Ctrl+V) di tool yang dibuka.');
        } else {
            showCustomAlert('warning', 'Copy Gagal', 'Tool sudah dibuka, tapi teks output kosong. Coba pilih bagian lain atau copy manual.');
        }
    } catch (e) {
        showCustomAlert('warning', 'Copy Gagal', 'Tool sudah dibuka, tapi teks gagal disalin. Coba copy manual dari output.');
    }
}

function openExternalToolsModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-[160] flex items-center justify-center p-4';
    modal.innerHTML = `
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-6 relative z-10 animate-fade-in-up">
            <div class="flex items-start justify-between gap-4 mb-4">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">
                        <i class="fas fa-toolbox"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-extrabold text-gray-900">Tools Eksternal</h3>
                        <p class="text-sm text-gray-600">Klik tool → output bagian aktif disalin otomatis → tool dibuka di tab baru.</p>
                    </div>
                </div>
                <button class="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
                        aria-label="Tutup" onclick="this.closest('.fixed').remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="rounded-2xl border border-gray-200 p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <i class="fas fa-robot text-indigo-600"></i>
                        <h4 class="font-bold text-gray-900">AI Detector</h4>
                    </div>
                    <div class="space-y-2">
                        <button onclick="openExternalWritingTool('gptzero_ai')" class="w-full px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition">GPTZero</button>
                        <button onclick="openExternalWritingTool('sapling_ai')" class="w-full px-4 py-3 rounded-xl bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100 transition border border-indigo-100">Sapling</button>
                    </div>
                </div>

                <div class="rounded-2xl border border-gray-200 p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <i class="fas fa-shield-alt text-orange-600"></i>
                        <h4 class="font-bold text-gray-900">Plagiarism Checker</h4>
                    </div>
                    <div class="space-y-2">
                        <button onclick="openExternalWritingTool('quetext_plag')" class="w-full px-4 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition">Quetext</button>
                        <button onclick="openExternalWritingTool('gptzero_plag')" class="w-full px-4 py-3 rounded-xl bg-orange-50 text-orange-700 font-bold hover:bg-orange-100 transition border border-orange-100">GPTZero</button>
                    </div>
                </div>

                <div class="rounded-2xl border border-gray-200 p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <i class="fas fa-pen-nib text-emerald-600"></i>
                        <h4 class="font-bold text-gray-900">Paraphrase</h4>
                    </div>
                    <div class="space-y-2">
                        <button onclick="openExternalWritingTool('quillbot_para')" class="w-full px-4 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition">QuillBot</button>
                        <button onclick="openExternalWritingTool('paperpal_para')" class="w-full px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 transition border border-emerald-100">Paperpal</button>
                    </div>
                </div>
            </div>

            <div class="mt-4 rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-700">
                <div class="flex items-start gap-2">
                    <i class="fas fa-info-circle mt-0.5 text-gray-500"></i>
                    <p>Tip: buka salah satu bagian dulu (mis. Pendahuluan) sebelum klik tool.</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

window.openExternalToolsModal = openExternalToolsModal;
window.openPlagiarismSettings = openExternalToolsModal;



window.openExternalWritingTool = openExternalWritingTool;
