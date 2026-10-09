/**
 * API Routes for Individual Template Management
 * GET /api/templates/[id] - Get a specific template
 * PUT /api/templates/[id] - Update a specific template
 * DELETE /api/templates/[id] - Delete a specific template
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  getTemplate,
  updateTemplate,
  deleteTemplate,
  incrementTemplateUsage,
} from '@/lib/generations/templates';
import { z } from 'zod';

// Validation schemas
const UpdateTemplateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ui_components: z.record(z.string(), z.unknown()).optional(),
  component_layouts: z.record(z.string(), z.unknown()).optional(),
  is_public: z.boolean().optional(),
});

/**
 * GET /api/templates/[id]
 * Get a specific template by ID
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
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Get template
    const template = await getTemplate(id, userId);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Increment usage count
    await incrementTemplateUsage(id);

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error getting template:', error);

    return NextResponse.json(
      { error: 'Failed to get template' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/templates/[id]
 * Update a specific template
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
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateTemplateSchema.parse(body);

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

    // Update template
    const updates = {
      ...validatedData,
    };

    const template = await updateTemplate(id, userId, updates);

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error('Error updating template:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/templates/[id]
 * Delete a specific template
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
        { error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    // Delete template
    const deleted = await deleteTemplate(id, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Template not found or cannot be deleted (system templates cannot be deleted)' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting template:', error);

    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
