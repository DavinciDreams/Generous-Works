/**
 * A2UI Disclosure & Overlay Component Adapters
 * Accordion, AccordionItem, Collapsible, Dialog, Sheet, Popover, DropdownMenu, HoverCard
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { createAdapter, extractValue } from '../adapter';
import { cn } from '@/lib/utils';

// Accordion component
export const AccordionAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const items = a2ui.items ?? [];
    const type = extractValue(a2ui.type) ?? 'single';
    const collapsible = extractValue(a2ui.collapsible) ?? true;

    return {
      children: (
        <Accordion type={type} collapsible={collapsible} className="w-full">
          {items.map((item: any, index: number) => {
            const value = extractValue(item.value) ?? `item-${index}`;
            const title = extractValue(item.title) ?? extractValue(item.trigger);
            const content = extractValue(item.content);

            return (
              <AccordionItem key={value} value={value}>
                <AccordionTrigger>{title}</AccordionTrigger>
                <AccordionContent>{content}</AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      ),
    };
  },
  displayName: 'A2UI(Accordion)',
});

// AccordionItem component (individual item)
export const AccordionItemAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const value = extractValue(a2ui.value) ?? 'default';
    const title = extractValue(a2ui.title) ?? extractValue(a2ui.trigger);

    return {
      children: (
        <AccordionItem value={value}>
          <AccordionTrigger>{title}</AccordionTrigger>
          <AccordionContent>{ctx.children}</AccordionContent>
        </AccordionItem>
      ),
    };
  },
  displayName: 'A2UI(AccordionItem)',
});

// Collapsible component
export const CollapsibleAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const trigger = extractValue(a2ui.trigger) ?? 'Toggle';
    const defaultOpen = extractValue(a2ui.defaultOpen) ?? false;

    return {
      children: (
        <Collapsible defaultOpen={defaultOpen}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4">
            {trigger}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4">
            {ctx.children}
          </CollapsibleContent>
        </Collapsible>
      ),
    };
  },
  displayName: 'A2UI(Collapsible)',
});

// Dialog component
export const DialogAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const trigger = extractValue(a2ui.trigger) ?? extractValue(a2ui.entryPointChild);
    const title = extractValue(a2ui.title);
    const description = extractValue(a2ui.description);
    const content = extractValue(a2ui.content) ?? extractValue(a2ui.contentChild);

    return {
      children: (
        <Dialog>
          <DialogTrigger asChild>
            {trigger || <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Open</button>}
          </DialogTrigger>
          <DialogContent>
            {(title || description) && (
              <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
            )}
            {content || ctx.children}
          </DialogContent>
        </Dialog>
      ),
    };
  },
  displayName: 'A2UI(Dialog)',
});

// Alias
export const ModalAdapter = DialogAdapter;

// Sheet component (simplified as Dialog with different styling)
export const SheetAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const trigger = extractValue(a2ui.trigger);
    const title = extractValue(a2ui.title);
    const description = extractValue(a2ui.description);
    const side = extractValue(a2ui.side) ?? 'right';

    return {
      children: (
        <Dialog>
          <DialogTrigger asChild>
            {trigger || <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Open Sheet</button>}
          </DialogTrigger>
          <DialogContent className={cn(
            'fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out',
            side === 'right' && 'inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
            side === 'left' && 'inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
            side === 'top' && 'inset-x-0 top-0 border-b',
            side === 'bottom' && 'inset-x-0 bottom-0 border-t'
          )}>
            {(title || description) && (
              <DialogHeader>
                {title && <DialogTitle>{title}</DialogTitle>}
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
            )}
            {ctx.children}
          </DialogContent>
        </Dialog>
      ),
    };
  },
  displayName: 'A2UI(Sheet)',
});

// Alias
export const DrawerAdapter = SheetAdapter;

// Popover component
export const PopoverAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const trigger = extractValue(a2ui.trigger);
    const content = extractValue(a2ui.content);
    const side = extractValue(a2ui.side) ?? 'bottom';
    const align = extractValue(a2ui.align) ?? 'center';

    return {
      children: (
        <Popover>
          <PopoverTrigger asChild>
            {trigger || <button className="px-4 py-2 rounded-md border">Open</button>}
          </PopoverTrigger>
          <PopoverContent side={side} align={align}>
            {content || ctx.children}
          </PopoverContent>
        </Popover>
      ),
    };
  },
  displayName: 'A2UI(Popover)',
});

// DropdownMenu component
export const DropdownMenuAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const trigger = extractValue(a2ui.trigger);
    const items = a2ui.items ?? [];

    return {
      children: (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {trigger || <button className="px-4 py-2 rounded-md border">Menu</button>}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {items.map((item: any, index: number) => {
              const label = extractValue(item.label) ?? extractValue(item.text);
              const action = item.action;

              return (
                <DropdownMenuItem
                  key={index}
                  onClick={() => {
                    if (action) {
                      ctx.onAction({
                        actionName: action.name,
                        sourceComponentId: ctx.componentId,
                        timestamp: new Date().toISOString(),
                        context: { item: label },
                      });
                    }
                  }}
                >
                  {label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    };
  },
  displayName: 'A2UI(DropdownMenu)',
});

// Alias
export const MenuAdapter = DropdownMenuAdapter;

// HoverCard component
export const HoverCardAdapter = createAdapter('div', {
  mapProps: (a2ui, ctx) => {
    const trigger = extractValue(a2ui.trigger);
    const content = extractValue(a2ui.content);

    return {
      children: (
        <HoverCard>
          <HoverCardTrigger asChild>
            {trigger || <span className="underline cursor-pointer">Hover me</span>}
          </HoverCardTrigger>
          <HoverCardContent>
            {content || ctx.children}
          </HoverCardContent>
        </HoverCard>
      ),
    };
  },
  displayName: 'A2UI(HoverCard)',
});
