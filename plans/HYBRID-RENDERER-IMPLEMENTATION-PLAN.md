# Hybrid Renderer Implementation Plan

**Project:** Unified JSX + A2UI Rendering System
**Date:** 2026-02-10
**Status:** Ready for Implementation
**Lead:** Full-Stack Dev Team Orchestrator
**Timeline:** 9-13 hours (can run in parallel with component additions)

---

## 📋 Executive Summary

### Problem
17 specialized A2UI components (Charts, Phaser, Calendar, Maps, etc.) don't render in main chat because they're not registered in the JSX parser's component bindings.

### Solution
Build a hybrid renderer that intelligently routes components to the appropriate rendering system:
- **Simple UI components** → JSX parser (existing `react-jsx-parser`)
- **Specialized components** → A2UI renderer (existing A2UI system)
- **Single unified interface** → Main chat at `/`

### Key Decisions
✅ **Automatic format selection** - AI chooses based on component complexity
✅ **Inline error display** - With collapsible technical details
✅ **Zero migration** - Backwards compatible with existing JSX-only messages
✅ **Explicit AI training** - Clear rules + concrete examples in system prompt

---

## 🎯 Goals & Success Criteria

### Must Have
- [ ] All 17 specialized components render correctly in main chat
- [ ] Existing JSX components continue to work (zero regressions)
- [ ] Mixed JSX + A2UI responses render in correct order
- [ ] Clear error messages for both JSX parse errors and A2UI validation errors
- [ ] Streaming works for both formats

### Should Have
- [ ] Error boundaries prevent one bad component from breaking entire message
- [ ] Performance: No noticeable lag with mixed content
- [ ] Accessibility: Keyboard navigation and screen reader support
- [ ] Mobile responsive rendering

### Nice to Have
- [ ] Debug mode: Toggle to show raw JSX/JSON
- [ ] Component preview before full render
- [ ] Analytics: Track format usage patterns

---

## 🏗️ Architecture Overview

### Current State
```
AI Response (JSX strings only)
    ↓
extractJSXFromMarkdown() — regex: /```tsx\n(.*?)```/
    ↓
<JSXPreview> — react-jsx-parser
    ↓
componentBindings lookup (50+ simple components)
    ↓
Rendered Components (Button, Card, Input only)
```

### Target State
```
AI Response (Mixed JSX strings + A2UI JSON)
    ↓
┌─────────────────────────────────────────┐
│ Enhanced Response Parser                │
│ - extractJSXFromMarkdown()              │
│ - extractA2UIFromMarkdown()             │
│ - Returns: ContentBlock[]               │
└─────────────────────────────────────────┘
    ↓
    ContentBlock[] = [
      { type: 'text', content: '...' },
      { type: 'jsx', code: '<Button>...' },
      { type: 'text', content: '...' },
      { type: 'a2ui', spec: { surfaceUpdate: {...} } }
    ]
    ↓
┌─────────────────────────────────────────┐
│ <HybridRenderer>                        │
│ Maps over ContentBlock[]                │
└─────────────────────────────────────────┘
    ↓                              ↓
┌──────────────────┐   ┌──────────────────────┐
│ <JSXPreview>     │   │ <A2UIRenderer>       │
│ (existing)       │   │ (existing)           │
│ - componentBinds │   │ - Zod validation     │
└──────────────────┘   └──────────────────────┘
    ↓                              ↓
Rendered Components (ALL types)
```

---

## 📦 Phase Breakdown

### Phase 1: Frontend - Hybrid Rendering (4-6 hours)
**Agents:** fullstack-frontend-dev
**Dependencies:** None - can start immediately
**Deliverables:** 3 new/modified files

### Phase 2: Backend - AI Prompt Engineering (2-3 hours)
**Agents:** fullstack-backend-dev
**Dependencies:** None - can run in parallel with Phase 1
**Deliverables:** 1 modified file (system prompt)

### Phase 3: Integration & Testing (1-2 hours)
**Agents:** fullstack-frontend-dev (coordinator)
**Dependencies:** Phase 1 + 2 complete
**Deliverables:** Integrated system, smoke tests

### Phase 4: QA & Validation (3-4 hours)
**Agents:** fullstack-qa-engineer
**Dependencies:** Phase 3 complete
**Deliverables:** Test results, bug reports, validation matrix

### Phase 5: Deployment & Documentation (1 hour)
**Agents:** fullstack-devops-engineer
**Dependencies:** Phase 4 complete
**Deliverables:** Deployment checklist, updated docs

---

## 🔧 Detailed Task Breakdown

---

## PHASE 1: Frontend Implementation

### Task 1.1: Enhanced Response Parser

