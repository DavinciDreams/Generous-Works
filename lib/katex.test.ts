import katex from "katex";
import { describe, expect, it, vi } from "vitest";

import { generousKatexStrict } from "@/lib/katex";
import { streamdownPlugins } from "@/lib/streamdown-plugins";

describe("generousKatexStrict", () => {
  it("ignores display-mode line break warnings only", () => {
    expect(generousKatexStrict("newLineInDisplayMode", "", undefined!)).toBe(
      "ignore"
    );
    expect(generousKatexStrict("unknownSymbol", "", undefined!)).toBe("warn");
  });

  it("prevents KaTeX from logging the known display-mode warning", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    katex.renderToString(String.raw`a \\ b`, {
      displayMode: true,
      strict: generousKatexStrict,
    });

    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("configures Streamdown math rendering with the same strict handler", () => {
    expect(Array.isArray(streamdownPlugins.math.rehypePlugin)).toBe(true);

    const [, options] = streamdownPlugins.math.rehypePlugin as unknown as [
      unknown,
      Record<string, unknown>,
    ];

    expect(options.strict).toBe(generousKatexStrict);
  });
});
