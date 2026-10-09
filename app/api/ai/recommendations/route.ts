/**
 * API Routes for AI Recommendations
 * POST /api/ai/recommendations - Generate AI recommendations for component selection
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Validation schemas
const GenerateRecommendationsSchema = z.object({
  context: z.record(z.string(), z.unknown()),
});

/**
 * POST /api/ai/recommendations
 * Generate AI recommendations for component selection
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
    const validatedData = GenerateRecommendationsSchema.parse(body);

    // Generate AI recommendations
    const prompt = `
You are an expert UI/UX designer and frontend developer. Based on the following context, recommend components that would be useful.

Context:
${JSON.stringify(validatedData.context, null, 2)}

Available component types include:
- chat: Chat interface for conversational UI
- dashboard: Dashboard with multiple panels
- form: Form with validation
- table: Data table with sorting and filtering
- chart: Chart visualization
- card: Card component for content display
- button: Button with various styles
- input: Input field for user input
- select: Dropdown selection
- modal: Modal dialog
- alert: Alert notification
- badge: Badge for status display

Please provide 3-5 component recommendations that would enhance this UI. Each recommendation should include:
1. Component type
2. Recommended components (array of component names)
3. Reason for recommendation
4. Confidence score (0-1)

Return your response as a JSON array of recommendations with the following structure:
[
  {
    "component_type": "type",
    "recommended_components": ["component1", "component2"],
    "reason": "Detailed reason",
    "confidence": 0.9
  }
]
`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
    });

    // Parse AI response
    let recommendations;
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (err) {
      console.error('Failed to parse AI response:', err);
      recommendations = [];
    }

    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('Error generating AI recommendations:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AI recommendations' },
      { status: 500 }
    );
  }
}
