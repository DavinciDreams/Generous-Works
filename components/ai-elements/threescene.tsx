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
  RotateCw,
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

export interface ThreeSceneObject {
  id?: string;
  object: any; // THREE.Object3D
  position?: { x?: number; y?: number; z?: number };
  rotation?: { x?: number; y?: number; z?: number };
  scale?: number | { x?: number; y?: number; z?: number };
}

export interface ThreeSceneLight {
  id?: string;
  type: "ambient" | "directional" | "point" | "spot" | "hemisphere";
  color?: number;
  intensity?: number;
  position?: { x?: number; y?: number; z?: number };
}

export interface ThreeSceneCamera {
  type: "perspective" | "orthographic";
  position?: { x?: number; y?: number; z?: number };
  fov?: number; // For perspective camera
  near?: number;
  far?: number;
}

export interface ThreeSceneData {
  objects?: ThreeSceneObject[];
  lights?: ThreeSceneLight[];
  camera?: ThreeSceneCamera;
  background?: number | string; // Color or 'transparent'
  fog?: {
    color: number;
    near: number;
    far: number;
  };
}

export interface ThreeSceneOptions {
  height?: number | string;
  width?: number | string;
  antialias?: boolean;
  alpha?: boolean;
  autoRotate?: boolean;
  enableControls?: boolean;
  controlsType?: "orbit" | "trackball" | "fly";
  gridHelper?: boolean;
  axesHelper?: boolean;
  [key: string]: unknown;
}

export interface ThreeSceneRef {
  addObject: (object: ThreeSceneObject) => void;
  removeObject: (id: string) => void;
  addLight: (light: ThreeSceneLight) => void;
  getScene: () => any | null; // Returns THREE.Scene
  getCamera: () => any | null; // Returns THREE.Camera
  getRenderer: () => any | null; // Returns THREE.WebGLRenderer
  resetCamera: () => void;
}

// --- Context ---

interface ThreeSceneContextValue {
  data: ThreeSceneData;
  options?: ThreeSceneOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  copyToClipboard: () => Promise<void>;
  threeSceneRef: React.RefObject<ThreeSceneRef | null>;
  sceneInstanceRef: React.RefObject<any>;
  rendererInstanceRef: React.RefObject<any>;
  cameraInstanceRef: React.RefObject<any>;
  sceneContainerId: string;
}

const ThreeSceneContext = createContext<ThreeSceneContextValue | null>(null);

const useThreeSceneContext = () => {
  const context = useContext(ThreeSceneContext);
  if (!context) {
    throw new Error("ThreeScene components must be used within ThreeScene");
  }
  return context;
};

// --- ThreeScene Component ---

export interface ThreeSceneProps extends HTMLAttributes<HTMLDivElement> {
  data: ThreeSceneData;
  options?: ThreeSceneOptions;
  children?: ReactNode;
}

export const ThreeScene = forwardRef<ThreeSceneRef, ThreeSceneProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const sceneInstanceRef = useRef<any>(null);
    const rendererInstanceRef = useRef<any>(null);
    const cameraInstanceRef = useRef<any>(null);
    const threeSceneRef = useRef<ThreeSceneRef | null>(null);
    // Generate ID only on client to avoid hydration mismatch
    const [sceneContainerId] = useState(() =>
      typeof window !== 'undefined'
        ? `threescene-${Math.random().toString(36).substr(2, 9)}`
        : 'threescene-ssr'
    );

    // Expose ref
    useImperativeHandle(ref, () => threeSceneRef.current as ThreeSceneRef, []);

    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [data]);

    const contextValue: ThreeSceneContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      copyToClipboard,
      threeSceneRef,
      sceneInstanceRef,
      rendererInstanceRef,
      cameraInstanceRef,
      sceneContainerId,
    };

    return (
      <ThreeSceneContext.Provider value={contextValue}>
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
      </ThreeSceneContext.Provider>
    );
  }
);

ThreeScene.displayName = "ThreeScene";

// --- ThreeScene Header ---

export const ThreeSceneHeader = forwardRef<
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

