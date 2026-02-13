/**
 * Zod schemas for Charts component
 * Provides runtime type validation for amCharts 5 data visualization props
 *
 * Uses a simplified approach with a single flexible schema instead of
 * discriminated unions. This is more maintainable and LLM-friendly.
 */

import { z } from 'zod';

/**
 * Chart types supported by amCharts 5
 */
export const ChartTypeSchema = z.enum([
  // Basic charts
  'line',
  'bar',
  'pie',
  'scatter',
  'area',
  'radar',
  // Business/Analytics charts
  'histogram',
  'heatmap',
  'funnel',
  'gauge',
  'candlestick',
  // Advanced/Miscellaneous charts
  'sankey',
  'chord',
  'treemap',
  'forceDirected',
  'hierarchy',
  'wordCloud',
  'venn'
]);

export type ChartType = z.infer<typeof ChartTypeSchema>;

/**
 * Data point for chart series
 */
export const DataPointSchema = z.object({
  x: z.union([z.number(), z.string()]),
  y: z.number(),
  label: z.string().optional()
});

export type DataPoint = z.infer<typeof DataPointSchema>;

/**
 * Chart series data
 */
export const SeriesSchema = z.object({
  name: z.string(),
  data: z.array(DataPointSchema),
  color: z.string().optional()
});

export type Series = z.infer<typeof SeriesSchema>;

/**
 * Chart axis configuration
 */
export const AxisConfigSchema = z.object({
  title: z.string().optional(),
  type: z.enum(['category', 'value', 'time']).optional(),
  min: z.number().optional(),
  max: z.number().optional()
});

export type AxisConfig = z.infer<typeof AxisConfigSchema>;

/**
 * Sankey diagram data structures
 */
export const SankeyNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional()
});

export const SankeyLinkSchema = z.object({
  from: z.string(),
  to: z.string(),
  value: z.number()
});

/**
 * Chord diagram data
 */
export const ChordLinkSchema = z.object({
  from: z.string(),
  to: z.string(),
  value: z.number()
});

/**
 * Tree map data
 */
export const TreeMapNodeSchema: z.ZodType<any> = z.object({
  name: z.string(),
  value: z.number().optional(),
  children: z.lazy(() => z.array(TreeMapNodeSchema)).optional(),
  color: z.string().optional()
});

/**
 * Force directed graph data
 */
export const GraphNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number().optional(),
  color: z.string().optional()
});

export const GraphLinkSchema = z.object({
  from: z.string(),
  to: z.string(),
  value: z.number().optional()
});

/**
 * Word cloud data
 */
export const WordCloudWordSchema = z.object({
  text: z.string(),
  value: z.number(),
  color: z.string().optional()
});

/**
 * Venn diagram data
 */
export const VennSetSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string().optional()
});

export const VennIntersectionSchema = z.object({
  sets: z.array(z.string()),
  value: z.number()
});

/**
 * Heatmap data point
 */
export const HeatmapDataPointSchema = z.object({
  x: z.union([z.number(), z.string()]),
  y: z.union([z.number(), z.string()]),
  value: z.number(),
  color: z.string().optional()
});

/**
 * Funnel stage data
 */
export const FunnelStageSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string().optional()
});

/**
 * Gauge range/band
 */
export const GaugeRangeSchema = z.object({
  start: z.number(),
  end: z.number(),
  color: z.string().optional(),
  label: z.string().optional()
});

/**
 * Candlestick/OHLC data point
 */
export const CandlestickDataPointSchema = z.object({
  date: z.union([z.string(), z.number()]), // Date or timestamp
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number().optional()
});

/**
 * Charts data structure using a single flexible schema
 *
 * This approach is simpler and more maintainable than discriminated unions:
 * - All fields are optional, making it LLM-friendly
 * - Runtime validation ensures at least one data field is present
 * - Type narrowing is done in the component using type guards
 * - Easier to add new chart types without modifying the schema structure
 */
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

  // Heatmap (data field can also be used for candlestick and other charts)
  data: z.array(z.any()).optional(),

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

export type ChartsData = z.infer<typeof ChartsDataSchema>;
export type SankeyNode = z.infer<typeof SankeyNodeSchema>;
export type SankeyLink = z.infer<typeof SankeyLinkSchema>;
export type ChordLink = z.infer<typeof ChordLinkSchema>;
export type TreeMapNode = z.infer<typeof TreeMapNodeSchema>;
export type GraphNode = z.infer<typeof GraphNodeSchema>;
export type GraphLink = z.infer<typeof GraphLinkSchema>;
export type WordCloudWord = z.infer<typeof WordCloudWordSchema>;
export type VennSet = z.infer<typeof VennSetSchema>;
export type VennIntersection = z.infer<typeof VennIntersectionSchema>;
export type HeatmapDataPoint = z.infer<typeof HeatmapDataPointSchema>;
export type FunnelStage = z.infer<typeof FunnelStageSchema>;
export type GaugeRange = z.infer<typeof GaugeRangeSchema>;
export type CandlestickDataPoint = z.infer<typeof CandlestickDataPointSchema>;

