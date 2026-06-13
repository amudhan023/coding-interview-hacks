/**
 * POST /api/sync-leetcode
 *
 * Accepts { session: "LEETCODE_SESSION_TOKEN" } in the request body.
 * The session token comes from the user's browser (stored in localStorage),
 * so LeetCode sees a real user session rather than a server-side auto-login.
 *
 * Falls back to LEETCODE_SESSION env var if no session in body.
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

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Session: from POST body, or fallback env var
  let session = process.env.LEETCODE_SESSION || '';
  if (req.method === 'POST') {
    const body = await parseBody(req);
    if (body.session) session = body.session;
  }

  if (!session) {
    return res.status(400).json({
      error: 'No LeetCode session provided',
      help: 'Click "Sync LeetCode" and paste your LEETCODE_SESSION cookie when prompted.',
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
