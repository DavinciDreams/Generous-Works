"use client";

import type { ReactNode } from "react";
import type {
  Edge,
  Node,
  NodeProps,
  ReactFlowInstance,
  Viewport,
  XYPosition,
} from "@xyflow/react";

import {
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Panel,
  Position,
  useNodesState,
} from "@xyflow/react";
import { Bot, GripHorizontal, LayoutGrid, UserRound } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";

import { Canvas } from "@/components/ai-elements/canvas";
import { cn } from "@/lib/utils";

const POSITION_STORAGE_KEY = "generous-infinite-canvas-positions-v1";
const VIEWPORT_STORAGE_KEY = "generous-infinite-canvas-viewport-v1";
const DEFAULT_VIEWPORT: Viewport = { x: 56, y: 40, zoom: 0.9 };

export interface InfiniteCanvasItem {
  id: string;
  role: "user" | "assistant";
  body: ReactNode;
  isStreaming?: boolean;
  timestamp?: number;
}

export interface InfiniteConversationCanvasProps {
  items: InfiniteCanvasItem[];
  emptyState: ReactNode;
  error?: string | null;
}

interface ConversationNodeData extends Record<string, unknown> {
  item: InfiniteCanvasItem;
}

type ConversationNode = Node<ConversationNodeData, "conversation">;

export function getDefaultCanvasPosition(
  index: number,
  role: InfiniteCanvasItem["role"],
): XYPosition {
  const row = Math.floor(index / 2);
  return {
    x: role === "user" ? 80 : 500,
    y: 80 + row * 640 + (role === "assistant" ? 72 : 0),
  };
}

function isPosition(value: unknown): value is XYPosition {
  if (!value || typeof value !== "object") return false;
  const position = value as Partial<XYPosition>;
  return Number.isFinite(position.x) && Number.isFinite(position.y);
}

function readStoredPositions(): Record<string, XYPosition> {
  try {
    const stored = window.localStorage.getItem(POSITION_STORAGE_KEY);
    if (!stored) return {};

    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, XYPosition] =>
        isPosition(entry[1]),
      ),
    );
  } catch {
    return {};
  }
}