/**
 * Charts options
 */
export const ChartsOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  animated: z.boolean().optional(),
  showLegend: z.boolean().optional(),
  theme: z.enum(['light', 'dark']).optional()
}).optional();

export type ChartsOptions = z.infer<typeof ChartsOptionsSchema>;

/**
 * Complete Charts props schema
 */
export const ChartsPropsSchema = z.object({
  data: ChartsDataSchema,
  options: ChartsOptionsSchema
});

export type ChartsProps = z.infer<typeof ChartsPropsSchema>;

/**
 * TypeScript utility types for type narrowing based on chart type
 * These can be used in components to get better type inference
 */
export type SeriesChartData = ChartsData & { type?: 'line' | 'bar' | 'area' | 'scatter' | 'radar' | 'histogram'; series: Series[] };
export type PieChartData = ChartsData & { type?: 'pie'; series: Series[] };
export type SankeyChartData = ChartsData & { type?: 'sankey'; sankeyNodes: SankeyNode[]; sankeyLinks: SankeyLink[] };
export type ChordChartData = ChartsData & { type?: 'chord'; chordNodes: string[]; chordLinks: ChordLink[] };
export type TreeMapChartData = ChartsData & { type?: 'treemap'; treeMapData: TreeMapNode[] };
export type ForceDirectedChartData = ChartsData & { type?: 'forceDirected'; graphNodes: GraphNode[]; graphLinks: GraphLink[] };
export type HierarchyChartData = ChartsData & { type?: 'hierarchy'; hierarchyData: TreeMapNode };
export type WordCloudChartData = ChartsData & { type?: 'wordCloud'; words: WordCloudWord[] };
export type VennChartData = ChartsData & { type?: 'venn'; vennSets: VennSet[]; vennIntersections: VennIntersection[] };
export type HeatmapChartData = ChartsData & { type?: 'heatmap'; data: HeatmapDataPoint[] };
export type FunnelChartData = ChartsData & { type?: 'funnel'; stages: FunnelStage[] };
export type GaugeChartData = ChartsData & { type?: 'gauge'; value: number };
export type CandlestickChartData = ChartsData & { type?: 'candlestick'; data: CandlestickDataPoint[] };

/**
 * Type guard functions for narrowing ChartsData types
 * These functions properly narrow the type and avoid TypeScript errors
 */
export function hasSeries(data: ChartsData): data is ChartsData & { series: Series[] } {
  return 'series' in data && data.series !== undefined;
}

export function hasSankeyData(data: ChartsData): data is ChartsData & { sankeyNodes: SankeyNode[]; sankeyLinks: SankeyLink[] } {
  return 'sankeyNodes' in data && 'sankeyLinks' in data && data.sankeyNodes !== undefined && data.sankeyLinks !== undefined;
}

export function hasChordData(data: ChartsData): data is ChartsData & { chordNodes: string[]; chordLinks: ChordLink[] } {
  return 'chordNodes' in data && 'chordLinks' in data && data.chordNodes !== undefined && data.chordLinks !== undefined;
}

export function hasTreeMapData(data: ChartsData): data is ChartsData & { treeMapData: TreeMapNode[] } {
  return 'treeMapData' in data && data.treeMapData !== undefined;
}

export function hasGraphData(data: ChartsData): data is ChartsData & { graphNodes: GraphNode[]; graphLinks: GraphLink[] } {
  return 'graphNodes' in data && 'graphLinks' in data && data.graphNodes !== undefined && data.graphLinks !== undefined;
}

export function hasHierarchyData(data: ChartsData): data is ChartsData & { hierarchyData: TreeMapNode } {
  return 'hierarchyData' in data && data.hierarchyData !== undefined;
}

export function hasWordCloudData(data: ChartsData): data is ChartsData & { words: WordCloudWord[] } {
  return 'words' in data && data.words !== undefined;
}

export function hasVennData(data: ChartsData): data is ChartsData & { vennSets: VennSet[]; vennIntersections: VennIntersection[] } {
  return 'vennSets' in data && 'vennIntersections' in data && data.vennSets !== undefined && data.vennIntersections !== undefined;
}

export function hasHeatmapData(data: ChartsData): data is ChartsData & { data: HeatmapDataPoint[] } {
  return 'data' in data && data.data !== undefined;
}

export function hasFunnelData(data: ChartsData): data is ChartsData & { stages: FunnelStage[] } {
  return 'stages' in data && data.stages !== undefined;
}

export function hasGaugeData(data: ChartsData): data is ChartsData & { value: number } {
  return 'value' in data && data.value !== undefined;
}

export function hasCandlestickData(data: ChartsData): data is ChartsData & { data: CandlestickDataPoint[] } {
  return 'data' in data && data.data !== undefined;
}
