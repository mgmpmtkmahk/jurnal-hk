// ==========================================
// FILE: state.js (REFACTORED ENCRYPTION - FIXED)
// ==========================================

const AppState = {
    documentType: 'proposal',
    currentStep: 1,
    aiProvider: 'gemini',
    geminiModel: 'gemini-2.5-flash',          
    mistralModel: 'mistral-large-latest', 
    groqModel: 'llama-3.3-70b-versatile',
    _encryptedGroqKey: null,
    _tempGroqKey: null,
    tone: 'akademis',
    
    // Kunci tersimpan secara aman (Ter-enkripsi)
    _encryptedGeminiKey: null,
    _encryptedMistralKey: null,
    
    // Memori sementara saat runtime (Plaintext tapi hilang saat reload/expired)
    _tempGeminiKey: null,
    _tempMistralKey: null,
    
    journals: [],
    analysisData: {},
    generatedTitles: [],
    selectedTitle: '',
    proposalData: {},
    customPrompts: {},
    plagiarismConfig: { provider: 'local', copyleaksApiKey: null, similarityThreshold: 15, lastScanResults: {} },

    // Method untuk Copyleaks key
    async setCopyleaksKey(apiKey, pin) {
        if (!apiKey) {
            this.plagiarismConfig.copyleaksApiKey = null;
            return;
        }
        const salt = CryptoService.getDeviceFingerprint();
        const encrypted = await CryptoService.encrypt(apiKey, pin + salt);
        this.plagiarismConfig.copyleaksApiKey = encrypted;
    },

    async getCopyleaksKey(pin) {
        if (!this.plagiarismConfig.copyleaksApiKey) return null;
        const salt = CryptoService.getDeviceFingerprint();
        return await CryptoService.decrypt(this.plagiarismConfig.copyleaksApiKey, pin + salt);
    }
};

// ==========================================
// MANAJEMEN KUNCI API MULTI-PROVIDER
// ==========================================

// Mengambil Key yang Sedang Aktif berdasarkan Provider terpilih
AppState.getActiveApiKey = function() {
    if (this.aiProvider === 'mistral') return this._tempMistralKey;
    if (this.aiProvider === 'groq') return this._tempGroqKey;
    return this._tempGeminiKey;
};

// Backward compatibility: Menjaga core.js yang spesifik memanggil getApiKeySync() untuk Gemini
AppState.getApiKeySync = function() {
    return this._tempGeminiKey; 
};

// Timer untuk auto-expire memori kunci sementara (Keamanan Ekstra)
AppState._clearTempKeysTimeout = null;
AppState._startTempKeysTimer = function() {
    if (this._clearTempKeysTimeout) clearTimeout(this._clearTempKeysTimeout);
    this._clearTempKeysTimeout = setTimeout(() => {
        this._tempGeminiKey = null;
        this._tempMistralKey = null;
        this._tempGroqKey = null; // Tambahkan ini
        console.log("Sesi API Key berakhir. Kunci dihapus dari memori untuk keamanan.");
    }, 60 * 60 * 1000); 
};

// Mengamankan (Enkripsi) Kedua Key sekaligus
AppState.setAndEncryptKeys = async function(gemini, mistral, groq, pin) {
    const salt = CryptoService.getDeviceFingerprint();
    const strongPin = pin + salt;

    this._tempGeminiKey = gemini || null;
    this._tempMistralKey = mistral || null;
    this._tempGroqKey = groq || null; // Tambahkan ini

    if (gemini) this._encryptedGeminiKey = await CryptoService.encrypt(gemini, strongPin);
    else this._encryptedGeminiKey = null;

    if (mistral) this._encryptedMistralKey = await CryptoService.encrypt(mistral, strongPin);
    else this._encryptedMistralKey = null;
    
    // Tambahkan ini
    if (groq) this._encryptedGroqKey = await CryptoService.encrypt(groq, strongPin);
    else this._encryptedGroqKey = null;

    this._startTempKeysTimer();
};

