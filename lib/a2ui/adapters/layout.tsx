/**
 * A2UI Layout Adapters
 * Row, Column, Flex, Grid, Box, Container components
 */

import { createPassthroughAdapter, createAdapter } from '../adapter';
import { cn } from '@/lib/utils';

// Row - horizontal flex layout
export const RowAdapter = createAdapter('div' as any, {
  mapProps: (a2ui, ctx) => {
    const distribution = a2ui.distribution ?? 'start';
    const alignment = a2ui.alignment ?? 'center';

    const distributionClasses: Record<string, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      spaceBetween: 'justify-between',
      spaceAround: 'justify-around',
      spaceEvenly: 'justify-evenly',
    };

    const alignmentClasses: Record<string, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    return {
      className: cn(
        'flex flex-row gap-2',
        distributionClasses[distribution],
        alignmentClasses[alignment]
      ),
      children: ctx.children,
    };
  },
  displayName: 'A2UI(Row)',
});

// Column - vertical flex layout
export const ColumnAdapter = createAdapter('div' as any, {
  mapProps: (a2ui, ctx) => {
    const distribution = a2ui.distribution ?? 'start';
    const alignment = a2ui.alignment ?? 'stretch';

    const distributionClasses: Record<string, string> = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      spaceBetween: 'justify-between',
      spaceAround: 'justify-around',
      spaceEvenly: 'justify-evenly',
    };

    const alignmentClasses: Record<string, string> = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
    };

    return {
      className: cn(
        'flex flex-col gap-2',
        distributionClasses[distribution],
        alignmentClasses[alignment]
      ),
      children: ctx.children,
    };
  },
  displayName: 'A2UI(Column)',
});

// Aliases
export const HStackAdapter = RowAdapter;
export const VStackAdapter = ColumnAdapter;
export const StackAdapter = ColumnAdapter;

// Flex - generic flex container
export const FlexAdapter = createAdapter('div' as any, {
  mapProps: (a2ui, ctx) => {
    const direction = a2ui.direction ?? 'row';
    const wrap = a2ui.wrap ?? false;
    const gap = a2ui.gap ?? '2';

    return {
      className: cn(
        'flex',
        direction === 'column' ? 'flex-col' : 'flex-row',
        wrap && 'flex-wrap',
        `gap-${gap}`
      ),
      children: ctx.children,
    };
  },
  displayName: 'A2UI(Flex)',
});

// Grid
export const GridAdapter = createAdapter('div' as any, {
  mapProps: (a2ui, ctx) => {
    const columns = a2ui.columns ?? 'auto-fit';
    const gap = a2ui.gap ?? '4';

    return {
      className: cn('grid', `gap-${gap}`),
      style: {
        gridTemplateColumns: typeof columns === 'number' ? `repeat(${columns}, 1fr)` : columns,
      },
      children: ctx.children,
    };
  },
  displayName: 'A2UI(Grid)',
});

// Box - generic container
export const BoxAdapter = createPassthroughAdapter('div', {
  className: 'block',
});

// Container - centered max-width container
export const ContainerAdapter = createPassthroughAdapter('div', {
  className: 'container mx-auto px-4',
});

// Center - centers children
export const CenterAdapter = createPassthroughAdapter('div', {
  className: 'flex items-center justify-center',
});
