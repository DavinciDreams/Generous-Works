# Streaming AI-Generated UI: Technology Comparison

**Date:** 2026-02-09
**Purpose:** Evaluate technologies for streaming AI-generated UI components with Zod validation

---

## Executive Summary

**RECOMMENDED STACK:**

1. **Primary Protocol:** **A2UI** (Google) - Most mature, framework-agnostic, security-first
2. **Runtime Connection:** **AG-UI** (CopilotKit) - Proven bi-directional streaming with A2UI compatibility
3. **Component Layer:** **json-render** (Vercel) - Best React integration, streaming support, Zod validation built-in

**Why This Stack:**
- ✅ A2UI provides the declarative UI spec format (security + LLM-friendly)
- ✅ AG-UI handles the runtime streaming connection (SSE, state sync, session management)
- ✅ json-render wraps React components with catalog/registry pattern
- ✅ All three are interoperable and actively maintained by major organizations

---

## Technology Overview

### 1. A2UI (Google) - Agent-to-UI Protocol ⭐ RECOMMENDED

**Repository:** https://github.com/google/A2UI
**Status:** v0.8 Public Preview, Apache 2.0
**Maintainer:** Google
**Stars:** ~2.5k

#### What It Is

A declarative JSON protocol for agent-generated UIs that renders natively across platforms without executing arbitrary code.

#### Architecture

```
Agent (Gemini/Claude) → A2UI JSON Message → Client Renderer → Native UI
```

**Message Types:**
- `surfaceUpdate` - Defines UI components and layout
- `dataModelUpdate` - Sets application state
- `beginRendering` - Triggers rendering

**Example Message:**
```json
{
  "surfaceUpdate": {
    "components": [
      {
        "id": "card-1",
        "component": {
          "Card": {
            "title": "Revenue",
            "children": ["metric-1"]
          }
        }
      },
      {
        "id": "metric-1",
        "component": {
          "Metric": {
            "label": "Q4 2025",
            "value": "$42,500",
            "trend": "up"
          }
        }
      }
    ]
  }
}
```

#### Key Features

**1. Security First**
- Declarative data format (not executable code)
- Client maintains trusted component catalog
- No arbitrary code execution risk
- Perfect for multi-tenant environments

**2. LLM-Friendly**
- Flat list structure with ID references
- Easy for LLMs to generate incrementally
- Supports progressive rendering
- Error correction through updates

**3. Framework-Agnostic**
- Same JSON payload works across platforms
- Official renderers: Angular, Flutter, Lit, Web Core
- Community renderers: React (via CopilotKit)
- Mobile: Flutter GenUI SDK uses A2UI

**4. Data Binding**
- Components reference application state via paths
- Updates trigger re-rendering
- Supports complex data models

#### Available Renderers

**Official (Google):**
- `renderers/web_core` - Core web renderer
- `renderers/lit` - Lit web components
- `renderers/angular` - Angular components
- `renderers/flutter` - Flutter widgets

**Community:**
- CopilotKit A2UI Widget Builder
- React renderers via AG-UI integration

#### Pros

✅ **Google-backed** - Long-term support, production-ready
✅ **Security model** - Declarative only, no code execution
✅ **Cross-platform** - Web, mobile, desktop from one spec
✅ **LLM-optimized** - Flat structure, incremental updates
✅ **Active development** - Moving toward v1.0
✅ **Interoperable** - Works with AG-UI, A2A protocols

#### Cons

⚠️ **Early stage** - v0.8, APIs may change
⚠️ **React renderer** - Not official (via CopilotKit)
⚠️ **Learning curve** - New protocol, message format
⚠️ **Limited docs** - Mostly examples, spec is evolving

#### Use Cases for Your Library

**Perfect For:**
- AI agents generating custom dashboards
- Multi-platform support (web + mobile planned)
- Security-critical environments
- Google Gemini integration

**Example Integration:**
```typescript
// AI generates A2UI message
const a2uiMessage = {
  surfaceUpdate: {
    components: [
      { id: "timeline-1", component: { Timeline: { data: events } } }
    ]
  }
};

// Your renderer maps to existing components
const catalog = {
  Timeline: TimelineComponent,
  Maps: MapsComponent,
  ThreeScene: ThreeSceneComponent
};

<A2UIRenderer message={a2uiMessage} catalog={catalog} />
```

