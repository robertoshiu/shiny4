import { z } from 'zod';

export const layerSchema = z.object({
  order: z.number().int().min(1).max(6),
  num: z.string(),
  zhName: z.string(),
  enLabel: z.string(),
  scope: z.string(),
  href: z.string(),
});

export const slaSchema = z.object({
  order: z.number().int(),
  code: z.string(),
  label: z.string(),
  value: z.number(),
  prefix: z.string(),
  suffix: z.string(),
  sub: z.string(),
  accent: z.enum(['clay', 'gold', 'sage']),
});

export const complianceSchema = z.object({
  order: z.number().int(),
  name: z.string(),
  fullName: z.string(),
  definition: z.string(),
  domain: z.string(),
});

export const phaseSchema = z.object({
  order: z.number().int().min(1).max(4),
  code: z.string(),
  zhName: z.string(),
  months: z.string(),
  gate: z.string(),
  milestone: z.string(),
  deliverables: z.array(z.string()),
});
