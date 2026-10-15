import { describe, expect, it } from 'vitest';
import { normalizeTimelineProps, type TimelineV2 } from '@/lib/a2ui/timeline-contract';
import {
  DEFAULT_THEME,
  EMPTY_FILTER,
  cardStyles,
  categoryColorAt,
  isFilterActive,
  matchesFilter,
  mixColors,
  parseColor,
  readableTextColor,
  resolveColor,
  themeOptions,
  themedStyles,
  toDateInput,
  toHistropediaModel,
  withAlpha,
} from './timeline-histropedia';

const timeline: TimelineV2 = {
  title: 'Space',
  events: [
    {
      id: 'apollo-11',
      title: 'Apollo 11',
      subtitle: 'Armstrong and Aldrin',
      start: { year: 1969, month: 7, day: 20, precision: 'day' },
      importance: 5,
      category: 'Crewed',
      group: 'NASA',
      tags: ['Moon'],
      media: { url: 'https://example.com/aldrin.jpg' },
    },
    {
      id: 'sputnik',
      title: 'Sputnik 1',
      start: { year: 1957, month: 10, day: 4, precision: 'day' },
      importance: 4,
      category: 'Satellites',
    },
    {
      id: 'gemini',
      title: 'Project Gemini',
      start: { year: 1961, precision: 'year' },
      end: { year: 1966, precision: 'year' },
      importance: 2,
      category: 'Crewed',
      group: 'NASA',
      tags: ['Orbit', 'Moon'],
    },
  ],
  eras: [
    { title: 'Space Race', start: { year: 1955 }, end: { year: 1975 }, category: 'Crewed' },
    { title: 'Cold War', start: { year: 1947 }, end: { year: 1991 } },
  ],
};

describe('toHistropediaModel', () => {
  const model = toHistropediaModel(timeline);

  it('orders events chronologically and keeps their ids', () => {
    expect(model.events.map((event) => event.id)).toEqual(['sputnik', 'gemini', 'apollo-11']);
    expect(model.articles.map((article) => article.id)).toEqual(['sputnik', 'gemini', 'apollo-11']);
  });

  it('maps importance to rank, end to a period, media to the picture and subtitle to the band', () => {
    const [sputnik, gemini, apollo] = model.articles;
    expect([sputnik.rank, gemini.rank, apollo.rank]).toEqual([4, 2, 5]);
    expect(gemini.from).toEqual({ year: 1961, precision: 'year' });
    expect(gemini.to).toEqual({ year: 1966, precision: 'year' });
    expect(sputnik.to).toBeUndefined();
    expect(apollo.imageUrl).toBe('https://example.com/aldrin.jpg');
    expect(apollo.subtitle).toBe('20 Jul 1969 · Armstrong and Aldrin');
    expect(gemini.subtitle).toBe('1961 – 1966');
  });

  it('gives events without importance a middle rank', () => {
    const { articles } = toHistropediaModel({ events: [{ id: 'a', title: 'A', start: { year: 1 } }] });
    expect(articles[0].rank).toBe(3);
  });

  it('puts groups in lanes, with a lane for ungrouped events', () => {
    expect(model.groups).toEqual(['NASA']);
    expect(model.lanes).toEqual([{ id: 'lane:NASA', title: 'NASA' }, { id: 'lane:' }]);
    expect(model.articles.map((article) => article.lane)).toEqual(['lane:', 'lane:NASA', 'lane:NASA']);
    expect(toHistropediaModel({ events: [{ id: 'a', title: 'A', start: { year: 1 } }] }).lanes).toEqual([]);
  });

  it('uses compact landscape cards in lanes, where portrait cards would not fit', () => {
    expect(model.articles.every((article) => article.cardLayout === 'landscape')).toBe(true);
    const single = toHistropediaModel({ events: [{ id: 'a', title: 'A', start: { year: 1 } }] });
    expect(single.articles[0].cardLayout).toBe('portrait');
  });

  it('colours categories in order of first appearance, sharing colours with eras', () => {
    expect(model.categories).toEqual(['Crewed', 'Satellites']);
    const crewed = resolveColor(categoryColorAt(0), DEFAULT_THEME);
    const satellites = resolveColor(categoryColorAt(1), DEFAULT_THEME);
    expect(model.articles[2].style?.color).toBe(crewed);
    expect(model.articles[0].style?.color).toBe(satellites);
    expect(model.timeBands[0].style?.backgroundColor).toBe(withAlpha(crewed, 0.16));
  });

  it('draws eras as time bands', () => {
    expect(model.timeBands.map(({ id, title, from, to }) => ({ id, title, from, to }))).toEqual([
      { id: 'era-0', title: 'Space Race', from: { year: 1955, precision: 'year' }, to: { year: 1975, precision: 'year' } },
      { id: 'era-1', title: 'Cold War', from: { year: 1947, precision: 'year' }, to: { year: 1991, precision: 'year' } },
    ]);
  });

  it('collects tags for filtering', () => {
    expect(model.tags).toEqual(['Orbit', 'Moon']);
  });

  it('never loads a non-http(s) picture, even if handed one directly', () => {
    const { articles } = toHistropediaModel({
      events: [{ id: 'a', title: 'A', start: { year: 1 }, media: { url: 'javascript:alert(1)' } }],
    });
    expect(articles[0].imageUrl).toBeUndefined();
  });

  it('draws a legacy timeline after normalization', () => {
    const legacy = normalizeTimelineProps({
      data: { events: [{ start_date: { year: -66_000_000 }, text: { headline: 'Dinosaurs end' } }] },
    });
    const { articles } = toHistropediaModel(legacy);
    expect(articles[0]).toMatchObject({ id: 'event-0', title: 'Dinosaurs end', from: { year: -66_000_000, precision: 'million-years' } });
    expect(articles[0].subtitle).toBe('66 million years ago');
  });
});

