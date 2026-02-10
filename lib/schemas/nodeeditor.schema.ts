/**
 * Zod schemas for NodeEditor component
 * Provides runtime type validation for NodeEditor props
 */

import { z } from 'zod';

/**
 * React Flow Node (simplified for validation)
 */
export const NodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number()
  }),
  data: z.record(z.string(), z.unknown()),
  selected: z.boolean().optional(),
  dragging: z.boolean().optional(),
  selectable: z.boolean().optional(),
  connectable: z.boolean().optional(),
  deletable: z.boolean().optional(),
  dragHandle: z.string().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  parentNode: z.string().optional(),
  zIndex: z.number().optional(),
  extent: z.union([
    z.enum(['parent']),
    z.tuple([z.tuple([z.number(), z.number()]), z.tuple([z.number(), z.number()])])
  ]).optional(),
  expandParent: z.boolean().optional(),
  positionAbsolute: z.object({
    x: z.number(),
    y: z.number()
  }).optional(),
  ariaLabel: z.string().optional(),
  focusable: z.boolean().optional(),
  style: z.record(z.string(), z.unknown()).optional(),
  className: z.string().optional(),
  hidden: z.boolean().optional()
}).passthrough(); // Allow additional React Flow node properties

export type Node = z.infer<typeof NodeSchema>;

/**
 * React Flow Edge (simplified for validation)
 */
export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  type: z.string().optional(),
  sourceHandle: z.string().optional(),
  targetHandle: z.string().optional(),
  label: z.union([z.string(), z.unknown()]).optional(),
  labelStyle: z.record(z.string(), z.unknown()).optional(),
  labelShowBg: z.boolean().optional(),
  labelBgStyle: z.record(z.string(), z.unknown()).optional(),
  labelBgPadding: z.tuple([z.number(), z.number()]).optional(),
  labelBgBorderRadius: z.number().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  animated: z.boolean().optional(),
  selected: z.boolean().optional(),
  deletable: z.boolean().optional(),
  focusable: z.boolean().optional(),
  style: z.record(z.string(), z.unknown()).optional(),
  className: z.string().optional(),
  hidden: z.boolean().optional(),
  zIndex: z.number().optional(),
  ariaLabel: z.string().optional(),
  interactionWidth: z.number().optional(),
  markerStart: z.union([z.string(), z.unknown()]).optional(),
  markerEnd: z.union([z.string(), z.unknown()]).optional()
}).passthrough(); // Allow additional React Flow edge properties

export type Edge = z.infer<typeof EdgeSchema>;

/**
 * NodeEditor data structure
 */
export const NodeEditorDataSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema)
});

export type NodeEditorData = z.infer<typeof NodeEditorDataSchema>;

/**
 * NodeEditor options
 */
export const NodeEditorOptionsSchema = z.object({
  fitView: z.boolean().optional(),
  showMiniMap: z.boolean().optional(),
  showControls: z.boolean().optional(),
  showBackground: z.boolean().optional(),
  interactive: z.boolean().optional(),
  panOnScroll: z.boolean().optional(),
  zoomOnScroll: z.boolean().optional(),
  zoomOnDoubleClick: z.boolean().optional(),
  deleteKeyCode: z.union([z.string(), z.array(z.string())]).optional(),
  selectionKeyCode: z.union([z.string(), z.array(z.string())]).optional()
}).passthrough(); // Allow additional React Flow options

export type NodeEditorOptions = z.infer<typeof NodeEditorOptionsSchema>;

/**
 * Complete NodeEditor props schema
 */
export const NodeEditorPropsSchema = z.object({
  data: NodeEditorDataSchema,
  options: NodeEditorOptionsSchema.optional(),
  title: z.string().optional()
});

export type NodeEditorProps = z.infer<typeof NodeEditorPropsSchema>;
