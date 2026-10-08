import { describe, expect, it } from 'vitest';
import {
  formatTimelineDate,
  looksLikeImage,
  safeHttpUrl,
  toDateInput,
  toHistropediaModel,
  toPlainText,
} from './timeline-histropedia';

describe('toDateInput', () => {
  it('states the precision Histropedia would otherwise default to day', () => {
    expect(toDateInput({ year: 1066 })).toEqual({ year: 1066, precision: 'year' });
    expect(toDateInput({ year: 1969, month: 7 })).toEqual({ year: 1969, month: 7, precision: 'month' });
    expect(toDateInput({ year: 1969, month: 7, day: 20, hour: 20, minute: 17 })).toEqual({
      year: 1969, month: 7, day: 20, hour: 20, minute: 17, precision: 'minute',
    });
  });

  it('uses million-year precision for deep time', () => {
    expect(toDateInput({ year: -13_800_000_000 }).precision).toBe('million-years');
    expect(toDateInput({ year: -66_000_000 }).precision).toBe('million-years');
    expect(toDateInput({ year: -500 }).precision).toBe('year');
  });
});

describe('formatTimelineDate', () => {
  it('formats calendar, BCE and deep-time dates', () => {
    expect(formatTimelineDate({ year: 2024, month: 6, day: 15 })).toBe('15 Jun 2024');
    expect(formatTimelineDate({ year: 2024, month: 6 })).toBe('Jun 2024');
    expect(formatTimelineDate({ year: -500 })).toBe('500 BCE');
    expect(formatTimelineDate({ year: -13_800_000_000 })).toBe('13.8 billion years ago');
    expect(formatTimelineDate({ year: -66_000_000 })).toBe('66 million years ago');
    expect(formatTimelineDate({ year: 1, display_date: 'Year one' })).toBe('Year one');
  });
});

describe('toPlainText', () => {
  it('strips tags, keeps paragraph breaks and decodes entities', () => {
    expect(toPlainText('<p>First &amp; <b>bold</b></p><p>Second&nbsp;line</p>')).toBe('First & bold\nSecond line');
    expect(toPlainText('25&deg;C<br>&#x2013;&#8212;')).toBe('25°C\n–—');
    expect(toPlainText('&#99999999; &bogus;')).toBe('&#99999999; &bogus;');
    expect(toPlainText(undefined)).toBe('');
  });
});

describe('URL helpers', () => {
  it('only allows http(s) URLs', () => {
    expect(safeHttpUrl('https://example.com/a.png')).toBe('https://example.com/a.png');
    expect(safeHttpUrl('javascript:alert(1)')).toBeUndefined();
    expect(safeHttpUrl('data:image/png;base64,AAAA')).toBeUndefined();
    expect(safeHttpUrl('not a url')).toBeUndefined();
  });

  it('recognises image URLs by path extension', () => {
    expect(looksLikeImage('https://example.com/photo.JPG?size=2')).toBe(true);
    expect(looksLikeImage('https://youtube.com/watch?v=abc')).toBe(false);
  });
});

describe('toHistropediaModel', () => {
  it('orders events chronologically and skips undated ones', () => {
    const model = toHistropediaModel({
      events: [
        { unique_id: 'b', start_date: { year: 2000 }, text: { headline: 'B' } },
        { text: { headline: 'Undated' } },
        { unique_id: 'a', start_date: { year: -500 }, text: { headline: '<i>A</i>' } },
      ],
    });
    expect(model.events.map((event) => event.id)).toEqual(['a', 'b']);
    expect(model.articles.map((article) => article.title)).toEqual(['A', 'B']);
    expect(model.articles[0].subtitle).toBe('500 BCE');
  });

  it('gives every article a unique id', () => {
    const model = toHistropediaModel({
      events: [
        { unique_id: 'same', start_date: { year: 1 } },
        { unique_id: 'same', start_date: { year: 2 } },
        { start_date: { year: 3 } },
      ],
    });
    const ids = model.articles.map((article) => article.id);
    expect(new Set(ids).size).toBe(3);
    expect(ids[0]).toBe('same');
    expect(ids[2]).toBe('event-2');
  });

  it('maps media, ranges, groups and eras', () => {
    const model = toHistropediaModel({
      events: [
        {
          unique_id: 'war',
          group: 'Politics',
          start_date: { year: 1939, month: 9, day: 1 },
          end_date: { year: 1945, month: 9, day: 2 },
          media: { url: 'https://example.com/photo.jpg' },
          background: { color: '#aa0000' },
        },
        {
          unique_id: 'film',
          start_date: { year: 1941 },
          media: { url: 'https://youtube.com/watch?v=abc', thumbnail: 'javascript:alert(1)' },
        },
      ],
      eras: [
        { start_date: { year: 1939 }, end_date: { year: 1945 }, text: { headline: 'WWII' } },
      ],
    });

    const [war, film] = model.articles;
    expect(war.to).toEqual({ year: 1945, month: 9, day: 2, precision: 'day' });
    expect(war.subtitle).toBe('1 Sep 1939 – 2 Sep 1945');
    expect(war.imageUrl).toBe('https://example.com/photo.jpg');
    expect(war.style).toEqual({ color: '#aa0000' });
    expect(film.imageUrl).toBeUndefined();

    expect(model.lanes).toEqual([{ id: 'lane:Politics', title: 'Politics' }, { id: 'lane:' }]);
    expect(war.lane).toBe('lane:Politics');
    expect(film.lane).toBe('lane:');

    expect(model.timeBands).toEqual([
      { id: 'era-0', title: 'WWII', from: { year: 1939, precision: 'year' }, to: { year: 1945, precision: 'year' } },
    ]);
  });

  it('uses no lanes when nothing is grouped', () => {
    const model = toHistropediaModel({ events: [{ start_date: { year: 1 } }] });
    expect(model.lanes).toEqual([]);
    expect(model.articles[0].lane).toBeUndefined();
  });
});
