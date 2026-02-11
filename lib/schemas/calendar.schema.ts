/**
 * Zod schemas for Calendar component
 * Provides runtime type validation for schedule-x calendar props
 *
 * Uses discriminated unions for different view types and configurations
 */

import { z } from 'zod';

/**
 * Calendar view types supported by schedule-x
 */
export const CalendarViewTypeSchema = z.enum([
  'day',
  'week',
  'month-grid',
  'month-agenda'
]);

export type CalendarViewType = z.infer<typeof CalendarViewTypeSchema>;

/**
 * Calendar event data structure
 * Based on schedule-x event format
 */
export const CalendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  start: z.string(), // ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
  end: z.string(), // ISO date string
  description: z.string().optional(),
  location: z.string().optional(),
  people: z.array(z.string()).optional(), // Attendees
  calendarId: z.string().optional(), // For multi-calendar support
  color: z.string().optional(), // Custom event color
  _options: z.object({
    additionalClasses: z.array(z.string()).optional(),
  }).optional(),
});

export type CalendarEvent = z.infer<typeof CalendarEventSchema>;

/**
 * Recurring event configuration
 */
export const RecurringConfigSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().optional(), // Every N days/weeks/months/years
  until: z.string().optional(), // ISO date string - when to stop recurring
  count: z.number().optional(), // Number of occurrences
  byWeekday: z.array(z.enum(['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'])).optional(),
  byMonthDay: z.array(z.number()).optional(), // Day of month (1-31)
  byMonth: z.array(z.number()).optional(), // Month (1-12)
});

export type RecurringConfig = z.infer<typeof RecurringConfigSchema>;

/**
 * Calendar configuration options
 */
export const CalendarConfigSchema = z.object({
  locale: z.string().optional(), // e.g., 'en-US', 'de-DE'
  firstDayOfWeek: z.number().min(0).max(6).optional(), // 0 = Sunday, 1 = Monday, etc.
  weekOptions: z.object({
    gridHeight: z.number().optional(),
    nDays: z.number().optional(), // For custom week views
  }).optional(),
  monthGridOptions: z.object({
    nEventsPerDay: z.number().optional(), // Max events to show per day
  }).optional(),
  dayBoundaries: z.object({
    start: z.string().optional(), // Time string "HH:MM"
    end: z.string().optional(), // Time string "HH:MM"
  }).optional(),
  isResponsive: z.boolean().optional(),
  minDate: z.string().optional(), // ISO date string
  maxDate: z.string().optional(), // ISO date string
});

export type CalendarConfig = z.infer<typeof CalendarConfigSchema>;

/**
 * Calendar data schema
 */
export const CalendarDataSchema = z.object({
  title: z.string().optional(),
  defaultView: CalendarViewTypeSchema.optional(),
  views: z.array(CalendarViewTypeSchema).optional(), // Available views
  events: z.array(CalendarEventSchema),
  selectedDate: z.string().optional(), // ISO date string - initial date to show
  config: CalendarConfigSchema.optional(),
});

export type CalendarData = z.infer<typeof CalendarDataSchema>;

/**
 * Calendar callback event types
 */
export const CalendarCallbackEventSchema = z.object({
  eventId: z.string(),
  start: z.string(),
  end: z.string(),
  title: z.string().optional(),
});

export type CalendarCallbackEvent = z.infer<typeof CalendarCallbackEventSchema>;

/**
 * Calendar options for styling and behavior
 */
export const CalendarOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(),
  width: z.union([z.number(), z.string()]).optional(),
  theme: z.enum(['light', 'dark']).optional(),
  isDraggable: z.boolean().optional(), // Enable drag-and-drop
  isResizable: z.boolean().optional(), // Enable event resizing
  showWeekNumbers: z.boolean().optional(),
}).optional();

export type CalendarOptions = z.infer<typeof CalendarOptionsSchema>;

/**
 * Complete Calendar props schema
 */
export const CalendarPropsSchema = z.object({
  data: CalendarDataSchema,
  options: CalendarOptionsSchema,
});

export type CalendarProps = z.infer<typeof CalendarPropsSchema>;
