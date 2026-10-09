/**
 * Version Control System for Generations
 * Provides version management, history tracking, and restoration capabilities
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
export interface GenerationHistory {
  id: string;
  generation_id: string;
  user_id: string;
  version: number;
  name: string;
  description: string | null;
  messages: unknown[];
  ui_components: Record<string, unknown>;
  component_layouts: Record<string, unknown> | null;
  change_reason: string | null;
  created_at: Date;
  is_current_version: boolean;
}

export interface CreateVersionInput {
  generation_id: string;
  user_id: string;
  version: number;
  name: string;
  description?: string;
  messages: unknown[];
  ui_components: Record<string, unknown>;
  component_layouts?: Record<string, unknown>;
  change_reason?: string;
  is_current_version?: boolean;
}

export interface ListVersionsOptions {
  generation_id: string;
  user_id: string;
  limit?: number;
  offset?: number;
}

/**
 * Create a new version entry in the history
 */
export async function createVersion(
  input: CreateVersionInput
): Promise<GenerationHistory> {
  const id = uuidv4();
  const now = new Date();

  const result = await sql`
    INSERT INTO generations_history (
      id,
      generation_id,
      user_id,
      version,
      name,
      description,
      messages,
      ui_components,
      component_layouts,
      change_reason,
      created_at,
      is_current_version
    )
    VALUES (
      ${id},
      ${input.generation_id},
      ${input.user_id},
      ${input.version},
      ${input.name},
      ${input.description || null},
      ${JSON.stringify(input.messages)}::jsonb,
      ${JSON.stringify(input.ui_components)}::jsonb,
      ${input.component_layouts ? JSON.stringify(input.component_layouts) : null}::jsonb,
      ${input.change_reason || null},
      ${now.toISOString()},
      ${input.is_current_version || false}
    )
    RETURNING *
  `;

  return mapDbRowToGenerationHistory(result[0]);
}

/**
 * List all versions for a generation
 */
export async function listVersions(
  options: ListVersionsOptions
): Promise<{ versions: GenerationHistory[]; total: number }> {
  const { generation_id, user_id, limit = 50, offset = 0 } = options;

  // Get total count
  const countResult = await sql`
    SELECT COUNT(*) as total
    FROM generations_history
    WHERE generation_id = ${generation_id}
      AND user_id = ${user_id}
  `;

  const total = Number(countResult[0]?.total || 0);

  // Get paginated results
  const result = await sql`
    SELECT *
    FROM generations_history
    WHERE generation_id = ${generation_id}
      AND user_id = ${user_id}
    ORDER BY version DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const versions = result.map(mapDbRowToGenerationHistory);

  return { versions, total };
}

/**
 * Get a specific version by ID
 */
export async function getVersion(
  id: string,
  user_id: string
): Promise<GenerationHistory | null> {
  const result = await sql`
    SELECT *
    FROM generations_history
    WHERE id = ${id}
      AND user_id = ${user_id}
    LIMIT 1
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToGenerationHistory(result[0]);
}

/**
 * Get a specific version by version number
 */
export async function getVersionByNumber(
  generation_id: string,
  version: number,
  user_id: string
): Promise<GenerationHistory | null> {
  const result = await sql`
    SELECT *
    FROM generations_history
    WHERE generation_id = ${generation_id}
      AND version = ${version}
      AND user_id = ${user_id}
    LIMIT 1
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToGenerationHistory(result[0]);
}

/**
 * Get the current version of a generation
 */
export async function getCurrentVersion(
  generation_id: string,
  user_id: string
): Promise<GenerationHistory | null> {
  const result = await sql`
    SELECT *
    FROM generations_history
    WHERE generation_id = ${generation_id}
      AND user_id = ${user_id}
      AND is_current_version = TRUE
    LIMIT 1
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToGenerationHistory(result[0]);
}

/**
 * Restore a specific version to become the current generation
 */
