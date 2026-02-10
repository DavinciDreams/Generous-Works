/**
 * A2UI Adapter Utilities
 *
 * Utilities for creating component adapters that map A2UI properties
 * to React component props. Based on a2ui-bridge adapter pattern.
 */

import { createElement, type ComponentType, type ReactNode } from 'react';

/**
 * User action event sent from client to server.
 */
export interface UserAction {
  actionName: string;
  sourceComponentId: string;
  timestamp: string;
  context?: {
    [k: string]: unknown;
  };
}

/**
 * A2UI component node with properties
 */
export interface A2UINode {
  id: string;
  type: string;
  properties: Record<string, any>;
}

/**
 * Props passed to every A2UI adapted component
 */
export interface A2UIComponentProps<T = A2UINode> {
  /** The component node from the A2UI tree */
  node: T;
  /** Callback to dispatch user actions */
  onAction: (action: UserAction) => void;
  /** Component mapping for rendering children */
  components: ComponentMapping;
  /** The surface ID this component belongs to */
  surfaceId: string;
  /** Pre-rendered children (for container components) */
  children?: ReactNode;
}

/**
 * Mapping of A2UI component types to React components
 */
export interface ComponentMapping {
  [componentType: string]: ComponentType<A2UIComponentProps<any>> | undefined;
  /** Special fallback component for unknown types */
  __fallback__?: ComponentType<A2UIComponentProps<any>>;
}

/**
 * Context passed to adapter mapProps functions
 */
export interface AdapterContext {
  /** Dispatch a user action back to the AI */
  onAction: (action: UserAction) => void;
  /** The surface ID this component belongs to */
  surfaceId: string;
  /** The component ID from the A2UI node */
  componentId: string;
  /** Pre-rendered children (for container components) */
  children?: ReactNode;
  /** The full component mapping (for custom child rendering) */
  components: ComponentMapping;
}

/**
 * Options for creating an adapter
 */
export interface AdapterOptions<TTargetProps> {
  /**
   * Transform A2UI properties to target component props.
   * This is where you map A2UI's property names to your component's prop names.
   */
  mapProps: (a2uiProps: Record<string, any>, context: AdapterContext) => TTargetProps;

  /**
   * Optional: Customize how children are passed to the component.
   * Default: children are passed as the `children` prop.
   * Set to null to disable automatic children passing.
   */
  childrenProp?: string | null;

  /**
   * Optional: Display name for debugging.
   */
  displayName?: string;
}

/**
 * Creates an A2UI-compatible component adapter from any React component.
 *
 * @example
 * ```typescript
 * import { Button } from '@/components/ui/button';
 * import { createAdapter } from '@/lib/a2ui/adapter';
 *
 * const ButtonAdapter = createAdapter(Button, {
 *   mapProps: (a2ui, ctx) => ({
 *     children: extractValue(a2ui.text) || ctx.children,
 *     onClick: createActionHandler(a2ui.action, ctx),
 *     variant: a2ui.variant?.literalString ?? 'default',
 *     disabled: a2ui.disabled?.literalBoolean ?? false,
 *   }),
 * });
 * ```
 */
export function createAdapter<TTargetProps extends Record<string, any>>(
  Component: ComponentType<TTargetProps>,
  options: AdapterOptions<TTargetProps>
): ComponentType<A2UIComponentProps<A2UINode>> {
  const { mapProps, childrenProp = 'children', displayName } = options;

  function AdaptedComponent(props: A2UIComponentProps<A2UINode>) {
    const { node, onAction, components, surfaceId, children } = props;

    // Build the adapter context
    const context: AdapterContext = {
      onAction,
      surfaceId,
      componentId: node.id,
      children,
      components,
    };

    // Map A2UI properties to target component props
    const a2uiProps = (node.properties as Record<string, any>) || {};
    const targetProps = mapProps(a2uiProps, context);

    // Handle children if not already in mapped props and childrenProp is set
    if (childrenProp && children && !(targetProps as any)[childrenProp]) {
      (targetProps as any)[childrenProp] = children;
    }

    return createElement(Component as ComponentType<any>, targetProps);
  }

  AdaptedComponent.displayName = displayName || `A2UIAdapter(${Component.displayName || Component.name || 'Component'})`;

  return AdaptedComponent;
}

