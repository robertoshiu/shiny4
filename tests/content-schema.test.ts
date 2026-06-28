import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import {
  layerSchema,
  slaSchema,
  complianceSchema,
  phaseSchema,
} from '../src/content/schemas';

function loadDir(dir: string): unknown[] {
  const base = join(process.cwd(), 'src', 'content', dir);
  return readdirSync(base)
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(join(base, f), 'utf-8')));
}

describe('content schemas validate the 繁中 seed data', () => {
  it('validates all 6 layers', () => {
    const items = loadDir('layers');
    expect(items).toHaveLength(6);
    for (const item of items) expect(layerSchema.safeParse(item).success).toBe(true);
  });

  it('validates all 6 SLAs with a clay/gold/sage accent', () => {
    const items = loadDir('slas');
    expect(items).toHaveLength(6);
    for (const item of items) expect(slaSchema.safeParse(item).success).toBe(true);
  });

  it('validates all 5 compliance standards', () => {
    const items = loadDir('compliance');
    expect(items).toHaveLength(5);
    for (const item of items) expect(complianceSchema.safeParse(item).success).toBe(true);
  });

  it('validates all 4 phases', () => {
    const items = loadDir('phases');
    expect(items).toHaveLength(4);
    for (const item of items) expect(phaseSchema.safeParse(item).success).toBe(true);
  });

  it('rejects an SLA with an invalid accent', () => {
    const bad = {
      order: 1,
      code: 'X',
      label: 'x',
      value: 1,
      prefix: '',
      suffix: '',
      sub: 'x',
      accent: 'red',
    };
    expect(slaSchema.safeParse(bad).success).toBe(false);
  });
});
