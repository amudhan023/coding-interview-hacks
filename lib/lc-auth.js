/**
 * Programmatic LeetCode authentication.
 * Exchanges email + password for a fresh LEETCODE_SESSION cookie.
 *
 * Flow:
 *   1. GET /accounts/login/ — collect csrftoken from Set-Cookie or HTML body
 *   2. POST /accounts/login/ with credentials + CSRF (redirect:manual)
 *   3. Return LEETCODE_SESSION from the 302 response cookies
 */

const LOGIN_URL  = 'https://leetcode.com/accounts/login/';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

/** Pull a named cookie value out of an array of Set-Cookie strings. */
function extractCookie(setCookieArr, name) {
  if (!Array.isArray(setCookieArr)) setCookieArr = [setCookieArr].filter(Boolean);
  for (const h of setCookieArr) {
    const m = h.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    if (m) return m[1];
  }
  return null;
}

/** Safely call headers.getSetCookie() (Node 18+) or fall back to .get(). */
function getSetCookies(headers) {
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie();
  // Fallback: joined value (loses per-cookie boundaries but works for our purpose)
  const raw = headers.get('set-cookie');
  return raw ? raw.split(/,\s*(?=[A-Za-z_-]+=)/) : [];
}

/**
 * Log in to LeetCode with email + password.
 * Returns the fresh LEETCODE_SESSION string on success.
 * Throws on bad credentials or network error.
 */
async function loginLeetCode(email, password) {
  // ── Step 1: GET login page ──────────────────────────────────────────────
  // Use redirect:'follow' so we land on the actual login form and collect
  // csrftoken from wherever in the redirect chain it gets set.
  const getRes = await fetch(LOGIN_URL, {
    redirect: 'follow',
    headers: {
      'User-Agent': USER_AGENT,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  // Try cookies first
  let csrfToken = extractCookie(getSetCookies(getRes.headers), 'csrftoken');

  // Fallback: parse the HTML body for the hidden csrfmiddlewaretoken input
  if (!csrfToken) {
    const html = await getRes.text();
    const m = html.match(/name=["']csrfmiddlewaretoken["']\s+value=["']([^"']+)["']/i)
           || html.match(/value=["']([^"']+)["']\s+name=["']csrfmiddlewaretoken["']/i);
    if (m) csrfToken = m[1];
  }

  if (!csrfToken) {
    throw new Error('Could not read csrftoken from LeetCode (login page blocked or changed)');
  }

  // ── Step 2: POST credentials ────────────────────────────────────────────
  // redirect:'manual' so we capture the Set-Cookie on the 302 response
  // instead of following it (which loses the cookies).
  const postRes = await fetch(LOGIN_URL, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cookie':       `csrftoken=${csrfToken}`,
      'Referer':      LOGIN_URL,
      'Origin':       'https://leetcode.com',
      'X-CSRFToken':  csrfToken,
      'User-Agent':   USER_AGENT,
      'Accept':       'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    body: new URLSearchParams({
      login:               email,
      password,
      csrfmiddlewaretoken: csrfToken,
    }).toString(),
  });

  // Success → 302 redirect with LEETCODE_SESSION in Set-Cookie
  // Failure → 200 (stays on login page, no session cookie)
  const session = extractCookie(getSetCookies(postRes.headers), 'LEETCODE_SESSION');

  if (!session) {
    throw new Error(
      postRes.status === 200
        ? 'Login failed — check LEETCODE_EMAIL and LEETCODE_PASSWORD'
        : `Login failed (HTTP ${postRes.status})`
    );
  }

  return session;
}

module.exports = { loginLeetCode, extractCookie };
