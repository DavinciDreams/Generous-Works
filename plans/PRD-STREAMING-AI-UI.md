# Product Requirements Document: Streaming AI-Generated UI

**Project:** AI Elements Library - Streaming UI Integration
**Stack:** A2UI (Google) + AG-UI (CopilotKit) + Zod
**Status:** 🟢 Approved - Implementation Started
**Date:** 2026-02-09
**Version:** 1.0

---

## Executive Summary

Enable AI agents to generate and stream rich, interactive UIs using your existing AI Elements library (Timeline, Maps, ThreeScene, etc.) through industry-standard protocols (A2UI, AG-UI) with runtime type safety (Zod).

**Value Proposition:**
- Users can generate custom dashboards via natural language ("Show me revenue timeline for Q4")
- AI streams UIs progressively for responsive experience
- Components validate props at runtime (catch errors before rendering)
- Cross-platform foundation (future mobile support via A2UI/Flutter)

---

## Goals & Objectives

### Primary Goals

1. **Enable AI-Generated UIs**
   - AI agents can generate custom layouts using existing components
   - Support natural language → interactive UI workflow
   - Handle complex, multi-component UIs

2. **Streaming Support**
   - Progressive rendering as AI generates response
   - Real-time UI updates during generation
   - Responsive user experience (no waiting for full response)

3. **Type Safety**
   - Runtime validation of all component props
   - Graceful error handling for invalid specs
   - Developer-friendly error messages

4. **Maintain Existing API**
   - No breaking changes to current components
   - Support both direct usage and AI-generated usage
   - Gradual adoption path

### Success Metrics

- ✅ Successfully render Timeline, Maps, ThreeScene from A2UI specs
- ✅ Stream UI updates with <100ms latency per chunk
- ✅ 100% Zod validation coverage for core components
- ✅ Zero breaking changes to existing component APIs
- ✅ Bundle size increase <100KB gzipped
- ✅ Working demo: Natural language → Generated UI (end-to-end)

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   User Input (Natural Language)              │
│            "Show me a 3D solar system with timeline"         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  AI Agent (Claude/Gemini)                    │
│   • Receives component catalog                              │
│   • Generates A2UI JSON specification                       │
│   • Streams response via AG-UI protocol                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ A2UI Messages (streamed)
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              AG-UI Client (React Frontend)                   │
│   • useAgUI hook for connection                             │
│   • Receives streaming A2UI messages                        │
│   • Manages session state                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ A2UI Spec + State
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│           A2UI Renderer + Zod Validator                      │
│   1. Parse A2UI message                                     │
│   2. Validate props with Zod schemas                        │
│   3. Map component types to implementations                 │
│   4. Handle validation errors gracefully                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Validated Props
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│           Existing AI Elements Components                    │
│   • Timeline (TimelineJS)                                   │
│   • Maps (Leaflet)                                          │
│   • ThreeScene (Three.js)                                   │
│   • 60+ other components (unchanged)                        │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Core Technologies:**
- **A2UI (v0.8)** - UI specification protocol
- **AG-UI (latest)** - Streaming runtime connection
- **Zod (^3.x)** - Runtime type validation
- **React 18+** - UI framework
- **TypeScript 5+** - Type safety

**Existing Stack (unchanged):**
- Next.js 15
- shadcn/ui components
- Tailwind CSS
- Existing AI elements

---

## Components & Features

### Phase 1: Foundation (Week 1-2)

**Goal:** Basic A2UI + AG-UI infrastructure working

#### 1.1 AG-UI Client Integration

**Files:**
- `lib/ag-ui/client.ts` - AG-UI client configuration
- `lib/ag-ui/hooks.ts` - React hooks (useAgUI)
- `app/api/agent/route.ts` - API endpoint for agent

**Features:**
- Connect to AI agent via AG-UI protocol
- Streaming message handling
- Session management
- Error handling

**Acceptance Criteria:**
- [ ] Successfully connect to AG-UI endpoint
- [ ] Receive streaming messages
- [ ] Display connection status
- [ ] Handle reconnection on disconnect

#### 1.2 A2UI Component Catalog

**Files:**
- `lib/a2ui/catalog.ts` - Component catalog definition
- `lib/a2ui/types.ts` - TypeScript types for A2UI

**Catalog Structure:**
```typescript
{
  Timeline: {
    type: 'Timeline',
    description: 'Interactive timeline visualization',
    props: ['data', 'options'],
    examples: [...]
  },
  Maps: {
    type: 'Maps',
    description: '2D/3D geographic visualization',
    props: ['data', 'options'],
    examples: [...]
  },
  ThreeScene: {
    type: 'ThreeScene',
    description: '3D scene viewer',
    props: ['data', 'options'],
    examples: [...]
  }
}
```

