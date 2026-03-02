// ==========================================
// FILE: crypto-service.js
// Fungsi: Enkripsi/Dekripsi API Key dengan Web Crypto API
// ==========================================

const CryptoService = {
    // Derive key dari password user (bisa diperpanjang dengan user-specific salt)
    async deriveKey(password) {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );
        
        // Salt statis untuk simplicity (di production, gunakan salt per-user)
        const salt = encoder.encode("ScientificDocGen_v1_Salt");
        
        return crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: salt,
                iterations: 100000,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-GCM", length: 256 },
            false,
            ["encrypt", "decrypt"]
        );
    },
    
    async encrypt(plaintext, password) {
        try {
            const key = await this.deriveKey(password);
            const encoder = new TextEncoder();
            const iv = crypto.getRandomValues(new Uint8Array(12));
            
            const ciphertext = await crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                encoder.encode(plaintext)
            );
            
            // Gabungkan IV + ciphertext untuk storage
            const combined = new Uint8Array(iv.length + ciphertext.byteLength);
            combined.set(iv);
            combined.set(new Uint8Array(ciphertext), iv.length);
            
            // Return sebagai base64 string
            return btoa(String.fromCharCode(...combined));
        } catch (e) {
            console.error("Encryption failed:", e);
            throw new Error("Gagal mengenkripsi data");
        }
    },
    
    async decrypt(ciphertextBase64, password) {
        try {
            const key = await this.deriveKey(password);
            const combined = new Uint8Array(
                atob(ciphertextBase64).split('').map(c => c.charCodeAt(0))
            );
            
            // Pisahkan IV dan ciphertext
            const iv = combined.slice(0, 12);
            const ciphertext = combined.slice(12);
            
            const decrypted = await crypto.subtle.decrypt(
                { name: "AES-GCM", iv: iv },
                key,
                ciphertext
            );
            
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            console.error("Decryption failed:", e);
            throw new Error("Gagal mendekripsi - password mungkin salah");
        }
    },
    
    // Generate device-specific fingerprint untuk layer tambahan
    getDeviceFingerprint() {
        const components = [
            navigator.userAgent,
            navigator.language,
            new Date().getTimezoneOffset()
        ];
        return btoa(components.join('|')).slice(0, 16);
    }
};