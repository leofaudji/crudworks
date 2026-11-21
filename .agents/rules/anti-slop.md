# Aturan Rekayasa & Anti-AI Slop Proyek CRUDWorks ERP

Seluruh agen AI dan pengembang yang bekerja pada repositori ini wajib mematuhi aturan baku dari 7 skill yang terpasang di `.agents/skills/`:

1. **taste-skill (`.agents/skills/taste-skill/SKILL.md`)**:
   - Pertahankan estetika enterprise SaaS: Cloudflare-style dock sidebar + Windows 11 taskbar & start menu.
   - Gunakan tipografi finansial monospace (`font-mono tabular-nums`) untuk kode faktur, tanggal, dan nilai mata uang.
   - Hindari template landing page generik atau gradien warna AI klise (seperti gradien ungu-biru).

2. **anti-slop & stop-slop (`.agents/skills/anti-slop/SKILL.md`, `.agents/skills/stop-slop/SKILL.md`)**:
   - Pertahankan arsitektur Native PHP 8.3 + Vanilla JS (ES Modules) tanpa membengkakkan dependensi `node_modules`.
   - Hindari komentar kode basa-basi yang tidak memiliki nilai teknis.
   - Setiap elemen antarmuka, tombol, dan API wajib memiliki fungsi operasional nyata ke database.

3. **impeccable (`.agents/skills/impeccable/SKILL.md`)**:
   - Presisi kerajinan antarmuka (*design engineering*): jaga jarak lega (*breathing room*) minimal 28px pada kolom tepi tabel dan toolbar agar tidak mepet garis batas kartu.
   - Pertahankan responsivitas horisontal, indikator bayangan scroll, dan format cetak dokumen faktur A4.

4. **humanizer & avoid-ai-writing (`.agents/skills/humanizer/SKILL.md`, `.agents/skills/avoid-ai-writing/SKILL.md`)**:
   - Tulis teks antarmuka dan dokumentasi menggunakan Bahasa Indonesia operasional bisnis yang wajar, bukan terjemahan mesin yang kaku.
   - Dokumentasi dan changelog ditulis secara ringkas, padat informasi, tanpa pengantar klise yang bertele-tele.

5. **no-ai-slop (`.agents/skills/no-ai-slop/SKILL.md`)**:
   - Tidak menggunakan data pura-pura (*mock/dummy*), selalu gunakan entitas database nyata dengan sanitasi prepared statement, autentikasi bcrypt, sesi Redis, dan validasi CSRF token.
