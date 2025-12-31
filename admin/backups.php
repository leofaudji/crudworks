<?php
session_start();

// --- CEK SESI LOGIN ---
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    header("Location: index");
    exit;
}

$backupDir = 'backup_files/';
$backups = [];
$message = '';
$msgType = '';

// --- HELPER FUNCTION ---
function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= (1 << (10 * $pow));
    return round($bytes, $precision) . ' ' . $units[$pow];
}

// --- HANDLE DELETE ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    $fileToDelete = basename($_POST['filename']);
    $filePath = realpath($backupDir . $fileToDelete);

    // Security check: ensure file is within the backup directory
    if ($filePath && strpos($filePath, realpath($backupDir)) === 0) {
        if (unlink($filePath)) {
            $message = "Backup '" . htmlspecialchars($fileToDelete) . "' berhasil dihapus.";
            $msgType = "success";
        } else {
            $message = "Gagal menghapus file. Periksa izin folder.";
            $msgType = "error";
        }
    } else {
        $message = "File tidak ditemukan atau tidak valid.";
        $msgType = "error";
    }
}

// --- SCAN FOR BACKUPS ---
if (is_dir($backupDir)) {
    $files = glob($backupDir . '*.zip');
    // Sort files by modification time, newest first
    usort($files, function($a, $b) {
        return filemtime($b) - filemtime($a);
    });

    foreach ($files as $file) {
        $backups[] = [
            'name' => basename($file),
            'path' => $file,
            'size' => formatBytes(filesize($file)),
            'date' => filemtime($file)
        ];
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Backup | Admin CRUDWorks</title>
    <link rel="icon" href="../css/favicon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- Navbar -->
    <?php 
    $pageTitle = 'Manajemen Backup';
    $pageIcon = 'database';
    require_once 'header.php'; 
    ?>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 class="text-2xl font-bold text-slate-900 mb-2">Daftar File Backup</h1>
        <p class="text-slate-500 mb-8">File backup dibuat secara otomatis saat Anda melakukan update sistem.</p>

        <!-- Notification -->
        <?php if ($message): ?>
        <div class="mb-6 p-4 rounded-lg <?php echo $msgType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'; ?>">
            <?php echo $message; ?>
        </div>
        <?php endif; ?>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table class="min-w-full leading-normal">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nama File</th>
                        <th class="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Ukuran</th>
                        <th class="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tanggal Dibuat</th>
                        <th class="px-5 py-3 border-b-2 border-slate-200 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                    <?php if (empty($backups)): ?>
                        <tr><td colspan="4" class="text-center py-10 text-slate-500">Belum ada file backup.</td></tr>
                    <?php else: foreach ($backups as $backup): ?>
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-5 py-4 text-sm font-medium text-slate-900"><?php echo htmlspecialchars($backup['name']); ?></td>
                        <td class="px-5 py-4 text-sm text-slate-600"><?php echo $backup['size']; ?></td>
                        <td class="px-5 py-4 text-sm text-slate-600"><?php echo date('d M Y, H:i', $backup['date']); ?></td>
                        <td class="px-5 py-4 text-sm text-right flex justify-end gap-2">
                            <a href="<?php echo htmlspecialchars($backup['path']); ?>" download class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Download"><i class="fa-solid fa-download"></i></a>
                            <form method="POST" onsubmit="return confirm('Anda yakin ingin menghapus file backup ini?');"><input type="hidden" name="action" value="delete"><input type="hidden" name="filename" value="<?php echo htmlspecialchars($backup['name']); ?>"><button type="submit" class="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Hapus"><i class="fa-solid fa-trash"></i></button></form>
                        </td>
                    </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
    </main>
</body>
</html>