"use client";

import {
  Charts,
  ChartsHeader,
  ChartsTitle,
  ChartsActions,
  ChartsExportButton,
  ChartsCopyButton,
  ChartsFullscreenButton,
  ChartsContent,
  type ChartsData,
} from "@/components/ai-elements/charts";

// Histogram example
const histogramData: ChartsData = {
  type: "histogram",
  series: [
    {
      name: "Frequency",
      data: [
        { x: "0-10", y: 5 },
        { x: "10-20", y: 15 },
        { x: "20-30", y: 25 },
        { x: "30-40", y: 35 },
        { x: "40-50", y: 30 },
        { x: "50-60", y: 20 },
        { x: "60-70", y: 10 },
      ],
      color: "#8b5cf6",
    },
  ],
  title: "Age Distribution",
};

// Heatmap example
const heatmapData: ChartsData = {
  type: "heatmap",
  data: [
    { x: "Mon", y: "9am", value: 10 },
    { x: "Mon", y: "12pm", value: 25 },
    { x: "Mon", y: "3pm", value: 15 },
    { x: "Mon", y: "6pm", value: 8 },
    { x: "Tue", y: "9am", value: 20 },
    { x: "Tue", y: "12pm", value: 30 },
    { x: "Tue", y: "3pm", value: 18 },
    { x: "Tue", y: "6pm", value: 12 },
    { x: "Wed", y: "9am", value: 15 },
    { x: "Wed", y: "12pm", value: 28 },
    { x: "Wed", y: "3pm", value: 22 },
    { x: "Wed", y: "6pm", value: 10 },
    { x: "Thu", y: "9am", value: 18 },
    { x: "Thu", y: "12pm", value: 32 },
    { x: "Thu", y: "3pm", value: 20 },
    { x: "Thu", y: "6pm", value: 14 },
    { x: "Fri", y: "9am", value: 22 },
    { x: "Fri", y: "12pm", value: 35 },
    { x: "Fri", y: "3pm", value: 25 },
    { x: "Fri", y: "6pm", value: 16 },
  ],
  title: "Activity Heatmap",
};

// Funnel example
const funnelData: ChartsData = {
  type: "funnel",
  stages: [
    { name: "Website Visits", value: 10000 },
    { name: "Product Views", value: 5000 },
    { name: "Add to Cart", value: 2000 },
    { name: "Checkout Started", value: 800 },
    { name: "Purchase Completed", value: 500 },
  ],
  title: "Sales Funnel",
};

// Gauge example
const gaugeData: ChartsData = {
  type: "gauge",
  value: 75,
  min: 0,
  max: 100,
  ranges: [
    { start: 0, end: 33, color: "#ef4444", label: "Low" },
    { start: 33, end: 66, color: "#f59e0b", label: "Medium" },
    { start: 66, end: 100, color: "#10b981", label: "High" },
  ],
  target: 80,
  title: "Customer Satisfaction Score",
};

// Candlestick example
const candlestickData: ChartsData = {
  type: "candlestick",
  data: [
    { date: "2026-01-01", open: 100, high: 110, low: 95, close: 105, volume: 1000000 },
    { date: "2026-01-02", open: 105, high: 115, low: 103, close: 112, volume: 1200000 },
    { date: "2026-01-03", open: 112, high: 118, low: 108, close: 110, volume: 950000 },
    { date: "2026-01-04", open: 110, high: 112, low: 102, close: 108, volume: 1100000 },
    { date: "2026-01-05", open: 108, high: 120, low: 107, close: 118, volume: 1500000 },
    { date: "2026-01-08", open: 118, high: 125, low: 115, close: 122, volume: 1400000 },
    { date: "2026-01-09", open: 122, high: 128, low: 120, close: 124, volume: 1300000 },
    { date: "2026-01-10", open: 124, high: 130, low: 122, close: 128, volume: 1600000 },
  ],
  showVolume: true,
  title: "Stock Price (AAPL)",
};

export default function ChartsNewTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">New Chart Types Test</h1>
        <p className="text-muted-foreground mt-2">
          Testing the 5 new business analytics chart types: Histogram, Heatmap, Funnel, Gauge, and Candlestick
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Histogram */}
        <Charts data={histogramData} options={{ height: 400 }}>
          <ChartsHeader>
            <ChartsTitle>Histogram</ChartsTitle>
            <ChartsActions>
              <ChartsExportButton />
              <ChartsCopyButton />
              <ChartsFullscreenButton />
            </ChartsActions>
          </ChartsHeader>
          <ChartsContent />
        </Charts>

        {/* Heatmap */}
        <Charts data={heatmapData} options={{ height: 400 }}>
          <ChartsHeader>
            <ChartsTitle>Heatmap</ChartsTitle>
            <ChartsActions>
              <ChartsExportButton />
              <ChartsCopyButton />
              <ChartsFullscreenButton />
            </ChartsActions>
          </ChartsHeader>
          <ChartsContent />
        </Charts>

        {/* Funnel */}
        <Charts data={funnelData} options={{ height: 400 }}>
          <ChartsHeader>
            <ChartsTitle>Funnel Chart</ChartsTitle>
            <ChartsActions>
              <ChartsExportButton />
              <ChartsCopyButton />
              <ChartsFullscreenButton />
            </ChartsActions>
          </ChartsHeader>
          <ChartsContent />
        </Charts>

        {/* Gauge */}
        <Charts data={gaugeData} options={{ height: 400 }}>
          <ChartsHeader>
            <ChartsTitle>Gauge</ChartsTitle>
            <ChartsActions>
              <ChartsExportButton />
              <ChartsCopyButton />
              <ChartsFullscreenButton />
            </ChartsActions>
          </ChartsHeader>
          <ChartsContent />
        </Charts>
      </div>

      {/* Candlestick - Full Width */}
      <Charts data={candlestickData} options={{ height: 500 }}>
        <ChartsHeader>
          <ChartsTitle>Candlestick with Volume</ChartsTitle>
          <ChartsActions>
            <ChartsExportButton />
            <ChartsCopyButton />
            <ChartsFullscreenButton />
          </ChartsActions>
        </ChartsHeader>
        <ChartsContent />
      </Charts>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">New Chart Types:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Histogram:</strong> Statistical distribution analysis (age, scores, frequency)</li>
          <li><strong>Heatmap:</strong> Correlation matrices, activity patterns, time-series density</li>
          <li><strong>Funnel:</strong> Conversion analytics, sales pipelines, step-by-step processes</li>
          <li><strong>Gauge:</strong> KPI dashboards, progress tracking, performance metrics</li>
          <li><strong>Candlestick:</strong> Financial data, stock prices, OHLC with volume</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          Total chart types now: <strong>18</strong> (13 original + 5 new business analytics types)
        </p>
      </div>
    </div>
  );
}
