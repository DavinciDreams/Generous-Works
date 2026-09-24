# A2UI Framework Integration

Complete integration of the a2ui-bridge adapter pattern with the existing A2UI system, enabling total generative UI with **114+ components** across three categories.

## Stream event normalization

`stream-normalizer.ts` is a pure, bounded reducer for A2UI v0.8 JSONL events. It
buffers `surfaceUpdate` components by `surfaceId` and component `id`, maintains a
separate data model for each surface, and marks a surface ready only after a
valid `beginRendering` event identifies a buffered root. Replayed updates are
idempotent when they already describe the current state. An older event replayed
after an intervening update remains a valid state transition instead of being
silently suppressed. Events without a `surfaceId` use the v0.8-compatible
`@default` surface unless the caller supplies another default.

The reducer returns an error alongside the unchanged previous state for malformed
or oversized events. It never renders components, dispatches actions, writes to
storage, or calls an API. Transport code remains responsible for splitting JSONL
into one complete JSON object per call.

Generous historically consumed a single envelope containing a complete
`surfaceUpdate`, with `beginRendering` represented as a boolean or omitted.
`applyA2UICompleteMessage()` preserves that behavior by inferring the root (`root`
when present, otherwise the first component) and render readiness. Normal stream
events use `applyA2UIStreamEvent()` and retain the protocol's buffering semantics.

