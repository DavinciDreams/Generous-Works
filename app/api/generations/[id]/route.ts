/**
 * API Routes for Individual Generation Management
 * GET /api/generations/[id] - Load a specific generation
 * PUT /api/generations/[id] - Update a specific generation
 * DELETE /api/generations/[id] - Delete a specific generation
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  loadGeneration,
  updateGeneration,
  deleteGeneration,
  UpdateGenerationInput,
} from '@/lib/generations/neon-storage';
import { z } from 'zod';

// Validation schemas
const UpdateGenerationSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  messages: z.array(z.unknown()).optional(),
  ui_components: z.record(z.string(), z.unknown()).optional(),
  component_layouts: z.record(z.string(), z.unknown()).optional(),
});

/**
 * GET /api/generations/[id]
 * Load a specific generation by ID
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

    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid generation ID' },
        { status: 400 }
      );
    }

    // Load generation
    const generation = await loadGeneration(id, userId);

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      generation,
    });
  } catch (error) {
    console.error('Error loading generation:', error);

    return NextResponse.json(
      { error: 'Failed to load generation' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/generations/[id]
 * Update a specific generation
 */
export async function PUT(
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

    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid generation ID' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateGenerationSchema.parse(body);

    // Check if at least one field is being updated
    const hasUpdates = Object.keys(validatedData).some(
      (key) => validatedData[key as keyof typeof validatedData] !== undefined
    );

    if (!hasUpdates) {
      return NextResponse.json(
        { error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Update generation
    const updates: UpdateGenerationInput = {};
    if (validatedData.name !== undefined) updates.name = validatedData.name;
    if (validatedData.description !== undefined) updates.description = validatedData.description;
    if (validatedData.messages !== undefined) updates.messages = validatedData.messages;
    if (validatedData.ui_components !== undefined) updates.ui_components = validatedData.ui_components;
    if (validatedData.component_layouts !== undefined) updates.component_layouts = validatedData.component_layouts;

    const generation = await updateGeneration(id, userId, updates);

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      generation,
    });
  } catch (error) {
    console.error('Error updating generation:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update generation' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/generations/[id]
 * Delete a specific generation
 */
export async function DELETE(
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

    const { id } = await params;

    // Validate ID format
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Invalid generation ID' },
        { status: 400 }
      );
    }

    // Delete generation
    const deleted = await deleteGeneration(id, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Generation deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting generation:', error);

    return NextResponse.json(
      { error: 'Failed to delete generation' },
      { status: 500 }
    );
  }
}