**Compatibility with Your Components:** ✅ High
- Your composable API fits perfectly with A2UI's component model
- Existing components can be wrapped with minimal adapters

---

### 2. AG-UI (CopilotKit) - Agent-User Interaction Protocol ⭐ RECOMMENDED

**Repository:** https://github.com/ag-ui-protocol/ag-ui
**Website:** https://docs.ag-ui.com/
**Status:** Production, MIT License
**Maintainer:** CopilotKit (adopted by Google, Microsoft, AWS, LangChain)
**Adoption:** Microsoft Agent Framework, LangGraph, CrewAI, Mastra

#### What It Is

An event-based protocol for bi-directional communication between agents and user-facing applications, with built-in support for streaming, state sync, and A2UI rendering.

#### Architecture

```
Agent Backend ←→ AG-UI Protocol (SSE/WebSocket) ←→ React Frontend
                       ↓
                  A2UI Messages
                       ↓
                React Components
```

#### Key Features

**1. Streaming Infrastructure**
- Server-Sent Events (SSE) for real-time streaming
- Progressive UI updates as agent generates
- Handles chunked responses efficiently

**2. State Management**
- Bi-directional state synchronization
- Agent and client stay in sync
- Session management built-in

**3. A2UI Integration**
- Native support for A2UI messages
- Render A2UI specs in React apps
- Combines A2UI (what to render) with AG-UI (how to connect)

**4. Human-in-the-Loop**
- Built-in approval workflows
- Tool call confirmations
- Interactive agent experiences

**5. Framework Support**
- React SDK with hooks (`useAgUI`, `useAgentState`)
- Integrations: LangGraph, Microsoft Agent Framework, CrewAI
- Backend-agnostic (works with any agent framework)

#### Relationship with A2UI

**AG-UI vs A2UI:**
- **A2UI** - UI specification format (what to render)
- **AG-UI** - Runtime connection protocol (how to connect agent to UI)
- **Together** - Complete agent-to-user solution

```typescript
// AG-UI provides the connection
import { useAgUI } from '@ag-ui/react';

function App() {
  const { messages, sendMessage } = useAgUI({
    agentUrl: '/api/agent'
  });

  // Messages can include A2UI specs
  const a2uiMessage = messages.find(m => m.type === 'a2ui');

  return (
    <>
      {/* Render A2UI messages */}
      {a2uiMessage && <A2UIRenderer spec={a2uiMessage.content} />}

      {/* User input */}
      <input onChange={e => sendMessage(e.target.value)} />
    </>
  );
}
```

#### Pros

✅ **Production-ready** - Used by Microsoft, AWS, Google
✅ **A2UI compatible** - Works seamlessly together
✅ **React-first** - Official React SDK
✅ **Streaming built-in** - SSE, progressive rendering
✅ **State sync** - Bi-directional, session management
✅ **Wide adoption** - Multiple agent frameworks
✅ **Active development** - Strong community

#### Cons

⚠️ **CopilotKit dependency** - Not from Google/Vercel/Meta
⚠️ **React-focused** - Other frameworks less supported
⚠️ **Newer protocol** - Less mature than HTTP/REST

#### Use Cases for Your Library

**Perfect For:**
- Real-time streaming of AI-generated UIs
- Chat interfaces with generative UI
- Human-in-the-loop agent workflows
- State synchronization between agent and UI

**Example Integration:**
```typescript
import { useAgUI } from '@ag-ui/react';
import { A2UIRenderer } from '@a2ui/react'; // hypothetical

function AgentChat() {
  const { messages, state } = useAgUI({
    agentUrl: '/api/agent',
    onA2UIMessage: (spec) => {
      // Render your components from A2UI spec
    }
  });

  return (
    <div>
      {messages.map(msg => (
        msg.type === 'a2ui' ? (
          <A2UIRenderer
            spec={msg.content}
            catalog={{ Timeline, Maps, ThreeScene }}
          />
        ) : (
          <MessageBubble>{msg.content}</MessageBubble>
        )
      ))}
    </div>
  );
}
```

**Compatibility with Your Components:** ✅ Very High
- React-first, works naturally with your components
- Streaming support matches your needs perfectly

