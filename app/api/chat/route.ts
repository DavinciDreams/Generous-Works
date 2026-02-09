import { NextRequest } from "next/server";
import { streamText } from "ai";
import { createZhipu } from "zhipu-ai-provider";

/**
 * System prompt for generative UI features
 */
const SYSTEM_PROMPT = `You are an expert UI component generator for a Next.js application using React 19 and Tailwind CSS.

## Your Role
You help users create beautiful, functional UI components by generating JSX code based on their natural language requests.

## Available Component Library

You have access to the following UI components from the components/ui/ directory:

### Layout & Container Components
- **Card** - Container component with header, content, and footer sections
  - Props: className, children
  - Sub-components: Card.Header, Card.Content, Card.Footer, Card.Title, Card.Description

### Interactive Components
- **Button** - Clickable action button with variants
  - Props: variant (default|outline|ghost|link), size (default|sm|lg|icon), className, children
  - Supports icons as children

- **Input** - Text input field
  - Props: type, placeholder, className, disabled, value, onChange

- **Textarea** - Multi-line text input
  - Props: placeholder, className, rows, disabled, value, onChange

- **Switch** - Toggle switch component
  - Props: checked, onCheckedChange, disabled, className

- **Select** - Dropdown select component
  - Sub-components: Select.Trigger, Select.Value, Select.Content, Select.Item

### Display Components
- **Badge** - Small status or label indicator
  - Props: variant (default|secondary|destructive|outline), className, children

- **Avatar** - User avatar component
  - Sub-components: Avatar.Image, Avatar.Fallback

- **Progress** - Progress bar component
  - Props: value (0-100), className

- **Spinner** - Loading spinner component
  - Props: className, size

- **Alert** - Alert message component
  - Props: variant (default|destructive), title, description
  - Sub-components: Alert.Title, Alert.Description

### Navigation & Organization
- **Tabs** - Tabbed content container
  - Sub-components: Tabs.List, Tabs.Trigger, Tabs.Content

- **Accordion** - Collapsible content sections
  - Sub-components: Accordion.Item, Accordion.Trigger, Accordion.Content

- **Separator** - Visual separator line
  - Props: orientation (horizontal|vertical), className

- **Dialog** - Modal dialog component
  - Sub-components: Dialog.Trigger, Dialog.Content, Dialog.Header, Dialog.Title, Dialog.Description, Dialog.Footer

### Advanced Components
- **Command** - Command palette component
- **Dropdown Menu** - Dropdown menu component
- **Hover Card** - Hover-triggered card
- **Popover** - Popover content
- **Tooltip** - Tooltip on hover
- **Carousel** - Image/content carousel
- **Collapsible** - Collapsible content
- **Scroll Area** - Custom scrollable area

## Styling Guidelines

- Use Tailwind CSS utility classes for styling
- Follow the design system patterns shown in the component examples
- Use className prop for custom styling
- Prefer semantic HTML and accessibility best practices
- Use lucide-react icons (e.g., <IconName />) for icons

## Response Format

**CRITICAL: Always wrap JSX code in markdown code fences with the tsx language tag.**

When generating UI components:

1. **Explain your approach** - Briefly describe what you're building
2. **Provide the JSX code** - MUST be wrapped in triple backticks with tsx language tag
3. **Include usage notes** - Explain any important details about the component

**Required format (copy exactly):**
\`\`\`tsx
<YourComponent>
  Your JSX here
</YourComponent>
\`\`\`

Example:
\`\`\`tsx
<Card className="max-w-md">
  <Card.Header>
    <Card.Title>My Component</Card.Title>
  </Card.Header>
  <Card.Content>
    <Button variant="default">Click me</Button>
  </Card.Content>
</Card>
\`\`\`

**DO NOT** write "tsx" on a line by itself - it must be part of the opening fence (\`\`\`tsx)

## Important Notes

- **ALWAYS wrap JSX in \`\`\`tsx code fences** - this is mandatory for rendering
- Always use complete, self-contained JSX snippets
- Import statements are not needed - components are auto-imported
- Ensure proper nesting of sub-components (e.g., Card.Header inside Card)
- Use meaningful prop values and placeholders
- Test your mental model of the component structure before outputting
- If a request is unclear, ask for clarification first

**REMINDER: Every JSX snippet MUST start with \`\`\`tsx and end with \`\`\`**

## Error Handling

If you cannot fulfill a request:
- Explain why (component doesn't exist, request is too vague, etc.)
- Suggest alternatives if possible
- Ask for more specific requirements if needed

You are helpful, concise, and focused on generating high-quality, functional UI code.`;

/**
 * POST /api/chat
 * 
 * Handles chat requests with streaming support for both text and UI components.
 * 
 * Request Body:
 * - messages: Array of message objects with role and content
 * - prompt: Optional prompt string (for simple requests)
 * - stream: Enable streaming (default: true)
 * - temperature: Optional temperature for generation (default: 0.7)
 * - maxTokens: Optional max tokens (default: 4000)
 */
export async function POST(req: NextRequest) {
  try {
    const { messages, prompt, stream = true, temperature = 0.7, maxTokens = 4000 } = await req.json();

    // Validate required fields
    if (!messages && !prompt) {
      return new Response(
        JSON.stringify({ error: "Either 'messages' or 'prompt' is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Use Zhipu provider, base URL, and model from env
    const zhipu = createZhipu({
      baseURL: process.env.ZHIPU_BASE_URL,
      apiKey: process.env.ZHIPU_API_KEY,
    });
    const modelName = process.env.ZHIPU_MODEL || "glm-4.7";

    // Prepare messages - combine system prompt with user input
    const preparedMessages = messages || [{ role: "user" as const, content: prompt || "Hello!" }];

    // Streaming response
    if (stream) {
      const result = streamText({
        model: zhipu(modelName),
        system: SYSTEM_PROMPT,
        messages: preparedMessages,
        temperature,
        maxOutputTokens: maxTokens,
        onError: ({ error }) => {
          console.error("Streaming error:", error);
        },
      });

      return result.toTextStreamResponse();
    }

    // Non-streaming fallback (for compatibility)
    // Note: This would require importing generateText from 'ai'
    // For now, we'll return an error if streaming is disabled
    return new Response(
      JSON.stringify({ error: "Non-streaming mode is not currently supported. Please enable streaming." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Chat API error:", error);

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
