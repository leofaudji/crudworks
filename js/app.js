document.addEventListener('DOMContentLoaded', () => {
    // Global state ringkasan Quotation Builder aktif
    window.currentQuotationState = {
        modules: [],
        hardware: [],
        totalPrice: 0,
        mode: 'saas',
        outletLabel: '1 Cabang',
        outletMultiplier: 1,
        formattedTotal: 'Rp 0',
        summaryText: ''
    };

    const API_URL = 'api/index.php';

    // Fallback data jika API database belum aktif atau dibuka tanpa server lokal

    // ==========================================
    // CLEAN HUMAN SERVICES 3-COLUMN GRID (Points 3 & 4)
    // ==========================================
    let lastRenderedServices = [];

    const fallbackServices = window.fallbackServices || [];
    let allServicesData = [];

    async function loadServices() {
        const container = document.getElementById('services-container');
        if (!container) return;

        try {
            const response = await fetch(`${API_URL}?endpoint=services`);
            if (response.ok) {
                const data = await response.json();
                allServicesData = (Array.isArray(data) && data.length > 0) ? data : fallbackServices;
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
                'Aplikasi Keuangan Bagi Hasil',
                'Laporan Keuangan',
                'Sistem HR & Payroll',
                'Aplikasi Membership',
                'Manajemen Koperasi',
                'Pemantauan Marketing',
                'AI Credit Scoring',
                'Custom Development'
            ];
            allServicesData.sort((a, b) => {
                const idxA = priorityOrder.indexOf(a.title);
                const idxB = priorityOrder.indexOf(b.title);
                return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
            });
            renderServices(allServicesData);
        } catch (e) {
            console.error('Error saat render layanan:', e);
            renderServices(fallbackServices);
        }
    }

    function initFaqAndCounters() {
        const faqBtns = document.querySelectorAll('.faq-btn');
        faqBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.nextElementSibling;
                const icon = btn.querySelector('.fa-chevron-down');
                faqBtns.forEach(otherBtn => {
                    if (otherBtn !== btn) {
                        otherBtn.nextElementSibling?.classList.add('hidden');
                        otherBtn.querySelector('.fa-chevron-down')?.classList.remove('rotate-180');
                    }
                });
                content?.classList.toggle('hidden');
                icon?.classList.toggle('rotate-180');
            });
        });

        const counters = document.querySelectorAll('.counter');
        const speed = 200;
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
        const statsSection = document.querySelector('.counter')?.closest('section');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            }, { threshold: 0.5 });
            observer.observe(statsSection);
        }
    }

    function renderServices(services) {
        const container = document.getElementById('services-container');
        if (!container) return;
        lastRenderedServices = services;
        container.innerHTML = '';

        if (!services || services.length === 0) {
            container.innerHTML = `
                <div class="col-span-full text-center py-16 text-slate-400 font-medium bg-white rounded-2xl border border-[#DADCE0] p-8">
                    <i class="fa-solid fa-box-open text-3xl text-slate-300 mb-2 block"></i>
                    Tidak ada layanan atau modul ditemukan untuk kriteria ini.
                </div>
            `;
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';

        const limit = parseInt(container.dataset.limit || '0', 10);
        const displayServices = limit > 0 ? services.slice(0, limit) : services;

        displayServices.forEach(service => {
            let featuresHtml = '';
            if (service.features) {
                try {
                    const feats = typeof service.features === 'string' ? JSON.parse(service.features) : service.features;
                    featuresHtml = feats.slice(0, 4).map(f => `
                        <li class="flex items-center gap-2 text-xs text-[#3C4043]">
                            <i class="fa-solid fa-check text-[#1E8E3E] text-[11px] flex-shrink-0"></i>
                            <span class="truncate">${f}</span>
                        </li>
                    `).join('');
                } catch(e) {}
            }

            let badgeHtml = '';
            if (service.badge) {
                let badgeClass = 'bg-[#FDF2EE] text-[#B25134] border-[#F5D5C8] font-mono';
                const b = service.badge.toLowerCase();
                if (b.includes('best') || b.includes('terlaris')) {
                    badgeClass = 'bg-[#FEF7E0] text-[#B06000] border-[#FDD663] font-mono';
                }
                badgeHtml = `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeClass}">${service.badge}</span>`;
            }

            let priceHtml = `<div class="text-lg font-mono font-bold text-[#202124] tabular-nums">${service.price || 'Hubungi Kami'}</div>`;
            if (service.discount_price) {
                priceHtml = `
                    <div class="flex items-baseline gap-2">
                        <span class="text-xs text-slate-400 line-through">${service.price}</span>
                        <span class="text-lg font-mono font-bold text-[#202124] tabular-nums">${service.discount_price}</span>
                    </div>
                `;
            }

            const waDirect = `https://wa.me/6287759651803?text=${encodeURIComponent('Halo Admin CRUDWorks, saya tertarik dengan modul ' + service.title + '.')}`;

            const lblStartFrom = 'Investasi Mulai';
            const lblCloudTag = 'Cloud SaaS • Server & Backup Terkelola';
            const lblDetail = 'Detail Fitur';
            const lblOrder = 'Pesan';
            const lblPreview = 'Lihat Tampilan Layar (UI)';

            const card = document.createElement('div');
            card.className = 'bg-white rounded-2xl border border-[#DADCE0] p-6 flex flex-col justify-between hover:border-[#D97757] cw-card-lift group';
            card.innerHTML = `
                <div>
                    <div class="flex items-start justify-between gap-3 mb-4">
                        <div class="w-12 h-12 rounded-xl bg-[#FDF2EE] border border-[#F5D5C8] text-[#D97757] flex items-center justify-center text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                            <i class="fa-solid fa-${service.icon || 'cubes'}"></i>
                        </div>
                        ${badgeHtml}
                    </div>
                    <span class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">${service.category || 'Modul Sistem'}</span>
                    <h3 class="font-display text-lg font-bold text-[#202124] group-hover:text-[#D97757] transition-colors mb-2 leading-snug">
                        <a href="produk/${service.slug || service.id}">${service.title}</a>
                    </h3>
                    <p class="text-xs text-[#5F6368] leading-relaxed line-clamp-2 mb-4">${service.description}</p>
                    
                    <ul class="space-y-2 py-3 border-y border-[#E8EAED] mb-5">
                        ${featuresHtml}
                    </ul>
                </div>

                <div>
                    <div class="mb-4">
                        <span class="text-[10px] font-semibold uppercase text-slate-400 block tracking-wider">${lblStartFrom}</span>
                        ${priceHtml}
                        <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#F8F9FA] border border-[#DADCE0] text-[#5F6368] text-[10px] font-mono font-semibold mt-1.5">
                            <i class="fa-solid fa-tag text-[#D97757] text-[9px]"></i>
                            <span>${lblCloudTag}</span>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <a href="produk/${service.slug || service.id}" class="py-2.5 px-3 rounded-xl border border-[#DADCE0] bg-white hover:bg-[#F8F9FA] text-[#3C4043] text-xs font-semibold text-center transition-colors">
                            ${lblDetail}
                        </a>
                        <a href="${waDirect}" target="_blank" class="py-2.5 px-3 rounded-xl bg-[#D97757] hover:bg-[#C25E3D] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5 shadow-xs">
                            <i class="fa-brands fa-whatsapp text-sm"></i> ${lblOrder}
                        </a>
                    </div>
                    <button type="button" class="btn-preview-ui w-full mt-2 py-2.5 px-3 rounded-xl border border-[#DADCE0] bg-[#F8F9FA] hover:border-[#D97757] hover:bg-[#FDF2EE]/50 text-[#3C4043] hover:text-[#D97757] text-xs font-semibold transition-all flex items-center justify-center gap-1.5" data-title="${service.title}" data-category="${service.category || 'retail'}">
                        <i class="fa-solid fa-desktop text-[#D97757] text-xs"></i>
                        <span>${lblPreview}</span>
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    // --- LOGIC FILTER & SEARCH (Unified) ---
    let activeCategory = 'all';
    let searchQuery = '';

    const filterAndRender = () => {
        const filtered = allServicesData.filter(item => {
            const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery) || 
                                  item.description.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });

        renderServices(filtered);
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
            }, 300);
        });
    }

    // Filter Buttons Listener
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.className = 'filter-btn px-4 py-2 rounded-full text-xs font-medium transition-colors bg-white text-[#5F6368] border border-[#DADCE0] hover:bg-[#F8F9FA] hover:text-[#202124]';
            });
            btn.className = 'filter-btn px-4 py-2 rounded-full text-xs font-semibold transition-colors bg-[#D97757] text-white border border-[#D97757] shadow-xs';

            activeCategory = btn.getAttribute('data-filter');
            filterAndRender();
        });
    });

    // 2. Fungsi Handle Contact Form (POST)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Mengirim...';
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75');

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            try {
                const response = await fetch(`${API_URL}?endpoint=contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
                submitBtn.classList.remove('opacity-75');
                
                setTimeout(() => {
                    formStatus.classList.add('hidden');
                }, 3000);
            }
        });
    }

    // 2b. Handler Kirim Form Langsung ke WhatsApp (Point 2)
    
    const contactMessageTextarea = document.getElementById('message');
    if (contactMessageTextarea) {
        contactMessageTextarea.addEventListener('input', () => {
            contactMessageTextarea.dataset.userEdited = 'true';
        });
    }

    const btnSendWaForm = document.getElementById('btn-send-wa-form');
    if (btnSendWaForm) {
        btnSendWaForm.addEventListener('click', () => {
            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const moduleSelect = document.getElementById('module_interest');
            const moduleInterest = moduleSelect ? moduleSelect.value : 'Konsultasi Umum';
            const message = document.getElementById('message')?.value.trim() || '';

            if (!name) {
                alert('Silakan masukkan nama lengkap atau nama usaha Anda.');
                document.getElementById('name')?.focus();
                return;
            }

            let quotationAddon = '';
            if (window.currentQuotationState && window.currentQuotationState.modules.length > 0) {
                const q = window.currentQuotationState;
                quotationAddon = `\n• Estimasi Quotation: ${q.modules.map(m => m.name).join(', ')} | Hardware: ${q.hardware.map(h => h.name).join(', ') || 'Tanpa Hardware'} | Total: ${q.formattedTotal} (${q.mode === 'lifetime' ? 'Hak Milik' : 'SaaS'})`;
            }

            const waText = `Halo Tim CRUDWorks, saya ingin konsultasi sistem bisnis:
• Nama/Usaha: ${name}
• Nomor Kontak: ${email || '-'}
• Modul Diminati: ${moduleInterest}${quotationAddon}
• Kebutuhan/Catatan: ${message || 'Mohon informasi estimasi biaya & demo fitur.'}`;

            const waUrl = `https://wa.me/6287759651803?text=${encodeURIComponent(waText)}`;
            window.open(waUrl, '_blank');

            fetch(`${API_URL}?endpoint=contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${name} [via Form WA - ${moduleInterest}]`,
                    email: email || 'via-whatsapp@client.local',
                    message: message || `Tertarik modul: ${moduleInterest}`
                })
            }).catch(() => {});
        });
    }

    // ----------------------------------------------------
    // Point 1: Floating WhatsApp Widget Logic
    // ----------------------------------------------------
    const btnToggleWa = document.getElementById('btn-toggle-wa');
    const waCardPopup = document.getElementById('wa-card-popup');
    const closeWaCard = document.getElementById('close-wa-card');

    if (btnToggleWa && waCardPopup) {
        btnToggleWa.addEventListener('click', (e) => {
            e.stopPropagation();
            waCardPopup.classList.toggle('hidden');
        });

        if (closeWaCard) {
            closeWaCard.addEventListener('click', (e) => {
                e.stopPropagation();
                waCardPopup.classList.add('hidden');
            });
        }

        document.addEventListener('click', (e) => {
            if (!waCardPopup.contains(e.target) && !btnToggleWa.contains(e.target)) {
                waCardPopup.classList.add('hidden');
            }
        });
    }


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
        modalIconContainer.className = "flex items-center justify-center flex-shrink-0 w-16 h-16 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl sm:mx-0 sm:h-16 sm:w-16 shadow-sm border border-[#F5D5C8]";
        modalIconContainer.innerHTML = `<i class="fa-solid fa-${service.icon} text-3xl text-[#D97757]"></i>`;

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
                <i class="fa-solid fa-circle-info text-[#D97757] mt-0.5 flex-shrink-0"></i>
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
                        <li class="flex items-start p-2.5 rounded-lg bg-white border border-gray-100 shadow-sm hover:shadow-md hover:border-[#F5D5C8] transition-all duration-200">
                            <div class="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-3">
                                <i class="fa-solid fa-check text-[#D97757] text-xs"></i>
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
            navbar.classList.remove('bg-white/90');
            navbar.classList.add('bg-white/95', 'shadow-sm');
        } else {
            navbar.classList.add('bg-white/90');
            navbar.classList.remove('bg-white/95', 'shadow-sm');
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

    loadServices();
    initFaqAndCounters();
    localStorage.removeItem('crudworks_lang');
    document.documentElement.lang = 'id';

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
            if (window.currentQuotationState && typeof window.syncQuotationToContactAndModal === 'function') {
                window.syncQuotationToContactAndModal(window.currentQuotationState);
            }
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

            let extraDetails = '';
            if (window.currentQuotationState && window.currentQuotationState.modules.length > 0) {
                const q = window.currentQuotationState;
                const mList = q.modules.map(m => m.name).join(', ');
                const hList = q.hardware.map(h => h.name).join(', ') || 'Tanpa Hardware';
                extraDetails = `\n- Rincian Paket Estimasi: ${mList}\n- Hardware Kasir: ${hList}\n- Estimasi Total: ${q.formattedTotal} (${q.mode === 'saas_yearly' ? 'SaaS/thn' : 'SaaS/bln'})`;
            }

            const message = `Halo Tim CRUDWorks, saya tertarik untuk konsultasi implementasi software:\n` +
                `- Modul/Kategori: *${modul}*\n` +
                `- Skala Usaha: *${skala}*` +
                extraDetails +
                `\n\nMohon informasi ketersediaan jadwal demo sistem dan jadwal konsultasinya.`;

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
                        btn.className = 'sample-tab-btn flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors bg-white text-[#D97757] border border-[#DADCE0] shadow-xs';
                    } else {
                        btn.className = 'sample-tab-btn flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors text-[#5F6368] hover:text-[#202124] bg-transparent';
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


    // Initialize Modular Features (when loaded)
    if (typeof window.initQuotationBuilder === 'function') window.initQuotationBuilder();
    if (typeof window.initQuotePresets === 'function') window.initQuotePresets();
    if (typeof window.init3DEffects === 'function') window.init3DEffects();
    if (typeof window.initScrollReveal === 'function') window.initScrollReveal();
    if (typeof window.initHeroLiveTicker === 'function') window.initHeroLiveTicker();
    if (typeof window.initMobileStickyCTA === 'function') window.initMobileStickyCTA();
});
