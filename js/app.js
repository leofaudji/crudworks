document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'api/index.php';

    // Fallback data jika API database belum aktif atau dibuka tanpa server lokal
    const fallbackServices = [
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

    let allServicesData = []; // Simpan data global untuk filtering

    async function loadServices() {
        const container = document.getElementById('services-container');
        if (!container) return;
        
        try {
            const response = await fetch(`${API_URL}?endpoint=services`);
            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    allServicesData = data;
                } else {
                    allServicesData = fallbackServices;
                }
            } else {
                allServicesData = fallbackServices;
            }
        } catch (error) {
            console.warn('API database tidak dapat dijangkau, menggunakan data cadangan lokal:', error);
            allServicesData = fallbackServices;
        }

        try {
            const priorityOrder = [
                'Aplikasi Retail',
                'AI Credit Scoring',
                'Laporan Keuangan',
                'Sistem HR & Payroll',
                'Aplikasi Membership',
                'Manajemen Koperasi',
                'Custom Development'
            ];

            allServicesData.sort((a, b) => {
                const idxA = priorityOrder.indexOf(a.title);
                const idxB = priorityOrder.indexOf(b.title);
                return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
            });

            renderServices(allServicesData);

            const heroSlider = document.getElementById('hero-slider');
            if (heroSlider) {
                const highlightedServices = allServicesData.filter(s => s.badge);
                highlightedServices.forEach(service => {
                    const slideHtml = generateSlideHtml(service);
                    heroSlider.insertAdjacentHTML('beforeend', slideHtml);
                });
            }
        } catch (e) {
            console.error('Error saat render layanan:', e);
            renderServices(fallbackServices);
        } finally {
            initHeroSlider();
        }
    }

    // Helper: Generate HTML untuk Slide Dinamis
    function generateSlideHtml(service) {
        const lang = localStorage.getItem('crudworks_lang') || 'id';
        const t = (typeof translations !== 'undefined' && translations[lang]) ? translations[lang] : {};

        const txt_save = t.slider_save || (lang === 'id' ? 'Hemat' : 'Save');
        const txt_offer = t.slider_offer || (lang === 'id' ? 'Penawaran Khusus' : 'Special Offer');
        const txt_best_price = t.slider_best_price || (lang === 'id' ? 'Biaya Layanan' : 'Pricing');
        const txt_view = t.slider_view_details || (lang === 'id' ? 'Pelajari Fitur' : 'View Details');
        const txt_ask = t.slider_ask_admin || (lang === 'id' ? 'Konsultasi Tim' : 'Contact Us');
        const txt_avail = t.slider_available_now || (lang === 'id' ? 'Siap Diimplementasikan' : 'Ready to Deploy');

        let badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
        if (service.badge.toLowerCase() === 'best seller') {
            badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
        } else if (service.badge.toLowerCase() === 'promo') {
            badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
        }

        let priceDisplayHtml = '';
        if (service.discount_price) {
            const parseVal = (str) => {
                let num = parseInt(str.replace(/[^0-9]/g, '')) || 0;
                if (str.toLowerCase().includes('rb')) num *= 1000;
                return num;
            };
            
            const original = parseVal(service.price);
            const discounted = parseVal(service.discount_price);
            let percentHtml = '';

            if (original > 0 && discounted > 0 && original > discounted) {
                const percent = Math.round(((original - discounted) / original) * 100);
                percentHtml = `<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">${txt_save} ${percent}%</span>`;
            }

            priceDisplayHtml = `
                <div>
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">${txt_offer}</p>
                    <div class="flex flex-wrap items-baseline gap-2">
                        <span class="text-sm text-slate-400 line-through">${service.price}</span>
                        <h3 class="text-2xl font-bold text-slate-900">${service.discount_price}</h3>
                        ${percentHtml}
                    </div>
                </div>`;
        } else {
            priceDisplayHtml = `
                <div>
                    <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">${txt_best_price}</p>
                    <h3 class="text-2xl font-bold text-slate-900">${service.price || 'Hubungi Kami'}</h3>
                </div>`;
        }

        return `
            <div class="w-full flex-shrink-0 lg:grid lg:grid-cols-12 lg:gap-10 items-center py-4">
                <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border ${badgeColor} text-xs font-semibold uppercase tracking-wider mb-5">
                        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                        ${service.badge}
                    </div>
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-tight">
                        ${service.title}
                    </h2>
                    <p class="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
                        ${service.description}
                    </p>
                    <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                        <a href="produk/${service.slug || service.id}" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition text-center">
                            ${txt_view}
                        </a>
                        <a href="#contact" class="px-6 py-3 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 font-semibold rounded-lg transition text-center flex items-center justify-center gap-2">
                            <i class="fa-brands fa-whatsapp text-emerald-600"></i> ${txt_ask}
                        </a>
                    </div>
                </div>
                <div class="mt-8 lg:mt-0 lg:col-span-6">
                    <div class="rounded-2xl border border-slate-200/90 bg-white shadow-md p-6 max-w-lg mx-auto">
                        <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold">
                                    <i class="fa-solid fa-${service.icon || 'layer-group'}"></i>
                                </div>
                                <div>
                                    <h4 class="font-bold text-slate-900">${service.title}</h4>
                                    <span class="text-xs text-slate-500 capitalize">${service.category || 'Modul Bisnis'}</span>
                                </div>
                            </div>
                            <span class="px-2.5 py-1 rounded text-xs font-semibold ${badgeColor}">${service.badge}</span>
                        </div>
                        <div class="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                            ${priceDisplayHtml}
                        </div>
                        <div class="text-xs text-slate-500 flex items-center justify-between pt-2">
                            <span><i class="fa-solid fa-check text-emerald-600 mr-1.5"></i> Implementasi Cepat</span>
                            <span><i class="fa-solid fa-shield text-blue-600 mr-1.5"></i> ${txt_avail}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    let servicesViewMode = 'console'; // 'console' (Alternatif 3: Split Console) atau 'rows' (Alternatif 1: Spec Rows)
    let activeConsoleIndex = 0;
    let lastRenderedServices = [];

    function renderServices(services) {
        const container = document.getElementById('services-container');
        if (!container) return;
        lastRenderedServices = services;
        container.innerHTML = '';

        if (services.length === 0) {
            container.innerHTML = '<div class="text-center py-16 text-slate-500 font-medium bg-white rounded-2xl border border-slate-200 p-8">Tidak ada layanan ditemukan untuk kriteria ini.</div>';
            return;
        }

        if (activeConsoleIndex >= services.length) {
            activeConsoleIndex = 0;
        }

        if (servicesViewMode === 'console') {
            renderSplitConsoleView(services, container);
        } else {
            renderSpecRowsView(services, container);
        }
    }

    // ALTERNATIF 3: SPLIT INTERACTIVE CONSOLE
    function renderSplitConsoleView(services, container) {
        const wrapper = document.createElement('div');
        wrapper.className = 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-start';

        // Left Column: Vertical Nav List (5 cols)
        const leftCol = document.createElement('div');
        leftCol.className = 'lg:col-span-5 space-y-2';

        services.forEach((service, idx) => {
            const isActive = idx === activeConsoleIndex;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `w-full p-4 rounded-2xl text-left transition-all duration-200 border flex items-center justify-between gap-3 group ${
                isActive 
                    ? 'bg-white border-blue-600 shadow-md ring-1 ring-blue-600' 
                    : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
            }`;

            btn.innerHTML = `
                <div class="flex items-center gap-3 min-w-0">
                    <span class="text-xs font-mono font-bold ${isActive ? 'text-blue-600' : 'text-slate-400'}">
                        ${String(idx + 1).padStart(2, '0')}.
                    </span>
                    <div class="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }">
                        <i class="fa-solid fa-${service.icon || 'cubes'}"></i>
                    </div>
                    <div class="min-w-0">
                        <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                            ${service.title}
                        </h4>
                        <span class="text-[10px] text-slate-500 capitalize">${service.category || 'Modul Sistem'}</span>
                    </div>
                </div>
                <div class="text-right flex-shrink-0">
                    <span class="text-xs font-extrabold ${isActive ? 'text-blue-600' : 'text-slate-700'}">
                        ${service.discount_price || service.price || 'Kontak'}
                    </span>
                    ${service.badge ? `<span class="block text-[9px] uppercase font-bold text-amber-600">${service.badge}</span>` : ''}
                </div>
            `;

            btn.addEventListener('click', () => {
                activeConsoleIndex = idx;
                renderServices(lastRenderedServices);
            });

            leftCol.appendChild(btn);
        });

        // Right Column: Active Module Screen Stage (7 cols)
        const rightCol = document.createElement('div');
        rightCol.className = 'lg:col-span-7';

        const activeService = services[activeConsoleIndex] || services[0];
        let featuresPills = '';
        if (activeService.features) {
            try {
                const feats = JSON.parse(activeService.features);
                featuresPills = feats.map(f => `
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700">
                        <i class="fa-solid fa-check text-emerald-400 text-[10px]"></i>
                        <span>${f}</span>
                    </span>
                `).join('');
            } catch (e) {}
        }

        let priceStageHtml = `<div class="text-2xl font-black text-white">${activeService.price || 'Hubungi Kami'}</div>`;
        if (activeService.discount_price) {
            priceStageHtml = `
                <div class="flex items-baseline gap-3">
                    <span class="text-sm text-slate-400 line-through">${activeService.price}</span>
                    <span class="text-2xl sm:text-3xl font-black text-white">${activeService.discount_price}</span>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">Harga Promo</span>
                </div>
            `;
        }

        rightCol.innerHTML = `
            <div class="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl p-7 sm:p-9 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden transition-all duration-300">
                <div class="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/30">
                            <i class="fa-solid fa-${activeService.icon || 'cubes'}"></i>
                        </div>
                        <div>
                            <span class="text-[10px] uppercase font-bold tracking-widest text-blue-400">${activeService.category || 'Modul Sistem'}</span>
                            <h3 class="text-xl sm:text-2xl font-black text-white">${activeService.title}</h3>
                        </div>
                    </div>
                    ${activeService.badge ? `<span class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">${activeService.badge}</span>` : ''}
                </div>

                <div class="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Skema Investasi Layanan:</span>
                    ${priceStageHtml}
                </div>

                <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Penjelasan Solusi:</h4>
                    <p class="text-sm sm:text-base text-slate-300 leading-relaxed">
                        ${activeService.description}
                    </p>
                </div>

                <div>
                    <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Kapabilitas & Fitur Unggulan:</h4>
                    <div class="flex flex-wrap gap-2">
                        ${featuresPills}
                    </div>
                </div>

                <div class="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                    <a href="produk/${activeService.slug || activeService.id}" class="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm text-center shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2">
                        <span>Lihat Spesifikasi Fitur Lengkap</span>
                        <i class="fa-solid fa-arrow-right text-xs"></i>
                    </a>
                    <a href="https://wa.me/6287759651803?text=${encodeURIComponent('Halo Tim CRUDWorks, saya tertarik konsultasi demo untuk modul ' + activeService.title + '. Mohon info jadwal dan alurnya.')}" target="_blank" class="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm text-center border border-white/15 transition-all flex items-center justify-center gap-2">
                        <i class="fa-brands fa-whatsapp text-emerald-400 text-sm"></i>
                        <span>Konsultasi WA</span>
                    </a>
                </div>
            </div>
        `;

        wrapper.appendChild(leftCol);
        wrapper.appendChild(rightCol);
        container.appendChild(wrapper);
    }

    // ALTERNATIF 1: INTERACTIVE SPEC ROWS
    function renderSpecRowsView(services, container) {
        const listWrapper = document.createElement('div');
        listWrapper.className = 'space-y-3';

        services.forEach((service, idx) => {
            let featuresBadges = '';
            if (service.features) {
                try {
                    const feats = JSON.parse(service.features);
                    featuresBadges = feats.slice(0, 3).map(f => `
                        <span class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                            ${f}
                        </span>
                    `).join('');
                } catch (e) {}
            }

            const row = document.createElement('div');
            row.className = 'bg-white rounded-2xl border border-slate-200/90 hover:border-blue-400 p-4 sm:p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 group';

            row.innerHTML = `
                <div class="flex items-center gap-4 min-w-0 flex-1">
                    <span class="text-xs font-mono font-bold text-slate-400">
                        ${String(idx + 1).padStart(2, '0')}
                    </span>
                    <div class="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <i class="fa-solid fa-${service.icon || 'cubes'}"></i>
                    </div>
                    <div class="min-w-0">
                        <div class="flex items-center gap-2">
                            <h4 class="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                ${service.title}
                            </h4>
                            ${service.badge ? `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">${service.badge}</span>` : ''}
                        </div>
                        <p class="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xl">${service.description}</p>
                    </div>
                </div>

                <div class="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                    ${featuresBadges}
                </div>

                <div class="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-shrink-0">
                    <div class="text-left lg:text-right">
                        <p class="text-[10px] font-semibold text-slate-400 uppercase">Investasi:</p>
                        <p class="text-sm font-extrabold text-slate-900">${service.discount_price || service.price || 'Kontak'}</p>
                    </div>
                    <a href="produk/${service.slug || service.id}" class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5">
                        <span>Spesifikasi</span>
                        <i class="fa-solid fa-arrow-right text-[10px]"></i>
                    </a>
                </div>
            `;

            listWrapper.appendChild(row);
        });

        container.appendChild(listWrapper);
    }

    // --- LOGIC FILTER & SEARCH (Unified) ---
    let activeCategory = 'all';
    let searchQuery = '';

    const filterAndRender = () => {
        // 1. Filter Data (Category + Search)
        const filtered = allServicesData.filter(item => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                                  item.description.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        // 2. Animation Out
        const container = document.getElementById('services-container');
        Array.from(container.children).forEach(child => {
            child.classList.remove('animate-fade-in-up');
            child.classList.add('animate-fade-out');
        });

        // 3. Render New Data (Wait for animation)
        setTimeout(() => {
            renderServices(filtered);
        }, 300);
    };

    // Search Input Listener
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value.toLowerCase().trim();
                filterAndRender();
            }, 300); // Debounce 300ms agar tidak render setiap keystroke
        });
    }

    // Filter Buttons Listener
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // UI Update (Active State)
            filterBtns.forEach(b => {
                b.className = 'filter-btn px-3 py-1.5 rounded-lg text-xs font-semibold transition-all bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';
            });
            btn.className = 'filter-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-blue-600 text-white shadow-2xs';

            // Update State & Render
            activeCategory = btn.getAttribute('data-filter');
            activeConsoleIndex = 0;
            filterAndRender();
        });
    });

    // View Switcher Listener (Alternatif 3: Split Console vs Alternatif 1: Spec Rows)
    const btnViewConsole = document.getElementById('btn-view-console');
    const btnViewRows = document.getElementById('btn-view-rows');

    if (btnViewConsole && btnViewRows) {
        btnViewConsole.addEventListener('click', () => {
            if (servicesViewMode === 'console') return;
            servicesViewMode = 'console';
            btnViewConsole.className = 'px-3 py-1 rounded-lg font-bold transition-all bg-white text-blue-700 shadow-2xs flex items-center gap-1.5';
            btnViewRows.className = 'px-3 py-1 rounded-lg font-semibold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
            renderServices(lastRenderedServices);
        });

        btnViewRows.addEventListener('click', () => {
            if (servicesViewMode === 'rows') return;
            servicesViewMode = 'rows';
            btnViewRows.className = 'px-3 py-1 rounded-lg font-bold transition-all bg-white text-blue-700 shadow-2xs flex items-center gap-1.5';
            btnViewConsole.className = 'px-3 py-1 rounded-lg font-semibold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
            renderServices(lastRenderedServices);
        });
    }

    /* 
       HAPUS KODE LAMA DI BAWAH INI YANG SUDAH DIPINDAHKAN KE renderServices()
       (Bagian services.forEach lama dihapus dari loadServices)
    */
    /*
    */

    // 2. Fungsi Handle Contact Form (POST)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // UI Loading State
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Mengirim...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75');

            // Ambil data form
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch(`${API_URL}?endpoint=contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                formStatus.classList.remove('hidden');
                if (result.status === 'success') {
                    formStatus.className = 'text-center text-sm mt-2 text-green-600 font-bold';
                    formStatus.innerText = result.message;
                    contactForm.reset();
                } else {
                    throw new Error(result.message);
                }

            } catch (error) {
                formStatus.className = 'text-center text-sm mt-2 text-red-600 font-bold';
                formStatus.innerText = 'Terjadi kesalahan saat mengirim pesan.';
            } finally {
                // Reset Button
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75');
                
                // Hilangkan pesan status setelah 3 detik
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 3000);
            }
        });
    }

    // Jalankan fungsi load
    loadServices();

    // 3. Logic Accordion FAQ
    const faqBtns = document.querySelectorAll('.faq-btn');
    
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const content = btn.nextElementSibling;
            const icon = btn.querySelector('.fa-chevron-down');
            
            // Tutup item lain (Accordion behavior)
            faqBtns.forEach(otherBtn => {
                if (otherBtn !== btn) {
                    otherBtn.nextElementSibling.classList.add('hidden');
                    otherBtn.querySelector('.fa-chevron-down').classList.remove('rotate-180');
                }
            });

            // Toggle item yang diklik
            content.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });

    // 3.1 Logic FAQ Tabs
    const faqTabs = document.querySelectorAll('.faq-tab');
    const faqItems = document.querySelectorAll('.faq-item');

    faqTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Reset active state
            faqTabs.forEach(t => {
                t.className = 'faq-tab px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 transition-all';
            });
            
            // Set active state
            tab.className = 'faq-tab px-4 py-2 rounded-full text-sm font-semibold bg-blue-600 text-white transition-all shadow-sm';

            const target = tab.getAttribute('data-target');

            // Animate out visible items
            faqItems.forEach(item => {
                if (!item.classList.contains('hidden')) {
                    item.classList.add('animate-fade-out');
                }
            });

            // Wait for fade-out to complete
            setTimeout(() => {
                faqItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    const shouldBeVisible = (target === 'all' || category === target);

                    item.classList.remove('animate-fade-out', 'animate-fade-in');

                    if (shouldBeVisible) {
                        item.classList.remove('hidden');
                        item.classList.add('animate-fade-in');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            }, 300); // Match fadeOut duration
        });
    });

    // 4. Logic Counter Animation (Statistik)
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Semakin kecil semakin lambat

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 20);
                } else {
                    counter.innerText = target;
                }
            };
            updateCount();
        });
    };

    // Trigger animasi saat section terlihat (Intersection Observer)
    const statsSection = document.querySelector('.counter')?.closest('section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                animateCounters();
                observer.disconnect(); // Jalankan sekali saja
            }
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }

    // 5. Modal Logic
    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalIconContainer = document.getElementById('modal-icon-container');
    const modalFeatures = document.getElementById('modal-features');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    function openModal(service) {
        if(!modal) return;
        
        modalTitle.innerText = service.title;
        modalTitle.className = "text-xl font-bold text-gray-900";

        // Icon Container
        modalIconContainer.className = "flex items-center justify-center flex-shrink-0 w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:mx-0 sm:h-16 sm:w-16 shadow-sm border border-blue-100";
        modalIconContainer.innerHTML = `<i class="fa-solid fa-${service.icon} text-3xl text-blue-600"></i>`;

        // Inject Price into Modal (create or update element)
        let priceEl = document.getElementById('modal-price');
        if (!priceEl) {
            priceEl = document.createElement('div');
            priceEl.id = 'modal-price';
            modalDesc.parentNode.insertBefore(priceEl, modalDesc);
        }
        priceEl.className = "mt-2 mb-4";
        
        let modalPriceHtml = `
            <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                <i class="fa-solid fa-tag mr-2"></i> ${service.price || 'Hubungi Kami'}
            </span>`;
            
        if (service.discount_price) {
            // Hitung Persentase (Modal)
            const parseVal = (str) => {
                let num = parseInt(str.replace(/[^0-9]/g, '')) || 0;
                if (str.toLowerCase().includes('rb')) num *= 1000;
                return num;
            };
            const original = parseVal(service.price);
            const discounted = parseVal(service.discount_price);
            let percentHtml = '';
            if (original > 0 && discounted > 0 && original > discounted) {
                const percent = Math.round(((original - discounted) / original) * 100);
                percentHtml = `<span class="ml-2 bg-white/40 px-1.5 py-0.5 rounded text-[10px] font-extrabold">-${percent}%</span>`;
            }

            modalPriceHtml = `
                <span class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-bold bg-red-50 text-red-600 border border-red-100">
                    <i class="fa-solid fa-tag mr-2"></i> <span class="line-through opacity-60 mr-2 text-xs text-red-400">${service.price}</span> ${service.discount_price} ${percentHtml}
                </span>`;
        }

        priceEl.innerHTML = modalPriceHtml;
        
        // Description
        modalDesc.className = "text-sm text-gray-600 text-left leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100";
        modalDesc.innerHTML = `
            <div class="flex gap-3">
                <i class="fa-solid fa-circle-info text-blue-500 mt-0.5 flex-shrink-0"></i>
                <div>${service.detailed_description || service.description}</div>
            </div>
        `;

        // Features
        let featuresHtml = '';
        if (service.features) {
            try {
                const features = JSON.parse(service.features);
                featuresHtml = `
                    <div class="mt-6 pt-6 border-t border-gray-100">
                        <h4 class="flex items-center gap-2 font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                            <i class="fa-solid fa-star text-amber-500"></i> Fitur Unggulan
                        </h4>
                        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                `;
                features.forEach(f => {
                    featuresHtml += `
                        <li class="flex items-start p-2.5 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
                            <div class="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
                                <i class="fa-solid fa-check text-blue-600 text-xs"></i>
                            </div>
                            <span class="text-sm text-gray-700 font-medium">${f}</span>
                        </li>
                    `;
                });
                featuresHtml += '</ul></div>';
            } catch(e) {
                console.error(e);
            }
        }
        modalFeatures.innerHTML = featuresHtml;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    function closeModal() {
        if(!modal) return;
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    if(modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if(modalOverlay) modalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // 6. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    const updateNavbar = () => {
        if (window.scrollY > 10) {
            navbar.classList.remove('bg-transparent', 'border-transparent', 'shadow-none');
            navbar.classList.add('bg-white/90', 'backdrop-blur-xl', 'border-white/40', 'shadow-2xl', 'shadow-blue-900/5');
        } else {
            navbar.classList.add('bg-transparent', 'border-transparent', 'shadow-none');
            navbar.classList.remove('bg-white/90', 'backdrop-blur-xl', 'border-white/40', 'shadow-2xl', 'shadow-blue-900/5');
        }
    };

    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // Initial check

    // 7. Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
        });

        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });
    }

    // 8. Hero Slider Logic (Dibungkus fungsi agar bisa dipanggil ulang)
    function initHeroSlider() {
        const slider = document.getElementById('hero-slider');
        const dotsContainer = document.getElementById('hero-dots');
        if (!slider || !dotsContainer) return;

        // Rebuild Dots berdasarkan jumlah slide saat ini
        const slides = Array.from(slider.children);
        const totalSlides = slides.length;
        
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${i === 0 ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-blue-400'}`;
            dot.setAttribute('data-slide', i);
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('button');
        const prevBtn = document.getElementById('prev-slide');
        const nextBtn = document.getElementById('next-slide');
        let currentSlide = 0;
        
        // Clear existing interval if any
        if (window.heroSliderInterval) clearInterval(window.heroSliderInterval);

        const goToSlide = (index) => {
            currentSlide = index;
            slider.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            dots.forEach((dot, i) => {
                if (i === currentSlide) {
                    dot.classList.remove('bg-gray-300');
                    dot.classList.add('bg-blue-600', 'w-8');
                } else {
                    dot.classList.add('bg-gray-300');
                    dot.classList.remove('bg-blue-600', 'w-8');
                }
            });

            slides.forEach((slide, i) => {
                const badge = slide.querySelector('.inline-flex');
                const title = slide.querySelector('h1');
                const desc = slide.querySelector('p.mt-3');
                const buttons = slide.querySelector('.mt-8');
                const elements = [badge, title, desc, buttons].filter(el => el);

                if (i === currentSlide) {
                    elements.forEach((el, idx) => {
                        el.style.opacity = '0';
                        el.classList.remove('animate-fade-in-up');
                        void el.offsetWidth;
                        el.style.animationDelay = `${idx * 150}ms`;
                        el.classList.add('animate-fade-in-up');
                    });
                } else {
                    elements.forEach(el => {
                        el.classList.remove('animate-fade-in-up');
                        el.style.opacity = '';
                        el.style.animationDelay = '';
                    });
                }
            });
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        };

        // Reset Event Listeners (Clone node to remove old listeners)
        if (prevBtn) {
            const newPrev = prevBtn.cloneNode(true);
            prevBtn.parentNode.replaceChild(newPrev, prevBtn);
            newPrev.addEventListener('click', () => { prevSlide(); resetInterval(); });
        }
        if (nextBtn) {
            const newNext = nextBtn.cloneNode(true);
            nextBtn.parentNode.replaceChild(newNext, nextBtn);
            newNext.addEventListener('click', () => { nextSlide(); resetInterval(); });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetInterval();
            });
        });

        const startInterval = () => {
            window.heroSliderInterval = setInterval(nextSlide, 5000);
        };

        const resetInterval = () => {
            clearInterval(window.heroSliderInterval);
            startInterval();
        };

        goToSlide(0);
        startInterval();
    }

    // 9. Animate on Scroll for Features
    const featureItems = document.querySelectorAll('.feature-item');
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation with stagger effect
                featureItems.forEach((item, index) => {
                    item.style.animationDelay = `${index * 100}ms`;
                    item.classList.remove('opacity-0');
                    item.classList.add('animate-fade-in-up');
                });
                featureObserver.disconnect(); // Stop observing after animation
            }
        });
    }, { threshold: 0.2 }); // Trigger when 20% of the section is visible

    const featuresSection = document.querySelector('.feature-item')?.closest('section');
    if (featuresSection) featureObserver.observe(featuresSection);

    // 10. Back to Top Button Logic
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('translate-y-20', 'opacity-0');
            } else {
                backToTopBtn.classList.add('translate-y-20', 'opacity-0');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 11. Reading Progress Bar Logic
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
            const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
            
            const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 12. Typewriter Effect Logic
    const typeWriterElement = document.getElementById('typewriter-text');
    if (typeWriterElement) {
        const words = ["Lebih Mudah & Cepat", "Lebih Efisien", "Lebih Profitable", "Terintegrasi"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typeWriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Lebih cepat saat menghapus
            } else {
                typeWriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal saat mengetik
            }

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 2000; // Jeda setelah selesai mengetik kata
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Jeda sebelum mengetik kata baru
            }

            setTimeout(type, typeSpeed);
        }

        // Mulai efek ketik
        type();
    }

    // 13. Language Switcher Logic
    let translations = {};

    async function loadTranslations() {
        try {
            const response = await fetch('lang/translations.json');
            if (!response.ok) throw new Error('Gagal memuat file bahasa');
            translations = await response.json();
            
            // Set bahasa setelah data dimuat
            const savedLang = localStorage.getItem('crudworks_lang') || 'id';
            setLanguage(savedLang);
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    function setLanguage(lang) {
        if (!translations[lang]) return;

        localStorage.setItem('crudworks_lang', lang);
        document.documentElement.lang = lang;
        
        // Update Text
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                el.innerText = translations[lang][key];
            }
        });

        // Update Placeholders (Input & Textarea)
        const inputs = document.querySelectorAll('[data-i18n-placeholder]');
        inputs.forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        });

        // --- Re-render Hero Slider Dinamis ---
        const heroSlider = document.getElementById('hero-slider');
        if (heroSlider && allServicesData.length > 0) {
            // Hapus slide dinamis yang sudah ada (semua setelah 4 slide statis)
            const staticSlidesCount = 4;
            const dynamicSlides = Array.from(heroSlider.children).slice(staticSlidesCount);
            dynamicSlides.forEach(slide => slide.remove());

            // Buat ulang slide dinamis dengan bahasa yang baru
            const highlightedServices = allServicesData.filter(s => s.badge);
            highlightedServices.forEach(service => {
                const slideHtml = generateSlideHtml(service);
                heroSlider.insertAdjacentHTML('beforeend', slideHtml);
            });

            // Inisialisasi ulang slider untuk memperbarui jumlah slide dan dots
            initHeroSlider();
        }
        // --- End of Re-render ---

        // Update Switcher UI
        const switchers = document.querySelectorAll('.lang-switcher');
        switchers.forEach(btn => {
            const span = btn.querySelector('span');
            const img = btn.querySelector('img');
            if(span) span.innerText = lang === 'id' ? 'ID' : 'EN';
            if(img) img.src = lang === 'id' ? 'https://flagcdn.com/w20/id.png' : 'https://flagcdn.com/w20/us.png';
        });
    }

    loadTranslations();

    document.querySelectorAll('.lang-switcher').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const current = localStorage.getItem('crudworks_lang') || 'id';
            const next = current === 'id' ? 'en' : 'id';
            setLanguage(next);
        });
    });

    // ----------------------------------------------------
    // Micro-Interaction: Scroll Reading Progress Bar
    // ----------------------------------------------------
    const scrollBar = document.getElementById('scroll-progress');
    if (scrollBar) {
        window.addEventListener('scroll', () => {
            const h = document.documentElement,
                  b = document.body,
                  st = 'scrollTop',
                  sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            scrollBar.style.width = percent + '%';
        });
    }

    // ----------------------------------------------------
    // Conversion Booster: Hero Interactive Module Switcher
    // ----------------------------------------------------
    function initHeroModuleSwitcher() {
        const tabContainer = document.getElementById('hero-mockup-tabs');
        const urlDisplay = document.getElementById('hero-mockup-url');
        const screenContainer = document.getElementById('hero-mockup-screen');
        if (!tabContainer || !urlDisplay || !screenContainer) return;

        const screens = {
            pos: {
                url: 'app.crudworks.com/pos',
                html: `
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Omset POS Hari Ini</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">Rp 28.450.000</p>
                            <span class="text-[11px] font-semibold text-emerald-600"><i class="fa-solid fa-arrow-trend-up"></i> +14.2%</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Transaksi Struk</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">342 Struk</p>
                            <span class="text-[11px] font-semibold text-blue-600">3 Kasir Aktif</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Rekap Kasir Fisik</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">Rp 12.800.000</p>
                            <span class="text-[11px] font-semibold text-slate-500">Kas Sesuai (0 Selisih)</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-4">
                        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Aktivitas Kasir Multi-Outlet</h4>
                            <span class="text-[11px] text-slate-400">Sinkronisasi Cloud</span>
                        </div>
                        <div class="space-y-2.5">
                            <div class="flex items-center justify-between text-xs">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]"><i class="fa-solid fa-cash-register"></i></div>
                                    <div>
                                        <p class="font-semibold text-slate-800">Kasir Outlet Utama</p>
                                        <p class="text-[10px] text-slate-400">Nota #CW-0941 • Pembayaran QRIS</p>
                                    </div>
                                </div>
                                <span class="font-bold text-slate-800">+ Rp 185.000</span>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]"><i class="fa-solid fa-barcode"></i></div>
                                    <div>
                                        <p class="font-semibold text-slate-800">Barcode Scanner Kasir 2</p>
                                        <p class="text-[10px] text-slate-400">Nota #CW-0940 • Tunai</p>
                                    </div>
                                </div>
                                <span class="font-bold text-slate-800">+ Rp 420.000</span>
                            </div>
                            <div class="flex items-center justify-between text-xs">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center text-[10px]"><i class="fa-solid fa-print"></i></div>
                                    <div>
                                        <p class="font-semibold text-slate-800">Cetak Struk Thermal</p>
                                        <p class="text-[10px] text-slate-400">Printer Bluetooth Kasir 1</p>
                                    </div>
                                </div>
                                <span class="font-semibold text-emerald-600">Sukses</span>
                            </div>
                        </div>
                    </div>
                `
            },
            finance: {
                url: 'app.crudworks.com/accounting',
                html: `
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Laba Bersih Bulan Ini</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">Rp 64.200.000</p>
                            <span class="text-[11px] font-semibold text-emerald-600"><i class="fa-solid fa-chart-line"></i> Margin 22.8%</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Total Piutang Usaha</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">Rp 18.500.000</p>
                            <span class="text-[11px] font-semibold text-amber-600">Jatuh Tempo: 2 Klien</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Saldo Kas & Bank</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">Rp 195.200.000</p>
                            <span class="text-[11px] font-semibold text-blue-600">Rekonsiliasi BCA/Mandiri</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-4">
                        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Jurnal Otomatis & PSAK</h4>
                            <span class="text-[11px] text-emerald-600 font-semibold"><i class="fa-solid fa-circle-check"></i> Neraca Balance</span>
                        </div>
                        <div class="space-y-2.5 text-xs">
                            <div class="flex items-center justify-between">
                                <span class="text-slate-600">Pendapatan Penjualan Toko</span>
                                <span class="font-bold text-slate-900">Rp 128.900.000 (Cr)</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-slate-600">Harga Pokok Penjualan (HPP)</span>
                                <span class="font-bold text-slate-900">Rp 74.300.000 (Dr)</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-slate-600">Biaya Operasional & Gaji</span>
                                <span class="font-bold text-slate-900">Rp 26.400.000 (Dr)</span>
                            </div>
                            <div class="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                                <span>Export Laporan: Neraca, Laba Rugi, Buku Besar</span>
                                <span class="text-blue-600 font-bold">PDF / Excel Ready</span>
                            </div>
                        </div>
                    </div>
                `
            },
            hris: {
                url: 'app.crudworks.com/hris-payroll',
                html: `
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Staf Hadir Hari Ini</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">48 / 50 Orang</p>
                            <span class="text-[11px] font-semibold text-emerald-600"><i class="fa-solid fa-location-dot"></i> 96% GPS Valid</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Pengajuan Cuti</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">2 Pending</p>
                            <span class="text-[11px] font-semibold text-blue-600">Menunggu Approval</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Periode Payroll</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">25 Nov 2026</p>
                            <span class="text-[11px] font-semibold text-slate-500">Kalkulasi Otomatis PPh 21</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-4">
                        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Aktivitas Absensi Mobile (Selfie & GPS)</h4>
                            <span class="text-[11px] text-slate-400">Geofencing Radius 50m</span>
                        </div>
                        <div class="space-y-2.5 text-xs">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">AR</div>
                                    <div>
                                        <p class="font-semibold text-slate-800">Ahmad Rizky (Kasir Utama)</p>
                                        <p class="text-[10px] text-slate-400">Check-in: 07:54 WIB • Tepat Waktu</p>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">Valid</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center">SN</div>
                                    <div>
                                        <p class="font-semibold text-slate-800">Siti Nurhaliza (Admin Gudang)</p>
                                        <p class="text-[10px] text-slate-400">Check-in: 07:58 WIB • Tepat Waktu</p>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">Valid</span>
                            </div>
                        </div>
                    </div>
                `
            },
            inventory: {
                url: 'app.crudworks.com/warehouse-wms',
                html: `
                    <div class="grid grid-cols-3 gap-3">
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Total Item Produk</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">1.482 SKU</p>
                            <span class="text-[11px] font-semibold text-blue-600">3 Lokasi Gudang</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Peringatan Stok Menipis</p>
                            <p class="text-base sm:text-lg font-bold text-amber-600 mt-1">4 Barang</p>
                            <span class="text-[11px] font-semibold text-amber-700"><i class="fa-solid fa-triangle-exclamation"></i> Reorder Segera</span>
                        </div>
                        <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                            <p class="text-[11px] font-medium text-slate-500">Akurasi Stock Opname</p>
                            <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">99.8%</p>
                            <span class="text-[11px] font-semibold text-emerald-600">Metode FIFO Sesuai</span>
                        </div>
                    </div>
                    <div class="bg-white rounded-lg border border-slate-200 p-4">
                        <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Mutasi Antar-Cabang Terkini</h4>
                            <span class="text-[11px] text-slate-400">Barcode QR Tracking</span>
                        </div>
                        <div class="space-y-2.5 text-xs">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2">
                                    <div class="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center text-[10px]"><i class="fa-solid fa-truck"></i></div>
                                    <div>
                                        <p class="font-semibold text-slate-800">Transfer Gudang Pusat &rarr; Outlet 2</p>
                                        <p class="text-[10px] text-slate-400">Surat Jalan #SJ-202 • 45 Karton</p>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold">Terkirim</span>
                            </div>
                        </div>
                    </div>
                `
            }
        };

        const buttons = tabContainer.querySelectorAll('.hero-tab-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.getAttribute('data-mockup');
                if (!screens[type]) return;

                buttons.forEach(b => {
                    b.className = 'hero-tab-btn flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-slate-600 hover:text-slate-900';
                });
                btn.className = 'hero-tab-btn flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all bg-white text-blue-600 shadow-2xs';

                urlDisplay.textContent = screens[type].url;
                screenContainer.innerHTML = screens[type].html;
            });
        });
    }

    initHeroModuleSwitcher();

    // ----------------------------------------------------
    // Contextual Consultation Modal Logic
    // ----------------------------------------------------
    function initConsultationModal() {
        const modal = document.getElementById('consultation-modal');
        const overlay = document.getElementById('consultation-modal-overlay');
        const closeBtn = document.getElementById('close-consultation-btn');
        const form = document.getElementById('consultation-form');
        if (!modal || !form) return;

        const openModal = (e) => {
            if (e) e.preventDefault();
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        // Hubungkan tombol konsultasi di hero ke modal cerdas ini
        document.querySelectorAll('a[href="#contact"]').forEach(link => {
            if (link.textContent.toLowerCase().includes('konsultasi') || link.getAttribute('data-i18n') === 'cta_start') {
                link.addEventListener('click', openModal);
            }
        });

        if (overlay) overlay.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const modul = document.getElementById('modal-modul-select').value;
            const skala = document.getElementById('modal-skala-select').value;

            const message = `Halo Tim CRUDWorks, saya tertarik untuk konsultasi implementasi software:\n` +
                `- Modul Utama: *${modul}*\n` +
                `- Skala Usaha: *${skala}*\n` +
                `Mohon informasi ketersediaan jadwal demo dan estimasi penawaran resminya.`;

            const waUrl = `https://wa.me/6287759651803?text=${encodeURIComponent(message)}`;
            window.open(waUrl, '_blank');
            closeModal();
        });
    }

    initConsultationModal();

    // ----------------------------------------------------
    // Micro-Interaction: 1-Click Copy with Tooltip
    // ----------------------------------------------------
    function initCopyClipboard() {
        document.querySelectorAll('[data-copy]').forEach(el => {
            el.addEventListener('click', async (e) => {
                e.preventDefault();
                const textToCopy = el.getAttribute('data-copy');
                if (!textToCopy) return;

                try {
                    await navigator.clipboard.writeText(textToCopy);
                    const originalText = el.getAttribute('data-original-label') || el.innerText;
                    if (!el.getAttribute('data-original-label')) {
                        el.setAttribute('data-original-label', originalText);
                    }

                    el.innerHTML = '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-check"></i> Tersalin!</span>';
                    setTimeout(() => {
                        el.innerText = originalText;
                    }, 2000);
                } catch (err) {
                    console.warn('Gagal salin clipboard:', err);
                }
            });
        });
    }

    initCopyClipboard();

    // ----------------------------------------------------
    // Interactive POS & ERP Sandbox Simulator (Poin 3)
    // ----------------------------------------------------
    function initInteractiveSimulator() {
        const itemButtons = document.querySelectorAll('.sim-item-btn');
        const cartList = document.getElementById('sim-cart-list');
        const totalPriceEl = document.getElementById('sim-total-price');
        const clearBtn = document.getElementById('sim-clear-btn');
        const payQrisBtn = document.getElementById('sim-pay-qris');
        const payCashBtn = document.getElementById('sim-pay-cash');
        const logFeed = document.getElementById('sim-log-feed');
        const metricRevenue = document.getElementById('sim-metric-revenue');
        const metricItems = document.getElementById('sim-metric-items');

        if (!itemButtons.length || !cartList || !totalPriceEl || !logFeed) return;

        let cart = [];
        let totalRevenueAcc = 0;
        let totalItemsSoldAcc = 0;
        let receiptCounter = 942;

        const updateCartUI = () => {
            if (cart.length === 0) {
                cartList.innerHTML = '<p class="text-slate-500 text-xs italic py-2">Belum ada item dipilih. Klik salah satu produk di atas.</p>';
                totalPriceEl.textContent = 'Rp 0';
                return;
            }

            let grandTotal = 0;
            cartList.innerHTML = cart.map((item, idx) => {
                const subtotal = item.price * item.qty;
                grandTotal += subtotal;
                return `
                    <div class="flex items-center justify-between text-xs py-1 border-b border-slate-800/80 last:border-0">
                        <div>
                            <span class="font-bold text-white">${item.name}</span>
                            <span class="text-slate-400 text-[11px] ml-1">x${item.qty}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-emerald-400 font-semibold">Rp ${subtotal.toLocaleString('id-ID')}</span>
                            <button type="button" class="sim-remove-item text-slate-500 hover:text-rose-400 text-[10px]" data-idx="${idx}"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                `;
            }).join('');

            totalPriceEl.textContent = 'Rp ' + grandTotal.toLocaleString('id-ID');

            // Add click listener for remove item buttons
            cartList.querySelectorAll('.sim-remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(btn.getAttribute('data-idx'));
                    if (cart[idx]) {
                        // Return stock
                        cart.splice(idx, 1);
                        updateCartUI();
                    }
                });
            });
        };

        itemButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-name');
                const price = parseInt(btn.getAttribute('data-price')) || 0;
                const stockEl = btn.querySelector('.sim-stock-val');
                let currentStock = parseInt(stockEl ? stockEl.textContent : '10') || 10;

                if (currentStock <= 0) {
                    alert('Stok barang di gudang sudah habis!');
                    return;
                }

                // Decrement visual stock
                if (stockEl) stockEl.textContent = currentStock - 1;

                // Add to cart
                const existing = cart.find(c => c.name === name);
                if (existing) {
                    existing.qty += 1;
                } else {
                    cart.push({ name, price, qty: 1 });
                }

                // Sound or visual feedback
                btn.classList.add('ring-2', 'ring-blue-500');
                setTimeout(() => btn.classList.remove('ring-2', 'ring-blue-500'), 250);

                updateCartUI();
            });
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                cart = [];
                updateCartUI();
            });
        }

        const processPayment = (methodName) => {
            if (cart.length === 0) {
                alert('Pilih minimal satu barang untuk memproses simulasi transaksi!');
                return;
            }

            let totalBelanja = 0;
            let totalUnit = 0;
            cart.forEach(c => {
                totalBelanja += c.price * c.qty;
                totalUnit += c.qty;
            });

            receiptCounter++;
            totalRevenueAcc += totalBelanja;
            totalItemsSoldAcc += totalUnit;

            const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Generate Live Virtual Receipt & Event Log
            const logHtml = `
                <div class="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/50 text-slate-300 animate-fade-in-up space-y-2">
                    <div class="flex items-center justify-between text-xs pb-1.5 border-b border-slate-800">
                        <span class="text-emerald-400 font-bold flex items-center gap-1.5">
                            <i class="fa-solid fa-circle-check"></i> Transaksi Berhasil (${methodName})
                        </span>
                        <span class="text-[10px] text-slate-400 font-mono">Nota #CW-${receiptCounter} • ${timeNow}</span>
                    </div>

                    <div class="text-[11px] space-y-1 font-mono">
                        <div class="flex justify-between text-white font-bold">
                            <span>Total Pembayaran:</span>
                            <span class="text-emerald-400">Rp ${totalBelanja.toLocaleString('id-ID')}</span>
                        </div>
                    </div>

                    <div class="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
                        <p class="text-blue-300 font-bold"><i class="fa-solid fa-arrows-rotate mr-1"></i> Otomatisasi Terpicu:</p>
                        <p>1. Stok Gudang terpotong ${totalUnit} unit secara real-time.</p>
                        <p>2. Jurnal Kas (Dr) & Pendapatan (Cr) Rp ${totalBelanja.toLocaleString('id-ID')} terposting.</p>
                        <p>3. Webhook WhatsApp mengirim struk digital ke pembeli.</p>
                    </div>
                </div>
            `;

            logFeed.innerHTML = logHtml;

            // Update Metrics
            if (metricRevenue) metricRevenue.textContent = '+ Rp ' + totalRevenueAcc.toLocaleString('id-ID');
            if (metricItems) metricItems.textContent = totalItemsSoldAcc + ' Unit Terpotong';

            // Reset cart
            cart = [];
            updateCartUI();
        };

        if (payQrisBtn) {
            payQrisBtn.addEventListener('click', () => processPayment('QRIS Instan'));
        }
        if (payCashBtn) {
            payCashBtn.addEventListener('click', () => processPayment('Tunai Kasir'));
        }
    }

    initInteractiveSimulator();

    // ----------------------------------------------------
    // Sample Reports Preview Modal Logic (Poin 3)
    // ----------------------------------------------------
    function initSampleReportsModal() {
        const modal = document.getElementById('sample-reports-modal');
        const overlay = document.getElementById('sample-modal-overlay');
        const closeBtn = document.getElementById('close-sample-modal-btn');
        const tabContainer = document.getElementById('sample-report-tabs');
        const docView = document.getElementById('sample-document-view');
        const heroTrigger = document.getElementById('btn-hero-preview-reports');

        if (!modal || !docView) return;

        const reports = {
            labarugi: `
                <div class="space-y-4">
                    <div class="text-center pb-3 border-b border-slate-300">
                        <h4 class="font-bold text-slate-900 text-sm">PT MAKMUR SEJAHTERA ABADI</h4>
                        <p class="text-xs text-slate-600">LAPORAN LABA RUGI KOMPREHENSIF (STANDAR PSAK)</p>
                        <p class="text-[11px] text-slate-500">Periode: 1 Januari 2026 s/d 31 Oktober 2026 (Mata Uang: IDR)</p>
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex justify-between font-bold text-slate-900">
                            <span>1. PENDAPATAN OPERASIONAL</span>
                            <span></span>
                        </div>
                        <div class="flex justify-between pl-4 text-slate-600">
                            <span>Penjualan Bersih Kasir & Grosir</span>
                            <span>Rp 842.500.000</span>
                        </div>
                        <div class="flex justify-between pl-4 text-slate-600">
                            <span>Pendapatan Jasa Layanan</span>
                            <span>Rp 64.000.000</span>
                        </div>
                        <div class="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                            <span>TOTAL PENDAPATAN KOTOR</span>
                            <span class="text-emerald-700">Rp 906.500.000</span>
                        </div>
                    </div>

                    <div class="space-y-1.5 pt-2">
                        <div class="flex justify-between font-bold text-slate-900">
                            <span>2. BEBAN POKOK PENJUALAN (HPP)</span>
                            <span></span>
                        </div>
                        <div class="flex justify-between pl-4 text-slate-600">
                            <span>Persediaan Awal + Pembelian Bersih</span>
                            <span>Rp 582.000.000</span>
                        </div>
                        <div class="flex justify-between pl-4 text-slate-600">
                            <span>Dikurangi: Persediaan Akhir Fisik</span>
                            <span>(Rp 114.200.000)</span>
                        </div>
                        <div class="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                            <span>TOTAL BEBAN POKOK (HPP)</span>
                            <span class="text-rose-700">(Rp 467.800.000)</span>
                        </div>
                    </div>

                    <div class="flex justify-between font-bold text-slate-900 p-2 bg-slate-200/60 rounded">
                        <span>LABA KOTOR (GROSS PROFIT)</span>
                        <span class="text-emerald-800">Rp 438.700.000</span>
                    </div>

                    <div class="space-y-1.5 pt-2">
                        <div class="flex justify-between font-bold text-slate-900">
                            <span>3. BEBAN OPERASIONAL USAHA</span>
                            <span></span>
                        </div>
                        <div class="flex justify-between pl-4 text-slate-600">
                            <span>Beban Gaji Karyawan & Tunjangan</span>
                            <span>(Rp 186.000.000)</span>
                        </div>
                        <div class="flex justify-between pl-4 text-slate-600">
                            <span>Beban Sewa Outlet, Listrik & Utilitas</span>
                            <span>(Rp 48.200.000)</span>
                        </div>
                        <div class="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                            <span>TOTAL BEBAN OPERASIONAL</span>
                            <span class="text-rose-700">(Rp 234.200.000)</span>
                        </div>
                    </div>

                    <div class="flex justify-between font-extrabold text-sm text-slate-900 p-3 bg-emerald-100/70 border border-emerald-300 rounded">
                        <span>LABA BERSIH TAHUN BERJALAN (EBIT)</span>
                        <span class="text-emerald-900">Rp 204.500.000</span>
                    </div>
                </div>
            `,
            neraca: `
                <div class="space-y-4">
                    <div class="text-center pb-3 border-b border-slate-300">
                        <h4 class="font-bold text-slate-900 text-sm">PT MAKMUR SEJAHTERA ABADI</h4>
                        <p class="text-xs text-slate-600">LAPORAN POSISI KEUANGAN (NERACA SALDO)</p>
                        <p class="text-[11px] text-slate-500">Per 31 Oktober 2026 (Mata Uang: IDR)</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <!-- Aset -->
                        <div class="space-y-2">
                            <h5 class="font-bold text-slate-900 border-b border-slate-300 pb-1">ASET (AKTIVA)</h5>
                            <div class="flex justify-between text-slate-600"><span>Kas di Kasir Toko</span><span>Rp 18.450.000</span></div>
                            <div class="flex justify-between text-slate-600"><span>Bank BCA Operasional</span><span>Rp 142.300.000</span></div>
                            <div class="flex justify-between text-slate-600"><span>Piutang Usaha Pelanggan</span><span>Rp 38.600.000</span></div>
                            <div class="flex justify-between text-slate-600"><span>Persediaan Barang Dagang</span><span>Rp 114.200.000</span></div>
                            <div class="flex justify-between text-slate-600"><span>Aset Peralatan & Mesin</span><span>Rp 85.000.000</span></div>
                            <div class="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-300">
                                <span>TOTAL ASET</span>
                                <span class="text-emerald-700">Rp 398.550.000</span>
                            </div>
                        </div>

                        <!-- Liabilitas & Ekuitas -->
                        <div class="space-y-2">
                            <h5 class="font-bold text-slate-900 border-b border-slate-300 pb-1">LIABILITAS & EKUITAS (PASIVA)</h5>
                            <div class="flex justify-between text-slate-600"><span>Utang Usaha Supplier</span><span>Rp 42.150.000</span></div>
                            <div class="flex justify-between text-slate-600"><span>Utang Gaji & Pajak PPh 21</span><span>Rp 11.900.000</span></div>
                            <div class="flex justify-between text-slate-600"><span>Modal Disetor Pemilik</span><span>Rp 140.000.000</span></div>
                            <div class="flex justify-between text-slate-600"><span>Laba Ditahan</span><span>Rp 204.500.000</span></div>
                            <div class="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-300">
                                <span>TOTAL PASIVA</span>
                                <span class="text-emerald-700">Rp 398.550.000</span>
                            </div>
                        </div>
                    </div>

                    <div class="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-center text-xs font-bold text-emerald-800">
                        <i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> STATUS: NERACA SEIMBANG (BALANCE Rp 398.550.000)
                    </div>
                </div>
            `,
            struk: `
                <div class="max-w-xs mx-auto bg-white p-5 rounded-lg border border-slate-300 shadow-sm font-mono text-[11px] text-slate-800 space-y-2">
                    <div class="text-center pb-2 border-b border-dashed border-slate-300">
                        <p class="font-bold text-sm">CRUDWORKS STORE #01</p>
                        <p class="text-[10px] text-slate-500">Jl. Pandanwangi 21, Kota Malang</p>
                        <p class="text-[10px] text-slate-500">Telp: 0877-5965-1803</p>
                    </div>

                    <div class="space-y-1 border-b border-dashed border-slate-300 pb-2 text-[10px]">
                        <div class="flex justify-between"><span>No: CW-2026-1049</span><span>28/10/2026 14:22</span></div>
                        <div class="flex justify-between"><span>Kasir: Cindy K.</span><span>Pelanggan: Umum</span></div>
                    </div>

                    <div class="space-y-1.5 py-1">
                        <div>
                            <p class="font-bold">Kopi Espresso Blend 1kg</p>
                            <div class="flex justify-between text-slate-500"><span>2 x Rp 180.000</span><span>Rp 360.000</span></div>
                        </div>
                        <div>
                            <p class="font-bold">Sirup Karamel 750ml</p>
                            <div class="flex justify-between text-slate-500"><span>1 x Rp 125.000</span><span>Rp 125.000</span></div>
                        </div>
                    </div>

                    <div class="border-t border-dashed border-slate-300 pt-2 space-y-1">
                        <div class="flex justify-between"><span>Subtotal</span><span>Rp 485.000</span></div>
                        <div class="flex justify-between"><span>Diskon Member</span><span>(Rp 25.000)</span></div>
                        <div class="flex justify-between font-bold text-xs pt-1 border-t border-slate-200"><span>TOTAL BAYAR</span><span>Rp 460.000</span></div>
                        <div class="flex justify-between text-[10px]"><span>Metode: QRIS BCA</span><span>LUNAS</span></div>
                    </div>

                    <div class="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                        <p>Terima Kasih Atas Kunjungan Anda</p>
                        <p class="text-[9px] mt-1 text-slate-400">Powered by CRUDWorks Cloud POS</p>
                    </div>
                </div>
            `
        };

        const renderTab = (tabKey) => {
            if (!reports[tabKey]) return;
            docView.innerHTML = reports[tabKey];

            if (tabContainer) {
                tabContainer.querySelectorAll('.sample-tab-btn').forEach(btn => {
                    if (btn.getAttribute('data-tab') === tabKey) {
                        btn.className = 'sample-tab-btn flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all bg-white text-blue-600 shadow-2xs';
                    } else {
                        btn.className = 'sample-tab-btn flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all text-slate-600 hover:text-slate-900';
                    }
                });
            }
        };

        const openModal = () => {
            renderTab('labarugi');
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        };

        if (heroTrigger) heroTrigger.addEventListener('click', openModal);
        if (overlay) overlay.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        if (tabContainer) {
            tabContainer.querySelectorAll('.sample-tab-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    renderTab(btn.getAttribute('data-tab'));
                });
            });
        }
    }

    initSampleReportsModal();

    // ==========================================
    // HERO DEVICE FRAME SWITCHER (RESPONSIVE PREVIEW)
    // ==========================================
    function initDeviceFrameSwitcher() {
        const switcher = document.getElementById('hero-device-switcher');
        const container = document.getElementById('hero-device-container');
        if (!switcher || !container) return;

        let currentDevice = 'desktop';

        // State untuk Tablet POS micro-interaction
        let tabletCartTotal = 305000;
        let tabletCartCount = 2;

        // State untuk Mobile micro-interaction
        let mobileApproved = false;

        const deviceTemplates = {
            desktop: () => `
                <div id="hero-device-viewport" class="w-full max-w-lg mx-auto bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden transition-all duration-300 ease-in-out">
                    <!-- Window Title Bar -->
                    <div class="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <div class="w-3 h-3 rounded-full bg-rose-400"></div>
                            <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                            <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span class="ml-2 text-xs font-mono text-slate-500">app.crudworks.com/dashboard</span>
                        </div>
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            Sistem Online
                        </span>
                    </div>

                    <!-- Dashboard Inner Content -->
                    <div class="p-5 bg-slate-50/50 space-y-4">
                        <!-- Top Stats Row -->
                        <div class="grid grid-cols-3 gap-3">
                            <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                                <p class="text-[11px] font-medium text-slate-500">Omset Hari Ini</p>
                                <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">Rp 28.450.000</p>
                                <span class="text-[11px] font-semibold text-emerald-600"><i class="fa-solid fa-arrow-trend-up"></i> +14.2%</span>
                            </div>
                            <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                                <p class="text-[11px] font-medium text-slate-500">Transaksi POS</p>
                                <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">342 Struk</p>
                                <span class="text-[11px] font-semibold text-blue-600">3 Cabang Aktif</span>
                            </div>
                            <div class="bg-white p-3.5 rounded-lg border border-slate-200">
                                <p class="text-[11px] font-medium text-slate-500">Saldo Kas & Bank</p>
                                <p class="text-base sm:text-lg font-bold text-slate-900 mt-1">Rp 195.200.000</p>
                                <span class="text-[11px] font-semibold text-slate-500">Rekonsiliasi OK</span>
                            </div>
                        </div>

                        <!-- Live Activity Feed -->
                        <div class="bg-white rounded-lg border border-slate-200 p-4">
                            <div class="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">Aktivitas Terkini Multi-Outlet</h4>
                                <span class="text-[11px] text-slate-400">Sinkronisasi Real-Time</span>
                            </div>
                            <div class="space-y-2.5">
                                <div class="flex items-center justify-between text-xs">
                                    <div class="flex items-center gap-2">
                                        <div class="w-6 h-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[10px]">
                                            <i class="fa-solid fa-cash-register"></i>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-slate-800">Kasir Outlet Utama</p>
                                            <p class="text-[10px] text-slate-400">Nota #CW-0941 • Metode QRIS</p>
                                        </div>
                                    </div>
                                    <span class="font-bold text-slate-800">+ Rp 185.000</span>
                                </div>
                                <div class="flex items-center justify-between text-xs">
                                    <div class="flex items-center gap-2">
                                        <div class="w-6 h-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px]">
                                            <i class="fa-solid fa-file-invoice"></i>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-slate-800">Pelunasan Faktur Grosir</p>
                                            <p class="text-[10px] text-slate-400">CV Pandanwangi Mandiri</p>
                                        </div>
                                    </div>
                                    <span class="font-bold text-emerald-700">+ Rp 8.500.000</span>
                                </div>
                                <div class="flex items-center justify-between text-xs">
                                    <div class="flex items-center gap-2">
                                        <div class="w-6 h-6 rounded bg-purple-50 text-purple-600 flex items-center justify-center text-[10px]">
                                            <i class="fa-solid fa-users-gear"></i>
                                        </div>
                                        <div>
                                            <p class="font-semibold text-slate-800">Absensi Karyawan Harian</p>
                                            <p class="text-[10px] text-slate-400">28/28 Karyawan Masuk Tepat Waktu</p>
                                        </div>
                                    </div>
                                    <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">100% Hadir</span>
                                </div>
                            </div>
                        </div>

                        <!-- Security & Infrastructure Notice -->
                        <div class="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                            <span class="flex items-center gap-1.5"><i class="fa-solid fa-lock text-slate-400"></i> Enkripsi SSL 256-Bit</span>
                            <span class="flex items-center gap-1.5"><i class="fa-solid fa-cloud-arrow-up text-slate-400"></i> Backup Cloud Harian</span>
                        </div>
                    </div>
                </div>
            `,
            tablet: () => `
                <div id="hero-device-viewport" class="w-full max-w-[480px] mx-auto bg-slate-900 rounded-2xl p-3 shadow-2xl border-4 border-slate-800 transition-all duration-300 ease-in-out">
                    <!-- Tablet Screen Bezel & Top Camera Dot -->
                    <div class="flex items-center justify-center pb-2">
                        <div class="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600"></div>
                    </div>

                    <!-- Tablet Inner Screen -->
                    <div class="bg-white rounded-xl overflow-hidden shadow-inner text-slate-800">
                        <!-- POS Top Bar -->
                        <div class="bg-slate-800 text-white px-3.5 py-2.5 flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span class="font-bold">POS KASIR #01</span>
                                <span class="text-slate-400 text-[10px] hidden sm:inline">| Cindy K.</span>
                            </div>
                            <div class="flex items-center gap-3 text-[10px]">
                                <span class="text-emerald-300 flex items-center gap-1"><i class="fa-solid fa-print"></i> Printer OK</span>
                                <span class="text-blue-300 flex items-center gap-1"><i class="fa-solid fa-barcode"></i> Scanner OK</span>
                            </div>
                        </div>

                        <!-- POS Workspace Grid -->
                        <div class="p-3 bg-slate-50 grid grid-cols-12 gap-2.5">
                            <!-- Quick Menu Buttons (Touch Items) -->
                            <div class="col-span-7 space-y-2">
                                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sentuh Menu Tambah:</p>
                                <div class="grid grid-cols-2 gap-1.5" id="tablet-pos-items">
                                    <button type="button" class="tablet-item-btn p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group" data-name="Espresso" data-price="25000">
                                        <p class="font-bold text-[11px] text-slate-800 group-hover:text-blue-600 leading-tight">Espresso</p>
                                        <p class="text-[10px] text-blue-600 font-semibold mt-0.5">Rp 25.000</p>
                                    </button>
                                    <button type="button" class="tablet-item-btn p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group" data-name="Latte" data-price="32000">
                                        <p class="font-bold text-[11px] text-slate-800 group-hover:text-blue-600 leading-tight">Latte</p>
                                        <p class="text-[10px] text-blue-600 font-semibold mt-0.5">Rp 32.000</p>
                                    </button>
                                    <button type="button" class="tablet-item-btn p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group" data-name="Croissant" data-price="28000">
                                        <p class="font-bold text-[11px] text-slate-800 group-hover:text-blue-600 leading-tight">Croissant</p>
                                        <p class="text-[10px] text-blue-600 font-semibold mt-0.5">Rp 28.000</p>
                                    </button>
                                    <button type="button" class="tablet-item-btn p-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-left transition-all group" data-name="Matcha" data-price="29000">
                                        <p class="font-bold text-[11px] text-slate-800 group-hover:text-blue-600 leading-tight">Matcha</p>
                                        <p class="text-[10px] text-blue-600 font-semibold mt-0.5">Rp 29.000</p>
                                    </button>
                                </div>
                                <div class="p-1.5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-between text-[10px] text-blue-700">
                                    <span><i class="fa-solid fa-bolt mr-1"></i> Mode Kasir Cepat</span>
                                </div>
                            </div>

                            <!-- Cart Panel (Right Side) -->
                            <div class="col-span-5 bg-white p-2.5 rounded-lg border border-slate-200 flex flex-col justify-between">
                                <div>
                                    <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 text-[11px]">
                                        <span class="font-bold text-slate-700">Struk Aktif</span>
                                        <span id="tablet-item-badge" class="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold text-[9px]">${tabletCartCount} Item</span>
                                    </div>
                                    <div class="py-2 space-y-1 text-[10px] text-slate-600" id="tablet-cart-preview">
                                        <div class="flex justify-between"><span>Espresso Blend</span><span class="font-medium">Rp 180.000</span></div>
                                        <div class="flex justify-between"><span>Sirup Karamel</span><span class="font-medium">Rp 125.000</span></div>
                                    </div>
                                </div>

                                <div class="pt-2 border-t border-dashed border-slate-200 space-y-2">
                                    <div class="flex justify-between items-baseline">
                                        <span class="text-[10px] text-slate-500 font-medium">Total:</span>
                                        <span id="tablet-cart-total" class="font-extrabold text-xs text-slate-900">Rp ${tabletCartTotal.toLocaleString('id-ID')}</span>
                                    </div>
                                    <button type="button" id="btn-tablet-checkout" class="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-1">
                                        <i class="fa-solid fa-qrcode text-[9px]"></i>
                                        <span>Bayar Cepat</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Status bar bottom -->
                        <div class="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                            <span><i class="fa-solid fa-tablet text-slate-400 mr-1"></i> Layar Sentuh Tablet 10"</span>
                            <span class="text-emerald-700 font-medium">Baterai 100%</span>
                        </div>
                    </div>
                </div>
            `,
            mobile: () => `
                <div id="hero-device-viewport" class="w-full max-w-[310px] mx-auto bg-slate-900 rounded-[38px] p-2.5 shadow-2xl border-4 border-slate-800 transition-all duration-300 ease-in-out">
                    <!-- Dynamic Island & Camera Notch -->
                    <div class="flex items-center justify-between px-4 pt-1 pb-2">
                        <span class="text-[10px] font-bold text-white tracking-tight">09:41</span>
                        <div class="w-20 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-1.5 border border-slate-800">
                            <div class="w-2 h-2 rounded-full bg-blue-500/80"></div>
                            <div class="w-1.5 h-1.5 rounded-full bg-slate-700"></div>
                        </div>
                        <div class="flex items-center gap-1 text-[9px] text-white">
                            <i class="fa-solid fa-signal"></i>
                            <i class="fa-solid fa-wifi"></i>
                            <i class="fa-solid fa-battery-full text-emerald-400"></i>
                        </div>
                    </div>

                    <!-- Mobile Screen Inner -->
                    <div class="bg-slate-50 rounded-[28px] overflow-hidden text-slate-800 p-3.5 space-y-3 min-h-[420px] flex flex-col justify-between shadow-inner">
                        <div class="space-y-3">
                            <!-- Mobile Header -->
                            <div class="flex items-center justify-between pb-2 border-b border-slate-200/80">
                                <div class="flex items-center gap-2">
                                    <div class="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                                        CW
                                    </div>
                                    <div>
                                        <p class="text-[11px] font-bold text-slate-900 leading-tight">CRUDWorks Mobile</p>
                                        <p class="text-[9px] text-slate-500">Owner Dashboard</p>
                                    </div>
                                </div>
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                    Live
                                </span>
                            </div>

                            <!-- Mobile Omset Card -->
                            <div class="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white shadow-md">
                                <div class="flex justify-between items-start">
                                    <div>
                                        <p class="text-[10px] text-blue-100 font-medium">Omset Hari Ini</p>
                                        <p class="text-base font-black tracking-tight mt-0.5">Rp 28.450.000</p>
                                    </div>
                                    <span class="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold">+14.2%</span>
                                </div>
                                <div class="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[9px] text-blue-100">
                                    <span>3 Cabang Terhubung</span>
                                    <span>Target: 94.8%</span>
                                </div>
                            </div>

                            <!-- Real-time Push Alert Card -->
                            <div class="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs flex items-start gap-2.5">
                                <div class="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                                    <i class="fa-solid fa-bell"></i>
                                </div>
                                <div class="text-[10px]">
                                    <p class="font-bold text-slate-800">Penjualan Kasir Baru</p>
                                    <p class="text-slate-500 mt-0.5">Kasir Malang #02 • QRIS Rp 185.000</p>
                                    <span class="text-[9px] text-slate-400">1 menit yang lalu</span>
                                </div>
                            </div>

                            <!-- Quick Executive Approval -->
                            <div class="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/90 text-[10px]">
                                <div class="flex items-center justify-between mb-1.5">
                                    <span class="font-bold text-amber-900 flex items-center gap-1">
                                        <i class="fa-solid fa-clock-rotate-left"></i> Permintaan Approval
                                    </span>
                                    <span class="text-[9px] text-amber-700 font-semibold">1 Menunggu</span>
                                </div>
                                <p class="text-slate-600 text-[10px] mb-2 leading-tight">Diskon Member 10% Nota #CW-0945 (Rp 45.000)</p>
                                <button type="button" id="btn-mobile-approve" class="w-full py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 ${mobileApproved ? 'bg-emerald-600 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}">
                                    <i class="fa-solid ${mobileApproved ? 'fa-circle-check' : 'fa-check'}"></i>
                                    <span>${mobileApproved ? 'Telah Disetujui ✓' : 'Setujui Diskon Sekarang'}</span>
                                </button>
                            </div>
                        </div>

                        <!-- Mobile Bottom Navigation Bar -->
                        <div class="pt-2 border-t border-slate-200/80 flex items-center justify-around text-slate-400 text-[9px]">
                            <div class="flex flex-col items-center text-blue-600 font-bold">
                                <i class="fa-solid fa-chart-pie text-xs mb-0.5"></i>
                                <span>Ringkasan</span>
                            </div>
                            <div class="flex flex-col items-center hover:text-slate-600">
                                <i class="fa-solid fa-store text-xs mb-0.5"></i>
                                <span>Toko</span>
                            </div>
                            <div class="flex flex-col items-center hover:text-slate-600">
                                <i class="fa-solid fa-receipt text-xs mb-0.5"></i>
                                <span>Laporan</span>
                            </div>
                            <div class="flex flex-col items-center hover:text-slate-600">
                                <i class="fa-solid fa-user-tie text-xs mb-0.5"></i>
                                <span>Akun</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        };

        const renderDevice = (deviceKey) => {
            if (!deviceTemplates[deviceKey]) return;
            currentDevice = deviceKey;

            // Update button styles
            switcher.querySelectorAll('.hero-device-btn').forEach(btn => {
                const target = btn.getAttribute('data-device');
                if (target === deviceKey) {
                    btn.className = 'hero-device-btn px-3 py-1.5 rounded-lg font-semibold transition-all bg-white text-blue-700 shadow-sm flex items-center gap-1.5';
                } else {
                    btn.className = 'hero-device-btn px-3 py-1.5 rounded-lg font-semibold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-1.5';
                }
            });

            // Fade transition
            container.style.opacity = '0';
            container.style.transform = 'scale(0.98)';
            setTimeout(() => {
                container.innerHTML = deviceTemplates[deviceKey]();
                container.style.opacity = '1';
                container.style.transform = 'scale(1)';

                // Pasang event listener interaktif spesifik untuk device terpilih
                bindDeviceInteractions(deviceKey);
            }, 150);
        };

        const bindDeviceInteractions = (deviceKey) => {
            if (deviceKey === 'tablet') {
                const itemButtons = container.querySelectorAll('.tablet-item-btn');
                const cartPreview = container.querySelector('#tablet-cart-preview');
                const totalDisplay = container.querySelector('#tablet-cart-total');
                const badgeDisplay = container.querySelector('#tablet-item-badge');
                const checkoutBtn = container.querySelector('#btn-tablet-checkout');

                itemButtons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const name = btn.getAttribute('data-name');
                        const price = parseInt(btn.getAttribute('data-price') || '0', 10);
                        tabletCartTotal += price;
                        tabletCartCount += 1;

                        if (totalDisplay) totalDisplay.textContent = `Rp ${tabletCartTotal.toLocaleString('id-ID')}`;
                        if (badgeDisplay) badgeDisplay.textContent = `${tabletCartCount} Item`;

                        if (cartPreview) {
                            const newRow = document.createElement('div');
                            newRow.className = 'flex justify-between text-blue-600 font-semibold animate-pulse';
                            newRow.innerHTML = `<span>+ ${name}</span><span>Rp ${price.toLocaleString('id-ID')}</span>`;
                            cartPreview.prepend(newRow);
                        }
                    });
                });

                if (checkoutBtn) {
                    checkoutBtn.addEventListener('click', () => {
                        checkoutBtn.innerHTML = '<i class="fa-solid fa-check text-xs"></i><span>Struk Dicetak!</span>';
                        checkoutBtn.className = 'w-full py-1.5 bg-slate-800 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-1';
                        setTimeout(() => {
                            checkoutBtn.innerHTML = '<i class="fa-solid fa-qrcode text-[9px]"></i><span>Bayar Cepat</span>';
                            checkoutBtn.className = 'w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-1';
                        }, 1800);
                    });
                }
            } else if (deviceKey === 'mobile') {
                const approveBtn = container.querySelector('#btn-mobile-approve');
                if (approveBtn) {
                    approveBtn.addEventListener('click', () => {
                        mobileApproved = !mobileApproved;
                        if (mobileApproved) {
                            approveBtn.className = 'w-full py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 bg-emerald-600 text-white';
                            approveBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Telah Disetujui ✓</span>';
                        } else {
                            approveBtn.className = 'w-full py-1.5 rounded-lg font-bold text-[10px] transition-all flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white';
                            approveBtn.innerHTML = '<i class="fa-solid fa-check"></i><span>Setujui Diskon Sekarang</span>';
                        }
                    });
                }
            }
        };

        switcher.querySelectorAll('.hero-device-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const dev = btn.getAttribute('data-device');
                if (dev && dev !== currentDevice) {
                    renderDevice(dev);
                }
            });
        });

        bindDeviceInteractions('desktop');
    }

    initDeviceFrameSwitcher();

    // ==========================================
    // POIN 5: LIVE SYSTEM TELEMETRY CLOCK
    // ==========================================
    function initTelemetryLiveClock() {
        const clockEl = document.getElementById('telemetry-live-clock');
        if (!clockEl) return;
        const update = () => {
            const now = new Date();
            const hrs = String(now.getHours()).padStart(2, '0');
            const mins = String(now.getMinutes()).padStart(2, '0');
            const secs = String(now.getSeconds()).padStart(2, '0');
            clockEl.textContent = `${hrs}:${mins}:${secs} WIB`;
        };
        update();
        setInterval(update, 1000);
    }
    initTelemetryLiveClock();

    // ==========================================
    // POIN 1: UNIFIED HERO MODULE SWITCHER
    // ==========================================
    function initUnifiedHeroModuleSwitcher() {
        const tabsContainer = document.getElementById('hero-module-tabs');
        const badgeText = document.getElementById('hero-module-badge-text');
        const title = document.getElementById('hero-module-title');
        const desc = document.getElementById('hero-module-desc');
        const cta = document.getElementById('hero-module-cta');
        const checklist = document.getElementById('hero-module-checklist');
        const contentBox = document.getElementById('hero-module-content');
        if (!tabsContainer || !title) return;

        const moduleData = {
            retail: {
                badge: 'Sistem Retail, Kasir & Multi-Cabang',
                titleHtml: `<span>Bebaskan Bisnis Anda dari</span> <br class="hidden lg:block"><span class="text-blue-600">Kerumitan Nota Manual & Selisih Stok</span>`,
                desc: 'Kelola kasir multi-cabang, tutup buku keuangan otomatis, dan pantau stok hingga ke rak gudang. Praktis digunakan staf tanpa perlu keahlian IT rumit.',
                ctaText: 'Mulai Konsultasi Modul',
                ctaHref: '#contact',
                checklist: [
                    'Teruji di Puluhan UMKM',
                    'Didukung Tim Teknis Malang',
                    'Siap Pakai & Mudah Dipahami'
                ]
            },
            finance: {
                badge: 'Pembukuan & Finansial Standar PSAK',
                titleHtml: `<span>Laporan Keuangan Rapi &</span> <br class="hidden lg:block"><span class="text-emerald-600">Siap Lapor Pajak Tanpa Menunggu Akhir Bulan</span>`,
                desc: 'Jurnal kas, neraca, piutang tempo, dan laba rugi terupdate otomatis setiap kali kasir mencetak nota. Tutup buku bulanan selesai hanya dalam hitungan menit.',
                ctaText: 'Konsultasi Modul Keuangan',
                ctaHref: '#contact',
                checklist: [
                    'Format Ekspor Kompatibel Excel & PDF',
                    'Rekonsiliasi Bank & QRIS Otomatis',
                    'Aman & Siap Audit Keuangan'
                ]
            },
            hr: {
                badge: 'Manajemen SDM & Penggajian Karyawan',
                titleHtml: `<span>Automasi Absensi GPS & Slip Gaji</span> <br class="hidden lg:block"><span class="text-purple-600">Tepat Waktu, Akurat & Bebas Titip Absen</span>`,
                desc: 'Kurangi beban lembur akhir bulan HR. Hitung gaji pokok, tunjangan, potongan BPJS Ketenagakerjaan, dan PPh 21 otomatis dari data absensi selfie smartphone.',
                ctaText: 'Konsultasi Modul HR & Payroll',
                ctaHref: '#contact',
                checklist: [
                    'Geofence GPS Radius 20 Meter',
                    'Akses Slip Gaji via HP Staf',
                    'Siap Ekspor Format Transfer Bank'
                ]
            },
            custom: {
                badge: 'Software Kustom & Integrasi API',
                titleHtml: `<span>Software Manajemen Khusus yang</span> <br class="hidden lg:block"><span class="text-amber-600">Menyesuaikan Alur Kerja Unik Bisnis Anda</span>`,
                desc: 'Punya proses operasional unik di koperasi, pabrik perakitan, atau ritel grosir? Tim developer lokal kami di Malang siap membuat fitur khusus sesuai kebutuhan nyata.',
                ctaText: 'Diskusikan Kebutuhan Khusus',
                ctaHref: '#contact',
                checklist: [
                    'Analisis Kebutuhan Bisnis Gratis',
                    'Integrasi API & Database Existing',
                    'Garansi & Maintenance Teknis'
                ]
            }
        };

        tabsContainer.querySelectorAll('.hero-module-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modKey = btn.getAttribute('data-module');
                const data = moduleData[modKey];
                if (!data) return;

                tabsContainer.querySelectorAll('.hero-module-btn').forEach(b => {
                    b.className = 'hero-module-btn px-4 py-2 rounded-xl font-semibold transition-all text-slate-600 hover:text-slate-900 flex items-center gap-2 flex-shrink-0';
                });
                btn.className = 'hero-module-btn px-4 py-2 rounded-xl font-bold transition-all bg-white text-blue-700 shadow-sm flex items-center gap-2 flex-shrink-0';

                if (contentBox) {
                    contentBox.style.opacity = '0';
                    contentBox.style.transform = 'translateY(6px)';
                    setTimeout(() => {
                        if (badgeText) badgeText.textContent = data.badge;
                        if (title) title.innerHTML = data.titleHtml;
                        if (desc) desc.textContent = data.desc;
                        if (cta) {
                            cta.innerHTML = `<span>${data.ctaText}</span><i class="fa-solid fa-arrow-right text-xs"></i>`;
                            cta.setAttribute('href', data.ctaHref);
                        }
                        if (checklist) {
                            checklist.innerHTML = data.checklist.map((item, idx) => `
                                <span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600"></i> ${item}</span>
                                ${idx < data.checklist.length - 1 ? '<span class="text-slate-300">•</span>' : ''}
                            `).join('');
                        }
                        contentBox.style.opacity = '1';
                        contentBox.style.transform = 'translateY(0)';
                    }, 150);
                }
            });
        });
    }
    initUnifiedHeroModuleSwitcher();

    // ==========================================
    // POIN 2: INTERACTIVE ROI & COST SAVING CALCULATOR
    // ==========================================
    function initRoiCalculator() {
        const branchesSlider = document.getElementById('roi-branches');
        const branchesVal = document.getElementById('roi-branches-val');
        const trxSlider = document.getElementById('roi-transactions');
        const trxVal = document.getElementById('roi-transactions-val');
        const hoursSavedEl = document.getElementById('roi-hours-saved');
        const leakagePreventedEl = document.getElementById('roi-leakage-prevented');
        const waCta = document.getElementById('roi-whatsapp-cta');
        const typeButtons = document.querySelectorAll('.roi-type-btn');

        if (!branchesSlider || !trxSlider) return;

        let selectedType = 'retail';
        const typeNames = {
            retail: 'Toko Retail',
            fnb: 'Kafe / F&B',
            grosir: 'Grosir B2B'
        };

        const typeMultipliers = {
            retail: 1.0,
            fnb: 1.15,
            grosir: 1.25
        };

        const calculateRoi = () => {
            const branches = parseInt(branchesSlider.value, 10) || 1;
            const trx = parseInt(trxSlider.value, 10) || 30;
            const mult = typeMultipliers[selectedType] || 1.0;

            if (branchesVal) branchesVal.textContent = `${branches} Cabang`;
            if (trxVal) trxVal.textContent = `${trx} Transaksi`;

            const baseHours = Math.round(branches * 18 * (trx / 100) * mult);
            const hoursSaved = Math.max(12, baseHours);

            const baseMoney = Math.round(branches * 1500000 * (trx / 100) * mult);
            const roundedMoney = Math.round(baseMoney / 100000) * 100000;

            if (hoursSavedEl) hoursSavedEl.textContent = `~${hoursSaved} Jam`;
            if (leakagePreventedEl) leakagePreventedEl.textContent = `± Rp ${roundedMoney.toLocaleString('id-ID')}`;

            if (waCta) {
                const typeLabel = typeNames[selectedType] || 'Bisnis';
                const message = `Halo Tim CRUDWorks, saya sudah mencoba simulasi Kalkulator Efisiensi untuk ${branches} cabang usaha tipe ${typeLabel} dengan rata-rata ${trx} transaksi/hari. Saya tertarik konsultasi demo sistem untuk mencapai estimasi hemat waktu ~${hoursSaved} jam/bulan ini.`;
                waCta.setAttribute('href', `https://wa.me/6287759651803?text=${encodeURIComponent(message)}`);
            }
        };

        branchesSlider.addEventListener('input', calculateRoi);
        trxSlider.addEventListener('input', calculateRoi);

        typeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                selectedType = btn.getAttribute('data-type');
                typeButtons.forEach(b => {
                    b.className = 'roi-type-btn px-3 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 text-slate-600 font-semibold text-xs text-center transition-all flex flex-col items-center gap-1';
                });
                btn.className = 'roi-type-btn active px-3 py-2.5 rounded-xl border border-blue-500 bg-blue-50 text-blue-700 font-bold text-xs text-center transition-all shadow-xs flex flex-col items-center gap-1';
                calculateRoi();
            });
        });

        calculateRoi();
    }
    initRoiCalculator();

});
