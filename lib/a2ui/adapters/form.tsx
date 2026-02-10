/**
 * A2UI Form Component Adapters
 * Checkbox, Switch, Select, RadioGroup, Slider, Textarea
 */

import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { createAdapter, extractValue, createActionHandler } from '../adapter';

// Checkbox
export const CheckboxAdapter = createAdapter(Checkbox, {
  mapProps: (a2ui, ctx) => {
    const checked = extractValue(a2ui.checked) ?? extractValue(a2ui.value) ?? false;
    const disabled = extractValue(a2ui.disabled) ?? false;

    return {
      checked,
      disabled,
      onCheckedChange: (value: boolean) => {
        if (a2ui.action) {
          ctx.onAction({
            actionName: a2ui.action.name,
            sourceComponentId: ctx.componentId,
            timestamp: new Date().toISOString(),
            context: { checked: value },
          });
        }
      },
    };
  },
  displayName: 'A2UI(Checkbox)',
});

// Alias
export const CheckBoxAdapter = CheckboxAdapter;

// Switch
export const SwitchAdapter = createAdapter(Switch, {
  mapProps: (a2ui, ctx) => {
    const checked = extractValue(a2ui.checked) ?? extractValue(a2ui.value) ?? false;
    const disabled = extractValue(a2ui.disabled) ?? false;

    return {
      checked,
      disabled,
      onCheckedChange: (value: boolean) => {
        if (a2ui.action) {
          ctx.onAction({
            actionName: a2ui.action.name,
            sourceComponentId: ctx.componentId,
            timestamp: new Date().toISOString(),
            context: { checked: value },
          });
        }
      },
    };
  },
  displayName: 'A2UI(Switch)',
});

// Alias
export const ToggleAdapter = SwitchAdapter;

// Textarea
export const TextareaAdapter = createAdapter(Textarea, {
  mapProps: (a2ui, ctx) => {
    const placeholder = extractValue(a2ui.placeholder) ?? '';
    const disabled = extractValue(a2ui.disabled) ?? false;
    const value = extractValue(a2ui.text) ?? extractValue(a2ui.value) ?? '';
    const rows = extractValue(a2ui.rows) ?? 3;

    return {
      placeholder,
      disabled,
      value,
      rows,
      onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  displayName: 'A2UI(Textarea)',
});

// Alias
export const TextAreaAdapter = TextareaAdapter;

// Slider
export const SliderAdapter = createAdapter(Slider, {
  mapProps: (a2ui, ctx) => {
    const min = extractValue(a2ui.min) ?? 0;
    const max = extractValue(a2ui.max) ?? 100;
    const step = extractValue(a2ui.step) ?? 1;
    const value = extractValue(a2ui.value) ?? [min];
    const disabled = extractValue(a2ui.disabled) ?? false;

    return {
      min,
      max,
      step,
      value: Array.isArray(value) ? value : [value],
      disabled,
      onValueChange: (values: number[]) => {
        if (a2ui.action) {
          ctx.onAction({
            actionName: a2ui.action.name,
            sourceComponentId: ctx.componentId,
            timestamp: new Date().toISOString(),
            context: { value: values[0], values },
          });
        }
      },
    };
  },
  displayName: 'A2UI(Slider)',
});

// NumberInput - using regular input with type="number"
export const NumberInputAdapter = createAdapter('input', {
  mapProps: (a2ui, ctx) => {
    const min = extractValue(a2ui.min);
    const max = extractValue(a2ui.max);
    const step = extractValue(a2ui.step) ?? 1;
    const value = extractValue(a2ui.value) ?? '';
    const disabled = extractValue(a2ui.disabled) ?? false;
    const placeholder = extractValue(a2ui.placeholder) ?? '';

    return {
      type: 'number',
      min,
      max,
      step,
      value,
      disabled,
      placeholder,
      className: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (a2ui.action) {
          ctx.onAction({
            actionName: a2ui.action.name,
            sourceComponentId: ctx.componentId,
            timestamp: new Date().toISOString(),
            context: { value: parseFloat(e.target.value) },
          });
        }
      },
    };
  },
  displayName: 'A2UI(NumberInput)',
});
