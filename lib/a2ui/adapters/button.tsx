/**
 * A2UI Button Adapter
 * Maps A2UI Button properties to shadcn Button component
 */

import { Button } from '@/components/ui/button';
import { createAdapter, extractValue, createActionHandler } from '../adapter';

export const ButtonAdapter = createAdapter(Button, {
  mapProps: (a2ui, ctx) => {
    // Extract variant with mapping
    const variantRaw = extractValue(a2ui.variant);
    const variantMap: Record<string, any> = {
      filled: 'default',
      outline: 'outline',
      subtle: 'ghost',
      default: 'default',
    };
    const variant = variantMap[variantRaw] ?? 'default';

    // Extract other properties
    const fullWidth = extractValue(a2ui.fullWidth) ?? false;
    const compact = extractValue(a2ui.compact) ?? false;
    const disabled = extractValue(a2ui.disabled) ?? false;

    return {
      variant,
      className: `${fullWidth ? 'w-full' : ''} ${compact ? 'h-8 px-3 py-1' : ''}`.trim(),
      onClick: createActionHandler(a2ui.action, ctx),
      disabled,
      children: ctx.children,
    };
  },
  displayName: 'A2UI(Button)',
});
