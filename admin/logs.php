<?php
session_start();

// --- CEK SESI LOGIN ---
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    header("Location: index");
    exit;
}

$logFile = 'log_files/update.log';
$logs = [];
$message = '';
$msgType = '';

// --- HANDLE CLEAR LOG ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'clear_log') {
    if (file_exists($logFile)) {
        if (file_put_contents($logFile, '') !== false) {
            $message = "File log berhasil dibersihkan.";
            $msgType = "success";
        } else {
            $message = "Gagal membersihkan file log. Periksa izin tulis pada folder 'logs'.";
            $msgType = "error";
        }
    } else {
        $message = "File log tidak ditemukan untuk dibersihkan.";
        $msgType = "info";
    }
}

// --- READ AND PARSE LOG FILE ---
if (file_exists($logFile) && filesize($logFile) > 0) {
    $lines = file($logFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $lines = array_reverse($lines); // Show newest first

    foreach ($lines as $line) {
        // Regex to parse: [YYYY-MM-DD HH:MM:SS] STATUS: Message
        if (preg_match('/\[(.*?)\]\s(.*?):\s(.*)/', $line, $matches)) {
            $status = strtoupper(trim($matches[2]));
            $logEntry = [
                'timestamp' => $matches[1],
                'status' => $status,
                'message' => $matches[3]
            ];

            // Determine status color
            if (strpos($status, 'SUCCESS') !== false) {
                $logEntry['color'] = 'green';
            } elseif (strpos($status, 'FAILED') !== false) {
                $logEntry['color'] = 'red';
            } else {
                $logEntry['color'] = 'gray';
            }
            $logs[] = $logEntry;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log Update | Admin CRUDWorks</title>
    <link rel="icon" href="../css/favicon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- Navbar -->
    <?php 
    $pageTitle = 'Log Update';
    $pageIcon = 'clipboard-list';
    require_once 'header.php'; 
    ?>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">Riwayat Log Update Sistem</h1>
                <p class="text-slate-500">Menampilkan catatan aktivitas dari proses update sistem.</p>
            </div>
            <form method="POST" onsubmit="return confirm('Anda yakin ingin membersihkan semua riwayat log? Tindakan ini tidak dapat dibatalkan.');">
                <input type="hidden" name="action" value="clear_log">
                <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all">
                    <i class="fa-solid fa-eraser"></i> Bersihkan Log
                </button>
            </form>
        </div>

        <!-- Notification -->
        <?php if ($message): ?>
        <div class="mb-6 p-4 rounded-lg <?php echo $msgType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'; ?>"><?php echo $message; ?></div>
        <?php endif; ?>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-auto max-h-[75vh]">
                <table class="min-w-full leading-normal">
                    <thead class="bg-slate-50 sticky top-0 z-10">
                        <tr>
                            <th class="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-48">Timestamp</th>
                            <th class="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider w-40">Status</th>
                            <th class="px-5 py-3 border-b-2 border-slate-200 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Pesan</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php if (empty($logs)): ?>
                            <tr><td colspan="3" class="text-center py-10 text-slate-500">File log kosong atau tidak ditemukan.</td></tr>
                        <?php else: foreach ($logs as $log): ?>
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-5 py-4 text-sm text-slate-600 font-mono whitespace-nowrap"><?php echo htmlspecialchars($log['timestamp']); ?></td>
                            <td class="px-5 py-4 text-sm">
                                <span class="px-2.5 py-1 rounded-full text-xs font-bold 
                                    <?php 
                                        if ($log['color'] === 'green') echo 'bg-green-100 text-green-800';
                                        elseif ($log['color'] === 'red') echo 'bg-red-100 text-red-800';
                                        else echo 'bg-slate-100 text-slate-800';
                                    ?>">
                                    <?php echo htmlspecialchars($log['status']); ?>
                                </span>
                            </td>
                            <td class="px-5 py-4 text-sm text-slate-800"><?php echo htmlspecialchars($log['message']); ?></td>
                        </tr>
                        <?php endforeach; endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</body>
</html>