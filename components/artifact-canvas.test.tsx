import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  ArtifactCanvas,
  getCanvasArtifactId,
  getNextArtifactPosition,
} from "@/components/artifact-canvas";

describe("getNextArtifactPosition", () => {
  it("starts the first artifact at the canvas origin", () => {
    expect(getNextArtifactPosition([], "turn-1")).toEqual({ x: 0, y: 0 });
  });

  it("places artifacts from the same response side by side", () => {
    const placed = [{ turnId: "turn-1", x: 0, y: 0, width: 720, height: 400 }];
    expect(getNextArtifactPosition(placed, "turn-1")).toEqual({ x: 784, y: 0 });
  });

  it("starts a new row below everything for a new response", () => {
    const placed = [
      { turnId: "turn-1", x: 0, y: 0, width: 720, height: 400 },
      { turnId: "turn-1", x: 784, y: 0, width: 720, height: 600 },
    ];
    expect(getNextArtifactPosition(placed, "turn-2")).toEqual({ x: 0, y: 696 });
  });
});

describe("ArtifactCanvas", () => {
  it("renders artifacts freely, without diagram chrome", () => {
    const { container } = render(
      <div style={{ height: 800, width: 1200 }}>
        <ArtifactCanvas
          emptyState={<p>Nothing yet</p>}
          items={[
            {
              id: getCanvasArtifactId("response", "a2ui-block-0"),
              turnId: "response",
              label: "Chart",
              emoji: "📊",
              body: <p>Quarterly revenue</p>,
            },
          ]}
        />
      </div>,
    );

    expect(screen.getByRole("region", { name: "Artifact canvas" })).toBeInTheDocument();
    // React Flow keeps nodes hidden until measured, which jsdom never does.
    expect(container.querySelector('[aria-label="Chart artifact"]')).toHaveTextContent("Quarterly revenue");
    expect(screen.getByRole("button", { name: "Fit all artifacts" })).toBeInTheDocument();
    expect(container.querySelector(".react-flow__handle")).toBeNull();
    expect(container.querySelector(".react-flow__edge")).toBeNull();
    expect(container.querySelector(".react-flow__minimap")).toBeNull();
    expect(screen.queryByText("Nothing yet")).toBeNull();
  });

  it("shows the empty state when there are no artifacts", () => {
    render(
      <div style={{ height: 800, width: 1200 }}>
        <ArtifactCanvas emptyState={<p>Nothing yet</p>} items={[]} />
      </div>,
    );

    expect(screen.getByText("Nothing yet")).toBeInTheDocument();
  });
});
