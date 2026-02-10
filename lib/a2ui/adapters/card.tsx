/**
 * A2UI Card Adapter
 * Maps A2UI Card properties to shadcn Card component
 */

import { Card } from '@/components/ui/card';
import { createAdapter } from '../adapter';

export const CardAdapter = createAdapter(Card, {
  mapProps: (a2ui, ctx) => {
    return {
      className: 'p-4',
      children: ctx.children,
    };
  },
  displayName: 'A2UI(Card)',
});
