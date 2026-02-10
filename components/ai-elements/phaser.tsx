"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
  PlayIcon,
  PauseIcon,
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

export interface PhaserConfig {
  type?: "AUTO" | "CANVAS" | "WEBGL";
  width?: number;
  height?: number;
  backgroundColor?: number | string;
  physics?: {
    default?: "arcade" | "matter" | "impact";
    [key: string]: unknown;
  };
  scale?: {
    mode?: "NONE" | "FIT" | "RESIZE";
    autoCenter?: "CENTER_BOTH" | "CENTER_HORIZONTALLY" | "CENTER_VERTICALLY";
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface PhaserScene {
  key: string;
  preload?: string; // JavaScript code as string
  create?: string; // JavaScript code as string
  update?: string; // JavaScript code as string
}

export interface PhaserData {
  config: PhaserConfig;
  scenes: PhaserScene[];
}

export interface PhaserOptions {
  autoStart?: boolean;
  showControls?: boolean;
}

export interface PhaserRef {
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
  destroy: () => void;
}

// --- Context ---

interface PhaserContextValue {
  data: PhaserData;
  options?: PhaserOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  phaserRef: React.RefObject<PhaserRef | null>;
}

const PhaserContext = createContext<PhaserContextValue | null>(null);

const usePhaserContext = () => {
  const context = useContext(PhaserContext);
  if (!context) {
    throw new Error("Phaser components must be used within Phaser");
  }
  return context;
};

// --- Phaser Component ---

export interface PhaserProps extends HTMLAttributes<HTMLDivElement> {
  data: PhaserData;
  options?: PhaserOptions;
  children?: ReactNode;
}

export const Phaser = forwardRef<PhaserRef, PhaserProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(options?.autoStart ?? false);
    const phaserRef = useRef<PhaserRef | null>(null);

    // Expose ref
    useImperativeHandle(ref, () => phaserRef.current as PhaserRef, []);

    const contextValue: PhaserContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      isPlaying,
      setIsPlaying,
      phaserRef,
    };

    return (
      <PhaserContext.Provider value={contextValue}>
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
      </PhaserContext.Provider>
    );
  }
);

Phaser.displayName = "Phaser";

// --- Phaser Header ---

export const PhaserHeader = forwardRef<
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

PhaserHeader.displayName = "PhaserHeader";

// --- Phaser Title ---

export const PhaserTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      <span className="font-mono">{children || "Phaser Game"}</span>
    </div>
  );
});

PhaserTitle.displayName = "PhaserTitle";

// --- Phaser Actions ---

export const PhaserActions = forwardRef<
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

PhaserActions.displayName = "PhaserActions";

// --- Phaser Play/Pause Button ---

export const PhaserPlayButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { isPlaying, setIsPlaying, phaserRef } = usePhaserContext();

  const togglePlay = () => {
    if (isPlaying) {
      phaserRef.current?.pause();
      setIsPlaying(false);
    } else {
      phaserRef.current?.resume();
      setIsPlaying(true);
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

PhaserPlayButton.displayName = "PhaserPlayButton";

// --- Phaser Reset Button ---

export const PhaserResetButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { phaserRef } = usePhaserContext();

  const handleReset = () => {
    phaserRef.current?.restart();
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

PhaserResetButton.displayName = "PhaserResetButton";

// --- Phaser Copy Button ---

export const PhaserCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { data } = usePhaserContext();
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

PhaserCopyButton.displayName = "PhaserCopyButton";

// --- Phaser Fullscreen Button ---

export const PhaserFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = usePhaserContext();

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

PhaserFullscreenButton.displayName = "PhaserFullscreenButton";

// --- Phaser Content ---

export const PhaserContent = memo(
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
        phaserRef,
      } = usePhaserContext();

      const containerRef = useRef<HTMLDivElement>(null);
      const [isMounted, setIsMounted] = useState(false);
      const gameInstanceRef = useRef<any>(null);

      // Only render on client
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Initialize Phaser game
      useEffect(() => {
        if (!isMounted || !containerRef.current) return;

        let mounted = true;

        const initGame = async () => {
          try {
            setError(null);

            // Dynamically import Phaser
            const Phaser = await import("phaser");

            if (!mounted) return;

            // Create game config
            const gameConfig: any = {
              ...data.config,
              type: Phaser[data.config.type || "AUTO"],
              parent: containerRef.current,
              width: data.config.width || 800,
              height: data.config.height || 600,
              scene: data.scenes.map((sceneData) => {
                return class extends Phaser.Scene {
                  constructor() {
                    super({ key: sceneData.key });
                  }

                  preload() {
                    if (sceneData.preload) {
                      try {
                        // Execute preload code
                        const preloadFn = new Function("scene", sceneData.preload);
                        preloadFn(this);
                      } catch (err) {
                        console.error(`Error in preload for scene ${sceneData.key}:`, err);
                      }
                    }
                  }

                  create() {
                    if (sceneData.create) {
                      try {
                        // Execute create code
                        const createFn = new Function("scene", sceneData.create);
                        createFn(this);
                      } catch (err) {
                        console.error(`Error in create for scene ${sceneData.key}:`, err);
                      }
                    }
                  }

                  update(time: number, delta: number) {
                    if (sceneData.update) {
                      try {
                        // Execute update code
                        const updateFn = new Function("scene", "time", "delta", sceneData.update);
                        updateFn(this, time, delta);
                      } catch (err) {
                        console.error(`Error in update for scene ${sceneData.key}:`, err);
                      }
                    }
                  }
                };
              }),
            };

            // Create game instance
            const game = new Phaser.Game(gameConfig);
            gameInstanceRef.current = game;

            if (options?.autoStart !== false) {
              setIsPlaying(true);
            }

            // Setup ref methods
            phaserRef.current = {
              start: () => {
                if (game && !game.isRunning) {
                  game.events.emit("resume");
                  setIsPlaying(true);
                }
              },
              pause: () => {
                if (game && game.isRunning) {
                  game.events.emit("pause");
                  setIsPlaying(false);
                }
              },
              resume: () => {
                if (game && !game.isRunning) {
                  game.events.emit("resume");
                  setIsPlaying(true);
                }
              },
              restart: () => {
                if (game) {
                  game.scene.scenes.forEach((scene: any) => {
                    scene.scene.restart();
                  });
                  setIsPlaying(true);
                }
              },
              destroy: () => {
                if (game) {
                  game.destroy(true);
                  gameInstanceRef.current = null;
                }
              },
            };
          } catch (err) {
            console.error("Failed to initialize Phaser:", err);
            if (mounted) {
              setError(
                err instanceof Error ? err.message : "Failed to initialize Phaser"
              );
            }
          }
        };

        initGame();

        return () => {
          mounted = false;
          if (gameInstanceRef.current) {
            gameInstanceRef.current.destroy(true);
            gameInstanceRef.current = null;
          }
        };
      }, [isMounted, data, options, setError, setIsPlaying, phaserRef]);

      if (error) {
        return <PhaserError error={error} />;
      }

      const height = fullscreen ? "100%" : data.config.height || 600;
      const width = fullscreen ? "100%" : data.config.width || 800;

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
              Loading game engine...
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

PhaserContent.displayName = "PhaserContent";

// --- Phaser Error ---

export const PhaserError = forwardRef<
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

PhaserError.displayName = "PhaserError";