// Membuka Kunci (Dekripsi) dari storage ke memori
AppState.decryptKeys = async function(pin) {
    const salt = CryptoService.getDeviceFingerprint();
    const strongPin = pin + salt;
    let unlocked = false;
    let hasErrors = false;

    if (this._encryptedGeminiKey) {
        try {
            this._tempGeminiKey = await CryptoService.decrypt(this._encryptedGeminiKey, strongPin);
            unlocked = true;
        } catch(e) { console.warn("Sisa kunci Gemini lama terabaikan."); hasErrors = true; }
    }
    
    if (this._encryptedMistralKey) {
        try {
            this._tempMistralKey = await CryptoService.decrypt(this._encryptedMistralKey, strongPin);
            unlocked = true;
        } catch(e) { console.warn("Sisa kunci Mistral lama terabaikan."); hasErrors = true; }
    }
    
    if (this._encryptedGroqKey) {
        try {
            this._tempGroqKey = await CryptoService.decrypt(this._encryptedGroqKey, strongPin);
            unlocked = true;
        } catch(e) { console.warn("Sisa kunci Groq lama terabaikan."); hasErrors = true; }
    }
    
    // Jika tidak ada satu pun yang berhasil terbuka, berarti PIN memang salah
    if (!unlocked && hasErrors) throw new Error("PIN Salah atau Data Korup.");
    if (!unlocked) throw new Error("Tidak ada kunci tersimpan.");
    
    this._startTempKeysTimer();
    return true;
};

// ==========================================
// FUNGSI SIMPAN & MUAT STATE (LOCALSTORAGE)
// ==========================================

async function saveStateToLocal() {
    const stateToSave = {
        documentType: AppState.documentType,
        currentStep: AppState.currentStep,
        aiProvider: AppState.aiProvider,
        geminiModel: AppState.geminiModel,
        mistralModel: AppState.mistralModel,
        groqModel: AppState.groqModel,
        tone: AppState.tone,
        
        // Simpan versi terenkripsi dari kedua provider
        encryptedGeminiKey: AppState._encryptedGeminiKey, 
        encryptedMistralKey: AppState._encryptedMistralKey,
        encryptedGroqKey: AppState._encryptedGroqKey,
        
        journals: AppState.journals,
        analysisData: AppState.analysisData,
        generatedTitles: AppState.generatedTitles,
        selectedTitle: AppState.selectedTitle,
        proposalData: AppState.proposalData,
        customPrompts: AppState.customPrompts,
        plagiarismConfig: AppState.plagiarismConfig,
        lastSaved: new Date().toISOString()
    };
    await localforage.setItem('scientificDocGenState', stateToSave);
}

async function loadStateFromLocal() {
    try {
        const parsed = await localforage.getItem('scientificDocGenState');
        if (parsed) {
            // Muat kembali kunci terenkripsi ke state
            if (parsed.encryptedGeminiKey) AppState._encryptedGeminiKey = parsed.encryptedGeminiKey;
            if (parsed.encryptedMistralKey) AppState._encryptedMistralKey = parsed.encryptedMistralKey;

            Object.assign(AppState, {
                documentType: parsed.documentType || 'proposal',
                currentStep: parsed.currentStep || 1,
                aiProvider: parsed.aiProvider || 'gemini',
                geminiModel: parsed.geminiModel || 'gemini-2.5-flash',
                mistralModel: parsed.mistralModel || 'mistral-large-latest',
                groqModel: AppState.groqModel,
                encryptedGroqKey: AppState._encryptedGroqKey,
                tone: parsed.tone || 'akademis',
                journals: parsed.journals || [],
                analysisData: parsed.analysisData || {},
                generatedTitles: parsed.generatedTitles || [],
                selectedTitle: parsed.selectedTitle || '',
                customPrompts: parsed.customPrompts || {}, 
                proposalData: Object.assign(AppState.proposalData, parsed.proposalData || {}),
                plagiarismConfig: Object.assign(AppState.plagiarismConfig, parsed.plagiarismConfig || {})
            });
        }
    } catch (e) {
        console.error("Failed to load state:", e);
    }
}