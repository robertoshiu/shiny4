/**
 * lang-persist.ts
 * Client-side locale persistence via cookie + localStorage.
 * Import this module from any page that needs to write the locale pref
 * (e.g. after the user explicitly picks a language in LanguageToggle).
 *
 * The pre-paint redirect logic lives in BaseLayout.astro as an is:inline script.
 */

const COOKIE = 'pref_lang';
const LS_KEY = 'pref_lang';
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

export type LocalePref = 'zh-Hant' | 'en' | 'zh-Hans';

export function readPref(): LocalePref | null {
  // Cookie takes precedence (set server-readable), then localStorage.
  const cookieMatch = document.cookie.match(/(?:^|;\s*)pref_lang=([^;]+)/);
  if (cookieMatch) return cookieMatch[1] as LocalePref;
  try {
    const ls = localStorage.getItem(LS_KEY);
    if (ls) return ls as LocalePref;
  } catch {
    // storage blocked
  }
  return null;
}

export function writePref(locale: LocalePref): void {
  const exp = new Date(Date.now() + ONE_YEAR).toUTCString();
  document.cookie = `${COOKIE}=${locale}; expires=${exp}; path=/; SameSite=Lax`;
  try {
    localStorage.setItem(LS_KEY, locale);
  } catch {
    // storage blocked
  }
}

/** Detect locale from current URL path. */
export function localeFromPath(pathname: string): LocalePref {
  if (pathname.startsWith('/en/') || pathname === '/en') return 'en';
  if (pathname.startsWith('/zh-hans/') || pathname === '/zh-hans') return 'zh-Hans';
  return 'zh-Hant';
}

// On module load: write the current page's locale as the stored pref.
// This means navigating to /en/ automatically persists 'en'.
writePref(localeFromPath(location.pathname));
