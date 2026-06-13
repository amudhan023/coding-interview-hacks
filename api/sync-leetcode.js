/**
 * GET /api/sync-leetcode
 *
 * Fetches the authenticated user's accepted LeetCode submissions and
 * marks matching problems as solved in solved-state.json.
 *
 * Requires env var: LEETCODE_SESSION
 * Get it from: leetcode.com → DevTools → Application → Cookies → LEETCODE_SESSION
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');
const { parseAcceptedSlugs, mergeSolvedState } = require('../lib/lc-sync');

const SOLVED_FILE = path.join(process.cwd(), 'solved-state.json');

function readSolved() {
  try { return JSON.parse(fs.readFileSync(SOLVED_FILE, 'utf8')); }
  catch { return {}; }
}

function fetchLeetCodeProblems(session) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'leetcode.com',
      path: '/api/problems/all/',
      method: 'GET',
      headers: {
        'Cookie':     `LEETCODE_SESSION=${session}`,
        'User-Agent': 'Mozilla/5.0 (compatible; interview-hacks/1.0)',
        'Referer':    'https://leetcode.com/',
        'Accept':     'application/json',
      },
    };
    const req = https.request(options, res => {
      if (res.statusCode === 403 || res.statusCode === 401) {
        return reject(new Error(`Auth failed (${res.statusCode}) — LEETCODE_SESSION may be expired`));
      }
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); }
        catch { reject(new Error('LeetCode returned non-JSON — session may be invalid')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('LeetCode request timed out')));
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = process.env.LEETCODE_SESSION;
  if (!session) {
    return res.status(400).json({
      error: 'LEETCODE_SESSION not set',
      help: 'Local: LEETCODE_SESSION=<token> npm start | Vercel: vercel env add LEETCODE_SESSION. Get token: leetcode.com → DevTools → Application → Cookies → LEETCODE_SESSION',
    });
  }

  try {
    const data     = await fetchLeetCodeProblems(session);
    const accepted = parseAcceptedSlugs(data);
    const current  = readSolved();
    const { merged, newlySolved, total } = mergeSolvedState(current, accepted, null);

    try {
      fs.writeFileSync(SOLVED_FILE, JSON.stringify(merged, null, 2));
    } catch {
      /* Vercel read-only filesystem — in-memory state still returned */
    }

    const solvedInList = Object.values(merged).filter(Boolean).length;
    res.status(200).json({ ok: true, total, newlySolved, solvedInList, state: merged });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};