/**
 * Helper to create action handler from A2UI action property.
 *
 * @example
 * ```typescript
 * const ButtonAdapter = createAdapter(Button, {
 *   mapProps: (a2ui, ctx) => ({
 *     onClick: createActionHandler(a2ui.action, ctx),
 *   }),
 * });
 * ```
 */
export function createActionHandler(
  action: { name: string; context?: Array<{ key: string; value: any }> } | undefined,
  context: AdapterContext,
  additionalContext?: Record<string, any>
): (() => void) | undefined {
  if (!action?.name) return undefined;

  return () => {
    const actionContext: Record<string, any> = { ...additionalContext };

    if (action.context) {
      for (const item of action.context) {
        actionContext[item.key] = extractValue(item.value);
      }
    }

    context.onAction({
      actionName: action.name,
      sourceComponentId: context.componentId,
      timestamp: new Date().toISOString(),
      context: Object.keys(actionContext).length > 0 ? actionContext : undefined,
    });
  };
}

/**
 * Helper to extract literal value from A2UI DataValue.
 *
 * @example
 * ```typescript
 * const text = extractValue(a2ui.text); // "Hello"
 * const count = extractValue(a2ui.count); // 42
 * ```
 */
export function extractValue(value: any): any {
  if (value === null || value === undefined) return undefined;
  if (typeof value !== 'object') return value;

  // Handle A2UI DataValue types
  if ('literalString' in value) return value.literalString;
  if ('literal' in value && typeof value.literal === 'string') return value.literal;
  if ('literalNumber' in value) return value.literalNumber;
  if ('literal' in value && typeof value.literal === 'number') return value.literal;
  if ('literalBoolean' in value) return value.literalBoolean;
  if ('literalBool' in value) return value.literalBool;
  if ('literal' in value && typeof value.literal === 'boolean') return value.literal;
  if ('literalDate' in value) return value.literalDate;
  if ('path' in value) {
    // Data binding - for now return undefined, can be extended later
    return undefined;
  }

  return value;
}

/**
 * Helper to map A2UI variant names to your component library's variants.
 *
 * @example
 * ```typescript
 * const variantMap = {
 *   primary: 'default',
 *   secondary: 'outline',
 *   danger: 'destructive',
 * };
 *
 * const ButtonAdapter = createAdapter(Button, {
 *   mapProps: (a2ui, ctx) => ({
 *     variant: mapVariant(extractValue(a2ui.variant), variantMap, 'default'),
 *   }),
 * });
 * ```
 */
export function mapVariant<T extends string>(
  a2uiVariant: string | undefined,
  variantMap: Record<string, T>,
  defaultVariant: T
): T {
  if (!a2uiVariant) return defaultVariant;
  return variantMap[a2uiVariant] ?? defaultVariant;
}

/**
 * Creates a simple passthrough adapter for components that already
 * accept similar props to A2UI. Useful for layout components.
 *
 * @example
 * ```typescript
 * const DivAdapter = createPassthroughAdapter('div', {
 *   className: 'flex flex-col gap-4',
 * });
 * ```
 */
export function createPassthroughAdapter<TTargetProps extends { children?: ReactNode }>(
  Component: ComponentType<TTargetProps> | string,
  defaultProps?: Partial<TTargetProps>
): ComponentType<A2UIComponentProps<A2UINode>> {
  return createAdapter(Component as ComponentType<TTargetProps>, {
    mapProps: (_, ctx) => ({
      ...defaultProps,
      children: ctx.children,
    } as TTargetProps),
    displayName: `Passthrough(${typeof Component === 'string' ? Component : Component.displayName || Component.name || 'Component'})`,
  });
}

/**
 * Helper to render child component by ID
 */
export function renderChild(
  childId: string | undefined,
  components: ComponentMapping,
  onAction: (action: UserAction) => void,
  surfaceId: string
): ReactNode {
  if (!childId) return null;
  // This is a placeholder - in full implementation would look up component tree
  return null;
}

/**
 * Helper to render array of children by IDs
 */
export function renderChildren(
  childIds: string[] | undefined,
  components: ComponentMapping,
  onAction: (action: UserAction) => void,
  surfaceId: string
): ReactNode {
  if (!childIds || childIds.length === 0) return null;
  return childIds.map(id => renderChild(id, components, onAction, surfaceId));
}

/**
 * Event handler for A2UI user actions.
 */
export type ActionHandler = (action: UserAction) => void;
