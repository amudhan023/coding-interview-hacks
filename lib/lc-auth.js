/**
 * Programmatic LeetCode authentication.
 * Exchanges email + password for a fresh LEETCODE_SESSION cookie.
 *
 * Flow:
 *   1. GET /accounts/login/ → extract csrftoken cookie
 *   2. POST /accounts/login/ with credentials + CSRF token
 *   3. Return LEETCODE_SESSION from the redirect response cookies
 */

const https = require('https');

const LOGIN_URL  = 'https://leetcode.com/accounts/login/';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

function extractCookie(setCookieHeaders, name) {
  if (!Array.isArray(setCookieHeaders)) setCookieHeaders = [setCookieHeaders].filter(Boolean);
  for (const h of setCookieHeaders) {
    const m = h.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
    if (m) return m[1];
  }
  return null;
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml',
      },
    }, res => {
      res.resume(); // drain body
      res.on('end', () => resolve(res));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('LeetCode login page timed out')));
  });
}

function post(urlStr, body, extraHeaders) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body);
    const u   = new URL(urlStr);
    const req = https.request(
      {
        hostname: u.hostname,
        path:     u.pathname,
        method:   'POST',
        headers:  { ...extraHeaders, 'Content-Length': buf.length },
      },
      res => {
        res.resume(); // drain body (we only need headers)
        res.on('end', () => resolve(res));
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('LeetCode login POST timed out')));
    req.write(buf);
    req.end();
  });
}

/**
 * Log in to LeetCode with email + password.
 * Returns the fresh LEETCODE_SESSION string on success.
 * Throws on bad credentials or network error.
 */
async function loginLeetCode(email, password) {
  // Step 1 — get CSRF token
  const getRes    = await get(LOGIN_URL);
  const csrfToken = extractCookie(getRes.headers['set-cookie'], 'csrftoken');
  if (!csrfToken) throw new Error('Could not read csrftoken from LeetCode login page');

  // Step 2 — post credentials
  const body = new URLSearchParams({
    login:               email,
    password,
    csrfmiddlewaretoken: csrfToken,
  }).toString();

  const postRes = await post(LOGIN_URL, body, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Cookie':        `csrftoken=${csrfToken}`,
    'Referer':       LOGIN_URL,
    'Origin':        'https://leetcode.com',
    'X-CSRFToken':   csrfToken,
    'User-Agent':    USER_AGENT,
    'Accept':        'text/html,application/xhtml+xml',
  });

  // LeetCode responds with 302 on success, 200 on bad credentials
  const session = extractCookie(postRes.headers['set-cookie'], 'LEETCODE_SESSION');
  if (!session) {
    const code = postRes.statusCode;
    throw new Error(
      code === 200
        ? 'Login failed — check LEETCODE_EMAIL and LEETCODE_PASSWORD'
        : `Login failed (HTTP ${code})`
    );
  }

  return session;
}

module.exports = { loginLeetCode, extractCookie };
