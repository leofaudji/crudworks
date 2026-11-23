<?php
/**
 * Dynamic HTML Minifier for CRUDWorks
 * Keeps source .html files readable while serving single-line minified HTML to browsers.
 */

$requested = isset($_GET['file']) ? (string)$_GET['file'] : 'index.html';
$requested = ltrim(str_replace('\\', '/', $requested), '/');

// Security: disallow path traversal & only allow local .html files
if ($requested === '' || strpos($requested, '..') !== false || !preg_match('/^[a-zA-Z0-9_\/-]+\.html$/', $requested)) {
    http_response_code(404);
    exit('Not Found');
}

$baseDir = realpath(__DIR__);
$targetPath = realpath($baseDir . DIRECTORY_SEPARATOR . $requested);

if ($targetPath === false || strpos($targetPath, $baseDir) !== 0 || !is_file($targetPath)) {
    http_response_code(404);
    $notFound = $baseDir . DIRECTORY_SEPARATOR . '404.html';
    if (is_file($notFound)) {
        $targetPath = $notFound;
    } else {
        exit('Not Found');
    }
}

$html = file_get_contents($targetPath);
if ($html === false) {
    http_response_code(500);
    exit('Read Error');
}

/**
 * Resolve latest semantic version dynamically from CHANGELOG.md (fallback: version.json).
 */
function getLatestChangelogVersion(string $baseDir): string {
    $changelogPath = $baseDir . DIRECTORY_SEPARATOR . 'CHANGELOG.md';
    if (is_file($changelogPath)) {
        $md = @file_get_contents($changelogPath);
        if ($md !== false && preg_match('/^##\s*\[([0-9]+\.[0-9]+\.[0-9]+)\]/m', $md, $m)) {
            return $m[1];
        }
    }
    $versionJsonPath = $baseDir . DIRECTORY_SEPARATOR . 'version.json';
    if (is_file($versionJsonPath)) {
        $json = json_decode((string)@file_get_contents($versionJsonPath), true);
        if (is_array($json) && !empty($json['assetVersion'])) {
            return preg_replace('/[^0-9A-Za-z._-]/', '', (string)$json['assetVersion']);
        }
    }
    return '2.10.0';
}

$assetVersion = getLatestChangelogVersion($baseDir);
$html = preg_replace('/(\.(?:js|css)\?v=)[0-9]+\.[0-9]+\.[0-9]+/', '${1}' . $assetVersion, $html);

/**
 * Strip JS line/block comments safely without touching URLs inside string literals.
 */
function minifyInlineJs(string $js): string {
    $out = '';
    $len = strlen($js);
    $inQuote = '';
    $escaped = false;

    for ($i = 0; $i < $len; $i++) {
        $ch = $js[$i];
        $next = ($i + 1 < $len) ? $js[$i + 1] : '';

        if ($inQuote !== '') {
            if ($inQuote === '`') {
                // Keep newlines inside template literals escaped/safe or space-collapsed?
                // Replace raw newlines inside JS template literals with \n so single-line JS stays valid
                if ($ch === "\r") continue;
                if ($ch === "\n") {
                    $out .= ' ';
                    continue;
                }
            }
            $out .= $ch;
            if ($escaped) {
                $escaped = false;
            } elseif ($ch === '\\') {
                $escaped = true;
            } elseif ($ch === $inQuote) {
                $inQuote = '';
            }
            continue;
        }

        if ($ch === '"' || $ch === "'" || $ch === '`') {
            $inQuote = $ch;
            $out .= $ch;
            continue;
        }

        // Line comment //
        if ($ch === '/' && $next === '/') {
            $i += 2;
            while ($i < $len && $js[$i] !== "\n") {
                $i++;
            }
            $out .= ' ';
            continue;
        }

        // Block comment /* ... */
        if ($ch === '/' && $next === '*') {
            $i += 2;
            while ($i + 1 < $len && !($js[$i] === '*' && $js[$i + 1] === '/')) {
                $i++;
            }
            $i++;
            $out .= ' ';
            continue;
        }

        if ($ch === "\r" || $ch === "\n" || $ch === "\t") {
            $out .= ' ';
            continue;
        }

        $out .= $ch;
    }

    return trim(preg_replace('/ {2,}/', ' ', $out));
}

function minifyInlineCss(string $css): string {
    $css = preg_replace('!/\*.*?\*/!s', '', $css);
    $css = preg_replace('/\s+/', ' ', $css);
    $css = str_replace(['; ', ': ', ' {', '{ ', ' }', '} ', ', '], [';', ':', '{', '{', '}', '}', ','], $css);
    return trim($css);
}

$placeholders = [];
$placeholderIdx = 0;

// 1. Protect <pre> and <textarea> completely
$html = preg_replace_callback('/<(pre|textarea)\b[^>]*>.*?<\/\1>/is', function ($m) use (&$placeholders, &$placeholderIdx) {
    $key = '___MINIFY_PH_' . ($placeholderIdx++) . '___';
    $placeholders[$key] = $m[0];
    return $key;
}, $html);

// 2. Minify <style> blocks and store
$html = preg_replace_callback('/<style\b([^>]*)>(.*?)<\/style>/is', function ($m) use (&$placeholders, &$placeholderIdx) {
    $key = '___MINIFY_PH_' . ($placeholderIdx++) . '___';
    $placeholders[$key] = '<style' . $m[1] . '>' . minifyInlineCss($m[2]) . '</style>';
    return $key;
}, $html);

// 3. Minify <script> blocks (both inline JS and JSON-LD) and store
$html = preg_replace_callback('/<script\b([^>]*)>(.*?)<\/script>/is', function ($m) use (&$placeholders, &$placeholderIdx) {
    $key = '___MINIFY_PH_' . ($placeholderIdx++) . '___';
    $attrs = $m[1];
    $body = trim($m[2]);
    if ($body !== '') {
        if (stripos($attrs, 'application/ld+json') !== false) {
            $decoded = json_decode($body);
            $body = ($decoded !== null) ? json_encode($decoded, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) : preg_replace('/\s+/', ' ', $body);
        } else {
            $body = minifyInlineJs($body);
        }
    }
    $placeholders[$key] = '<script' . $attrs . '>' . $body . '</script>';
    return $key;
}, $html);

// 4. Strip HTML comments (keep IE conditionals if any)
$html = preg_replace('/<!--(?!\[if\b).*?-->/s', '', $html);

// 5. Collapse all newlines & redundant whitespace to a single line
$html = str_replace(["\r\n", "\r", "\n", "\t"], ' ', $html);
$html = preg_replace('/ {2,}/', ' ', $html);
$html = preg_replace('/>\s+</', '><', $html);

// 6. Restore protected/minified blocks
if (!empty($placeholders)) {
    $html = strtr($html, $placeholders);
}

header('Content-Type: text/html; charset=UTF-8');
echo trim($html);
