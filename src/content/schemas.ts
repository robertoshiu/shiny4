import { z } from 'zod';

export const layerSchema = z.object({
  order: z.number().int().min(1).max(6),
  num: z.string(),
  zhName: z.string(),
  zhName_en: z.string().optional(),
  'zhName_zh-Hans': z.string().optional(),
  enLabel: z.string(),
  enLabel_en: z.string().optional(),
  'enLabel_zh-Hans': z.string().optional(),
  scope: z.string(),
  scope_en: z.string().optional(),
  'scope_zh-Hans': z.string().optional(),
  href: z.string(),
});

export const slaSchema = z.object({
  order: z.number().int(),
  code: z.string(),
  label: z.string(),
  label_en: z.string().optional(),
  'label_zh-Hans': z.string().optional(),
  value: z.number(),
  prefix: z.string(),
  suffix: z.string(),
  sub: z.string(),
  sub_en: z.string().optional(),
  'sub_zh-Hans': z.string().optional(),
  accent: z.enum(['clay', 'gold', 'sage']),
});

export const complianceSchema = z.object({
  order: z.number().int(),
  name: z.string(),
  fullName: z.string(),
  fullName_en: z.string().optional(),
  'fullName_zh-Hans': z.string().optional(),
  definition: z.string(),
  definition_en: z.string().optional(),
  'definition_zh-Hans': z.string().optional(),
  domain: z.string(),
  domain_en: z.string().optional(),
  'domain_zh-Hans': z.string().optional(),
});

export const phaseSchema = z.object({
  order: z.number().int().min(1).max(4),
  code: z.string(),
  zhName: z.string(),
  zhName_en: z.string().optional(),
  'zhName_zh-Hans': z.string().optional(),
  months: z.string(),
  gate: z.string(),
  gate_en: z.string().optional(),
  'gate_zh-Hans': z.string().optional(),
  milestone: z.string(),
  milestone_en: z.string().optional(),
  'milestone_zh-Hans': z.string().optional(),
  deliverables: z.array(z.string()),
  deliverables_en: z.array(z.string()).optional(),
  'deliverables_zh-Hans': z.array(z.string()).optional(),
});

// Plan 2 schemas — sub-page data collections

export const solutionSchema = z.object({
  id: z.string(),
  zhName: z.string(),
  zhName_en: z.string().optional(),
  'zhName_zh-Hans': z.string().optional(),
  enLabel: z.string(),
  enLabel_en: z.string().optional(),
  'enLabel_zh-Hans': z.string().optional(),
  problem: z.string(),
  problem_en: z.string().optional(),
  'problem_zh-Hans': z.string().optional(),
  scope: z.string(),
  scope_en: z.string().optional(),
  'scope_zh-Hans': z.string().optional(),
  keySpecs: z.array(z.string()),
  keySpecs_en: z.array(z.string()).optional(),
  'keySpecs_zh-Hans': z.array(z.string()).optional(),
  /** Proportional gauge weight; not in source inventory — populate before launch. */
  sharePct: z.number().optional(),
});

export const riskSchema = z.object({
  id: z.string(),
  zhRisk: z.string(),
  zhRisk_en: z.string().optional(),
  'zhRisk_zh-Hans': z.string().optional(),
  mitigation: z.string(),
  mitigation_en: z.string().optional(),
  'mitigation_zh-Hans': z.string().optional(),
  /** 三級升級顏色標示；source inventory does not assign per-risk tier — optional. */
  tier: z.enum(['綠', '黃', '紅']).optional(),
});

export const teamSchema = z.object({
  id: z.string(),
  zhName: z.string(),
  zhName_en: z.string().optional(),
  'zhName_zh-Hans': z.string().optional(),
  enLabel: z.string(),
  enLabel_en: z.string().optional(),
  'enLabel_zh-Hans': z.string().optional(),
  description: z.string(),
  description_en: z.string().optional(),
  'description_zh-Hans': z.string().optional(),
  tags: z.array(z.string()).min(3).max(3),
  tags_en: z.array(z.string()).optional(),
  'tags_zh-Hans': z.array(z.string()).optional(),
});

export const roleSchema = z.object({
  id: z.string(),
  zhTitle: z.string(),
  zhTitle_en: z.string().optional(),
  'zhTitle_zh-Hans': z.string().optional(),
  enTitle: z.string(),
  enTitle_en: z.string().optional(),
  'enTitle_zh-Hans': z.string().optional(),
  functionTeam: z.string(),
  functionTeam_en: z.string().optional(),
  'functionTeam_zh-Hans': z.string().optional(),
  level: z.string(),
  level_en: z.string().optional(),
  'level_zh-Hans': z.string().optional(),
  priorityPhase: z.string(),
  priorityPhase_en: z.string().optional(),
  'priorityPhase_zh-Hans': z.string().optional(),
  summary: z.string(),
  summary_en: z.string().optional(),
  'summary_zh-Hans': z.string().optional(),
  tags: z.array(z.string()),
  tags_en: z.array(z.string()).optional(),
  'tags_zh-Hans': z.array(z.string()).optional(),
});

export const inquiryTypeSchema = z.object({
  order: z.number().int().min(1).max(5),
  id: z.string(),
  zhName: z.string(),
  zhName_en: z.string().optional(),
  'zhName_zh-Hans': z.string().optional(),
  enLabel: z.string(),
  enLabel_en: z.string().optional(),
  'enLabel_zh-Hans': z.string().optional(),
  description: z.string(),
  description_en: z.string().optional(),
  'description_zh-Hans': z.string().optional(),
  target: z.string(),
  target_en: z.string().optional(),
  'target_zh-Hans': z.string().optional(),
});

export const processStepSchema = z.object({
  order: z.number().int().min(1).max(4),
  zhName: z.string(),
  zhName_en: z.string().optional(),
  'zhName_zh-Hans': z.string().optional(),
  enLabel: z.string(),
  enLabel_en: z.string().optional(),
  'enLabel_zh-Hans': z.string().optional(),
  description: z.string(),
  description_en: z.string().optional(),
  'description_zh-Hans': z.string().optional(),
});

export const techComponentSchema = z.object({
  id: z.string(),
  domain: z.enum(['compute', 'network', 'MES', 'data-AI', 'security', 'DR']),
  zhName: z.string(),
  zhName_en: z.string().optional(),
  'zhName_zh-Hans': z.string().optional(),
  spec: z.string(),
  spec_en: z.string().optional(),
  'spec_zh-Hans': z.string().optional(),
  note: z.string().optional(),
  note_en: z.string().optional(),
  'note_zh-Hans': z.string().optional(),
});

export const deliveryMatrixSchema = z.object({
  order: z.number().int().min(1).max(10),
  category: z.string(),
  category_en: z.string().optional(),
  'category_zh-Hans': z.string().optional(),
  p1: z.string(),
  p1_en: z.string().optional(),
  'p1_zh-Hans': z.string().optional(),
  p2: z.string(),
  p2_en: z.string().optional(),
  'p2_zh-Hans': z.string().optional(),
  p3: z.string(),
  p3_en: z.string().optional(),
  'p3_zh-Hans': z.string().optional(),
  p4: z.string(),
  p4_en: z.string().optional(),
  'p4_zh-Hans': z.string().optional(),
});
