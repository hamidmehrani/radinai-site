import { SITE_ORIGIN, BRAND, HERO_LENSES, MACRO_STATS, ENGINEERING_STAGES, FAQ_ITEMS } from '../data/site.mjs';
import { DAFTARYAR_PRODUCT, YAAR_FAMILY_ROADMAP } from '../data/wordpress-products.mjs';
import { SOLUTIONS, ESTIMATOR_TRACKS } from '../data/solutions.mjs';
import { FLAGSHIP_PROJECTS, EXVORTA_WEB_BRANDS } from '../data/portfolio.mjs';
import { esc, ltr } from '../data/format.mjs';
import { renderShell } from './layout.mjs';
import {
  renderDaftaryarCockpit,
  renderProjectCard,
  renderExvortaBrandCard,
  renderEstimatorWidget,
} from './widgets.mjs';
import { renderDaftaryarSchematicSvg, renderAutomationSchematicSvg } from './schematics.mjs';

/* 1. HOME PAGE (/) */
export function renderHomePage(assetVersion) {
  const lensTabs = HERO_LENSES.map(
    (l, idx) => `<button type="button" class="lens-tab-btn${idx === 0 ? ' is-active' : ''}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}" data-lens-btn="${l.id}" data-lens-status="${esc(l.statusText)}">${esc(l.tabLabel)}</button>`
  ).join('');

  const lensPanels = HERO_LENSES.map(
    (l, idx) => `<div class="lens-panel${idx === 0 ? ' is-active' : ''}" data-lens-panel="${l.id}">
      <h2 class="lens-headline">${esc(l.headline)}</h2>
      <p class="lens-summary">${esc(l.summary)}</p>
      <div class="lens-nodes-grid">
        ${l.nodes
          .map(
            (n) => `<div class="lens-node${n.tone === 'turquoise' ? ' lens-node--turquoise' : n.tone === 'copper' ? ' lens-node--copper' : ''}">
              <div class="lens-node-title">${esc(n.title)}</div>
              <div class="lens-node-sub">${esc(n.sub)}</div>
            </div>`
          )
          .join('')}
      </div>
      <div class="lens-metrics-bar">
        ${l.metrics
          .map(
            (m) => `<div>
              <div class="lens-metric-val">${esc(m.value)}</div>
              <div class="lens-metric-lbl">${esc(m.label)}</div>
            </div>`
          )
          .join('')}
      </div>
      <a href="${l.ctaHref}" class="lens-footer-link">${esc(l.ctaLabel)} ←</a>
    </div>`
  ).join('');

  const mainHtml = `
    <section class="stage-dark hero-stage">
      <div class="hero-ambient" aria-hidden="true"><span class="hero-ambient-orb hero-ambient-orb--a"></span><span class="hero-ambient-orb hero-ambient-orb--b"></span><span class="hero-ambient-sweep"></span></div>
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content hero-grid">
        <div>
          <span class="eyebrow-pill eyebrow-pill--dark">
            <span class="pulse-dot" aria-hidden="true"></span>
            <span>استودیو مهندسی نرم‌افزار، هوش مصنوعی و محصولات وردپرس</span>
          </span>
          <h1 class="hero-title">مهندسی سامانه‌های نرم‌افزاری، اتوماسیون هوشمند و محصولات آماده فروشگاهی</h1>
          <p class="hero-desc">
            در رادین هوش، نرم‌افزار سازمانی، وب‌سایت‌های چندزبانه تراز جهانی و افزونه‌های مالی ووکامرس را با استاندارد نرم‌افزارهای بانکی می‌سازیم؛ با بیش از ۱۶٬۸۰۰ گزاره تست خودکار، تایپوگرافی اصیل فارسی و استقرار روی لبه.
          </p>
          <div class="hero-cta-row">
            <a href="/contact/" class="btn btn-lapis-glow" data-magnetic>مشاوره معماری و ثبت پروژه</a>
            <a href="/products/daftaryar/" class="btn btn-copper" data-magnetic>افزونه وردپرس دفتریار (نسخه ۱٫۰)</a>
            <a href="/work/" class="btn btn-outline-dark">مشاهده ۱۴ سامانه و برند زنده</a>
          </div>
          <div class="hero-trust-strip">
            <span class="hero-trust-item"><span class="hero-trust-check">✓</span> مالکیت ۱۰۰٪ سورس‌کد برای کارفرما</span>
            <span class="hero-trust-item"><span class="hero-trust-check">✓</span> تست خودکار واحد و ممیزی موبایل</span>
            <span class="hero-trust-item"><span class="hero-trust-check">✓</span> امتیاز سرعت بالای ۹۵ روی کلودفلر</span>
          </div>
        </div>

        <div class="hero-workbench" id="hero-workbench">
          <div class="workbench-top">
            <div class="workbench-dots" aria-hidden="true"><span></span><span></span><span></span></div>
            <span class="workbench-status-pill" id="workbench-status-pill">${esc(HERO_LENSES[0].statusText)}</span>
          </div>
          <div class="lens-tabs" role="tablist" aria-label="حوزه‌های تخصصی رادین هوش">
            ${lensTabs}
          </div>
          ${lensPanels}
        </div>
      </div>
    </section>

    <section class="stats-ribbon" aria-label="شاخص‌های مهندسی تاییدشده">
      <div class="container stats-grid">
        ${MACRO_STATS.map(
          (s) => `<div class="stat-tile">
            <div class="stat-value">${esc(s.value)}</div>
            <div class="stat-label">${esc(s.label)}</div>
            <p class="stat-detail">${esc(s.detail)}</p>
          </div>`
        ).join('')}
      </div>
    </section>

    <section class="stage-light" id="wordpress-flagship">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--copper-light">محصول پرچم‌دار وردپرس و ووکامرس ایران</span>
            <h2 class="section-title">افزونه جامع «دفتریار» — پایان دوران نصب ده افزونه ناسازگار</h2>
            <p class="section-lead">
              اولین محصول رسمی خانواده افزونه‌های «یار» با ۲٬۶۴۵ تست واحد خودکار آماده است: فاکتور رسمی، سامانه مودیان، کارت‌به‌کارت ضدتقلب، ترب زنده با گارد سود اقساطی، چاپ برچسب پستی و گارانتی در یک هسته واحد.
            </p>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <a href="/products/daftaryar/" class="btn btn-primary">برگه کامل دفتریار (${esc(DAFTARYAR_PRODUCT.priceDisplayFa)})</a>
            <a href="/products/" class="btn btn-outline-light">مشاهده خانواده محصولات وردپرس</a>
          </div>
        </div>
        ${renderDaftaryarCockpit({ showFullLink: true })}
      </div>
    </section>

    <section class="stage-sheet" id="solutions">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">خدمات و راهکارهای مهندسی رادین هوش</span>
            <h2 class="section-title">از طراحی وب‌سایت اختصاصی تا توسعه صفرتاصد نرم‌افزار و اتوماسیون سازمانی</h2>
            <p class="section-lead">
              چه به یک وب‌سایت صادراتی چندزبانه نیاز داشته باشید و چه به یک پلتفرم پیچیده سازمانی یا ایجنت هوشمند پردازش اسناد؛ راهکار دقیقاً بر اساس معماری کسب‌وکار شما طراحی و ساخته می‌شود.
            </p>
          </div>
          <a href="/solutions/" class="btn btn-outline-light">مقایسه کامل ۴ مسیر خدمات</a>
        </div>
        <div class="solutions-bento">
          ${SOLUTIONS.map(
            (s) => `<article class="solution-card vf-card-light">
              <div class="solution-card-top">
                <span class="work-cat-tag">${esc(s.badge)}</span>
                <h3><a href="${s.href}">${esc(s.title)}</a></h3>
                <p>${esc(s.shortDesc)}</p>
              </div>
              <div>
                <div class="solution-metrics-mini">
                  ${s.metrics.map((m) => `<span class="mini-stat-chip">${esc(m.value)} · ${esc(m.label)}</span>`).join('')}
                </div>
                <div style="margin-top:16px;">
                  <a href="${s.href}" class="card-arrow-link">بررسی جزئیات فنی و تحویل‌دادنی‌ها ←</a>
                </div>
              </div>
            </article>`
          ).join('')}
        </div>
      </div>
    </section>

    <section class="stage-light" id="flagship-works">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">سامانه‌های پروداکشن و محصولات ساخته‌شده</span>
            <h2 class="section-title">شواهد زنده مهندسی — پلتفرم‌هایی که در دنیای واقعی کار می‌کنند</h2>
            <p class="section-lead">
              هر پروژه زیر یک سامانه واقعی با هزاران خط کد تست‌شده و معماری مستند است. روی هر پرونده کلیک کنید تا چالش اولیه، معماری فنی و خروجی تاییدشده آن را ببینید.
            </p>
          </div>
          <a href="/work/" class="btn btn-primary">مشاهده همه پرونده‌های مهندسی</a>
        </div>

        <div class="filter-toolbar" data-work-filter-group="home-works-grid">
          <div class="filter-pills" role="group" aria-label="فیلتر دسته‌بندی پروژه‌ها">
            <button type="button" class="filter-btn is-active" data-filter="all">همه سامانه‌ها (۶)</button>
            <button type="button" class="filter-btn" data-filter="commerce">تجارت الکترونیک و وردپرس</button>
            <button type="button" class="filter-btn" data-filter="saas">پلتفرم‌های ابری و سازمانی</button>
            <button type="button" class="filter-btn" data-filter="ai">هوش مصنوعی و اتوماسیون</button>
          </div>
        </div>

        <div class="works-grid" id="home-works-grid">
          ${FLAGSHIP_PROJECTS.map((p) => renderProjectCard(p)).join('')}
        </div>
      </div>
    </section>

    <section class="stage-dark" id="exvorta-cinema">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--dark">پورتفولیوی بین‌المللی استودیو</span>
            <h2 class="section-title">۶ وب‌سایت صادراتی چندزبانه زنده روی شبکه لبه جهانی</h2>
            <p class="section-lead">
              نمونه‌های عینی توان طراحی و مهندسی چندزبانه ما در زیرمجموعه بین‌المللی ${ltr('Exvorta Web')} — از آتلیه زعفران و پسته تا خانه شمش طلای دبی و مصالح معماری با نمایش هم‌زمان دسکتاپ و موبایل.
            </p>
          </div>
          <a href="/exvorta-web/" class="btn btn-lapis-glow" data-magnetic>ورود به نمایشگاه کامل ۶ برند</a>
        </div>

        <div class="cinema-reel">
          ${EXVORTA_WEB_BRANDS.map((b) => renderExvortaBrandCard(b)).join('')}
        </div>
      </div>
    </section>

    <section class="stage-sheet" id="process">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">چرخه مهندسی بدون حدس و گمان</span>
            <h2 class="section-title">چگونه پروژه‌های پیچیده را دقیق، سریع و بدون بدهی فنی تحویل می‌دهیم؟</h2>
            <p class="section-lead">
              فرآیند ۵ مرحله‌ای رادین هوش تضمین می‌کند که هر صفحه و هر ماژول پیش از انتشار از فیلتر مرجع واقعی، تست واحد و ممیزی مستقل موبایل و دسکتاپ عبور کرده باشد.
            </p>
          </div>
          <a href="/process/" class="btn btn-outline-light">جزئیات آزمایشگاه کنترل کیفیت</a>
        </div>

        <div class="process-grid">
          ${ENGINEERING_STAGES.map(
            (st) => `<div class="process-card vf-card-light">
              <div>
                <span class="process-step-num">${esc(st.step)} · ${esc(st.role)}</span>
                <h3>${esc(st.title)}</h3>
                <p>${esc(st.description)}</p>
              </div>
              <div class="process-deliverable">خروجی: ${esc(st.deliverable)}</div>
            </div>`
          ).join('')}
        </div>
      </div>
    </section>

    <section class="stage-light" id="instant-estimator">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">برآوردگر شفاف زمان و بودجه</span>
            <h2 class="section-title">تخمین‌گر هوشمند دامنه، فازبندی و هزینه پروژه شما</h2>
            <p class="section-lead">
              مسیر موردنظر خود را انتخاب کنید تا فازهای اجرایی، بازه زمانی و محدوده سرمایه‌گذاری به‌صورت شفاف نمایش داده شود و بتوانید در یک کلیک جلسه فنی رزرو کنید.
            </p>
          </div>
        </div>
        ${renderEstimatorWidget()}
      </div>
    </section>

    <section class="stage-sheet" id="faq-preview">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">شفافیت فنی و قراردادی</span>
            <h2 class="section-title">پاسخ به پرسش‌های کلیدی مدیران و خریداران محصولات</h2>
          </div>
          <a href="/faq/" class="btn btn-outline-light">مشاهده همه پرسش‌ها</a>
        </div>
        <div class="faq-grid">
          ${FAQ_ITEMS.map(
            (f) => `<details class="faq-card vf-card-light">
              <summary><span>${esc(f.q)}</span></summary>
              <p>${esc(f.a)}</p>
            </details>`
          ).join('')}
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/',
    title: 'رادین هوش | طراحی سایت، توسعه نرم‌افزار اختصاصی، اتوماسیون هوش مصنوعی و افزونه دفتریار',
    description:
      'استودیو مهندسی رادین هوش: سازنده افزونه جامع مالی ووکامرس «دفتریار»، طراحی وب‌سایت‌های تراز جهانی، توسعه صفرتاصد نرم‌افزار و راهکارهای هوش مصنوعی و اتوماسیون سازمانی.',
    assetVersion,
    mainHtml,
  });
}

/* 2. WORDPRESS PRODUCTS HUB (/products/) */
export function renderProductsHubPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>محصولات وردپرس</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--copper">خانواده افزونه‌های مهندسی «یار» برای وردپرس ایران</span>
        <h1 class="hero-title" style="max-width:860px;">استاندارد نرم‌افزارهای بانکی در قلب فروشگاه‌های ووکامرس</h1>
        <p class="hero-desc" style="max-width:760px;">
          اکوسیستم وردپرس ایران پر از افزونه‌های پراکنده‌ای است که بدون تست خودکار نوشته شده‌اند و با هر به‌روزرسانی، صفحه تسویه‌حساب یا محاسبات مالیات را مختل می‌کنند. ما در رادین هوش با پرچم‌دار «دفتریار» نسل جدیدی از افزونه‌های خودکفا، سریع و تست‌شده را عرضه کرده‌ایم.
        </p>
        <div class="hero-cta-row" style="margin-bottom:0;">
          <a href="/products/daftaryar/" class="btn btn-copper" data-magnetic>مشاهده کامل دفتریار نسخه ۱٫۰ (${esc(DAFTARYAR_PRODUCT.priceDisplayFa)})</a>
          <a href="/contact/?track=wp-plugin" class="btn btn-outline-dark">سفارش ماژول اختصاصی ووکامرس</a>
        </div>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--copper-light">محصول آماده عرضه فوری</span>
            <h2 class="section-title">دفتریار نسخه ۱٫۰ — سیستم‌عامل ۱۰ ماژوله مالی و لجستیک ووکامرس</h2>
            <p class="section-lead">${esc(DAFTARYAR_PRODUCT.heroLeadFa)}</p>
          </div>
        </div>

        <div class="stats-grid" style="margin-bottom:36px;">
          ${DAFTARYAR_PRODUCT.proofStats
            .map(
              (s) => `<div class="vf-card-light pad-card">
                <div style="font-family:var(--rdn-font-display);font-size:30px;font-weight:900;color:var(--rdn-lapis);">${esc(s.value)}</div>
                <div style="font-weight:800;font-size:14.5px;margin-block:4px;">${esc(s.label)}</div>
                <p style="margin:0;font-size:13px;color:var(--rdn-muted-on-light);">${esc(s.detail)}</p>
              </div>`
            )
            .join('')}
        </div>

        ${renderDaftaryarCockpit({ showFullLink: true })}
      </div>
    </section>

    <section class="stage-sheet">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">مقایسه مهندسی و اقتصادی</span>
            <h2 class="section-title">چرا یک هسته یکپارچه بهتر از ۱۰ افزونه متفرقه است؟</h2>
          </div>
        </div>
        <div class="table-scroll-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>شاخص ارزیابی</th>
                <th>روش سنتی (چندین افزونه جداگانه)</th>
                <th>هسته یکپارچه «دفتریار» رادین هوش</th>
              </tr>
            </thead>
            <tbody>
              ${DAFTARYAR_PRODUCT.comparisonRows
                .map(
                  (r) => `<tr>
                    <td><strong>${esc(r.feature)}</strong></td>
                    <td>${esc(r.scattered)}</td>
                    <td class="highlight-col">✓ ${esc(r.daftaryar)}</td>
                  </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">وضعیت شفاف خانواده محصولات</span>
            <h2 class="section-title">نقشه راه خانواده افزونه‌های «یار» و توسعه سفارشی</h2>
            <p class="section-lead">
              در حال حاضر «دفتریار نسخه ۱٫۰» تکمیل، تست و آماده نصب است. سایر محصولات تخصصی خانواده «یار» طبق اولویت نیاز بازار در خط مهندسی قرار دارند.
            </p>
          </div>
        </div>
        <div class="grid-3">
          ${YAAR_FAMILY_ROADMAP.map(
            (item) => `<article class="vf-card-light pad-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:16px;">
              <div>
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                  <span style="font-size:12px;color:var(--rdn-muted-on-light);font-weight:700;">${esc(item.category)}</span>
                  <span class="mini-stat-chip" style="${item.status === 'ready' ? 'background:rgba(15,118,110,0.12);color:#0F766E;border-color:rgba(15,118,110,0.3);' : item.status === 'custom' ? 'background:rgba(29,78,216,0.1);color:#1D4ED8;' : ''}">${esc(item.statusLabel)}</span>
                </div>
                <h3 style="font-size:20px;margin-bottom:8px;">${esc(item.name)}</h3>
                <p style="margin:0;font-size:14px;color:var(--rdn-body-on-light);">${esc(item.summary)}</p>
              </div>
              <a href="${item.href}" class="card-arrow-link">${item.status === 'ready' ? 'ورود به صفحه دفتریار ←' : 'ثبت درخواست یا اعلام نیاز ←'}</a>
            </article>`
          ).join('')}
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/products/',
    title: 'محصولات وردپرس و خانواده افزونه‌های یار | رادین هوش',
    description:
      'معرفی افزونه پرچم‌دار دفتریار نسخه ۱٫۰ برای ووکامرس ایران با ۲٬۶۴۵ تست خودکار و نقشه راه خانواده افزونه‌های مهندسی وردپرس رادین هوش.',
    assetVersion,
    mainHtml,
  });
}

