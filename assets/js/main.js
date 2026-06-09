/**
 * Coding Interview Hacks — Core JS
 * Search, theme, keyboard shortcuts, recently viewed, navigation
 */

/* ── Theme ──────────────────────────────────────────────────── */
const ThemeManager = (() => {
  const KEY = 'cih-theme';
  const btn = () => document.getElementById('theme-toggle');

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(KEY, theme);
    const el = btn();
    if (el) el.setAttribute('aria-label', 'Toggle ' + (theme === 'dark' ? 'light' : 'dark') + ' mode');
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    apply(current === 'dark' ? 'light' : 'dark');
  }

  function init() {
    const saved = localStorage.getItem(KEY);
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    apply(saved || preferred);
    const el = btn();
    if (el) el.addEventListener('click', toggle);
  }

  return { init, toggle };
})();

/* ── Search ─────────────────────────────────────────────────── */
const Search = (() => {
  let index = [];
  let input, results;

  async function loadIndex() {
    try {
      const root = document.body.dataset.root || '.';
      const res = await fetch(root + '/search-index.json');
      index = await res.json();
    } catch (e) {
      index = [];
    }
  }

  function query(term) {
    if (!term || term.length < 2) return [];
    const t = term.toLowerCase();
    return index.filter(item =>
      item.title.toLowerCase().includes(t) ||
      (item.tags && item.tags.some(tag => tag.toLowerCase().includes(t))) ||
      (item.pattern && item.pattern.toLowerCase().includes(t)) ||
      (item.category && item.category.toLowerCase().includes(t))
    ).slice(0, 8);
  }

  function renderResults(items) {
    if (!results) return;
    results.innerHTML = '';
    if (!items.length) {
      results.classList.remove('active');
      return;
    }
    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'search-result-item';
      el.innerHTML = `
        <div class="search-result-item__icon">${item.type === 'problem' ? '#' : '⌥'}</div>
        <div class="search-result-item__text">
          <h4>${item.title}</h4>
          <p>${item.category || ''} ${item.difficulty ? '· ' + item.difficulty : ''}</p>
        </div>`;
      el.addEventListener('click', () => {
        window.location.href = item.url;
      });
      results.appendChild(el);
    });
    results.classList.add('active');
  }

  function init() {
    input = document.getElementById('search-input');
    results = document.getElementById('search-results');
    if (!input) return;

    loadIndex();

    input.addEventListener('input', e => renderResults(query(e.target.value)));
    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') { results.classList.remove('active'); input.blur(); }
    });

    document.addEventListener('click', e => {
      if (!input.contains(e.target) && !results?.contains(e.target)) {
        results?.classList.remove('active');
      }
    });
  }

  return { init, query };
})();

/* ── Recently Viewed ────────────────────────────────────────── */
const RecentlyViewed = (() => {
  const KEY = 'cih-recent';
  const MAX = 8;

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }

  function add(item) {
    let list = getAll().filter(i => i.url !== item.url);
    list.unshift(item);
    if (list.length > MAX) list = list.slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(list));
  }

  function trackCurrent() {
    const title = document.querySelector('[data-page-title]')?.dataset?.pageTitle;
    const url = window.location.pathname;
    if (title) add({ title, url, ts: Date.now() });
  }

  function renderWidget() {
    const container = document.getElementById('recently-viewed');
    if (!container) return;
    const list = getAll();
    if (!list.length) { container.closest('.sidebar__section')?.remove(); return; }
    container.innerHTML = list.map(i =>
      `<a href="${i.url}" class="sidebar__link">${i.title}</a>`
    ).join('');
  }

  function init() { trackCurrent(); renderWidget(); }
  return { init, add, getAll };
})();

/* ── Keyboard Shortcuts ─────────────────────────────────────── */
const Shortcuts = (() => {
  function init() {
    document.addEventListener('keydown', e => {
      const tag = document.activeElement?.tagName;
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA';

      // / → focus search
      if (e.key === '/' && !inInput) {
        e.preventDefault();
        document.getElementById('search-input')?.focus();
        return;
      }

      if (inInput) return;

      // ← → → page navigation
      const prevLink = document.querySelector('[data-nav="prev"]');
      const nextLink = document.querySelector('[data-nav="next"]');

      if (e.key === 'ArrowLeft' && prevLink) {
        e.preventDefault();
        window.location.href = prevLink.href;
      }
      if (e.key === 'ArrowRight' && nextLink) {
        e.preventDefault();
        window.location.href = nextLink.href;
      }
    });
  }
  return { init };
})();

/* ── Code Copy ──────────────────────────────────────────────── */
const CodeCopy = (() => {
  function init() {
    document.querySelectorAll('.code-copy-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const pre = btn.closest('.code-block')?.querySelector('pre');
        if (!pre) return;
        try {
          await navigator.clipboard.writeText(pre.innerText);
          btn.textContent = '✓ Copied';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        } catch {}
      });
    });
  }
  return { init };
})();

/* ── Table of Contents Active Tracking ─────────────────────── */
const TOC = (() => {
  function init() {
    const links = document.querySelectorAll('.toc-link');
    if (!links.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

    links.forEach(link => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id && document.getElementById(id);
      if (target) observer.observe(target);
    });
  }
  return { init };
})();

/* ── Category Filter (Dashboard) ───────────────────────────── */
const CategoryFilter = (() => {
  function init() {
    const chips = document.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.topic-card');
    if (!chips.length) return;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.category;
        cards.forEach(card => {
          if (cat === 'all') {
            card.style.display = '';
          } else {
            const cardCat = card.dataset.category || '';
            card.style.display = cardCat.toLowerCase() === cat.toLowerCase() ? '' : 'none';
          }
        });
      });
    });
  }
  return { init };
})();

/* ── Toast ──────────────────────────────────────────────────── */
const Toast = (() => {
  let el;
  function show(msg, duration = 2500) {
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duration);
  }
  return { show };
})();

/* ── Mobile nav toggle ──────────────────────────────────────── */
const MobileNav = (() => {
  function init() {
    const btn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', () => {
      sidebar.style.display = sidebar.style.display === 'block' ? '' : 'block';
    });
  }
  return { init };
})();

/* ── Boot ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Search.init();
  RecentlyViewed.init();
  Shortcuts.init();
  CodeCopy.init();
  TOC.init();
  CategoryFilter.init();
  MobileNav.init();
});
