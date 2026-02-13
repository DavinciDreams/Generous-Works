# Generous Brand Style Guide
**Version 1.0** • Last Updated: February 12, 2026

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Logo & Brand Mark](#2-logo--brand-mark)
3. [Color System](#3-color-system)
4. [Typography](#4-typography)
5. [Spacing & Layout](#5-spacing--layout)
6. [Components](#6-components)
7. [Iconography](#7-iconography)
8. [Motion & Animation](#8-motion--animation)
9. [Accessibility](#9-accessibility)
10. [Voice & Tone](#10-voice--tone)
11. [Photography & Imagery](#11-photography--imagery)
12. [Code Examples](#12-code-examples)

---

## 1. Introduction

### About Generous

Generous is the universal canvas for AI — a streaming generative UI platform that renders live, interactive components from natural language. With 114+ specialized components ranging from charts and 3D scenes to maps and games, Generous makes AI-powered interfaces accessible to everyone.

### About Logos Liber

Generous is part of Logos Liber, an ecosystem of open-source tools for collective intelligence and knowledge work. The ecosystem includes:

- **Generous** — Universal canvas for generative UI
- **Galaxy Brain** — Knowledge management and second-brain systems
- **Agents of Empire** — Multi-agent orchestration platform
- **Monumental Systems** — Distributed execution infrastructure

### About the Decentralized Intelligence Agency (DIA)

All Logos Liber projects are supported by the Decentralized Intelligence Agency, a 501(c)(3) nonprofit building AI infrastructure that belongs to everyone. DIA's mission is to create open, transparent, and collectively-owned tools that advance human knowledge and capability.

### Purpose of This Style Guide

This document defines the visual and verbal identity for Generous and provides guidelines for creating consistent, accessible, and brand-aligned designs across all touchpoints.

**Who should use this guide:**
- Designers creating interfaces or marketing materials
- Developers implementing components
- Content creators writing copy
- Contributors to the open-source project

---

## 2. Logo & Brand Mark

### Primary Logo

**Status:** To be designed

The Generous logo should embody:
- **Open container** — A vessel ready to receive and give
- **Generative potential** — Infinite possibility within structure
- **Warmth** — Approachable and human, not cold or corporate
- **Technical credibility** — Modern, clean, professional

**Conceptual directions:**
1. Open hand (giving/receiving)
2. Infinite canvas (∞ symbol integrated with frame)
3. Generative spiral (fibonacci, growth)
4. Container with light/energy emerging

### Logo Variations

When the logo is designed, provide these variations:

#### Horizontal Lockup
- Full wordmark + symbol side-by-side
- Use for website headers, presentations

#### Stacked Lockup
- Symbol above wordmark
- Use for square social media avatars, app icons

#### Symbol Only
- Icon without text
- Use for favicons, small UI elements (min 32px)

#### Monochrome Versions
- All white (for dark backgrounds)
- All black (for light backgrounds)
- Single color (when brand colors aren't available)

### Clear Space & Minimum Sizes

**Clear space:** Minimum distance around logo should equal the height of the "G" in Generous

**Minimum sizes:**
- Digital: 120px wide (horizontal), 80px tall (stacked)
- Print: 1 inch wide (horizontal), 0.75 inch tall (stacked)
- Favicon: 32x32px minimum

### Incorrect Usage

**Don't:**
- Stretch, skew, or distort the logo
- Change logo colors outside approved palette
- Place on busy backgrounds that reduce legibility
- Rotate the logo
- Add effects (drop shadows, gradients, outlines)
- Crowd the logo with other elements

---

## 3. Color System

### Brand Colors

Generous uses a vibrant, modern palette that works across the entire Logos Liber ecosystem.

#### Primary Brand Colors

```css
/* Generous Blue - Primary brand color */
--generous-blue: #3B82F6;
/* RGB: 59, 130, 246 */
/* Usage: Primary CTAs, links, interactive elements, brand accents */

/* Logos Gold - Secondary accent */
--logos-gold: #F59E0B;
/* RGB: 245, 158, 11 */
/* Usage: Secondary accents, warmth, emphasis (use sparingly) */

/* Galaxy Purple - Tertiary accent */
--galaxy-purple: #8B5CF6;
/* RGB: 139, 92, 246 */
/* Usage: Innovation, intelligence, data visualization accents */
```

### Dark Mode Colors (Default)

Generous is **dark mode first**. All designs should be optimized for dark backgrounds.

```css
/* Background Layers */
--bg-primary: #0A0A0A;     /* Near-black base, main background */
--bg-secondary: #1A1A1A;   /* Elevated surfaces (cards, modals) */
--bg-tertiary: #2A2A2A;    /* Higher elevation (popovers, tooltips) */

/* Text Colors */
--text-primary: #FFFFFF;   /* High contrast, primary text */
--text-secondary: #A3A3A3; /* Medium contrast, labels, secondary text */
--text-tertiary: #525252;  /* Low contrast, disabled, subtle text */

/* Borders */
--border-subtle: #262626;  /* Minimal dividers, very subtle separation */
--border-medium: #404040;  /* Standard borders for cards, inputs */
--border-strong: #525252;  /* Emphasized borders, focus states */
```

### Light Mode Colors

While dark mode is default, light mode must also be fully supported.

```css
/* Background Layers */
--bg-primary: #FFFFFF;     /* Pure white base */
--bg-secondary: #F5F5F5;   /* Light gray elevated surfaces */
--bg-tertiary: #E5E5E5;    /* Medium gray higher elevation */

/* Text Colors */
--text-primary: #0A0A0A;   /* Near-black, primary text */
--text-secondary: #525252; /* Medium gray, secondary text */
--text-tertiary: #A3A3A3;  /* Light gray, disabled text */

/* Borders */
--border-subtle: #E5E5E5;  /* Minimal dividers */
--border-medium: #D4D4D4;  /* Standard borders */
--border-strong: #A3A3A3;  /* Emphasized borders */
```

### Semantic Colors

Used for UI states and feedback.

```css
/* Success */
--success: #10B981;        /* Green, confirmations, positive states */
--success-light: #D1FAE5;  /* Light green backgrounds */

/* Warning */
--warning: #FBBF24;        /* Amber, warnings, cautions */
--warning-light: #FEF3C7;  /* Light amber backgrounds */

/* Error */
--error: #EF4444;          /* Red, errors, destructive actions */
--error-light: #FEE2E2;    /* Light red backgrounds */

/* Info */
--info: #06B6D4;           /* Cyan, informational messages */
--info-light: #CFFAFE;     /* Light cyan backgrounds */
```

### Accessibility & Contrast

All color combinations must meet WCAG 2.1 Level AA standards:

**Text Contrast Requirements:**
- Normal text (< 18pt): 4.5:1 minimum contrast ratio
- Large text (≥ 18pt): 3:1 minimum contrast ratio
- UI components: 3:1 minimum contrast ratio

**Tested Combinations (Dark Mode):**
- `#FFFFFF` on `#0A0A0A`: 19.87:1 ✅ (AAA)
- `#A3A3A3` on `#0A0A0A`: 8.96:1 ✅ (AAA)
- `#3B82F6` on `#0A0A0A`: 5.82:1 ✅ (AA Large, close to AA)
- `#F59E0B` on `#0A0A0A`: 7.15:1 ✅ (AAA)

**Never use:**
- `#525252` (tertiary text) for body copy — only for labels, disabled states
- Brand colors on brand color backgrounds (poor contrast)
- Pure grays for links (use Generous Blue)

### Usage Guidelines

**Generous Blue (#3B82F6)**
- **Do:** Primary CTAs, active states, links, brand moments
- **Don't:** Large background areas, body text

**Logos Gold (#F59E0B)**
- **Do:** Accents, highlights, trust indicators (stars, awards)
- **Don't:** Overuse (it's powerful, use sparingly)

**Galaxy Purple (#8B5CF6)**
- **Do:** Innovation features, AI-related content, tertiary accents
- **Don't:** Mix with Logos Gold (choose one accent per section)

---

## 4. Typography

### Typefaces

Generous uses the Geist type family for all digital interfaces.

```typescript
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

**Geist Sans** — Primary typeface for all UI text, headings, body copy
- Clean, modern, highly legible
- Warm enough to be friendly, technical enough to be credible
- Optimized for screens

**Geist Mono** — Monospace typeface for code, technical content
- Code blocks, API responses, terminal output
- Technical documentation
- Data tables, logs, timestamps

### Type Scale

Generous uses a modular scale for consistent typography.

| Element | Size | Weight | Line Height | Letter Spacing | Use Case |
|---------|------|--------|-------------|----------------|----------|
| **H1** | 3rem (48px) | Bold (700) | 1.1 | -0.02em | Page titles, hero headlines |
| **H2** | 2.25rem (36px) | Bold (700) | 1.2 | -0.01em | Section headings |
| **H3** | 1.875rem (30px) | Semibold (600) | 1.3 | — | Subsection headings |
| **H4** | 1.5rem (24px) | Semibold (600) | 1.4 | — | Card titles, component headings |
| **H5** | 1.25rem (20px) | Medium (500) | 1.5 | — | Small headings |
| **H6** | 1rem (16px) | Medium (500) | 1.5 | — | Micro headings |
| **Body Large** | 1.125rem (18px) | Regular (400) | 1.7 | — | Lead paragraphs, important text |
| **Body Default** | 1rem (16px) | Regular (400) | 1.6 | — | Standard body text |
| **Body Small** | 0.875rem (14px) | Regular (400) | 1.5 | — | Captions, labels, secondary info |
| **Body Tiny** | 0.75rem (12px) | Regular (400) | 1.4 | — | Fine print, metadata |
| **Code** | 0.875rem (14px) | Mono Regular | 1.5 | — | Code snippets, technical content |

### Responsive Typography

Typography should scale appropriately across devices:

```css
/* Mobile (< 640px) */
h1 { font-size: 2.25rem; } /* 36px */
h2 { font-size: 1.875rem; } /* 30px */
h3 { font-size: 1.5rem; } /* 24px */

/* Tablet (640px - 1024px) */
h1 { font-size: 2.75rem; } /* 44px */
h2 { font-size: 2.25rem; } /* 36px */
h3 { font-size: 1.75rem; } /* 28px */

/* Desktop (> 1024px) */
h1 { font-size: 3rem; } /* 48px */
h2 { font-size: 2.25rem; } /* 36px */
h3 { font-size: 1.875rem; } /* 30px */
```

### Font Weight Guidelines

- **Bold (700):** Headlines (H1, H2), strong emphasis
- **Semibold (600):** Subheadings (H3, H4), button text
- **Medium (500):** Small headings (H5, H6), labels
- **Regular (400):** Body copy, most UI text
- **Light (300):** Large display text only (not for body)

**Don't use:**
- Font weights outside 400-700 range
- Multiple weights in a single paragraph
- Bold for entire paragraphs (only phrases)

### Paragraph Styling

```css
p {
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  max-width: 65ch; /* Optimal reading length */
}

p.lead {
  font-size: 1.125rem;
  line-height: 1.7;
  font-weight: 400;
  color: var(--text-secondary);
}
```

---

## 5. Spacing & Layout

### Spacing Scale

Generous uses an 8px base unit for all spacing.

```css
--space-1: 4px;   /* 0.25rem */
--space-2: 8px;   /* 0.5rem */
--space-3: 12px;  /* 0.75rem */
--space-4: 16px;  /* 1rem */
--space-5: 20px;  /* 1.25rem */
--space-6: 24px;  /* 1.5rem */
--space-8: 32px;  /* 2rem */
--space-10: 40px; /* 2.5rem */
--space-12: 48px; /* 3rem */
--space-16: 64px; /* 4rem */
--space-20: 80px; /* 5rem */
--space-24: 96px; /* 6rem */
```

**Usage:**
- **4px:** Icon padding, micro-spacing
- **8px:** Button padding, form field gaps
- **16px:** Card padding, standard gaps
- **24px:** Section padding (mobile)
- **32px:** Section padding (tablet)
- **48px:** Section padding (desktop)
- **64px:** Large section spacing
- **96px:** Hero section spacing

### Grid System

Generous uses a 12-column grid with flexible gutters.

```css
.container {
  max-width: 1280px; /* Desktop max width */
  margin: 0 auto;
  padding: 0 1rem; /* Mobile */
}

@media (min-width: 640px) {
  .container { padding: 0 1.5rem; } /* Tablet */
}

@media (min-width: 1024px) {
  .container { padding: 0 2rem; } /* Desktop */
}
```

**Grid Columns:**
- Mobile: 4 columns
- Tablet: 8 columns
- Desktop: 12 columns

**Gutter sizes:**
- Mobile: 16px
- Tablet: 24px
- Desktop: 32px

### Breakpoints

```css
--breakpoint-sm: 640px;   /* Small devices (landscape phones) */
--breakpoint-md: 768px;   /* Medium devices (tablets) */
--breakpoint-lg: 1024px;  /* Large devices (laptops) */
--breakpoint-xl: 1280px;  /* Extra large (desktops) */
--breakpoint-2xl: 1536px; /* 2X extra large (large desktops) */
```

### Container Widths

```css
.container-sm { max-width: 640px; }  /* Prose, forms */
.container-md { max-width: 768px; }  /* Articles, blogs */
.container-lg { max-width: 1024px; } /* Standard content */
.container-xl { max-width: 1280px; } /* Wide layouts */
.container-full { max-width: 100%; } /* Full bleed */
```

### Border Radius

```css
--radius-sm: 0.375rem;  /* 6px - Small elements, tags */
--radius-md: 0.5rem;    /* 8px - Buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - Cards */
--radius-xl: 1rem;      /* 16px - Large cards */
--radius-2xl: 1.5rem;   /* 24px - Modals, major sections */
--radius-3xl: 2rem;     /* 32px - Hero elements */
--radius-full: 9999px;  /* Pills, circular elements */
```

---

## 6. Components

### Buttons

**Primary Button:**
```tsx
<Button className="bg-[var(--generous-blue)] hover:bg-[var(--generous-blue)]/90">
  Primary Action
</Button>
```
- Use for primary CTAs (max 1 per section)
- Generous Blue background
- White text
- Medium border radius (0.5rem)
- Clear hover state (90% opacity)

**Secondary Button:**
```tsx
<Button variant="outline">
  Secondary Action
</Button>
```
- Use for secondary actions
- Transparent background, border outline
- Foreground text color
- Hover: Accent background

**Ghost Button:**
```tsx
<Button variant="ghost">
  Tertiary Action
</Button>
```
- Use for tertiary, low-emphasis actions
- No border, no background
- Hover: Subtle background

**Sizes:**
- **Small:** `px-3 py-1.5 text-sm` (compact UI)
- **Medium:** `px-4 py-2 text-base` (default)
- **Large:** `px-6 py-3 text-lg` (CTAs, hero)

### Cards

```tsx
<div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all">
  <h3 className="font-semibold mb-2">Card Title</h3>
  <p className="text-sm text-muted-foreground">Card content</p>
</div>
```

**Characteristics:**
- Rounded corners (xl: 1rem)
- Subtle border
- Background color distinct from page
- Padding: 1.5rem (24px)
- Hover state: Shadow elevation

### Forms

**Input Fields:**
```tsx
<input
  type="text"
  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--generous-blue)]"
  placeholder="Enter text..."
/>
```

**Labels:**
```tsx
<label className="text-sm font-medium mb-1.5 block">
  Field Label
</label>
```

**Error States:**
```tsx
<p className="text-sm text-[var(--error)] mt-1">
  This field is required
</p>
```

### Badges & Pills

```tsx
<span className="inline-flex items-center rounded-full bg-[var(--generous-blue)]/10 px-3 py-1 text-sm font-medium text-[var(--generous-blue)]">
  Badge Text
</span>
```

**Variants:**
- **Primary:** Generous Blue background/text
- **Success:** Green background/text
- **Warning:** Amber background/text
- **Error:** Red background/text
- **Neutral:** Muted background/text

---

## 7. Iconography

### Icon Library

**Recommended:** [Lucide Icons](https://lucide.dev)

Lucide provides:
- Consistent stroke width (1.5px)
- Modern, clean aesthetic
- Comprehensive coverage (1000+ icons)
- React components included
- MIT licensed (open source)

**Alternative:** [Heroicons](https://heroicons.com) (also excellent, similar aesthetic)

### Icon Sizing

```css
--icon-xs: 12px;  /* Tiny indicators */
--icon-sm: 16px;  /* Inline with text */
--icon-md: 20px;  /* Standard UI icons */
--icon-lg: 24px;  /* Emphasized icons */
--icon-xl: 32px;  /* Large feature icons */
--icon-2xl: 48px; /* Hero/showcase icons */
```

**Usage:**
- **12px:** Micro indicators, inline badges
- **16px:** Inline with body text (16px)
- **20px:** Buttons, form inputs
- **24px:** Navigation, toolbars
- **32px:** Feature cards, section headers
- **48px:** Hero sections, large showcases

### Icon Styles

**Outlined (Default):**
- Use for most UI elements
- Better for accessibility (clearer at small sizes)
- Consistent stroke weight

**Filled:**
- Use for active/selected states
- Strong emphasis
- Limited usage (icons lose clarity when filled)

### Icon Colors

Match icons to their context:
```tsx
{/* Primary action */}
<Icon className="text-[var(--generous-blue)]" />

{/* Secondary text */}
<Icon className="text-muted-foreground" />

{/* Interactive element */}
<Icon className="text-foreground hover:text-[var(--generous-blue)]" />

{/* Success state */}
<Icon className="text-[var(--success)]" />
```

### Custom Icons

If creating custom icons:
- **Stroke width:** 1.5px (match Lucide)
- **Viewbox:** 24x24
- **Corner radius:** 2px
- **Grid:** Align to pixel grid
- **Export:** SVG format, optimized

---

## 8. Motion & Animation

### Animation Principles

1. **Purpose-driven:** Every animation serves a purpose (feedback, guidance, delight)
2. **Subtle:** Animations enhance, not distract
3. **Fast:** Duration 150-300ms for UI, 300-500ms for page transitions
4. **Natural:** Use easing functions that mimic physics

### Duration & Easing

```css
/* Micro-interactions (hover, focus) */
--duration-fast: 150ms;
--easing-fast: cubic-bezier(0.4, 0, 0.2, 1); /* ease-in-out */

/* Standard transitions (dropdowns, modals) */
--duration-base: 200ms;
--easing-base: cubic-bezier(0.4, 0, 0.2, 1);

/* Page transitions, complex animations */
--duration-slow: 300ms;
--easing-slow: cubic-bezier(0.4, 0, 0.1, 1);

/* Emphasized entrance */
--duration-emphasized: 500ms;
--easing-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1); /* anticipation */
```

### Common Transitions

**Hover States:**
```css
.button {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
```

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 200ms ease-in-out;
}
```

**Slide In:**
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 300ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Loading States

**Spinner:**
```tsx
<div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-[var(--generous-blue)]" />
```

**Skeleton:**
```tsx
<div className="h-4 w-64 rounded bg-muted animate-pulse" />
```

**Pulse:**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Accessibility: Reduced Motion

**Always respect user preferences:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**In React:**
```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

<div className={prefersReducedMotion ? '' : 'animate-slide-in'}>
  Content
</div>
```

---

## 9. Accessibility

Generous is committed to WCAG 2.1 Level AA compliance minimum, AAA where possible.

### Color Contrast

**Requirements:**
- Normal text: 4.5:1 minimum
- Large text (18pt+): 3:1 minimum
- UI components: 3:1 minimum

**Tools:**
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Accessible Colors](https://accessible-colors.com/)
- Chrome DevTools Accessibility Inspector

### Keyboard Navigation

**All interactive elements must be keyboard accessible:**

```tsx
// Good: Proper button
<button onClick={handleClick}>Click Me</button>

// Bad: Div with onClick (not keyboard accessible)
<div onClick={handleClick}>Click Me</div>
```

**Focus Indicators:**
```css
*:focus-visible {
  outline: 2px solid var(--generous-blue);
  outline-offset: 2px;
}
```

**Tab Order:**
- Use semantic HTML (nav, header, main, footer)
- Avoid `tabindex` values > 0
- Use `tabindex="-1"` to remove from tab order
- Use `tabindex="0"` to add to tab order

### Screen Readers

**Semantic HTML:**
```tsx
<header>...</header>
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

**ARIA Labels:**
```tsx
{/* Icon-only button */}
<button aria-label="Close menu">
  <X className="h-4 w-4" />
</button>

{/* Decorative image */}
<img src="decoration.svg" alt="" role="presentation" />

{/* Informative image */}
<img src="chart.png" alt="Bar chart showing 50% increase in sales" />
```

**Skip Links:**
```tsx
<a href="#main-content" className="skip-link">
  Skip to main content
</a>
```

### Form Accessibility

**Labels:**
```tsx
<label htmlFor="email">Email Address</label>
<input id="email" type="email" required />
```

**Error Messages:**
```tsx
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" className="text-error">
  Please enter a valid email address
</span>
```

### Testing Checklist

- [ ] All text meets contrast requirements (4.5:1 minimum)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] All images have alt text (or alt="" if decorative)
- [ ] Form inputs have associated labels
- [ ] Error messages are announced to screen readers
- [ ] Page has proper heading hierarchy (H1 → H2 → H3)
- [ ] Semantic HTML used throughout (nav, main, footer, etc.)
- [ ] ARIA labels added where needed
- [ ] Tested with keyboard only (no mouse)
- [ ] Tested with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Respects prefers-reduced-motion
- [ ] Zoom to 200% without horizontal scrolling

---

## 10. Voice & Tone

### Brand Voice Attributes

Generous speaks with five core attributes:

| Attribute | Definition | In Practice |
|-----------|------------|-------------|
| **Warm** | Approachable, human, welcoming | "We built this for you" not "Our solution leverages synergies" |
| **Capable** | Competent, confident, technically solid | "Here's how it works" not "We hope this might work" |
| **Abundant** | Generous, open-handed, expansive | "Take what you need" not "Limited time offer" |
| **Principled** | Honest, values-driven, consistent | "We believe X because Y" not vague platitudes |
| **Clear** | Direct, plain-spoken, jargon-free | "This does X" not "This enables stakeholders to optimize outcomes" |

### Tone for Different Contexts

**Marketing (Warm + Abundant):**
> "Ask for anything. Generous is a canvas where thought becomes form. No templates. No workflows. Just ask."

**Technical Documentation (Capable + Clear):**
> "Components stream in real-time as the AI generates them. Built with Next.js 16, React 19, and the Vercel AI SDK."

**Mission/Values (Principled + Warm):**
> "Generous is supported by a nonprofit, not VC funding. This means our incentives align with yours: building genuinely useful, free tools."

**Error Messages (Clear + Warm):**
> "We couldn't find that component. Try describing what you need, or browse the component library."

### Writing Guidelines

**Do:**
- Use active voice ("We built this" not "This was built")
- Be specific ("Generates React components" not "Creates interfaces")
- Lead with benefits ("Never lose a thought" not "Features cloud sync")
- Use "we" and "you" (conversational)
- Explain technical concepts in plain language first
- Use em dashes for asides — like this
- Use the Oxford comma

**Don't:**
- Use buzzwords ("synergy," "leverage," "paradigm shift")
- Use jargon without explanation
- Use exclamation marks excessively (max 1 per paragraph)
- Use corporate speak ("stakeholders," "solutions")
- Make vague claims ("best-in-class," "revolutionary")
- Apologize for being open source (celebrate it)
- Beg for support (invite participation)
- Use all caps for emphasis

### Messaging Examples

**Headline (Warm, Clear):**
✅ "Ask for anything."
❌ "Revolutionizing the AI Interface Paradigm"

**Value Prop (Capable, Clear):**
✅ "Describe what you need and watch it render live as interactive components."
❌ "Leverage our cutting-edge platform to optimize your generative workflow."

**Feature Description (Abundant, Clear):**
✅ "114+ components — charts, 3D scenes, maps, games, editors, and more."
❌ "Comprehensive component library with extensive coverage."

**CTA (Warm, Clear):**
✅ "Try Generous"
❌ "Get Started Now!!!"

**Error (Clear, Warm):**
✅ "That didn't work. Let's try again."
❌ "Error: Component generation failed."

---

## 11. Photography & Imagery

### Screenshots

**General Guidelines:**
- Use actual product screenshots, not mockups
- Show real data, not Lorem Ipsum
- Dark mode screenshots by default
- Retina resolution (2x pixel density)
- Include subtle drop shadow for depth

**Dimensions:**
- Hero images: 1600x900px (16:9)
- Component previews: 800x600px (4:3)
- Feature cards: 600x400px (3:2)

**Format:**
- PNG for screenshots (lossless)
- WebP for web delivery (smaller file size)
- JPEG for photos (if using)
- SVG for diagrams and illustrations

**Optimization:**
- Max file size: 200KB per image
- Use `next/image` for automatic optimization
- Lazy load images below the fold
- Provide alt text for accessibility

### Component Screenshots

When taking component screenshots:
1. Use consistent padding (24px all sides)
2. Use dark mode (#0A0A0A background)
3. Show the component in action (interactive state)
4. Include realistic data (not "Test Data 1, 2, 3")
5. Capture at 2x resolution
6. Export with transparent backgrounds where appropriate

**Example naming:**
```
component-chart-bar.png
component-3d-scene.png
component-map-geospatial.png
component-timeline-vertical.png
```

### Diagrams & Illustrations

**Style:**
- Flat, modern aesthetic
- Use brand colors sparingly
- Primarily neutral grays with accent colors
- Consistent stroke width (2px)
- Minimal shadows and gradients

**Tools:**
- Figma (preferred)
- Excalidraw (for diagrams)
- Mermaid (for flowcharts)

---

## 12. Code Examples

### React Component Pattern

```tsx
import { Button } from "@/components/ui/button";

export function FeatureCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold mb-2">
        Feature Title
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Feature description explaining what it does.
      </p>
      <Button variant="outline" size="sm">
        Learn More
      </Button>
    </div>
  );
}
```

### Tailwind Utility Classes

**Spacing:**
```tsx
<div className="p-6">       {/* padding: 1.5rem (24px) */}
<div className="mt-4">      {/* margin-top: 1rem (16px) */}
<div className="space-y-4"> {/* gap: 1rem between children */}
```

**Typography:**
```tsx
<h1 className="text-4xl font-bold">   {/* 36px, 700 weight */}
<p className="text-base text-muted-foreground"> {/* 16px, muted color */}
```

**Layout:**
```tsx
<div className="flex items-center justify-between">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

**Colors:**
```tsx
<div className="bg-card text-foreground border border-border">
<button className="bg-[var(--generous-blue)] text-white">
```

### Dark Mode Implementation

```tsx
// globals.css
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}

// Component
<div className="bg-background text-foreground">
  Content automatically adapts to dark mode
</div>
```

### Responsive Design

```tsx
<div className="
  text-2xl         /* Mobile: 24px */
  md:text-3xl      /* Tablet: 30px */
  lg:text-4xl      /* Desktop: 36px */
  px-4             /* Mobile: 16px padding */
  md:px-6          /* Tablet: 24px padding */
  lg:px-8          /* Desktop: 32px padding */
">
  Responsive Content
</div>
```

---

## Appendix: Quick Reference

### Color Variables

```css
/* Brand */
--generous-blue: #3B82F6;
--logos-gold: #F59E0B;
--galaxy-purple: #8B5CF6;

/* Semantic */
--success: #10B981;
--warning: #FBBF24;
--error: #EF4444;
--info: #06B6D4;

/* Dark Mode (Default) */
--bg-primary: #0A0A0A;
--bg-secondary: #1A1A1A;
--bg-tertiary: #2A2A2A;
--text-primary: #FFFFFF;
--text-secondary: #A3A3A3;
--text-tertiary: #525252;
```

### Typography Scale

| Element | Size | Weight |
|---------|------|--------|
| H1 | 48px | 700 |
| H2 | 36px | 700 |
| H3 | 30px | 600 |
| H4 | 24px | 600 |
| Body | 16px | 400 |
| Small | 14px | 400 |

### Spacing Scale

| Token | Value |
|-------|-------|
| 1 | 4px |
| 2 | 8px |
| 4 | 16px |
| 6 | 24px |
| 8 | 32px |
| 12 | 48px |
| 16 | 64px |

### Breakpoints

| Name | Value |
|------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |

---

## Changelog

**Version 1.0** — February 12, 2026
- Initial release of Generous Brand Style Guide
- Comprehensive color, typography, and component guidelines
- Accessibility standards (WCAG 2.1 AA)
- Voice and tone documentation
- Code examples and implementation patterns

---

## Contact & Contributions

This style guide is open source, just like Generous.

**Suggest improvements:**
[GitHub Issues](https://github.com/DavinciDreams/Generous-Works/issues)

**Questions:**
[Discord Community](https://discord.gg/logosliber)

**Maintained by:**
Decentralized Intelligence Agency (DIA)
[decentralizedintelligence.agency](https://decentralizedintelligence.agency)

---

**License:** This style guide is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). You're free to use, adapt, and build upon it, even commercially, as long as you credit Generous/DIA.
