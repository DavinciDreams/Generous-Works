# Component Integration - Quick Reference

**⚠️ This document has been superseded by [COMPONENT-ROADMAP.md](./COMPONENT-ROADMAP.md)**

For comprehensive analysis, recommendations, and roadmap, see the full roadmap document.

---

## ✅ Completed Integrations

1. ✅ **ai tool ui** - [assistant-ui/tool-ui](https://github.com/assistant-ui/tool-ui)
   - **Status:** Complete (18 components integrated)
   - **Architecture:** Direct rendering pattern

2. ✅ ~~**Markdown renderer**~~ - COVERED BY WYSIWYG
   - Novel (WYSIWYG component) already provides markdown rendering
   - No need for separate tui.editor integration

3. ❓ **workflow graph** - [google/workflow-graph](https://github.com/google/workflow-graph/)
   - **Status:** Not yet evaluated
   - **Note:** May overlap with NodeEditor component

4. ✅ **geospatial** - [antvis/L7](https://github.com/antvis/L7)
   - **Status:** Complete with full feature set

5. ✅ **vrm in three js** - [pixiv/three-vrm](https://github.com/pixiv/three-vrm)
   - **Status:** Complete with animation support

6. 🎯 **calendar** - RECOMMENDED: [schedule-x](https://github.com/schedule-x/schedule-x)
   - **Status:** High priority for Phase 1
   - **Why schedule-x:** Modern, React-native, feature-rich, accessibility-focused
   - **Alternatives considered:** react-calendar (too basic), tui-calendar (jQuery legacy)

7. ✅ **Charts** - [amcharts 5](https://github.com/amcharts/amcharts5)
   - **Status:** Complete (13 chart types)
   - **Current types:** line, bar, pie, scatter, area, radar, sankey, chord, treemap, forceDirected, hierarchy, wordCloud, venn
   - 🔧 **Recommended expansion:** Add histogram, heatmap, funnel, gauge, candlestick (common business charts)

8. ⏸️ **3d html** - [lume/lume](https://github.com/lume/lume)
   - **Status:** DEFER - too much overlap with existing 3D components
   - **Reason:** Already have ThreeScene, ModelViewer, VRM, Remotion, Phaser
   - **Reconsider:** Q3 2026 if user demand emerges

9. ✅ **wysiwyg notion clone** - [steven-tey/novel](https://github.com/steven-tey/novel)
   - **Status:** Complete & cleaned up
   - **Features:** Markdown, HTML, JSON support

10. ⏸️ **grid** - [ui.toast.com/tui-grid](https://ui.toast.com/tui-grid)
    - **Status:** Low priority
    - **Reason:** ToolUI DataTable may be sufficient
    - **Evaluate:** Only if advanced spreadsheet features needed

---

## 🎯 High-Value Additions (Recommended)

### Priority 1: Expand Charts Component
**Effort:** Low-Medium | **Value:** High

Missing common business chart types:
- Histogram (statistical analysis)
- Heatmap (correlation matrices)
- Funnel (conversion analytics)
- Gauge/Bullet (KPI dashboards)
- Candlestick/OHLC (financial data)

### Priority 2: Add Calendar Component
**Effort:** Medium | **Value:** High

Recommendation: **schedule-x**
- Modern architecture (no jQuery)
- Full event management (CRUD)
- Drag-and-drop, recurring events
- Dark mode, responsive, accessible

### Priority 3: JSON Visualizer
**Effort:** Medium | **Value:** High

From "Possible" list → **jsoncrack.com**
- Perfect for debugging AI responses
- Interactive tree/graph visualization
- No existing component covers this use case

---

## 📋 Possible Options - Analysis Summary

### ⭐ Worth Exploring:
- ✅ **json graphs** - [jsoncrack.com](https://github.com/AykutSarac/jsoncrack.com) - HIGH VALUE
- ✅ **react canvas** - [react-konva](https://github.com/konvajs/react-konva) - CONSIDER (unique 2D canvas use cases)

### ❌ Not Recommended (see roadmap for details):
- ❌ universal viewer - Too generic, overlaps existing components
- ❌ 3d graphs - Niche, can use ThreeScene or Charts
- ❌ space viewer (cosmonium) - Too niche
- ❌ open street map to 3d - Geospatial component sufficient
- ❌ nasa geospatial (WebWorldWind) - Too complex, overlaps Geospatial
- ❌ gis (reearth) - Entire platform, not a component
- ❌ webgl studio - Full IDE, not a component
- ❌ github data vis - Too specific

---

## 🔄 Processing/Backend (Not UI Components)

These are better suited for API/backend integration:

### Backend Integration Candidates:
- ✅ **unstructured** - [Unstructured-IO/unstructured](https://github.com/Unstructured-IO/unstructured)
  - API endpoint: Document → A2UI JSON
- ✅ **omniparse** - [adithya-s-k/omniparse](https://github.com/adithya-s-k/omniparse)
  - File upload → structured output

### Lower Priority:
- google flow xml to vis - Too niche
- lang extract doc vis - Specific use case
- html ui templates (closure-templates) - Outdated, use JSX
- repo renderer - Very specialized
- jsonnet - Config management, not UI

---

## 📊 Current Status

**Total Components:** 87
- AI Tools: 18 (ToolUI)
- Data Viz: Charts, KnowledgeGraph, Mermaid
- 3D/Graphics: ThreeScene, VRM, ModelViewer, Remotion, Phaser
- Maps: Geospatial
- Editors: WYSIWYG, SVGPreview, NodeEditor
- Media: Timeline, Video
- Math: Latex
- And more...

---

## 🚀 Next Steps

See [COMPONENT-ROADMAP.md](./COMPONENT-ROADMAP.md) for:
- Detailed calendar comparison and recommendation
- Charts expansion analysis
- Complete "Possible" options evaluation
- 4-phase implementation roadmap (Q1-Q4 2026)
- Success metrics and maintenance plan

---

**Quick Links:**
- 📊 [Full Roadmap](./COMPONENT-ROADMAP.md)
- 📝 [STATE.md](./STATE.md) - Current implementation status
- 🎨 [Showcase](/showcase) - Live component demos

**Last Updated:** February 10, 2026
