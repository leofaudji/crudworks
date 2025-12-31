<?php
if (!isset($pageTitle)) $pageTitle = 'Admin Panel';
if (!isset($pageIcon)) $pageIcon = 'screwdriver-wrench';

function navClass($targetTitle, $currentTitle) {
    $base = "text-sm font-medium flex items-center gap-2 px-3 py-1.5 rounded-lg transition";
    if ($targetTitle === $currentTitle) {
        return $base . " bg-blue-50 text-blue-600";
    }
    return $base . " text-slate-600 hover:text-blue-600 hover:bg-slate-50";
}
?>
<nav class="bg-white border-b border-slate-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <div class="flex items-center gap-3">
                <div class="bg-blue-600 text-white p-1.5 rounded-lg"><i class="fa-solid fa-<?= $pageIcon ?>"></i></div>
                <span class="font-bold text-xl tracking-tight"><?= $pageTitle ?></span>
            </div>
            <div class="flex items-center gap-4">
                <a href="index" class="<?= navClass('Admin Panel', $pageTitle) ?>">
                    <i class="fa-solid fa-box-open"></i> Produk
                </a>
                <a href="careers" class="<?= navClass('Kelola Karir', $pageTitle) ?>">
                    <i class="fa-solid fa-briefcase"></i> Karir
                </a>
                <a href="blog.php" class="<?= navClass('Manajemen Blog', $pageTitle) ?>">
                    <i class="fa-solid fa-newspaper"></i> Blog
                </a>
                <a href="messages" class="<?= navClass('Pesan Masuk', $pageTitle) ?>">
                    <i class="fa-solid fa-envelope"></i> Pesan
                </a>
                <a href="update" class="<?= navClass('Update System', $pageTitle) ?>">
                    <i class="fa-solid fa-cloud-arrow-up"></i> Update 
                </a>
                <a href="backups" class="<?= navClass('Manajemen Backup', $pageTitle) ?>">
                    <i class="fa-solid fa-database"></i> Backup
                </a>
                <a href="logs" class="<?= navClass('Log Update', $pageTitle) ?>">
                    <i class="fa-solid fa-clipboard-list"></i> Log
                </a>
                <a href="../index.html" target="_blank" class="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2">
                    <i class="fa-solid fa-external-link-alt"></i> Web
                </a>
                <a href="index?action=logout" class="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Logout</a>
            </div>
        </div>
    </div>
</nav>