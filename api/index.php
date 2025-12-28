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
    
    if(!empty($input['name']) && !empty($input['email'])) {
        $stmt = $pdo->prepare("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)");
        if($stmt->execute([$input['name'], $input['email'], $input['message']])) {
            echo json_encode(['status' => 'success', 'message' => 'Pesan terkirim!']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan pesan']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Data tidak lengkap']);
    }

} else {
    http_response_code(404);
    echo json_encode(['message' => 'Endpoint not found']);
}
?>
