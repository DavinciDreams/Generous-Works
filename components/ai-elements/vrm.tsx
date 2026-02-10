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
  useRef,
  useState,
} from "react";

// Import VRM type from three-vrm
import type { VRM as VRMType } from "@pixiv/three-vrm";

// --- Types ---

export interface VRMVector3 {
  x: number;
  y: number;
  z: number;
}

export interface Animation {
  name: string;
  clip?: string;
  loop?: boolean;
}

export interface CameraConfig {
  position: VRMVector3;
  target?: VRMVector3;
}

export interface LightingConfig {
  ambient?: number;
  directional?: {
    color: string;
    intensity: number;
  };
}

export interface VRMData {
  modelUrl: string;
  animations?: Animation[];
  camera?: CameraConfig;
  lighting?: LightingConfig;
  background?: string;
}

export interface VRMOptions {
  height?: number | string;
  width?: number | string;
  antialias?: boolean;
  alpha?: boolean;
  enableControls?: boolean;
}

// --- Context ---

interface VRMContextValue {
  data: VRMData;
  options?: VRMOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  sceneContainerId: string;
  sceneRef: React.RefObject<any>;
  rendererRef: React.RefObject<any>;
  cameraRef: React.RefObject<any>;
  vrmRef: React.RefObject<any>;
  animationPlaying: boolean;
  setAnimationPlaying: (playing: boolean) => void;
}

const VRMContext = createContext<VRMContextValue | null>(null);

const useVRMContext = () => {
  const context = useContext(VRMContext);
  if (!context) {
    throw new Error("VRM components must be used within VRM");
  }
  return context;
};

// --- VRM Component ---

export interface VRMProps extends HTMLAttributes<HTMLDivElement> {
  data: VRMData;
  options?: VRMOptions;
  children?: ReactNode;
}

export const VRM = forwardRef<HTMLDivElement, VRMProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const [animationPlaying, setAnimationPlaying] = useState(false);
    const sceneRef = useRef<any>(null);
    const rendererRef = useRef<any>(null);
    const cameraRef = useRef<any>(null);
    const vrmRef = useRef<any>(null);
    const [sceneContainerId] = useState(() =>
      typeof window !== 'undefined'
        ? `vrm-${Math.random().toString(36).substr(2, 9)}`
        : 'vrm-ssr'
    );

    const contextValue: VRMContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      sceneContainerId,
      sceneRef,
      rendererRef,
      cameraRef,
      vrmRef,
      animationPlaying,
      setAnimationPlaying,
    };

    return (
      <VRMContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            "flex flex-col gap-2 rounded-lg border bg-card text-card-foreground shadow-sm",
            fullscreen && "fixed inset-0 z-50 rounded-none",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </VRMContext.Provider>
    );
  }
);

VRM.displayName = "VRM";

// --- VRM Header ---

export const VRMHeader = forwardRef<
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

VRMHeader.displayName = "VRMHeader";

// --- VRM Title ---

export const VRMTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { data } = useVRMContext();

  const modelName = data.modelUrl.split('/').pop()?.split('.')[0] || 'VRM Model';

  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      <span className="font-mono">
        {children || modelName}
      </span>
    </div>
  );
});

VRMTitle.displayName = "VRMTitle";

// --- VRM Actions ---

export const VRMActions = forwardRef<
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

VRMActions.displayName = "VRMActions";

// --- VRM Animation Toggle ---

export const VRMAnimationToggle = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { animationPlaying, setAnimationPlaying } = useVRMContext();

  const handleToggle = useCallback(() => {
    setAnimationPlaying(!animationPlaying);
  }, [animationPlaying, setAnimationPlaying]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleToggle}
      title={animationPlaying ? "Pause Animation" : "Play Animation"}
      {...props}
    >
      {animationPlaying ? (
        <PauseIcon className="h-3.5 w-3.5" />
      ) : (
        <PlayIcon className="h-3.5 w-3.5" />
      )}
    </Button>
  );
});

VRMAnimationToggle.displayName = "VRMAnimationToggle";

// --- VRM Reset Button ---

export const VRMResetButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { cameraRef, data } = useVRMContext();

  const handleReset = useCallback(() => {
    if (cameraRef.current && data.camera) {
      const { position, target } = data.camera;
      cameraRef.current.position.set(position.x, position.y, position.z);
      if (target) {
        cameraRef.current.lookAt(target.x, target.y, target.z);
      }
    }
  }, [cameraRef, data.camera]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7 hover:bg-muted", className)}
      onClick={handleReset}
      title="Reset Camera"
      {...props}
    >
      <RotateCcwIcon className="h-3.5 w-3.5" />
    </Button>
  );
});

VRMResetButton.displayName = "VRMResetButton";

// --- VRM Copy Button ---

export const VRMCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { data } = useVRMContext();
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

VRMCopyButton.displayName = "VRMCopyButton";

// --- VRM Fullscreen Button ---

export const VRMFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useVRMContext();

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

VRMFullscreenButton.displayName = "VRMFullscreenButton";

// --- VRM Content ---

