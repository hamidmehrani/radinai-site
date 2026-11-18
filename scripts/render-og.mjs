#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('/home/hamid/github/exvorta-main/node_modules/playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CANDIDATE_BINS = [
  '/home/hamid/.cache/ms-playwright/chromium_headless_shell-1255/chrome-headless-shell-linux64/chrome-headless-shell',
  '/home/hamid/.cache/ms-playwright/chromium-1255/chrome-linux64/chrome',
];

async function main() {
  const executablePath = CANDIDATE_BINS.find((p) => fs.existsSync(p));
  const yekanB64 = fs.readFileSync(path.join(ROOT, 'src/static/fonts/YekanBakhFaNum-VF.woff2')).toString('base64');
  const iranB64 = fs.readFileSync(path.join(ROOT, 'src/static/fonts/IRANYekanXVFaNumVF.woff2')).toString('base64');

  const html = `<!DOCTYPE html>
  <html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8">
    <style>
      @font-face {
        font-family: 'YekanBakhFa';
        src: url(data:font/woff2;base64,${yekanB64}) format('woff2');
        font-weight: 100 950;
      }
      @font-face {
        font-family: 'IRANYekanXFa';
        src: url(data:font/woff2;base64,${iranB64}) format('woff2');
        font-weight: 100 1000;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1200px;
        height: 630px;
        background: radial-gradient(circle at 22% 28%, #172554 0%, #070B14 68%);
        color: #F8FAFC;
        font-family: 'IRANYekanXFa', sans-serif;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 58px 68px;
        position: relative;
        overflow: hidden;
      }
      .border-frame {
        position: absolute;
        inset: 22px;
        border: 1px solid rgba(56, 189, 248, 0.28);
        border-radius: 24px;
        pointer-events: none;
      }
      .top-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .brand {
        font-family: 'YekanBakhFa', sans-serif;
        font-size: 32px;
        font-weight: 900;
        color: #FFFFFF;
      }
      .pill {
        padding: 8px 20px;
        border-radius: 999px;
        background: rgba(45, 212, 191, 0.14);
        border: 1px solid rgba(45, 212, 191, 0.35);
        color: #2DD4BF;
        font-size: 18px;
        font-weight: 700;
      }
      h1 {
        font-family: 'YekanBakhFa', sans-serif;
        font-size: 54px;
        font-weight: 900;
        line-height: 1.28;
        max-width: 980px;
      }
      p {
        font-size: 23px;
        color: #CBD5E1;
        margin-top: 16px;
        max-width: 920px;
        line-height: 1.65;
      }
      .bottom {
        display: flex;
        gap: 24px;
      }
      .stat {
        padding: 14px 22px;
        border-radius: 14px;
        background: rgba(17, 28, 51, 0.85);
        border: 1px solid rgba(148, 163, 184, 0.22);
      }
      .stat strong {
        font-family: 'YekanBakhFa', sans-serif;
        font-size: 26px;
        color: #38BDF8;
        display: block;
      }
      .stat span {
        font-size: 16px;
        color: #94A3B8;
      }
    </style>
  </head>
  <body>
    <div class="border-frame"></div>
    <div class="top-row">
      <div class="brand">رادین هوش · radinai.ir</div>
      <div class="pill">مهندسی نرم‌افزار، هوش مصنوعی و محصولات وردپرس</div>
    </div>
    <div>
      <h1>ساخت نرم‌افزارهای سازمانی، وب‌سایت‌های تراز جهانی و افزونه جامع دفتریار</h1>
      <p>پشتوانه بیش از ۱۶٬۸۰۰ گزاره تست خودکار، تایپوگرافی اصیل فارسی و استقرار روی شبکه لبه جهانی</p>
    </div>
    <div class="bottom">
      <div class="stat"><strong>۱۴ سامانه زنده</strong><span>پلتفرم ابری و برند صادراتی</span></div>
      <div class="stat"><strong>۲٬۶۴۵ تست واحد</strong><span>هسته مالی افزونه دفتریار</span></div>
      <div class="stat"><strong>۱۰۰٪ مالکیت کد</strong><span>تحویل کامل و بدون قفل پنهان</span></div>
    </div>
  </body>
  </html>`;

  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: 'networkidle' });
  const outPath = path.join(ROOT, 'src/static/og-image.png');
  await page.screenshot({ path: outPath, type: 'png' });
  await browser.close();
  console.log(`✓ Generated OpenGraph image: ${outPath}`);
}

main();
