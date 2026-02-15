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
  type MermaidData,
} from "@/components/ai-elements/mermaid";
import { ChatSidebar } from "@/components/ui/chat-sidebar";

const flowchartDiagram: MermaidData = {
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

const examplePrompts = [
  "Create a flowchart showing a user authentication process",
  "Generate a sequence diagram for API request flow",
  "Build a state diagram for order processing",
  "Create a class diagram for a blog system"
];

export default function MermaidTestPage() {
  return (
    <>
      <ChatSidebar
        componentType="Mermaid"
        examplePrompts={examplePrompts}
        title="Mermaid AI Generator"
      />
      <div className="container mx-auto p-8 pr-[420px]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Mermaid Diagram Test</h1>
        <p className="text-muted-foreground mt-2">
          Create diagrams from text using Mermaid.js
        </p>
      </div>

      <Mermaid data={flowchartDiagram} title="Development Workflow">
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

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Mermaid Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Create diagrams from markdown-like syntax</li>
          <li>Flowcharts, sequence diagrams, class diagrams</li>
          <li>State diagrams, ER diagrams, Gantt charts</li>
          <li>Multiple themes (default, dark, forest, neutral)</li>
          <li>Toggle between preview and source code</li>
          <li>Copy diagram source or download</li>
          <li>Fullscreen mode support</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Example Diagram Types:</h3>
        <div className="space-y-2 text-sm">
          <p><strong>Flowchart:</strong> graph TB</p>
          <p><strong>Sequence:</strong> sequenceDiagram</p>
          <p><strong>Class:</strong> classDiagram</p>
          <p><strong>State:</strong> stateDiagram-v2</p>
          <p><strong>ER:</strong> erDiagram</p>
          <p><strong>Gantt:</strong> gantt</p>
        </div>
      </div>
    </div>
    </>
  );
}
