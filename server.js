/**
 * Interview Hacks — Local Development Server
 *
 * Provides:
 *   1. Static file serving for the entire site
 *   2. GET  /api/solved              → returns solved-state.json
 *   3. POST /api/solved              → merges + saves solved-state.json
 *   4. GET  /api/sync-leetcode       → fetch accepted submissions, update solved state
 *   5. GET  /api/sync-list           → diff Apr2026 list against known slugs
 *   6. GET  /leetcode/top-interview-150/:slug → serves the SPA template
 *
 * Start: node server.js   (or: npm start)
 * Env:   LEETCODE_SESSION=<token> npm start
 * URL:   http://localhost:3000
 */

const express = require('express');
const fs      = require('fs');
const path    = require('path');
const { parseAcceptedSlugs, parseProblemList, diffProblems, categoryForProblem, mergeSolvedState } = require('./lib/lc-sync');
const { loginLeetCode } = require('./lib/lc-auth');

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

/* ── Helper: fetch accepted slugs from LeetCode ────────────── */
async function fetchAccepted(session) {
  const response = await fetch('https://leetcode.com/api/problems/all/', {
    headers: {
      'Cookie':     `LEETCODE_SESSION=${session}`,
      'User-Agent': 'Mozilla/5.0 (compatible; interview-hacks/1.0)',
      'Referer':    'https://leetcode.com/',
      'Accept':     'application/json',
    },
  });
  if (response.status === 403 || response.status === 401) {
    const err = new Error(`Auth failed (${response.status})`);
    err.status = 401;
    throw err;
  }
  if (!response.ok) throw new Error(`LeetCode returned ${response.status}`);
  return response.json();
}

const hasCredentials = !!(process.env.LEETCODE_EMAIL && process.env.LEETCODE_PASSWORD);

/* ── API: GET /api/sync-leetcode → { autoAuth } ────────────── */
app.get('/api/sync-leetcode', (req, res) => {
  res.json({ autoAuth: hasCredentials });
});

/* ── API: POST /api/sync-leetcode ──────────────────────────── */
app.post('/api/sync-leetcode', async (req, res) => {
  // Session priority: body → credentials auto-login → static env var
  let session = (req.body && req.body.session) || process.env.LEETCODE_SESSION || '';

  if (!session && hasCredentials) {
    try {
      session = await loginLeetCode(process.env.LEETCODE_EMAIL, process.env.LEETCODE_PASSWORD);
    } catch (authErr) {
      return res.status(401).json({ error: authErr.message, needsSession: true });
    }
  }

  if (!session) {
    return res.status(400).json({ error: 'No LeetCode session available', needsSession: true });
  }

  try {
    const data     = await fetchAccepted(session);
    const accepted = parseAcceptedSlugs(data);
    const current  = readSolved();
    const { merged, newlySolved, total } = mergeSolvedState(current, accepted, null);

    fs.writeFileSync(SOLVED_FILE, JSON.stringify(merged, null, 2));

    const solvedInList = Object.values(merged).filter(Boolean).length;
    res.json({ ok: true, total, newlySolved, solvedInList, state: merged });
  } catch (err) {
    const status = err.status === 401 ? 401 : 502;
    res.status(status).json({ error: err.message });
  }
});

/* ── API: GET /api/sync-list ────────────────────────────────── */
app.get('/api/sync-list', async (req, res) => {
  const knownParam  = req.query.known || '';
  const knownSlugs  = new Set(knownParam.split(',').map(s => s.trim()).filter(Boolean));
  const session     = process.env.LEETCODE_SESSION || null;

  const GQL_QUERY = `
    query problemsetQuestionList($categorySlug:String,$limit:Int,$skip:Int,$filters:QuestionListFilterInput){
      problemsetQuestionList:questionList(categorySlug:$categorySlug,limit:$limit,skip:$skip,filters:$filters){
        total:totalNum
        questions:data{frontendQuestionId:questionFrontendId title titleSlug difficulty topicTags{name slug} freqBar status}
      }
    }`;

  try {
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent':   'Mozilla/5.0 (compatible; interview-hacks/1.0)',
      'Referer':      'https://leetcode.com/',
    };
    if (session) headers['Cookie'] = `LEETCODE_SESSION=${session}`;

    const gqlRes = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: GQL_QUERY,
        variables: { categorySlug: '', skip: 0, limit: 500, filters: { listId: 'wk69juu6' } },
      }),
    });

    const data     = await gqlRes.json();
    const problems = parseProblemList(data);

    if (!problems.length) {
      return res.status(502).json({ error: 'No problems returned from LeetCode' });
    }

    const missing = knownSlugs.size > 0 ? diffProblems(problems, knownSlugs) : [];
    const withCategory = missing.map(p => ({ ...p, category: categoryForProblem(p.topicTags) }));

    res.json({ ok: true, total: problems.length, missing: missing.length, missingProblems: withCategory, allProblems: problems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
