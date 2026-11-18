import { esc, ltr, toFa } from '../data/format.mjs';
import { DAFTARYAR_PRODUCT } from '../data/wordpress-products.mjs';
import { ESTIMATOR_TRACKS, ESTIMATOR_ADDONS } from '../data/solutions.mjs';
import { renderDaftaryarSchematicSvg, renderAutomationSchematicSvg } from './schematics.mjs';

function renderCockpitSubWidget(tabId) {
  if (tabId === 'invoice') {
    return `<div class="cockpit-widget">
      <div class="invoice-sheet-head">
        <div>
          <strong style="font-size:15px;">فاکتور رسمی فروش کالا و خدمات</strong>
          <div style="font-size:12px;color:#526075;">شماره سریال قانونی: ۱۴۰۵/۰۰۴۸۲۱ · تاریخ: ۲۸ آبان ۱۴۰۵</div>
        </div>
        <span class="invoice-stamp">✓ امضای دیجیتال مودیان</span>
      </div>
      <div class="invoice-row"><span>مبلغ کل اقلام سفارش (۳ ردیف کالا)</span><strong>۴٬۸۰۰٬۰۰۰ تومان</strong></div>
      <div class="invoice-row"><span>تخفیف وفاداری مشتری</span><strong>۰ تومان</strong></div>
      <div class="invoice-row">
        <label style="display:inline-flex;align-items:center;gap:7px;cursor:pointer;">
          <input type="checkbox" checked data-vat-toggle style="accent-color:#1D4ED8;width:16px;height:16px;">
          <span>محاسبه مالیات ارزش افزوده (۱۰٪)</span>
        </label>
        <strong data-vat-amount>۴۸۰٬۰۰۰ تومان</strong>
      </div>
      <div class="invoice-total">
        <span>جمع قابل پرداخت و ثبت در دفتر کل:</span>
        <span data-inv-total>۵٬۲۸۰٬۰۰۰ تومان</span>
      </div>
      <div style="margin-top:12px;font-size:12px;color:#526075;">لینک مشاهده مهمان با امضای رمزنگاری‌شده ساخته شد (بدون افشای شماره سفارش).</div>
    </div>`;
  }

  if (tabId === 'c2c') {
    return `<div class="cockpit-widget">
      <div class="invoice-sheet-head">
        <strong style="font-size:15px;">توزیع هوشمند کارت‌به‌کارت ضدتقلب</strong>
        <span class="invoice-stamp">رمزنگاری فعال</span>
      </div>
      <div style="font-size:13px;color:#526075;margin-bottom:6px;">کارت فعال انتخاب‌شده بر اساس سقف آزاد ساعتی:</div>
      <div data-c2c-bank style="padding:10px 12px;background:#F5F4EE;border-radius:9px;font-weight:700;font-size:13.5px;margin-bottom:12px;">
        بانک ملت — ۶۱۰۴٬۳۳۷۸٬****٬۸۹۱۲ (سقف آزاد: ۶۸٪)
      </div>
      <div style="font-size:13px;color:#526075;margin-bottom:6px;">مبلغ یکتای قابل واریز جهت تطبیق خودکار پیامک بانکی:</div>
      <div data-c2c-unique style="padding:10px 12px;background:rgba(29,78,216,0.08);color:#1D4ED8;border-radius:9px;font-weight:800;font-size:14px;margin-bottom:14px;">
        ۱٬۲۵۰٬۰۳۷ تومان (کد تشخیص: +۳۷ تومان)
      </div>
      <button type="button" class="btn btn-primary btn-sm" data-c2c-rotate style="width:100%;">شبیه‌سازی چرخش کارت و تولید کد یکتای جدید</button>
    </div>`;
  }

  if (tabId === 'torob') {
    return `<div class="cockpit-widget">
      <div class="invoice-sheet-head">
        <strong style="font-size:15px;">شبیه‌ساز زنده گارد سود ترب و اقساطی</strong>
        <span class="invoice-stamp">کف امن: ۸٪</span>
      </div>
      <div class="guard-calc-controls">
        <div class="guard-slider-row">
          <label><span>حاشیه سود ناخالص کالا</span><span data-margin-val>۱۸٪</span></label>
          <input type="range" min="8" max="32" value="18" data-margin-slider aria-label="حاشیه سود ناخالص کالا">
        </div>
        <div class="guard-slider-row">
          <label><span>کارمزد درگاه اقساطی (اسنپ‌پی / ترب‌پی)</span><span data-fee-val>۷٪</span></label>
          <input type="range" min="3" max="15" value="7" data-fee-slider aria-label="کارمزد درگاه اقساطی">
        </div>
      </div>
      <div class="guard-result-banner" data-guard-banner>
        تایید گارد سود دفتریار: حاشیه سود خالص ۱۱٪ حفظ شده است — نمایش زنده در فید ترب و تسویه اقساطی فعال است.
      </div>
    </div>`;
  }

  if (tabId === 'shipping') {
    return `<div class="cockpit-widget">
      <div class="invoice-sheet-head">
        <strong style="font-size:15px;">پیش‌نمایش استودیو برچسب پستی انبار</strong>
        <div style="display:flex;gap:6px;">
          <button type="button" class="filter-btn is-active" data-label-mode="a4" style="padding:4px 10px;font-size:12px;">۴تایی اداری</button>
          <button type="button" class="filter-btn" data-label-mode="thermal" style="padding:4px 10px;font-size:12px;">رول حرارتی</button>
        </div>
      </div>
      <p data-label-desc style="font-size:13.5px;color:#334155;margin:0 0 12px;line-height:1.75;">
        قالب برگ ۴تایی استاندارد اداری: چیدمان دقیق چهار مرسوله در یک صفحه بدون پرتی کاغذ به همراه برش‌نمای استاندارد.
      </p>
      <div style="padding:12px;border:1.5px dashed #B8B3A2;border-radius:10px;background:#F5F4EE;font-size:13px;">
        <div style="display:flex;justify-content:space-between;font-weight:800;margin-bottom:6px;">
          <span>گیرنده: سارا محمدی — تهران</span>
          <span style="color:#0F766E;">پست پیشتاز</span>
        </div>
        <div>کد پستی ده رقمی: ۱۴۸۹۷۶۵۴۳۱ · وزن: ۱٬۲۵۰ گرم · وضعیت تسویه: پرداخت آنلاین</div>
      </div>
    </div>`;
  }

  return `<div class="cockpit-widget">
    <div class="invoice-sheet-head">
      <strong style="font-size:15px;">سلامت درگاه‌های پیام‌یار و سریال گارانتی</strong>
      <span class="invoice-stamp">۹ درایور آماده</span>
    </div>
    <div class="invoice-row"><span>سریال گارانتی صادرشده خودکار</span><strong>گارانتی ۱۸ ماهه اصالت کالا</strong></div>
    <div class="invoice-row"><span>لینک بازیابی سبد خرید رهاشده</span><strong>امضای امن یک‌کلیکی فعال</strong></div>
    <div data-sms-out style="margin-block:12px;padding:10px 12px;border-radius:9px;background:rgba(15,118,110,0.1);color:#0F766E;font-size:13px;font-weight:700;">
      ✓ اتصال وب‌سرویس پیامک آماده بررسی زنده است.
    </div>
    <button type="button" class="btn btn-outline-light btn-sm" data-sms-ping style="width:100%;">تست زنده پاسخ‌دهی درگاه پیامک</button>
  </div>`;
}

