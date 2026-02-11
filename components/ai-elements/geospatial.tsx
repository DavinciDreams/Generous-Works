"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { TimelineControl } from "@/components/ui/timeline-control";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckIcon,
  CopyIcon,
  MaximizeIcon,
  MinimizeIcon,
  LayersIcon,
} from "lucide-react";
import {
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

// --- Types ---

export interface GeospatialCoordinates {
  lng: number;
  lat: number;
}

export interface GeospatialLayer {
  id: string;
  type: 'point' | 'line' | 'polygon' | 'heatmap' | 'hexagon' | 'arc' | 'trips';
  data: Array<{
    lng: number;
    lat: number;
    value?: number;
    properties?: Record<string, unknown>;
    // For arc layers: target coordinates
    targetLng?: number;
    targetLat?: number;
    // For trips layers: timestamp
    timestamp?: number | string;
    // For trips layers: path (array of coordinates with timestamps)
    path?: Array<{ lng: number; lat: number; timestamp: number | string }>;
  }>;
  style: {
    color: string | Array<string>;
    size?: number;
    opacity?: number;
    extruded?: boolean;
    elevation?: number;
    trailLength?: number; // For trips layer
  };
  visible?: boolean;
  temporal?: boolean; // Indicates time-dependent data
}

export interface GeospatialData {
  center: GeospatialCoordinates;
  zoom: number;
  pitch?: number;
  bearing?: number;
  layers: GeospatialLayer[];
  basemap?: 'light' | 'dark' | 'satellite' | 'voyager';
  timeline?: {
    enabled: boolean;
    startTime: number | string;
    endTime: number | string;
    step?: number;
    autoPlay?: boolean;
    speed?: number;
  };
}

export interface GeospatialOptions {
  height?: number | string;
  width?: number | string;
  interactive?: boolean;
  showControls?: boolean;
  [key: string]: unknown;
}

export interface GeospatialRef {
  flyTo: (coords: GeospatialCoordinates, zoom?: number) => void;
  setZoom: (zoom: number) => void;
  toggleLayer: (layerId: string) => void;
  getCenter: () => GeospatialCoordinates | null;
  getZoom: () => number | null;
}

// --- Context ---

interface GeospatialContextValue {
  data: GeospatialData;
  options?: GeospatialOptions;
  error: string | null;
  setError: (error: string | null) => void;
  fullscreen: boolean;
  setFullscreen: (fullscreen: boolean) => void;
  copyToClipboard: () => Promise<void>;
  geospatialRef: React.RefObject<GeospatialRef | null>;
  layerVisibility: Map<string, boolean>;
  toggleLayerVisibility: (layerId: string) => void;
}

const GeospatialContext = createContext<GeospatialContextValue | null>(null);

const useGeospatialContext = () => {
  const context = useContext(GeospatialContext);
  if (!context) {
    throw new Error("Geospatial components must be used within Geospatial");
  }
  return context;
};

// --- CARTO Basemap Styles (free, no API key) ---

const BASEMAP_STYLES: Record<string, string> = {
  light: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
  dark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
  voyager: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
  satellite: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // fallback to voyager (satellite requires paid tiles)
};

// --- Color utilities ---

function hexToRgba(hex: string, alpha = 255): [number, number, number, number] {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return [r, g, b, alpha];
}

function buildColorRange(colors: string[]): Array<[number, number, number]> {
  if (colors.length >= 2) {
    return colors.map(c => {
      const rgba = hexToRgba(c);
      return [rgba[0], rgba[1], rgba[2]] as [number, number, number];
    });
  }
  // Default color range
  return [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
  ];
}

// --- Geospatial Component ---

export interface GeospatialProps extends HTMLAttributes<HTMLDivElement> {
  data: GeospatialData;
  options?: GeospatialOptions;
  children?: ReactNode;
}

export const Geospatial = forwardRef<GeospatialRef, GeospatialProps>(
  ({ data, options, children, className, ...props }, ref) => {
    const [error, setError] = useState<string | null>(null);
    const [fullscreen, setFullscreen] = useState(false);
    const geospatialRef = useRef<GeospatialRef | null>(null);
    const [layerVisibility, setLayerVisibility] = useState<Map<string, boolean>>(() => {
      const map = new Map<string, boolean>();
      data.layers.forEach(layer => {
        map.set(layer.id, layer.visible !== false);
      });
      return map;
    });

    useImperativeHandle(ref, () => geospatialRef.current as GeospatialRef, []);

    const copyToClipboard = useCallback(async () => {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }, [data]);

    const toggleLayerVisibility = useCallback((layerId: string) => {
      setLayerVisibility((prev) => {
        const newMap = new Map(prev);
        newMap.set(layerId, !prev.get(layerId));
        return newMap;
      });
    }, []);

    const contextValue: GeospatialContextValue = {
      data,
      options,
      error,
      setError,
      fullscreen,
      setFullscreen,
      copyToClipboard,
      geospatialRef,
      layerVisibility,
      toggleLayerVisibility,
    };

    return (
      <GeospatialContext.Provider value={contextValue}>
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
      </GeospatialContext.Provider>
    );
  }
);

Geospatial.displayName = "Geospatial";

// --- Geospatial Header ---

export const GeospatialHeader = forwardRef<
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

GeospatialHeader.displayName = "GeospatialHeader";

// --- Geospatial Title ---

export const GeospatialTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex-1", className)} {...props}>
      <h3 className="text-lg font-semibold">
        {children || "Geospatial Visualization"}
      </h3>
    </div>
  );
});

