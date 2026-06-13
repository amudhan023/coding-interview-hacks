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
 * Map LeetCode topic tags to our HTML category name.
 * Uses first matched tag; falls back to "More Arrays".
 */
const TAG_TO_CATEGORY = {
  'Array':                   'Array / String',
  'String':                  'Array / String',
  'Two Pointers':            'Two Pointers',
  'Sliding Window':          'Sliding Window',
  'Matrix':                  'Matrix',
  'Hash Table':              'Hashmap',
  'Stack':                   'Stack',
  'Linked List':             'Linked List',
  'Binary Tree':             'Binary Tree',
  'Tree':                    'Binary Tree',
  'Binary Search Tree':      'Binary Tree',
  'Graph':                   'Graphs',
  'Breadth-First Search':    'Graphs',
  'Depth-First Search':      'Graphs',
  'Topological Sort':        'Graphs',
  'Heap (Priority Queue)':   'Heap / Priority Queue',
  'Binary Search':           'Binary Search',
  'Backtracking':            'Backtracking',
  'Trie':                    'Tries',
  'Dynamic Programming':     'Dynamic Programming',
  'Greedy':                  'Greedy',
  'Math':                    'Math / Geometry',
  'Geometry':                'Math / Geometry',
  'Bit Manipulation':        'Bit Manipulation',
  'Monotonic Stack':         'Monotonic Stack',
  'Union Find':              'Graphs',
  'Intervals':               'Intervals',
  'Queue':                   'Stack',
  'Design':                  'More Design',
  'Divide and Conquer':      'Dynamic Programming',
  'Recursion':               'Backtracking',
  'Counting':                'Hashmap',
  'Sorting':                 'More Arrays',
};

function categoryForProblem(topicTags) {
  for (const tag of (topicTags || [])) {
    if (TAG_TO_CATEGORY[tag]) return TAG_TO_CATEGORY[tag];
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
