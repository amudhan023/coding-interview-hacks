/**
 * LeetCode authentication via Playwright.
 *
 * Launches a headless Chromium browser, logs in with credentials,
 * extracts cookies, and caches the session in memory.
 *
 * Exported surface:
 *   getAuthenticatedSession()  → { leetcode_session, csrf_token }
 *   invalidateSession()        → clears the in-memory cache
 *   AuthenticationFailedError
 *   CaptchaDetectedError
 */

'use strict';

const { chromium: chromiumExtra } = require('playwright-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const chromeCookies = require('chrome-cookies-secure');
chromiumExtra.use(StealthPlugin());

/* ── Custom errors ─────────────────────────────────────────────────────── */

class AuthenticationFailedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AuthenticationFailedError';
  }
}

class CaptchaDetectedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CaptchaDetectedError';
  }
}

/* ── In-memory session cache ───────────────────────────────────────────── */

const _cache = {
  leetcode_session: null,
  csrf_token:       null,
  expiresAt:        0,
};

const SESSION_TTL_MS = 55 * 60 * 1000; // 55 min (LeetCode sessions last ~1 year; we re-auth well before)
const MAX_ATTEMPTS   = 2;

function _cacheSession(cookies) {
  _cache.leetcode_session = cookies.leetcode_session;
  _cache.csrf_token       = cookies.csrf_token;
  _cache.expiresAt        = Date.now() + SESSION_TTL_MS;
}

function _cachedSession() {
  if (_cache.leetcode_session && Date.now() < _cache.expiresAt) {
    return { leetcode_session: _cache.leetcode_session, csrf_token: _cache.csrf_token };
  }
  return null;
}

function invalidateSession() {
  _cache.leetcode_session = null;
  _cache.csrf_token       = null;
  _cache.expiresAt        = 0;
}

/* ── Read Cloudflare clearance + session from existing Chrome install ────── */

function _readChromeProfile(profile) {
  return new Promise(resolve => {
    chromeCookies.getCookies('https://leetcode.com/', 'object', (err, cookies) => {
      resolve(err || !cookies ? {} : cookies);
    }, profile);
  });
}

async function _chromeSeeds() {
  for (const profile of ['Profile 1', 'Default']) {
    const cookies = await _readChromeProfile(profile);
    if (cookies['cf_clearance'] || cookies['LEETCODE_SESSION']) return cookies;
  }
  return {};
}

/* ── Browser launch options ────────────────────────────────────────────── */

function _launchOptions() {
  return {
    // headless: false is required — LeetCode's Cloudflare Turnstile blocks
    // even stealth headless Chrome. The window is positioned offscreen so
    // it does not interrupt the user's screen.
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-position=10000,10000', // offscreen on most displays
      '--window-size=1280,800',
    ],
  };
}

function _contextOptions() {
  return {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
             + 'AppleWebKit/537.36 (KHTML, like Gecko) '
             + 'Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
    locale:   'en-US',
  };
}

/* ── CAPTCHA detection ──────────────────────────────────────────────────── */

async function _detectCaptcha(page) {
  const selectors = [
    'iframe[src*="recaptcha"]',
    'iframe[src*="hcaptcha"]',
    '.g-recaptcha',
    '.h-captcha',
    '.cf-turnstile',
    '#cf-challenge-running',
    '[data-testid="captcha"]',
  ];
  for (const sel of selectors) {
    if (await page.$(sel)) return true;
  }
  // Cloudflare "Just a moment…" title
  const title = await page.title();
  if (/just a moment/i.test(title) || /attention required/i.test(title)) return true;
  return false;
}

/* ── Login failure detection ────────────────────────────────────────────── */

async function _detectLoginError(page) {
  const selectors = [
    '.error-message',
    '[class*="error"]',
    '[class*="alert"]',
    '#errors',
    'ul.errorlist',
  ];
  for (const sel of selectors) {
    const el = await page.$(sel);
    if (el) {
      const text = (await el.textContent()).trim();
      if (text) return text;
    }
  }
  return null;
}

/* ── Core login function ────────────────────────────────────────────────── */

