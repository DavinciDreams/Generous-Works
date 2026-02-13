# Schema Registry vs A2UI Catalog Comparison

**Date:** 2026-02-13
**Purpose:** Verify that components in the schema registry match the A2UI catalog

## Schema Registry Components

From `lib/schemas/index.ts`, the schemaRegistry contains 22 components:

1. Timeline
2. Maps
3. ThreeScene
4. SVGPreview
5. NodeEditor
6. KnowledgeGraph
7. Latex
8. ModelViewer
9. Phaser
10. Mermaid
11. Remotion
12. Geospatial
13. ToolUI
14. Charts
15. WYSIWYG
16. VRM
17. Calendar
18. JSONViewer
19. CodeEditor
20. Markdown
21. DataTable
22. ImageGallery

## A2UI Catalog Components

From `lib/a2ui/catalog.ts`, the specializedCatalog contains 32 components:

### Specialized Components (from catalog.ts)

1. Timeline
2. Maps
3. ThreeScene
4. SVGPreview
5. NodeEditor
6. KnowledgeGraph
7. Latex
8. ModelViewer
9. Phaser
10. Mermaid
11. Remotion
12. Geospatial
13. ToolUI
14. Charts
15. WYSIWYG
16. VRM
17. Calendar
18. JSONViewer
19. CodeEditor
20. Markdown
21. DataTable
22. ImageGallery
23. ApprovalCard
24. WeatherWidget
25. StatsDisplay
26. ProgressTracker
27. OptionList
28. InstagramPost
29. LinkedInPost
30. XPost
31. LinkPreview
32. Video
33. MessageDraft
34. ItemCarousel
35. OrderSummary
36. ParameterSlider
37. PreferencesPanel
38. QuestionFlow

### Standard UI Components (from catalog-standard-ui.ts)

From `lib/a2ui/catalog-standard-ui.ts`:

1. Row
2. Column
3. Card
4. Text
5. Button
6. Input
7. Select
8. Checkbox
9. Switch
10. Badge
11. Divider
12. Spacer
13. Container

## Discrepancies Found

### Components in A2UI Catalog but NOT in Schema Registry

The following components are defined in the A2UI catalog but do NOT have corresponding schemas in the schema registry:

1. **ApprovalCard** - Defined in catalog but no schema in registry
2. **WeatherWidget** - Defined in catalog but no schema in registry
3. **StatsDisplay** - Defined in catalog but no schema in registry
4. **ProgressTracker** - Defined in catalog but no schema in registry
5. **OptionList** - Defined in catalog but no schema in registry
6. **InstagramPost** - Defined in catalog but no schema in registry
7. **LinkedInPost** - Defined in catalog but no schema in registry
8. **XPost** - Defined in catalog but no schema in registry
9. **LinkPreview** - Defined in catalog but no schema in registry
10. **Video** - Defined in catalog but no schema in registry
11. **MessageDraft** - Defined in catalog but no schema in registry
12. **ItemCarousel** - Defined in catalog but no schema in registry
13. **OrderSummary** - Defined in catalog but no schema in registry
14. **ParameterSlider** - Defined in catalog but no schema in registry
15. **PreferencesPanel** - Defined in catalog but no schema in registry
16. **QuestionFlow** - Defined in catalog but no schema in registry

### Standard UI Components

The standard UI components (Row, Column, Card, Text, Button, Input, Select, Checkbox, Switch, Badge, Divider, Spacer, Container) are in the A2UI catalog but are NOT expected to be in the schema registry because they use the adapter pattern and don't have dedicated schema files.

## Root Cause Analysis

The missing schemas are all **ToolUI component schemas**. These components are:

1. Defined in `components/tool-ui/[component-name]/schema.ts`
2. Exported from `lib/schemas/toolui.schema.ts`
3. Used by the `ToolUI` component (which IS in the schema registry)

The issue is that the schema registry only has the top-level `ToolUI` schema, but the individual ToolUI component schemas (like `ApprovalCard`, `WeatherWidget`, etc.) are not registered separately.

## Impact

This discrepancy means:

1. **Validation**: The `validateProps` function cannot validate individual ToolUI component props directly
2. **Type Safety**: TypeScript types for individual ToolUI components are not exported from the schema registry
3. **Plugin Integration**: The Generous Plugin may not have access to individual ToolUI component schemas

## Recommended Fix

### Option 1: Register Individual ToolUI Component Schemas (Recommended)

Add individual ToolUI component schemas to the schema registry:

```typescript
export const schemaRegistry: Record<string, ZodSchema> = {
  // ... existing components ...

  // ToolUI Components (individual schemas)
  ApprovalCard: SerializableApprovalCardSchema,
  WeatherWidget: SerializableWeatherWidgetSchema,
  StatsDisplay: SerializableStatsDisplaySchema,
  ProgressTracker: SerializableProgressTrackerSchema,
  OptionList: SerializableOptionListSchema,
  InstagramPost: SerializableInstagramPostSchema,
  LinkedInPost: SerializableLinkedInPostSchema,
  XPost: SerializableXPostSchema,
  LinkPreview: SerializableLinkPreviewSchema,
  Video: SerializableVideoSchema,
  MessageDraft: SerializableMessageDraftSchema,
  ItemCarousel: SerializableItemCarouselSchema,
  OrderSummary: SerializableOrderSummarySchema,
  ParameterSlider: SerializableParameterSliderSchema,
  PreferencesPanel: SerializablePreferencesPanelSchema,
  QuestionFlow: SerializableQuestionFlowSchema,
};
```

### Option 2: Keep Current Structure (Minimal Change)

Keep the current structure where:
- Only the top-level `ToolUI` schema is registered
- Individual ToolUI components are validated through the `ToolUI` component's internal logic

This approach is simpler but provides less granular validation.

### Option 3: Hybrid Approach

Register both:
- Top-level `ToolUI` schema for backward compatibility
- Individual ToolUI component schemas for granular validation

## Next Steps

1. Decide which approach to take (Option 1 is recommended for better validation and type safety)
2. Update `lib/schemas/index.ts` to include individual ToolUI component schemas
3. Update `lib/schemas/index.test.ts` to test the new schemas
4. Verify that the plugin can access the new schemas
5. Update documentation if needed