**Acceptance Criteria:**
- [ ] Catalog defined for Timeline, Maps, ThreeScene
- [ ] Export catalog in A2UI-compatible format
- [ ] Include component descriptions for AI
- [ ] Include example usage for AI

#### 1.3 Basic A2UI Renderer

**Files:**
- `lib/a2ui/renderer.tsx` - A2UI message renderer
- `lib/a2ui/components.tsx` - Component mapping

**Features:**
- Parse A2UI surfaceUpdate messages
- Map component types to React components
- Render component tree
- Handle unknown component types

**Acceptance Criteria:**
- [ ] Parse surfaceUpdate messages
- [ ] Render Timeline from A2UI spec
- [ ] Render Maps from A2UI spec
- [ ] Render ThreeScene from A2UI spec
- [ ] Display error for unknown types

#### 1.4 Demo Page

**Files:**
- `app/ai-chat/page.tsx` - AI chat interface
- `components/ai-chat/` - Chat UI components

**Features:**
- Chat interface for user input
- Display streaming AI responses
- Render A2UI-generated components
- Show loading states

**Acceptance Criteria:**
- [ ] User can type messages
- [ ] See streaming text responses
- [ ] See generated UI components
- [ ] Loading indicators during generation

---

### Phase 2: Zod Validation (Week 3)

**Goal:** Type-safe component props with runtime validation

#### 2.1 Zod Schemas

**Files:**
- `lib/schemas/timeline.schema.ts` - Timeline prop schemas
- `lib/schemas/maps.schema.ts` - Maps prop schemas
- `lib/schemas/threescene.schema.ts` - ThreeScene prop schemas
- `lib/schemas/index.ts` - Schema exports

**Schema Coverage:**
- All component props
- Nested object types
- Optional fields
- Union types (enums)
- Array types

**Acceptance Criteria:**
- [ ] TimelineDataSchema with full type coverage
- [ ] TimelinePropsSchema exported
- [ ] MapsDataSchema with full type coverage
- [ ] MapsPropsSchema exported
- [ ] ThreeSceneDataSchema with full type coverage
- [ ] ThreeScenePropsSchema exported
- [ ] Generated TypeScript types from schemas

#### 2.2 Validated Renderer

**Files:**
- `lib/a2ui/validated-renderer.tsx` - Renderer with validation
- `lib/a2ui/error-boundary.tsx` - Error handling component

**Features:**
- Validate props before rendering
- Catch Zod validation errors
- Display user-friendly error messages
- Log validation errors for debugging
- Graceful fallback for invalid props

**Acceptance Criteria:**
- [ ] All components validated before render
- [ ] Invalid props caught and logged
- [ ] User sees helpful error message
- [ ] Component doesn't crash on invalid props
- [ ] Validation errors include field names

#### 2.3 Error Handling

**Components:**
- `ValidationErrorDisplay` - Shows validation errors
- `ComponentErrorBoundary` - Catches render errors
- `A2UIErrorFallback` - Fallback for failed components

**Acceptance Criteria:**
- [ ] Validation errors display clearly
- [ ] Render errors don't crash app
- [ ] User can see what went wrong
- [ ] Developer gets actionable error messages

---

### Phase 3: AI Agent Integration (Week 4)

**Goal:** End-to-end AI → UI generation

#### 3.1 AI Agent Endpoint

**Files:**
- `app/api/agent/route.ts` - AI agent API endpoint
- `lib/ai/agent.ts` - Agent logic
- `lib/ai/prompts.ts` - System prompts

**Features:**
- Accept user messages
- Generate A2UI specs with Claude/Gemini
- Stream responses via AG-UI protocol
- Include component catalog in context

**Acceptance Criteria:**
- [ ] API endpoint accepts POST requests
- [ ] Streams responses via SSE
- [ ] Generates valid A2UI specs
- [ ] Uses component catalog in prompts
- [ ] Handles rate limits gracefully

#### 3.2 Prompt Engineering

**Files:**
- `lib/ai/catalog-prompt.ts` - Generate prompts from catalog
- `lib/ai/system-prompt.ts` - Base system instructions

**System Prompt Structure:**
```
You are a UI generation assistant. You can create interactive
UIs using the following components:

1. Timeline - Interactive timeline visualization
   Props:
   - data: TimelineData (required)
   - options: TimelineOptions (optional)

   Example A2UI spec:
   {
     "id": "timeline-1",
     "component": {
       "Timeline": {
         "data": { ... },
         "options": { height: 600 }
       }
     }
   }

2. Maps - Geographic visualization
   ...

Generate A2UI surfaceUpdate messages in this format:
{
  "surfaceUpdate": {
    "components": [...]
  }
}
```

