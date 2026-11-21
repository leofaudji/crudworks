// CRUDWorks Fallback Catalog Data
    const fallbackServices = [
        {
            id: 7,
            title: 'Aplikasi Keuangan Bagi Hasil',
            slug: 'keuangan-bagi-hasil',
            category: 'finance',
            description: 'Sistem keuangan & akuntansi kemitraan untuk pencatatan modal, hitung bagi hasil proporsional otomatis, prive mitra, double-entry COA, neraca, dan laporan laba rugi 12 bulan.',
            icon: 'chart-pie',
            price: 'Mulai Rp 299rb/bln',
            discount_price: 'Rp 199rb/bln',
            badge: 'Trending',
            features: JSON.stringify(['Pencatatan Modal & Porsi Mitra (%)', 'Mesin Hitung Bagi Hasil Otomatis', 'Prive/Kasbon & Management Fee', 'Double-Entry COA & Jurnal Umum', 'Laporan Neraca, Laba Rugi & Arus Kas', 'Rekonsiliasi Bank & Tutup Buku', 'Slip Bagi Hasil PDF & Tagihan WA', 'RBAC Granular & Audit Trail Log'])
        },
        {
            id: 1,
            title: 'Aplikasi Retail',
            slug: 'aplikasi-retail',
            category: 'operational',
            description: 'Kelola stok inventaris, penjualan kasir (POS), dan pelanggan toko retail dalam satu platform terpadu.',
            icon: 'shop',
            price: 'Rp 249rb/bln',
            discount_price: null,
            badge: 'Best Seller',
            features: JSON.stringify(['Manajemen Stok', 'Point of Sales (POS)', 'Loyalty Program', 'Laporan Penjualan', 'Barcode Scanner Support', 'Multi-Cabang'])
        },
        {
            id: 2,
            title: 'Laporan Keuangan',
            slug: 'laporan-keuangan',
            category: 'finance',
            description: 'Otomatisasi pembukuan, neraca, dan laporan laba rugi yang akurat sesuai standar akuntansi Indonesia.',
            icon: 'file-invoice-dollar',
            price: 'Rp 199rb/bln',
            discount_price: 'Rp 149rb/bln',
            badge: null,
            features: JSON.stringify(['Neraca & Laba Rugi', 'Rekonsiliasi Bank', 'Multi-Currency', 'Laporan Pajak', 'Export PDF/Excel'])
        },
        {
            id: 3,
            title: 'Sistem HR & Payroll',
            slug: 'sistem-hr-payroll',
            category: 'hr',
            description: 'Manajemen data karyawan, absensi online berbasis GPS, dan perhitungan gaji otomatis yang terintegrasi.',
            icon: 'users-gear',
            price: 'Rp 15rb/karyawan',
            discount_price: null,
            badge: null,
            features: JSON.stringify(['Absensi Online', 'Payroll Otomatis', 'BPJS & PPh 21', 'Portal Karyawan', 'Slip Gaji Digital'])
        },
        {
            id: 4,
            title: 'Manajemen Koperasi',
            slug: 'manajemen-koperasi',
            category: 'finance',
            description: 'Solusi digital untuk simpan pinjam, keanggotaan, dan pembagian sisa hasil usaha (SHU) koperasi.',
            icon: 'handshake',
            price: 'Rp 299rb/bln',
            discount_price: null,
            badge: null,
            features: JSON.stringify(['Simpanan & Pinjaman', 'Perhitungan SHU', 'Buku Anggota', 'Laporan RAT', 'Notifikasi WhatsApp'])
        },
        {
            id: 5,
            title: 'Aplikasi Membership',
            slug: 'aplikasi-membership',
            category: 'operational',
            description: 'Bangun loyalitas pelanggan dengan kartu member digital, sistem poin reward belanja, dan promo otomatis.',
            icon: 'id-card-clip',
            price: 'Mulai Rp 199.000',
            discount_price: 'Rp 99.000',
            badge: 'New',
            features: JSON.stringify(['Kartu Member Digital', 'Sistem Poin & Reward', 'Database Pelanggan', 'Blast Promo WhatsApp'])
        },
        {
            id: 6,
            title: 'Custom Development',
            slug: 'custom-development',
            category: 'operational',
            description: 'Pengembangan software kustom yang dirancang khusus mengikuti proses bisnis dan kebutuhan unik Anda.',
            icon: 'code',
            price: 'Sesuai Kebutuhan',
            discount_price: null,
            badge: null,
            features: JSON.stringify(['Analisis Alur Bisnis', 'Desain UI/UX Khusus', 'Integrasi API', 'Garansi & Maintenance'])
        }
    ];
    window.fallbackServices = fallbackServices;
