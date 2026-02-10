/**
 * Zod schemas for Charts component
 * Provides runtime type validation for amCharts 5 data visualization props
 *
 * Uses discriminated unions to ensure proper TypeScript type inference
 * and guarantee that each chart type only has the fields it needs.
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
 * Base chart schema with common properties
 */
const BaseChartSchema = z.object({
  title: z.string().optional(),
});

/**
 * Basic chart types that use series data (line, bar, area, scatter)
 */
const BasicChartDataSchema = BaseChartSchema.extend({
  type: z.enum(['line', 'bar', 'area', 'scatter']),
  series: z.array(SeriesSchema),
  xAxis: AxisConfigSchema.optional(),
  yAxis: AxisConfigSchema.optional(),
});

/**
 * Pie chart schema
 */
const PieChartDataSchema = BaseChartSchema.extend({
  type: z.literal('pie'),
  series: z.array(SeriesSchema),
});

/**
 * Radar chart schema
 */
const RadarChartDataSchema = BaseChartSchema.extend({
  type: z.literal('radar'),
  series: z.array(SeriesSchema),
  xAxis: AxisConfigSchema.optional(),
  yAxis: AxisConfigSchema.optional(),
});

/**
 * Sankey diagram schema
 */
const SankeyChartDataSchema = BaseChartSchema.extend({
  type: z.literal('sankey'),
  sankeyNodes: z.array(SankeyNodeSchema),
  sankeyLinks: z.array(SankeyLinkSchema),
});

/**
 * Chord diagram schema
 */
const ChordChartDataSchema = BaseChartSchema.extend({
  type: z.literal('chord'),
  chordNodes: z.array(z.string()),
  chordLinks: z.array(ChordLinkSchema),
});

/**
 * Tree map schema
 */
const TreeMapChartDataSchema = BaseChartSchema.extend({
  type: z.literal('treemap'),
  treeMapData: z.array(TreeMapNodeSchema),
});

/**
 * Force directed graph schema
 */
const ForceDirectedChartDataSchema = BaseChartSchema.extend({
  type: z.literal('forceDirected'),
  graphNodes: z.array(GraphNodeSchema),
  graphLinks: z.array(GraphLinkSchema),
});

/**
 * Hierarchy chart schema
 */
const HierarchyChartDataSchema = BaseChartSchema.extend({
  type: z.literal('hierarchy'),
  hierarchyData: TreeMapNodeSchema,
});

/**
 * Word cloud schema
 */
const WordCloudChartDataSchema = BaseChartSchema.extend({
  type: z.literal('wordCloud'),
  words: z.array(WordCloudWordSchema),
});

/**
 * Venn diagram schema
 */
const VennChartDataSchema = BaseChartSchema.extend({
  type: z.literal('venn'),
  vennSets: z.array(VennSetSchema),
  vennIntersections: z.array(VennIntersectionSchema),
});

/**
 * Histogram data schema
 */
const HistogramChartDataSchema = BaseChartSchema.extend({
  type: z.literal('histogram'),
  series: z.array(SeriesSchema),
  xAxis: AxisConfigSchema.optional(),
  yAxis: AxisConfigSchema.optional(),
  binCount: z.number().optional(), // Number of bins/buckets
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
 * Heatmap schema
 */
const HeatmapChartDataSchema = BaseChartSchema.extend({
  type: z.literal('heatmap'),
  data: z.array(HeatmapDataPointSchema),
  xAxis: AxisConfigSchema.optional(),
  yAxis: AxisConfigSchema.optional(),
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
 * Funnel chart schema
 */
const FunnelChartDataSchema = BaseChartSchema.extend({
  type: z.literal('funnel'),
  stages: z.array(FunnelStageSchema),
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
 * Gauge chart schema
 */
const GaugeChartDataSchema = BaseChartSchema.extend({
  type: z.literal('gauge'),
  value: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
  ranges: z.array(GaugeRangeSchema).optional(),
  target: z.number().optional(), // Target marker
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
 * Candlestick chart schema
 */
const CandlestickChartDataSchema = BaseChartSchema.extend({
  type: z.literal('candlestick'),
  data: z.array(CandlestickDataPointSchema),
  showVolume: z.boolean().optional(),
});

/**
 * Charts data structure using discriminated union
 *
 * This ensures proper TypeScript type inference for all chart types.
 * Each chart type has only the fields it needs, making it impossible
 * to pass incorrect data shapes.
 */
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
]);

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
