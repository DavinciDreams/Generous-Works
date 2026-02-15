/**
 * API Routes for Shared Generation Access
 * GET /api/shares/[shareToken] - Get a shared generation by share token
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSharedGeneration, isShareValid } from '@/lib/generations/sharing';

/**
 * GET /api/shares/[shareToken]
 * Get a shared generation by share token
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shareToken: string }> }
) {
  try {
    const { shareToken } = await params;

    // Validate token format
    if (!shareToken || typeof shareToken !== 'string') {
      return NextResponse.json(
        { error: 'Invalid share token' },
        { status: 400 }
      );
    }

    // Check if share is valid
    const isValid = await isShareValid(shareToken);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Share link is invalid or has expired' },
        { status: 404 }
      );
    }

    // Get shared generation
    const result = await getSharedGeneration(shareToken);

    if (!result) {
      return NextResponse.json(
        { error: 'Shared generation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      share: result.share,
      generation: result.generation,
    });
  } catch (error) {
    console.error('Error getting shared generation:', error);

    return NextResponse.json(
      { error: 'Failed to get shared generation' },
      { status: 500 }
    );
  }
}
