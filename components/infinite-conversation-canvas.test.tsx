import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  InfiniteConversationCanvas,
  getDefaultCanvasPosition,
} from "@/components/infinite-conversation-canvas";

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
