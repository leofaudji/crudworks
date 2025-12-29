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

// --- HANDLE FORM SUBMISSION ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (isset($_POST['action'])) {
            // DELETE
            if ($_POST['action'] === 'delete' && isset($_POST['id'])) {
                $stmt = $pdo->prepare("DELETE FROM careers WHERE id = ?");
                $stmt->execute([$_POST['id']]);
                $message = "Lowongan berhasil dihapus!";
                $msgType = "success";
            } 
            // SAVE (INSERT / UPDATE)
            elseif ($_POST['action'] === 'save') {
                $title = $_POST['title'];
                $location = $_POST['location'];
                $type = $_POST['type'];
                $status = $_POST['status'];

                if (!empty($_POST['id'])) {
                    // UPDATE
                    $sql = "UPDATE careers SET title=?, location=?, type=?, status=? WHERE id=?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$title, $location, $type, $status, $_POST['id']]);
                    $message = "Lowongan berhasil diperbarui!";
                } else {
                    // INSERT
                    $sql = "INSERT INTO careers (title, location, type, status) VALUES (?, ?, ?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$title, $location, $type, $status]);
                    $message = "Lowongan berhasil ditambahkan!";
                }
                $msgType = "success";
            }
        }
    } catch (PDOException $e) {
        $message = "Database Error: " . $e->getMessage();
        $msgType = "error";
    }
}

// --- FETCH DATA ---
$stmt = $pdo->query("SELECT * FROM careers ORDER BY created_at DESC");
$careers = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kelola Karir | Admin CRUDWorks</title>
    <link rel="icon" href="../css/favicon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- Navbar -->
    <nav class="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center gap-3">
                    <div class="bg-blue-600 text-white p-1.5 rounded-lg"><i class="fa-solid fa-briefcase"></i></div>
                    <span class="font-bold text-xl tracking-tight">Kelola Karir</span>
                </div>
                <div class="flex items-center gap-4">
                    <a href="index" class="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">
                        <i class="fa-solid fa-box-open"></i> Kelola Produk
                    </a>
                    <a href="messages" class="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition">
                        <i class="fa-solid fa-envelope"></i> Pesan Masuk
                    </a>
                    <a href="../index.html" target="_blank" class="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-2">
                        Lihat Website <i class="fa-solid fa-external-link-alt"></i>
                    </a>
                    <a href="index?action=logout" class="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition">Logout</a>
                </div>
            </div>
        </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex justify-between items-center mb-8">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">Daftar Lowongan</h1>
                <p class="text-slate-500 text-sm mt-1">Total <?php echo count($careers); ?> lowongan terdaftar.</p>
            </div>
            <button onclick="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                <i class="fa-solid fa-plus"></i> Tambah Lowongan
            </button>
        </div>

        <?php if ($message): ?>
        <div class="mb-6 p-4 rounded-lg <?php echo $msgType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'; ?> flex items-center justify-between">
            <span><?php echo $message; ?></span>
            <button onclick="this.parentElement.remove()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <?php endif; ?>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div class="overflow-auto max-h-[75vh]">
                <table class="w-full text-left text-sm text-slate-600">
                    <thead class="bg-slate-50 text-slate-900 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th class="px-6 py-4">Posisi</th>
                            <th class="px-6 py-4">Lokasi</th>
                            <th class="px-6 py-4">Tipe</th>
                            <th class="px-6 py-4">Status</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($careers as $job): ?>
                        <tr>
                            <td class="px-6 py-4 font-bold text-slate-900"><?php echo htmlspecialchars($job['title']); ?></td>
                            <td class="px-6 py-4"><?php echo htmlspecialchars($job['location']); ?></td>
                            <td class="px-6 py-4"><?php echo htmlspecialchars($job['type']); ?></td>
                            <td class="px-6 py-4">
                                <span class="px-2.5 py-1 rounded-full text-xs font-medium <?php echo $job['status'] === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'; ?>">
                                    <?php echo $job['status']; ?>
                                </span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <button onclick='editData(<?php echo json_encode($job); ?>)' class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><i class="fa-solid fa-pen-to-square"></i></button>
                                <form method="POST" onsubmit="return confirm('Hapus lowongan ini?');" class="inline">
                                    <input type="hidden" name="action" value="delete">
                                    <input type="hidden" name="id" value="<?php echo $job['id']; ?>">
                                    <button type="submit" class="p-2 text-red-600 hover:bg-red-50 rounded-lg"><i class="fa-solid fa-trash"></i></button>
                                </form>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- Modal -->
    <div id="modal" class="fixed inset-0 z-50 hidden overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen">
            <div class="fixed inset-0 bg-gray-900 bg-opacity-75" onclick="closeModal()"></div>
            <div class="bg-white rounded-2xl shadow-xl transform transition-all sm:max-w-lg w-full z-10">
                <form method="POST" id="jobForm">
                    <input type="hidden" name="action" value="save">
                    <input type="hidden" name="id" id="inp_id">
                    <div class="p-6">
                        <h3 class="text-lg font-bold text-gray-900 mb-5" id="modal-title">Tambah Lowongan</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Posisi</label>
                                <input type="text" name="title" id="inp_title" required class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
                                <input type="text" name="location" id="inp_location" required class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                                    <select name="type" id="inp_type" class="w-full rounded-lg border-gray-300 border px-3 py-2 bg-white outline-none">
                                        <option>Full Time</option>
                                        <option>Contract</option>
                                        <option>Internship</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select name="status" id="inp_status" class="w-full rounded-lg border-gray-300 border px-3 py-2 bg-white outline-none">
                                        <option>Open</option>
                                        <option>Closed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 px-6 py-3 flex flex-row-reverse gap-2">
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Simpan</button>
                        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">Batal</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const modal = document.getElementById('modal');
        const form = document.getElementById('jobForm');
        const modalTitle = document.getElementById('modal-title');

        function openModal() {
            form.reset();
            document.getElementById('inp_id').value = '';
            modalTitle.innerText = 'Tambah Lowongan Baru';
            modal.classList.remove('hidden');
        }

        function closeModal() {
            modal.classList.add('hidden');
        }

        function editData(data) {
            document.getElementById('inp_id').value = data.id;
            document.getElementById('inp_title').value = data.title;
            document.getElementById('inp_location').value = data.location;
            document.getElementById('inp_type').value = data.type;
            document.getElementById('inp_status').value = data.status;
            modalTitle.innerText = 'Edit Lowongan: ' + data.title;
            modal.classList.remove('hidden');
        }
    </script>
</body>
</html>