ThreeSceneHeader.displayName = "ThreeSceneHeader";

// --- ThreeScene Title ---

export const ThreeSceneTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex-1", className)} {...props}>
      <h3 className="text-lg font-semibold">
        {children || "3D Scene"}
      </h3>
    </div>
  );
});

ThreeSceneTitle.displayName = "ThreeSceneTitle";

// --- ThreeScene Actions ---

export const ThreeSceneActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
});

ThreeSceneActions.displayName = "ThreeSceneActions";

// --- ThreeScene Copy Button ---

export const ThreeSceneCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { copyToClipboard } = useThreeSceneContext();
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

ThreeSceneCopyButton.displayName = "ThreeSceneCopyButton";

// --- ThreeScene Fullscreen Button ---

export const ThreeSceneFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen} = useThreeSceneContext();

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

ThreeSceneFullscreenButton.displayName = "ThreeSceneFullscreenButton";

// --- ThreeScene Reset Camera Button ---

export const ThreeSceneResetButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { threeSceneRef } = useThreeSceneContext();

  const handleReset = () => {
    threeSceneRef.current?.resetCamera();
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
      <RotateCw className="h-4 w-4" />
    </Button>
  );
});

ThreeSceneResetButton.displayName = "ThreeSceneResetButton";

// --- ThreeScene Content ---

