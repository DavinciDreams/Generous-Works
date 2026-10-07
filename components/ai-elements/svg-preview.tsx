"use client";
/**
 * @module SVGPreview
 * @description AI-powered SVG preview and editing component with code/preview toggle modes.
 * Validates SVG markup, renders inline previews with configurable dimensions, and provides
 * code editing with syntax highlighting. Supports fullscreen view, copy-to-clipboard,
 * and SVG file download.
 *
 * Uses a compound component pattern: SVGPreview (root), SVGPreviewHeader, SVGPreviewContent,
 * SVGPreviewError, and action buttons.
 *
 * @example
 * ```tsx
 * <SVGPreview svg={`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
 *   <circle cx="50" cy="50" r="40" fill="blue" />
 * </svg>`} title="My SVG">
 *   <SVGPreviewHeader>
 *     <SVGPreviewTitle>My SVG</SVGPreviewTitle>
 *   </SVGPreviewHeader>
 *   <SVGPreviewContent />
 * </SVGPreview>
 * ```
 */

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  MaximizeIcon,
} from "lucide-react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

// --- Types ---

/** Props for the {@link SVGPreview} root component. */
export type SVGPreviewProps = HTMLAttributes<HTMLDivElement> & {
  /** Raw SVG markup string to preview and/or edit. */
  svg: string;
  /** Optional title displayed in the preview header. */
  title?: string;
  /** Optional filename for SVG download. */
  filename?: string;
  /** Optional width for the SVG preview container. */
  width?: string | number;
  /** Optional height for the SVG preview container. */
  height?: string | number;
};

/** Display mode for the SVG preview: rendered preview or code editor. */
export type SVGPreviewMode = "preview" | "code";

interface SVGPreviewContextType {
  svg: string;
  title?: string;
  filename?: string;
  width?: string | number;
  height?: string | number;
  error: Error | null;
  setError: (error: Error | null) => void;
  mode: SVGPreviewMode;
  setMode: (mode: SVGPreviewMode) => void;
}

// --- Context ---

const SVGPreviewContext = createContext<SVGPreviewContextType | null>(null);

export const useSVGPreview = () => {
  const context = useContext(SVGPreviewContext);
  if (!context) {
    throw new Error("SVGPreview components must be used within SVGPreview");
  }
  return context;
};

// --- Utilities ---

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const XLINK_NAMESPACE = "http://www.w3.org/1999/xlink";

/**
 * A drawing ready to load as an image. `width` and `height` are the root's own
 * size in pixels, when it gives one; `ratio` is its width over its height,
 * from that size or its viewBox.
 */
export interface SVGImage {
  src: string;
  width?: number;
  height?: number;
  ratio?: number;
}

/** A length an image can use as its intrinsic size: plain pixels. */
const ABSOLUTE_LENGTH = /^\s*(\d+(?:\.\d+)?)(px)?\s*$/;
const absoluteLength = (value: string | null): number | undefined => {
  const match = value === null ? null : ABSOLUTE_LENGTH.exec(value);
  const length = match ? Number(match[1]) : 0;
  return length > 0 ? length : undefined;
};

const viewBoxRatio = (value: string | null): number | undefined => {
  const box = value?.trim().split(/[\s,]+/).map(Number);
  if (!box || box.length !== 4 || box.some((n) => !Number.isFinite(n))) return undefined;
  return box[2] > 0 && box[3] > 0 ? box[2] / box[3] : undefined;
};

/**
 * The SVG as an image.
 *
 * A preview used to be inserted into the page as markup, so an SVG carrying
 * `<image onerror=...>` ran code in this origin, and a `<style>` inside it
 * restyled the whole page. SVG is untrusted here: it comes from model output
 * and, once surfaces are saved, from anyone who can write to Galaxy. Loaded as
 * an image it is the browser's own sandbox instead: no script or event handler
 * runs, its styles cannot reach the page, and it cannot fetch anything.
 *
 * An image must be strict XML, which inline SVG never had to be. So the source
 * is first read by the forgiving HTML parser, as inline SVG always was: `&deg;`
 * and `&nbsp;` resolve, sloppy markup is repaired, and a `<svg` inside a
 * comment stays a comment. The parsed drawing is then written back out as XML,
 * which declares its namespaces itself. A DOMParser document has no browsing
 * context, so nothing in it runs or loads along the way.
 *
 * An image cannot inherit the page's text colour, so `currentColor` would be
 * black on a dark page; `color` sets it unless the drawing sets its own.
 */
