<?php
session_start();
require_once '../api/db.php';

// --- KONFIGURASI LOGIN ---
$adminUser = 'faudji';
$adminPass = '272727'; // Ganti dengan password yang lebih kuat

// --- LOGOUT HANDLER ---
if (isset($_GET['action']) && $_GET['action'] === 'logout') {
    session_destroy();
    header("Location: index");
    exit;
}

// --- LOGIN HANDLER ---
$loginError = '';
if (isset($_POST['do_login'])) {
    if ($_POST['username'] === $adminUser && $_POST['password'] === $adminPass) {
        $_SESSION['is_logged_in'] = true;
        header("Location: index");
        exit;
    } else {
        $loginError = "Username atau Password salah!";
    }
}

// --- CEK SESI LOGIN ---
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Admin | CRUDWorks</title>
    <link rel="icon" href="../css/favicon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold text-center mb-6 text-slate-800">Login Admin</h2>
        <?php if($loginError): ?><div class="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center"><?= $loginError ?></div><?php endif; ?>
        <form method="POST">
            <input type="hidden" name="do_login" value="1">
            <div class="mb-4"><label class="block text-sm font-medium text-slate-700 mb-1">Username</label><input type="text" name="username" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required></div>
            <div class="mb-6"><label class="block text-sm font-medium text-slate-700 mb-1">Password</label><input type="password" name="password" class="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required></div>
            <button type="submit" class="w-full bg-blue-600 text-white py-2.5 rounded-lg font-bold hover:bg-blue-700 transition">Masuk</button>
        </form>
    </div>
</body>
</html>
<?php exit; }

$message = '';
$msgType = '';

