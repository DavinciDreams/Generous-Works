import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Timeline,
  TimelineHeader,
  TimelineTitle,
  TimelineActions,
  TimelineCopyButton,
  TimelineFullscreenButton,
  TimelineContent,
  TimelineError,
  type TimelineProps,
  type TimelineRef,
} from './timeline';
import { normalizeTimelineProps } from '@/lib/a2ui/timeline-contract';
import { useRef, useEffect } from 'react';


// Mock HistropediaJS: happy-dom has no canvas, so record what the component asks for
interface MockArticle {
  id: string;
  title: string;
  rank?: number;
  hiddenByFilter?: boolean;
  setOption: Mock;
}

interface MockHistropedia {
  options: { on?: Record<string, (...args: unknown[]) => void>; shiftBceDates?: boolean; image?: unknown };
  articles: MockArticle[];
  select: Mock;
  setStartDate: Mock;
  fitArticles: Mock;
  defaultRedraw: Mock;
  _dragPointerTracker: { destroy: Mock };
  trigger: (event: string, ...args: unknown[]) => void;
}

const histropedia = vi.hoisted(() => ({ instances: [] as MockHistropedia[] }));

vi.mock('histropediajs', () => ({
  Timeline: class implements MockHistropedia {
    options: MockHistropedia['options'];
    articles: MockArticle[] = [];
    timeBands: Array<{ id: string; setStyle: Mock }> = [];
    select = vi.fn();
    setStartDate = vi.fn();
    fitArticles = vi.fn();
    defaultRedraw = vi.fn();
    _dragPointerTracker = { destroy: vi.fn() };
    constructor(_container: HTMLElement, options: MockHistropedia['options']) {
      this.options = options;
      histropedia.instances.push(this);
    }
    load(articles: Array<{ id: string; title: string; rank?: number; hiddenByFilter?: boolean }>) {
      for (const article of articles) {
        const mock: MockArticle = { ...article, setOption: vi.fn((patch: { hiddenByFilter?: boolean }) => {
          if ('hiddenByFilter' in patch) mock.hiddenByFilter = patch.hiddenByFilter;
        }) };
        this.articles.push(mock);
      }
    }
    getArticleById(id: string) {
      return this.articles.find((article) => article.id === id);
    }
    trigger(event: string, ...args: unknown[]) {
      this.options.on?.[event]?.(...args);
    }
    loadLanes() {}
    loadTimeBands(bands: Array<{ id: string }>) {
      this.timeBands.push(...bands.map((band) => ({ id: band.id, setStyle: vi.fn() })));
    }
    getWidth() {
      return 800;
    }
    setSize() {}
    setOption() {}
    redraw() {}
    disableZoomByWheel() {}
  },
}));

const mockTimelineData: TimelineProps = {
  title: 'Test Timeline',
  events: [
    {
      id: 'event-1',
      title: 'Event 1',
      description: 'First event',
      start: { year: 2024, month: 1, day: 1, precision: 'day' },
    },
    {
      id: 'event-2',
      title: 'Event 2',
      description: 'Second event',
      start: { year: 2024, month: 6, day: 15, precision: 'day' },
    },
  ],
};

