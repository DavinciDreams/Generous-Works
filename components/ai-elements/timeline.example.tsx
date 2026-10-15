import type { TimelineEvent, TimelineEra, TimelineTable } from "./timeline";

import {
  Timeline,
  TimelineActions,
  TimelineContent,
  TimelineCopyButton,
  TimelineFullscreenButton,
  TimelineHeader,
  TimelineTitle,
} from "./timeline";

const Header = () => (
  <TimelineHeader>
    <TimelineTitle />
    <TimelineActions>
      <TimelineCopyButton />
      <TimelineFullscreenButton />
    </TimelineActions>
  </TimelineHeader>
);

/** Picture cards, importance, categories, periods, eras, tags and read-more links. */
export const spaceRaceEvents: TimelineEvent[] = [
  {
    id: "sputnik",
    title: "Sputnik 1",
    description: "The first artificial satellite orbits Earth for three weeks, beeping on 20 and 40 MHz.",
    start: { year: 1957, month: 10, day: 4, precision: "day" },
    importance: 4,
    category: "Satellites",
    group: "USSR",
    tags: ["Orbit"],
    link: { url: "https://en.wikipedia.org/wiki/Sputnik_1", label: "Sputnik 1 on Wikipedia" },
  },
  {
    id: "gagarin",
    title: "Yuri Gagarin orbits Earth",
    subtitle: "Vostok 1",
    description: "The first human in space completes one orbit in 108 minutes.",
    start: { year: 1961, month: 4, day: 12, precision: "day" },
    importance: 5,
    category: "Crewed",
    group: "USSR",
    tags: ["Orbit", "First"],
  },
  {
    id: "gemini",
    title: "Project Gemini",
    description: "Two-person missions rehearse rendezvous, docking and spacewalks for Apollo.",
    start: { year: 1961, precision: "year" },
    end: { year: 1966, precision: "year" },
    importance: 2,
    category: "Crewed",
    group: "USA",
    tags: ["Orbit"],
  },
  {
    id: "apollo-11",
    title: "Apollo 11 lands on the Moon",
    subtitle: "Armstrong and Aldrin",
    description: "Neil Armstrong and Buzz Aldrin walk on the Moon while Michael Collins orbits above.",
    start: { year: 1969, month: 7, day: 20, precision: "day" },
    importance: 5,
    category: "Crewed",
    group: "USA",
    tags: ["Moon", "First"],
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/9/98/Aldrin_Apollo_11_original.jpg",
      caption: "Buzz Aldrin on the Moon",
      credit: "NASA",
      alt: "An astronaut standing on the lunar surface",
    },
    link: { url: "https://en.wikipedia.org/wiki/Apollo_11" },
  },
  {
    id: "lunokhod",
    title: "Lunokhod 1 rover",
    start: { year: 1970, month: 11, day: 17, precision: "day" },
    importance: 2,
    category: "Robotic",
    group: "USSR",
    tags: ["Moon"],
  },
  {
    id: "apollo-soyuz",
    title: "Apollo–Soyuz",
    description: "An American and a Soviet crew dock in orbit, closing the Space Race.",
    start: { year: 1975, month: 7, day: 17, precision: "day" },
    importance: 3,
    category: "Crewed",
    tags: ["Orbit"],
  },
  {
    id: "hubble",
    title: "Hubble Space Telescope",
    start: { year: 1990, month: 4, day: 24, precision: "day" },
    importance: 4,
    category: "Satellites",
    group: "USA",
    media: {
      url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg",
      alt: "The Hubble Space Telescope in orbit",
      credit: "NASA",
    },
    style: { card: "image" },
  },
];

export const spaceRaceEras: TimelineEra[] = [
  { title: "Space Race", start: { year: 1955 }, end: { year: 1975 }, category: "Crewed" },
  { title: "Shuttle era", start: { year: 1981 }, end: { year: 2011 } },
];