// --- HANDLE FORM SUBMISSION ---
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (isset($_POST['action'])) {
            // DELETE
            if ($_POST['action'] === 'delete' && isset($_POST['id'])) {
                $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
                if ($stmt->execute([$_POST['id']])) {
                    $message = "Data berhasil dihapus!";
                    $msgType = "success";
                }
            } 
            // SAVE (INSERT / UPDATE)
            elseif ($_POST['action'] === 'save') {
                // Prepare Variables
                $title = $_POST['title'];
                $slug = $_POST['slug'];
                
                // Auto-generate slug jika kosong
                if (empty($slug)) {
                    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
                }

                $category = $_POST['category'];
                $description = $_POST['description'];
                $detailed_description = $_POST['detailed_description'];
                $icon = $_POST['icon'];
                $price = $_POST['price'];
                $discount_price = !empty($_POST['discount_price']) ? $_POST['discount_price'] : NULL;
                $badge = !empty($_POST['badge']) ? $_POST['badge'] : NULL;
                
                // Handle Features (Textarea newline -> JSON)
                $featuresRaw = $_POST['features'];
                // Pecah berdasarkan baris baru
                $featuresArray = array_filter(array_map('trim', preg_split('/[\r\n]+/', $featuresRaw)));
                // Re-index array keys & encode
                $featuresJson = json_encode(array_values($featuresArray));

                if (!empty($_POST['id'])) {
                    // UPDATE
                    $sql = "UPDATE services SET title=?, slug=?, category=?, description=?, detailed_description=?, icon=?, price=?, discount_price=?, features=?, badge=? WHERE id=?";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$title, $slug, $category, $description, $detailed_description, $icon, $price, $discount_price, $featuresJson, $badge, $_POST['id']]);
                    $message = "Data berhasil diperbarui!";
                } else {
                    // INSERT
                    $sql = "INSERT INTO services (title, slug, category, description, detailed_description, icon, price, discount_price, features, badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$title, $slug, $category, $description, $detailed_description, $icon, $price, $discount_price, $featuresJson, $badge]);
                    $message = "Data berhasil ditambahkan!";
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
$stmt = $pdo->query("SELECT * FROM services ORDER BY id DESC");
$services = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | CRUDWorks</title>
    <link rel="icon" href="../css/favicon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: { wa: { teal: '#2563eb' } }
                }
            }
        }
    </script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- Navbar -->
    <?php 
    $pageTitle = 'Admin Panel';
    $pageIcon = 'screwdriver-wrench';
    require_once 'header.php'; 
    ?>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <!-- Header & Add Button -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">Kelola Produk & Layanan</h1>
                <p class="text-slate-500 text-sm mt-1">Total <?php echo count($services); ?> layanan terdaftar.</p>
            </div>
            <button onclick="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2">
                <i class="fa-solid fa-plus"></i> Tambah Produk
            </button>
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
                            <th class="px-6 py-4">Info Produk</th>
                            <th class="px-6 py-4">Slug (URL)</th>
                            <th class="px-6 py-4">Kategori</th>
                            <th class="px-6 py-4">Harga</th>
                            <th class="px-6 py-4 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        <?php foreach ($services as $svc): ?>
                        <tr class="hover:bg-slate-50 transition-colors">
                            <td class="px-6 py-4 font-mono text-xs text-slate-400">#<?php echo $svc['id']; ?></td>
                            <td class="px-6 py-4">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                                        <i class="fa-solid fa-<?php echo $svc['icon']; ?>"></i>
                                    </div>
                                    <div>
                                        <div class="font-bold text-slate-900"><?php echo htmlspecialchars($svc['title']); ?></div>
                                        <?php if($svc['badge']): ?>
                                            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wide mt-1"><?php echo $svc['badge']; ?></span>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </td>
                            <td class="px-6 py-4 font-mono text-xs text-blue-600 bg-blue-50/50 rounded px-2 py-1 w-fit">
                                /<?php echo htmlspecialchars($svc['slug']); ?>
                            </td>
                            <td class="px-6 py-4">
                                <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">
                                    <?php echo $svc['category']; ?>
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <div class="font-medium text-slate-900"><?php echo $svc['price']; ?></div>
                                <?php if($svc['discount_price']): ?>
                                    <div class="text-xs text-red-500 font-bold">Disc: <?php echo $svc['discount_price']; ?></div>
                                <?php endif; ?>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <button onclick='editData(<?php echo json_encode($svc); ?>)' class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <form method="POST" onsubmit="return confirm('Yakin ingin menghapus data ini?');" class="inline">
                                        <input type="hidden" name="action" value="delete">
                                        <input type="hidden" name="id" value="<?php echo $svc['id']; ?>">
                                        <button type="submit" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                        <?php endforeach; ?>
                        <?php if(empty($services)): ?>
                            <tr><td colspan="6" class="px-6 py-8 text-center text-slate-500">Belum ada data produk.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- Modal Form -->
    <div id="modal" class="fixed inset-0 z-50 hidden overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onclick="closeModal()"></div>
            <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div class="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
                <form method="POST" id="productForm">
                    <input type="hidden" name="action" value="save">
                    <input type="hidden" name="id" id="inp_id">

                    <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <h3 class="text-lg leading-6 font-bold text-gray-900 mb-5" id="modal-title">Tambah Produk Baru</h3>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <!-- Title -->
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label>
                                <input type="text" name="title" id="inp_title" required oninput="generateSlug()" class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                            </div>
                            <!-- Slug -->
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                                <input type="text" name="slug" id="inp_slug" placeholder="otomatis-terisi" class="w-full rounded-lg border-gray-300 border px-3 py-2 bg-slate-50 text-slate-600 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <!-- Category -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                                <select name="category" id="inp_category" class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                                    <option value="finance">Finance</option>
                                    <option value="hr">HR</option>
                                    <option value="operational">Operational</option>
                                </select>
                            </div>
                            <!-- Icon -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Icon (FontAwesome)</label>
                                <input type="text" name="icon" id="inp_icon" placeholder="contoh: user" required class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                            </div>
                            <!-- Badge -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Badge (Opsional)</label>
                                <input type="text" name="badge" id="inp_badge" placeholder="Best Seller / New" class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <!-- Price -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Harga Normal</label>
                                <input type="text" name="price" id="inp_price" placeholder="Rp 199rb/bln" class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                            </div>
                            <!-- Discount Price -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-1">Harga Diskon (Opsional)</label>
                                <input type="text" name="discount_price" id="inp_discount_price" placeholder="Rp 99rb/bln" class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                            </div>
                        </div>

                        <!-- Description -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat</label>
                            <textarea name="description" id="inp_description" rows="2" required class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
                        </div>

                        <!-- Detailed Description -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi Lengkap (HTML Support)</label>
                            <textarea name="detailed_description" id="inp_detailed_description" rows="3" class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-mono text-sm"></textarea>
                        </div>

                        <!-- Features -->
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Fitur (Satu per baris)</label>
                            <textarea name="features" id="inp_features" rows="4" placeholder="Fitur 1&#10;Fitur 2&#10;Fitur 3" class="w-full rounded-lg border-gray-300 border px-3 py-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
                            <p class="text-xs text-gray-400 mt-1">* Masukkan setiap fitur pada baris baru.</p>
                        </div>
                    </div>

                    <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2">
                        <button type="submit" class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
                            Simpan Data
                        </button>
                        <button type="button" onclick="closeModal()" class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const modal = document.getElementById('modal');
        const form = document.getElementById('productForm');
        const modalTitle = document.getElementById('modal-title');

        function openModal() {
            // Reset Form untuk mode Tambah
            form.reset();
            document.getElementById('inp_id').value = '';
            modalTitle.innerText = 'Tambah Produk Baru';
            modal.classList.remove('hidden');
        }

        function closeModal() {
            modal.classList.add('hidden');
        }

        function editData(data) {
            // Isi Form untuk mode Edit
            document.getElementById('inp_id').value = data.id;
            document.getElementById('inp_title').value = data.title;
            document.getElementById('inp_slug').value = data.slug;
            document.getElementById('inp_category').value = data.category;
            document.getElementById('inp_icon').value = data.icon;
            document.getElementById('inp_price').value = data.price;
            document.getElementById('inp_discount_price').value = data.discount_price || '';
            document.getElementById('inp_badge').value = data.badge || '';
            document.getElementById('inp_description').value = data.description;
            document.getElementById('inp_detailed_description').value = data.detailed_description || '';

            // Parse JSON Features ke Textarea (newline separated)
            try {
                const features = JSON.parse(data.features);
                if (Array.isArray(features)) {
                    document.getElementById('inp_features').value = features.join('\n');
                }
            } catch (e) {
                document.getElementById('inp_features').value = data.features;
            }

            modalTitle.innerText = 'Edit Produk: ' + data.title;
            modal.classList.remove('hidden');
        }

        // Auto Generate Slug dari Title
        function generateSlug() {
            const title = document.getElementById('inp_title').value;
            const slugInput = document.getElementById('inp_slug');
            
            // Hanya generate jika slug kosong atau user sedang mengetik judul baru (mode tambah)
            const id = document.getElementById('inp_id').value;
            
            if (!id || slugInput.value === '') {
                let slug = title.toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter aneh
                    .replace(/\s+/g, '-')         // Spasi jadi dash
                    .replace(/-+/g, '-');         // Hapus dash berlebih
                slugInput.value = slug;
            }
        }

        // Close modal on outside click
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }
    </script>
</body>
</html>