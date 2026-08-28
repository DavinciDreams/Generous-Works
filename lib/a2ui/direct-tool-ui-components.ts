import type { ComponentType } from 'react';

import { ApprovalCard } from '@/components/tool-ui/approval-card';
import { WeatherWidget } from '@/components/tool-ui/weather-widget';
import { StatsDisplay } from '@/components/tool-ui/stats-display';
import { ProgressTracker } from '@/components/tool-ui/progress-tracker';
import { OptionList } from '@/components/tool-ui/option-list';
import { InstagramPost } from '@/components/tool-ui/instagram-post';
import { LinkedInPost } from '@/components/tool-ui/linkedin-post';
import { XPost } from '@/components/tool-ui/x-post';
import { LinkPreview } from '@/components/tool-ui/link-preview';
import { Video } from '@/components/tool-ui/video';
import { MessageDraft } from '@/components/tool-ui/message-draft';
import { ItemCarousel } from '@/components/tool-ui/item-carousel';
import { OrderSummary } from '@/components/tool-ui/order-summary';
import { ParameterSlider } from '@/components/tool-ui/parameter-slider';
import { PreferencesPanel } from '@/components/tool-ui/preferences-panel';
import { QuestionFlow } from '@/components/tool-ui/question-flow';

/**
 * Tool UI components whose catalog and schemas describe their props directly.
 *
 * These are deliberately kept separate from A2UI adapters. Adapters receive a
 * `node` object, while these components receive the validated catalog props.
 */
type DirectToolUIComponent = ComponentType<Record<string, unknown>>;

export const directToolUIComponents = {
  ApprovalCard: ApprovalCard as unknown as DirectToolUIComponent,
  WeatherWidget: WeatherWidget as unknown as DirectToolUIComponent,
  StatsDisplay: StatsDisplay as unknown as DirectToolUIComponent,
  ProgressTracker: ProgressTracker as unknown as DirectToolUIComponent,
  OptionList: OptionList as unknown as DirectToolUIComponent,
  InstagramPost: InstagramPost as unknown as DirectToolUIComponent,
  LinkedInPost: LinkedInPost as unknown as DirectToolUIComponent,
  XPost: XPost as unknown as DirectToolUIComponent,
  LinkPreview: LinkPreview as unknown as DirectToolUIComponent,
  Video: Video as unknown as DirectToolUIComponent,
  MessageDraft: MessageDraft as unknown as DirectToolUIComponent,
  ItemCarousel: ItemCarousel as unknown as DirectToolUIComponent,
  OrderSummary: OrderSummary as unknown as DirectToolUIComponent,
  ParameterSlider: ParameterSlider as unknown as DirectToolUIComponent,
  PreferencesPanel: PreferencesPanel as unknown as DirectToolUIComponent,
  QuestionFlow: QuestionFlow as unknown as DirectToolUIComponent,
} as const;

export type DirectToolUIComponentType = keyof typeof directToolUIComponents;

export function isDirectToolUIComponent(
  componentType: string,
): componentType is DirectToolUIComponentType {
  return componentType in directToolUIComponents;
}