export function renderDaftaryarCockpit({ showFullLink = true } = {}) {
  const navButtons = DAFTARYAR_PRODUCT.cockpitTabs
    .map(
      (t, idx) => `<button type="button" class="cockpit-nav-btn${idx === 0 ? ' is-active' : ''}" role="tab" aria-selected="${idx === 0 ? 'true' : 'false'}" data-cockpit-tab="${t.id}">
        <span>${esc(t.label)}</span>
        <span class="cockpit-nav-tag">${esc(t.badge)}</span>
      </button>`
    )
    .join('');

  const panes = DAFTARYAR_PRODUCT.cockpitTabs
    .map(
      (t, idx) => `<div class="cockpit-pane${idx === 0 ? ' is-active' : ''}" role="tabpanel" data-cockpit-pane="${t.id}">
        <div class="cockpit-pane-copy">
          <h3>${esc(t.title)}</h3>
          <p>${esc(t.summary)}</p>
          <ul class="check-list">
            ${t.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}
          </ul>
          ${
            showFullLink
              ? `<div style="display:flex;flex-wrap:wrap;gap:10px;">
                  <a href="/products/daftaryar/" class="btn btn-copper btn-sm">مشخصات کامل ۱۰ ماژول دفتریار</a>
                  <a href="/contact/?track=wp-plugin" class="btn btn-outline-dark btn-sm">درخواست لایسنس یا مشاوره نصب</a>
                </div>`
              : `<div style="display:flex;flex-wrap:wrap;gap:10px;">
                  <a href="/contact/?track=wp-plugin" class="btn btn-copper btn-sm">ثبت سفارش لایسنس دائمی (${esc(DAFTARYAR_PRODUCT.priceDisplayFa)})</a>
                </div>`
          }
        </div>
        ${renderCockpitSubWidget(t.id)}
      </div>`
    )
    .join('');

  return `<div class="cockpit-shell" data-cockpit>
    <div class="cockpit-topbar">
      <div class="cockpit-title-group">
        <span class="cockpit-wp-pill">پیشخوان تعاملی دفتریار نسخه ${esc(DAFTARYAR_PRODUCT.versionFa)}</span>
        <span style="font-size:13.5px;color:#CBD5E1;">روی تب‌ها کلیک کنید و ماژول‌ها را زنده آزمایش کنید</span>
      </div>
      <div style="font-size:13px;color:#2DD4BF;font-weight:700;">۲٬۶۴۵ تست واحد سبز · صفر خطا در لاگ وردپرس</div>
    </div>
    <div class="cockpit-layout">
      <div class="cockpit-sidebar" role="tablist" aria-label="ماژول‌های افزونه دفتریار">
        ${navButtons}
      </div>
      <div class="cockpit-body">
        ${panes}
      </div>
    </div>
  </div>`;
}

