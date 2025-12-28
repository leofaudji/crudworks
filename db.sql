USE web_crudworks;

CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    detailed_description TEXT,
    icon VARCHAR(50) NOT NULL,
    price VARCHAR(50),
    discount_price VARCHAR(50) DEFAULT NULL,
    features TEXT,
    badge VARCHAR(50) DEFAULT NULL
);

CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE services;

INSERT INTO services (title, category, description, detailed_description, icon, price, discount_price, features, badge) VALUES
(
    'Laporan Keuangan', 
    'finance', 
    'Otomatisasi pembukuan, neraca, dan laporan laba rugi yang akurat sesuai standar akuntansi.', 
    '<p>Mengelola keuangan bisnis tidak pernah semudah ini. <strong>Laporan Keuangan CRUDWorks</strong> menghadirkan solusi pembukuan cerdas yang mengotomatisasi proses akuntansi manual yang memakan waktu.</p><p>Dengan fitur rekonsiliasi bank otomatis, Anda dapat memangkas waktu penutupan buku hingga 50%. Dapatkan wawasan mendalam melalui dashboard analitik yang menyajikan tren pendapatan, biaya operasional, dan profitabilitas secara visual dan <em>real-time</em>.</p><ul class="list-disc pl-5 space-y-2"><li><strong>Akurasi Tinggi:</strong> Minimalkan human error dalam perhitungan neraca dan laba rugi.</li><li><strong>Kepatuhan Pajak:</strong> Laporan yang siap untuk pelaporan pajak sesuai regulasi terbaru.</li><li><strong>Akses Multi-User:</strong> Berikan akses spesifik untuk akuntan, manajer, dan pemilik bisnis.</li></ul>', 
    'file-invoice-dollar', 
    'Rp 199rb/bln', 
    'Rp 149rb/bln',
    '["Neraca & Laba Rugi", "Rekonsiliasi Bank", "Multi-Currency", "Budgeting", "Manajemen Aset", "Laporan Pajak", "Dashboard Analitik", "Export PDF/Excel"]',
    NULL
),
(
    'Aplikasi Retail', 
    'operational', 
    'Kelola stok inventaris, penjualan kasir (POS), dan pelanggan toko retail dalam satu platform.', 
    '<p>Tingkatkan efisiensi operasional toko Anda dengan <strong>Aplikasi Retail Terpadu</strong>. Dirancang khusus untuk bisnis ritel modern yang membutuhkan kecepatan dan ketepatan.</p><p>Sistem Point of Sales (POS) kami tidak hanya mencatat transaksi, tetapi juga terhubung langsung dengan inventaris gudang. Saat kasir memindai barang, stok otomatis berkurang secara real-time, mencegah selisih stok yang merugikan.</p><p>Fitur unggulan meliputi:</p><ul class="list-disc pl-5 space-y-2"><li><strong>Manajemen Multi-Cabang:</strong> Pantau performa seluruh outlet dari satu dashboard pusat.</li><li><strong>Analisa Terlaris:</strong> Ketahui produk mana yang paling laku (fast moving) dan yang menumpuk di gudang.</li><li><strong>Promosi Fleksibel:</strong> Atur diskon, bundling, atau flash sale dengan mudah.</li></ul>', 
    'shop', 
    'Rp 249rb/bln', 
    NULL,
    '["Manajemen Stok", "Point of Sales (POS)", "Loyalty Program", "Laporan Penjualan", "Manajemen Multi-Gudang", "Integrasi Marketplace", "Barcode Scanner Support", "Promo & Diskon"]',
    'Best Seller'
),
(
    'Sistem HR & Payroll', 
    'hr', 
    'Manajemen data karyawan, absensi online, dan perhitungan gaji otomatis yang terintegrasi.', 
    '<p>Transformasikan departemen HR Anda dari administrasi manual menjadi mitra strategis bisnis. <strong>Sistem HR & Payroll</strong> kami menangani kerumitan perhitungan gaji, pajak (PPh 21), dan BPJS secara otomatis.</p><p>Dilengkapi dengan aplikasi mobile untuk karyawan (Employee Self-Service), tim Anda dapat melakukan absensi berbasis GPS, mengajukan cuti, dan mengunduh slip gaji langsung dari smartphone mereka.</p><p>Manfaat utama:</p><ul class="list-disc pl-5 space-y-2"><li><strong>Hemat Waktu:</strong> Proses payroll ratusan karyawan selesai dalam hitungan menit.</li><li><strong>Transparansi:</strong> Karyawan dapat melihat rincian gaji dan potongan dengan jelas.</li><li><strong>Database Terpusat:</strong> Simpan dokumen karyawan, kontrak, dan riwayat karir dengan aman.</li></ul>', 
    'users-gear', 
    'Rp 15rb/karyawan', 
    NULL,
    '["Absensi Online", "Payroll Otomatis", "BPJS & PPh 21", "Portal Karyawan", "Manajemen Shift Kerja", "Reimbursement Online", "Slip Gaji Digital", "Approval Cuti"]',
    NULL
),
(
    'Manajemen Koperasi', 
    'finance', 
    'Solusi digital untuk simpan pinjam, keanggotaan, dan sisa hasil usaha (SHU) koperasi.', 
    '<p>Modernisasi koperasi Anda untuk menarik generasi baru anggota. Platform <strong>Manajemen Koperasi Digital</strong> kami membawa transparansi dan kemudahan akses yang selama ini menjadi tantangan koperasi konvensional.</p><p>Anggota dapat memantau saldo simpanan dan sisa pinjaman mereka secara real-time melalui aplikasi. Pengurus dapat mengelola pembagian Sisa Hasil Usaha (SHU) dengan rumus yang adil dan transparan sesuai AD/ART.</p>', 
    'handshake', 
    'Rp 299rb/bln', 
    NULL,
    '["Simpanan & Pinjaman", "Perhitungan SHU", "Keanggotaan", "Laporan RAT", "Mobile App Anggota", "Notifikasi WA", "Laporan Keuangan Koperasi", "Manajemen Pengurus"]',
    NULL
),
(
    'Aplikasi Membership', 
    'operational', 
    'Bangun loyalitas pelanggan dengan sistem membership digital. Kelola poin, tier member, dan promo khusus secara otomatis.', 
    '<p>Ubah pembeli satu kali menjadi pelanggan setia seumur hidup. <strong>Aplikasi Membership</strong> membantu Anda membangun hubungan personal dengan pelanggan melalui program loyalitas berbasis data.</p><p>Kumpulkan data perilaku belanja pelanggan dan gunakan untuk mengirimkan penawaran yang sangat relevan. Sistem poin dan tiering (Silver, Gold, Platinum) memicu gamifikasi yang mendorong pelanggan untuk berbelanja lebih sering.</p>', 
    'id-card-clip', 
    'Mulai Rp 199.000', 
    'Rp 99.000',
    '["Kartu Member Digital", "Sistem Poin & Reward", "Database Pelanggan", "Blast Promo WhatsApp", "Laporan Analisa Member"]',
    'New'
),
(
    'Custom By Requirement', 
    'operational', 
    'Solusi software tailor-made yang dirancang khusus mengikuti alur bisnis unik perusahaan Anda. Fleksibel dan scalable.', 
    '<p>Setiap bisnis memiliki keunikan tersendiri, dan terkadang solusi "siap pakai" tidak cukup. Layanan <strong>Custom Software Development</strong> kami hadir untuk menerjemahkan proses bisnis spesifik Anda menjadi solusi digital yang presisi.</p><p>Kami menggunakan pendekatan <em>Agile Development</em> yang melibatkan Anda dalam setiap tahap, memastikan hasil akhir benar-benar sesuai ekspektasi dan kebutuhan operasional Anda.</p>', 
    'laptop-code', 
    'Sesuai Kebutuhan', 
    NULL,
    '["Analisis Bisnis Mendalam", "Desain UI/UX Custom", "Pengembangan Full Stack", "Integrasi API Pihak Ketiga", "Garansi & Maintenance"]',
    NULL
);
