const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const changelogPath = path.join(rootDir, 'CHANGELOG.md');
const versionJsonPath = path.join(rootDir, 'version.json');
const versionJsPath = path.join(rootDir, 'js', 'version.js');

function parseChangelog() {
    if (!fs.existsSync(changelogPath)) {
        console.error('File CHANGELOG.md tidak ditemukan di:', changelogPath);
        process.exit(1);
    }

    const content = fs.readFileSync(changelogPath, 'utf8');
    const versionRegex = /##\s*\[([0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9.]+)?)]\s*-\s*([0-9]{4}-[0-9]{2}-[0-9]{2})/g;
    
    const releases = [];
    let match;
    while ((match = versionRegex.exec(content)) !== null) {
        releases.push({
            version: match[1],
            date: match[3],
            startIndex: match.index
        });
    }

    if (releases.length === 0) {
        console.error('Tidak ada entri versi ditemukan di CHANGELOG.md');
        process.exit(1);
    }

    // Ambil isi untuk tiap release
    for (let i = 0; i < releases.length; i++) {
        const start = releases[i].startIndex;
        const end = (i + 1 < releases.length) ? releases[i + 1].startIndex : content.length;
        const rawSection = content.substring(start, end).trim();
        
        // Ambil baris setelah header versi
        const lines = rawSection.split('\n');
        lines.shift(); // Buang baris header "## [x.y.z] - yyyy-mm-dd"
        
        releases[i].notes = lines.join('\n').trim();
    }

    const latest = releases[0];

    return {
        latestVersion: latest.version,
        releaseDate: latest.date,
        assetVersion: latest.version,
        totalReleases: releases.length,
        releases: releases.map(r => ({
            version: r.version,
            date: r.date,
            notes: r.notes
        }))
    };
}

function updateHtmlFiles(assetVersion) {
    const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
    let updatedCount = 0;

    htmlFiles.forEach(file => {
        const filePath = path.join(rootDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // 1. Update css/style.css?v=...
        const styleRegex = /href=(["'])css\/style\.css(\?[^"']*)?\1/g;
        if (styleRegex.test(content)) {
            content = content.replace(styleRegex, `href="css/style.css?v=${assetVersion}"`);
            modified = true;
        }

        // 2. Ganti blok document.write lama untuk app.js (pada index.html dan tentang.html)
        const docWriteRegex = /<script>\s*const today = new Date\(\);\s*const dateStr = [^;]+;\s*document\.write\('<script src="js\/app\.js\?d=' \+ dateStr \+ '"><\\\/script>'\);\s*<\/script>/g;
        if (docWriteRegex.test(content)) {
            content = content.replace(docWriteRegex, `<script src="js/app.js?v=${assetVersion}" defer></script>`);
            modified = true;
        }

        // 3. Update script src="js/app.js?v=..."
        const scriptRegex = /src=(["'])js\/app\.js(\?[^"']*)?\1/g;
        if (scriptRegex.test(content)) {
            content = content.replace(scriptRegex, `src="js/app.js?v=${assetVersion}"`);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            updatedCount++;
            console.log(`[UPDATED] ${file} -> asset version v=${assetVersion}`);
        }
    });

    return updatedCount;
}

function run() {
    console.log('--- GENERATING ASSET VERSION FROM CHANGELOG.MD ---');
    const changelogData = parseChangelog();
    const versionString = changelogData.assetVersion;

    console.log(`Versi Terakhir Terdeteksi: v${changelogData.latestVersion} (${changelogData.releaseDate})`);

    // 1. Simpan version.json
    fs.writeFileSync(versionJsonPath, JSON.stringify(changelogData, null, 2), 'utf8');
    console.log(`[GENERATED] version.json`);

    // 2. Simpan js/version.js untuk akses runtime frontend
    const jsContent = `/**
 * Otomatis di-generate dari CHANGELOG.md
 * Waktu generate: ${new Date().toISOString()}
 */
window.APP_VERSION = ${JSON.stringify(changelogData.latestVersion)};
window.APP_RELEASE_DATE = ${JSON.stringify(changelogData.releaseDate)};
window.APP_ASSET_VERSION = ${JSON.stringify(changelogData.assetVersion)};
`;
    fs.writeFileSync(versionJsPath, jsContent, 'utf8');
    console.log(`[GENERATED] js/version.js`);

    // 3. Update aset di semua berkas HTML
    const count = updateHtmlFiles(versionString);
    console.log(`[COMPLETE] Selesai menyinkronkan ${count} file HTML dengan versi ${versionString}.`);
}

run();