export function renderProjectCard(proj) {
  let mediaHtml;
  if (proj.previewDesktop) {
    mediaHtml = `<img src="${proj.previewDesktop}" alt="پیش‌نمایش زنده سامانه ${esc(proj.nameFa)}" width="720" height="450" loading="lazy" decoding="async">`;
  } else if (proj.slug === 'daftaryar') {
    mediaHtml = `<div class="work-schematic-wrap">${renderDaftaryarSchematicSvg()}</div>`;
  } else {
    mediaHtml = `<div class="work-schematic-wrap">${renderAutomationSchematicSvg()}</div>`;
  }

  let externalBtn = '';
  if (proj.liveUrl && !proj.isInternalProduct) {
    externalBtn = `<a href="${proj.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-light btn-sm">مشاهده سایت زنده ↗</a>`;
  } else if (proj.isInternalProduct) {
    externalBtn = `<a href="${proj.liveUrl}" class="btn btn-outline-light btn-sm">برگه محصول</a>`;
  }

  return `<article class="work-card vf-card-light" data-category="${proj.category}">
    <a href="${proj.href}" class="work-media-frame" aria-label="مطالعه پرونده مهندسی ${esc(proj.nameFa)}">
      ${mediaHtml}
    </a>
    <div class="work-body">
      <div class="work-meta-top">
        <span class="work-cat-tag">${esc(proj.categoryLabel)}</span>
        <span class="work-status-tag">● ${esc(proj.statusFa)}</span>
      </div>
      <h3 class="work-title"><a href="${proj.href}">${esc(proj.nameFa)} ${ltr(proj.nameEn)}</a></h3>
      <p class="work-summary">${esc(proj.shortSummary)}</p>
      <div class="work-proof-bar">
        <span>شاخص مهندسی:</span>
        <span>${esc(proj.headlineMetric)}</span>
      </div>
      <div class="tag-row">
        ${proj.stackTags.slice(0, 4).map((t) => `<span class="mini-stat-chip">${ltr(t)}</span>`).join('')}
      </div>
      <div class="work-actions">
        <a href="${proj.href}" class="card-arrow-link">کالبدشکافی معماری و نتایج ←</a>
        ${externalBtn}
      </div>
    </div>
  </article>`;
}

