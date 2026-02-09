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

// Import Leaflet styles
import "leaflet/dist/leaflet.css";

// --- Types ---

export interface MapsCoordinates {
  longitude: number;
  latitude: number;
}

export interface MapsMarker {
  id?: string;
  coordinates: MapsCoordinates;
  color?: string;
  label?: string;
  popup?: ReactNode;
}

export interface MapsViewState {
  longitude: number;
  latitude: number;
  zoom: number;
}

export interface MapsData {
  markers?: MapsMarker[];
  center?: MapsCoordinates;
  zoom?: number;
}

export interface MapsOptions {
  height?: number | string;
  width?: number | string;
  interactive?: boolean;
  showControls?: boolean;
  [key: string]: unknown;
}

export interface MapsRef {
  flyTo: (coords: MapsCoordinates, zoom?: number) => void;
  setZoom: (zoom: number) => void;
  getCenter: () => MapsCoordinates | null;
  getZoom: () => number | null;
  addMarker: (marker: MapsMarker) => void;
  removeMarker: (id: string) => void;
}

// --- Context ---

interface MapsContextValue {
  data: MapsData;
  options?: MapsOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  copyToClipboard: () => Promise<void>;
  mapsRef: React.RefObject<MapsRef | null>;
  mapInstanceRef: React.RefObject<any>;
  mapContainerId: string;
}

const MapsContext = createContext<MapsContextValue | null>(null);

const useMapsContext = () => {
  const context = useContext(MapsContext);
  if (!context) {
    throw new Error("Maps components must be used within Maps");
  }
  return context;
};

// --- Maps Component ---

export interface MapsProps extends HTMLAttributes<HTMLDivElement> {
  data: MapsData;
  options?: MapsOptions;
  children?: ReactNode;
}

export const Maps = forwardRef<MapsRef, MapsProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const mapInstanceRef = useRef<any>(null);
    const mapsRef = useRef<MapsRef | null>(null);
    // Generate ID only on client to avoid hydration mismatch
    const [mapContainerId] = useState(() =>
      typeof window !== 'undefined'
        ? `map-${Math.random().toString(36).substr(2, 9)}`
        : 'map-ssr'
    );

    // Expose ref
    useImperativeHandle(ref, () => mapsRef.current as MapsRef, []);

    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [data]);

    const contextValue: MapsContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      copyToClipboard,
      mapsRef,
      mapInstanceRef,
      mapContainerId,
    };

    return (
      <MapsContext.Provider value={contextValue}>
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
      </MapsContext.Provider>
    );
  }
);

Maps.displayName = "Maps";

// --- Maps Header ---

export const MapsHeader = forwardRef<
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

MapsHeader.displayName = "MapsHeader";

// --- Maps Title ---

export const MapsTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex-1", className)} {...props}>
      <h3 className="text-lg font-semibold">
        {children || "Map"}
      </h3>
    </div>
  );
});

MapsTitle.displayName = "MapsTitle";

// --- Maps Actions ---

export const MapsActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
});

MapsActions.displayName = "MapsActions";

// --- Maps Copy Button ---

export const MapsCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { copyToClipboard } = useMapsContext();
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

MapsCopyButton.displayName = "MapsCopyButton";

// --- Maps Fullscreen Button ---

export const MapsFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useMapsContext();

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

MapsFullscreenButton.displayName = "MapsFullscreenButton";

// --- Maps Content ---

export const MapsContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        fullscreen,
        mapsRef,
        mapInstanceRef,
      } = useMapsContext();

      const [isMounted, setIsMounted] = useState(false);

      // Only render on client to avoid SSR issues
      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Initialize Leaflet map
      useEffect(() => {
        if (!isMounted) return;

        const initMap = async () => {
          try {
            const L = (await import("leaflet")).default;

            // Fix for default marker icons in Leaflet with webpack/vite
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
              iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
            });

            const center = data.center || { longitude: -122.4, latitude: 37.8 };
            const zoom = data.zoom || 9;

            // Create Leaflet map
            const map = L.map('leaflet-map-container', {
              center: [center.latitude, center.longitude],
              zoom: zoom,
              zoomControl: options?.showControls !== false,
            });

            // Add OpenStreetMap tiles
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              maxZoom: 19,
            }).addTo(map);

            // Add markers if provided
            if (data.markers && data.markers.length > 0) {
              data.markers.forEach((marker) => {
                const markerIcon = L.divIcon({
                  className: 'custom-marker',
                  html: `<div style="background-color: ${marker.color || '#3b82f6'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                });

                const leafletMarker = L.marker(
                  [marker.coordinates.latitude, marker.coordinates.longitude],
                  { icon: markerIcon }
                ).addTo(map);

                if (marker.label || marker.popup) {
                  leafletMarker.bindPopup(
                    typeof marker.popup === 'string'
                      ? marker.popup
                      : marker.label || ''
                  );
                }
              });
            }

            mapInstanceRef.current = map;

            // Set up ref methods
            mapsRef.current = {
              flyTo: (coords: MapsCoordinates, zoom?: number) => {
                map.flyTo([coords.latitude, coords.longitude], zoom || map.getZoom());
              },
              setZoom: (zoom: number) => {
                map.setZoom(zoom);
              },
              getCenter: () => {
                const center = map.getCenter();
                return { longitude: center.lng, latitude: center.lat };
              },
              getZoom: () => {
                return map.getZoom();
              },
              addMarker: (marker: MapsMarker) => {
                const markerIcon = L.divIcon({
                  className: 'custom-marker',
                  html: `<div style="background-color: ${marker.color || '#3b82f6'}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                });

                L.marker(
                  [marker.coordinates.latitude, marker.coordinates.longitude],
                  { icon: markerIcon }
                ).addTo(map);
              },
              removeMarker: (id: string) => {
                console.warn("removeMarker not yet implemented");
              },
            };
          } catch (err) {
            console.error("Failed to initialize map:", err);
          }
        };

        initMap();

        return () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
            mapsRef.current = null;
          }
        };
      }, [isMounted, data, options, mapInstanceRef, mapsRef]);

      if (error) {
        return <MapsError error={error} />;
      }

      const height = options?.height || (fullscreen ? "100%" : 600);
      const width = options?.width || "100%";

      // Don't render map container until mounted on client
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
              Loading map...
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
            id="leaflet-map-container"
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

MapsContent.displayName = "MapsContent";

// --- Maps Error ---

const MapsError = ({ error }: { error: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
      <AlertCircle className="h-8 w-8" />
      <p className="text-sm">{error}</p>
    </div>
  );
};
