# Changelog

Semua perubahan penting dan pembaruan pada platform **CRUDWorks Business OS & Web Architecture** didokumentasikan di berkas ini.

Format berkas ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan menganut prinsip [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.10.0] - 2026-11-12

### Diubah & Ditambahkan
- **Pembaruan Produk Unggulan: Aplikasi Keuangan Bagi Hasil (`keuangan-bagi-hasil`)**: Menggantikan produk *Aplikasi Self-Service Photobox* dengan **Aplikasi Keuangan Bagi Hasil Kemitraan** (berbasis arsitektur `app-keuangan`) di database MySQL (`services`), `db.sql`, API backend (`api/index.php`), katalog produk (`produk.html`), serta beranda (`index.html` & `js/app.js`).
  - *Fitur Inti*: Pencatatan Modal & Ekuitas Mitra (porsi % otomatis), Mesin Kalkulasi & Distribusi Bagi Hasil Proporsional (Cadangan Laba, Management Fee, Prive/Kasbon FIFO), Double-Entry COA, Multi Kas/Bank, Neraca, Matriks Laba Rugi 12 Bulan, Arus Kas, Aging Piutang/Utang, Aset Tetap & Penyusutan, Rekonsiliasi Bank CSV, Tutup Buku Tahunan, Slip PDF/WhatsApp, serta RBAC Granular & Audit Trail Log.
- **Pembaruan Quotation Builder & FAQ Keuangan Bagi Hasil**:
  - Menyesuaikan modul pada *Quotation Builder* (`bagi_hasil`, Rp 2.950.000 sekali bayar / Rp 199rb/bln) beserta opsi *Setup Server & Migrasi COA* (`setup_coa`).
  - Mengganti tab & daftar FAQ menjadi 3 topik spesifik seputar **Keuangan Bagi Hasil (3)** (Kalkulasi Bagi Hasil Otomatis, Akuntansi Double-Entry COA & Tutup Buku, dan Keamanan RBAC Mitra/Investor).

---

## [2.9.2] - 2026-11-06

### Diperbaiki & Ditingkatkan
- **Peningkatan Ketebalan Tipografi & Keterbacaan Global (Typography Weight & Contrast Enhancement)**:
  - *Elevasi Bobot Teks Dasar*: Menaikkan bobot font default elemen teks (`body`, `p`, `li`, `dd`, `dt`, `label`, `input`, `select`, `textarea`) ke bobot *Medium* (500) sehingga karakter huruf tampil lebih padat, solid, dan tidak tipis/memudar di berbagai jenis layar resolusi tinggi (Retina/FHD/4K).
  - *Penegasan Bobot Komponen*: Mempertegas bobot tombol, tautan navigasi, dan badge status menjadi *SemiBold* (600), serta judul heading (`h1`–`h6`) menjadi *Bold* (700) dan *ExtraBold* (800).
  - *Optimalisasi Subpixel Text Smoothing*: Mengaktifkan `-webkit-font-smoothing: subpixel-antialiased` dan `text-rendering: optimizeLegibility` untuk meminimalisir efek penipisan rendering font pada peramban Windows dan Chromium.
  - *Peningkatan Kontras Teks Pendukung*: Menggelapkan nilai warna teks pendukung (dari `#64748b` ke `#475569` dan `#334155`) agar kontras teks terhadap latar putih/abu-abu terang semakin tajam dan mudah dibaca tanpa menyilaukan mata, dengan tetap mempertahankan kecerahan teks pada kontainer gelap (`bg-slate-900`).

---

## [2.9.1] - 2026-11-05

### Ditambahkan
- **FAQ Spesifik Perangkat Keras Photobox & Kiosk**: Menambahkan bagian tanya jawab teknis komprehensif pada beranda (`index.html#faq`) dan katalog produk (`produk.html`):
  - *Dukungan Kamera*: Panduan integrasi kamera DSLR/Mirrorless Canon EOS & Nikon via kabel USB tethering 300 DPI, Webcam Full HD/4K, maupun kamera internal All-in-One PC via WebRTC.
  - *Dukungan Printer Foto*: Kompatibilitas printer dye-sublimation foto lab (DNP DS-RX1HS, Citizen CY-02, HiTi P525L, Fujifilm ASK-300) dengan kecepatan cetak 12 detik laminasi anti-air/sidik jari, serta printer kasir thermal POS 58/80mm.
  - *Mode Operasional Offline*: Jaminan kiosk tetap berfungsi 100% melayani sesi foto dan cetak fisik saat koneksi internet di kafe/event terputus, dilengkapi antrean auto-sync ke cloud storage saat online kembali.
