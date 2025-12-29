<?php
// Set header agar browser/bot mengenali output ini sebagai XML
header("Content-Type: application/xml; charset=utf-8");
require_once 'api/db.php';

// --- KONFIGURASI BASE URL ---
// Ganti dengan domain asli saat website online
$baseUrl = 'https://www.crudworks.com';

echo '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    <!-- Halaman Statis: Beranda -->
    <url>
        <loc><?= $baseUrl ?>/</loc>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>

    <!-- Halaman Statis: Tentang Kami -->
    <url>
        <loc><?= $baseUrl ?>/tentang</loc>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>

    <!-- Halaman Statis: Karir -->
    <url>
        <loc><?= $baseUrl ?>/karir</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>

    <!-- Halaman Statis: Privacy Policy -->
    <url>
        <loc><?= $baseUrl ?>/privacy</loc>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>

    <!-- Halaman Statis: Terms of Service -->
    <url>
        <loc><?= $baseUrl ?>/tos</loc>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>

    <?php
    try {

        // Ambil data layanan/produk (Asumsi nama tabel 'services')
        $stmt = $pdo->query("SELECT id, slug, updated_at FROM services ORDER BY id DESC");

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Format URL Produk (Pretty URL)
            // Gunakan slug jika ada, jika tidak fallback ke id
            $identifier = !empty($row['slug']) ? $row['slug'] : $row['id'];
            $loc = $baseUrl . '/produk/' . $identifier;
            
            // Format Last Modified (ISO 8601)
            // Jika kolom updated_at kosong, gunakan waktu sekarang
            $lastmod = !empty($row['updated_at']) ? date('c', strtotime($row['updated_at'])) : date('c');
            ?>
    <url>
        <loc><?= htmlspecialchars($loc) ?></loc>
        <lastmod><?= $lastmod ?></lastmod> 
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>
    <?php
        }
    } catch (Exception $e) {
        // Jika koneksi gagal, sitemap tetap valid XML-nya (hanya berisi halaman statis)
        // Anda bisa uncomment baris bawah untuk debugging saat development
        // echo "<!-- Database Error: " . $e->getMessage() . " -->";
    }
    ?>
</urlset>