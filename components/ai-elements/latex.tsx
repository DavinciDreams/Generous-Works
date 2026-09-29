"use client";
/**
 * @module Latex
 * @description AI-powered LaTeX equation rendering component using KaTeX. Supports
 * multiple equations with inline and display modes, configurable macros, and error
 * handling. Includes copy-to-clipboard and fullscreen viewing.
 *
 * Uses a compound component pattern: Latex (root), LatexHeader, LatexContent,
 * LatexError, and action buttons.
 *
 * @example
 * ```tsx
 * <Latex
 *   data={{
 *     equations: [
 *       { id: "1", latex: "E = mc^2", displayMode: true },
 *       { id: "2", latex: "\\int_0^\\infty e^{-x} dx = 1", displayMode: true }
 *     ]
 *   }}
 * >
 *   <LatexHeader>
 *     <LatexTitle>Physics Equations</LatexTitle>
 *   </LatexHeader>
 *   <LatexContent />
 * </Latex>
 * ```
 */

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

// Import KaTeX styles
import "katex/dist/katex.min.css";

// --- Types ---

/** A single LaTeX equation with optional ID, display mode, and label. */
export interface LatexEquation {
  id?: string;
  equation: string;
  displayMode?: boolean;
  label?: string;
}

/** Data payload for the Latex component containing one or more equations. */
export interface LatexData {
  equations?: LatexEquation[];
  equation?: string;
  displayMode?: boolean;
}

/** Configuration options for KaTeX rendering. */
export interface LatexOptions {
  displayMode?: boolean;
  throwOnError?: boolean;
  errorColor?: string;
  macros?: Record<string, string>;
  trust?: boolean;
  strict?: boolean | "warn" | "ignore";
  output?: "html" | "mathml" | "htmlAndMathml";
  fleqn?: boolean;
  leqno?: boolean;
  minRuleThickness?: number;
  [key: string]: unknown;
}

/** Imperative handle exposed by the Latex component via ref. */
export interface LatexRef {
  renderEquation: (equation: string, displayMode?: boolean) => void;
  clearEquations: () => void;
  getEquations: () => LatexEquation[];
}

// --- Context ---

interface LatexContextValue {
  data: LatexData;
  options?: LatexOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  copyToClipboard: () => Promise<void>;
  latexRef: React.RefObject<LatexRef | null>;
  renderedEquations: LatexEquation[];
  setRenderedEquations: React.Dispatch<React.SetStateAction<LatexEquation[]>>;
}

const LatexContext = createContext<LatexContextValue | null>(null);

const useLatexContext = () => {
  const context = useContext(LatexContext);
  if (!context) {
    throw new Error("Latex components must be used within Latex");
  }
  return context;
};

// --- Latex Component ---

/** Props for the {@link Latex} root component. */
export interface LatexProps extends HTMLAttributes<HTMLDivElement> {
  /** LaTeX data containing one or more equations to render. */
  data: LatexData;
  /** Optional configuration for rendering mode and macros. */
  options?: LatexOptions;
  /** Child components (header, content, error). */
  children?: ReactNode;
}

export const Latex = forwardRef<LatexRef, LatexProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const latexRef = useRef<LatexRef | null>(null);
    const [renderedEquations, setRenderedEquations] = useState<LatexEquation[]>(
      []
    );

    // Expose ref
    useImperativeHandle(ref, () => latexRef.current as LatexRef, []);

    const copyToClipboard = useCallback(async () => {
      try {
        const textToCopy =
          data.equation ||
          data.equations?.map((eq) => eq.equation).join("\n\n") ||
          "";
        await navigator.clipboard.writeText(textToCopy);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [data]);

    const contextValue: LatexContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      copyToClipboard,
      latexRef,
      renderedEquations,
      setRenderedEquations,
    };

    return (
      <LatexContext.Provider value={contextValue}>
        <div
          className={cn(
            "flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm",
            fullscreen && "fixed inset-0 z-50 rounded-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </LatexContext.Provider>
    );
  }
);

Latex.displayName = "Latex";

// --- Latex Header ---

export const LatexHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-between gap-2 p-4 pb-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

LatexHeader.displayName = "LatexHeader";

// --- Latex Title ---

export const LatexTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex-1", className)} {...props}>
      <h3 className="text-lg font-semibold">{children || "LaTeX"}</h3>
    </div>
  );
});

LatexTitle.displayName = "LatexTitle";

// --- Latex Actions ---

export const LatexActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
});

LatexActions.displayName = "LatexActions";

// --- Latex Copy Button ---

