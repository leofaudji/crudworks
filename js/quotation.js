// CRUDWorks Quotation Builder & 1-Click Package Presets
    function initQuotationBuilder() {
        const quotationSection = document.getElementById('quotation-builder');
        if (!quotationSection) return;

        const moduleData = {
            pos: { name: 'Kasir POS & Scan Barcode', lifetime: 1800000, saas: 149000 },
            stock: { name: 'Manajemen Stok & Multi-Gudang', lifetime: 1500000, saas: 120000 },
            finance: { name: 'Laporan Keuangan & Neraca', lifetime: 1600000, saas: 149000 },
            hr: { name: 'Absensi GPS & Payroll Karyawan', lifetime: 1200000, saas: 99000 },
            membership: { name: 'Membership & Poin Pelanggan', lifetime: 900000, saas: 79000 },
            bagi_hasil: { name: 'Aplikasi Keuangan Bagi Hasil Kemitraan', lifetime: 2950000, saas: 199000 }
        };

        const hardwareData = {
            printer: { name: 'Printer Thermal 58mm', price: 380000 },
            scanner: { name: 'Barcode Scanner 2D Wireless', price: 420000 },
            drawer: { name: 'Cash Drawer Logam', price: 450000 },
            setup_coa: { name: 'Setup Server Privat & Migrasi COA', price: 1250000 }
        };

        const modeLabels = document.querySelectorAll('.quote-mode-btn');
        const outletBtns = document.querySelectorAll('.quote-outlet-btn');
        const hwCheckboxes = document.querySelectorAll('.quote-hw-cb');

        const summaryItemsContainer = document.getElementById('quote-summary-items');
        const discountContainer = document.getElementById('quote-discount-container');
        const discountAmountEl = document.getElementById('quote-discount-amount');
        const totalPriceEl = document.getElementById('quote-total-price');
        const billingTermEl = document.getElementById('quote-billing-term');
        const btnSendWa = document.getElementById('btn-quote-send-wa');
        const btnPrint = document.getElementById('btn-quote-print');

        let currentMode = 'saas';
        let currentMultiplier = 1;
        let currentDiscount = 0;
        let outletLabel = '1 Cabang';

        function formatIDR(num) {
            return 'Rp ' + Number(num).toLocaleString('id-ID');
        }

        function calculateQuotation() {
            let selectedModules = [];
            let moduleTotal = 0;

            document.querySelectorAll('.quote-module-cb:checked').forEach(cb => {
                const key = cb.value;
                const info = moduleData[key];
                if (info) {
                    const price = currentMode === 'saas_yearly' ? Math.round(info.saas * 12 * 0.85) : info.saas;
                    selectedModules.push({ name: info.name, price: price });
                    moduleTotal += price;
                }
            });

            const totalModulesCost = moduleTotal * currentMultiplier;
            const discountAmount = totalModulesCost * currentDiscount;
            const finalModulesCost = totalModulesCost - discountAmount;

            let selectedHw = [];
            let hwTotal = 0;
            hwCheckboxes.forEach(cb => {
                if (cb.checked) {
                    const key = cb.value;
                    const info = hardwareData[key];
                    if (info) {
                        const cost = info.price * currentMultiplier;
                        selectedHw.push({ name: `${info.name} (${currentMultiplier} unit)`, price: cost });
                        hwTotal += cost;
                    }
                }
            });

            const grandTotal = finalModulesCost + hwTotal;

            if (summaryItemsContainer) {
                let itemsHtml = '';
                if (selectedModules.length === 0 && selectedHw.length === 0) {
                    itemsHtml = '<p class="text-slate-400 italic py-2">Silakan centang minimal satu modul perangkat lunak di samping.</p>';
                } else {
                    selectedModules.forEach(m => {
                        const sub = currentMultiplier > 1 ? ` (${currentMultiplier} cabang)` : '';
                        itemsHtml += `
                            <div class="flex justify-between items-center py-1.5 border-b border-[#E8EAED] text-xs">
                                <span class="font-medium text-[#3C4043]">${m.name}${sub}</span>
                                <span class="font-mono font-bold text-[#202124] tabular-nums">${formatIDR(m.price * currentMultiplier)}</span>
                            </div>
                        `;
                    });

                    selectedHw.forEach(h => {
                        itemsHtml += `
                            <div class="flex justify-between items-center py-1.5 border-b border-[#E8EAED] text-xs text-[#5F6368]">
                                <span>+ ${h.name}</span>
                                <span class="font-mono font-bold text-[#202124] tabular-nums">${formatIDR(h.price)}</span>
                            </div>
                        `;
                    });
                }
                summaryItemsContainer.innerHTML = itemsHtml;
            }

            if (discountContainer && discountAmountEl) {
                if (discountAmount > 0) {
                    discountContainer.classList.remove('hidden');
                    discountAmountEl.innerText = `- ${formatIDR(discountAmount)}`;
                } else {
                    discountContainer.classList.add('hidden');
                }
            }

            if (totalPriceEl) totalPriceEl.innerText = formatIDR(grandTotal);
            if (billingTermEl) {
                if (currentMode === 'lifetime') {
                    billingTermEl.innerText = currentMode === 'saas_yearly' ? 'Tagihan per tahun (Cloud SaaS • Hemat 15%)' : 'Tagihan per bulan (Cloud SaaS Terkelola)';
                } else {
                    billingTermEl.innerText = 'Estimasi biaya langganan cloud per bulan';
                }
            }

            const modulesListText = selectedModules.map(m => `  • ${m.name}`).join('\n') || '  • (Belum memilih modul)';
            const hwListText = selectedHw.map(h => `  • ${h.name}`).join('\n') || '  • Tanpa Hardware';

            const waMessage = `Halo Sales CRUDWorks, saya telah membuat draft estimasi kebutuhan sistem melalui website:
• Siklus Langganan: ${currentMode === 'saas_yearly' ? 'Cloud SaaS Tahunan (Hemat 15%)' : 'Cloud SaaS Bulanan'}
• Skala Outlet: ${outletLabel}
• Modul Terpilih:
${modulesListText}
• Hardware Kasir:
${hwListText}
• Estimasi Investasi: ${formatIDR(grandTotal)} ${currentMode === 'saas_yearly' ? '/tahun' : '/bln'}

Mohon informasi jadwal presentasi demo dan ketersediaan alur kustomisasinya. Terima kasih!`;

            if (btnSendWa) {
                btnSendWa.href = `https://wa.me/6287759651803?text=${encodeURIComponent(waMessage)}`;
            }

            // Simpan ke state global dan picu sinkronisasi ke Form Kontak & Modal Konsultasi
            window.currentQuotationState = {
                modules: selectedModules,
                hardware: selectedHw,
                totalPrice: grandTotal,
                mode: currentMode,
                outletLabel: outletLabel,
                outletMultiplier: currentMultiplier,
                formattedTotal: formatIDR(grandTotal),
                summaryText: waMessage
            };
            if (typeof syncQuotationToContactAndModal === 'function') {
                syncQuotationToContactAndModal(window.currentQuotationState);
            }
        }

        modeLabels.forEach(label => {
            label.addEventListener('click', () => {
                modeLabels.forEach(l => {
                    l.className = 'quote-mode-btn cursor-pointer p-4 rounded-xl border border-[#DADCE0] bg-white hover:border-[#BDC1C6] flex items-start gap-3 transition-colors';
                });
                label.className = 'quote-mode-btn cursor-pointer p-4 rounded-xl border-2 border-[#D97757] bg-[#FDF2EE]/40 flex items-start gap-3 transition-colors';
                
                const radio = label.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                currentMode = label.dataset.mode || 'saas';

                document.querySelectorAll('.quote-module-card').forEach(card => {
                    const priceEl = card.querySelector('.quote-module-price');
                    const termEl = card.querySelector('.quote-price-term');
                    if (priceEl && termEl) {
                        const baseSaas = parseInt(priceEl.dataset.saas || 0, 10);
                        const val = currentMode === 'saas_yearly' ? Math.round(baseSaas * 12 * 0.85) : baseSaas;
                        priceEl.innerText = formatIDR(val);
                        termEl.innerText = currentMode === 'saas_yearly' ? 'per tahun (hemat 15%)' : 'per bulan';
                    }
                });

                calculateQuotation();
            });
        });

        document.querySelectorAll('.quote-module-cb').forEach(cb => {
            cb.addEventListener('change', calculateQuotation);
        });

        outletBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                outletBtns.forEach(b => {
                    b.className = 'quote-outlet-btn cursor-pointer p-3 rounded-xl border border-[#DADCE0] bg-white hover:border-[#BDC1C6] text-center transition-colors';
                });
                btn.className = 'quote-outlet-btn cursor-pointer p-3 rounded-xl border-2 border-[#D97757] bg-[#FDF2EE]/40 text-center transition-colors';
                
                const radio = btn.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;

                currentMultiplier = parseInt(btn.dataset.multiplier) || 1;
                currentDiscount = parseFloat(btn.dataset.discount) || 0;
                outletLabel = btn.querySelector('span')?.innerText || '1 Cabang';

                calculateQuotation();
            });
        });

        hwCheckboxes.forEach(cb => {
            cb.addEventListener('change', calculateQuotation);
        });

                // Update sync print number & date
        function syncPrintDetails() {
            const printNumberEl = document.getElementById('quote-print-number-top');
            const quoteNumberEl = document.getElementById('quote-number-display');
            if (printNumberEl && quoteNumberEl) {
                printNumberEl.textContent = quoteNumberEl.textContent.replace('No: ', '');
            }
            const printDateEl = document.getElementById('quote-print-date-display');
            if (printDateEl) {
                const now = new Date();
                const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                printDateEl.textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
            }
        }

        let originalDocTitle = document.title;

        function triggerQuotationPrint() {
            syncPrintDetails();
            const card = document.getElementById('printable-quotation-card');
            const mount = document.getElementById('print-mount');
            if (!card || !mount) {
                window.print();
                return;
            }

            originalDocTitle = document.title;
            const quoteNumberEl = document.getElementById('quote-number-display');
            const quoteNum = quoteNumberEl ? quoteNumberEl.textContent.replace(/[^a-zA-Z0-9-]/g, '') : 'CW-EST';
            document.title = `Draft-Penawaran-CRUDWorks-${quoteNum}`;

            mount.innerHTML = `<div class="print-card space-y-5">${card.innerHTML}</div>`;
            document.body.classList.add('is-printing-quotation');

            setTimeout(() => {
                window.print();
            }, 60);
        }

        if (btnPrint) {
            btnPrint.addEventListener('click', (e) => {
                e.preventDefault();
                triggerQuotationPrint();
            });
        }

        window.addEventListener('afterprint', () => {
            document.body.classList.remove('is-printing-quotation');
            if (originalDocTitle) document.title = originalDocTitle;
            const mount = document.getElementById('print-mount');
            if (mount) mount.innerHTML = '';
        });

        // Dukungan Ctrl+P langsung di halaman
        window.addEventListener('beforeprint', () => {
            if (!document.body.classList.contains('is-printing-quotation')) {
                const card = document.getElementById('printable-quotation-card');
                const mount = document.getElementById('print-mount');
                if (card && mount) {
                    syncPrintDetails();
                    mount.innerHTML = `<div class="print-card space-y-5">${card.innerHTML}</div>`;
                    document.body.classList.add('is-printing-quotation');
                }
            }
        });

        calculateQuotation();
    }

    function initQuotePresets() {
        const presetBtns = document.querySelectorAll('.quote-preset-btn');
        if (presetBtns.length === 0) return;

        const presets = {
            kafe: { modules: ['pos', 'stock'], branches: '1' },
            koperasi: { modules: ['pos', 'finance', 'partnership'], branches: '1' },
            multicabang: { modules: ['pos', 'stock', 'finance', 'hr'], branches: '2-3' }
        };

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const cfg = presets[btn.dataset.preset];
                if (!cfg) return;

                presetBtns.forEach(b => {
                    b.className = 'quote-preset-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#DADCE0] text-[#3C4043] hover:border-[#D97757] hover:text-[#D97757] transition-all';
                });
                btn.className = 'quote-preset-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#D97757] border border-[#D97757] text-white shadow-xs transition-all';

                document.querySelectorAll('.quote-module-cb').forEach(cb => {
                    cb.checked = cfg.modules.includes(cb.value);
                    cb.dispatchEvent(new Event('change'));
                });

                const branchBtn = document.querySelector(`.quote-branch-btn[data-branches="${cfg.branches}"]`);
                if (branchBtn) branchBtn.click();
            });
        });
    }
    initQuotePresets();

window.initQuotationBuilder = initQuotationBuilder;
window.initQuotePresets = initQuotePresets;
