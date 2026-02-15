/**
 * API Routes for Analytics
 * GET /api/analytics - Get analytics events for the authenticated user
 * GET /api/analytics/summary - Get analytics summary
 * GET /api/analytics/components - Get component usage statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getAnalytics,
  getAnalyticsSummary,
  getComponentUsageStats,
  GetAnalyticsOptions,
} from '@/lib/generations/analytics';
import { z } from 'zod';

// Validation schemas
const GetAnalyticsSchema = z.object({
  generation_id: z.string().optional(),
  event_type: z.string().optional(),
  component_type: z.string().optional(),
  start_date: z.string().optional().transform((val) => {
    if (!val) return undefined;
    return new Date(val);
  }),
  end_date: z.string().optional().transform((val) => {
    if (!val) return undefined;
    return new Date(val);
  }),
  limit: z.coerce.number().min(1).max(100).default(100),
  offset: z.coerce.number().min(0).default(0),
});

/**
 * GET /api/analytics
 * Get analytics events for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const validatedParams = GetAnalyticsSchema.parse({
      generation_id: searchParams.get('generation_id'),
      event_type: searchParams.get('event_type'),
      component_type: searchParams.get('component_type'),
      start_date: searchParams.get('start_date'),
      end_date: searchParams.get('end_date'),
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    });

    // Get analytics
    const options: GetAnalyticsOptions = {
      user_id: userId,
      generation_id: validatedParams.generation_id,
      event_type: validatedParams.event_type,
      component_type: validatedParams.component_type,
      start_date: validatedParams.start_date,
      end_date: validatedParams.end_date,
      limit: validatedParams.limit,
      offset: validatedParams.offset,
    };

    const { events, total } = await getAnalytics(options);

    return NextResponse.json({
      success: true,
      events,
      total,
      limit: options.limit,
      offset: options.offset,
    });
  } catch (error) {
    console.error('Error getting analytics:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to get analytics' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/summary
 * Get analytics summary
 */
export async function GET_SUMMARY(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('generation_id') || undefined;
    const startDate = searchParams.get('start_date') ? new Date(searchParams.get('start_date')!) : undefined;
    const endDate = searchParams.get('end_date') ? new Date(searchParams.get('end_date')!) : undefined;

    // Get analytics summary
    const summary = await getAnalyticsSummary(userId, generationId, startDate, endDate);

    return NextResponse.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error('Error getting analytics summary:', error);

    return NextResponse.json(
      { error: 'Failed to get analytics summary' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analytics/components
 * Get component usage statistics
 */
export async function GET_COMPONENTS(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const generationId = searchParams.get('generation_id') || undefined;
    const startDate = searchParams.get('start_date') ? new Date(searchParams.get('start_date')!) : undefined;
    const endDate = searchParams.get('end_date') ? new Date(searchParams.get('end_date')!) : undefined;

    // Get component usage statistics
    const componentStats = await getComponentUsageStats(userId, generationId, startDate, endDate);

    return NextResponse.json({
      success: true,
      components: componentStats,
    });
  } catch (error) {
    console.error('Error getting component usage statistics:', error);

    return NextResponse.json(
      { error: 'Failed to get component usage statistics' },
      { status: 500 }
    );
  }
}
