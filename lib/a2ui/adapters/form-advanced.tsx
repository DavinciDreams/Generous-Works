/**

 * A2UI Advanced Form Component Adapters
 * Select, RadioGroup, MultiSelect, DateTimeInput, ActionIcon
 */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createAdapter, extractValue, createActionHandler } from '../adapter';
import { cn } from '@/lib/utils';

// Select component
export const SelectAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const options = a2ui.options ?? a2ui.items ?? [];
    const placeholder = extractValue(a2ui.placeholder) ?? 'Select an option';
    const defaultValue = extractValue(a2ui.defaultValue) ?? extractValue(a2ui.value);
    const disabled = extractValue(a2ui.disabled) ?? false;

    return {
      children: (
        <Select
  // @ts-ignore
  // @ts-ignore
          defaultValue={defaultValue}
  // @ts-ignore
          disabled={disabled}
          onValueChange={(value) => {
            if (a2ui.action) {
              ctx.onAction({
                actionName: (a2ui.action as any)?.name || "",
                sourceComponentId: ctx.componentId,
                timestamp: new Date().toISOString(),
                context: { value },
              });
            }
          }}
  // @ts-ignore
        >
          <SelectTrigger>
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
  // @ts-ignore
  // @ts-ignore
            {(Array.isArray(options) ? options : []).map((option: unknown, index: number) => {
              const value = extractValue((option as any).value) ?? extractValue(option);
              const label = extractValue((option as any).label) ?? extractValue((option as any).text) ?? value;

              return (
                <SelectItem key={index} value={String(value)}>
                  {(label as React.ReactNode)}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      ),
    } as any;
  },
  displayName: 'A2UI(Select)',
});

// RadioGroup component
export const RadioGroupAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const options = a2ui.options ?? a2ui.items ?? [];
    const defaultValue = extractValue(a2ui.defaultValue) ?? extractValue(a2ui.value);
  // @ts-ignore
    const disabled = extractValue(a2ui.disabled) ?? false;

    return {
      className: 'space-y-2',
  // @ts-ignore
      children: (Array.isArray(options) ? options : []).map((option: unknown, index: number) => {
        const value = extractValue((option as any).value) ?? extractValue(option);
        const label = extractValue((option as any).label) ?? extractValue((option as any).text) ?? value;
        const checked = value === defaultValue;

        return (
          <label key={index} className="flex items-center space-x-2 cursor-pointer">
  // @ts-ignore
            <input
              type="radio"
              name={ctx.componentId}
              value={String(value)}
              defaultChecked={checked}
  // @ts-ignore
              disabled={disabled}
              onChange={(e) => {
                if (a2ui.action && e.target.checked) {
                  ctx.onAction({
                    actionName: (a2ui.action as any)?.name || "",
                    sourceComponentId: ctx.componentId,
                    timestamp: new Date().toISOString(),
                    context: { value: e.target.value },
                  });
                }
              }}
              className="h-4 w-4 rounded-full border border-primary text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {(label as React.ReactNode)}
            </span>
          </label>
        );
      }),
    } as any;
  },
  displayName: 'A2UI(RadioGroup)',
});

// MultiSelect component (simplified as multiple checkboxes)
export const MultiSelectAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const options = a2ui.options ?? a2ui.items ?? [];
    const defaultValue = extractValue(a2ui.defaultValue) ?? extractValue(a2ui.value) ?? [];
  // @ts-ignore
    const disabled = extractValue(a2ui.disabled) ?? false;

  // @ts-ignore
    const selectedValues = new Set(Array.Array.isArray(defaultValue) ? defaultValue : [defaultValue]);

    return {
      className: 'space-y-2',
  // @ts-ignore
      children: (Array.isArray(options) ? options : []).map((option: unknown, index: number) => {
        const value = extractValue((option as any).value) ?? extractValue(option);
        const label = extractValue((option as any).label) ?? extractValue((option as any).text) ?? value;
        const checked = selectedValues.has(value);
  // @ts-ignore

        return (
          <label key={index} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              value={String(value)}
              defaultChecked={checked}
  // @ts-ignore
              disabled={disabled}
              onChange={(e) => {
                if (a2ui.action) {
                  const newValues = Array.from(selectedValues);
                  if (e.target.checked) {
                    newValues.push(value);
                  } else {
                    const idx = newValues.indexOf(value);
                    if (idx > -1) newValues.splice(idx, 1);
                  }

                  ctx.onAction({
                    actionName: (a2ui.action as any)?.name || "",
                    sourceComponentId: ctx.componentId,
                    timestamp: new Date().toISOString(),
                    context: { values: newValues },
                  });
                }
              }}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {(label as React.ReactNode)}
            </span>
          </label>
        );
      }),
    } as any;
  },
  displayName: 'A2UI(MultiSelect)',
});

// DateTimeInput component
export const DateTimeInputAdapter = createAdapter('input', {
  mapProps: (a2ui, ctx) => {
    const value = extractValue(a2ui.value) ?? '';
    const disabled = extractValue(a2ui.disabled) ?? false;
    const placeholder = extractValue(a2ui.placeholder) ?? '';
    const mode = extractValue(a2ui.mode) ?? 'date'; // date, time, datetime-local

    return {
      type: mode,
      value,
      disabled,
      placeholder,
      className: cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
        'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        'placeholder:text-muted-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50'
      ),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        if (a2ui.action) {
          ctx.onAction({
            actionName: (a2ui.action as any)?.name || "",
            sourceComponentId: ctx.componentId,
            timestamp: new Date().toISOString(),
            context: { value: e.target.value },
          });
        }
      },
    } as any;
  },
  displayName: 'A2UI(DateTimeInput)',
});

// ActionIcon / IconButton component
export const ActionIconAdapter = createAdapter('button', {
  mapProps: (a2ui, ctx) => {
    const icon = extractValue(a2ui.icon);
    const variant = extractValue(a2ui.variant) ?? 'default';
    const size = extractValue(a2ui.size) ?? 'default';
    const disabled = extractValue(a2ui.disabled) ?? false;

    const variantClasses: Record<string, string> = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
    };

    const sizeClasses: Record<string, string> = {
  // @ts-ignore
      default: 'h-10 w-10',
      sm: 'h-8 w-8',
      lg: 'h-12 w-12',
    };

  // @ts-ignore
    return {
  // @ts-ignore
      type: 'button',
      disabled,
  // @ts-ignore
      onClick: createActionHandler(a2ui.action as any, ctx),
      className: cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
  // @ts-ignore
        variantClasses[variant] ?? variantClasses.default,
  // @ts-ignore
        sizeClasses[size] ?? sizeClasses.default
      ),
      children: icon || ctx.children,
    } as any;
  },
  displayName: 'A2UI(ActionIcon)',
});

// Alias
export const IconButtonAdapter = ActionIconAdapter;
