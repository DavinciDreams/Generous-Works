# Geospatial Implementation Summary

## Final Decision: deck.gl + Custom Timeline (React 19 Compatible)

### Why Not kepler.gl?

kepler.gl v3.2.5 is **incompatible with React 19**:
- `react-vis` requires React 15.3-16.x
- `react-redux` requires React 16.8-18.0
- `react-time-picker` requires React 16.8-18.0
- Multiple other peer dependency conflicts

Error: `Cannot find module 'kepler.gl'` when attempting dynamic import.

### Final Architecture

**Hybrid Approach: deck.gl (static) + deck.gl with Timeline (temporal)**

- **Static visualizations** → Current Geospatial component (deck.gl)
  - Heatmaps
  - 3D hexagon bins
  - Arc connections
  - Points, lines, polygons

- **Temporal visualizations** → Geospatial + Timeline component
  - TripsLayer for animated paths (Genghis Khan campaigns)
  - Time-filtered layers (territorial expansion)
  - Custom timeline slider with play/pause (Radix UI)

### Components Created

1. **`components/ui/timeline-control.tsx`** ✅
   - Play/pause button
   - Timeline slider (Radix Slider)
   - Speed controls (0.5x, 1x, 2x, 4x)
   - Progress bar
   - Format time callback

2. **`components/ai-elements/geospatial.tsx`** (updated)
   - Added TripsLayer support
   - Temporal filtering for all layer types
   - Timeline integration
   - Time-based data filtering

### User Stories Satisfied

✅ **"Show me the spread of proto-Indo-European"**
  - TripsLayer with animated paths OR time-filtered polygons
  - Timeline slider shows expansion over centuries

✅ **"Show me population density with raised bars"**
  - HexagonLayer with `extruded: true` and `elevationScale`
  - 3D columns where height = population

✅ **"Show me a heatmap of current COVID cases"**
  - HeatmapLayer with density visualization
  - Timeline can show progression over time

### Bundle Impact

**Before kepler.gl attempt:**
- deck.gl + MapLibre: ~880KB gzipped

**After kepler.gl removal:**
- deck.gl + MapLibre: ~880KB gzipped
- Timeline component: ~5KB (using existing Radix UI)
- **Total: ~885KB** (vs kepler.gl would have been ~920KB+)

### Implementation Status

- [x] Timeline component created
- [x] kepler.gl removed (incompatible)
- [x] TripsLayer added to Geospatial
- [x] Temporal filtering implemented (currentTime state)
- [x] Test pages created (Genghis Khan, Proto-Indo-European, COVID)
- [ ] AI catalog updated
- [ ] Renderer decision logic added (can be done later if needed)

### Timeline Integration (Completed)

**State Management:**
- Added `currentTime` state in InnerMap component
- Initial value derived from `timeline.startTime` (supports both number and ISO date string)
- State updates via TimelineControl's `onTimeChange` callback

**TripsLayer Integration:**
- Updated TripsLayer's `currentTime` prop to use state (line 617)
- Added `currentTime` to `deckLayers` useMemo dependencies for re-rendering
- Trail length configurable via `layer.style.trailLength`

**Timeline Rendering:**
- Conditionally rendered when `data.timeline?.enabled` is true
- Positioned absolutely at bottom of map with 1rem padding
- Supports both numeric timestamps and ISO date strings
- Custom `formatTime` function formats years (1206-3000) as "XXXX CE"

**Test Page:** `/temporal-test`
- Genghis Khan campaigns (1206-1227 CE) with 4 distinct campaign paths
- Proto-Indo-European expansion (4000-1500 BCE) with 3 migration branches
- COVID-19 heatmap (static) for comparison

### Next Steps

1. ✅ ~~Complete temporal integration in Geospatial component~~
2. ✅ ~~Create comprehensive test examples~~
3. Update AI catalog with temporal examples (optional)
4. Add renderer decision logic (temporal vs static) - can be done if needed
5. ✅ ~~Test all user stories~~

### Technical Notes

**Temporal Data Format:**
```typescript
{
  data: {
    layers: [{
      id: 'trips',
      type: 'trips',
      data: [
        {
          path: [
            { lng: -6.0, lat: 36.7, timestamp: 1206 },
            { lng: 116.4, lat: 39.9, timestamp: 1215 },
          ],
          properties: { campaign: 'Eastern Campaign' }
        }
      ],
      temporal: true
    }],
    timeline: {
      enabled: true,
      startTime: 1206,
      endTime: 1227,
      step: 1,
      autoPlay: false,
      speed: 1000
    }
  }
}
```

**TripsLayer Properties:**
- `getPath`: Extract path from data
- `getTimestamps`: Extract timestamps for animation
- `currentTime`: Control animation state
- `trailLength`: How long the trail persists

### Comparison: Final Solution

| Library | Bundle | React 19 | Temporal | Custom UI | Verdict |
|---------|--------|----------|----------|-----------|---------|
| **deck.gl + Timeline** | ~885KB | ✅ Yes | ✅ Custom | ✅ Full | **CHOSEN** |
| kepler.gl | ~920KB | ❌ No (16-18) | ✅ Built-in | ⚠️ Limited | Rejected |
| Plotly.js | ~3.3MB | ✅ Yes | ✅ Frames | ⚠️ Limited | Too large |
| CesiumJS | ~1.6MB | ✅ Yes | ⚠️ Manual | ✅ Full | Overkill |
| @antv/L7 | Unknown | ⚠️ Plugin | ✅ Basic | ⚠️ Limited | Deprecated React |

### Recommendations

**For future enhancements:**
1. Add GeoJSON import/export
2. Add interactive tooltips (Radix Popover)
3. Add data brushing/filtering UI
4. Consider deck.gl's DataFilterExtension for advanced temporal filtering
5. Add export to video (capture frames during timeline playback)

---

**Decision made:** 2026-02-11
**React version:** 19.2.3
**Next.js version:** 16.1.6
**deck.gl version:** 9.2.6
