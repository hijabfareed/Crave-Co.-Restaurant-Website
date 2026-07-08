/**
 * Crave Co. Restaurant — Main JavaScript
 * Handles: preloader, navbar, scroll reveal, menu filter,
 *          reservation form, contact form, scroll-to-top
 */

'use strict';

/* ── Preloader ──────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => preloader.classList.add('hidden'), 400);
  }
});

/* ── Navbar Scroll Behaviour ────────────────────────────────── */
(function initNavbar() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const SCROLL_THRESHOLD = 80;

  function updateNav() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* Active link highlighting */
  const navLinks = nav.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || href.endsWith(currentPath))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* Close mobile menu on link click */
  const navbarCollapse = nav.querySelector('.navbar-collapse');
  if (navbarCollapse) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          const toggler = nav.querySelector('.navbar-toggler');
          if (toggler) toggler.click();
        }
      });
    });
  }
})();

/* ── Scroll-to-Top Button ───────────────────────────────────── */
(function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Scroll Reveal ──────────────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* ── Counter Animation ──────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;

        const update = () => {
          current = Math.min(current + step, target);
          el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
          if (current < target) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ── Menu Filter & Search ───────────────────────────────────── */
(function initMenuFilter() {
  const filterBtns = document.querySelectorAll('.menu-filter-btn');
  const menuItems  = document.querySelectorAll('[data-category]');
  const searchInput = document.getElementById('menuSearch');

  if (!filterBtns.length && !searchInput) return;

  let activeCategory = 'all';

  /* Cache name/desc strings on init for performance */
  menuItems.forEach(item => {
    if (!item.dataset.nameCached) {
      item.dataset.nameCached = (
        item.dataset.name ||
        item.querySelector('.menu-card__title, .menu-item-row__name')?.textContent ||
        ''
      ).toLowerCase();
    }
    if (!item.dataset.descCached) {
      item.dataset.descCached = (
        item.dataset.desc ||
        item.querySelector('.menu-card__desc, .menu-item-row__desc')?.textContent ||
        ''
      ).toLowerCase();
    }
  });

  function filterItems() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';

    menuItems.forEach(item => {
      const cat   = item.dataset.category || '';
      const name  = item.dataset.nameCached || '';
      const desc  = item.dataset.descCached || '';

      const matchesCat   = activeCategory === 'all' || cat === activeCategory;
      const matchesQuery = !query || name.includes(query) || desc.includes(query);

      if (matchesCat && matchesQuery) {
        item.style.display = '';
        item.classList.remove('hidden');
      } else {
        item.style.display = 'none';
        item.classList.add('hidden');
      }
    });

    /* Hide section headings with no visible items */
    document.querySelectorAll('.menu-section').forEach(section => {
      const visible = section.querySelectorAll('[data-category]:not([style*="none"])');
      section.style.display = visible.length ? '' : 'none';
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
      filterItems();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterItems);
  }
})();

/* ── Reservation Form ───────────────────────────────────────── */
(function initReservationForm() {
  const form  = document.getElementById('reservationForm');
  const alert = document.getElementById('reservationAlert');
  if (!form) return;

  /* Set min date to today */
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Reserving…';

    /* Simulate API call */
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      form.classList.remove('was-validated');

      if (alert) {
        alert.className = 'form-alert success';
        alert.textContent = '🎉 Reservation confirmed! We\'ll send a confirmation to your email shortly.';
        alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { alert.className = 'form-alert'; }, 7000);
      }
    }, 1500);
  });
})();

/* ── Contact Form ───────────────────────────────────────────── */
(function initContactForm() {
  const form  = document.getElementById('contactForm');
  const alert = document.getElementById('contactAlert');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Sending…';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      form.reset();
      form.classList.remove('was-validated');

      if (alert) {
        alert.className = 'form-alert success';
        alert.textContent = '✅ Message sent! We\'ll get back to you within 24 hours.';
        alert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { alert.className = 'form-alert'; }, 7000);
      }
    }, 1200);
  });
})();

/* ── Newsletter Form ────────────────────────────────────────── */
(function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button[type="submit"]');
    if (!emailInput || !emailInput.value) return;

    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Subscribing…';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '✓ Subscribed!';
      emailInput.value = '';
      setTimeout(() => { btn.textContent = original; }, 3000);
    }, 900);
  });
})();

/* ── Hero Parallax (subtle) ─────────────────────────────────── */
(function initParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
  }, { passive: true });
})();

/* ── Smooth anchor scroll ───────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = document.getElementById('mainNav')?.offsetHeight || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Lazy image loading ─────────────────────────────────────── */
(function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.classList.add('lazy');
        observer.unobserve(img);
      });
    },
    { rootMargin: '200px' }
  );

  images.forEach(img => observer.observe(img));
})();

/* ── Current year in footer ─────────────────────────────────── */
const yearEls = document.querySelectorAll('[data-year]');
yearEls.forEach(el => { el.textContent = new Date().getFullYear(); });
