/**
 * Sharing System for Generations
 * Provides sharing capabilities with link-based access and read-only mode
 */

import { neon } from '@neondatabase/serverless';
import { v4 as uuidv4 } from 'uuid';
import { loadGeneration } from './neon-storage';

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create neon client
const sql = neon(DATABASE_URL);

// Types
export interface Share {
  id: string;
  generation_id: string;
  user_id: string;
  share_token: string;
  share_url: string;
  is_readonly: boolean;
  expires_at: Date | null;
  view_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateShareInput {
  generation_id: string;
  user_id: string;
  is_readonly?: boolean;
  expires_at?: Date | null;
}

export interface ListSharesOptions {
  user_id: string;
  limit?: number;
  offset?: number;
  generation_id?: string;
}

/**
 * Create a share link for a generation
 */
export async function createShare(
  input: CreateShareInput
): Promise<Share> {
  const id = uuidv4();
  const shareToken = uuidv4();
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shared/${shareToken}`;
  const now = new Date();

  const result = await sql`
    INSERT INTO shares (
      id,
      generation_id,
      user_id,
      share_token,
      share_url,
      is_readonly,
      expires_at,
      view_count,
      created_at,
      updated_at
    )
    VALUES (
      ${id},
      ${input.generation_id},
      ${input.user_id},
      ${shareToken},
      ${shareUrl},
      ${input.is_readonly !== undefined ? input.is_readonly : true},
      ${input.expires_at ? input.expires_at.toISOString() : null},
      0,
      ${now.toISOString()},
      ${now.toISOString()}
    )
    RETURNING *
  `;

  return mapDbRowToShare(result[0]);
}

/**
 * List shares for a user
 */
export async function listShares(
  options: ListSharesOptions
): Promise<{ shares: Share[]; total: number }> {
  const { user_id, limit = 20, offset = 0, generation_id } = options;

  let query = sql`
    SELECT *
    FROM shares
    WHERE user_id = ${user_id}
  `;

  // Add generation filter if provided
  if (generation_id) {
    query = sql`
      SELECT *
      FROM shares
      WHERE user_id = ${user_id}
        AND generation_id = ${generation_id}
    `;
  }

  // Get total count
  let countQuery = sql`
    SELECT COUNT(*) as total
    FROM shares
    WHERE user_id = ${user_id}
  `;

  if (generation_id) {
    countQuery = sql`
      SELECT COUNT(*) as total
      FROM shares
      WHERE user_id = ${user_id}
        AND generation_id = ${generation_id}
    `;
  }

  const countResult = await countQuery;
  const total = Number(countResult[0]?.total || 0);

  // Get paginated results
  const result = await sql`
    ${query}
    ORDER BY created_at DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const shares = result.map(mapDbRowToShare);

  return { shares, total };
}

/**
 * Get a share by token
 */
export async function getShareByToken(
  share_token: string
): Promise<Share | null> {
  const result = await sql`
    SELECT *
    FROM shares
    WHERE share_token = ${share_token}
      AND (expires_at IS NULL OR expires_at > NOW())
    LIMIT 1
  `;

  if (result.length === 0) {
    return null;
  }

  // Increment view count
  await sql`
    UPDATE shares
    SET view_count = view_count + 1,
        updated_at = NOW()
    WHERE share_token = ${share_token}
  `;

  return mapDbRowToShare(result[0]);
}

/**
 * Get a specific share by ID
 */
export async function getShare(
  id: string,
  user_id: string
): Promise<Share | null> {
  const result = await sql`
    SELECT *
    FROM shares
    WHERE id = ${id}
      AND user_id = ${user_id}
    LIMIT 1
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToShare(result[0]);
}

/**
 * Update a share
 */
export async function updateShare(
  id: string,
  user_id: string,
  updates: {
    is_readonly?: boolean;
    expires_at?: Date | null;
  }
): Promise<Share | null> {
  const now = new Date();
  const updateClauses: string[] = [];

  if (updates.is_readonly !== undefined) {
    updateClauses.push(`is_readonly = ${updates.is_readonly}`);
  }
  if (updates.expires_at !== undefined) {
    updateClauses.push(`expires_at = ${updates.expires_at ? updates.expires_at.toISOString() : null}`);
  }

  if (updateClauses.length === 0) {
    return getShare(id, user_id);
  }

  const result = await sql`
    UPDATE shares
    SET ${sql.unsafe(updateClauses.join(', '))},
      updated_at = ${now.toISOString()}
    WHERE id = ${id}
      AND user_id = ${user_id}
    RETURNING *
  `;

  if (result.length === 0) {
    return null;
  }

  return mapDbRowToShare(result[0]);
}

/**
 * Delete a share
 */
export async function deleteShare(
  id: string,
  user_id: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM shares
    WHERE id = ${id}
      AND user_id = ${user_id}
    RETURNING id
  `;

  return result.length > 0;
}

/**
 * Delete all shares for a generation
 */
export async function deleteGenerationShares(
  generation_id: string,
  user_id: string
): Promise<boolean> {
  const result = await sql`
    DELETE FROM shares
    WHERE generation_id = ${generation_id}
      AND user_id = ${user_id}
    RETURNING id
  `;

  return result.length > 0;
}

/**
 * Get shared generation by share token
 */
export async function getSharedGeneration(
  share_token: string
): Promise<{ share: Share; generation: any } | null> {
  const share = await getShareByToken(share_token);

  if (!share) {
    return null;
  }

  const generation = await loadGeneration(share.generation_id, share.user_id);

  if (!generation) {
    return null;
  }

  return { share, generation };
}

/**
 * Check if a share is valid and not expired
 */
export async function isShareValid(
  share_token: string
): Promise<boolean> {
  const result = await sql`
    SELECT 1
    FROM shares
    WHERE share_token = ${share_token}
      AND (expires_at IS NULL OR expires_at > NOW())
    LIMIT 1
  `;

  return result.length > 0;
}

/**
 * Map database row to Share type
 */
function mapDbRowToShare(row: unknown): Share {
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id),
    generation_id: String(r.generation_id),
    user_id: String(r.user_id),
    share_token: String(r.share_token),
    share_url: String(r.share_url),
    is_readonly: Boolean(r.is_readonly),
    expires_at: r.expires_at ? new Date(String(r.expires_at)) : null,
    view_count: Number(r.view_count),
    created_at: new Date(String(r.created_at)),
    updated_at: new Date(String(r.updated_at)),
  };
}
