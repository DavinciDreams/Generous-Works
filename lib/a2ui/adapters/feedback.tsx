/**
 * A2UI Feedback Component Adapters
 * Alert, Progress, Spinner, Toast, Tooltip
 */

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { createAdapter, extractValue } from '../adapter';
import { cn } from '@/lib/utils';

// Alert component
export const AlertAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const variant = extractValue(a2ui.variant) ?? 'default';
    const title = extractValue(a2ui.title);
    const description = extractValue(a2ui.description) ?? extractValue(a2ui.text);

    const variantClasses: Record<string, string> = {
      default: 'bg-background text-foreground',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      warning: 'border-yellow-500/50 text-yellow-900 dark:text-yellow-100',
      success: 'border-green-500/50 text-green-900 dark:text-green-100',
    };

    return {
      className: cn(
        'relative w-full rounded-lg border p-4',
        variantClasses[variant] ?? variantClasses.default
      ),
      children: (
        <>
          {title && (
            <div className="mb-1 font-medium leading-none tracking-tight">
              {title}
            </div>
          )}
          {description && (
            <div className="text-sm [&_p]:leading-relaxed">
              {description}
            </div>
          )}
          {!title && !description && ctx.children}
        </>
      ),
    };
  },
  displayName: 'A2UI(Alert)',
});

// Progress component
export const ProgressAdapter = createAdapter(Progress, {
  mapProps: (a2ui, ctx) => {
    const value = extractValue(a2ui.value) ?? 0;
    const max = extractValue(a2ui.max) ?? 100;

    return {
      value,
      max,
      className: 'w-full',
    };
  },
  displayName: 'A2UI(Progress)',
});

// Spinner component
export const SpinnerAdapter = createAdapter(Spinner, {
  mapProps: (a2ui, ctx) => {
    const size = extractValue(a2ui.size) ?? 'default';
    const variant = extractValue(a2ui.variant) ?? 'default';

    return {
      size,
      variant,
    };
  },
  displayName: 'A2UI(Spinner)',
});

// Aliases for Spinner
export const LoaderAdapter = SpinnerAdapter;
export const LoadingAdapter = SpinnerAdapter;

// Toast component (simplified - usually uses a toast system)
export const ToastAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const title = extractValue(a2ui.title);
    const description = extractValue(a2ui.description) ?? extractValue(a2ui.text);
    const variant = extractValue(a2ui.variant) ?? 'default';

    const variantClasses: Record<string, string> = {
      default: 'bg-background text-foreground',
      destructive: 'bg-destructive text-destructive-foreground',
      success: 'bg-green-600 text-white',
    };

    return {
      className: cn(
        'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        variantClasses[variant] ?? variantClasses.default
      ),
      children: (
        <div className="grid gap-1">
          {title && <div className="text-sm font-semibold">{title}</div>}
          {description && <div className="text-sm opacity-90">{description}</div>}
          {!title && !description && ctx.children}
        </div>
      ),
    };
  },
  displayName: 'A2UI(Toast)',
});

// Tooltip component
export const TooltipAdapter = createAdapter(TooltipProvider, {
  mapProps: (a2ui, ctx) => {
    const content = extractValue(a2ui.content) ?? extractValue(a2ui.text);
    const side = extractValue(a2ui.side) ?? 'top';

    return {
      children: (
        <Tooltip>
          <TooltipTrigger asChild>
            {ctx.children}
          </TooltipTrigger>
          <TooltipContent side={side}>
            {content}
          </TooltipContent>
        </Tooltip>
      ),
    };
  },
  displayName: 'A2UI(Tooltip)',
});
