import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { A2UIRenderer } from '../renderer';
import type { A2UIMessage } from '../types';

describe('A2UIRenderer', () => {
  it('renders catalog-shaped StatsDisplay props without the legacy data wrapper', () => {
    const message: A2UIMessage = {
      surfaceUpdate: {
        components: [
          {
            id: 'statsdisplay-1',
            component: {
              StatsDisplay: {
                id: 'stats-1',
                title: 'Business Metrics',
                stats: [
                  {
                    key: 'revenue',
                    label: 'Total Revenue',
                    value: 284500,
                    format: { kind: 'currency', currency: 'USD' },
                  },
                ],
              },
            },
          },
        ],
      },
    };

    expect(() => render(<A2UIRenderer message={message} />)).not.toThrow();
    expect(screen.getByText('Business Metrics')).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
  });

  it('renders validation feedback instead of invoking an invalid component', () => {
    const message: A2UIMessage = {
      surfaceUpdate: {
        components: [
          {
            id: 'statsdisplay-invalid',
            component: {
              StatsDisplay: { id: 'stats-without-items' },
            },
          },
        ],
      },
    };

    expect(() => render(<A2UIRenderer message={message} />)).not.toThrow();
    expect(screen.getByText('Component Error: StatsDisplay')).toBeInTheDocument();
  });
});
