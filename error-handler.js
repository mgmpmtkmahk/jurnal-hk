// ==========================================
// FILE: error-handler.js
// Fungsi: Klasifikasi dan penanganan error yang user-friendly
// ==========================================

const ErrorHandler = {
    // Katalog error lengkap dengan solusi
    ERROR_CATALOG: {
        // Google Gemini API Errors
        '400': {
            type: 'INVALID_REQUEST',
            title: 'Permintaan Tidak Valid',
            message: 'Format permintaan ke AI tidak sesuai. Ini bisa terjadi karena teks terlalu panjang atau format JSON rusak.',
            icon: 'exclamation-triangle',
            color: 'yellow',
            actions: [
                { label: 'Perpendek Teks', action: 'truncateText' },
                { label: 'Cek Format JSON', action: 'validateJSON' }
            ]
        },
        '403': {
            type: 'PERMISSION_DENIED',
            title: 'Akses Ditolak',
            message: 'API Key Anda belum diaktifkan atau tidak punya izin untuk model Gemini 2.5 Flash.',
            icon: 'lock',
            color: 'red',
            actions: [
                { label: 'Buka Google AI Studio', action: 'openExternal', url: 'https://aistudio.google.com/app/apikey' },
                { label: 'Ganti API Key', action: 'openSettings' }
            ]
        },
        '429': {
            type: 'RATE_LIMIT',
            title: 'Sedang Ramai Pengguna',
            message: 'Server AI sedang sibuk seperti antrean di bank saat jam makan siang. Kuota gratis Anda mungkin habis untuk sementara.',
            icon: 'hourglass-half',
            color: 'orange',
            actions: [
                { label: 'Tunggu 60 Detik', action: 'countdown', seconds: 60 },
                { label: 'Pakai Mode Manual', action: 'switchToManual' }
            ],
            autoRetry: true,
            retryDelay: 60000
        },
        '500': {
            type: 'SERVER_ERROR',
            title: 'Server AI Bermasalah',
            message: 'Google mengalami gangguan teknis. Ini di luar kontrol kita, seperti listrik padam di kantor Google.',
            icon: 'server',
            color: 'gray',
            actions: [
                { label: 'Cek Status Google', action: 'openExternal', url: 'https://status.cloud.google.com/' },
                { label: 'Coba Lagi', action: 'retry' }
            ]
        },
        '503': {
            type: 'SERVICE_UNAVAILABLE',
            title: 'Layanan Tidak Tersedia',
            message: 'Model Gemini 2.5 Flash sedang dalam maintenance atau overload.',
            icon: 'tools',
            color: 'gray',
            actions: [
                { label: 'Coba Model Lain', action: 'switchModel' },
                { label: 'Mode Manual', action: 'switchToManual' }
            ]
        },
        
        // Custom Application Errors
        'NETWORK_ERROR': {
            type: 'NETWORK',
            title: 'Koneksi Internet Bermasalah',
            message: 'Tidak bisa terhubung ke server. Cek WiFi/kuota data Anda. Coba refresh halaman.',
            icon: 'wifi',
            color: 'red',
            actions: [
                { label: 'Refresh Halaman', action: 'reload' },
                { label: 'Cek Koneksi', action: 'testConnection' }
            ]
        },
        'TIMEOUT_ERROR': {
            type: 'TIMEOUT',
            title: 'Waktu Habis',
            message: 'AI terlalu lama merespons. Mungkin teks terlalu panjang atau server lambat.',
            icon: 'clock',
            color: 'yellow',
            actions: [
                { label: 'Kirim Ulang', action: 'retry' },
                { label: 'Potong Teks', action: 'truncateText' }
            ]
        },
        'SAFETY_BLOCKED': {
            type: 'SAFETY',
            title: 'Konten Diblokir',
            message: 'AI mendeteksi potensi konten sensitif dalam jurnal Anda. Ini bisa terjadi pada penelitian medis, psikologi, atau topik kontroversial.',
            icon: 'shield-alt',
            color: 'purple',
            actions: [
                { label: 'Edit Prompt', action: 'editPrompt' },
                { label: 'Baca Panduan', action: 'openPanduan' }
            ]
        },
        'JSON_PARSE_ERROR': {
            type: 'PARSE',
            title: 'Format Respons Rusak',
            message: 'AI mengirim data tidak sesuai format. Ini jarang terjadi, tapi mungkin karena teks jurnal terlalu kompleks.',
            icon: 'code',
            color: 'yellow',
            actions: [
                { label: 'Coba Lagi', action: 'retry' },
                { label: 'Mode Manual', action: 'switchToManual' }
            ]
        },
        'MEMORY_ERROR': {
            type: 'MEMORY',
            title: 'Memori Browser Penuh',
            message: 'Teks yang diproses terlalu besar untuk browser Anda. Coba potong jurnal menjadi bagian lebih kecil.',
            icon: 'memory',
            color: 'red',
            actions: [
                { label: 'Potong Jurnal', action: 'splitJournal' },
                { label: 'Hapus Data Lama', action: 'clearOldData' }
            ]
        }
    },

    // Parser untuk mengidentifikasi error dari berbagai sumber
    parseError(error) {
        // Dari fetch response
        if (error.status || error.statusCode) {
            const code = error.status || error.statusCode;
            if (this.ERROR_CATALOG[code]) {
                return { ...this.ERROR_CATALOG[code], originalError: error };
            }
        }
        
        // Dari error message string
        const message = error.message || error.toString();
        
        if (message.includes('429') || message.includes('rate limit') || message.includes('Resource has been exhausted')) {
            return { ...this.ERROR_CATALOG['429'], originalError: error };
        }
        if (message.includes('403') || message.includes('Permission denied') || message.includes('API key not valid')) {
            return { ...this.ERROR_CATALOG['403'], originalError: error };
        }
        if (message.includes('fetch') || message.includes('network') || message.includes('Failed to fetch')) {
            return { ...this.ERROR_CATALOG['NETWORK_ERROR'], originalError: error };
        }
        if (message.includes('timeout') || message.includes('aborted')) {
            return { ...this.ERROR_CATALOG['TIMEOUT_ERROR'], originalError: error };
        }
        if (message.includes('safety') || message.includes('blocked') || message.includes('SAFETY')) {
            return { ...this.ERROR_CATALOG['SAFETY_BLOCKED'], originalError: error };
        }
        if (message.includes('JSON') || message.includes('parse') || message.includes('Unexpected token')) {
            return { ...this.ERROR_CATALOG['JSON_PARSE_ERROR'], originalError: error };
        }
        if (message.includes('memory') || message.includes('quota exceeded')) {
            return { ...this.ERROR_CATALOG['MEMORY_ERROR'], originalError: error };
        }
        
        // Default unknown error
        return {
            type: 'UNKNOWN',
            title: 'Terjadi Kesalahan',
            message: message || 'Terjadi kesalahan tidak terduga. Silakan coba lagi.',
            icon: 'question-circle',
            color: 'gray',
            actions: [{ label: 'Coba Lagi', action: 'retry' }],
            originalError: error
        };
    },

    // Tampilkan error dengan UI yang informatif
    async show(error, context = {}) {
        const errorInfo = this.parseError(error);
        
        // Log untuk debugging
        console.error('[ErrorHandler]', {
            type: errorInfo.type,
            context: context,
            original: errorInfo.originalError,
            timestamp: new Date().toISOString()
        });
        
        // Build modal
        const modal = document.createElement('div');
        modal.id = 'errorModal';
        modal.className = 'fixed inset-0 z-[150] flex items-center justify-center p-4';
        
        const colorClasses = {
            red: 'bg-red-100 text-red-600 border-red-200',
            yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
            orange: 'bg-orange-100 text-orange-600 border-orange-200',
            purple: 'bg-purple-100 text-purple-600 border-purple-200',
            gray: 'bg-gray-100 text-gray-600 border-gray-200'
        };
        
        const actionsHtml = errorInfo.actions.map((action, idx) => {
            const isPrimary = idx === 0;
            const btnClass = isPrimary 
                ? `bg-${errorInfo.color}-600 text-white hover:bg-${errorInfo.color}-700`
                : `bg-white border-2 border-${errorInfo.color}-200 text-${errorInfo.color}-700 hover:bg-${errorInfo.color}-50`;
            
            return `<button onclick="ErrorHandler.executeAction('${action.action}', ${JSON.stringify(action).replace(/"/g, '&quot;')})" 
                class="${btnClass} px-4 py-2 rounded-xl font-semibold transition-all ${isPrimary ? 'shadow-lg' : ''}">
                ${action.label}
            </button>`;
        }).join('');
        
        modal.innerHTML = `
            <div class="absolute inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity" onclick="ErrorHandler.close()"></div>
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 transform scale-100 animate-fade-in-up overflow-hidden">
                <div class="p-6">
                    <div class="flex items-start gap-4">
                        <div class="w-14 h-14 rounded-full ${colorClasses[errorInfo.color]} flex items-center justify-center text-2xl flex-shrink-0 border-2">
                            <i class="fas fa-${errorInfo.icon}"></i>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold text-gray-800 mb-2">${errorInfo.title}</h3>
                            <p class="text-gray-600 leading-relaxed mb-4">${errorInfo.message}</p>
                            
                            ${errorInfo.type === 'RATE_LIMIT' ? `
                                <div class="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
                                    <div class="flex items-center gap-2 text-orange-700 text-sm">
                                        <i class="fas fa-lightbulb"></i>
                                        <span class="font-semibold">Tips:</span> Mode Manual Tab tidak punya batasan rate limit.
                                    </div>
                                </div>
                            ` : ''}
                            
                            ${context.details ? `
                                <div class="text-xs text-gray-400 bg-gray-50 p-2 rounded-lg font-mono">
                                    Detail: ${context.details}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <div class="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t">
                    ${actionsHtml}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-retry jika diaktifkan
        if (errorInfo.autoRetry && context.retryFunction) {
            this.scheduleRetry(context.retryFunction, errorInfo.retryDelay);
        }
    },

    close() {
        const modal = document.getElementById('errorModal');
        if (modal) {
            modal.querySelector('.bg-white').classList.add('scale-95', 'opacity-0');
            setTimeout(() => modal.remove(), 300);
        }
    },

    executeAction(actionName, actionData) {
        this.close();
        
        switch(actionName) {
            case 'retry':
                if (window.lastFailedOperation) window.lastFailedOperation();
                break;
            case 'openSettings':
                openApiSettings();
                break;
            case 'openExternal':
                window.open(actionData.url, '_blank');
                break;
            case 'switchToManual':
                if (window.lastPromptId) openGeminiWithPrompt(window.lastPromptId);
                break;
            case 'countdown':
                this.showCountdown(actionData.seconds);
                break;
            case 'truncateText':
                this.showTruncateDialog();
                break;
            case 'editPrompt':
                document.querySelector('.EasyMDEContainer')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'reload':
                location.reload();
                break;
            case 'testConnection':
                this.testConnection();
                break;
            case 'clearOldData':
                this.showClearDataDialog();
                break;

            // ===== TAMBAHKAN KODE DI BAWAH INI =====
            case 'openPanduan':
                window.open('panduan.html', '_blank');
                break;
            case 'validateJSON':
                showCustomAlert('info', 'Tips Format', 'Pastikan AI membalas hanya dengan format kode JSON yang valid tanpa teks tambahan.');
                break;
            case 'switchModel':
                openApiSettings(); // Buka setting agar user bisa ganti ke Mistral/Gemini
                break;
            case 'splitJournal':
                showCustomAlert('info', 'Tips Potong', 'Silakan copy separuh teks jurnal Anda, lalu proses di "Manual Tab" secara bertahap.');
                break;
            // ========================================
        }
    },

    showCountdown(seconds) {
        const modal = document.createElement('div');
        modal.id = 'countdownModal';
        modal.className = 'fixed inset-0 z-[160] flex items-center justify-center';
        
        modal.innerHTML = `
            <div class="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
            <div class="bg-white rounded-2xl shadow-2xl p-8 relative z-10 text-center">
                <div class="w-20 h-20 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
                    <i class="fas fa-hourglass-half"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">Menunggu...</h3>
                <p class="text-gray-600 mb-4">Silakan tunggu sebelum mencoba lagi</p>
                <div class="text-4xl font-mono font-bold text-orange-600" id="countdownDisplay">${seconds}</div>
                <p class="text-sm text-gray-500 mt-4">Atau gunakan Mode Manual untuk tanpa batasan</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        let remaining = seconds;
        const interval = setInterval(() => {
            remaining--;
            const display = document.getElementById('countdownDisplay');
            if (display) display.textContent = remaining;
            
            if (remaining <= 0) {
                clearInterval(interval);
                modal.remove();
                if (window.lastFailedOperation) window.lastFailedOperation();
            }
        }, 1000);
    },

    async testConnection() {
        try {
            const response = await fetch('https://www.google.com/favicon.ico', { mode: 'no-cors' });
            showCustomAlert('success', 'Koneksi OK', 'Internet Anda berfungsi normal. Masalah mungkin di server AI.');
        } catch {
            showCustomAlert('error', 'Koneksi Bermasalah', 'Tidak bisa terhubung ke internet. Cek WiFi/kuota Anda.');
        }
    },

    showTruncateDialog() {
        // Implementasi dialog untuk memotong teks
        const textarea = document.getElementById('rawJournalInput');
        if (textarea && textarea.value.length > 40000) {
            const truncated = textarea.value.substring(0, 40000);
            textarea.value = truncated;
            showCustomAlert('success', 'Teks Dipotong', 'Teks dipotong ke 40,000 karakter pertama.');
        }
    },

    showClearDataDialog() {
        // Dialog konfirmasi hapus data lama
        showConfirmModal('Hapus Data Lama?', 
            'Ini akan menghapus jurnal dan analisis lama untuk mengosongkan memori.',
            () => {
                AppState.journals = [];
                AppState.analysisData = {};
                saveStateToLocal();
                updateSavedJournalsList();
                showCustomAlert('success', 'Dibersihkan', 'Data lama telah dihapus.');
            }
        );
    },

    scheduleRetry(fn, delay) {
        setTimeout(fn, delay);
    }
};

// Global error handler untuk uncaught errors
window.addEventListener('error', (e) => {
    console.error('Uncaught error:', e);
    ErrorHandler.show(e.error || e.message, { source: 'global' });
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e);
    ErrorHandler.show(e.reason, { source: 'promise' });
});