/* 3. DAFTARYAR PRODUCT DETAIL PAGE (/products/daftaryar/) */
export function renderDaftaryarPage(assetVersion) {
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'افزونه دفتریار ووکامرس',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'WordPress 6.4+, PHP 8.1+',
    softwareVersion: '1.0.0',
    offers: {
      '@type': 'Offer',
      price: '890000',
      priceCurrency: 'IRR',
    },
  };

  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content hero-grid">
        <div>
          <nav class="breadcrumb" aria-label="مسیر صفحه">
            <a href="/">رادین هوش</a><span>/</span><a href="/products/">محصولات وردپرس</a><span>/</span><span>دفتریار</span>
          </nav>
          <span class="eyebrow-pill eyebrow-pill--copper">${esc(DAFTARYAR_PRODUCT.statusFa)}</span>
          <h1 class="hero-title">افزونه «دفتریار» — سیستم‌عامل جامع مالی، مودیان و عملیات ووکامرس</h1>
          <p class="hero-desc">${esc(DAFTARYAR_PRODUCT.heroLeadFa)}</p>
          <div style="padding:16px 20px;border-radius:14px;background:rgba(255,255,255,0.05);border:1px solid rgba(251,191,36,0.32);margin-bottom:24px;">
            <div style="display:flex;align-items:baseline;justify-content:space-between;gap:12px;flex-wrap:wrap;">
              <span style="font-size:14px;color:#CBD5E1;">بهای لایسنس کامل نسخه ۱٫۰:</span>
              <strong style="font-family:var(--rdn-font-display);font-size:28px;color:#FBBF24;">${esc(DAFTARYAR_PRODUCT.priceDisplayFa)}</strong>
            </div>
            <div style="font-size:13px;color:#94A3B8;margin-top:6px;">${esc(DAFTARYAR_PRODUCT.licenseNoteFa)}</div>
          </div>
          <div class="hero-cta-row" style="margin-bottom:0;">
            <a href="/contact/?track=wp-plugin" class="btn btn-copper" data-magnetic>ثبت سفارش لایسنس و دریافت بسته نصب</a>
            <a href="/work/daftaryar/" class="btn btn-outline-dark">مطالعه پرونده مهندسی و تست‌ها</a>
          </div>
        </div>
        <div>
          ${renderDaftaryarSchematicSvg()}
        </div>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">آزمایش زنده پیشخوان</span>
            <h2 class="section-title">هر ۵ هاب اصلی دفتریار را همین‌جا تعاملی امتحان کنید</h2>
          </div>
        </div>
        ${renderDaftaryarCockpit({ showFullLink: false })}
      </div>
    </section>

    <section class="stage-sheet">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">کالبدشکافی کامل امکانات</span>
            <h2 class="section-title">۱۰ ماژول تخصصی یکپارچه در یک بسته استاندارد</h2>
            <p class="section-lead">هر ماژول در پیشخوان وردپرس کلید مستقل روشن/خاموش دارد تا فقط بخش‌های موردنیاز فروشگاه شما بارگذاری شوند.</p>
          </div>
        </div>
        <div class="grid-2">
          ${DAFTARYAR_PRODUCT.tenModules
            .map(
              (m) => `<div class="vf-card-light pad-card">
                <span class="work-cat-tag" style="display:inline-block;margin-bottom:10px;">${esc(m.tag)}</span>
                <h3 style="font-size:19px;margin-bottom:8px;">${esc(m.title)}</h3>
                <p style="margin:0;font-size:14.5px;color:var(--rdn-body-on-light);">${esc(m.desc)}</p>
              </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">نصب و راه‌اندازی در ۵ دقیقه</span>
            <h2 class="section-title">جادوگر راه‌اندازی ۵ مرحله‌ای فارسی + داده آزمایشی یک‌کلیکی</h2>
          </div>
        </div>
        <div class="process-grid">
          ${DAFTARYAR_PRODUCT.setupSteps
            .map(
              (st) => `<div class="process-card vf-card-light">
                <div>
                  <span class="process-step-num">${esc(st.step)}</span>
                  <h3>${esc(st.title)}</h3>
                  <p>${esc(st.detail)}</p>
                </div>
              </div>`
            )
            .join('')}
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/products/daftaryar/',
    title: 'افزونه دفتریار ووکامرس (نسخه ۱٫۰) — فاکتور رسمی، مودیان، کارت‌به‌کارت و ترب | رادین هوش',
    description:
      'افزونه جامع دفتریار برای ووکامرس ایران: ۱۰ ماژول مالی، سامانه مودیان، کارت‌به‌کارت ضدتقلب، ترب زنده، برچسب پستی و گارانتی با ۱۵٬۵۰۱ گزاره تست خودکار.',
    schemaJson: softwareSchema,
    assetVersion,
    mainHtml,
  });
}

/* 4. SOLUTIONS HUB (/solutions/) */
export function renderSolutionsHubPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>خدمات و راهکارها</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">خدمات مهندسی نرم‌افزار و هوش مصنوعی</span>
        <h1 class="hero-title" style="max-width:840px;">راهکارهای نرم‌افزاری دقیق برای رشد فروش، اتوماسیون و مقیاس سازمانی</h1>
        <p class="hero-desc" style="max-width:740px;">
          ما صرفاً کدنویس برون‌سپاری نیستیم؛ شریک معماری و ساخت محصول شما هستیم. از طراحی وب‌سایت‌های شاخص بین‌المللی تا ساخت صفرتاصد پلتفرم‌های ابری، ایجنت‌های هوش مصنوعی و یکپارچه‌سازی سامانه‌های سازمانی.
        </p>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="solutions-bento">
          ${SOLUTIONS.map(
            (s) => `<article class="solution-card vf-card-light">
              <div class="solution-card-top">
                <span class="work-cat-tag">${esc(s.badge)}</span>
                <h3><a href="${s.href}">${esc(s.title)}</a></h3>
                <p style="margin-bottom:14px;">${esc(s.heroLead)}</p>
                <ul class="check-list">
                  ${s.deliverables.map((d) => `<li><strong>${esc(d.title)}:</strong> ${esc(d.detail)}</li>`).join('')}
                </ul>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;padding-top:14px;border-top:1px solid var(--rdn-paper-border);">
                <a href="${s.href}" class="btn btn-primary btn-sm">ورود به صفحه تخصصی راهکار</a>
                <a href="/contact/" class="card-arrow-link">درخواست جلسه فنی ←</a>
              </div>
            </article>`
          ).join('')}
        </div>
      </div>
    </section>

    <section class="stage-sheet">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">محاسبه فوری زمان و بودجه</span>
            <h2 class="section-title">دامنه پروژه خود را انتخاب و برآورد اولیه دریافت کنید</h2>
          </div>
        </div>
        ${renderEstimatorWidget()}
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/solutions/',
    title: 'خدمات طراحی سایت، توسعه نرم‌افزار صفرتاصد، اتوماسیون و راهکارهای سازمانی | رادین هوش',
    description:
      'چهار ستون خدمات مهندسی رادین هوش: طراحی وب‌سایت اختصاصی و چندزبانه، ساخت صفرتاصد نرم‌افزار و پلتفرم ابری، اتوماسیون هوش مصنوعی و راهکارهای نرم‌افزاری سازمانی.',
    assetVersion,
    mainHtml,
  });
}

/* 5-8. INDIVIDUAL SOLUTION DETAIL PAGES (/solutions/[slug]/) */
export function renderSolutionDetailPage(sol, assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><a href="/solutions/">خدمات و راهکارها</a><span>/</span><span>${esc(sol.badge)}</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">${esc(sol.badge)}</span>
        <h1 class="hero-title" style="max-width:860px;">${esc(sol.title)}</h1>
        <p class="hero-desc" style="max-width:760px;">${esc(sol.heroLead)}</p>
        <div class="hero-cta-row" style="margin-bottom:0;">
          <a href="/contact/" class="btn btn-lapis-glow" data-magnetic>درخواست مشاوره معماری برای این راهکار</a>
          <a href="/pricing/" class="btn btn-outline-dark">مشاهده تخمین‌گر هزینه و زمان‌بندی</a>
        </div>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="kpi-trio" style="margin-bottom:40px;">
          ${sol.metrics
            .map(
              (m) => `<div class="kpi-box">
                <div class="kpi-box-val">${esc(m.value)}</div>
                <div class="kpi-box-lbl">${esc(m.label)}</div>
              </div>`
            )
            .join('')}
        </div>

        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">معماری و خروجی‌های ملموس</span>
            <h2 class="section-title">در این مسیر دقیقاً چه اجزایی برای شما مهندسی و تحویل می‌شود؟</h2>
          </div>
        </div>

        <div class="grid-2">
          ${sol.deliverables
            .map(
              (d) => `<div class="vf-card-light pad-card">
                <h3 style="font-size:20px;margin-bottom:10px;">${esc(d.title)}</h3>
                <p style="margin:0;font-size:14.5px;color:var(--rdn-body-on-light);">${esc(d.detail)}</p>
              </div>`
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="stage-sheet">
      <div class="container grid-2">
        <div class="vf-card-light pad-card">
          <span class="eyebrow-pill eyebrow-pill--light">مخاطبان اصلی این راهکار</span>
          <h2 style="font-size:23px;margin-bottom:14px;">این سرویس برای چه سازمان‌ها و کسب‌وکارهایی بیشترین بازده را دارد؟</h2>
          <ul class="check-list" style="margin-bottom:0;">
            ${sol.idealFor.map((item) => `<li>${esc(item)}</li>`).join('')}
          </ul>
        </div>
        <div class="vf-card-light pad-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:18px;">
          <div>
            <span class="eyebrow-pill eyebrow-pill--copper-light">نمونه‌های واقعی اجراشده</span>
            <h2 style="font-size:23px;margin-bottom:12px;">به جای وعده تبلیغاتی، سامانه‌های زنده ما را بررسی کنید</h2>
            <p style="font-size:14.5px;color:var(--rdn-body-on-light);">تمامی استانداردهایی که در این صفحه می‌خوانید پیش‌تر در محصولات و پروژه‌های واقعی ما پیاده‌سازی و راستی‌آزمایی شده‌اند:</p>
            <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px;">
              ${sol.proofLinks
                .map(
                  (pl) => `<a href="${pl.href}" class="vf-card-light" style="padding:12px 16px;font-weight:700;color:var(--rdn-lapis);display:flex;justify-content:space-between;align-items:center;">
                    <span>${esc(pl.title)}</span><span>مشاهده ←</span>
                  </a>`
                )
                .join('')}
            </div>
          </div>
          <a href="/contact/" class="btn btn-primary">شروع گفتگو درباره پروژه شما</a>
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: sol.href,
    title: `${sol.title} | خدمات رادین هوش`,
    description: sol.shortDesc,
    assetVersion,
    mainHtml,
  });
}

/* 9. WORK & CASE STUDIES HUB (/work/) */
export function renderWorkHubPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>پروژه‌ها و نمونه‌کارها</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">آرشیو سامانه‌های پروداکشن و پرونده‌های مهندسی</span>
        <h1 class="hero-title" style="max-width:860px;">۶ سامانه پروداکشن عمیق + ۶ برند صادراتی بین‌المللی</h1>
        <p class="hero-desc" style="max-width:740px;">
          مجموعه کامل پلتفرم‌های ابری، فروشگاه‌ساز چندمستأجره، کاریابی هوشمند، محصول پرچم‌دار وردپرس و موتورهای اتوماسیون ساخته‌شده توسط رادین هوش به همراه دسترسی مستقیم به نسخه‌های زنده.
        </p>
        <div class="hero-cta-row" style="margin-bottom:0;">
          <a href="/exvorta-web/" class="btn btn-lapis-glow">مشاهده اختصاصی ۶ وب‌سایت صادراتی</a>
          <a href="/contact/" class="btn btn-outline-dark">ثبت سفارش پروژه مشابه</a>
        </div>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="filter-toolbar" data-work-filter-group="work-hub-grid">
          <div class="filter-pills" role="group" aria-label="فیلتر پروژه‌ها">
            <button type="button" class="filter-btn is-active" data-filter="all">همه پرونده‌ها (۶)</button>
            <button type="button" class="filter-btn" data-filter="commerce">تجارت الکترونیک و وردپرس</button>
            <button type="button" class="filter-btn" data-filter="saas">پلتفرم ابری و تجارت جهانی</button>
            <button type="button" class="filter-btn" data-filter="ai">هوش مصنوعی و اتوماسیون</button>
          </div>
        </div>
        <div class="works-grid" id="work-hub-grid">
          ${FLAGSHIP_PROJECTS.map((p) => renderProjectCard(p)).join('')}
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/work/',
    title: 'پروژه‌ها، نمونه‌کارها و کیس‌استادی‌های نرم‌افزاری | رادین هوش',
    description:
      'کالبدشکافی فنی پروژه‌های زنده رادین هوش شامل همه‌سو، سی‌ولی، اگزورتا، فیروزه نیشابور، افزونه دفتریار و موتورهای اتوماسیون داده.',
    assetVersion,
    mainHtml,
  });
}

/* 10-15. INDIVIDUAL CASE STUDY MONOGRAPHS (/work/[slug]/) */
export function renderWorkCasePage(proj, assetVersion) {
  let mediaBlock = '';
  if (proj.previewDesktop) {
    mediaBlock = `<div class="vf-card-light" style="overflow:hidden;padding:14px;background:#070B14;">
      <img src="${proj.previewDesktop}" alt="نمای دسکتاپ سامانه ${esc(proj.nameFa)}" width="1100" height="688" style="border-radius:12px;width:100%;height:auto;">
    </div>`;
  } else if (proj.slug === 'daftaryar') {
    mediaBlock = `<div class="vf-card-light" style="padding:20px;background:#070B14;">${renderDaftaryarSchematicSvg()}</div>`;
  } else {
    mediaBlock = `<div class="vf-card-light" style="padding:20px;background:#070B14;">${renderAutomationSchematicSvg()}</div>`;
  }

  let visitAction = '';
  if (proj.liveUrl && !proj.isInternalProduct) {
    visitAction = `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-lapis-glow">مشاهده نسخه زنده سامانه ↗</a>`;
  } else if (proj.isInternalProduct) {
    visitAction = `<a href="${proj.liveUrl}" class="btn btn-copper">مشاهده برگه کامل محصول دفتریار</a>`;
  }

  const others = FLAGSHIP_PROJECTS.filter((x) => x.slug !== proj.slug).slice(0, 2);

  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><a href="/work/">پروژه‌ها</a><span>/</span><span>${esc(proj.nameFa)}</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">${esc(proj.categoryLabel)} · ${esc(proj.statusFa)}</span>
        <h1 class="hero-title">${esc(proj.nameFa)} ${ltr(proj.nameEn)}</h1>
        <p class="hero-desc" style="max-width:780px;">${esc(proj.shortSummary)}</p>
        <div class="hero-cta-row" style="margin-bottom:0;">
          ${visitAction}
          <a href="/contact/" class="btn btn-outline-dark">سفارش سامانه مشابه برای سازمان شما</a>
        </div>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="kpi-trio" style="margin-bottom:36px;">
          ${proj.metrics
            .map(
              (m) => `<div class="kpi-box">
                <div class="kpi-box-val">${esc(m.value)}</div>
                <div class="kpi-box-lbl">${esc(m.label)}</div>
              </div>`
            )
            .join('')}
        </div>

        <div class="case-layout">
          <aside class="case-rail vf-card-light">
            <div class="rail-meta-item">
              <div class="rail-meta-label">نام سامانه</div>
              <div class="rail-meta-val">${esc(proj.nameFa)} ${ltr(proj.nameEn)}</div>
            </div>
            <div class="rail-meta-item">
              <div class="rail-meta-label">حوزه مهندسی</div>
              <div class="rail-meta-val">${esc(proj.categoryLabel)}</div>
            </div>
            <div class="rail-meta-item">
              <div class="rail-meta-label">شاخص کلیدی کیفیت</div>
              <div class="rail-meta-val">${esc(proj.headlineMetric)}</div>
            </div>
            <div>
              <div class="rail-meta-label" style="margin-bottom:8px;">فناوری‌های هسته</div>
              <div class="tag-row">
                ${proj.stackTags.map((t) => `<span class="mini-stat-chip">${ltr(t)}</span>`).join('')}
              </div>
            </div>
          </aside>

          <div class="case-narrative">
            ${mediaBlock}

            <div class="case-block vf-card-light">
              <h2>۱. مسئله و چالش واقعی بازار</h2>
              <p>${esc(proj.challengeFa)}</p>
            </div>

            <div class="case-block vf-card-light">
              <h2>۲. معماری مهندسی و راهکار پیاده‌سازی‌شده</h2>
              <p>${esc(proj.architectureFa)}</p>
            </div>

            <div class="case-block vf-card-light">
              <h2>۳. نتایج راستی‌آزمایی‌شده و کنترل کیفیت</h2>
              <ul class="check-list" style="margin-bottom:0;">
                ${proj.resultsFa.map((r) => `<li>${esc(r)}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="stage-sheet">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <h2 class="section-title">سایر پرونده‌های مهندسی مرتبط</h2>
          </div>
          <a href="/work/" class="btn btn-outline-light">همه پروژه‌ها</a>
        </div>
        <div class="works-grid">
          ${others.map((o) => renderProjectCard(o)).join('')}
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: proj.href,
    title: `پرونده مهندسی ${proj.nameFa} (${proj.nameEn}) | رادین هوش`,
    description: proj.shortSummary,
    assetVersion,
    mainHtml,
  });
}

/* 16. EXVORTA WEB 6-BRAND INTERNATIONAL PORTFOLIO (/exvorta-web/) */
export function renderExvortaWebPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>پورتفولیوی بین‌المللی</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">نمایشگاه برندهای صادراتی چندزبانه ${ltr('Exvorta Web')}</span>
        <h1 class="hero-title" style="max-width:860px;">۶ وب‌سایت پرچم‌دار تجارت جهانی مستقر روی لبه کلودفلر</h1>
        <p class="hero-desc" style="max-width:760px;">
          هر یک از ۶ برند زیر برای یک صنعت صادراتی واقعی با هویت بصری منحصربه‌فرد، ابزارهای محاسباتی تخصصی صنف، چندزبانگی کامل راست‌به‌چپ و چپ‌به‌راست و امتیاز سرعت تراز اول مهندسی شده است.
        </p>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:20px;">
          <button type="button" class="btn btn-primary btn-sm is-active" data-vp-mode="both">نمای ترکیبی دسکتاپ + موبایل</button>
          <button type="button" class="btn btn-outline-dark btn-sm" data-vp-mode="desktop">تمرکز روی دسکتاپ ۱۴۴۰</button>
          <button type="button" class="btn btn-outline-dark btn-sm" data-vp-mode="mobile">برجسته‌سازی موبایل ۳۹۰</button>
        </div>
      </div>
    </section>

    <section class="stage-dark" style="padding-top:24px;border-top:1px solid var(--rdn-ink-border);">
      <div class="container">
        <div class="cinema-reel">
          ${EXVORTA_WEB_BRANDS.map((b) => renderExvortaBrandCard(b)).join('')}
        </div>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">مشخصات مهندسی هر برند</span>
            <h2 class="section-title">جزئیات فنی و ابزارهای تعاملی تعبیه‌شده در هر وب‌سایت صادراتی</h2>
          </div>
        </div>
        <div class="table-scroll-wrap">
          <table class="compare-table">
            <thead>
              <tr>
                <th>برند و صنعت</th>
                <th>پوشش زبانی و مسیرها</th>
                <th>ابزار تعاملی شاخص</th>
                <th>آدرس زنده</th>
              </tr>
            </thead>
            <tbody>
              ${EXVORTA_WEB_BRANDS.map(
                (b) => `<tr>
                  <td><strong>${esc(b.nameFa)}</strong></td>
                  <td>${esc(b.localesFa)}</td>
                  <td>${esc(b.signatureFa)}</td>
                  <td class="highlight-col"><a href="${b.liveUrl}" target="_blank" rel="noopener noreferrer">مشاهده سایت زنده ↗</a></td>
                </tr>`
              ).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/exvorta-web/',
    title: 'پورتفولیوی بین‌المللی ۶ وب‌سایت صادراتی چندزبانه | رادین هوش',
    description:
      'بررسی زنده ۶ وب‌سایت صادراتی چندزبانه طراحی و مهندسی‌شده روی شبکه کلودفلر در حوزه‌های زعفران، پسته، سنگ ساختمانی، شمش طلا، تجارت عمومی و نساجی.',
    assetVersion,
    mainHtml,
  });
}

/* 17. ENGINEERING PROCESS PAGE (/process/) */
export function renderProcessPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>فرآیند مهندسی</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">آزمایشگاه استاندارد کیفیت رادین هوش</span>
        <h1 class="hero-title" style="max-width:860px;">انضباط مهندسی ۵ مرحله‌ای؛ چرا خروجی‌های ما بدون باگ پنهان تحویل می‌شوند؟</h1>
        <p class="hero-desc" style="max-width:760px;">
          کیفیت اتفاقی نیست. هر پروژه در رادین هوش از یک خط تولید دقیق عبور می‌کند که در آن طراحی از روی مراجع واقعی شروع شده و پیش از انتشار توسط ممیز مستقل در مرورگر واقعی سنجیده می‌شود.
        </p>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="cockpit-shell">
          <div class="cockpit-topbar">
            <span class="cockpit-wp-pill">شبیه‌ساز مراحل اجرای پروژه در رادین هوش</span>
            <span style="font-size:13px;color:#CBD5E1;">گام‌ها را انتخاب کنید تا خروجی و چک‌لیست هر مرحله را ببینید</span>
          </div>
          <div class="cockpit-layout">
            <div class="cockpit-sidebar">
              ${ENGINEERING_STAGES.map(
                (st, idx) => `<button type="button" class="cockpit-nav-btn${idx === 0 ? ' is-active' : ''}" data-proc-step="${idx}">
                  <span>${esc(st.step)} — ${esc(st.role)}</span>
                </button>`
              ).join('')}
            </div>
            <div class="cockpit-body">
              ${ENGINEERING_STAGES.map(
                (st, idx) => `<div class="cockpit-pane${idx === 0 ? ' is-active' : ''}" data-proc-panel="${idx}">
                  <div class="cockpit-pane-copy">
                    <h3>${esc(st.title)}</h3>
                    <p>${esc(st.description)}</p>
                    <div style="padding:12px 14px;border-radius:10px;background:rgba(45,212,191,0.12);color:#2DD4BF;font-size:13.5px;font-weight:700;">
                      تحویل‌دادنی قطعی به کارفرما: ${esc(st.deliverable)}
                    </div>
                  </div>
                  <div class="cockpit-widget">
                    <div class="invoice-sheet-head">
                      <strong>چک‌لیست کنترل کیفیت این گام</strong>
                      <span class="invoice-stamp">اجباری</span>
                    </div>
                    <ul class="check-list" style="margin-bottom:0;">
                      ${st.logLines.map((l) => `<li>${esc(l)}</li>`).join('')}
                    </ul>
                  </div>
                </div>`
              ).join('')}
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/process/',
    title: 'فرآیند مهندسی ۵ مرحله‌ای و کنترل کیفیت | رادین هوش',
    description:
      'آشنایی با متدولوژی ۵ مرحله‌ای رادین هوش: از تحقیق مراجع واقعی محصول و طراحی معماری تا تست‌های خودکار هزارگانه و ممیزی چشمی مستقل موبایل و دسکتاپ.',
    assetVersion,
    mainHtml,
  });
}

/* 18. PRICING & ESTIMATOR PAGE (/pricing/) */
export function renderPricingPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>تعرفه و برآورد</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">شفافیت مالی و مرحله‌بندی پرداخت</span>
        <h1 class="hero-title" style="max-width:840px;">تعرفه محصولات آماده و تخمین‌گر هوشمند پروژه‌های اختصاصی</h1>
        <p class="hero-desc" style="max-width:740px;">
          از لایسنس دائمی و اقتصادی افزونه دفتریار تا قراردادهای فازبندی‌شده طراحی وب‌سایت اختصاصی و پلتفرم‌های سازمانی با تحویل کامل سورس‌کد.
        </p>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        ${renderEstimatorWidget()}
      </div>
    </section>

    <section class="stage-sheet">
      <div class="container">
        <div class="section-head">
          <div class="section-head-main">
            <span class="eyebrow-pill eyebrow-pill--light">جدول خلاصه مسیرهای همکاری</span>
            <h2 class="section-title">مقایسه مدل‌های همکاری و بازه سرمایه‌گذاری</h2>
          </div>
        </div>
        <div class="grid-2">
          ${ESTIMATOR_TRACKS.map(
            (t) => `<div class="vf-card-light pad-card" style="display:flex;flex-direction:column;justify-content:space-between;gap:14px;">
              <div>
                <span class="work-cat-tag">${esc(t.baseTimeline)}</span>
                <h3 style="font-size:21px;margin-block:10px 6px;">${esc(t.label)}</h3>
                <div style="font-weight:800;color:var(--rdn-lapis);font-size:16px;margin-bottom:10px;">${esc(t.budgetBand)}</div>
                <p style="font-size:14px;color:var(--rdn-body-on-light);margin-bottom:14px;">${esc(t.summary)}</p>
                <ul class="check-list" style="margin-bottom:0;">
                  ${t.phases.map((p) => `<li>${esc(p)}</li>`).join('')}
                </ul>
              </div>
              <a href="/contact/?track=${t.id}" class="btn btn-outline-light btn-sm">استعلام دقیق این مسیر</a>
            </div>`
          ).join('')}
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/pricing/',
    title: 'تعرفه‌ها، قیمت افزونه دفتریار و تخمین‌گر هزینه طراحی سایت و نرم‌افزار | رادین هوش',
    description:
      'محاسبه‌گر آنلاین زمان و هزینه طراحی وب‌سایت اختصاصی، ساخت نرم‌افزار صفرتاصد، اتوماسیون هوش مصنوعی و قیمت لایسنس دائمی افزونه دفتریار.',
    assetVersion,
    mainHtml,
  });
}

/* 19. ABOUT PAGE (/about/) */
export function renderAboutPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>درباره ما</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">فلسفه ساخت و کارنامه مهندسی</span>
        <h1 class="hero-title" style="max-width:840px;">۸ سال مهندسی وب و نرم‌افزار با تمرکز بر ساخت سیستم‌های ماندگار</h1>
        <p class="hero-desc" style="max-width:760px;">
          رادین هوش حاصل هشت سال تجربه پیوسته در طراحی و مالکیت فنی فروشگاه‌های اینترنتی، سئو تکنیکال، ساخت پلتفرم‌های چندمستأجره و هدایت خط تولیدهای مدرن هوش مصنوعی است.
        </p>
      </div>
    </section>

    <section class="stage-light">
      <div class="container grid-3">
        <div class="vf-card-light pad-card">
          <h2 style="font-size:20px;margin-bottom:10px;">شواهد به‌جای ادعا</h2>
          <p style="margin:0;font-size:14.5px;color:var(--rdn-body-on-light);">
            هر اعدادی که در رادین هوش می‌خوانید — از ۱۵٬۵۰۱ گزاره تست دفتریار تا ۲۳۹ مسیر استاتیک فیروزه و ۶٬۵۷۷ آگهی زنده سی‌ولی — مستقیماً از خروجی واقعی کدبیس‌ها و سامانه‌های فعال استخراج شده است.
          </p>
        </div>
        <div class="vf-card-light pad-card">
          <h2 style="font-size:20px;margin-bottom:10px;">احترام عمیق به خط و زبان فارسی</h2>
          <p style="margin:0;font-size:14.5px;color:var(--rdn-body-on-light);">
            رابط کاربری فارسی ترجمه سرسری یک قالب انگلیسی نیست. ما از فونت‌های متغیر اصیل ایرانی، ارقام تراز جدولی، چیدمان منطقی راست‌به‌چپ و نگارش شفاف و انسانی استفاده می‌کنیم.
          </p>
        </div>
        <div class="vf-card-light pad-card">
          <h2 style="font-size:20px;margin-bottom:10px;">مالکیت و استقلال کامل کارفرما</h2>
          <p style="margin:0;font-size:14.5px;color:var(--rdn-body-on-light);">
            ما مشتریان را با قفل‌های نرم‌افزاری گروگان نمی‌گیریم. تمام پروژه‌های اختصاصی با سورس‌کد تمیز، مستندات فارسی استقرار و بدون وابستگی پنهان تحویل داده می‌شوند.
          </p>
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/about/',
    title: 'درباره رادین هوش — فلسفه مهندسی و کارنامه ۸ ساله | رادین هوش',
    description:
      'آشنایی با استودیو مهندسی رادین هوش، اصول غیرقابل‌مذاکره کیفیت نرم‌افزار، تایپوگرافی استاندارد فارسی و کارنامه ساخت ۱۴ سامانه و برند زنده.',
    assetVersion,
    mainHtml,
  });
}

/* 20. CONTACT & INQUIRY PAGE (/contact/) */
export function renderContactPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>تماس و ثبت سفارش</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">پاسخ‌گویی سریع و مستقیم مهندسی</span>
        <h1 class="hero-title" style="max-width:820px;">مشاوره معماری، سفارش پروژه اختصاصی و تهیه افزونه دفتریار</h1>
        <p class="hero-desc" style="max-width:720px;">
          فرم زیر را در کمتر از یک دقیقه تکمیل کنید تا کد پیگیری اختصاصی صادر شود، یا مستقیماً از طریق واتس‌اپ و ایمیل رسمی با ما مکاتبه کنید.
        </p>
      </div>
    </section>

    <section class="stage-light">
      <div class="container contact-grid">
        <div class="vf-card-light form-card">
          <h2 style="font-size:23px;margin-bottom:6px;">فرم ثبت استعلام و درخواست پروژه</h2>
          <p style="font-size:14px;color:var(--rdn-muted-on-light);margin:0 0 22px;">اطلاعات شما کاملاً محرمانه می‌ماند و مستقیماً توسط معمار ارشد بررسی می‌شود.</p>

          <form id="radinai-inquiry-form" novalidate>
            <div class="sr-only" aria-hidden="true">
              <label for="hp-website">در صورت انسان بودن این فیلد را خالی بگذارید</label>
              <input type="text" id="hp-website" name="website_url" tabindex="-1" autocomplete="off">
            </div>

            <div class="form-row-2">
              <div class="field-wrap">
                <label for="f-name">نام و نام خانوادگی *</label>
                <input type="text" id="f-name" name="name" class="field-input" required placeholder="مثلاً: علی رضایی">
              </div>
              <div class="field-wrap">
                <label for="f-contact">شماره موبایل (واتس‌اپ / تماس) یا ایمیل *</label>
                <input type="text" id="f-contact" name="contact" class="field-input" required placeholder="مثلاً: ۰۹۱۲۱۲۳۴۵۶۷">
              </div>
            </div>

            <div class="form-row-2">
              <div class="field-wrap">
                <label for="f-company">نام مجموعه، فروشگاه یا سازمان (اختیاری)</label>
                <input type="text" id="f-company" name="company" class="field-input" placeholder="نام برند یا آدرس وب‌سایت فعلی">
              </div>
              <div class="field-wrap">
                <label for="f-service">موضوع درخواست</label>
                <select id="f-service" name="serviceType" class="field-select">
                  <option value="خرید یا سفارشی‌سازی افزونه وردپرس (دفتریار)">خرید یا سفارشی‌سازی افزونه وردپرس (دفتریار)</option>
                  <option value="طراحی وب‌سایت اختصاصی و چندزبانه">طراحی وب‌سایت اختصاصی و چندزبانه</option>
                  <option value="توسعه نرم‌افزار صفرتاصد و پلتفرم اختصاصی">توسعه نرم‌افزار صفرتاصد و پلتفرم اختصاصی</option>
                  <option value="اتوماسیون هوشمند و راهکار نرم‌افزاری سازمانی">اتوماسیون هوشمند و راهکار نرم‌افزاری سازمانی</option>
                  <option value="مشاوره فنی و معماری سیستم">مشاوره فنی و معماری سیستم</option>
                </select>
              </div>
            </div>

            <div class="field-wrap">
              <label for="f-notes">توضیح کوتاه درباره نیاز، هدف یا دغدغه فعلی شما</label>
              <textarea id="f-notes" name="notes" class="field-textarea" placeholder="هر جزئیاتی که کمک می‌کند پیشنهاد دقیق‌تری برای شما آماده کنیم بنویسید..."></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%;">ثبت استعلام و دریافت کد پیگیری</button>
            <div id="inquiry-feedback" class="form-feedback" role="status" aria-live="polite"></div>
          </form>
        </div>

        <aside style="display:flex;flex-direction:column;gap:18px;">
          <div class="vf-card-light pad-card">
            <span class="eyebrow-pill eyebrow-pill--light">کانال‌های ارتباط مستقیم</span>
            <h3 style="font-size:19px;margin-bottom:12px;">مکاتبه بدون واسطه در واتس‌اپ و ایمیل</h3>
            <p style="font-size:14px;color:var(--rdn-body-on-light);margin:0 0 16px;">معمولاً ظرف چند ساعت کاری به تمامی پیام‌های فنی و استعلام‌ها پاسخ دقیق و مکتوب داده می‌شود.</p>
            <div style="display:flex;flex-direction:column;gap:10px;">
              <a href="${BRAND.whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-lapis-glow">پیام مستقیم در واتس‌اپ (${esc(BRAND.whatsappDisplayFa)})</a>
              <a href="mailto:${BRAND.email}" class="btn btn-outline-light">ارسال ایمیل به ${ltr(BRAND.email)}</a>
            </div>
          </div>

          <div class="vf-card-light pad-card">
            <h3 style="font-size:18px;margin-bottom:10px;">در جلسه یا پاسخ اولیه چه دریافت می‌کنید؟</h3>
            <ul class="check-list" style="margin-bottom:0;">
              <li>تحلیل فنی صادقانه که آیا نیاز شما با محصول آماده حل می‌شود یا نیازمند توسعه اختصاصی است</li>
              <li>پیشنهاد معماری شفاف بدون اصطلاحات گنگ تبلیغاتی</li>
              <li>زمان‌بندی مرحله‌ای و برآورد دقیق هزینه پیش از هرگونه تعهد</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/contact/',
    title: 'تماس با رادین هوش — مشاوره معماری، سفارش طراحی سایت و خرید افزونه دفتریار',
    description:
      'ثبت سفارش طراحی وب‌سایت اختصاصی، توسعه نرم‌افزار و اتوماسیون سازمانی یا تهیه لایسنس دائمی افزونه دفتریار ووکامرس در رادین هوش.',
    assetVersion,
    mainHtml,
  });
}

/* 21. FAQ PAGE (/faq/) */
export function renderFaqPage(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content">
        <nav class="breadcrumb" aria-label="مسیر صفحه">
          <a href="/">رادین هوش</a><span>/</span><span>پرسش‌های متداول</span>
        </nav>
        <span class="eyebrow-pill eyebrow-pill--dark">پاسخ‌های روشن به سوالات فنی، مالی و حقوقی</span>
        <h1 class="hero-title" style="max-width:820px;">پرسش‌های متداول خریداران افزونه دفتریار و کارفرمایان سازمانی</h1>
      </div>
    </section>

    <section class="stage-light">
      <div class="container">
        <div class="faq-grid">
          ${FAQ_ITEMS.map(
            (f) => `<details class="faq-card vf-card-light" open>
              <summary><span>${esc(f.q)}</span></summary>
              <p>${esc(f.a)}</p>
            </details>`
          ).join('')}
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/faq/',
    title: 'پرسش‌های متداول فنی، لایسنس دفتریار و قراردادهای نرم‌افزاری | رادین هوش',
    description:
      'پاسخ کامل به پرسش‌های متداول درباره افزونه مالی ووکامرس دفتریار، مالکیت سورس‌کد در توسعه نرم‌افزار اختصاصی و ایمنی راهکارهای هوش مصنوعی رادین هوش.',
    assetVersion,
    mainHtml,
  });
}

/* 404 PAGE (/404.html) */
export function render404Page(assetVersion) {
  const mainHtml = `
    <section class="stage-dark page-hero" style="min-height:62vh;display:flex;align-items:center;">
      <div class="girih-backdrop" aria-hidden="true"></div>
      <div class="container stage-content" style="text-align:center;max-width:660px;">
        <span class="eyebrow-pill eyebrow-pill--copper">خطای ۴۰۴ · مسیر یافت نشد</span>
        <h1 class="hero-title">صفحه‌ای که به دنبال آن بودید جابه‌جا شده یا وجود ندارد</h1>
        <p class="hero-desc" style="margin-inline:auto;">
          از طریق دکمه‌های زیر می‌توانید مستقیماً به صفحه اصلی، هاب محصولات وردپرس یا نمایشگاه پروژه‌های مهندسی رادین هوش بروید.
        </p>
        <div class="hero-cta-row" style="justify-content:center;margin-bottom:0;">
          <a href="/" class="btn btn-lapis-glow">بازگشت به صفحه اصلی</a>
          <a href="/products/daftaryar/" class="btn btn-copper">افزونه وردپرس دفتریار</a>
          <a href="/work/" class="btn btn-outline-dark">مشاهده پروژه‌ها</a>
        </div>
      </div>
    </section>
  `;

  return renderShell({
    routePath: '/404',
    title: 'صفحه پیدا نشد (۴۰۴) | رادین هوش',
    description: 'مسیر موردنظر در وب‌سایت رادین هوش یافت نشد.',
    assetVersion,
    mainHtml,
  });
}
