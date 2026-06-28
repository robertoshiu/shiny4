import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { layerSchema, slaSchema, complianceSchema, phaseSchema } from './schemas';

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

export const collections = { layers, slas, compliance, phases };
