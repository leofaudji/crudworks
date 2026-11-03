# Changelog

Semua perubahan penting dan pembaruan pada platform **CRUDWorks Business OS & Web Architecture** didokumentasikan di berkas ini.

Format berkas ini mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan menganut prinsip [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