describe('cardStyles', () => {
  const event = { id: 'a', title: 'A', start: { year: 1 } };

  it('makes important cards larger with deeper shadows, and minor cards recede', () => {
    const major = cardStyles({ ...event, importance: 5 }, DEFAULT_THEME, '#0097b2');
    const middle = cardStyles({ ...event, importance: 3 }, DEFAULT_THEME, '#0097b2');
    const minor = cardStyles({ ...event, importance: 1 }, DEFAULT_THEME, '#0097b2');
    expect(major.style.width).toBeGreaterThan(middle.style.width!);
    expect(middle.style.width).toBeGreaterThan(minor.style.width!);
    expect(major.style.shadow!.amount).toBeGreaterThan(minor.style.shadow!.amount!);
    expect(major.style.color).toBe('#0097b2');
    expect(minor.style.color).toBe(mixColors('#0097b2', DEFAULT_THEME.background, 0.46));
  });

  it('picks legible text for any card colour', () => {
    const dark = cardStyles({ ...event, style: { color: '#1a1a40' } }, DEFAULT_THEME);
    const light = cardStyles({ ...event, style: { color: '#fff4b0' } }, DEFAULT_THEME);
    expect(dark.style.header!.text!.color).toBe('#ffffff');
    expect(light.style.header!.text!.color).toBe('#111827');
    // The date band is a darker shade of the card, with its own legible text.
    expect(light.style.subheader!.color).toBe(mixColors('#fff4b0', '#000000', 0.32));
  });

  it('lets style.color override the category colour, using theme tokens', () => {
    const styles = cardStyles({ ...event, style: { color: 'chart-4' } }, DEFAULT_THEME, '#123456');
    expect(styles.style.color).toBe(DEFAULT_THEME.tokens['chart-4']);
  });

  it('keeps the card colour when hovered or selected, marking it with the border', () => {
    const styles = cardStyles({ ...event, category: 'x' }, DEFAULT_THEME, '#0097b2');
    expect(styles.hoverStyle.color).toBe(styles.style.color);
    expect(styles.activeStyle.color).toBe(styles.style.color);
    expect(styles.activeStyle.border).toEqual({ color: DEFAULT_THEME.primary, width: 3 });
  });

  it('maps card shapes and fonts onto Histropedia styles', () => {
    expect(cardStyles({ ...event, style: { card: 'note' } }, DEFAULT_THEME).cardLayout).toBe('landscape');
    expect(cardStyles({ ...event, style: { card: 'classic' } }, DEFAULT_THEME).cardLayout).toBe('portrait');
    expect(cardStyles({ ...event, style: { card: 'rounded' } }, DEFAULT_THEME).style.topRadius).toBe(12);
    const image = cardStyles({ ...event, style: { card: 'image' } }, DEFAULT_THEME).style;
    expect(image.image!.maxHeight).toBe(300);
    const dark = cardStyles({ ...event, style: { card: 'dark' } }, DEFAULT_THEME).style;
    expect(dark.header!.text!.color).toBe('#ffffff');
    expect(cardStyles({ ...event, style: { font: 'serif' } }, DEFAULT_THEME).style.header!.text!.font).toContain('Georgia');
    expect(cardStyles({ ...event, style: { font: 'mono' } }, DEFAULT_THEME).style.header!.text!.font).toContain('monospace');
  });
});

