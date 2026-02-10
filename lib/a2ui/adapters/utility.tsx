/**
 * A2UI Utility Component Adapters
 * Separator, ScrollArea, AspectRatio
 */

import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { createAdapter, extractValue } from '../adapter';
import { cn } from '@/lib/utils';

// Separator component
export const SeparatorAdapter = createAdapter(Separator, {
  mapProps: (a2ui, ctx) => {
    const orientation = extractValue(a2ui.orientation) ?? 'horizontal';
    const decorative = extractValue(a2ui.decorative) ?? true;

    return {
      orientation,
      decorative,
      className: orientation === 'vertical' ? 'h-full' : 'w-full',
    };
  },
  displayName: 'A2UI(Separator)',
});

// Alias
export const DividerAdapter = SeparatorAdapter;

// ScrollArea component
export const ScrollAreaAdapter = createAdapter(ScrollArea, {
  mapProps: (a2ui, ctx) => {
    const height = extractValue(a2ui.height) ?? '100%';
    const width = extractValue(a2ui.width) ?? '100%';

    return {
      className: 'rounded-md border',
      style: {
        height,
        width,
      },
      children: ctx.children,
    };
  },
  displayName: 'A2UI(ScrollArea)',
});

// AspectRatio component
export const AspectRatioAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const ratio = extractValue(a2ui.ratio) ?? 16 / 9;

    return {
      className: 'relative w-full',
      style: {
        paddingBottom: `${(1 / ratio) * 100}%`,
      },
      children: (
        <div className="absolute inset-0">
          {ctx.children}
        </div>
      ),
    };
  },
  displayName: 'A2UI(AspectRatio)',
});
