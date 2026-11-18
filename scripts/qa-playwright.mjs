#!/usr/bin/env node
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('/home/hamid/github/exvorta-main/node_modules/playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SHOT_DIR = process.env.QA_SHOT_DIR || path.join(ROOT, 'qa-artifacts');

const CANDIDATE_BINS = [
  '/home/hamid/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell',
  '/home/hamid/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const ROUTES = [
  '/',
  '/products/',
  '/products/daftaryar/',
  '/solutions/',
  '/solutions/web-engineering/',
  '/solutions/custom-software/',
  '/solutions/ai-automation/',
  '/solutions/enterprise/',
  '/work/',
  '/work/hamesu/',
  '/work/cvly/',
  '/work/exvorta/',
  '/work/firoza/',
  '/work/daftaryar/',
  '/work/automation-engines/',
  '/exvorta-web/',
  '/process/',
  '/pricing/',
  '/about/',
  '/contact/',
  '/faq/',
];

function startLocalServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const urlObj = new URL(req.url, 'http://127.0.0.1');
      const pathname = decodeURIComponent(urlObj.pathname);

      if (pathname === '/api/health') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ ok: true, status: 'healthy', service: 'radinai-local' }));
        return;
      }

      if (pathname === '/api/inquiry' && req.method === 'POST') {
        let body = '';
        req.on('data', (c) => { body += c; });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body || '{}');
            if (!parsed.name || !parsed.contact) {
              res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
              res.end(JSON.stringify({ ok: false, error: 'missing_required_fields' }));
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(
              JSON.stringify({
                ok: true,
                reference: 'RDN-TEST1-999',
                whatsappUrl: 'https://wa.me/989150033963',
              })
            );
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ ok: false, error: 'invalid_json' }));
          }
        });
        return;
      }

      let filePath = path.join(DIST, pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }
      if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(path.join(DIST, '404.html')));
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    });

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });
}

async function main() {
  fs.mkdirSync(SHOT_DIR, { recursive: true });
  const { server, baseUrl } = await startLocalServer();
  const executablePath = CANDIDATE_BINS.find((p) => fs.existsSync(p));
  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  const defects = [];
  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  const keyScreenshotRoutes = new Set(['/', '/products/', '/products/daftaryar/', '/solutions/', '/work/', '/exvorta-web/', '/contact/']);

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await context.newPage();

    for (const route of ROUTES) {
      const consoleErrors = [];
      const pageErrors = [];
      const onConsole = (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      };
      const onPageError = (err) => pageErrors.push(err.message);

      page.on('console', onConsole);
      page.on('pageerror', onPageError);

      const res = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
      if (!res || res.status() !== 200) {
        defects.push(`[${vp.name} ${route}] HTTP status ${res ? res.status() : 'NONE'}`);
      }

      const metrics = await page.evaluate(() => {
        const docEl = document.documentElement;
        const overflowPx = Math.max(0, docEl.scrollWidth - window.innerWidth);
        const brokenImgs = Array.from(document.querySelectorAll('img'))
          .filter((img) => img.complete && img.naturalWidth === 0)
          .map((img) => img.getAttribute('src'));

        // Check header & visible primary controls aren't clipped off-screen by overflow-x: clip
        const clippedControls = [];
        document.querySelectorAll('.site-header a, .site-header button, main h1, main .btn').forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden') return;
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return;
          if (r.left < -2 || r.right > window.innerWidth + 2) {
            clippedControls.push(`${el.tagName}.${el.className} [left=${Math.round(r.left)}, right=${Math.round(r.right)}]`);
          }
        });

        return {
          overflowPx,
          scrollWidth: docEl.scrollWidth,
          innerWidth: window.innerWidth,
          brokenImgs,
          clippedControls: clippedControls.slice(0, 5),
        };
      });

      if (metrics.overflowPx > 0) {
        defects.push(`[${vp.name} ${route}] Horizontal overflow: scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`);
      }
      if (metrics.clippedControls.length > 0) {
        defects.push(`[${vp.name} ${route}] Clipped controls outside ${metrics.innerWidth}px: ${metrics.clippedControls.join('; ')}`);
      }
      if (metrics.brokenImgs.length > 0) {
        defects.push(`[${vp.name} ${route}] Broken images: ${metrics.brokenImgs.join(', ')}`);
      }
      if (consoleErrors.length > 0) {
        defects.push(`[${vp.name} ${route}] Console errors: ${consoleErrors.join(' | ')}`);
      }
      if (pageErrors.length > 0) {
        defects.push(`[${vp.name} ${route}] Page JS errors: ${pageErrors.join(' | ')}`);
      }

      if (keyScreenshotRoutes.has(route)) {
        const slug = route === '/' ? 'home' : route.replace(/^\/+|\/+$/g, '').replace(/\//g, '-');
        await page.screenshot({
          path: path.join(SHOT_DIR, `${slug}-${vp.name}.png`),
          fullPage: route === '/',
        });
      }

      page.off('console', onConsole);
      page.off('pageerror', onPageError);
    }

    // Interactive functional E2E test on desktop & mobile
    if (vp.name === 'desktop') {
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      // Test Hero lens switch
      await page.click('[data-lens-btn="saas"]');
      const saasVisible = await page.locator('[data-lens-panel="saas"].is-active').count();
      if (saasVisible !== 1) defects.push('[E2E] Hero SaaS lens failed to activate');

      // Test Daftaryar Cockpit tab switch & Torob slider
      await page.click('[data-cockpit-tab="torob"]');
      const torobActive = await page.locator('[data-cockpit-pane="torob"].is-active').count();
      if (torobActive !== 1) defects.push('[E2E] Daftaryar cockpit Torob tab failed to activate');

      // Test Contact inquiry form submission
      await page.goto(`${baseUrl}/contact/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(800);
      await page.fill('#f-name', 'مهندس آزمایشی');
      await page.fill('#f-contact', '۰۹۱۲۰۰۰۰۰۰۰');
      await page.click('#radinai-inquiry-form [type="submit"]');
      await page.waitForSelector('#inquiry-feedback.is-ok', { timeout: 4000 });
    } else {
      // Mobile drawer open/close test
      await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
      await page.click('#mobile-menu-open');
      const openCount = await page.locator('#mobile-nav-drawer.is-open').count();
      if (openCount !== 1) defects.push('[E2E Mobile] Mobile drawer failed to open');
      await page.click('#mobile-menu-close');
    }

    await context.close();
  }

  await browser.close();
  server.close();

  if (defects.length > 0) {
    console.error(`✗ VISUAL & E2E QA FAILED (${defects.length} defect(s)):`);
    for (const d of defects) console.error('  -', d);
    process.exit(1);
  }

  console.log(`✓ PLAYWRIGHT QA PASS: ${ROUTES.length * 2} route×viewport checks (1440×900 & 390×844) · 0px overflow · 0 broken images · 0 console/JS errors · E2E interactive widgets PASS`);
}

main();
