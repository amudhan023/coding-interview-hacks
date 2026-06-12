const fs   = require('fs');
const path = require('path');

const SOLVED_FILE = path.join(process.cwd(), 'solved-state.json');

function readSolved() {
  try { return JSON.parse(fs.readFileSync(SOLVED_FILE, 'utf8')); }
  catch { return {}; }
}

module.exports = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET') {
    return res.status(200).json(readSolved());
  }

  if (req.method === 'POST') {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid body' });
    }
    const updated = Object.assign({}, readSolved(), req.body);
    try {
      fs.writeFileSync(SOLVED_FILE, JSON.stringify(updated, null, 2));
    } catch (_) {
      // Vercel filesystem is read-only — silently succeed so the UI keeps working
    }
    return res.status(200).json({ ok: true, state: updated });
  }

  if (req.method === 'DELETE') {
    const slug = req.query.slug;
    const current = readSolved();
    if (slug) delete current[slug];
    try { fs.writeFileSync(SOLVED_FILE, JSON.stringify(current, null, 2)); } catch (_) {}
    return res.status(200).json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
