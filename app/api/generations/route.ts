/**
 * API Routes for Generations Management
 * POST /api/generations - Save a new generation
 * GET /api/generations - List generations for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  saveGeneration,
  listGenerations,
  CreateGenerationInput,
  ListGenerationsOptions,
} from '@/lib/generations/neon-storage';
import { z } from 'zod';

// Validation schemas
const CreateGenerationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  messages: z.array(z.unknown()).default([]),
  ui_components: z.record(z.string(), z.unknown()).default({}),
  component_layouts: z.record(z.string(), z.unknown()).optional(),
});

const ListGenerationsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(),
});

/**
 * POST /api/generations
 * Save a new generation
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = CreateGenerationSchema.parse(body);

    // Create generation input
    const input: CreateGenerationInput = {
      user_id: userId,
      name: validatedData.name,
      description: validatedData.description,
      messages: validatedData.messages,
      ui_components: validatedData.ui_components,
      component_layouts: validatedData.component_layouts,
    };

    // Save generation
    const generation = await saveGeneration(input);

    return NextResponse.json(
      { success: true, generation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving generation:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to save generation' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generations
 * List generations for the authenticated user
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
    const validatedParams = ListGenerationsSchema.parse({
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      search: searchParams.get('search'),
    });

    // List generations
    const options: ListGenerationsOptions = {
      user_id: userId,
      limit: validatedParams.limit,
      offset: validatedParams.offset,
      search: validatedParams.search,
    };

    const { generations, total } = await listGenerations(options);

    return NextResponse.json({
      success: true,
      generations,
      total,
      limit: options.limit,
      offset: options.offset,
    });
  } catch (error) {
    console.error('Error listing generations:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to list generations' },
      { status: 500 }
    );
  }
}
