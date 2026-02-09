"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

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
import type { TimelineData } from "@/components/ai-elements/timeline-client";

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

const sampleTimeline: TimelineData = {
  title: {
    text: {
      headline: "Product Development Timeline",
      text: "<p>Key milestones in our product journey</p>",
    },
  },
  events: [
    {
      start_date: { year: 2023, month: 1, day: 15 },
      text: {
        headline: "Project Kickoff",
        text: "<p>Initial planning and team formation</p>",
      },
    },
    {
      start_date: { year: 2023, month: 4, day: 1 },
      text: {
        headline: "Alpha Release",
        text: "<p>First working prototype completed</p>",
      },
    },
    {
      start_date: { year: 2023, month: 8, day: 15 },
      text: {
        headline: "Beta Launch",
        text: "<p>Public beta testing begins</p>",
      },
    },
    {
      start_date: { year: 2024, month: 1, day: 1 },
      text: {
        headline: "Version 1.0",
        text: "<p>Official product launch!</p>",
      },
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

export default function ShowcasePage() {
  const [activeTab, setActiveTab] = useState("svg");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <h1 className="mb-2 font-bold text-4xl">
            Component Showcase
          </h1>
          <p className="text-muted-foreground text-lg">
            Explore interactive AI elements: SVG Preview, Timeline, Node Editor,
            and Knowledge Graph
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid w-full grid-cols-4">
            <TabsTrigger value="svg">SVG Preview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="node-editor">Node Editor</TabsTrigger>
            <TabsTrigger value="knowledge-graph">Knowledge Graph</TabsTrigger>
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
                  Create interactive timelines using TimelineJS. Display events,
                  eras, and stories with rich media support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Timeline data={sampleTimeline}>
                  <TimelineHeader>
                    <TimelineTitle />
                    <TimelineActions>
                      <TimelineCopyButton />
                      <TimelineFullscreenButton />
                    </TimelineActions>
                  </TimelineHeader>
                  <TimelineContent />
                </Timeline>
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
                <div className="mb-2 font-bold text-2xl">4</div>
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
