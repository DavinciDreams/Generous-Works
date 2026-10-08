import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
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
  type TimelineData,
  type TimelineRef,
} from './timeline';
import { useRef, useEffect } from 'react';


// Mock HistropediaJS: happy-dom has no canvas, so record what the component asks for
interface MockHistropedia {
  articles: Array<{ id: string; title: string }>;
  select: Mock;
  setStartDate: Mock;
  fitArticles: Mock;
  _dragPointerTracker: { destroy: Mock };
}

const histropedia = vi.hoisted(() => ({ instances: [] as MockHistropedia[] }));

vi.mock('histropediajs', () => ({
  Timeline: class implements MockHistropedia {
    articles: Array<{ id: string; title: string }> = [];
    select = vi.fn();
    setStartDate = vi.fn();
    fitArticles = vi.fn();
    _dragPointerTracker = { destroy: vi.fn() };
    constructor() {
      histropedia.instances.push(this);
    }
    load(articles: Array<{ id: string; title: string }>) {
      this.articles.push(...articles);
    }
    loadLanes() {}
    loadTimeBands() {}
    getWidth() {
      return 800;
    }
    setSize() {}
    setOption() {}
    redraw() {}
    disableZoomByWheel() {}
  },
}));

const mockTimelineData: TimelineData = {
  title: {
    text: {
      headline: 'Test Timeline',
      text: 'A timeline for testing',
    },
  },
  events: [
    {
      start_date: {
        year: 2024,
        month: 1,
        day: 1,
      },
      text: {
        headline: 'Event 1',
        text: 'First event',
      },
    },
    {
      start_date: {
        year: 2024,
        month: 6,
        day: 15,
      },
      text: {
        headline: 'Event 2',
        text: 'Second event',
      },
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
      const { container } = render(<Timeline data={mockTimelineData} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Timeline data={mockTimelineData} className="custom-timeline" />
      );
      expect(container.firstChild).toHaveClass('custom-timeline');
    });

    it('renders children', () => {
      render(
        <Timeline data={mockTimelineData}>
          <div data-testid="child">Child content</div>
        </Timeline>
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('toggles fullscreen class', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Timeline data={mockTimelineData}>
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
        <Timeline data={mockTimelineData}>
          <TimelineHeader>
            <span data-testid="header-content">Header</span>
          </TimelineHeader>
        </Timeline>
      );
      expect(screen.getByTestId('header-content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <Timeline data={mockTimelineData}>
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
        <Timeline data={mockTimelineData}>
          <TimelineTitle />
        </Timeline>
      );
      expect(screen.getByText('Test Timeline')).toBeInTheDocument();
    });

    it('renders custom title when children provided', () => {
      render(
        <Timeline data={mockTimelineData}>
          <TimelineTitle>Custom Title</TimelineTitle>
        </Timeline>
      );
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders default title when no data title', () => {
      const dataWithoutTitle: TimelineData = {
        events: mockTimelineData.events,
      };
      render(
        <Timeline data={dataWithoutTitle}>
          <TimelineTitle />
        </Timeline>
      );
      expect(screen.getByText('Timeline')).toBeInTheDocument();
    });
  });

  describe('TimelineActions', () => {
    it('renders actions container with children', () => {
      render(
        <Timeline data={mockTimelineData}>
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
        <Timeline data={mockTimelineData}>
          <TimelineCopyButton />
        </Timeline>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows copy icon initially', () => {
      render(
        <Timeline data={mockTimelineData}>
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
        <Timeline data={mockTimelineData}>
          <TimelineCopyButton />
        </Timeline>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          JSON.stringify(mockTimelineData, null, 2)
        );
      });
    });

    it('shows check icon after successful copy', async () => {
      const user = userEvent.setup();
      render(
        <Timeline data={mockTimelineData}>
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
        <Timeline data={mockTimelineData}>
          <TimelineFullscreenButton />
        </Timeline>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('toggles fullscreen state on click', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Timeline data={mockTimelineData}>
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
        <Timeline data={mockTimelineData}>
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
        <Timeline data={mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );
      // The content wrapper div is always present after mount
      expect(container.querySelector('.relative.flex-1')).toBeInTheDocument();
    });

    it('renders timeline container after mount', async () => {
      const { container } = render(
        <Timeline data={mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );

      await waitFor(() => {
        const timelineDiv = container.querySelector('[id^="timeline-"]');
        expect(timelineDiv).toBeInTheDocument();
      });
    });

    it('applies custom height from options', async () => {
      const { container } = render(
        <Timeline data={mockTimelineData} options={{ height: 800 }}>
          <TimelineContent />
        </Timeline>
      );

      await waitFor(() => {
        const timelineDiv = container.querySelector('[id^="timeline-"]');
        expect(timelineDiv).toHaveStyle({ height: '800px' });
      });
    });

    it('applies custom width from options', async () => {
      const { container } = render(
        <Timeline data={mockTimelineData} options={{ width: '80%' }}>
          <TimelineContent />
        </Timeline>
      );

      await waitFor(() => {
        const timelineDiv = container.querySelector('[id^="timeline-"]');
        expect(timelineDiv).toHaveStyle({ width: '80%' });
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
        <Timeline data={mockTimelineData}>
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

      // In the header, and in the details panel while no event is selected
      expect(screen.getByRole('heading', { level: 3, name: 'Test Timeline' })).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(2);
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
          <Timeline ref={ref} data={mockTimelineData}>
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

    it('navigates slides with the title slide at index 0', async () => {
      const ref = { current: null as TimelineRef | null };
      const data: TimelineData = {
        ...mockTimelineData,
        events: [
          { ...mockTimelineData.events[1], unique_id: 'later' },
          { ...mockTimelineData.events[0], unique_id: 'earlier' },
        ],
      };
      render(
        <Timeline ref={ref} data={data}>
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      const canvas = histropedia.instances[0];
      await waitFor(() => expect(ref.current?.getData(1)).not.toBeNull());

      // Slides are chronological, as in TimelineJS
      expect(ref.current?.getData(0)).toBe(data.title);
      expect(ref.current?.getData(1)?.unique_id).toBe('earlier');
      expect(ref.current?.getDataById('later')?.text?.headline).toBe('Event 2');

      act(() => ref.current?.goToNext());
      expect(canvas.select).toHaveBeenLastCalledWith('earlier');
      expect(await screen.findByText('First event')).toBeInTheDocument();

      act(() => ref.current?.goToEnd());
      expect(canvas.select).toHaveBeenLastCalledWith('later');
      expect(await screen.findByText('Second event')).toBeInTheDocument();
    });
  });

  describe('Histropedia canvas', () => {
    it('loads every dated event as an article and fits them in view', async () => {
      render(
        <Timeline data={mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      const canvas = histropedia.instances[0];
      expect(canvas.articles.map((article) => article.title)).toEqual(['Event 1', 'Event 2']);
      expect(canvas.fitArticles).toHaveBeenCalled();
      // The title slide's text introduces the timeline; the first event starts selected
      expect(screen.getByText('A timeline for testing')).toBeInTheDocument();
      expect(canvas.select).toHaveBeenLastCalledWith('event-0');
      expect(await screen.findByText('First event')).toBeInTheDocument();
    });

    it('opens on start_at_slide', async () => {
      render(
        <Timeline data={mockTimelineData} options={{ start_at_slide: 2 }}>
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      expect(histropedia.instances[0].select).toHaveBeenCalledWith('event-1');
      expect(await screen.findByText('Second event')).toBeInTheDocument();
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

    it('shows event text as plain text and only links http(s) media', async () => {
      const ref = { current: null as TimelineRef | null };
      render(
        <Timeline
          ref={ref}
          data={{
            events: [
              {
                unique_id: 'x',
                start_date: { year: 1969 },
                text: { headline: 'Landing', text: '<img src=x onerror="alert(1)">One small step' },
                media: { url: 'javascript:alert(1)' },
              },
            ],
          }}
        >
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(ref.current?.getData(0)).not.toBeNull());
      act(() => ref.current?.goTo(0));

      expect(await screen.findByText('One small step')).toBeInTheDocument();
      expect(document.querySelector('img[src="x"]')).toBeNull();
      expect(screen.queryByText('Open media')).toBeNull();
    });

    it('releases the window listeners on unmount', async () => {
      const { unmount } = render(
        <Timeline data={mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );
      await waitFor(() => expect(histropedia.instances).toHaveLength(1));
      unmount();
      expect(histropedia.instances[0]._dragPointerTracker.destroy).toHaveBeenCalled();
    });
  });
});
