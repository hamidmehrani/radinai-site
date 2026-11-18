/* RadinAI Interactive Engine — Persian RTL Progressive Enhancement */
(function () {
  'use strict';

  var FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  function toFa(val) {
    return String(val).replace(/\d/g, function (d) {
      return FA_DIGITS[Number(d)];
    });
  }
  function formatMoneyFa(num) {
    var rounded = Math.round(num);
    var withSep = rounded.toLocaleString('en-US').replace(/,/g, '٬');
    return toFa(withSep);
  }

  /* Toast Helper */
  var toastEl = document.getElementById('rdn-toast');
  var toastTimer = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 3200);
  }

  /* 1. Mobile Navigation Drawer */
  var mobileBtn = document.getElementById('mobile-menu-open');
  var mobileClose = document.getElementById('mobile-menu-close');
  var mobileDrawer = document.getElementById('mobile-nav-drawer');

  function setDrawer(open) {
    if (!mobileDrawer) return;
    mobileDrawer.classList.toggle('is-open', open);
    if (mobileBtn) mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', function () { setDrawer(true); });
    if (mobileClose) mobileClose.addEventListener('click', function () { setDrawer(false); });
    mobileDrawer.addEventListener('click', function (ev) {
      if (ev.target === mobileDrawer) setDrawer(false);
    });
  }

  /* 2. Command Palette (Ctrl+K / Cmd+K) */
  var cmdModal = document.getElementById('cmd-modal');
  var cmdInput = document.getElementById('cmd-input');
  var cmdTriggers = document.querySelectorAll('[data-open-cmd]');
  var cmdClose = document.getElementById('cmd-close');
  var cmdItems = document.querySelectorAll('.cmd-result-item');

  function setCmdModal(open) {
    if (!cmdModal) return;
    cmdModal.classList.toggle('is-open', open);
    if (open && cmdInput) {
      cmdInput.value = '';
      filterCmd('');
      setTimeout(function () { cmdInput.focus(); }, 30);
    }
  }

  function filterCmd(q) {
    var needle = String(q || '').trim().toLowerCase();
    cmdItems.forEach(function (item) {
      var hay = (item.getAttribute('data-search') || '').toLowerCase();
      item.style.display = !needle || hay.indexOf(needle) !== -1 ? 'flex' : 'none';
    });
  }

  cmdTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () { setCmdModal(true); });
  });
  if (cmdClose) cmdClose.addEventListener('click', function () { setCmdModal(false); });
  if (cmdModal) {
    cmdModal.addEventListener('click', function (ev) {
      if (ev.target === cmdModal) setCmdModal(false);
    });
  }
  if (cmdInput) {
    cmdInput.addEventListener('input', function () { filterCmd(cmdInput.value); });
  }

  document.addEventListener('keydown', function (ev) {
    if ((ev.ctrlKey || ev.metaKey) && (ev.key === 'k' || ev.key === 'K')) {
      ev.preventDefault();
      setCmdModal(!cmdModal || !cmdModal.classList.contains('is-open'));
    } else if (ev.key === 'Escape') {
      setCmdModal(false);
      setDrawer(false);
    }
  });

  /* 3. Copy-to-Clipboard Chips */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = btn.getAttribute('data-copy');
      var label = btn.getAttribute('data-copy-msg') || 'کپی شد';
      if (navigator.clipboard && val) {
        navigator.clipboard.writeText(val).then(function () {
          showToast(label);
        });
      }
    });
  });

  /* 4. Hero 3-Lens Interactive Workbench */
  var lensBtns = document.querySelectorAll('[data-lens-btn]');
  var lensPanels = document.querySelectorAll('[data-lens-panel]');
  var lensStatus = document.getElementById('workbench-status-pill');

  lensBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-lens-btn');
      var statusText = btn.getAttribute('data-lens-status');
      lensBtns.forEach(function (b) {
        var active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      lensPanels.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-lens-panel') === target);
      });
      if (lensStatus && statusText) {
        lensStatus.textContent = statusText;
      }
    });
  });

  /* 5. Interactive Daftaryar WordPress Cockpit */
  document.querySelectorAll('[data-cockpit]').forEach(function (cockpit) {
    var navBtns = cockpit.querySelectorAll('[data-cockpit-tab]');
    var panes = cockpit.querySelectorAll('[data-cockpit-pane]');

    navBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-cockpit-tab');
        navBtns.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        panes.forEach(function (pane) {
          pane.classList.toggle('is-active', pane.getAttribute('data-cockpit-pane') === id);
        });
      });
    });

    /* Sub-widget A: Official Invoice VAT Toggle */
    var vatToggle = cockpit.querySelector('[data-vat-toggle]');
    var vatRowVal = cockpit.querySelector('[data-vat-amount]');
    var invTotalVal = cockpit.querySelector('[data-inv-total]');
    if (vatToggle && vatRowVal && invTotalVal) {
      vatToggle.addEventListener('change', function () {
        var base = 4800000;
        var vat = vatToggle.checked ? 480000 : 0;
        vatRowVal.textContent = formatMoneyFa(vat) + ' تومان';
        invTotalVal.textContent = formatMoneyFa(base + vat) + ' تومان';
      });
    }

    /* Sub-widget B: Card-to-Card Rotation & Unique 1-99 Toman Generator */
    var c2cBtn = cockpit.querySelector('[data-c2c-rotate]');
    var c2cBank = cockpit.querySelector('[data-c2c-bank]');
    var c2cUnique = cockpit.querySelector('[data-c2c-unique]');
    var c2cCards = [
      'بانک ملت — ۶۱۰۴٬۳۳۷۸٬****٬۸۹۱۲ (سقف آزاد: ۶۸٪)',
      'بانک سامان — ۶۲۱۹٬۸۶۱۰٬****٬۴۴۰۵ (سقف آزاد: ۹۱٪)',
      'بانک پاسارگاد — ۵۰۲۲٬۲۹۱۰٬****٬۷۳۱۹ (سقف آزاد: ۸۴٪)',
    ];
    var cardIdx = 0;
    if (c2cBtn && c2cBank && c2cUnique) {
      c2cBtn.addEventListener('click', function () {
        cardIdx = (cardIdx + 1) % c2cCards.length;
        var randToman = Math.floor(Math.random() * 88) + 11;
        c2cBank.textContent = c2cCards[cardIdx];
        c2cUnique.textContent = formatMoneyFa(1250000 + randToman) + ' تومان (کد تشخیص: +' + toFa(randToman) + ' تومان)';
      });
    }

    /* Sub-widget C: Torob & SnappPay Profit Margin Guard */
    var marginSlider = cockpit.querySelector('[data-margin-slider]');
    var feeSlider = cockpit.querySelector('[data-fee-slider]');
    var marginLbl = cockpit.querySelector('[data-margin-val]');
    var feeLbl = cockpit.querySelector('[data-fee-val]');
    var guardBanner = cockpit.querySelector('[data-guard-banner]');
    function updateGuard() {
      if (!marginSlider || !feeSlider || !guardBanner) return;
      var m = Number(marginSlider.value);
      var f = Number(feeSlider.value);
      var net = m - f;
      if (marginLbl) marginLbl.textContent = toFa(m) + '٪';
      if (feeLbl) feeLbl.textContent = toFa(f) + '٪';
      if (net < 8) {
        guardBanner.classList.add('is-warn');
        guardBanner.textContent =
          'هشدار گارد دفتریار: سود خالص پس از کسر کارمزد به ' +
          toFa(net) +
          '٪ می‌رسد (زیر مرز امن ۸٪) — درگاه اقساطی روی این کالا خودکار غیرفعال شد.';
      } else {
        guardBanner.classList.remove('is-warn');
        guardBanner.textContent =
          'تایید گارد سود دفتریار: حاشیه سود خالص ' +
          toFa(net) +
          '٪ حفظ شده است — نمایش زنده در فید ترب و تسویه اقساطی فعال است.';
      }
    }
    if (marginSlider && feeSlider) {
      marginSlider.addEventListener('input', updateGuard);
      feeSlider.addEventListener('input', updateGuard);
    }

    /* Sub-widget D: Postal Label Mode Toggle */
    var labelBtns = cockpit.querySelectorAll('[data-label-mode]');
    var labelDesc = cockpit.querySelector('[data-label-desc]');
    labelBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        labelBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        if (labelDesc) {
          var mode = btn.getAttribute('data-label-mode');
          labelDesc.textContent =
            mode === 'thermal'
              ? 'قالب رول حرارتی انبار (تک‌برگی استاندارد): بارکد درشت کد رهگیری، مشخصات گیرنده، کد پستی ۱۰ رقمی و نشان ویژه پس‌کرایه.'
              : 'قالب برگ ۴تایی استاندارد اداری: چیدمان دقیق چهار مرسوله در یک صفحه بدون پرتی کاغذ به همراه برش‌نمای استاندارد.';
        }
      });
    });

    /* Sub-widget E: SMS Gateway Live Ping Simulation */
    var smsPingBtn = cockpit.querySelector('[data-sms-ping]');
    var smsPingOut = cockpit.querySelector('[data-sms-out]');
    if (smsPingBtn && smsPingOut) {
      smsPingBtn.addEventListener('click', function () {
        var ms = Math.floor(Math.random() * 45) + 68;
        smsPingOut.textContent = '✓ اتصال برقرار است — پاسخ وب‌سرویس کاوه‌نگار در ' + toFa(ms) + ' میلی‌ثانیه تایید شد.';
      });
    }
  });

  /* 6. Portfolio Category Filter (/work/ & Home) */
  document.querySelectorAll('[data-work-filter-group]').forEach(function (group) {
    var btns = group.querySelectorAll('[data-filter]');
    var gridId = group.getAttribute('data-work-filter-group');
    var grid = document.getElementById(gridId);
    if (!grid) return;
    var cards = grid.querySelectorAll('[data-category]');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        btns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        cards.forEach(function (card) {
          var match = f === 'all' || card.getAttribute('data-category') === f;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  });

  /* 7. Interactive Project Scope & Cost Estimator */
  document.querySelectorAll('[data-estimator]').forEach(function (est) {
    var trackBtns = est.querySelectorAll('[data-est-track]');
    var addonChecks = est.querySelectorAll('[data-est-addon]');
    var outTitle = est.querySelector('[data-est-title]');
    var outTimeline = est.querySelector('[data-est-timeline]');
    var outBudget = est.querySelector('[data-est-budget]');
    var outSummary = est.querySelector('[data-est-summary]');
    var outPhases = est.querySelector('[data-est-phases]');
    var outCta = est.querySelector('[data-est-cta]');

    var activeTrackBtn = est.querySelector('[data-est-track].is-selected') || trackBtns[0];

    function refreshEstimator() {
      if (!activeTrackBtn) return;
      var id = activeTrackBtn.getAttribute('data-est-track');
      var label = activeTrackBtn.getAttribute('data-label') || '';
      var baseTimeline = activeTrackBtn.getAttribute('data-timeline') || '';
      var budget = activeTrackBtn.getAttribute('data-budget') || '';
      var summary = activeTrackBtn.getAttribute('data-summary') || '';
      var phasesRaw = activeTrackBtn.getAttribute('data-phases') || '';

      var extraWeeks = 0;
      var selectedAddons = [];
      addonChecks.forEach(function (chk) {
        if (chk.checked) {
          extraWeeks += Number(chk.getAttribute('data-weeks') || 0);
          selectedAddons.push(chk.getAttribute('data-addon-name'));
        }
      });

      if (outTitle) outTitle.textContent = label;
      if (outBudget) outBudget.textContent = budget;
      if (outSummary) outSummary.textContent = summary;
      if (outTimeline) {
        outTimeline.textContent =
          extraWeeks > 0
            ? 'زمان‌بندی تخمینی: ' + baseTimeline + ' (+ ' + toFa(extraWeeks) + ' هفته بابت ماژول‌های افزوده)'
            : 'زمان‌بندی تخمینی: ' + baseTimeline;
      }
      if (outPhases && phasesRaw) {
        var list = phasesRaw.split('||');
        outPhases.innerHTML = '';
        list.forEach(function (line) {
          var li = document.createElement('li');
          li.textContent = line;
          outPhases.appendChild(li);
        });
      }
      if (outCta) {
        var qs = new URLSearchParams();
        qs.set('track', id);
        if (selectedAddons.length) qs.set('addons', selectedAddons.join('، '));
        outCta.setAttribute('href', '/contact/?' + qs.toString());
      }
    }

    trackBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activeTrackBtn = btn;
        trackBtns.forEach(function (b) { b.classList.toggle('is-selected', b === btn); });
        refreshEstimator();
      });
    });

    addonChecks.forEach(function (chk) {
      chk.addEventListener('change', refreshEstimator);
    });

    refreshEstimator();
  });

  /* 8. Process Interactive Step Simulator (/process/) */
  var procBtns = document.querySelectorAll('[data-proc-step]');
  var procPanels = document.querySelectorAll('[data-proc-panel]');
  procBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var idx = btn.getAttribute('data-proc-step');
      procBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      procPanels.forEach(function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-proc-panel') === idx);
      });
    });
  });

  /* 9. Exvorta Web Viewport Mode Toggle (/exvorta-web/) */
  var vpBtns = document.querySelectorAll('[data-vp-mode]');
  var vpCards = document.querySelectorAll('[data-brand-pair]');
  vpBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-vp-mode');
      vpBtns.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      vpCards.forEach(function (pair) {
        var mob = pair.querySelector('.brand-device-mobile');
        var desk = pair.querySelector('.brand-device-desktop');
        if (!mob || !desk) return;
        if (mode === 'desktop') {
          mob.style.display = 'none';
          desk.style.opacity = '1';
        } else if (mode === 'mobile') {
          mob.style.display = 'block';
          mob.style.width = '36%';
          desk.style.opacity = '0.35';
        } else {
          mob.style.display = 'block';
          mob.style.width = '24%';
          desk.style.opacity = '1';
        }
      });
    });
  });

  /* 10. Inquiry Form Pre-fill & Cloudflare Pages Function Submission (/contact/) */
  var inquiryForm = document.getElementById('radinai-inquiry-form');
  if (inquiryForm) {
    var startedAt = Date.now();
    var params = new URLSearchParams(window.location.search);
    var subjectSelect = inquiryForm.querySelector('[name="serviceType"]');
    var notesArea = inquiryForm.querySelector('[name="notes"]');

    var trackParam = params.get('track');
    var topicParam = params.get('topic');
    var addonsParam = params.get('addons');

    if (subjectSelect && trackParam) {
      var map = {
        'wp-plugin': 'خرید یا سفارشی‌سازی افزونه وردپرس (دفتریار)',
        'flagship-web': 'طراحی وب‌سایت اختصاصی و چندزبانه',
        'custom-saas': 'توسعه نرم‌افزار صفرتاصد و پلتفرم اختصاصی',
        'ai-enterprise': 'اتوماسیون هوشمند و راهکار نرم‌افزاری سازمانی',
      };
      if (map[trackParam]) subjectSelect.value = map[trackParam];
    } else if (subjectSelect && topicParam) {
      subjectSelect.value = 'خرید یا سفارشی‌سازی افزونه وردپرس (دفتریار)';
    }

    if (notesArea && addonsParam && !notesArea.value) {
      notesArea.value = 'ماژول‌های انتخاب‌شده در تخمین‌گر: ' + addonsParam + '\n';
    }

    inquiryForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var submitBtn = inquiryForm.querySelector('[type="submit"]');
      var feedback = document.getElementById('inquiry-feedback');
      var fd = new FormData(inquiryForm);

      var payload = {
        name: String(fd.get('name') || '').trim(),
        contact: String(fd.get('contact') || '').trim(),
        company: String(fd.get('company') || '').trim(),
        serviceType: String(fd.get('serviceType') || '').trim(),
        notes: String(fd.get('notes') || '').trim(),
        website_url: String(fd.get('website_url') || '').trim(),
        elapsedMs: Date.now() - startedAt,
      };

      if (!payload.name || !payload.contact) {
        if (feedback) {
          feedback.className = 'form-feedback is-err';
          feedback.textContent = 'لطفاً نام و شماره تماس یا ایمیل خود را وارد فرمایید تا بتوانیم پاسخ را ارسال کنیم.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'در حال ثبت درخواست...';
      }

      fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.ok) {
            if (feedback) {
              feedback.className = 'form-feedback is-ok';
              feedback.innerHTML = '';
              var p1 = document.createElement('div');
              p1.style.fontWeight = '800';
              p1.style.marginBottom = '6px';
              p1.textContent = 'درخواست شما با کد پیگیری «' + data.reference + '» ثبت شد.';
              var p2 = document.createElement('div');
              p2.textContent = 'برای تسریع در هماهنگی جلسه فنی، می‌توانید خلاصه همین درخواست را با یک کلیک در واتس‌اپ نیز ارسال کنید:';
              feedback.appendChild(p1);
              feedback.appendChild(p2);
              if (data.whatsappUrl) {
                var waLink = document.createElement('a');
                waLink.href = data.whatsappUrl;
                waLink.target = '_blank';
                waLink.rel = 'noopener noreferrer';
                waLink.className = 'btn btn-primary btn-sm';
                waLink.style.marginTop = '10px';
                waLink.textContent = 'ارسال مستقیم خلاصه در واتس‌اپ';
                feedback.appendChild(waLink);
              }
            }
            inquiryForm.reset();
            startedAt = Date.now();
          } else {
            throw new Error((data && data.error) || 'خطا در ثبت');
          }
        })
        .catch(function () {
          if (feedback) {
            feedback.className = 'form-feedback is-err';
            feedback.textContent = 'ارتباط با سرویس لبه موقتاً برقرار نشد. می‌توانید مستقیماً از طریق دکمه واتس‌اپ یا ایمیل کنار فرم پیام دهید.';
          }
        })
        .finally(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'ثبت استعلام و دریافت کد پیگیری';
          }
        });
    });
  }
})();
