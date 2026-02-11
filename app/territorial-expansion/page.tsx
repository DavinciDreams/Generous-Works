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

export default function TerritorialExpansionPage() {
  // Mongol Empire territorial expansion (1206-1227 CE)
  // Using hexagonal points to represent controlled territory over time
  const mongolEmpireExpansion = {
    center: { lng: 95.0, lat: 45.0 },
    zoom: 3,
    pitch: 0,
    bearing: 0,
    basemap: "dark" as const,
    layers: [
      {
        id: "mongol-territories",
        type: "hexagon" as const,
        data: [
          // Mongolia - Original homeland (1206)
          { lng: 103.8, lat: 46.9, value: 10, timestamp: 1206 },
          { lng: 106.0, lat: 47.5, value: 10, timestamp: 1206 },
          { lng: 108.0, lat: 48.0, value: 10, timestamp: 1206 },
          { lng: 110.0, lat: 46.5, value: 10, timestamp: 1206 },
          { lng: 105.0, lat: 49.0, value: 10, timestamp: 1206 },

          // Northern China expansion (1211-1215)
          { lng: 116.4, lat: 39.9, value: 15, timestamp: 1215 }, // Beijing
          { lng: 114.0, lat: 40.5, value: 12, timestamp: 1213 },
          { lng: 112.0, lat: 41.0, value: 12, timestamp: 1212 },
          { lng: 118.0, lat: 38.0, value: 14, timestamp: 1214 },
          { lng: 120.0, lat: 36.0, value: 13, timestamp: 1215 },

          // Western expansion - Xinjiang (1218-1220)
          { lng: 87.6, lat: 43.8, value: 15, timestamp: 1218 },
          { lng: 89.6, lat: 42.8, value: 16, timestamp: 1218 },
          { lng: 91.0, lat: 44.0, value: 14, timestamp: 1219 },
          { lng: 85.0, lat: 45.0, value: 13, timestamp: 1219 },

          // Central Asia - Khwarezmian Empire (1220-1221)
          { lng: 66.9, lat: 39.6, value: 20, timestamp: 1220 }, // Samarkand
          { lng: 64.0, lat: 40.0, value: 18, timestamp: 1220 },
          { lng: 69.0, lat: 41.0, value: 17, timestamp: 1220 },
          { lng: 71.0, lat: 38.5, value: 16, timestamp: 1221 },
          { lng: 60.0, lat: 37.0, value: 15, timestamp: 1221 },

          // Persia (1221-1222)
          { lng: 51.4, lat: 35.7, value: 22, timestamp: 1221 }, // Tehran region
          { lng: 54.0, lat: 36.5, value: 20, timestamp: 1221 },
          { lng: 48.0, lat: 34.0, value: 18, timestamp: 1222 },
          { lng: 53.0, lat: 33.0, value: 17, timestamp: 1222 },
          { lng: 57.0, lat: 38.0, value: 19, timestamp: 1221 },

          // Caucasus (1222-1223)
          { lng: 44.5, lat: 40.2, value: 16, timestamp: 1222 },
          { lng: 46.0, lat: 41.5, value: 15, timestamp: 1222 },
          { lng: 42.0, lat: 39.0, value: 14, timestamp: 1223 },

          // Eastern Europe reconnaissance (1223-1224)
          { lng: 37.6, lat: 55.8, value: 12, timestamp: 1223 }, // Moscow region
          { lng: 30.5, lat: 50.4, value: 13, timestamp: 1223 }, // Kiev
          { lng: 39.0, lat: 47.0, value: 11, timestamp: 1223 },
          { lng: 49.0, lat: 56.0, value: 10, timestamp: 1224 },

          // Tibet and Western China (1224-1227)
          { lng: 91.0, lat: 30.0, value: 14, timestamp: 1226 },
          { lng: 102.0, lat: 38.0, value: 16, timestamp: 1225 },
          { lng: 104.0, lat: 35.0, value: 15, timestamp: 1226 },
          { lng: 107.0, lat: 32.0, value: 17, timestamp: 1227 },
        ],
        style: {
          color: ["#4d0000", "#800000", "#b30000", "#e60000", "#ff1a1a", "#ff6666"],
          size: 50000, // 50km hexagons
          opacity: 0.7,
          extruded: true,
          elevation: 2,
        },
        temporal: true,
      },
      {
        id: "capital",
        type: "point" as const,
        data: [
          { lng: 103.8, lat: 46.9, value: 20 },
        ],
        style: {
          color: "#ffd700",
          size: 150,
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
      speed: 400,
    },
  };

  // Proto-Indo-European territorial spread
  const protoIndoEuropeanSpread = {
    center: { lng: 55.0, lat: 48.0 },
    zoom: 3,
    pitch: 0,
    bearing: 0,
    basemap: "voyager" as const,
    layers: [
      {
        id: "pie-territories",
        type: "hexagon" as const,
        data: [
          // Pontic-Caspian Steppe - Origin (4000 BCE)
          { lng: 47.0, lat: 48.0, value: 15, timestamp: -4000 },
          { lng: 45.0, lat: 47.0, value: 14, timestamp: -4000 },
          { lng: 49.0, lat: 49.0, value: 14, timestamp: -4000 },
          { lng: 46.0, lat: 46.0, value: 13, timestamp: -4000 },
          { lng: 50.0, lat: 47.5, value: 13, timestamp: -4000 },

          // Western expansion (3500 BCE)
          { lng: 40.0, lat: 48.0, value: 12, timestamp: -3500 },
          { lng: 35.0, lat: 49.0, value: 11, timestamp: -3500 },
          { lng: 30.0, lat: 50.0, value: 10, timestamp: -3500 },
          { lng: 38.0, lat: 47.0, value: 11, timestamp: -3500 },

          // Central Europe (3000 BCE)
          { lng: 25.0, lat: 50.0, value: 13, timestamp: -3000 },
          { lng: 20.0, lat: 51.0, value: 12, timestamp: -3000 },
          { lng: 15.0, lat: 52.0, value: 11, timestamp: -3000 },
          { lng: 22.0, lat: 49.0, value: 12, timestamp: -3000 },

          // Western Europe (2500 BCE)
          { lng: 10.0, lat: 52.0, value: 14, timestamp: -2500 },
          { lng: 5.0, lat: 52.0, value: 13, timestamp: -2500 },
          { lng: 0.0, lat: 51.0, value: 12, timestamp: -2500 },
          { lng: 8.0, lat: 50.0, value: 13, timestamp: -2500 },

          // Eastern expansion - Central Asia (3500-3000 BCE)
          { lng: 55.0, lat: 47.0, value: 11, timestamp: -3500 },
          { lng: 60.0, lat: 45.0, value: 12, timestamp: -3500 },
          { lng: 65.0, lat: 43.0, value: 13, timestamp: -3000 },
          { lng: 70.0, lat: 42.0, value: 14, timestamp: -3000 },
          { lng: 75.0, lat: 40.0, value: 15, timestamp: -3000 },

          // Tocharian - Tarim Basin (2500-2000 BCE)
          { lng: 80.0, lat: 38.0, value: 13, timestamp: -2500 },
          { lng: 85.0, lat: 37.0, value: 14, timestamp: -2500 },
          { lng: 87.0, lat: 35.0, value: 12, timestamp: -2000 },

          // Indo-Iranian - South Asia (2000-1500 BCE)
          { lng: 70.0, lat: 35.0, value: 16, timestamp: -2000 },
          { lng: 75.0, lat: 30.0, value: 17, timestamp: -1800 },
          { lng: 78.0, lat: 28.0, value: 18, timestamp: -1700 },
          { lng: 77.0, lat: 25.0, value: 17, timestamp: -1600 },
          { lng: 80.0, lat: 22.0, value: 16, timestamp: -1500 },
        ],
        style: {
          color: ["#001a4d", "#003399", "#0052cc", "#3385ff", "#66b3ff", "#99ccff"],
          size: 80000, // 80km hexagons for larger area
          opacity: 0.65,
          extruded: true,
          elevation: 1.5,
        },
        temporal: true,
      },
      {
        id: "origin-marker",
        type: "point" as const,
        data: [
          { lng: 47.0, lat: 48.0, value: 20 },
        ],
        style: {
          color: "#ffcc00",
          size: 150,
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
        <h1 className="text-3xl font-bold mb-2">Territorial Expansion Over Time</h1>
        <p className="text-muted-foreground">
          Watch empires and cultures expand across the map using time-filtered hexagonal territory layers
        </p>
      </div>

      {/* Mongol Empire */}
      <Geospatial data={mongolEmpireExpansion}>
        <GeospatialHeader>
          <GeospatialTitle>Mongol Empire Territorial Expansion (1206-1227 CE)</GeospatialTitle>
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
      </Geospatial>

      {/* Proto-Indo-European */}
      <Geospatial data={protoIndoEuropeanSpread}>
        <GeospatialHeader>
          <GeospatialTitle>Proto-Indo-European Cultural Spread (4000-1500 BCE)</GeospatialTitle>
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
      </Geospatial>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-3">How It Works</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>
            <strong>Hexagonal Territory Layers</strong>: Each hexagon represents controlled territory
          </li>
          <li>
            <strong>Time Filtering</strong>: Only territories conquered by the current year are shown
          </li>
          <li>
            <strong>3D Elevation</strong>: Height indicates population/importance of the region
          </li>
          <li>
            <strong>Color Gradient</strong>: Darker to brighter colors show intensity of control
          </li>
          <li>
            <strong>Play Animation</strong>: Watch the empire grow year by year from 1206 to 1227 CE
          </li>
        </ul>
      </div>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-3">Instructions</h2>
        <ol className="space-y-2 list-decimal list-inside">
          <li>Click the <strong>Play button (▶️)</strong> to start the animation</li>
          <li>Watch as new hexagons appear showing territorial expansion</li>
          <li>Use the <strong>slider</strong> to jump to any year</li>
          <li>Click the <strong>speed button</strong> to adjust playback speed (0.5x, 1x, 2x, 4x)</li>
          <li>Click <strong>Reset (🔄)</strong> to start from the beginning</li>
        </ol>
      </div>
    </div>
  );
}
