/**
 * Shared utilities for all problem pages.
 * Handles: code copy, theme, TOC, recently viewed, search.
 * Already included via main.js — this file adds problem-specific
 * visualization helpers used by many pages.
 */

/* ── Array Visualizer ──────────────────────────────────── */
window.ArrayViz = {
  /**
   * Draw a horizontal array of boxes inside an SVG element.
   * @param {SVGElement} svg
   * @param {Array} arr   - values
   * @param {Object} opts - { startX, startY, boxW, boxH, highlights:{idx:color}, labels:{idx:string} }
   */
  draw(svgId, arr, opts = {}) {
    const svg = document.getElementById(svgId);
    if (!svg) return;
    const {
      startX = 20, startY = 30,
      boxW = 52, boxH = 40, gap = 4,
      highlights = {}, labels = {},
      showIndex = true
    } = opts;

    let html = '';
    arr.forEach((val, i) => {
      const x = startX + i * (boxW + gap);
      const fill = highlights[i] ? highlights[i] + '22' : 'var(--bg-code)';
      const stroke = highlights[i] || 'var(--border)';
      const textColor = highlights[i] || 'var(--text-primary)';
      html += `<rect x="${x}" y="${startY}" width="${boxW}" height="${boxH}" rx="6"
        fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
      html += `<text x="${x+boxW/2}" y="${startY+boxH/2+6}" text-anchor="middle"
        font-size="16" font-weight="700" fill="${textColor}">${val}</text>`;
      if (showIndex) {
        html += `<text x="${x+boxW/2}" y="${startY+boxH+15}" text-anchor="middle"
          font-size="10" fill="var(--text-muted)">${labels[i] !== undefined ? labels[i] : i}</text>`;
      }
    });
    const g = svg.querySelector('#array-group') || (() => {
      const g = document.createElementNS('http://www.w3.org/2000/svg','g');
      g.id = 'array-group'; svg.appendChild(g); return g;
    })();
    g.innerHTML = html;
  }
};

/* ── Step Controller ────────────────────────────────────── */
window.StepController = function(steps, renderFn) {
  let cur = 0, playing = false, timer = null;
  const INTERVAL = 3000;

  function goTo(n) {
    cur = Math.max(0, Math.min(n, steps.length - 1));
    renderFn(cur, steps[cur]);
    updateUI();
  }
  function updateUI() {
    const counter = document.getElementById('step-counter');
    const bar = document.getElementById('progress-bar');
    const btn = document.getElementById('ctrl-play');
    if (counter) counter.textContent = (cur + 1) + ' / ' + steps.length;
    if (bar)     bar.style.width = ((cur / (steps.length - 1)) * 100) + '%';
    if (btn)     btn.textContent = playing ? '⏸' : '▶';
  }
  function play()  { playing = true; updateUI(); timer = setInterval(() => cur < steps.length-1 ? goTo(cur+1) : pause(), INTERVAL); }
  function pause() { playing = false; clearInterval(timer); updateUI(); }
  function toggle(){ playing ? pause() : play(); }

  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT') return;
    if (e.key === 'ArrowRight') goTo(cur + 1);
    if (e.key === 'ArrowLeft')  goTo(cur - 1);
    if (e.key === ' ') { e.preventDefault(); toggle(); }
  });

  goTo(0);
  return { goTo, prev: () => goTo(cur - 1), next: () => goTo(cur + 1), toggle,
           first: () => goTo(0), last: () => goTo(steps.length - 1) };
};
