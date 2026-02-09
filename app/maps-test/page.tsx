import {
  Maps,
  MapsActions,
  MapsContent,
  MapsCopyButton,
  MapsFullscreenButton,
  MapsHeader,
  MapsTitle,
  type MapsData,
} from "@/components/ai-elements/maps-client";

const testData: MapsData = {
  center: {
    longitude: -122.4194,
    latitude: 37.7749,
  },
  zoom: 12,
  markers: [
    {
      id: "marker1",
      coordinates: {
        longitude: -122.4194,
        latitude: 37.7749,
      },
      color: "#ef4444",
      label: "San Francisco",
    },
  ],
};

export default function MapsTestPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Maps Test</h1>
        <p className="text-muted-foreground mt-2">
          MapLibre GL interactive map
        </p>
      </div>

      <Maps data={testData}>
        <MapsHeader>
          <MapsTitle>San Francisco</MapsTitle>
          <MapsActions>
            <MapsCopyButton />
            <MapsFullscreenButton />
          </MapsActions>
        </MapsHeader>
        <MapsContent />
      </Maps>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Map Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Interactive map with zoom and pan</li>
          <li>Red marker at San Francisco</li>
          <li>Navigation controls (top-right)</li>
        </ul>
      </div>
    </div>
  );
}
