/* RadinAI Motion Engine — GSAP 3 + ScrollTrigger + Lenis + VibeFarsi Spotlight
 * Zero opacity:0 traps: every element remains 100% readable without JS or under reduced motion.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  /* 1. VibeFarsi Cursor Spotlight Surface Tracking */
  if (!reduced && finePointer) {
    document.querySelectorAll('.vf-card-dark, .vf-card-light').forEach(function (card) {
      card.addEventListener(
        'pointermove',
        function (ev) {
          var r = card.getBoundingClientRect();
          card.style.setProperty('--mx', ev.clientX - r.left + 'px');
          card.style.setProperty('--my', ev.clientY - r.top + 'px');
        },
        { passive: true }
      );
    });
  }

  if (reduced || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  /* 2. Desktop Lenis Smooth Inertial Scroll synced to GSAP Ticker */
  if (window.innerWidth >= 1024 && typeof window.Lenis !== 'undefined') {
    var lenis = new window.Lenis({ lerp: 0.11, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* 3. Top Viewport Scroll Laser */
  var laser = document.getElementById('scroll-laser');
  if (laser) {
    gsap.to(laser, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15,
      },
    });
  }

  /* 4. Magnetic Primary Buttons & Subtle 3D Hero Workbench Tilt */
  if (finePointer) {
    document.querySelectorAll('[data-magnetic]').forEach(function (btn) {
      var xTo = gsap.quickTo(btn, 'x', { duration: 0.32, ease: 'power3.out' });
      var yTo = gsap.quickTo(btn, 'y', { duration: 0.32, ease: 'power3.out' });
      btn.addEventListener('pointermove', function (ev) {
        var r = btn.getBoundingClientRect();
        var dx = (ev.clientX - (r.left + r.width / 2)) * 0.2;
        var dy = (ev.clientY - (r.top + r.height / 2)) * 0.24;
        xTo(Math.max(-7, Math.min(7, dx)));
        yTo(Math.max(-5, Math.min(5, dy)));
      });
      btn.addEventListener('pointerleave', function () {
        xTo(0);
        yTo(0);
      });
    });

    var heroStage = document.querySelector('.hero-stage');
    var workbench = document.getElementById('hero-workbench');
    if (heroStage && workbench && window.innerWidth >= 1080) {
      var rxTo = gsap.quickTo(workbench, 'rotationX', { duration: 0.5, ease: 'power2.out' });
      var ryTo = gsap.quickTo(workbench, 'rotationY', { duration: 0.5, ease: 'power2.out' });
      heroStage.addEventListener(
        'pointermove',
        function (ev) {
          var r = heroStage.getBoundingClientRect();
          var nx = (ev.clientX - r.left) / r.width - 0.5;
          var ny = (ev.clientY - r.top) / r.height - 0.5;
          ryTo(nx * 4.5);
          rxTo(-ny * 3.8);
        },
        { passive: true }
      );
      heroStage.addEventListener('pointerleave', function () {
        rxTo(0);
        ryTo(0);
      });
    }
  }

  /* 5. Orchestrated Hero Settle (Transform-only, Zero Opacity Trap) */
  if (workbench) {
    gsap.fromTo(
      workbench,
      { y: 18 },
      { y: 0, duration: 0.75, ease: 'power3.out', clearProps: 'transform' }
    );
  }
})();
