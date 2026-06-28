import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  layerSchema,
  slaSchema,
  complianceSchema,
  phaseSchema,
  solutionSchema,
  riskSchema,
  teamSchema,
  roleSchema,
  inquiryTypeSchema,
  processStepSchema,
  techComponentSchema,
  deliveryMatrixSchema,
} from './schemas';

const layers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/layers' }),
  schema: layerSchema,
});

const slas = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/slas' }),
  schema: slaSchema,
});

const compliance = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/compliance' }),
  schema: complianceSchema,
});

const phases = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/phases' }),
  schema: phaseSchema,
});

const solutions = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/solutions' }),
  schema: solutionSchema,
});

const risks = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/risks' }),
  schema: riskSchema,
});

const teams = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/teams' }),
  schema: teamSchema,
});

const roles = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/roles' }),
  schema: roleSchema,
});

const inquiryTypes = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/inquiryTypes' }),
  schema: inquiryTypeSchema,
});

const processSteps = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/processSteps' }),
  schema: processStepSchema,
});

const techComponents = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/techComponents' }),
  schema: techComponentSchema,
});

const deliveryMatrix = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/deliveryMatrix' }),
  schema: deliveryMatrixSchema,
});

export const collections = {
  layers,
  slas,
  compliance,
  phases,
  solutions,
  risks,
  teams,
  roles,
  inquiryTypes,
  processSteps,
  techComponents,
  deliveryMatrix,
};
