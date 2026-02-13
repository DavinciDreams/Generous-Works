/**

 * A2UI Navigation Component Adapters
 * Tabs, TabPanel, Breadcrumb, Pagination
 */

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createAdapter, extractValue } from '../adapter';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Tabs component
export const TabsAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const tabItems = a2ui.tabItems ?? a2ui.items ?? [];
    const defaultValue = extractValue(a2ui.defaultValue) ??
                         (tabItems[0] ? `tab-${0}` : 'tab-0');

    return {
      children: (
  // @ts-ignore
        <Tabs defaultValue={defaultValue} className="w-full">
  // @ts-ignore
          <TabsList>
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
            {tabItems.map((item: unknown, index: number) => {
              const title = extractValue((item as any).title) ?? extractValue((item as any).label) ?? `Tab ${(index as number) + 1}`;
              const value = extractValue((item as any).value) ?? `tab-${index}`;
  // @ts-ignore

              return (
  // @ts-ignore
                <TabsTrigger key={(value as React.ReactNode)} value={(value as React.ReactNode)}>
                  {(title as React.ReactNode)}
                </TabsTrigger>
  // @ts-ignore
              );
            })}
          </TabsList>
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
          {tabItems.map((item: any, index: number) => {
  // @ts-ignore
            const value = extractValue((item as any).value) ?? `tab-${index}`;
            const content = extractValue((item as any).content) ?? '';

            return (
  // @ts-ignore
              <TabsContent key={(value as React.ReactNode)} value={(value as React.ReactNode)}>
                {(content as React.ReactNode)}
              </TabsContent>
            );
          })}
        </Tabs>
      ),
    } as any;
  },
  // @ts-ignore
  displayName: 'A2UI(Tabs)',
});

// TabPanel component (individual tab content)
export const TabPanelAdapter = createAdapter(TabsContent, {
  // @ts-ignore
  mapProps: (a2ui, ctx) => {
    const value = extractValue(a2ui.value) ?? 'default';

    return {
      value,
      children: ctx.children,
    } as any;
  },
  displayName: 'A2UI(TabPanel)',
});

// Breadcrumb component
export const BreadcrumbAdapter = createAdapter('nav', {
  mapProps: (a2ui, ctx) => {
    const items = a2ui.items ?? [];
  // @ts-ignore

    return {
  // @ts-ignore
      'aria-label': 'Breadcrumb',
  // @ts-ignore
      className: 'flex',
      children: (
        <ol className="flex items-center space-x-2">
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
          {(Array.Array.Array.isArray(items) ? items : []).map((item: unknown, index: number) => {
            const label = extractValue((item as any).label) ?? extractValue((item as any).text);
  // @ts-ignore
            const href = extractValue(item.href) ?? extractValue(item.url);
  // @ts-ignore
            const isLast = index === (a2ui.items as any[]).length - 1;

            return (
              <li key={index} className="flex items-center">
                {href && !isLast ? (
                  <a
  // @ts-ignore
                    href={href}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {(label as React.ReactNode)}
                  </a>
                ) : (
                  <span className={cn(
                    'text-sm font-medium',
                    isLast ? 'text-foreground' : 'text-muted-foreground'
                  )}>
                    {(label as React.ReactNode)}
                  </span>
                )}
                {!isLast && (
                  <span className="mx-2 text-muted-foreground">/</span>
                )}
              </li>
            );
          })}
        </ol>
      ),
    } as any;
  },
  displayName: 'A2UI(Breadcrumb)',
});

// Alias
export const BreadcrumbsAdapter = BreadcrumbAdapter;

  // @ts-ignore
// Pagination component
export const PaginationAdapter = createAdapter('nav', {
  mapProps: (a2ui, ctx) => {
    const currentPage = extractValue(a2ui.currentPage) ?? extractValue(a2ui.page) ?? 1;
    const totalPages = extractValue(a2ui.totalPages) ?? extractValue(a2ui.total) ?? 1;
    const onPageChange = a2ui.action;

    const handlePageChange = (page: number) => {
      if (onPageChange) {
        ctx.onAction({
  // @ts-ignore
          actionName: onPageChange.name,
          sourceComponentId: ctx.componentId,
          timestamp: new Date().toISOString(),
  // @ts-ignore
          context: { page },
  // @ts-ignore
        });
      }
    };

    return {
      'aria-label': 'Pagination',
      className: 'flex items-center justify-center space-x-2',
      children: (
        <>
          <button
  // @ts-ignore
            onClick={() => handlePageChange(currentPage - 1)}
  // @ts-ignore
  // @ts-ignore
            disabled={currentPage <= 1}
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
              'h-10 px-4 py-2',
              'hover:bg-accent hover:text-accent-foreground',
              'disabled:pointer-events-none disabled:opacity-50'
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="ml-2">Previous</span>
          </button>

          <div className="flex items-center space-x-1">
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={cn(
  // @ts-ignore
                    'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
                    'h-10 w-10',
                    page === currentPage
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
  // @ts-ignore
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
              'h-10 px-4 py-2',
              'hover:bg-accent hover:text-accent-foreground',
              'disabled:pointer-events-none disabled:opacity-50'
            )}
          >
            <span className="mr-2">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      ),
    } as any;
  },
  displayName: 'A2UI(Pagination)',
});
