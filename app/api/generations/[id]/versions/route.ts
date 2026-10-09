/**
 * API Routes for Generation Version Management
 * GET /api/generations/[id]/versions - List all versions for a generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { listVersions } from '@/lib/generations/version-control';
import { z } from 'zod';

// Validation schemas
const ListVersionsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  offset: z.coerce.number().min(0).default(0),
});

/**
 * GET /api/generations/[id]/versions
 * List all versions for a generation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: generation_id } = await params;

    // Validate ID format
    if (!generation_id || typeof generation_id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid generation ID' },
        { status: 400 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const validatedParams = ListVersionsSchema.parse({
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    });

    // List versions
    const { versions, total } = await listVersions({
      generation_id,
      user_id: userId,
      limit: validatedParams.limit,
      offset: validatedParams.offset,
    });

    return NextResponse.json({
      success: true,
      versions,
      total,
      limit: validatedParams.limit,
      offset: validatedParams.offset,
    });
  } catch (error) {
    console.error('Error listing versions:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to list versions' },
      { status: 500 }
    );
  }
}
