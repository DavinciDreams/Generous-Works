"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
  PauseIcon,
  PlayIcon,
  RotateCcwIcon,
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

// --- Types ---

export interface RemotionComposition {
  id: string;
  component: string; // Serialized React component or composition
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  defaultProps?: Record<string, unknown>;
}

export interface RemotionData {
  composition: RemotionComposition;
  inputProps?: Record<string, unknown>;
}

export interface RemotionOptions {
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
  playbackRate?: number;
}

export interface RemotionRef {
  play: () => void;
  pause: () => void;
  seekTo: (frame: number) => void;
  getCurrentFrame: () => number;
  getDuration: () => number;
}

// --- Context ---

interface RemotionContextValue {
  data: RemotionData;
  options?: RemotionOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  currentFrame: number;
  setCurrentFrame: (frame: number) => void;
  remotionRef: React.RefObject<RemotionRef | null>;
}

const RemotionContext = createContext<RemotionContextValue | null>(null);

const useRemotionContext = () => {
  const context = useContext(RemotionContext);
  if (!context) {
    throw new Error("Remotion components must be used within Remotion");
  }
  return context;
};

// --- Remotion Component ---

export interface RemotionProps extends HTMLAttributes<HTMLDivElement> {
  data: RemotionData;
  options?: RemotionOptions;
  children?: ReactNode;
}

export const Remotion = forwardRef<RemotionRef, RemotionProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(options?.autoPlay ?? false);
    const [currentFrame, setCurrentFrame] = useState(0);
    const remotionRef = useRef<RemotionRef | null>(null);

    // Expose ref
    useImperativeHandle(ref, () => remotionRef.current as RemotionRef, []);

    const contextValue: RemotionContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      isPlaying,
      setIsPlaying,
      currentFrame,
      setCurrentFrame,
      remotionRef,
    };

    return (
      <RemotionContext.Provider value={contextValue}>
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
      </RemotionContext.Provider>
    );
  }
);

Remotion.displayName = "Remotion";

// --- Remotion Header ---

export const RemotionHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center justify-between border-b bg-muted/80 px-3 py-2 text-muted-foreground text-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

RemotionHeader.displayName = "RemotionHeader";

// --- Remotion Title ---

export const RemotionTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { data } = useRemotionContext();

  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      <span className="font-mono">
        {children || data.composition.id || "Remotion Video"}
      </span>
    </div>
  );
});

RemotionTitle.displayName = "RemotionTitle";

// --- Remotion Actions ---

export const RemotionActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("-my-1 -mr-1 flex items-center gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
});

RemotionActions.displayName = "RemotionActions";

// --- Remotion Play Button ---

export const RemotionPlayButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { isPlaying, remotionRef } = useRemotionContext();

  const togglePlay = () => {
    if (isPlaying) {
      remotionRef.current?.pause();
    } else {
      remotionRef.current?.play();
    }
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={togglePlay}
      {...props}
    >
      {isPlaying ? (
        <PauseIcon className="h-4 w-4" />
      ) : (
        <PlayIcon className="h-4 w-4" />
      )}
    </Button>
  );
});

RemotionPlayButton.displayName = "RemotionPlayButton";

// --- Remotion Reset Button ---

export const RemotionResetButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { remotionRef } = useRemotionContext();

  const handleReset = () => {
    remotionRef.current?.seekTo(0);
  };

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={handleReset}
      {...props}
    >
      <RotateCcwIcon className="h-4 w-4" />
    </Button>
  );
});

RemotionResetButton.displayName = "RemotionResetButton";

// --- Remotion Copy Button ---

export const RemotionCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { data } = useRemotionContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
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

RemotionCopyButton.displayName = "RemotionCopyButton";

// --- Remotion Fullscreen Button ---

export const RemotionFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useRemotionContext();

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

RemotionFullscreenButton.displayName = "RemotionFullscreenButton";

// --- Remotion Timeline ---

