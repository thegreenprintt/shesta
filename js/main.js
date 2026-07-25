/* =========================================================
   Lashesta Turner — interactivity
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Hero parallax ---------- */
  (function () {
    var portrait = document.querySelector('.hero__portrait');
    var bg = document.querySelector('.hero__bg');
    if (!portrait && !bg) return;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    var ticking = false;
    function update() {
      var y = window.scrollY;
      if (y < window.innerHeight) {
        if (portrait) portrait.style.transform = 'translateY(' + (y * 0.12) + 'px)';
        if (bg) bg.style.transform = 'translateY(' + (y * 0.06) + 'px)';
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  })();

  /* ---------- Theme toggle ---------- */
  (function () {
    var toggle = document.querySelector('[data-theme-toggle]');
    var root = document.documentElement;
    // The brand is dark-themed by default; light mode is opt-in via the toggle only.
    // State is held in-memory (the preview iframe blocks localStorage).
    var mode = 'dark';
    applyTheme(mode);

    function applyTheme(m) {
      root.setAttribute('data-theme', m);
      if (toggle) {
        toggle.setAttribute('aria-label', 'Switch to ' + (m === 'dark' ? 'light' : 'dark') + ' mode');
        toggle.innerHTML = m === 'dark'
          ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
          : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      }
    }

    if (toggle) {
      toggle.addEventListener('click', function () {
        var current = root.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
      });
    }
  })();

  /* ---------- Year ---------- */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- Sticky header behavior ---------- */
  (function () {
    var header = document.getElementById('header');
    if (!header) return;
    var last = 0;
    function onScroll() {
      var top = window.scrollY;
      if (top > 24) header.classList.add('header--scrolled');
      else header.classList.remove('header--scrolled');
      if (top > last && top > 200) header.classList.add('header--hidden');
      else header.classList.remove('header--hidden');
      last = top;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ---------- Mobile menu ---------- */
  (function () {
    var menu = document.querySelector('[data-mobile-menu]');
    var openBtn = document.querySelector('[data-menu-open]');
    if (!menu || !openBtn) return;
    openBtn.addEventListener('click', function () {
      menu.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
    menu.querySelectorAll('[data-menu-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        menu.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  })();

  /* ---------- Gallery filter ---------- */
  (function () {
    var buttons = document.querySelectorAll('.filter-btn');
    var shots = document.querySelectorAll('.shot');
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var f = btn.getAttribute('data-filter');
        shots.forEach(function (shot) {
          var cat = shot.getAttribute('data-category');
          var show = f === 'all' || cat === f;
          shot.style.display = show ? '' : 'none';
        });
      });
    });
  })();

  /* ---------- Active nav link on scroll ---------- */
  (function () {
    var links = document.querySelectorAll('.nav__link');
    var sections = ['photography', 'trading', 'garden', 'blog', 'social']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);
    if (!sections.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('is-active'); });
          var match = document.querySelector('.nav__link[href="#' + entry.target.id + '"]');
          if (match) match.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---------- Reveal on scroll ---------- */
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- Booking module ---------- */
  (function () {
    var overlay = document.querySelector('[data-booking-overlay]');
    if (!overlay) return;
    var form = document.querySelector('[data-booking-form]');
    var success = document.querySelector('[data-booking-success]');
    var serviceField = document.querySelector('[data-service-field]');
    var subtitle = document.querySelector('[data-booking-subtitle]');
    var successSummary = document.querySelector('[data-success-summary]');
    var sessionTypes = document.querySelectorAll('.session-type');

    function open(service) {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      form.hidden = false;
      success.hidden = true;
      if (service) {
        serviceField.value = service;
        subtitle.textContent = 'Discovery call for ' + service + ' — tell me what you\'re dreaming up.';
        sessionTypes.forEach(function (st) {
          st.classList.toggle('is-selected', st.getAttribute('data-service-name') === service);
        });
      } else {
        subtitle.textContent = 'Tell me what you\'re dreaming up and I\'ll reach out within 24 hours.';
      }
    }
    function close() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // All triggers (buttons / links) open the modal
    document.querySelectorAll('[data-book-trigger]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        open(el.getAttribute('data-service'));
      });
    });
    document.querySelectorAll('[data-book-close]').forEach(function (el) {
      el.addEventListener('click', close);
    });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });

    // Session type selection
    sessionTypes.forEach(function (st) {
      st.addEventListener('click', function () {
        sessionTypes.forEach(function (s) { s.classList.remove('is-selected'); });
        st.classList.add('is-selected');
        serviceField.value = st.getAttribute('data-service-name');
        subtitle.textContent = 'Discovery call for ' + st.getAttribute('data-service-name') + ' — tell me what you\'re dreaming up.';
      });
    });

    // Set min date to today
    var dateInput = document.getElementById('bk-date');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Submit -> success summary
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var date = (data.get('date') || '').toString();
      var time = (data.get('time') || '').toString();
      var service = serviceField.value;
      var pretty = date
        ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
        : 'a scheduled date';
      successSummary.textContent = 'Thanks, ' + (name || 'friend') + '. I\'ve noted your discovery call request for ' + service + ' on ' + pretty + (time ? ' (' + time + ')' : '') + '. I\'ll email you shortly to confirm.';
      form.hidden = true;
      success.hidden = false;
    });
  })();

})();

