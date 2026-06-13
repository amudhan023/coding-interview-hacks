/**
 * GET /api/sync-leetcode
 *
 * Logs in to LeetCode with stored credentials, fetches accepted submissions,
 * and marks matching problems as solved in solved-state.json.
 *
 * Requires env vars: LEETCODE_EMAIL, LEETCODE_PASSWORD
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');
const { parseAcceptedSlugs, mergeSolvedState } = require('../lib/lc-sync');
const { loginLeetCode } = require('../lib/lc-auth');

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
        return reject(new Error(`Auth failed (${res.statusCode}) — check LEETCODE_EMAIL / LEETCODE_PASSWORD`));
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

  const email    = process.env.LEETCODE_EMAIL;
  const password = process.env.LEETCODE_PASSWORD;
  if (!email || !password) {
    return res.status(400).json({
      error: 'LEETCODE_EMAIL or LEETCODE_PASSWORD not set',
      help: 'Add both env vars in Vercel dashboard (or .env for local dev)',
    });
  }

  try {
    const session  = await loginLeetCode(email, password);
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
