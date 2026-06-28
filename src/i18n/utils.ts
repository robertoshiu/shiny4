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

/** Compute the sibling URL for a given locale from any pathname. */
export function siblingUrl(pathname: string, locale: Locale): string {
  // Strip leading /en or /zh-hans prefix to get canonical base path
  let base = pathname
    .replace(/^\/en(\/|$)/, '/')
    .replace(/^\/zh-hans(\/|$)/, '/');
  if (!base) base = '/';

  if (locale === 'zh-Hant') return base;
  if (locale === 'en') return `/en${base}`;
  return `/zh-hans${base}`;
}
