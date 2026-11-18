import { SITE_ORIGIN, BRAND, NAV_LINKS, COMMAND_PALETTE_ITEMS } from '../data/site.mjs';
import { esc, ltr } from '../data/format.mjs';
import { renderBrandGlyphSvg } from './schematics.mjs';

function isNavActive(currentPath, itemHref) {
  if (itemHref === '/') return currentPath === '/';
  return currentPath === itemHref || currentPath.startsWith(itemHref);
}

export function renderShell({
  routePath,
  title,
  description,
  schemaJson = null,
  assetVersion = '1',
  mainHtml,
}) {
  const canonical = routePath === '/404' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${routePath}`;
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND.nameFa,
    url: SITE_ORIGIN,
    description: BRAND.taglineFa,
    email: `mailto:${BRAND.email}`,
    sameAs: [BRAND.githubUrl],
  };

  const jsonLd = JSON.stringify(schemaJson || defaultSchema);

  const navDesktopHtml = NAV_LINKS.map((item) => {
    const active = isNavActive(routePath, item.href) ? ' is-active' : '';
    const badge = item.badge ? `<span class="nav-badge">${esc(item.badge)}</span>` : '';
    return `<a href="${item.href}" class="nav-item${active}">${esc(item.label)}${badge}</a>`;
  }).join('');

  const navMobileHtml = NAV_LINKS.map((item) => {
    const active = isNavActive(routePath, item.href) ? ' is-active' : '';
    const badge = item.badge ? `<span class="nav-badge">${esc(item.badge)}</span>` : '';
    return `<a href="${item.href}" class="mobile-nav-link${active}"><span>${esc(item.label)}</span>${badge}</a>`;
  }).join('');

  const cmdItemsHtml = COMMAND_PALETTE_ITEMS.map(
    (c) => `<a href="${c.href}" class="cmd-result-item" data-search="${esc(c.title)} ${esc(c.meta)}">
      <span class="cmd-result-title">${esc(c.title)}</span>
      <span class="cmd-result-meta">${esc(c.meta)}</span>
    </a>`
  ).join('');

  return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#070B14">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="fa_IR">
  <meta property="og:site_name" content="${esc(BRAND.nameFa)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE_ORIGIN}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE_ORIGIN}/og-image.png">

  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
  <link rel="manifest" href="/manifest.webmanifest">

  <link rel="preload" href="/fonts/YekanBakhFaNum-VF.woff2" as="font" type="font/woff2" crossorigin="anonymous">
  <link rel="preload" href="/fonts/IRANYekanXVFaNumVF.woff2" as="font" type="font/woff2" crossorigin="anonymous">

  <link rel="stylesheet" href="/assets/css/tokens.css?v=${assetVersion}">
  <link rel="stylesheet" href="/assets/css/shell.css?v=${assetVersion}">
  <link rel="stylesheet" href="/assets/css/components.css?v=${assetVersion}">

  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <a href="#main-content" class="skip-link">پرش به محتوای اصلی</a>
  <div id="scroll-laser" aria-hidden="true"></div>

  <div class="telemetry-bar">
    <div class="container telemetry-inner">
      <div class="telemetry-status">
        <span class="pulse-dot" aria-hidden="true"></span>
        <span>استودیو مهندسی رادین هوش · ظرفیت پذیرش پروژه جدید باز است</span>
      </div>
      <div class="telemetry-meta">
        <span>۱۴ سامانه زنده · +۱۶٬۸۰۰ گزاره تست خودکار</span>
        <a href="${BRAND.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="telemetry-link">واتس‌اپ مستقیم: ${esc(BRAND.whatsappDisplayFa)}</a>
        <a href="mailto:${BRAND.email}" class="telemetry-link">${ltr(BRAND.email)}</a>
      </div>
    </div>
  </div>

  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="brand-mark" aria-label="صفحه اصلی رادین هوش">
        <span class="brand-glyph">${renderBrandGlyphSvg()}</span>
        <span class="brand-text">
          <span class="brand-title">${esc(BRAND.nameFa)}</span>
          <span class="brand-sub">نرم‌افزار، هوش مصنوعی و محصولات وردپرس</span>
        </span>
      </a>

      <nav class="primary-nav" aria-label="منوی اصلی">
        ${navDesktopHtml}
      </nav>

      <div class="header-actions">
        <button type="button" class="cmd-trigger" data-open-cmd aria-label="جستجوی سریع صفحات">
          <span>جستجوی سریع</span>
          <span class="cmd-kbd">Ctrl K</span>
        </button>
        <a href="/contact/" class="btn btn-primary btn-sm btn-header-cta" data-magnetic>سفارش پروژه</a>
        <button type="button" class="mobile-menu-btn" id="mobile-menu-open" aria-label="باز کردن منوی موبایل" aria-expanded="false" aria-controls="mobile-nav-drawer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-drawer" id="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="منوی موبایل">
    <div class="mobile-drawer-panel">
      <div>
        <div class="mobile-drawer-head">
          <span class="brand-title">${esc(BRAND.nameFa)}</span>
          <button type="button" class="mobile-close-btn" id="mobile-menu-close">بستن</button>
        </div>
        <nav class="mobile-nav-list" aria-label="لینک‌های موبایل">
          ${navMobileHtml}
          <a href="/about/" class="mobile-nav-link${routePath === '/about/' ? ' is-active' : ''}"><span>درباره رادین هوش</span></a>
          <a href="/faq/" class="mobile-nav-link${routePath === '/faq/' ? ' is-active' : ''}"><span>پرسش‌های متداول</span></a>
        </nav>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <a href="/products/daftaryar/" class="btn btn-copper">مشاهده افزونه دفتریار</a>
        <a href="/contact/" class="btn btn-primary">مشاوره و ثبت سفارش</a>
      </div>
    </div>
  </div>

  <div class="cmd-modal" id="cmd-modal" role="dialog" aria-modal="true" aria-label="پالت جستجوی سریع">
    <div class="cmd-dialog">
      <div class="cmd-search-bar">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5" stroke-linecap="round"/>
        </svg>
        <input type="search" id="cmd-input" class="cmd-input" placeholder="جستجوی محصول وردپرس، راهکار سازمانی یا پرونده مهندسی..." aria-label="عبارت جستجو">
        <button type="button" class="mobile-close-btn" id="cmd-close">بستن</button>
      </div>
      <div class="cmd-results">
        ${cmdItemsHtml}
      </div>
    </div>
  </div>

  <main id="main-content">
    ${mainHtml}
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-top-card vf-card-dark">
        <div class="footer-cta-copy">
          <h2>آماده ساخت محصول بعدی یا تجهیز فروشگاه ووکامرس خود هستید؟</h2>
          <p>از تهیه لایسنس دائمی افزونه ۱۰ ماژوله «دفتریار» تا معماری و پیاده‌سازی صفرتاصد سامانه اختصاصی سازمان شما؛ تیم مهندسی رادین هوش در کنار شماست.</p>
        </div>
        <div class="footer-cta-actions">
          <a href="/contact/" class="btn btn-lapis-glow" data-magnetic>شروع گفتگو و دریافت برآورد</a>
          <a href="/products/daftaryar/" class="btn btn-outline-dark">بررسی افزونه دفتریار</a>
        </div>
      </div>

      <div class="footer-grid">
        <div class="footer-col">
          <a href="/" class="brand-mark">
            <span class="brand-glyph">${renderBrandGlyphSvg()}</span>
            <span class="brand-title">${esc(BRAND.nameFa)}</span>
          </a>
          <p class="footer-brand-desc">${esc(BRAND.taglineFa)}. تمرکز بر کیفیت کد بانکی، تست خودکار هزارگانه، تایپوگرافی اصیل فارسی و استقرار فوق‌سریع روی لبه.</p>
          <div class="footer-contact-chips">
            <button type="button" class="copy-chip" data-copy="${BRAND.email}" data-copy-msg="ایمیل رسمی رادین هوش کپی شد">
              <span>کپی ایمیل:</span> ${ltr(BRAND.email)}
            </button>
            <a href="${BRAND.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="copy-chip">
              <span>واتس‌اپ: ${esc(BRAND.whatsappDisplayFa)}</span>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h3>محصولات و راهکارها</h3>
          <ul>
            <li><a href="/products/">هاب محصولات وردپرس</a></li>
            <li><a href="/products/daftaryar/">افزونه جامع دفتریار (نسخه ۱٫۰)</a></li>
            <li><a href="/solutions/web-engineering/">طراحی وب‌سایت اختصاصی و چندزبانه</a></li>
            <li><a href="/solutions/custom-software/">توسعه نرم‌افزار صفرتاصد و ابری</a></li>
            <li><a href="/solutions/ai-automation/">اتوماسیون و ایجنت‌های هوش مصنوعی</a></li>
            <li><a href="/solutions/enterprise/">راهکارهای نرم‌افزاری سازمانی</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>پرونده‌های مهندسی زنده</h3>
          <ul>
            <li><a href="/work/">نمایشگاه کامل پروژه‌ها</a></li>
            <li><a href="/work/hamesu/">همه‌سو — فروشگاه‌ساز چندمستأجره</a></li>
            <li><a href="/work/cvly/">سی‌ولی — کاریابی هوشمند ایران</a></li>
            <li><a href="/work/exvorta/">اگزورتا — سیستم‌عامل تجارت جهانی</a></li>
            <li><a href="/work/firoza/">فیروزه — آتلیه ۱۰ زبانه نیشابور</a></li>
            <li><a href="/exvorta-web/">۶ برند صادراتی بین‌المللی</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h3>استودیو و همکاری</h3>
          <ul>
            <li><a href="/process/">فرآیند ۵ مرحله‌ای مهندسی</a></li>
            <li><a href="/pricing/">تعرفه‌ها و تخمین‌گر هوشمند</a></li>
            <li><a href="/about/">درباره رادین هوش و کارنامه</a></li>
            <li><a href="/faq/">پرسش‌های متداول فنی و حقوقی</a></li>
            <li><a href="/contact/">ثبت استعلام و مشاوره معماری</a></li>
            <li><a href="/api/health">وضعیت سلامت سرویس لبه</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-monument" aria-hidden="true">
        <span class="footer-monument-word">رادین هوش</span>
      </div>

      <div class="footer-bottom">
        <span>© ۱۴۰۵ ${esc(BRAND.nameFa)} — تمامی حقوق مادی و معنوی محفوظ است.</span>
        <span>${esc(BRAND.locationFa)} · مستقر روی شبکه لبه جهانی کلودفلر</span>
      </div>
    </div>
  </footer>

  <div class="rdn-toast" id="rdn-toast" role="status" aria-live="polite"></div>

  <script defer src="/assets/js/vendor/gsap.min.js?v=${assetVersion}"></script>
  <script defer src="/assets/js/vendor/ScrollTrigger.min.js?v=${assetVersion}"></script>
  <script defer src="/assets/js/vendor/lenis.min.js?v=${assetVersion}"></script>
  <script defer src="/assets/js/app.js?v=${assetVersion}"></script>
  <script defer src="/assets/js/motion.js?v=${assetVersion}"></script>
</body>
</html>`;
}