export async function restoreVersion(
  version_id: string,
  user_id: string
): Promise<GenerationHistory | null> {
  // First, get the version to restore
  const versionToRestore = await getVersion(version_id, user_id);
  
  if (!versionToRestore) {
    return null;
  }

  // Archive the current version
  await sql`
    UPDATE generations_history
    SET is_current_version = FALSE
    WHERE generation_id = ${versionToRestore.generation_id}
      AND user_id = ${user_id}
      AND is_current_version = TRUE
  `;

  // Update the main generations table
  await sql`
    UPDATE generations
    SET 
      name = ${versionToRestore.name},
      description = ${versionToRestore.description || null},
      messages = ${JSON.stringify(versionToRestore.messages)}::jsonb,
      ui_components = ${JSON.stringify(versionToRestore.ui_components)}::jsonb,
      component_layouts = ${versionToRestore.component_layouts ? JSON.stringify(versionToRestore.component_layouts) : null}::jsonb,
      updated_at = NOW()
    WHERE id = ${versionToRestore.generation_id}
      AND user_id = ${user_id}
  `;

  // Create a new current version entry
  const newVersionId = uuidv4();
  const now = new Date();

  const result = await sql`
    INSERT INTO generations_history (
      id,
      generation_id,
      user_id,
      version,
      name,
      description,
      messages,
      ui_components,
      component_layouts,
      change_reason,
      created_at,
      is_current_version
    )
    VALUES (
      ${newVersionId},
      ${versionToRestore.generation_id},
      ${user_id},
      ${versionToRestore.version},
      ${versionToRestore.name},
      ${versionToRestore.description || null},
      ${JSON.stringify(versionToRestore.messages)}::jsonb,
      ${JSON.stringify(versionToRestore.ui_components)}::jsonb,
      ${versionToRestore.component_layouts ? JSON.stringify(versionToRestore.component_layouts) : null}::jsonb,
      'Restored from version ' || ${versionToRestore.version},
      ${now.toISOString()},
      TRUE
    )
    RETURNING *
  `;

  return mapDbRowToGenerationHistory(result[0]);
}

/**
 * Compare two versions and return the differences
 */
export async function compareVersions(
  version1_id: string,
  version2_id: string,
  user_id: string
): Promise<{ version1: GenerationHistory; version2: GenerationHistory; differences: VersionDifference[] } | null> {
  const [version1, version2] = await Promise.all([
    getVersion(version1_id, user_id),
    getVersion(version2_id, user_id),
  ]);

  if (!version1 || !version2) {
    return null;
  }

  const differences: VersionDifference[] = [];

  // Compare name
  if (version1.name !== version2.name) {
    differences.push({
      field: 'name',
      oldValue: version1.name,
      newValue: version2.name,
    });
  }

  // Compare description
  if (version1.description !== version2.description) {
    differences.push({
      field: 'description',
      oldValue: version1.description || '',
      newValue: version2.description || '',
    });
  }

  // Compare messages
  const messagesDiff = JSON.stringify(version1.messages) !== JSON.stringify(version2.messages);
  if (messagesDiff) {
    differences.push({
      field: 'messages',
      oldValue: JSON.stringify(version1.messages),
      newValue: JSON.stringify(version2.messages),
    });
  }

  // Compare ui_components
  const componentsDiff = JSON.stringify(version1.ui_components) !== JSON.stringify(version2.ui_components);
  if (componentsDiff) {
    differences.push({
      field: 'ui_components',
      oldValue: JSON.stringify(version1.ui_components),
      newValue: JSON.stringify(version2.ui_components),
    });
  }

  // Compare component_layouts
  const layoutsDiff = JSON.stringify(version1.component_layouts) !== JSON.stringify(version2.component_layouts);
  if (layoutsDiff) {
    differences.push({
      field: 'component_layouts',
      oldValue: JSON.stringify(version1.component_layouts),
      newValue: JSON.stringify(version2.component_layouts),
    });
  }

  return { version1, version2, differences };
}

/**
 * Delete a specific version (cannot delete current version)
 */
export async function deleteVersion(
  version_id: string,
  user_id: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM generations_history
    WHERE id = ${version_id}
      AND user_id = ${user_id}
      AND is_current_version = FALSE
    RETURNING id
  `;

  return result.length > 0;
}

/**
 * Delete all history for a generation
 */
export async function deleteGenerationHistory(
  generation_id: string,
  user_id: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM generations_history
    WHERE generation_id = ${generation_id}
      AND user_id = ${user_id}
    RETURNING id
  `;

  return result.length > 0;
}

// Types
export interface VersionDifference {
  field: string;
  oldValue: string;
  newValue: string;
}

/**
 * Map database row to GenerationHistory type
 */
function mapDbRowToGenerationHistory(row: unknown): GenerationHistory {
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id),
    generation_id: String(r.generation_id),
    user_id: String(r.user_id),
    version: Number(r.version),
    name: String(r.name),
    description: r.description ? String(r.description) : null,
    messages: Array.isArray(r.messages) ? r.messages : [],
    ui_components: typeof r.ui_components === 'object' && r.ui_components !== null
      ? (r.ui_components as Record<string, unknown>)
      : {},
    component_layouts: r.component_layouts && typeof r.component_layouts === 'object'
      ? (r.component_layouts as Record<string, unknown>)
      : null,
    change_reason: r.change_reason ? String(r.change_reason) : null,
    created_at: new Date(String(r.created_at)),
    is_current_version: Boolean(r.is_current_version),
  };
}