**File:** `components/ai-elements/generative-message.tsx`
**Owner:** fullstack-frontend-dev
**Estimated Time:** 1-2 hours
**Status:** Ready to start

#### Current Code (Lines 1-50)
```typescript
// Existing function
function extractJSXFromMarkdown(content: string) {
  const codeBlockRegex = /```(?:jsx|tsx)\s*\n([\s\S]*?)```/gi;
  const matches = Array.from(content.matchAll(codeBlockRegex));

  const jsxBlocks = matches.map((match, index) => ({
    id: `jsx-${index}`,
    code: match[1].trim(),
    language: 'tsx',
  }));

  return jsxBlocks;
}
```

#### New Code to Add
```typescript
// Add new type definitions
export type ContentBlock =
  | { type: 'text'; content: string; id: string }
  | { type: 'jsx'; code: string; id: string }
  | { type: 'a2ui'; spec: A2UIMessage; id: string };

// Add new extraction function
function extractA2UIFromMarkdown(content: string): Array<{ index: number; spec: A2UIMessage }> {
  const codeBlockRegex = /```json\s*\n([\s\S]*?)```/gi;
  const matches = Array.from(content.matchAll(codeBlockRegex));

  const a2uiBlocks: Array<{ index: number; spec: A2UIMessage }> = [];

  matches.forEach((match, index) => {
    try {
      const jsonStr = match[1].trim();
      const parsed = JSON.parse(jsonStr);

      // Validate it's an A2UI message (has surfaceUpdate)
      if (parsed.surfaceUpdate && parsed.surfaceUpdate.components) {
        a2uiBlocks.push({
          index: match.index || 0,
          spec: parsed as A2UIMessage
        });
      }
    } catch (error) {
      // Invalid JSON - will be handled by error boundary
      console.warn('[A2UI Parser] Invalid JSON in code block:', error);
    }
  });

  return a2uiBlocks;
}

// Add unified parser that extracts BOTH formats
function parseMessageContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let currentIndex = 0;

  // Find all code blocks (both tsx and json)
  const allBlocksRegex = /```(jsx|tsx|json)\s*\n([\s\S]*?)```/gi;
  const matches = Array.from(content.matchAll(allBlocksRegex));

  matches.forEach((match, index) => {
    const blockStart = match.index || 0;
    const blockEnd = blockStart + match[0].length;
    const language = match[1];
    const code = match[2].trim();

    // Add text before this code block
    if (blockStart > currentIndex) {
      const textContent = content.slice(currentIndex, blockStart).trim();
      if (textContent) {
        blocks.push({
          type: 'text',
          content: textContent,
          id: `text-${blocks.length}`
        });
      }
    }

    // Add the code block
    if (language === 'jsx' || language === 'tsx') {
      blocks.push({
        type: 'jsx',
        code: code,
        id: `jsx-${index}`
      });
    } else if (language === 'json') {
      try {
        const parsed = JSON.parse(code);
        if (parsed.surfaceUpdate && parsed.surfaceUpdate.components) {
          blocks.push({
            type: 'a2ui',
            spec: parsed as A2UIMessage,
            id: `a2ui-${index}`
          });
        } else {
          // Not an A2UI message, treat as text
          blocks.push({
            type: 'text',
            content: match[0], // Include the code block markers
            id: `text-${blocks.length}`
          });
        }
      } catch (error) {
        // Invalid JSON, treat as text
        blocks.push({
          type: 'text',
          content: match[0],
          id: `text-${blocks.length}`
        });
      }
    }

    currentIndex = blockEnd;
  });

  // Add remaining text after last code block
  if (currentIndex < content.length) {
    const textContent = content.slice(currentIndex).trim();
    if (textContent) {
      blocks.push({
        type: 'text',
        content: textContent,
        id: `text-${blocks.length}`
      });
    }
  }

  return blocks;
}
```

#### Update GenerativeMessage Component
```typescript
// Before (existing)
export function GenerativeMessage({ message, components }: GenerativeMessageProps) {
  const jsxBlocks = extractJSXFromMarkdown(message.content);

  return (
    <div className="space-y-4">
      {jsxBlocks.map(block => (
        <JSXPreview key={block.id} code={block.code} components={components} />
      ))}
    </div>
  );
}

// After (new)
export function GenerativeMessage({ message, components }: GenerativeMessageProps) {
  const contentBlocks = parseMessageContent(message.content);

  return (
    <div className="space-y-4">
      <HybridRenderer blocks={contentBlocks} jsxComponents={components} />
    </div>
  );
}
```

