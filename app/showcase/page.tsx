"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

// Import new components
import {
  KnowledgeGraph,
  KnowledgeGraphActions,
  KnowledgeGraphContent,
  KnowledgeGraphCopyButton,
  KnowledgeGraphError,
  KnowledgeGraphFullscreenButton,
  KnowledgeGraphHeader,
  KnowledgeGraphLegend,
  KnowledgeGraphSearch,
  KnowledgeGraphTitle,
} from "@/components/ai-elements/knowledge-graph";
import type { KnowledgeGraphData } from "@/components/ai-elements/knowledge-graph";

import {
  NodeEditor,
  NodeEditorActions,
  NodeEditorContent,
  NodeEditorCopyButton,
  NodeEditorError,
  NodeEditorFullscreenButton,
  NodeEditorHeader,
  NodeEditorTitle,
} from "@/components/ai-elements/node-editor";
import type { NodeEditorData } from "@/components/ai-elements/node-editor";

import {
  SVGPreview,
  SVGPreviewActions,
  SVGPreviewContent,
  SVGPreviewCopyButton,
  SVGPreviewDownloadButton,
  SVGPreviewError,
  SVGPreviewHeader,
  SVGPreviewModeToggle,
  SVGPreviewTitle,
} from "@/components/ai-elements/svg-preview";

import {
  Timeline,
  TimelineActions,
  TimelineContent,
  TimelineCopyButton,
  TimelineError,
  TimelineFullscreenButton,
  TimelineHeader,
  TimelineTitle,
} from "@/components/ai-elements/timeline-client";
import type { TimelineProps } from "@/components/ai-elements/timeline-client";

import {
  Latex,
  LatexActions,
  LatexContent,
  LatexCopyButton,
  LatexError,
  LatexFullscreenButton,
  LatexHeader,
  LatexTitle,
} from "@/components/ai-elements/latex-client";
import type { LatexData } from "@/components/ai-elements/latex-client";

import {
  Maps,
  MapsActions,
  MapsContent,
  MapsCopyButton,
  MapsFullscreenButton,
  MapsHeader,
  MapsTitle,
} from "@/components/ai-elements/maps-client";
import type { MapsData } from "@/components/ai-elements/maps-client";

import {
  ThreeScene,
  ThreeSceneActions,
  ThreeSceneContent,
  ThreeSceneCopyButton,
  ThreeSceneFullscreenButton,
  ThreeSceneResetButton,
  ThreeSceneHeader,
  ThreeSceneTitle,
} from "@/components/ai-elements/threescene-client";
import type { ThreeSceneData } from "@/components/ai-elements/threescene-client";

import {
  ModelViewer,
  ModelViewerActions,
  ModelViewerContent,
  ModelViewerCopyButton,
  ModelViewerFullscreenButton,
  ModelViewerResetButton,
  ModelViewerHeader,
  ModelViewerTitle,
} from "@/components/ai-elements/model-viewer-client";
import type { ModelViewerData } from "@/components/ai-elements/model-viewer-client";

import {
  Phaser,
  PhaserActions,
  PhaserContent,
  PhaserCopyButton,
  PhaserFullscreenButton,
  PhaserHeader,
  PhaserPlayButton,
  PhaserResetButton,
  PhaserTitle,
} from "@/components/ai-elements/phaser";
import type { PhaserData } from "@/components/ai-elements/phaser";

import {
  Mermaid,
  MermaidActions,
  MermaidContent,
  MermaidCopyButton,
  MermaidDownloadButton,
  MermaidFullscreenButton,
  MermaidHeader,
  MermaidModeToggle,
  MermaidTitle,
} from "@/components/ai-elements/mermaid";
import type { MermaidData } from "@/components/ai-elements/mermaid";

import {
  Remotion,
  RemotionActions,
  RemotionContent,
  RemotionCopyButton,
  RemotionFullscreenButton,
  RemotionHeader,
  RemotionPlayButton,
  RemotionResetButton,
  RemotionTimeline,
  RemotionTitle,
} from "@/components/ai-elements/remotion";
import type { RemotionData } from "@/components/ai-elements/remotion";

import {
  Charts,
  ChartsActions,
  ChartsContent,
  ChartsCopyButton,
  ChartsFullscreenButton,
  ChartsHeader,
  ChartsTitle,
  ChartsLegend,
} from "@/components/ai-elements/charts";
import type { ChartsData } from "@/components/ai-elements/charts";

import {
  Geospatial,
  GeospatialActions,
  GeospatialContent,
  GeospatialCopyButton,
  GeospatialFullscreenButton,
  GeospatialHeader,
  GeospatialLayerToggle,
  GeospatialLegend,
  GeospatialTitle,
} from "@/components/ai-elements/geospatial";
import type { GeospatialData } from "@/components/ai-elements/geospatial";

