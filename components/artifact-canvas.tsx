"use client";

import type { ReactNode } from "react";
import type {
  Node,
  NodeProps,
  ReactFlowInstance,
  XYPosition,
} from "@xyflow/react";

import { Panel, useNodesState, useReactFlow, useViewport } from "@xyflow/react";
import { GripVertical, Maximize, Minus, Plus } from "lucide-react";
import { memo, useCallback, useEffect, useRef } from "react";

import { Canvas } from "@/components/ai-elements/canvas";
import { cn } from "@/lib/utils";

const POSITION_STORAGE_KEY = "generous-artifact-canvas-positions-v1";
const MAX_STORED_POSITIONS = 500;

const CANVAS_ORIGIN: XYPosition = { x: 0, y: 0 };
/** Matches the node's `w-[720px]`; used for placement before measurement. */
const ITEM_WIDTH = 720;
const FALLBACK_ITEM_HEIGHT = 420;
const ITEM_GAP = 64;
const ROW_GAP = 96;

export interface CanvasArtifactItem {
  /** Stable id, see {@link getCanvasArtifactId}. */
  id: string;
  /** The assistant message that produced this artifact. */
  turnId: string;
  label: string;
  emoji: string;
  body: ReactNode;
  isStreaming?: boolean;
}

export interface ArtifactCanvasProps {
  items: CanvasArtifactItem[];
  emptyState: ReactNode;
  /** Pan to an artifact; bump `nonce` to re-focus the same one. */
  focusRequest?: { id: string; nonce: number } | null;
}

export interface PlacedArtifact {
  turnId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function getCanvasArtifactId(messageId: string, blockId: string): string {
  return `${messageId}:${blockId}`;
}

/**
 * Artifacts from the same response sit side by side; each new response
 * starts a fresh row beneath everything already on the canvas.
 */
export function getNextArtifactPosition(
  placed: PlacedArtifact[],
  turnId: string,
): XYPosition {
  const sameTurn = placed.filter((item) => item.turnId === turnId);
  if (sameTurn.length > 0) {
    const last = sameTurn[sameTurn.length - 1];
    return { x: last.x + last.width + ITEM_GAP, y: last.y };
  }

  if (placed.length === 0) return CANVAS_ORIGIN;

  const bottom = Math.max(...placed.map((item) => item.y + item.height));
  return { x: CANVAS_ORIGIN.x, y: bottom + ROW_GAP };
}

interface ArtifactNodeData extends Record<string, unknown> {
  item: CanvasArtifactItem;
}

type ArtifactNode = Node<ArtifactNodeData, "artifact">;

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

function toPlaced(node: ArtifactNode): PlacedArtifact {
  return {
    turnId: node.data.item.turnId,
    x: node.position.x,
    y: node.position.y,
    width: node.measured?.width ?? ITEM_WIDTH,
    height: node.measured?.height ?? FALLBACK_ITEM_HEIGHT,
  };
}

function ArtifactCanvasNode({ data, selected }: NodeProps<ArtifactNode>) {
  const { item } = data;

  return (
    <div
      className="group relative w-[720px]"
      aria-label={`${item.label} artifact`}
      role="group"
    >
      {/* Floating handle: the only part of an artifact that moves it. */}
      <div
        className={cn(
          "artifact-drag-handle absolute -top-8 left-0 flex h-7 cursor-grab select-none items-center gap-1.5 rounded-full border border-border/70 bg-background/90 pl-1.5 pr-3 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur transition-opacity active:cursor-grabbing",
          selected || item.isStreaming
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100",
        )}
      >
        <GripVertical aria-hidden="true" className="size-3.5" />
        <span aria-hidden="true">{item.emoji}</span>
        <span>{item.label}</span>
        {item.isStreaming ? (
          <span className="flex items-center gap-1 text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            rendering
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "nodrag nopan nowheel cursor-auto rounded-lg shadow-lg transition-shadow",
          selected && "ring-2 ring-primary/40",
        )}
      >
        {item.body}
      </div>
    </div>
  );
}

const nodeTypes = { artifact: memo(ArtifactCanvasNode) };

function CanvasZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { zoom } = useViewport();
  const buttonClass =
    "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <Panel position="bottom-right" className="m-3">
      <div className="flex items-center gap-0.5 rounded-lg border border-border/70 bg-background/90 p-0.5 shadow-sm backdrop-blur">
        <button type="button" className={buttonClass} onClick={() => void zoomOut({ duration: 200 })} aria-label="Zoom out">
          <Minus aria-hidden="true" className="size-4" />
        </button>
        <span className="w-11 text-center text-[11px] tabular-nums text-muted-foreground">
          {Math.round(zoom * 100)}%
        </span>
        <button type="button" className={buttonClass} onClick={() => void zoomIn({ duration: 200 })} aria-label="Zoom in">
          <Plus aria-hidden="true" className="size-4" />
        </button>
        <button
          type="button"
          className={buttonClass}
          onClick={() => void fitView({ padding: 0.15, maxZoom: 1, duration: 350 })}
          aria-label="Fit all artifacts"
        >
          <Maximize aria-hidden="true" className="size-4" />
        </button>
      </div>
    </Panel>
  );
}

