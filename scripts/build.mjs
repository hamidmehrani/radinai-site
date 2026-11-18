#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { SITE_ORIGIN } from '../src/data/site.mjs';
import { SOLUTIONS } from '../src/data/solutions.mjs';
import { FLAGSHIP_PROJECTS } from '../src/data/portfolio.mjs';
import {
  renderHomePage,
  renderProductsHubPage,
  renderDaftaryarPage,
  renderSolutionsHubPage,
  renderSolutionDetailPage,
  renderWorkHubPage,
  renderWorkCasePage,
  renderExvortaWebPage,
  renderProcessPage,
  renderPricingPage,
  renderAboutPage,
  renderContactPage,
  renderFaqPage,
  render404Page,
} from '../src/templates/pages.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyTree(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return;
  ensureDir(dstDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(dstDir, entry.name);
    if (entry.isDirectory()) copyTree(s, d);
    else fs.copyFileSync(s, d);
  }
}

function computeAssetHash() {
  const h = crypto.createHash('sha256');
  for (const sub of ['src/css', 'src/js']) {
    const dir = path.join(ROOT, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isFile()) {
        h.update(fs.readFileSync(full));
      }
    }
  }
  return h.digest('hex').slice(0, 10);
}

function writeRoute(routePath, html, sitemapUrls, { inSitemap = true } = {}) {
  let outFile;
  if (routePath === '/') outFile = path.join(DIST, 'index.html');
  else if (routePath === '/404') outFile = path.join(DIST, '404.html');
  else outFile = path.join(DIST, routePath.replace(/^\/+|\/+$/g, ''), 'index.html');

  ensureDir(path.dirname(outFile));
  fs.writeFileSync(outFile, html, 'utf8');

  if (inSitemap) {
    sitemapUrls.push(`${SITE_ORIGIN}${routePath}`);
  }
}

function buildSitemap(urls) {
  const today = new Date().toISOString().slice(0, 10);
  const items = urls
    .map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>\n`;
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  const assetVersion = computeAssetHash();

  copyTree(path.join(ROOT, 'src/static'), DIST);
  copyTree(path.join(ROOT, 'src/css'), path.join(DIST, 'assets/css'));
  copyTree(path.join(ROOT, 'src/js'), path.join(DIST, 'assets/js'));

  const sitemapUrls = [];
  let count = 0;
  const emit = (route, html, opts) => {
    writeRoute(route, html, sitemapUrls, opts);
    count += 1;
  };

  emit('/', renderHomePage(assetVersion));
  emit('/products/', renderProductsHubPage(assetVersion));
  emit('/products/daftaryar/', renderDaftaryarPage(assetVersion));
  emit('/solutions/', renderSolutionsHubPage(assetVersion));
  for (const sol of SOLUTIONS) {
    emit(sol.href, renderSolutionDetailPage(sol, assetVersion));
  }
  emit('/work/', renderWorkHubPage(assetVersion));
  for (const proj of FLAGSHIP_PROJECTS) {
    emit(proj.href, renderWorkCasePage(proj, assetVersion));
  }
  emit('/exvorta-web/', renderExvortaWebPage(assetVersion));
  emit('/process/', renderProcessPage(assetVersion));
  emit('/pricing/', renderPricingPage(assetVersion));
  emit('/about/', renderAboutPage(assetVersion));
  emit('/contact/', renderContactPage(assetVersion));
  emit('/faq/', renderFaqPage(assetVersion));
  emit('/404', render404Page(assetVersion), { inSitemap: false });

  fs.writeFileSync(path.join(DIST, 'sitemap.xml'), buildSitemap(sitemapUrls), 'utf8');
  console.log(`✓ Built ${count} HTML files (${sitemapUrls.length} canonical sitemap routes) into dist/ [v=${assetVersion}]`);
}

main();
