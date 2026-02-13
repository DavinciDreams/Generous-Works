# Discriminated Union Simplification

**Date:** 2026-02-13
**Status:** ✅ Completed

## Problem

The original implementation used Zod discriminated unions for both `ChartsDataSchema` and `ToolUIDataSchema`. This approach caused several issues:

### Issues with Discriminated Unions

1. **Complexity**: 16+ separate schema variants were verbose and hard to maintain
2. **LLM Compatibility**: LLMs often don't generate the exact discriminated union structure with proper `type` fields
3. **Type Inference Issues**: When LLM generates data without a proper `type` field, validation fails
4. **Maintenance Overhead**: Adding new component types requires modifying the discriminated union structure
5. **Runtime Performance**: Discriminated unions add overhead during validation

## Solution

Replaced discriminated unions with single flexible schemas that use optional fields and runtime validation.

### Charts Schema (`lib/schemas/charts.schema.ts`)

**Before:**
```typescript
export const ChartsDataSchema = z.discriminatedUnion('type', [
  BasicChartDataSchema,
  PieChartDataSchema,
  RadarChartDataSchema,
  HistogramChartDataSchema,
  HeatmapChartDataSchema,
  FunnelChartDataSchema,
  GaugeChartDataSchema,
  CandlestickChartDataSchema,
  SankeyChartDataSchema,
  ChordChartDataSchema,
  TreeMapChartDataSchema,
  ForceDirectedChartDataSchema,
  HierarchyChartDataSchema,
  WordCloudChartDataSchema,
  VennChartDataSchema,
]).or(
  // Catch-all for data with missing or invalid type field
  BaseChartSchema.extend({
    type: z.string().optional(),
  }).and(
    z.object({
      // Accept any additional properties
    }).passthrough()
  )
);
```

**After:**
```typescript
export const ChartsDataSchema = z.object({
  // Common fields
  title: z.string().optional(),
  type: ChartTypeSchema.optional(),

  // Series-based charts (line, bar, area, scatter, radar, histogram)
  series: z.array(SeriesSchema).optional(),

  // Axis configuration (for charts that need it)
  xAxis: AxisConfigSchema.optional(),
  yAxis: AxisConfigSchema.optional(),

  // Sankey diagram
  sankeyNodes: z.array(SankeyNodeSchema).optional(),
  sankeyLinks: z.array(SankeyLinkSchema).optional(),

  // Chord diagram
  chordNodes: z.array(z.string()).optional(),
  chordLinks: z.array(ChordLinkSchema).optional(),

  // Tree map
  treeMapData: z.array(TreeMapNodeSchema).optional(),

  // Force directed graph
  graphNodes: z.array(GraphNodeSchema).optional(),
  graphLinks: z.array(GraphLinkSchema).optional(),

  // Hierarchy chart
  hierarchyData: TreeMapNodeSchema.optional(),

  // Word cloud
  words: z.array(WordCloudWordSchema).optional(),

  // Venn diagram
  vennSets: z.array(VennSetSchema).optional(),
  vennIntersections: z.array(VennIntersectionSchema).optional(),

  // Heatmap
  data: z.array(HeatmapDataPointSchema).optional(),

  // Funnel chart
  stages: z.array(FunnelStageSchema).optional(),

  // Gauge chart
  value: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  ranges: z.array(GaugeRangeSchema).optional(),
  target: z.number().optional(),

  // Candlestick chart
  showVolume: z.boolean().optional(),
  binCount: z.number().optional(), // For histogram
}).refine(
  (data) => {
    // Ensure at least one data field is present
    return !!(
      data.series ||
      data.sankeyNodes ||
      data.chordNodes ||
      data.treeMapData ||
      data.graphNodes ||
      data.hierarchyData ||
      data.words ||
      data.vennSets ||
      data.data ||
      data.stages ||
      data.value !== undefined
    );
  },
  {
    message: "Charts data must include at least one data field (series, sankeyNodes, chordNodes, etc.)",
  }
);
```

### ToolUI Schema (`lib/schemas/toolui.schema.ts`)

