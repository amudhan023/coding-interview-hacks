/**
 * Read LEETCODE_SESSION from the user's local Chrome installation.
 * Tries every Chrome profile directory until one has the cookie.
 * Returns the session string, or null if not found.
 */

const chrome = require('chrome-cookies-secure');
const os     = require('os');
const path   = require('path');
const fs     = require('fs');

function chromeCookieDir() {
  if (process.platform === 'darwin')
    return path.join(os.homedir(), 'Library', 'Application Support', 'Google', 'Chrome');
  if (process.platform === 'win32')
    return path.join(os.homedir(), 'AppData', 'Local', 'Google', 'Chrome', 'User Data');
  return path.join(os.homedir(), '.config', 'google-chrome');
}

function chromeProfiles() {
  const base = chromeCookieDir();
  try {
    return fs.readdirSync(base)
      .filter(d => d === 'Default' || d.startsWith('Profile'))
      .sort((a, b) => (a === 'Default' ? -1 : b === 'Default' ? 1 : a.localeCompare(b)));
  } catch { return ['Default']; }
}

function readFromProfile(profile) {
  return new Promise(resolve => {
    chrome.getCookies('https://leetcode.com/', 'object', (err, cookies) => {
      if (err || !cookies) return resolve(null);
      resolve(cookies['LEETCODE_SESSION'] || null);
    }, profile);
  });
}

async function getLeetCodeSession() {
  for (const profile of chromeProfiles()) {
    const session = await readFromProfile(profile);
    if (session) return session;
  }
  return null;
}

module.exports = { getLeetCodeSession };
