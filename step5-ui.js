// ==========================================
// FILE 4: step5-ui.js
// Fungsi: Menginjeksi UI Langkah 5 ke dalam index.html
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const step5Container = document.getElementById('step5-container');
    
    if (step5Container) {
        step5Container.innerHTML = `
        <section id="step5" class="hidden-section relative">
            <div class="text-center mb-10">
                <h2 id="step5-title" class="text-3xl font-bold text-gray-800 mb-4">Langkah 5: Penyusunan Dokumen Akademik</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Gunakan prompt di bawah ini untuk menyusun dokumen Anda bab demi bab.</p>
                
                <div class="mt-6 inline-flex items-center bg-indigo-50 border-2 border-indigo-200 px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all">
                    <input type="checkbox" id="humanizerToggle" class="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" checked>
                    <label for="humanizerToggle" class="ml-3 text-sm font-bold text-indigo-800 cursor-pointer select-none">
                        <i class="fas fa-user-shield mr-2"></i>Aktifkan Mode Humanizer (Lolos Turnitin < 5%)
                    </label>
                </div>
            </div>

            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
                <h3 class="text-lg font-bold mb-2">Judul Terpilih:</h3>
                <p id="selectedTitleDisplayStep5" class="text-xl font-semibold">-</p>
            </div>

            <div class="hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8" id="proposal-nav-buttons">
                <button data-section="latar" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-file-alt text-2xl mb-2"></i><span class="text-sm font-semibold">1. Latar Belakang</span></button>
                <button data-section="rumusan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-question-circle text-2xl mb-2"></i><span class="text-sm font-semibold">2. Rumusan</span></button>
                <button data-section="tujuan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-bullseye text-2xl mb-2"></i><span class="text-sm font-semibold">3. Tujuan</span></button>
                <button data-section="manfaat" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-hand-holding-heart text-2xl mb-2"></i><span class="text-sm font-semibold">4. Manfaat</span></button>
                <button data-section="metode" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-flask text-2xl mb-2"></i><span class="text-sm font-semibold">5. Metode</span></button>
                <button data-section="landasan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-book text-2xl mb-2"></i><span class="text-sm font-semibold">6. Landasan Teori</span></button>
                <button data-section="hipotesis" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-balance-scale text-2xl mb-2"></i><span class="text-sm font-semibold">7. Hipotesis</span></button>
                <button data-section="jadwal" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-calendar-alt text-2xl mb-2"></i><span class="text-sm font-semibold">8. Jadwal & Biaya</span></button>
                <button data-section="daftar" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-list-ol text-2xl mb-2"></i><span class="text-sm font-semibold">9. Pustaka</span></button>
                <button data-section="final" class="proposal-nav-btn bg-gradient-to-tr from-green-500 to-teal-500 text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-center border-2 border-transparent flex flex-col items-center justify-center"><i class="fas fa-file-export text-2xl mb-2"></i><span class="text-sm font-bold">Setup & Export</span></button>
            </div>

            <div class="hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8" id="skripsi-nav-buttons">
                <button data-section="sdeskripsi" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-users text-2xl mb-2"></i><span class="text-sm font-semibold">1. Deskripsi Data</span></button>
                <button data-section="sanalisis" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-chart-pie text-2xl mb-2"></i><span class="text-sm font-semibold">2. Analisis Hasil</span></button>
                <button data-section="spembahasan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-comments text-2xl mb-2"></i><span class="text-sm font-semibold">3. Pembahasan</span></button>
                <button data-section="skesimpulan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-check-double text-2xl mb-2"></i><span class="text-sm font-semibold">4. Kesimpulan</span></button>
                <button data-section="ssaran" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-lightbulb text-2xl mb-2"></i><span class="text-sm font-semibold">5. Saran</span></button>
                <button data-section="sdaftar" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-list text-2xl mb-2"></i><span class="text-sm font-semibold">6. Pustaka</span></button>
                <button data-section="final" class="proposal-nav-btn bg-gradient-to-tr from-green-500 to-teal-500 text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-center border-2 border-transparent flex flex-col items-center justify-center"><i class="fas fa-file-export text-2xl mb-2"></i><span class="text-sm font-bold">Setup & Export</span></button>
            </div>

            <div class="hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8" id="makalah-nav-buttons">
                <button data-section="mpendahuluan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-flag text-2xl mb-2"></i><span class="text-sm font-semibold">1. Pendahuluan</span></button>
                <button data-section="mpembahasan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-comments text-2xl mb-2"></i><span class="text-sm font-semibold">2. Pembahasan</span></button>
                <button data-section="mpenutup" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-check-square text-2xl mb-2"></i><span class="text-sm font-semibold">3. Penutup</span></button>
                <button data-section="mdaftar" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-list-ol text-2xl mb-2"></i><span class="text-sm font-semibold">4. Pustaka</span></button>
                <button data-section="final" class="proposal-nav-btn bg-gradient-to-tr from-green-500 to-teal-500 text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-center border-2 border-transparent flex flex-col items-center justify-center"><i class="fas fa-file-export text-2xl mb-2"></i><span class="text-sm font-bold">Setup & Export</span></button>
            </div>

            <div class="hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8" id="jurnal-nav-buttons">
                <button data-section="jpendahuluan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-flag text-2xl mb-2"></i><span class="text-sm font-semibold">1. Pendahuluan</span></button>
                <button data-section="jmetode" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-flask text-2xl mb-2"></i><span class="text-sm font-semibold">2. Metode</span></button>
                <button data-section="jhasil" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-chart-bar text-2xl mb-2"></i><span class="text-sm font-semibold">3. Hasil & Bahas</span></button>
                <button data-section="jkesimpulan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-check-double text-2xl mb-2"></i><span class="text-sm font-semibold">4. Kesimpulan</span></button>
                <button data-section="jabstrak" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-align-center text-2xl mb-2"></i><span class="text-sm font-semibold">5. Abstrak</span></button>
                <button data-section="jdaftar" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-list text-2xl mb-2"></i><span class="text-sm font-semibold">6. Pustaka</span></button>
                <button data-section="final" class="proposal-nav-btn bg-gradient-to-tr from-green-500 to-teal-500 text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-center border-2 border-transparent flex flex-col items-center justify-center"><i class="fas fa-file-export text-2xl mb-2"></i><span class="text-sm font-bold">Setup & Export</span></button>
            </div>

            <div class="hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8" id="slr-nav-buttons">
                <button data-section="slrpendahuluan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-flag text-2xl mb-2 text-purple-600"></i><span class="text-sm font-semibold">1. Pendahuluan</span></button>
                <button data-section="slrmetode" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-search-plus text-2xl mb-2 text-gray-600"></i><span class="text-sm font-semibold">2. Metode PRISMA</span></button>
                <button data-section="slrhasil" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-table text-2xl mb-2 text-gray-600"></i><span class="text-sm font-semibold">3. Hasil Ekstraksi</span></button>
                <button data-section="slrpembahasan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-comments text-2xl mb-2 text-gray-600"></i><span class="text-sm font-semibold">4. Pembahasan</span></button>
                <button data-section="slrkesimpulan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-check-double text-2xl mb-2 text-gray-600"></i><span class="text-sm font-semibold">5. Kesimpulan</span></button>
                <button data-section="slrdaftar" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-list text-2xl mb-2 text-gray-600"></i><span class="text-sm font-semibold">6. Pustaka</span></button>
                <button data-section="final" class="proposal-nav-btn bg-gradient-to-tr from-green-500 to-teal-500 text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-center border-2 border-transparent flex flex-col items-center justify-center"><i class="fas fa-file-export text-2xl mb-2"></i><span class="text-sm font-bold">Setup & Export</span></button>
            </div>

            <div id="proposal-content">
                <div id="section-latar" class="proposal-section mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5.1 Latar Belakang (Proposal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Latar Belakang</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-latar')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-latar"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-latar" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">LATAR BELAKANG - STANDAR SINTA/SCOPUS\n\nBuatkan latar belakang untuk:\nJudul: [JUDUL]\nResearch Gap: [GAP]\nReferensi: [DATA JURNAL]\n\nATURAN KETAT:\n1. Gunakan pola Piramida Terbalik (Global -> Spesifik/Lokal).\n2. WAJIB berbasis data empiris, hindari asumsi tanpa dasar.\n3. SETIAP paragraf WAJIB memiliki sitasi (Penulis, Tahun) dari Referensi.\n4. Tegaskan "Research Gap" dan solusi penelitian ini.\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI (Dilarang memberi kalimat sapaan/pengantar/penutup).\n- DILARANG menulis ulang judul bab (Jangan tulis "Latar Belakang").\n- HANYA output paragraf utuh (800-1000 kata) tanpa tabel.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-latar')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-latar" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil latar belakang dari Gemini..."></textarea></div>
                            <button onclick="saveProposalSection('latar')" class="mt-auto w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all flex-shrink-0"><i class="fas fa-save mr-2"></i>Simpan & Lanjut</button>
                        </div>
                    </div>
                </div>

                <div id="section-rumusan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5.2 Rumusan Masalah (Proposal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Rumusan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-rumusan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-rumusan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-rumusan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">RUMUSAN MASALAH - KOHERENSIF\n\nJudul: [JUDUL]\nKonteks Latar Belakang yang telah ditulis:\n[KONTEKS_LATAR]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI.\n- Buat rumusan masalah (kalimat tanya) yang MENGALIR LOGIS dari masalah yang sudah diuraikan di Latar Belakang di atas.\n- Jangan membuat masalah baru yang tidak disinggung sebelumnya.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-rumusan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-rumusan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil rumusan masalah..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('rumusan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('rumusan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-tujuan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5.3 Tujuan Penelitian (Proposal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Tujuan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-tujuan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-tujuan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-tujuan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">TUJUAN PENELITIAN - FORMAT AKADEMIK\n\nBuatkan tujuan penelitian untuk rumusan masalah berikut: [RUMUSAN]\n\nATURAN KETAT:\n1. Jumlah poin WAJIB sama persis dengan jumlah rumusan masalah.\n2. WAJIB gunakan Kata Kerja Operasional (KKO) yang bisa diukur. Dilarang menggunakan kata "Mengetahui".\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung ikuti format teks di bawah ini:\n\nSejalan dengan rumusan masalah di atas, tujuan yang ingin dicapai dalam penelitian ini adalah:\n1. [Tujuan sinkron dengan masalah 1]\n2. [Tujuan sinkron dengan masalah 2]\n3. [Tujuan sinkron dengan masalah 3]</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-tujuan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-tujuan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil tujuan penelitian..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('tujuan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('tujuan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-manfaat" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5.4 Manfaat Penelitian (Proposal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Manfaat</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-manfaat')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-manfaat"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-manfaat" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">MANFAAT PENELITIAN - FORMAT NARATIF\n\nBuatkan manfaat penelitian untuk judul: [JUDUL] dan tujuan: [TUJUAN]\n\nATURAN KETAT:\n1. Hindari kalimat klise ("berguna bagi bangsa"). Harus spesifik.\n2. Manfaat Teoritis: Kontribusi pada teori terkait.\n3. Manfaat Praktis: Solusi nyata untuk stakeholder terkait.\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung ikuti format teks di bawah ini:\n\nPenelitian ini diharapkan dapat memberikan manfaat secara teoritis maupun praktis, yaitu:\n\n1. Manfaat Teoritis\n[Jelaskan paragraf kontribusi teoritisnya].\n\n2. Manfaat Praktis\n[Jelaskan paragraf solusi nyata bagi stakeholder].</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-manfaat')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-manfaat" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil manfaat penelitian..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('manfaat')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('manfaat')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-metode" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5.5 Metode Penelitian (Proposal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Metode</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-metode')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-metode"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-metode" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">METODE PENELITIAN - FORMAT PARAGRAF TERSTRUKTUR\n\nBuatkan untuk judul: [JUDUL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung outputkan dengan struktur tebal berikut:\n\n**1. Desain Penelitian**\n[Jelaskan paragrafnya]\n\n**2. Lokasi dan Waktu Penelitian**\n[Jelaskan paragrafnya]\n\n**3. Populasi dan Sampel / Subjek Penelitian**\n[Jelaskan paragrafnya]\n\n**4. Teknik Pengumpulan Data**\n[Jelaskan paragrafnya]\n\n**5. Teknik Analisis Data**\n[Jelaskan paragrafnya]</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-metode')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-metode" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil metode penelitian..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('metode')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('metode')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-landasan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5.6 Landasan Teori (Proposal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Landasan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-landasan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-landasan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-landasan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">LANDASAN TEORI & STATE OF THE ART\n\nBuatkan untuk judul: [JUDUL] dan variabel: [VARIABEL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab utama.\n- Langsung ikuti format di bawah ini:\n\n**1. Kajian Teori**\n[Buat 2-3 paragraf naratif yang mensintesis Grand Theory dan variabel utama].\n\n**2. Kerangka Pemikiran**\n[Buat 1 paragraf naratif yang menjelaskan alur logika hubungan antar variabel].\n\n**3. Kajian Penelitian Terdahulu (State of the Art)**\n[Buatkan 1 TABEL berisi 4 penelitian terdahulu yang relevan. Kolom tabel wajib: | Penulis & Tahun | Judul Penelitian | Metode | Hasil/Temuan | Perbedaan dgn Riset Ini | ]</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-landasan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-landasan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil landasan teori dan tabel penelitian terdahulu..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('landasan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('landasan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-hipotesis" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5.7 Hipotesis (Proposal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Hipotesis</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-hipotesis')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-hipotesis"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-hipotesis" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">HIPOTESIS PENELITIAN\n\nRumusan Masalah: [KONTEKS_RUMUSAN]\nLandasan Teori yang telah disusun: [KONTEKS_TEORI]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI.\n- Rumuskan hipotesis (H0 dan Ha) yang didasarkan PADA TEORI di atas.\n- Pastikan variabel yang dihipotesiskan sama persis dengan yang ada di teori.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-hipotesis')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex items-center mb-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                                <input type="checkbox" id="skip-hipotesis" class="mr-3 w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" onchange="toggleHipotesis()">
                                <label for="skip-hipotesis" class="text-sm font-medium text-yellow-800 cursor-pointer">Centang jika Kualitatif murni (Lewati Hipotesis)</label>
                            </div>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[200px]"><textarea id="output-hipotesis" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil teks hipotesis..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('hipotesis')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('hipotesis')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-jadwal" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5.8 Jadwal & Anggaran (Proposal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Jadwal</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-jadwal')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-jadwal"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-jadwal" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">JADWAL & ANGGARAN - WAJIB FORMAT TABEL\n\nBuatkan untuk judul: [JUDUL], durasi: [X bulan], lokasi: [LOKASI]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- HANYA output 2 Tabel ini saja secara berurutan:\n\n**1. Jadwal Penelitian**\n| No | Tahapan Kegiatan | B1 | B2 | B3 | B4 | B5 | B6 |\n|----|------------------|----|----|----|----|----|----|\n| 1 | Pengajuan Judul & Izin | ██ | | | | | |\n| 2 | Penyusunan Instrumen | | ██ | | | | |\n| 3 | Pengumpulan Data Lapangan | | | ██ | ██ | | |\n| 4 | Analisis & Validasi Data | | | | | ██ | |\n| 5 | Penyusunan Laporan & Sidang | | | | | | ██ |\n\n**2. Rencana Anggaran Biaya (RAB)**\n| No | Kategori Komponen Biaya | Rincian Kebutuhan | Estimasi Alokasi (%) |\n|----|-------------------------|-------------------|----------------------|\n| 1 | Bahan Habis Pakai / ATK | [kertas, print, internet] | 15% |\n| 2 | Operasional Lapangan | [transportasi, izin] | 40% |\n| 3 | Pengolahan Data | [lisensi software, jilid] | 20% |\n| 4 | Publikasi & Pelaporan | [APC Jurnal SINTA] | 25% |\n| | | TOTAL | 100% |</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-jadwal')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-jadwal" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm font-mono" placeholder="Paste hasil tabel jadwal & anggaran..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('jadwal')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('jadwal')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-daftar" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">Daftar Pustaka</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pustaka</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-daftar')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-daftar"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-daftar" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">DAFTAR PUSTAKA - SINKRONISASI SITASI\n\nTugas: Buat Daftar Pustaka berdasarkan draf tulisan di bawah ini.\n\nDRAF TULISAN SAYA:\n[DRAF_TULISAN]\n\nSUMBER DATA UTAMA:\n[DATA JURNAL YANG DIKAJI]\n\nINSTRUKSI KHUSUS:\n1. CRAWLING: Baca "DRAF TULISAN SAYA" di atas, temukan setiap sitasi (Nama, Tahun) yang muncul.\n2. MATCHING: Cocokkan sitasi tersebut dengan "SUMBER DATA UTAMA".\n3. GENERATE: Jika ada sitasi di teks yang tidak ada di sumber data utama (misal referensi tambahan yang baru dibuat di Bab 1/2), BUATKAN entri daftar pustakanya secara otomatis yang terlihat valid/kredibel.\n4. Pastikan SEMUA sitasi yang ada di teks masuk ke daftar pustaka. Jangan ada yang tertinggal.\n5. Format: [APA 7th Edition], A-Z.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-daftar')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-daftar" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil daftar pustaka..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('daftar')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('daftar')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan & Finalisasi</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div id="section-sdeskripsi" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-600 border-b pb-2">1. Deskripsi Data (Bab IV)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Deskripsi</h4>
                            <div class="flex-grow flex flex-col mb-4">
                                <div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-sdeskripsi')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-sdeskripsi"><i class="fas fa-copy mr-1"></i>Copy</button>
                                <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-sdeskripsi" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">BAB 4 - DESKRIPSI DATA PENELITIAN\n\nJudul: [JUDUL]\n\nATURAN KHUSUS UNTUK USER:\n(Isi/Paste ringkasan data mentah responden, demografi, atau hasil survei awal Anda di bawah ini sebelum dikirim ke AI)\nDATA PROFIL/DESKRIPTIF SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- Buat narasi akademik (minimal 3 paragraf) yang menjelaskan profil data di atas secara profesional.\n- Gunakan bahasa baku skripsi/tesis.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4"><p class="text-xs text-yellow-800"><i class="fas fa-exclamation-triangle mr-1"></i> Paste data responden/statistik deskriptif di Gemini sebelum Enter!</p></div>
                            <button onclick="openGeminiWithPrompt('prompt-sdeskripsi')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-sdeskripsi" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Deskripsi Data..."></textarea></div>
                            <button onclick="saveProposalSection('sdeskripsi')" class="mt-auto w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all flex-shrink-0"><i class="fas fa-save mr-2"></i>Simpan & Lanjut</button>
                        </div>
                    </div>
                </div>

                <div id="section-sanalisis" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-600 border-b pb-2">2. Analisis Data / Hasil Pengujian (Bab IV)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Analisis</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-sanalisis')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-sanalisis"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-sanalisis" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">BAB 4 - ANALISIS DATA & PENGUJIAN\n\nJudul: [JUDUL]\n\nATURAN KHUSUS UNTUK USER:\n(Paste output tabel SPSS / hasil uji lab / kutipan wawancara Anda di bawah ini)\nHASIL UJI SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- Tafsirkan hasil uji tersebut ke dalam paragraf naratif.\n- Jika ada angka statistik (t-hitung, p-value), sebutkan apakah itu signifikan atau tidak.\n- Jika kualitatif, narasikan temanya.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-sanalisis')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-sanalisis" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Analisis Pengujian..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('sanalisis')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('sanalisis')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-spembahasan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-600 border-b pb-2">3. Pembahasan Penelitian (Bab IV)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pembahasan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-spembahasan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-spembahasan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-spembahasan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">BAB 4 - PEMBAHASAN HASIL (DEEP DISCUSSION)\n\nJudul: [JUDUL]\nLandasan Teori (Bab 2): [KONTEKS_TEORI]\n\nATURAN KHUSUS UNTUK USER:\n(Ceritakan singkat hasil kesimpulan uji data lapangan Anda di sini)\nHASIL UJI LAPANGAN SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- SINTESISKAN: Bandingkan "HASIL UJI LAPANGAN SAYA" dengan "Landasan Teori (Bab 2)" di atas.\n- Jelaskan apakah hasil lapangan MENDUKUNG atau MENOLAK teori tersebut.\n- Berikan argumentasi ilmiah (Why/How) mengapa hasilnya demikian.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-spembahasan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-spembahasan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Pembahasan..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('spembahasan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('spembahasan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-skesimpulan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-600 border-b pb-2">4. Kesimpulan (Bab V)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Kesimpulan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-skesimpulan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-skesimpulan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-skesimpulan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">BAB 5 - KESIMPULAN (KOHEREN)\n\nRumusan Masalah Awal: [KONTEKS_RUMUSAN]\nRingkasan Hasil Pembahasan: [KONTEKS_HASIL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI.\n- Buat kesimpulan yang MENJAWAB LANGSUNG poin Rumusan Masalah Awal.\n- Jawaban harus didasarkan pada fakta di Ringkasan Hasil Pembahasan.\n- Jangan memunculkan data baru yang tidak dibahas sebelumnya.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-skesimpulan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-skesimpulan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Kesimpulan Bab 5..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('skesimpulan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('skesimpulan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-ssaran" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-600 border-b pb-2">5. Saran Penelitian (Bab V)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Saran</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-ssaran')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-ssaran"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-ssaran" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">BAB 5 - SARAN\n\nJudul: [JUDUL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Bab 5".\n- Berdasarkan topik tersebut, berikan saran konstruktif yang dibagi menjadi dua bagian:\n1. Bagi Akademisi/Peneliti Selanjutnya (Metode apa yang perlu diperbaiki).\n2. Bagi Praktisi/Masyarakat Terkait (Bagaimana temuan ini dimanfaatkan).\n- Format berupa paragraf atau poin.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-ssaran')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-ssaran" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Saran Bab 5..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('ssaran')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('ssaran')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-sdaftar" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-yellow-600 border-b pb-2">6. Daftar Pustaka Akhir</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pustaka</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-sdaftar')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-sdaftar"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-sdaftar" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">DAFTAR PUSTAKA SKRIPSI - SINKRONISASI FINAL\n\nTugas: Susun Daftar Pustaka Lengkap berdasarkan seluruh Bab 4 & 5 yang telah ditulis.\n\nDRAF BAB 4 & 5:\n[DRAF_TULISAN]\n\nREFERENSI UTAMA:\n[DATA JURNAL YANG DIKAJI]\n\nINSTRUKSI:\n1. Ekstrak semua sitasi yang tertulis di dalam Draf di atas.\n2. Gabungkan dengan Referensi Utama.\n3. Susun menjadi daftar pustaka [APA 7th Edition] yang rapi dan lengkap.\n4. Pastikan tidak ada sitasi "yatim" (ada di teks tapi tidak ada di daftar pustaka).</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-sdaftar')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-sdaftar" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil daftar pustaka..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('sdaftar')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('sdaftar')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan & Finalisasi</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-mpendahuluan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">1. Pendahuluan (Makalah)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pendahuluan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-mpendahuluan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-mpendahuluan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-mpendahuluan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">BAB I PENDAHULUAN (MAKALAH)\n\nTopik/Judul: [JUDUL]\nReferensi Terkait: [DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel.\n- DILARANG menulis ulang judul "BAB I PENDAHULUAN".\n- Langsung ikuti format di bawah ini dengan lengkap dan mendalam:\n\n**A. Latar Belakang**\n[Buat 3-4 paragraf naratif yang menjelaskan fenomena, teori dasar, dan urgensi topik ini dibahas. Wajib sertakan sitasi (Penulis, Tahun) dari referensi di atas].\n\n**B. Rumusan Masalah**\nBerdasarkan latar belakang di atas, rumusan masalah dalam makalah ini adalah:\n1. [Tulis pertanyaan 1]\n2. [Tulis pertanyaan 2]\n3. [Tulis pertanyaan 3]\n\n**C. Tujuan Penulisan**\n1. [Tujuan sinkron dengan masalah 1]\n2. [Tujuan sinkron dengan masalah 2]\n3. [Tujuan sinkron dengan masalah 3]</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-mpendahuluan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-mpendahuluan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Pendahuluan Makalah..."></textarea></div>
                            <button onclick="saveProposalSection('mpendahuluan')" class="mt-auto w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all flex-shrink-0"><i class="fas fa-save mr-2"></i>Simpan & Lanjut</button>
                        </div>
                    </div>
                </div>

                <div id="section-mpembahasan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">2. Pembahasan (Makalah)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pembahasan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-mpembahasan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-mpembahasan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-mpembahasan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">BAB II PEMBAHASAN (MAKALAH)\n\nTopik/Judul: [JUDUL]\nReferensi Utama: [DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel kecuali sangat perlu.\n- DILARANG menulis ulang judul "BAB II PEMBAHASAN".\n- Buat pembahasan sepanjang 1000-1500 kata yang padat materi.\n\nSTRUKTUR OUTPUT YANG DIWAJIBKAN:\n**A. [Sub-Bab 1: Konsep Dasar / Teori Utama]**\n[Bahas teori dari jurnal dengan sangat detail. Gunakan banyak sitasi (Nama, Tahun)].\n\n**B. [Sub-Bab 2: Analisis / Implementasi pada Topik]**\n[Sintesiskan temuan dari jurnal-jurnal di atas. Bandingkan metode/hasil mereka, apa kelebihan dan kekurangannya].\n\n**C. [Sub-Bab 3: Solusi / Pandangan Kritis]**\n[Bahas kesimpulan analitis terkait topik ini berdasarkan fakta akademik].</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-mpembahasan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-mpembahasan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Pembahasan Makalah..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('mpembahasan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('mpembahasan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-mpenutup" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">3. Penutup (Makalah)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Penutup</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-mpenutup')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-mpenutup"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-mpenutup" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">BAB III PENUTUP (MAKALAH)\n\nTopik/Judul: [JUDUL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel.\n- DILARANG menulis ulang judul "BAB III PENUTUP".\n- Langsung ikuti format di bawah ini:\n\n**A. Kesimpulan**\n[Buat 2 paragraf kesimpulan yang padat dan tajam, merangkum inti dari pembahasan sebelumnya dan menjawab rumusan masalah].\n\n**B. Saran**\n[Buat 1-2 paragraf saran atau rekomendasi yang konstruktif dan bisa diaplikasikan di lapangan terkait topik ini].</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-mpenutup')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-mpenutup" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Penutup Makalah..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('mpenutup')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('mpenutup')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-mdaftar" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">4. Daftar Pustaka (Makalah)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pustaka</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-mdaftar')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-mdaftar"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-mdaftar" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">DAFTAR PUSTAKA MAKALAH - CEK KONSISTENSI\n\nTeks Makalah:\n[DRAF_TULISAN]\n\nInstruksi:\n1. List semua referensi yang dikutip dalam teks makalah di atas.\n2. Lengkapi detail bibliografinya (Judul, Penerbit, Kota) agar terlihat valid.\n3. Format APA 7th Style.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-mdaftar')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-mdaftar" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil daftar pustaka..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('mdaftar')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('mdaftar')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan & Finalisasi</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-jpendahuluan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">1. Introduction (Artikel Jurnal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pendahuluan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-jpendahuluan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-jpendahuluan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-jpendahuluan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">1. INTRODUCTION (PENDAHULUAN JURNAL IMRaD)\n\nJudul Artikel: [JUDUL]\nReferensi Kajian: [DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "1. Introduction" atau "Pendahuluan".\n- Buat 4-5 paragraf naratif tingkat tinggi (Standar Jurnal Q1/SINTA 1).\n- Paragraf 1-2: Fenomena global & urgensi.\n- Paragraf 3: State of the Art (Sintesis dari referensi di atas, sebutkan Penulis, Tahun).\n- Paragraf 4: Temukan Research Gap secara eksplisit.\n- Paragraf 5: Statement Tujuan Utama Artikel ini.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-jpendahuluan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-jpendahuluan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Introduction Jurnal..."></textarea></div>
                            <button onclick="saveProposalSection('jpendahuluan')" class="mt-auto w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all flex-shrink-0"><i class="fas fa-save mr-2"></i>Simpan & Lanjut</button>
                        </div>
                    </div>
                </div>

                <div id="section-jmetode" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">2. Methods (Artikel Jurnal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Metode</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-jmetode')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-jmetode"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-jmetode" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">2. METHODS (METODE PENELITIAN JURNAL IMRaD)\n\nJudul Artikel: [JUDUL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "2. Methods".\n- Dilarang membuat sub-bab bernomor (seperti 2.1, 2.2). Tulis mengalir dalam 2-3 paragraf utuh yang menceritakan urutan riset.\n- Jelaskan desain, populasi/partisipan, instrumen, dan teknik analisis data yang digunakan secara padat dan teknis.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-jmetode')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-jmetode" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Metode Jurnal..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('jmetode')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('jmetode')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-jhasil" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">3. Results & Discussion (Artikel Jurnal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Hasil & Bahas</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-jhasil')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-jhasil"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-jhasil" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">3. RESULTS AND DISCUSSION (HASIL DAN PEMBAHASAN)\n\nJudul Artikel: [JUDUL]\nReferensi Terdahulu: [DATA JURNAL]\n\nATURAN KHUSUS UNTUK USER:\n(Isi/Paste temuan riset mentah Anda di baris bawah sebelum dikirim ke AI)\nDATA MENTAH SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "3. Results and Discussion".\n- Susun menjadi 2 sub: "**A. Hasil Penelitian**" (Bahas data mentah di atas) dan "**B. Pembahasan**" (Bandingkan hasil tersebut dengan Referensi Terdahulu).\n- Buat pembahasan sangat analitis, sebutkan apakah hasil ini mendukung atau menolak teori sebelumnya.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4"><p class="text-xs text-yellow-800 flex items-start"><i class="fas fa-exclamation-triangle mr-2 mt-0.5"></i><span>Penting: Tambahkan ringkasan data hasil riset Anda di dalam Gemini sebelum menekan Enter!</span></p></div>
                            <button onclick="openGeminiWithPrompt('prompt-jhasil')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-jhasil" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Results & Discussion jurnal..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('jhasil')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('jhasil')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-jkesimpulan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">4. Conclusion (Artikel Jurnal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Kesimpulan</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-jkesimpulan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-jkesimpulan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-jkesimpulan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">4. CONCLUSION (KESIMPULAN JURNAL)\n\nRumusan Masalah Awal: [KONTEKS_RUMUSAN]\nRingkasan Hasil Pembahasan: [KONTEKS_HASIL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "4. Conclusion".\n- Buat kesimpulan 1-2 paragraf yang MENJAWAB LANGSUNG poin utama riset.\n- Tambahkan 1-2 kalimat mengenai keterbatasan penelitian dan rekomendasi untuk riset masa depan.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-jkesimpulan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-jkesimpulan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Conclusion jurnal..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('jkesimpulan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('jkesimpulan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-jabstrak" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">5. Abstract (Artikel Jurnal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Abstrak</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-jabstrak')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-jabstrak"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-jabstrak" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">ABSTRAK JURNAL (REAL SUMMARY)\n\nTugas: Buat Abstrak berdasarkan naskah penuh di bawah ini.\n\nNASKAH LENGKAP:\n[DRAF_TULISAN]\n\nATURAN OUTPUT:\n- DILARANG menulis ulang kata "Abstrak".\n- Rangkum naskah di atas menjadi 1 paragraf padat (150-200 kata).\n- Struktur Wajib: Latar Belakang Singkat -> Tujuan -> Metode Utama -> Hasil Utama -> Kesimpulan.\n- Jangan mengarang data yang tidak ada di naskah.\n- Tambahkan "Keywords: [kata kunci 1], [kata kunci 2], [kata kunci 3]" di akhir paragraf.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-jabstrak')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-jabstrak" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Abstract jurnal..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('jabstrak')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('jabstrak')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-jdaftar" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">6. References (Artikel Jurnal)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt References</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-jdaftar')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-jdaftar"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-jdaftar" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">REFERENCES (JURNAL) - SYNC CHECK\n\nFull Article Draft:\n[DRAF_TULISAN]\n\nINSTRUCTIONS:\n1. CITATION EXTRACTION: Scan the draft above and extract all in-text citations.\n2. VALIDATION: Cross-check with [DATA JURNAL YANG DIKAJI].\n3. COMPILATION: Create a complete Reference list containing ONLY sources actually cited in the draft.\n4. Style: [APA 7th Edition].</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-jdaftar')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-jdaftar" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil References jurnal..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('jdaftar')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('jdaftar')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan & Finalisasi</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-slrpendahuluan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-purple-700 border-b pb-2">1. Pendahuluan (Review SLR)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pendahuluan SLR</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-slrpendahuluan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-slrpendahuluan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-slrpendahuluan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">PENDAHULUAN SYSTEMATIC LITERATURE REVIEW (SLR)\n\nTopik/Judul Review: [JUDUL]\nBahan Kajian: [DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Pendahuluan".\n- Tulis 4-5 paragraf naratif standar publikasi internasional.\n- Paragraf 1-2: Jelaskan fenomena, pentingnya topik ini, dan teori dasar.\n- Paragraf 3: Jelaskan mengapa riset SLR di bidang ini sangat mendesak dilakukan (Research Gap dari studi review sebelumnya).\n- Paragraf 4: Tuliskan "Research Questions (RQ)" atau Pertanyaan Penelitian yang ingin dijawab dalam review ini (minimal 2 RQ).\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-slrpendahuluan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-slrpendahuluan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Pendahuluan SLR..."></textarea></div>
                            <button onclick="saveProposalSection('slrpendahuluan')" class="mt-auto w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all flex-shrink-0"><i class="fas fa-save mr-2"></i>Simpan & Lanjut</button>
                        </div>
                    </div>
                </div>

                <div id="section-slrmetode" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-purple-700 border-b pb-2">2. Metode PRISMA (Review SLR)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Metode PRISMA</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-slrmetode')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-slrmetode"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-slrmetode" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">METODOLOGI SYSTEMATIC LITERATURE REVIEW\n\nTopik/Judul Review: [JUDUL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Metodologi".\n- Tulis metode berdasarkan panduan PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses).\n- Wajib memiliki Sub-bab ini:\n  **A. Strategi Pencarian (Search Strategy)**: Sebutkan database (Google Scholar, SINTA, Scopus) dan keyword boolean yang digunakan.\n  **B. Kriteria Inklusi dan Eksklusi**: Buat dalam bentuk list (misal: hanya jurnal 5 tahun terakhir, bahasa inggris/indonesia, tipe artikel primary).\n  **C. Ekstraksi Data**: Jelaskan bagaimana data dari literatur diekstrak.\n- DILARANG MENGGUNAKAN TABEL.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-slrmetode')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-slrmetode" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Metode PRISMA..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('slrmetode')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('slrmetode')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-slrhasil" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-purple-700 border-b pb-2">3. Hasil Ekstraksi (Review SLR)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Ekstraksi (Matriks)</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-slrhasil')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-slrhasil"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-slrhasil" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">HASIL EKSTRAKSI DATA SYSTEMATIC REVIEW\n\nBahan Kajian: [DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Hasil Ekstraksi".\n- Buat 1 TABEL MATRIKS SINTESIS RAKSASA yang membedah seluruh jurnal di atas.\n- Format Kolom Tabel WAJIB:\n  | Author & Tahun | Tujuan Studi | Metode / Sampel | Temuan Utama (Results) | Limitasi Jurnal |\n- Pastikan semua jurnal yang diberikan masuk ke dalam tabel tersebut secara rapi.\n- Berikan sedikit 1 paragraf narasi pengantar sebelum tabel.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-slrhasil')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-slrhasil" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm font-mono" placeholder="Paste tabel matriks hasil ekstraksi..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('slrhasil')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('slrhasil')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-slrpembahasan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-purple-700 border-b pb-2">4. Pembahasan SLR (Review SLR)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pembahasan SLR</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-slrpembahasan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-slrpembahasan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-slrpembahasan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">PEMBAHASAN SYSTEMATIC LITERATURE REVIEW (DISCUSSION)\n\nBahan Kajian: [DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Pembahasan".\n- DILARANG menggunakan tabel.\n- Berdasarkan kumpulan jurnal tersebut, buat analisis pembahasan mendalam (minimal 800 kata).\n- Kelompokkan pembahasan berdasarkan 2-3 tema besar yang mendominasi temuan jurnal-jurnal tersebut (Gunakan Sub-bab tebal untuk setiap tema).\n- Bandingkan perbedaan pandangan atau metode antar author.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-slrpembahasan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-slrpembahasan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste narasi pembahasan SLR..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('slrpembahasan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('slrpembahasan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-slrkesimpulan" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-purple-700 border-b pb-2">5. Kesimpulan (Review SLR)</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Kesimpulan SLR</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-slrkesimpulan')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-slrkesimpulan"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-slrkesimpulan" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">KESIMPULAN SYSTEMATIC LITERATURE REVIEW\n\nBahan Kajian Utama: [GAP]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Kesimpulan".\n- Buat 2 paragraf padat.\n- Paragraf 1: Jawaban inti dari review literatur ini (apa benang merahnya).\n- Paragraf 2: Rekomendasi gap penelitian untuk riset di masa depan (Future Work) yang sangat spesifik berdasarkan kekurangan literatur saat ini.\n- TANPA BASA-BASI AI.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-slrkesimpulan')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-slrkesimpulan" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil Kesimpulan SLR..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('slrkesimpulan')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('slrkesimpulan')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-slrdaftar" class="proposal-section hidden mb-6">
                    <h3 class="text-2xl font-bold mb-6 text-purple-700 border-b pb-2">6. Daftar Pustaka SLR</h3>
                    <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt Pustaka SLR</h4>
                            <div class="flex-grow flex flex-col mb-4"><div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]"><button onclick="copyPromptText('prompt-slrdaftar')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-slrdaftar"><i class="fas fa-copy mr-1"></i>Copy</button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar"><pre id="prompt-slrdaftar" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">DAFTAR PUSTAKA - SYSTEMATIC REVIEW\n\nTopik SLR: [JUDUL]\nJurnal yang Direview (Primary Studies): [DATA JURNAL YANG DIKAJI]\n\nATURAN KHUSUS:\n1. WAJIB: Masukkan semua "Jurnal yang Direview" di atas ke dalam daftar pustaka.\n2. TAMBAHAN: Cek teks berikut [DRAF_TULISAN], jika ada sitasi buku metodologi (seperti Kitchenham/PRISMA), masukkan juga ke daftar ini.\n3. Format: [APA 7th Edition], A-Z.</pre></div></div></div>
                            <button onclick="openGeminiWithPrompt('prompt-slrdaftar')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0"><i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste</button>
                        </div>
                        <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                            <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                            <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]"><textarea id="output-slrdaftar" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil daftar pustaka..."></textarea></div>
                            <div class="mt-auto flex gap-3 flex-shrink-0">
                                <button onclick="prevProposalSection('slrdaftar')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                                <button onclick="saveProposalSection('slrdaftar')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan & Finalisasi</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="section-final" class="proposal-section hidden bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
                    <div class="text-center mb-8 mt-4">
                        <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i class="fas fa-check-circle text-4xl text-green-600"></i>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800">Dokumen Siap Diekspor!</h3>
                        <p class="text-gray-600 mt-2">Atur tata letak (layout) dokumen sesuai persyaratan kampus atau jurnal Anda sebelum mengunduh.</p>
                    </div>

                    <div class="max-w-2xl mx-auto mb-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center">
                            <i class="fas fa-sliders-h text-indigo-600 mr-2"></i>
                            <h4 class="font-bold text-gray-700">Pengaturan Tata Letak (Page Setup)</h4>
                        </div>
                        <div class="p-4 grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <label class="block font-semibold text-gray-600 mb-1">Ukuran Kertas</label>
                                <select id="settingPaper" class="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500">
                                    <option value="21cm 29.7cm">A4 (Standar Skripsi/Jurnal)</option>
                                    <option value="21.59cm 27.94cm">Letter (Standar Internasional)</option>
                                    <option value="21.5cm 33cm">F4 / Folio</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-gray-600 mb-1">Margin (Tepi Kertas)</label>
                                <select id="settingMargin" class="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500">
                                    <option value="4cm 3cm 3cm 4cm">Standar Skripsi (Kiri 4, Atas 4, Kanan 3, Bawah 3)</option>
                                    <option value="3cm 2.5cm 2.5cm 2.5cm">Normal / Proposal (Kiri 3, Atas 3, Kanan 2.5, Bawah 2.5)</option>
                                    <option value="2.54cm 2.54cm 2.54cm 2.54cm">Margin IEEE/Jurnal Internasional (2.54cm semua sisi)</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-gray-600 mb-1">Jenis Font</label>
                                <select id="settingFont" class="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500">
                                    <option value="'Times New Roman', serif">Times New Roman (Standar)</option>
                                    <option value="'Arial', sans-serif">Arial</option>
                                    <option value="'Calibri', sans-serif">Calibri</option>
                                </select>
                            </div>
                            <div>
                                <label class="block font-semibold text-gray-600 mb-1">Spasi Baris (Line Spacing)</label>
                                <select id="settingSpacing" class="w-full p-2 border rounded-lg focus:outline-none focus:border-indigo-500">
                                    <option value="1.5">1.5 Lines (Standar Makalah/Skripsi)</option>
                                    <option value="2.0">Double (Persyaratan Draft Jurnal tertentu)</option>
                                    <option value="1.15">1.15 Lines (Standar Artikel 2 Kolom)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="max-w-md mx-auto mb-4" id="proposalFormatContainer">
                        <label class="block text-sm font-bold text-gray-700 mb-2 text-center">Struktur Bab:</label>
                        <select id="proposalFormat" class="w-full p-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none mb-6 cursor-pointer text-gray-700 font-medium text-center">
                            <option value="bab">Format Lengkap (BAB I, II, III) - Standar Tugas Akhir</option>
                            <option value="mini">Format Sederhana (A, B, C...) - Laporan Ringkas</option>
                        </select>
                        <button id="btnDownloadStandard" onclick="downloadDOCX()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg transform hover:scale-[1.02]">
                            <i class="fas fa-file-word mr-2 text-xl"></i>Download Dokumen (DOCX)
                        </button>
                    </div>
                    
                    <div class="max-w-md mx-auto mb-4 hidden" id="jurnalDownloadContainer">
                        <button id="btnDownloadJurnal" onclick="downloadDOCX()" class="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center shadow-lg transform hover:scale-[1.02]">
                            <i class="fas fa-file-word mr-2 text-xl"></i>Download Artikel (Format 2 Kolom)
                        </button>
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 z-40 bg-gray-50/95 backdrop-blur pt-4 pb-4 border-t border-gray-200 mt-8 flex justify-between">
                <button onclick="goToStep(4)" class="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-100"><i class="fas fa-arrow-left mr-2"></i>Kembali ke Judul</button>
            </div>
        </section>
        `;

        // Add event listeners that depend on DOM elements created above
        const navButtons = document.querySelectorAll('.proposal-nav-btn');
        if (navButtons.length > 0 && typeof showProposalSection === 'function') {
            navButtons.forEach(btn => {
                btn.addEventListener('click', function() { 
                    showProposalSection(this.getAttribute('data-section')); 
                });
            });
        }
    }
});