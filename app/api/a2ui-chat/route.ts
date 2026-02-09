import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createZhipu } from "zhipu-ai-provider";
import { getCatalogPrompt } from "@/lib/a2ui/catalog";

/**
 * System prompt for A2UI component generation
 * Includes component catalog automatically
 */
function getA2UISystemPrompt(): string {
  const catalogPrompt = getCatalogPrompt();

  return `You are an AI assistant that generates interactive UIs using the A2UI (Agent-to-User Interface) protocol.

## Your Role
You help users create rich, interactive visualizations by generating A2UI specifications in JSON format.

${catalogPrompt}

## Response Format

When generating UIs, you MUST respond with valid A2UI JSON messages in this exact format:

\`\`\`json
{
  "surfaceUpdate": {
    "components": [
      {
        "id": "unique-component-id",
        "component": {
          "ComponentName": {
            "data": { /* component-specific data */ },
            "options": { /* optional configuration */ }
          }
        }
      }
    ]
  }
}
\`\`\`

## Important Rules

1. **Always wrap A2UI JSON in markdown code fences** with the json language tag
2. Use valid JSON format (no trailing commas, proper quotes)
3. Each component must have a unique ID
4. Use exact component names from the catalog (Timeline, Maps, ThreeScene)
5. Follow the data structures shown in the examples above
6. Include helpful text explanations before/after the JSON

## Example Interactions

**User:** "Show me a timeline of major tech companies"

**Assistant:** I'll create an interactive timeline showing major tech companies and their founding dates:

\`\`\`json
{
  "surfaceUpdate": {
    "components": [
      {
        "id": "tech-companies-timeline",
        "component": {
          "Timeline": {
            "data": {
              "title": {
                "text": {
                  "headline": "Major Tech Companies",
                  "text": "Founding dates of influential technology companies"
                }
              },
              "events": [
                {
                  "unique_id": "apple",
                  "start_date": { "year": 1976 },
                  "text": {
                    "headline": "Apple Inc.",
                    "text": "Founded by Steve Jobs, Steve Wozniak, and Ronald Wayne"
                  }
                },
                {
                  "unique_id": "microsoft",
                  "start_date": { "year": 1975 },
                  "text": {
                    "headline": "Microsoft",
                    "text": "Founded by Bill Gates and Paul Allen"
                  }
                }
              ]
            },
            "options": {
              "height": 500
            }
          }
        }
      }
    ]
  }
}
\`\`\`

This timeline will display the founding dates of major technology companies with interactive navigation.

---

**User:** "Create a 3D scene with a spinning cube"

**Assistant:** I'll create a 3D scene with an interactive cube that you can rotate:

\`\`\`json
{
  "surfaceUpdate": {
    "components": [
      {
        "id": "cube-scene",
        "component": {
          "ThreeScene": {
            "data": {
              "camera": {
                "type": "perspective",
                "position": { "x": 5, "y": 5, "z": 5 },
                "fov": 75
              },
              "lights": [
                {
                  "type": "ambient",
                  "color": 0xffffff,
                  "intensity": 0.5
                },
                {
                  "type": "directional",
                  "color": 0xffffff,
                  "intensity": 0.8,
                  "position": { "x": 10, "y": 10, "z": 10 }
                }
              ],
              "background": 0x111111,
              "objects": [
                {
                  "type": "box",
                  "position": { "x": 0, "y": 0, "z": 0 },
                  "color": 0xff0000,
                  "scale": 1
                }
              ]
            },
            "options": {
              "height": 500,
              "enableControls": true,
              "gridHelper": true,
              "axesHelper": true
            }
          }
        }
      }
    ]
  }
}
\`\`\`

This creates an interactive 3D scene with a red cube. You can drag to rotate the view and scroll to zoom.

## Error Handling

If you cannot fulfill a request:
- Explain why (unclear request, missing data, etc.)
- Ask clarifying questions
- Suggest alternatives

Remember: Always generate valid A2UI JSON wrapped in markdown code fences!`;
}

/**
 * POST /api/a2ui-chat
 *
 * Handles A2UI chat requests with streaming support.
 * Generates A2UI component specifications based on user input.
 *
 * Request Body:
 * - messages: Array of message objects with role and content
 * - temperature: Optional temperature for generation (default: 0.7)
 * - maxTokens: Optional max tokens (default: 4000)
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, temperature = 0.7, maxTokens = 4000 } = await req.json();

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "'messages' array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use Zhipu provider from env
    const zhipu = createZhipu({
      baseURL: process.env.ZHIPU_BASE_URL,
      apiKey: process.env.ZHIPU_API_KEY,
    });
    const modelName = process.env.ZHIPU_MODEL || "glm-4-flash";

    // Generate A2UI system prompt with catalog
    const systemPrompt = getA2UISystemPrompt();

    // Stream the response
    const result = streamText({
      model: zhipu(modelName),
      system: systemPrompt,
      messages,
      temperature,
      maxOutputTokens: maxTokens,
      onError: ({ error }) => {
        console.error("[A2UI Chat] Streaming error:", error);
      },
    });

    return result.toTextStreamResponse();

  } catch (error) {
    console.error("[A2UI Chat] API error:", error);

    // Handle specific error types
    if (error instanceof Error) {
      // API key errors
      if (error.message.includes("API key") || error.message.includes("authentication")) {
        return new Response(
          JSON.stringify({ error: "Authentication failed. Please check your API key configuration." }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }

      // Network errors
      if (error.message.includes("fetch") || error.message.includes("network")) {
        return new Response(
          JSON.stringify({ error: "Network error. Please check your connection and try again." }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      }

      // Rate limiting
      if (error.message.includes("rate limit") || error.message.includes("429")) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Generic error
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