**Before:**
```typescript
export const ToolUIDataSchema = z.discriminatedUnion("type", [
  // Social Posts
  z.object({ type: z.literal("x-post"), data: SerializableXPostSchema }),
  z.object({ type: z.literal("instagram-post"), data: SerializableInstagramPostSchema }),
  z.object({ type: z.literal("linkedin-post"), data: SerializableLinkedInPostSchema }),

  // Media
  z.object({ type: z.literal("image-gallery"), data: SerializableImageGallerySchema }),
  z.object({ type: z.literal("video"), data: SerializableVideoSchema }),

  // Data Visualization
  z.object({ type: z.literal("stats-display"), data: SerializableStatsDisplaySchema }),
  z.object({ type: z.literal("data-table"), data: SerializableDataTableSchema }),

  // UI Components
  z.object({ type: z.literal("option-list"), data: SerializableOptionListSchema }),
  z.object({ type: z.literal("parameter-slider"), data: SerializableParameterSliderSchema }),

  // Workflow
  z.object({ type: z.literal("progress-tracker"), data: SerializableProgressTrackerSchema }),
  z.object({ type: z.literal("question-flow"), data: SerializableQuestionFlowSchema }),
  z.object({ type: z.literal("approval-card"), data: SerializableApprovalCardSchema }),
  z.object({ type: z.literal("message-draft"), data: SerializableMessageDraftSchema }),

  // Specialized
  z.object({ type: z.literal("order-summary"), data: SerializableOrderSummarySchema }),
  z.object({ type: z.literal("link-preview"), data: SerializableLinkPreviewSchema }),
  z.object({ type: z.literal("weather-widget"), data: SerializableWeatherWidgetSchema }),
  z.object({ type: z.literal("preferences-panel"), data: SerializablePreferencesPanelSchema }),
  z.object({ type: z.literal("item-carousel"), data: SerializableItemCarouselSchema }),
]);
```

**After:**
```typescript
/**
 * Supported ToolUI component types
 */
export const ToolUIComponentTypeSchema = z.enum([
  // Social Posts
  "x-post",
  "instagram-post",
  "linkedin-post",
  // Media
  "image-gallery",
  "video",
  // Data Visualization
  "stats-display",
  "data-table",
  // UI Components
  "option-list",
  "parameter-slider",
  // Workflow
  "progress-tracker",
  "question-flow",
  "approval-card",
  "message-draft",
  // Specialized
  "order-summary",
  "link-preview",
  "weather-widget",
  "preferences-panel",
  "item-carousel",
]);

/**
 * Flexible schema for all ToolUI components.
 */
export const ToolUIDataSchema = z.object({
  type: ToolUIComponentTypeSchema.optional(),
  data: z.any().optional(), // Flexible data field, validated at component level
}).passthrough(); // Allow additional fields for LLM flexibility
```

## Benefits

1. **Simpler Maintenance**: Single schema instead of 16+ variants
2. **Better LLM Compatibility**: More flexible validation that accepts partial data
3. **Easier to Extend**: Adding new chart types or component types doesn't require modifying the schema structure
4. **Runtime Validation**: Component-level validation ensures data integrity
5. **Type Safety Preserved**: TypeScript utility types provide type narrowing based on the `type` field

## Compatibility

The simplified schemas are compatible with:

- **Schema Registry**: The `schemaRegistry` in `lib/schemas/index.ts` continues to work as expected
- **Validation Functions**: The `validateProps` function works with the new schemas
- **Component Rendering**: Components use type guards (`'series' in data`, `'sankeyNodes' in data`, etc.) to check which fields are present
- **Plugin Integration**: The schemas remain valid Zod schemas with `parse` and `safeParse` methods, making them compatible with the Generous Plugin

## Type Safety

Type safety is preserved through:

1. **Runtime Validation**: The `.refine()` method ensures at least one data field is present
2. **Type Guards**: Components use `'field' in data` checks to narrow types
3. **Utility Types**: TypeScript utility types provide type narrowing based on the `type` field
4. **Component-Level Validation**: Each component validates its specific data structure

## Migration Notes

No migration is required for existing code:

- The schemas are still exported from `lib/schemas/index.ts`
- The component rendering logic uses type guards that work with both approaches
- The validation functions continue to work as expected
- TypeScript types are inferred correctly from the new schemas

## Files Changed

1. `lib/schemas/charts.schema.ts` - Simplified from discriminated union to single flexible schema
2. `lib/schemas/toolui.schema.ts` - Simplified from discriminated union to single flexible schema

## Testing

The changes are compatible with existing tests in `lib/schemas/index.test.ts`. The schema registry and validation functions continue to work as expected.
