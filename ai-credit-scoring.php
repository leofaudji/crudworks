<?php
// Halaman Detail Produk: AI Credit Scoring
?>
<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Credit Scoring - Analisis Risiko Cerdas | CRUDWorks</title>
    <meta name="description" content="Platform skoring kredit berbasis AI. Coba simulasi perhitungan skor kredit gratis di sini.">
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
                        wa: { light: '#3b82f6', dark: '#1e3a8a', teal: '#2563eb' }
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
                    <a href="index.html#services" class="text-sm font-semibold text-slate-600 hover:text-blue-600">Produk Lainnya</a>
                    <a href="index.html#contact" class="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition">Hubungi Sales</a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                <div class="lg:col-span-6 text-center lg:text-left">
                    <div class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase mb-6">
                        <i class="fa-solid fa-brain mr-2"></i> Artificial Intelligence
                    </div>
                    <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        Keputusan Kredit Lebih Cepat dengan <span class="text-blue-600">AI Scoring</span>
                    </h1>
                    <p class="text-lg text-slate-600 mb-8 leading-relaxed">
                        Revolusi proses analisis kredit Anda. Algoritma Machine Learning kami memproses ribuan titik data untuk menghasilkan skor risiko yang presisi dalam hitungan detik.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <a href="#simulation" class="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                            <i class="fa-solid fa-calculator"></i> Coba Simulasi
                        </a>
                        <a href="#features" class="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                            Pelajari Fitur
                        </a>
                    </div>
                </div>
                <div class="lg:col-span-6 mt-12 lg:mt-0 relative">
                    <div class="relative rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 z-10">
                        <!-- Abstract Chart Visualization -->
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <p class="text-sm text-slate-500">Credit Score Average</p>
                                <h3 class="text-3xl font-bold text-slate-900">724 <span class="text-sm font-normal text-green-500 bg-green-50 px-2 py-1 rounded-lg ml-2">Low Risk</span></h3>
                            </div>
                            <div class="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-chart-pie text-xl"></i>
                            </div>
                        </div>
                        <div class="space-y-4">
                            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full bg-blue-500 w-[75%] rounded-full animate-pulse"></div>
                            </div>
                            <div class="flex justify-between text-xs text-slate-400">
                                <span>Poor (300)</span>
                                <span>Excellent (850)</span>
                            </div>
                        </div>
                        <!-- Floating Elements -->
                        <div class="mt-8 grid grid-cols-2 gap-4">
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p class="text-xs text-slate-500 mb-1">Approval Rate</p>
                                <p class="text-lg font-bold text-slate-900">+24%</p>
                            </div>
                            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p class="text-xs text-slate-500 mb-1">Processing Time</p>
                                <p class="text-lg font-bold text-slate-900">&lt; 1 Min</p>
                            </div>
                        </div>
                    </div>
                    <!-- Decorative Blobs -->
                    
                    
                </div>
            </div>
        </div>
    </section>

    <!-- Simulation Section -->
    <section id="simulation" class="py-20 bg-white">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-slate-900">Simulasi AI Credit Scoring</h2>
                <p class="mt-4 text-slate-600">Masukkan data sederhana untuk melihat bagaimana AI kami memprediksi kelayakan kredit.</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-sm">
                <!-- Input Form -->
                <div>
                    <h3 class="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <i class="fa-solid fa-sliders text-blue-600"></i> Parameter Input
                    </h3>
                    <form id="sim-form" class="space-y-5">
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Pendapatan Bulanan (IDR)</label>
                            <input type="number" id="income" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Contoh: 15000000" required>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Pengeluaran/Hutang Bulanan (IDR)</label>
                            <input type="number" id="expense" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Contoh: 5000000" required>
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Jumlah Pinjaman</label>
                                <input type="number" id="loan" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" placeholder="Contoh: 50000000" required>
                            </div>
                            <div>
                                <label class="block text-sm font-semibold text-slate-700 mb-2">Tenor (Bulan)</label>
                                <select id="tenor" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                                    <option value="6">6 Bulan</option>
                                    <option value="12" selected>12 Bulan</option>
                                    <option value="24">24 Bulan</option>
                                    <option value="36">36 Bulan</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-semibold text-slate-700 mb-2">Status Pekerjaan</label>
                            <select id="job" class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                                <option value="100">Karyawan Tetap ( > 2 Tahun)</option>
                                <option value="80">Karyawan Tetap ( < 2 Tahun)</option>
                                <option value="60">Wiraswasta / Professional</option>
                                <option value="40">Karyawan Kontrak</option>
                                <option value="20">Freelance / Part Time</option>
                            </select>
                        </div>
                        <button type="submit" class="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20 mt-4">
                            Hitung Skor Kredit
                        </button>
                    </form>
                </div>

                <!-- Result Display -->
                <div class="flex flex-col justify-center items-center bg-white rounded-2xl p-8 border border-slate-100 shadow-inner relative overflow-hidden">
                    <div id="result-placeholder" class="text-center">
                        <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <i class="fa-solid fa-chart-simple text-3xl"></i>
                        </div>
                        <p class="text-slate-500">Isi formulir di samping untuk melihat hasil analisis AI.</p>
                    </div>

                    <div id="result-content" class="hidden w-full text-center relative z-10">
                        <p class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">AI Prediction Score</p>
                        
                        <!-- Gauge Circle -->
                        <div class="relative w-48 h-48 mx-auto mb-6">
                            <svg class="w-full h-full transform -rotate-90">
                                <circle cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="transparent" class="text-slate-100" />
                                <circle id="score-circle" cx="96" cy="96" r="88" stroke="currentColor" stroke-width="12" fill="transparent" 
                                        class="text-blue-600 transition-all duration-1000 ease-out" 
                                        stroke-dasharray="552" stroke-dashoffset="552" stroke-linecap="round" />
                            </svg>
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <span id="score-value" class="text-5xl font-extrabold text-slate-900">0</span>
                                <span class="block text-xs text-slate-500 font-medium mt-1">/ 850</span>
                            </div>
                        </div>

                        <div id="score-badge" class="inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 bg-slate-100 text-slate-600">
                            Menunggu Hasil...
                        </div>

                        <div class="grid grid-cols-2 gap-4 text-left w-full bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div>
                                <p class="text-xs text-slate-500">Probabilitas Gagal Bayar</p>
                                <p id="prob-value" class="font-bold text-slate-900">-</p>
                            </div>
                            <div>
                                <p class="text-xs text-slate-500">Rekomendasi Limit</p>
                                <p id="limit-value" class="font-bold text-slate-900">-</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Features Grid -->
    <section id="features" class="py-20 bg-slate-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-slate-900">Fitur Utama</h2>
                <p class="mt-4 text-slate-600">Teknologi di balik akurasi prediksi kami.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Feature 1 -->
                <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                        <i class="fa-solid fa-robot text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Machine Learning Core</h3>
                    <p class="text-slate-600 leading-relaxed">Model yang terus belajar dari data historis untuk meningkatkan akurasi prediksi seiring waktu.</p>
                </div>
                <!-- Feature 2 -->
                <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                        <i class="fa-solid fa-fingerprint text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Fraud Detection</h3>
                    <p class="text-slate-600 leading-relaxed">Mendeteksi pola anomali dan potensi penipuan identitas sebelum kredit disetujui.</p>
                </div>
                <!-- Feature 3 -->
                <div class="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition">
                    <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 mb-6">
                        <i class="fa-solid fa-bolt text-xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-slate-900 mb-3">Real-time Decision</h3>
                    <p class="text-slate-600 leading-relaxed">API yang mampu memberikan keputusan kredit dalam hitungan milidetik untuk pengalaman nasabah yang mulus.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-12">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p class="text-slate-500 text-sm">&copy; <?php echo date('Y'); ?> CRUDWorks. All rights reserved.</p>
        </div>
    </footer>

    <!-- Script Logic Simulasi -->
    <script>
        document.getElementById('sim-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil Nilai
            const income = parseFloat(document.getElementById('income').value) || 0;
            const expense = parseFloat(document.getElementById('expense').value) || 0;
            const loan = parseFloat(document.getElementById('loan').value) || 0;
            const tenor = parseInt(document.getElementById('tenor').value) || 12;
            const jobScore = parseInt(document.getElementById('job').value) || 0;

            // Validasi Sederhana
            if(income <= 0 || loan <= 0) {
                alert("Mohon isi data pendapatan dan pinjaman dengan benar.");
                return;
            }

            // --- LOGIKA PERHITUNGAN SKOR (SIMULASI) ---
            // 1. Debt Service Ratio (DSR)
            // Cicilan per bulan estimasi (Bunga flat 1% per bulan contohnya)
            const monthlyInstallment = (loan + (loan * 0.01 * tenor)) / tenor;
            const disposableIncome = income - expense;
            const dsr = monthlyInstallment / disposableIncome; // Semakin kecil semakin baik

            let dsrScore = 0;
            if (dsr < 0.3) dsrScore = 300;       // Sangat aman
            else if (dsr < 0.4) dsrScore = 250;  // Aman
            else if (dsr < 0.5) dsrScore = 150;  // Warning
            else dsrScore = 50;                  // Berisiko

            // 2. Loan to Income Ratio
            const lti = loan / (income * 12); // Total pinjaman vs Gaji setahun
            let ltiScore = 0;
            if (lti < 0.3) ltiScore = 200;
            else if (lti < 0.5) ltiScore = 150;
            else ltiScore = 50;

            // 3. Job Stability (Base from input)
            // jobScore max 100, kita scale up dikit
            const stabilityScore = jobScore * 2.5; // Max 250

            // Total Score (Max 300 + 200 + 250 + 100 base = 850)
            let totalScore = 100 + dsrScore + ltiScore + stabilityScore;
            
            // Cap score 300 - 850
            if (totalScore > 850) totalScore = 850;
            if (totalScore < 300) totalScore = 300;

            // Tentukan Kategori
            let category = '';
            let colorClass = '';
            let probFail = '';
            let limitRec = 0;

            if (totalScore >= 750) {
                category = 'Excellent (Sangat Layak)';
                colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-100';
                probFail = '< 1%';
                limitRec = Math.min(loan, disposableIncome * 0.5 * tenor); // Limit tinggi
            } else if (totalScore >= 650) {
                category = 'Good (Layak)';
                colorClass = 'text-blue-600 bg-blue-50 border-blue-100';
                probFail = '2 - 5%';
                limitRec = Math.min(loan, disposableIncome * 0.4 * tenor);
            } else if (totalScore >= 550) {
                category = 'Fair (Perlu Tinjauan)';
                colorClass = 'text-amber-600 bg-amber-50 border-amber-100';
                probFail = '10 - 15%';
                limitRec = Math.min(loan * 0.7, disposableIncome * 0.3 * tenor);
            } else {
                category = 'Poor (Berisiko Tinggi)';
                colorClass = 'text-red-600 bg-red-50 border-red-100';
                probFail = '> 20%';
                limitRec = 0;
            }

            // --- RENDER HASIL ---
            const placeholder = document.getElementById('result-placeholder');
            const content = document.getElementById('result-content');
            
            placeholder.classList.add('hidden');
            content.classList.remove('hidden');

            // Animate Number
            const scoreEl = document.getElementById('score-value');
            let currentVal = 300;
            const interval = setInterval(() => {
                currentVal += 5;
                if (currentVal >= totalScore) {
                    currentVal = totalScore;
                    clearInterval(interval);
                }
                scoreEl.innerText = Math.floor(currentVal);
            }, 10);

            // Animate Circle
            const circle = document.getElementById('score-circle');
            const circumference = 552; // 2 * PI * 88
            const offset = circumference - ((totalScore - 300) / 550) * circumference;
            
            // Reset dulu biar animasi jalan
            circle.style.strokeDashoffset = circumference;
            setTimeout(() => {
                circle.style.strokeDashoffset = offset;
                // Update warna circle sesuai kategori
                circle.setAttribute('class', `transition-all duration-1000 ease-out ${colorClass.split(' ')[0]}`);
            }, 100);

            // Update Text Info
            const badge = document.getElementById('score-badge');
            badge.className = `inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 border ${colorClass}`;
            badge.innerText = category;

            document.getElementById('prob-value').innerText = probFail;
            document.getElementById('limit-value').innerText = limitRec > 0 
                ? 'Rp ' + Math.floor(limitRec).toLocaleString('id-ID') 
                : 'Tidak Direkomendasikan';
        });
    </script>
</body>
</html>