- **Kategori Tab FAQ Interaktif Kiosk & Photobox**: Menambahkan filter tab `Kiosk & Photobox (3)` di pusat bantuan beranda untuk memudahkan calon klien membaca spesifikasi hardware dalam satu klik.

---

## [2.9.0] - 2026-11-05

### Ditambahkan
- **Berkas Konfigurasi Versi Repositori (.gitignore)**: Menambahkan berkas `.gitignore` standar produksi untuk mengabaikan berkas rahasia (`.env`), dependensi pustaka (`node_modules/`), log server, file sistem OS (`Thumbs.db`, `.DS_Store`), serta cache editor.
- **Auto-Sync Draft Penawaran ke Formulir Kontak & Modal Konsultasi**: Menghubungkan kalkulator interaktif *Quotation Builder* langsung ke formulir kontak bawah (`#contact-form`) dan modal konsultasi (`#consultation-modal`). Setiap kali pengguna memilih modul atau mengubah skala outlet, sistem otomatis menyinkronkan:
  - Banner status live sync penawaran aktif (`#contact-quotation-sync-banner`).
  - Opsi dropdown modul yang otomatis memilih `✨ Paket Terpilih di Quotation Builder`.
  - Catatan formulir (`#message`) yang otomatis merangkum daftar modul, paket hardware kasir, dan estimasi total investasi.
  - Skala cabang pada modal konsultasi (`#modal-skala-select`) yang menyesuaikan pilihan outlet di Quotation Builder.
  - Pesan konsultasi WhatsApp yang menyertakan rincian estimasi secara terstruktur.
- **Penamaan Otomatis Berkas Cetak PDF**: Dokumen yang diekspor via dialog cetak browser kini otomatis diberi nama formal `Draft-Penawaran-CRUDWorks-[NOMOR-ESTIMASI].pdf`.

---

## [2.8.2] - 2026-11-04

### Diperbaiki
- **Isolasi Penuh Cetak & PDF Draft Penawaran Resmi Tanpa Halaman Kosong**: Mengganti mekanisme cetak berbasis `visibility: hidden` (yang sebelumnya menyisakan tinggi elemen tak terlihat sehingga menghasilkan halaman awal kosong) dengan arsitektur **Dedicated Print Mount Container** (`#print-mount`). Saat tombol cetak diklik atau `Ctrl+P` ditekan, kartu penawaran disalin langsung ke kontainer root independen sementara elemen `body` lainnya disetel ke `display: none !important`. Dokumen draft penawaran resmi kini tercetak instan dan utuh di Halaman 1 A4 lengkap dengan kop surat perusahaan, rincian biaya, garansi, serta kolom pengesahan tanda tangan tanpa ada halaman kosong.

---

## [2.8.1] - 2026-11-04

### Ditambahkan
- **Fitur Pengurutan Dinamis Katalog Produk**: Menambahkan kontrol interaktif `#catalog-sort` pada `produk.html` dengan 5 mode sortir: Rekomendasi Unggulan CRUDWorks, Paling Populer & Trending, Harga Terendah ke Tertinggi, Harga Tertinggi ke Terendah, dan Alfabet Nama (A–Z).
- **Sinkronisasi Dataset Terpadu 9 Produk**: Menyelaraskan seluruh dataset fallback di `produk.html` dengan 9 modul resmi yang terdaftar di database MySQL dan beranda `index.html`.

### Diubah
- **Penyelarasan Urutan Prioritas Komersial Modul**: Menata ulang urutan modul di backend SQL (`api/index.php`), `produk.html`, dan `js/app.js` secara strategis dengan menempatkan produk unggulan di posisi teratas:
  1. *Aplikasi Retail* (Best Seller POS & Multi-Gudang)
  2. *Aplikasi Self-Service Photobox* (Trending Kiosk & QRIS)
  3. *Laporan Keuangan* (Akuntansi SAK EMKM & Neraca Laba Rugi)
  4. *Sistem HR & Payroll* (Absensi GPS & Penggajian)
  5. *Aplikasi Membership* (Loyalitas Pelanggan & Poin WhatsApp)
  6. *Manajemen Koperasi* (Simpan Pinjam & SHU)
  7. *Pemantauan Marketing* (Sales Tracking GPS & Lead CRM)
  8. *AI Credit Scoring* (Analisis Risiko Kredit Nasabah)
  9. *Custom Development* (Pengembangan Sistem Tailor-Made)

---

## [2.8.0] - 2026-11-04

