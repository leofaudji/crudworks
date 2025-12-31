<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    // Ambil semua data atau satu data berdasarkan slug
    if (isset($_GET['slug'])) {
        $stmt = $pdo->prepare("SELECT * FROM blogs WHERE slug = ?");
        $stmt->execute([$_GET['slug']]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Blog not found"]);
        }
    } else {
        $stmt = $pdo->query("SELECT * FROM blogs ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
} 
elseif ($method == 'POST') {
    // Simpan atau Update Data
    $data = json_decode(file_get_contents("php://input"), true);
    
    $title = $data['title'];
    $category = $data['category'];
    $image = $data['image'];
    $excerpt = $data['excerpt'];
    $content = $data['content'];
    
    // Buat slug otomatis dari title jika tidak ada
    $slug = isset($data['slug']) && !empty($data['slug']) ? $data['slug'] : strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $title)));
    
    try {
        if (isset($data['id']) && !empty($data['id'])) {
            // Update
            $stmt = $pdo->prepare("UPDATE blogs SET title=?, slug=?, category=?, image=?, excerpt=?, content=? WHERE id=?");
            $stmt->execute([$title, $slug, $category, $image, $excerpt, $content, (int)$data['id']]);
        } else {
            // Insert
            $stmt = $pdo->prepare("INSERT INTO blogs (title, slug, category, image, excerpt, content) VALUES (?, ?, ?, ?, ?, ?)");
            $stmt->execute([$title, $slug, $category, $image, $excerpt, $content]);
        }
        echo json_encode(["status" => "success", "message" => "Data saved successfully"]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error: " . $e->getMessage()]);
    }
} 
elseif ($method == 'DELETE') {
    // Hapus Data
    if (isset($_GET['id'])) {
        try {
            $stmt = $pdo->prepare("DELETE FROM blogs WHERE id=?");
            $stmt->execute([(int)$_GET['id']]);
            echo json_encode(["status" => "success", "message" => "Data deleted successfully"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Error deleting record: " . $e->getMessage()]);
        }
    }
}
?>