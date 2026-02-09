# Project State Log - v0-clone AI Elements Library

**Last Updated:** 2026-02-09
**Status:** 🟢 Active Development - AI Elements Library Expansion

---

## Current Session Summary (2026-02-09)

### ✅ Completed - 3 AI Elements Successfully Built

**Session Focus:** Built complete Maps, Timeline, and ThreeScene components from scratch

**Commits:**
- `945f222` - Maps component with Leaflet (replaced MapLibre)
- `32e9cd8` - Timeline rendering and image sync fixes
- `ca4217f` - ThreeScene rendering fixes and optimization
- `2bcab42` - Documentation on avoiding infinite loops

**Key Challenges Resolved:**
1. **Maps**: Switched from MapLibre GL (tiles not loading) to Leaflet (working perfectly)
2. **Timeline**: Fixed infinite re-rendering loop, fixed image/event sync issues, added rich Wikipedia test data
3. **ThreeScene**: Fixed infinite re-rendering loop, fixed Three.js multiple instance warning

**All Components:**
- ✅ Stable rendering (no infinite loops)
- ✅ Proper useEffect dependency optimization
- ✅ Working test pages with rich data
- ✅ Follow composable API pattern
- ✅ Client-side rendering with SSR safety

---

## AI Elements Library

### 1. Timeline (TimelineJS3)
**Files:**
- `components/ai-elements/timeline.tsx` (429 lines)
- `components/ai-elements/timeline-client.tsx` (19 lines)
- `app/timeline-test/page.tsx` (test page)
- `types/knight-lab-timelinejs.d.ts` (type definitions)

**Package:** `@knight-lab/timelinejs@3.9.8`

**Status:** ✅ Working
- Client-only rendering (no SSR issues)
- Hydration mismatch fixed
- Test page: http://localhost:3002/timeline-test

**API:**
```tsx
<Timeline data={timelineData}>
  <TimelineHeader>
    <TimelineTitle />
    <TimelineActions>
      <TimelineCopyButton />
      <TimelineFullscreenButton />
    </TimelineActions>
  </TimelineHeader>
  <TimelineContent />
</Timeline>
```

**Commit:** `1b87d76` - feat: integrate official TimelineJS3 library

---

### 2. Maps (Leaflet)
**Files:**
- `components/ai-elements/maps.tsx` (464 lines)
- `components/ai-elements/maps-client.tsx` (client exports)
- `app/maps-test/page.tsx` (test page)

**Packages:**
- `leaflet@latest`
- `react-leaflet@latest`
- `@types/leaflet@latest`

**Status:** ✅ Working Perfectly
- Switched from MapLibre GL to Leaflet for reliability
- Uses OpenStreetMap tiles (no API key required)
- Infinite loop fixed (dependency array optimization)
- Test page: http://localhost:3002/maps-test

**Features:**
- 2D interactive maps with OpenStreetMap
- Custom colored markers with popups
- Navigation controls (zoom, pan)
- Fullscreen mode
- Composable API pattern

**API:**
```tsx
<Maps data={mapData} options={{ enable3D: true }}>
  <MapsHeader>
    <MapsTitle />
    <MapsActions>
      <MapsCopyButton />
      <MapsFullscreenButton />
    </MapsActions>
  </MapsHeader>
  <MapsContent />
</Maps>
```

**3D Objects:**
```tsx
{
  objects3D: [{
    coordinates: { longitude, latitude },
    object: threeMesh,
    scale: 1,
    rotation: { x, y, z }
  }]
}
```

---

### 3. ThreeScene (Pure Three.js)
**Files:**
- `components/ai-elements/threescene.tsx` (900+ lines)
- `components/ai-elements/threescene-client.tsx`
- `app/threescene-test/page.tsx`

**Package:** `three@0.182.0`

**Status:** ✅ Working Perfectly
- Infinite loop fixed (dependency array optimization)
- Multiple Three.js instances warning resolved
- OrbitControls for interaction (drag to rotate, scroll to zoom)
- Test page with 4 objects: cube, torus, sphere, icosahedron
- Test page: http://localhost:3002/threescene-test

