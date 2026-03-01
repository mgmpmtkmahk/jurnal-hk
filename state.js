// ==========================================
// FILE: state.js (REFACTORED ENCRYPTION - UNIFIED PIN)
// ==========================================

const AppState = {
    documentType: 'proposal',
    currentStep: 1,
    aiProvider: 'gemini',
    geminiModel: 'gemini-2.5-flash',          
    mistralModel: 'mistral-large-latest', 
    groqModel: 'llama-3.3-70b-versatile',
    githubModel: 'gpt-4o',
    tone: 'akademis',
    aiTemperature: 0.3,
    
    // Kunci tersimpan secara aman (Ter-enkripsi)
    _encryptedGeminiKey: null,
    _encryptedMistralKey: null,
    _encryptedGroqKey: null,
    _encryptedGithubKey: null,
    _encryptedEdenAiKey: null, // TAMBAHAN BARU
    
    // Memori sementara saat runtime (Plaintext)
    _tempGeminiKey: null,
    _tempMistralKey: null,
    _tempGroqKey: null,
    _tempGithubKey: null,
    _tempEdenAiKey: null,      // TAMBAHAN BARU
    
    journals: [],
    analysisData: {},
    generatedTitles: [],
    selectedTitle: '',
    proposalData: {},
    customPrompts: {},
    plagiarismConfig: { provider: 'local', similarityThreshold: 15, lastScanResults: {} } // Bersih dari API Key
};

// ==========================================
// MANAJEMEN KUNCI API MULTI-PROVIDER
// ==========================================

AppState.getActiveApiKey = function() {
    if (this.aiProvider === 'mistral') return this._tempMistralKey;
    if (this.aiProvider === 'groq') return this._tempGroqKey;
    if (this.aiProvider === 'github') return this._tempGithubKey;
    return this._tempGeminiKey;
};

AppState.getApiKeySync = function() { return this._tempGeminiKey; };

AppState._clearTempKeysTimeout = null;
AppState._startTempKeysTimer = function() {
    if (this._clearTempKeysTimeout) clearTimeout(this._clearTempKeysTimeout);
    this._clearTempKeysTimeout = setTimeout(() => {
        this._tempGeminiKey = null; this._tempMistralKey = null; this._tempGroqKey = null;
        this._tempGithubKey = null; this._tempEdenAiKey = null;
        console.log("Sesi API Key berakhir.");
    }, 60 * 60 * 1000); 
};

// UPDATE: Enkripsi 5 Key Sekaligus (Menambahkan Eden AI)
AppState.setAndEncryptKeys = async function(gemini, mistral, groq, github, edenai, pin) {
    const salt = CryptoService.getDeviceFingerprint();
    const strongPin = pin + salt;

    this._tempGeminiKey = gemini || null; 
    this._tempMistralKey = mistral || null;
    this._tempGroqKey = groq || null; 
    this._tempGithubKey = github || null;
    this._tempEdenAiKey = edenai || null;

    this._encryptedGeminiKey = gemini ? await CryptoService.encrypt(gemini, strongPin) : null;
    this._encryptedMistralKey = mistral ? await CryptoService.encrypt(mistral, strongPin) : null;
    this._encryptedGroqKey = groq ? await CryptoService.encrypt(groq, strongPin) : null;
    this._encryptedGithubKey = github ? await CryptoService.encrypt(github, strongPin) : null;
    this._encryptedEdenAiKey = edenai ? await CryptoService.encrypt(edenai, strongPin) : null;

    this._startTempKeysTimer();
};

AppState.decryptKeys = async function(pin) {
    const salt = CryptoService.getDeviceFingerprint();
    const strongPin = pin + salt;
    let unlocked = false; let hasErrors = false;

    const tryDecrypt = async (encryptedKey) => {
        if (!encryptedKey) return null;
        try { const dec = await CryptoService.decrypt(encryptedKey, strongPin); unlocked = true; return dec; } 
        catch(e) { hasErrors = true; return null; }
    };

    this._tempGeminiKey = await tryDecrypt(this._encryptedGeminiKey);
    this._tempMistralKey = await tryDecrypt(this._encryptedMistralKey);
    this._tempGroqKey = await tryDecrypt(this._encryptedGroqKey);
    this._tempGithubKey = await tryDecrypt(this._encryptedGithubKey);
    this._tempEdenAiKey = await tryDecrypt(this._encryptedEdenAiKey);
    
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
        documentType: AppState.documentType, currentStep: AppState.currentStep, aiProvider: AppState.aiProvider,
        geminiModel: AppState.geminiModel, mistralModel: AppState.mistralModel, groqModel: AppState.groqModel,
        githubModel: AppState.githubModel, tone: AppState.tone, aiTemperature: AppState.aiTemperature,
        
        encryptedGeminiKey: AppState._encryptedGeminiKey, encryptedMistralKey: AppState._encryptedMistralKey,
        encryptedGroqKey: AppState._encryptedGroqKey, encryptedGithubKey: AppState._encryptedGithubKey,
        encryptedEdenAiKey: AppState._encryptedEdenAiKey, // TAMBAHAN
        
        journals: AppState.journals, analysisData: AppState.analysisData, generatedTitles: AppState.generatedTitles,
        selectedTitle: AppState.selectedTitle, proposalData: AppState.proposalData, customPrompts: AppState.customPrompts,
        plagiarismConfig: AppState.plagiarismConfig, lastSaved: new Date().toISOString()
    };
    await localforage.setItem('scientificDocGenState', stateToSave);
}

async function loadStateFromLocal() {
    try {
        const parsed = await localforage.getItem('scientificDocGenState');
        if (parsed) {
            AppState._encryptedGeminiKey = parsed.encryptedGeminiKey || null;
            AppState._encryptedMistralKey = parsed.encryptedMistralKey || null;
            AppState._encryptedGroqKey = parsed.encryptedGroqKey || null;
            AppState._encryptedGithubKey = parsed.encryptedGithubKey || null;
            AppState._encryptedEdenAiKey = parsed.encryptedEdenAiKey || null; // TAMBAHAN

            Object.assign(AppState, {
                documentType: parsed.documentType || 'proposal', currentStep: parsed.currentStep || 1, aiProvider: parsed.aiProvider || 'gemini',
                geminiModel: parsed.geminiModel || 'gemini-2.5-flash', mistralModel: parsed.mistralModel || 'mistral-large-latest',
                groqModel: parsed.groqModel || 'llama-3.3-70b-versatile', githubModel: parsed.githubModel || 'gpt-4o',
                tone: parsed.tone || 'akademis', aiTemperature: parsed.aiTemperature || 0.3, journals: parsed.journals || [],
                analysisData: parsed.analysisData || {}, generatedTitles: parsed.generatedTitles || [], selectedTitle: parsed.selectedTitle || '',
                customPrompts: parsed.customPrompts || {}, proposalData: Object.assign(AppState.proposalData, parsed.proposalData || {}),
                plagiarismConfig: Object.assign(AppState.plagiarismConfig, parsed.plagiarismConfig || {})
            });
        }
    } catch (e) { console.error("Failed to load state:", e); }
}