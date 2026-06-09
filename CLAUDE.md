 ## Project Overview

This repository is a visual coding interview knowledge base designed for rapid interview revision.

Repository:

github.com/amudhan023/coding-interview-hacks

The site serves as a structured learning system for:

* Coding interview patterns
* Data structures
* Algorithms
* LeetCode problems
* Python 2 tricks
* Interview hacks
* Time complexity intuition
* Problem solving frameworks

The project should continuously grow.

When the user asks for a new concept, algorithm, pattern, trick, or LeetCode problem:

1. Create a new HTML page.
2. Link it from the dashboard.
3. Link related pages.
4. Add recommendations for what to learn next.
5. Update search indexes/navigation.
6. Commit changes to git.

---

# Technology Stack

Use:

* HTML5
* CSS3
* Vanilla JavaScript

Avoid:

* React
* Angular
* Vue

Reason:

The site should be portable, simple, and easy to host on GitHub Pages.

---

# Site Structure

/
index.html

/assets
/css
/js
/images
/diagrams

/concepts
union-find.html
bfs.html
dfs.html
dijkstra.html
dynamic-programming.html
prefix-sum.html

/problems
two-sum.html
number-of-islands.html
redundant-connection.html

---

# Dashboard Requirements

The homepage is a dashboard.

Show:

* Total concepts
* Total problems
* Recently added topics
* Recommended next topics
* Search bar
* Category filters

Categories:

* Arrays
* Strings
* Linked Lists
* Trees
* Graphs
* Dynamic Programming
* Greedy
* Heap
* Stack
* Queue
* Binary Search
* Backtracking
* Bit Manipulation
* Prefix Sum
* Union Find
* Sliding Window
* Trie
* Segment Tree
* Monotonic Stack

Each card should display:

* Topic Name
* Difficulty
* Pattern
* Key Takeaway
* Estimated Revision Time

---

# Page Template

Every concept page must contain:

1. Concept Overview

Explain intuitively.

2. Why Interviewers Ask It

3. Pattern Recognition

How to recognize this pattern in interviews.

4. Core Idea

Visual explanation.

5. Visualization

Use SVG diagrams.

Do NOT use static images unless necessary.

Generate diagrams directly inside HTML.

6. Complexity

Time complexity.

Space complexity.

7. Common Tricks

Interview shortcuts.

8. Common Mistakes

Typical candidate failures.

9. Python 2 Template

Provide production-ready Python 2 code.

10. Python 2 Variations

Alternative implementations.

11. LeetCode Problems

Easy
Medium
Hard

Include:

* Problem name
* Difficulty
* Why this pattern applies

12. Step-by-Step Walkthrough

13. Mental Model

14. Revision Notes

A one-minute review section.

15. Related Concepts

Links to other pages.

16. Recommended Next Topic

Provide learning progression.

---

# Visualization Requirements

Every page must contain rich visuals.

Preferred visual types:

* SVG diagrams
* Flow charts
* State transition diagrams
* Graph diagrams
* Tree diagrams
* Animated algorithm simulation
* Interactive examples

Examples:

Union Find

Show:

Parent array evolution

Before Union

0 1 2 3 4

After Union

0→1
1→1
2→3
3→3

Show path compression animation.

Dijkstra

Show:

Priority queue evolution.

Distance updates.

Graph traversal animation.

Dynamic Programming

Show:

Table filling animation.

Memoization tree.

Bottom-up table.

Top-down recursion tree.

Prefix Sum

Show:

Running cumulative array.

Window range queries.

Bit Manipulation

Show:

Binary representation.

Bit toggles.

Mask operations.

---

# Design Requirements

Use a modern interview-prep style.

Inspired by:

* NeetCode
* AlgoMonster
* Excalidraw
* Stripe documentation

Requirements:

* Dark mode
* Light mode
* Mobile responsive
* Sticky navigation
* Breadcrumbs
* Search
* Previous page
* Next page

Keyboard shortcuts:

Left Arrow:
Previous page

Right Arrow:
Next page

Slash (/):
Focus search

---

# Navigation Requirements

Every page must include:

Home

Category

Current Topic

Breadcrumbs

Related Topics

Previous Topic

Next Topic

Recommended Topic

Recently Viewed

---

# Search Requirements

Maintain a search index.

Search should work across:

* Concepts
* Algorithms
* LeetCode Problems
* Tricks
* Complexity tables

Search should be instant.

---

# Content Standards

Always prioritize:

Intuition > Memorization

Every explanation must answer:

1. What problem does this solve?

2. Why does it work?

3. How do I recognize it?

4. What are common interview variants?

5. What mistakes should I avoid?

---

# Python Requirements

Use Python 2 syntax.

Examples:

xrange()

raw_input()

class Solution(object):

Avoid:

Python 3 only syntax.

Every page must include:

* Brute Force
* Better Solution
* Optimal Solution

---

# Problem Pages

Problem pages must contain:

Problem Summary

Pattern

Visualization

Brute Force

Optimal Solution

Python 2 Code

Dry Run

Complexity Analysis

Variations

Related Problems

---

# Auto-Linking Rules

When a new topic is added:

Update:

index.html

search-index.json

related-topics.json

navigation.json

topic graph

Add cross-links automatically.

Example:

Union Find

Links to:

* Graphs
* Kruskal
* Connected Components
* Number of Islands
* Redundant Connection

---

# Git Workflow

After modifications:

1. Run validation.

2. Verify links.

3. Verify navigation.

4. Verify search index.

5. Commit.

Commit message format:

docs(topic): add union find visualization

docs(problem): add redundant connection walkthrough

feat(nav): update dashboard links

6. Push to origin main.

---

# Topic Creation Workflow

When user says:

"Add Union Find"

Create:

/concepts/union-find.html

Update:

index.html

search index

navigation

related links

commit changes

push changes

When user says:

"Add Number of Islands"

Create:

/problems/number-of-islands.html

Link to:

BFS

DFS

Union Find

Graphs

commit changes

push changes

---

# Quality Bar

Every page should be good enough that:

A software engineer can revise the topic in 5–10 minutes before an interview and quickly regain working proficiency.

Optimize for interview recall, intuition, and pattern recognition rather than academic completeness.
