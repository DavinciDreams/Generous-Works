/**
 * Analytics System for Generations
 * Provides analytics tracking and insights for component usage
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
export interface AnalyticsEvent {
  id: string;
  user_id: string;
  generation_id: string | null;
  event_type: string;
  component_type: string | null;
  action: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface CreateAnalyticsEventInput {
  user_id: string;
  generation_id?: string;
  event_type: string;
  component_type?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

export interface GetAnalyticsOptions {
  user_id: string;
  generation_id?: string;
  event_type?: string;
  component_type?: string;
  start_date?: Date;
  end_date?: Date;
  limit?: number;
  offset?: number;
}

export interface AnalyticsSummary {
  total_events: number;
  event_types: Record<string, number>;
  component_types: Record<string, number>;
  actions: Record<string, number>;
  daily_counts: Array<{ date: string; count: number }>;
}

export interface ComponentUsageStats {
  component_type: string;
  total_events: number;
  event_types: Record<string, number>;
  actions: Record<string, number>;
  last_used: Date | null;
}

/**
 * Create an analytics event
 */
export async function createAnalyticsEvent(
  input: CreateAnalyticsEventInput
): Promise<AnalyticsEvent> {
  const id = uuidv4();
  const now = new Date();

  const result = await sql`
    INSERT INTO analytics (
      id,
      user_id,
      generation_id,
      event_type,
      component_type,
      action,
      metadata,
      created_at
    )
    VALUES (
      ${id},
      ${input.user_id},
      ${input.generation_id || null},
      ${input.event_type},
      ${input.component_type || null},
      ${input.action || null},
      ${JSON.stringify(input.metadata || {})}::jsonb,
      ${now.toISOString()}
    )
    RETURNING *
  `;

  return mapDbRowToAnalyticsEvent(result[0]);
}

/**
 * Get analytics events with filters
 */
