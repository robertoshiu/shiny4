import zhHant from './zh-Hant.json';

export type Locale = 'zh-Hant' | 'en' | 'zh-Hans';

type Dict = Record<string, string>;

// Plan 1 ships only the 繁中 dictionary. en / zh-Hans are populated in Plan 3;
// until then t() falls back to zh-Hant, then to the key itself.
const dictionaries: Record<Locale, Dict> = {
  'zh-Hant': zhHant as Dict,
  en: {},
  'zh-Hans': {},
};

export function t(key: string, locale: Locale): string {
  return dictionaries[locale]?.[key] ?? dictionaries['zh-Hant'][key] ?? key;
}
