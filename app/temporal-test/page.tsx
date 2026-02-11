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

export default function TemporalTestPage() {
  // Genghis Khan's major campaigns (1206-1227 CE)
  const genghisKhanCampaigns = {
    center: { lng: 103.8, lat: 46.9 }, // Mongolia
    zoom: 3,
    pitch: 45,
    bearing: 0,
    basemap: "dark" as const,
    layers: [
      {
        id: "genghis-campaigns",
        type: "trips" as const,
        data: [
          {
            path: [
              { lng: 103.8, lat: 46.9, timestamp: 1206 }, // Mongolia - Unification
              { lng: 116.4, lat: 39.9, timestamp: 1215 }, // Beijing - Jin Dynasty campaign
              { lng: 89.6, lat: 42.8, timestamp: 1218 }, // Xinjiang - Western expansion
              { lng: 66.9, lat: 39.6, timestamp: 1220 }, // Samarkand - Khwarezmian Empire
              { lng: 51.4, lat: 35.7, timestamp: 1221 }, // Tehran - Persia
              { lng: 44.5, lat: 40.2, timestamp: 1222 }, // Armenia/Caucasus
            ],
            properties: { campaign: "Western Campaign", leader: "Genghis Khan" },
          },
          {
            path: [
              { lng: 103.8, lat: 46.9, timestamp: 1206 }, // Mongolia
              { lng: 106.9, lat: 47.9, timestamp: 1211 }, // Northern expansion
              { lng: 108.2, lat: 44.5, timestamp: 1213 }, // Inner Mongolia
              { lng: 116.4, lat: 39.9, timestamp: 1215 }, // Beijing
              { lng: 118.8, lat: 32.0, timestamp: 1217 }, // Nanjing region
            ],
            properties: { campaign: "Jin Dynasty Campaign", leader: "Genghis Khan" },
          },
          {
            path: [
              { lng: 66.9, lat: 39.6, timestamp: 1220 }, // Samarkand
              { lng: 69.2, lat: 34.5, timestamp: 1221 }, // Afghanistan
              { lng: 74.3, lat: 31.5, timestamp: 1222 }, // Lahore - India
              { lng: 75.8, lat: 26.9, timestamp: 1223 }, // Rajasthan
            ],
            properties: { campaign: "Indian Subcontinent Raids", leader: "Jebe & Subutai" },
          },
          {
            path: [
              { lng: 44.5, lat: 40.2, timestamp: 1222 }, // Caucasus
              { lng: 37.6, lat: 55.8, timestamp: 1223 }, // Moscow region
              { lng: 30.5, lat: 50.4, timestamp: 1223 }, // Kiev
              { lng: 49.1, lat: 55.8, timestamp: 1224 }, // Volga Bulgaria
            ],
            properties: { campaign: "European Reconnaissance", leader: "Jebe & Subutai" },
          },
        ],
        style: {
          color: "#ff4500",
          size: 4,
          opacity: 0.9,
          trailLength: 120, // Trail persists for 120 time units
        },
        temporal: true,
      },
      {
        id: "capital-marker",
        type: "point" as const,
        data: [
          { lng: 103.8, lat: 46.9, value: 10, properties: { name: "Karakorum (Capital)" } },
        ],
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
      speed: 500, // 500ms per year
    },
  };

  // Proto-Indo-European territorial expansion example
  const protoIndoEuropeanExpansion = {
    center: { lng: 47.0, lat: 48.0 }, // Pontic-Caspian steppe
    zoom: 3,
    pitch: 0,
    bearing: 0,
    basemap: "voyager" as const,
    layers: [
      {
        id: "pie-migrations",
        type: "trips" as const,
        data: [
          {
            path: [
              { lng: 47.0, lat: 48.0, timestamp: -4000 }, // Pontic-Caspian steppe (4000 BCE)
              { lng: 30.0, lat: 50.0, timestamp: -3500 }, // Western expansion
              { lng: 15.0, lat: 52.0, timestamp: -3000 }, // Central Europe
              { lng: 5.0, lat: 52.0, timestamp: -2500 }, // Western Europe
            ],
            properties: { branch: "Western Branch" },
          },
          {
            path: [
              { lng: 47.0, lat: 48.0, timestamp: -4000 },
              { lng: 60.0, lat: 45.0, timestamp: -3500 }, // Central Asia
              { lng: 75.0, lat: 40.0, timestamp: -3000 }, // Tarim Basin
              { lng: 85.0, lat: 35.0, timestamp: -2000 }, // Tibet/China border
            ],
            properties: { branch: "Tocharian Branch" },
          },
          {
            path: [
              { lng: 47.0, lat: 48.0, timestamp: -4000 },
              { lng: 50.0, lat: 35.0, timestamp: -3000 }, // Iranian Plateau
              { lng: 75.0, lat: 28.0, timestamp: -1500 }, // Indo-Aryan migration to India
            ],
            properties: { branch: "Indo-Iranian Branch" },
          },
        ],
        style: {
          color: "#4169e1",
          size: 3,
          opacity: 0.8,
          trailLength: 500,
        },
        temporal: true,
      },
    ],
    timeline: {
      enabled: true,
      startTime: -4000,
      endTime: -1500,
      step: 100, // 100-year increments
      autoPlay: false,
      speed: 300,
    },
  };

  // COVID heatmap example (simplified - would use real data in production)
  const covidHeatmap = {
    center: { lng: 0, lat: 30 },
    zoom: 2,
    basemap: "light" as const,
    layers: [
      {
        id: "covid-cases",
        type: "heatmap" as const,
        data: [
          // Major cities with varying case densities
          { lng: 116.4, lat: 39.9, value: 100 }, // Beijing
          { lng: -74.0, lat: 40.7, value: 150 }, // New York
          { lng: -0.1, lat: 51.5, value: 80 }, // London
          { lng: 2.3, lat: 48.9, value: 90 }, // Paris
          { lng: 139.7, lat: 35.7, value: 70 }, // Tokyo
          { lng: -118.2, lat: 34.1, value: 120 }, // Los Angeles
          { lng: 12.5, lat: 41.9, value: 95 }, // Rome
          { lng: -3.7, lat: 40.4, value: 85 }, // Madrid
          { lng: 37.6, lat: 55.8, value: 110 }, // Moscow
          { lng: 77.2, lat: 28.6, value: 130 }, // Delhi
        ],
        style: {
          color: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
          size: 40,
          opacity: 0.8,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Temporal Geospatial Visualizations</h1>
        <p className="text-muted-foreground">
          Demonstrations of deck.gl TripsLayer with Timeline controls for animated temporal data
        </p>
      </div>

      {/* Genghis Khan Campaigns */}
      <Geospatial data={genghisKhanCampaigns}>
        <GeospatialHeader>
          <GeospatialTitle>Genghis Khan's Campaigns (1206-1227 CE)</GeospatialTitle>
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
      </Geospatial>

      {/* Proto-Indo-European Expansion */}
      <Geospatial data={protoIndoEuropeanExpansion}>
        <GeospatialHeader>
          <GeospatialTitle>Proto-Indo-European Territorial Expansion (4000-1500 BCE)</GeospatialTitle>
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
      </Geospatial>

      {/* COVID Heatmap (static - for comparison) */}
      <Geospatial data={covidHeatmap}>
        <GeospatialHeader>
          <GeospatialTitle>COVID-19 Cases Heatmap</GeospatialTitle>
          <GeospatialActions>
            <GeospatialLayerToggle />
            <GeospatialCopyButton />
            <GeospatialFullscreenButton />
          </GeospatialActions>
        </GeospatialHeader>
        <GeospatialContent />
      </Geospatial>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-3">Features Demonstrated</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>
            <strong>TripsLayer</strong>: Animated temporal paths showing movement over time (Genghis Khan campaigns, PIE migrations)
          </li>
          <li>
            <strong>Timeline Controls</strong>: Play/pause, speed adjustment (0.5x, 1x, 2x, 4x), manual scrubbing
          </li>
          <li>
            <strong>Trail Persistence</strong>: Configurable trail length showing recent history
          </li>
          <li>
            <strong>HeatmapLayer</strong>: Density visualization for static spatial data (COVID cases)
          </li>
          <li>
            <strong>3D Perspective</strong>: Pitch and bearing controls for dynamic viewing angles
          </li>
          <li>
            <strong>Layer Toggle</strong>: Show/hide individual layers
          </li>
          <li>
            <strong>Multiple Basemaps</strong>: CARTO styles (light, dark, voyager, satellite)
          </li>
        </ul>
      </div>

      <div className="rounded-lg border p-6 bg-muted/30">
        <h2 className="text-xl font-semibold mb-3">Technical Implementation</h2>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Library:</strong> deck.gl v9.2.6 + MapLibre GL JS v5.18.0
          </div>
          <div>
            <strong>Bundle Size:</strong> ~885KB gzipped (deck.gl + MapLibre + Timeline)
          </div>
          <div>
            <strong>React Compatibility:</strong> React 19.2.3 ✅
          </div>
          <div>
            <strong>Components:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li>Geospatial (deck.gl wrapper with temporal support)</li>
              <li>TimelineControl (Radix UI-based playback controls)</li>
              <li>TripsLayer (animated temporal paths)</li>
              <li>HeatmapLayer (density visualization)</li>
            </ul>
          </div>
          <div>
            <strong>Data Format:</strong> Array of path objects with lng/lat/timestamp coordinates
          </div>
        </div>
      </div>
    </div>
  );
}
