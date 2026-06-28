import zhHant from './zh-Hant.json';
import en from './en.json';
import zhHans from './zh-hans.json';

export type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

type Dict = Record<string, string>;

const dictionaries: Record<Locale, Dict> = {
  'zh-Hant': zhHant as Dict,
  en: en as Dict,
  'zh-Hans': zhHans as Dict,
};

export function t(key: string, locale: Locale): string {
  return dictionaries[locale]?.[key] ?? dictionaries['zh-Hant'][key] ?? key;
}

/** Return a locale-specific field from a collection entry, falling back to the base field. */
export function localized(
  data: unknown,
  field: string,
  locale: Locale,
): unknown {
  const rec = data as Record<string, unknown>;
  return rec[`${field}_${locale}`] ?? rec[field];
}

/** Prefix a root-relative path with BASE_URL (no double slashes).
 *  Works for any base: "/" (dev/custom-domain) or "/shiny4/" (GitHub Pages).
 *  withBase('/') → '/shiny4/'
 *  withBase('/about/') → '/shiny4/about/'
 *  withBase('/en/') → '/shiny4/en/'
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/shiny4/" or "/"
  const stripped = path.startsWith('/') ? path.slice(1) : path;
  return base + stripped;
}

/** Compute the sibling URL for a given locale from any pathname.
 *  Returns a base-aware absolute path (e.g. "/shiny4/en/about/").
 */
export function siblingUrl(pathname: string, locale: Locale): string {
  // Strip the base prefix so locale-stripping works regardless of base
  const base = import.meta.env.BASE_URL; // e.g. "/shiny4/" or "/"
  let localePath = pathname;
  if (base.length > 1 && pathname.startsWith(base.slice(0, -1))) {
    localePath = pathname.slice(base.length - 1); // keep leading slash
  }

  // Strip leading /en or /zh-hans prefix to get canonical page path
  let pagePath = localePath
    .replace(/^\/en(\/|$)/, '/')
    .replace(/^\/zh-hans(\/|$)/, '/');
  if (!pagePath) pagePath = '/';

  if (locale === 'zh-Hant') return withBase(pagePath);
  if (locale === 'en') return withBase(`/en${pagePath}`);
  return withBase(`/zh-hans${pagePath}`);
}