export function renderExvortaBrandCard(brand) {
  return `<article class="brand-house-card vf-card-dark">
    <div>
      <div class="brand-device-pair" data-brand-pair>
        <img src="${brand.previewDesktop}" alt="نمای دسکتاپ وب‌سایت صادراتی ${esc(brand.nameFa)}" class="brand-device-desktop" width="640" height="400" loading="lazy" decoding="async">
        <img src="${brand.previewMobile}" alt="نمای موبایل وب‌سایت صادراتی ${esc(brand.nameFa)}" class="brand-device-mobile" width="180" height="380" loading="lazy" decoding="async">
      </div>
      <div style="margin-top:16px;">
        <div class="brand-house-locales">${esc(brand.localesFa)}</div>
        <h3 class="brand-house-title">${esc(brand.nameFa)} ${ltr(brand.nameEn)}</h3>
        <p class="brand-house-desc">${esc(brand.summaryFa)}</p>
      </div>
    </div>
    <div style="padding-top:14px;border-top:1px solid rgba(148,163,184,0.16);display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;">
      <span style="font-size:12.5px;color:#94A3B8;">${esc(brand.corridorFa)}</span>
      <a href="${brand.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-outline-dark btn-sm">بازدید زنده ↗</a>
    </div>
  </article>`;
}

export function renderEstimatorWidget() {
  const first = ESTIMATOR_TRACKS[0];
  const trackBtnsHtml = ESTIMATOR_TRACKS.map(
    (t, idx) => `<button type="button" class="track-choice-btn${idx === 0 ? ' is-selected' : ''}"
      data-est-track="${t.id}"
      data-label="${esc(t.label)}"
      data-timeline="${esc(t.baseTimeline)}"
      data-budget="${esc(t.budgetBand)}"
      data-summary="${esc(t.summary)}"
      data-phases="${esc(t.phases.join('||'))}">
      ${esc(t.label)}
    </button>`
  ).join('');

  const addonsHtml = ESTIMATOR_ADDONS.map(
    (a) => `<label class="addon-toggle">
      <input type="checkbox" data-est-addon data-weeks="${a.weeksAdd}" data-addon-name="${esc(a.label)}">
      <span>${esc(a.label)} (+${toFa(a.weeksAdd)} هفته)</span>
    </label>`
  ).join('');

  return `<div class="estimator-grid" data-estimator>
    <div class="estimator-controls vf-card-light">
      <div>
        <div style="font-size:14px;font-weight:800;margin-bottom:10px;">۱. نوع راهکار موردنیاز خود را انتخاب کنید:</div>
        <div class="track-radio-grid">
          ${trackBtnsHtml}
        </div>
      </div>
      <div>
        <div style="font-size:14px;font-weight:800;margin-bottom:10px;">۲. قابلیت‌های تکمیلی (اختیاری):</div>
        <div class="addons-grid">
          ${addonsHtml}
        </div>
      </div>
    </div>

    <div class="estimator-summary-card">
      <div>
        <div class="est-timeline-badge" data-est-timeline>زمان‌بندی تخمینی: ${esc(first.baseTimeline)}</div>
        <h3 style="font-size:21px;color:#FFFFFF;margin-block:12px 8px;" data-est-title>${esc(first.label)}</h3>
        <div class="est-price-band" data-est-budget>${esc(first.budgetBand)}</div>
        <p style="font-size:14px;color:#CBD5E1;margin:12px 0 16px;" data-est-summary>${esc(first.summary)}</p>
        <ul class="check-list" data-est-phases style="margin-bottom:0;">
          ${first.phases.map((p) => `<li>${esc(p)}</li>`).join('')}
        </ul>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;padding-top:14px;border-top:1px solid rgba(148,163,184,0.2);">
        <a href="/contact/?track=${first.id}" class="btn btn-lapis-glow" data-est-cta style="width:100%;">ثبت رایگان این برآورد و دریافت پروپوزال دقیق</a>
      </div>
    </div>
  </div>`;
}
