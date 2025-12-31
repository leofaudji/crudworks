<?php
// d:\xampp\htdocs\crudworks\api\clients.php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Konfigurasi Folder
$sourceDir = '../client/';

// Pastikan folder client ada
if (!is_dir($sourceDir)) {
    echo json_encode([]);
    exit;
}

$files = scandir($sourceDir);
$clients = [];

foreach ($files as $file) {
    $filePath = $sourceDir . $file;
    $fileInfo = pathinfo($filePath);
    
    // Skip jika bukan file atau hidden file
    if (!is_file($filePath) || strpos($file, '.') === 0) continue;

    $ext = strtolower($fileInfo['extension'] ?? '');
    
    // Hanya ambil gambar (jpg, jpeg, png, webp, svg)
    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'svg'])) {
        $fileName = $fileInfo['filename'];
        
        // Langsung gunakan file asli
        $clients[] = [
            'name' => ucfirst(str_replace(['-', '_'], ' ', $fileName)),
            'url' => 'client/' . $file // URL relatif ke file asli
        ];
    }
}

// Acak urutan logo sebelum dikirim
shuffle($clients);

echo json_encode($clients);
?>