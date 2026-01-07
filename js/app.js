document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'api/index.php';

    // 1. Fungsi Fetch Data Services (GET)
    let allServicesData = []; // Simpan data global untuk filtering

    async function loadServices() {
        const container = document.getElementById('services-container');
        if (!container) return; // Mencegah error di halaman lain (misal: tentang.html)
        
        try {
            const response = await fetch(`${API_URL}?endpoint=services`);
            if (!response.ok) throw new Error('Gagal mengambil data');
            
            allServicesData = await response.json();

            // Mengurutkan produk agar alurnya lebih menarik bagi pembaca
            const priorityOrder = [
                'Aplikasi Retail',      // Operasional (POS) biasanya paling menarik visualnya
                'Laporan Keuangan',     // Fundamental bisnis
                'Sistem HR & Payroll',  // Manajemen tim
                'Aplikasi Membership',  // Growth & Marketing
                'Manajemen Koperasi',   // Niche specific
                'Custom By Requirement' // Solusi fleksibel (terakhir)
            ];

            allServicesData.sort((a, b) => {
                const idxA = priorityOrder.indexOf(a.title);
                const idxB = priorityOrder.indexOf(b.title);
                return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
            });

            renderServices(allServicesData); // Render awal semua data
            
            // --- FITUR BARU: Tambahkan Produk Best Seller/Promo ke Slider ---
            const heroSlider = document.getElementById('hero-slider');
            if (heroSlider) {
                // Filter produk yang punya badge
                const highlightedServices = allServicesData.filter(s => s.badge);
                
                // Buat slide untuk setiap produk
                highlightedServices.forEach(service => {
                    const slideHtml = generateSlideHtml(service);
                    // Sisipkan setelah slide pertama (agar slide intro tetap di awal)
                    heroSlider.insertAdjacentHTML('beforeend', slideHtml);
                });
            }

        } catch (error) {
            container.innerHTML = `<p class="text-red-500 text-center col-span-3">Gagal memuat layanan. Pastikan API berjalan.</p>`;
            console.error(error);
        }
        finally {
            // Inisialisasi Slider setelah data dimuat (baik sukses maupun gagal)
            initHeroSlider();
        }
    }

    // Helper: Generate HTML untuk Slide Dinamis
    function generateSlideHtml(service) {
        const lang = localStorage.getItem('crudworks_lang') || 'id';
        const t = translations[lang] || translations.id;

        // Fallback text untuk mencegah undefined jika key tidak ada di JSON
        const txt_save = t.slider_save || (lang === 'id' ? 'Hemat' : 'Save');
        const txt_offer = t.slider_offer || (lang === 'id' ? 'Penawaran Spesial' : 'Special Offer');
        const txt_best_price = t.slider_best_price || (lang === 'id' ? 'Harga Terbaik' : 'Best Price');
        const txt_view = t.slider_view_details || (lang === 'id' ? 'Lihat Detail' : 'View Details');
        const txt_ask = t.slider_ask_admin || (lang === 'id' ? 'Tanya Admin' : 'Ask Admin');
        const txt_avail = t.slider_available_now || (lang === 'id' ? 'Tersedia Sekarang' : 'Available Now');

        // Mapping gambar berdasarkan kategori (bisa disesuaikan)
        const images = {
            'finance': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'hr': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'operational': 'https://images.unsplash.com/photo-1556740758-90de374c12ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            'default': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        };
        const imgUrl = images[service.category] || images['default'];

        // Warna Badge
        let badgeColor = 'bg-blue-50 text-blue-600 border-blue-100';
        let dotColor = 'bg-blue-500';
        if (service.badge.toLowerCase() === 'best seller') {
            badgeColor = 'bg-amber-50 text-amber-600 border-amber-100';
            dotColor = 'bg-amber-500';
        } else if (service.badge.toLowerCase() === 'promo') {
            badgeColor = 'bg-rose-50 text-rose-600 border-rose-100';
            dotColor = 'bg-rose-500';
        }

        // Logic Tampilan Harga di Slider
        let priceDisplayHtml = '';
        if (service.discount_price) {
            // Hitung Persentase Diskon
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
                percentHtml = `<span class="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold uppercase tracking-wide">${txt_save} ${percent}%</span>`;
            }

            priceDisplayHtml = `
                <div>
                    <p class="text-sm font-medium text-gray-500">${txt_offer}</p>
                    <div class="flex flex-wrap items-baseline gap-x-2">
                        <span class="text-sm text-gray-400 line-through">${service.price}</span>
                        <h3 class="text-2xl font-bold text-red-600">${service.discount_price}</h3>
                        ${percentHtml}
                    </div>
                </div>`;
        } else {
            priceDisplayHtml = `
                <div>
                    <p class="text-sm font-medium text-gray-500">${txt_best_price}</p>
                    <h3 class="text-2xl font-bold text-gray-900">${service.price || 'Hubungi Kami'}</h3>
                </div>`;
        }

        return `
            <div class="w-full flex-shrink-0 lg:grid lg:grid-cols-12 lg:gap-8 items-center">
                <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                    <div class="inline-flex items-center px-3 py-1 rounded-full border ${badgeColor} text-xs font-semibold tracking-wide uppercase mb-6">
                        <span class="w-2 h-2 ${dotColor} rounded-full mr-2 animate-ping"></span>
                        ${service.badge}
                    </div>
                    <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl mb-6 leading-tight">
                        ${service.title}
                    </h1>
                    <p class="mt-3 text-lg text-slate-600 sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0 leading-loose text-justify">
                        ${service.description}
                    </p>
                    <div class="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a href="produk/${service.slug || service.id}" class="px-8 py-3.5 border border-transparent text-base font-bold rounded-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30 transition transform hover:-translate-y-1 text-center">
                                ${txt_view}
                            </a>
                            <a href="#contact" class="px-8 py-3.5 border border-gray-200 text-base font-bold rounded-full text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition flex items-center justify-center gap-2">
                                <i class="fa-brands fa-whatsapp"></i> ${txt_ask}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                    <div class="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                        <div class="relative block w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 z-10">
                            <img src="${imgUrl}" alt="${service.title}" class="w-full h-64 object-cover opacity-90 hover:scale-105 transition duration-700">
                            <div class="p-6 bg-white">
                                <div class="flex items-center justify-between mb-4">
                                    ${priceDisplayHtml}
                                    <div class="p-2 bg-blue-50 rounded-lg text-blue-600"><i class="fa-solid fa-tag"></i></div>
                                </div>
                                <div class="w-full bg-gray-100 rounded-full h-2.5 mb-1"><div class="bg-blue-500 h-2.5 rounded-full" style="width: 100%"></div></div>
                                <p class="text-xs text-gray-400 text-right">${txt_avail}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderServices(services) {
        const container = document.getElementById('services-container');
        container.innerHTML = '';

        if (services.length === 0) {
            container.innerHTML = '<div class="col-span-full text-center py-10 text-gray-500">Tidak ada layanan ditemukan untuk kategori ini.</div>';
            return;
        }

        services.forEach((service, index) => {
            // Parse Features dari JSON string database
            let featuresList = '';
            if (service.features) {
                try {
                    const features = JSON.parse(service.features);
                    // Limit features for preview (ambil 3 pertama saja agar rapi)
                    const previewFeatures = features.slice(0, 3);
                    
                    featuresList = `<div class="mt-6 space-y-3 pt-6 border-t border-slate-100">`;
                    previewFeatures.forEach(feature => {
                        featuresList += `
                            <div class="flex items-start gap-3 text-base text-slate-600">
                                <div class="mt-1 w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-blue-600">
                                    <i class="fa-solid fa-check text-[10px]"></i>
                                </div>
                                <span class="line-clamp-1">${feature}</span>
                            </div>
                        `;
                    });
                    
                    if (features.length > 3) {
                        featuresList += `
                            <div class="flex items-center gap-2 text-sm font-medium text-blue-600 mt-3 pl-8">
                                <i class="fa-solid fa-plus"></i>
                                <span>${features.length - 3} fitur lainnya</span>
                            </div>
                        `;
                    }
                    featuresList += `</div>`;
                } catch (e) {
                    console.error('Error parsing features:', e);
                }
            }

            const card = document.createElement('div');
            // Modern Card Design
            card.className = 'group relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.15)] transition-all duration-500 cursor-pointer h-full flex flex-col hover:-translate-y-2 animate-fade-in-up overflow-hidden';
            card.style.animationDelay = `${index * 100}ms`; // Stagger animation

            // Logic untuk Badge Best Seller
            let bestSellerBadge = '';
            if (service.badge) {
                let colorClass = 'from-amber-500 to-orange-600'; // Default (Orange - Best Seller)
                const badgeText = service.badge.toLowerCase();

                if (badgeText === 'new') {
                    colorClass = 'from-blue-500 to-indigo-600'; // Biru - New
                } else if (badgeText === 'promo') {
                    colorClass = 'from-rose-500 to-pink-600'; // Merah/Pink - Promo
                }

                bestSellerBadge = `
                    <div class="absolute top-5 right-5 bg-gradient-to-r ${colorClass} text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-gray-200/50 z-20 tracking-wider uppercase overflow-hidden group-hover:scale-110 transition-transform duration-300">
                        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"></div>
                        <span class="relative z-10 flex items-center gap-1.5">
                            ${badgeText === 'best seller' ? '<i class="fa-solid fa-crown text-[9px]"></i>' : ''}
                            ${badgeText === 'new' ? '<i class="fa-solid fa-star text-[9px]"></i>' : ''}
                            ${badgeText === 'promo' ? '<i class="fa-solid fa-percent text-[9px]"></i>' : ''}
                            ${service.badge}
                        </span>
                    </div>
                `;
            }

            // Logic Harga Diskon
            let priceHtml = `<div class="text-lg font-bold text-slate-900 mb-4">${service.price || 'Hubungi Kami'}</div>`;
            if (service.discount_price) {
                // Hitung Persentase Diskon
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
                    percentHtml = `<span class="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wide">Hemat ${percent}%</span>`;
                }

                priceHtml = `
                    <div class="mb-4 flex items-center flex-wrap gap-2">
                        <span class="text-sm text-slate-400 line-through">${service.price}</span>
                        <span class="text-lg font-bold text-red-600">${service.discount_price}</span>
                        ${percentHtml}
                    </div>
                `;
            }

            card.innerHTML = `
                ${bestSellerBadge}
                <!-- Decorative Background Blob -->
                <div class="absolute -right-20 -top-20 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100/60 transition-colors duration-500 pointer-events-none"></div>
                
                <div class="relative z-10 flex flex-col h-full">
                    <!-- Header Icon & Badge -->
                    <div class="flex items-center gap-4 mb-6">
                        <div class="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:border-blue-600 group-hover:text-white transition-all duration-500">
                            <i class="fa-solid fa-${service.icon} text-3xl"></i>
                        </div>
                        ${service.category ? `
                        <span class="px-3 py-1 rounded-full bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider border border-slate-100 group-hover:border-blue-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors capitalize">
                            ${service.category}
                        </span>` : ''}
                    </div>

                    <!-- Title & Price -->
                    <h3 class="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">${service.title}</h3>
                    ${priceHtml}
                    
                    <!-- Description -->
                    <p class="text-slate-600 text-base leading-relaxed mb-4 line-clamp-3">
                        ${service.description}
                    </p>

                    <!-- Features List -->
                    <div class="mt-auto">
                        ${featuresList}
                        
                        <!-- CTA Button -->
                        <div class="mt-8 w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-lg text-center group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300">
                            Lihat Detail
                        </div>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                window.location.href = `produk/${service.slug || service.id}`;
            });
            container.appendChild(card);
        });
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
                b.className = 'filter-btn px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300';
            });
            btn.className = 'filter-btn px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 bg-wa-teal text-white shadow-lg shadow-blue-500/30';

            // Update State & Render
            activeCategory = btn.getAttribute('data-filter');
            filterAndRender();
        });
    });

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
});
