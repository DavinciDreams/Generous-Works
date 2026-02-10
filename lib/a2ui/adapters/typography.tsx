/**
 * A2UI Typography Adapters
 * Text, Title, Badge, Label, Code, Blockquote components
 */

import { Badge } from '@/components/ui/badge';
import { createAdapter, extractValue } from '../adapter';
import { cn } from '@/lib/utils';

// Text component
export const TextAdapter = createAdapter('p', {
  mapProps: (a2ui, ctx) => {
    const usageHint = extractValue(a2ui.usageHint) ?? 'body';
    const text = extractValue(a2ui.text) ?? ctx.children;

    // Map usage hints to appropriate elements and classes
    const Element = (() => {
      switch (usageHint) {
        case 'h1': return 'h1';
        case 'h2': return 'h2';
        case 'h3': return 'h3';
        case 'h4': return 'h4';
        case 'h5': return 'h5';
        case 'h6': return 'h6';
        case 'caption': return 'span';
        default: return 'p';
      }
    })();

    const className = (() => {
      switch (usageHint) {
        case 'h1': return 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl';
        case 'h2': return 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0';
        case 'h3': return 'scroll-m-20 text-2xl font-semibold tracking-tight';
        case 'h4': return 'scroll-m-20 text-xl font-semibold tracking-tight';
        case 'h5': return 'scroll-m-20 text-lg font-semibold tracking-tight';
        case 'h6': return 'scroll-m-20 text-base font-semibold tracking-tight';
        case 'caption': return 'text-sm text-muted-foreground';
        default: return 'leading-7 [&:not(:first-child)]:mt-6';
      }
    })();

    return {
      className,
      children: text,
    };
  },
  displayName: 'A2UI(Text)',
});

// Title/Heading component (alias for Text with heading hints)
export const TitleAdapter = TextAdapter;
export const HeadingAdapter = TextAdapter;
export const H1Adapter = createAdapter('h1', {
  mapProps: (a2ui, ctx) => ({
    className: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
});
export const H2Adapter = createAdapter('h2', {
  mapProps: (a2ui, ctx) => ({
    className: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
});
export const H3Adapter = createAdapter('h3', {
  mapProps: (a2ui, ctx) => ({
    className: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
});
export const H4Adapter = createAdapter('h4', {
  mapProps: (a2ui, ctx) => ({
    className: 'scroll-m-20 text-xl font-semibold tracking-tight',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
});
export const H5Adapter = createAdapter('h5', {
  mapProps: (a2ui, ctx) => ({
    className: 'scroll-m-20 text-lg font-semibold tracking-tight',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
});
export const H6Adapter = createAdapter('h6', {
  mapProps: (a2ui, ctx) => ({
    className: 'scroll-m-20 text-base font-semibold tracking-tight',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
});

// Badge component
export const BadgeAdapter = createAdapter(Badge, {
  mapProps: (a2ui, ctx) => {
    const variant = extractValue(a2ui.variant) ?? 'default';
    const variantMap: Record<string, any> = {
      filled: 'default',
      outline: 'outline',
      secondary: 'secondary',
      destructive: 'destructive',
    };

    return {
      variant: variantMap[variant] ?? 'default',
      children: extractValue(a2ui.text) ?? ctx.children,
    };
  },
  displayName: 'A2UI(Badge)',
});

// Label component
export const LabelAdapter = createAdapter('label', {
  mapProps: (a2ui, ctx) => ({
    className: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
  displayName: 'A2UI(Label)',
});

// Code component
export const CodeAdapter = createAdapter('code', {
  mapProps: (a2ui, ctx) => ({
    className: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
  displayName: 'A2UI(Code)',
});

// Blockquote component
export const BlockquoteAdapter = createAdapter('blockquote', {
  mapProps: (a2ui, ctx) => ({
    className: 'mt-6 border-l-2 pl-6 italic',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
  displayName: 'A2UI(Blockquote)',
});

// Link component
export const LinkAdapter = createAdapter('a', {
  mapProps: (a2ui, ctx) => ({
    href: extractValue(a2ui.href) ?? extractValue(a2ui.url) ?? '#',
    className: 'font-medium text-primary underline underline-offset-4',
    children: extractValue(a2ui.text) ?? ctx.children,
  }),
  displayName: 'A2UI(Link)',
});
