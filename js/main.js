/* =========================================================
   Lashesta Turner — interactivity
   ========================================================= */
(function () {
  'use strict';

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

  /* ---------- Social feed (mocked integrated feed) ---------- */
  (function () {
    var grid = document.querySelector('[data-social-rail]');
    if (!grid) return;
    var posts = [
      {
        img: 'assets/img/gallery-3.webp',
        handle: '@lashesta.turner',
        platform: 'Instagram · 2d',
        avatar: 'L',
        caption: 'Behind the scenes from the Golden Hours editorial. Warm rim-light does all the heavy lifting.',
        likes: '1.2k', comments: '48'
      },
      {
        img: 'assets/img/trading.webp',
        handle: 'Lashesta Turner',
        platform: 'X · 5h',
        avatar: 'L',
        caption: 'Risk first, strategy second. If you can\'t define your stop before entry, you\'re gambling.',
        likes: '320', comments: '61'
      },
      {
        img: 'assets/img/gardening.webp',
        handle: '@lashesta.turner',
        platform: 'Instagram · 1w',
        avatar: 'L',
        caption: 'First tomato harvest of the season. Patience compounds — in the garden and the markets.',
        likes: '2.4k', comments: '187'
      }
    ];

    var heartIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    var commentIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    grid.innerHTML = posts.map(function (p) {
      return ''
        + '<div class="social-card">'
        + '  <div class="social-card__media"><img src="' + p.img + '" alt="" loading="lazy"></div>'
        + '  <div class="social-card__body">'
        + '    <div class="social-card__head">'
        + '      <div class="social-card__avatar">' + p.avatar + '</div>'
        + '      <div>'
        + '        <div class="social-card__handle">' + p.handle + '</div>'
        + '        <div class="social-card__platform">' + p.platform + '</div>'
        + '      </div>'
        + '    </div>'
        + '    <p class="social-card__caption">' + p.caption + '</p>'
        + '    <div class="social-card__stats">'
        + '      <span>' + heartIcon + p.likes + '</span>'
        + '      <span>' + commentIcon + p.comments + '</span>'
        + '    </div>'
        + '  </div>'
        + '</div>';
    }).join('');
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
