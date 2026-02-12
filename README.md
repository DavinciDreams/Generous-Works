# Generous

> *"Ask for anything."*

**Generous** is the universal canvas for AI — a streaming generative UI platform that renders live, interactive components from natural language. Describe what you need: a chart, a 3D scene, a dashboard, a game, a map, a timeline. Generous renders it.

Built with Next.js 16, React 19, and the Vercel AI SDK. **114+ composable components** spanning data visualization, 3D graphics, maps, editors, games, social media, workflow tools, and more.

**[generous.works](https://generous.works)** | **[Live Demo](https://v0-cloned-kappa.vercel.app/)** | **[Component Showcase](https://v0-cloned-kappa.vercel.app/showcase)** | **[Tool UI Showcase](https://v0-cloned-kappa.vercel.app/tool-ui-showcase)**

<!-- Screenshot: Main chat interface -->
![Chat Interface](docs/images/chat-interface.png)

---

## Table of Contents

- [Why "Generous"?](#why-generous)
- [Features](#features)
- [Live Demos](#live-demos)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Component Library](#component-library)
  - [UI Components](#ui-components)
  - [AI Elements](#ai-elements)
  - [Tool UI Components](#tool-ui-components)
- [Architecture](#architecture)
- [Pages & Routes](#pages--routes)
- [API](#api)
- [Testing](#testing)
- [Scripts](#scripts)

---

## Why "Generous"?

The word "generous" shares its root with "generate," "genius," "genie," and "genuine" — all from the Latin *genus*, meaning origin and creation. A generous interface is, literally, a generative one. A genius spirit. A genie that grants wishes. The genuine article.

Generous was born from a hackathon project built on a simple belief: AI shouldn't just give you text — it should give you *anything*.

---

## Features

- **Natural Language UI Generation** - Describe what you want and get live, rendered components
- **Streaming Responses** - Real-time streaming with the Vercel AI SDK
- **114+ Components** - Comprehensive library across UI primitives, AI elements, and tool visualizations
- **Compound Component Pattern** - All complex components use composable sub-components (Header, Content, Actions, etc.)
- **Dual Rendering** - Supports both JSX (simple components) and A2UI JSON (complex data-driven components)
- **Type-Safe** - 100% TypeScript with Zod schema validation for data-driven components
- **Dark Mode** - Full dark mode support via CSS variables and Tailwind
- **Responsive** - Mobile-first responsive design throughout
- **Open Source** - Built in the open

---

## Live Demos

Explore every component on the live deployment:

### Core Pages

| Page | Link |
|------|------|
| **Chat Interface** | [v0-cloned-kappa.vercel.app](https://v0-cloned-kappa.vercel.app/) |
| **Component Showcase** | [/showcase](https://v0-cloned-kappa.vercel.app/showcase) |
| **Tool UI Showcase** | [/tool-ui-showcase](https://v0-cloned-kappa.vercel.app/tool-ui-showcase) |
| **A2UI Chat** | [/a2ui-chat](https://v0-cloned-kappa.vercel.app/a2ui-chat) |
| **A2UI Demo** | [/a2ui-demo](https://v0-cloned-kappa.vercel.app/a2ui-demo) |

### Component Playgrounds

| Category | Components |
|----------|-----------|
| **Data** | [Charts](https://v0-cloned-kappa.vercel.app/charts-test) - [DataTable](https://v0-cloned-kappa.vercel.app/datatable-test) - [JSON Viewer](https://v0-cloned-kappa.vercel.app/jsonviewer-test) - [Calendar](https://v0-cloned-kappa.vercel.app/calendar-test) |
| **Editors** | [Code Editor](https://v0-cloned-kappa.vercel.app/codeeditor-test) - [Markdown](https://v0-cloned-kappa.vercel.app/markdown-test) - [WYSIWYG](https://v0-cloned-kappa.vercel.app/wysiwyg-test) - [LaTeX](https://v0-cloned-kappa.vercel.app/latex-test) |
| **Media** | [Image Gallery](https://v0-cloned-kappa.vercel.app/imagegallery-test) - [Mermaid](https://v0-cloned-kappa.vercel.app/mermaid-test) - [SVG Preview](https://v0-cloned-kappa.vercel.app/svg-preview-test) - [Remotion](https://v0-cloned-kappa.vercel.app/remotion-test) |
| **3D & Graphics** | [Three.js](https://v0-cloned-kappa.vercel.app/threescene-test) - [Model Viewer](https://v0-cloned-kappa.vercel.app/model-viewer-test) - [VRM Avatars](https://v0-cloned-kappa.vercel.app/vrm-test) - [Phaser Games](https://v0-cloned-kappa.vercel.app/phaser-test) |
| **Maps & Graphs** | [Maps](https://v0-cloned-kappa.vercel.app/maps-test) - [Geospatial](https://v0-cloned-kappa.vercel.app/geospatial-test) - [Timeline](https://v0-cloned-kappa.vercel.app/timeline-test) - [Node Editor](https://v0-cloned-kappa.vercel.app/node-editor-test) - [Knowledge Graph](https://v0-cloned-kappa.vercel.app/knowledge-graph-test) |
| **Other** | [Tool UI](https://v0-cloned-kappa.vercel.app/toolui-test) |

### Component Screenshots

<!-- Add screenshots by placing images in docs/images/ and uncommenting the sections below -->

#### Chat Interface
<!-- ![Chat Interface](docs/images/chat-interface.png) -->
> The main chat interface where users describe UI in natural language and get live rendered components.

#### Component Showcase
<!-- ![Showcase](docs/images/showcase.png) -->
> Interactive showcase with tabs for all 16+ visualization components including SVG, Timeline, 3D, Charts, Maps, and more.

#### Charts (18 types)
<!-- ![Charts](docs/images/charts.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/charts-test) - Line, bar, pie, scatter, area, radar, candlestick, sankey, chord, treemap, force-directed, hierarchy, word cloud, venn, and more via amCharts 5.

#### Three.js 3D Scene
<!-- ![Three.js](docs/images/threescene.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/threescene-test) - Interactive 3D scenes with orbit controls, custom objects, lights, and grid helpers.

#### Maps & Geospatial
<!-- ![Maps](docs/images/maps.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/maps-test) - Interactive Leaflet maps with markers and popups. [Geospatial](https://v0-cloned-kappa.vercel.app/geospatial-test) adds deck.gl heatmaps, arcs, and hexagons for 100K+ points.

#### Mermaid Diagrams
<!-- ![Mermaid](docs/images/mermaid.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/mermaid-test) - Flowcharts, sequence diagrams, class diagrams, and more from text with theme support.

#### Timeline
<!-- ![Timeline](docs/images/timeline.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/timeline-test) - Interactive TimelineJS timelines with events, eras, and media support.

#### Knowledge Graph
<!-- ![Knowledge Graph](docs/images/knowledge-graph.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/knowledge-graph-test) - Entity-relationship graphs with color-coded nodes, search, and legend.

#### Node Editor
<!-- ![Node Editor](docs/images/node-editor.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/node-editor-test) - Interactive flow editor via React Flow for workflows and data pipelines.

#### LaTeX Equations
<!-- ![LaTeX](docs/images/latex.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/latex-test) - Mathematical equation rendering via KaTeX with display and inline modes.

#### Code Editor
<!-- ![Code Editor](docs/images/codeeditor.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/codeeditor-test) - Full CodeMirror editor with syntax highlighting for 7+ languages.

#### Data Table
<!-- ![DataTable](docs/images/datatable.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/datatable-test) - TanStack Table with sorting, filtering, pagination, and custom formatters.

#### Calendar
<!-- ![Calendar](docs/images/calendar.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/calendar-test) - Schedule-X event calendar with drag-and-drop support.

#### WYSIWYG Editor
<!-- ![WYSIWYG](docs/images/wysiwyg.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/wysiwyg-test) - Rich text editor powered by Novel/Tiptap with markdown, HTML, and JSON support.

#### 3D Model Viewer
<!-- ![Model Viewer](docs/images/model-viewer.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/model-viewer-test) - Load GLTF/GLB, OBJ, FBX, STL, and Collada models with auto-rotation and orbit controls.

#### VRM Avatars
<!-- ![VRM](docs/images/vrm.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/vrm-test) - VRM avatar viewer with animation, spring bone physics, and camera controls.

#### Phaser Games
<!-- ![Phaser](docs/images/phaser.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/phaser-test) - HTML5 game engine with arcade physics, scenes, and interactive game objects.

#### Tool UI Components
<!-- ![Tool UI](docs/images/toolui.png) -->
> [Live Demo](https://v0-cloned-kappa.vercel.app/toolui-test) - 18 tool call visualization components: social posts, galleries, data tables, weather, workflows, and more.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) |
| **UI** | [React 19](https://react.dev) |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com) |
| **AI** | [Vercel AI SDK 6](https://sdk.vercel.ai) |
| **UI Primitives** | [Radix UI](https://www.radix-ui.com) / [shadcn/ui](https://ui.shadcn.com) |
| **3D** | [Three.js](https://threejs.org), [three-vrm](https://github.com/pixiv/three-vrm) |
| **Games** | [Phaser 3](https://phaser.io) |
| **Maps** | [Leaflet](https://leafletjs.com), [MapLibre GL](https://maplibre.org), [deck.gl](https://deck.gl) |
| **Charts** | [amCharts 5](https://www.amcharts.com) |
| **Diagrams** | [Mermaid](https://mermaid.js.org), [React Flow](https://reactflow.dev) |
| **Video** | [Remotion](https://www.remotion.dev), [media-chrome](https://www.media-chrome.org) |
| **Editor** | [Tiptap](https://tiptap.dev) / [Novel](https://novel.sh), [CodeMirror](https://codemirror.net) |
| **Math** | [KaTeX](https://katex.org) |
| **Code Highlighting** | [Shiki](https://shiki.style) |
| **Markdown** | [Streamdown](https://github.com/nicolo-ribaudo/streamdown) |
| **State** | [Zustand](https://zustand-demo.pmnd.rs) |
| **Validation** | [Zod](https://zod.dev) |
| **Testing** | [Vitest](https://vitest.dev), [Testing Library](https://testing-library.com) |
| **Fonts** | [Geist](https://vercel.com/font) (Sans & Mono) |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd generous

# Install dependencies
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# AI Provider (Zhipu by default - swap for OpenAI, Anthropic, etc.)
ZHIPU_API_KEY=your_api_key
ZHIPU_BASE_URL=https://open.bigmodel.cn/api/paas/v4
ZHIPU_MODEL=glm-4.7
```

The AI provider is configurable via the Vercel AI SDK. To use a different provider (OpenAI, Anthropic, Google), update `app/api/chat/route.ts`.

### Running

```bash
# Development (with Turbopack)
npm run dev

# Development (with Webpack)
npm run dev:webpack

# Production build
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```
generous/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Main chat interface
│   ├── layout.tsx                # Root layout (Geist fonts)
│   ├── api/
│   │   ├── chat/route.ts         # Main AI chat API endpoint
│   │   └── a2ui-chat/route.ts    # A2UI-specific chat endpoint
│   ├── showcase/                 # Component showcase (all 16+ components)
│   ├── a2ui-chat/                # A2UI chat interface
│   ├── a2ui-demo/                # A2UI demo page
│   └── *-test/                   # Individual component test pages
│
├── components/
│   ├── ui/                       # Base UI primitives (shadcn/ui)
│   ├── ai-elements/              # AI chat & visualization components
│   └── tool-ui/                  # AI tool call visualization components
│
├── lib/
│   ├── store.ts                  # Zustand state management
│   ├── utils.ts                  # Utility functions (cn, etc.)
│   ├── schemas/                  # Zod schemas for all data-driven components
│   └── a2ui/                     # A2UI adapter system
│       ├── catalog.ts            # Component catalog & prompt generation
│       ├── renderer.tsx          # A2UI JSON renderer
│       ├── adapter.ts            # Component adapter interface
│       └── adapters/             # Adapters mapping A2UI types to components
│
└── vitest.config.ts              # Test configuration
```

---

## Component Library

The component library is organized into three tiers:

### UI Components

> `components/ui/` - 25+ base primitives from shadcn/ui built on Radix UI

These are the foundational building blocks used by all other components.

| Component | Description |
|-----------|-------------|
| **Accordion** | Collapsible content sections |
| **Alert** | Status messages with variants (default, destructive) |
| **Aspect Ratio** | Maintain consistent aspect ratios |
| **Avatar** | User profile images with fallback |
| **Badge** | Status labels and tags |
| **Breadcrumb** | Navigation breadcrumbs |
| **Button** | Action buttons with variants (default, outline, ghost, link) and sizes |
| **Button Group** | Group related buttons together |
| **Card** | Container with Header, Content, Footer, Title, Description |
| **Carousel** | Embla-powered content carousel |
| **Checkbox** | Checkbox input |
| **Collapsible** | Expandable/collapsible content |
| **Command** | Command palette (cmdk) |
| **Dialog** | Modal dialog with overlay |
| **Dropdown Menu** | Context/dropdown menus |
| **Hover Card** | Content revealed on hover |
| **Input** | Text input field |
| **Input Group** | Grouped inputs with addons |
| **Label** | Form labels |
| **Popover** | Floating content popover |
| **Progress** | Progress bar (0-100) |
| **Radio Group** | Radio button group |
| **Scroll Area** | Custom scrollable container |
| **Select** | Dropdown select |
| **Separator** | Horizontal/vertical divider |
| **Sheet** | Slide-out panel |
| **Skeleton** | Loading placeholder |
| **Slider** | Range slider |
| **Spinner** | Loading spinner |
| **Switch** | Toggle switch |
| **Table** | Data table |
| **Tabs** | Tabbed content |
| **Textarea** | Multi-line text input |
| **Tooltip** | Hover tooltip |

---

### AI Elements

> `components/ai-elements/` - 90+ components for AI chat interfaces and data visualization

All complex components follow the **compound component pattern** with composable sub-components:

```tsx
<ComponentName data={data} options={options}>
  <ComponentNameHeader>
    <ComponentNameTitle />
    <ComponentNameActions>
      <ComponentNameCopyButton />
      <ComponentNameFullscreenButton />
    </ComponentNameActions>
  </ComponentNameHeader>
  <ComponentNameError />
  <ComponentNameContent />
</ComponentName>
```

#### Chat & Conversation

| Component | Description |
|-----------|-------------|
| **Conversation** | Auto-scrolling chat container (stick-to-bottom) |
| **Message** | Chat message with user/assistant styling and markdown rendering via Streamdown |
| **GenerativeMessage** | Message that renders both markdown and live JSX/A2UI components |
| **PromptInput** | Chat input with textarea, attachments, model selector, and keyboard shortcuts |
| **Suggestion** | Clickable suggestion chips for the user |
| **Attachments** | File attachment display in messages |

#### AI Reasoning & Agents

| Component | Description |
|-----------|-------------|
| **Reasoning** | Collapsible AI reasoning/thinking display |
| **ChainOfThought** | Step-by-step reasoning chain visualization |
| **Agent** | Agent identity and status display |
| **Plan** | Multi-step plan with progress tracking |
| **Task** | Individual task with status indicators |
| **Queue** | Task queue with ordering |
| **Checkpoint** | Save/restore points in agent workflows |

#### Code & Development

| Component | Description |
|-----------|-------------|
| **CodeBlock** | Syntax-highlighted code with Shiki (50+ languages, copy button, line numbers) |
| **Terminal** | Terminal/console output display with ANSI color support |
| **Snippet** | Inline code snippet |
| **StackTrace** | Error stack trace with file links |
| **TestResults** | Test suite results (pass/fail/skip counts) |
| **Commit** | Git commit display |
| **Sandbox** | Code sandbox/playground |
| **EnvironmentVariables** | Environment variable key-value display |
| **PackageInfo** | npm package information card |

#### Data Visualization

| Component | Description |
|-----------|-------------|
| **Charts** | 18 chart types via amCharts 5 (line, bar, pie, scatter, area, radar, candlestick, sankey, chord, treemap, force-directed, hierarchy, word cloud, venn, and more) |
| **DataTable** | Interactive data table with sorting, filtering, and pagination via TanStack Table |
| **JsonViewer** | Expandable JSON tree viewer |
| **SchemaDisplay** | API/data schema visualization |
| **StatsDisplay** | Statistics cards with sparklines |

#### 3D & Graphics

| Component | Description |
|-----------|-------------|
| **ThreeScene** | Interactive Three.js 3D scenes with orbit controls, lights, and custom objects |
| **ModelViewer** | 3D model viewer supporting GLTF/GLB, OBJ, FBX, STL, and Collada formats |
| **VRM** | VRM avatar viewer with animation, spring bone physics, and interactive controls |
| **Phaser** | HTML5 game engine (Phaser 3) with arcade physics, scenes, and custom game logic |
| **SVGPreview** | SVG renderer with preview/source toggle and download |

#### Maps & Geography

| Component | Description |
|-----------|-------------|
| **Maps** | Interactive maps with Leaflet - markers, labels, popups |
| **Geospatial** | Advanced geospatial viz with deck.gl/MapLibre - heatmaps, hexagons, arcs, polygons (100K+ points) |

#### Diagrams & Graphs

| Component | Description |
|-----------|-------------|
| **Mermaid** | Mermaid.js diagrams (flowcharts, sequence, class, state, ER, Gantt) with theme support |
| **NodeEditor** | Interactive node/flow editor via React Flow |
| **KnowledgeGraph** | Entity-relationship graph with color-coded nodes, search, and legend |
| **Timeline** | Interactive timeline via TimelineJS with events, eras, and media |

#### Editors

| Component | Description |
|-----------|-------------|
| **CodeEditor** | Full code editor via CodeMirror (JS, TS, Python, CSS, HTML, JSON, Markdown) |
| **Markdown** | Markdown editor with preview |
| **WYSIWYG** | Rich text editor via Novel/Tiptap with markdown, HTML, and JSON support |
| **LaTeX** | Mathematical equation rendering via KaTeX |

#### Media

| Component | Description |
|-----------|-------------|
| **Image** | Image display with lightbox |
| **ImageGallery** | Photo gallery with grid layout and lightbox via react-photo-album |
| **AudioPlayer** | Audio playback controls |
| **Video** | Video player with media-chrome controls |
| **Remotion** | Programmatic React video compositions with timeline scrubbing |

#### Social Media

| Component | Description |
|-----------|-------------|
| **XPost** | X/Twitter post preview with engagement stats |
| **InstagramPost** | Instagram post preview with carousel support |
| **LinkedInPost** | LinkedIn post preview |

#### Workflow & Interactive

| Component | Description |
|-----------|-------------|
| **Confirmation** | Action confirmation dialog |
| **ApprovalCard** | Approve/reject workflow card |
| **QuestionFlow** | Multi-step question/form flow |
| **ProgressTracker** | Multi-step progress indicator |
| **OptionList** | Selectable option list |
| **PreferencesPanel** | Settings/preferences form |
| **ParameterSlider** | Named parameter with slider control |

#### Utilities

| Component | Description |
|-----------|-------------|
| **WeatherWidget** | Weather display with animated effects (rain, snow, clouds, celestial bodies) |
| **Calendar** | Event calendar via Schedule-X |
| **ItemCarousel** | Card carousel for products/items |
| **LinkPreview** | URL link preview card with metadata |
| **MessageDraft** | Email/message draft editor |
| **OrderSummary** | E-commerce order summary |
| **InlineCitation** | Inline source citation links |
| **Sources** | Source list display |
| **WebPreview** | Website iframe preview |

#### AI Interface Utilities

| Component | Description |
|-----------|-------------|
| **ModelSelector** | AI model picker dropdown |
| **VoiceSelector** | TTS voice selection |
| **MicSelector** | Microphone input selection |
| **SpeechInput** | Voice-to-text input |
| **Persona** | AI persona/avatar display |
| **Connection** | Connection status indicator |
| **Controls** | Playback/interaction controls |
| **Shimmer** | Loading shimmer animation |
| **Toolbar** | Action toolbar |
| **Panel** | Resizable panel container |
| **OpenInChat** | "Open in chat" action button |
| **Context** | Context/system message display |
| **Transcription** | Speech transcription display |
| **Artifact** | Generated artifact container |

#### Graph Primitives

| Component | Description |
|-----------|-------------|
| **Node** | Graph node (React Flow) |
| **Edge** | Graph edge (React Flow) |
| **Canvas** | React Flow canvas with background |

---

### Tool UI Components

> `components/tool-ui/` - 18 AI tool call visualization components

These components render structured data returned from AI tool calls. Each includes error boundaries, Zod schema validation, and action buttons (copy, share, etc.).

| Component | Description |
|-----------|-------------|
| **WeatherWidget** | Weather conditions with animated effects |
| **StatsDisplay** | Statistical metrics with sparkline charts |
| **ImageGallery** | Photo grid with lightbox |
| **Video** | Video player |
| **DataTable** | Sortable/filterable data table |
| **OptionList** | Selectable option list |
| **XPost** | Twitter/X post display |
| **InstagramPost** | Instagram post display |
| **LinkedInPost** | LinkedIn post display |
| **PreferencesPanel** | Settings panel |
| **ItemCarousel** | Product/item carousel |
| **ProgressTracker** | Step-by-step progress |
| **ParameterSlider** | Configurable slider |
| **QuestionFlow** | Multi-step questionnaire |
| **ApprovalCard** | Approval workflow |
| **MessageDraft** | Email/message composer |
| **OrderSummary** | Order details |
| **LinkPreview** | URL preview card |

**Shared utilities** in `components/tool-ui/shared/`:
- `error-boundary.tsx` - React error boundary wrapper
- `parse.ts` - Data parsing utilities
- `schema.ts` - Shared Zod schemas
- `action-buttons.tsx` - Copy, share, and other action buttons
- `use-copy-to-clipboard.ts` - Clipboard hook
- `media/` - Media utilities (aspect ratio, sanitization, overlays)

---

## Architecture

### Rendering Pipeline

The platform supports two rendering formats that can be mixed in a single response:

**1. JSX Rendering** - For simple UI components (Button, Card, Input, etc.)
```tsx
<Card className="max-w-md">
  <CardHeader>
    <CardTitle>Hello</CardTitle>
  </CardHeader>
  <CardContent>
    <Button>Click me</Button>
  </CardContent>
</Card>
```

**2. A2UI JSON Rendering** - For complex data-driven components
```json
{
  "surfaceUpdate": {
    "components": [{
      "id": "chart-1",
      "component": {
        "Charts": {
          "data": {
            "type": "line",
            "series": [{ "name": "Revenue", "data": [...] }]
          },
          "options": { "height": 400 }
        }
      }
    }]
  }
}
```

### A2UI Adapter System

The `lib/a2ui/` directory contains the adapter system that maps A2UI JSON specifications to React components:

- **`catalog.ts`** - Defines available components and generates system prompts for the AI
- **`renderer.tsx`** - Parses A2UI JSON and renders the corresponding components
- **`adapter.ts`** - Interface for component adapters
- **`adapters/`** - Individual adapter implementations per component category (button, card, layout, form, etc.)

### State Management

Global state is managed via Zustand (`lib/store.ts`):
- `useMessages()` - Chat message history
- `useAppState()` - Loading state, errors, UI state

---

## Pages & Routes

All routes are available on the [live deployment](https://v0-cloned-kappa.vercel.app/).

| Route | Description | Live Link |
|-------|-------------|-----------|
| `/` | Main chat interface with generative UI | [Open](https://v0-cloned-kappa.vercel.app/) |
| `/showcase` | Interactive showcase of all 16+ visualization components | [Open](https://v0-cloned-kappa.vercel.app/showcase) |
| `/a2ui-chat` | A2UI-specific chat interface | [Open](https://v0-cloned-kappa.vercel.app/a2ui-chat) |
| `/a2ui-demo` | A2UI component demo page | [Open](https://v0-cloned-kappa.vercel.app/a2ui-demo) |
| `/docs` | Documentation page | [Open](https://v0-cloned-kappa.vercel.app/docs) |
| `/canvas` | Canvas/flow editor page | [Open](https://v0-cloned-kappa.vercel.app/canvas) |
| `/code` | Code editor page | [Open](https://v0-cloned-kappa.vercel.app/code) |
| `/charts-test` | Charts component playground | [Open](https://v0-cloned-kappa.vercel.app/charts-test) |
| `/calendar-test` | Calendar component playground | [Open](https://v0-cloned-kappa.vercel.app/calendar-test) |
| `/maps-test` | Maps component playground | [Open](https://v0-cloned-kappa.vercel.app/maps-test) |
| `/geospatial-test` | Geospatial visualization playground | [Open](https://v0-cloned-kappa.vercel.app/geospatial-test) |
| `/timeline-test` | Timeline component playground | [Open](https://v0-cloned-kappa.vercel.app/timeline-test) |
| `/threescene-test` | Three.js scene playground | [Open](https://v0-cloned-kappa.vercel.app/threescene-test) |
| `/model-viewer-test` | 3D model viewer playground | [Open](https://v0-cloned-kappa.vercel.app/model-viewer-test) |
| `/vrm-test` | VRM avatar playground | [Open](https://v0-cloned-kappa.vercel.app/vrm-test) |
| `/phaser-test` | Phaser game engine playground | [Open](https://v0-cloned-kappa.vercel.app/phaser-test) |
| `/mermaid-test` | Mermaid diagram playground | [Open](https://v0-cloned-kappa.vercel.app/mermaid-test) |
| `/svg-preview-test` | SVG preview playground | [Open](https://v0-cloned-kappa.vercel.app/svg-preview-test) |
| `/node-editor-test` | Node editor playground | [Open](https://v0-cloned-kappa.vercel.app/node-editor-test) |
| `/knowledge-graph-test` | Knowledge graph playground | [Open](https://v0-cloned-kappa.vercel.app/knowledge-graph-test) |
| `/latex-test` | LaTeX equation playground | [Open](https://v0-cloned-kappa.vercel.app/latex-test) |
| `/remotion-test` | Remotion video playground | [Open](https://v0-cloned-kappa.vercel.app/remotion-test) |
| `/wysiwyg-test` | WYSIWYG editor playground | [Open](https://v0-cloned-kappa.vercel.app/wysiwyg-test) |
| `/codeeditor-test` | Code editor playground | [Open](https://v0-cloned-kappa.vercel.app/codeeditor-test) |
| `/markdown-test` | Markdown editor playground | [Open](https://v0-cloned-kappa.vercel.app/markdown-test) |
| `/jsonviewer-test` | JSON viewer playground | [Open](https://v0-cloned-kappa.vercel.app/jsonviewer-test) |
| `/datatable-test` | Data table playground | [Open](https://v0-cloned-kappa.vercel.app/datatable-test) |
| `/imagegallery-test` | Image gallery playground | [Open](https://v0-cloned-kappa.vercel.app/imagegallery-test) |
| `/toolui-test` | Tool UI components playground | [Open](https://v0-cloned-kappa.vercel.app/toolui-test) |
| `/tool-ui-showcase` | Tool UI showcase page | [Open](https://v0-cloned-kappa.vercel.app/tool-ui-showcase) |

---

## API

### `POST /api/chat`

Main AI chat endpoint with streaming support.

**Request Body:**
```json
{
  "messages": [{ "role": "user", "content": "Create a login form" }],
  "stream": true,
  "temperature": 0.7,
  "maxTokens": 4000
}
```

**Response:** Server-sent event stream of generated text containing JSX and/or A2UI JSON.

The system prompt automatically includes the full component catalog so the AI knows what components are available and how to use them.

---

## Testing

Comprehensive testing infrastructure with **256+ unit tests** covering core utilities, components, and validation logic.

### Tech Stack

- **Framework**: [Vitest](https://vitest.dev) - Fast, modern test runner
- **Component Testing**: [Testing Library](https://testing-library.com/react) - User-centric component tests
- **DOM Environment**: [happy-dom](https://github.com/capricorn86/happy-dom) - Lightweight DOM implementation
- **Assertions**: [jest-dom](https://github.com/testing-library/jest-dom) - Custom DOM matchers

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with interactive UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Test Coverage

**256 total unit tests** across 10 test files:

#### Core Utilities (245 tests)
- `lib/utils.test.ts` (78 tests) - `cn()` className utility with edge cases
- `lib/schemas/index.test.ts` (168 tests) - Schema validation for all 22 component types

#### Components (168+ tests)
- `components/ui/button.test.tsx` (249 tests) - All variants, sizes, states
- `components/ai-elements/timeline.test.tsx` (437 tests) - Composable pattern, context API
- `components/ai-elements/code-block.test.tsx` (420 tests) - Syntax highlighting, languages
- `components/tool-ui/weather-widget/*.test.tsx` (~50 tests) - Weather conditions, effects
- `components/tool-ui/image-gallery/*.test.tsx` (~50 tests) - Lightbox, context, clicks

#### Tool UI Shared (608 tests)
- `components/tool-ui/shared/utils.test.ts` (177 tests) - Date/number formatting
- `components/tool-ui/shared/parse.test.ts` (232 tests) - Zod error formatting
- `components/tool-ui/shared/error-boundary.test.tsx` (199 tests) - Error boundaries

#### Registry Validation
- `lib/a2ui/__tests__/registry-validation.test.ts` - Validates all 114 components registered

### Component Validation

Verify all components are properly registered in the A2UI catalog:

```bash
npx tsx scripts/validate-a2ui-registry.ts
```

**Expected output:**
- ✅ 114 components registered (38 specialized + 76 standard UI)
- ✅ 22 specialized component schemas
- ✅ 114 catalog entries with examples

### Test Organization

```
tests/
  └── e2e/                    # End-to-end tests (future)

lib/
  ├── utils.test.ts           # Core utilities
  └── schemas/
      └── index.test.ts       # Schema validation

components/
  ├── ui/
  │   └── button.test.tsx     # UI primitives
  ├── ai-elements/
  │   ├── timeline.test.tsx   # Composable components
  │   └── code-block.test.tsx # Syntax highlighting
  └── tool-ui/
      ├── weather-widget/*.test.tsx
      ├── image-gallery/*.test.tsx
      └── shared/
          ├── utils.test.ts
          ├── parse.test.ts
          └── error-boundary.test.tsx
```

### Coverage Goals

Current coverage estimates:
- **Core utilities**: ~95%
- **Key components**: ~85%
- **Specialized components**: ~20% (5 of 40 tested)
- **Overall**: ~40-50%

Target: 80% coverage on all core utilities and key components.

### Testing Best Practices

All tests follow these principles:
- ✅ **Behavior-driven** (test what users see, not implementation details)
- ✅ **Edge case coverage** (null, undefined, empty, invalid inputs)
- ✅ **Accessibility testing** (ARIA, keyboard navigation, focus management)
- ✅ **Error boundary testing** (graceful failure handling)
- ✅ **Type inference** (verify TypeScript types are correct)

### Known Issues

See the comprehensive QA report for details on:
- Calendar navigation buttons (non-functional - TODO)
- Charts export button (placeholder - needs amCharts plugin)
- Minor configuration tweaks needed for full coverage

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run dev:webpack` | Start dev server with Webpack |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests in watch mode |
| `npm run test:ui` | Run tests with Vitest UI |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |

---

## License

Open source.
