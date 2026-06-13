/**
 * LC150 Enhanced — LeetCode Top Interview 150 row enhancements
 *
 * For every problem row inside .lc150-list:
 *   1. Adds a "Details" link to the internal explanation page
 *   2. Adds a solved checkbox
 *   3. Loads solved state from /api/solved (falls back to localStorage)
 *   4. Saves solved state to /api/solved on checkbox change
 *   5. Applies solved visual treatment
 *   6. Tracks per-category + total progress
 */

const LC150 = (() => {

  /* ── Map: existing /problems/ pages that already have detail pages ──
   *
   * NOTE: Array/String LC150 problems are intentionally NOT listed here —
   * they use the new /leetcode/top-interview-150/<slug> route which has
   * the full 6-section explanation format.
   * Only non-LC150 problems (or categories not yet migrated) go here.
   * ─────────────────────────────────────────────────────────────────── */
  const EXISTING_PAGES = {
    'two-sum': 'problems/two-sum.html',
    // all LC150 categories now use /leetcode/top-interview-150/<slug>
  };

  /* ── Derive slug from an <a> href ──────────────────────────────────── */
  function slugFromHref(href) {
    if (!href) return null;
    // LeetCode URL: https://leetcode.com/problems/two-sum/
    const lcMatch = href.match(/leetcode\.com\/problems\/([^/]+)/);
    if (lcMatch) return lcMatch[1];
    // Internal: problems/two-sum.html
    const intMatch = href.match(/problems\/([^/]+)\.html/);
    if (intMatch) return intMatch[1];
    return null;
  }

  /* ── Build the details URL for a slug ──────────────────────────────── */
  function detailUrl(slug) {
    if (EXISTING_PAGES[slug]) return EXISTING_PAGES[slug];
    return 'leetcode/top-interview-150/' + slug;
  }

  /* ── Solved state storage ───────────────────────────────────────────── */
  const LOCAL_KEY = 'lc150-solved-v1';
  let solvedState = {};

  async function loadSolvedState() {
    try {
      const res = await fetch('/api/solved', { cache: 'no-store' });
      if (res.ok) {
        solvedState = await res.json();
        return;
      }
    } catch { /* server not running */ }
    // Fallback: localStorage
    try { solvedState = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch {}
  }

  async function saveSolvedState(slug, solved) {
    solvedState[slug] = solved;
    // Optimistically save to localStorage as backup
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(solvedState)); } catch {}
    // Try server
    try {
      await fetch('/api/solved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [slug]: solved })
      });
    } catch { /* server not running — localStorage already saved above */ }
  }

  /* ── Apply solved visual treatment to a row ────────────────────────── */
  function applyRowStyle(li, solved) {
    li.classList.toggle('lc150-row--solved', !!solved);
    const chk = li.querySelector('.lc150-chk');
    if (chk) chk.checked = !!solved;
  }

  /* ── Enhance a single <li> ──────────────────────────────────────────── */
  function enhanceRow(li) {
    const lcLink = li.querySelector('a');
    if (!lcLink) return;

    const slug = slugFromHref(lcLink.getAttribute('href'));
    if (!slug) return;

    li.dataset.slug = slug;

    // Ensure the LC link always points to leetcode.com (rewrite internal page links)
    const existingHref = lcLink.getAttribute('href') || '';
    if (!existingHref.includes('leetcode.com')) {
      lcLink.href = 'https://leetcode.com/problems/' + slug + '/';
    }
    lcLink.setAttribute('target', '_blank');
    lcLink.setAttribute('rel', 'noopener noreferrer');
    lcLink.classList.add('lc150-title-link');

    // Capture badge and freq-pill before clearing innerHTML
    const badge    = li.querySelector('.badge');
    const freqPill = li.querySelector('.freq-pill');

    // Details link
    const detailLink = document.createElement('a');
    detailLink.href = detailUrl(slug);
    detailLink.className = 'lc150-detail-btn';
    detailLink.textContent = 'Details';
    detailLink.title = 'Open explanation page';

    // Checkbox
    const label = document.createElement('label');
    label.className = 'lc150-check-wrap';
    label.title = 'Mark as solved';
    const chk = document.createElement('input');
    chk.type = 'checkbox';
    chk.className = 'lc150-chk';
    chk.checked = !!solvedState[slug];
    chk.addEventListener('change', async e => {
      e.stopPropagation();
      const solved = chk.checked;
      applyRowStyle(li, solved);
      await saveSolvedState(slug, solved);
      updateProgress();
    });
    label.appendChild(chk);
    const checkmark = document.createElement('span');
    checkmark.className = 'lc150-checkmark';
    label.appendChild(checkmark);

    // Rebuild row content: [title] [details btn] [badge] [freq-pill] [checkbox]
    li.innerHTML = '';
    li.appendChild(lcLink);
    li.appendChild(detailLink);
    if (badge)    li.appendChild(badge);
    if (freqPill) li.appendChild(freqPill);
    li.appendChild(label);

    // Apply saved state
    applyRowStyle(li, !!solvedState[slug]);
  }

  /* ── Update category + total progress counters ──────────────────────── */
  function updateProgress() {
    let total = 0, solved = 0;
    document.querySelectorAll('.lc150-cat').forEach(cat => {
      const rows = cat.querySelectorAll('.lc150-row--solved');
      const all  = cat.querySelectorAll('[data-slug]');
      const catSolved = rows.length;
      const catTotal  = all.length;
      total  += catTotal;
      solved += catSolved;

      // Update category count badge if present
      const countEl = cat.querySelector('.lc150-cat__count');
      if (countEl) {
        countEl.textContent = catSolved
          ? catSolved + '/' + catTotal
          : catTotal;
        countEl.classList.toggle('lc150-cat__count--progress', catSolved > 0);
      }
    });

    // Update total stats strip
    const solvedEl = document.getElementById('lc150-solved-count');
    const barEl    = document.getElementById('lc150-progress-bar');
    const pctEl    = document.getElementById('lc150-pct');
    if (solvedEl) solvedEl.textContent = solved;
    if (barEl)    barEl.style.width = (total ? (solved / total * 100) : 0) + '%';
    if (pctEl)    pctEl.textContent  = total ? Math.round(solved / total * 100) + '%' : '0%';
  }

  /* ── Build slug→{title,diff,cat} map from the live DOM ─────────────── */
  function buildSlugMeta() {
    const map = {};
    document.querySelectorAll('.lc150-cat').forEach(cat => {
      const catName = cat.querySelector('.lc150-cat__name')?.textContent.trim() || '';
      cat.querySelectorAll('[data-slug]').forEach(row => {
        const slug    = row.dataset.slug;
        const title   = row.querySelector('.lc150-title-link')?.textContent.trim() || slug;
        const badge   = row.querySelector('.badge')?.textContent.trim() || '';
        const diff    = badge === 'E' ? 'easy' : badge === 'M' ? 'medium' : 'hard';
        map[slug] = { title, diff, cat: catName };
      });
    });
    return map;
  }

  /* ── Render "My Solved" summary grouped by category ─────────────────── */
  function renderSolvedSummary() {
    const section = document.getElementById('lc150-solved-section');
    const body    = document.getElementById('lc150-solved-body');
    const label   = document.getElementById('lc150-solved-label');
    if (!section || !body) return;

    const meta  = buildSlugMeta();
    const byCat = {};

    for (const [slug, val] of Object.entries(solvedState)) {
      if (!val) continue;
      const info = meta[slug];
      if (!info) continue;
      if (!byCat[info.cat]) byCat[info.cat] = [];
      byCat[info.cat].push({ slug, ...info });
    }

    const cats = Object.keys(byCat).sort();
    if (!cats.length) { section.style.display = 'none'; return; }

    const totalSolved = cats.reduce((n, c) => n + byCat[c].length, 0);
    if (label) label.textContent = totalSolved + ' problem' + (totalSolved === 1 ? '' : 's') + ' solved';

    body.innerHTML = cats.map(cat =>
      `<div class="solved-cat-group">
        <span class="solved-cat-label">${escHtml(cat)}</span>
        ${byCat[cat].map(p =>
          `<a class="solved-chip solved-chip--${p.diff}" href="leetcode/top-interview-150/${p.slug}" title="${escHtml(p.title)}">${escHtml(p.title)}</a>`
        ).join('')}
      </div>`
    ).join('');

    section.style.display = 'block';
  }

  function escHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── Sync from LeetCode ─────────────────────────────────────────────── */
  async function syncFromLeetCode() {
    const btn = document.getElementById('lc150-sync-btn');
    if (btn) { btn.classList.add('is-syncing'); btn.innerHTML = btn.innerHTML.replace('Sync LeetCode', 'Syncing…'); }

    try {
      const res  = await fetch('/api/sync-leetcode', { cache: 'no-store' });
      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || `HTTP ${res.status}`;
        const help = data.help ? '\n\n' + data.help : '';
        showToast('Sync failed: ' + msg + help, 'error');
        return;
      }

      // Merge into local solvedState and re-apply to DOM
      if (data.state) {
        solvedState = data.state;
        try { localStorage.setItem(LOCAL_KEY, JSON.stringify(solvedState)); } catch {}
        document.querySelectorAll('[data-slug]').forEach(row => {
          applyRowStyle(row, !!solvedState[row.dataset.slug]);
        });
        updateProgress();
        renderSolvedSummary();
      }

      const msg = data.newlySolved > 0
        ? `Synced! ${data.newlySolved} new problem${data.newlySolved === 1 ? '' : 's'} marked solved (${data.total} accepted on LeetCode).`
        : `Up to date — ${data.total} accepted on LeetCode, ${data.solvedInList || 0} in this list.`;
      showToast(msg);
    } catch (err) {
      showToast('Sync error: ' + err.message, 'error');
    } finally {
      if (btn) { btn.classList.remove('is-syncing'); btn.innerHTML = btn.innerHTML.replace('Syncing…', 'Sync LeetCode'); }
    }
  }

  function showToast(msg, type) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.className   = 'toast toast--show' + (type === 'error' ? ' toast--error' : '');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => { toast.className = 'toast'; }, type === 'error' ? 6000 : 3500);
  }

  /* ── Main init ──────────────────────────────────────────────────────── */
  async function init() {
    await loadSolvedState();

    // Enhance all rows in the LC150 section
    document.querySelectorAll('.lc150-list li').forEach(enhanceRow);

    // Update progress display
    updateProgress();

    // Inject progress bar into stats strip if it exists
    injectProgressBar();

    // Render My Solved section
    renderSolvedSummary();
  }

  function injectProgressBar() {
    const stats = document.querySelector('.lc150-stats');
    if (!stats || document.getElementById('lc150-progress-bar')) return;

    const wrap = document.createElement('div');
    wrap.className = 'lc150-progress-wrap';
    wrap.innerHTML = `
      <div class="lc150-progress-track">
        <div class="lc150-progress-bar" id="lc150-progress-bar"></div>
      </div>
      <span class="lc150-progress-label">
        <span id="lc150-solved-count">0</span> / 150 solved
        <span id="lc150-pct" style="margin-left:0.5rem;color:var(--accent);font-weight:600;">0%</span>
      </span>`;
    stats.after(wrap);
  }

  return { init, syncFromLeetCode };
})();

/* ── Auto-init when DOM is ready ─────────────────────────────────────── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', LC150.init);
} else {
  LC150.init();
}