GeospatialTitle.displayName = "GeospatialTitle";

// --- Geospatial Actions ---

export const GeospatialActions = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
});

GeospatialActions.displayName = "GeospatialActions";

// --- Geospatial Layer Toggle ---

export const GeospatialLayerToggle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data, layerVisibility, toggleLayerVisibility } = useGeospatialContext();
  const [showLayers, setShowLayers] = useState(false);

  return (
    <div ref={ref} className={cn("relative", className)} {...props}>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setShowLayers(!showLayers)}
      >
        <LayersIcon className="h-4 w-4" />
      </Button>
      {showLayers && (
        <div className="absolute right-0 top-10 z-10 w-48 rounded-md border bg-popover p-2 shadow-md">
          <div className="text-sm font-semibold mb-2">Layers</div>
          {data.layers.map((layer) => (
            <label
              key={layer.id}
              className="flex items-center gap-2 p-1 cursor-pointer hover:bg-accent rounded"
            >
              <input
                type="checkbox"
                checked={layerVisibility.get(layer.id) ?? true}
                onChange={() => toggleLayerVisibility(layer.id)}
                className="h-4 w-4"
              />
              <span className="text-sm">{layer.id}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
});

GeospatialLayerToggle.displayName = "GeospatialLayerToggle";

// --- Geospatial Copy Button ---

export const GeospatialCopyButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { copyToClipboard } = useGeospatialContext();
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

GeospatialCopyButton.displayName = "GeospatialCopyButton";

// --- Geospatial Fullscreen Button ---

export const GeospatialFullscreenButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button>
>(({ className, ...props }, ref) => {
  const { fullscreen, setFullscreen } = useGeospatialContext();

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

GeospatialFullscreenButton.displayName = "GeospatialFullscreenButton";

// --- Geospatial Content (deck.gl + MapLibre) ---

export const GeospatialContent = memo(
  forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const {
        data,
        options,
        error,
        fullscreen,
        geospatialRef,
        layerVisibility,
      } = useGeospatialContext();

      const [isMounted, setIsMounted] = useState(false);
      const [MapComponent, setMapComponent] = useState<React.ComponentType<any> | null>(null);

      useEffect(() => {
        setIsMounted(true);
      }, []);

      // Dynamically import deck.gl + MapLibre (SSR-safe)
      useEffect(() => {
        if (!isMounted) return;

        let cancelled = false;

        const loadMap = async () => {
          try {
            const [
              reactMapGl,
              deckMapbox,
              deckLayers,
              deckAggLayers,
              deckGeoLayers,
            ] = await Promise.all([
              import("react-map-gl/maplibre"),
              import("@deck.gl/mapbox"),
              import("@deck.gl/layers"),
              import("@deck.gl/aggregation-layers"),
              import("@deck.gl/geo-layers"),
            ]);

            // Also import MapLibre CSS
            await import("maplibre-gl/dist/maplibre-gl.css");

            if (cancelled) return;

            const { Map: MapGl, useControl, NavigationControl } = reactMapGl;
            const { MapboxOverlay } = deckMapbox;
            const { ScatterplotLayer, ArcLayer, PathLayer, PolygonLayer } = deckLayers;
            const { HeatmapLayer, HexagonLayer } = deckAggLayers;
            const { TripsLayer } = deckGeoLayers;

            // Create DeckGL overlay component using useControl
            function DeckOverlay({ layers }: { layers: any[] }) {
              const overlay = useControl<InstanceType<typeof MapboxOverlay>>(
                () => new MapboxOverlay({ interleaved: true, layers: [] })
              );
              overlay.setProps({ layers });
              return null;
            }

            // Create the actual map component
            function InnerMap({
              mapData,
              mapOptions,
              mapLayerVisibility,
              mapGeospatialRef,
            }: {
              mapData: GeospatialData;
              mapOptions?: GeospatialOptions;
              mapLayerVisibility: Map<string, boolean>;
              mapGeospatialRef: React.RefObject<GeospatialRef | null>;
            }) {
              const mapRef = useRef<any>(null);

              // Timeline state for temporal visualizations
              const [currentTime, setCurrentTime] = useState<number>(() => {
                if (mapData.timeline?.enabled && mapData.timeline.startTime) {
                  return typeof mapData.timeline.startTime === 'number'
                    ? mapData.timeline.startTime
                    : new Date(mapData.timeline.startTime).getFullYear();
                }
                return 0;
              });

              // Build deck.gl layers from data
              const deckLayers = useMemo(() => {
                const result: any[] = [];

                mapData.layers.forEach((layer) => {
                  const isVisible = mapLayerVisibility.get(layer.id) ?? true;
                  if (!isVisible) return;

                  // Filter data by time if layer is temporal
                  let filteredData = layer.data;
                  if (layer.temporal && currentTime !== undefined) {
                    filteredData = layer.data.filter((d: any) => {
                      const itemTime = typeof d.timestamp === 'number'
                        ? d.timestamp
                        : d.timestamp
                          ? new Date(d.timestamp).getFullYear()
                          : 0;
                      return itemTime <= currentTime;
                    });
                  }

                  const baseColor = Array.isArray(layer.style.color) ? layer.style.color[0] : layer.style.color;
                  const rgba = hexToRgba(baseColor, Math.round((layer.style.opacity ?? 0.8) * 255));

                  switch (layer.type) {
                    case 'heatmap': {
                      result.push(
                        new HeatmapLayer({
                          id: layer.id,
                          data: filteredData,
                          getPosition: (d: any) => [d.lng, d.lat],
                          getWeight: (d: any) => d.value || 1,
                          aggregation: 'SUM',
                          radiusPixels: layer.style.size || 30,
                          intensity: 1,
                          threshold: 0.05,
                          colorRange: Array.isArray(layer.style.color)
                            ? buildColorRange(layer.style.color)
                            : [
                                [1, 152, 189],
                                [73, 227, 206],
                                [216, 254, 181],
                                [254, 237, 177],
                                [254, 173, 84],
                                [209, 55, 78],
                              ],
                        })
                      );
                      break;
                    }

                    case 'hexagon': {
                      result.push(
                        new HexagonLayer({
                          id: layer.id,
                          data: filteredData,
                          getPosition: (d: any) => [d.lng, d.lat],
                          getColorWeight: (d: any) => d.value || 1,
                          getElevationWeight: (d: any) => d.value || 1,
                          radius: layer.style.size || 500,
                          elevationScale: layer.style.elevation || 4,
                          extruded: layer.style.extruded !== false,
                          pickable: true,
                          colorRange: Array.isArray(layer.style.color)
                            ? buildColorRange(layer.style.color)
                            : [
                                [1, 152, 189],
                                [73, 227, 206],
                                [216, 254, 181],
                                [254, 237, 177],
                                [254, 173, 84],
                                [209, 55, 78],
                              ],
                        })
                      );
                      break;
                    }

                    case 'point': {
                      result.push(
                        new ScatterplotLayer({
                          id: layer.id,
                          data: filteredData,
                          getPosition: (d: any) => [d.lng, d.lat],
                          getFillColor: rgba,
                          getRadius: layer.style.size || 100,
                          radiusMinPixels: 4,
                          radiusMaxPixels: 30,
                          pickable: true,
                          opacity: layer.style.opacity ?? 0.8,
                        })
                      );
                      break;
                    }

                    case 'arc': {
                      result.push(
                        new ArcLayer({
                          id: layer.id,
                          data: filteredData,
                          getSourcePosition: (d: any) => [d.lng, d.lat],
                          getTargetPosition: (d: any) => [d.targetLng ?? d.lng, d.targetLat ?? d.lat],
                          getSourceColor: hexToRgba(
                            Array.isArray(layer.style.color) ? layer.style.color[0] : layer.style.color
                          ),
                          getTargetColor: hexToRgba(
                            Array.isArray(layer.style.color)
                              ? (layer.style.color[1] || layer.style.color[0])
                              : layer.style.color
                          ),
                          getWidth: layer.style.size || 2,
                          pickable: true,
                        })
                      );
                      break;
                    }

                    case 'line': {
                      // Group all points into a single path
                      const path = filteredData.map((p: any) => [p.lng, p.lat]);
                      result.push(
                        new PathLayer({
                          id: layer.id,
                          data: [{ path }],
                          getPath: (d: any) => d.path,
                          getColor: rgba,
                          getWidth: layer.style.size || 2,
                          widthMinPixels: 1,
                          pickable: true,
                        })
                      );
                      break;
                    }

                    case 'polygon': {
                      const polygon = filteredData.map((p: any) => [p.lng, p.lat]);
                      result.push(
                        new PolygonLayer({
                          id: layer.id,
                          data: [{ polygon }],
                          getPolygon: (d: any) => d.polygon,
                          getFillColor: hexToRgba(baseColor, Math.round((layer.style.opacity ?? 0.3) * 255)),
                          getLineColor: rgba,
                          getLineWidth: 2,
                          lineWidthMinPixels: 1,
                          filled: true,
                          stroked: true,
                          pickable: true,
                          extruded: layer.style.extruded || false,
                          getElevation: layer.style.elevation || 0,
                        })
                      );
                      break;
                    }

                    case 'trips': {
                      result.push(
                        new TripsLayer({
                          id: layer.id,
                          data: layer.data,
                          getPath: (d: any) =>
                            d.path
                              ? d.path.map((p: any) => [p.lng, p.lat])
                              : [[d.lng, d.lat]],
                          getTimestamps: (d: any) =>
                            d.path ? d.path.map((p: any) => Number(p.timestamp || 0)) : [0],
                          getColor: rgba,
                          opacity: layer.style.opacity ?? 0.8,
                          widthMinPixels: layer.style.size || 2,
                          trailLength: layer.style.trailLength || 180,
                          currentTime: currentTime,
                          pickable: true,
                        })
                      );
                      break;
                    }
                  }
                });

                return result;
              }, [mapData.layers, mapLayerVisibility, currentTime]);

              // Set up ref methods
              useEffect(() => {
                mapGeospatialRef.current = {
                  flyTo: (coords: GeospatialCoordinates, zoom?: number) => {
                    mapRef.current?.flyTo({
                      center: [coords.lng, coords.lat],
                      zoom: zoom || mapRef.current.getZoom(),
                    });
                  },
                  setZoom: (zoom: number) => {
                    mapRef.current?.setZoom(zoom);
                  },
                  toggleLayer: (layerId: string) => {
                    // Layer toggling is handled via layerVisibility state
                  },
                  getCenter: () => {
                    const center = mapRef.current?.getCenter();
                    return center ? { lng: center.lng, lat: center.lat } : null;
                  },
                  getZoom: () => {
                    return mapRef.current?.getZoom() ?? null;
                  },
                };
              }, [mapGeospatialRef]);

              const basemapStyle = BASEMAP_STYLES[mapData.basemap || 'light'] || BASEMAP_STYLES.light;

              // Timeline configuration
              const timelineEnabled = mapData.timeline?.enabled ?? false;
              const startTime = typeof mapData.timeline?.startTime === 'number'
                ? mapData.timeline.startTime
                : mapData.timeline?.startTime
                  ? new Date(mapData.timeline.startTime).getFullYear()
                  : 0;
              const endTime = typeof mapData.timeline?.endTime === 'number'
                ? mapData.timeline.endTime
                : mapData.timeline?.endTime
                  ? new Date(mapData.timeline.endTime).getFullYear()
                  : 100;
              const formatTime = (time: number) => {
                // Format as year if it looks like a year, otherwise just return the number
                return time > 1000 && time < 3000 ? `${Math.round(time)} CE` : time.toString();
              };

              return (
                <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <MapGl
                      ref={mapRef}
                      initialViewState={{
                        longitude: mapData.center.lng,
                        latitude: mapData.center.lat,
                        zoom: mapData.zoom,
                        pitch: mapData.pitch || 0,
                        bearing: mapData.bearing || 0,
                      }}
                      mapStyle={basemapStyle}
                      style={{ width: '100%', height: '100%' }}
                      interactive={mapOptions?.interactive !== false}
                    >
                      <DeckOverlay layers={deckLayers} />
                      {mapOptions?.showControls !== false && <NavigationControl position="top-right" />}
                    </MapGl>
                  </div>
                  {timelineEnabled && (
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem' }}>
                      <TimelineControl
                        startTime={startTime}
                        endTime={endTime}
                        currentTime={currentTime}
                        onTimeChange={setCurrentTime}
                        step={mapData.timeline?.step ?? 1}
                        autoPlay={mapData.timeline?.autoPlay ?? false}
                        speed={mapData.timeline?.speed ?? 1000}
                        formatTime={formatTime}
                      />
                    </div>
                  )}
                </div>
              );
            }

            if (!cancelled) {
              // Wrap InnerMap to accept our specific props
              setMapComponent(() => InnerMap);
            }
          } catch (err) {
            console.error("Failed to load geospatial libraries:", err);
          }
        };

        loadMap();

        return () => {
          cancelled = true;
        };
      }, [isMounted]);

      if (error) {
        return <GeospatialError error={error} />;
      }

      const height = options?.height || (fullscreen ? "100%" : 600);
      const width = options?.width || "100%";

      if (!isMounted || !MapComponent) {
        return (
          <div
            ref={ref}
            className={cn("relative flex-1 overflow-hidden", className)}
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
              Loading geospatial visualization...
            </div>
          </div>
        );
      }

      return (
        <div
          ref={ref}
          className={cn("relative flex-1 overflow-hidden", className)}
          {...props}
        >
          <div
            style={{
              width: typeof width === "number" ? `${width}px` : width,
              height: typeof height === "number" ? `${height}px` : height,
            }}
          >
            <MapComponent
              mapData={data}
              mapOptions={options}
              mapLayerVisibility={layerVisibility}
              mapGeospatialRef={geospatialRef}
            />
          </div>
        </div>
      );
    }
  )
);

GeospatialContent.displayName = "GeospatialContent";

// --- Geospatial Legend ---

export const GeospatialLegend = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { data } = useGeospatialContext();

  return (
    <div
      ref={ref}
      className={cn("p-4 pt-0", className)}
      {...props}
    >
      <div className="rounded-md bg-muted p-3">
        <div className="text-sm font-semibold mb-2">Layers</div>
        <div className="space-y-1">
          {data.layers.map((layer) => (
            <div key={layer.id} className="flex items-center gap-2 text-xs">
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  backgroundColor: Array.isArray(layer.style.color)
                    ? layer.style.color[0]
                    : layer.style.color,
                }}
              />
              <span>{layer.id} ({layer.type})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

GeospatialLegend.displayName = "GeospatialLegend";

// --- Geospatial Error ---

const GeospatialError = ({ error }: { error: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
      <AlertCircle className="h-8 w-8" />
      <p className="text-sm">{error}</p>
    </div>
  );
};