#### Acceptance Criteria
- [ ] `parseMessageContent()` correctly identifies JSX blocks (```tsx)
- [ ] `parseMessageContent()` correctly identifies A2UI blocks (```json with surfaceUpdate)
- [ ] Text content between code blocks is preserved
- [ ] Block order matches original message order
- [ ] Invalid JSON blocks are treated as text (don't crash)
- [ ] Empty content returns empty array
- [ ] Unit tests pass for all edge cases

---

### Task 1.2: Hybrid Renderer Component

**File:** `components/ai-elements/hybrid-renderer.tsx` (NEW FILE)
**Owner:** fullstack-frontend-dev
**Estimated Time:** 2-3 hours
**Status:** Blocked by Task 1.1

#### Create New File
```typescript
"use client";

import { JSXPreview } from './jsx-preview';
import { A2UIRenderer } from '@/lib/a2ui/renderer';
import { Streamdown } from './streamdown';
import type { ComponentRegistry } from './jsx-preview';
import type { A2UIMessage } from '@/lib/a2ui/types';

export type ContentBlock =
  | { type: 'text'; content: string; id: string }
  | { type: 'jsx'; code: string; id: string }
  | { type: 'a2ui'; spec: A2UIMessage; id: string };

interface HybridRendererProps {
  blocks: ContentBlock[];
  jsxComponents: ComponentRegistry;
}

/**
 * Hybrid Renderer - Renders mixed JSX and A2UI content blocks
 *
 * This component intelligently routes different content types to
 * their appropriate renderers:
 * - Text blocks → Streamdown (markdown)
 * - JSX blocks → JSXPreview (react-jsx-parser)
 * - A2UI blocks → A2UIRenderer (Zod validation + specialized rendering)
 *
 * Preserves the original order from the AI response.
 */
export function HybridRenderer({ blocks, jsxComponents }: HybridRendererProps) {
  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => {
        switch (block.type) {
          case 'text':
            return (
              <div key={block.id} className="prose prose-sm max-w-none dark:prose-invert">
                <Streamdown content={block.content} />
              </div>
            );

          case 'jsx':
            return (
              <div key={block.id} className="not-prose">
                <JSXPreview
                  code={block.code}
                  components={jsxComponents}
                />
              </div>
            );

          case 'a2ui':
            return (
              <div key={block.id} className="not-prose">
                <A2UIRenderer message={block.spec} />
              </div>
            );

          default:
            // TypeScript exhaustiveness check
            const _exhaustive: never = block;
            return null;
        }
      })}
    </div>
  );
}

/**
 * HybridRendererError - Error boundary for hybrid rendering
 * Prevents one bad block from breaking the entire message
 */
export function HybridRendererError({ error }: { error: Error }) {
  return (
    <div className="border border-destructive/50 bg-destructive/10 rounded-md p-4 my-2">
      <div className="flex items-start gap-2">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-destructive">
            Failed to render content block
          </p>
          <p className="text-sm text-destructive/80 mt-1">
            {error.message}
          </p>
          <details className="mt-2">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:underline">
              Show technical details
            </summary>
            <pre className="mt-2 text-xs bg-muted p-2 rounded overflow-auto max-h-40">
              {error.stack}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}
```

#### Import Dependencies
```typescript
// Add to imports in app/page.tsx
import { HybridRenderer } from '@/components/ai-elements/hybrid-renderer';
import { A2UIRenderer } from '@/lib/a2ui/renderer';
import type { A2UIMessage } from '@/lib/a2ui/types';
```

#### Acceptance Criteria
- [ ] Component renders text blocks as markdown
- [ ] Component renders JSX blocks via JSXPreview
- [ ] Component renders A2UI blocks via A2UIRenderer
- [ ] Block order is preserved
- [ ] Error boundary catches rendering errors per block
- [ ] Styling is consistent with existing message design
- [ ] Component is accessible (keyboard nav, ARIA)

---

### Task 1.3: Main Chat Integration

**File:** `app/page.tsx`
**Owner:** fullstack-frontend-dev
**Estimated Time:** 1 hour
**Status:** Blocked by Task 1.2

#### Changes to Message Rendering (Lines 287-301)

**Before:**
```typescript
{messages.map((message) => (
  <Message
    key={message.id}
    role={message.role}
    content={message.content}
  >
    {message.jsx && (
      <GenerativeMessage
        message={message}
        components={componentBindings}
      />
    )}
  </Message>
))}
```

**After:**
```typescript
{messages.map((message) => (
  <Message
    key={message.id}
    role={message.role}
    content={message.content}
  >
    {message.role === 'assistant' && (
      <GenerativeMessage
        message={message}
        components={componentBindings}
      />
    )}
  </Message>
))}
```

**Note:** The `GenerativeMessage` component now handles parsing internally using `parseMessageContent()`, so we don't need to check for `message.jsx` anymore. All assistant messages go through the hybrid renderer.

#### No Changes Needed
- `componentBindings` registry stays the same (lines 66-133)
- Keep existing imports for simple UI components
- No changes to message submission logic

#### Acceptance Criteria
- [ ] Main chat renders mixed JSX + A2UI messages
- [ ] Existing JSX-only messages still work
- [ ] No regressions in simple UI component rendering
- [ ] Streaming updates work correctly
- [ ] Error states display inline

---

## PHASE 2: Backend Implementation

### Task 2.1: Enhanced System Prompt

**File:** `app/api/chat/route.ts`
**Owner:** fullstack-backend-dev
**Estimated Time:** 2-3 hours
**Status:** Ready to start (parallel with Phase 1)

#### Current System Prompt (Lines 10-145)
The current prompt instructs AI to use JSX for all components.

#### New System Prompt Addition
Add this section AFTER the component library description, BEFORE the examples:

```typescript
const systemPrompt = `You are an expert UI designer and developer...

[Existing component library description...]

## 🎨 Component Rendering Formats

You can render UI components in TWO formats. Choose the appropriate format based on component complexity:

### 📝 Format 1: JSX (for Simple UI Components)

**When to use:**
- Single components without complex nested structure
- Standard UI elements (buttons, inputs, cards, layouts)
- Components with simple props and children

**Components that use JSX:**
Button, Card, Input, Select, Textarea, Checkbox, Switch, Badge, Avatar,
Label, Separator, Tabs, Accordion, Alert, Dialog, Popover, Tooltip,
DropdownMenu, Command, Progress, Skeleton, all Typography components,
all Layout components (Flex, Grid, Stack, etc.)

**Example - Simple Button:**
\`\`\`tsx
<Button variant="primary" size="lg">
  Click me
</Button>
\`\`\`

**Example - Card with Form:**
\`\`\`tsx
<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Login</CardTitle>
    <CardDescription>Enter your credentials</CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" />
      </div>
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  </CardContent>
</Card>
\`\`\`

---

### 📊 Format 2: A2UI JSON (for Specialized Components)

**When to use:**
- Complex components with multiple sub-components and configuration
- Data visualization components (charts, maps, timelines)
- Interactive/specialized components (games, 3D scenes, editors)
- Components with \`data\` and \`options\` props that have nested structures

**Components that use A2UI JSON:**
Charts (18 types), Calendar, Phaser, Timeline, Maps, Geospatial, ThreeScene,
SVGPreview, NodeEditor, KnowledgeGraph, Latex, ModelViewer, Mermaid,
Remotion, WYSIWYG, VRM, ToolUI

**Example - Line Chart:**
\`\`\`json
{
  "surfaceUpdate": {
    "components": [{
      "id": "chart-1",
      "component": {
        "Charts": {
          "data": {
            "type": "line",
            "series": [{
              "name": "Revenue",
              "data": [
                { "x": "Jan", "y": 1000 },
                { "x": "Feb", "y": 1200 },
                { "x": "Mar", "y": 1500 },
                { "x": "Apr", "y": 1400 },
                { "x": "May", "y": 1800 }
              ],
              "color": "#3b82f6"
            }],
            "title": "Monthly Revenue"
          },
          "options": {
            "height": 400,
            "showLegend": true,
            "animated": true
          }
        }
      }
    }]
  }
}
\`\`\`

**Example - Candlestick Chart (Financial):**
\`\`\`json
{
  "surfaceUpdate": {
    "components": [{
      "id": "bitcoin-chart",
      "component": {
        "Charts": {
          "data": {
            "type": "candlestick",
            "series": [{
              "name": "Bitcoin (BTC/USD)",
              "data": [
                { "x": "2024-01-15", "y": [42000, 43500, 41800, 43200] },
                { "x": "2024-01-16", "y": [43200, 44100, 42800, 43900] },
                { "x": "2024-01-17", "y": [43900, 44500, 43500, 44200] }
              ],
              "color": "#f7931a"
            }],
            "title": "Bitcoin Price Chart"
          },
          "options": {
            "height": 500,
            "showLegend": true
          }
        }
      }
    }]
  }
}
\`\`\`

**Example - Calendar with Events:**
\`\`\`json
{
  "surfaceUpdate": {
    "components": [{
      "id": "team-calendar",
      "component": {
        "Calendar": {
          "data": {
            "events": [
              {
                "id": "1",
                "title": "Team Meeting",
                "start": "2024-02-10T10:00:00",
                "end": "2024-02-10T11:00:00",
                "color": "#3b82f6"
              },
              {
                "id": "2",
                "title": "Project Deadline",
                "start": "2024-02-15T17:00:00",
                "allDay": true,
                "color": "#ef4444"
              }
            ],
            "defaultView": "month"
          },
          "options": {
            "height": 600
          }
        }
      }
    }]
  }
}
\`\`\`

**Example - Phaser Game:**
\`\`\`json
{
  "surfaceUpdate": {
    "components": [{
      "id": "snake-game",
      "component": {
        "Phaser": {
          "data": {
            "gameType": "snake",
            "width": 800,
            "height": 600,
            "physics": {
              "default": "arcade",
              "arcade": {
                "gravity": { "y": 0 }
              }
            }
          },
          "options": {
            "backgroundColor": "#000000"
          }
        }
      }
    }]
  }
}
\`\`\`

---

### 🔄 Format 3: Mixed (Both in Same Response)

You can use BOTH JSX and A2UI JSON in a single response. This is useful when combining simple UI with complex components:

**Example - Dashboard with Button and Chart:**

I'll create a dashboard with a download button and a revenue chart.

\`\`\`tsx
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-bold">Revenue Dashboard</h2>
    <Button variant="outline" size="sm">
      <DownloadIcon className="mr-2 h-4 w-4" />
      Download Report
    </Button>
  </div>
</div>
\`\`\`

Here's the revenue chart:

\`\`\`json
{
  "surfaceUpdate": {
    "components": [{
      "id": "revenue-chart",
      "component": {
        "Charts": {
          "data": {
            "type": "bar",
            "series": [{
              "name": "Q1 Revenue",
              "data": [
                { "x": "Jan", "y": 45000 },
                { "x": "Feb", "y": 52000 },
                { "x": "Mar", "y": 61000 }
              ]
            }],
            "title": "Quarterly Revenue"
          },
          "options": {
            "height": 400
          }
        }
      }
    }]
  }
}
\`\`\`

---

## 📖 Quick Reference: Format Selection

| Component Type | Format | Reason |
|----------------|--------|--------|
| Button, Input, Card, Select | JSX | Simple props, no complex data |
| Charts (line, bar, pie, etc.) | A2UI JSON | Complex \`data\` + \`options\` props |
| Calendar | A2UI JSON | Events array, view config |
| Phaser games | A2UI JSON | Scene setup, physics config |
| 3D (ThreeScene, VRM, ModelViewer) | A2UI JSON | Camera, lights, models |
| Maps, Geospatial | A2UI JSON | Markers, layers, coordinates |
| Timeline | A2UI JSON | Events with dates |
| Forms, Layouts, Typography | JSX | Simple composition |

**Rule of Thumb:**
- If the component has complex \`data\` and \`options\` props with deeply nested objects/arrays → **Use A2UI JSON**
- If the component just has simple props and children → **Use JSX**
- When in doubt, check the examples above

---

${getCatalogPrompt()}

[Rest of existing prompt...]
`;
```

#### Update getCatalogPrompt() Call
The catalog prompt should already include all A2UI components. Verify it includes examples for:
- Charts (all 18 types)
- Calendar
- Phaser
- Timeline
- Maps/Geospatial
- Other specialized components

#### Acceptance Criteria
- [ ] System prompt clearly explains when to use JSX vs A2UI
- [ ] Multiple examples provided for each format
- [ ] Mixed format example shows both in same response
- [ ] Quick reference table for edge cases
- [ ] Catalog prompt includes all specialized components
- [ ] AI output quality improves (correct format selection)

---

## PHASE 3: Integration & Smoke Testing

### Task 3.1: Integration Testing

**Owner:** fullstack-frontend-dev (coordinator)
**Estimated Time:** 1-2 hours
**Status:** Blocked by Phase 1 + 2

#### Smoke Tests
1. **Test JSX-only message** (backwards compatibility)
   - Send prompt: "Create a blue button that says Click Me"
   - Expected: AI generates JSX, renders via JSXPreview
   - Verify: Button renders correctly

2. **Test A2UI-only message**
   - Send prompt: "Show me a line chart of monthly revenue: Jan 1000, Feb 1200, Mar 1500"
   - Expected: AI generates A2UI JSON, renders via A2UIRenderer
   - Verify: Chart renders correctly with amCharts

3. **Test mixed message**
   - Send prompt: "Create a dashboard with a Download button and a bar chart showing Q1 sales"
   - Expected: AI generates both JSX and A2UI JSON
   - Verify: Both render in correct order

4. **Test error handling**
   - Manually create message with invalid JSON
   - Expected: Error boundary shows inline error message
   - Verify: Rest of message still renders

#### Acceptance Criteria
- [ ] All 4 smoke tests pass
- [ ] No console errors
- [ ] Streaming works correctly
- [ ] Error boundaries catch failures

---

## PHASE 4: QA & Validation

### Task 4.1: Component Coverage Testing

**Owner:** fullstack-qa-engineer
**Estimated Time:** 2 hours
**Status:** Blocked by Phase 3

#### Test Matrix: Specialized Components (Priority Phase 1)

| Component | Test Prompt | Expected Format | Pass/Fail |
|-----------|-------------|-----------------|-----------|
| **Charts** | "Show Bitcoin candlestick chart" | A2UI JSON | [ ] |
| **Phaser** | "Create a simple snake game" | A2UI JSON | [ ] |
| **Calendar** | "Show calendar with team meetings" | A2UI JSON | [ ] |
| **Maps** | "Display map with coffee shop markers" | A2UI JSON | [ ] |

#### Test Cases Per Component
For each component, test:
1. **Basic rendering** - Component displays correctly
2. **Data validation** - Zod schema validates props
3. **Sub-components** - All sub-components render (Header, Content, etc.)
4. **Interactivity** - User interactions work (click, hover, etc.)
5. **Error states** - Invalid data shows clear error message
6. **Mobile responsive** - Renders correctly on mobile viewport

#### Acceptance Criteria
- [ ] All Phase 1 components (Charts, Phaser, Calendar, Maps) pass all 6 test cases
- [ ] Test results documented in validation matrix
- [ ] Bugs filed for failures with reproduction steps

---

### Task 4.2: Error Handling & Edge Cases

**Owner:** fullstack-qa-engineer
**Estimated Time:** 1 hour
**Status:** Blocked by Task 4.1

#### Edge Case Tests

**1. Invalid JSON**
```markdown
User: "Show me a chart"
AI Response:
```json
{ invalid json here
```

Expected: Error boundary shows "Invalid JSON syntax" with collapsible details

**2. Valid JSON, Invalid A2UI Structure**
```json
{ "notA2UI": true }
```
Expected: Treated as text block (not an error)

**3. Valid A2UI, Invalid Component Data**
```json
{
  "surfaceUpdate": {
    "components": [{
      "id": "chart-1",
      "component": {
        "Charts": {
          "data": {
            "type": "invalidType"
          }
        }
      }
    }]
  }
}
```
Expected: Zod validation error shows inline with clear message

**4. Streaming Incomplete JSON**
```json
{
  "surfaceUpdate": {
    "components": [{
```
Expected: No render until complete, or show loading state

**5. Mixed Valid + Invalid**
Valid JSX + Invalid A2UI JSON in same message
Expected: JSX renders, A2UI shows error, message not broken

#### Acceptance Criteria
- [ ] All 5 edge cases handled gracefully
- [ ] Error messages are user-friendly
- [ ] Technical details available in collapsible section
- [ ] No app crashes or blank screens

---

### Task 4.3: Performance & Accessibility

**Owner:** fullstack-qa-engineer
**Estimated Time:** 1 hour
**Status:** Blocked by Task 4.2

#### Performance Tests
1. **Large message** - 10 JSX blocks + 5 A2UI blocks
   - Measure: Time to render
   - Target: < 1 second

2. **Streaming performance** - Long response with mixed content
   - Measure: Frames per second during streaming
   - Target: No jank, smooth updates

3. **Memory leaks** - Navigate away from chat, check memory
   - Measure: Memory usage before/after
   - Target: Proper cleanup (no retained components)

#### Accessibility Tests
1. **Keyboard navigation**
   - Tab through all components
   - Verify: Focus indicators, logical tab order

2. **Screen reader**
   - Test with NVDA/VoiceOver
   - Verify: All content announced, component roles correct

3. **Color contrast**
   - Check error messages
   - Verify: WCAG AA compliance (4.5:1 ratio)

#### Acceptance Criteria
- [ ] All performance targets met
- [ ] No memory leaks detected
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility verified
- [ ] Color contrast passes WCAG AA

---

## PHASE 5: Deployment & Documentation

### Task 5.1: Deployment Checklist

**Owner:** fullstack-devops-engineer
**Estimated Time:** 30 minutes
**Status:** Blocked by Phase 4

#### Pre-Deployment
- [ ] All QA tests pass (Phase 4 complete)
- [ ] No high-severity bugs outstanding
- [ ] Code reviewed by at least 1 team member
- [ ] Bundle size check (no significant increase)
- [ ] Environment variables verified (no new vars needed)

#### Deployment Steps
1. Merge feature branch to `components` branch
2. Run production build: `npm run build`
3. Verify build succeeds with no errors
4. Deploy to staging environment
5. Smoke test on staging
6. Deploy to production
7. Monitor error logs for 1 hour

#### Rollback Plan
If critical issues found post-deployment:
1. Revert merge commit
2. Redeploy previous version
3. File bugs for issues
4. Fix and redeploy when ready

#### Acceptance Criteria
- [ ] Deployment completes successfully
- [ ] No production errors in first hour
- [ ] Rollback plan documented and tested

---

### Task 5.2: Documentation Updates

**Owner:** fullstack-frontend-dev
**Estimated Time:** 30 minutes
**Status:** Blocked by Task 5.1

#### Files to Update

**1. README.md**
Add section explaining hybrid rendering:
```markdown
## Hybrid Rendering System

This v0-clone supports two component rendering formats:

### JSX Format (Simple Components)
For standard UI components like buttons, inputs, cards:
```tsx
<Button variant="primary">Click me</Button>
```

### A2UI JSON Format (Specialized Components)
For complex components like charts, games, calendars:
```json
{
  "surfaceUpdate": {
    "components": [{
      "id": "chart-1",
      "component": {
        "Charts": { /* ... */ }
      }
    }]
  }
}
```

The AI automatically chooses the appropriate format based on component complexity.
```

**2. STATE.md**
Update with:
- New hybrid renderer architecture
- List of files modified
- Testing results summary
- Known limitations

**3. Create HYBRID-RENDERER-GUIDE.md** (For Developers)
- How the hybrid renderer works
- How to add new specialized components
- Troubleshooting guide
- Examples for both formats

#### Acceptance Criteria
- [ ] README.md updated with hybrid rendering section
- [ ] STATE.md reflects current architecture
- [ ] Developer guide created
- [ ] All docs reviewed for accuracy

---

## 📊 Testing Strategy

### Component Testing Priority (4 Phases)

#### Phase 1: User-Reported + High Usage (Test First)
1. ✅ Charts - 18 chart types, user reported issue
2. ✅ Phaser - Games, user reported issue
3. ✅ Calendar - Recently added, should work out of box
4. ✅ Maps/Geospatial - Common use case, straightforward

#### Phase 2: Medium Complexity (Test Second)
5. Timeline - Event timelines
6. WYSIWYG - Rich text editor
7. Mermaid - Diagram generation
8. Latex - Math equations

#### Phase 3: Complex/Heavy (Test Third)
9. ThreeScene - 3D rendering, performance intensive
10. Remotion - Video generation
11. VRM - 3D avatars
12. ModelViewer - 3D model viewer

#### Phase 4: Specialized/Edge Cases (Test Last)
13. NodeEditor - Visual programming
14. KnowledgeGraph - Graph visualization
15. SVGPreview - SVG rendering
16. ToolUI - 18 sub-components

### Testing Approach
- **Phase 1 components:** Full test coverage (all 6 test cases)
- **Phase 2-4 components:** Basic rendering + error handling only
- **If Phase 1 passes:** Proceed with caution to Phase 2-4
- **If Phase 1 fails:** Fix issues before continuing

---

## 🔗 Integration Points & Coordination

### Frontend ↔ Backend Coordination

**Shared Understanding:**
- Both teams need to agree on A2UI message structure
- System prompt examples should match frontend expectations
- Error messages should be consistent

**Sync Points:**
1. **After Phase 1 Task 1.1:** Frontend shares `ContentBlock` type definition
2. **After Phase 2 Task 2.1:** Backend shares system prompt examples
3. **Before Phase 3:** Both teams review integration plan

### Avoid Conflicts With Component Team

**While component team adds new components:**
- They add to `lib/a2ui/components.ts` (specialized or adapters)
- They add to `lib/a2ui/catalog.ts` (examples for AI)
- They add schemas to `lib/schemas/`

**This work adds:**
- New parser in `components/ai-elements/generative-message.tsx`
- New renderer in `components/ai-elements/hybrid-renderer.tsx`
- Updates to `app/page.tsx` (message rendering)
- Updates to `app/api/chat/route.ts` (system prompt)

**Zero conflicts expected** - Different files being modified.

**Communication:**
- Notify component team when hybrid renderer is live
- New components will automatically work via A2UI renderer
- No action needed from component team

---

## ⚠️ Risk Mitigation

### Risk 1: Breaking Existing JSX Components
**Likelihood:** Medium
**Impact:** High
**Mitigation:**
- Extensive regression testing in Phase 4
- Keep `componentBindings` unchanged
- Backwards compatibility is Must Have criteria
- Rollback plan ready

### Risk 2: AI Doesn't Learn New Format
**Likelihood:** Low-Medium
**Impact:** High
**Mitigation:**
- Provide many concrete examples in system prompt
- Use explicit rules (not just examples)
- Monitor AI responses in first week
- Iterate on prompt if needed

### Risk 3: Performance Degradation
**Likelihood:** Low
**Impact:** Medium
**Mitigation:**
- Benchmark before/after in Phase 4
- A2UI renderer already optimized
- Parsing overhead is minimal
- Monitor production metrics

### Risk 4: Complex Error Debugging
**Likelihood:** Medium
**Impact:** Low
**Mitigation:**
- Comprehensive error boundaries
- Collapsible technical details
- Clear error categories (JSX parse, A2UI validation, etc.)
- Debug mode for developers

---

## 📈 Success Metrics

### Technical Metrics
- **Component Coverage:** 17/17 specialized components working (100%)
- **Regression Rate:** 0 broken existing JSX components
- **Error Rate:** < 5% of messages have rendering errors
- **Performance:** < 100ms additional parsing overhead
- **Bundle Size:** < 10KB increase

### User Experience Metrics
- **Format Accuracy:** AI chooses correct format > 90% of time
- **Error Clarity:** Users can understand error messages without dev knowledge
- **Backwards Compatibility:** Old conversations load without issues

### Development Metrics
- **Implementation Time:** 9-13 hours (within estimate)
- **Bug Count:** < 10 bugs found in QA
- **Code Review:** All changes approved by team

---

## 🚀 Rollout Plan

### Week 1: Implementation (This Plan)
- Day 1-2: Phase 1 + 2 (Frontend + Backend in parallel)
- Day 2: Phase 3 (Integration)
- Day 3: Phase 4 (QA)
- Day 3: Phase 5 (Deployment)

### Week 2: Monitoring & Iteration
- Monitor error logs
- Gather user feedback
- Track AI format selection accuracy
- Fix any P0/P1 bugs

### Week 3: Phase 2-4 Component Testing
- Test remaining 13 specialized components
- Document any issues
- Expand system prompt examples if needed

### Week 4: Polish & Documentation
- Add debug mode (show raw JSON/JSX)
- Create video tutorial for users
- Write blog post about hybrid rendering

---

## 📞 Communication Plan

### Internal Team Communication
**Daily Standups:**
- What was completed yesterday
- What's being worked on today
- Any blockers

**Status Updates:**
- Post in team channel after each phase completes
- Share test results from QA
- Alert team immediately if critical issues found

### External Communication (Component Team)
**Before starting:**
- Notify that hybrid renderer work is starting
- Share this plan document

**After Phase 3:**
- Demo the working hybrid renderer
- Show how new components automatically work

**After deployment:**
- Announce hybrid renderer is live
- Share developer guide for adding new components

---

## 📚 References & Resources

### Key Files Modified
1. `components/ai-elements/generative-message.tsx` - Enhanced parser
2. `components/ai-elements/hybrid-renderer.tsx` - NEW hybrid renderer
3. `app/page.tsx` - Updated message rendering
4. `app/api/chat/route.ts` - Enhanced system prompt

### Existing Files (No Changes)
- `components/ai-elements/jsx-preview.tsx` - JSX parser (used as-is)
- `lib/a2ui/renderer.tsx` - A2UI renderer (used as-is)
- `lib/a2ui/components.ts` - Component registry (used as-is)
- `app/page.tsx` lines 66-133 - componentBindings (unchanged)

### Related Documentation
- `JSX-RENDERING-PROPOSAL.md` - Full proposal document
- `A2UI-INTEGRATION-SUMMARY.md` - A2UI system overview
- `lib/a2ui/catalog.ts` - A2UI component catalog

### External Resources
- [react-jsx-parser docs](https://github.com/TroyAlford/react-jsx-parser)
- [Zod validation docs](https://zod.dev/)
- [A2UI Protocol Spec](https://google.github.io/automotive-design-compose/reference/protocol/)

---

## ✅ Final Checklist

### Before Starting Implementation
- [ ] This plan reviewed by all team members
- [ ] Questions answered and ambiguities resolved
- [ ] Component team notified of upcoming changes
- [ ] Git branches created (`feature/hybrid-renderer`)

### Before Merging to Main
- [ ] All Must Have success criteria met
- [ ] QA validation complete
- [ ] Code reviewed and approved
- [ ] Documentation updated
- [ ] Deployment checklist complete

### After Deployment
- [ ] Production monitoring active
- [ ] Team notified of completion
- [ ] Post-mortem scheduled (what went well, what to improve)
- [ ] Celebration! 🎉

---

**Document Version:** 1.0
**Last Updated:** 2026-02-10
**Status:** Ready for Implementation
**Next Action:** Share with fullstack dev team, get approval, start Phase 1 + 2 in parallel
