/**
 * Tests for lib/lc-sync.js
 * Run: npm test
 */

const { test } = require('node:test');
const assert   = require('node:assert/strict');
const {
  parseAcceptedSlugs,
  parseProblemList,
  diffProblems,
  categoryForProblem,
  mergeSolvedState,
} = require('../lib/lc-sync');

// ─── parseAcceptedSlugs ───────────────────────────────────────────────────────

test('parseAcceptedSlugs — returns only accepted slugs', () => {
  const data = {
    stat_status_pairs: [
      { status: 'ac',    stat: { question__title_slug: 'two-sum' } },
      { status: 'notac', stat: { question__title_slug: 'add-two-numbers' } },
      { status: null,    stat: { question__title_slug: 'merge-sorted-array' } },
      { status: 'ac',    stat: { question__title_slug: 'number-of-islands' } },
    ],
  };
  const result = parseAcceptedSlugs(data);
  assert.ok(result.has('two-sum'));
  assert.ok(result.has('number-of-islands'));
  assert.ok(!result.has('add-two-numbers'));
  assert.ok(!result.has('merge-sorted-array'));
  assert.equal(result.size, 2);
});

test('parseAcceptedSlugs — empty stat_status_pairs returns empty set', () => {
  assert.equal(parseAcceptedSlugs({ stat_status_pairs: [] }).size, 0);
});

test('parseAcceptedSlugs — null/missing data returns empty set', () => {
  assert.equal(parseAcceptedSlugs(null).size, 0);
  assert.equal(parseAcceptedSlugs({}).size, 0);
  assert.equal(parseAcceptedSlugs({ stat_status_pairs: null }).size, 0);
});

test('parseAcceptedSlugs — entries with missing slug are skipped', () => {
  const data = {
    stat_status_pairs: [
      { status: 'ac', stat: {} },
      { status: 'ac', stat: null },
      { status: 'ac' },
    ],
  };
  assert.equal(parseAcceptedSlugs(data).size, 0);
});

test('parseAcceptedSlugs — returns a Set (not an array)', () => {
  const result = parseAcceptedSlugs({ stat_status_pairs: [{ status: 'ac', stat: { question__title_slug: 'x' } }] });
  assert.ok(result instanceof Set);
});

// ─── parseProblemList ─────────────────────────────────────────────────────────

test('parseProblemList — extracts slug, title, difficulty, topicTags, freqBar', () => {
  const data = {
    data: {
      problemsetQuestionList: {
        questions: [
          { titleSlug: 'two-sum', title: 'Two Sum', difficulty: 'Easy', topicTags: [{ name: 'Array' }, { name: 'Hash Table' }], freqBar: 95 },
          { titleSlug: 'number-of-islands', title: 'Number of Islands', difficulty: 'Medium', topicTags: [{ name: 'Graph' }], freqBar: 88 },
        ],
      },
    },
  };
  const result = parseProblemList(data);
  assert.equal(result.length, 2);
  assert.equal(result[0].slug, 'two-sum');
  assert.equal(result[0].title, 'Two Sum');
  assert.equal(result[0].difficulty, 'Easy');
  assert.deepEqual(result[0].topicTags, ['Array', 'Hash Table']);
  assert.equal(result[0].freqBar, 95);
  assert.equal(result[1].slug, 'number-of-islands');
});

test('parseProblemList — handles missing/null data gracefully', () => {
  assert.deepEqual(parseProblemList(null), []);
  assert.deepEqual(parseProblemList({}), []);
  assert.deepEqual(parseProblemList({ data: {} }), []);
  assert.deepEqual(parseProblemList({ data: { problemsetQuestionList: null } }), []);
});

test('parseProblemList — freqBar defaults to 0 when absent', () => {
  const data = {
    data: {
      problemsetQuestionList: {
        questions: [{ titleSlug: 'x', title: 'X', difficulty: 'Easy', topicTags: [] }],
      },
    },
  };
  assert.equal(parseProblemList(data)[0].freqBar, 0);
});

// ─── diffProblems ─────────────────────────────────────────────────────────────

test('diffProblems — returns only problems not in knownSlugs', () => {
  const fetched = [
    { slug: 'two-sum',          title: 'Two Sum' },
    { slug: 'number-of-islands', title: 'Number of Islands' },
    { slug: 'lru-cache',        title: 'LRU Cache' },
  ];
  const known = new Set(['two-sum', 'lru-cache']);
  const result = diffProblems(fetched, known);
  assert.equal(result.length, 1);
  assert.equal(result[0].slug, 'number-of-islands');
});

