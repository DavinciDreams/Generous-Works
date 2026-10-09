/**
 * API Routes for AI Suggestions
 * POST /api/ai/suggestions - Generate AI suggestions for component layout optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Validation schemas
const GenerateSuggestionsSchema = z.object({
  components: z.record(z.string(), z.unknown()),
});

/**
 * POST /api/ai/suggestions
 * Generate AI suggestions for component layout optimization
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
    const validatedData = GenerateSuggestionsSchema.parse(body);

    // Generate AI suggestions
    const prompt = `
You are an expert UI/UX designer and frontend developer. Analyze the following component configuration and provide optimization suggestions.

Component Configuration:
${JSON.stringify(validatedData.components, null, 2)}

Please provide 3-5 suggestions for improving the layout, user experience, or performance. Each suggestion should include:
1. A clear title
2. A detailed description
3. Priority level (high, medium, low)
4. Specific suggestion (as JSON)
5. Confidence score (0-1)

Focus on:
- Layout optimization
- Component organization
- User experience improvements
- Performance considerations
- Accessibility enhancements

Return your response as a JSON array of suggestions with the following structure:
[
  {
    "id": "unique-id",
    "type": "layout" | "component" | "optimization",
    "title": "Suggestion Title",
    "description": "Detailed description",
    "priority": "high" | "medium" | "low",
    "suggestion": { ... },
    "confidence": 0.9,
    "applied": false
  }
]
`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      temperature: 0.7,
    });

    // Parse AI response
    let suggestions;
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in AI response');
      }
    } catch (err) {
      console.error('Failed to parse AI response:', err);
      suggestions = [];
    }

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error('Error generating AI suggestions:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate AI suggestions' },
      { status: 500 }
    );
  }
}
