#!/usr/bin/env node
/**
 * scripts/update-list.js
 *
 * Queries the Apr2026 LeetCode list (envId=wk69juu6), diffs against index.html,
 * and inserts missing <li> rows into the appropriate category.
 *
 * Usage:
 *   node scripts/update-list.js [--dry-run]
 *
 * Optionally set LEETCODE_SESSION env var to get freqBar data (requires premium).
 */

const https = require('https');
const fs    = require('fs');
const path  = require('path');
const { parseProblemList, diffProblems, categoryForProblem } = require('../lib/lc-sync');

const LIST_ID   = 'wk69juu6';
const HTML_FILE = path.join(__dirname, '..', 'index.html');
const DRY_RUN   = process.argv.includes('--dry-run');

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
    }
  }
}`;

function fetchList() {
  return new Promise((resolve, reject) => {
    const bodyObj = JSON.stringify({
      query: GQL_QUERY,
      variables: { categorySlug: '', skip: 0, limit: 500, filters: { listId: LIST_ID } },
    });

    const headers = {
      'Content-Type':  'application/json',
      'User-Agent':    'Mozilla/5.0 (compatible; interview-hacks/1.0)',
      'Referer':       'https://leetcode.com/problems/',
      'Accept':        'application/json',
      'Content-Length': Buffer.byteLength(bodyObj),
    };

    const session = process.env.LEETCODE_SESSION;
    if (session) {
      headers['Cookie'] = `LEETCODE_SESSION=${session}`;
    }

    const req = https.request(
      { hostname: 'leetcode.com', path: '/graphql', method: 'POST', headers },
      res => {
        let data = '';
        res.on('data', c => { data += c; });
        res.on('end', () => {
          try { resolve(JSON.parse(data)); }
          catch { reject(new Error('LeetCode returned non-JSON')); }
        });
      }
    );
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('Timed out')));
    req.write(bodyObj);
    req.end();
  });
}

function extractKnownSlugs(html) {
  const re = /leetcode\.com\/problems\/([^/?]+)/g;
  const slugs = new Set();
  let m;
  while ((m = re.exec(html)) !== null) slugs.add(m[1]);
  return slugs;
}

function freqClass(pct) {
  if (pct >= 70) return 'freq-high';
  if (pct >= 50) return 'freq-mid';
  return 'freq-low';
}

function buildLi(problem) {
  const diffBadge = problem.difficulty === 'Easy' ? 'badge--easy'
    : problem.difficulty === 'Medium' ? 'badge--medium' : 'badge--hard';
  const diffLetter = problem.difficulty[0];
  const pct  = Math.round(problem.freqBar || 0);
  const cls  = freqClass(pct);
  const freq = pct > 0
    ? `<span class="freq-pill ${cls}" title="Interview freq">${pct}%</span>`
    : '';
  return `          <li><a href="https://leetcode.com/problems/${problem.slug}/?envType=problem-list-v2&envId=${LIST_ID}" target="_blank">${problem.title}</a><span class="badge ${diffBadge}">${diffLetter}</span>${freq}</li>`;
}

/* Map our category names to the closing </ol> anchor we insert before */
function categoryAnchor(catName) {
  // Match the <span class="lc150-cat__name">catName</span> block then find its </ol>
  return catName;
}

async function main() {
  console.log('Fetching Apr2026 list from LeetCode…');
  const data = await fetchList();
  const problems = parseProblemList(data);

  if (!problems.length) {
    console.error('No problems returned. LeetCode may have changed their API.');
    process.exit(1);
  }
  console.log(`LeetCode list has ${problems.length} problems.`);

  let html = fs.readFileSync(HTML_FILE, 'utf8');
  const knownSlugs = extractKnownSlugs(html);
  console.log(`HTML currently tracks ${knownSlugs.size} unique slugs.`);

  const missing = diffProblems(problems, knownSlugs);

  if (!missing.length) {
    console.log('Nothing to add — HTML is up to date!');
    return;
  }

  console.log(`Found ${missing.length} missing problem(s):`);
  missing.forEach(p => console.log(`  + [${p.difficulty[0]}] ${p.title} (${p.slug}) → ${categoryForProblem(p.topicTags)}`));

  if (DRY_RUN) {
    console.log('\n--dry-run: no changes written.');
    return;
  }

  /* Insert each missing problem into its category's <ol class="lc150-list"> */
  for (const problem of missing) {
    const cat   = categoryForProblem(problem.topicTags);
    const liHtml = buildLi(problem);

    /* Find the category <details> block by its name span */
    const catEscaped = cat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(
      `(<span class="lc150-cat__name">${catEscaped}<\\/span>[\\s\\S]*?<ol class="lc150-list">)(\\s*)(<\\/ol>)`,
      'g'
    );

    const before = html;
    html = html.replace(re, (_, open, existingItems, close) => {
      // Append the new <li> before </ol>
      return open + existingItems + liHtml + '\n        ' + close;
    });

    if (html === before) {
      console.warn(`  ⚠ Could not find category "${cat}" in HTML — skipped ${problem.slug}`);
    }
  }

  fs.writeFileSync(HTML_FILE, html, 'utf8');
  console.log(`\nindex.html updated — ${missing.length} problem(s) added.`);
  console.log('Run `git diff index.html` to review before committing.');
}

main().catch(err => { console.error(err.message); process.exit(1); });