async function _loginOnce(email, password) {
  const browser = await chromiumExtra.launch(_launchOptions());
  const context = await browser.newContext(_contextOptions());

  // Seed Cloudflare clearance + any existing session from the user's Chrome.
  // This lets Cloudflare recognise the browser as previously-cleared and
  // skips the Turnstile challenge on both the login page and post-submit.
  const seeds = await _chromeSeeds();
  const seedCookies = [];
  for (const [name, value] of Object.entries(seeds)) {
    if (!value) continue;
    seedCookies.push({
      name,
      value,
      domain:   '.leetcode.com',
      path:     '/',
      httpOnly: name === 'LEETCODE_SESSION',
      secure:   true,
      sameSite: 'None',
    });
  }
  if (seedCookies.length) await context.addCookies(seedCookies);

  const page = await context.newPage();

  // Belt-and-suspenders: also mask webdriver at JS level
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    window.chrome = { runtime: {} };
  });

  try {
    /* 1 ── Navigate — may skip login form if session cookie is already valid */
    await page.goto('https://leetcode.com/accounts/login/', {
      waitUntil: 'domcontentloaded',
      timeout:   30_000,
    });

    // Race: either the login form appears OR LeetCode redirects us away
    // (meaning the seeded LEETCODE_SESSION is still valid).
    const raceResult = await Promise.race([
      page.waitForSelector('input[name="login"]', { timeout: 25_000 })
          .then(() => 'form'),
      page.waitForFunction(
        () => !window.location.href.includes('/accounts/login/') &&
              !window.location.href.includes('/cdn-cgi/'),
        { timeout: 25_000 }
      ).then(() => 'redirected'),
    ]).catch(() => 'timeout');

    if (raceResult === 'redirected') {
      // Already logged in — extract cookies and return immediately
      const cookies       = await context.cookies();
      const sessionCk     = cookies.find(c => c.name === 'LEETCODE_SESSION');
      const csrfCk        = cookies.find(c => c.name === 'csrftoken');
      if (sessionCk) {
        return { leetcode_session: sessionCk.value, csrf_token: csrfCk?.value ?? null };
      }
      // Redirected but no session cookie — fall through to login form error
    }

    if (raceResult === 'timeout') {
      if (await _detectCaptcha(page)) {
        throw new CaptchaDetectedError(
          'CAPTCHA or bot-challenge on the LeetCode login page could not be '
          + 'auto-solved. Try logging in manually in Chrome first, then re-run sync.'
        );
      }
      throw new AuthenticationFailedError(
        'LeetCode login form did not appear within 25 s. '
        + 'The page may have changed or the network is slow.'
      );
    }

    /* 2 ── Fill credentials ───────────────────────────────────────────── */
    await page.fill('input[name="login"]', email);
    await page.fill('input[name="password"]', password);

    /* 3 ── Submit form ────────────────────────────────────────────────── */
    await page.keyboard.press('Enter');

    /* 4 ── Wait for post-submit redirect past any Cloudflare challenge ── */
    const SETTLE_TIMEOUT = 35_000;
    const POLL_INTERVAL  = 1_000;
    const deadline = Date.now() + SETTLE_TIMEOUT;
    let   settled  = false;

    while (Date.now() < deadline) {
      const url   = page.url();
      const title = await page.title().catch(() => '');
      const isLoginPage      = url.includes('/accounts/login/');
      const isCfInterstitial = url.includes('/cdn-cgi/') || /just a moment/i.test(title);

      if (!isLoginPage && !isCfInterstitial) { settled = true; break; }

      if (isLoginPage && !isCfInterstitial) {
        const errText = await _detectLoginError(page);
        if (errText) throw new AuthenticationFailedError(`Login rejected by LeetCode: "${errText}"`);
      }

      await page.waitForTimeout(POLL_INTERVAL);
    }

    if (!settled) {
      if (await _detectCaptcha(page)) {
        throw new CaptchaDetectedError(
          'A human-solvable CAPTCHA appeared after login submission and could '
          + 'not be bypassed automatically.'
        );
      }
      const errText = await _detectLoginError(page);
      throw new AuthenticationFailedError(
        errText
          ? `Login rejected by LeetCode: "${errText}"`
          : 'Login timed out — still on login/challenge page after 35 s.'
      );
    }

    /* 5 ── Extract cookies ────────────────────────────────────────────── */
    const cookies      = await context.cookies();
    const sessionCk    = cookies.find(c => c.name === 'LEETCODE_SESSION');
    const csrfCk       = cookies.find(c => c.name === 'csrftoken');

    if (!sessionCk) {
      throw new AuthenticationFailedError(
        'Navigation left the login page but LEETCODE_SESSION cookie was not set. '
        + 'LeetCode may have changed their auth flow.'
      );
    }

    return {
      leetcode_session: sessionCk.value,
      csrf_token:       csrfCk?.value ?? null,
    };
  } finally {
    await browser.close();
  }
}

/* ── Public: getAuthenticatedSession ───────────────────────────────────── */

async function getAuthenticatedSession() {
  const cached = _cachedSession();
  if (cached) return cached;

  const email    = process.env.LEETCODE_EMAIL;
  const password = process.env.LEETCODE_PASSWORD;

  if (!email || !password) {
    throw new AuthenticationFailedError(
      'LEETCODE_EMAIL and LEETCODE_PASSWORD must be set in environment variables.'
    );
  }

  let lastError;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const session = await _loginOnce(email, password);
      _cacheSession(session);
      return session;
    } catch (err) {
      lastError = err;
      // CAPTCHA won't resolve on retry — fail fast
      if (err instanceof CaptchaDetectedError) throw err;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise(r => setTimeout(r, 2_000));
      }
    }
  }

  throw lastError;
}

module.exports = {
  getAuthenticatedSession,
  invalidateSession,
  AuthenticationFailedError,
  CaptchaDetectedError,
};
