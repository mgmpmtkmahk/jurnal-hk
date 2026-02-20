// ==========================================
// FILE 4: step5-ui.js (DATA DRIVEN REFACTOR)
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    const step5Container = document.getElementById('step5-container');
    
    // Fungsi Template Builder Utama
    const buildSectionHTML = (id, title, promptText, customInfo = null, hasCheckbox = false) => `
        <div id="section-${id}" class="proposal-section hidden mb-6">
            <h3 class="text-2xl font-bold mb-6 text-indigo-700 border-b pb-2">${title}</h3>
            <div class="grid lg:grid-cols-2 gap-8 items-stretch">
                <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                    <h4 class="text-lg font-bold mb-4 flex items-center text-indigo-600"><i class="fas fa-magic mr-3"></i>Prompt ${title.split(' (')[0]}</h4>
                    <div class="flex-grow flex flex-col mb-4">
                        <div class="bg-gray-900 rounded-xl p-4 relative flex-grow overflow-hidden min-h-[250px]">
                            <button onclick="copyPromptText('prompt-${id}')" class="copy-btn absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded text-xs hover:bg-indigo-700 z-10" data-prompt-id="prompt-${id}">
                                <i class="fas fa-copy mr-1"></i>Copy
                            </button>
                            <div class="absolute inset-0 p-4 overflow-y-auto mt-8 custom-scrollbar">
                                <pre id="prompt-${id}" class="text-green-400 text-xs whitespace-pre-wrap font-mono m-0">${promptText}</pre>
                            </div>
                        </div>
                    </div>
                    ${customInfo ? `<div class="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4"><p class="text-xs text-yellow-800 flex items-start"><i class="fas fa-info-circle mr-2 mt-0.5"></i><span>${customInfo}</span></p></div>` : ''}
                    <button onclick="openGeminiWithPrompt('prompt-${id}')" class="mt-auto w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 shadow-lg flex-shrink-0">
                        <i class="fas fa-external-link-alt mr-2"></i>Buka Gemini & Auto-Paste
                    </button>
                </div>
                <div class="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border border-gray-100">
                    <h4 class="text-lg font-bold mb-4 flex items-center text-green-600"><i class="fas fa-paste mr-3"></i>Paste Hasil Gemini</h4>
                    ${hasCheckbox ? `
                    <div class="flex items-center mb-4 bg-yellow-50 p-3 rounded-xl border border-yellow-100">
                        <input type="checkbox" id="skip-${id}" class="mr-3 w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer" onchange="toggleHipotesis()">
                        <label for="skip-${id}" class="text-sm font-medium text-yellow-800 cursor-pointer">Centang jika Kualitatif murni (Lewati Hipotesis)</label>
                    </div>` : ''}
                    <div class="flex-grow mb-4 flex flex-col relative min-h-[250px]">
                        <textarea id="output-${id}" class="w-full h-full absolute inset-0 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none custom-scrollbar resize-none text-sm" placeholder="Paste hasil dari Gemini di sini..."></textarea>
                    </div>
                    <div class="mt-auto flex gap-3 flex-shrink-0">
                        <button onclick="prevProposalSection('${id}')" class="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-all"><i class="fas fa-arrow-left mr-2"></i>Kembali</button>
                        <button onclick="saveProposalSection('${id}')" class="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all"><i class="fas fa-save mr-2"></i>Simpan</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Seluruh Data Prompt Lengkap (Dari source awal)
    const sectionsData = [
        // --- PROPOSAL ---
        { id: 'latar', title: '5.1 Latar Belakang (Proposal)', promptText: `LATAR BELAKANG - STANDAR SINTA/SCOPUS\n\nBuatkan latar belakang untuk:\nJudul: [JUDUL]\nResearch Gap: [GAP]\nReferensi: [DATA JURNAL]\n\nATURAN KETAT:\n1. Gunakan pola Piramida Terbalik (Global -> Spesifik/Lokal).\n2. WAJIB berbasis data empiris, hindari asumsi tanpa dasar.\n3. SETIAP paragraf WAJIB memiliki sitasi (Penulis, Tahun) dari Referensi.\n4. Tegaskan "Research Gap" dan solusi penelitian ini.\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI (Dilarang memberi kalimat sapaan/pengantar/penutup).\n- DILARANG menulis ulang judul bab (Jangan tulis "Latar Belakang").\n- HANYA output paragraf utuh (800-1000 kata) tanpa tabel.` },
        { id: 'rumusan', title: '5.2 Rumusan Masalah (Proposal)', promptText: `RUMUSAN MASALAH - KOHERENSIF\n\nJudul: [JUDUL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI.\n- Buat rumusan masalah (kalimat tanya) yang MENGALIR LOGIS dari masalah yang sudah diuraikan di Latar Belakang di atas.\n- Jangan membuat masalah baru yang tidak disinggung sebelumnya.` },
        { id: 'tujuan', title: '5.3 Tujuan Penelitian (Proposal)', promptText: `TUJUAN PENELITIAN - FORMAT AKADEMIK\n\nATURAN KETAT:\n1. Jumlah poin WAJIB sama persis dengan jumlah rumusan masalah.\n2. WAJIB gunakan Kata Kerja Operasional (KKO) yang bisa diukur. Dilarang menggunakan kata "Mengetahui".\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung ikuti format teks di bawah ini:\n\nSejalan dengan rumusan masalah di atas, tujuan yang ingin dicapai dalam penelitian ini adalah:\n1. [Tujuan sinkron dengan masalah 1]\n2. [Tujuan sinkron dengan masalah 2]\n3. [Tujuan sinkron dengan masalah 3]` },
        { id: 'manfaat', title: '5.4 Manfaat Penelitian (Proposal)', promptText: `MANFAAT PENELITIAN - FORMAT NARATIF\n\nBuatkan manfaat penelitian untuk judul: [JUDUL] dan tujuan: [TUJUAN]\n\nATURAN KETAT:\n1. Hindari kalimat klise ("berguna bagi bangsa"). Harus spesifik.\n2. Manfaat Teoritis: Kontribusi pada teori terkait.\n3. Manfaat Praktis: Solusi nyata untuk stakeholder terkait.\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung ikuti format teks di bawah ini:\n\nPenelitian ini diharapkan dapat memberikan manfaat secara teoritis maupun praktis, yaitu:\n\n1. Manfaat Teoritis\n[Jelaskan paragraf kontribusi teoritisnya].\n\n2. Manfaat Praktis\n[Jelaskan paragraf solusi nyata bagi stakeholder].` },
        { id: 'metode', title: '5.5 Metode Penelitian (Proposal)', promptText: `METODE PENELITIAN - FORMAT PARAGRAF TERSTRUKTUR\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- Langsung outputkan dengan struktur tebal berikut:\n\n**1. Desain Penelitian**\n[Jelaskan paragrafnya]\n\n**2. Lokasi dan Waktu Penelitian**\n[Jelaskan paragrafnya]\n\n**3. Populasi dan Sampel / Subjek Penelitian**\n[Jelaskan paragrafnya]\n\n**4. Teknik Pengumpulan Data**\n[Jelaskan paragrafnya]\n\n**5. Teknik Analisis Data**\n[Jelaskan paragrafnya]` },
        { id: 'landasan', title: '5.6 Landasan Teori (Proposal)', promptText: `LANDASAN TEORI & STATE OF THE ART\n\nBuatkan untuk judul: [JUDUL] dan variabel: [VARIABEL]\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab utama.\n- Langsung ikuti format di bawah ini:\n\n**1. Kajian Teori**\n[Buat 2-3 paragraf naratif yang mensintesis Grand Theory dan variabel utama].\n\n**2. Kerangka Pemikiran**\n[Buat 1 paragraf naratif yang menjelaskan alur logika hubungan antar variabel].\n\n**3. Kajian Penelitian Terdahulu (State of the Art)**\n[Buatkan 1 TABEL berisi 4 penelitian terdahulu yang relevan. Kolom tabel wajib: | Penulis & Tahun | Judul Penelitian | Metode | Hasil/Temuan | Perbedaan dgn Riset Ini | ]` },
        { id: 'hipotesis', title: '5.7 Hipotesis (Proposal)', promptText: `HIPOTESIS PENELITIAN\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI.\n- Rumuskan hipotesis (H0 dan Ha) yang didasarkan PADA TEORI.\n- Pastikan variabel yang dihipotesiskan sama persis dengan yang ada di teori.`, hasCheckbox: true },
        { id: 'jadwal', title: '5.8 Jadwal & Anggaran (Proposal)', promptText: `JADWAL & ANGGARAN - WAJIB FORMAT TABEL\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menulis ulang judul bab.\n- HANYA output 2 Tabel ini saja secara berurutan:\n\n**1. Jadwal Penelitian**\n| No | Tahapan Kegiatan | B1 | B2 | B3 | B4 | B5 | B6 |\n|----|------------------|----|----|----|----|----|----|\n| 1 | Pengajuan Judul & Izin | ██ | | | | | |\n| 2 | Penyusunan Instrumen | | ██ | | | | |\n| 3 | Pengumpulan Data Lapangan | | | ██ | ██ | | |\n| 4 | Analisis & Validasi Data | | | | | ██ | |\n| 5 | Penyusunan Laporan & Sidang | | | | | | ██ |\n\n**2. Rencana Anggaran Biaya (RAB)**\n| No | Kategori Komponen Biaya | Rincian Kebutuhan | Estimasi Alokasi (%) |\n|----|-------------------------|-------------------|----------------------|\n| 1 | Bahan Habis Pakai / ATK | [kertas, print, internet] | 15% |\n| 2 | Operasional Lapangan | [transportasi, izin] | 40% |\n| 3 | Pengolahan Data | [lisensi software, jilid] | 20% |\n| 4 | Publikasi & Pelaporan | [APC Jurnal SINTA] | 25% |\n| | | TOTAL | 100% |` },
        { id: 'daftar', title: '5.9 Daftar Pustaka (Proposal)', promptText: `DAFTAR PUSTAKA - SINKRONISASI SITASI\n\nTugas: Buat Daftar Pustaka berdasarkan draf tulisan di bawah ini.\n\nDRAF TULISAN SAYA:\n[DRAF_TULISAN]\n\nSUMBER DATA UTAMA:\n[DATA JURNAL YANG DIKAJI]\n\nINSTRUKSI KHUSUS:\n1. CRAWLING: Baca "DRAF TULISAN SAYA" di atas, temukan setiap sitasi (Nama, Tahun) yang muncul.\n2. MATCHING: Cocokkan sitasi tersebut dengan "SUMBER DATA UTAMA".\n3. GENERATE: Jika ada sitasi di teks yang tidak ada di sumber data utama, BUATKAN entri daftar pustakanya secara otomatis yang terlihat valid/kredibel.\n4. Pastikan SEMUA sitasi yang ada di teks masuk ke daftar pustaka. Jangan ada yang tertinggal.\n5. Format: [APA 7th Edition], A-Z.` },
        
        // --- SKRIPSI (BAB 4 & 5) ---
        { id: 'sdeskripsi', title: '1. Deskripsi Data (Bab IV)', promptText: `BAB 4 - DESKRIPSI DATA PENELITIAN\n\nATURAN KHUSUS UNTUK USER:\n(Isi/Paste ringkasan data mentah responden, demografi, atau hasil survei awal Anda di bawah ini sebelum dikirim ke AI)\nDATA PROFIL/DESKRIPTIF SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- Buat narasi akademik (minimal 3 paragraf) yang menjelaskan profil data di atas secara profesional.\n- Gunakan bahasa baku skripsi/tesis.\n- TANPA BASA-BASI AI.`, customInfo: 'Paste data responden/statistik deskriptif di Gemini sebelum Enter!' },
        { id: 'sanalisis', title: '2. Analisis Data / Hasil Pengujian (Bab IV)', promptText: `BAB 4 - ANALISIS DATA & PENGUJIAN\n\nATURAN KHUSUS UNTUK USER:\n(Paste output tabel SPSS / hasil uji lab / kutipan wawancara Anda di bawah ini)\nHASIL UJI SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- Tafsirkan hasil uji tersebut ke dalam paragraf naratif.\n- Jika ada angka statistik (t-hitung, p-value), sebutkan apakah itu signifikan atau tidak.\n- Jika kualitatif, narasikan temanya.\n- TANPA BASA-BASI AI.`, customInfo: 'Paste output tabel SPSS / hasil uji lab / kutipan wawancara Anda!' },
        { id: 'spembahasan', title: '3. Pembahasan Penelitian (Bab IV)', promptText: `BAB 4 - PEMBAHASAN HASIL (DEEP DISCUSSION)\n\nATURAN KHUSUS UNTUK USER:\n(Ceritakan singkat hasil kesimpulan uji data lapangan Anda di sini)\nHASIL UJI LAPANGAN SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "Bab 4".\n- SINTESISKAN: Bandingkan "HASIL UJI LAPANGAN SAYA" dengan Landasan Teori yang sudah ditulis.\n- Jelaskan apakah hasil lapangan MENDUKUNG atau MENOLAK teori tersebut.\n- Berikan argumentasi ilmiah (Why/How) mengapa hasilnya demikian.`, customInfo: 'Ceritakan singkat hasil kesimpulan uji data Anda di dalam prompt!' },
        { id: 'skesimpulan', title: '4. Kesimpulan (Bab V)', promptText: `BAB 5 - KESIMPULAN (KOHEREN)\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI.\n- Buat kesimpulan yang MENJAWAB LANGSUNG poin Rumusan Masalah Awal.\n- Jawaban harus didasarkan pada fakta di Ringkasan Hasil Pembahasan.\n- Jangan memunculkan data baru yang tidak dibahas sebelumnya.` },
        { id: 'ssaran', title: '5. Saran Penelitian (Bab V)', promptText: `BAB 5 - SARAN\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Bab 5".\n- Berdasarkan topik tersebut, berikan saran konstruktif yang dibagi menjadi dua bagian:\n1. Bagi Akademisi/Peneliti Selanjutnya (Metode apa yang perlu diperbaiki).\n2. Bagi Praktisi/Masyarakat Terkait (Bagaimana temuan ini dimanfaatkan).\n- Format berupa paragraf atau poin.\n- TANPA BASA-BASI AI.` },
        { id: 'sdaftar', title: '6. Daftar Pustaka Akhir', promptText: `DAFTAR PUSTAKA SKRIPSI - SINKRONISASI FINAL\n\nTugas: Susun Daftar Pustaka Lengkap berdasarkan seluruh Bab 4 & 5 yang telah ditulis.\n\nDRAF BAB 4 & 5:\n[DRAF_TULISAN]\n\nREFERENSI UTAMA:\n[DATA JURNAL YANG DIKAJI]\n\nINSTRUKSI:\n1. Ekstrak semua sitasi yang tertulis di dalam Draf di atas.\n2. Gabungkan dengan Referensi Utama.\n3. Susun menjadi daftar pustaka [APA 7th Edition] yang rapi dan lengkap.\n4. Pastikan tidak ada sitasi "yatim" (ada di teks tapi tidak ada di daftar pustaka).` },

        // --- MAKALAH ---
        { id: 'mpendahuluan', title: '1. Pendahuluan (Makalah)', promptText: `BAB I PENDAHULUAN (MAKALAH)\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel.\n- DILARANG menulis ulang judul "BAB I PENDAHULUAN".\n- Langsung ikuti format di bawah ini dengan lengkap dan mendalam:\n\n**A. Latar Belakang**\n[Buat 3-4 paragraf naratif yang menjelaskan fenomena, teori dasar, dan urgensi topik ini dibahas. Wajib sertakan sitasi (Penulis, Tahun) dari referensi di atas].\n\n**B. Rumusan Masalah**\nBerdasarkan latar belakang di atas, rumusan masalah dalam makalah ini adalah:\n1. [Tulis pertanyaan 1]\n2. [Tulis pertanyaan 2]\n3. [Tulis pertanyaan 3]\n\n**C. Tujuan Penulisan**\n1. [Tujuan sinkron dengan masalah 1]\n2. [Tujuan sinkron dengan masalah 2]\n3. [Tujuan sinkron dengan masalah 3]` },
        { id: 'mpembahasan', title: '2. Pembahasan (Makalah)', promptText: `BAB II PEMBAHASAN (MAKALAH)\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel kecuali sangat perlu.\n- DILARANG menulis ulang judul "BAB II PEMBAHASAN".\n- Buat pembahasan sepanjang 1000-1500 kata yang padat materi.\n\nSTRUKTUR OUTPUT YANG DIWAJIBKAN:\n**A. [Sub-Bab 1: Konsep Dasar / Teori Utama]**\n[Bahas teori dari jurnal dengan sangat detail. Gunakan banyak sitasi (Nama, Tahun)].\n\n**B. [Sub-Bab 2: Analisis / Implementasi pada Topik]**\n[Sintesiskan temuan dari jurnal-jurnal di atas. Bandingkan metode/hasil mereka, apa kelebihan dan kekurangannya].\n\n**C. [Sub-Bab 3: Solusi / Pandangan Kritis]**\n[Bahas kesimpulan analitis terkait topik ini berdasarkan fakta akademik].` },
        { id: 'mpenutup', title: '3. Penutup (Makalah)', promptText: `BAB III PENUTUP (MAKALAH)\n\nATURAN OUTPUT MUTLAK:\n- TANPA BASA-BASI. DILARANG menggunakan tabel.\n- DILARANG menulis ulang judul "BAB III PENUTUP".\n- Langsung ikuti format di bawah ini:\n\n**A. Kesimpulan**\n[Buat 2 paragraf kesimpulan yang padat dan tajam, merangkum inti dari pembahasan sebelumnya dan menjawab rumusan masalah].\n\n**B. Saran**\n[Buat 1-2 paragraf saran atau rekomendasi yang konstruktif dan bisa diaplikasikan di lapangan terkait topik ini].` },
        { id: 'mdaftar', title: '4. Daftar Pustaka (Makalah)', promptText: `DAFTAR PUSTAKA MAKALAH - CEK KONSISTENSI\n\nTeks Makalah:\n[DRAF_TULISAN]\n\nReferensi Utama:\n[DATA JURNAL YANG DIKAJI]\n\nInstruksi:\n1. List semua referensi yang dikutip dalam teks makalah di atas.\n2. Cocokkan dengan Referensi Utama. Lengkapi detail bibliografinya agar terlihat valid.\n3. Format APA 7th Style.` },

        // --- JURNAL ---
        { id: 'jpendahuluan', title: '1. Introduction (Artikel Jurnal)', promptText: `1. INTRODUCTION (PENDAHULUAN JURNAL IMRaD)\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "1. Introduction" atau "Pendahuluan".\n- Buat 4-5 paragraf naratif tingkat tinggi (Standar Jurnal Q1/SINTA 1).\n- Paragraf 1-2: Fenomena global & urgensi.\n- Paragraf 3: State of the Art (Sintesis dari referensi di atas, sebutkan Penulis, Tahun).\n- Paragraf 4: Temukan Research Gap secara eksplisit.\n- Paragraf 5: Statement Tujuan Utama Artikel ini.\n- TANPA BASA-BASI AI.` },
        { id: 'jmetode', title: '2. Methods (Artikel Jurnal)', promptText: `2. METHODS (METODE PENELITIAN JURNAL IMRaD)\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "2. Methods".\n- Dilarang membuat sub-bab bernomor (seperti 2.1, 2.2). Tulis mengalir dalam 2-3 paragraf utuh yang menceritakan urutan riset.\n- Jelaskan desain, populasi/partisipan, instrumen, dan teknik analisis data yang digunakan secara padat dan teknis.\n- TANPA BASA-BASI AI.` },
        { id: 'jhasil', title: '3. Results & Discussion (Artikel Jurnal)', promptText: `3. RESULTS AND DISCUSSION (HASIL DAN PEMBAHASAN)\n\nATURAN KHUSUS UNTUK USER:\n(Isi/Paste temuan riset mentah Anda di baris bawah sebelum dikirim ke AI)\nDATA MENTAH SAYA:\n...\n\nATURAN OUTPUT MUTLAK (UNTUK AI):\n- DILARANG menulis ulang kata "3. Results and Discussion".\n- Susun menjadi 2 sub: "**A. Hasil Penelitian**" (Bahas data mentah di atas) dan "**B. Pembahasan**" (Bandingkan hasil tersebut dengan Referensi Terdahulu).\n- Buat pembahasan sangat analitis, sebutkan apakah hasil ini mendukung atau menolak teori sebelumnya.\n- TANPA BASA-BASI AI.`, customInfo: 'Tambahkan ringkasan data hasil riset Anda di dalam prompt!' },
        { id: 'jkesimpulan', title: '4. Conclusion (Artikel Jurnal)', promptText: `4. CONCLUSION (KESIMPULAN JURNAL)\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "4. Conclusion".\n- Buat kesimpulan 1-2 paragraf yang MENJAWAB LANGSUNG poin utama riset.\n- Tambahkan 1-2 kalimat mengenai keterbatasan penelitian dan rekomendasi untuk riset masa depan.\n- TANPA BASA-BASI AI.` },
        { id: 'jabstrak', title: '5. Abstract (Artikel Jurnal)', promptText: `ABSTRAK JURNAL (REAL SUMMARY)\n\nTugas: Buat Abstrak berdasarkan naskah penuh di bawah ini.\n\n[DRAF_TULISAN]\n\nATURAN OUTPUT:\n- DILARANG menulis ulang kata "Abstrak".\n- Rangkum naskah di atas menjadi 1 paragraf padat (150-200 kata).\n- Struktur Wajib: Latar Belakang Singkat -> Tujuan -> Metode Utama -> Hasil Utama -> Kesimpulan.\n- Jangan mengarang data yang tidak ada di naskah.\n- Tambahkan "Keywords: [kata kunci 1], [kata kunci 2], [kata kunci 3]" di akhir paragraf.` },
        { id: 'jdaftar', title: '6. References (Artikel Jurnal)', promptText: `REFERENCES (JURNAL) - SYNC CHECK\n\nFull Article Draft:\n[DRAF_TULISAN]\n\nPrimary Sources:\n[DATA JURNAL YANG DIKAJI]\n\nINSTRUCTIONS:\n1. CITATION EXTRACTION: Scan the draft above and extract all in-text citations.\n2. VALIDATION: Cross-check with Primary Sources. Generate valid entries for any missing citations.\n3. COMPILATION: Create a complete Reference list containing ONLY sources actually cited in the draft.\n4. Style: [APA 7th Edition].` },

        // --- SLR ---
        { id: 'slrpendahuluan', title: '1. Pendahuluan (Review SLR)', promptText: `PENDAHULUAN SYSTEMATIC LITERATURE REVIEW (SLR)\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Pendahuluan".\n- Tulis 4-5 paragraf naratif standar publikasi internasional.\n- Paragraf 1-2: Jelaskan fenomena, pentingnya topik ini, dan teori dasar.\n- Paragraf 3: Jelaskan mengapa riset SLR di bidang ini sangat mendesak dilakukan (Research Gap dari studi review sebelumnya).\n- Paragraf 4: Tuliskan "Research Questions (RQ)" atau Pertanyaan Penelitian yang ingin dijawab dalam review ini (minimal 2 RQ).\n- TANPA BASA-BASI AI.` },
        { id: 'slrmetode', title: '2. Metode PRISMA (Review SLR)', promptText: `METODOLOGI SYSTEMATIC LITERATURE REVIEW\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Metodologi".\n- Tulis metode berdasarkan panduan PRISMA (Preferred Reporting Items for Systematic Reviews and Meta-Analyses).\n- Wajib memiliki Sub-bab ini:\n  **A. Strategi Pencarian (Search Strategy)**: Sebutkan database (Google Scholar, SINTA, Scopus) dan keyword boolean yang digunakan.\n  **B. Kriteria Inklusi dan Eksklusi**: Buat dalam bentuk list (misal: hanya jurnal 5 tahun terakhir, bahasa inggris/indonesia, tipe artikel primary).\n  **C. Ekstraksi Data**: Jelaskan bagaimana data dari literatur diekstrak.\n- DILARANG MENGGUNAKAN TABEL.\n- TANPA BASA-BASI AI.` },
        { id: 'slrhasil', title: '3. Hasil Ekstraksi (Review SLR)', promptText: `HASIL EKSTRAKSI DATA SYSTEMATIC REVIEW\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Hasil Ekstraksi".\n- Buat 1 TABEL MATRIKS SINTESIS RAKSASA yang membedah seluruh jurnal di atas.\n- Format Kolom Tabel WAJIB:\n  | Author & Tahun | Tujuan Studi | Metode / Sampel | Temuan Utama (Results) | Limitasi Jurnal |\n- Pastikan semua jurnal yang diberikan masuk ke dalam tabel tersebut secara rapi.\n- Berikan sedikit 1 paragraf narasi pengantar sebelum tabel.\n- TANPA BASA-BASI AI.` },
        { id: 'slrpembahasan', title: '4. Pembahasan SLR (Review SLR)', promptText: `PEMBAHASAN SYSTEMATIC LITERATURE REVIEW (DISCUSSION)\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Pembahasan".\n- DILARANG menggunakan tabel.\n- Berdasarkan kumpulan jurnal tersebut, buat analisis pembahasan mendalam (minimal 800 kata).\n- Kelompokkan pembahasan berdasarkan 2-3 tema besar yang mendominasi temuan jurnal-jurnal tersebut (Gunakan Sub-bab tebal untuk setiap tema).\n- Bandingkan perbedaan pandangan atau metode antar author.\n- TANPA BASA-BASI AI.` },
        { id: 'slrkesimpulan', title: '5. Kesimpulan (Review SLR)', promptText: `KESIMPULAN SYSTEMATIC LITERATURE REVIEW\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Kesimpulan".\n- Buat 2 paragraf padat.\n- Paragraf 1: Jawaban inti dari review literatur ini (apa benang merahnya).\n- Paragraf 2: Rekomendasi gap penelitian untuk riset di masa depan (Future Work) yang sangat spesifik berdasarkan kekurangan literatur saat ini.\n- TANPA BASA-BASI AI.` },
        { id: 'slrabstrak', title: '6. Abstrak (Review SLR)', promptText: `ABSTRAK SYSTEMATIC LITERATURE REVIEW\n\nTugas: Buat Abstrak berdasarkan naskah SLR penuh di bawah ini.\n\n[DRAF_TULISAN]\n\nATURAN OUTPUT MUTLAK:\n- DILARANG menulis ulang kata "Abstrak".\n- Rangkum naskah di atas menjadi 1 paragraf padat (150-250 kata).\n- Struktur Wajib: Latar Belakang & Urgensi SLR -> Tujuan -> Metode (PRISMA) -> Temuan Utama Ekstraksi -> Kesimpulan & Rekomendasi Masa Depan.\n- Jangan mengarang data yang tidak ada di naskah.\n- Tambahkan "Keywords: [kata kunci 1], [kata kunci 2], [kata kunci 3]" di akhir paragraf.` },
        { id: 'slrdaftar', title: '7. Daftar Pustaka (Review SLR)', promptText: `DAFTAR PUSTAKA - SYSTEMATIC REVIEW\n\nTopik SLR: [JUDUL]\nJurnal yang Direview (Primary Studies): [DATA JURNAL YANG DIKAJI]\nDraf Review: [DRAF_TULISAN]\n\nATURAN KHUSUS:\n1. WAJIB: Masukkan semua "Jurnal yang Direview" di atas ke dalam daftar pustaka.\n2. TAMBAHAN: Cek teks Draf Review, jika ada sitasi buku metodologi (seperti Kitchenham/PRISMA) atau referensi lain, masukkan juga ke daftar ini.\n3. Format: [APA 7th Edition], A-Z.` }
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
                <button data-section="slrpendahuluan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-flag text-2xl mb-2"></i><span class="text-sm font-semibold">1. Pendahuluan</span></button>
                <button data-section="slrmetode" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-search-plus text-2xl mb-2"></i><span class="text-sm font-semibold">2. Metode PRISMA</span></button>
                <button data-section="slrhasil" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-table text-2xl mb-2"></i><span class="text-sm font-semibold">3. Hasil Ekstraksi</span></button>
                <button data-section="slrpembahasan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-comments text-2xl mb-2"></i><span class="text-sm font-semibold">4. Pembahasan</span></button>
                <button data-section="slrkesimpulan" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-check-double text-2xl mb-2"></i><span class="text-sm font-semibold">5. Kesimpulan</span></button>
                <button data-section="slrabstrak" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-align-center text-2xl mb-2"></i><span class="text-sm font-semibold">6. Abstrak SLR</span></button>
                <button data-section="slrdaftar" class="proposal-nav-btn bg-white p-3 rounded-xl shadow-sm hover:shadow-md transition-all text-center border-2 border-gray-200 text-gray-600 flex flex-col items-center justify-center"><i class="fas fa-list text-2xl mb-2"></i><span class="text-sm font-semibold">7. Pustaka</span></button>
                <button data-section="final" class="proposal-nav-btn bg-gradient-to-tr from-green-500 to-teal-500 text-white p-3 rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all text-center border-2 border-transparent flex flex-col items-center justify-center"><i class="fas fa-file-export text-2xl mb-2"></i><span class="text-sm font-bold">Setup & Export</span></button>
            </div>

            <div id="proposal-content">
        `;

        // INJEKSI KOMPONEN DINAMIS
        sectionsData.forEach(sec => {
            htmlContent += buildSectionHTML(sec.id, sec.title, sec.promptText, sec.customInfo, sec.hasCheckbox);
        });

        // INJEKSI BAGIAN FINAL (EKSPOR)
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

            <div class="sticky bottom-0 z-40 bg-gray-50/95 backdrop-blur pt-4 pb-4 border-t border-gray-200 mt-8 flex justify-between">
                <button onclick="goToStep(4)" class="bg-white border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-gray-100"><i class="fas fa-arrow-left mr-2"></i>Kembali ke Judul</button>
            </div>
        </section>
        `;

        step5Container.innerHTML = htmlContent;

        // Pasang Event Listener Navigasi
        const navButtons = document.querySelectorAll('.proposal-nav-btn');
        if (navButtons.length > 0 && typeof showProposalSection === 'function') {
            navButtons.forEach(btn => {
                btn.addEventListener('click', function() { 
                    showProposalSection(this.getAttribute('data-section')); 
                });
            });
        }

        if (typeof setupWordCounters === 'function') {
            setupWordCounters();
        }
    }
});