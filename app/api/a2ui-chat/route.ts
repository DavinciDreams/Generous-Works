import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
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

## CRITICAL JSON FORMATTING RULES - FOLLOW EXACTLY

1. **ALWAYS wrap JSON in markdown code fences**: \`\`\`json ... \`\`\`
2. **EVERY key MUST have double quotes**: "key": value
3. **EVERY string value MUST have double quotes**: "value"
4. **EVERY property MUST have a colon**: "key": value (NOT "key" value)
5. **NO missing commas** between properties
6. **NO trailing commas** after last property
7. **ALL numbers are unquoted**: {"x": 5} NOT {"x": "5"}
8. **ALL strings are quoted**: {"type": "box"} NOT {"type": box}
9. Each component must have a unique ID
10. Use exact component names from catalog: Timeline, Maps, ThreeScene

**VALID JSON EXAMPLE:**
\`\`\`json
{
  "surfaceUpdate": {
    "components": [
      {
        "id": "my-scene",
        "component": {
          "ThreeScene": {
            "data": {
              "objects": [
                {
                  "type": "sphere",
                  "color": 0xff0000,
                  "position": {"x": 0, "y": 0, "z": 0}
                }
              ]
            }
          }
        }
      }
    ]
  }
}
\`\`\`

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
    const { messages, temperature = 0.7, maxTokens = 128000 } = await req.json();

    // Validate required fields
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "'messages' array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use ZAI (GLM-4.7) for reliable JSON generation
    const systemPrompt = getA2UISystemPrompt();

    const endpoint = `${process.env.ZHIPU_BASE_URL}/chat/completions`;
    console.log("[A2UI Chat] Endpoint:", endpoint);
    console.log("[A2UI Chat] Model:", process.env.ZHIPU_MODEL);
    console.log("[A2UI Chat] API Key:", process.env.ZHIPU_API_KEY ? "✓ Set" : "✗ Missing");

    const requestBody = {
      model: process.env.ZHIPU_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      temperature,
      max_tokens: maxTokens,
      stream: true,
    };

    console.log("[A2UI Chat] Request body:", JSON.stringify(requestBody, null, 2).substring(0, 500));

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.ZHIPU_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("[A2UI Chat] Response status:", response.status);
    console.log("[A2UI Chat] Response headers:", JSON.stringify(Object.fromEntries(response.headers.entries())));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[A2UI Chat] ZAI error response:", errorText);
      throw new Error(`ZAI API error: ${response.status} - ${errorText}`);
    }

    console.log("[A2UI Chat] ZAI stream started successfully, passing through directly");

    // Pass through ZAI's stream directly - it's already in SSE format
    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

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
