import type { TimelineData } from "./timeline";

import {
  Timeline,
  TimelineActions,
  TimelineContent,
  TimelineCopyButton,
  TimelineError,
  TimelineFullscreenButton,
  TimelineHeader,
  TimelineTitle,
} from "./timeline";

// Example 1: Simple timeline with a few events
export function SimpleTimeline() {
  const data: TimelineData = {
    events: [
      {
        start_date: {
          year: 2020,
          month: 1,
          day: 1,
        },
        text: {
          headline: "Project Started",
          text: "<p>The project was officially launched in January 2020.</p>",
        },
      },
      {
        start_date: {
          year: 2021,
          month: 6,
          day: 15,
        },
        text: {
          headline: "First Major Release",
          text: "<p>Released version 1.0 with core features.</p>",
        },
      },
      {
        start_date: {
          year: 2023,
          month: 3,
          day: 20,
        },
        text: {
          headline: "Community Milestone",
          text: "<p>Reached 10,000 active users!</p>",
        },
      },
    ],
    title: {
      text: {
        headline: "Project Timeline",
        text: "<p>Key milestones in our journey</p>",
      },
    },
  };

  return (
    <Timeline data={data}>
      <TimelineHeader>
        <TimelineTitle />
        <TimelineActions>
          <TimelineCopyButton />
          <TimelineFullscreenButton />
        </TimelineActions>
      </TimelineHeader>
      <TimelineError />
      <TimelineContent />
    </Timeline>
  );
}

// Example 2: Timeline with media (images and videos)
export function TimelineWithMedia() {
  const data: TimelineData = {
    events: [
      {
        start_date: {
          year: 1969,
          month: 7,
          day: 20,
        },
        text: {
          headline: "Moon Landing",
          text: "<p>Apollo 11 successfully landed on the Moon.</p>",
        },
        media: {
          url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Aldrin_Apollo_11_original.jpg",
          caption: "Buzz Aldrin on the Moon",
          credit: "NASA",
        },
      },
      {
        start_date: {
          year: 1990,
          month: 4,
          day: 24,
        },
        text: {
          headline: "Hubble Space Telescope Launch",
          text: "<p>The Hubble Space Telescope was deployed into orbit.</p>",
        },
        media: {
          url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg",
          caption: "Hubble Space Telescope",
          credit: "NASA",
        },
      },
    ],
    title: {
      text: {
        headline: "Space Exploration",
        text: "<p>Major achievements in space exploration</p>",
      },
    },
  };

  return (
    <Timeline data={data} title="Space Exploration Timeline">
      <TimelineHeader>
        <TimelineTitle />
        <TimelineActions>
          <TimelineCopyButton />
          <TimelineFullscreenButton />
        </TimelineActions>
      </TimelineHeader>
      <TimelineError />
      <TimelineContent />
    </Timeline>
  );
}

// Example 3: Timeline with date ranges (events with duration)
export function TimelineWithDateRanges() {
  const data: TimelineData = {
    events: [
      {
        start_date: {
          year: 2020,
          month: 1,
          day: 1,
        },
        end_date: {
          year: 2020,
          month: 3,
          day: 31,
        },
        text: {
          headline: "Q1 Development Sprint",
          text: "<p>Initial development phase focusing on core architecture.</p>",
        },
        group: "Development",
      },
      {
        start_date: {
          year: 2020,
          month: 4,
          day: 1,
        },
        end_date: {
          year: 2020,
          month: 6,
          day: 30,
        },
        text: {
          headline: "Q2 Beta Testing",
          text: "<p>Extensive beta testing with early adopters.</p>",
        },
        group: "Testing",
      },
      {
        start_date: {
          year: 2020,
          month: 7,
          day: 1,
        },
        text: {
          headline: "Public Launch",
          text: "<p>Product officially launched to the public.</p>",
        },
        group: "Launch",
      },
    ],
    title: {
      text: {
        headline: "Product Development Timeline",
        text: "<p>From concept to launch</p>",
      },
    },
  };

  return (
    <Timeline data={data}>
      <TimelineHeader>
        <TimelineTitle />
        <TimelineActions>
          <TimelineCopyButton />
          <TimelineFullscreenButton />
        </TimelineActions>
      </TimelineHeader>
      <TimelineError />
      <TimelineContent />
    </Timeline>
  );
}

