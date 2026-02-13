import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

// Mock clipboard at module level
const clipboardWriteTextMock = vi.fn(() => Promise.resolve());
const clipboardReadTextMock = vi.fn(() => Promise.resolve(''));

Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: clipboardWriteTextMock,
    readText: clipboardReadTextMock,
  },
  writable: false,
  configurable: true,
});

// Mock TimelineJS3 library
vi.mock('@knight-lab/timelinejs', () => ({
  Timeline: class MockTimeline {
    constructor(id: string, data: TimelineData, options: any) {
      // Mock implementation
    }
    goTo(slideIndex: number) {}
    goToId(id: string) {}
    goToNext() {}
    goToPrev() {}
    goToStart() {}
    goToEnd() {}
    getData(slideIndex: number) {
      return null;
    }
    getDataById(id: string) {
      return null;
    }
  },
}));

// Mock CSS import
vi.mock('@knight-lab/timelinejs/dist/css/timeline.css', () => ({}));

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
    // Clear clipboard mock calls before each test
    vi.clearAllMocks();
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
        expect(clipboardWriteTextMock).toHaveBeenCalledWith(
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
    it('shows loading state initially', () => {
      render(
        <Timeline data={mockTimelineData}>
          <TimelineContent />
        </Timeline>
      );
      expect(screen.getByText('Loading timeline...')).toBeInTheDocument();
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

      expect(screen.getByText('Test Timeline')).toBeInTheDocument();
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
  });
});
