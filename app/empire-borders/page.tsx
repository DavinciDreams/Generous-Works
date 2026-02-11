"use client";

import {
  Geospatial,
  GeospatialHeader,
  GeospatialTitle,
  GeospatialActions,
  GeospatialContent,
  GeospatialLayerToggle,
  GeospatialCopyButton,
  GeospatialFullscreenButton,
} from "@/components/ai-elements/geospatial";

export default function EmpireBordersPage() {
  // Generate dense point grid for territorial coverage
  const generateTerritoryGrid = (bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number }, timestamp: number, density: number = 1) => {
    const points = [];
    const lngStep = (bounds.maxLng - bounds.minLng) / (20 * density);
    const latStep = (bounds.maxLat - bounds.minLat) / (15 * density);

    for (let lng = bounds.minLng; lng <= bounds.maxLng; lng += lngStep) {
      for (let lat = bounds.minLat; lat <= bounds.maxLat; lat += latStep) {
        points.push({ lng, lat, value: 10, timestamp });
      }
    }
    return points;
  };

  // Mongol Empire territorial expansion with dense point grids
  const mongolTerritoryData = [
    // 1206: Mongolia homeland
    ...generateTerritoryGrid({ minLng: 100, maxLng: 115, minLat: 43, maxLat: 52 }, 1206, 1.5),

    // 1215: Northern China added
    ...generateTerritoryGrid({ minLng: 110, maxLng: 122, minLat: 35, maxLat: 43 }, 1215, 1.5),

    // 1218: Western expansion into Xinjiang
    ...generateTerritoryGrid({ minLng: 80, maxLng: 100, minLat: 40, maxLat: 48 }, 1218, 1.2),

    // 1220: Central Asia (Khwarezm)
    ...generateTerritoryGrid({ minLng: 55, maxLng: 80, minLat: 35, maxLat: 45 }, 1220, 1.2),

    // 1222: Persia
    ...generateTerritoryGrid({ minLng: 44, maxLng: 63, minLat: 29, maxLat: 40 }, 1222, 1.0),

    // 1223: Caucasus
    ...generateTerritoryGrid({ minLng: 40, maxLng: 50, minLat: 38, maxLat: 44 }, 1223, 1.0),

    // 1224: Parts of Eastern Europe
    ...generateTerritoryGrid({ minLng: 30, maxLng: 45, minLat: 45, maxLat: 52 }, 1224, 0.8),
  ];

  const mongolEmpireExpansion = {
    center: { lng: 85.0, lat: 42.0 },
    zoom: 3.5,
    pitch: 0,
    bearing: 0,
    basemap: "dark" as const,
    layers: [
      {
        id: "mongol-territory",
        type: "heatmap" as const,
        data: mongolTerritoryData,
        style: {
          color: ["#1a0000", "#4d0000", "#800000", "#b30000", "#e60000", "#ff3333", "#ff6666"],
          size: 45,
          opacity: 0.85,
        },
        temporal: true,
      },
      {
        id: "capital",
        type: "point" as const,
        data: [{ lng: 103.8, lat: 46.9, value: 20 }],
        style: {
          color: "#ffd700",
          size: 200,
          opacity: 1,
        },
      },
    ],
    timeline: {
      enabled: true,
      startTime: 1206,
      endTime: 1227,
      step: 1,
      autoPlay: false,
      speed: 500,
    },
  };

  // Proto-Indo-European with dense coverage
  const pieSpreadData = [
    // 4000 BCE: Pontic-Caspian steppe origin
    ...generateTerritoryGrid({ minLng: 35, maxLng: 55, minLat: 44, maxLat: 50 }, -4000, 1.5),

    // 3500 BCE: Western expansion begins
    ...generateTerritoryGrid({ minLng: 25, maxLng: 40, minLat: 46, maxLat: 52 }, -3500, 1.2),

    // 3000 BCE: Central Europe
    ...generateTerritoryGrid({ minLng: 10, maxLng: 30, minLat: 47, maxLat: 54 }, -3000, 1.2),

    // 2500 BCE: Western Europe
    ...generateTerritoryGrid({ minLng: -5, maxLng: 15, minLat: 48, maxLat: 56 }, -2500, 1.0),

    // 3500 BCE: Eastern expansion to Central Asia
    ...generateTerritoryGrid({ minLng: 50, maxLng: 70, minLat: 40, maxLat: 48 }, -3500, 1.0),

    // 3000 BCE: Further east
    ...generateTerritoryGrid({ minLng: 65, maxLng: 85, minLat: 35, maxLat: 45 }, -3000, 1.0),

    // 2000 BCE: Indo-Iranian branch south
    ...generateTerritoryGrid({ minLng: 60, maxLng: 80, minLat: 28, maxLat: 38 }, -2000, 0.9),

    // 1500 BCE: Into Indian subcontinent
    ...generateTerritoryGrid({ minLng: 72, maxLng: 85, minLat: 20, maxLat: 32 }, -1500, 0.8),
  ];

  const protoIndoEuropeanSpread = {
    center: { lng: 40.0, lat: 45.0 },
    zoom: 3,
    pitch: 0,
    bearing: 0,
    basemap: "voyager" as const,
    layers: [
      {
        id: "pie-spread",
        type: "heatmap" as const,
        data: pieSpreadData,
        style: {
          color: ["#000d26", "#001a4d", "#003399", "#0052cc", "#3385ff", "#66b3ff", "#99ddff"],
          size: 50,
          opacity: 0.75,
        },
        temporal: true,
      },
      {
        id: "origin",
        type: "point" as const,
        data: [{ lng: 47.0, lat: 48.0, value: 20 }],
        style: {
          color: "#ffcc00",
          size: 200,
          opacity: 1,
        },
      },
    ],
    timeline: {
      enabled: true,
      startTime: -4000,
      endTime: -1500,
      step: 100,
      autoPlay: false,
      speed: 300,
    },
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Empire Territorial Expansion</h1>
        <p className="text-muted-foreground">
          Watch empires spread across continents with density heatmap visualization
        </p>
      </div>

      <Geospatial data={mongolEmpireExpansion}>
        <GeospatialHeader>
          <GeospatialTitle>Mongol Empire Growth (1206-1227 CE)</GeospatialTitle>
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
      </Geospatial>

      <Geospatial data={protoIndoEuropeanSpread}>
        <GeospatialHeader>
          <GeospatialTitle>Proto-Indo-European Spread (4000-1500 BCE)</GeospatialTitle>
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
      </Geospatial>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-3">How to Use</h2>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Move the <strong>slider to 1206</strong> to see just Mongolia</li>
          <li>Click <strong>Play (▶️)</strong> to watch the empire spread</li>
          <li>As years progress, you'll see the red/blue heat areas <strong>expand across the map</strong></li>
          <li>The density shows controlled territory - brighter = more intense control</li>
          <li>Adjust speed with the speed button (0.5x → 1x → 2x → 4x)</li>
        </ol>
      </div>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-3">Visualization Method</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li><strong>Dense Point Grid</strong>: Thousands of points fill each controlled region</li>
          <li><strong>Heatmap Layer</strong>: Points blend into continuous territorial coverage</li>
          <li><strong>Time Filtering</strong>: Only regions conquered by current year are shown</li>
          <li><strong>Color Gradient</strong>: Dark to bright showing density of control</li>
        </ul>
      </div>
    </div>
  );
}
