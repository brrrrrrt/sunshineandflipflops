/* ============================================================
   Sunshine & Flip Flops — Interaction layer
   ============================================================ */

(() => {
  'use strict';

  // ----- Header scroll state -----
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- Reveal on scroll -----
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  // ----- Visibility fallback -----
  // In offscreen/background render contexts (static capture, unfocused
  // preview) the animation timeline can be paused, trapping entrance
  // effects at their hidden start frame. When that's likely (no focus) or
  // motion is reduced, force the settled state via a static, transition-free
  // override so content is never stuck invisible. Focused, foreground tabs
  // keep the full scroll/entrance animations untouched.
  const settle = () => document.documentElement.classList.add('settled');
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    settle();
  } else {
    const maybeSettle = () => { if (!document.hasFocus()) settle(); };
    setTimeout(maybeSettle, 1600);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') settle();
    });
  }

  // ----- Subtle hero parallax -----
  const heroBg = document.getElementById('heroBg');
  let rafId = null;
  const applyParallax = () => {
    rafId = null;
    if (!heroBg) return;
    const y = Math.min(window.scrollY, 800);
    heroBg.style.transform = `scale(1.12) translate3d(0, ${y * 0.18}px, 0)`;
  };
  document.addEventListener('scroll', () => {
    if (rafId == null) rafId = requestAnimationFrame(applyParallax);
  }, { passive: true });

  // ----- Specialties expand -----
  const specCards = document.querySelectorAll('.spec-card');
  specCards.forEach((card) => {
    const trigger = card.querySelector('.spec-trigger');
    trigger.addEventListener('click', () => {
      const open = card.classList.contains('open');
      specCards.forEach((c) => {
        c.classList.remove('open');
        c.querySelector('.spec-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!open) {
        card.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ----- FAQ accordion -----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    trigger.addEventListener('click', () => {
      const open = item.classList.contains('open');
      if (open) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ----- Filmstrip -----
  const filmstrip = document.getElementById('filmstrip');
  if (filmstrip) {
    const slides = filmstrip.querySelectorAll('.filmstrip-slide');
    const thumbs = filmstrip.querySelectorAll('.filmstrip-thumb');
    const counter = filmstrip.querySelector('.filmstrip-counter .current');
    const progress = document.getElementById('filmProgress');
    const prevBtn = document.getElementById('filmPrev');
    const nextBtn = document.getElementById('filmNext');
    const playBtn = document.getElementById('filmPlay');
    const playIcon = document.getElementById('filmPlayIcon');

    const DURATION = 5200;
    let idx = 0;
    let playing = (window.TWEAK_DEFAULTS && window.TWEAK_DEFAULTS.autoplay) !== false;
    let start = performance.now();
    let raf;
    let inView = true;

    const setActive = (n) => {
      idx = (n + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === idx));
      thumbs.forEach((t, i) => t.classList.toggle('active', i === idx));
      counter.textContent = String(idx + 1).padStart(2, '0');
      start = performance.now();
      progress.style.width = '0%';
    };

    const tick = (t) => {
      if (!playing || !inView) { raf = requestAnimationFrame(tick); return; }
      const pct = Math.min(1, (t - start) / DURATION);
      progress.style.width = (pct * 100) + '%';
      if (pct >= 1) setActive(idx + 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    prevBtn.addEventListener('click', () => setActive(idx - 1));
    nextBtn.addEventListener('click', () => setActive(idx + 1));
    thumbs.forEach((t) => {
      t.addEventListener('click', () => setActive(parseInt(t.dataset.idx, 10)));
    });

    const updatePlayIcon = () => {
      if (playing) {
        playIcon.innerHTML =
          '<rect x="3" y="2" width="3" height="10" rx="1"/><rect x="8" y="2" width="3" height="10" rx="1"/>';
        playBtn.setAttribute('aria-label', 'Pause');
      } else {
        playIcon.innerHTML = '<path d="M3 2l9 5-9 5z"/>';
        playBtn.setAttribute('aria-label', 'Play');
      }
    };
    playBtn.addEventListener('click', () => {
      playing = !playing;
      if (playing) start = performance.now() - (parseFloat(progress.style.width || 0) / 100) * DURATION;
      updatePlayIcon();
    });
    updatePlayIcon();

    // Pause when out of view
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { inView = e.isIntersecting; });
      }, { threshold: 0.1 });
      io.observe(filmstrip);
    }

    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (!filmstrip.getBoundingClientRect().top < window.innerHeight) return;
      if (e.key === 'ArrowLeft') setActive(idx - 1);
      if (e.key === 'ArrowRight') setActive(idx + 1);
    });

    // expose for tweaks
    window.__sff_filmstrip = {
      setAutoplay: (on) => { playing = on; updatePlayIcon(); }
    };
  }

  // ----- Smooth-scroll for anchors with header offset -----
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // ----- Tweak appliers (palette / type / hero defaults) -----
  window.__sff_applyTweaks = (t) => {
    const root = document.documentElement;
    if (t.palette) root.setAttribute('data-palette', t.palette);
    if (t.typeset) root.setAttribute('data-typeset', t.typeset);
    if (t.hero) {
      const map = {
        'sunset':   'assets/hero-sunset.jpg',
        'bermuda':  'assets/g-bermuda.jpg',
        'pitons':   'assets/g-pitons.jpg',
        'hammock':  'assets/g-hammock.jpg',
      };
      const url = map[t.hero] || map.sunset;
      const bg = document.getElementById('heroBg');
      if (bg) bg.style.backgroundImage = `url('${url}')`;
    }
    if (typeof t.autoplay === 'boolean' && window.__sff_filmstrip) {
      window.__sff_filmstrip.setAutoplay(t.autoplay);
    }
  };

  // Apply defaults on load
  if (window.TWEAK_DEFAULTS) window.__sff_applyTweaks(window.TWEAK_DEFAULTS);

})();