**Features:**
- Pure 3D scene viewer
- Multiple object support
- Interactive controls (rotate, pan, zoom)
- Auto-resize handling
- Animation loop

**API:**
```tsx
<ThreeScene data={sceneData} options={{ enableControls: true }}>
  <ThreeSceneHeader>
    <ThreeSceneTitle />
    <ThreeSceneActions>
      <ThreeSceneResetButton />
      <ThreeSceneCopyButton />
      <ThreeSceneFullscreenButton />
    </ThreeSceneActions>
  </ThreeSceneHeader>
  <ThreeSceneContent />
</ThreeScene>
```

**Test Page:** http://localhost:3002/threescene-test
- Green cube
- Orange torus
- Cyan sphere
- Yellow wireframe icosahedron

---

## Package Dependencies

**Timeline:**
- `@knight-lab/timelinejs@3.9.8`

**Maps:**
- `leaflet@latest`
- `react-leaflet@latest`
- `@types/leaflet@latest`

**ThreeScene:**
- `three@0.182.0`
- `@types/three@latest`

**Removed (replaced MapLibre with Leaflet):**
- ~~maplibre-gl~~
- ~~react-map-gl~~
- ~~@dvt3d/maplibre-three-plugin~~

---

## Known Issues

### ✅ All Critical Issues Resolved

**Previous Issues (Now Fixed):**
1. ~~Maps not rendering tiles~~ → Switched to Leaflet
2. ~~Timeline infinite re-rendering~~ → Fixed dependency array
3. ~~Timeline images out of sync~~ → Added unique_id and thumbnails
4. ~~ThreeScene infinite re-rendering~~ → Fixed dependency array
5. ~~Multiple Three.js instances warning~~ → Fixed import method

**Current Status:** All 3 components working perfectly with no known issues.

---

## Technical Decisions

### Timeline Component
**Decision:** Use official TimelineJS3 instead of custom implementation
**Rationale:**
- Maintained library with 3.9.8 recent release
- Rich feature set (eras, media, date formatting)
- Less code to maintain (700+ lines → 429 lines)

**Trade-offs:**
- External dependency
- Need type definitions (created custom)
- SSR complications (solved with client-only rendering)

---

### Maps Component
**Decision:** MapLibre GL instead of Leaflet or Google Maps
**Rationale:**
- Free and open source (no API key required)
- Vector tiles (modern, performant)
- Three.js integration available
- Good React ecosystem

**Trade-offs:**
- Less mature than Leaflet
- Fewer plugins than Leaflet
- Tile server dependency (need free provider)

---

### Three.js Integration
**Decision:** Support both map-based 3D and pure 3D scenes
**Rationale:**
- Maps with 3D objects = geographic visualization
- Pure ThreeScene = 3D model viewer, product viz, etc.
- Reuse Three.js across both components

---

## Architecture Patterns

All AI Elements follow the same composable pattern:

```tsx
<Component data={data} options={options}>
  <ComponentHeader>
    <ComponentTitle />
    <ComponentActions>
      <ComponentCopyButton />
      <ComponentFullscreenButton />
    </ComponentActions>
  </ComponentHeader>
  <ComponentContent />
</Component>
```

**Benefits:**
- Consistent API across all elements
- Flexible composition
- Easy to add custom headers/actions
- Similar to Vercel AI SDK UI components

---

## ⚠️ Critical: Avoiding Infinite Loops in useEffect

When creating AI elements with initialization logic in `useEffect`, be extremely careful with dependency arrays to prevent infinite re-rendering loops.

### The Problem

Objects, refs, and functions in dependency arrays are recreated on every render, causing the effect to run repeatedly:

```tsx
// ❌ BAD - Causes infinite loop
useEffect(() => {
  // Initialize component
}, [data, options, someRef, setError, instanceRef]);
// data and options are objects that change every render
// Effect runs → cleanup → re-render → effect runs again → LOOP!
```

### The Solution

Only include **stable primitive values** in the dependency array:

```tsx
// ✅ GOOD - Stable dependencies only
useEffect(() => {
  // Initialize component
  // data and options are captured in closure but don't trigger re-runs
}, [isMounted, componentId]);
// eslint-disable-next-line react-hooks/exhaustive-deps
```