function readStoredViewport(): Viewport | null {
  try {
    const stored = window.localStorage.getItem(VIEWPORT_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<Viewport>;
    if (
      !Number.isFinite(parsed.x) ||
      !Number.isFinite(parsed.y) ||
      !Number.isFinite(parsed.zoom)
    ) {
      return null;
    }

    return parsed as Viewport;
  } catch {
    return null;
  }
}

function ConversationCard({ data, selected }: NodeProps<ConversationNode>) {
  const { item } = data;
  const isUser = item.role === "user";

  return (
    <article
      aria-label={isUser ? "Your prompt" : "Generous response"}
      className={cn(
        "overflow-hidden rounded-2xl border bg-card/95 shadow-xl backdrop-blur transition-[border-color,box-shadow]",
        isUser ? "w-[340px]" : "w-[min(720px,calc(100vw-3rem))]",
        selected
          ? "border-primary ring-2 ring-primary/30"
          : "border-border/80",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-2 !border-background !bg-primary/70"
      />

      <div className="canvas-drag-handle flex cursor-grab select-none items-center justify-between border-b border-border/70 bg-muted/40 px-3 py-2 active:cursor-grabbing">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-lg",
              isUser
                ? "bg-muted text-muted-foreground"
                : "bg-gradient-to-br from-[#0097b2] to-[#7ed952] text-white",
            )}
          >
            {isUser ? (
              <UserRound aria-hidden="true" className="size-4" />
            ) : (
              <Bot aria-hidden="true" className="size-4" />
            )}
          </span>
          <div>
            <div className="text-xs font-semibold text-foreground">
              {isUser ? "You" : "Generous"}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {item.isStreaming ? "Rendering live" : "Canvas card"}
            </div>
          </div>
        </div>
        <GripHorizontal aria-hidden="true" className="size-4 text-muted-foreground/70" />
      </div>

      <div className="nodrag nopan nowheel max-h-[560px] overflow-auto p-4">
        {item.body}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-2 !border-background !bg-primary/70"
      />
    </article>
  );
}

const MemoizedConversationCard = memo(ConversationCard);
const nodeTypes = { conversation: MemoizedConversationCard };

function createEdges(items: InfiniteCanvasItem[]): Edge[] {
  return items.slice(1).map((item, index) => ({
    id: `conversation-edge-${items[index].id}-${item.id}`,
    source: items[index].id,
    target: item.id,
    type: "smoothstep",
    animated: Boolean(item.isStreaming),
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
    style: { stroke: "var(--primary)", strokeOpacity: 0.38, strokeWidth: 1.5 },
  }));
}

export function InfiniteConversationCanvas({
  items,
  emptyState,
  error,
}: InfiniteConversationCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<ConversationNode>([]);
  const flowRef = useRef<ReactFlowInstance<ConversationNode, Edge> | null>(null);
  const positionsRef = useRef<Record<string, XYPosition>>({});
  const initializedRef = useRef(false);
  const edges = useMemo(() => createEdges(items), [items]);

  useEffect(() => {
    if (!initializedRef.current) {
      positionsRef.current = readStoredPositions();
      initializedRef.current = true;
    }

    setNodes((currentNodes) => {
      const currentById = new Map(currentNodes.map((node) => [node.id, node]));

      return items.map((item, index) => {
        const current = currentById.get(item.id);
        const position = current?.position
          ?? positionsRef.current[item.id]
          ?? getDefaultCanvasPosition(index, item.role);

        return {
          id: item.id,
          type: "conversation",
          position,
          data: { item },
          dragHandle: ".canvas-drag-handle",
          connectable: false,
          deletable: false,
          selected: current?.selected ?? false,
          zIndex: item.isStreaming ? 2 : 1,
          ariaLabel: item.role === "user" ? "Your prompt" : "Generous response",
        } satisfies ConversationNode;
      });
    });
  }, [items, setNodes]);

  const persistPosition = useCallback((node: ConversationNode) => {
    positionsRef.current = {
      ...positionsRef.current,
      [node.id]: node.position,
    };

    try {
      window.localStorage.setItem(
        POSITION_STORAGE_KEY,
        JSON.stringify(positionsRef.current),
      );
    } catch {
      // The canvas remains usable when storage is unavailable.
    }
  }, []);

  const handleInit = useCallback((instance: ReactFlowInstance<ConversationNode, Edge>) => {
    flowRef.current = instance;
    const storedViewport = readStoredViewport();
    if (storedViewport) void instance.setViewport(storedViewport);
  }, []);

  const handleMoveEnd = useCallback((_event: unknown, viewport: Viewport) => {
    try {
      window.localStorage.setItem(VIEWPORT_STORAGE_KEY, JSON.stringify(viewport));
    } catch {
      // The viewport simply resets on refresh when storage is unavailable.
    }
  }, []);

  const resetLayout = useCallback(() => {
    positionsRef.current = {};
    try {
      window.localStorage.removeItem(POSITION_STORAGE_KEY);
      window.localStorage.removeItem(VIEWPORT_STORAGE_KEY);
    } catch {
      // Reset the live canvas even when storage is unavailable.
    }

    setNodes((currentNodes) =>
      currentNodes.map((node, index) => ({
        ...node,
        position: getDefaultCanvasPosition(index, node.data.item.role),
      })),
    );

    window.requestAnimationFrame(() => {
      void flowRef.current?.fitView({ padding: 0.18, duration: 350 });
    });
  }, [setNodes]);

  return (
    <section
      aria-label="Generous infinite canvas"
      className="relative h-full min-h-0 w-full overflow-hidden bg-background"
    >
      <Canvas
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDragStop={(_event, node) => persistPosition(node)}
        onInit={handleInit}
        onMoveEnd={handleMoveEnd}
        defaultViewport={DEFAULT_VIEWPORT}
        fitView={items.length > 0}
        fitViewOptions={{ padding: 0.18, maxZoom: 1 }}
        minZoom={0.12}
        maxZoom={2.2}
        nodesFocusable
        nodesDraggable
        nodesConnectable={false}
        panOnDrag
        panOnScroll
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick={false}
      >
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap
          ariaLabel="Canvas minimap"
          className="!border !border-border !bg-card/90"
          maskColor="color-mix(in oklab, var(--background) 78%, transparent)"
          nodeColor={(node) => node.data.item.role === "user" ? "#64748b" : "#0097b2"}
          pannable
          zoomable
        />
        <Panel position="top-left" className="m-3">
          <div className="rounded-lg border border-border/80 bg-background/90 px-3 py-2 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
            Drag cards · pan the background · scroll to zoom
          </div>
        </Panel>
        <Panel position="top-right" className="m-3">
          <button
            type="button"
            onClick={resetLayout}
            className="nodrag nopan flex min-h-10 items-center gap-2 rounded-lg border border-border/80 bg-background/90 px-3 text-xs font-medium text-foreground shadow-sm backdrop-blur transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LayoutGrid aria-hidden="true" className="size-4" />
            Reset layout
          </button>
        </Panel>
      </Canvas>

      {items.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          {emptyState}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="absolute bottom-4 left-1/2 z-10 max-w-lg -translate-x-1/2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-lg backdrop-blur"
        >
          {error}
        </div>
      ) : null}
    </section>
  );
}