export const RemotionTimeline = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data, currentFrame, setCurrentFrame, remotionRef } =
    useRemotionContext();

  const handleSeek = useCallback(
    (values: number[]) => {
      const frame = values[0];
      setCurrentFrame(frame);
      remotionRef.current?.seekTo(frame);
    },
    [setCurrentFrame, remotionRef]
  );

  const maxFrame = data.composition.durationInFrames - 1;
  const timeInSeconds = (currentFrame / data.composition.fps).toFixed(2);
  const totalTimeInSeconds = (maxFrame / data.composition.fps).toFixed(2);

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-3 px-4 py-2", className)}
      {...props}
    >
      <span className="text-muted-foreground text-xs font-mono whitespace-nowrap">
        {timeInSeconds}s / {totalTimeInSeconds}s
      </span>
      <Slider
        value={[currentFrame]}
        onValueChange={handleSeek}
        max={maxFrame}
        min={0}
        step={1}
        className="flex-1"
      />
      <span className="text-muted-foreground text-xs font-mono whitespace-nowrap">
        {currentFrame} / {maxFrame}
      </span>
    </div>
  );
});

RemotionTimeline.displayName = "RemotionTimeline";

// --- Remotion Content ---

export const RemotionContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        setError,
        fullscreen,
        isPlaying,
        setIsPlaying,
        currentFrame,
        setCurrentFrame,
        remotionRef,
      } = useRemotionContext();

      const containerRef = useRef<HTMLDivElement>(null);
      const [isMounted, setIsMounted] = useState(false);
      const animationFrameRef = useRef<number | undefined>(undefined);
      const lastTimeRef = useRef<number>(0);

      // Only render on client
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Simple frame-based playback (simplified Remotion simulation)
      useEffect(() => {
        if (!isMounted || !isPlaying) return;

        const fps = data.composition.fps;
        const frameDuration = 1000 / fps;

        const animate = (time: number) => {
          if (lastTimeRef.current === 0) {
            lastTimeRef.current = time;
          }

          const elapsed = time - lastTimeRef.current;

          if (elapsed >= frameDuration) {
            setCurrentFrame((prev) => {
              const nextFrame = prev + 1;
              if (nextFrame >= data.composition.durationInFrames) {
                if (options?.loop) {
                  return 0;
                } else {
                  setIsPlaying(false);
                  return data.composition.durationInFrames - 1;
                }
              }
              return nextFrame;
            });

            lastTimeRef.current = time;
          }

          if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(animate);
          }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          lastTimeRef.current = 0;
        };
      }, [
        isMounted,
        isPlaying,
        data.composition.fps,
        data.composition.durationInFrames,
        options?.loop,
        setCurrentFrame,
        setIsPlaying,
      ]);

      // Setup ref methods
      useEffect(() => {
        remotionRef.current = {
          play: () => setIsPlaying(true),
          pause: () => setIsPlaying(false),
          seekTo: (frame: number) => {
            setCurrentFrame(
              Math.max(0, Math.min(frame, data.composition.durationInFrames - 1))
            );
          },
          getCurrentFrame: () => currentFrame,
          getDuration: () => data.composition.durationInFrames,
        };
      }, [
        remotionRef,
        setIsPlaying,
        setCurrentFrame,
        currentFrame,
        data.composition.durationInFrames,
      ]);

      if (error) {
        return <RemotionError error={error} />;
      }

      const height = fullscreen
        ? "100%"
        : data.composition.height || 600;
      const width = fullscreen
        ? "100%"
        : data.composition.width || 800;

      if (!isMounted) {
        return (
          <div
            ref={ref}
            className={cn("relative flex-1 p-4", className)}
            {...props}
          >
            <div
              style={{
                width: typeof width === "number" ? `${width}px` : width,
                height: typeof height === "number" ? `${height}px` : height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Loading Remotion...
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
          <div
            ref={containerRef}
            className="flex items-center justify-center bg-black rounded"
            style={{
              width: typeof width === "number" ? `${width}px` : width,
              height: typeof height === "number" ? `${height}px` : height,
            }}
          >
            <div className="text-white text-center p-8">
              <div className="text-2xl font-bold mb-2">
                {data.composition.id}
              </div>
              <div className="text-sm opacity-70">
                Frame: {currentFrame} / {data.composition.durationInFrames - 1}
              </div>
              <div className="text-xs opacity-50 mt-4">
                {data.composition.width}x{data.composition.height} @ {data.composition.fps}fps
              </div>
              <div className="text-xs opacity-30 mt-2">
                Remotion composition preview
              </div>
            </div>
          </div>
        </div>
      );
    }
  )
);

RemotionContent.displayName = "RemotionContent";

// --- Remotion Error ---

export const RemotionError = forwardRef<
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

RemotionError.displayName = "RemotionError";