export const VRMContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        setError,
        fullscreen,
        sceneContainerId,
        sceneRef,
        rendererRef,
        cameraRef,
        vrmRef,
        animationPlaying,
      } = useVRMContext();

      const [isMounted, setIsMounted] = useState(false);
      const animationFrameRef = useRef<number | undefined>(undefined);

      // Only render on client
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Initialize Three.js scene with VRM
      useEffect(() => {
        if (!isMounted) return;

        let scene: any;
        let camera: any;
        let renderer: any;
        let controls: any;
        let vrm: any;
        let mixer: any;

        const init = async () => {
          try {
            const THREE = await import('three');
            const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');
            const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
            const { VRM, VRMLoaderPlugin, VRMUtils } = await import('@pixiv/three-vrm');

            const container = document.getElementById(sceneContainerId);
            if (!container) return;

            const width = container.clientWidth;
            const height = container.clientHeight;

            // Create scene
            scene = new THREE.Scene();
            sceneRef.current = scene;

            // Set background
            if (data.background) {
              scene.background = new THREE.Color(data.background);
            } else {
              scene.background = new THREE.Color(0xf0f0f0);
            }

            // Create camera
            camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
            const cameraPos = data.camera?.position || { x: 0, y: 1.4, z: 2 };
            camera.position.set(cameraPos.x, cameraPos.y, cameraPos.z);
            cameraRef.current = camera;

            // Create renderer
            renderer = new THREE.WebGLRenderer({
              antialias: options?.antialias !== false,
              alpha: options?.alpha || false,
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // Add lights
            const ambientLight = new THREE.AmbientLight(
              0xffffff,
              data.lighting?.ambient || 0.5
            );
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(
              data.lighting?.directional?.color ? new THREE.Color(data.lighting.directional.color).getHex() : 0xffffff,
              data.lighting?.directional?.intensity || 1
            );
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);

            // Add controls
            if (options?.enableControls !== false) {
              controls = new OrbitControls(camera, renderer.domElement);
              controls.enableDamping = true;
              controls.dampingFactor = 0.05;
              if (data.camera?.target) {
                controls.target.set(
                  data.camera.target.x,
                  data.camera.target.y,
                  data.camera.target.z
                );
              } else {
                controls.target.set(0, 1, 0);
              }
            }

            // Load VRM model
            const loader = new GLTFLoader();
            loader.register((parser) => new VRMLoaderPlugin(parser));

            const gltf = await loader.loadAsync(data.modelUrl);
            vrm = gltf.userData.vrm as VRMType;
            vrmRef.current = vrm;

            // Disable frustum culling for VRM
            vrm.scene.traverse((obj: any) => {
              obj.frustumCulled = false;
            });

            VRMUtils.rotateVRM0(vrm);
            scene.add(vrm.scene);

            // Setup animation if available
            if (data.animations && data.animations.length > 0 && gltf.animations.length > 0) {
              mixer = new THREE.AnimationMixer(vrm.scene);
              const action = mixer.clipAction(gltf.animations[0]);
              action.play();
            }

            // Animation loop
            const clock = new THREE.Clock();
            const animate = () => {
              animationFrameRef.current = requestAnimationFrame(animate);

              const deltaTime = clock.getDelta();

              if (vrm) {
                vrm.update(deltaTime);
              }

              if (mixer && animationPlaying) {
                mixer.update(deltaTime);
              }

              if (controls) {
                controls.update();
              }

              renderer.render(scene, camera);
            };

            animate();

            // Handle resize
            const handleResize = () => {
              if (!container) return;
              const width = container.clientWidth;
              const height = container.clientHeight;
              camera.aspect = width / height;
              camera.updateProjectionMatrix();
              renderer.setSize(width, height);
            };

            window.addEventListener('resize', handleResize);

            return () => {
              window.removeEventListener('resize', handleResize);
            };
          } catch (err) {
            console.error('Failed to initialize VRM:', err);
            setError(`Failed to load VRM model: ${err instanceof Error ? err.message : String(err)}`);
          }
        };

        init();

        return () => {
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
          if (renderer) {
            renderer.dispose();
          }
          if (scene) {
            scene.traverse((obj: any) => {
              if (obj.geometry) obj.geometry.dispose();
              if (obj.material) {
                if (Array.isArray(obj.material)) {
                  obj.material.forEach((mat: any) => mat.dispose());
                } else {
                  obj.material.dispose();
                }
              }
            });
          }
        };
      }, [isMounted, data, options, sceneContainerId, setError, sceneRef, rendererRef, cameraRef, vrmRef, animationPlaying]);

      if (error) {
        return <VRMError error={error} />;
      }

      const height = fullscreen ? '100%' : options?.height || 600;
      const width = fullscreen ? '100%' : options?.width || '100%';

      return (
        <div
          ref={ref}
          className={cn("relative flex-1 p-4", className)}
          {...props}
        >
          <div
            id={sceneContainerId}
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height,
            }}
          />
        </div>
      );
    }
  )
);

VRMContent.displayName = "VRMContent";

// --- VRM Controls ---

export const VRMControls = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useVRMContext();

  if (!data.animations || data.animations.length === 0) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "flex items-center gap-4 border-t bg-muted/50 px-4 py-3",
        className
      )}
      {...props}
    >
      <span className="text-xs text-muted-foreground">
        Animations: {data.animations.map(a => a.name).join(', ')}
      </span>
    </div>
  );
});

VRMControls.displayName = "VRMControls";

// --- VRM Error ---

export const VRMError = forwardRef<
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

VRMError.displayName = "VRMError";
