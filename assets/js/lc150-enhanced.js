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

  const SESSION_KEY = 'lc-session';

  /* ── Derive slug from an <a> href ──────────────────────────────────── */
  function slugFromHref(href) {
    if (!href) return null;
    const lcMatch = href.match(/leetcode\.com\/problems\/([^/]+)/);
    if (lcMatch) return lcMatch[1];
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
    try { solvedState = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}'); } catch {}
  }

  async function saveSolvedState(slug, solved) {
    solvedState[slug] = solved;
    try { localStorage.setItem(LOCAL_KEY, JSON.stringify(solvedState)); } catch {}
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

    const existingHref = lcLink.getAttribute('href') || '';
    if (!existingHref.includes('leetcode.com')) {
      lcLink.href = 'https://leetcode.com/problems/' + slug + '/';
    }
    lcLink.setAttribute('target', '_blank');
    lcLink.setAttribute('rel', 'noopener noreferrer');
    lcLink.classList.add('lc150-title-link');

    const badge    = li.querySelector('.badge');
    const freqPill = li.querySelector('.freq-pill');

    // Details link — external-link icon (opens explanation page)
    const detailLink = document.createElement('a');
    detailLink.href = detailUrl(slug);
    detailLink.className = 'lc150-detail-btn';
    detailLink.title = 'Open explanation page';
    detailLink.innerHTML = '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';

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

    li.innerHTML = '';
    li.appendChild(lcLink);
    li.appendChild(detailLink);
    if (badge)    li.appendChild(badge);
    if (freqPill) li.appendChild(freqPill);
    li.appendChild(label);

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

      const countEl = cat.querySelector('.lc150-cat__count');
      if (countEl) {
        countEl.textContent = catSolved ? catSolved + '/' + catTotal : catTotal;
        countEl.classList.toggle('lc150-cat__count--progress', catSolved > 0);
      }
    });

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
        const slug  = row.dataset.slug;
        const title = row.querySelector('.lc150-title-link')?.textContent.trim() || slug;
        const badge = row.querySelector('.badge')?.textContent.trim() || '';
        const diff  = badge === 'E' ? 'easy' : badge === 'M' ? 'medium' : 'hard';
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

  /* ── Session modal (paste LEETCODE_SESSION once, stored in localStorage) */
  function getStoredSession() {
    try { return localStorage.getItem(SESSION_KEY) || ''; } catch { return ''; }
  }

  function storeSession(token) {
    try { localStorage.setItem(SESSION_KEY, token.trim()); } catch {}
  }

  function clearStoredSession() {
    try { localStorage.removeItem(SESSION_KEY); } catch {}
  }

  function showSessionModal(onSubmit) {
    // Remove any existing modal
    const old = document.getElementById('lc-session-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'lc-session-modal';
    modal.innerHTML = `
      <div id="lc-session-backdrop"></div>
      <div id="lc-session-dialog" role="dialog" aria-modal="true" aria-labelledby="lc-session-title">
        <h3 id="lc-session-title">Connect LeetCode</h3>
        <p>Paste your <code>LEETCODE_SESSION</code> cookie below. It's stored only in this browser and never sent to any third party.</p>
        <ol>
          <li>Go to <a href="https://leetcode.com" target="_blank" rel="noopener">leetcode.com</a> (stay logged in)</li>
          <li>Open DevTools → <strong>Application → Cookies → leetcode.com</strong></li>
          <li>Copy the value of <strong>LEETCODE_SESSION</strong> and paste below</li>
        </ol>
        <textarea id="lc-session-input" rows="3" placeholder="eyJhbGciOi…"></textarea>
        <div id="lc-session-actions">
          <button id="lc-session-cancel">Cancel</button>
          <button id="lc-session-save">Save &amp; Sync</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    const input  = document.getElementById('lc-session-input');
    const saveBtn = document.getElementById('lc-session-save');
    const cancelBtn = document.getElementById('lc-session-cancel');
    const backdrop  = document.getElementById('lc-session-backdrop');

    const close = () => modal.remove();

    cancelBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    saveBtn.addEventListener('click', () => {
      const token = input.value.trim();
      if (!token) { input.focus(); return; }
      storeSession(token);
      close();
      onSubmit(token);
    });

    input.focus();
  }

  /* ── Sync from LeetCode ─────────────────────────────────────────────── */
  async function doSync(session) {
    const btn = document.getElementById('lc150-sync-btn');
    if (btn) { btn.classList.add('is-syncing'); btn.textContent = 'Syncing…'; }

    try {
      const res  = await fetch('/api/sync-leetcode', {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Session expired or invalid — clear it so next click re-prompts
        if (res.status === 401 || (data.error || '').toLowerCase().includes('auth')) {
          clearStoredSession();
          showToast('Session expired — please paste a new LEETCODE_SESSION token.', 'error');
        } else {
          showToast('Sync failed: ' + (data.error || `HTTP ${res.status}`), 'error');
        }
        return;
      }

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
      if (btn) { btn.classList.remove('is-syncing'); btn.textContent = 'Sync LeetCode'; }
    }
  }

  async function syncFromLeetCode() {
    const session = getStoredSession();
    if (session) {
      await doSync(session);
    } else {
      showSessionModal(token => doSync(token));
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
    document.querySelectorAll('.lc150-list li').forEach(enhanceRow);
    updateProgress();
    injectProgressBar();
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', LC150.init);
} else {
  LC150.init();
}
