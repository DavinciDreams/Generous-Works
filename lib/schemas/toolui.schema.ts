/**
 * ToolUI Component Schema
 *
 * This module imports and re-exports schemas from individual ToolUI components.
 * Component schemas are defined in their respective directories at:
 * components/tool-ui/[component-name]/schema.ts
 *
 * This serves as a central export point for all ToolUI schemas while maintaining
 * the component-defined schemas as the single source of truth.
 *
 * Uses a simplified approach with a single flexible schema instead of
 * discriminated unions. This is more maintainable and LLM-friendly.
 */

import { z } from "zod";

// ============================================================================
// SOCIAL POST COMPONENTS
// ============================================================================

// X (Twitter) Post
export {
  SerializableXPostSchema,
  XPostAuthorSchema,
  XPostMediaSchema,
  XPostLinkPreviewSchema,
  XPostStatsSchema,
  parseSerializableXPost,
  type XPostData,
  type XPostAuthor,
  type XPostMedia,
  type XPostLinkPreview,
  type XPostStats,
} from "@/components/tool-ui/x-post/schema";

// Instagram Post
export {
  SerializableInstagramPostSchema,
  InstagramPostAuthorSchema,
  InstagramPostMediaSchema,
  InstagramPostStatsSchema,
  parseSerializableInstagramPost,
  type InstagramPostData,
  type InstagramPostAuthor,
  type InstagramPostMedia,
  type InstagramPostStats,
} from "@/components/tool-ui/instagram-post/schema";

// LinkedIn Post
export {
  SerializableLinkedInPostSchema,
  LinkedInPostAuthorSchema,
  LinkedInPostMediaSchema,
  LinkedInPostLinkPreviewSchema,
  LinkedInPostStatsSchema,
  parseSerializableLinkedInPost,
  type LinkedInPostData,
  type LinkedInPostAuthor,
  type LinkedInPostMedia,
  type LinkedInPostLinkPreview,
  type LinkedInPostStats,
} from "@/components/tool-ui/linkedin-post/schema";

// ============================================================================
// MEDIA COMPONENTS
// ============================================================================

// Image Gallery
export {
  SerializableImageGallerySchema,
  ImageGalleryItemSchema,
  ImageGallerySourceSchema,
  parseSerializableImageGallery,
  type SerializableImageGallery,
  type ImageGalleryItem,
  type ImageGallerySource,
} from "@/components/tool-ui/image-gallery/schema";

// Video
export {
  SerializableVideoSchema,
  SourceSchema,
  parseSerializableVideo,
  type SerializableVideo,
  type Source,
} from "@/components/tool-ui/video/schema";

// ============================================================================
// DATA VISUALIZATION COMPONENTS
// ============================================================================

// Stats Display
export {
  SerializableStatsDisplaySchema,
  StatItemSchema,
  StatFormatSchema,
  StatDiffSchema,
  StatSparklineSchema,
  parseSerializableStatsDisplay,
  type SerializableStatsDisplay,
  type StatItem,
  type StatFormat,
  type StatDiff,
  type StatSparkline,
} from "@/components/tool-ui/stats-display/schema";

// Data Table
export {
  SerializableDataTableSchema,
  serializableColumnSchema,
  serializableDataSchema,
  parseSerializableDataTable,
  type SerializableDataTable,
} from "@/components/tool-ui/data-table/schema";

// ============================================================================
// UI COMPONENTS
// ============================================================================

// Option List
export {
  SerializableOptionListSchema,
  OptionListOptionSchema,
  parseSerializableOptionList,
  type SerializableOptionList,
  type OptionListOption,
  type OptionListSelection,
} from "@/components/tool-ui/option-list/schema";

// Parameter Slider
export {
  SerializableParameterSliderSchema,
  SliderConfigSchema,
  parseSerializableParameterSlider,
  type SerializableParameterSlider,
  type SliderConfig,
  type SliderValue,
} from "@/components/tool-ui/parameter-slider/schema";

// ============================================================================
// WORKFLOW COMPONENTS
// ============================================================================

// Progress Tracker
export {
  SerializableProgressTrackerSchema,
  ProgressStepSchema,
  parseSerializableProgressTracker,
  type SerializableProgressTracker,
  type ProgressStep,
  type ProgressTrackerChoice,
} from "@/components/tool-ui/progress-tracker/schema";

