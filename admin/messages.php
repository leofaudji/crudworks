<?php
session_start();
require_once '../api/db.php';

// --- CEK SESI LOGIN ---
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    header("Location: index");
    exit;
}

$message = '';
$msgType = '';

// --- HANDLE DELETE ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'delete') {
    if (isset($_POST['id'])) {
        try {
            $stmt = $pdo->prepare("DELETE FROM messages WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            $message = "Pesan berhasil dihapus.";
            $msgType = "success";
        } catch (PDOException $e) {
            $message = "Gagal menghapus pesan: " . $e->getMessage();
            $msgType = "error";
        }
    }
}

// --- FETCH DATA ---
$limit = 10; // Jumlah pesan per halaman
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
if ($page < 1) $page = 1;
$offset = ($page - 1) * $limit;
$search = isset($_GET['search']) ? trim($_GET['search']) : '';

// Query Total Data (dengan filter search)
$countSql = "SELECT COUNT(*) FROM messages";
if ($search) {
    $countSql .= " WHERE name LIKE :search OR email LIKE :search";
}
$totalStmt = $pdo->prepare($countSql);
if ($search) {
    $totalStmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
}
$totalStmt->execute();
$totalMessages = $totalStmt->fetchColumn();
$totalPages = ceil($totalMessages / $limit);

// Query Data (dengan filter search)
$sql = "SELECT * FROM messages";
if ($search) {
    $sql .= " WHERE name LIKE :search OR email LIKE :search";
}
$sql .= " ORDER BY created_at DESC LIMIT :limit OFFSET :offset";

$stmt = $pdo->prepare($sql);
if ($search) {
    $stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
}
$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pesan Masuk | Admin CRUDWorks</title>
    <link rel="icon" href="../css/favicon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- Navbar -->
    <?php 
    $pageTitle = 'Pesan Masuk';
    $pageIcon = 'envelope';
    require_once 'header.php'; 
    ?>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">Kotak Masuk</h1>
                <p class="text-slate-500 text-sm mt-1">Total <?php echo $totalMessages; ?> pesan diterima.</p>
            </div>
            <!-- Search Bar -->
            <form method="GET" class="flex items-center gap-2">
                <div class="relative">
                    <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input type="text" name="search" value="<?php echo htmlspecialchars($search); ?>" placeholder="Cari nama atau email..." class="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64">
                </div>
                <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">Cari</button>
                <?php if($search): ?>
                    <a href="messages" class="bg-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-300 transition">Reset</a>
                <?php endif; ?>
            </form>
        </div>

        <!-- Notification -->
        <?php if ($message): ?>
        <div class="mb-6 p-4 rounded-lg <?php echo $msgType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'; ?> flex items-center justify-between">
            <div class="flex items-center gap-3">
                <i class="fa-solid <?php echo $msgType === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'; ?>"></i>
                <span><?php echo $message; ?></span>
            </div>
            <button onclick="this.parentElement.remove()" class="text-sm opacity-70 hover:opacity-100"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <?php endif; ?>

        <!-- Table -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-auto max-h-[75vh]">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th class="px-6 py-4 w-16">ID</th>
                            <th class="px-6 py-4">Tanggal</th>
                            <th class="px-6 py-4">Pengirim</th>
                            <th class="px-6 py-4">Pesan</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($messages as $msg): ?>
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 font-mono text-xs text-slate-400">#<?php echo $msg['id']; ?></td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <div class="text-slate-900 font-medium"><?php echo date('d M Y', strtotime($msg['created_at'])); ?></div>
                                <div class="text-xs text-slate-500"><?php echo date('H:i', strtotime($msg['created_at'])); ?> WIB</div>
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-bold text-slate-900"><?php echo htmlspecialchars($msg['name']); ?></div>
                                <div class="text-xs text-blue-600"><?php echo htmlspecialchars($msg['email']); ?></div>
                            </td>
                            <td class="px-6 py-4">
                                <p class="line-clamp-2 text-slate-600" title="<?php echo htmlspecialchars($msg['message']); ?>">
                                    <?php echo htmlspecialchars($msg['message']); ?>
                                </p>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <form method="POST" onsubmit="return confirm('Hapus pesan ini?');">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?php echo $msg['id']; ?>">
                                    <button type="submit" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                        <i class="fa-solid fa-trash"></i>
                                    </button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if(empty($messages)): ?>
                            <tr><td colspan="5" class="px-6 py-8 text-center text-slate-500">Belum ada pesan masuk.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Pagination -->
        <?php if ($totalPages > 1): ?>
        <div class="flex justify-center mt-8">
            <nav class="flex items-center gap-2">
                <!-- Previous -->
                <?php if ($page > 1): ?>
                    <a href="?page=<?php echo $page - 1; ?>&search=<?php echo urlencode($search); ?>" class="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition">
                        <i class="fa-solid fa-chevron-left"></i>
                    </a>
                <?php endif; ?>

                <!-- Page Numbers -->
                <?php for ($i = 1; $i <= $totalPages; $i++): ?>
                    <a href="?page=<?php echo $i; ?>&search=<?php echo urlencode($search); ?>" class="w-10 h-10 flex items-center justify-center rounded-lg border <?php echo $i === $page ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600'; ?> transition font-medium">
                        <?php echo $i; ?>
                    </a>
                <?php endfor; ?>

                <!-- Next -->
                <?php if ($page < $totalPages): ?>
                    <a href="?page=<?php echo $page + 1; ?>&search=<?php echo urlencode($search); ?>" class="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition">
                        <i class="fa-solid fa-chevron-right"></i>
                    </a>
                <?php endif; ?>
            </nav>
        </div>
        <?php endif; ?>
    </main>
</body>
</html>