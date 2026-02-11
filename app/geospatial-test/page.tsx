import {
  Geospatial,
  GeospatialActions,
  GeospatialContent,
  GeospatialCopyButton,
  GeospatialFullscreenButton,
  GeospatialHeader,
  GeospatialLayerToggle,
  GeospatialLegend,
  GeospatialTitle,
  type GeospatialData,
} from "@/components/ai-elements/geospatial";

// --- Sample Data: San Francisco ---
// Demonstrates heatmap, hexagon, point, and arc layers

const sfHeatmapPoints = [
  { lng: -122.4194, lat: 37.7749, value: 100 },
  { lng: -122.4084, lat: 37.7849, value: 80 },
  { lng: -122.4294, lat: 37.7649, value: 120 },
  { lng: -122.3994, lat: 37.7549, value: 95 },
  { lng: -122.4394, lat: 37.7949, value: 110 },
  { lng: -122.4150, lat: 37.7800, value: 140 },
  { lng: -122.4050, lat: 37.7700, value: 85 },
  { lng: -122.4250, lat: 37.7900, value: 130 },
  { lng: -122.4100, lat: 37.7600, value: 70 },
  { lng: -122.4300, lat: 37.7850, value: 115 },
  { lng: -122.4000, lat: 37.7750, value: 90 },
  { lng: -122.4200, lat: 37.7650, value: 105 },
  { lng: -122.4350, lat: 37.7800, value: 75 },
  { lng: -122.4120, lat: 37.7920, value: 125 },
  { lng: -122.4050, lat: 37.7680, value: 60 },
  { lng: -122.4180, lat: 37.7780, value: 135 },
  { lng: -122.4280, lat: 37.7720, value: 88 },
  { lng: -122.3950, lat: 37.7820, value: 98 },
  { lng: -122.4320, lat: 37.7680, value: 110 },
  { lng: -122.4080, lat: 37.7880, value: 102 },
];

const sfLandmarks = [
  { lng: -122.4194, lat: 37.7749, value: 1, properties: { name: 'City Hall', type: 'Government' } },
  { lng: -122.4083, lat: 37.7858, value: 1, properties: { name: 'North Beach', type: 'Neighborhood' } },
  { lng: -122.3935, lat: 37.7956, value: 1, properties: { name: 'Fishermans Wharf', type: 'Tourist' } },
  { lng: -122.4786, lat: 37.8199, value: 1, properties: { name: 'Golden Gate Bridge', type: 'Landmark' } },
  { lng: -122.4098, lat: 37.7614, value: 1, properties: { name: 'Mission District', type: 'Neighborhood' } },
  { lng: -122.3893, lat: 37.7866, value: 1, properties: { name: 'Financial District', type: 'Business' } },
];

const sfArcs = [
  { lng: -122.4194, lat: 37.7749, targetLng: -122.4786, targetLat: 37.8199, value: 500, properties: { route: 'City Hall → GG Bridge' } },
  { lng: -122.4194, lat: 37.7749, targetLng: -122.3935, targetLat: 37.7956, value: 800, properties: { route: 'City Hall → Wharf' } },
  { lng: -122.3893, lat: 37.7866, targetLng: -122.4098, targetLat: 37.7614, value: 300, properties: { route: 'FiDi → Mission' } },
  { lng: -122.4083, lat: 37.7858, targetLng: -122.3935, targetLat: 37.7956, value: 200, properties: { route: 'North Beach → Wharf' } },
];

// Example 1: Heatmap + Points (default)
const heatmapData: GeospatialData = {
  center: { lng: -122.4194, lat: 37.7749 },
  zoom: 12,
  layers: [
    {
      id: 'population-density',
      type: 'heatmap',
      data: sfHeatmapPoints,
      style: {
        color: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'],
        size: 40,
        opacity: 0.8,
      },
    },
    {
      id: 'landmarks',
      type: 'point',
      data: sfLandmarks,
      style: {
        color: '#3b82f6',
        size: 200,
        opacity: 0.9,
      },
    },
  ],
  basemap: 'dark',
};

// Example 2: Hexagon 3D bins (with pitch for 3D effect)
const hexagonData: GeospatialData = {
  center: { lng: -122.4194, lat: 37.7749 },
  zoom: 12,
  pitch: 45,
  bearing: -17,
  layers: [
    {
      id: 'hex-density',
      type: 'hexagon',
      data: sfHeatmapPoints,
      style: {
        color: ['#0198bd', '#49e3ce', '#d8feb5', '#feecb1', '#fead54', '#d1364e'],
        size: 300,
        extruded: true,
        elevation: 8,
        opacity: 0.8,
      },
    },
  ],
  basemap: 'dark',
};

// Example 3: Arc layer showing connections
const arcData: GeospatialData = {
  center: { lng: -122.4194, lat: 37.7849 },
  zoom: 12,
  pitch: 30,
  layers: [
    {
      id: 'travel-routes',
      type: 'arc',
      data: sfArcs,
      style: {
        color: ['#00ff88', '#ff4488'],
        size: 3,
        opacity: 0.8,
      },
    },
    {
      id: 'destinations',
      type: 'point',
      data: sfLandmarks,
      style: {
        color: '#ffffff',
        size: 150,
        opacity: 1,
      },
    },
  ],
  basemap: 'dark',
};

