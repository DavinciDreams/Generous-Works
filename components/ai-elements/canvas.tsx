import type { ReactFlowProps } from "@xyflow/react";
import type { ReactNode } from "react";

import { Background, ReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

type CanvasProps = ReactFlowProps & {
  children?: ReactNode;
};

const deleteKeyCode = ["Backspace", "Delete"];

export const Canvas = ({ children, ...props }: CanvasProps) => (
  <ReactFlow
    deleteKeyCode={deleteKeyCode}
    fitView
    panOnDrag
    panOnScroll
    selectionOnDrag={false}
    zoomOnDoubleClick={false}
    {...props}
  >
    <Background bgColor="var(--background)" color="var(--border)" gap={24} size={1.25} />
    {children}
  </ReactFlow>
);