---

### 3. json-render (Vercel Labs) - Already Covered ⭐ RECOMMENDED

See [RECOMMENDATION.md](./RECOMMENDATION.md) for full analysis.

**Quick Summary:**
- Zod-based catalog system ✅
- Streaming support (SpecStream) ✅
- React renderer with hooks ✅
- Similar to A2UI but React-specific

**Best For:** If you want to stay pure React without A2UI/AG-UI protocols

---

### 4. @dataxpdtn/mui-json-viewer - JSON Viewer Component ❌ NOT FOR AI GENERATION

**npm:** https://www.npmjs.com/package/@dataxpdtn/mui-json-viewer
**Version:** 5.0.9 (Latest: Dec 2025)
**License:** MIT
**Bundle Size:** ~2.1MB unpacked

#### What It Is

An interactive JSON viewer component for Material-UI (MUI) applications. Displays JSON data as collapsible tree view.

#### Features

- Interactive JSON tree display
- Collapsible/expandable nodes
- Copy to clipboard
- Search functionality
- Syntax highlighting
- MUI v7 compatible

#### Why It's NOT What You Need

❌ **Display only** - Shows existing JSON, doesn't render UI components
❌ **No AI generation** - Not designed for generative UI
❌ **No streaming** - Static data viewer
❌ **MUI dependency** - Requires Material-UI (you use shadcn/ui)
❌ **Wrong use case** - For debugging/inspecting JSON, not rendering UIs

**Example Use:**
```tsx
import { JsonViewer } from '@dataxpdtn/mui-json-viewer';

// This shows JSON data, doesn't render components FROM JSON
<JsonViewer data={{ name: "John", age: 30 }} />
// Displays: { name: "John", age: 30 } as tree
// Does NOT render: <User name="John" age={30} />
```

**Verdict:** ❌ Skip - Not for AI-generated UI

---

### 5. react-json-view-ssr - JSON Viewer with SSR ❌ NOT FOR AI GENERATION

**npm:** https://www.npmjs.com/package/react-json-view-ssr
**Version:** 1.19.1 (Last updated: 2019)
**License:** MIT
**Status:** ⚠️ UNMAINTAINED (5+ years old)

#### What It Is

Fork of `react-json-view` with server-side rendering support. Interactive JSON tree viewer.

#### Why It's NOT What You Need

❌ **Display only** - Same as mui-json-viewer, shows JSON structure
❌ **Unmaintained** - Last update 2019, React 16 era
❌ **Old dependencies** - Flux (deprecated), React 16 peer deps
❌ **No AI generation** - Just a viewer
❌ **No streaming** - Static display
❌ **Security issues** - Old dependencies likely have vulnerabilities

**Verdict:** ❌ Skip - Outdated and wrong use case

---

### 6. @rich-data/viewer - Interactive Data Viewer ❌ NOT FOR AI GENERATION

**npm:** https://www.npmjs.com/package/@rich-data/viewer
**Version:** 2.15.6 (Latest stable: March 2023)
**Version:** 3.0.0-nightly (in development)
**License:** MIT
**Maintainer:** himself65

#### What It Is

Interactive viewer for JSON and other data structures. Modern alternative to react-json-view with React 18 support.

#### Features

- React 18 compatible
- Interactive tree view
- Expandable/collapsible nodes
- Copy to clipboard
- Theming support
- Zustand for state management

#### Why It's NOT What You Need

❌ **Display only** - Views data, doesn't render components
❌ **No AI generation** - Not designed for generative UI
❌ **No streaming** - Static viewer
❌ **Wrong paradigm** - Shows JSON structure, doesn't interpret it as UI

**Example:**
```tsx
import { Viewer } from '@rich-data/viewer';

// Shows the data structure
<Viewer data={{ timeline: { events: [...] } }} />
// Does NOT render Timeline component
```

**Verdict:** ❌ Skip - Same issue as mui-json-viewer

---

## Detailed Comparison Matrix