import {
  WYSIWYG,
  WYSIWYGActions,
  WYSIWYGContent,
  WYSIWYGCopyButton,
  WYSIWYGExportButton,
  WYSIWYGHeader,
  WYSIWYGTitle,
} from "@/components/ai-elements/wysiwyg";
import type { WYSIWYGData } from "@/components/ai-elements/wysiwyg";

import {
  VRM,
  VRMActions,
  VRMAnimationToggle,
  VRMContent,
  VRMControls,
  VRMCopyButton,
  VRMFullscreenButton,
  VRMHeader,
  VRMResetButton,
  VRMTitle,
} from "@/components/ai-elements/vrm";
import type { VRMData } from "@/components/ai-elements/vrm";

import { ToolUI } from "@/components/ai-elements/toolui";
import type { ToolUIData } from "@/lib/schemas/toolui.schema";

// Sample data for components
const sampleSVG = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:rgb(59,130,246);stop-opacity:1" />
      <stop offset="100%" style="stop-color:rgb(139,92,246);stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="300" height="200" fill="url(#grad1)" rx="10"/>
  <circle cx="150" cy="100" r="50" fill="white" opacity="0.3"/>
  <text x="150" y="110" text-anchor="middle" fill="white" font-size="24" font-weight="bold">
    SVG Preview
  </text>
</svg>`;

const sampleTimeline: TimelineProps = {
  title: "Product Development Timeline",
  events: [
    {
      id: "kickoff",
      title: "Project Kickoff",
      description: "Initial planning and team formation",
      start: { year: 2023, month: 1, day: 15, precision: "day" },
      importance: 3,
      category: "Planning",
    },
    {
      id: "alpha",
      title: "Alpha Release",
      description: "First working prototype completed",
      start: { year: 2023, month: 4, day: 1, precision: "day" },
      importance: 4,
      category: "Release",
    },
    {
      id: "beta",
      title: "Beta Launch",
      description: "Public beta testing begins",
      start: { year: 2023, month: 8, day: 15, precision: "day" },
      end: { year: 2023, month: 12, precision: "month" },
      importance: 4,
      category: "Release",
    },
    {
      id: "v1",
      title: "Version 1.0",
      description: "Official product launch!",
      start: { year: 2024, month: 1, day: 1, precision: "day" },
      importance: 5,
      category: "Release",
      style: { card: "rounded" },
    },
  ],
};

const sampleNodeEditor: NodeEditorData = {
  nodes: [
    {
      id: "1",
      position: { x: 100, y: 100 },
      data: { label: "User Input" },
      type: "input",
    },
    {
      id: "2",
      position: { x: 300, y: 100 },
      data: { label: "Process Data" },
    },
    {
      id: "3",
      position: { x: 500, y: 50 },
      data: { label: "Success Path" },
    },
    {
      id: "4",
      position: { x: 500, y: 150 },
      data: { label: "Error Handler" },
    },
    {
      id: "5",
      position: { x: 700, y: 100 },
      data: { label: "Output" },
      type: "output",
    },
  ],
  edges: [
    { id: "e1-2", source: "1", target: "2" },
    { id: "e2-3", source: "2", target: "3", label: "Valid" },
    { id: "e2-4", source: "2", target: "4", label: "Error" },
    { id: "e3-5", source: "3", target: "5" },
    { id: "e4-5", source: "4", target: "5" },
  ],
};

const sampleKnowledgeGraph: KnowledgeGraphData = {
  entities: [
    {
      id: "ai",
      label: "Artificial Intelligence",
      type: "concept",
      description: "Machine intelligence",
    },
    {
      id: "ml",
      label: "Machine Learning",
      type: "concept",
      description: "Learning from data",
    },
    {
      id: "dl",
      label: "Deep Learning",
      type: "concept",
      description: "Neural networks",
    },
    {
      id: "nlp",
      label: "Natural Language Processing",
      type: "concept",
      description: "Language understanding",
    },
    {
      id: "cv",
      label: "Computer Vision",
      type: "concept",
      description: "Image understanding",
    },
    {
      id: "openai",
      label: "OpenAI",
      type: "organization",
      description: "AI research company",
    },
    {
      id: "google",
      label: "Google",
      type: "organization",
      description: "Tech company",
    },
  ],
  relationships: [
    { id: "r1", source: "ml", target: "ai", type: "subset_of", label: "part of" },
    { id: "r2", source: "dl", target: "ml", type: "subset_of", label: "part of" },
    { id: "r3", source: "nlp", target: "ai", type: "applies", label: "applies" },
    { id: "r4", source: "cv", target: "ai", type: "applies", label: "applies" },
    {
      id: "r5",
      source: "openai",
      target: "ai",
      type: "researches",
      label: "researches",
    },
    {
      id: "r6",
      source: "google",
      target: "ai",
      type: "researches",
      label: "researches",
    },
  ],
};

const sampleLatex: LatexData = {
  equations: [
    {
      equation: "E = mc^2",
      displayMode: true,
      label: "Einstein's mass-energy equivalence",
    },
    {
      equation: "\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\epsilon_0}",
      displayMode: true,
      label: "Gauss's law",
    },
    {
      equation:
        "\\int_a^b f(x) \\, dx = F(b) - F(a) \\quad \\text{where } F'(x) = f(x)",
      displayMode: true,
      label: "Fundamental theorem of calculus",
    },
  ],
};

const sampleMaps: MapsData = {
  center: {
    longitude: -122.4194,
    latitude: 37.7749,
  },
  zoom: 12,
  markers: [
    {
      id: "marker1",
      coordinates: {
        longitude: -122.4194,
        latitude: 37.7749,
      },
      color: "#ef4444",
      label: "San Francisco",
    },
    {
      id: "marker2",
      coordinates: {
        longitude: -122.4083,
        latitude: 37.7833,
      },
      color: "#3b82f6",
      label: "Golden Gate Park",
    },
    {
      id: "marker3",
      coordinates: {
        longitude: -122.3959,
        latitude: 37.7937,
      },
      color: "#10b981",
      label: "Fisherman's Wharf",
    },
  ],
};

const sampleModelViewer: ModelViewerData = {
  url: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb",
  format: "glb",
  scale: 0.5,
};

const samplePhaser: PhaserData = {
  config: {
    width: 800,
    height: 600,
    backgroundColor: "#2d2d2d",
    physics: {
      default: "arcade",
    },
  },
  scenes: [
    {
      key: "main",
      create: `
        scene.add.text(400, 100, 'Phaser Game Demo', {
          fontSize: '48px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        scene.add.text(400, 200, 'Interactive HTML5 game engine', {
          fontSize: '24px',
          color: '#cccccc'
        }).setOrigin(0.5);

        const circle = scene.add.circle(400, 350, 60, 0x00ff88);

        scene.add.text(400, 500, 'Click the green circle!', {
          fontSize: '18px',
          color: '#888888'
        }).setOrigin(0.5);

        circle.setInteractive();
        circle.on('pointerdown', function() {
          circle.setFillStyle(0xff0088);
        });
        circle.on('pointerup', function() {
          circle.setFillStyle(0x00ff88);
        });
      `,
    },
  ],
};

const sampleMermaid: MermaidData = {
  diagram: `graph TB
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> E[Fix Bug]
    E --> F[Test Again]
    F --> B
    C --> G[Deploy]
    G --> H[Monitor]
    H --> I{Issues?}
    I -->|Yes| D
    I -->|No| J[Success!]

    style A fill:#90EE90
    style J fill:#90EE90
    style D fill:#FFB6C1
    style G fill:#87CEEB`,
  theme: "default",
};