// Example 4: Multi-layer with all types
const multiLayerData: GeospatialData = {
  center: { lng: -122.4194, lat: 37.7749 },
  zoom: 12,
  layers: [
    {
      id: 'density-heatmap',
      type: 'heatmap',
      data: sfHeatmapPoints,
      style: {
        color: ['#ffffb2', '#fd8d3c', '#bd0026'],
        size: 35,
        opacity: 0.6,
      },
    },
    {
      id: 'poi-markers',
      type: 'point',
      data: sfLandmarks,
      style: {
        color: '#22d3ee',
        size: 250,
        opacity: 0.9,
      },
    },
    {
      id: 'connections',
      type: 'arc',
      data: sfArcs,
      style: {
        color: ['#a855f7', '#ec4899'],
        size: 2,
        opacity: 0.7,
      },
    },
  ],
  basemap: 'voyager',
};

export default function GeospatialTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-12">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Geospatial Visualization</h1>
        <p className="text-muted-foreground mt-2">
          Advanced geospatial visualization powered by <strong>deck.gl</strong> + <strong>MapLibre GL</strong> with
          CARTO basemaps. Supports heatmaps, 3D hexagon bins, arc layers, scatter plots, paths, and polygons.
        </p>
      </div>

      {/* Example 1: Heatmap + Points */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Heatmap + Points</h2>
        <p className="text-sm text-muted-foreground mb-3">
          GPU-accelerated heatmap showing population density with point markers for landmarks.
        </p>
        <Geospatial data={heatmapData} options={{ height: 500 }}>
          <GeospatialHeader>
            <GeospatialTitle>San Francisco Density</GeospatialTitle>
            <GeospatialActions>
              <GeospatialLayerToggle />
              <GeospatialCopyButton />
              <GeospatialFullscreenButton />
            </GeospatialActions>
          </GeospatialHeader>
          <GeospatialContent />
          <GeospatialLegend />
        </Geospatial>
      </section>

      {/* Example 2: 3D Hexagon Bins */}
      <section>
        <h2 className="text-xl font-semibold mb-3">3D Hexagon Bins</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Hexagonal binning with 3D extrusion. Tilt the map (pitch: 45) to see elevation.
          Height and color both encode data density.
        </p>
        <Geospatial data={hexagonData} options={{ height: 500 }}>
          <GeospatialHeader>
            <GeospatialTitle>Hexagonal Density</GeospatialTitle>
            <GeospatialActions>
              <GeospatialLayerToggle />
              <GeospatialCopyButton />
              <GeospatialFullscreenButton />
            </GeospatialActions>
          </GeospatialHeader>
          <GeospatialContent />
          <GeospatialLegend />
        </Geospatial>
      </section>

      {/* Example 3: Arc Layer */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Arc Connections</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Arc layer showing travel routes between landmarks. Source is green, target is pink.
          Great for showing origin-destination data, flights, or network connections.
        </p>
        <Geospatial data={arcData} options={{ height: 500 }}>
          <GeospatialHeader>
            <GeospatialTitle>SF Travel Routes</GeospatialTitle>
            <GeospatialActions>
              <GeospatialLayerToggle />
              <GeospatialCopyButton />
              <GeospatialFullscreenButton />
            </GeospatialActions>
          </GeospatialHeader>
          <GeospatialContent />
          <GeospatialLegend />
        </Geospatial>
      </section>

      {/* Example 4: Multi-Layer */}
      <section>
        <h2 className="text-xl font-semibold mb-3">Multi-Layer Composition</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Multiple layer types composed together: heatmap, points, and arcs.
          Use the layers toggle to show/hide individual layers.
        </p>
        <Geospatial data={multiLayerData} options={{ height: 500 }}>
          <GeospatialHeader>
            <GeospatialTitle>All Layers</GeospatialTitle>
            <GeospatialActions>
              <GeospatialLayerToggle />
              <GeospatialCopyButton />
              <GeospatialFullscreenButton />
            </GeospatialActions>
          </GeospatialHeader>
          <GeospatialContent />
          <GeospatialLegend />
        </Geospatial>
      </section>

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Geospatial Features (deck.gl + MapLibre):</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>GPU-accelerated heatmap visualization (100k+ points)</li>
          <li>3D hexagonal binning with elevation and color encoding</li>
          <li>Arc layers for origin-destination / flow visualization</li>
          <li>Scatter plot layer with configurable radius and color</li>
          <li>Path and polygon layers with fill and stroke</li>
          <li>Layer visibility toggle control</li>
          <li>CARTO basemaps: light (Positron), dark (Dark Matter), voyager</li>
          <li>3D pitch and bearing support for perspective views</li>
          <li>No API key required - fully open source stack</li>
        </ul>
      </div>
    </div>
  );
}