// Example 4: Timeline with eras (background time periods)
export function TimelineWithEras() {
  const data: TimelineData = {
    events: [
      {
        start_date: {
          year: 1990,
        },
        text: {
          headline: "World Wide Web Invented",
          text: "<p>Tim Berners-Lee invented the World Wide Web.</p>",
        },
      },
      {
        start_date: {
          year: 2000,
        },
        text: {
          headline: "Dot-com Bubble Burst",
          text: "<p>The dot-com bubble crashed, affecting many tech companies.</p>",
        },
      },
      {
        start_date: {
          year: 2007,
        },
        text: {
          headline: "iPhone Released",
          text: "<p>Apple released the first iPhone, revolutionizing mobile computing.</p>",
        },
      },
      {
        start_date: {
          year: 2020,
        },
        text: {
          headline: "AI Boom",
          text: "<p>Large language models and AI tools become mainstream.</p>",
        },
      },
    ],
    eras: [
      {
        start_date: {
          year: 1990,
        },
        end_date: {
          year: 2000,
        },
        text: {
          headline: "Web 1.0 Era",
          text: "<p>The early internet and static web pages.</p>",
        },
      },
      {
        start_date: {
          year: 2000,
        },
        end_date: {
          year: 2010,
        },
        text: {
          headline: "Web 2.0 Era",
          text: "<p>Social media and user-generated content.</p>",
        },
      },
      {
        start_date: {
          year: 2010,
        },
        end_date: {
          year: 2020,
        },
        text: {
          headline: "Mobile Era",
          text: "<p>Mobile-first design and apps dominate.</p>",
        },
      },
    ],
    title: {
      text: {
        headline: "Tech Evolution Timeline",
        text: "<p>Major technology milestones and eras</p>",
      },
    },
  };

  return (
    <Timeline data={data}>
      <TimelineHeader>
        <TimelineTitle />
        <TimelineActions>
          <TimelineCopyButton />
          <TimelineFullscreenButton />
        </TimelineActions>
      </TimelineHeader>
      <TimelineError />
      <TimelineContent />
    </Timeline>
  );
}

// Example 5: Timeline with custom options
export function TimelineWithCustomOptions() {
  const data: TimelineData = {
    events: [
      {
        start_date: {
          year: 2024,
          month: 1,
        },
        text: {
          headline: "Event One",
          text: "<p>First event of the year.</p>",
        },
      },
      {
        start_date: {
          year: 2024,
          month: 6,
        },
        text: {
          headline: "Event Two",
          text: "<p>Mid-year milestone.</p>",
        },
      },
      {
        start_date: {
          year: 2024,
          month: 12,
        },
        text: {
          headline: "Event Three",
          text: "<p>Year-end celebration.</p>",
        },
      },
    ],
  };

  return (
    <Timeline
      data={data}
      options={{
        timenav_position: "top",
        start_at_slide: 1,
        hash_bookmark: true,
        default_bg_color: "#f0f0f0",
        scale_factor: 2,
      }}
      title="Custom Styled Timeline"
    >
      <TimelineHeader>
        <TimelineTitle />
        <TimelineActions>
          <TimelineCopyButton />
          <TimelineFullscreenButton />
        </TimelineActions>
      </TimelineHeader>
      <TimelineError />
      <TimelineContent />
    </Timeline>
  );
}

// Example 6: Minimal timeline (no header)
export function MinimalTimeline() {
  const data: TimelineData = {
    events: [
      {
        start_date: {
          year: 2024,
          month: 1,
          day: 1,
        },
        text: {
          headline: "Start",
        },
      },
      {
        start_date: {
          year: 2024,
          month: 12,
          day: 31,
        },
        text: {
          headline: "End",
        },
      },
    ],
  };

  return (
    <Timeline data={data}>
      <TimelineContent />
    </Timeline>
  );
}

// Example 7: Timeline with error handling (invalid data)
export function TimelineWithError() {
  const invalidData: TimelineData = {
    events: [],
    title: {
      text: {
        headline: "This will show an error",
      },
    },
  };

  return (
    <Timeline data={invalidData}>
      <TimelineHeader>
        <TimelineTitle />
      </TimelineHeader>
      <TimelineError>
        {(error) => (
          <div className="flex items-center gap-2">
            <span className="font-bold">⚠️ Timeline Error:</span>
            <span>{error.message}</span>
          </div>
        )}
      </TimelineError>
      <TimelineContent />
    </Timeline>
  );
}
