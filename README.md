# Coding Interview Hacks

A visual coding interview knowledge base for rapid revision — patterns, algorithms, data structures, and LeetCode walkthroughs in a single portable site.

## Live Site

[coding-interview-hacks.vercel.app](https://coding-interview-hacks.vercel.app)

> Deployed on Vercel — auto-aliases to this URL on every `vercel --prod` push.

GitHub: [github.com/amudhan023/coding-interview-hacks](https://github.com/amudhan023/coding-interview-hacks)

---

## What's Inside

| Section | Topics |
|---|---|
| **Concepts** | Prefix Sum, BFS, DFS, Union Find, Dijkstra, Dynamic Programming, Patterns |
| **Problems** | Merge Sorted Array, Majority Element, Best Time to Buy & Sell Stock, Burst Balloons |
| **LeetCode Top 150** | Full tracker with solved state, difficulty filter, and per-problem detail pages |

Every page includes: intuitive explanation · SVG visualizations · Python 2 code templates · complexity analysis · common mistakes · LeetCode problem list · revision notes.

---

## Run Locally

### Option 1 — Node server (recommended)

The Node server enables the "mark solved" tracker and correct routing for detail pages.

```bash
# 1. Clone the repo
git clone https://github.com/amudhan023/coding-interview-hacks.git
cd coding-interview-hacks

# 2. Install dependencies (only Express — no build step)
npm install

# 3. Start the server
npm start
# → http://localhost:3000
```

The server runs on port `3000` by default. Override with `PORT=8080 npm start`.

### Option 2 — Open as a static file

No install required. Most features work, but the solved-state API is unavailable (the tracker falls back to `localStorage`).

```bash
# macOS
open index.html

# Windows
start index.html

# Linux
xdg-open index.html
```

### Option 3 — Python static server

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

> **Note:** Options 2 and 3 do not support the `/api/solved` endpoints or the
> `/leetcode/top-interview-150/:slug` detail-page routes. Use Option 1 for the
> full experience.

---

## Project Structure

```
/
├── index.html                        # Dashboard (homepage)
├── server.js                         # Express dev + production server
├── package.json
├── vercel.json                       # Vercel deployment config
├── search-index.json                 # Instant search data
├── solved-state.json                 # Persisted LC150 solved state (local)
│
├── assets/
│   ├── css/main.css
│   └── js/
│       ├── lc150-enhanced.js         # LC150 tracker UI
│       └── problem-page.js           # Per-problem detail page logic
│
├── concepts/                         # Concept pages (BFS, DFS, DP, …)
├── problems/                         # Problem walkthrough pages
└── leetcode/
    └── top-interview-150/
        ├── index.html                # LC150 tracker SPA
        └── data/problems.js          # Problem metadata
```

---

## API Endpoints (local / Vercel)

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/solved` | Return the current solved-state map |
| `POST` | `/api/solved` | Merge `{ slug: true/false }` into solved state |
| `DELETE` | `/api/solved/:slug` | Remove a single problem from solved state |

---

## Stack

- HTML5 · CSS3 · Vanilla JavaScript (no frameworks)
- Node.js + Express (server and API)
- Dark/light mode, mobile responsive, keyboard shortcuts
- Instant search across all topics

---

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `/` | Focus search |
| `←` | Previous page |
| `→` | Next page |

---

## Deploy to Vercel

```bash
# Install Vercel CLI (once)
npm install -g vercel

# Deploy from the project root
vercel

# Promote to production
vercel --prod
```

Vercel auto-detects `vercel.json` and runs the Express server as a serverless function, so all routes and the API work identically to local.

---

## Adding Topics

To add a new concept or problem, see `CLAUDE.md` for the full page template and auto-linking workflow.

---

## Categories

Arrays · Graphs · Dynamic Programming · Union Find · Trees · Strings · Binary Search · Sliding Window · Greedy · Heap · Stack · Queue · Backtracking · Bit Manipulation · Prefix Sum · Trie · Segment Tree · Monotonic Stack
