<?php
session_start();

// --- CEK SESI LOGIN ---
if (!isset($_SESSION['is_logged_in']) || $_SESSION['is_logged_in'] !== true) {
    header("Location: index");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manajemen Blog | CRUDWorks</title>
    <link rel="icon" href="../css/favicon.png" type="image/png">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- Navbar -->
    <?php 
    $pageTitle = 'Manajemen Blog';
    $pageIcon = 'newspaper';
    require_once 'header.php'; 
    ?>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="flex justify-between items-center mb-8">
            <h2 class="text-2xl font-bold text-slate-900">Daftar Artikel</h2>
            <button onclick="openModal()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/30">
                <i class="fa-solid fa-plus"></i> Tambah Artikel
            </button>
        </div>

        <!-- Table -->
        <div class="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
            <table class="min-w-full leading-normal">
                <thead>
                    <tr>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Judul</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kategori</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tanggal</th>
                        <th class="px-5 py-3 border-b-2 border-gray-200 bg-gray-50 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody id="blog-table-body">
                    <!-- Data injected via JS -->
                </tbody>
            </table>
        </div>
    </main>

    <!-- Modal Form -->
    <div id="blogModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 hidden overflow-y-auto h-full w-full z-50">
        <div class="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-xl bg-white">
            <div class="mt-3">
                <h3 class="text-lg leading-6 font-bold text-gray-900 mb-4" id="modalTitle">Tambah Artikel Baru</h3>
                <form id="blogForm" class="space-y-4">
                    <input type="hidden" id="blogId">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Judul</label>
                        <input type="text" id="title" required class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm border p-2 focus:border-blue-500 focus:ring-blue-500 outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Kategori</label>
                            <select id="category" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm border p-2 bg-white outline-none">
                                <option>Keuangan</option>
                                <option>Teknologi</option>
                                <option>HR & People</option>
                                <option>Marketing</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">URL Gambar</label>
                            <input type="text" id="image" placeholder="https://..." class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm border p-2 outline-none">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Ringkasan (Excerpt)</label>
                        <textarea id="excerpt" rows="2" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm border p-2 outline-none"></textarea>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Konten (HTML Support)</label>
                        <textarea id="content" rows="10" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm border p-2 font-mono text-sm outline-none"></textarea>
                    </div>
                    <div class="flex justify-end gap-3 mt-6">
                        <button type="button" onclick="closeModal()" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Batal</button>
                        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Simpan</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        const API_URL = '../api/blog.php';
        let blogs = [];

        async function fetchBlogs() {
            const res = await fetch(API_URL);
            blogs = await res.json();
            renderTable();
        }

        function renderTable() {
            const tbody = document.getElementById('blog-table-body');
            tbody.innerHTML = blogs.map(blog => `
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p class="text-gray-900 whitespace-no-wrap font-bold">${blog.title}</p>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <span class="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                            <span aria-hidden class="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                            <span class="relative">${blog.category}</span>
                        </span>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p class="text-gray-900 whitespace-no-wrap">${new Date(blog.created_at).toLocaleDateString()}</p>
                    </td>
                    <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                        <button onclick="editBlog(${blog.id})" class="text-blue-600 hover:text-blue-900 mr-3 p-2 rounded hover:bg-blue-50"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button onclick="deleteBlog(${blog.id})" class="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `).join('');
        }

        function openModal(id = null) {
            document.getElementById('blogModal').classList.remove('hidden');
            if (id) {
                const blog = blogs.find(b => b.id == id);
                document.getElementById('modalTitle').innerText = 'Edit Artikel';
                document.getElementById('blogId').value = blog.id;
                document.getElementById('title').value = blog.title;
                document.getElementById('category').value = blog.category;
                document.getElementById('image').value = blog.image;
                document.getElementById('excerpt').value = blog.excerpt;
                document.getElementById('content').value = blog.content;
            } else {
                document.getElementById('modalTitle').innerText = 'Tambah Artikel Baru';
                document.getElementById('blogForm').reset();
                document.getElementById('blogId').value = '';
            }
        }

        function closeModal() {
            document.getElementById('blogModal').classList.add('hidden');
        }

        function editBlog(id) { openModal(id); }

        async function deleteBlog(id) {
            if(confirm('Yakin ingin menghapus artikel ini?')) {
                await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
                fetchBlogs();
            }
        }

        document.getElementById('blogForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('blogId').value,
                title: document.getElementById('title').value,
                category: document.getElementById('category').value,
                image: document.getElementById('image').value,
                excerpt: document.getElementById('excerpt').value,
                content: document.getElementById('content').value
            };

            await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(data)
            });
            closeModal();
            fetchBlogs();
        });

        fetchBlogs();
    </script>
</body>
</html>