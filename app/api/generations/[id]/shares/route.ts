/**
 * API Routes for Generation Sharing
 * POST /api/generations/[id]/shares - Create a share link for a generation
 * GET /api/generations/[id]/shares - List shares for a generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  createShare,
  listShares,
  CreateShareInput,
  ListSharesOptions,
} from '@/lib/generations/sharing';
import { z } from 'zod';

// Validation schemas
const CreateShareSchema = z.object({
  is_readonly: z.boolean().optional(),
  expires_at: z.string().optional().transform((val) => {
    if (!val) return null;
    return new Date(val);
  }),
});

const ListSharesSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
});

/**
 * POST /api/generations/[id]/shares
 * Create a share link for a generation
 */
export async function POST(
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

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateShareSchema.parse(body);

    // Create share input
    const input: CreateShareInput = {
      generation_id,
      user_id: userId,
      is_readonly: validatedData.is_readonly,
      expires_at: validatedData.expires_at,
    };

    // Create share
    const share = await createShare(input);

    return NextResponse.json(
      { success: true, share },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating share:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create share' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generations/[id]/shares
 * List shares for a generation
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
    const validatedParams = ListSharesSchema.parse({
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    });

    // List shares
    const options: ListSharesOptions = {
      user_id: userId,
      limit: validatedParams.limit,
      offset: validatedParams.offset,
      generation_id,
    };

    const { shares, total } = await listShares(options);

    return NextResponse.json({
      success: true,
      shares,
      total,
      limit: options.limit,
      offset: options.offset,
    });
  } catch (error) {
    console.error('Error listing shares:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to list shares' },
      { status: 500 }
    );
  }
}
