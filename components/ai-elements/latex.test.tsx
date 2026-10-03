import { afterEach, describe, expect, it, vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import katex from "katex";

import { Latex, LatexContent } from "@/components/ai-elements/latex";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("LatexContent", () => {
  it("renders an equation once instead of re-rendering in a loop", async () => {
    // KaTeX refuses to run in happy-dom's quirks-mode document, so stand in
    // for it; the loop under test lives in the component, not in KaTeX.
    const renderSpy = vi.spyOn(katex, "render").mockImplementation((tex, element) => {
      element.textContent = tex;
    });
    const data = { equation: "E = mc^2" };

    const { container } = render(
      <Latex data={data}>
        <LatexContent />
      </Latex>,
    );

    await waitFor(() => {
      expect(container.querySelector(".equation-container")).toHaveTextContent("E = mc^2");
    });
    // Give a looping effect time to show itself before counting.
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(renderSpy).toHaveBeenCalledTimes(1);
    expect(container.querySelectorAll(".equation-container")).toHaveLength(1);
  });
});