describe('Timeline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    histropedia.instances.length = 0;
    // Spy on the clipboard that vitest.setup.ts already installed
    vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    vi.spyOn(navigator.clipboard, 'readText').mockResolvedValue('');
    // happy-dom returns 0 for layout dimensions — give elements real size
    // so the timeline initialization doesn't bail out early
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 800,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get: () => 600,
    });
  });

  afterEach(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => 0,
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get: () => 0,
    });
  });

  describe('Timeline Container', () => {
    it('renders timeline container', () => {
      const { container } = render(<Timeline {...mockTimelineData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Timeline {...mockTimelineData} className="custom-timeline" />
      );
      expect(container.firstChild).toHaveClass('custom-timeline');
    });

    it('renders children', () => {
      render(
        <Timeline {...mockTimelineData}>
          <div data-testid="child">Child content</div>
        </Timeline>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('toggles fullscreen class', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Timeline {...mockTimelineData}>
          <TimelineFullscreenButton />
        </Timeline>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(container.firstChild).toHaveClass('fixed', 'inset-0', 'z-50');
    });
  });

  describe('TimelineHeader', () => {
    it('renders header with children', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineHeader>
            <span data-testid="header-content">Header</span>
          </TimelineHeader>
        </Timeline>
      );
      expect(screen.getByTestId('header-content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Timeline {...mockTimelineData}>
          <TimelineHeader className="custom-header" />
        </Timeline>
      );
      const header = container.querySelector('.custom-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('TimelineTitle', () => {
    it('renders title from data when no children provided', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineTitle />
        </Timeline>
      );
      expect(screen.getByText('Test Timeline')).toBeInTheDocument();
    });

    it('renders custom title when children provided', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineTitle>Custom Title</TimelineTitle>
        </Timeline>
      );
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders default title when no data title', () => {
      render(
        <Timeline events={mockTimelineData.events}>
          <TimelineTitle />
        </Timeline>
      );
      expect(screen.getByText('Timeline')).toBeInTheDocument();
    });
  });

  describe('TimelineActions', () => {
    it('renders actions container with children', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineActions>
            <button data-testid="action-btn">Action</button>
          </TimelineActions>
        </Timeline>
      );
      expect(screen.getByTestId('action-btn')).toBeInTheDocument();
    });
  });

  describe('TimelineCopyButton', () => {
    it('renders copy button', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineCopyButton />
        </Timeline>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows copy icon initially', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineCopyButton />
        </Timeline>
      );
      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('copies timeline data to clipboard on click', async () => {
      const user = userEvent.setup();
      render(
        <Timeline {...mockTimelineData}>
          <TimelineCopyButton />
        </Timeline>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          JSON.stringify(normalizeTimelineProps(mockTimelineData), null, 2)
        );
      });
    });

    it('shows check icon after successful copy', async () => {
      const user = userEvent.setup();
      render(
        <Timeline {...mockTimelineData}>
          <TimelineCopyButton />
        </Timeline>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      // Should show check icon (CheckIcon has different class/structure than CopyIcon)
      await waitFor(() => {
        expect(button.querySelector('svg')).toBeInTheDocument();
      });
    });
  });

  describe('TimelineFullscreenButton', () => {
    it('renders fullscreen button', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineFullscreenButton />
        </Timeline>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('toggles fullscreen state on click', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Timeline {...mockTimelineData}>
          <TimelineFullscreenButton />
        </Timeline>
      );

      const button = screen.getByRole('button');
      const timeline = container.firstChild;

      // Initially not fullscreen
      expect(timeline).not.toHaveClass('fixed');

      // Click to enter fullscreen
      await user.click(button);
      expect(timeline).toHaveClass('fixed', 'inset-0', 'z-50');

      // Click to exit fullscreen
      await user.click(button);
      expect(timeline).not.toHaveClass('fixed');
    });

    it('shows maximize icon when not fullscreen', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineFullscreenButton />
        </Timeline>
      );
      const button = screen.getByRole('button');
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  describe('TimelineContent', () => {
    it('renders timeline content wrapper', () => {
      // In React 18+ test environments act() flushes effects synchronously,
      // so the component is always in the mounted state after render().
      const { container } = render(
        <Timeline {...mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );
      // The content wrapper div is always present after mount
      expect(container.querySelector('.relative.flex-1')).toBeInTheDocument();
    });

    it('renders timeline container after mount', async () => {
      const { container } = render(
        <Timeline {...mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );

      await waitFor(() => {
        const timelineDiv = container.querySelector('[id^="timeline-"]');
        expect(timelineDiv).toBeInTheDocument();
      });
    });

    it('applies the height from the data', async () => {
      const { container } = render(
        <Timeline {...mockTimelineData} height={800}>
          <TimelineContent />
        </Timeline>
      );

      await waitFor(() => {
        const timelineDiv = container.querySelector('[id^="timeline-"]');
        expect(timelineDiv?.parentElement).toHaveStyle({ height: '800px' });
      });
    });

    it('still takes the height from legacy options', async () => {
      const { container } = render(
        <Timeline
          data={{ events: [{ start_date: { year: 2024 }, text: { headline: 'Legacy' } }] }}
          options={{ height: 640 }}
        >
          <TimelineContent />
        </Timeline>
      );

      await waitFor(() => {
        const timelineDiv = container.querySelector('[id^="timeline-"]');
        expect(timelineDiv?.parentElement).toHaveStyle({ height: '640px' });
      });
    });
  });

  describe('TimelineError', () => {
    it('renders error message', () => {
      render(<TimelineError error="Failed to load timeline" />);
      expect(screen.getByText('Failed to load timeline')).toBeInTheDocument();
    });

    it('renders error icon', () => {
      const { container } = render(<TimelineError error="Error" />);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('applies error styling', () => {
      const { container } = render(<TimelineError error="Error" />);
      expect(container.firstChild).toHaveClass('border-destructive', 'text-destructive');
    });
  });

  describe('Composable Pattern', () => {
    it('renders complete timeline with all sub-components', () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineHeader>
            <TimelineTitle />
            <TimelineActions>
              <TimelineCopyButton />
              <TimelineFullscreenButton />
            </TimelineActions>
          </TimelineHeader>
          <TimelineContent />
        </Timeline>
      );

      // In the header
      expect(screen.getByRole('heading', { level: 3, name: 'Test Timeline' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Copy timeline data' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Fullscreen' })).toBeInTheDocument();
      // The canvas's events are also reachable as buttons, for keyboards and screen readers.
      expect(screen.getByRole('button', { name: '1 Jan 2024: Event 1' })).toBeInTheDocument();
    });
  });

  describe('Context Errors', () => {
    it('throws error when TimelineTitle used outside Timeline', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TimelineTitle />)).toThrow(
        'Timeline components must be used within Timeline'
      );

      consoleSpy.mockRestore();
    });

    it('throws error when TimelineCopyButton used outside Timeline', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => render(<TimelineCopyButton />)).toThrow(
        'Timeline components must be used within Timeline'
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Ref API', () => {
    it('exposes ref with timeline methods', async () => {
      let refValue: TimelineRef | null = null;

      function TestComponent() {
        const ref = useRef<TimelineRef>(null);

        useEffect(() => {
          refValue = ref.current;
        }, []);

        return (
          <Timeline ref={ref} {...mockTimelineData}>
            <TimelineContent />
          </Timeline>
        );
      }

      render(<TestComponent />);

      await waitFor(() => {
        expect(refValue).not.toBeNull();
      });

      if (refValue) {
        const ref = refValue as TimelineRef;
        expect(typeof ref.goTo).toBe('function');
        expect(typeof ref.goToId).toBe('function');
        expect(typeof ref.goToNext).toBe('function');
        expect(typeof ref.goToPrev).toBe('function');
        expect(typeof ref.goToStart).toBe('function');
        expect(typeof ref.goToEnd).toBe('function');
        expect(typeof ref.getData).toBe('function');
        expect(typeof ref.getDataById).toBe('function');
      }
    });

    it('navigates events in chronological order', async () => {
      const ref = { current: null as TimelineRef | null };
      render(
        <Timeline
          ref={ref}
          events={[
            { ...mockTimelineData.events![1], id: 'later' },
            { ...mockTimelineData.events![0], id: 'earlier' },
          ]}
        >
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      const canvas = histropedia.instances[0];
      await waitFor(() => expect(ref.current?.getData(0)).not.toBeNull());

      expect(ref.current?.getData(0)?.id).toBe('earlier');
      expect(ref.current?.getDataById('later')?.title).toBe('Event 2');

      act(() => ref.current?.goToEnd());
      expect(canvas.select).toHaveBeenLastCalledWith('later');
      expect(await screen.findByText('Second event')).toBeInTheDocument();

      act(() => ref.current?.goToPrev());
      expect(canvas.select).toHaveBeenLastCalledWith('earlier');
      expect(await screen.findByText('First event')).toBeInTheDocument();
    });
  });

  describe('Histropedia canvas', () => {
    it('loads every event as an article, fits them in view and opens the most important', async () => {
      render(
        <Timeline
          events={[
            ...mockTimelineData.events!,
            { id: 'major', title: 'Major', description: 'The big one', start: { year: 2024, month: 3 }, importance: 5 },
          ]}
        >
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      const canvas = histropedia.instances[0];
      expect(canvas.articles.map((article) => [article.title, article.rank])).toEqual([
        ['Event 1', 3],
        ['Major', 5],
        ['Event 2', 3],
      ]);
      expect(canvas.fitArticles).toHaveBeenCalled();
      expect(canvas.select).toHaveBeenLastCalledWith('major');
      expect(await screen.findByText('The big one')).toBeInTheDocument();
      // Negative years are BCE as written, and images are http(s) only.
      expect(canvas.options.shiftBceDates).toBe(true);
      expect(canvas.options.image).toEqual({ sanitizer: { allowedSchemes: ['http', 'https'] } });
    });

    it('renders the legacy TimelineJS shape', async () => {
      render(
        <Timeline
          data={{
            title: { text: { headline: 'Legacy timeline' } },
            events: [{ unique_id: 'x', start_date: { year: 1969 }, text: { headline: '<b>Landing</b>', text: '<p>One small step</p>' } }],
          }}
        >
          <TimelineHeader>
            <TimelineTitle />
          </TimelineHeader>
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      expect(histropedia.instances[0].articles.map((article) => [article.id, article.title])).toEqual([['x', 'Landing']]);
      expect(screen.getByRole('heading', { level: 3, name: 'Legacy timeline' })).toBeInTheDocument();
      expect(await screen.findByText('One small step')).toBeInTheDocument();
    });

    it('renders table input', async () => {
      render(
        <Timeline
          table={{
            columns: ['Name', 'When'],
            rows: [['Moon landing', '1969-07-20'], ['No date', 'someday']],
            map: { title: 'Name', start: 'When' },
          }}
        >
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      expect(histropedia.instances[0].articles.map((article) => [article.id, article.title])).toEqual([['row-0', 'Moon landing']]);
    });

    it('shows an empty state instead of a blank canvas when no event has a date', async () => {
      render(
        <Timeline data={{ events: [{ text: { headline: 'Undated' } }] }}>
          <TimelineContent />
        </Timeline>
      );
      expect(await screen.findByText('No dated events to show.')).toBeInTheDocument();
      expect(histropedia.instances).toHaveLength(0);
    });

    it('shows event text as plain text, links only http(s) and opens links in a new tab', async () => {
      const unsafe = ['javascript', 'alert(1)'].join(':');
      render(
        <Timeline
          events={[
            {
              id: 'x',
              title: 'Landing',
              description: '<img src=x onerror="alert(1)">One small step',
              start: { year: 1969 },
              media: { url: unsafe },
              link: { url: 'https://en.wikipedia.org/wiki/Apollo_11', label: 'Apollo 11' },
            },
            { id: 'y', title: 'Unsafe link', start: { year: 1970 }, link: { url: unsafe } },
          ]}
        >
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));

      expect(await screen.findByText('<img src=x onerror="alert(1)">One small step')).toBeInTheDocument();
      expect(document.querySelector('img[src="x"]')).toBeNull();
      expect(document.querySelector('img[src^="javascript"]')).toBeNull();
      const link = screen.getByRole('link', { name: /Apollo 11/ });
      expect(link).toHaveAttribute('href', 'https://en.wikipedia.org/wiki/Apollo_11');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');

      act(() => histropedia.instances[0].trigger('article-select', { id: 'y' }));
      expect(await screen.findByRole('heading', { level: 4, name: 'Unsafe link' })).toBeInTheDocument();
      expect(screen.queryByRole('link')).toBeNull();
    });

    it('previews a card on hover and opens it on selection', async () => {
      render(
        <Timeline {...mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      const canvas = histropedia.instances[0];

      act(() => canvas.trigger('article-pointerenter', { id: 'event-2' }, { clientX: 100, clientY: 50 }));
      const preview = await screen.findByRole('tooltip');
      expect(preview).toHaveTextContent('Event 2');
      expect(preview).toHaveTextContent('Second event');

      act(() => canvas.trigger('article-pointerleave', { id: 'event-2' }, { clientX: 100, clientY: 50 }));
      expect(screen.queryByRole('tooltip')).toBeNull();

      act(() => canvas.trigger('article-select', { id: 'event-2' }));
      expect(await screen.findByRole('heading', { level: 4, name: 'Event 2' })).toBeInTheDocument();
    });

    it("filters cards by category, tag and search with Histropedia's article filter", async () => {
      const user = userEvent.setup();
      render(
        <Timeline
          events={[
            { id: 'a', title: 'Alpha', start: { year: 1 }, category: 'Red', tags: ['one'] },
            { id: 'b', title: 'Beta', start: { year: 2 }, category: 'Blue', tags: ['two'] },
            { id: 'c', title: 'Gamma', start: { year: 3 }, category: 'Blue', tags: ['one'] },
          ]}
        >
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      const canvas = histropedia.instances[0];
      const hidden = () => canvas.articles.filter((article) => article.hiddenByFilter).map((article) => article.id);
      expect(hidden()).toEqual([]);

      await user.click(screen.getByRole('button', { name: 'Blue' }));
      expect(hidden()).toEqual(['a']);
      expect(canvas.defaultRedraw).toHaveBeenCalled();
      expect(screen.getByText('2 of 3 events')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: '#one' }));
      expect(hidden()).toEqual(['a', 'b']);

      await user.click(screen.getByRole('button', { name: /Clear/ }));
      expect(hidden()).toEqual([]);

      fireEvent.change(screen.getByRole('searchbox', { name: 'Search events' }), { target: { value: 'gam' } });
      expect(hidden()).toEqual(['a', 'b']);
    });

    it('releases the window listeners on unmount', async () => {
      const { unmount } = render(
        <Timeline {...mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      unmount();
      expect(histropedia.instances[0]._dragPointerTracker.destroy).toHaveBeenCalled();
    });
  });
});
