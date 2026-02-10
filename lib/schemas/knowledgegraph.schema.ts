/**
 * Zod schemas for KnowledgeGraph component
 * Provides runtime type validation for KnowledgeGraph props
 */

import { z } from 'zod';

/**
 * Entity types
 */
export const EntityTypeSchema = z.enum([
  'person',
  'organization',
  'concept',
  'location',
  'event',
  'document',
  'custom'
]);

export type EntityType = z.infer<typeof EntityTypeSchema>;

/**
 * Knowledge Graph Entity
 */
export const KnowledgeGraphEntitySchema = z.object({
  id: z.string(),
  label: z.string(),
  type: EntityTypeSchema,
  description: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export type KnowledgeGraphEntity = z.infer<typeof KnowledgeGraphEntitySchema>;

/**
 * Knowledge Graph Relationship
 */
export const KnowledgeGraphRelationshipSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string(),
  label: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  bidirectional: z.boolean().optional()
}).passthrough(); // Allow additional relationship properties

export type KnowledgeGraphRelationship = z.infer<typeof KnowledgeGraphRelationshipSchema>;

/**
 * Knowledge Graph data structure
 */
export const KnowledgeGraphDataSchema = z.object({
  entities: z.array(KnowledgeGraphEntitySchema).min(1, 'At least one entity is required'),
  relationships: z.array(KnowledgeGraphRelationshipSchema)
});

export type KnowledgeGraphData = z.infer<typeof KnowledgeGraphDataSchema>;

/**
 * Knowledge Graph options
 */
export const KnowledgeGraphOptionsSchema = z.object({
  layout: z.enum(['force', 'hierarchical', 'radial', 'manual']).optional(),
  showLabels: z.boolean().optional(),
  showTypes: z.boolean().optional(),
  interactive: z.boolean().optional(),
  colorScheme: z.record(z.string(), z.string()).optional()
}).passthrough(); // Allow additional options

export type KnowledgeGraphOptions = z.infer<typeof KnowledgeGraphOptionsSchema>;

/**
 * Complete KnowledgeGraph props schema
 */
export const KnowledgeGraphPropsSchema = z.object({
  data: KnowledgeGraphDataSchema,
  options: KnowledgeGraphOptionsSchema.optional(),
  title: z.string().optional()
});

export type KnowledgeGraphProps = z.infer<typeof KnowledgeGraphPropsSchema>;