test('diffProblems — empty knownSlugs returns all problems', () => {
  const fetched = [{ slug: 'a' }, { slug: 'b' }];
  assert.equal(diffProblems(fetched, new Set()).length, 2);
});

test('diffProblems — all known returns empty diff', () => {
  const fetched = [{ slug: 'a' }, { slug: 'b' }];
  assert.equal(diffProblems(fetched, new Set(['a', 'b'])).length, 0);
});

// ─── categoryForProblem ───────────────────────────────────────────────────────

test('categoryForProblem — maps Array tag to Array / String', () => {
  assert.equal(categoryForProblem(['Array']), 'Array / String');
});

test('categoryForProblem — DP beats Array when both present', () => {
  assert.equal(categoryForProblem(['Array', 'Dynamic Programming']), 'Dynamic Programming');
});

test('categoryForProblem — Backtracking beats Array when both present', () => {
  assert.equal(categoryForProblem(['Array', 'Backtracking']), 'Backtracking');
});

test('categoryForProblem — Two Pointers beats Array when both present', () => {
  assert.equal(categoryForProblem(['Array', 'Two Pointers']), 'Two Pointers');
});

test('categoryForProblem — maps Hash Table to Hashmap', () => {
  assert.equal(categoryForProblem(['Hash Table']), 'Hashmap');
});

test('categoryForProblem — maps Graph to Graphs', () => {
  assert.equal(categoryForProblem(['Graph']), 'Graphs');
});

test('categoryForProblem — maps BFS to Graphs', () => {
  assert.equal(categoryForProblem(['Breadth-First Search']), 'Graphs');
});

test('categoryForProblem — maps Heap to Heap / Priority Queue', () => {
  assert.equal(categoryForProblem(['Heap (Priority Queue)']), 'Heap / Priority Queue');
});

test('categoryForProblem — maps Trie to Tries', () => {
  assert.equal(categoryForProblem(['Trie']), 'Tries');
});

test('categoryForProblem — unknown tags fall back to More Arrays', () => {
  assert.equal(categoryForProblem(['SomeFutureTopic']), 'More Arrays');
});

test('categoryForProblem — empty tags fall back to More Arrays', () => {
  assert.equal(categoryForProblem([]), 'More Arrays');
});

// ─── mergeSolvedState ─────────────────────────────────────────────────────────

test('mergeSolvedState — marks new accepted slugs as true', () => {
  const { merged, newlySolved } = mergeSolvedState({}, new Set(['two-sum', 'lru-cache']), null);
  assert.equal(merged['two-sum'], true);
  assert.equal(merged['lru-cache'], true);
  assert.equal(newlySolved, 2);
});

test('mergeSolvedState — does not unmark manually-solved problems', () => {
  const current = { 'two-sum': true, 'lru-cache': true };
  const { merged } = mergeSolvedState(current, new Set(['two-sum']), null);
  assert.equal(merged['lru-cache'], true, 'manual mark must survive sync');
});

test('mergeSolvedState — counts only newly solved (skips already-true)', () => {
  const current = { 'two-sum': true };
  const { merged, newlySolved } = mergeSolvedState(current, new Set(['two-sum', 'lru-cache']), null);
  assert.equal(newlySolved, 1);
  assert.equal(merged['lru-cache'], true);
});

test('mergeSolvedState — knownSlugs filter excludes off-list problems', () => {
  const known   = new Set(['two-sum', 'number-of-islands']);
  const accepted = new Set(['two-sum', 'random-problem-not-in-list', 'number-of-islands']);
  const { merged, newlySolved } = mergeSolvedState({}, accepted, known);
  assert.equal(merged['two-sum'], true);
  assert.equal(merged['number-of-islands'], true);
  assert.equal(merged['random-problem-not-in-list'], undefined);
  assert.equal(newlySolved, 2);
});

test('mergeSolvedState — reports correct total from acceptedSlugs size', () => {
  const { total } = mergeSolvedState({}, new Set(['a', 'b', 'c', 'd']), null);
  assert.equal(total, 4);
});

test('mergeSolvedState — empty accepted set makes no changes', () => {
  const current = { 'two-sum': true };
  const { merged, newlySolved } = mergeSolvedState(current, new Set(), null);
  assert.equal(merged['two-sum'], true);
  assert.equal(newlySolved, 0);
});

test('mergeSolvedState — does not mutate the original state object', () => {
  const current = { 'two-sum': true };
  const original = { ...current };
  mergeSolvedState(current, new Set(['lru-cache']), null);
  assert.deepEqual(current, original);
});
