import type { NodeEditorData } from "./node-editor";

import {
  NodeEditor,
  NodeEditorActions,
  NodeEditorContent,
  NodeEditorCopyButton,
  NodeEditorError,
  NodeEditorFullscreenButton,
  NodeEditorHeader,
  NodeEditorTitle,
} from "./node-editor";

// Example 1: Simple flowchart
export function SimpleFlowchart() {
  const data: NodeEditorData = {
    nodes: [
      {
        id: "1",
        position: { x: 250, y: 0 },
        data: { label: "Start" },
        type: "input",
      },
      {
        id: "2",
        position: { x: 250, y: 100 },
        data: { label: "Process Data" },
      },
      {
        id: "3",
        position: { x: 250, y: 200 },
        data: { label: "Decision" },
      },
      {
        id: "4",
        position: { x: 100, y: 300 },
        data: { label: "Option A" },
      },
      {
        id: "5",
        position: { x: 400, y: 300 },
        data: { label: "Option B" },
      },
      {
        id: "6",
        position: { x: 250, y: 400 },
        data: { label: "End" },
        type: "output",
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4", label: "Yes" },
      { id: "e3-5", source: "3", target: "5", label: "No" },
      { id: "e4-6", source: "4", target: "6" },
      { id: "e5-6", source: "5", target: "6" },
    ],
  };

  return (
    <NodeEditor data={data}>
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
  );
}

// Example 2: Data pipeline workflow
export function DataPipelineWorkflow() {
  const data: NodeEditorData = {
    nodes: [
      {
        id: "source",
        position: { x: 0, y: 100 },
        data: { label: "Data Source" },
        type: "input",
      },
      {
        id: "extract",
        position: { x: 200, y: 100 },
        data: { label: "Extract" },
      },
      {
        id: "transform",
        position: { x: 400, y: 100 },
        data: { label: "Transform" },
      },
      {
        id: "load",
        position: { x: 600, y: 100 },
        data: { label: "Load" },
      },
      {
        id: "validate",
        position: { x: 400, y: 250 },
        data: { label: "Validate" },
      },
      {
        id: "database",
        position: { x: 800, y: 100 },
        data: { label: "Database" },
        type: "output",
      },
    ],
    edges: [
      { id: "e1", source: "source", target: "extract" },
      { id: "e2", source: "extract", target: "transform" },
      { id: "e3", source: "transform", target: "validate" },
      { id: "e4", source: "validate", target: "load", label: "Valid" },
      { id: "e5", source: "load", target: "database" },
      {
        id: "e6",
        source: "validate",
        target: "transform",
        label: "Invalid",
        animated: true,
      },
    ],
  };

  return (
    <NodeEditor data={data} title="ETL Pipeline">
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
  );
}

// Example 3: State machine diagram
export function StateMachineDiagram() {
  const data: NodeEditorData = {
    nodes: [
      {
        id: "idle",
        position: { x: 250, y: 0 },
        data: { label: "Idle" },
        type: "input",
      },
      {
        id: "loading",
        position: { x: 250, y: 150 },
        data: { label: "Loading" },
      },
      {
        id: "success",
        position: { x: 100, y: 300 },
        data: { label: "Success" },
        type: "output",
      },
      {
        id: "error",
        position: { x: 400, y: 300 },
        data: { label: "Error" },
        type: "output",
      },
    ],
    edges: [
      { id: "e1", source: "idle", target: "loading", label: "fetch" },
      { id: "e2", source: "loading", target: "success", label: "success" },
      { id: "e3", source: "loading", target: "error", label: "error" },
      {
        id: "e4",
        source: "success",
        target: "idle",
        label: "reset",
        animated: true,
      },
      {
        id: "e5",
        source: "error",
        target: "idle",
        label: "retry",
        animated: true,
      },
    ],
  };

  return (
    <NodeEditor data={data} title="State Machine">
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
  );
}

// Example 4: With MiniMap enabled
export function FlowchartWithMiniMap() {
  const data: NodeEditorData = {
    nodes: [
      {
        id: "1",
        position: { x: 0, y: 0 },
        data: { label: "Node 1" },
        type: "input",
      },
      {
        id: "2",
        position: { x: 200, y: 100 },
        data: { label: "Node 2" },
      },
      {
        id: "3",
        position: { x: 400, y: 100 },
        data: { label: "Node 3" },
      },
      {
        id: "4",
        position: { x: 600, y: 200 },
        data: { label: "Node 4" },
      },
      {
        id: "5",
        position: { x: 800, y: 100 },
        data: { label: "Node 5" },
        type: "output",
      },
      {
        id: "6",
        position: { x: 200, y: 300 },
        data: { label: "Node 6" },
      },
      {
        id: "7",
        position: { x: 400, y: 400 },
        data: { label: "Node 7" },
      },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2" },
      { id: "e2-3", source: "2", target: "3" },
      { id: "e3-4", source: "3", target: "4" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e2-6", source: "2", target: "6" },
      { id: "e6-7", source: "6", target: "7" },
      { id: "e7-4", source: "7", target: "4" },
    ],
  };

  return (
    <NodeEditor
      data={data}
      options={{
        showMiniMap: true,
        showControls: true,
        showBackground: true,
      }}
    >
      <NodeEditorHeader>
        <NodeEditorTitle>Flow with MiniMap</NodeEditorTitle>
        <NodeEditorActions>
          <NodeEditorCopyButton />
          <NodeEditorFullscreenButton />
        </NodeEditorActions>
      </NodeEditorHeader>
      <NodeEditorError />
      <NodeEditorContent />
    </NodeEditor>
  );
}

// Example 5: API workflow
export function APIWorkflow() {
  const data: NodeEditorData = {
    nodes: [
      {
        id: "client",
        position: { x: 0, y: 150 },
        data: { label: "Client Request" },
        type: "input",
      },
      {
        id: "gateway",
        position: { x: 200, y: 150 },
        data: { label: "API Gateway" },
      },
      {
        id: "auth",
        position: { x: 400, y: 0 },
        data: { label: "Authentication" },
      },
      {
        id: "service",
        position: { x: 400, y: 150 },
        data: { label: "Service" },
      },
      {
        id: "cache",
        position: { x: 400, y: 300 },
        data: { label: "Cache Check" },
      },
      {
        id: "database",
        position: { x: 600, y: 150 },
        data: { label: "Database" },
      },
      {
        id: "response",
        position: { x: 800, y: 150 },
        data: { label: "Response" },
        type: "output",
      },
    ],
    edges: [
      { id: "e1", source: "client", target: "gateway" },
      { id: "e2", source: "gateway", target: "auth" },
      { id: "e3", source: "auth", target: "service", label: "Authorized" },
      { id: "e4", source: "service", target: "cache" },
      { id: "e5", source: "cache", target: "database", label: "Cache Miss" },
      { id: "e6", source: "database", target: "response" },
      {
        id: "e7",
        source: "cache",
        target: "response",
        label: "Cache Hit",
        animated: true,
      },
    ],
  };

  return (
    <NodeEditor data={data} title="API Request Flow">
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
  );
}

// Example 6: Minimal node editor (no header)
export function MinimalNodeEditor() {
  const data: NodeEditorData = {
    nodes: [
      {
        id: "a",
        position: { x: 100, y: 100 },
        data: { label: "Node A" },
      },
      {
        id: "b",
        position: { x: 300, y: 100 },
        data: { label: "Node B" },
      },
    ],
    edges: [{ id: "e-a-b", source: "a", target: "b" }],
  };

  return (
    <NodeEditor data={data}>
      <NodeEditorContent />
    </NodeEditor>
  );
}

// Example 7: Error handling (invalid data)
export function NodeEditorWithError() {
  const invalidData: NodeEditorData = {
    nodes: [],
    edges: [],
  };

  return (
    <NodeEditor data={invalidData}>
      <NodeEditorHeader>
        <NodeEditorTitle>This will show an error</NodeEditorTitle>
      </NodeEditorHeader>
      <NodeEditorError>
        {(error) => (
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Node Editor Error:</span>
            <span>{error.message}</span>
          </div>
        )}
      </NodeEditorError>
      <NodeEditorContent />
    </NodeEditor>
  );
}

// Example 8: Interactive workflow builder
export function InteractiveWorkflowBuilder() {
  const data: NodeEditorData = {
    nodes: [
      {
        id: "start",
        position: { x: 250, y: 0 },
        data: { label: "Start Workflow" },
        type: "input",
      },
      {
        id: "step1",
        position: { x: 250, y: 150 },
        data: { label: "Step 1: Data Collection" },
      },
      {
        id: "step2",
        position: { x: 250, y: 300 },
        data: { label: "Step 2: Data Processing" },
      },
      {
        id: "end",
        position: { x: 250, y: 450 },
        data: { label: "Workflow Complete" },
        type: "output",
      },
    ],
    edges: [
      { id: "e-start-1", source: "start", target: "step1", animated: true },
      { id: "e-1-2", source: "step1", target: "step2", animated: true },
      { id: "e-2-end", source: "step2", target: "end", animated: true },
    ],
  };

  return (
    <NodeEditor
      data={data}
      options={{
        interactive: true,
        panOnScroll: true,
        zoomOnScroll: true,
        showControls: true,
      }}
      title="Interactive Workflow"
    >
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
  );
}