const sampleRemotion: RemotionData = {
  composition: {
    type: "TextAnimation",
    width: 1920,
    height: 1080,
    fps: 30,
    durationInFrames: 90,
    props: {
      text: "Programmatic Video with React",
      color: "#ffffff",
      fontSize: 70,
      backgroundColor: "#0066ff",
    },
  },
};

const sampleCharts: ChartsData = {
  type: "sankey",
  title: "Energy Flow Diagram",
  sankeyNodes: [
    { id: "coal", name: "Coal" },
    { id: "gas", name: "Natural Gas" },
    { id: "nuclear", name: "Nuclear" },
    { id: "renewables", name: "Renewables" },
    { id: "electricity", name: "Electricity" },
    { id: "heat", name: "Heat" },
    { id: "industrial", name: "Industrial" },
    { id: "residential", name: "Residential" },
    { id: "commercial", name: "Commercial" },
  ],
  sankeyLinks: [
    { from: "coal", to: "electricity", value: 30 },
    { from: "coal", to: "heat", value: 15 },
    { from: "gas", to: "electricity", value: 25 },
    { from: "gas", to: "heat", value: 20 },
    { from: "nuclear", to: "electricity", value: 20 },
    { from: "renewables", to: "electricity", value: 15 },
    { from: "electricity", to: "industrial", value: 35 },
    { from: "electricity", to: "residential", value: 30 },
    { from: "electricity", to: "commercial", value: 25 },
    { from: "heat", to: "industrial", value: 15 },
    { from: "heat", to: "residential", value: 20 },
  ],
};