export const svgImage = (svg: string, color?: string): SVGImage | null => {
  if (typeof DOMParser === "undefined") return null;
  const root = new DOMParser().parseFromString(svg, "text/html").querySelector("svg");
  if (!root || root.namespaceURI !== SVG_NAMESPACE) return null;

  // Prefixed names would need namespace declarations the image may not get.
  // `xlink:href` becomes plain `href`, which SVG 2 reads the same way, and
  // editor metadata such as `inkscape:label` or `<sodipodi:namedview>` goes.
  for (const element of [root, ...root.querySelectorAll("*")]) {
    if (element.nodeName.includes(":")) {
      element.remove();
      continue;
    }
    for (const attribute of [...element.attributes]) {
      if (!attribute.name.includes(":") || attribute.name.startsWith("xml:")) continue;
      if (attribute.namespaceURI === XLINK_NAMESPACE && attribute.localName === "href" && !element.hasAttribute("href")) {
        element.setAttribute("href", attribute.value);
      }
      element.removeAttributeNode(attribute);
    }
  }
  if (color && !root.hasAttribute("color")) root.setAttribute("color", color);

  // `width="100%"` means "fill wherever I am drawn", which an image cannot
  // know; left in, the browser falls back to 300x150. Without it the image
  // takes its proportions from the viewBox and fills its frame.
  const width = absoluteLength(root.getAttribute("width"));
  const height = absoluteLength(root.getAttribute("height"));
  if (width === undefined) root.removeAttribute("width");
  if (height === undefined) root.removeAttribute("height");
  const ratio = width && height ? width / height : viewBoxRatio(root.getAttribute("viewBox"));

  let src: string;
  try {
    src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(root))}`;
  } catch {
    // Half of a surrogate pair cannot be encoded: the source is not valid text.
    return null;
  }
  return { height, ratio, src, width };
};

/**
 * A width or height as `<img>` and `<iframe>` attributes take it: pixels.
 * `em` and `rem` are converted at the default 16px; zero means unset.
 */
const pixels = (value: string | number | undefined): number | undefined => {
  if (typeof value === "number") return value > 0 ? value : undefined;
  const match = value?.trim().match(/^(\d+(?:\.\d+)?)(px|em|rem)?$/);
  const size = match ? Number(match[1]) * (match[2]?.endsWith("em") ? 16 : 1) : 0;
  return size > 0 ? size : undefined;
};

/**
 * The page's text colour, read once and again only when the theme changes:
 * reading computed style on every render would force a style recalculation.
 */
let pageColor: string | null = null;
const subscribeToTheme = (onChange: () => void) => {
  const observer = new MutationObserver(() => {
    pageColor = null;
    onChange();
  });
  observer.observe(document.documentElement, {
    attributeFilter: ["class", "style", "data-theme"],
    attributes: true,
  });
  return () => observer.disconnect();
};
const pageTextColor = () => (pageColor ??= getComputedStyle(document.body).color);
const noPageOnServer = () => null;

/** The page's text colour, following theme changes; null while server rendering. */
const usePageTextColor = () =>
  useSyncExternalStore(subscribeToTheme, pageTextColor, noPageOnServer);

// --- Main Component ---

export const SVGPreview = memo(
  ({
    svg,
    title,
    filename = "image.svg",
    width,
    height,
    className,
    children,
    ...props
  }: SVGPreviewProps) => {
    const [error, setError] = useState<Error | null>(null);
    const [mode, setMode] = useState<SVGPreviewMode>("preview");
    const [prevSvg, setPrevSvg] = useState(svg);

    // Clear error when svg changes (derived state pattern)
    if (svg !== prevSvg) {
      setPrevSvg(svg);
      setError(null);
    }

    const contextValue = useMemo<SVGPreviewContextType>(
      () => ({
        error,
        filename,
        height,
        mode,
        setError,
        setMode,
        svg,
        title,
        width,
      }),
      [svg, title, filename, width, height, error, mode]
    );

    return (
      <SVGPreviewContext.Provider value={contextValue}>
        <div
          className={cn(
            "group relative overflow-hidden rounded-md border bg-background",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </SVGPreviewContext.Provider>
    );
  }
);

SVGPreview.displayName = "SVGPreview";

// --- Header Component ---

export type SVGPreviewHeaderProps = HTMLAttributes<HTMLDivElement>;

export const SVGPreviewHeader = memo(
  ({ className, children, ...props }: SVGPreviewHeaderProps) => (
    <div
      className={cn(
        "flex items-center justify-between border-b bg-muted/80 px-3 py-2 text-muted-foreground text-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

SVGPreviewHeader.displayName = "SVGPreviewHeader";

// --- Title Component ---

export type SVGPreviewTitleProps = HTMLAttributes<HTMLDivElement>;

export const SVGPreviewTitle = memo(
  ({ className, children, ...props }: SVGPreviewTitleProps) => {
    const { title, filename } = useSVGPreview();

    return (
      <div className={cn("flex items-center gap-2", className)} {...props}>
        <span className="font-mono">{children ?? title ?? filename}</span>
      </div>
    );
  }
);

SVGPreviewTitle.displayName = "SVGPreviewTitle";

// --- Actions Component ---

export type SVGPreviewActionsProps = HTMLAttributes<HTMLDivElement>;

export const SVGPreviewActions = memo(
  ({ className, children, ...props }: SVGPreviewActionsProps) => (
    <div
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);

SVGPreviewActions.displayName = "SVGPreviewActions";

// --- Mode Toggle Component ---

export type SVGPreviewModeToggleProps = ComponentProps<typeof Select>;

export const SVGPreviewModeToggle = memo(
  ({ onValueChange, ...props }: SVGPreviewModeToggleProps) => {
    const { mode, setMode } = useSVGPreview();

    const handleValueChange = useCallback(
      (value: string) => {
        setMode(value as SVGPreviewMode);
        onValueChange?.(value);
      },
      [setMode, onValueChange]
    );

    return (
      <Select value={mode} onValueChange={handleValueChange} {...props}>
        <SelectTrigger className="h-7 border-none bg-transparent px-2 text-xs shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="preview">
            <div className="flex items-center gap-2">
              <EyeIcon size={14} />
              <span>Preview</span>
            </div>
          </SelectItem>
          <SelectItem value="code">
            <div className="flex items-center gap-2">
              <CodeIcon size={14} />
              <span>Source</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }
);

SVGPreviewModeToggle.displayName = "SVGPreviewModeToggle";

// --- Copy Button Component ---

export type SVGPreviewCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const SVGPreviewCopyButton = memo(
  ({
    onCopy,
    onError,
    timeout = 2000,
    children,
    className,
    ...props
  }: SVGPreviewCopyButtonProps) => {
    const [isCopied, setIsCopied] = useState(false);
    const timeoutRef = useRef<number>(0);
    const { svg } = useSVGPreview();

    const copyToClipboard = useCallback(async () => {
      if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
        onError?.(new Error("Clipboard API not available"));
        return;
      }

      try {
        if (!isCopied) {
          await navigator.clipboard.writeText(svg);
          setIsCopied(true);
          onCopy?.();
          timeoutRef.current = window.setTimeout(
            () => setIsCopied(false),
            timeout
          );
        }
      } catch (error) {
        onError?.(error as Error);
      }
    }, [svg, onCopy, onError, timeout, isCopied]);

    useEffect(
      () => () => {
        window.clearTimeout(timeoutRef.current);
      },
      []
    );

    const Icon = isCopied ? CheckIcon : CopyIcon;

    return (
      <Button
        className={cn("shrink-0", className)}
        onClick={copyToClipboard}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? <Icon size={14} />}
      </Button>
    );
  }
);

SVGPreviewCopyButton.displayName = "SVGPreviewCopyButton";

// --- Download Button Component ---

export type SVGPreviewDownloadButtonProps = ComponentProps<typeof Button> & {
  onDownload?: () => void;
  onError?: (error: Error) => void;
};

export const SVGPreviewDownloadButton = memo(
  ({
    onDownload,
    onError,
    children,
    className,
    ...props
  }: SVGPreviewDownloadButtonProps) => {
    const { svg, filename } = useSVGPreview();

    const downloadSVG = useCallback(() => {
      try {
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename ?? "image.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        onDownload?.();
      } catch (error) {
        onError?.(error as Error);
      }
    }, [svg, filename, onDownload, onError]);

    return (
      <Button
        className={cn("shrink-0", className)}
        onClick={downloadSVG}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? <DownloadIcon size={14} />}
      </Button>
    );
  }
);

SVGPreviewDownloadButton.displayName = "SVGPreviewDownloadButton";

// --- Content Component ---

export type SVGPreviewContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  showSource?: boolean;
  isolate?: boolean;
};

export const SVGPreviewContent = memo(
  ({
    showSource = false,
    isolate = false,
    className,
    ...props
  }: SVGPreviewContentProps) => {
    const { svg, title, mode, width, height, setError } = useSVGPreview();
    const color = usePageTextColor();
    // Built only in the browser: the server has no parser, and renders a frame.
    const image = useMemo(
      () => (color === null ? null : svgImage(svg, color)),
      [svg, color]
    );

    // Show source if mode is "code" or showSource prop is true
    const shouldShowSource = mode === "code" || showSource;

    const invalid = !shouldShowSource && color !== null && image === null;
    const reportInvalid = useEffectEvent(() => setError(new Error("Invalid SVG markup")));
    useEffect(() => {
      if (invalid) reportInvalid();
    }, [invalid]);

    // Sizes go on as attributes. Only the drawing's root says how big it is,
    // and an image already knows that, so nothing is read out of the markup.
    const pixelWidth = pixels(width);
    const pixelHeight = pixels(height);
    const fillsWidth =
      pixelWidth === undefined &&
      ((typeof width === "string" && width.trim().endsWith("%")) ||
        (pixelHeight === undefined && image !== null && image.width === undefined));

    if (shouldShowSource) {
      return (
        <div className={cn("relative overflow-auto", className)} {...props}>
          <pre className="m-0 p-4 text-sm">
            <code className="font-mono text-sm">{svg}</code>
          </pre>
        </div>
      );
    }

    if (isolate) {
      // A frame has no size of its own, so it takes the drawing's: its root
      // size, or else its proportions at the frame's width.
      const frameWidth = pixelWidth ?? image?.width;
      const ratio = image?.ratio;
      const frameHeight =
        pixelHeight ??
        (pixelWidth === undefined ? image?.height : undefined) ??
        (frameWidth !== undefined && ratio ? frameWidth / ratio : undefined);
      return (
        <div
          className={cn("relative flex items-center justify-center p-4", className)}
          {...props}
        >
          {/*
            An empty sandbox: without it a srcDoc frame shares this page's
            origin, so script inside the SVG would run with full access to it.
          */}
          <iframe
            className={cn("max-w-full border-0", frameWidth === undefined && "w-full")}
            height={frameHeight ?? (ratio ? undefined : 300)}
            sandbox=""
            srcDoc={`<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    svg { max-width: 100%; height: auto; }
  </style>
