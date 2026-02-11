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

export default function TerritorialPolygonsPage() {
  // Mongol Empire - separate polygon layers for each expansion phase
  const mongolEmpireData = {
    center: { lng: 95.0, lat: 45.0 },
    zoom: 3.2,
    pitch: 0,
    bearing: 0,
    basemap: "dark" as const,
    layers: [
      // 1206: Mongolia homeland (red)
      {
        id: "mongolia-1206",
        type: "polygon" as const,
        data: [
          { lng: 98, lat: 52, timestamp: 1206 },
          { lng: 115, lat: 52, timestamp: 1206 },
          { lng: 120, lat: 47, timestamp: 1206 },
          { lng: 115, lat: 42, timestamp: 1206 },
          { lng: 100, lat: 42, timestamp: 1206 },
          { lng: 95, lat: 47, timestamp: 1206 },
        ],
        style: {
          color: "#cc0000",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 1215: Northern China added (orange)
      {
        id: "china-1215",
        type: "polygon" as const,
        data: [
          { lng: 110, lat: 42, timestamp: 1215 },
          { lng: 122, lat: 42, timestamp: 1215 },
          { lng: 122, lat: 34, timestamp: 1215 },
          { lng: 110, lat: 34, timestamp: 1215 },
        ],
        style: {
          color: "#ff6600",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 1220: Central Asia (yellow)
      {
        id: "central-asia-1220",
        type: "polygon" as const,
        data: [
          { lng: 55, lat: 46, timestamp: 1220 },
          { lng: 95, lat: 46, timestamp: 1220 },
          { lng: 95, lat: 35, timestamp: 1220 },
          { lng: 55, lat: 35, timestamp: 1220 },
        ],
        style: {
          color: "#ffcc00",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 1222: Persia (light red)
      {
        id: "persia-1222",
        type: "polygon" as const,
        data: [
          { lng: 44, lat: 40, timestamp: 1222 },
          { lng: 63, lat: 40, timestamp: 1222 },
          { lng: 63, lat: 28, timestamp: 1222 },
          { lng: 44, lat: 28, timestamp: 1222 },
        ],
        style: {
          color: "#ff9999",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 1224: Eastern Europe (pink)
      {
        id: "europe-1224",
        type: "polygon" as const,
        data: [
          { lng: 28, lat: 52, timestamp: 1224 },
          { lng: 50, lat: 52, timestamp: 1224 },
          { lng: 50, lat: 44, timestamp: 1224 },
          { lng: 28, lat: 44, timestamp: 1224 },
        ],
        style: {
          color: "#ffcccc",
          opacity: 0.5,
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

  // Proto-Indo-European expansion
  const pieExpansionData = {
    center: { lng: 40.0, lat: 48.0 },
    zoom: 3,
    pitch: 0,
    bearing: 0,
    basemap: "voyager" as const,
    layers: [
      // 4000 BCE: Pontic-Caspian steppe origin
      {
        id: "origin-4000bce",
        type: "polygon" as const,
        data: [
          { lng: 35, lat: 50, timestamp: -4000 },
          { lng: 55, lat: 50, timestamp: -4000 },
          { lng: 55, lat: 44, timestamp: -4000 },
          { lng: 35, lat: 44, timestamp: -4000 },
        ],
        style: {
          color: "#0033cc",
          opacity: 0.6,
        },
        temporal: true,
      },

      // 3500 BCE: Western expansion begins
      {
        id: "west-3500bce",
        type: "polygon" as const,
        data: [
          { lng: 20, lat: 52, timestamp: -3500 },
          { lng: 40, lat: 52, timestamp: -3500 },
          { lng: 40, lat: 46, timestamp: -3500 },
          { lng: 20, lat: 46, timestamp: -3500 },
        ],
        style: {
          color: "#3366ff",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 3000 BCE: Central Europe
      {
        id: "central-europe-3000bce",
        type: "polygon" as const,
        data: [
          { lng: 5, lat: 54, timestamp: -3000 },
          { lng: 25, lat: 54, timestamp: -3000 },
          { lng: 25, lat: 46, timestamp: -3000 },
          { lng: 5, lat: 46, timestamp: -3000 },
        ],
        style: {
          color: "#6699ff",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 2500 BCE: Western Europe
      {
        id: "west-europe-2500bce",
        type: "polygon" as const,
        data: [
          { lng: -8, lat: 56, timestamp: -2500 },
          { lng: 10, lat: 56, timestamp: -2500 },
          { lng: 10, lat: 48, timestamp: -2500 },
          { lng: -8, lat: 48, timestamp: -2500 },
        ],
        style: {
          color: "#99ccff",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 3500 BCE: Eastern expansion
      {
        id: "east-3500bce",
        type: "polygon" as const,
        data: [
          { lng: 50, lat: 48, timestamp: -3500 },
          { lng: 70, lat: 48, timestamp: -3500 },
          { lng: 70, lat: 40, timestamp: -3500 },
          { lng: 50, lat: 40, timestamp: -3500 },
        ],
        style: {
          color: "#3366ff",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 3000 BCE: Further east
      {
        id: "far-east-3000bce",
        type: "polygon" as const,
        data: [
          { lng: 65, lat: 45, timestamp: -3000 },
          { lng: 85, lat: 45, timestamp: -3000 },
          { lng: 85, lat: 35, timestamp: -3000 },
          { lng: 65, lat: 35, timestamp: -3000 },
        ],
        style: {
          color: "#6699ff",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 2000 BCE: Indo-Iranian south
      {
        id: "south-2000bce",
        type: "polygon" as const,
        data: [
          { lng: 60, lat: 38, timestamp: -2000 },
          { lng: 80, lat: 38, timestamp: -2000 },
          { lng: 80, lat: 26, timestamp: -2000 },
          { lng: 60, lat: 26, timestamp: -2000 },
        ],
        style: {
          color: "#99ccff",
          opacity: 0.5,
        },
        temporal: true,
      },

      // 1500 BCE: India
      {
        id: "india-1500bce",
        type: "polygon" as const,
        data: [
          { lng: 70, lat: 32, timestamp: -1500 },
          { lng: 88, lat: 32, timestamp: -1500 },
          { lng: 88, lat: 18, timestamp: -1500 },
          { lng: 70, lat: 18, timestamp: -1500 },
        ],
        style: {
          color: "#cce6ff",
          opacity: 0.5,
        },
        temporal: true,
      },

      {
        id: "origin-marker",
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
        <h1 className="text-3xl font-bold mb-2">Territorial Expansion with Polygons</h1>
        <p className="text-muted-foreground">
          Clear territorial boundaries that appear as the timeline progresses
        </p>
      </div>

      <Geospatial data={mongolEmpireData}>
        <GeospatialHeader>
          <GeospatialTitle>Mongol Empire Expansion (1206-1227 CE)</GeospatialTitle>
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
      </Geospatial>

      <Geospatial data={pieExpansionData}>
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
          <li><strong>Reset the timeline</strong> - Click the reset button (🔄) or drag slider to 1206</li>
          <li>You'll see <strong>one red region</strong> (Mongolia)</li>
          <li><strong>Click Play</strong> - watch new colored regions appear as time progresses</li>
          <li>Each new region = newly conquered territory</li>
          <li>By 1227, you'll see multiple colored regions showing the full empire extent</li>
        </ol>
      </div>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-3">Region Timeline</h2>
        <ul className="space-y-1 text-sm">
          <li><strong>1206:</strong> 🟥 Dark Red = Mongolia (homeland)</li>
          <li><strong>1215:</strong> 🟧 Orange = Northern China</li>
          <li><strong>1220:</strong> 🟨 Yellow = Central Asia (Khwarezm)</li>
          <li><strong>1222:</strong> 🔴 Light Red = Persia</li>
          <li><strong>1224:</strong> 🩷 Pink = Eastern Europe</li>
        </ul>
      </div>
    </div>
  );
}
