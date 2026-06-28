import { describe, it, expect } from 'vitest';
import { t, type Locale } from '../src/i18n/utils';

describe('t()', () => {
  it('returns the zh-Hant value for a known key', () => {
    expect(t('nav.about', 'zh-Hant')).toBe('關於');
  });

  it('returns the EN value from the populated en dictionary (Plan 3)', () => {
    expect(t('nav.about', 'en')).toBe('About');
  });

  it('returns the key itself when no dictionary has it', () => {
    expect(t('does.not.exist', 'zh-Hant')).toBe('does.not.exist');
  });

  it('accepts only the three valid locales', () => {
    const l: Locale = 'zh-Hans';
    expect(t('cta.consult', l)).toBe('预约咨询');
  });
});
