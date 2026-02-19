// ==========================================
// FILE 1: state.js 
// Fungsi: Variabel Global, Auto-Save, Backup & Restore
// ==========================================

let documentType = 'proposal'; 
let currentStep = 1;
let journals = [];
let analysisData = {};
let generatedTitles = [];
let selectedTitle = '';
let proposalData = {
    latar: '', rumusan: '', tujuan: '', manfaat: '', metode: '', landasan: '', hipotesis: '', jadwal: '', daftar: '',
    mpendahuluan: '', mpembahasan: '', mpenutup: '', mdaftar: '',
    jpendahuluan: '', jmetode: '', jhasil: '', jkesimpulan: '', jabstrak: '', jdaftar: '',
    sdeskripsi: '', sanalisis: '', spembahasan: '', skesimpulan: '', ssaran: '', sdaftar: '',
    // Penambahan slrabstrak ada di bawah ini:
    slrpendahuluan: '', slrmetode: '', slrhasil: '', slrpembahasan: '', slrkesimpulan: '', slrabstrak: '', slrdaftar: ''
};

function saveStateToLocal() {
    const appState = {
        documentType, currentStep, journals, analysisData, generatedTitles, selectedTitle, proposalData
    };
    localStorage.setItem('scientificDocGenState', JSON.stringify(appState));
}

function loadStateFromLocal() {
    const savedState = localStorage.getItem('scientificDocGenState');
    if (savedState) {
        try {
            const parsed = JSON.parse(savedState);
            if (parsed.documentType) documentType = parsed.documentType;
            if (parsed.currentStep) currentStep = parsed.currentStep;
            if (parsed.journals) journals = parsed.journals;
            if (parsed.analysisData) analysisData = parsed.analysisData;
            if (parsed.generatedTitles) generatedTitles = parsed.generatedTitles;
            if (parsed.selectedTitle) selectedTitle = parsed.selectedTitle;
            if (parsed.proposalData) proposalData = Object.assign(proposalData, parsed.proposalData);
            
            if (typeof setDocumentType === "function") setDocumentType(documentType); 
            if (typeof updateSavedJournalsList === "function") updateSavedJournalsList();
            if (typeof renderAnalysisSummaryPreview === "function") renderAnalysisSummaryPreview();
            if (generatedTitles.length > 0 && typeof displayTitleSelection === "function") displayTitleSelection();
            
            Object.keys(proposalData).forEach(key => {
                const el = document.getElementById('output-' + key);
                if (el && proposalData[key]) el.value = proposalData[key];
            });
            
            const titleDisplay = document.getElementById('selectedTitleDisplayStep5');
            if (titleDisplay) titleDisplay.textContent = selectedTitle || '-';
            
            if (typeof goToStep === "function") goToStep(currentStep);
        } catch (e) {
            console.error("Gagal memuat data dari Local Storage:", e);
        }
    }
}

function executeReset() { 
    localStorage.removeItem('scientificDocGenState');
    location.reload(); 
}

function downloadBackup() {
    const dataToSave = { documentType, journals, analysisData, generatedTitles, selectedTitle, proposalData, currentStep };
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
    if (typeof showCustomAlert === "function") showCustomAlert('success', 'Backup Berhasil', 'Data pekerjaan Anda berhasil di-download!');
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
            if (parsed.documentType && typeof setDocumentType === "function") setDocumentType(parsed.documentType);
            journals = parsed.journals || [];
            analysisData = parsed.analysisData || {};
            generatedTitles = parsed.generatedTitles || [];
            selectedTitle = parsed.selectedTitle || '';
            proposalData = Object.assign(proposalData, parsed.proposalData || {});
            currentStep = parsed.currentStep || 1;
            
            saveStateToLocal();
            
            if (typeof updateSavedJournalsList === "function") updateSavedJournalsList();
            if (typeof renderAnalysisSummaryPreview === "function") renderAnalysisSummaryPreview();
            if (generatedTitles.length > 0 && typeof displayTitleSelection === "function") displayTitleSelection();
            
            Object.keys(proposalData).forEach(key => {
                const el = document.getElementById('output-' + key);
                if (el && proposalData[key]) el.value = proposalData[key];
            });
            const titleDisplay = document.getElementById('selectedTitleDisplayStep5');
            if (titleDisplay) titleDisplay.textContent = selectedTitle || '-';
            if (typeof goToStep === "function") goToStep(currentStep);
            if (typeof showCustomAlert === "function") showCustomAlert('success', 'Berhasil Restore', 'Data Anda berhasil dipulihkan!');
        } catch (err) {
            if (typeof showCustomAlert === "function") showCustomAlert('error', 'Gagal Restore', 'Pastikan file yang diupload berformat JSON.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}