describe('colour helpers', () => {
  it('parses hex and rgb colours, and gives up on others', () => {
    expect(parseColor('#abc')).toEqual([170, 187, 204, 1]);
    expect(parseColor('#0097b2')).toEqual([0, 151, 178, 1]);
    expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual([10, 20, 30, 0.5]);
    expect(parseColor('rgb(10 20 30 / 50%)')).toEqual([10, 20, 30, 0.5]);
    expect(parseColor('oklch(0.5 0.1 200)')).toBeNull();
  });

  it('falls back sensibly for colours it cannot parse', () => {
    expect(readableTextColor('oklch(0.5 0.1 200)', '#222222')).toBe('#222222');
    expect(mixColors('oklch(0.5 0.1 200)', '#ffffff', 0.5)).toBe('oklch(0.5 0.1 200)');
    expect(withAlpha('oklch(0.5 0.1 200)', 0.1)).toBe('rgba(128, 128, 128, 0.1)');
  });

  it('cycles category colours through the chart palette and then fixed hues', () => {
    expect(categoryColorAt(0)).toBe('chart-1');
    expect(categoryColorAt(4)).toBe('chart-5');
    expect(categoryColorAt(5)).toMatch(/^#/);
    expect(categoryColorAt(10)).toBe('chart-1');
  });
});

describe('filtering', () => {
  const { events } = toHistropediaModel(timeline);
  const ids = (filter: typeof EMPTY_FILTER) => events.filter((placed) => matchesFilter(placed, filter)).map(({ id }) => id);

  it('shows everything without a filter', () => {
    expect(isFilterActive(EMPTY_FILTER)).toBe(false);
    expect(ids(EMPTY_FILTER)).toEqual(['sputnik', 'gemini', 'apollo-11']);
  });

  it('filters by category, group, tag and text', () => {
    expect(ids({ ...EMPTY_FILTER, categories: ['Satellites'] })).toEqual(['sputnik']);
    expect(ids({ ...EMPTY_FILTER, group: 'NASA' })).toEqual(['gemini', 'apollo-11']);
    expect(ids({ ...EMPTY_FILTER, tags: ['Orbit'] })).toEqual(['gemini']);
    expect(ids({ ...EMPTY_FILTER, query: 'aldrin' })).toEqual(['apollo-11']);
    expect(ids({ ...EMPTY_FILTER, query: '1961' })).toEqual(['gemini']);
    expect(ids({ ...EMPTY_FILTER, categories: ['Crewed'], tags: ['Orbit'] })).toEqual(['gemini']);
    expect(isFilterActive({ ...EMPTY_FILTER, query: ' x ' })).toBe(true);
  });
});

describe('theme', () => {
  it('states precision on every Histropedia date', () => {
    expect(toDateInput({ year: 1969 })).toEqual({ year: 1969, precision: 'year' });
    expect(toDateInput({ year: 1969, month: 7, day: 20, precision: 'day' })).toEqual({ year: 1969, month: 7, day: 20, precision: 'day' });
  });

  it('follows the theme for the axis and colours date ticks by card', () => {
    const options = themeOptions(DEFAULT_THEME);
    expect(options.style?.mainLine?.color).toBe(DEFAULT_THEME.border);
    expect(options.style?.mainLine?.dateIndicators?.color).toBe('article');
    expect(options.style?.dateLabel?.major?.color).toBe(DEFAULT_THEME.cardForeground);
  });

  it('restyles every card and band for a new theme', () => {
    const dark = { ...DEFAULT_THEME, background: '#0b0f17', card: '#141a24', muted: '#1b2230' };
    const restyled = themedStyles(timeline, dark);
    expect(restyled.articles.map(({ id }) => id)).toEqual(['sputnik', 'gemini', 'apollo-11']);
    // Minor cards recede toward the new page colour.
    const crewed = resolveColor(categoryColorAt(0), dark);
    expect(restyled.articles[1].style?.color).toBe(mixColors(crewed, '#0b0f17', 0.28));
    const single = themedStyles({ events: [{ id: 'a', title: 'A', start: { year: 1 } }] }, dark);
    expect(single.articles[0].style?.backgroundColor).toBe('#141a24');
    expect(restyled.timeBands.map(({ id }) => id)).toEqual(['era-0', 'era-1']);
  });
});