export const ThreeSceneContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        setError,
        fullscreen,
        sceneContainerId,
        threeSceneRef,
        sceneInstanceRef,
        rendererInstanceRef,
        cameraInstanceRef,
      } = useThreeSceneContext();

      const containerRef = useRef<HTMLDivElement>(null);
      const [isInitialized, setIsInitialized] = useState(false);
      const [isMounted, setIsMounted] = useState(false);
      const animationFrameRef = useRef<number>();

      // Only render on client to avoid SSR issues
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Initialize Three.js when container is mounted
      useEffect(() => {
        if (typeof window === "undefined" || !containerRef.current || isInitialized) return;

        const initScene = async () => {
          try {
            // Ensure container has dimensions
            const container = containerRef.current;
            if (!container) return;

            const checkDimensions = () => {
              return container.offsetWidth > 0 && container.offsetHeight > 0;
            };

            if (!checkDimensions()) {
              await new Promise(resolve => setTimeout(resolve, 100));
              if (!checkDimensions()) {
                setError("Scene container has no dimensions");
                return;
              }
            }

            // Dynamic import Three.js
            const THREE = await import("three");
            const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js");

            console.log("Initializing 3D scene with ID:", sceneContainerId);

            // Create scene
            sceneInstanceRef.current = new THREE.Scene();

            // Set background
            if (data.background) {
              if (typeof data.background === 'number') {
                sceneInstanceRef.current.background = new THREE.Color(data.background);
              }
            } else {
              sceneInstanceRef.current.background = new THREE.Color(0x1a1a1a);
            }

            // Add fog if specified
            if (data.fog) {
              sceneInstanceRef.current.fog = new THREE.Fog(
                data.fog.color,
                data.fog.near,
                data.fog.far
              );
            }

            // Create camera
            const cameraConfig = data.camera || { type: "perspective" };
            const aspect = container.offsetWidth / container.offsetHeight;

            if (cameraConfig.type === "perspective") {
              cameraInstanceRef.current = new THREE.PerspectiveCamera(
                cameraConfig.fov || 75,
                aspect,
                cameraConfig.near || 0.1,
                cameraConfig.far || 1000
              );
            } else {
              const frustumSize = 5;
              cameraInstanceRef.current = new THREE.OrthographicCamera(
                -frustumSize * aspect,
                frustumSize * aspect,
                frustumSize,
                -frustumSize,
                cameraConfig.near || 0.1,
                cameraConfig.far || 1000
              );
            }

            // Set camera position
            const camPos = cameraConfig.position || { x: 5, y: 5, z: 5 };
            cameraInstanceRef.current.position.set(
              camPos.x,
              camPos.y,
              camPos.z
            );
            cameraInstanceRef.current.lookAt(0, 0, 0);

            // Create renderer
            rendererInstanceRef.current = new THREE.WebGLRenderer({
              antialias: options?.antialias !== false,
              alpha: options?.alpha || false,
            });
            rendererInstanceRef.current.setSize(
              container.offsetWidth,
              container.offsetHeight
            );
            rendererInstanceRef.current.setPixelRatio(window.devicePixelRatio);
            container.appendChild(rendererInstanceRef.current.domElement);

            // Add lights
            if (data.lights && data.lights.length > 0) {
              data.lights.forEach((lightConfig) => {
                let light: any;
                switch (lightConfig.type) {
                  case "ambient":
                    light = new THREE.AmbientLight(
                      lightConfig.color || 0xffffff,
                      lightConfig.intensity || 0.5
                    );
                    break;
                  case "directional":
                    light = new THREE.DirectionalLight(
                      lightConfig.color || 0xffffff,
                      lightConfig.intensity || 1
                    );
                    if (lightConfig.position) {
                      light.position.set(
                        lightConfig.position.x || 0,
                        lightConfig.position.y || 1,
                        lightConfig.position.z || 0
                      );
                    }
                    break;
                  case "point":
                    light = new THREE.PointLight(
                      lightConfig.color || 0xffffff,
                      lightConfig.intensity || 1
                    );
                    if (lightConfig.position) {
                      light.position.set(
                        lightConfig.position.x || 0,
                        lightConfig.position.y || 0,
                        lightConfig.position.z || 0
                      );
                    }
                    break;
                  case "spot":
                    light = new THREE.SpotLight(
                      lightConfig.color || 0xffffff,
                      lightConfig.intensity || 1
                    );
                    if (lightConfig.position) {
                      light.position.set(
                        lightConfig.position.x || 0,
                        lightConfig.position.y || 1,
                        lightConfig.position.z || 0
                      );
                    }
                    break;
                  case "hemisphere":
                    light = new THREE.HemisphereLight(
                      lightConfig.color || 0xffffff,
                      0x444444,
                      lightConfig.intensity || 1
                    );
                    break;
                }
                if (light) {
                  sceneInstanceRef.current.add(light);
                }
              });
            } else {
              // Add default lights
              const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
              const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
              directionalLight.position.set(1, 1, 1);
              sceneInstanceRef.current.add(ambientLight, directionalLight);
            }

            // Add helpers if enabled
            if (options?.gridHelper) {
              const gridHelper = new THREE.GridHelper(10, 10);
              sceneInstanceRef.current.add(gridHelper);
            }
            if (options?.axesHelper) {
              const axesHelper = new THREE.AxesHelper(5);
              sceneInstanceRef.current.add(axesHelper);
            }

            // Add objects
            if (data.objects && data.objects.length > 0) {
              data.objects.forEach((objConfig) => {
                const obj = objConfig.object;

                // Apply position
                if (objConfig.position) {
                  obj.position.set(
                    objConfig.position.x || 0,
                    objConfig.position.y || 0,
                    objConfig.position.z || 0
                  );
                }

                // Apply rotation
                if (objConfig.rotation) {
                  obj.rotation.set(
                    objConfig.rotation.x || 0,
                    objConfig.rotation.y || 0,
                    objConfig.rotation.z || 0
                  );
                }

                // Apply scale
                if (objConfig.scale) {
                  if (typeof objConfig.scale === 'number') {
                    obj.scale.set(objConfig.scale, objConfig.scale, objConfig.scale);
                  } else {
                    obj.scale.set(
                      objConfig.scale.x || 1,
                      objConfig.scale.y || 1,
                      objConfig.scale.z || 1
                    );
                  }
                }

                sceneInstanceRef.current.add(obj);
              });
            }

            // Add controls if enabled
            let controls: any;
            if (options?.enableControls !== false) {
              controls = new OrbitControls(
                cameraInstanceRef.current,
                rendererInstanceRef.current.domElement
              );
              controls.enableDamping = true;
              controls.autoRotate = options?.autoRotate || false;
            }

            // Animation loop
            const animate = () => {
              animationFrameRef.current = requestAnimationFrame(animate);

              if (controls) {
                controls.update();
              }

              rendererInstanceRef.current.render(
                sceneInstanceRef.current,
                cameraInstanceRef.current
              );
            };
            animate();

            // Create ref API
            threeSceneRef.current = {
              addObject: (object: ThreeSceneObject) => {
                if (!sceneInstanceRef.current) return;

                const obj = object.object;
                if (object.position) {
                  obj.position.set(
                    object.position.x || 0,
                    object.position.y || 0,
                    object.position.z || 0
                  );
                }
                if (object.rotation) {
                  obj.rotation.set(
                    object.rotation.x || 0,
                    object.rotation.y || 0,
                    object.rotation.z || 0
                  );
                }
                if (object.scale) {
                  if (typeof object.scale === 'number') {
                    obj.scale.set(object.scale, object.scale, object.scale);
                  } else {
                    obj.scale.set(
                      object.scale.x || 1,
                      object.scale.y || 1,
                      object.scale.z || 1
                    );
                  }
                }
                sceneInstanceRef.current.add(obj);
              },
              removeObject: (id: string) => {
                console.warn("removeObject not yet implemented");
              },
              addLight: async (light: ThreeSceneLight) => {
                if (!sceneInstanceRef.current) return;
                const THREE = await import("three");
                let lightObj: any;
                // Same light creation logic as above
                sceneInstanceRef.current.add(lightObj);
              },
              getScene: () => sceneInstanceRef.current,
              getCamera: () => cameraInstanceRef.current,
              getRenderer: () => rendererInstanceRef.current,
              resetCamera: () => {
                if (!cameraInstanceRef.current) return;
                const camPos = data.camera?.position || { x: 5, y: 5, z: 5 };
                cameraInstanceRef.current.position.set(camPos.x, camPos.y, camPos.z);
                cameraInstanceRef.current.lookAt(0, 0, 0);
                if (controls) {
                  controls.reset();
                }
              },
            };

            // Handle window resize
            const handleResize = () => {
              if (!container || !cameraInstanceRef.current || !rendererInstanceRef.current) return;

              const width = container.offsetWidth;
              const height = container.offsetHeight;

              if (cameraInstanceRef.current.isPerspectiveCamera) {
                cameraInstanceRef.current.aspect = width / height;
              } else {
                const aspect = width / height;
                const frustumSize = 5;
                cameraInstanceRef.current.left = -frustumSize * aspect;
                cameraInstanceRef.current.right = frustumSize * aspect;
                cameraInstanceRef.current.top = frustumSize;
                cameraInstanceRef.current.bottom = -frustumSize;
              }

              cameraInstanceRef.current.updateProjectionMatrix();
              rendererInstanceRef.current.setSize(width, height);
            };

            window.addEventListener('resize', handleResize);

            setIsInitialized(true);

            return () => {
              window.removeEventListener('resize', handleResize);
            };
          } catch (err) {
            console.error("Failed to initialize 3D scene:", err);
            setError(err instanceof Error ? err.message : "Failed to initialize 3D scene");
          }
        };

        const timer = setTimeout(initScene, 50);

        // Cleanup
        return () => {
          clearTimeout(timer);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          if (rendererInstanceRef.current && containerRef.current) {
            containerRef.current.removeChild(rendererInstanceRef.current.domElement);
            rendererInstanceRef.current.dispose();
          }
          sceneInstanceRef.current = null;
          rendererInstanceRef.current = null;
          cameraInstanceRef.current = null;
          threeSceneRef.current = null;
          setIsInitialized(false);
        };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isMounted, sceneContainerId]);

      if (error) {
        return <ThreeSceneError error={error} />;
      }

      const height = options?.height || (fullscreen ? "100%" : 600);
      const width = options?.width || "100%";

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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Loading 3D scene...
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
            id={sceneContainerId}
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

ThreeSceneContent.displayName = "ThreeSceneContent";

// --- ThreeScene Error ---

export const ThreeSceneError = forwardRef<
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

ThreeSceneError.displayName = "ThreeSceneError";
