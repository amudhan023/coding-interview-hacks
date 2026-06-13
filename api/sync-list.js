/**
 * GET /api/sync-list
 *
 * Queries the Apr2026 LeetCode list (envId=wk69juu6) via GraphQL and returns
 * any problem slugs that are NOT yet present in the running HTML page.
 * The client-side JS compares against window.__LC150_SLUGS (injected by the page).
 *
 * No auth required for the list contents.
 */

const https = require('https');
const { parseProblemList, diffProblems } = require('../lib/lc-sync');

const LIST_ID = 'wk69juu6';

const GQL_QUERY = `
query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      frontendQuestionId: questionFrontendId
      title
      titleSlug
      difficulty
      topicTags { name slug }
      freqBar
      status
    }
  }
}`;

function fetchList(session) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      query: GQL_QUERY,
      variables: {
        categorySlug: '',
        skip: 0,
        limit: 500,
        filters: { listId: LIST_ID },
      },
    });

    const headers = {
      'Content-Type':  'application/json',
      'User-Agent':    'Mozilla/5.0 (compatible; interview-hacks/1.0)',
      'Referer':       'https://leetcode.com/',
      'Accept':        'application/json',
    };
    if (session) {
      headers['Cookie'] = `LEETCODE_SESSION=${session}; csrftoken=dummy`;
      headers['x-csrftoken'] = 'dummy';
    }

    const options = {
      hostname: 'leetcode.com',
      path: '/graphql',
      method: 'POST',
      headers: { ...headers, 'Content-Length': Buffer.byteLength(body) },
    };

    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('LeetCode GraphQL returned non-JSON')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('LeetCode request timed out')));
    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // knownSlugs from query param (comma-separated, sent by client)
  const knownParam = req.query && req.query.known;
  const knownSlugs = knownParam
    ? new Set(knownParam.split(',').map(s => s.trim()).filter(Boolean))
    : new Set();

  const session = process.env.LEETCODE_SESSION || null;

  try {
    const data     = await fetchList(session);
    const problems = parseProblemList(data);

    if (!problems.length) {
      return res.status(502).json({ error: 'No problems returned — LeetCode may have changed their API' });
    }

    const missing = knownSlugs.size > 0 ? diffProblems(problems, knownSlugs) : [];

    res.status(200).json({
      ok: true,
      total: problems.length,
      missing: missing.length,
      missingProblems: missing,
      allProblems: problems,
    });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
};
