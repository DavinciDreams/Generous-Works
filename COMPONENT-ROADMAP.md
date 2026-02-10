# Component Integration Roadmap & Analysis

**Last Updated:** February 10, 2026

---

## ✅ Completed Integrations (Status: Production Ready)

### 1. **ToolUI** - AI Assistant Tool Interface
- **Source:** [assistant-ui/tool-ui](https://github.com/assistant-ui/tool-ui)
- **Status:** ✅ Complete (18 components)
- **Components:** X-Post, Instagram Post, LinkedIn Post, Image Gallery, Video, Stats Display, Data Table, Option List, Parameter Slider, Progress Tracker, Question Flow, Approval Card, Message Draft, Order Summary, Link Preview, Weather Widget, Preferences Panel, Item Carousel
- **Architecture:** Direct rendering (rewritten from composable pattern)
- **Notes:** Fully integrated with A2UI system, all schemas defined

### 2. **Charts** - Data Visualization
- **Source:** [amCharts 5](https://github.com/amcharts/amcharts5)
- **Status:** ✅ Complete (13 chart types)
- **Supported Types:**
  - **Basic:** line, bar, pie, scatter, area, radar
  - **Advanced:** sankey, chord, treemap, forceDirected, hierarchy, wordCloud, venn
- **Architecture:** Composable pattern with context
- **Gap Analysis:** Missing some common business chart types (see recommendations below)

### 3. **Geospatial** - Maps & Geographic Visualization
- **Source:** [L7 by AntV](https://github.com/antvis/L7)
- **Status:** ✅ Complete
- **Features:** Markers, heatmaps, polygons, layer controls, fullscreen
- **Architecture:** Composable pattern with imperative handle

### 4. **VRM** - 3D Avatar & Character Viewer
- **Source:** [three-vrm by pixiv](https://github.com/pixiv/three-vrm)
- **Status:** ✅ Complete
- **Features:** VRM model loading, animation controls, camera controls, Three.js integration
- **Architecture:** Composable pattern with imperative handle

### 5. **WYSIWYG** - Rich Text Editor
- **Source:** [Novel by Steven Tey](https://github.com/steven-tey/novel) (Notion-style)
- **Status:** ✅ Complete & Cleaned Up
- **Features:** Markdown, HTML, and JSON support; editable/read-only modes; export functionality
- **Architecture:** Composable pattern
- **Notes:** ✅ **Novel IS a markdown renderer**, so no need for separate tui.editor

### 6. **Additional Components**
- **Timeline** ✅
- **ThreeScene** ✅
- **SVGPreview** ✅
- **NodeEditor** ✅
- **KnowledgeGraph** ✅
- **Latex** ✅
- **ModelViewer** ✅
- **Phaser** ✅
- **Mermaid** ✅
- **Remotion** ✅

**Total Components in A2UI:** 87 components

---

## 📋 Priority Recommendations

### **HIGH PRIORITY: Expand Charts Component**

**Current Gap:** Our amCharts implementation covers 13 chart types but is missing some common business/financial visualizations.

**Recommended Additions:**
1. **Histogram** - Essential for statistical analysis and data distribution
2. **Heatmap** - Critical for correlation matrices and time-series density
3. **Funnel Chart** - Key for conversion analytics and sales pipelines
4. **Gauge/Bullet Chart** - Important for KPI dashboards and progress tracking
5. **Candlestick/OHLC** - Financial chart types for stock/trading data

**Effort Estimate:** Low-Medium (amCharts 5 already supports these, just need schema + rendering logic)

**Business Value:** High - These are frequently requested chart types in analytics applications

**Implementation Notes:**
- Add to `ChartTypeSchema` enum in `lib/schemas/charts.schema.ts`
- Add discriminated union schemas for each new type
- Extend rendering logic in `components/ai-elements/charts.tsx`
- Update catalog with examples

**Sources:**
- [amCharts 5 Charts Documentation](https://www.amcharts.com/docs/v5/charts/)
- [amCharts 5 Features](https://www.componentsource.com/product/amcharts/features)

---

### **HIGH PRIORITY: Add Calendar Component**

**Analysis of 3 Options:**

#### Option 1: **react-calendar** by Wojtek Maj
- **Downloads:** 330,401/week
- **Stars:** 3,616
- **Pros:**
  - Most popular by downloads
  - Simple, lightweight date picker
  - Good for basic calendar needs
- **Cons:**
  - Limited to month view and date selection
  - No event scheduling capabilities
  - Not suitable for complex calendar applications

#### Option 2: **tui-calendar** by NHN (TOAST UI)
- **Downloads:** 5,175/week
- **Stars:** 12,132
- **Pros:**
  - Full-featured event calendar
  - Multiple views (daily, weekly, monthly, 2-week, 3-week, 6-week)
  - Drag-and-drop event creation/editing
  - Milestone and task schedule support
  - Mature library with good documentation
- **Cons:**
  - Built on jQuery (legacy architecture)
  - Heavier bundle size
  - React wrapper feels like an afterthought

#### Option 3: **schedule-x** ⭐ **RECOMMENDED**
- **Downloads:** Growing (modern library)
- **Features:**
  - **Modern architecture:** Pure JavaScript, framework-agnostic
  - **Multiple views:** Day, week, month
  - **Drag-and-drop:** Reschedule and resize events
  - **Recurring events:** Built-in support
  - **Responsive design:** Mobile-friendly
  - **Dark mode:** Built-in theme support
  - **Internationalization:** Multi-language support
  - **Accessibility-focused**
  - **Lightweight:** Fast loading times
  - **Custom components:** Inject React components into calendar UI
  - **Time pickers:** Integrated scheduling tools
- **Use Cases:** Perfect for booking systems, scheduling apps, event management

**Recommendation:** **schedule-x**

**Rationale:**
- Modern, actively maintained (described as "modern alternative to fullcalendar")
- Best balance of features vs. complexity
- Excellent customization through React component injection
- Accessibility and responsive design built-in
- No legacy dependencies (unlike tui-calendar's jQuery)
- More feature-complete than react-calendar
- Clean API and good developer experience

**Sources:**
- [Schedule-X Documentation](https://schedule-x.dev/docs/frameworks/react)
- [Schedule-X GitHub](https://github.com/schedule-x/schedule-x)
- [npm trends comparison](https://npmtrends.com/react-calendar-vs-tui-calendar)

---

## 🤔 Consider With Caution

### **3D HTML (LUME)** - Hold for Now

**Library:** [lume/lume](https://github.com/lume/lume)

**Features:**
- GPU-powered 3D HTML elements
- Combines CSS3D and WebGL rendering
- Custom elements like `<lume-box>`, `<lume-node>`, `<lume-direction-light>`
- Reactive properties and declarative templates
- Framework compatibility (React, Vue, Svelte, etc.)
- Advanced rendering: 3D models, lighting, shadows, reflections

**Concerns:**
- **Component Bloat:** We already have:
  - ThreeScene (Three.js raw)
  - ModelViewer (3D model viewing)
  - VRM (character models)
  - Remotion (animated 3D)
  - Phaser (2D/3D game engine)
- **Overlap:** LUME's use case overlaps significantly with ThreeScene
- **Learning Curve:** Custom element syntax may confuse users choosing between components
- **Selection Difficulty:** Too many 3D options creates decision paralysis

**Recommendation:** ⏸️ **Defer**

**When to Reconsider:**
- If users specifically request HTML-like 3D element syntax
- If we need to deprecate one of the existing 3D components
- If LUME gains significantly more adoption (check in Q3 2026)

**Sources:**
- [LUME GitHub](https://github.com/lume/lume)
- [LUME Documentation](https://docs.lume.io/)

---

## 📊 Analysis: "Possible" Options

### **Worth Exploring:**

#### 1. **JSON Visualizer** - [jsoncrack.com](https://github.com/AykutSarac/jsoncrack.com)
**Recommendation:** ⭐ **High Value**
- **Use Case:** Debug AI responses, visualize complex data structures, API exploration
- **Unique Value:** No existing component covers interactive JSON tree/graph visualization
- **Integration Effort:** Medium
- **Business Case:** Extremely useful for developers debugging AI-generated structured data

#### 2. **React Konva** - [react-konva](https://github.com/konvajs/react-konva)
**Recommendation:** ⭐ **Consider**
- **Use Case:** Canvas-based interactive graphics, diagrams, annotations
- **Overlap:** Some overlap with SVGPreview and ThreeScene
- **Unique Value:** Better for 2D canvas manipulation, layered graphics, image editing
- **When Useful:** If users need programmatic 2D graphics beyond SVG

#### 3. **Grid Component** - [tui-grid](https://ui.toast.com/tui-grid)
**Recommendation:** ⏸️ **Low Priority**
- **Overlap:** ToolUI already has `DataTable` component
- **Consideration:** Evaluate if DataTable is sufficient; tui-grid is more feature-rich (Excel-like)
- **When Useful:** If users need advanced spreadsheet features (formulas, sorting, filtering)

### **Not Recommended (Low ROI):**

#### ❌ **Universal Viewer**
- **Reason:** Too generic; overlaps with ModelViewer, PDF viewers, image galleries
- **Better Alternative:** Extend existing viewers on-demand

#### ❌ **3D Graphs (vis-graph3d)**
- **Reason:** Niche use case; can be done with ThreeScene or Charts
- **Overlap:** Too much overlap with existing 3D and charting components

#### ❌ **Space/Astronomy Viewers (Cosmonium, WebWorldWind)**
- **Reason:** Extremely niche; most users don't need planetary visualization
- **Bundle Impact:** Large dependencies for limited use cases

#### ❌ **OSM2World, GIS Tools (reearth)**
- **Reason:** Geospatial component already covers most map needs
- **Complexity:** These are entire platforms, not components

#### ❌ **WebGL Studio**
- **Reason:** This is a full IDE/editor, not a component
- **Scope:** Too broad for A2UI component system

#### ❌ **GitHub Contribution Visualizer**
- **Reason:** Too specific; better as a custom integration

---

## 🔄 Processing & Data Pipeline Options

These libraries are more about **data processing** than **UI rendering**. Consider for backend/API layer:

### **Worth Backend Integration:**

1. **[Unstructured](https://github.com/Unstructured-IO/unstructured)** ⭐
   - Extract structured data from PDFs, images, docs
   - Perfect for AI data preprocessing
   - **Use Case:** API endpoint that converts documents to A2UI-compatible JSON

2. **[Omniparse](https://github.com/adithya-s-k/omniparse)** ⭐
   - Universal document parser
   - Handles 50+ file formats
   - **Use Case:** File upload → structured A2UI output

### **Lower Priority:**

3. **Google Flow Lens** - XML flow visualization (too niche)
4. **LangExtract** - Language documentation extraction (specific use case)
5. **Closure Templates** - Google's template system (outdated, use modern JSX)
6. **Annotated AST** - Code repository rendering (very specialized)
7. **Jsonnet** - JSON templating (config management, not UI)

---

## 🚀 Recommended Roadmap

### **Phase 1: Fill Critical Gaps (Q1 2026)** 🎯

**Priority 1: Expand Charts** (2-3 days)
- [ ] Add Histogram chart type
- [ ] Add Heatmap chart type
- [ ] Add Funnel chart type
- [ ] Add Gauge/Bullet chart types
- [ ] Add Candlestick/OHLC chart types
- [ ] Update schemas and rendering logic
- [ ] Add catalog examples for each new type
- [ ] Test with A2UI chat integration

**Priority 2: Add Calendar Component** (3-5 days)
- [ ] Install schedule-x dependencies
- [ ] Create schema (`lib/schemas/calendar.schema.ts`)
- [ ] Create component (`components/ai-elements/calendar.tsx`)
- [ ] Implement composable pattern (Calendar, CalendarHeader, CalendarContent, etc.)
- [ ] Add event CRUD operations
- [ ] Add drag-and-drop support
- [ ] Add recurring events support
- [ ] Integrate with A2UI renderer
- [ ] Add to catalog with examples
- [ ] Create test page

**Priority 3: Add JSON Visualizer** (2-3 days)
- [ ] Evaluate jsoncrack vs alternatives
- [ ] Create JSONGraph component
- [ ] Add tree, graph, and table views
- [ ] Support expand/collapse and search
- [ ] Integrate with A2UI
- [ ] Perfect for debugging AI responses

### **Phase 2: Polish & Optimization (Q2 2026)** 🔧

**Code Quality:**
- [ ] Audit all 87 components for consistency
- [ ] Ensure all components follow schema-as-single-source-of-truth
- [ ] Add comprehensive TypeScript types
- [ ] Performance audit (bundle size, render performance)
- [ ] Add error boundaries to all components
- [ ] Improve accessibility across all components

**Documentation:**
- [ ] Create component showcase page with all 87 components
- [ ] Add interactive examples for each component
- [ ] Write integration guides for developers
- [ ] Document A2UI chat → component generation patterns
- [ ] Create video tutorials for complex components

**Testing:**
- [ ] Add unit tests for all schemas
- [ ] Add integration tests for A2UI renderer
- [ ] Visual regression testing for components
- [ ] E2E tests for chat → component workflows

### **Phase 3: Advanced Features (Q2-Q3 2026)** 🚀

**Component Enhancements:**
- [ ] Add theme system (light/dark mode for all components)
- [ ] Add animation presets
- [ ] Component composition API (combine components easily)
- [ ] Real-time collaboration features (cursors, presence)
- [ ] Undo/redo system

**AI Improvements:**
- [ ] Fine-tune component selection prompts
- [ ] Add component recommendation engine
- [ ] Improve A2UI JSON generation quality
- [ ] Add component preview in chat before rendering
- [ ] Multi-step component refinement (iterative generation)

**Developer Experience:**
- [ ] CLI tool for generating new components
- [ ] Component playground (Storybook-like)
- [ ] VS Code extension for A2UI schema autocomplete
- [ ] GitHub Action for component validation

### **Phase 4: Ecosystem Growth (Q3-Q4 2026)** 🌱

**Data Processing Integration:**
- [ ] Add Unstructured API endpoint (PDF/Doc → A2UI)
- [ ] Add Omniparse integration (file upload → components)
- [ ] Add export functionality (A2UI → PDF, PNG, etc.)

**Community:**
- [ ] Open source component library separately
- [ ] Create plugin system for third-party components
- [ ] Component marketplace (community submissions)
- [ ] Monthly component challenges

**Consider (If User Demand):**
- [ ] React Konva integration (canvas graphics)
- [ ] TUI Grid integration (advanced spreadsheet needs)
- [ ] Additional chart types based on analytics

---

## 📈 Current Stats

- **Total Components:** 87
- **Component Categories:** 12
  - AI Tools (18 from ToolUI)
  - Data Visualization (Charts, KnowledgeGraph, Mermaid)
  - 3D/Graphics (ThreeScene, VRM, ModelViewer, Remotion, Phaser)
  - Maps (Geospatial)
  - Editors (WYSIWYG, SVGPreview, NodeEditor)
  - Media (Timeline, Video components)
  - Math/Science (Latex)
- **Architecture Patterns:**
  - Specialized composable (Charts, Geospatial, VRM, WYSIWYG)
  - Direct rendering (ToolUI)
  - Mixed (various)

---

## 🎯 Success Metrics

**Quality:**
- Zero TypeScript errors
- All components have schemas
- 100% catalog coverage (examples for all components)

**Performance:**
- Bundle size < 500KB per component
- Initial render < 100ms
- 60 FPS animations

**Developer Experience:**
- < 5 minutes to add new component type
- Clear documentation for all components
- Easy A2UI integration

**User Experience:**
- AI can generate any component with 1 prompt
- Components render correctly 95%+ of the time
- Intuitive component selection

---

## 🔮 Future Considerations (2027+)

- **AR/VR Components:** WebXR integration for immersive experiences
- **Audio Components:** Waveform editing, music visualization
- **Collaboration:** Real-time multi-user editing
- **AI Agents:** Components that act as autonomous agents
- **Blockchain:** Web3 wallet integration, NFT displays
- **Physics Simulations:** Interactive physics engines

---

## 📝 Notes

- **Component Selection Philosophy:** Quality > Quantity. Only add components that provide unique value.
- **Maintenance:** Review roadmap quarterly, deprecate unused components
- **User Feedback:** Track which components are most requested/used via analytics
- **Bundle Size:** Monitor and optimize; consider lazy loading for heavy components

---

**Next Review Date:** May 1, 2026
