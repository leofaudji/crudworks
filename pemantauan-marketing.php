<?php
// Halaman Detail Produk: Pemantauan Marketing
?>
<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemantauan Marketing - Lacak Kinerja Sales & Kampanye | CRUDWorks</title>
    <meta name="description" content="Platform pemantauan marketing untuk melacak aktivitas sales lapangan via GPS dan menganalisis ROI kampanye digital Anda.">
    <link rel="icon" href="css/favicon.png" type="image/png">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Fonts & Icons -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        wa: { light: '#3b82f6', dark: '#1e3a8a' },
                        // Menggunakan warna Teal untuk halaman produk ini
                        teal: { 
                            50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' 
                        }
                    },
                    fontFamily: {
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                    }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- Navbar (Simplified for Landing Page) -->
    <nav class="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-20">
                <a href="index.html" class="flex items-center gap-3 group">
                    <img src="css/logo.png" alt="Logo" class="h-10 w-auto">
                </a>
                <div class="hidden md:flex items-center space-x-8">
                    <a href="index.html#services" class="text-sm font-semibold text-slate-600 hover:text-teal-600">Produk Lainnya</a>
                    <a href="index.html#contact" class="bg-teal-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-teal-700 transition">Hubungi Sales</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 bg-gradient-to-b from-teal-50 to-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                <div class="lg:col-span-6 text-center lg:text-left">
                    <div class="inline-flex items-center px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-xs font-bold uppercase mb-6">
                        <i class="fa-solid fa-bullseye mr-2"></i> Operasional & Marketing
                    </div>
                    <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        Maksimalkan Konversi dengan <span class="text-teal-600">Pemantauan Marketing</span>
                    </h1>
                    <p class="text-lg text-slate-600 mb-8 leading-relaxed">
                        Lacak kinerja kampanye digital dan aktivitas tim sales lapangan secara real-time. Dapatkan data akurat untuk optimalkan ROI dan capai target penjualan.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="#demo" class="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            <i class="fa-solid fa-play-circle"></i> Minta Demo Gratis
                        </a>
                        <a href="#features" class="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            Pelajari Fitur
                        </a>
                    </div>
                </div>
                <div class="lg:col-span-6 mt-12 lg:mt-0 relative">
                    <div class="relative rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 z-10">
                        <!-- Marketing Dashboard Visualization -->
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <p class="text-sm text-slate-500">Sales Funnel Overview</p>
                                <h3 class="text-3xl font-bold text-slate-900">1,280 <span class="text-sm font-normal text-slate-500">Leads</span></h3>
                            </div>
                            <div class="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                                <i class="fa-solid fa-chart-line text-xl"></i>
                            </div>
                        </div>
                        <div class="space-y-3">
                            <div class="flex items-center gap-3">
                                <span class="text-xs font-semibold text-slate-400 w-16 text-right">Awareness</span>
                                <div class="h-3 bg-slate-100 rounded-full overflow-hidden w-full"><div class="h-full bg-teal-300 w-[90%]"></div></div>
                            </div>
                             <div class="flex items-center gap-3">
                                <span class="text-xs font-semibold text-slate-400 w-16 text-right">Interest</span>
                                <div class="h-3 bg-slate-100 rounded-full overflow-hidden w-full"><div class="h-full bg-teal-400 w-[65%]"></div></div>
                            </div>
                             <div class="flex items-center gap-3">
                                <span class="text-xs font-semibold text-slate-400 w-16 text-right">Decision</span>
                                <div class="h-3 bg-slate-100 rounded-full overflow-hidden w-full"><div class="h-full bg-teal-500 w-[30%]"></div></div>
                            </div>
                             <div class="flex items-center gap-3">
                                <span class="text-xs font-semibold text-slate-400 w-16 text-right">Action</span>
                                <div class="h-3 bg-slate-100 rounded-full overflow-hidden w-full"><div class="h-full bg-teal-600 w-[15%] animate-pulse"></div></div>
                            </div>
                        </div>
                        <!-- Floating Elements -->
                        <div class="mt-8 grid grid-cols-2 gap-4">
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p class="text-xs text-slate-500 mb-1">Conversion Rate</p>
                                <p class="text-lg font-bold text-slate-900">15.2%</p>
                            </div>
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p class="text-xs text-slate-500 mb-1">Sales Activity</p>
                                <p class="text-lg font-bold text-slate-900">34 Visits/Day</p>
                            </div>
                        </div>
                    </div>
                    <!-- Decorative Blobs -->
                    
                    
                </div>
            </div>
        </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900">Visualisasikan Alur Kerja Anda</h2>
                <p class="mt-4 text-slate-600 max-w-2xl mx-auto">Dari akuisisi lead hingga laporan penjualan, lihat bagaimana sistem kami menyederhanakan proses marketing dan sales Anda.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <!-- Connector lines -->
                <div class="hidden md:block absolute top-1/2 left-0 w-full h-px -translate-y-1/2">
                    <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 1">
                        <path d="M 0,0.5 L 100,0.5" stroke-dasharray="4 4" stroke="#cbd5e1" stroke-width="2"></path>
                    </svg>
                </div>

                <!-- Step 1 -->
                <div class="relative text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm z-10">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-100 text-teal-600">
                        <i class="fa-solid fa-funnel-dollar text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">1. Capture Leads</h3>
                    <p class="text-slate-600">Integrasikan dengan sumber leads (Website, Iklan, Medsos) secara otomatis. Semua prospek masuk ke satu pipeline terpusat.</p>
                </div>
                <!-- Step 2 -->
                <div class="relative text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm z-10">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-100 text-teal-600">
                        <i class="fa-solid fa-person-walking-arrow-right text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">2. Monitor Sales</h3>
                    <p class="text-slate-600">Tim sales melakukan check-in berbasis GPS, update status prospek, dan kirim laporan via aplikasi mobile.</p>
                </div>
                <!-- Step 3 -->
                <div class="relative text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm z-10">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-slate-100 text-teal-600">
                        <i class="fa-solid fa-chart-pie text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">3. Analyze & Optimize</h3>
                    <p class="text-slate-600">Manager melihat performa tim dan efektivitas kampanye di dashboard terpusat untuk mengambil keputusan strategis.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-20 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900">Fitur Unggulan</h2>
                <p class="mt-4 text-slate-600">Semua yang Anda butuhkan untuk tim marketing & sales yang lebih produktif.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                        <i class="fa-solid fa-map-location-dot text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Sales Tracking GPS</h3>
                    <p class="text-slate-600 leading-relaxed">Pantau lokasi, rute, dan aktivitas kunjungan tim sales di lapangan secara real-time untuk memastikan produktivitas.</p>
                </div>
                <!-- Feature 2 -->
                <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                        <i class="fa-solid fa-filter-circle-dollar text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Lead & Funnel Management</h3>
                    <p class="text-slate-600 leading-relaxed">Kelola semua prospek dalam satu pipeline. Lacak setiap tahapan konversi untuk identifikasi bottleneck.</p>
                </div>
                <!-- Feature 3 -->
                <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                        <i class="fa-solid fa-magnifying-glass-chart text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Campaign ROI Analytics</h3>
                    <p class="text-slate-600 leading-relaxed">Hubungkan biaya iklan dengan penjualan yang dihasilkan. Ketahui kampanye mana yang paling profitabel.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Demo Request Section -->
    <section id="demo" class="py-20 bg-white">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl font-bold text-slate-900">Siap Meningkatkan Performa Tim Anda?</h2>
            <p class="mt-4 text-slate-600">Jadwalkan demo gratis bersama tim kami untuk melihat bagaimana platform ini dapat disesuaikan dengan kebutuhan bisnis Anda.</p>
            <div class="mt-8">
                <a href="index.html#contact" class="px-10 py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 hover:-translate-y-1 transition-all inline-flex items-center justify-center gap-2">
                    <i class="fa-solid fa-calendar-check"></i> Jadwalkan Demo Sekarang
                </a>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-slate-500 text-sm">&copy; <?php echo date('Y'); ?> CRUDWorks. All rights reserved.</p>
        </div>
    </footer>

</body>
</html>