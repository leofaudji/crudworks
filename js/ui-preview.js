// CRUDWorks UI Preview Modal & Interactive View Renderer
(function () {
    const uiPreviewModal = document.getElementById('ui-preview-modal');
    const closeUiPreviewBtn = document.getElementById('close-ui-preview-btn');
    const closeUiModalBottom = document.getElementById('btn-close-ui-modal-bottom');
    const uiPreviewOverlay = document.getElementById('ui-preview-overlay');
    const uiPreviewTitle = document.getElementById('ui-preview-title');
    const uiPreviewSubtitle = document.getElementById('ui-preview-subtitle');
    const uiPreviewDisplay = document.getElementById('ui-preview-display');
    const btnTryDemoWa = document.getElementById('btn-try-demo-wa');
    let currentPreviewTitle = 'Aplikasi Retail (Kasir POS)';

    function renderUiView(viewType, title) {
        if (!uiPreviewDisplay) return;

        document.querySelectorAll('.ui-tab-btn').forEach(btn => {
            if (btn.dataset.view === viewType) {
                btn.className = 'ui-tab-btn px-4 py-2 rounded-lg text-xs font-semibold transition-colors bg-[#111315] text-white';
            } else {
                btn.className = 'ui-tab-btn px-4 py-2 rounded-lg text-xs font-semibold transition-colors bg-white text-[#374151] border border-[#D1CCC2] hover:border-[#111315]';
            }
        });

        if (viewType === 'pos') {
            uiPreviewDisplay.innerHTML = `
                <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs">
                        <div class="flex items-center gap-2 font-bold text-slate-800">
                            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                            <span>Kasir POS Cepat • Shift Pagi Aktif</span>
                        </div>
                        <span class="font-mono text-slate-400">Kasir: Siti Rahma • Outlet Utama</span>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div class="md:col-span-7 space-y-3">
                            <div class="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                                <i class="fa-solid fa-barcode text-slate-400 text-base"></i>
                                <span class="text-slate-400 font-mono">Scan Barcode atau Ketik Produk (F2)...</span>
                            </div>

                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                <div class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#D97757] transition-colors cursor-pointer">
                                    <p class="font-bold text-slate-800 text-xs truncate">Beras Pandanwangi 5kg</p>
                                    <p class="text-[11px] text-[#D97757] font-bold mt-1">Rp 68.000</p>
                                    <span class="text-[9px] text-emerald-600 font-medium">Stok: 42</span>
                                </div>
                                <div class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#D97757] transition-colors cursor-pointer">
                                    <p class="font-bold text-slate-800 text-xs truncate">Minyak Goreng 2L</p>
                                    <p class="text-[11px] text-[#D97757] font-bold mt-1">Rp 34.500</p>
                                    <span class="text-[9px] text-emerald-600 font-medium">Stok: 118</span>
                                </div>
                                <div class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#D97757] transition-colors cursor-pointer">
                                    <p class="font-bold text-slate-800 text-xs truncate">Gula Pasir 1kg</p>
                                    <p class="text-[11px] text-[#D97757] font-bold mt-1">Rp 17.500</p>
                                    <span class="text-[9px] text-emerald-600 font-medium">Stok: 65</span>
                                </div>
                                <div class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#D97757] transition-colors cursor-pointer">
                                    <p class="font-bold text-slate-800 text-xs truncate">Kopi Arabika 250g</p>
                                    <p class="text-[11px] text-[#D97757] font-bold mt-1">Rp 45.000</p>
                                    <span class="text-[9px] text-emerald-600 font-medium">Stok: 24</span>
                                </div>
                                <div class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#D97757] transition-colors cursor-pointer">
                                    <p class="font-bold text-slate-800 text-xs truncate">Susu UHT 1000ml</p>
                                    <p class="text-[11px] text-[#D97757] font-bold mt-1">Rp 19.000</p>
                                    <span class="text-[9px] text-emerald-600 font-medium">Stok: 30</span>
                                </div>
                                <div class="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#D97757] transition-colors cursor-pointer">
                                    <p class="font-bold text-slate-800 text-xs truncate">Teh Celup Kotak</p>
                                    <p class="text-[11px] text-[#D97757] font-bold mt-1">Rp 8.500</p>
                                    <span class="text-[9px] text-emerald-600 font-medium">Stok: 80</span>
                                </div>
                            </div>
                        </div>

                        <div class="md:col-span-5 bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                                    <span class="font-bold text-xs text-slate-800">Struk Transaksi #CW-8921</span>
                                    <span class="text-[10px] text-slate-500 font-mono">16:15 WIB</span>
                                </div>

                                <div class="space-y-1.5 text-xs text-slate-700 max-h-36 overflow-y-auto">
                                    <div class="flex justify-between items-center py-1.5 border-b border-[#E8EAED] text-xs">
                                        <div><p class="font-semibold text-[11px]">Beras Pandanwangi 5kg</p><p class="text-[10px] text-slate-400">1x @ 68.000</p></div>
                                        <span class="font-bold">68.000</span>
                                    </div>
                                    <div class="flex justify-between items-center py-1.5 border-b border-[#E8EAED] text-xs">
                                        <div><p class="font-semibold text-[11px]">Minyak Goreng 2L</p><p class="text-[10px] text-slate-400">2x @ 34.500</p></div>
                                        <span class="font-bold">69.000</span>
                                    </div>
                                    <div class="flex justify-between items-center py-1">
                                        <div><p class="font-semibold text-[11px]">Gula Pasir 1kg</p><p class="text-[10px] text-slate-400">1x @ 17.500</p></div>
                                        <span class="font-bold">17.500</span>
                                    </div>
                                </div>
                            </div>

                            <div class="pt-3 border-t border-slate-200 mt-2">
                                <div class="flex justify-between text-xs text-slate-500 mb-1"><span>Subtotal (4 Item)</span><span>Rp 154.500</span></div>
                                <div class="flex justify-between text-xs text-emerald-600 mb-1.5 font-medium"><span>Diskon Promo Member</span><span>- Rp 4.500</span></div>
                                <div class="flex justify-between items-baseline mb-3">
                                    <span class="text-xs font-bold text-slate-900">Total Pembayaran</span>
                                    <span class="text-lg font-extrabold text-[#B25134]">Rp 150.000</span>
                                </div>

                                <div class="grid grid-cols-2 gap-1.5">
                                    <button type="button" class="py-2 px-2 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs">
                                        <i class="fa-solid fa-money-bill-wave"></i> Tunai (F8)
                                    </button>
                                    <button type="button" class="py-2 px-2 rounded-lg bg-[#D97757] text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs">
                                        <i class="fa-solid fa-qrcode"></i> QRIS Dinamis (F9)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (viewType === 'stock') {
            uiPreviewDisplay.innerHTML = `
                <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2 text-xs">
                        <div class="flex items-center gap-2 font-bold text-slate-800">
                            <i class="fa-solid fa-warehouse text-[#D97757]"></i>
                            <span>Monitoring Multi-Gudang & Kartu Stok Real-Time</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px]">1.240 Total SKU</span>
                            <span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px]">1 Item Perlu Restock</span>
                        </div>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-xs">
                            <thead class="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                                <tr>
                                    <th class="py-2.5 px-3">Kode SKU</th>
                                    <th class="py-2.5 px-3">Nama Produk</th>
                                    <th class="py-2.5 px-3">Gudang Pusat</th>
                                    <th class="py-2.5 px-3">Toko Depan</th>
                                    <th class="py-2.5 px-3">Batas Aman</th>
                                    <th class="py-2.5 px-3">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-100 text-slate-700">
                                <tr>
                                    <td class="py-2.5 px-3 font-mono font-semibold">SKU-BRS-05</td>
                                    <td class="py-2.5 px-3 font-bold">Beras Pandanwangi 5kg</td>
                                    <td class="py-2.5 px-3 font-mono">120 karung</td>
                                    <td class="py-2.5 px-3 font-mono">42 karung</td>
                                    <td class="py-2.5 px-3 font-mono text-slate-400">10</td>
                                    <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Aman</span></td>
                                </tr>
                                <tr>
                                    <td class="py-2.5 px-3 font-mono font-semibold">SKU-MYK-02</td>
                                    <td class="py-2.5 px-3 font-bold">Minyak Goreng 2L</td>
                                    <td class="py-2.5 px-3 font-mono">240 btl</td>
                                    <td class="py-2.5 px-3 font-mono">118 btl</td>
                                    <td class="py-2.5 px-3 font-mono text-slate-400">20</td>
                                    <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Aman</span></td>
                                </tr>
                                <tr class="bg-amber-50/50">
                                    <td class="py-2.5 px-3 font-mono font-semibold text-amber-900">SKU-GLA-01</td>
                                    <td class="py-2.5 px-3 font-bold text-amber-900">Gula Pasir 1kg</td>
                                    <td class="py-2.5 px-3 font-mono">10 pack</td>
                                    <td class="py-2.5 px-3 font-mono">4 pack</td>
                                    <td class="py-2.5 px-3 font-mono text-amber-700 font-bold">15</td>
                                    <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Perlu Restock</span></td>
                                </tr>
                                <tr>
                                    <td class="py-2.5 px-3 font-mono font-semibold">SKU-KOP-25</td>
                                    <td class="py-2.5 px-3 font-bold">Kopi Arabika 250g</td>
                                    <td class="py-2.5 px-3 font-mono">50 bungkus</td>
                                    <td class="py-2.5 px-3 font-mono">24 bungkus</td>
                                    <td class="py-2.5 px-3 font-mono text-slate-400">5</td>
                                    <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">Aman</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else if (viewType === 'report') {
            uiPreviewDisplay.innerHTML = `
                <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-2xs">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 mb-4 text-xs">
                        <div class="font-bold text-slate-800 flex items-center gap-2">
                            <i class="fa-solid fa-file-invoice-dollar text-emerald-600"></i>
                            <span>Rekapitulasi Keuangan & Laba Bersih</span>
                        </div>
                        <span class="text-slate-400">Periode: 1 - 30 November 2026</span>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                        <div class="p-3 rounded-xl bg-[#FDF2EE] border border-[#F5D5C8]">
                            <p class="text-[10px] uppercase font-bold text-[#B25134]">Omset Penjualan</p>
                            <p class="text-lg font-extrabold text-blue-900 mt-1">Rp 64.820.000</p>
                            <p class="text-[10px] text-[#D97757] mt-0.5">↑ 14% dari bulan lalu</p>
                        </div>
                        <div class="p-3 rounded-xl bg-rose-50 border border-rose-100">
                            <p class="text-[10px] uppercase font-bold text-rose-700">HPP & Biaya Ops</p>
                            <p class="text-lg font-extrabold text-rose-900 mt-1">Rp 44.150.000</p>
                            <p class="text-[10px] text-rose-600 mt-0.5">Termasuk gaji & operasional</p>
                        </div>
                        <div class="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                            <p class="text-[10px] uppercase font-bold text-emerald-700">Laba Bersih Riil</p>
                            <p class="text-lg font-extrabold text-emerald-900 mt-1">Rp 20.670.000</p>
                            <p class="text-[10px] text-emerald-600 mt-0.5">Margin Bersih: 31,8%</p>
                        </div>
                    </div>

                    <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                        <span class="text-slate-600"><i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> Laporan otomatis sesuai SAK EMKM Indonesia, siap diekspor ke format Excel (.xlsx) / PDF</span>
                        <span class="font-bold text-[#D97757]">Export Ready ✓</span>
                    </div>
                </div>
            `;
        }
    }

    function openUiPreviewModal(title, category) {
        if (!uiPreviewModal) return;
        currentPreviewTitle = title || 'Aplikasi Retail (Kasir POS)';
        if (uiPreviewTitle) uiPreviewTitle.innerText = `Preview Tampilan Sistem: ${currentPreviewTitle}`;
        if (btnTryDemoWa) {
            btnTryDemoWa.href = `https://wa.me/6287759651803?text=${encodeURIComponent('Halo Tim CRUDWorks, saya tertarik mencoba demo tampilan langsung untuk modul ' + currentPreviewTitle + '.')}`;
        }
        renderUiView('pos', currentPreviewTitle);
        uiPreviewModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeUiPreviewModal() {
        if (!uiPreviewModal) return;
        uiPreviewModal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    if (closeUiPreviewBtn) closeUiPreviewBtn.addEventListener('click', closeUiPreviewModal);
    if (closeUiModalBottom) closeUiModalBottom.addEventListener('click', closeUiPreviewModal);
    if (uiPreviewOverlay) uiPreviewOverlay.addEventListener('click', closeUiPreviewModal);

    document.querySelectorAll('.ui-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            renderUiView(btn.dataset.view, currentPreviewTitle);
        });
    });

    document.addEventListener('click', (e) => {
        const previewBtn = e.target.closest('.btn-preview-ui');
        if (previewBtn) {
            e.preventDefault();
            const title = previewBtn.dataset.title;
            const category = previewBtn.dataset.category;
            openUiPreviewModal(title, category);
        }
    });

    window.openUiPreviewModal = openUiPreviewModal;
    window.closeUiPreviewModal = closeUiPreviewModal;
    window.renderUiView = renderUiView;
})();
