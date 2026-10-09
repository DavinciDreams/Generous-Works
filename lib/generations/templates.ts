/**
 * Template System for Generations
 * Provides template management, creation, and application capabilities
 */

import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create neon client
const sql = neon(DATABASE_URL);

// Types
export interface Template {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string | null;
  tags: string[];
  ui_components: Record<string, unknown>;
  component_layouts: Record<string, unknown> | null;
  is_public: boolean;
  is_system_template: boolean;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateTemplateInput {
  user_id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  ui_components: Record<string, unknown>;
  component_layouts?: Record<string, unknown>;
  is_public?: boolean;
}

export interface UpdateTemplateInput {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  ui_components?: Record<string, unknown>;
  component_layouts?: Record<string, unknown>;
  is_public?: boolean;
}

export interface ListTemplatesOptions {
  user_id: string;
  limit?: number;
  offset?: number;
  search?: string;
  category?: string;
  tags?: string[];
  include_public?: boolean;
  include_system?: boolean;
}

/**
 * Create a new template
 */
export async function createTemplate(
  input: CreateTemplateInput
): Promise<Template> {
  const id = uuidv4();
  const now = new Date();

  const result = await sql`
    INSERT INTO templates (
      id,
      user_id,
      name,
      description,
      category,
      tags,
      ui_components,
      component_layouts,
      is_public,
      is_system_template,
      usage_count,
      created_at,
      updated_at
    )
    VALUES (
      ${id},
      ${input.user_id},
      ${input.name},
      ${input.description || null},
      ${input.category || null},
      ${input.tags || []},
      ${JSON.stringify(input.ui_components)}::jsonb,
      ${input.component_layouts ? JSON.stringify(input.component_layouts) : null}::jsonb,
      ${input.is_public || false},
      FALSE,
      0,
      ${now.toISOString()},
      ${now.toISOString()}
    )
    RETURNING *
  `;

  return mapDbRowToTemplate(result[0]);
}

/**
 * List templates for a user with optional filters
 */
export async function listTemplates(
  options: ListTemplatesOptions
): Promise<{ templates: Template[]; total: number }> {
  const { user_id, limit = 20, offset = 0, search, category, tags, include_public, include_system } = options;

  let query = sql`
    SELECT *
    FROM templates
    WHERE user_id = ${user_id}
  `;

  // Include public templates
  if (include_public) {
    query = sql`
      SELECT *
      FROM templates
      WHERE user_id = ${user_id}
         OR is_public = TRUE
    `;
  }

  // Include system templates
  if (include_system) {
    query = sql`
      SELECT *
      FROM templates
      WHERE user_id = ${user_id}
         OR is_system_template = TRUE
    `;
  }

  // Add search filter if provided
  if (search && search.trim()) {
    query = sql`
      SELECT *
      FROM templates
      WHERE (
        user_id = ${user_id}
        ${include_public ? sql`OR is_public = TRUE` : sql``}
        ${include_system ? sql`OR is_system_template = TRUE` : sql``}
      )
      AND (
        name ILIKE ${`%${search}%`}
        OR description ILIKE ${`%${search}%`}
        OR category ILIKE ${`%${search}%`}
      )
    `;
  }

  // Add category filter if provided
  if (category) {
    query = sql`
      SELECT *
      FROM templates
      WHERE (
        user_id = ${user_id}
        ${include_public ? sql`OR is_public = TRUE` : sql``}
        ${include_system ? sql`OR is_system_template = TRUE` : sql``}
      )
      AND category = ${category}
    `;
  }

  // Add tags filter if provided
  if (tags && tags.length > 0) {
    query = sql`
      SELECT *
      FROM templates
      WHERE (
        user_id = ${user_id}
        ${include_public ? sql`OR is_public = TRUE` : sql``}
        ${include_system ? sql`OR is_system_template = TRUE` : sql``}
      )
      AND tags && ${tags}
    `;
  }

  // Get total count
  let countQuery = sql`
    SELECT COUNT(*) as total
    FROM templates
    WHERE user_id = ${user_id}
  `;

  if (include_public) {
    countQuery = sql`
      SELECT COUNT(*) as total
      FROM templates
      WHERE user_id = ${user_id}
         OR is_public = TRUE
    `;
  }

  if (include_system) {
    countQuery = sql`
      SELECT COUNT(*) as total
      FROM templates
      WHERE user_id = ${user_id}
         OR is_system_template = TRUE
    `;
  }

  const countResult = await countQuery;
  const total = Number(countResult[0]?.total || 0);

  // Get paginated results
  const result = await sql`
    ${query}
    ORDER BY usage_count DESC, created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const templates = result.map(mapDbRowToTemplate);

  return { templates, total };
}

/**
 * Get a specific template by ID
 */
export async function getTemplate(
  id: string,
  user_id: string
): Promise<Template | null> {
  const result = await sql`
    SELECT *
    FROM templates
    WHERE id = ${id}
      AND (user_id = ${user_id} OR is_public = TRUE OR is_system_template = TRUE)
    LIMIT 1
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToTemplate(result[0]);
}

/**
 * Update an existing template
 */
export async function updateTemplate(
  id: string,
  user_id: string,
  updates: UpdateTemplateInput
): Promise<Template | null> {
  const now = new Date();

  // Build dynamic update query based on provided fields
  const updateClauses: string[] = [];
  const params: Record<string, unknown> = {};

  if (updates.name !== undefined) {
    updateClauses.push('name = ${updates.name}');
    params.name = updates.name;
  }
  if (updates.description !== undefined) {
    updateClauses.push('description = ${updates.description || null}');
    params.description = updates.description;
  }
  if (updates.category !== undefined) {
    updateClauses.push('category = ${updates.category || null}');
    params.category = updates.category;
  }
  if (updates.tags !== undefined) {
    updateClauses.push('tags = ${updates.tags}');
    params.tags = updates.tags;
  }
  if (updates.ui_components !== undefined) {
    updateClauses.push('ui_components = ${JSON.stringify(updates.ui_components)}::jsonb');
    params.ui_components = updates.ui_components;
  }
  if (updates.component_layouts !== undefined) {
    updateClauses.push('component_layouts = ${JSON.stringify(updates.component_layouts)}::jsonb');
    params.component_layouts = updates.component_layouts;
  }
  if (updates.is_public !== undefined) {
    updateClauses.push('is_public = ${updates.is_public}');
    params.is_public = updates.is_public;
  }

  if (updateClauses.length === 0) {
    // No updates, return existing template
    return getTemplate(id, user_id);
  }

  const result = await sql`
    UPDATE templates
    SET ${sql.unsafe(updateClauses.join(', '))},
      updated_at = ${now.toISOString()}
    WHERE id = ${id}
      AND user_id = ${user_id}
    RETURNING *
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToTemplate(result[0]);
}

/**
 * Delete a template
 */
export async function deleteTemplate(
  id: string,
  user_id: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM templates
    WHERE id = ${id}
      AND user_id = ${user_id}
      AND is_system_template = FALSE
    RETURNING id
  `;

  return result.length > 0;
}

/**
 * Increment usage count for a template
 */
export async function incrementTemplateUsage(
  id: string
): Promise<boolean> {
  const result = await sql`
    UPDATE templates
    SET usage_count = usage_count + 1
    WHERE id = ${id}
    RETURNING id
  `;

  return result.length > 0;
}

/**
 * Get template categories
 */
export async function getTemplateCategories(
  user_id: string,
  include_public?: boolean,
  include_system?: boolean
): Promise<string[]> {
  let query = sql`
    SELECT DISTINCT category
    FROM templates
    WHERE user_id = ${user_id}
      AND category IS NOT NULL
  `;

  if (include_public) {
    query = sql`
      SELECT DISTINCT category
      FROM templates
      WHERE (user_id = ${user_id} OR is_public = TRUE)
        AND category IS NOT NULL
    `;
  }

  if (include_system) {
    query = sql`
      SELECT DISTINCT category
      FROM templates
      WHERE (user_id = ${user_id} OR is_system_template = TRUE)
        AND category IS NOT NULL
    `;
  }

  const result = await query;
  return result.map((row: unknown) => String((row as Record<string, unknown>).category)).filter(Boolean);
}

/**
 * Get popular tags
 */
export async function getPopularTags(
  user_id: string,
  limit: number = 20
): Promise<{ tag: string; count: number }[]> {
  const result = await sql`
    SELECT UNNEST(tags) as tag, COUNT(*) as count
    FROM templates
    WHERE user_id = ${user_id}
    GROUP BY tag
    ORDER BY count DESC
    LIMIT ${limit}
  `;

  return result.map((row: unknown) => ({
    tag: String((row as Record<string, unknown>).tag),
    count: Number((row as Record<string, unknown>).count),
  }));
}

/**
 * Save a generation as a template
 */
export async function saveGenerationAsTemplate(
  user_id: string,
  name: string,
  ui_components: Record<string, unknown>,
  description?: string,
  category?: string,
  tags?: string[],
  component_layouts?: Record<string, unknown>,
  is_public?: boolean
): Promise<Template> {
  return createTemplate({
    user_id,
    name,
    description,
    category,
    tags,
    ui_components,
    component_layouts,
    is_public,
  });
}

/**
 * Map database row to Template type
 */
function mapDbRowToTemplate(row: unknown): Template {
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id),
    user_id: String(r.user_id),
    name: String(r.name),
    description: r.description ? String(r.description) : null,
    category: r.category ? String(r.category) : null,
    tags: Array.isArray(r.tags) ? r.tags.map(String) : [],
    ui_components: typeof r.ui_components === 'object' && r.ui_components !== null
      ? (r.ui_components as Record<string, unknown>)
      : {},
    component_layouts: r.component_layouts && typeof r.component_layouts === 'object'
      ? (r.component_layouts as Record<string, unknown>)
      : null,
    is_public: Boolean(r.is_public),
    is_system_template: Boolean(r.is_system_template),
    usage_count: Number(r.usage_count),
    created_at: new Date(String(r.created_at)),
    updated_at: new Date(String(r.updated_at)),
  };
}