export const LatexCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { copyToClipboard } = useLatexContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleCopy}
      {...props}
    >
      {copied ? (
        <CheckIcon className="h-4 w-4" />
      ) : (
        <CopyIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

LatexCopyButton.displayName = "LatexCopyButton";

// --- Latex Fullscreen Button ---

export const LatexFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useLatexContext();

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={() => setFullscreen(!fullscreen)}
      {...props}
    >
      {fullscreen ? (
        <MinimizeIcon className="h-4 w-4" />
      ) : (
        <MaximizeIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

LatexFullscreenButton.displayName = "LatexFullscreenButton";

// --- Latex Content ---

export const LatexContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        setError,
        latexRef,
        setRenderedEquations,
      } = useLatexContext();

      const [isMounted, setIsMounted] = useState(false);
      const contentRef = useRef<HTMLDivElement>(null);
      // Read by getEquations() so the render effect does not depend on the
      // state it writes; that dependency re-ran the effect on every render.
      const renderedEquationsRef = useRef<LatexEquation[]>([]);

      // Only render on client to avoid SSR issues
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Render equations using KaTeX
      useEffect(() => {
        if (!isMounted || !contentRef.current) return;

        const renderEquations = async () => {
          try {
            const katex = (await import("katex")).default;

            // Clear previous content
            if (contentRef.current) {
              contentRef.current.innerHTML = "";
            }

            // Determine equations to render
            let equationsToRender: LatexEquation[] = [];

            if (data.equation) {
              // Single equation mode
              equationsToRender = [
                {
                  equation: data.equation,
                  displayMode: data.displayMode ?? options?.displayMode ?? true,
                },
              ];
            } else if (data.equations && data.equations.length > 0) {
              // Multiple equations mode
              equationsToRender = data.equations.map((eq) => ({
                ...eq,
                displayMode:
                  eq.displayMode ?? options?.displayMode ?? true,
              }));
            }

            renderedEquationsRef.current = equationsToRender;
            setRenderedEquations(equationsToRender);

            // Render each equation
            equationsToRender.forEach((eq, index) => {
              const container = document.createElement("div");
              container.className = cn(
                "equation-container",
                eq.displayMode ? "my-4" : "inline-block mx-1"
              );

              // Add label if provided
              if (eq.label) {
                const label = document.createElement("div");
                label.className = "text-sm text-muted-foreground mb-2";
                label.textContent = eq.label;
                container.appendChild(label);
              }

              const equationDiv = document.createElement("div");
              equationDiv.className = eq.displayMode
                ? "overflow-x-auto"
                : "inline-block";

              try {
                katex.render(eq.equation, equationDiv, {
                  displayMode: eq.displayMode,
                  throwOnError: options?.throwOnError ?? false,
                  errorColor: options?.errorColor ?? "#cc0000",
                  macros: options?.macros,
                  trust: options?.trust ?? false,
                  strict: options?.strict ?? "warn",
                  output: options?.output ?? "htmlAndMathml",
                  fleqn: options?.fleqn ?? false,
                  leqno: options?.leqno ?? false,
                  minRuleThickness: options?.minRuleThickness,
                });

                container.appendChild(equationDiv);
                contentRef.current?.appendChild(container);
              } catch (err) {
                const errorMsg =
                  err instanceof Error ? err.message : "Failed to render equation";
                console.error(`Error rendering equation ${index}:`, errorMsg);

                // Show error inline
                const errorDiv = document.createElement("div");
                errorDiv.className =
                  "text-destructive text-sm p-2 bg-destructive/10 rounded border border-destructive";
                errorDiv.textContent = `Error: ${errorMsg}`;
                container.appendChild(errorDiv);
                contentRef.current?.appendChild(container);

                // Set global error if first equation fails
                if (index === 0) {
                  setError(errorMsg);
                }
              }
            });

            // Setup ref methods
            latexRef.current = {
              renderEquation: (equation: string, displayMode = true) => {
                const newEquation: LatexEquation = {
                  id: `eq-${Date.now()}`,
                  equation,
                  displayMode,
                };
                renderedEquationsRef.current = [...renderedEquationsRef.current, newEquation];
                setRenderedEquations(renderedEquationsRef.current);
              },
              clearEquations: () => {
                renderedEquationsRef.current = [];
                setRenderedEquations([]);
                if (contentRef.current) {
                  contentRef.current.innerHTML = "";
                }
              },
              getEquations: () => renderedEquationsRef.current,
            };
          } catch (err) {
            console.error("Failed to load KaTeX:", err);
            setError(
              err instanceof Error ? err.message : "Failed to load KaTeX"
            );
          }
        };

        renderEquations();
      }, [
        isMounted,
        data,
        options,
        setError,
        latexRef,
        setRenderedEquations,
      ]);

      if (error) {
        return <LatexError error={error} />;
      }

      // Don't render until mounted on client
      if (!isMounted) {
        return (
          <div
            ref={ref}
            className={cn("relative flex-1 p-4", className)}
            {...props}
          >
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              Loading LaTeX renderer...
            </div>
          </div>
        );
      }

      return (
        <div
          ref={ref}
          className={cn("relative flex-1 p-4", className)}
          {...props}
        >
          <div ref={contentRef} className="latex-content" />
        </div>
      );
    }
  )
);

LatexContent.displayName = "LatexContent";

// --- Latex Error ---

export const LatexError = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { error: string }
>(({ className, error, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-center gap-2 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive",
        className
      )}
      {...props}
    >
      <AlertCircle className="h-5 w-5" />
      <p className="text-sm font-medium">{error}</p>
    </div>
  );
});

LatexError.displayName = "LatexError";
