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

// Plan 2 schemas — sub-page data collections

export const solutionSchema = z.object({
  id: z.string(),
  zhName: z.string(),
  enLabel: z.string(),
  problem: z.string(),
  scope: z.string(),
  keySpecs: z.array(z.string()),
  /** Proportional gauge weight; not in source inventory — populate before launch. */
  sharePct: z.number().optional(),
});

export const riskSchema = z.object({
  id: z.string(),
  zhRisk: z.string(),
  mitigation: z.string(),
  /** 三級升級顏色標示；source inventory does not assign per-risk tier — optional. */
  tier: z.enum(['綠', '黃', '紅']).optional(),
});

export const teamSchema = z.object({
  id: z.string(),
  zhName: z.string(),
  enLabel: z.string(),
  description: z.string(),
  tags: z.array(z.string()).min(3).max(3),
});

export const roleSchema = z.object({
  id: z.string(),
  zhTitle: z.string(),
  enTitle: z.string(),
  functionTeam: z.string(),
  level: z.string(),
  priorityPhase: z.string(),
  summary: z.string(),
  tags: z.array(z.string()),
});

export const inquiryTypeSchema = z.object({
  order: z.number().int().min(1).max(5),
  id: z.string(),
  zhName: z.string(),
  enLabel: z.string(),
  description: z.string(),
  target: z.string(),
});

export const processStepSchema = z.object({
  order: z.number().int().min(1).max(4),
  zhName: z.string(),
  enLabel: z.string(),
  description: z.string(),
});

export const techComponentSchema = z.object({
  id: z.string(),
  domain: z.enum(['compute', 'network', 'MES', 'data-AI', 'security', 'DR']),
  zhName: z.string(),
  spec: z.string(),
  note: z.string().optional(),
});

export const deliveryMatrixSchema = z.object({
  order: z.number().int().min(1).max(10),
  category: z.string(),
  p1: z.string(),
  p2: z.string(),
  p3: z.string(),
  p4: z.string(),
});