</head>
<body>${svg}</body>
</html>`}
            // The drawing's own proportions, which no class can express.
            style={frameHeight === undefined && ratio ? { aspectRatio: ratio } : undefined}
            title="SVG Preview"
            width={frameWidth}
          />
        </div>
      );
    }

    // Render inline
    return (
      <div
        className={cn(
          "relative flex items-center justify-center bg-muted/30 p-4",
          className
        )}
        {...props}
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element -- a data: URL cannot go through the image optimizer, and the image boundary is the point
          <img
            alt={title || "SVG preview"}
            className={cn(
              "max-w-full",
              pixelHeight === undefined && "h-auto",
              fillsWidth && "w-full"
            )}
            height={pixelHeight}
            src={image.src}
            width={pixelWidth}
          />
        )}
      </div>
    );
  }
);

SVGPreviewContent.displayName = "SVGPreviewContent";

// --- Error Component ---

export type SVGPreviewErrorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children?: ReactNode | ((error: Error) => ReactNode);
};

const renderChildren = (
  children: ReactNode | ((error: Error) => ReactNode),
  error: Error
): ReactNode => {
  if (typeof children === "function") {
    return children(error);
  }
  return children;
};

export const SVGPreviewError = memo(
  ({ className, children, ...props }: SVGPreviewErrorProps) => {
    const { error } = useSVGPreview();

    if (!error) {
      return null;
    }

    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-destructive text-sm",
          className
        )}
        {...props}
      >
        {children ? (
          renderChildren(children, error)
        ) : (
          <>
            <AlertCircle className="size-4 shrink-0" />
            <span>{error.message}</span>
          </>
        )}
      </div>
    );
  }
);

SVGPreviewError.displayName = "SVGPreviewError";

// --- Fullscreen Button Component ---

export type SVGPreviewFullscreenButtonProps = ComponentProps<typeof Button> & {
  onFullscreen?: () => void;
};

export const SVGPreviewFullscreenButton = memo(
  ({
    onFullscreen,
    children,
    className,
    ...props
  }: SVGPreviewFullscreenButtonProps) => {
    const handleFullscreen = useCallback(() => {
      onFullscreen?.();
    }, [onFullscreen]);

    return (
      <Button
        className={cn("shrink-0", className)}
        onClick={handleFullscreen}
        size="icon"
        variant="ghost"
        {...props}
      >
        {children ?? <MaximizeIcon size={14} />}
      </Button>
    );
  }
);

SVGPreviewFullscreenButton.displayName = "SVGPreviewFullscreenButton";
