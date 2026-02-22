// ==========================================
// FILE 1: state.js (REFACTORED)
// Fungsi: Centralized State Management, Auto-Save, Backup & Restore
// ==========================================

// 1. Bungkus semua variabel ke dalam satu Object "Store"
const AppState = {
    documentType: 'proposal',
    currentStep: 1,
    geminiApiKey: '', // <-- TAMBAHKAN INI UNTUK API KEY
    journals: [],
    analysisData: {},
    generatedTitles: [],
    selectedTitle: '',
    proposalData: {
        latar: '', rumusan: '', tujuan: '', manfaat: '', metode: '', landasan: '', hipotesis: '', jadwal: '', daftar: '',
        mpendahuluan: '', mpembahasan: '', mpenutup: '', mdaftar: '',
        jpendahuluan: '', jmetode: '', jhasil: '', jkesimpulan: '', jabstrak: '', jdaftar: '',
        sdeskripsi: '', sanalisis: '', spembahasan: '', skesimpulan: '', ssaran: '', sdaftar: '',
        slrpendahuluan: '', slrmetode: '', slrhasil: '', slrpembahasan: '', slrkesimpulan: '', slrabstrak: '', slrdaftar: ''
    }
};

// ==========================================
// MESIN PENYIMPANAN BARU MENGGUNAKAN LOCALFORAGE (INDEXEDDB)
// ==========================================

function saveStateToLocal() {
    // localforage otomatis menyimpan object/array tanpa perlu JSON.stringify
    localforage.setItem('scientificDocGenState', AppState).catch(function (err) {
        console.error("Gagal menyimpan ke database lokal:", err);
    });
}

async function loadStateFromLocal() {
    try {
        const parsed = await localforage.getItem('scientificDocGenState');
        
        if (parsed) {
            // Rehidrasi state
            if (parsed.geminiApiKey) AppState.geminiApiKey = parsed.geminiApiKey;
            if (parsed.documentType) AppState.documentType = parsed.documentType;
            if (parsed.currentStep) AppState.currentStep = parsed.currentStep;
            if (parsed.journals) AppState.journals = parsed.journals;
            if (parsed.analysisData) AppState.analysisData = parsed.analysisData;
            if (parsed.generatedTitles) AppState.generatedTitles = parsed.generatedTitles;
            if (parsed.selectedTitle) AppState.selectedTitle = parsed.selectedTitle;
            if (parsed.proposalData) AppState.proposalData = Object.assign(AppState.proposalData, parsed.proposalData);
            
            // Trigger UI Updates
            if (typeof setDocumentType === "function") setDocumentType(AppState.documentType); 
            if (typeof updateSavedJournalsList === "function") updateSavedJournalsList();
            if (typeof renderAnalysisSummaryPreview === "function") renderAnalysisSummaryPreview();
            if (AppState.generatedTitles.length > 0 && typeof displayTitleSelection === "function") displayTitleSelection();
            
            Object.keys(AppState.proposalData).forEach(key => {
                const el = document.getElementById('output-' + key);
                if (el && AppState.proposalData[key]) {
                    el.value = AppState.proposalData[key];
                    // 🌟 Masukkan teks ke Visual Editor
                    if (window.mdeEditors && window.mdeEditors['output-' + key]) {
                        window.mdeEditors['output-' + key].value(AppState.proposalData[key]);
                    }
                }
            });
            
            const titleDisplay = document.getElementById('selectedTitleDisplayStep5');
            if (titleDisplay) titleDisplay.textContent = AppState.selectedTitle || '-';
            if (typeof goToStep === "function") goToStep(AppState.currentStep);
        }
    } catch (e) { 
        console.error("Gagal memuat data dari database lokal:", e); 
    }
}

function executeReset() { 
    // Bersihkan IndexedDB lalu reload halaman
    localforage.removeItem('scientificDocGenState').then(function() {
        location.reload(); 
    });
}

function downloadBackup() {
    const blob = new Blob([JSON.stringify(AppState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `Backup_${AppState.documentType}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
    if (typeof showCustomAlert === "function") showCustomAlert('success', 'Backup Berhasil', 'Data pekerjaan Anda berhasil di-download!');
}

function triggerRestore() { document.getElementById('file-restore-input').click(); }

function processRestoreFile(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const parsed = JSON.parse(e.target.result);
            if (parsed.documentType && typeof setDocumentType === "function") setDocumentType(parsed.documentType);
            AppState.journals = parsed.journals || []; 
            AppState.analysisData = parsed.analysisData || {}; 
            AppState.generatedTitles = parsed.generatedTitles || [];
            AppState.selectedTitle = parsed.selectedTitle || ''; 
            AppState.proposalData = Object.assign(AppState.proposalData, parsed.proposalData || {});
            AppState.currentStep = parsed.currentStep || 1;
            
            saveStateToLocal();
            
            if (typeof updateSavedJournalsList === "function") updateSavedJournalsList();
            if (typeof renderAnalysisSummaryPreview === "function") renderAnalysisSummaryPreview();
            if (AppState.generatedTitles.length > 0 && typeof displayTitleSelection === "function") displayTitleSelection();
            
            Object.keys(AppState.proposalData).forEach(key => {
                const el = document.getElementById('output-' + key);
                if (el && AppState.proposalData[key]) {
                    el.value = AppState.proposalData[key];
                    // 🌟 Masukkan teks ke Visual Editor
                    if (window.mdeEditors && window.mdeEditors['output-' + key]) {
                        window.mdeEditors['output-' + key].value(AppState.proposalData[key]);
                    }
                }
            });
            
            const titleDisplay = document.getElementById('selectedTitleDisplayStep5');
            if (titleDisplay) titleDisplay.textContent = AppState.selectedTitle || '-';
            if (typeof goToStep === "function") goToStep(AppState.currentStep);
            if (typeof showCustomAlert === "function") showCustomAlert('success', 'Berhasil Restore', 'Data Anda dipulihkan!');
        } catch (err) { 
            if (typeof showCustomAlert === "function") showCustomAlert('error', 'Gagal Restore', 'Format JSON tidak valid.'); 
        }
    };
    reader.readAsText(file); event.target.value = '';
}