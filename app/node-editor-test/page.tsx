import {
  NodeEditor,
  NodeEditorActions,
  NodeEditorContent,
  NodeEditorCopyButton,
  NodeEditorFullscreenButton,
  NodeEditorHeader,
  NodeEditorTitle,
  type NodeEditorData,
} from "@/components/ai-elements/node-editor";
import { ChatSidebar } from "@/components/chat-sidebar";

const sampleData: NodeEditorData = {
  nodes: [
    {
      id: "start",
      position: { x: 100, y: 200 },
      data: { label: "Start" },
      type: "input",
    },
    {
      id: "fetch",
      position: { x: 300, y: 150 },
      data: { label: "Fetch Data" },
    },
    {
      id: "validate",
      position: { x: 500, y: 150 },
      data: { label: "Validate" },
    },
    {
      id: "transform",
      position: { x: 300, y: 250 },
      data: { label: "Transform" },
    },
    {
      id: "error",
      position: { x: 700, y: 100 },
      data: { label: "Error Handler" },
    },
    {
      id: "save",
      position: { x: 700, y: 250 },
      data: { label: "Save to DB" },
    },
    {
      id: "end",
      position: { x: 900, y: 200 },
      data: { label: "End" },
      type: "output",
    },
  ],
  edges: [
    { id: "e1", source: "start", target: "fetch" },
    { id: "e2", source: "fetch", target: "validate", label: "success" },
    { id: "e3", source: "fetch", target: "transform", label: "partial" },
    { id: "e4", source: "validate", target: "error", label: "invalid" },
    { id: "e5", source: "validate", target: "save", label: "valid" },
    { id: "e6", source: "transform", target: "save" },
    { id: "e7", source: "error", target: "end" },
    { id: "e8", source: "save", target: "end" },
  ],
};

const examplePrompts = [
  "Create a workflow for user onboarding process",
  "Generate a CI/CD pipeline flow diagram",
  "Build a state machine for order processing",
  "Create a microservices architecture diagram"
];

export default function NodeEditorTestPage() {
  return (
    <>
      <ChatSidebar
        componentType="NodeEditor"
        examplePrompts={examplePrompts}
        title="Flow Diagram Generator"
      />
      <div className="container mx-auto p-8 pr-[420px]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Node Editor Test</h1>
        <p className="text-muted-foreground mt-2">
          Interactive flow diagram using React Flow
        </p>
      </div>

      <NodeEditor data={sampleData} title="Data Processing Pipeline">
        <NodeEditorHeader>
          <NodeEditorTitle />
          <NodeEditorActions>
            <NodeEditorCopyButton />
            <NodeEditorFullscreenButton />
          </NodeEditorActions>
        </NodeEditorHeader>
        <NodeEditorContent />
      </NodeEditor>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Node Editor Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Drag and drop nodes to rearrange</li>
          <li>Pan and zoom the canvas</li>
          <li>Interactive node connections</li>
          <li>Delete nodes and edges with keyboard</li>
          <li>Fullscreen mode support</li>
          <li>Copy flow data to clipboard</li>
        </ul>
      </div>
    </div>
    </>
  );
}