export async function getAnalytics(
  options: GetAnalyticsOptions
): Promise<{ events: AnalyticsEvent[]; total: number }> {
  const {
    user_id,
    generation_id,
    event_type,
    component_type,
    start_date,
    end_date,
    limit = 100,
    offset = 0,
  } = options;

  let query = sql`
    SELECT *
    FROM analytics
    WHERE user_id = ${user_id}
  `;

  // Add filters
  if (generation_id) {
    query = sql`
      SELECT *
      FROM analytics
      WHERE user_id = ${user_id}
        AND generation_id = ${generation_id}
    `;
  }

  if (event_type) {
    query = sql`
      SELECT *
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        AND event_type = ${event_type}
    `;
  }

  if (component_type) {
    query = sql`
      SELECT *
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        ${event_type ? sql`AND event_type = ${event_type}` : sql``}
        AND component_type = ${component_type}
    `;
  }

  if (start_date) {
    query = sql`
      SELECT *
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        ${event_type ? sql`AND event_type = ${event_type}` : sql``}
        ${component_type ? sql`AND component_type = ${component_type}` : sql``}
        AND created_at >= ${start_date.toISOString()}
    `;
  }

  if (end_date) {
    query = sql`
      SELECT *
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        ${event_type ? sql`AND event_type = ${event_type}` : sql``}
        ${component_type ? sql`AND component_type = ${component_type}` : sql``}
        ${start_date ? sql`AND created_at >= ${start_date.toISOString()}` : sql``}
        AND created_at <= ${end_date.toISOString()}
    `;
  }

  // Get total count
  let countQuery = sql`
    SELECT COUNT(*) as total
    FROM analytics
    WHERE user_id = ${user_id}
  `;

  if (generation_id) {
    countQuery = sql`
      SELECT COUNT(*) as total
      FROM analytics
      WHERE user_id = ${user_id}
        AND generation_id = ${generation_id}
    `;
  }

  if (event_type) {
    countQuery = sql`
      SELECT COUNT(*) as total
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        AND event_type = ${event_type}
    `;
  }

  if (component_type) {
    countQuery = sql`
      SELECT COUNT(*) as total
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        ${event_type ? sql`AND event_type = ${event_type}` : sql``}
        AND component_type = ${component_type}
    `;
  }

  if (start_date) {
    countQuery = sql`
      SELECT COUNT(*) as total
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        ${event_type ? sql`AND event_type = ${event_type}` : sql``}
        ${component_type ? sql`AND component_type = ${component_type}` : sql``}
        AND created_at >= ${start_date.toISOString()}
    `;
  }

  if (end_date) {
    countQuery = sql`
      SELECT COUNT(*) as total
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        ${event_type ? sql`AND event_type = ${event_type}` : sql``}
        ${component_type ? sql`AND component_type = ${component_type}` : sql``}
        ${start_date ? sql`AND created_at >= ${start_date.toISOString()}` : sql``}
        AND created_at <= ${end_date.toISOString()}
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

  const events = result.map(mapDbRowToAnalyticsEvent);

  return { events, total };
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(
  user_id: string,
  generation_id?: string,
  start_date?: Date,
  end_date?: Date
): Promise<AnalyticsSummary> {
  let query = sql`
    SELECT
      COUNT(*) as total_events,
      event_type,
      component_type,
      action,
      DATE(created_at) as date
    FROM analytics
    WHERE user_id = ${user_id}
  `;

  if (generation_id) {
    query = sql`
      SELECT
        COUNT(*) as total_events,
        event_type,
        component_type,
        action,
        DATE(created_at) as date
      FROM analytics
      WHERE user_id = ${user_id}
        AND generation_id = ${generation_id}
    `;
  }

  if (start_date) {
    query = sql`
      SELECT
        COUNT(*) as total_events,
        event_type,
        component_type,
        action,
        DATE(created_at) as date
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        AND created_at >= ${start_date.toISOString()}
    `;
  }

  if (end_date) {
    query = sql`
      SELECT
        COUNT(*) as total_events,
        event_type,
        component_type,
        action,
        DATE(created_at) as date
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        ${start_date ? sql`AND created_at >= ${start_date.toISOString()}` : sql``}
        AND created_at <= ${end_date.toISOString()}
    `;
  }

  const result = await query;

  const totalEvents = Number(result[0]?.total_events || 0);
  const eventTypes: Record<string, number> = {};
  const componentTypes: Record<string, number> = {};
  const actions: Record<string, number> = {};
  const dailyCounts: Record<string, number> = {};

  result.forEach((row: unknown) => {
    const r = row as Record<string, unknown>;
    const eventType = String(r.event_type);
    const componentType = r.component_type ? String(r.component_type) : 'unknown';
    const action = r.action ? String(r.action) : 'unknown';
    const date = String(r.date);

    eventTypes[eventType] = (eventTypes[eventType] || 0) + 1;
    componentTypes[componentType] = (componentTypes[componentType] || 0) + 1;
    actions[action] = (actions[action] || 0) + 1;
    dailyCounts[date] = (dailyCounts[date] || 0) + 1;
  });

  const dailyCountsArray = Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    total_events: totalEvents,
    event_types: eventTypes,
    component_types: componentTypes,
    actions: actions,
    daily_counts: dailyCountsArray,
  };
}

/**
 * Get component usage statistics
 */
export async function getComponentUsageStats(
  user_id: string,
  generation_id?: string,
  start_date?: Date,
  end_date?: Date
): Promise<ComponentUsageStats[]> {
  let query = sql`
    SELECT
      component_type,
      COUNT(*) as total_events,
      event_type,
      action,
      MAX(created_at) as last_used
    FROM analytics
    WHERE user_id = ${user_id}
      AND component_type IS NOT NULL
  `;

  if (generation_id) {
    query = sql`
      SELECT
        component_type,
        COUNT(*) as total_events,
        event_type,
        action,
        MAX(created_at) as last_used
      FROM analytics
      WHERE user_id = ${user_id}
        AND generation_id = ${generation_id}
        AND component_type IS NOT NULL
    `;
  }

  if (start_date) {
    query = sql`
      SELECT
        component_type,
        COUNT(*) as total_events,
        event_type,
        action,
        MAX(created_at) as last_used
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        AND component_type IS NOT NULL
        AND created_at >= ${start_date.toISOString()}
    `;
  }

  if (end_date) {
    query = sql`
      SELECT
        component_type,
        COUNT(*) as total_events,
        event_type,
        action,
        MAX(created_at) as last_used
      FROM analytics
      WHERE user_id = ${user_id}
        ${generation_id ? sql`AND generation_id = ${generation_id}` : sql``}
        AND component_type IS NOT NULL
        ${start_date ? sql`AND created_at >= ${start_date.toISOString()}` : sql``}
        AND created_at <= ${end_date.toISOString()}
    `;
  }

  query = sql`
    ${query}
    GROUP BY component_type, event_type, action
    ORDER BY component_type, total_events DESC
  `;

  const result = await query;

  const componentStats: Record<string, ComponentUsageStats> = {};

  result.forEach((row: unknown) => {
    const r = row as Record<string, unknown>;
    const componentType = String(r.component_type);
    const eventType = String(r.event_type);
    const action = r.action ? String(r.action) : 'unknown';
    const totalEvents = Number(r.total_events);
    const lastUsed = r.last_used ? new Date(String(r.last_used)) : null;

    if (!componentStats[componentType]) {
      componentStats[componentType] = {
        component_type: componentType,
        total_events: 0,
        event_types: {},
        actions: {},
        last_used: lastUsed,
      };
    }

    componentStats[componentType].total_events += totalEvents;
    componentStats[componentType].event_types[eventType] = (componentStats[componentType].event_types[eventType] || 0) + totalEvents;
    componentStats[componentType].actions[action] = (componentStats[componentType].actions[action] || 0) + totalEvents;

    if (lastUsed && (!componentStats[componentType].last_used || lastUsed > componentStats[componentType].last_used!)) {
      componentStats[componentType].last_used = lastUsed;
    }
  });

  return Object.values(componentStats).sort((a, b) => b.total_events - a.total_events);
}

/**
 * Track component view
 */
export async function trackComponentView(
  user_id: string,
  generation_id: string,
  component_type: string,
  metadata?: Record<string, unknown>
): Promise<AnalyticsEvent> {
  return createAnalyticsEvent({
    user_id,
    generation_id,
    event_type: 'view',
    component_type,
    action: 'view',
    metadata,
  });
}

/**
 * Track component interaction
 */
export async function trackComponentInteraction(
  user_id: string,
  generation_id: string,
  component_type: string,
  action: string,
  metadata?: Record<string, unknown>
): Promise<AnalyticsEvent> {
  return createAnalyticsEvent({
    user_id,
    generation_id,
    event_type: 'interaction',
    component_type,
    action,
    metadata,
  });
}

/**
 * Track component creation
 */
export async function trackComponentCreation(
  user_id: string,
  generation_id: string,
  component_type: string,
  metadata?: Record<string, unknown>
): Promise<AnalyticsEvent> {
  return createAnalyticsEvent({
    user_id,
    generation_id,
    event_type: 'creation',
    component_type,
    action: 'create',
    metadata,
  });
}

/**
 * Track component update
 */
export async function trackComponentUpdate(
  user_id: string,
  generation_id: string,
  component_type: string,
  metadata?: Record<string, unknown>
): Promise<AnalyticsEvent> {
  return createAnalyticsEvent({
    user_id,
    generation_id,
    event_type: 'update',
    component_type,
    action: 'update',
    metadata,
  });
}

/**
 * Track component deletion
 */
export async function trackComponentDeletion(
  user_id: string,
  generation_id: string,
  component_type: string,
  metadata?: Record<string, unknown>
): Promise<AnalyticsEvent> {
  return createAnalyticsEvent({
    user_id,
    generation_id,
    event_type: 'deletion',
    component_type,
    action: 'delete',
    metadata,
  });
}

/**
 * Map database row to AnalyticsEvent type
 */
function mapDbRowToAnalyticsEvent(row: unknown): AnalyticsEvent {
  const r = row as Record<string, unknown>;
  return {
    id: String(r.id),
    user_id: String(r.user_id),
    generation_id: r.generation_id ? String(r.generation_id) : null,
    event_type: String(r.event_type),
    component_type: r.component_type ? String(r.component_type) : null,
    action: r.action ? String(r.action) : null,
    metadata: typeof r.metadata === 'object' && r.metadata !== null
      ? (r.metadata as Record<string, unknown>)
      : {},
    created_at: new Date(String(r.created_at)),
  };
}