**Acceptance Criteria:**
- [ ] Catalog auto-generates AI prompts
- [ ] Prompts include component descriptions
- [ ] Prompts include example usage
- [ ] Prompts specify A2UI format
- [ ] AI consistently generates valid specs

#### 3.3 Example Workflows

**Scenarios:**
1. "Show me a timeline of major tech companies" → Timeline with data
2. "Display San Francisco on a map" → Maps with marker
3. "Create a 3D cube" → ThreeScene with cube
4. "Build a dashboard with timeline and map" → Multi-component layout

**Acceptance Criteria:**
- [ ] Each scenario works end-to-end
- [ ] Components render correctly
- [ ] Data is accurate
- [ ] UI is responsive

---

### Phase 4: Polish & Optimization (Week 5-6)

**Goal:** Production-ready implementation

#### 4.1 Performance Optimization

**Tasks:**
- Lazy load components
- Optimize bundle size
- Minimize re-renders
- Add memoization

**Targets:**
- Initial bundle: <100KB overhead
- Time to first component: <200ms
- Re-render count: <5 per update

#### 4.2 Testing

**Test Coverage:**
- Unit tests for schemas (Zod validation)
- Integration tests for renderer
- E2E tests for AI workflows
- Visual regression tests

**Files:**
- `__tests__/schemas/` - Schema tests
- `__tests__/a2ui/` - Renderer tests
- `__tests__/e2e/` - End-to-end tests

**Acceptance Criteria:**
- [ ] 90%+ test coverage for new code
- [ ] All schemas have passing tests
- [ ] Renderer has integration tests
- [ ] E2E tests for 4 example workflows

#### 4.3 Documentation

**Files:**
- `docs/AI_GENERATION.md` - User guide
- `docs/A2UI_SPEC.md` - A2UI spec reference
- `docs/SCHEMAS.md` - Zod schema docs
- `docs/EXAMPLES.md` - Code examples

**Acceptance Criteria:**
- [ ] User guide with screenshots
- [ ] A2UI spec examples
- [ ] Schema reference docs
- [ ] 5+ code examples

#### 4.4 Developer Experience

**Tools:**
- Type checking (tsc --noEmit)
- Linting (eslint)
- Formatting (prettier)
- Commit hooks (husky)

**Acceptance Criteria:**
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Consistent formatting
- [ ] Pre-commit hooks working

---

## File Structure

```
lib/
├── a2ui/
│   ├── catalog.ts              # Component catalog
│   ├── types.ts                # A2UI TypeScript types
│   ├── renderer.tsx            # Basic renderer
│   ├── validated-renderer.tsx  # Renderer with Zod
│   ├── error-boundary.tsx      # Error handling
│   └── components.tsx          # Component mapping
├── ag-ui/
│   ├── client.ts               # AG-UI client setup
│   ├── hooks.ts                # React hooks
│   └── types.ts                # AG-UI types
├── schemas/
│   ├── timeline.schema.ts      # Timeline Zod schemas
│   ├── maps.schema.ts          # Maps Zod schemas
│   ├── threescene.schema.ts    # ThreeScene Zod schemas
│   └── index.ts                # Schema exports
└── ai/
    ├── agent.ts                # AI agent logic
    ├── prompts.ts              # Prompt templates
    ├── catalog-prompt.ts       # Auto-generate prompts
    └── system-prompt.ts        # System instructions

app/
├── ai-chat/
│   └── page.tsx                # AI chat demo page
└── api/
    └── agent/
        └── route.ts            # AI agent API endpoint

components/
├── ai-chat/
│   ├── chat-input.tsx          # Message input
│   ├── chat-message.tsx        # Message display
│   └── chat-container.tsx      # Chat layout
└── ai-elements/
    └── (existing components unchanged)

docs/
├── AI_GENERATION.md            # User guide
├── A2UI_SPEC.md                # Spec reference
├── SCHEMAS.md                  # Schema docs
└── EXAMPLES.md                 # Code examples

__tests__/
├── schemas/
│   ├── timeline.test.ts
│   ├── maps.test.ts
│   └── threescene.test.ts
├── a2ui/
│   ├── renderer.test.tsx
│   └── validator.test.ts
└── e2e/
    └── ai-generation.test.ts
```

---

## Dependencies

### New Dependencies

```json
{
  "dependencies": {
    "@ag-ui/react": "^0.x.x",
    "@ag-ui/core": "^0.x.x",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^20.x.x",
    "vitest": "^1.x.x"
  }
}
```

