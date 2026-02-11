"use client";

import {
  Calendar,
  CalendarHeader,
  CalendarTitle,
  CalendarActions,
  CalendarNavigation,
  CalendarFullscreenButton,
  CalendarCopyButton,
  CalendarContent,
  type CalendarData,
} from "@/components/ai-elements/calendar";

// Month grid view example
const monthGridData: CalendarData = {
  title: "Team Schedule - Month View",
  defaultView: "month-grid",
  views: ["day", "week", "month-grid"],
  events: [
    {
      id: "1",
      title: "Team Meeting",
      start: "2026-02-15T10:00:00",
      end: "2026-02-15T11:00:00",
      description: "Weekly team sync",
      location: "Conference Room A",
      color: "#3b82f6",
    },
    {
      id: "2",
      title: "Project Deadline",
      start: "2026-02-20",
      end: "2026-02-20",
      description: "Final deliverables due",
      color: "#ef4444",
    },
    {
      id: "3",
      title: "Workshop",
      start: "2026-02-25T14:00:00",
      end: "2026-02-25T17:00:00",
      description: "Technical training session",
      location: "Training Center",
      people: ["Alice", "Bob", "Charlie"],
      color: "#10b981",
    },
    {
      id: "4",
      title: "Client Presentation",
      start: "2026-02-18T15:00:00",
      end: "2026-02-18T16:30:00",
      description: "Q1 review presentation",
      location: "Zoom",
      color: "#8b5cf6",
    },
    {
      id: "5",
      title: "Code Review",
      start: "2026-02-17T13:00:00",
      end: "2026-02-17T14:00:00",
      description: "PR reviews and architecture discussion",
      location: "Dev Room",
    },
    {
      id: "6",
      title: "Sprint Planning",
      start: "2026-02-24T09:00:00",
      end: "2026-02-24T12:00:00",
      description: "Plan next sprint",
      people: ["Team A", "Team B"],
      color: "#f59e0b",
    },
  ],
  selectedDate: "2026-02-15",
};

// Week view example
const weekViewData: CalendarData = {
  title: "Weekly Schedule",
  defaultView: "week",
  views: ["day", "week"],
  events: [
    {
      id: "1",
      title: "Daily Standup",
      start: "2026-02-17T09:00:00",
      end: "2026-02-17T09:15:00",
      color: "#06b6d4",
    },
    {
      id: "2",
      title: "Daily Standup",
      start: "2026-02-18T09:00:00",
      end: "2026-02-18T09:15:00",
      color: "#06b6d4",
    },
    {
      id: "3",
      title: "Daily Standup",
      start: "2026-02-19T09:00:00",
      end: "2026-02-19T09:15:00",
      color: "#06b6d4",
    },
    {
      id: "4",
      title: "Client Call",
      start: "2026-02-18T14:00:00",
      end: "2026-02-18T15:00:00",
      description: "Product demo",
      color: "#10b981",
    },
    {
      id: "5",
      title: "Development",
      start: "2026-02-17T10:00:00",
      end: "2026-02-17T12:00:00",
      description: "Feature implementation",
      color: "#6366f1",
    },
    {
      id: "6",
      title: "Development",
      start: "2026-02-18T10:00:00",
      end: "2026-02-18T12:00:00",
      description: "Feature implementation",
      color: "#6366f1",
    },
    {
      id: "7",
      title: "Testing",
      start: "2026-02-19T13:00:00",
      end: "2026-02-19T16:00:00",
      description: "QA and bug fixes",
      color: "#ec4899",
    },
  ],
  selectedDate: "2026-02-17",
  config: {
    firstDayOfWeek: 1, // Monday
    dayBoundaries: {
      start: "08:00",
      end: "18:00",
    },
  },
};

// Day view example
const dayViewData: CalendarData = {
  title: "Today's Schedule",
  defaultView: "day",
  views: ["day"],
  events: [
    {
      id: "1",
      title: "Morning Standup",
      start: "2026-02-17T09:00:00",
      end: "2026-02-17T09:15:00",
      description: "Daily team sync",
      color: "#06b6d4",
    },
    {
      id: "2",
      title: "Focus Time - Development",
      start: "2026-02-17T09:30:00",
      end: "2026-02-17T12:00:00",
      description: "Deep work on feature X",
      color: "#6366f1",
    },
    {
      id: "3",
      title: "Lunch Break",
      start: "2026-02-17T12:00:00",
      end: "2026-02-17T13:00:00",
      color: "#d1d5db",
    },
    {
      id: "4",
      title: "Code Review",
      start: "2026-02-17T13:00:00",
      end: "2026-02-17T14:00:00",
      description: "Review pending PRs",
      color: "#8b5cf6",
    },
    {
      id: "5",
      title: "Client Meeting",
      start: "2026-02-17T14:30:00",
      end: "2026-02-17T15:30:00",
      description: "Project update",
      location: "Zoom",
      color: "#10b981",
    },
    {
      id: "6",
      title: "Team Retrospective",
      start: "2026-02-17T16:00:00",
      end: "2026-02-17T17:00:00",
      description: "Sprint retro",
      people: ["Team"],
      color: "#f59e0b",
    },
  ],
  selectedDate: "2026-02-17",
  config: {
    dayBoundaries: {
      start: "08:00",
      end: "19:00",
    },
  },
};

export default function CalendarTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Calendar Component Test</h1>
        <p className="text-muted-foreground mt-2">
          Testing the schedule-x Calendar component with multiple view types
        </p>
      </div>

      {/* Month Grid View */}
      <Calendar data={monthGridData} options={{ height: 600 }}>
        <CalendarHeader>
          <CalendarTitle />
          <CalendarActions>
            <CalendarNavigation />
            <CalendarCopyButton />
            <CalendarFullscreenButton />
          </CalendarActions>
        </CalendarHeader>
        <CalendarContent />
      </Calendar>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Week View */}
        <Calendar data={weekViewData} options={{ height: 500 }}>
          <CalendarHeader>
            <CalendarTitle />
            <CalendarActions>
              <CalendarNavigation />
              <CalendarCopyButton />
              <CalendarFullscreenButton />
            </CalendarActions>
          </CalendarHeader>
          <CalendarContent />
        </Calendar>

        {/* Day View */}
        <Calendar data={dayViewData} options={{ height: 500 }}>
          <CalendarHeader>
            <CalendarTitle />
            <CalendarActions>
              <CalendarNavigation />
              <CalendarCopyButton />
              <CalendarFullscreenButton />
            </CalendarActions>
          </CalendarHeader>
          <CalendarContent />
        </Calendar>
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Calendar Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Multiple Views:</strong> Day, Week, Month Grid, Month Agenda</li>
          <li><strong>Event Management:</strong> Create, edit, delete, drag-and-drop</li>
          <li><strong>Event Details:</strong> Title, description, location, attendees, colors</li>
          <li><strong>Customization:</strong> First day of week, working hours, time zones</li>
          <li><strong>Responsive:</strong> Works on desktop and mobile</li>
          <li><strong>Accessibility:</strong> Keyboard navigation and screen reader support</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          Powered by <strong>schedule-x</strong> - modern alternative to FullCalendar
        </p>
      </div>
    </div>
  );
}
