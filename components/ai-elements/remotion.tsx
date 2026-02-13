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
  startTransition,
  useState,
} from "react";
import { Player, PlayerRef } from "@remotion/player";
import {
  compositionRegistry,
  type CompositionType,
} from "./remotion-compositions";

// --- Types ---

export interface RemotionComposition {
  type: CompositionType;
  width: number;
  height: number;
  fps: number;
  durationInFrames: number;
  props: Record<string, unknown>;
}

export interface RemotionData {
  composition: RemotionComposition;
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
  playerRef: React.RefObject<PlayerRef | null>;
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
    const playerRef = useRef<PlayerRef | null>(null);

    // Expose ref
    useImperativeHandle(
      ref,
      () => ({
        play: () => {
          playerRef.current?.play();
        },
        pause: () => {
          playerRef.current?.pause();
        },
        seekTo: (frame: number) => {
          playerRef.current?.seekTo(frame);
        },
        getCurrentFrame: () => {
          return playerRef.current?.getCurrentFrame() ?? 0;
        },
        getDuration: () => {
          return data.composition.durationInFrames;
        },
      }),
      [data.composition.durationInFrames]
    );

    const contextValue: RemotionContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      playerRef,
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
        {children || data.composition.type || "Remotion Video"}
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
  const { playerRef } = useRemotionContext();
  const [playing, setPlaying] = useState(false);

  const handleToggle = useCallback(() => {
    if (playing) {
      playerRef.current?.pause();
    } else {
      playerRef.current?.play();
    }
    setPlaying(!playing);
  }, [playing, playerRef]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleToggle}
      {...props}
    >
      {playing ? (
        <PauseIcon className="h-3.5 w-3.5" />
      ) : (
        <PlayIcon className="h-3.5 w-3.5" />
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
  const { playerRef } = useRemotionContext();

  const handleReset = useCallback(() => {
    playerRef.current?.seekTo(0);
    playerRef.current?.pause();
  }, [playerRef]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleReset}
      {...props}
    >
      <RotateCcwIcon className="h-3.5 w-3.5" />
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

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleCopy}
      {...props}
    >
      {copied ? (
        <CheckIcon className="h-3.5 w-3.5" />
      ) : (
        <CopyIcon className="h-3.5 w-3.5" />
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

  const handleToggle = useCallback(() => {
    setFullscreen(!fullscreen);
  }, [fullscreen, setFullscreen]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleToggle}
      {...props}
    >
      {fullscreen ? (
        <MinimizeIcon className="h-3.5 w-3.5" />
      ) : (
        <MaximizeIcon className="h-3.5 w-3.5" />
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
  const { data, playerRef } = useRemotionContext();
  const [currentFrame, setCurrentFrame] = useState(0);

  // Update current frame
  useEffect(() => {
    const interval = setInterval(() => {
      const frame = playerRef.current?.getCurrentFrame();
      if (frame !== undefined) {
        setCurrentFrame(frame);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [playerRef]);

  const handleSeek = useCallback(
    (value: number[]) => {
      const frame = value[0];
      playerRef.current?.seekTo(frame);
      setCurrentFrame(frame);
    },
    [playerRef]
  );

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-4 border-t bg-muted/50 px-4 py-3", className)}
      {...props}
    >
      <div className="text-xs font-mono text-muted-foreground whitespace-nowrap">
        {currentFrame} / {data.composition.durationInFrames - 1}
      </div>
      <Slider
        value={[currentFrame]}
        onValueChange={handleSeek}
        max={data.composition.durationInFrames - 1}
        step={1}
        className="flex-1"
      />
    </div>
  );
});

RemotionTimeline.displayName = "RemotionTimeline";

// --- Remotion Content ---

export const RemotionContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const { data, options, error, setError, fullscreen, playerRef } =
        useRemotionContext();

      const [isMounted, setIsMounted] = useState(false);

      // Only render on client
      useEffect(() => {
        startTransition(() => {
          setIsMounted(true);
        });
      }, []);

      // Validate composition type
      useEffect(() => {
        if (!compositionRegistry[data.composition.type]) {
          setError(`Unknown composition type: ${data.composition.type}`);
        } else {
          setError(null);
        }
      }, [data.composition.type, setError]);

      if (error) {
        return <RemotionError error={error} />;
      }

      const height = fullscreen ? "100%" : data.composition.height || 600;
      const width = fullscreen ? "100%" : data.composition.width || 800;

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

      const Component = compositionRegistry[data.composition.type];

      return (
        <div
          ref={ref}
          className={cn("relative flex-1 p-4", className)}
          {...props}
        >
          <Player
            ref={playerRef}
            component={Component as React.ComponentType<any>}
            inputProps={data.composition.props}
            durationInFrames={data.composition.durationInFrames}
            fps={data.composition.fps}
            compositionWidth={data.composition.width}
            compositionHeight={data.composition.height}
            controls={options?.controls ?? false}
            loop={options?.loop ?? true}
            autoPlay={options?.autoPlay ?? false}
            style={{
              width: typeof width === "number" ? `${width}px` : width,
              height: typeof height === "number" ? `${height}px` : height,
            }}
          />
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

// Re-export types
export type {
  CompositionType,
  TextAnimationProps,
  ShapeAnimationProps,
  CountdownTimerProps,
  LogoRevealProps,
} from "./remotion-compositions";
