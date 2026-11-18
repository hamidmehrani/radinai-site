#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const LH_CLI = '/home/hamid/nutave-b12-verify/work/node_modules/lighthouse/cli/index.js';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function startGzipServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const u = new URL(req.url || '/', 'http://127.0.0.1');
      const p = decodeURIComponent(u.pathname);
      let fp = path.join(DIST, p === '/' ? 'index.html' : p);
      if (fs.existsSync(fp) && fs.statSync(fp).isDirectory()) {
        fp = path.join(fp, 'index.html');
      }
      if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) {
        res.writeHead(404);
        res.end();
        return;
      }
      const ext = path.extname(fp).toLowerCase();
      const ct = MIME[ext] || 'application/octet-stream';
      const ae = req.headers['accept-encoding'] || '';
      const cc = p.startsWith('/fonts/') || p.startsWith('/assets/')
        ? 'public, max-age=31536000, immutable'
        : 'public, max-age=600';

      if (/\.(html|css|js|svg|webmanifest)$/i.test(fp) && ae.includes('gzip')) {
        res.writeHead(200, { 'Content-Type': ct, 'Content-Encoding': 'gzip', 'Cache-Control': cc });
        fs.createReadStream(fp).pipe(zlib.createGzip()).pipe(res);
      } else {
        res.writeHead(200, { 'Content-Type': ct, 'Cache-Control': cc });
        fs.createReadStream(fp).pipe(res);
      }
    });

    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
  });
}

async function runAudit(port, route, preset) {
  const slug = (route.replace(/[^a-z0-9]/gi, '_') || 'home') + '_' + preset;
  const outJson = `/tmp/lh-radinai-${slug}.json`;
  const args = [
    LH_CLI,
    `http://127.0.0.1:${port}${route}`,
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage',
    '--output=json',
    `--output-path=${outJson}`,
    '--quiet',
  ];
  if (preset === 'desktop') args.push('--preset=desktop');

  await execFileAsync('node', args, {
    env: { ...process.env, CHROME_PATH: '/usr/bin/google-chrome' },
    timeout: 90000,
  });

  const r = JSON.parse(fs.readFileSync(outJson, 'utf8'));
  const cats = Object.fromEntries(
    Object.entries(r.categories).map(([k, v]) => [k, Math.round((v.score || 0) * 100)])
  );
  return {
    route,
    preset,
    perf: cats.performance,
    a11y: cats.accessibility,
    bp: cats['best-practices'],
    seo: cats.seo,
    lcpMs: Math.round(r.audits['largest-contentful-paint']?.numericValue || 0),
    tbtMs: Math.round(r.audits['total-blocking-time']?.numericValue || 0),
    cls: Number((r.audits['cumulative-layout-shift']?.numericValue || 0).toFixed(3)),
  };
}

async function main() {
  if (!fs.existsSync(LH_CLI)) {
    console.log('Lighthouse CLI not found at expected path; skipping.');
    return;
  }
  const { server, port } = await startGzipServer();
  try {
    for (const [route, preset] of [['/', 'desktop'], ['/', 'mobile'], ['/products/daftaryar/', 'desktop']]) {
      const res = await runAudit(port, route, preset);
      console.log('LH:', JSON.stringify(res));
    }
  } finally {
    server.close();
  }
}

main();
