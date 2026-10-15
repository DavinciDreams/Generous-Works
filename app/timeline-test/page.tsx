import {
  DeepTimeTimeline,
  LegacyTimeline,
  SpaceRaceTimeline,
  StyledTimeline,
  TableTimeline,
} from "@/components/ai-elements/timeline.example";

export default function TimelineTestPage() {
  return (
    <div className="container mx-auto space-y-8 p-8">
      <div>
        <h1 className="text-2xl font-bold">Timeline Test</h1>
        <p className="text-muted-foreground mt-2">
          HistropediaJS timelines in the shared Timeline shape: importance, categories, periods,
          eras, lanes, card styles, table input and the legacy TimelineJS shape.
        </p>
      </div>

      <SpaceRaceTimeline />
      <TableTimeline />
      <StyledTimeline />
      <DeepTimeTimeline />
      <LegacyTimeline />

      <div className="rounded-lg bg-muted p-4">
        <h3 className="mb-2 font-semibold">Try:</h3>
        <ul className="list-inside list-disc space-y-1 text-sm">
          <li>Scroll to zoom and drag to pan; major cards stay when zoomed out</li>
          <li>Hover a card for a preview, click it for details and its read-more link</li>
          <li>Filter by category, group, tag or text</li>
        </ul>
      </div>
    </div>
  );
}
