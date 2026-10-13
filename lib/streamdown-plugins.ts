import { cjk } from "@streamdown/cjk";
import { code } from "@streamdown/code";
import { createMathPlugin, type MathPlugin } from "@streamdown/math";
import { mermaid } from "@streamdown/mermaid";

import { generousKatexStrict } from "@/lib/katex";

const createGenerousMathPlugin = (): MathPlugin => {
  const mathPlugin = createMathPlugin();

  if (!Array.isArray(mathPlugin.rehypePlugin)) {
    return mathPlugin;
  }

  const [rehypeKatex, rawOptions] = mathPlugin.rehypePlugin;
  const options =
    typeof rawOptions === "object" && rawOptions !== null
      ? rawOptions
      : {};

  return {
    ...mathPlugin,
    rehypePlugin: [
      rehypeKatex,
      { ...options, strict: generousKatexStrict },
    ] as unknown as MathPlugin["rehypePlugin"],
  };
};

export const streamdownPlugins = {
  cjk,
  code,
  math: createGenerousMathPlugin(),
  mermaid,
};