**Bundle Impact:**
- @ag-ui/react: ~35KB gzipped
- @ag-ui/core: ~20KB gzipped
- zod: ~12KB gzipped (may already be installed)
- **Total:** ~67KB gzipped

**Acceptable:** Yes (<100KB target)

---

## Data Models

### A2UI Message Format

```typescript
interface A2UIMessage {
  surfaceUpdate?: {
    components: A2UIComponent[];
  };
  dataModelUpdate?: {
    path: string;
    value: unknown;
  };
  beginRendering?: boolean;
}

interface A2UIComponent {
  id: string;
  component: {
    [type: string]: {
      [prop: string]: unknown;
    };
  };
}
```

### Example A2UI Spec

```json
{
  "surfaceUpdate": {
    "components": [
      {
        "id": "timeline-1",
        "component": {
          "Timeline": {
            "data": {
              "title": {
                "text": {
                  "headline": "Major Tech Companies",
                  "text": "Founded dates of major tech companies"
                }
              },
              "events": [
                {
                  "start_date": { "year": 1976 },
                  "text": { "headline": "Apple Founded" },
                  "unique_id": "apple"
                },
                {
                  "start_date": { "year": 1998 },
                  "text": { "headline": "Google Founded" },
                  "unique_id": "google"
                }
              ]
            },
            "options": {
              "height": 600
            }
          }
        }
      }
    ]
  }
}
```

---

## Timeline

### Phase 1: Foundation (Week 1-2)
- **Week 1:** AG-UI client + A2UI catalog
- **Week 2:** Basic renderer + demo page

### Phase 2: Validation (Week 3)
- **Week 3:** Zod schemas + validated renderer + error handling

### Phase 3: AI Integration (Week 4)
- **Week 4:** AI agent endpoint + prompt engineering + example workflows

### Phase 4: Polish (Week 5-6)
- **Week 5:** Performance + testing
- **Week 6:** Documentation + DX

**Total: 6 weeks**

---

## Risks & Mitigation

### Risk 1: A2UI/AG-UI API Changes

**Risk:** Protocols are in preview, APIs may change
**Impact:** High - Breaking changes
**Probability:** Medium
**Mitigation:**
- Lock to specific versions
- Monitor GitHub for breaking changes
- Prepare migration scripts
- Maintain abstraction layer

### Risk 2: AI Generation Quality

**Risk:** AI generates invalid A2UI specs
**Impact:** Medium - Components don't render
**Probability:** Medium
**Mitigation:**
- Extensive prompt engineering
- Zod validation catches errors
- Provide clear examples in prompts
- Iterative testing with different prompts

### Risk 3: Performance Degradation

**Risk:** Streaming + validation adds latency
**Impact:** Medium - Slower UX
**Probability:** Low
**Mitigation:**
- Profile early and often
- Optimize hot paths
- Use memoization
- Lazy load components

### Risk 4: Bundle Size

**Risk:** Dependencies increase bundle too much
**Impact:** Low - Slower load times
**Probability:** Low
**Mitigation:**
- Monitor bundle with webpack-bundle-analyzer
- Use tree-shaking
- Lazy load when possible
- Target <100KB increase

---

## Success Criteria

### Technical Criteria

- [x] A2UI + AG-UI + Zod stack integrated
- [ ] Timeline renders from A2UI spec
- [ ] Maps renders from A2UI spec
- [ ] ThreeScene renders from A2UI spec
- [ ] All props validated with Zod
- [ ] Streaming UI updates working
- [ ] Bundle size <100KB overhead
- [ ] Test coverage >90%
- [ ] Zero breaking changes

### User Experience Criteria

- [ ] User types natural language prompt
- [ ] AI streams response progressively
- [ ] UI components render correctly
- [ ] Invalid specs show helpful errors
- [ ] Loading states are clear
- [ ] End-to-end latency <2 seconds

### Business Criteria

- [ ] Demo ready for stakeholders
- [ ] Documentation complete
- [ ] Code reviewed and approved
- [ ] Production deployment ready

---

## Appendix

### A2UI Resources

- Official Site: https://a2ui.org/
- GitHub: https://github.com/google/A2UI
- Quickstart: https://a2ui.org/quickstart/

### AG-UI Resources

- Official Site: https://docs.ag-ui.com/
- GitHub: https://github.com/ag-ui-protocol/ag-ui
- CopilotKit Docs: https://www.copilotkit.ai/ag-ui

### Zod Resources

- Official Docs: https://zod.dev/
- GitHub: https://github.com/colinhacks/zod

---

**PRD Version:** 1.0
**Status:** ✅ Approved
**Next Action:** Begin Phase 1 implementation

**Approved By:** User
**Implementation Lead:** Claude (AI Development Agent)
