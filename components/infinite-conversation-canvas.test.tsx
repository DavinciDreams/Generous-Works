import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  InfiniteConversationCanvas,
  getDefaultCanvasPosition,
  syncConversationNodes,
} from "@/components/infinite-conversation-canvas";

describe("syncConversationNodes", () => {
  const prompt = { id: "prompt", role: "user" as const, body: "Build a map" };
  const response = { id: "response", role: "assistant" as const, body: "Here is your map" };

  it("keeps measured sizes when items update, so cards stay visible", () => {
    const [first, second] = syncConversationNodes([], [prompt, { ...response, isStreaming: true }], {});
    const measuredNodes = [
      { ...first, measured: { width: 340, height: 129 } },
      { ...second, measured: { width: 720, height: 609 } },
    ];

    const updated = syncConversationNodes(measuredNodes, [prompt, response], {});

    expect(updated.map((node) => node.measured)).toEqual([
      { width: 340, height: 129 },
      { width: 720, height: 609 },
    ]);
    expect(updated[1].zIndex).toBe(1);
    expect(updated[1].data.item).toBe(response);
  });

  it("places new items from stored positions before falling back to defaults", () => {
    const nodes = syncConversationNodes([], [prompt, response], { response: { x: 10, y: 20 } });

    expect(nodes[0].position).toEqual({ x: 80, y: 80 });
    expect(nodes[1].position).toEqual({ x: 10, y: 20 });
  });
});

describe("getDefaultCanvasPosition", () => {
  it("places a prompt to the left of its response", () => {
    expect(getDefaultCanvasPosition(0, "user")).toEqual({ x: 80, y: 80 });
    expect(getDefaultCanvasPosition(1, "assistant")).toEqual({ x: 500, y: 152 });
  });

  it("stacks later conversation pairs with enough vertical space", () => {
    expect(getDefaultCanvasPosition(2, "user")).toEqual({ x: 80, y: 720 });
    expect(getDefaultCanvasPosition(3, "assistant")).toEqual({ x: 500, y: 792 });
  });
});

describe("InfiniteConversationCanvas", () => {
  it("renders conversation cards and accessible canvas controls", () => {
    const { container } = render(
      <div style={{ height: 800, width: 1200 }}>
        <InfiniteConversationCanvas
          emptyState={<p>Start creating</p>}
          items={[
            { id: "prompt", role: "user", body: <p>Build a map</p> },
            { id: "response", role: "assistant", body: <p>Here is your map</p> },
          ]}
        />
      </div>,
    );

    expect(screen.getByRole("region", { name: "Generous infinite canvas" })).toBeInTheDocument();
    expect(container.querySelector('article[aria-label="Your prompt"]')).toHaveTextContent("Build a map");
    expect(container.querySelector('article[aria-label="Generous response"]')).toHaveTextContent("Here is your map");
    expect(screen.getByRole("button", { name: "Reset layout" })).toBeInTheDocument();
    expect(screen.getByLabelText("Canvas minimap")).toBeInTheDocument();
  });
});