const sampleGeospatial: GeospatialData = {
  center: { lng: -122.4194, lat: 37.7749 },
  zoom: 11,
  layers: [
    {
      id: "heatmap-layer",
      type: "heatmap",
      data: [
        { lng: -122.45, lat: 37.78, value: 100 },
        { lng: -122.43, lat: 37.77, value: 80 },
        { lng: -122.41, lat: 37.79, value: 120 },
        { lng: -122.39, lat: 37.76, value: 95 },
        { lng: -122.42, lat: 37.75, value: 110 },
      ],
      style: {
        color: ["#0000ff", "#00ff00", "#ffff00", "#ff0000"],
        opacity: 0.6,
      },
    },
  ],
  basemap: "dark",
};

const sampleWYSIWYG: WYSIWYGData = {
  content: `# Welcome to WYSIWYG Editor

This is a **rich text editor** powered by Novel and Tiptap.

## Features

- **Bold** and *italic* text
- Ordered and unordered lists
- Code blocks
- And much more!

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> This is a blockquote with **formatting**.`,
  format: "markdown",
  editable: false,
};

const sampleVRM: VRMData = {
  modelUrl: "https://pixiv.github.io/three-vrm/packages/three-vrm/examples/models/VRM1_Constraint_Twist_Sample.vrm",
  camera: {
    position: { x: 0, y: 1.5, z: 2 },
    target: { x: 0, y: 1.5, z: 0 },
  },
  lighting: {
    ambient: 0.5,
    directional: {
      color: "#ffffff",
      intensity: 1.0,
    },
  },
  background: "#1a1a1a",
};

const sampleToolUI: ToolUIData = {
  type: "x-post" as const,
  data: {
    id: "1",
    author: {
      name: "Claude AI",
      handle: "anthropic",
      avatarUrl: "https://pbs.twimg.com/profile_images/1730224114344218624/lEvxqKhS_400x400.jpg",
      verified: true,
    },
    text: "Just integrated 18 new UI components from @assistant-ui/tool-ui! 🎉\n\nNow supporting social posts, image galleries, video players, data tables, workflow components, and more. The future of AI interfaces is composable! ✨",
    stats: {
      likes: 247,
      isLiked: false,
      isReposted: false,
    },
    createdAt: new Date().toISOString(),
  },
};

