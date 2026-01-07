<?php
session_start();

// --- CEK SESI LOGIN ---
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    header("Location: index");
    exit;
}

// --- KONFIGURASI KEAMANAN ---
// Ganti token ini dengan kombinasi acak yang panjang dan sulit ditebak.
define('UPDATE_SECURITY_TOKEN', '6kX8eX85Ydz4RKZbSjFhgala0UVxzPF8Y0SMK8IV8OLuoIC84gVhdJYl4bMtAFSXgz6l5W2FEtcO1O5hz1v3ay29BC3Ufkub4zrxSWpdC3UfegCdYp9MU8cLJXj50mB9zUj61j1J2wUWbapiWmEHyDXYfzC40qr');

$message = '';
$msgType = '';

// --- LOGGING FUNCTION ---
function write_log($message) {
    $logDir = 'log_files/';
    if (!is_dir($logDir)) {
        // Create directory with write permissions
        mkdir($logDir, 0755, true);
    }
    $logFile = $logDir . 'update.log';
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] " . $message . PHP_EOL;
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// --- Recursive function to add files to zip ---
function addFolderToZip($source, $zip, $rootPath) {
    $source = realpath($source);
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($source, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($files as $file) {
        $file = realpath($file);

        // Exclude the backups directory itself
        if (strpos($file, realpath('backup_files')) === 0) {
            continue;
        }

        $relativePath = substr($file, strlen($rootPath) + 1);

        if (is_dir($file)) {
            $zip->addEmptyDir($relativePath);
        } else if (is_file($file)) {
            $zip->addFile($file, $relativePath);
        }
    }
}

// --- HANDLE UPLOAD & UPDATE ---
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['update_zip'])) {
    // 1. Validasi Token Keamanan
    if (!isset($_POST['security_token']) || $_POST['security_token'] !== UPDATE_SECURITY_TOKEN) {
        $message = "Akses tidak sah. Token keamanan tidak valid.";
        $msgType = "error";
        write_log("UPDATE FAILED: Invalid security token. IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'N/A'));
    }
    // 2. Validasi Kelas ZipArchive
    // Check if ZipArchive class exists
    elseif (!class_exists('ZipArchive')) {
        $message = "Error: Kelas ZipArchive tidak ditemukan. Pastikan ekstensi PHP Zip aktif di server Anda.";
        $msgType = "error";
        write_log("UPDATE FAILED: ZipArchive class not found.");
    } else {
        $file = $_FILES['update_zip'];
        $uploadedFileName = htmlspecialchars($file['name']);
        write_log("Update attempt started with file: $uploadedFileName");

        // 3. Validasi Error Upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $message = "Error saat mengupload file. Kode: " . $file['error'];
            $msgType = "error";
            write_log("UPDATE FAILED: File upload error code: " . $file['error']);
        } 
        // 4. Validasi Tipe File
        elseif ($file['type'] !== 'application/zip' && $file['type'] !== 'application/x-zip-compressed') {
            $message = "Error: Format file tidak valid. Harap upload file .zip.";
            $msgType = "error";
            write_log("UPDATE FAILED: Invalid file type '{$file['type']}'.");
        } 
        else {
            // --- START BACKUP PROCESS ---
            $backupDir = 'backup_files/';
            if (!is_dir($backupDir)) {
                mkdir($backupDir, 0755, true);
            }
            $backupFileName = $backupDir . 'backup-' . date('Y-m-d_H-i-s') . '.zip';
            $backupZip = new ZipArchive();

            if ($backupZip->open($backupFileName, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== TRUE) {
                $message = "Gagal membuat file backup: " . htmlspecialchars($backupFileName) . ". Pastikan folder 'admin' memiliki izin tulis.";
                $msgType = "error";
                write_log("BACKUP FAILED: Could not create zip file at '$backupFileName'. Check permissions.");
            } else {
                $sourcePath = realpath('../');
                addFolderToZip($sourcePath, $backupZip, $sourcePath);
                $backupZip->close();
                write_log("BACKUP SUCCESS: Backup created at '$backupFileName'.");
                // --- END BACKUP PROCESS ---

                // --- START UPDATE PROCESS ---
                $targetDir = "../"; // Root directory
                $zipPath = $file['tmp_name'];

                $zip = new ZipArchive;
                if ($zip->open($zipPath) === TRUE) {
                    // Daftar file yang akan di-ignore (tidak ditimpa) saat update
                    $ignoredFiles = [
                        'api/config.php',
                        // Tambahkan file lain di sini jika diperlukan
                    ];

                    $filesToExtract = [];
                    for ($i = 0; $i < $zip->numFiles; $i++) {
                        $entryName = $zip->getNameIndex($i);
                        // Normalisasi path (ubah backslash windows menjadi forward slash) untuk pengecekan
                        $normalizedEntry = str_replace('\\', '/', $entryName);
                        
                        if (!in_array($normalizedEntry, $ignoredFiles)) {
                            $filesToExtract[] = $entryName;
                        }
                    }

                    $extractStatus = $zip->extractTo($targetDir, $filesToExtract);
                    if ($extractStatus) {
                        $zip->close();
                        $message = "Update berhasil! (File config dipertahankan). Backup telah dibuat di: " . htmlspecialchars($backupFileName);
                        $msgType = "success";
                        write_log("UPDATE SUCCESS: Extracted '$uploadedFileName' to root directory.");
                    } else {
                        $zip->close();
                        $message = "Gagal mengekstrak file update. Pastikan folder root memiliki izin tulis (write permission).";
                        $msgType = "error";
                        write_log("UPDATE FAILED: Could not extract '$uploadedFileName'. Check root directory permissions.");
                    }
                } else {
                    $message = "Gagal membuka file zip update.";
                    $msgType = "error";
                    write_log("UPDATE FAILED: Could not open the uploaded zip file '$uploadedFileName'.");
                }
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Update System | Admin CRUDWorks</title>
    <link rel="icon" href="../css/favicon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- Navbar -->
    <?php 
    $pageTitle = 'Update System';
    $pageIcon = 'cloud-arrow-up';
    require_once 'header.php'; 
    ?>

    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h1 class="text-2xl font-bold text-slate-900 mb-2">Pembaruan Sistem</h1>
            <p class="text-slate-500 mb-6">Upload file `update.zip` untuk memperbarui website ke versi terbaru.</p>

            <!-- Notification -->
            <?php if ($message): ?>
            <div class="mb-6 p-4 rounded-lg <?php echo $msgType === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'; ?> flex items-start gap-3">
                <i class="fa-solid <?php echo $msgType === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'; ?> mt-1"></i>
                <div>
                    <h4 class="font-bold"><?php echo $msgType === 'success' ? 'Berhasil!' : 'Gagal!'; ?></h4>
                    <p class="text-sm"><?php echo $message; ?></p>
                </div>
            </div>
            <?php endif; ?>

            <!-- Upload Form -->
            <form method="POST" enctype="multipart/form-data" onsubmit="return confirm('PERINGATAN: Tindakan ini akan menimpa file website yang ada. Pastikan Anda sudah melakukan backup. Lanjutkan?');">
                <input type="hidden" name="security_token" value="<?php echo UPDATE_SECURITY_TOKEN; ?>">
                <div class="mb-6">
                    <label for="update_zip" class="block text-sm font-medium text-gray-700 mb-2">Pilih File Update (.zip)</label>
                    <input type="file" name="update_zip" id="update_zip" accept=".zip" required
                           class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer border border-slate-300 rounded-lg p-1">
                </div>
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all">
                    <i class="fa-solid fa-upload"></i> Upload & Update Sekarang
                </button>
                <div class="text-center mt-4">
                    <a href="backups" class="text-sm text-blue-600 hover:underline">Lihat Daftar Backup <i class="fa-solid fa-arrow-right text-xs"></i></a>
                    <span class="mx-2 text-slate-300">|</span>
                    <a href="logs" class="text-sm text-slate-500 hover:underline">Lihat Log Update <i class="fa-solid fa-arrow-right text-xs"></i></a>
                </div>
            </form>

            <!-- Warning Box -->
            <div class="mt-8 p-4 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                <h4 class="font-bold flex items-center gap-2"><i class="fa-solid fa-triangle-exclamation"></i> Peringatan Penting</h4>
                <ul class="list-disc list-inside mt-2 text-sm space-y-1">
                    <li>Fitur ini akan **menimpa** file-file yang ada di website.</li>
                    <li>Pastikan Anda telah melakukan **backup** database dan seluruh file website sebelum melanjutkan.</li>
                    <li>File zip harus memiliki struktur direktori yang benar agar file tertimpa di lokasi yang sesuai.</li>
                    <li>Kesalahan dalam proses ini dapat menyebabkan website tidak dapat diakses.</li>
                </ul>
            </div>
        </div>
    </main>
</body>
</html>