### Ditambahkan
- **Integrasi Produk Baru: Aplikasi Self-Service Photobox & Kiosk**: Menambahkan produk sistem photobox mandiri terintegrasi (`aplikasi-photobox`) bersumber dari arsitektur `app-photobox`, mencakup antarmuka touchscreen kiosk interaktif, live camera preview DSLR/WebRTC, rendering canvas foto lab 300 DPI (strip 2x6 & postcard 4x6), pembayaran QRIS dinamis otomatis tanpa operator, Guest Portal PWA via pemindaian QR code untuk unduh foto HD dan boomerang GIF, serta kiosk mode anti-tamper.
- **Opsi Modul & Hardware Photobox pada Proposal Builder**: Calon mitra dapat langsung memilih modul Photobox Kiosk (Rp 3.500.000 sekali bayar / Rp 249rb/bln) dan opsi paket Printer Foto Dye-Sublimasi 300 DPI pada generator penawaran harga resmi.

### Diperbaiki
- **Isolasi Cetak & PDF Draft Penawaran Resmi**: Memperbaiki fungsi pencetakan penawaran (`#btn-quote-print`) menggunakan aturan CSS `@media print` presisi dan template dokumen formal pada `#printable-quotation-card`. Hasil cetak dan ekspor PDF kini terisolasi khusus pada lembar draft penawaran resmi berstandar A4 (lengkap dengan kop surat perusahaan, nomor dokumen, rincian paket terpilih, ketentuan estimasi, dan pengesahan tanda tangan) serta menghilangkan seluruh navbar, footer, tombol interaktif, dan elemen halaman website luar.

---

## [2.7.0] - 2026-11-04

### Ditambahkan
- **Instant Quotation & Proposal Builder**: Kalkulator penawaran resmi interaktif di beranda (`#quotation-builder`) yang memungkinkan calon klien memilih kombinasi modul, skala cabang (diskon bundling hingga 20%), hardware kasir siap pakai, dan model lisensi, dengan fitur cetak/unduh PDF resmi serta kirim draft ke WhatsApp sales.
- **Filter Sektor Industri Studi Kasus**: Toolbar filter interaktif pada bagian Studi Kasus Riil (`#case-study-filters`) mencakup sektor Retail, Koperasi, Pendidikan, Manufaktur, serta Jasa & F&B, dilengkapi studi kasus baru Syanjaya Group dan Pares Homestay & Resto.
- **Glosarium Bisnis & Edukasi Fitur UMKM**: Panduan istilah operasional bisnis terintegrasi di FAQ beranda dan halaman produk yang mengedukasi istilah teknis (Stok Opname, HPP FIFO, Rekonsiliasi Kas, QRIS Dinamis, dan SAK EMKM).

---

## [2.6.0] - 2026-11-04

### Ditambahkan
- **Floating WhatsApp Help Widget**: Tombol bantuan mengambang di pojok kanan bawah dengan indikator status aktif tim (hijau pulsing) dan kartu obrolan konsultasi cepat.
- **Form Kirim Langsung ke WhatsApp**: Fitur pada formulir konsultasi untuk merangkai pesan terstruktur (Nama, Kontak, Pilihan Modul, dan Catatan) langsung ke WhatsApp admin dan otomatis mencatat data prospek ke server.
- **Interactive UI Demo / Screenshot Modal**: Modal tur pratinjau antarmuka sistem nyata (Layar Kasir POS Cepat, Monitoring Stok Multi-Gudang, dan Rekap Laba Rugi) dengan tab interaktif pada beranda dan katalog.
- **Transparansi Model Kepemilikan (Beli Putus vs SaaS)**: Label dan penjelas resmi pada katalog produk, hero section, dan FAQ mengenai kebebasan memilih skema *Beli Putus (One-Time / Hak Milik)* atau *Cloud SaaS (Langganan Hemat)*.

### Dioptimalkan
- **Peningkatan SEO Lokal & Schema Google**: Memperbarui JSON-LD Schema.org menjadi format `@graph` valid dengan integrasi data `LocalBusiness` Malang, jam operasional, koordinat peta, dan `SoftwareApplication` rating 4.9.
- **Optimasi Core Web Vitals & Gambar**: Menambahkan atribut `loading="lazy"`, `decoding="async"`, serta dimensi gambar eksplisit pada logo mitra klien untuk mencegah *Cumulative Layout Shift (CLS)*.

---

## [2.5.1] - 2026-11-04