| Feature | A2UI | AG-UI | json-render | mui-json-viewer | react-json-view-ssr | @rich-data/viewer |
|---------|------|-------|-------------|-----------------|---------------------|-------------------|
| **Purpose** | UI Protocol | Runtime Connection | React Renderer | JSON Viewer | JSON Viewer | JSON Viewer |
| **Renders Components** | ✅ Yes | ✅ via A2UI | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Streaming Support** | ✅ Incremental | ✅ SSE Built-in | ✅ SpecStream | ❌ No | ❌ No | ❌ No |
| **Zod Validation** | ⚠️ Client-side | ⚠️ Client-side | ✅ Built-in | ❌ No | ❌ No | ❌ No |
| **React Support** | ⚠️ Community | ✅ Official SDK | ✅ Native | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cross-Platform** | ✅ Web/Mobile | ⚠️ React-focused | ❌ React only | ❌ Web only | ❌ Web only | ❌ Web only |
| **Security Model** | ✅ Declarative | ✅ Event-based | ✅ Catalog | N/A | N/A | N/A |
| **Maintenance** | ✅ Active (Google) | ✅ Active (CopilotKit) | ✅ Active (Vercel) | ⚠️ New (2025) | ❌ Dead (2019) | ⚠️ Slow (2023) |
| **Bundle Size** | Small (~50KB) | Medium (~100KB) | Medium (~50KB) | Large (~2MB) | Medium (~173KB) | Medium (~889KB) |
| **Documentation** | ⚠️ Evolving | ✅ Good | ✅ Good | ⚠️ Basic | ❌ Old | ⚠️ Basic |
| **TypeScript** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ⚠️ Partial | ✅ Yes |
| **License** | Apache 2.0 | MIT | Apache 2.0 | MIT | MIT | MIT |

---

## Recommended Integration Strategy

### Phase 1: Foundation (Week 1-2)

**Goal:** Set up A2UI + AG-UI infrastructure

**Tasks:**
1. Install AG-UI React SDK
2. Create A2UI component catalog
3. Build A2UI renderer for your components
4. Set up AG-UI connection to backend

**Implementation:**

```bash
npm install @ag-ui/react @ag-ui/core
```

```typescript
// lib/a2ui/catalog.ts
export const componentCatalog = {
  Timeline: {
    type: 'Timeline',
    props: ['data', 'options'],
    description: 'Interactive timeline visualization'
  },
  Maps: {
    type: 'Maps',
    props: ['data', 'options'],
    description: '2D/3D geographic visualization'
  },
  ThreeScene: {
    type: 'ThreeScene',
    props: ['data', 'options'],
    description: '3D scene viewer with OrbitControls'
  }
};

// lib/a2ui/renderer.tsx
import { Timeline } from '@/components/ai-elements/timeline';
import { Maps } from '@/components/ai-elements/maps';
import { ThreeScene } from '@/components/ai-elements/threescene';

export function A2UIRenderer({ spec }: { spec: A2UISpec }) {
  const renderComponent = (component: A2UIComponent) => {
    switch (component.type) {
      case 'Timeline':
        return <Timeline {...component.props} />;
      case 'Maps':
        return <Maps {...component.props} />;
      case 'ThreeScene':
        return <ThreeScene {...component.props} />;
      default:
        return null;
    }
  };

  return (
    <div>
      {spec.components.map(comp => (
        <div key={comp.id}>{renderComponent(comp)}</div>
      ))}
    </div>
  );
}
```

```typescript
// app/agent-chat/page.tsx
import { useAgUI } from '@ag-ui/react';
import { A2UIRenderer } from '@/lib/a2ui/renderer';

export default function AgentChatPage() {
  const { messages, sendMessage, state } = useAgUI({
    agentUrl: '/api/agent',
  });

  return (
    <div className="chat-container">
      {messages.map(msg => (
        msg.type === 'a2ui' ? (
          <A2UIRenderer spec={msg.content} />
        ) : (
          <MessageBubble>{msg.content}</MessageBubble>
        )
      ))}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
```

---

### Phase 2: Add Zod Validation (Week 3)

**Goal:** Type-safe component props with runtime validation

**Tasks:**
1. Create Zod schemas for all component props
2. Add validation to A2UI renderer
3. Generate TypeScript types from schemas
4. Add error handling for invalid specs

**Implementation:**

