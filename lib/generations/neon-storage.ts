/**
 * Neon DB Storage Client for Generations Management
 * Provides CRUD operations for storing and retrieving generations
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
export interface Generation {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  messages: unknown[];
  ui_components: Record<string, unknown>;
  component_layouts: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
  version: number;
}

export interface CreateGenerationInput {
  user_id: string;
  name: string;
  description?: string;
  messages: unknown[];
  ui_components: Record<string, unknown>;
  component_layouts?: Record<string, unknown>;
}

export interface UpdateGenerationInput {
  name?: string;
  description?: string;
  messages?: unknown[];
  ui_components?: Record<string, unknown>;
  component_layouts?: Record<string, unknown>;
}

export interface ListGenerationsOptions {
  user_id: string;
  limit?: number;
  offset?: number;
  search?: string;
}

/**
 * Save a new generation to the database
 */
export async function saveGeneration(
  input: CreateGenerationInput
): Promise<Generation> {
  const id = uuidv4();
  const now = new Date();

  const result = await sql`
    INSERT INTO generations (
      id,
      user_id,
      name,
      description,
      messages,
      ui_components,
      component_layouts,
      created_at,
      updated_at,
      version
    )
    VALUES (
      ${id},
      ${input.user_id},
      ${input.name},
      ${input.description || null},
      ${JSON.stringify(input.messages)}::jsonb,
      ${JSON.stringify(input.ui_components)}::jsonb,
      ${input.component_layouts ? JSON.stringify(input.component_layouts) : null}::jsonb,
      ${now.toISOString()},
      ${now.toISOString()},
      1
    )
    RETURNING *
  `;

  return mapDbRowToGeneration(result[0]);
}

/**
 * List generations for a user with optional pagination and search
 */
export async function listGenerations(
  options: ListGenerationsOptions
): Promise<{ generations: Generation[]; total: number }> {
  const { user_id, limit = 20, offset = 0, search } = options;

  let query = sql`
    SELECT *
    FROM generations
    WHERE user_id = ${user_id}
  `;

  // Add search filter if provided
  if (search && search.trim()) {
    query = sql`
      SELECT *
      FROM generations
      WHERE user_id = ${user_id}
        AND (
          name ILIKE ${`%${search}%`}
          OR description ILIKE ${`%${search}%`}
        )
    `;
  }

  // Get total count
  const countResult = await sql`
    SELECT COUNT(*) as total
    FROM generations
    WHERE user_id = ${user_id}
    ${search && search.trim() ? sql`AND (name ILIKE ${`%${search}%`} OR description ILIKE ${`%${search}%`})` : sql``}
  `;

  const total = Number(countResult[0]?.total || 0);

  // Get paginated results
  const result = await sql`
    ${query}
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const generations = result.map(mapDbRowToGeneration);

  return { generations, total };
}

/**
 * Load a single generation by ID
 */
export async function loadGeneration(
  id: string,
  user_id: string
): Promise<Generation | null> {
  const result = await sql`
    SELECT *
    FROM generations
    WHERE id = ${id}
      AND user_id = ${user_id}
    LIMIT 1
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToGeneration(result[0]);
}

/**
 * Update an existing generation
 */
export async function updateGeneration(
  id: string,
  user_id: string,
  updates: UpdateGenerationInput
): Promise<Generation | null> {
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
  if (updates.messages !== undefined) {
    updateClauses.push('messages = ${JSON.stringify(updates.messages)}::jsonb');
    params.messages = updates.messages;
  }
  if (updates.ui_components !== undefined) {
    updateClauses.push('ui_components = ${JSON.stringify(updates.ui_components)}::jsonb');
    params.ui_components = updates.ui_components;
  }
  if (updates.component_layouts !== undefined) {
    updateClauses.push('component_layouts = ${JSON.stringify(updates.component_layouts)}::jsonb');
    params.component_layouts = updates.component_layouts;
  }

  if (updateClauses.length === 0) {
    // No updates, return existing generation
    return loadGeneration(id, user_id);
  }

  const result = await sql`
    UPDATE generations
    SET ${sql.unsafe(updateClauses.join(', '))},
      updated_at = ${now.toISOString()},
      version = version + 1
    WHERE id = ${id}
      AND user_id = ${user_id}
    RETURNING *
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToGeneration(result[0]);
}

/**
 * Delete a generation by ID
 */
export async function deleteGeneration(
  id: string,
  user_id: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM generations
    WHERE id = ${id}
      AND user_id = ${user_id}
    RETURNING id
  `;

  return result.length > 0;
}

/**
 * Check if a generation exists for a user
 */
export async function generationExists(
  id: string,
  user_id: string
): Promise<boolean> {
  const result = await sql`
    SELECT 1
    FROM generations
    WHERE id = ${id}
      AND user_id = ${user_id}
    LIMIT 1
  `;

  return result.length > 0;
}

/**
 * Map database row to Generation type
 */
function mapDbRowToGeneration(row: unknown): Generation {
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id),
    user_id: String(r.user_id),
    name: String(r.name),
    description: r.description ? String(r.description) : null,
    messages: Array.isArray(r.messages) ? r.messages : [],
    ui_components: typeof r.ui_components === 'object' && r.ui_components !== null
      ? (r.ui_components as Record<string, unknown>)
      : {},
    component_layouts: r.component_layouts && typeof r.component_layouts === 'object'
      ? (r.component_layouts as Record<string, unknown>)
      : null,
    created_at: new Date(String(r.created_at)),
    updated_at: new Date(String(r.updated_at)),
    version: Number(r.version),
  };
}
