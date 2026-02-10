/**
 * A2UI Input/TextField Adapter
 * Maps A2UI TextField properties to shadcn Input component
 */

import { Input } from '@/components/ui/input';
import { createAdapter, extractValue, createActionHandler } from '../adapter';

export const InputAdapter = createAdapter(Input, {
  mapProps: (a2ui, ctx) => {
    const placeholder = extractValue(a2ui.placeholder) ?? '';
    const disabled = extractValue(a2ui.disabled) ?? false;
    const value = extractValue(a2ui.text) ?? extractValue(a2ui.value) ?? '';

    return {
      placeholder,
      disabled,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (a2ui.action) {
          ctx.onAction({
            actionName: a2ui.action.name,
            sourceComponentId: ctx.componentId,
            timestamp: new Date().toISOString(),
            context: { value: e.target.value },
          });
        }
      },
    };
  },
  displayName: 'A2UI(Input)',
});

// Alias for TextField
export const TextFieldAdapter = InputAdapter;
