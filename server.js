/**
 * Interview Hacks — Local Development Server
 *
 * Provides:
 *   1. Static file serving for the entire site
 *   2. GET  /api/solved        → returns solved-state.json
 *   3. POST /api/solved        → merges + saves solved-state.json
 *   4. GET  /leetcode/top-interview-150/:slug → serves the SPA template
 *
 * Start: node server.js   (or: npm start)
 * URL:   http://localhost:3000
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');

const app         = express();
const PORT        = process.env.PORT || 3000;
const ROOT        = __dirname;
const SOLVED_FILE = path.join(ROOT, 'solved-state.json');
const TEMPLATE    = path.join(ROOT, 'leetcode', 'top-interview-150', 'index.html');

/* ── Middleware ─────────────────────────────────────────── */
app.use(express.json());
app.use(express.static(ROOT));

/* ── Helper: safe read solved-state.json ───────────────── */
function readSolved() {
  try {
    return JSON.parse(fs.readFileSync(SOLVED_FILE, 'utf8'));
  } catch {
    return {};
  }
}

/* ── API: GET /api/solved ───────────────────────────────── */
app.get('/api/solved', (req, res) => {
  res.json(readSolved());
});

/* ── API: POST /api/solved ──────────────────────────────── */
app.post('/api/solved', (req, res) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Invalid body' });
  }
  const current  = readSolved();
  const updated  = Object.assign({}, current, req.body);
  try {
    fs.writeFileSync(SOLVED_FILE, JSON.stringify(updated, null, 2));
    res.json({ ok: true, state: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── API: DELETE /api/solved/:slug ──────────────────────── */
app.delete('/api/solved/:slug', (req, res) => {
  const current = readSolved();
  delete current[req.params.slug];
  fs.writeFileSync(SOLVED_FILE, JSON.stringify(current, null, 2));
  res.json({ ok: true });
});

/* ── Detail pages: /leetcode/top-interview-150/:slug ────── */
app.get('/leetcode/top-interview-150/:slug', (req, res) => {
  if (!fs.existsSync(TEMPLATE)) {
    return res.status(404).send('Detail page template not found.');
  }
  res.sendFile(TEMPLATE);
});

/* ── Fallback: SPA-style catch-all for direct navigation ── */
app.get('/leetcode/top-interview-150', (req, res) => {
  res.redirect('/index.html#lc150-container');
});

/* ── Start ──────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log('');
  console.log('  🚀  Interview Hacks running at http://localhost:' + PORT);
  console.log('  📁  Serving from: ' + ROOT);
  console.log('  💾  Solved state: ' + SOLVED_FILE);
  console.log('');
});