// Question Flow
export {
  SerializableQuestionFlowSchema,
  SerializableProgressiveModeSchema,
  SerializableUpfrontModeSchema,
  SerializableReceiptModeSchema,
  QuestionFlowOptionSchema,
  QuestionFlowStepDefinitionSchema,
  QuestionFlowSummaryItemSchema,
  QuestionFlowChoiceSchema,
  parseSerializableQuestionFlow,
  type SerializableQuestionFlow,
  type SerializableProgressiveMode,
  type SerializableUpfrontMode,
  type SerializableReceiptMode,
  type QuestionFlowOption,
  type QuestionFlowStepDefinition,
  type QuestionFlowSummaryItem,
  type QuestionFlowChoice,
} from "@/components/tool-ui/question-flow/schema";

// Approval Card
export {
  SerializableApprovalCardSchema,
  MetadataItemSchema,
  ApprovalDecisionSchema,
  parseSerializableApprovalCard,
  type SerializableApprovalCard,
  type MetadataItem,
  type ApprovalDecision,
} from "@/components/tool-ui/approval-card/schema";

// Message Draft
export {
  SerializableMessageDraftSchema,
  SerializableEmailDraftSchema,
  SerializableSlackDraftSchema,
  MessageDraftChannelSchema,
  MessageDraftOutcomeSchema,
  parseSerializableMessageDraft,
  type SerializableMessageDraft,
  type SerializableEmailDraft,
  type SerializableSlackDraft,
  type MessageDraftChannel,
  type MessageDraftOutcome,
  type SlackTarget,
} from "@/components/tool-ui/message-draft/schema";

// ============================================================================
// SPECIALIZED COMPONENTS
// ============================================================================

// Order Summary
export {
  SerializableOrderSummarySchema,
  OrderItemSchema,
  PricingSchema,
  OrderDecisionSchema,
  parseSerializableOrderSummary,
  type SerializableOrderSummary,
  type OrderItem,
  type Pricing,
  type OrderDecision,
} from "@/components/tool-ui/order-summary/schema";

// Link Preview
export {
  SerializableLinkPreviewSchema,
  parseSerializableLinkPreview,
  type SerializableLinkPreview,
} from "@/components/tool-ui/link-preview/schema";

// Weather Widget
export {
  SerializableWeatherWidgetSchema,
  WeatherConditionSchema,
  CurrentWeatherSchema,
  ExtendedCurrentWeatherSchema,
  ForecastDaySchema,
  TemperatureUnitSchema,
  PrecipitationLevelSchema,
  EffectQualitySchema,
  EffectSettingsSchema,
  parseSerializableWeatherWidget,
  type SerializableWeatherWidget,
  type WeatherCondition,
  type CurrentWeather,
  type ExtendedCurrentWeather,
  type ForecastDay,
  type TemperatureUnit,
  type PrecipitationLevel,
  type EffectQuality,
  type EffectSettings,
} from "@/components/tool-ui/weather-widget/schema";

// Preferences Panel
export {
  SerializablePreferencesPanelSchema,
  SerializablePreferencesPanelReceiptSchema,
  parseSerializablePreferencesPanel,
  parseSerializablePreferencesPanelReceipt,
  type SerializablePreferencesPanel,
  type SerializablePreferencesPanelReceipt,
  type PreferencesValue,
} from "@/components/tool-ui/preferences-panel/schema";

// Item Carousel
export {
  SerializableItemCarouselSchema,
  SerializableItemSchema,
  ItemSchema,
  parseSerializableItemCarousel,
  type SerializableItemCarousel,
  type SerializableItem,
  type Item,
} from "@/components/tool-ui/item-carousel/schema";

// ============================================================================
// IMPORTS FOR FLEXIBLE SCHEMA
// ============================================================================

import { SerializableXPostSchema } from "@/components/tool-ui/x-post/schema";
import { SerializableInstagramPostSchema } from "@/components/tool-ui/instagram-post/schema";
import { SerializableLinkedInPostSchema } from "@/components/tool-ui/linkedin-post/schema";
import { SerializableImageGallerySchema } from "@/components/tool-ui/image-gallery/schema";
import { SerializableVideoSchema } from "@/components/tool-ui/video/schema";
import { SerializableStatsDisplaySchema } from "@/components/tool-ui/stats-display/schema";
import { SerializableDataTableSchema } from "@/components/tool-ui/data-table/schema";
import { SerializableOptionListSchema } from "@/components/tool-ui/option-list/schema";
import { SerializableParameterSliderSchema } from "@/components/tool-ui/parameter-slider/schema";
import { SerializableProgressTrackerSchema } from "@/components/tool-ui/progress-tracker/schema";
import { SerializableQuestionFlowSchema } from "@/components/tool-ui/question-flow/schema";
import { SerializableApprovalCardSchema } from "@/components/tool-ui/approval-card/schema";
import { SerializableMessageDraftSchema } from "@/components/tool-ui/message-draft/schema";
import { SerializableOrderSummarySchema } from "@/components/tool-ui/order-summary/schema";
import { SerializableLinkPreviewSchema } from "@/components/tool-ui/link-preview/schema";
import { SerializableWeatherWidgetSchema } from "@/components/tool-ui/weather-widget/schema";
import { SerializablePreferencesPanelSchema } from "@/components/tool-ui/preferences-panel/schema";
import { SerializableItemCarouselSchema } from "@/components/tool-ui/item-carousel/schema";

