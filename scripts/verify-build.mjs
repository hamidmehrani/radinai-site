#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

function walkHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function resolveDistPath(ref) {
  const clean = ref.split('?')[0].split('#')[0];
  if (!clean || clean === '/') return path.join(DIST, 'index.html');
  if (clean === '/api/health' || clean === '/api/inquiry') return null; // Pages Functions
  const candidateFile = path.join(DIST, clean.replace(/^\/+/, ''));
  if (fs.existsSync(candidateFile) && fs.statSync(candidateFile).isFile()) return candidateFile;
  const candidateIndex = path.join(DIST, clean.replace(/^\/+|\/+$/g, ''), 'index.html');
  if (fs.existsSync(candidateIndex)) return candidateIndex;
  return false;
}

function stripTagsToVisiblePersian(html) {
  const bodyMatch = html.match(/<body[\s\S]*<\/body>/i);
  if (!bodyMatch) return '';
  let s = bodyMatch[0];
  s = s.replace(/<script[\s\S]*?<\/script>/gi, ' ');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, ' ');
  s = s.replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
  s = s.replace(/<bdi[^>]*>[\s\S]*?<\/bdi>/gi, ' ');
  s = s.replace(/<span class="cmd-kbd">[\s\S]*?<\/span>/gi, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = s.replace(/&[a-z#0-9]+;/gi, ' ');
  return s;
}

function main() {
  const htmlFiles = walkHtml(DIST);
  if (htmlFiles.length < 22) {
    console.error(`✗ Expected at least 22 HTML files in dist/, found ${htmlFiles.length}`);
    process.exit(1);
  }

  const errors = [];
  const FORBIDDEN_PATTERNS = [/omniroute/i, /router\.radinai/i, /kanban\.radinai/i, /CLOUDFLARE_API_TOKEN/];

  for (const file of htmlFiles) {
    const rel = path.relative(DIST, file);
    const raw = fs.readFileSync(file, 'utf8');

    for (const pat of FORBIDDEN_PATTERNS) {
      if (pat.test(raw)) {
        errors.push(`[${rel}] Forbidden internal string matched: ${pat}`);
      }
    }

    if (!raw.includes('lang="fa" dir="rtl"')) {
      errors.push(`[${rel}] Missing lang="fa" dir="rtl"`);
    }

    // Validate JSON-LD
    const ldMatch = raw.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
    if (!ldMatch) {
      errors.push(`[${rel}] Missing JSON-LD block`);
    } else {
      try {
        JSON.parse(ldMatch[1]);
      } catch (e) {
        errors.push(`[${rel}] Invalid JSON-LD: ${e.message}`);
      }
    }

    // Validate internal href & src references
    const refRegex = /\b(?:href|src)="(\/[^"]*)"/g;
    let m;
    while ((m = refRegex.exec(raw)) !== null) {
      const ref = m[1];
      const resolved = resolveDistPath(ref);
      if (resolved === false) {
        errors.push(`[${rel}] Broken internal reference: ${ref}`);
      }
    }

    // Validate $persian-rtl: zero unwrapped Latin digits [0-9] or unwrapped English words in visible Persian copy
    const visible = stripTagsToVisiblePersian(raw);
    const latinDigits = visible.match(/[0-9]+/g);
    if (latinDigits) {
      errors.push(`[${rel}] Unconverted Latin digits in Persian copy: ${latinDigits.slice(0, 5).join(', ')}`);
    }
    const englishLeak = visible.match(/[A-Za-z]{2,}/g);
    if (englishLeak) {
      errors.push(`[${rel}] Unwrapped English leak in Persian copy: ${englishLeak.slice(0, 5).join(', ')}`);
    }
  }

  // Check sitemap.xml & og-image.png
  if (!fs.existsSync(path.join(DIST, 'sitemap.xml'))) {
    errors.push('Missing dist/sitemap.xml');
  }
  if (!fs.existsSync(path.join(DIST, 'og-image.png'))) {
    errors.push('Missing dist/og-image.png');
  }

  if (errors.length > 0) {
    console.error(`✗ Verification FAILED with ${errors.length} error(s):`);
    for (const e of errors) console.error('  -', e);
    process.exit(1);
  }

  console.log(`✓ VERIFY PASS: ${htmlFiles.length} HTML routes verified · 0 broken links · 0 Latin digit leaks · 0 English copy leaks · valid JSON-LD & sitemap.xml`);
}

main();
