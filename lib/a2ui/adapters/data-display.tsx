/**
 * A2UI Data Display Component Adapters
 * List, Table, TableHeader, TableBody, TableRow, TableCell, Skeleton, Image, Avatar
 */

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createAdapter, extractValue } from '../adapter';
import { cn } from '@/lib/utils';

// List component
export const ListAdapter = createAdapter('ul', {
  mapProps: (a2ui, ctx) => {
    const items = a2ui.items ?? [];
    const ordered = extractValue(a2ui.ordered) ?? false;
    const direction = extractValue(a2ui.direction) ?? 'vertical';

    const Element = ordered ? 'ol' : 'ul';

    return {
      as: Element,
      className: cn(
        'list-none',
        direction === 'horizontal' ? 'flex flex-row space-x-2' : 'flex flex-col space-y-2'
      ),
      children: (items as any[]).length > 0 ? (
        (items as any[]).map((item: unknown, index: number) => {
          const content = (extractValue((item as any).content) ?? extractValue((item as any).text) ?? extractValue(item)) as React.ReactNode;
          return (
            <li key={index} className="text-sm">
              {content}
            </li>
          );
        })
      ) : ctx.children,
    };
  },
  displayName: 'A2UI(List)',
});

// Table component
export const TableAdapter = createAdapter('table', {
  mapProps: (a2ui, ctx) => {
    return {
      className: 'w-full caption-bottom text-sm',
      children: ctx.children,
    };
  },
  displayName: 'A2UI(Table)',
});

// TableHeader component
export const TableHeaderAdapter = createAdapter('thead', {
  mapProps: (a2ui, ctx) => {
    return {
      className: '[&_tr]:border-b',
      children: ctx.children,
    };
  },
  displayName: 'A2UI(TableHeader)',
});

// TableBody component
export const TableBodyAdapter = createAdapter('tbody', {
  mapProps: (a2ui, ctx) => {
    return {
      className: '[&_tr:last-child]:border-0',
      children: ctx.children,
    };
  },
  displayName: 'A2UI(TableBody)',
});

// TableRow component
export const TableRowAdapter = createAdapter('tr', {
  mapProps: (a2ui, ctx) => {
    const cells = a2ui.cells as any[] ?? [];

    return {
      className: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
      children: cells.length > 0 ? (
        cells.map((cell: any, index: number) => {
          const content = (extractValue(cell.content) ?? extractValue(cell)) as React.ReactNode;
          return (
            <td key={index} className="p-4 align-middle">
              {content}
            </td>
          );
        })
      ) : ctx.children,
    };
  },
  displayName: 'A2UI(TableRow)',
});

// TableCell component
export const TableCellAdapter = createAdapter('td', {
  mapProps: (a2ui, ctx) => {
    const header = extractValue(a2ui.header) ?? false;
    const Element = header ? 'th' : 'td';

    return {
      as: Element,
      className: cn(
        'p-4 align-middle',
        header && 'h-12 px-4 text-left align-middle font-medium text-muted-foreground'
      ),
      children: ctx.children,
    };
  },
  displayName: 'A2UI(TableCell)',
});

// Skeleton component
export const SkeletonAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const width = extractValue(a2ui.width) ?? '100%';
    const height = extractValue(a2ui.height) ?? '1rem';
    const circle = extractValue(a2ui.circle) ?? false;

    return {
      className: cn('animate-pulse rounded-md bg-muted', circle && 'rounded-full'),
      style: {
        width,
        height,
      },
    };
  },
  displayName: 'A2UI(Skeleton)',
});

// Image component
export const ImageAdapter = createAdapter('img', {
  mapProps: (a2ui, ctx) => {
    const src = extractValue(a2ui.src) ?? extractValue(a2ui.url);
    const alt = extractValue(a2ui.alt) ?? '';
    const width = extractValue(a2ui.width);
    const height = extractValue(a2ui.height);
    const usageHint = extractValue(a2ui.usageHint);

    // Map usage hints to sizes
    const sizeClasses: Record<string, string> = {
      icon: 'w-4 h-4',
      avatar: 'w-10 h-10 rounded-full',
      smallFeature: 'w-32 h-32',
      mediumFeature: 'w-64 h-64',
      largeFeature: 'w-96 h-96',
      header: 'w-full h-48 object-cover',
    };

    return {
      src: src as string | Blob | undefined,
      alt: alt as string,
      width,
      height,
      className: cn(
        'object-cover',
        usageHint && sizeClasses[usageHint as string]
      ),
    };
  },
  displayName: 'A2UI(Image)',
});

// Avatar component
export const AvatarAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const src = extractValue(a2ui.src) ?? extractValue(a2ui.url);
    const alt = (extractValue(a2ui.alt) ?? extractValue(a2ui.name) ?? '') as string;
    const fallback = extractValue(a2ui.fallback) ?? alt.slice(0, 2).toUpperCase();

    return {
      children: (
        <Avatar>
          {src && <AvatarImage src={src as string | Blob} alt={alt} />}
          <AvatarFallback>{fallback as React.ReactNode}</AvatarFallback>
        </Avatar>
      ),
    };
  },
  displayName: 'A2UI(Avatar)',
});
