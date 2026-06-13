# Coding Interview Hacks

A visual coding interview knowledge base for rapid revision — patterns, algorithms, data structures, and LeetCode walkthroughs in a single portable site.

## Live Site

**[coding-interview-hacks.vercel.app](https://coding-interview-hacks.vercel.app)**

GitHub: [github.com/amudhan023/coding-interview-hacks](https://github.com/amudhan023/coding-interview-hacks)

---

## What's Inside

| Section | Details |
|---|---|
| **Concepts** | Prefix Sum, BFS, DFS, Union Find, Dijkstra, Dynamic Programming, Patterns |
| **Problems** | Merge Sorted Array, Majority Element, Best Time to Buy & Sell Stock, Burst Balloons |
| **LeetCode Top 150** | Full tracker with solved state, difficulty filter, and per-problem detail pages |
| **My Coding Patterns** | 154 solved problems from a personal LeetCode list with actual submitted code, grouped by pattern (Sliding Window, Binary Search, DP, Trees, Graphs, and more), with problem descriptions, approach steps, and voice-to-text search |

Every concept/problem page includes: intuitive explanation · SVG visualizations · Python 2 code templates · complexity analysis · common mistakes · revision notes.

---

## Run Locally

### Option 1 — Node server (recommended)

Enables the "mark solved" tracker and correct routing for LC150 detail pages.

```bash
# 1. Clone the repo
git clone https://github.com/amudhan023/coding-interview-hacks.git
cd coding-interview-hacks

# 2. Install dependencies (Express only — no build step)
npm install

# 3. Start
npm start
# → http://localhost:3000
```

Override the port: `PORT=8080 npm start`

### Option 2 — Open as a static file

No install required. Most features work; the solved-state API falls back to `localStorage`.

```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

### Option 3 — Python static server

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

> Options 2 and 3 do not support `/api/solved` or the LC150 slug routes. Use Option 1 for the full experience.

---

## Project Structure

```
/
├── index.html                        # Dashboard (homepage)
├── my-patterns.html                  # My Coding Patterns — 154 solved problems with code
├── server.js                         # Express local dev server
├── package.json
├── vercel.json                       # Vercel deployment config
├── search-index.json                 # Instant search data
├── solved-state.json                 # LC150 solved state (local only)
│
├── api/
│   └── solved.js                     # Vercel serverless function for solved-state API
│
├── assets/
│   ├── css/main.css
│   └── js/
│       ├── lc150-enhanced.js         # LC150 tracker UI
│       └── problem-page.js           # Per-problem detail page logic
│
├── concepts/                         # Concept pages (BFS, DFS, DP, Union Find, …)
├── problems/                         # Problem walkthrough pages
└── leetcode/
    └── top-interview-150/
        ├── index.html                # LC150 tracker SPA
        └── data/problems.js          # Problem metadata
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/solved` | Return the current solved-state map |
| `POST` | `/api/solved` | Merge `{ slug: true/false }` into solved state |
| `DELETE` | `/api/solved?slug=<slug>` | Remove a single problem from solved state |

> On Vercel the filesystem is read-only, so POST/DELETE succeed silently but don't persist — the UI falls back to `localStorage`.

---

## Stack

- HTML5 · CSS3 · Vanilla JavaScript (no frameworks, no build step)
- Node.js + Express (local dev server)
- Vercel — static hosting + serverless API function
- Web Speech API — voice-to-text search on My Coding Patterns page
- Prism.js — syntax highlighting for submitted code
- Dark/light mode · mobile responsive · keyboard shortcuts · instant search

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `/` | Focus search |
| `←` | Previous page |
| `→` | Next page |
| `Escape` | Clear search (on My Coding Patterns) |

---

## Deploy to Vercel

Pushes to `main` deploy automatically via the connected GitHub repo.

To deploy manually:

```bash
npm install -g vercel   # once
vercel --prod
```

Static files are served directly by Vercel's CDN. The `/api/solved` endpoint runs as a native Vercel serverless function (`api/solved.js`). The LC150 SPA slug route is handled via a rewrite in `vercel.json`.

---

## Adding Topics

See `CLAUDE.md` for the full page template and auto-linking workflow.

---

## Categories

Arrays · Graphs · Dynamic Programming · Union Find · Trees · Strings · Binary Search · Sliding Window · Greedy · Heap · Stack · Queue · Backtracking · Bit Manipulation · Prefix Sum · Trie · Segment Tree · Monotonic Stack
