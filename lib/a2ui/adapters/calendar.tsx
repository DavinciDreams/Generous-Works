/**
 * A2UI Adapter for Calendar Component
 * Maps A2UI properties to Calendar component props
 */

import { createAdapter, extractValue, type AdapterContext } from '../adapter';
import {
  Calendar,
  CalendarHeader,
  CalendarTitle,
  CalendarActions,
  CalendarNavigation,
  CalendarFullscreenButton,
  CalendarCopyButton,
  CalendarContent,
  type CalendarProps,
} from '@/components/ai-elements/calendar';
import type { CalendarData, CalendarOptions } from '@/lib/schemas/calendar.schema';

/**
 * Main Calendar adapter
 */
export const CalendarAdapter = createAdapter<CalendarProps>(Calendar, {
  mapProps: (a2ui, ctx) => {
    // Extract calendar data
    const data: CalendarData = {
      title: extractValue(a2ui.title),
      defaultView: extractValue(a2ui.defaultView) || 'month-grid',
      views: extractValue(a2ui.views),
      events: extractValue(a2ui.events) || [],
      selectedDate: extractValue(a2ui.selectedDate),
      config: extractValue(a2ui.config),
    };

    // Extract options
    const options: CalendarOptions = {
      height: extractValue(a2ui.height),
      width: extractValue(a2ui.width),
      theme: extractValue(a2ui.theme),
      isDraggable: extractValue(a2ui.isDraggable),
      isResizable: extractValue(a2ui.isResizable),
      showWeekNumbers: extractValue(a2ui.showWeekNumbers),
    };

    return {
      data,
      options,
      children: ctx.children,
    };
  },
  displayName: 'CalendarAdapter',
});

/**
 * Calendar sub-component adapters
 */
export const CalendarHeaderAdapter = createAdapter(CalendarHeader, {
  mapProps: (_, ctx) => ({ children: ctx.children }),
  displayName: 'CalendarHeaderAdapter',
});

export const CalendarTitleAdapter = createAdapter(CalendarTitle, {
  mapProps: (a2ui, ctx) => ({
    children: extractValue(a2ui.text) || ctx.children,
  }),
  displayName: 'CalendarTitleAdapter',
});

export const CalendarActionsAdapter = createAdapter(CalendarActions, {
  mapProps: (_, ctx) => ({ children: ctx.children }),
  displayName: 'CalendarActionsAdapter',
});

export const CalendarNavigationAdapter = createAdapter(CalendarNavigation, {
  mapProps: () => ({}),
  displayName: 'CalendarNavigationAdapter',
});

export const CalendarFullscreenButtonAdapter = createAdapter(CalendarFullscreenButton, {
  mapProps: () => ({}),
  displayName: 'CalendarFullscreenButtonAdapter',
});

export const CalendarCopyButtonAdapter = createAdapter(CalendarCopyButton, {
  mapProps: () => ({}),
  displayName: 'CalendarCopyButtonAdapter',
});

export const CalendarContentAdapter = createAdapter(CalendarContent, {
  mapProps: () => ({}),
  displayName: 'CalendarContentAdapter',
});