### Diubah & Disederhanakan (Human-Centric Redesign)
- **Eliminasi Elemen Berlebih (De-Slopification)**: Menghapus ticker telemetri fiktif ('IDC Malang Node 12ms'), simulator kasir mainan, tombol jendela macOS tiruan, dan pengalih konsol terminal yang terasa robotik atau berlebihan.
- **Standar Desain Software House Manusiawi**: Mengembalikan arsitektur tampilan website ke standar industri perangkat lunak yang bersih, elegan, terpercaya, dan mudah dipahami oleh pemilik usaha di Indonesia.
- **Hero Section Fokus Nilai Bisnis**: Headline yang ramah dan to the point, tombol WhatsApp langsung, serta kartu ringkasan penjualan toko yang realistis.
- **Katalog Produk Bersih & Terstruktur**: Tampilan modul di beranda dan halaman produk diselaraskan ke dalam format kartu 3 kolom yang lapang dengan daftar fitur ceklis, harga transparan, dan akses langsung ke detail serta pemesanan.
- **Penyempurnaan Kalkulator Penghematan**: Desain kalkulator efisiensi disesuaikan menjadi kartu terang bernuansa profesional tanpa kesan sci-fi gelap.

---

## [2.5.0] - 2026-11-03

### Ditambahkan
- **Interactive Spec Rows**: Tata letak baris horizontal bergaya teknis (Apple/Stripe Specs) untuk menampilkan katalog produk dan modul secara terstruktur dengan badge chip status.
- **Split Interactive Console**: Panel interaktif dua kolom dengan daftar modul di sisi kiri dan panggung telemetri (*live stage canvas*) di sisi kanan.
- **Catalog Multi-View Switcher**: Toolbar pengalih mode tampilan pada katalog `produk.html` (`[📋 Lembar Baris]`, `[📟 Konsol Interaktif]`, dan `[▦ Grid Modern]`).
- **Borderless Telemetry Strip**: Desain bilah metrik dan jaminan kepercayaan kontinu tanpa batas kotak terpisah (`divide-x divide-slate-200/80`).
- **Asymmetric Bento Showcase**: Tata letak asimetris untuk arsitektur inti modul dan alur implementasi perangkat lunak.
- **Halaman Changelog Publik (`changelog.html`)**: Antarmuka riwayat versi interaktif bagi pengguna dan pengembang.
- **Asset Versioning Generator (`scripts/generate-version.js`)**: Generator otomatis untuk menyematkan versi query string CSS dan JS (`?v=2.5.0`) langsung dari isi berkas `CHANGELOG.md`.

### Diubah
- **Hero Unified Module Switcher**: Mengganti slider carousel beranda dengan tab selektor modul terpadu yang terhubung ke *Device Frame Switcher* (Laptop, Tablet POS, Smartphone).
- **Streamlined Homepage**: Merampingkan halaman beranda dari 19 section menjadi 11 section prioritas tinggi tanpa redundansi.
- **Kalkulator ROI Interaktif**: Slider dinamis perhitungan penghematan cabang dan transaksi dengan tautan WhatsApp otomatis.
- **Matriks Komparasi Operasional**: Tabel perbandingan langsung "Metode Konvensional vs CRUDWorks Cloud OS".
- **Asset Loading Modern**: Menggantikan `document.write` runtime dengan pemuatan aset statis terversi berbasis changelog (`style.css?v=2.5.0` dan `app.js?v=2.5.0`).

### Diperbaiki
- **Inisialisasi Awal Render Katalog**: Memperbaiki pemanggilan render awal `renderCatalog(services)` pada `produk.html` sehingga daftar modul langsung tampil instan tanpa jeda kosong.
- **Responsivitas Perangkat Mobile**: Mengoptimalkan padding, ukuran font, dan penataan kolom pada layar smartphone dan tablet.

---

## [2.4.0] - 2026-11-02

### Ditambahkan
- **Device Frame Switcher**: Pratinjau responsif interaktif untuk melihat tampilan sistem pada 3 layar sekaligus (Laptop, Tablet POS, dan Smartphone).
- **Pembersihan Konten Duplikat**: Menghilangkan pipeline redundan dan penyatuan modul kalkulator efisiensi.

### Diubah
- Optimasi tata letak tipografi dengan font *Plus Jakarta Sans*.

---

## [2.3.0] - 2026-10-15

### Ditambahkan
- **Quick View Modal**: Pop-up ringkasan cepat spesifikasi modul langsung dari katalog.
- **Compare Floating Bar & Modal**: Fitur komparasi komprehensif hingga 3 modul sekaligus.

---

## [2.0.0] - 2026-01-27

### Ditambahkan
- Rilis perdana **CRUDWorks Business OS**: Modul Laporan Keuangan, Aplikasi Retail POS, HRIS & Payroll, dan Warehouse Inventory WMS.
- Panel API JSON terpadu dan arsitektur keamanan SSL / Role Based Access Control (RBAC).