// ============================================================================
// FLEXIBLE SCHEMA FOR ALL COMPONENT TYPES
// ============================================================================

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

export type ToolUIComponentType = z.infer<typeof ToolUIComponentTypeSchema>;

/**
 * Flexible schema for all ToolUI components.
 *
 * This approach is simpler and more maintainable than discriminated unions:
 * - Uses a single schema with a type field and a generic data field
 * - The data field accepts any value and is validated at the component level
 * - More LLM-friendly as it doesn't require exact schema matching
 * - Easier to add new component types without modifying the schema structure
 *
 * Component-specific validation is done by passing the data to the appropriate
 * component's schema when rendering.
 */
export const ToolUIDataSchema = z.object({
  type: ToolUIComponentTypeSchema.optional(),
  data: z.any().optional(), // Flexible data field, validated at component level
}).passthrough(); // Allow additional fields for LLM flexibility

// Options schema
export const ToolUIOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
}).passthrough().optional();

// Props schema
export const ToolUIPropsSchema = z.object({
  data: ToolUIDataSchema,
  options: ToolUIOptionsSchema,
});

// ============================================================================
// TYPESCRIPT TYPES
// ============================================================================

export type ToolUIData = z.infer<typeof ToolUIDataSchema>;
export type ToolUIOptions = z.infer<typeof ToolUIOptionsSchema>;
export type ToolUIProps = z.infer<typeof ToolUIPropsSchema>;

/**
 * TypeScript utility types for type narrowing based on component type
 * These can be used in components to get better type inference
 */
export type XPostDataWithMeta = ToolUIData & { type?: "x-post"; data?: z.infer<typeof SerializableXPostSchema> };
export type InstagramPostDataWithMeta = ToolUIData & { type?: "instagram-post"; data?: z.infer<typeof SerializableInstagramPostSchema> };
export type LinkedInPostDataWithMeta = ToolUIData & { type?: "linkedin-post"; data?: z.infer<typeof SerializableLinkedInPostSchema> };
export type ImageGalleryDataWithMeta = ToolUIData & { type?: "image-gallery"; data?: z.infer<typeof SerializableImageGallerySchema> };
export type VideoDataWithMeta = ToolUIData & { type?: "video"; data?: z.infer<typeof SerializableVideoSchema> };
export type StatsDisplayDataWithMeta = ToolUIData & { type?: "stats-display"; data?: z.infer<typeof SerializableStatsDisplaySchema> };
export type DataTableDataWithMeta = ToolUIData & { type?: "data-table"; data?: z.infer<typeof SerializableDataTableSchema> };
export type OptionListDataWithMeta = ToolUIData & { type?: "option-list"; data?: z.infer<typeof SerializableOptionListSchema> };
export type ParameterSliderDataWithMeta = ToolUIData & { type?: "parameter-slider"; data?: z.infer<typeof SerializableParameterSliderSchema> };
export type ProgressTrackerDataWithMeta = ToolUIData & { type?: "progress-tracker"; data?: z.infer<typeof SerializableProgressTrackerSchema> };
export type QuestionFlowDataWithMeta = ToolUIData & { type?: "question-flow"; data?: z.infer<typeof SerializableQuestionFlowSchema> };
export type ApprovalCardDataWithMeta = ToolUIData & { type?: "approval-card"; data?: z.infer<typeof SerializableApprovalCardSchema> };
export type MessageDraftDataWithMeta = ToolUIData & { type?: "message-draft"; data?: z.infer<typeof SerializableMessageDraftSchema> };
export type OrderSummaryDataWithMeta = ToolUIData & { type?: "order-summary"; data?: z.infer<typeof SerializableOrderSummarySchema> };
export type LinkPreviewDataWithMeta = ToolUIData & { type?: "link-preview"; data?: z.infer<typeof SerializableLinkPreviewSchema> };
export type WeatherWidgetDataWithMeta = ToolUIData & { type?: "weather-widget"; data?: z.infer<typeof SerializableWeatherWidgetSchema> };
export type PreferencesPanelDataWithMeta = ToolUIData & { type?: "preferences-panel"; data?: z.infer<typeof SerializablePreferencesPanelSchema> };
export type ItemCarouselDataWithMeta = ToolUIData & { type?: "item-carousel"; data?: z.infer<typeof SerializableItemCarouselSchema> };
