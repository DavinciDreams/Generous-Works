/**
 * API Routes for Individual Version Management
 * GET /api/generations/[id]/versions/[versionId] - Get a specific version
 * POST /api/generations/[id]/versions/[versionId]/restore - Restore a version
 * DELETE /api/generations/[id]/versions/[versionId] - Delete a version
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getVersion,
  restoreVersion,
  deleteVersion,
  compareVersions,
} from '@/lib/generations/version-control';

/**
 * GET /api/generations/[id]/versions/[versionId]
 * Get a specific version by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
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

    const { versionId } = await params;

    // Validate ID format
    if (!versionId || typeof versionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid version ID' },
        { status: 400 }
      );
    }

    // Get version
    const version = await getVersion(versionId, userId);

    if (!version) {
      return NextResponse.json(
        { error: 'Version not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      version,
    });
  } catch (error) {
    console.error('Error getting version:', error);

    return NextResponse.json(
      { error: 'Failed to get version' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/generations/[id]/versions/[versionId]/restore
 * Restore a specific version to become the current generation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
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

    const { versionId } = await params;

    // Validate ID format
    if (!versionId || typeof versionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid version ID' },
        { status: 400 }
      );
    }

    // Check if this is a restore action
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action !== 'restore') {
      return NextResponse.json(
        { error: 'Invalid action. Use ?action=restore' },
        { status: 400 }
      );
    }

    // Restore version
    const restoredVersion = await restoreVersion(versionId, userId);

    if (!restoredVersion) {
      return NextResponse.json(
        { error: 'Version not found or cannot be restored' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      version: restoredVersion,
    });
  } catch (error) {
    console.error('Error restoring version:', error);

    return NextResponse.json(
      { error: 'Failed to restore version' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/generations/[id]/versions/[versionId]
 * Delete a specific version (cannot delete current version)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; versionId: string }> }
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

    const { versionId } = await params;

    // Validate ID format
    if (!versionId || typeof versionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid version ID' },
        { status: 400 }
      );
    }

    // Delete version
    const deleted = await deleteVersion(versionId, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Version not found or cannot be deleted (current versions cannot be deleted)' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Version deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting version:', error);

    return NextResponse.json(
      { error: 'Failed to delete version' },
      { status: 500 }
    );
  }
}
