/**
 * Pure business logic for LeetCode syncing — no I/O, fully testable.
 */

/**
 * Parse the LeetCode /api/problems/all/ response.
 * Returns a Set of accepted problem slugs.
 */
function parseAcceptedSlugs(data) {
  const pairs = (data && data.stat_status_pairs) || [];
  return new Set(
    pairs
      .filter(p => p.status === 'ac')
      .map(p => p.stat && p.stat.question__title_slug)
      .filter(Boolean)
  );
}

/**
 * Parse LeetCode GraphQL problemsetQuestionList response.
 * Returns array of { slug, title, difficulty, topicTags }.
 */
function parseProblemList(data) {
  const questions =
    (data &&
      data.data &&
      data.data.problemsetQuestionList &&
      data.data.problemsetQuestionList.questions) ||
    [];
  return questions.map(q => ({
    slug:       q.titleSlug,
    title:      q.title,
    difficulty: q.difficulty,   // 'Easy' | 'Medium' | 'Hard'
    topicTags:  (q.topicTags || []).map(t => t.name),
    freqBar:    q.freqBar || 0, // 0–100, premium only
  }));
}

/**
 * Find slugs in the fetched list that are not in the known set.
 * Returns array of problem objects.
 */
function diffProblems(fetchedProblems, knownSlugs) {
  return fetchedProblems.filter(p => !knownSlugs.has(p.slug));
}

/**
 * Priority-ordered tag → category mapping.
 * categoryForProblem iterates THIS list (not the problem's tag list), so
 * more-specific patterns win regardless of what order LeetCode emits the tags.
 *
 * Key rules:
 *  - Specific algorithm patterns (Backtracking, Two Pointers, Binary Search…)
 *    beat generic data-structure tags (Array, String).
 *  - DP comes before BFS/Graph so that DP problems tagged with BFS (e.g.
 *    Coin Change alternate solution) are not misfiled as Graphs.
 *  - Binary Tree / BST / Tree come before Stack so that tree traversals are
 *    not put in the Stack bucket.
 *  - "Depth-First Search" is intentionally absent — it appears on both tree
 *    and graph problems; the more-specific Tree/Graph tags disambiguate.
 */
const TAG_PRIORITY_ORDER = [
  ['Monotonic Stack',        'Monotonic Stack'],
  ['Backtracking',           'Backtracking'],
  ['Two Pointers',           'Two Pointers'],
  ['Sliding Window',         'Sliding Window'],
  ['Binary Search',          'Binary Search'],
  ['Trie',                   'Tries'],
  ['Heap (Priority Queue)',  'Heap / Priority Queue'],
  ['Union Find',             'Graphs'],
  ['Topological Sort',       'Graphs'],
  ['Linked List',            'Linked List'],
  ['Binary Tree',            'Binary Tree'],
  ['Binary Search Tree',     'Binary Tree'],
  ['Tree',                   'Binary Tree'],
  ['Stack',                  'Stack'],
  ['Dynamic Programming',    'Dynamic Programming'],
  ['Memoization',            'Dynamic Programming'],
  ['Divide and Conquer',     'Dynamic Programming'],
  ['Graph',                  'Graphs'],
  ['Breadth-First Search',   'Graphs'],
  ['Matrix',                 'Matrix'],
  ['Greedy',                 'Greedy'],
  ['String',                 'Array / String'],
  ['Hash Table',             'Hashmap'],
  ['Math',                   'Math / Geometry'],
  ['Geometry',               'Math / Geometry'],
  ['Bit Manipulation',       'Bit Manipulation'],
  ['Design',                 'More Design'],
  ['Intervals',              'Intervals'],
  ['Recursion',              'Backtracking'],
  ['Counting',               'Hashmap'],
  ['Queue',                  'Stack'],
  ['Sorting',                'More Arrays'],
  ['Array',                  'Array / String'],
];

/* Legacy flat map kept for tests that import TAG_TO_CATEGORY directly */
const TAG_TO_CATEGORY = Object.fromEntries(TAG_PRIORITY_ORDER);

function categoryForProblem(topicTags) {
  const tagSet = new Set(topicTags || []);
  for (const [tag, category] of TAG_PRIORITY_ORDER) {
    if (tagSet.has(tag)) return category;
  }
  return 'More Arrays';
}

/**
 * Merge newly-accepted slugs into the current solved state.
 * Additive only — never un-marks existing entries.
 * knownSlugs: optional Set to restrict which slugs we track (pass null to accept all).
 * Returns { merged, newlySolved, total }.
 */
function mergeSolvedState(currentState, acceptedSlugs, knownSlugs) {
  const merged = Object.assign({}, currentState);
  let newlySolved = 0;

  for (const slug of acceptedSlugs) {
    if (knownSlugs && !knownSlugs.has(slug)) continue;
    if (!merged[slug]) {
      merged[slug] = true;
      newlySolved++;
    }
  }

  return { merged, newlySolved, total: acceptedSlugs.size };
}

module.exports = {
  parseAcceptedSlugs,
  parseProblemList,
  diffProblems,
  categoryForProblem,
  mergeSolvedState,
  TAG_TO_CATEGORY,
};
