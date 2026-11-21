// CRUDWorks 3D Effects, Scroll Reveal, Live Hero Ticker & Mobile Sticky CTA
    function init3DEffects() {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const finePointer = window.matchMedia('(pointer: fine)').matches;
        if (reducedMotion || !finePointer) return;

        const heroStage = document.querySelector('.hero-3d-stage');
        const heroCard = document.getElementById('hero-3d-card');
        const heroConsoleBody = document.getElementById('hero-console-body');
        const heroConsoleUrl = document.getElementById('hero-console-url');
        const heroModeOrder = ['pos', 'psak', 'hr'];
        let currentHeroIdx = 0;

        const heroModes = {
            pos: {
                url: 'crudworks.cloud / outlet-utama',
                html: heroConsoleBody ? heroConsoleBody.innerHTML : ''
            },
            psak: {
                url: 'crudworks.cloud / psak-ledger',
                html: `
                    <div class="grid grid-cols-3 gap-2.5">
                        <div class="p-3 rounded-xl bg-[#F8F9FA] border border-[#E8EAED]">
                            <span class="font-mono text-[10px] text-[#5F6368] block mb-0.5">OMZET BULAN INI</span>
                            <div class="font-mono text-sm sm:text-base font-bold text-[#202124] tabular-nums">Rp 148.500.000</div>
                            <span class="font-mono text-[10px] text-[#1E8E3E]">Auto-Posted</span>
                        </div>
                        <div class="p-3 rounded-xl bg-[#F8F9FA] border border-[#E8EAED]">
                            <span class="font-mono text-[10px] text-[#5F6368] block mb-0.5">BEBAN &amp; HPP</span>
                            <div class="font-mono text-sm sm:text-base font-bold text-[#202124] tabular-nums">Rp 103.700.000</div>
                            <span class="font-mono text-[10px] text-[#5F6368]">Terjurnal</span>
                        </div>
                        <div class="p-3 rounded-xl bg-[#E6F4EA]/60 border border-[#CEEAD6]">
                            <span class="font-mono text-[10px] text-[#137333] block mb-0.5">LABA BERSIH</span>
                            <div class="font-mono text-sm sm:text-base font-bold text-[#137333] tabular-nums">Rp 44.800.000</div>
                            <span class="font-mono text-[10px] text-[#137333]">Standar PSAK</span>
                        </div>
                    </div>
                    <div class="rounded-xl border border-[#E8EAED] bg-white p-3.5 font-mono text-[11px] space-y-2">
                        <div class="flex items-center justify-between text-[#80868B] pb-1.5 border-b border-[#E8EAED] text-[10px]">
                            <span>AKUN</span><span>JURNAL OTOMATIS</span><span>SALDO</span>
                        </div>
                        <div class="flex items-center justify-between py-1 border-b border-[#F1F3F4] text-[#3C4043]">
                            <span class="text-[#D97757] font-semibold">1-1002</span>
                            <span class="truncate mx-2">Kas &amp; Bank QRIS Settlement</span>
                            <span class="font-bold text-[#1E8E3E] tabular-nums">+Rp 86.200.000</span>
                        </div>
                        <div class="flex items-center justify-between py-1 border-b border-[#F1F3F4] text-[#3C4043]">
                            <span class="text-[#D97757] font-semibold">5-1001</span>
                            <span class="truncate mx-2">HPP Pembelian Bahan Baku</span>
                            <span class="font-bold text-[#202124] tabular-nums">Rp 62.300.000</span>
                        </div>
                        <div class="flex items-center justify-between py-1 text-[#3C4043]">
                            <span class="text-[#D97757] font-semibold">2-2001</span>
                            <span class="truncate mx-2">Cadangan Pajak Terhitung</span>
                            <span class="font-bold text-[#202124] tabular-nums">Rp 4.100.000</span>
                        </div>
                    </div>
                    <div class="pt-2 border-t border-[#E8EAED] flex items-center justify-between text-[11px] font-mono text-[#5F6368]">
                        <span class="flex items-center gap-1.5"><i class="fa-solid fa-rotate text-[#D97757]" aria-hidden="true"></i> Klik konsol untuk ganti modul</span>
                        <a href="#quotation-builder" class="text-[#D97757] hover:text-[#C25E3D] font-semibold inline-flex items-center gap-1">
                            <span>Hitung Paket</span><i class="fa-solid fa-arrow-right text-[9px]" aria-hidden="true"></i>
                        </a>
                    </div>
                `
            },
            hr: {
                url: 'crudworks.cloud / hr-shift-gps',
                html: `
                    <div class="grid grid-cols-3 gap-2.5">
                        <div class="p-3 rounded-xl bg-[#F8F9FA] border border-[#E8EAED]">
                            <span class="font-mono text-[10px] text-[#5F6368] block mb-0.5">STAF HADIR</span>
                            <div class="font-mono text-sm sm:text-base font-bold text-[#202124] tabular-nums">18 / 18</div>
                            <span class="font-mono text-[10px] text-[#1E8E3E]">100% On-Time</span>
                        </div>
                        <div class="p-3 rounded-xl bg-[#F8F9FA] border border-[#E8EAED]">
                            <span class="font-mono text-[10px] text-[#5F6368] block mb-0.5">GEOFENCE GPS</span>
                            <div class="font-mono text-sm sm:text-base font-bold text-[#202124] tabular-nums">Radius 20m</div>
                            <span class="font-mono text-[10px] text-[#5F6368]">Anti Fake-GPS</span>
                        </div>
                        <div class="p-3 rounded-xl bg-[#E6F4EA]/60 border border-[#CEEAD6]">
                            <span class="font-mono text-[10px] text-[#137333] block mb-0.5">SLIP GAJI</span>
                            <div class="font-mono text-sm sm:text-base font-bold text-[#137333] tabular-nums">Siap Kirim</div>
                            <span class="font-mono text-[10px] text-[#137333]">Auto-WA</span>
                        </div>
                    </div>
                    <div class="rounded-xl border border-[#E8EAED] bg-white p-3.5 font-mono text-[11px] space-y-2">
                        <div class="flex items-center justify-between text-[#80868B] pb-1.5 border-b border-[#E8EAED] text-[10px]">
                            <span>KARYAWAN</span><span>CHECK-IN GPS</span><span>STATUS</span>
                        </div>
                        <div class="flex items-center justify-between py-1 border-b border-[#F1F3F4] text-[#3C4043]">
                            <span class="font-semibold text-[#202124]">Dewi Kartika</span>
                            <span class="truncate mx-2">07:56 WIB • Outlet 1</span>
                            <span class="font-bold text-[#1E8E3E]">Valid</span>
                        </div>
                        <div class="flex items-center justify-between py-1 border-b border-[#F1F3F4] text-[#3C4043]">
                            <span class="font-semibold text-[#202124]">Budi Pratama</span>
                            <span class="truncate mx-2">07:58 WIB • Gudang</span>
                            <span class="font-bold text-[#1E8E3E]">Valid</span>
                        </div>
                        <div class="flex items-center justify-between py-1 text-[#3C4043]">
                            <span class="font-semibold text-[#202124]">Rina Safitri</span>
                            <span class="truncate mx-2">08:00 WIB • Kasir 2</span>
                            <span class="font-bold text-[#1E8E3E]">Valid</span>
                        </div>
                    </div>
                    <div class="pt-2 border-t border-[#E8EAED] flex items-center justify-between text-[11px] font-mono text-[#5F6368]">
                        <span class="flex items-center gap-1.5"><i class="fa-solid fa-rotate text-[#D97757]" aria-hidden="true"></i> Klik konsol untuk ganti modul</span>
                        <a href="#features" class="text-[#D97757] hover:text-[#C25E3D] font-semibold inline-flex items-center gap-1">
                            <span>Lihat Fitur HR</span><i class="fa-solid fa-arrow-right text-[9px]" aria-hidden="true"></i>
                        </a>
                    </div>
                `
            }
        };

        const switchHeroMode = (mode) => {
            if (!heroModes[mode] || !heroConsoleBody) return;
            currentHeroIdx = heroModeOrder.indexOf(mode);
            if (heroCard) {
                heroCard.classList.add('is-flipping');
                heroCard.style.transition = 'transform 0.24s cubic-bezier(0.4, 0, 0.2, 1)';
                heroCard.style.transform = 'rotateY(90deg) rotateX(4deg) scale(0.92)';
                setTimeout(() => {
                    heroConsoleBody.innerHTML = heroModes[mode].html;
                    if (heroConsoleUrl) heroConsoleUrl.textContent = heroModes[mode].url;
                    document.querySelectorAll('.hero-mode-btn').forEach(btn => {
                        const active = btn.dataset.heroMode === mode;
                        btn.setAttribute('aria-selected', active ? 'true' : 'false');
                        btn.className = active
                            ? 'hero-mode-btn px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-[#D97757] text-white transition-colors'
                            : 'hero-mode-btn px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-white border border-[#DADCE0] text-[#5F6368] hover:text-[#202124] transition-colors';
                    });
                    heroCard.style.transition = 'none';
                    heroCard.style.transform = 'rotateY(-90deg) rotateX(4deg) scale(0.92)';
                    void heroCard.offsetWidth;
                    heroCard.style.transition = 'transform 0.34s cubic-bezier(0.22, 1, 0.36, 1)';
                    heroCard.style.transform = window.innerWidth >= 1024 ? 'rotateY(-8deg) rotateX(4deg) scale(1)' : 'none';
                    setTimeout(() => {
                        heroCard.classList.remove('is-flipping');
                        if (!heroStage.matches(':hover')) heroCard.style.transform = '';
                    }, 350);
                }, 230);
            }
        };

        if (heroStage && heroCard) {
            let heroTilt = { rx: 3, ry: -6 };
            const applyHeroTransform = (scale = 1, tz = 0) => {
                if (window.innerWidth < 1024) {
                    heroCard.style.transform = scale !== 1 ? `scale(${scale})` : 'none';
                    return;
                }
                heroCard.style.transform = `rotateY(${heroTilt.ry.toFixed(2)}deg) rotateX(${heroTilt.rx.toFixed(2)}deg) translateZ(${tz}px) scale(${scale})`;
            };
            heroStage.addEventListener('mousemove', (e) => {
                if (window.innerWidth < 1024) return;
                const rect = heroStage.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                heroTilt.ry = -6 + (x - 0.5) * 16;
                heroTilt.rx = 3 + (0.5 - y) * 12;
                applyHeroTransform(1, 8);
                heroCard.style.setProperty('--mouse-x', `${(x * 100).toFixed(1)}%`);
                heroCard.style.setProperty('--mouse-y', `${(y * 100).toFixed(1)}%`);
            });
            heroCard.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                const modeBtn = e.target.closest('.hero-mode-btn');
                if (modeBtn) {
                    switchHeroMode(modeBtn.dataset.heroMode);
                    return;
                }
                const nextMode = heroModeOrder[(currentHeroIdx + 1) % heroModeOrder.length];
                switchHeroMode(nextMode);
            });
            heroStage.addEventListener('mouseleave', () => {
                heroTilt = { rx: 4, ry: -8 };
                heroCard.style.transform = '';
            });
        }

        // Opsi 3: 3D Card Flip on click for Case Study cards
        document.querySelectorAll('.flip-card').forEach(card => {
            const toggleFlip = () => {
                const inner = card.querySelector('.flip-card-inner');
                if (!inner) return;
                const flipped = inner.classList.toggle('is-flipped');
                card.setAttribute('aria-pressed', flipped ? 'true' : 'false');
            };
            card.addEventListener('click', toggleFlip);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFlip();
                }
            });
        });

        // 3D hover tilt + tactile click press on module cards & feature showcase mockups
        const cardSelector = '#services-container .grid > div, #features .rounded-2xl.border';
        const computeCardTilt = (card, e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            return {
                rx: (0.5 - y) * 8,
                ry: (x - 0.5) * 8
            };
        };

        document.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 1024) return;
            const card = e.target.closest(cardSelector);
            if (!card) return;
            const { rx, ry } = computeCardTilt(card, e);
            card.style.transform = `perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px)`;
            card.style.boxShadow = '0 22px 44px -14px rgba(32, 33, 36, 0.14), 0 8px 18px -8px rgba(217, 119, 87, 0.12)';
        });

        document.addEventListener('pointerdown', (e) => {
            const card = e.target.closest(cardSelector);
            if (!card) return;
            const { rx, ry } = window.innerWidth >= 1024 ? computeCardTilt(card, e) : { rx: 0, ry: 0 };
            card.style.transform = `perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateZ(-10px) scale(0.975)`;
        });

        document.addEventListener('pointerup', (e) => {
            const card = e.target.closest(cardSelector);
            if (!card) return;
            const { rx, ry } = window.innerWidth >= 1024 ? computeCardTilt(card, e) : { rx: 0, ry: 0 };
            card.style.transform = window.innerWidth >= 1024
                ? `perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-5px)`
                : '';
        });

        document.addEventListener('mouseout', (e) => {
            const card = e.target.closest(cardSelector);
            if (!card) return;
            if (!card.contains(e.relatedTarget)) {
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
    }
    init3DEffects();

    function initScrollReveal() {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const sections = document.querySelectorAll('main > section:not(#home)');
        if (reduced || !('IntersectionObserver' in window) || sections.length === 0) return;

        sections.forEach(sec => sec.classList.add('reveal-section'));
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        sections.forEach(sec => obs.observe(sec));
    }
    initScrollReveal();

    function initHeroLiveTicker() {
        const body = document.getElementById('hero-console-body');
        if (!body) return;
        const sampleRows = [
            { id: '#CW-1083', item: 'Matcha Latte 500ml (x2) • QRIS', amt: '+Rp 96.000' },
            { id: '#CW-1084', item: 'Croissant Butter (x4) • Tunai', amt: '+Rp 128.000' },
            { id: '#CW-1085', item: 'House Blend 1kg • Transfer', amt: '+Rp 265.000' },
            { id: '#CW-1086', item: 'Cold Brew Bottle (x3) • QRIS', amt: '+Rp 114.000' }
        ];
        let tick = 0;
        let receiptCount = 142;

        setInterval(() => {
            const urlEl = document.getElementById('hero-console-url');
            if (!urlEl || !urlEl.textContent.includes('outlet-utama')) return;
            const rowsWrap = body.querySelector('.rounded-xl.border.bg-white');
            if (!rowsWrap) return;
            const rowEls = rowsWrap.querySelectorAll('.flex.items-center.justify-between.py-1');
            if (rowEls.length < 3) return;

            const next = sampleRows[tick % sampleRows.length];
            tick++;
            receiptCount++;

            const countEl = body.querySelectorAll('.font-mono.text-sm.sm\\:text-base.font-bold')[1];
            if (countEl) countEl.textContent = `${receiptCount} Struk`;

            const newRow = document.createElement('div');
            newRow.className = 'flex items-center justify-between py-1 border-b border-[#F1F3F4] text-[#3C4043] bg-[#FDF2EE]/70 rounded px-1 transition-colors duration-700';
            newRow.innerHTML = `<span class="text-[#D97757] font-semibold">${next.id}</span><span class="truncate mx-2">${next.item}</span><span class="font-bold text-[#202124] tabular-nums">${next.amt}</span>`;
            rowEls[0].parentNode.insertBefore(newRow, rowEls[0]);
            rowEls[rowEls.length - 1].remove();
            setTimeout(() => newRow.classList.remove('bg-[#FDF2EE]/70'), 900);
        }, 4500);
    }
    initHeroLiveTicker();

    function initMobileStickyCTA() {
        const bar = document.getElementById('mobile-sticky-cta');
        if (!bar) return;
        const waBtn = document.querySelector('a[aria-label="Konsultasi WhatsApp"]');
        const toggleBar = () => {
            const show = window.scrollY > 480 && window.innerWidth < 768;
            bar.classList.toggle('translate-y-full', !show);
            bar.classList.toggle('opacity-0', !show);
            bar.classList.toggle('pointer-events-none', !show);
            if (waBtn && window.innerWidth < 768) {
                waBtn.style.bottom = show ? '76px' : '';
            }
        };
        window.addEventListener('scroll', toggleBar, { passive: true });
        window.addEventListener('resize', toggleBar, { passive: true });
        toggleBar();
    }
    initMobileStickyCTA();

window.init3DEffects = init3DEffects;
window.initScrollReveal = initScrollReveal;
window.initHeroLiveTicker = initHeroLiveTicker;
window.initMobileStickyCTA = initMobileStickyCTA;
