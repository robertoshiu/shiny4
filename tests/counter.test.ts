import { describe, it, expect } from 'vitest';
import { formatCount } from '../src/scripts/counter';

describe('formatCount', () => {
  it('preserves the ≥ prefix and % suffix', () => {
    expect(formatCount(95, '≥', '%')).toBe('≥95%');
  });
  it('preserves the ≤ prefix and hr suffix', () => {
    expect(formatCount(4, '≤', 'hr')).toBe('≤4hr');
  });
  it('preserves the ≤ prefix and min suffix', () => {
    expect(formatCount(15, '≤', 'min')).toBe('≤15min');
  });
  it('handles an empty prefix', () => {
    expect(formatCount(100, '', '%')).toBe('100%');
  });
  it('rounds to an integer mid-animation', () => {
    expect(formatCount(89.6, '≥', '%')).toBe('≥90%');
  });
});
