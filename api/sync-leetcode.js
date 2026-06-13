/**
 * GET  /api/sync-leetcode → { autoAuth: bool }
 * POST /api/sync-leetcode → sync accepted problems
 *
 * Session priority (POST):
 *   1. session in request body (user-pasted or localStorage)
 *   2. LEETCODE_EMAIL + LEETCODE_PASSWORD env vars (auto-login, works on local)
 *   3. LEETCODE_SESSION env var (static fallback)
 *   4. Return 400 { needsSession: true } so the browser shows the paste modal
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
        return reject(Object.assign(new Error(`Session expired or invalid (${res.statusCode})`), { status: 401 }));
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

async function parseBody(req) {
  return new Promise(resolve => {
    let raw = '';
    req.on('data', c => { raw += c; });
    req.on('end', () => {
      try { resolve(JSON.parse(raw)); }
      catch { resolve({}); }
    });
  });
}

const hasCredentials = !!(process.env.LEETCODE_EMAIL && process.env.LEETCODE_PASSWORD);

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // GET → tell the browser whether auto-auth is available
  if (req.method === 'GET') {
    return res.status(200).json({ autoAuth: hasCredentials });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = await parseBody(req);

  // Session resolution: body → credentials auto-login → static env var
  let session = body.session || process.env.LEETCODE_SESSION || '';

  if (!session && hasCredentials) {
    try {
      session = await loginLeetCode(process.env.LEETCODE_EMAIL, process.env.LEETCODE_PASSWORD);
    } catch (authErr) {
      // Cloudflare may block auto-login from cloud IPs — fall through to needsSession
    }
  }

  if (!session) {
    return res.status(400).json({
      error: 'No LeetCode session available',
      needsSession: true,
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
    const status = err.status === 401 ? 401 : 502;
    res.status(status).json({ error: err.message });
  }
};
