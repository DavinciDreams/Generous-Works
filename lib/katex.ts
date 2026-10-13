import type { StrictFunction } from "katex";

/**
 * KaTeX reports top-level line breaks in display math even though it safely
 * renders the remaining expression. Model-generated Markdown commonly emits
 * those breaks, so ignore only that compatibility warning and retain warnings
 * for every other strict-mode issue.
 */
export const generousKatexStrict: StrictFunction = (errorCode) =>
  errorCode === "newLineInDisplayMode" ? "ignore" : "warn";
