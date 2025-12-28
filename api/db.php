<?php
$host = 'localhost';
$db   = 'web_crudworks';
$user = 'root'; // Sesuaikan dengan user database Anda
$pass = '';     // Sesuaikan dengan password database Anda

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed']));
}
?>