### Best Practices

1. **Use stable primitives**: `isMounted` (boolean), component IDs (strings), `isInitialized` (boolean)
2. **Capture, don't depend**: Let `data`, `options`, `refs` be captured in the effect closure
3. **Add eslint-disable**: Acknowledge intentional dependency omission
4. **Test thoroughly**: Watch console for repeated initialization logs

### Real Examples from This Project

**Timeline Component (`timeline.tsx`):**
```tsx
// Only depends on isMounted and timelineId (both stable)
useEffect(() => {
  if (!containerRef.current || isInitialized) return;
  // ... initialization using data and options from closure
}, [isMounted, timelineId]);
// eslint-disable-next-line react-hooks/exhaustive-deps
```

**Maps Component (`maps.tsx`):**
```tsx
// Only depends on isMounted and mapContainerId (both stable)
useEffect(() => {
  if (!containerRef.current || isInitialized) return;
  // ... initialization using data and options from closure
}, [isMounted, mapContainerId]);
// eslint-disable-next-line react-hooks/exhaustive-deps
```

**ThreeScene Component (`threescene.tsx`):**
```tsx
// Only depends on isMounted and sceneContainerId (both stable)
useEffect(() => {
  if (!containerRef.current || isInitialized) return;
  // ... initialization using data and options from closure
}, [isMounted, sceneContainerId]);
// eslint-disable-next-line react-hooks/exhaustive-deps
```

### Warning Signs

- Console logs repeating rapidly
- "Too many active WebGL contexts" warnings
- Page flickering/flashing
- Browser becoming unresponsive

---

## File Structure

```
components/ai-elements/
├── timeline.tsx              # TimelineJS3 integration
├── timeline-client.tsx       # Client exports
├── maps.tsx                  # MapLibre GL + Three.js
├── maps-client.tsx          # Client exports
├── threescene.tsx           # Pure Three.js viewer
├── threescene-client.tsx    # Client exports
├── ... (other elements)

app/
├── timeline-test/
│   └── page.tsx             # Timeline test page
├── maps-test/
│   └── page.tsx             # Maps test page (⚠️ not rendering)
└── threescene-test/
    └── page.tsx             # ThreeScene test page

types/
└── knight-lab-timelinejs.d.ts  # Custom type definitions
```

---

## Development Environment

**Dev Server:** http://localhost:3002
**Port:** 3002 (3000 in use by another process)

**Test Pages:**
- Timeline: http://localhost:3002/timeline-test ✅ Working
- Maps: http://localhost:3002/maps-test ✅ Working
- ThreeScene: http://localhost:3002/threescene-test ✅ Working

---

## Git Status

**Branch:** `components`
**Latest Commits:**
- `2bcab42` - docs: add guidance on avoiding infinite loops in useEffect
- `ca4217f` - fix: resolve ThreeScene rendering issues and optimize performance
- `32e9cd8` - fix: resolve Timeline rendering and image sync issues
- `945f222` - feat: add Maps AI element with Leaflet

**Status:** ✅ All changes committed and pushed

**Clean Working Directory:** No uncommitted changes

---

## Next Steps

### ✅ Session Complete - Ready for Next Components

All planned components for this session are complete and working:
- Timeline ✅
- Maps ✅
- ThreeScene ✅

Documentation updated with best practices for avoiding infinite loops.

**Ready to build more components!**

---

## Memory Compression Notes

**Last Context:** 140k+ tokens used
**Session Focus:** AI Elements library expansion
**Components Worked On:** Timeline → Maps → ThreeScene

**Key Points for Next Session:**
1. Maps has re-rendering bug fixed but tiles not loading
2. Need to try alternative tile provider for Maps
3. ThreeScene created but not yet tested
4. All components follow same composable API pattern
5. Dev server on port 3002

---

## Resources

- **MapLibre GL:** https://maplibre.org/
- **TimelineJS3:** https://timeline.knightlab.com/
- **Three.js:** https://threejs.org/
- **maplibre-three-plugin:** https://github.com/dvt3d/maplibre-three-plugin
- **OrbitControls:** https://threejs.org/docs/#examples/en/controls/OrbitControls
