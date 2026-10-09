/**
 * API Routes for Template Management
 * POST /api/templates - Create a new template
 * GET /api/templates - List templates for the authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  createTemplate,
  listTemplates,
  getTemplateCategories,
  getPopularTags,
  CreateTemplateInput,
  ListTemplatesOptions,
} from '@/lib/generations/templates';
import { z } from 'zod';

// Validation schemas
const CreateTemplateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  ui_components: z.record(z.string(), z.unknown()).default({}),
  component_layouts: z.record(z.string(), z.unknown()).optional(),
  is_public: z.boolean().optional(),
});

const ListTemplatesSchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
  search: z.string().optional(),
  category: z.string().optional(),
  tags: z.string().optional(),
  include_public: z.coerce.boolean().default(false),
  include_system: z.coerce.boolean().default(false),
});

/**
 * POST /api/templates
 * Create a new template
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
    const validatedData = CreateTemplateSchema.parse(body);

    // Create template input
    const input: CreateTemplateInput = {
      user_id: userId,
      name: validatedData.name,
      description: validatedData.description,
      category: validatedData.category,
      tags: validatedData.tags,
      ui_components: validatedData.ui_components,
      component_layouts: validatedData.component_layouts,
      is_public: validatedData.is_public,
    };

    // Create template
    const template = await createTemplate(input);

    return NextResponse.json(
      { success: true, template },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating template:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/templates
 * List templates for the authenticated user
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
    const validatedParams = ListTemplatesSchema.parse({
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
      search: searchParams.get('search'),
      category: searchParams.get('category'),
      tags: searchParams.get('tags'),
      include_public: searchParams.get('include_public'),
      include_system: searchParams.get('include_system'),
    });

    // Parse tags if provided
    const tags = validatedParams.tags ? validatedParams.tags.split(',').map(t => t.trim()) : undefined;

    // List templates
    const options: ListTemplatesOptions = {
      user_id: userId,
      limit: validatedParams.limit,
      offset: validatedParams.offset,
      search: validatedParams.search,
      category: validatedParams.category,
      tags,
      include_public: validatedParams.include_public,
      include_system: validatedParams.include_system,
    };

    const { templates, total } = await listTemplates(options);

    return NextResponse.json({
      success: true,
      templates,
      total,
      limit: options.limit,
      offset: options.offset,
    });
  } catch (error) {
    console.error('Error listing templates:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to list templates' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/templates/categories
 * Get template categories
 */
export async function GET_CATEGORIES(request: NextRequest) {
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
    const includePublic = searchParams.get('include_public') === 'true';
    const includeSystem = searchParams.get('include_system') === 'true';

    // Get categories
    const categories = await getTemplateCategories(userId, includePublic, includeSystem);

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error('Error getting categories:', error);

    return NextResponse.json(
      { error: 'Failed to get categories' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/templates/tags/popular
 * Get popular tags
 */
export async function GET_POPULAR_TAGS(request: NextRequest) {
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
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // Get popular tags
    const tags = await getPopularTags(userId, limit);

    return NextResponse.json({
      success: true,
      tags,
    });
  } catch (error) {
    console.error('Error getting popular tags:', error);

    return NextResponse.json(
      { error: 'Failed to get popular tags' },
      { status: 500 }
    );
  }
}
