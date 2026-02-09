---
name: new-component
description: Scaffold a new AI element or UI component following project conventions. Use when asked to create a new component, add a component, scaffold a component, or build a new UI element.
disable-model-invocation: true
---

# New Component Skill

Scaffold new components in this project. There are two component categories with distinct conventions.

## Step 1: Determine Component Category

Ask the user (if not already clear) which category:

1. **AI Element** (`components/ai-elements/`) - Domain-specific components for the generative UI chat experience (messages, code blocks, tools, panels, etc.)
2. **UI Primitive** (`components/ui/`) - Reusable, generic UI primitives built on Radix UI / shadcn patterns (buttons, inputs, dialogs, etc.)

## Step 2: Scaffold the Component

### AI Element Convention

File: `components/ai-elements/{kebab-case-name}.tsx`

Pattern to follow:

```tsx
"use client";

import type { ComponentProps, HTMLAttributes } from "react";

// Import UI primitives from @/components/ui/
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// Import icons from lucide-react
import { SomeIcon } from "lucide-react";
// Import React hooks as needed
import { memo, useCallback, useMemo, useState } from "react";

// --- Type exports ---
// Export prop types using `export type`
// Extend HTMLAttributes<HTMLDivElement> or ComponentProps<typeof SomeComponent>
export type MyComponentProps = HTMLAttributes<HTMLDivElement> & {
  // Component-specific props
};

// --- Component exports ---
// Export as named `const` arrow functions (not default exports)
// Use `cn()` for className merging with Tailwind
// Spread remaining props with `...props`
export const MyComponent = ({ className, children, ...props }: MyComponentProps) => (
  <div className={cn("base-tailwind-classes", className)} {...props}>
    {children}
  </div>
);

// --- Sub-components ---
// For compound components, export multiple named components from the same file
// e.g., MyComponentHeader, MyComponentContent, MyComponentFooter

// --- Memoization ---
// Use `memo()` for components with expensive rendering
// Provide custom comparison when needed:
// export const MyComponent = memo(MyComponentInner, (prev, next) => prev.x === next.x);
// MyComponent.displayName = "MyComponent";

// --- Context ---
// For compound components that share state, use React Context:
// const MyContext = createContext<MyContextType>(defaultValue);
// const useMyContext = () => { ... };

// --- Avoiding Infinite Loops in useEffect ---
// CRITICAL: Be careful with useEffect dependency arrays to avoid infinite re-rendering
//
// ❌ BAD - Objects in dependencies cause infinite loops:
// useEffect(() => {
//   // initialization code
// }, [data, options, someRef, someFunction]);
//
// ✅ GOOD - Only include stable primitives:
// useEffect(() => {
//   // initialization code
// }, [isMounted, componentId]);
// // eslint-disable-next-line react-hooks/exhaustive-deps
//
// Why this happens:
// - Objects like `data`, `options` are recreated on every render
// - Refs and functions may also cause re-runs
// - The effect runs → cleanup disposes resources → triggers re-render → effect runs again
//
// Solution:
// - Only depend on primitive values that change intentionally (strings, numbers, booleans)
// - Common safe dependencies: `isMounted`, component IDs (stable strings)
// - Add eslint-disable comment to acknowledge intentional omission
// - Capture data/options in the effect closure - they'll be used but won't trigger re-runs
```

Key conventions for AI elements:
- Always start with `"use client";`
- Use `cn()` from `@/lib/utils` for all className merging
- Export both the prop type (`export type XProps`) and the component (`export const X`)
- Compose with UI primitives from `@/components/ui/` (Button, Card, Badge, etc.)
- Use `lucide-react` for icons
- Use `motion` (from `motion/react`) for animations
- For interactive state, use Zustand hooks from `@/lib/store.ts` when the state needs to be shared across the app
- Use React hooks (`useState`, `useCallback`, `useMemo`, `useRef`) for local state

### UI Primitive Convention

File: `components/ui/{kebab-case-name}.tsx`

For UI primitives, prefer using the shadcn CLI:

```bash
npx shadcn@latest add <component-name>
```

This auto-generates components in `components/ui/` following the project's `components.json` config (new-york style, Tailwind CSS variables, lucide icons).

If creating a custom UI primitive (not available in shadcn), follow this pattern:

```tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

// Use cva() for variant-based styling
const myComponentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-classes",
        secondary: "secondary-classes",
      },
      size: {
        default: "default-size-classes",
        sm: "sm-classes",
        lg: "lg-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// Use function declaration style (not arrow functions) for UI primitives
function MyComponent({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof myComponentVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="my-component"
      data-variant={variant}
      data-size={size}
      className={cn(myComponentVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { MyComponent, myComponentVariants }
```

Key conventions for UI primitives:
- Use `function` declarations (not arrow functions)
- Use `data-slot` attributes for styling hooks
- Use `cva()` for variants
- Support `asChild` pattern via `Slot.Root` from `radix-ui`
- Export both the component and its variants
- No `"use client"` unless the component uses hooks/state

## Step 3: Verify

After creating the component:

1. Read back the created file to confirm correctness
2. Run `npx tsc --noEmit` to verify no type errors
3. Run `npx eslint <file-path>` to verify lint passes

## Available UI Primitives

These exist in `components/ui/` and can be imported by AI elements:

accordion, alert, avatar, badge, button, button-group, card, carousel, collapsible, command, dialog, dropdown-menu, hover-card, input, input-group, popover, progress, scroll-area, select, separator, spinner, switch, tabs, textarea, tooltip

## Existing AI Elements

These exist in `components/ai-elements/` for reference:

agent, artifact, attachments, audio-player, canvas, chain-of-thought, checkpoint, code-block, commit, confirmation, connection, context, controls, conversation, edge, environment-variables, file-tree, generative-message, image, inline-citation, jsx-preview, message, mic-selector, model-selector, node, open-in-chat, package-info, panel, persona, plan, prompt-input, queue, reasoning, sandbox, schema-display, shimmer, snippet, sources, speech-input, stack-trace, suggestion, task, terminal, test-results, tool, toolbar, transcription, voice-selector, web-preview