export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState("svg");
  const [sampleThreeScene, setSampleThreeScene] = useState<ThreeSceneData | null>(null);

  useEffect(() => {
    // Only create 3D scene when the tab is active
    if (activeTab !== "threescene" || sampleThreeScene) return;

    let cancelled = false;

    // Create 3D objects only on client
    const createObjects = async () => {
      const THREE = await import("three");

      // Create a rotating cube
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        metalness: 0.3,
        roughness: 0.4,
      });
      const cube = new THREE.Mesh(geometry, material);

      // Create a sphere
      const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0x4ecdc4,
        metalness: 0.7,
        roughness: 0.3,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      if (cancelled) {
        return;
      }

      setSampleThreeScene({
        camera: {
          type: "perspective",
          position: { x: 4, y: 4, z: 4 },
          fov: 75,
        },
        lights: [
          {
            type: "ambient",
            color: 0xffffff,
            intensity: 0.6,
          },
          {
            type: "directional",
            color: 0xffffff,
            intensity: 0.8,
            position: { x: 5, y: 10, z: 7.5 },
          },
        ],
        background: 0x1a1a1a,
        objects: [
          {
            id: "cube",
            object: cube,
            position: { x: -1.5, y: 0, z: 0 },
            rotation: { x: 0.5, y: 0.5, z: 0 },
          },
          {
            id: "sphere",
            object: sphere,
            position: { x: 1.5, y: 0, z: 0 },
          },
        ],
      });
    };

    createObjects();

    return () => {
      cancelled = true;
    };
  }, [activeTab, sampleThreeScene]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-2 font-bold text-4xl">
            Component Showcase
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore 16 interactive AI elements: SVG Preview, Timeline, Node Editor,
            Knowledge Graph, LaTeX, Maps, Three.js Scenes, 3D Model Viewer,
            Phaser Games, Mermaid Diagrams, Remotion Videos, Charts, Geospatial,
            WYSIWYG Editor, VRM Avatars, and Tool UI
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-16">
            <TabsTrigger value="svg">SVG</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="node-editor">Nodes</TabsTrigger>
            <TabsTrigger value="knowledge-graph">Graph</TabsTrigger>
            <TabsTrigger value="latex">LaTeX</TabsTrigger>
            <TabsTrigger value="maps">Maps</TabsTrigger>
            <TabsTrigger value="threescene">3D</TabsTrigger>
            <TabsTrigger value="model-viewer">Models</TabsTrigger>
            <TabsTrigger value="phaser">Phaser</TabsTrigger>
            <TabsTrigger value="mermaid">Mermaid</TabsTrigger>
            <TabsTrigger value="remotion">Remotion</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="geospatial">Geo</TabsTrigger>
            <TabsTrigger value="wysiwyg">Editor</TabsTrigger>
            <TabsTrigger value="vrm">VRM</TabsTrigger>
            <TabsTrigger value="toolui">Tools</TabsTrigger>
          </TabsList>

          {/* SVG Preview Tab */}
          <TabsContent value="svg" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SVG Preview Component</CardTitle>
                <CardDescription>
                  Display and interact with SVG graphics. Toggle between preview
                  and source code modes, copy to clipboard, or download as a
                  file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "svg" && (
                  <SVGPreview svg={sampleSVG} title="Gradient Example">
                    <SVGPreviewHeader>
                      <SVGPreviewTitle />
                      <SVGPreviewActions>
                        <SVGPreviewModeToggle />
                        <SVGPreviewCopyButton />
                        <SVGPreviewDownloadButton />
                      </SVGPreviewActions>
                    </SVGPreviewHeader>
                    <SVGPreviewError />
                    <SVGPreviewContent />
                  </SVGPreview>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Switch between preview and source code modes</li>
                  <li>Copy SVG source to clipboard</li>
                  <li>Download SVG as a file</li>
                  <li>Inline or isolated (iframe) rendering</li>
                  <li>Validates SVG markup and shows errors</li>
                  <li>Supports custom dimensions</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Component</CardTitle>
                <CardDescription>
                  Zoomable HistropediaJS timelines: picture cards stacked by
                  importance, coloured by category, with periods and eras.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "timeline" && (
                  <Timeline {...sampleTimeline}>
                    <TimelineHeader>
                      <TimelineTitle />
                      <TimelineActions>
                        <TimelineCopyButton />
                        <TimelineFullscreenButton />
                      </TimelineActions>
                    </TimelineHeader>
                    <TimelineContent />
                  </Timeline>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>TimelineJS integration with full feature support</li>
                  <li>Events with start and end dates</li>
                  <li>Media support (images, videos, embeds)</li>
                  <li>Eras for labeling time periods</li>
                  <li>Customizable options (position, scale, zoom)</li>
                  <li>Copy timeline data and fullscreen mode</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Node Editor Tab */}
          <TabsContent value="node-editor" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Node Editor Component</CardTitle>
                <CardDescription>
                  Build interactive flow diagrams and node-based editors using
                  React Flow. Perfect for workflows, state machines, and data
                  pipelines.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "node-editor" && (
                  <NodeEditor data={sampleNodeEditor}>
                    <NodeEditorHeader>
                      <NodeEditorTitle />
                      <NodeEditorActions>
                        <NodeEditorCopyButton />
                        <NodeEditorFullscreenButton />
                      </NodeEditorActions>
                    </NodeEditorHeader>
                    <NodeEditorError />
                    <NodeEditorContent />
                  </NodeEditor>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>React Flow integration with full customization</li>
                  <li>Interactive node editing (drag, connect, delete)</li>
                  <li>Pan, zoom, and fit view controls</li>
                  <li>Custom node and edge types support</li>
                  <li>MiniMap and controls components</li>
                  <li>Copy flow data and fullscreen mode</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Graph Tab */}
          <TabsContent value="knowledge-graph" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Graph Component</CardTitle>
                <CardDescription>
                  Visualize entity-relationship graphs with color-coded nodes and
                  interactive search. Perfect for showing connections between
                  concepts, people, and organizations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "knowledge-graph" && (
                  <KnowledgeGraph data={sampleKnowledgeGraph} title="AI Concepts">
                    <KnowledgeGraphHeader>
                      <KnowledgeGraphTitle />
                      <KnowledgeGraphActions>
                        <KnowledgeGraphSearch />
                        <KnowledgeGraphCopyButton />
                        <KnowledgeGraphFullscreenButton />
                      </KnowledgeGraphActions>
                    </KnowledgeGraphHeader>
                    <KnowledgeGraphError />
                    <KnowledgeGraphContent />
                    <KnowledgeGraphLegend />
                  </KnowledgeGraph>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>
                    Entity types: person, organization, concept, location, event,
                    document
                  </li>
                  <li>Color-coded nodes by entity type</li>
                  <li>Interactive search and filtering</li>
                  <li>Customizable color schemes</li>
                  <li>Legend showing entity types</li>
                  <li>Relationship labels and connections</li>
                  <li>Copy graph data and fullscreen mode</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LaTeX Tab */}
          <TabsContent value="latex" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>LaTeX Component</CardTitle>
                <CardDescription>
                  Render beautiful mathematical equations using KaTeX. Perfect for
                  displaying formulas, theorems, and mathematical notation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "latex" && (
                  <Latex data={sampleLatex}>
                    <LatexHeader>
                      <LatexTitle>Mathematical Equations</LatexTitle>
                      <LatexActions>
                        <LatexCopyButton />
                        <LatexFullscreenButton />
                      </LatexActions>
                    </LatexHeader>
                    <LatexContent />
                  </Latex>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Fast rendering with KaTeX</li>
                  <li>Display mode (block) and inline mode</li>
                  <li>Support for multiple equations</li>
                  <li>Equation labels and descriptions</li>
                  <li>Custom macros and options</li>
                  <li>Error handling for invalid LaTeX</li>
                  <li>Copy equation source and fullscreen mode</li>
                  <li>MathML and HTML output support</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maps Tab */}
          <TabsContent value="maps" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Maps Component</CardTitle>
                <CardDescription>
                  Display interactive maps with markers using Leaflet. Perfect for
                  showing locations, routes, and geographic data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "maps" && (
                  <Maps data={sampleMaps}>
                    <MapsHeader>
                      <MapsTitle>San Francisco</MapsTitle>
                      <MapsActions>
                        <MapsCopyButton />
                        <MapsFullscreenButton />
                      </MapsActions>
                    </MapsHeader>
                    <MapsContent />
                  </Maps>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Interactive map with Leaflet</li>
                  <li>Pan, zoom, and navigation controls</li>
                  <li>Custom colored markers</li>
                  <li>Marker labels and popups</li>
                  <li>OpenStreetMap tiles</li>
                  <li>Center and zoom control</li>
                  <li>Copy map data and fullscreen mode</li>
                  <li>Programmatic map control via ref</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ThreeScene Tab */}
          <TabsContent value="threescene" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Three.js Scene Component</CardTitle>
                <CardDescription>
                  Render interactive 3D scenes with Three.js. Perfect for
                  visualizing 3D models, data, and interactive graphics.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "threescene" && sampleThreeScene ? (
                  <ThreeScene
                    data={sampleThreeScene}
                    options={{
                      height: 500,
                      enableControls: true,
                      autoRotate: false,
                      gridHelper: true,
                      axesHelper: true,
                      antialias: true,
                    }}
                  >
                    <ThreeSceneHeader>
                      <ThreeSceneTitle>Interactive 3D Scene</ThreeSceneTitle>
                      <ThreeSceneActions>
                        <ThreeSceneResetButton />
                        <ThreeSceneCopyButton />
                        <ThreeSceneFullscreenButton />
                      </ThreeSceneActions>
                    </ThreeSceneHeader>
                    <ThreeSceneContent />
                  </ThreeScene>
                ) : activeTab === "threescene" ? (
                  <div className="flex h-[500px] items-center justify-center text-muted-foreground">
                    Loading 3D scene...
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Three.js integration with WebGL rendering</li>
                  <li>OrbitControls for camera manipulation</li>
                  <li>Custom 3D objects and meshes</li>
                  <li>Multiple light types (ambient, directional, point, spot)</li>
                  <li>Grid and axes helpers</li>
                  <li>Auto-rotation and animation support</li>
                  <li>Reset camera and fullscreen mode</li>
                  <li>Customizable background and rendering options</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ModelViewer Tab */}
          <TabsContent value="model-viewer" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>3D Model Viewer Component</CardTitle>
                <CardDescription>
                  Load and view 3D models in various formats (GLTF, OBJ, FBX, STL,
                  Collada). Perfect for displaying product models, architectural
                  visualizations, and 3D assets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "model-viewer" && (
                  <ModelViewer
                    data={sampleModelViewer}
                    options={{
                      height: 500,
                      enableControls: true,
                      autoRotate: true,
                      autoRotateSpeed: 1.0,
                      showGrid: true,
                      showAxes: false,
                      antialias: true,
                    }}
                  >
                    <ModelViewerHeader>
                      <ModelViewerTitle>Duck Model (GLB)</ModelViewerTitle>
                      <ModelViewerActions>
                        <ModelViewerResetButton />
                        <ModelViewerCopyButton />
                        <ModelViewerFullscreenButton />
                      </ModelViewerActions>
                    </ModelViewerHeader>
                    <ModelViewerContent />
                  </ModelViewer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Support for 5 3D formats: GLTF/GLB, OBJ, FBX, STL, DAE</li>
                  <li>Interactive OrbitControls (rotate, pan, zoom)</li>
                  <li>Auto-rotation with configurable speed</li>
                  <li>Grid and axes helpers for orientation</li>
                  <li>Reset camera to initial position</li>
                  <li>Copy model data and fullscreen mode</li>
                  <li>Automatic model centering and scaling</li>
                  <li>Loading states and error handling</li>
                  <li>Proper memory cleanup on unmount</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Phaser Tab */}
          <TabsContent value="phaser" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phaser Game Component</CardTitle>
                <CardDescription>
                  Create interactive HTML5 games with Phaser 3. Build 2D games with
                  physics, sprites, and custom game logic.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "phaser" && (
                  <Phaser
                    data={samplePhaser}
                    options={{ autoStart: true, showControls: true }}
                  >
                    <PhaserHeader>
                      <PhaserTitle>Phaser Game Demo</PhaserTitle>
                      <PhaserActions>
                        <PhaserPlayButton />
                        <PhaserResetButton />
                        <PhaserCopyButton />
                        <PhaserFullscreenButton />
                      </PhaserActions>
                    </PhaserHeader>
                    <PhaserContent />
                  </Phaser>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Full Phaser 3 game engine support</li>
                  <li>WebGL and Canvas rendering</li>
                  <li>Physics engines (Arcade, Matter, Impact)</li>
                  <li>Scene management with lifecycle methods</li>
                  <li>Interactive game objects</li>
                  <li>Play, pause, and reset controls</li>
                  <li>Custom game logic via JavaScript code</li>
                  <li>Sprite, animation, and particle support</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mermaid Tab */}
          <TabsContent value="mermaid" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mermaid Diagram Component</CardTitle>
                <CardDescription>
                  Create diagrams from text using Mermaid.js. Perfect for
                  flowcharts, sequence diagrams, class diagrams, and more.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "mermaid" && (
                  <Mermaid data={sampleMermaid} title="Development Workflow">
                    <MermaidHeader>
                      <MermaidTitle />
                      <MermaidActions>
                        <MermaidModeToggle />
                        <MermaidCopyButton />
                        <MermaidDownloadButton />
                        <MermaidFullscreenButton />
                      </MermaidActions>
                    </MermaidHeader>
                    <MermaidContent />
                  </Mermaid>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Create diagrams from markdown-like syntax</li>
                  <li>Flowcharts, sequence diagrams, class diagrams</li>
                  <li>State diagrams, ER diagrams, Gantt charts</li>
                  <li>Multiple themes (default, dark, forest, neutral)</li>
                  <li>Toggle between preview and source code</li>
                  <li>Copy diagram source or download</li>
                  <li>Fullscreen mode support</li>
                  <li>Real-time rendering</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Remotion Tab */}
          <TabsContent value="remotion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Remotion Video Component</CardTitle>
                <CardDescription>
                  Create programmatic videos with React using Remotion. Build
                  frame-based compositions with full control.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "remotion" && (
                  <Remotion
                    data={sampleRemotion}
                    options={{
                      autoPlay: false,
                      loop: true,
                      controls: true,
                    }}
                  >
                    <RemotionHeader>
                      <RemotionTitle />
                      <RemotionActions>
                        <RemotionPlayButton />
                        <RemotionResetButton />
                        <RemotionCopyButton />
                        <RemotionFullscreenButton />
                      </RemotionActions>
                    </RemotionHeader>
                    <RemotionContent />
                    <RemotionTimeline />
                  </Remotion>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Create videos programmatically with React</li>
                  <li>Frame-based composition control</li>
                  <li>Custom width, height, and FPS settings</li>
                  <li>Play, pause, and scrub through frames</li>
                  <li>Loop and autoplay options</li>
                  <li>Timeline scrubber for frame navigation</li>
                  <li>Fullscreen mode support</li>
                  <li>Preview mode (full rendering requires server-side)</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Charts Component</CardTitle>
                <CardDescription>
                  Interactive data visualizations using amCharts 5. Supports line, bar, pie, scatter, area, and radar charts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "charts" && (
                  <Charts data={sampleCharts} options={{ height: 400, showLegend: true }}>
                    <ChartsHeader>
                      <ChartsTitle />
                      <ChartsActions>
                        <ChartsCopyButton />
                        <ChartsFullscreenButton />
                      </ChartsActions>
                    </ChartsHeader>
                    <ChartsContent />
                    <ChartsLegend />
                  </Charts>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li><strong>Basic charts:</strong> line, bar, pie, scatter, area, radar</li>
                  <li><strong>Advanced charts:</strong> Sankey, Chord, TreeMap, Force-Directed, Hierarchy, WordCloud, Venn</li>
                  <li>Multiple series with custom colors</li>
                  <li>Interactive pan, zoom, and cursor controls</li>
                  <li>Configurable axes and styling</li>
                  <li>Automatic legend generation</li>
                  <li>Export to PNG/SVG</li>
                  <li>Fullscreen mode with smooth animations</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="geospatial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Geospatial Component</CardTitle>
                <CardDescription>
                  Advanced geospatial visualizations using L7 by AntV. Supports heatmaps, hexagons, and large-scale data (100k+ points).
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "geospatial" && (
                  <Geospatial data={sampleGeospatial} options={{ height: 500 }}>
                    <GeospatialHeader>
                      <GeospatialTitle />
                      <GeospatialActions>
                        <GeospatialLayerToggle />
                        <GeospatialCopyButton />
                        <GeospatialFullscreenButton />
                      </GeospatialActions>
                    </GeospatialHeader>
                    <GeospatialContent />
                    <GeospatialLegend />
                  </Geospatial>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Multiple layer types: heatmap, hexagon, point, line, polygon, arc</li>
                  <li>WebGL-powered rendering for 100k+ points</li>
                  <li>Layer visibility toggles</li>
                  <li>Custom color scales and styling</li>
                  <li>3 basemap options: light, dark, satellite</li>
                  <li>Legend with layer descriptions</li>
                  <li>Fullscreen mode support</li>
                  <li>Complementary to existing Maps component</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wysiwyg" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>WYSIWYG Editor Component</CardTitle>
                <CardDescription>
                  Rich text editor powered by Novel and Tiptap. Supports markdown, HTML, and JSON formats with editable and read-only modes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "wysiwyg" && (
                  <WYSIWYG data={sampleWYSIWYG} options={{ height: 400 }}>
                    <WYSIWYGHeader>
                      <WYSIWYGTitle />
                      <WYSIWYGActions>
                        <WYSIWYGExportButton />
                        <WYSIWYGCopyButton />
                      </WYSIWYGActions>
                    </WYSIWYGHeader>
                    <WYSIWYGContent />
                  </WYSIWYG>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Support for markdown, HTML, and JSON formats</li>
                  <li>Editable and read-only modes</li>
                  <li>Export to markdown/HTML files</li>
                  <li>Copy to clipboard</li>
                  <li>Configurable height and width</li>
                  <li>Content state management</li>
                  <li>Prose styling for read-only content</li>
                  <li>Custom placeholder text</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vrm" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>VRM Avatar Component</CardTitle>
                <CardDescription>
                  3D avatar viewer using three-vrm. Load VRM models with animations, spring bone physics, and interactive controls.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "vrm" && (
                  <VRM data={sampleVRM} options={{ height: 500 }}>
                    <VRMHeader>
                      <VRMTitle />
                      <VRMActions>
                        <VRMAnimationToggle />
                        <VRMResetButton />
                        <VRMCopyButton />
                        <VRMFullscreenButton />
                      </VRMActions>
                    </VRMHeader>
                    <VRMContent />
                    <VRMControls />
                  </VRM>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>VRM 0.0 and VRM 1.0 format support</li>
                  <li>Animation support with play/pause toggle</li>
                  <li>OrbitControls for interactive camera</li>
                  <li>Configurable lighting (ambient + directional)</li>
                  <li>Automatic spring bone physics</li>
                  <li>Reset camera functionality</li>
                  <li>Fullscreen mode</li>
                  <li>Uses existing Three.js infrastructure</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toolui" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tool UI Component</CardTitle>
                <CardDescription>
                  AI tool call visualization using @assistant-ui. Display tool definitions, invocations, and results with status indicators.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === "toolui" && <ToolUI data={sampleToolUI} />}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc space-y-2 pl-5 text-muted-foreground text-sm">
                  <li>Social posts (X/Twitter, Instagram, LinkedIn)</li>
                  <li>Media (image gallery, video player)</li>
                  <li>Data visualization (stats, tables, charts)</li>
                  <li>Workflow (progress trackers, forms, approvals)</li>
                  <li>E-commerce (order summaries, pricing)</li>
                  <li>Utilities (link previews, weather, carousels)</li>
                  <li>18 unique components from @assistant-ui/tool-ui</li>
                  <li>Type-safe with Zod validation</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Component Statistics</CardTitle>
            <CardDescription>
              All components follow compound component patterns and are
              production-ready
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 font-bold text-2xl">16</div>
                <div className="text-muted-foreground text-sm">
                  Components Created
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 font-bold text-2xl">3,990+</div>
                <div className="text-muted-foreground text-sm">
                  Lines of Code
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 font-bold text-2xl">100%</div>
                <div className="text-muted-foreground text-sm">
                  TypeScript Coverage
                </div>
              </div>
              <div className="rounded-lg border bg-card p-4">
                <div className="mb-2 font-bold text-2xl">✓</div>
                <div className="text-muted-foreground text-sm">
                  ESLint Compliant
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