export function SpaceRaceTimeline() {
  return (
    <Timeline title="The Space Race" events={spaceRaceEvents} eras={spaceRaceEras}>
      <Header />
      <TimelineContent />
    </Timeline>
  );
}

/** Spreadsheet-style input, converted into events. */
export const artistsTable: TimelineTable = {
  columns: ["Name", "Born", "Died", "Movement", "Rank", "Tags", "Article"],
  rows: [
    ["Giotto", "c. 1267", 1337, "Proto-Renaissance", 3, "painting, fresco", null],
    ["Leonardo da Vinci", "1452-04-15", "1519-05-02", "High Renaissance", 5, "painting, science", "https://en.wikipedia.org/wiki/Leonardo_da_Vinci"],
    ["Michelangelo", "1475-03-06", "1564-02-18", "High Renaissance", 5, "sculpture, painting", "https://en.wikipedia.org/wiki/Michelangelo"],
    ["Raphael", "1483-04-06", "1520-04-06", "High Renaissance", 4, "painting", "https://en.wikipedia.org/wiki/Raphael"],
    ["Caravaggio", "1571-09-29", "1610-07-18", "Baroque", 4, "painting", "https://en.wikipedia.org/wiki/Caravaggio"],
  ],
  map: { title: "Name", start: "Born", end: "Died", category: "Movement", importance: "Rank", tags: "Tags", link: "Article" },
};

export function TableTimeline() {
  return (
    <Timeline title="Renaissance artists" table={artistsTable}>
      <Header />
      <TimelineContent />
    </Timeline>
  );
}

/** Card shape, colour and font per event. */
export function StyledTimeline() {
  return (
    <Timeline
      title="A company history"
      height={420}
      events={[
        { id: "founded", title: "Founded in a garage", subtitle: "Two founders, one idea", start: { year: 2009, month: 3, precision: "month" }, importance: 4, style: { card: "note", font: "script" } },
        { id: "launch", title: "First product ships", start: { year: 2011, month: 9, day: 1, precision: "day" }, importance: 5, style: { card: "rounded", color: "chart-2", font: "display" } },
        { id: "ipo", title: "Public listing", dateLabel: "Spring 2018", start: { year: 2018, month: 4, precision: "month" }, importance: 3, style: { card: "dark", color: "#7c3aed", font: "serif" } },
      ]}
    >
      <Header />
      <TimelineContent />
    </Timeline>
  );
}

/** Deep time: negative years with million-year precision. */
export function DeepTimeTimeline() {
  return (
    <Timeline
      title="History of the universe"
      events={[
        { id: "big-bang", title: "Big Bang", start: { year: -13_800_000_000, precision: "million-years" }, importance: 5, category: "Cosmos" },
        { id: "earth", title: "Earth forms", start: { year: -4_540_000_000, precision: "million-years" }, importance: 4, category: "Earth" },
        { id: "dinosaurs", title: "Non-avian dinosaurs die out", start: { year: -66_000_000, precision: "million-years" }, importance: 3, category: "Life" },
      ]}
      eras={[{ title: "Mesozoic", start: { year: -252_000_000, precision: "million-years" }, end: { year: -66_000_000, precision: "million-years" }, color: "chart-4" }]}
    >
      <Header />
      <TimelineContent />
    </Timeline>
  );
}

/** The legacy TimelineJS shape still renders, normalized to events. */
export function LegacyTimeline() {
  return (
    <Timeline
      data={{
        title: { text: { headline: "Legacy timeline" } },
        events: [
          { unique_id: "start", start_date: { year: 2024, month: 1, day: 1 }, text: { headline: "Start", text: "<p>First event.</p>" } },
          { unique_id: "end", start_date: { year: 2024, month: 12, day: 31 }, text: { headline: "End" } },
        ],
      }}
    >
      <Header />
      <TimelineContent />
    </Timeline>
  );
}

/** No dated events: an empty state, not a blank canvas. */
export function EmptyTimeline() {
  return (
    <Timeline title="Nothing yet" events={[]}>
      <Header />
      <TimelineContent />
    </Timeline>
  );
}