```typescript
// lib/schemas/timeline.ts
import { z } from 'zod';

export const TimelineDataSchema = z.object({
  title: z.object({
    text: z.object({
      headline: z.string(),
      text: z.string().optional()
    }).optional()
  }).optional(),
  events: z.array(z.object({
    start_date: z.object({
      year: z.number(),
      month: z.number().optional(),
      day: z.number().optional()
    }),
    text: z.object({
      headline: z.string(),
      text: z.string().optional()
    }).optional(),
    media: z.object({
      url: z.string().url(),
      caption: z.string().optional(),
      thumbnail: z.string().url().optional()
    }).optional(),
    unique_id: z.string().optional()
  }))
});

export const TimelinePropsSchema = z.object({
  data: TimelineDataSchema,
  options: z.object({
    height: z.union([z.number(), z.string()]).optional(),
    language: z.string().optional()
  }).optional()
});

export type TimelineProps = z.infer<typeof TimelinePropsSchema>;
```

```typescript
// lib/a2ui/validated-renderer.tsx
import { TimelinePropsSchema } from '@/lib/schemas/timeline';
import { MapsPropsSchema } from '@/lib/schemas/maps';
import { ThreeScenePropsSchema } from '@/lib/schemas/threescene';

const schemaRegistry = {
  Timeline: TimelinePropsSchema,
  Maps: MapsPropsSchema,
  ThreeScene: ThreeScenePropsSchema
};

export function ValidatedA2UIRenderer({ spec }: { spec: A2UISpec }) {
  const renderComponent = (component: A2UIComponent) => {
    // Validate props
    const schema = schemaRegistry[component.type];
    if (!schema) {
      console.error(`Unknown component type: ${component.type}`);
      return <ErrorFallback error="Unknown component" />;
    }

    try {
      const validatedProps = schema.parse(component.props);

      switch (component.type) {
        case 'Timeline':
          return <Timeline {...validatedProps} />;
        case 'Maps':
          return <Maps {...validatedProps} />;
        case 'ThreeScene':
          return <ThreeScene {...validatedProps} />;
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors);
        return <ErrorFallback error="Invalid component props" />;
      }
      throw error;
    }
  };

  return (
    <div>
      {spec.components.map(comp => (
        <div key={comp.id}>{renderComponent(comp)}</div>
      ))}
    </div>
  );
}
```

---

### Phase 3: Optional json-render Integration (Week 4)

**Goal:** Add json-render for pure React use cases (without A2UI/AG-UI)

**When to use:**
- Internal tools where A2UI protocol is overkill
- Pure React apps without agent streaming
- Simpler catalog-based rendering

**Implementation:**

```typescript
// lib/json-render/catalog.ts
import { defineCatalog } from '@json-render/core';
import { schema } from '@json-render/react';
import { TimelinePropsSchema } from '@/lib/schemas/timeline';

export const catalog = defineCatalog(schema, {
  components: {
    Timeline: {
      props: TimelinePropsSchema,
      description: 'Interactive timeline visualization with TimelineJS'
    },
    Maps: {
      props: MapsPropsSchema,
      description: '2D/3D geographic visualization with Leaflet'
    },
    ThreeScene: {
      props: ThreeScenePropsSchema,
      description: '3D scene viewer with Three.js and OrbitControls'
    }
  }
});

// lib/json-render/registry.tsx
import { defineRegistry } from '@json-render/react';
import { catalog } from './catalog';

export const { registry } = defineRegistry(catalog, {
  components: {
    Timeline: ({ props }) => <Timeline {...props} />,
    Maps: ({ props }) => <Maps {...props} />,
    ThreeScene: ({ props }) => <ThreeScene {...props} />
  }
});

// Usage
import { Renderer } from '@json-render/react';
import { registry } from '@/lib/json-render/registry';

<Renderer spec={spec} registry={registry} />
```

---

## Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      AI Agent (Claude/Gemini)                │
│              Generates A2UI JSON Specifications              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ A2UI Messages (JSON)
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    AG-UI Protocol Layer                      │
│   • Server-Sent Events (SSE)                                │
│   • State Synchronization                                   │
│   • Session Management                                      │
│   • Human-in-the-Loop                                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Streaming Updates
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              React App (useAgUI Hook)                        │
│   • Receives A2UI messages                                  │
│   • Manages UI state                                        │
│   • Handles user interactions                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ A2UI Spec
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│           A2UI Renderer with Zod Validation                  │
│   1. Validate component props (Zod schemas)                 │
│   2. Map component types to implementations                 │
│   3. Handle errors gracefully                               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Validated Props
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Your AI Elements Library                        │
│   • Timeline (TimelineJS)                                   │
│   • Maps (Leaflet)                                          │
│   • ThreeScene (Three.js)                                   │
│   • 60+ other components                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Bundle Size Analysis

```
A2UI Core:           ~10KB gzipped
AG-UI React SDK:     ~35KB gzipped
Zod:                 ~12KB gzipped
Your Components:     Varies (Timeline: ~120KB, Maps: ~80KB, etc.)
───────────────────────────────────────
Total Overhead:      ~57KB gzipped
```

**Verdict:** ✅ Acceptable - Less than 60KB for complete streaming AI UI

---

## Migration Path from json-render (If Already Adopted)

If you've already started with json-render, here's how to migrate to A2UI/AG-UI:

### Step 1: Keep json-render Catalog

```typescript
// Your existing json-render catalog
const catalog = defineCatalog(schema, {
  components: { Timeline: {...}, Maps: {...} }
});

// Generate A2UI catalog from it
const a2uiCatalog = {
  Timeline: {
    type: 'Timeline',
    props: catalog.components.Timeline.props,
    description: catalog.components.Timeline.description
  },
  // ... map other components
};
```

### Step 2: Dual Renderers

```typescript
// Support both json-render and A2UI
export function HybridRenderer({ spec, format }: {
  spec: any;
  format: 'json-render' | 'a2ui'
}) {
  if (format === 'json-render') {
    return <Renderer spec={spec} registry={jsonRenderRegistry} />;
  } else {
    return <A2UIRenderer spec={spec} />;
  }
}
```

### Step 3: Gradual Migration

- Week 1: Add A2UI renderer alongside json-render
- Week 2: Route new features to A2UI
- Week 3: Migrate existing features
- Week 4: Deprecate json-render (optional)

---

## Final Recommendations

### Use A2UI + AG-UI + Zod If:

✅ You want cross-platform support (web + mobile)
✅ You need maximum security (multi-tenant, enterprise)
✅ You plan to support multiple agent frameworks
✅ You want industry-standard protocols (Google, Microsoft, AWS)
✅ You need bi-directional streaming and state sync
✅ You want future-proof architecture

**Investment:** 4-6 weeks
**Complexity:** Medium-High
**Long-term Value:** Very High

---

### Use json-render If:

✅ You're React-only (no mobile plans)
✅ You want fastest time-to-market
✅ You trust Vercel Labs for long-term support
✅ You prefer simpler, React-native architecture
✅ You don't need complex agent orchestration

**Investment:** 2-3 weeks
**Complexity:** Medium
**Long-term Value:** High (but React-limited)

---

### Skip These:

❌ **@dataxpdtn/mui-json-viewer** - Wrong use case (JSON viewer, not UI generator)
❌ **react-json-view-ssr** - Unmaintained, outdated, wrong use case
❌ **@rich-data/viewer** - Wrong use case (data inspector, not UI renderer)

These are for **viewing/debugging JSON**, not **rendering components FROM JSON**.

---

## Sources

- [A2UI - Google Developers Blog](https://developers.googleblog.com/introducing-a2ui-an-open-project-for-agent-driven-interfaces/)
- [A2UI Official Site](https://a2ui.org/)
- [GitHub - google/A2UI](https://github.com/google/A2UI)
- [AG-UI Protocol | CopilotKit](https://www.copilotkit.ai/ag-ui)
- [GitHub - ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui)
- [AG-UI and A2UI: Understanding the Differences](https://www.copilotkit.ai/ag-ui-and-a2ui)
- [Build with Google's new A2UI Spec: Agent User Interfaces with A2UI + AG-UI](https://www.copilotkit.ai/blog/build-with-googles-new-a2ui-spec-agent-user-interfaces-with-a2ui-ag-ui)

---

**Document Version:** 1.0
**Author:** Claude (AI Research Agent)
**Next Steps:** Review with team, prototype A2UI+AG-UI integration, measure performance
