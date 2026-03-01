// ==========================================
// FILE 4: step5-ui.js (DATA DRIVEN REFACTOR + DYNAMIC NAV)
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const step5Container = document.getElementById('step5-container');
    
    // 1. FUNGSI TEMPLATE BUILDER UNTUK SECTION PROMPT
    const buildSectionHTML = (id, title, defaultPromptText, customInfo = null, hasCheckbox = false) => {
        const finalPromptText = (AppState.customPrompts && AppState.customPrompts[id]) 
            ? AppState.customPrompts[id] 
            : defaultPromptText;

        // FIXED: Hilangkan mb-6 agar jarak dikontrol oleh padding tombol di bawahnya
        const plagiarismPlaceholder = `<div id="plagiarism-panel-${id}" class="mt-2"></div>`;
        
        // DETEKSI APAKAH INI BAB DAFTAR PUSTAKA
        const isDaftarPustaka = id.includes('daftar');

        return `
        <div id="section-${id}" class="proposal-section hidden mb-6">
            <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">${title}</h3>
            <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                
                <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                    <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600">
                        <i class="fas fa-magic mr-3"></i>Instruksi & Prompt AI
                    </h4>

                    ${customInfo ? `
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-r-lg text-sm text-yellow-800 flex items-start shadow-sm">
                        <i class="fas fa-info-circle mt-0.5 mr-2"></i>
                        <p><strong>Tips User:</strong> ${customInfo}</p>
                    </div>
                    ` : ''}

                    <div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px] shadow-inner border border-gray-800">
                        <div class="absolute top-2 right-2 flex gap-2 z-10">
                            <button id="btn-edit-${id}" onclick="toggleEditPrompt('${id}')" class="bg-gray-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-gray-500 transition-colors shadow-sm font-semibold flex items-center">
                                <i class="fas fa-edit mr-1"></i>Edit
                            </button>
                            <button onclick="copyPromptText('prompt-${id}')" class="copy-btn bg-indigo-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-indigo-500 transition-colors shadow-sm font-semibold flex items-center" data-prompt-id="prompt-${id}">
                                <i class="fas fa-copy mr-1"></i>Copy
                            </button>
                        </div>
                        <div class="absolute inset-0 p-4 mt-8 overflow-y-auto custom-scrollbar">
                            <pre id="prompt-${id}" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0 leading-relaxed outline-none" contenteditable="false">${finalPromptText}</pre>
                        </div>
                    </div>

                    <div class="mt-auto pt-6 flex gap-3 flex-shrink-0 border-t border-transparent">
                        <button onclick="openGeminiWithPrompt('prompt-${id}')" class="flex-1 bg-indigo-50 text-indigo-700 py-3.5 rounded-xl font-bold hover:bg-indigo-100 transition-all border border-indigo-200 shadow-sm flex items-center justify-center">
                            <i class="fas fa-external-link-alt mr-2"></i>Manual Tab
                        </button>
                        <button onclick="generateWithAPI('prompt-${id}', 'output-${id}')" class="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all border border-purple-500 shadow-sm flex items-center justify-center">
                            <i class="fas fa-robot mr-2"></i>Auto API
                        </button>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                    <h4 class="text-lg font-bold mb-4 flex items-center text-green-600">
                        <i class="fas fa-paste mr-3"></i>Paste Hasil AI & Editor
                    </h4>
                    
                    ${hasCheckbox ? `
                    <div class="flex items-center mb-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                        <input type="checkbox" id="skip-${id}" class="mr-3 w-5 h-5 text-indigo-600" onchange="toggleHipotesis()">
                        <label for="skip-${id}" class="text-sm font-medium text-yellow-800">Centang jika Kualitatif murni (Lewati Bagian)</label>
                    </div>` : ''}
                    
                    <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]">
                        <textarea id="output-${id}" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil dari AI di sini..."></textarea>
                    </div>
                    
                    <div class="flex flex-wrap gap-2 mb-4 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 shadow-inner">
                        <span class="text-xs font-bold text-indigo-500 flex items-center mr-1">
                            <i class="fas fa-magic mr-1"></i> Edit Blok:
                        </span>
                        <button onclick="handleMicroEdit('${id}', 'perpanjang')" class="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                            <i class="fas fa-expand-alt mr-1"></i>Perpanjang
                        </button>
                        <button onclick="handleMicroEdit('${id}', 'perbaiki')" class="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                            <i class="fas fa-spell-check mr-1"></i>Perbaiki
                        </button>
                        <button onclick="handleMicroEdit('${id}', 'parafrase')" class="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-600 hover:text-white transition-all">
                            <i class="fas fa-sync-alt mr-1"></i>Parafrase
                        </button>
                    </div>

                    ${plagiarismPlaceholder}

                    <div class="mt-auto pt-6 flex gap-3 flex-shrink-0 border-t border-transparent">
                        <button onclick="prevProposalSection('${id}')" class="flex-1 bg-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-300 transition-all shadow-sm flex items-center justify-center">
                            <i class="fas fa-arrow-left mr-2"></i>Kembali
                        </button>
                        
                        ${isDaftarPustaka ? `
                        <button onclick="exportFinalRISToMendeley('${id}')" class="flex-1 bg-blue-100 text-blue-700 py-3.5 rounded-xl font-bold hover:bg-blue-200 transition-all border border-blue-200 shadow-sm flex items-center justify-center">
                            <i class="fas fa-file-export mr-2"></i>Export .RIS
                        </button>
                        ` : ''}

                        <button onclick="saveProposalSection('${id}')" class="flex-1 bg-green-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all shadow-sm flex items-center justify-center">
                            <i class="fas fa-save mr-2"></i>Simpan
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    };

    // 2. DATA KONFIGURASI NAVIGASI TOMBOL (DYNAMIC NAV)
    const navConfig = {
        proposal: [
            { id: 'latar', icon: 'fa-file-alt', label: '1. Latar Belakang' },
            { id: 'rumusan', icon: 'fa-question-circle', label: '2. Rumusan' },
            { id: 'tujuan', icon: 'fa-bullseye', label: '3. Tujuan' },
            { id: 'manfaat', icon: 'fa-hand-holding-heart', label: '4. Manfaat' },
            { id: 'metode', icon: 'fa-flask', label: '5. Metode' },
            { id: 'landasan', icon: 'fa-book', label: '6. Landasan Teori' },
            { id: 'hipotesis', icon: 'fa-balance-scale', label: '7. Hipotesis' },
            { id: 'jadwal', icon: 'fa-calendar-alt', label: '8. Jadwal & Biaya' },
            { id: 'daftar', icon: 'fa-list-ol', label: '9. Pustaka' },
            { id: 'final', icon: 'fa-file-export', label: 'Setup & Export', isFinal: true }
        ],
        robotik: [
            { id: 'rpendahuluan', icon: 'fa-flag', label: '1. Pendahuluan' },
            { id: 'rtinjauan', icon: 'fa-book', label: '2. Tinjauan Pustaka' },
            { id: 'rspesifikasi', icon: 'fa-microchip', label: '3. Spesifikasi' },
            { id: 'rmetode', icon: 'fa-cogs', label: '4. Metode & Target' },
            { id: 'rjadwal', icon: 'fa-calendar-alt', label: '5. Jadwal & RAB' },
            { id: 'rdaftar', icon: 'fa-list-ol', label: '6. Pustaka' },
            { id: 'final', icon: 'fa-file-export', label: 'Setup & Export', isFinal: true }
        ],
        skripsi: [
            { id: 'sdeskripsi', icon: 'fa-users', label: '1. Deskripsi Data' },
            { id: 'sanalisis', icon: 'fa-chart-pie', label: '2. Analisis Hasil' },
            { id: 'spembahasan', icon: 'fa-comments', label: '3. Pembahasan' },
            { id: 'skesimpulan', icon: 'fa-check-double', label: '4. Kesimpulan' },
            { id: 'ssaran', icon: 'fa-lightbulb', label: '5. Saran' },
            { id: 'sdaftar', icon: 'fa-list', label: '6. Pustaka' },
            { id: 'final', icon: 'fa-file-export', label: 'Setup & Export', isFinal: true }
        ],
        makalah: [
            { id: 'mpendahuluan', icon: 'fa-flag', label: '1. Pendahuluan' },
            { id: 'mpembahasan', icon: 'fa-comments', label: '2. Pembahasan' },
            { id: 'mpenutup', icon: 'fa-check-square', label: '3. Penutup' },
            { id: 'mdaftar', icon: 'fa-list-ol', label: '4. Pustaka' },
            { id: 'final', icon: 'fa-file-export', label: 'Setup & Export', isFinal: true }
        ],
        jurnal: [
            { id: 'jpendahuluan', icon: 'fa-flag', label: '1. Pendahuluan' },
            { id: 'jmetode', icon: 'fa-flask', label: '2. Metode' },
            { id: 'jhasil', icon: 'fa-chart-bar', label: '3. Hasil & Bahas' },
            { id: 'jkesimpulan', icon: 'fa-check-double', label: '4. Kesimpulan' },
            { id: 'jabstrak', icon: 'fa-align-center', label: '5. Abstrak' },
            { id: 'jdaftar', icon: 'fa-list', label: '6. Pustaka' },
            { id: 'final', icon: 'fa-file-export', label: 'Setup & Export', isFinal: true }
        ],
        slr: [
            { id: 'slrpendahuluan', icon: 'fa-flag', label: '1. Pendahuluan' },
            { id: 'slrmetode', icon: 'fa-search-plus', label: '2. Metode PRISMA' },
            { id: 'slrhasil', icon: 'fa-table', label: '3. Hasil Ekstraksi' },
            { id: 'slrpembahasan', icon: 'fa-comments', label: '4. Pembahasan' },
            { id: 'slrkesimpulan', icon: 'fa-check-double', label: '5. Kesimpulan' },
            { id: 'slrabstrak', icon: 'fa-align-center', label: '6. Abstrak SLR' },
            { id: 'slrdaftar', icon: 'fa-list', label: '7. Pustaka' },
            { id: 'final', icon: 'fa-file-export', label: 'Setup & Export', isFinal: true }
        ]
    };

    // 3. FUNGSI TEMPLATE BUILDER UNTUK TOMBOL NAVIGASI
    const buildNavButtonsHTML = (docType, buttons) => {
        let html = `<div class="hidden grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8" id="${docType}-nav-buttons">`;
        buttons.forEach(btn => {
            if (btn.isFinal) {
                html += `
                <button data-section="${btn.id}" class="proposal-nav-btn bg-gradient-to-tr from-green-500 to-teal-500 text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-center border-2 border-transparent flex flex-col items-center justify-center">
                    <i class="fas ${btn.icon} text-2xl mb-2"></i><span class="text-sm font-bold">${btn.label}</span>
                </button>`;
            } else {
                html += `
                <button data-section="${btn.id}" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center">
                    <i class="fas ${btn.icon} text-2xl mb-2"></i><span class="text-sm font-semibold">${btn.label}</span>
                </button>`;
            }
        });
        html += `</div>`;
        return html;
    };

    // 4. SELURUH DATA PROMPT LENGKAP
    const sectionsData = [
        // --- PROPOSAL ---
        { id: 'latar', title: '5.1 Latar Belakang (Proposal)', promptText: `LATAR BELAKANG - STANDAR SINTA/SCOPUS\n\nBuatkan latar belakang untuk:\nJudul: [JUDUL]\nResearch Gap: [GAP]\nReferensi: [DATA JURNAL]\n\nATURAN KETAT:\n1. Gunakan pola Piramida Terbalik (Global -> Spesifik/Lokal).\n2. WAJIB berbasis data empiris, hindari asumsi tanpa dasar.\n3. SETIAP paragraf WAJIB memiliki sitasi (Penulis, Tahun) dari Referensi.\n4. Tegaskan "Research Gap" dan solusi penelitian ini.\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI (Dilarang memberi kalimat sapaan/pengantar/penutup).\n- DILARANG menulis ulang judul bab (Jangan tulis "Latar Belakang").\n- HANYA output paragraf utuh (800-1000 kata) tanpa tabel.` },
        { id: 'rumusan', title: '5.2 Rumusan Masalah (Proposal)', promptText: `RUMUSAN MASALAH - KOHERENSIF\n\nJudul: [JUDUL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI.\n- Buat rumusan masalah (kalimat tanya) yang MENGALIR LOGIS dari masalah yang sudah diuraikan di Latar Belakang di atas.\n- Jangan membuat masalah baru yang tidak disinggung sebelumnya.` },
        { id: 'tujuan', title: '5.3 Tujuan Penelitian (Proposal)', promptText: `TUJUAN PENELITIAN - FORMAT AKADEMIK\n\nATURAN KETAT:\n1. Jumlah poin WAJIB sama persis dengan jumlah rumusan masalah.\n2. WAJIB gunakan Kata Kerja Operasional (KKO) yang bisa diukur. Dilarang menggunakan kata "Mengetahui".\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung ikuti format teks di bawah ini:\n\nSejalan dengan rumusan masalah di atas, tujuan yang ingin dicapai dalam penelitian ini adalah:\n1. [Tujuan sinkron dengan masalah 1]\n2. [Tujuan sinkron dengan masalah 2]\n3. [Tujuan sinkron dengan masalah 3]` },
        { id: 'manfaat', title: '5.4 Manfaat Penelitian (Proposal)', promptText: `MANFAAT PENELITIAN - FORMAT NARATIF\n\nBuatkan manfaat penelitian untuk judul: [JUDUL] dan tujuan: [TUJUAN]\n\nATURAN KETAT:\n1. Hindari kalimat klise ("berguna bagi bangsa"). Harus spesifik.\n2. Manfaat Teoritis: Kontribusi pada teori terkait.\n3. Manfaat Praktis: Solusi nyata untuk stakeholder terkait.\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung ikuti format teks di bawah ini:\n\nPenelitian ini diharapkan dapat memberikan manfaat secara teoritis maupun praktis, yaitu:\n\n1. Manfaat Teoritis\n[Jelaskan paragraf kontribusi teoritisnya].\n\n2. Manfaat Praktis\n[Jelaskan paragraf solusi nyata bagi stakeholder].` },
        { id: 'metode', title: '5.5 Metode Penelitian (Proposal)', promptText: `METODE PENELITIAN - FORMAT PARAGRAF TERSTRUKTUR\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung outputkan dengan struktur tebal berikut:\n\n**1. Desain Penelitian**\n[Jelaskan paragrafnya]\n\n**2. Lokasi dan Waktu Penelitian**\n[Jelaskan paragrafnya]\n\n**3. Populasi dan Sampel / Subjek Penelitian**\n[Jelaskan paragrafnya]\n\n**4. Teknik Pengumpulan Data**\n[Jelaskan paragrafnya]\n\n**5. Teknik Analisis Data**\n[Jelaskan paragrafnya]` },
        { id: 'landasan', title: '5.6 Landasan Teori (Proposal)', promptText: `LANDASAN TEORI & STATE OF THE ART\n\nBuatkan untuk judul: [JUDUL] dan variabel: [VARIABEL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab utama.\n- Langsung ikuti format di bawah ini:\n\n**1. Kajian Teori**\n[Buat 2-3 paragraf naratif yang mensintesis Grand Theory dan variabel utama].\n\n**2. Kerangka Pemikiran**\n[Buat 1 paragraf naratif yang menjelaskan alur logika hubungan antar variabel].\n\n**3. Kajian Penelitian Terdahulu (State of the Art)**\n[Buatkan 1 TABEL berisi 4 penelitian terdahulu yang relevan. Kolom tabel wajib: | Penulis & Tahun | Judul Penelitian | Metode | Hasil/Temuan | Perbedaan dgn Riset Ini | ]` },
        { id: 'hipotesis', title: '5.7 Hipotesis (Proposal)', promptText: `HIPOTESIS PENELITIAN - FORMAT FORMAL

Berdasarkan tinjauan pustaka, buatlah hipotesis penelitian untuk judul: [JUDUL]

ATURAN OUTPUT MUTLAK:
1. TANPA BASA-BASI (Langsung ke daftar hipotesis).
2. Gunakan format penomoran (1, 2, dst) dan tebalkan kode Ha/H0.
3. Gunakan angka nol (0) untuk H0, bukan huruf O.
4. JANGAN gunakan simbol asterisk (*) di tengah kalimat.

CONTOH FORMAT YG DIWAJIBKAN:
1. **Ha**: Terdapat pengaruh signifikan...
   **H0**: Tidak terdapat pengaruh signifikan...
2. **Ha**: Integrasi metode wearable dan diari...
   **H0**: Integrasi metode wearable dan diari...`, hasCheckbox: true },
        { id: 'jadwal', title: '5.8 Jadwal & Anggaran (Proposal)', promptText: `JADWAL & ANGGARAN - WAJIB FORMAT TABEL\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- HANYA output 2 Tabel ini saja secara berurutan:\n\n**1. Jadwal Penelitian**\n| No | Tahapan Kegiatan | B1 | B2 | B3 | B4 | B5 | B6 |\n|----|------------------|----|----|----|----|----|----|\n| 1 | Pengajuan Judul & Izin | ██ | | | | | |\n| 2 | Penyusunan Instrumen | | ██ | | | | |\n| 3 | Pengumpulan Data Lapangan | | | ██ | ██ | | |\n| 4 | Analisis & Validasi Data | | | | | ██ | |\n| 5 | Penyusunan Laporan & Sidang | | | | | | ██ |\n\n**2. Rencana Anggaran Biaya (RAB)**\n| No | Kategori Komponen Biaya | Rincian Kebutuhan | Estimasi Alokasi (%) |\n|----|-------------------------|-------------------|----------------------|\n| 1 | Bahan Habis Pakai / ATK | [kertas, print, internet] | 15% |\n| 2 | Operasional Lapangan | [transportasi, izin] | 40% |\n| 3 | Pengolahan Data | [lisensi software, jilid] | 20% |\n| 4 | Publikasi & Pelaporan | [APC Jurnal SINTA] | 25% |\n| | | TOTAL | 100% |` },
        { id: 'daftar', title: '5.9 Daftar Pustaka (Proposal)', promptText: `DAFTAR PUSTAKA - OUTPUT MUTLAK APA 7TH\n\nDRAF TULISAN SAYA:\n[DRAF_TULISAN]\n\nSUMBER DATA UTAMA:\n[DATA JURNAL YANG DIKAJI]\n\nATURAN MUTLAK (BACA DENGAN TELITI):\n1. DILARANG KERAS memberikan komentar, analisis konsistensi, sapaan, atau penolakan. HANYA KELUARKAN DAFTAR PUSTAKA.\n2. Susun daftar pustaka dari Sumber Data Utama. Jika ada sitasi di Draf yang tidak ada di Sumber Data, buatkan referensi yang logis.\n3. Format WAJIB: APA 7th Edition, urut abjad (A-Z).\n4. WAJIB sertakan URL web/DOI di setiap akhir referensi dengan format Markdown persis seperti ini: [https://linkjurnal.com](https://linkjurnal.com)` },
        
        // --- PROYEK ROBOTIK / IT ---
        { id: 'rpendahuluan', title: '1. Pendahuluan (Robotik)', promptText: `BAB I: PENDAHULUAN (PROYEK ROBOTIK/IT)\n\nJudul Proyek: [JUDUL]\nReferensi Jurnal Terkait: [DATA JURNAL YANG DIKAJI]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Bab 1".\n- Buatkan 4 paragraf berisi:\n  1. Latar belakang masalah di lapangan (WAJIB sertakan sitasi/kutipan Penulis, Tahun dari Referensi Jurnal Terkait di atas).\n  2. Solusi konvensional yang ada saat ini dan kelemahannya.\n  3. Usulan proyek robotika/sistem ini sebagai inovasi solusi.\n  4. Rumusan masalah, Batasan masalah, dan Tujuan pembuatan alat (Gunakan format poin angka).\n- Gunakan bahasa formal khas proposal teknologi.` },
        { id: 'rtinjauan', title: '2. Tinjauan Pustaka & Dasar Teori', promptText: `BAB II: TINJAUAN PUSTAKA\n\nTopik/Judul Proyek: [JUDUL]\nReferensi Jurnal Terkait: [DATA JURNAL YANG DIKAJI]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Bab 2".\n- Buatkan:\n  **A. State of the Art (Penelitian Terdahulu):** Review 2-3 riset sebelumnya dari Jurnal Terkait yang menjadi landasan proyek ini (Sebutkan Penulis, Tahun) beserta perbedaannya dengan alat yang diajukan.\n  **B. Dasar Teori Komponen Utama:** Jelaskan secara ringkas 3 komponen/teknologi utama (misal: mikrokontroler, sensor, atau algoritma) yang dipakai pada alat ini.` },
        { id: 'rspesifikasi', title: '3. Spesifikasi & Desain Sistem', promptText: `BAB III: SPESIFIKASI DAN DESAIN SISTEM\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Bab 3".\n- Rancang spesifikasi teknis tingkat tinggi untuk robot/sistem: [JUDUL].\n- Buat menggunakan list/poin tebal. Wajib mencakup:\n  **A. Spesifikasi Hardware (Perangkat Keras):** (Sebutkan jenis mikrokontroler, sensor, aktuator/motor, modul daya yang logis dipakai).\n  **B. Spesifikasi Software (Perangkat Lunak):** (Bahasa pemrograman, IDE, framework, atau protokol komunikasi seperti MQTT/HTTP jika pakai IoT).\n  **C. Gambaran Fungsionalitas:** (Jelaskan urutan cara kerja alat ini menerima input, memproses, dan menghasilkan output).` },
        { id: 'rmetode', title: '4. Metode Pelaksanaan & Target', promptText: `BAB IV: METODE PELAKSANAAN DAN TARGET LUARAN\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Bab 4".\n- Uraikan langkah-langkah *engineering design process*.\n- Wajib mencakup sub-bagian:\n  **A. Tahap Pelaksanaan Proyek:** Uraikan dari Studi Literatur, Perancangan Desain Hardware, Koding, hingga Pengujian (Testing).\n  **B. Target Luaran Produk:** (Bentuk fisik alat, spesifikasi ketahanan, atau dokumentasi/manual book).\n  **C. Manfaat Praktis:** (Siapa yang akan diuntungkan dari alat ini di lapangan).` },
        { id: 'rjadwal', title: '5. Jadwal & RAB (Format Tabel)', promptText: `BAB V: JADWAL DAN RAB (FORMAT TABEL MUTLAK)\n\nATURAN OUTPUT MUTLAK:\n- HANYA output 2 Tabel ini saja secara berurutan tanpa kata pengantar apapun:\n\n**A. Jadwal Pelaksanaan Proyek**\n| No | Tahapan Kegiatan | B1 | B2 | B3 | B4 |\n|----|------------------|----|----|----|----|\n| 1 | Riset & Desain Sistem | ██ | | | |\n| 2 | Pembelian Komponen | ██ | | | |\n| 3 | Perakitan & Koding | | ██ | ██ | |\n| 4 | Pengujian & Kalibrasi | | | ██ | ██ |\n| 5 | Evaluasi & Laporan Akhir | | | | ██ |\n\n**B. Rencana Anggaran Biaya (RAB)**\n| No | Kategori Komponen | Rincian Kebutuhan Standar | Estimasi Alokasi (%) |\n|----|-------------------|---------------------------|----------------------|\n| 1 | Komputasi Utama & Sensor | [Mikrokontroler, sensor terkait] | 35% |\n| 2 | Aktuator & Mekanik | [Motor, Sasis, 3D Print] | 30% |\n| 3 | Power & Elektronika | [Baterai, Kabel, PCB] | 15% |\n| 4 | Operasional & Laporan | [Print, Jilid, Transportasi] | 20% |\n| | | TOTAL | 100% |` },
        { id: 'rdaftar', title: '6. Daftar Pustaka (Robotik)', promptText: `DAFTAR PUSTAKA PROPOSAL ROBOTIK\n\nReferensi Jurnal Terkait: [DATA JURNAL YANG DIKAJI]\nDraf Proposal Sebelumnya:\n[DRAF_TULISAN]\n\nATURAN MUTLAK:\n1. DILARANG KERAS memberikan komentar atau evaluasi. HANYA OUTPUT DAFTAR PUSTAKA.\n2. Susun referensi menggunakan format IEEE Style atau APA 7th Edition.\n3. Masukkan referensi dari "Referensi Jurnal Terkait" beserta teori tambahan (jika ada).\n4. WAJIB sertakan tautan URL di setiap akhir baris referensi (seperti link datasheet atau link jurnal) dengan format Markdown: [https://link.com](https://link.com)` },

        // --- SKRIPSI (BAB 4 & 5) ---
        { id: 'sdeskripsi', title: '1. Deskripsi Data (Bab IV)', promptText: `BAB 4 - DESKRIPSI DATA PENELITIAN\n\nTopik Skripsi: [JUDUL]\n\nATURAN KHUSUS UNTUK USER:\n(Isi/Paste ringkasan data mentah responden, demografi, atau hasil survei awal Anda di bawah ini sebelum dikirim ke AI)\nDATA PROFIL/DESKRIPTIF SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- Buat narasi akademik (minimal 3 paragraf) yang menjelaskan profil data di atas secara profesional dan kaitkan dengan topik Skripsi.\n- Gunakan bahasa baku skripsi/tesis.\n- TANPA BASA-BASI AI.`, customInfo: 'Paste data responden/statistik deskriptif di Gemini sebelum Enter!' },
        { id: 'sanalisis', title: '2. Analisis Data / Hasil Pengujian (Bab IV)', promptText: `BAB 4 - ANALISIS DATA & PENGUJIAN\n\nTopik Skripsi: [JUDUL]\n\nATURAN KHUSUS UNTUK USER:\n(Paste output tabel SPSS / hasil uji lab / kutipan wawancara Anda di bawah ini)\nHASIL UJI SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- Tafsirkan hasil uji tersebut ke dalam paragraf naratif sesuai dengan topik skripsi.\n- Jika ada angka statistik (t-hitung, p-value), sebutkan apakah itu signifikan atau tidak.\n- Jika kualitatif, narasikan temanya.\n- TANPA BASA-BASI AI.`, customInfo: 'Paste output tabel SPSS / hasil uji lab / kutipan wawancara Anda!' },
        { id: 'spembahasan', title: '3. Pembahasan Penelitian (Bab IV)', promptText: `BAB 4 - PEMBAHASAN HASIL (DEEP DISCUSSION)\n\nTopik Skripsi: [JUDUL]\n\nATURAN KHUSUS UNTUK USER:\n(Ceritakan singkat hasil kesimpulan uji data lapangan Anda di sini)\nHASIL UJI LAPANGAN SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- SINTESISKAN: Bandingkan "HASIL UJI LAPANGAN SAYA" dengan teori terkait topik di atas.\n- Jelaskan apakah hasil lapangan MENDUKUNG atau MENOLAK teori umum tersebut.\n- Berikan argumentasi ilmiah (Why/How) mengapa hasilnya demikian.`, customInfo: 'Ceritakan singkat hasil kesimpulan uji data Anda di dalam prompt!' },
        { id: 'skesimpulan', title: '4. Kesimpulan (Bab V)', promptText: `BAB 5 - KESIMPULAN (KOHEREN)\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI.\n- Buat kesimpulan yang MENJAWAB LANGSUNG poin Rumusan Masalah Awal.\n- Jawaban harus didasarkan pada fakta di Ringkasan Hasil Pembahasan.\n- Jangan memunculkan data baru yang tidak dibahas sebelumnya.` },
        { id: 'ssaran', title: '5. Saran Penelitian (Bab V)', promptText: `BAB 5 - SARAN\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Bab 5".\n- Berdasarkan topik tersebut, berikan saran konstruktif yang dibagi menjadi dua bagian:\n1. Bagi Akademisi/Peneliti Selanjutnya (Metode apa yang perlu diperbaiki).\n2. Bagi Praktisi/Masyarakat Terkait (Bagaimana temuan ini dimanfaatkan).\n- Format berupa paragraf atau poin.\n- TANPA BASA-BASI AI.` },
        { id: 'sdaftar', title: '6. Daftar Pustaka (Skripsi)', promptText: `DAFTAR PUSTAKA SKRIPSI (APA 7th Edition)\n\nTopik Skripsi: [JUDUL]\nData Jurnal Utama (Bab 1-3):\n[DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Daftar Pustaka".\n- Susun daftar pustaka menggunakan format APA 7th Edition dan urutkan secara alfabetis (A-Z).\n- WAJIB memasukkan seluruh jurnal yang ada pada "Data Jurnal Utama" di atas.\n- Ekstrak dan masukkan juga buku/teori tambahan yang dikutip di teks Bab 4 dan Bab 5 sebelumnya.\n- Sertakan tautan URL atau DOI ASLI dari jurnal tersebut (jika ada). DILARANG menggunakan tautan palsu.` },

        // --- MAKALAH ---
        { id: 'mpendahuluan', title: '1. Pendahuluan (Makalah)', promptText: `BAB I PENDAHULUAN (MAKALAH)\n\nTopik/Judul: [JUDUL]\nReferensi Utama: [DATA JURNAL YANG DIKAJI]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel.\n- DILARANG menulis ulang judul "BAB I PENDAHULUAN".\n- Langsung ikuti format di bawah ini dengan lengkap dan mendalam:\n\n**A. Latar Belakang**\n[Buat 3-4 paragraf naratif yang menjelaskan fenomena, teori dasar, dan urgensi topik ini dibahas. Wajib sertakan sitasi (Penulis, Tahun) dari referensi di atas].\n\n**B. Rumusan Masalah**\nBerdasarkan latar belakang di atas, rumusan masalah dalam makalah ini adalah:\n1. [Tulis pertanyaan 1]\n2. [Tulis pertanyaan 2]\n3. [Tulis pertanyaan 3]\n\n**C. Tujuan Penulisan**\n1. [Tujuan sinkron dengan masalah 1]\n2. [Tujuan sinkron dengan masalah 2]\n3. [Tujuan sinkron dengan masalah 3]` },
        { id: 'mpembahasan', title: '2. Pembahasan (Makalah)', promptText: `BAB II PEMBAHASAN (MAKALAH)\n\nTopik/Judul: [JUDUL]\nData Jurnal Referensi: \n[DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel kecuali sangat perlu.\n- DILARANG menulis ulang judul "BAB II PEMBAHASAN".\n- Buat pembahasan sepanjang 1000-1500 kata yang padat materi.\n\nSTRUKTUR OUTPUT YANG DIWAJIBKAN:\n**A. [Sub-Bab 1: Konsep Dasar / Teori Utama]**\n[Bahas teori dari kumpulan jurnal di atas dengan sangat detail. Gunakan banyak sitasi (Nama, Tahun)].\n\n**B. [Sub-Bab 2: Analisis / Implementasi pada Topik]**\n[Sintesiskan temuan dari jurnal-jurnal di atas. Bandingkan metode/hasil mereka, apa kelebihan dan kekurangannya].\n\n**C. [Sub-Bab 3: Solusi / Pandangan Kritis]**\n[Bahas kesimpulan analitis terkait topik ini berdasarkan fakta akademik].` },
        { id: 'mpenutup', title: '3. Penutup (Makalah)', promptText: `BAB III PENUTUP (MAKALAH)\n\nTopik/Judul: [JUDUL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel.\n- DILARANG menulis ulang judul "BAB III PENUTUP".\n- Langsung ikuti format di bawah ini:\n\n**A. Kesimpulan**\n[Buat 2 paragraf kesimpulan yang padat dan tajam, merangkum inti dari pembahasan sebelumnya dan menjawab rumusan masalah].\n\n**B. Saran**\n[Buat 1-2 paragraf saran atau rekomendasi yang konstruktif dan bisa diaplikasikan di lapangan terkait topik ini].` },
        { id: 'mdaftar', title: '4. Daftar Pustaka (Makalah)', promptText: `DAFTAR PUSTAKA MAKALAH - OUTPUT MUTLAK APA 7TH\n\nTeks Makalah:\n[DRAF_TULISAN]\n\nReferensi Utama:\n[DATA JURNAL YANG DIKAJI]\n\nATURAN MUTLAK:\n1. DILARANG KERAS mengevaluasi teks saya. DILARANG memberikan komentar atau menolak. KELUARKAN HANYA DAFTAR PUSTAKA.\n2. Format APA 7th Style, A-Z.\n3. WAJIB sertakan link di setiap akhir referensi menggunakan format Markdown: [https://link.com](https://link.com)` },

        // --- JURNAL ---
        { id: 'jpendahuluan', title: '1. Introduction (Artikel Jurnal)', promptText: `1. INTRODUCTION (PENDAHULUAN JURNAL IMRaD)\n\nTopik/Judul: [JUDUL]\nReferensi Utama: [DATA JURNAL YANG DIKAJI]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "1. Introduction" atau "Pendahuluan".\n- Buat 4-5 paragraf naratif tingkat tinggi (Standar Jurnal Q1/SINTA 1).\n- Paragraf 1-2: Fenomena global & urgensi.\n- Paragraf 3: State of the Art (Sintesis dari referensi di atas, sebutkan Penulis, Tahun).\n- Paragraf 4: Temukan Research Gap secara eksplisit.\n- Paragraf 5: Statement Tujuan Utama Artikel ini.\n- TANPA BASA-BASI AI.` },        { id: 'jmetode', title: '2. Methods (Artikel Jurnal)', promptText: `2. METHODS (METODE PENELITIAN JURNAL IMRaD)\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "2. Methods".\n- Dilarang membuat sub-bab bernomor (seperti 2.1, 2.2). Tulis mengalir dalam 2-3 paragraf utuh yang menceritakan urutan riset.\n- Jelaskan desain, populasi/partisipan, instrumen, dan teknik analisis data yang digunakan secara padat dan teknis.\n- TANPA BASA-BASI AI.` },
        { id: 'jhasil', title: '3. Results & Discussion (Artikel Jurnal)', promptText: `3. RESULTS AND DISCUSSION (HASIL DAN PEMBAHASAN)\n\nATURAN KHUSUS UNTUK USER:\n(Isi/Paste temuan riset mentah Anda di baris bawah sebelum dikirim ke AI)\nDATA MENTAH SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "3. Results and Discussion".\n- Susun menjadi 2 sub: "**A. Hasil Penelitian**" (Bahas data mentah di atas) dan "**B. Pembahasan**" (Bandingkan hasil tersebut dengan Referensi Terdahulu).\n- Buat pembahasan sangat analitis, sebutkan apakah hasil ini mendukung atau menolak teori sebelumnya.\n- TANPA BASA-BASI AI.`, customInfo: 'Tambahkan ringkasan data hasil riset Anda di dalam prompt!' },
        { id: 'jkesimpulan', title: '4. Conclusion (Artikel Jurnal)', promptText: `4. CONCLUSION (KESIMPULAN JURNAL)\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "4. Conclusion".\n- Buat kesimpulan 1-2 paragraf yang MENJAWAB LANGSUNG poin utama riset.\n- Tambahkan 1-2 kalimat mengenai keterbatasan penelitian dan rekomendasi untuk riset masa depan.\n- TANPA BASA-BASI AI.` },
        { id: 'jabstrak', title: '5. Abstract (Artikel Jurnal)', promptText: `ABSTRAK JURNAL (REAL SUMMARY)\n\nTugas: Buat Abstrak berdasarkan naskah penuh di bawah ini.\n\n[DRAF_TULISAN]\n\nATURAN OUTPUT:\n- DILARANG menulis ulang kata "Abstrak".\n- Rangkum naskah di atas menjadi 1 paragraf padat (150-200 kata).\n- Struktur Wajib: Latar Belakang Singkat -> Tujuan -> Metode Utama -> Hasil Utama -> Kesimpulan.\n- Jangan mengarang data yang tidak ada di naskah.\n- Tambahkan "Keywords: [kata kunci 1], [kata kunci 2], [kata kunci 3]" di akhir paragraf.` },
        { id: 'jdaftar', title: '6. References (Artikel Jurnal)', promptText: `REFERENCES (JURNAL) - STRICT OUTPUT\n\nFull Article Draft:\n[DRAF_TULISAN]\n\nPrimary Sources:\n[DATA JURNAL YANG DIKAJI]\n\nSTRICT RULES:\n1. DO NOT provide any meta-commentary, consistency checks, or apologies. OUTPUT ONLY THE REFERENCE LIST.\n2. Format using APA 7th Edition.\n3. YOU MUST include a URL/DOI at the end of each entry using this exact Markdown format: [https://link.com](https://link.com)` },

        // --- SLR ---
        { id: 'slrpendahuluan', title: '1. Pendahuluan (Review SLR)', promptText: `PENDAHULUAN SYSTEMATIC LITERATURE REVIEW (SLR)\n\nTopik/Judul: [JUDUL]\nReferensi Utama: [DATA JURNAL YANG DIKAJI]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Pendahuluan".\n- Tulis 4-5 paragraf naratif standar publikasi internasional.\n- Paragraf 1-2: Jelaskan fenomena, pentingnya topik ini, dan teori dasar (WAJIB sertakan sitasi Penulis, Tahun dari Referensi Utama di atas).\n- Paragraf 3: Jelaskan mengapa riset SLR di bidang ini sangat mendesak dilakukan (Research Gap dari studi review sebelumnya).\n- Paragraf 4: Tuliskan "Research Questions (RQ)" atau Pertanyaan Penelitian yang ingin dijawab dalam review ini (minimal 2 RQ).\n- TANPA BASA-BASI AI.` },        { id: 'slrhasil', title: '3. Hasil Ekstraksi (Review SLR)', promptText: `HASIL EKSTRAKSI DATA SYSTEMATIC REVIEW\n\nTopik SLR: [JUDUL]\nData Jurnal Mentah untuk Diekstrak: \n[DATA JURNAL]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Hasil Ekstraksi".\n- Buat 1 TABEL MATRIKS SINTESIS RAKSASA yang membedah seluruh jurnal mentah di atas.\n- Format Kolom Tabel WAJIB:\n  | Author & Tahun | Tujuan Studi | Metode / Sampel | Temuan Utama (Results) | Limitasi Jurnal |\n- Pastikan semua data jurnal yang diberikan di atas masuk ke dalam tabel tersebut secara rapi dan akurat tanpa dikarang.\n- Berikan 1 paragraf narasi pengantar sebelum tabel.\n- TANPA BASA-BASI AI.` },
        { id: 'slrpembahasan', title: '4. Pembahasan SLR (Review SLR)', promptText: `PEMBAHASAN SYSTEMATIC LITERATURE REVIEW (DISCUSSION)\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Pembahasan".\n- DILARANG menggunakan tabel.\n- Berdasarkan kumpulan jurnal tersebut, buat analisis pembahasan mendalam (minimal 800 kata).\n- Kelompokkan pembahasan berdasarkan 2-3 tema besar yang mendominasi temuan jurnal-jurnal tersebut (Gunakan Sub-bab tebal untuk setiap tema).\n- Bandingkan perbedaan pandangan atau metode antar author.\n- TANPA BASA-BASI AI.` },
        { id: 'slrkesimpulan', title: '5. Kesimpulan (Review SLR)', promptText: `KESIMPULAN SYSTEMATIC LITERATURE REVIEW\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Kesimpulan".\n- Buat 2 paragraf padat.\n- Paragraf 1: Jawaban inti dari review literatur ini (apa benang merahnya).\n- Paragraf 2: Rekomendasi gap penelitian untuk riset di masa depan (Future Work) yang sangat spesifik berdasarkan kekurangan literatur saat ini.\n- TANPA BASA-BASI AI.` },
        { id: 'slrabstrak', title: '6. Abstrak (Review SLR)', promptText: `ABSTRAK SYSTEMATIC LITERATURE REVIEW\n\nTugas: Buat Abstrak berdasarkan naskah SLR penuh di bawah ini.\n\n[DRAF_TULISAN]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Abstrak".\n- Rangkum naskah di atas menjadi 1 paragraf padat (150-250 kata).\n- Struktur Wajib: Latar Belakang & Urgensi SLR -> Tujuan -> Metode (PRISMA) -> Temuan Utama Ekstraksi -> Kesimpulan & Rekomendasi Masa Depan.\n- Jangan mengarang data yang tidak ada di naskah.\n- Tambahkan "Keywords: [kata kunci 1], [kata kunci 2], [kata kunci 3]" di akhir paragraf.` },
        { id: 'slrdaftar', title: '7. Daftar Pustaka (Review SLR)', promptText: `DAFTAR PUSTAKA - SYSTEMATIC REVIEW\n\nJurnal yang Direview: [DATA JURNAL YANG DIKAJI]\nDraf Review: [DRAF_TULISAN]\n\nATURAN MUTLAK:\n1. DILARANG memberikan komentar atau evaluasi. HANYA OUTPUT DAFTAR PUSTAKA.\n2. Masukkan semua jurnal yang direview beserta sitasi yang ada di draf ke dalam format APA 7th Edition.\n3. WAJIB sertakan tautan URL/DOI di setiap referensi menggunakan format Markdown: [https://link.com](https://link.com)` }
    ];

    if (step5Container) {
        let htmlContent = `
        <section id="step5" class="hidden-section relative">
            <div class="text-center mb-10">
                <h2 id="step5-title" class="text-3xl font-bold text-gray-800 mb-4">Langkah 5: Penyusunan Dokumen Akademik</h2>
                <p class="text-gray-600 max-w-2xl mx-auto">Gunakan prompt di bawah ini untuk menyusun dokumen Anda bab demi bab. <br></p>
            </div>

            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
                <h3 class="text-lg font-bold mb-2">Judul Terpilih:</h3>
                <p id="selectedTitleDisplayStep5" class="text-xl font-semibold">-</p>
            </div>
            
            ${Object.keys(navConfig).map(type => buildNavButtonsHTML(type, navConfig[type])).join('')}

            <div id="proposal-content">
        `;

        // 5. INJEKSI KOMPONEN DINAMIS UNTUK SECTION PROMPT
        sectionsData.forEach(sec => {
            htmlContent += buildSectionHTML(sec.id, sec.title, sec.promptText, sec.customInfo, sec.hasCheckbox);
        });

        // 6. INJEKSI BAGIAN FINAL (EKSPOR)
        htmlContent += `
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

                    <div class="max-w-md mx-auto mb-4">
                        <div id="proposalFormatContainer" class="mb-6">
                            <label class="block text-sm font-bold text-gray-700 mb-2 text-center">Struktur Bab:</label>
                            <select id="proposalFormat" class="w-full p-3 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:outline-none cursor-pointer text-gray-700 font-medium text-center">
                                <option value="bab">Format Lengkap (BAB I, II, III) - Standar Tugas Akhir</option>
                                <option value="mini">Format Sederhana (A, B, C...) - Laporan Ringkas</option>
                            </select>
                        </div>
                        
                        <button id="btnDownloadStandard" onclick="downloadDOCX()" class="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg transform hover:scale-[1.02]">
                            <i class="fas fa-file-word mr-2 text-xl"></i>Download Dokumen (DOCX)
                        </button>
                        
                        <button id="btnDownloadJurnal" onclick="downloadDOCX()" class="hidden w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 transition-all flex items-center justify-center shadow-lg transform hover:scale-[1.02] mt-4">
                            <i class="fas fa-file-word mr-2 text-xl"></i>Download Artikel (Format 2 Kolom)
                        </button>
                    </div>
                </div>
            </div>

            <div class="sticky bottom-0 z-40 bg-gray-100/95 backdrop-blur pt-4 pb-4 border-t border-gray-200 mt-8 flex justify-between">
                <button onclick="goToStep(4)" class="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-100"><i class="fas fa-arrow-left mr-2"></i>Kembali ke Judul</button>
            </div>
        </section>
        `;

        step5Container.innerHTML = htmlContent;

        // 🌟 FITUR BARU: INISIALISASI RICH TEXT EDITOR
        window.mdeEditors = {};
        sectionsData.forEach(sec => {
            const ta = document.getElementById(`output-${sec.id}`);
            if (ta) {
                // Sulap textarea menjadi Editor Visual
                window.mdeEditors[`output-${sec.id}`] = new EasyMDE({
                    element: ta,
                    spellChecker: false,
                    autoDownloadFontAwesome: false, // Kita sudah pakai FontAwesome bawaan aplikasi
                    status: [{
                        className: "words",
                        defaultValue: (el) => { el.innerHTML = "0 kata"; },
                        onUpdate: (el) => { 
                            const text = window.mdeEditors[`output-${sec.id}`].value();
                            const count = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
                            el.innerHTML = count + " kata"; 
                        }
                    }],
                    placeholder: "Tulis atau paste teks dari AI di sini...",
                    minHeight: "250px"
                });
                
                // 🌟 FITUR BARU: AUTO-SAVE DENGAN DEBOUNCE & VISUAL FEEDBACK
                if (!window.autoSaveTimers) window.autoSaveTimers = {};

                window.mdeEditors[`output-${sec.id}`].codemirror.on("change", () => {
                    const content = window.mdeEditors[`output-${sec.id}`].value();
                    ta.value = content; // Sinkronisasi ke textarea asli
                    
                    // Hapus timer sebelumnya jika pengguna masih mengetik
                    clearTimeout(window.autoSaveTimers[sec.id]);
                    
                    // Tangkap tombol Simpan untuk memberikan efek visual
                    const saveBtn = document.querySelector(`button[onclick="saveProposalSection('${sec.id}')"]`);
                    if (saveBtn) {
                        // Ubah tombol jadi kuning saat sedang mengetik
                        saveBtn.innerHTML = '<i class="fas fa-pen mr-2 animate-pulse"></i>Mengetik...';
                        saveBtn.classList.remove('bg-green-600');
                        saveBtn.classList.add('bg-yellow-500');
                    }

                    // Setel timer baru (Tunggu 1.5 detik setelah pengguna berhenti mengetik)
                    window.autoSaveTimers[sec.id] = setTimeout(() => {
                        // 1. Simpan ke Memori Aplikasi & LocalStorage
                        AppState.proposalData[sec.id] = content;
                        saveStateToLocal();
                        
                        // 2. Tandai Navigasi Atas menjadi Hijau (Sudah terisi)
                        const sectionsList = typeof getActiveSections === 'function' ? getActiveSections() : [];
                        const index = sectionsList.indexOf(sec.id);
                        if (index !== -1) {
                            let cid = AppState.documentType === 'makalah' ? 'makalah-nav-buttons' : AppState.documentType === 'jurnal' ? 'jurnal-nav-buttons' : AppState.documentType === 'skripsi' ? 'skripsi-nav-buttons' : AppState.documentType === 'slr' ? 'slr-nav-buttons' : AppState.documentType === 'robotik' ? 'robotik-nav-buttons' : 'proposal-nav-buttons';
                            const navBtn = document.querySelectorAll(`#${cid} .proposal-nav-btn`)[index]; 
                            if (navBtn) navBtn.classList.add('bg-green-50', 'border-green-500');
                        }
                        
                        // 3. Kembalikan Visual Tombol menjadi "Tersimpan"
                        if (saveBtn) {
                            saveBtn.innerHTML = '<i class="fas fa-check-double mr-2"></i>Tersimpan Auto';
                            saveBtn.classList.remove('bg-yellow-500');
                            saveBtn.classList.add('bg-green-600');
                            
                            // Kembalikan ke tulisan "Simpan" standar setelah 2 detik
                            setTimeout(() => {
                                if (saveBtn.innerHTML.includes('Tersimpan Auto')) {
                                    saveBtn.innerHTML = '<i class="fas fa-save mr-2"></i>Simpan & Lanjut';
                                }
                            }, 2000);
                        }
                        
                        console.log(`[Auto-Save] Bagian ${sec.id} berhasil diamankan.`);
                    }, 1500); // Waktu tunggu 1.5 detik (1500 ms)
                });
            }
        });

        // Load data lama dari state ke dalam Editor (jika ada)
        Object.keys(AppState.proposalData).forEach(key => {
            if (AppState.proposalData[key] && window.mdeEditors[`output-${key}`]) {
                window.mdeEditors[`output-${key}`].value(AppState.proposalData[key]);
            }
        });

        // Pasang Event Listener Navigasi
        const navButtons = document.querySelectorAll('.proposal-nav-btn');
        if (navButtons.length > 0 && typeof showProposalSection === 'function') {
            navButtons.forEach(btn => {
                btn.addEventListener('click', function() { 
                    showProposalSection(this.getAttribute('data-section')); 
                });
            });
        }
    }
    
    // Di dalam DOMContentLoaded, setelah render sectionsData:
    sectionsData.forEach(sec => {
        injectPlagiarismPanel(sec.id);
    });

    function injectPlagiarismPanel(sectionId) {
        const container = document.getElementById(`plagiarism-panel-${sectionId}`);
        if (!container) return;

        // PERBAIKAN: Cek kunci yang dienkripsi ATAU kunci sementara yang sedang aktif
        const isEdenAiConfigured = !!AppState._encryptedEdenAiKey || !!AppState._tempEdenAiKey;

        container.innerHTML = `
            <div class="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl overflow-hidden shadow-sm">
                <div class="px-4 py-3 bg-orange-100/50 border-b border-orange-200 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                        <i class="fas fa-shield-virus text-orange-600"></i>
                        <span class="font-bold text-orange-800 text-sm">Cek Originalitas</span>
                    </div>
                    <span id="plagiarism-badge-${sectionId}" class="hidden px-2.5 py-1 rounded-full text-xs font-bold">
                        --%
                    </span>
                </div>

                <div class="p-4">
                    <div class="flex gap-2 mb-4">
                        <button onclick="runPlagiarismCheck('${sectionId}', 'local')" 
                            class="flex-1 bg-white border-2 border-orange-200 text-orange-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-50 hover:border-orange-300 transition-all flex items-center justify-center gap-2">
                            <i class="fas fa-bolt text-amber-500"></i>
                            <span>Lokal</span>
                        </button>
                        
                        <button onclick="runPlagiarismCheck('${sectionId}', 'edenai')" 
                            class="flex-1 ${isEdenAiConfigured ? 'bg-orange-600 text-white border-orange-600' : 'bg-gray-100 text-gray-400 border-gray-200'} py-2.5 rounded-lg text-sm font-semibold hover:shadow-md transition-all flex items-center justify-center gap-2"
                            ${!isEdenAiConfigured ? 'disabled title="Simpan API Key Eden AI di Pengaturan Utama (Ikon Kunci)"' : ''}>
                            <i class="fas fa-cloud"></i>
                            <span>Eden AI</span>
                        </button>

                        <button onclick="checkPlagiarismExternal('${sectionId}')" 
                            class="flex-1 bg-blue-50 text-blue-700 border-2 border-blue-200 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-2">
                            <i class="fas fa-external-link-alt"></i>
                            <span>Web</span>
                        </button>
                    </div>

                    <div class="flex items-start gap-2 text-xs text-orange-700/80 mb-3">
                        <i class="fas fa-info-circle mt-0.5"></i>
                        <p><strong>Mode Cepat:</strong> Bandingkan dengan ${AppState.journals.length} jurnal yang sudah dikaji. 
                        <strong>Mode Akurat:</strong> Scan ke database internet via Eden AI.</p>
                    </div>

                    <div id="plagiarism-result-${sectionId}" class="hidden space-y-3">
                        
                        <div class="bg-white rounded-lg p-4 border border-orange-100 shadow-sm">
                            <div class="flex justify-between items-end mb-2">
                                <span class="text-sm text-gray-600">Similarity Score</span>
                                <span id="similarity-score-${sectionId}" class="text-3xl font-bold text-gray-400">--%</span>
                            </div>
                            
                            <div class="h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
                                <div id="similarity-bar-${sectionId}" 
                                    class="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-green-400 via-yellow-400 to-red-500"
                                    style="width: 0%"></div>
                            </div>

                            <p id="similarity-interpretation-${sectionId}" class="text-sm text-gray-600 italic">
                                Klik tombol di atas untuk memulai scan...
                            </p>
                        </div>

                        <div id="similarity-sources-${sectionId}" class="max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                            </div>

                        <div class="flex gap-2 pt-4 mt-2 border-t border-orange-100">
                            <button onclick="highlightSimilarText('${sectionId}')" 
                                class="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition-all">
                                <i class="fas fa-highlighter mr-1"></i>Tandai di Teks
                            </button>
                            <button onclick="autoParaphraseProblematic('${sectionId}')" 
                                class="flex-1 bg-purple-50 text-purple-700 py-2 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-all">
                                <i class="fas fa-magic mr-1"></i>Auto-Perbaiki
                            </button>
                        </div>
                    </div>

                    <div id="plagiarism-loading-${sectionId}" class="hidden py-8 text-center">
                        <div class="inline-flex items-center gap-3">
                            <div class="w-8 h-8 border-3 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                            <div class="text-left">
                                <p class="text-sm font-semibold text-orange-800" id="plagiarism-status-${sectionId}">Memindai...</p>
                                <p class="text-xs text-orange-600" id="plagiarism-detail-${sectionId}">Menganalisis struktur teks</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    window.injectPlagiarismPanel = injectPlagiarismPanel;

    sectionsData.forEach(sec => {
        injectPlagiarismPanel(sec.id);
    });
});