/* =========================================================
   CINEMATIC LAYER
   Lightbox · scroll progress · sticky header · parallax
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress bar + sticky header state ---------- */
  (function () {
    var header = document.getElementById('header');
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var scrolled = window.scrollY;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
        if (header) header.classList.toggle('is-scrolled', scrolled > 40);
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ---------- Gallery lightbox ---------- */
  (function () {
    var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
    if (!shots.length) return;

    // Build the lightbox shell once
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('aria-hidden', 'true');
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Close">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<button class="lightbox__nav lightbox__nav--prev" aria-label="Previous photo">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 18l-6-6 6-6"/></svg>' +
      '</button>' +
      '<button class="lightbox__nav lightbox__nav--next" aria-label="Next photo">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 18l6-6-6-6"/></svg>' +
      '</button>' +
      '<figure class="lightbox__figure">' +
        '<img class="lightbox__img" alt="" />' +
        '<figcaption class="lightbox__caption"><span data-lb-cat></span><em data-lb-title></em></figcaption>' +
      '</figure>';
    document.body.appendChild(box);

    var img = box.querySelector('.lightbox__img');
    var catEl = box.querySelector('[data-lb-cat]');
    var titleEl = box.querySelector('[data-lb-title]');
    var index = 0;
    var lastFocus = null;

    // Add the expand glyph + make each shot keyboard-openable
    shots.forEach(function (shot, i) {
      var glyph = document.createElement('span');
      glyph.className = 'shot__expand';
      glyph.setAttribute('aria-hidden', 'true');
      glyph.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>';
      shot.appendChild(glyph);

      shot.addEventListener('click', function (e) {
        // don't hijack the "book a discovery call" button inside the overlay
        if (e.target.closest('[data-book-trigger]')) return;
        open(i);
      });
      shot.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          if (e.target.closest('[data-book-trigger]')) return;
          e.preventDefault();
          open(i);
        }
      });
    });

    function render() {
      var shot = shots[index];
      var source = shot.querySelector('img');
      if (!source) return;
      img.src = source.getAttribute('src');
      img.alt = source.getAttribute('alt') || '';
      var cat = shot.querySelector('.shot__cat');
      var title = shot.querySelector('.shot__title');
      catEl.textContent = cat ? cat.textContent : '';
      titleEl.textContent = title ? title.textContent : '';
    }

    function open(i) {
      index = i;
      lastFocus = document.activeElement;
      render();
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(function () { box.classList.add('is-visible'); });
      box.querySelector('.lightbox__close').focus();
    }

    function close() {
      box.classList.remove('is-visible');
      box.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(function () { box.classList.remove('is-open'); }, reduceMotion ? 0 : 320);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function step(dir) {
      index = (index + dir + shots.length) % shots.length;
      // fade the swap so it doesn't snap
      img.style.opacity = '0';
      setTimeout(function () { render(); img.style.opacity = ''; }, reduceMotion ? 0 : 160);
    }

    box.querySelector('.lightbox__close').addEventListener('click', close);
    box.querySelector('.lightbox__nav--prev').addEventListener('click', function () { step(-1); });
    box.querySelector('.lightbox__nav--next').addEventListener('click', function () { step(1); });
    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });
    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  })();

  /* ---------- Subtle hero parallax ---------- */
  (function () {
    if (reduceMotion) return;
    var portrait = document.querySelector('.hero__portrait');
    if (!portrait) return;
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y < window.innerHeight * 1.2) {
          portrait.style.transform = 'translateY(' + (y * 0.08) + 'px)';
        }
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ---------- Stagger the reveal of sibling cards ---------- */
  (function () {
    var groups = document.querySelectorAll('.pkg-grid, .season-grid, .brand-list, .gallery__grid');
    Array.prototype.forEach.call(groups, function (group) {
      var items = group.querySelectorAll('.reveal');
      Array.prototype.forEach.call(items, function (item, i) {
        item.style.transitionDelay = (i * 90) + 'ms';
      });
    });
  })();

})();

/* ---------- FAQ: only one answer open at a time ---------- */
(function () {
  var items = document.querySelectorAll('.faq__item');
  Array.prototype.forEach.call(items, function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      Array.prototype.forEach.call(items, function (other) {
        if (other !== item) other.open = false;
      });
    });
  });
})();