This slice intentionally targets the repository's v0.8 component shape. A2UI
v0.9 renames and restructures these events, so v0.9 inputs must go through a
separate version adapter rather than being guessed here. Protocol references:
[message reference](https://a2ui.org/reference/messages/) and
[v0.8 protocol](https://github.com/a2ui-project/a2ui/blob/main/specification/v0_8/docs/a2ui_protocol.md).

---

## Current Status

### Completed (All Core Tasks)

- **Adapter Utilities** - Extracted and adapted from a2ui-bridge
- **Component Adapters** - Created adapters for **76/76 standard UI components (100%)**
- **Deduplication** - Mapped components to avoid duplication
- **Catalog System** - Extended catalog with AI Elements, Tool UI, and Standard UI components
- **Hybrid System** - Renders both adapter and composable components
- **Renderer Integration** - `renderer.tsx` updated to use the unified component system

### Next Steps (Optional)

- **Test AI Generation** - Verify all 114+ components work with AI end-to-end
- **AI Elements Adapters** - Programmatic adaptation of 70+ AI element components (optional enhancement)

---

## Architecture

```text
+--------------------------------------------------+
|             A2UI Component System                |
+--------------------------------------------------+
|                                                  |
|  AI Elements - Data Viz & Interactive (38)       |
|  +- Timeline, Maps, ThreeScene, SVGPreview       |
|  +- NodeEditor, KnowledgeGraph, Latex, VRM       |
|  +- ModelViewer, Phaser, Mermaid, Remotion       |
|  +- Geospatial, Charts, WYSIWYG, Calendar        |
|  +- CodeEditor, Markdown, DataTable, JSONViewer  |
|  +- ImageGallery, ToolUI                         |
|  Pattern: Composable (Zod-validated, complex     |
|           internal state + sub-components)       |
|                                                  |
|  Tool UI - Specialized Tools (16)                |
|  +- ApprovalCard, WeatherWidget, StatsDisplay    |
|  +- ProgressTracker, OptionList, QuestionFlow    |
|  +- InstagramPost, LinkedInPost, XPost           |
|  +- LinkPreview, Video, MessageDraft             |
|  +- ItemCarousel, OrderSummary                   |
|  +- ParameterSlider, PreferencesPanel            |
|  Pattern: Composable (same Zod-validated path)   |
|                                                  |
|  Standard UI Adapters (76)                       |
|  +- Layout: Row, Column, Flex, Grid, Card...     |
|  +- Typography: Text, H1-H6, Badge, Label...     |
|  +- Forms: Button, Input, Select, Checkbox...    |
|  +- Feedback: Alert, Progress, Spinner, Toast... |
|  +- Navigation: Tabs, Breadcrumb, Pagination...  |
|  +- Data: List, Table, Skeleton, Image...        |
|  +- Disclosure: Accordion, Dialog, Popover...    |
|  +- Utility: Separator, ScrollArea, AspectRatio  |
|  Pattern: Adapter (maps props to shadcn/ui)      |
|                                                  |
+--------------------------------------------------+
```

---

## How the AI Catalog Works

This is the most important thing to understand before contributing. If you skip this, you will be confused about why adding a component file alone is not enough.

### The catalog is the AI's vocabulary

`lib/a2ui/catalog.ts` (and `catalog-standard-ui.ts` for the Standard UI slice) is a registry that defines every component the AI model is allowed to generate. Each entry looks like this:

```typescript
Charts: {
  type: 'Charts',
  description: `Interactive data visualizations using amCharts 5. Supports line, bar,
    pie, scatter, histogram, heatmap, funnel, gauge, candlestick, and more.`,
  props: ['data', 'options'],
  examples: [chartsExamples]  // array of ComponentExample objects
}
```

The entry has four parts:

- **`type`** — must exactly match the key used in the renderer's `SPECIALIZED_COMPONENTS` set and in the `a2uiComponents` map.
- **`description`** — plain English explanation of what this component does, what variants exist, and any gotchas. This text goes verbatim into the AI system prompt, so write it as if you are instructing the model.
- **`props`** — list of top-level prop names the component accepts. Used in the prompt to tell the AI what fields to populate.
- **`examples`** — one or more `ComponentExample` objects, each containing a real A2UI JSON spec. These are included in the prompt as concrete generation examples. A good example is worth more than a long description.

### getCatalogPrompt() builds the system prompt section

`getCatalogPrompt()` in `catalog.ts` iterates over every entry in `specializedCatalog` and `standardUICatalog`, then assembles a formatted string that looks like:

```text
You can generate interactive UIs using 114 components across two categories:

## SPECIALIZED COMPONENTS (Data Visualization & Interactive)

1. Charts
   Description: Interactive data visualizations using amCharts 5...
   Props: data, options

   Example A2UI spec:
   { "id": "charts-1", "component": { "Charts": { ... } } }

...
```

### The system prompt includes this catalog

In `app/api/chat/route.ts`, `getSystemPrompt()` calls `getCatalogPrompt()` and injects the result directly into the system prompt sent to the model on every request:

```typescript
function getSystemPrompt(): string {
  const catalogPrompt = getCatalogPrompt();
  return `You are an expert UI component generator...

${catalogPrompt}

...`;
}
```

This means the AI knows about a component **only if it has a catalog entry**. A component that exists in the renderer but has no catalog entry is invisible to the model. Conversely, a catalog entry with no renderer registration will generate JSON that the renderer cannot render. Both sides must be kept in sync.

### The data flow end to end

```text
User message
    |
    v
app/api/chat/route.ts
    |  injects getCatalogPrompt() into system prompt
    v
AI model generates A2UI JSON:
    { "surfaceUpdate": { "components": [ { "id": "...", "component": { "Charts": { ... } } } ] } }
    |
    v
A2UIRenderer (renderer.tsx)
    |  looks up "Charts" in SPECIALIZED_COMPONENTS set
    |  runs Zod validation via validateProps()
    |  renders <Charts> composable component tree
    v
React component displayed in browser
```

---

## Adding a New Component

Follow these steps in order. Skipping one will leave either the AI or the renderer in a broken state.

### Step 1: Create the React component

Place it in `components/ai-elements/` for AI Elements, or `components/tool-ui/` for Tool UI components. Keep it a self-contained composable component with sub-components (Header, Content, Actions, etc.) following the pattern of existing components like `Charts` or `Calendar`.

### Step 2: Create the A2UI adapter (Standard UI only)

If your component is a Standard UI component (wraps a shadcn primitive), create an adapter in `lib/a2ui/adapters/`:

```typescript
import { createAdapter, extractValue, createActionHandler } from '@/lib/a2ui/adapter';
import { YourComponent } from '@/components/ui/your-component';

export const YourComponentAdapter = createAdapter(YourComponent, {
  mapProps: (a2ui, ctx) => ({
    title: extractValue(a2ui.title),
    onClick: createActionHandler(a2ui.action, ctx),
    disabled: extractValue(a2ui.disabled) ?? false,
    children: ctx.children,
  }),
  displayName: 'A2UI(YourComponent)',
});
```

For AI Elements and Tool UI, the composable component itself is the adapter — no separate adapter file needed.

### Step 3: Register in the catalog

Add an entry to `lib/a2ui/catalog.ts` (for AI Elements / Tool UI) or `lib/a2ui/catalog-standard-ui.ts` (for Standard UI):

```typescript
YourComponent: {
  type: 'YourComponent',
  description: 'Describe what this component renders and when to use it. ' +
    'Include supported variants, any gotchas, and data format notes.',
  props: ['data', 'options'],
  examples: [{
    description: 'Basic usage example',
    spec: {
      id: 'yourcomponent-1',
      component: {
        YourComponent: {
          data: { title: 'Hello', content: 'World' },
          options: { height: 400 }
        }
      }
    }
  }]
}
```

Write the description as if you are instructing the AI model — it will appear verbatim in the system prompt. Be specific about required fields, coordinate formats, enum values, and anything the model commonly gets wrong.

### Step 4: Register in the renderer

Open `lib/a2ui/renderer.tsx` and do two things:

1. Add your component type to the `SPECIALIZED_COMPONENTS` set (AI Elements / Tool UI) or ensure it is in the adapter map via `a2uiComponents` (Standard UI).
2. Add a `case` to the `switch` statement in `renderA2UIComponent()` that validates props with `validateProps()` and renders the composable sub-component tree:

```typescript
case 'YourComponent': {
  const yourProps = validation.data as YourComponentProps;
  return (
    <div key={componentId} data-a2ui-id={componentId} data-a2ui-type={componentType}>
      <YourComponent {...yourProps}>
        <YourComponentHeader>
          <YourComponentTitle />
          <YourComponentActions>
            <YourComponentCopyButton />
            <YourComponentFullscreenButton />
          </YourComponentActions>
        </YourComponentHeader>
        <YourComponentContent />
      </YourComponent>
    </div>
  );
}
```

### Step 5: Add a test

Create a test in `__tests__/` that at minimum verifies the component renders without throwing given a valid A2UI spec. Follow the patterns in existing test files.

### Step 6: Verify

```bash
npm run test:run
```

All existing tests must still pass. If you touched the catalog, also do a manual smoke test in the app to confirm the AI generates valid JSON for your component and the renderer displays it correctly.

---

## Known Limitation: Action Handling is a TODO

Interactive elements — `onClick`, `onChange`, form submissions, approval card buttons, option list selections — **render correctly but do not fire events back to the AI or update application state**.

The `handleAction` function in `renderer.tsx` currently just logs to the console:

```typescript
const handleAction = (action: unknown) => {
  console.log('[A2UI] Action:', action);
  // TODO: Implement action handling (e.g., send to AI, update state, etc.)
};
```

This is a known gap, not a bug. If you are building a component that requires interactive callbacks (confirmation dialogs, multi-step flows, form submissions), be aware that the UI will render but the interactions will be silent until this is implemented. Tracking issue: search the codebase for `TODO: Implement action handling`.

---

## File Structure

```text
lib/a2ui/
+-- adapter.ts                  # Adapter utilities (createAdapter, extractValue, etc.)
+-- adapters/
|   +-- index.ts               # Complete adapter mapping (76 Standard UI components)
|   +-- button.tsx             # Button adapter
|   +-- card.tsx               # Card adapter
|   +-- input.tsx              # Input/TextField adapter
|   +-- form.tsx               # Checkbox, Switch, Textarea, Slider, NumberInput
|   +-- layout.tsx             # Row, Column, Flex, Grid, Box, Container, Center
|   +-- typography.tsx         # Text, H1-H6, Badge, Label, Code, Link, Blockquote
+-- components.ts               # Unified component registry
+-- catalog.ts                  # AI Elements + Tool UI catalog entries; exports getCatalogPrompt()
+-- catalog-standard-ui.ts      # Standard UI catalog entries
+-- renderer.tsx                # Hybrid renderer (114+ components)
+-- types.ts                    # Type definitions
+-- COMPONENT_MAPPING.md        # Component mapping reference (see accuracy note there)
+-- README.md                   # This file
```

---

## Implementation Status

### AI Elements (22 components)

| Component | Category | Status |
| --------- | -------- | ------ |
| Timeline | Data Viz | Complete |
| Maps | Data Viz | Complete |
| Geospatial | Data Viz | Complete |
| Charts | Data Viz | Complete |
| KnowledgeGraph | Data Viz | Complete |
| NodeEditor | Data Viz | Complete |
| ThreeScene | 3D | Complete |
| ModelViewer | 3D | Complete |
| VRM | 3D | Complete |
| Phaser | Game | Complete |
| Remotion | Video | Complete |
| SVGPreview | Media | Complete |
| ImageGallery | Media | Complete |
| Calendar | Scheduling | Complete |
| DataTable | Data | Complete |
| JSONViewer | Data | Complete |
| CodeEditor | Dev | Complete |
| Markdown | Content | Complete |
| WYSIWYG | Content | Complete |
| Latex | Math | Complete |
| Mermaid | Diagram | Complete |
| ToolUI | Dev | Complete |

### Tool UI (16 components)

| Component | Status |
| --------- | ------ |
| ApprovalCard | Complete |
| WeatherWidget | Complete |
| StatsDisplay | Complete |
| ProgressTracker | Complete |
| OptionList | Complete |
| QuestionFlow | Complete |
| InstagramPost | Complete |
| LinkedInPost | Complete |
| XPost | Complete |
| LinkPreview | Complete |
| Video | Complete |
| MessageDraft | Complete |
| ItemCarousel | Complete |
| OrderSummary | Complete |
| ParameterSlider | Complete |
| PreferencesPanel | Complete |

### Standard UI Adapters (76 components)

| Category | Progress |
| -------- | -------- |
| Layout (12) | 12/12 (100%) |
| Typography (16) | 16/16 (100%) |
| Forms (13) | 13/13 (100%) |
| Feedback (5) | 5/5 (100%) |
| Navigation (4) | 4/4 (100%) |
| Data Display (6) | 6/6 (100%) |
| Disclosure (8) | 8/8 (100%) |
| Utility (3) | 3/3 (100%) |
| **Total** | **76/76 (100%)** |

---

## Renderer Integration

The renderer handles both the composable pattern (AI Elements + Tool UI) and the adapter pattern (Standard UI) in a single `renderA2UIComponent` function.

```typescript
// Hybrid rendering - simplified overview
function renderA2UIComponent(
  component: A2UIComponent,
  componentsMap?: Map<string, A2UIComponent>,
  onAction?: (action: unknown) => void
): React.ReactNode {
  const [componentType, props] = Object.entries(component.component)[0];
  const ComponentAdapter = a2uiComponents[componentType];

  // SPECIALIZED_COMPONENTS: Zod validation + composable sub-component tree
  if (SPECIALIZED_COMPONENTS.has(componentType)) {
    const validation = validateProps(componentType, props);
    // ... switch/case renders the correct composable tree
  }

  // Standard UI: resolve children by ID, render via adapter
  return (
    <ComponentAdapter node={a2uiNode} onAction={onAction} ...>
      {children}
    </ComponentAdapter>
  );
}
```

Key properties of the renderer:

- Supports all 114+ components (38 AI Elements / Tool UI + 76 Standard UI)
- Recursive child component rendering for Standard UI (children resolved by ID from `componentsMap`)
- Zod validation for all AI Elements and Tool UI before rendering
- `ComponentError` fallback with descriptive messages on validation or render failure
- `UnknownComponent` fallback for component types not in the registry

---

## Total Component Count

| Category | Count | Status |
| -------- | ----- | ------ |
| AI Elements | 22 | Complete |
| Tool UI | 16 | Complete |
| Standard UI Adapters | 76 | Complete |
| **Total** | **114+** | **Core Complete** |

The 70+ raw AI Elements from the a2ui-bridge spec remain available for optional adaptation.

---

## Resources

- **a2ui-bridge**: [https://github.com/southleft/a2ui-bridge](https://github.com/southleft/a2ui-bridge)
- **A2UI Protocol**: [https://a2ui.org](https://a2ui.org)
- **Component Mapping**: See `COMPONENT_MAPPING.md`
- **Adapter Examples**: See files in `adapters/` directory
- **Catalog entry point**: `lib/a2ui/catalog.ts` — `getCatalogPrompt()` is exported from here
- **Renderer entry point**: `lib/a2ui/renderer.tsx` — `A2UIRenderer` and `renderA2UIComponent`
- **System prompt integration**: `app/api/chat/route.ts` — `getSystemPrompt()` calls `getCatalogPrompt()`