export function ArtifactCanvas({ items, emptyState, focusRequest }: ArtifactCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<ArtifactNode>([]);
  const flowRef = useRef<ReactFlowInstance<ArtifactNode> | null>(null);
  const positionsRef = useRef<Record<string, XYPosition> | null>(null);

  const panTo = useCallback((position: XYPosition) => {
    const flow = flowRef.current;
    if (!flow) return;
    const zoom = flow.getZoom();
    void flow.setViewport(
      { x: -position.x * zoom + 48, y: -position.y * zoom + 56, zoom },
      { duration: 400 },
    );
  }, []);

  useEffect(() => {
    positionsRef.current ??= readStoredPositions();
    const stored = positionsRef.current;
    // Read through the instance so measured sizes are current without
    // making `nodes` an effect dependency.
    const currentNodes = flowRef.current?.getNodes() ?? [];
    const currentById = new Map(currentNodes.map((node) => [node.id, node]));
    const placed: PlacedArtifact[] = [];
    let firstNewPosition: XYPosition | null = null;

    const nextNodes = items.map((item): ArtifactNode => {
      const current = currentById.get(item.id);
      let position = current?.position ?? stored[item.id];

      if (!position) {
        position = getNextArtifactPosition(placed, item.turnId);
        firstNewPosition ??= position;
      }

      const node: ArtifactNode = {
        ...current,
        id: item.id,
        type: "artifact",
        position,
        data: { item },
        dragHandle: ".artifact-drag-handle",
        connectable: false,
        deletable: false,
        zIndex: item.isStreaming ? 2 : 1,
      };
      placed.push(toPlaced(node));
      return node;
    });

    setNodes(nextNodes);

    if (firstNewPosition) {
      const target = firstNewPosition;
      window.requestAnimationFrame(() => panTo(target));
    } else if (
      nextNodes.length > 0
      && nextNodes.every((node) => !currentById.has(node.id))
    ) {
      // A saved chat was loaded: show everything it produced.
      window.requestAnimationFrame(() => {
        void flowRef.current?.fitView({ padding: 0.15, maxZoom: 1, duration: 350 });
      });
    }
  }, [items, panTo, setNodes]);

  const focusId = focusRequest?.id;
  const focusNonce = focusRequest?.nonce;
  useEffect(() => {
    if (!focusId) return;
    const frame = window.requestAnimationFrame(() => {
      void flowRef.current?.fitView({
        nodes: [{ id: focusId }],
        padding: 0.2,
        maxZoom: 1,
        duration: 400,
      });
      setNodes((current) =>
        current.map((node) => ({ ...node, selected: node.id === focusId })),
      );
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focusId, focusNonce, setNodes]);

  const persistPosition = useCallback((node: ArtifactNode) => {
    const positions: Record<string, XYPosition> = {
      ...positionsRef.current,
      [node.id]: node.position,
    };
    const entries = Object.entries(positions);
    positionsRef.current = Object.fromEntries(entries.slice(-MAX_STORED_POSITIONS));

    try {
      window.localStorage.setItem(
        POSITION_STORAGE_KEY,
        JSON.stringify(positionsRef.current),
      );
    } catch {
      // Positions simply reset on refresh when storage is unavailable.
    }
  }, []);

  const handleInit = useCallback((instance: ReactFlowInstance<ArtifactNode>) => {
    flowRef.current = instance;
  }, []);

  return (
    <section
      aria-label="Artifact canvas"
      className="relative h-full min-h-0 w-full overflow-hidden bg-background"
    >
      <Canvas<ArtifactNode>
        nodes={nodes}
        edges={[]}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDragStop={(_event, node) => persistPosition(node)}
        onInit={handleInit}
        fitView={items.length > 0}
        fitViewOptions={{ padding: 0.15, maxZoom: 1 }}
        minZoom={0.1}
        maxZoom={2}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasZoomControls />
      </Canvas>

      {items.length === 0 ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6">
          {emptyState}
        </div>
      ) : null}
    </section>
  );
}
