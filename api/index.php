<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

// Router Sederhana
if ($method === 'GET' && $endpoint === 'services') {
    // Ambil data services
    $stmt = $pdo->prepare("SELECT * FROM services");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} elseif ($method === 'POST' && $endpoint === 'contact') {
    // Terima input JSON dari Frontend
    $input = json_decode(file_get_contents('php://input'), true);

    // 1. Proteksi Honeypot Anti-Spam Bot
    if (!empty($input['website_check'])) {
        // Bot mengisi hidden input, diamkan & beri respon sukses tanpa insert ke DB
        echo json_encode(['status' => 'success', 'message' => 'Pesan terkirim!']);
        exit;
    }

    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $message = trim($input['message'] ?? '');

    // Sanitasi input
    $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');
    
    if(!empty($name) && !empty($email)) {
        $stmt = $pdo->prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
        if($stmt->execute([$name, $email, $message])) {
            echo json_encode(['status' => 'success', 'message' => 'Pesan terkirim! Terima kasih telah menghubungi kami.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan pesan']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
    }

} elseif ($method === 'GET' && $endpoint === 'careers') {
    // Ambil data lowongan kerja yang statusnya 'Open'
    $stmt = $pdo->prepare("SELECT * FROM careers WHERE status = 'Open' ORDER BY created_at DESC");
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));

} elseif ($method === 'GET' && ($endpoint === 'version' || $endpoint === 'changelog')) {
    // Ambil metadata versi dari version.json yang di-generate dari CHANGELOG.md
    $versionFile = __DIR__ . '/../version.json';
    if (file_exists($versionFile)) {
        echo file_get_contents($versionFile);
    } else {
        echo json_encode([
            'latestVersion' => '2.5.0',
            'releaseDate' => '2026-11-03',
            'assetVersion' => '2.5.0'
        ]);
    }

} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found']);
}
?>