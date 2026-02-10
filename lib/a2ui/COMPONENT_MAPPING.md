# A2UI Component Mapping

This document maps all available components across three categories:
1. **Standard UI Adapters** (76 from a2ui-bridge)
2. **Custom Specialized Components** (11 existing)
3. **AI Elements** (70+ to be adapted)

## Status Legend
- ✅ Implemented and ready
- 🔄 Needs implementation
- ⚠️ Deduped with existing component
- 🎨 Keep as specialized composable component

---

## 1. Standard UI Components (76 total)

### Layout (12/12 ✅)
| Component | Status | Notes |
|-----------|--------|-------|
| Row | ✅ | Horizontal flex layout |
| Column | ✅ | Vertical flex layout |
| HStack | ✅ | Alias for Row |
| VStack | ✅ | Alias for Column |
| Stack | ✅ | Alias for Column |
| Flex | ✅ | Generic flex container |
| Grid | ✅ | CSS Grid layout |
| Box | ✅ | Generic container |
| Container | ✅ | Centered max-width container |
| Center | ✅ | Centers children |
| Card | ✅ ⚠️ | Uses existing components/ui/card.tsx |
| Divider | 🔄 | TODO: Implement Separator |

### Typography (16/16 ✅)
| Component | Status | Notes |
|-----------|--------|-------|
| Text | ✅ | Adaptive text with usage hints |
| Title | ✅ | Alias for Text |
| Heading | ✅ | Alias for Text |
| H1-H6 | ✅ | Heading shortcuts |
| Badge | ✅ ⚠️ | Uses existing components/ui/badge.tsx |
| Label | ✅ | Form labels |
| Code | ✅ | Inline code |
| Blockquote | ✅ | Quote blocks |
| Link | ✅ | Hyperlinks |
| Image | 🔄 | TODO: Implement |
| Avatar | 🔄 ⚠️ | Need adapter for components/ui/avatar.tsx |

### Forms (13 total, 7/13 ✅)
| Component | Status | Notes |
|-----------|--------|-------|
| Button | ✅ ⚠️ | Uses existing components/ui/button.tsx |
| Input / TextField | ✅ ⚠️ | Uses existing components/ui/input.tsx |
| Textarea | ✅ ⚠️ | Uses existing components/ui/textarea.tsx |
| Checkbox | ✅ ⚠️ | Uses existing components/ui/checkbox (need to add) |
| Switch | ✅ ⚠️ | Uses existing components/ui/switch.tsx |
| Slider | ✅ ⚠️ | Uses existing components/ui/slider.tsx |
| NumberInput | ✅ | Custom number input |
| Select | 🔄 ⚠️ | Need adapter for components/ui/select.tsx |
| RadioGroup | 🔄 | TODO: Implement |
| MultiSelect | 🔄 | TODO: Implement |
| DateTimeInput | 🔄 | TODO: Implement |
| ActionIcon | 🔄 | TODO: Icon button |
| IconButton | 🔄 | Alias for ActionIcon |

### Feedback (0/5)
| Component | Status | Notes |
|-----------|--------|-------|
| Alert | 🔄 ⚠️ | Need adapter for components/ui/alert.tsx |
| Progress | 🔄 ⚠️ | Need adapter for components/ui/progress.tsx |
| Spinner | 🔄 ⚠️ | Need adapter for components/ui/spinner.tsx |
| Toast | 🔄 | TODO: Implement |
| Tooltip | 🔄 ⚠️ | Need adapter for components/ui/tooltip.tsx |

### Navigation (0/4)
| Component | Status | Notes |
|-----------|--------|-------|
| Tabs | 🔄 ⚠️ | Need adapter for components/ui/tabs.tsx |
| TabPanel | 🔄 | Goes with Tabs |
| Breadcrumb | 🔄 | TODO: Implement |
| Pagination | 🔄 | TODO: Implement |

### Data Display (0/6)
| Component | Status | Notes |
|-----------|--------|-------|
| List | 🔄 | TODO: Implement |
| Table | 🔄 | TODO: Implement |
| TableHeader | 🔄 | Goes with Table |
| TableBody | 🔄 | Goes with Table |
| TableRow | 🔄 | Goes with Table |
| TableCell | 🔄 | Goes with Table |
| Skeleton | 🔄 | TODO: Implement |

### Disclosure & Overlay (0/8)
| Component | Status | Notes |
|-----------|--------|-------|
| Accordion | 🔄 ⚠️ | Need adapter for components/ui/accordion.tsx |
| AccordionItem | 🔄 | Goes with Accordion |
| Collapsible | 🔄 ⚠️ | Need adapter for components/ui/collapsible.tsx |
| Dialog | 🔄 ⚠️ | Need adapter for components/ui/dialog.tsx |
| Sheet | 🔄 | TODO: Implement |
| Popover | 🔄 ⚠️ | Need adapter for components/ui/popover.tsx |
| DropdownMenu | 🔄 ⚠️ | Need adapter for components/ui/dropdown-menu.tsx |
| HoverCard | 🔄 ⚠️ | Need adapter for components/ui/hover-card.tsx |

### Utility (0/3)
| Component | Status | Notes |
|-----------|--------|-------|
| Separator | 🔄 ⚠️ | Need adapter for components/ui/separator.tsx |
| ScrollArea | 🔄 ⚠️ | Need adapter for components/ui/scroll-area.tsx |
| AspectRatio | 🔄 | TODO: Implement |

**Current Standard UI Status: 35/76 (46%)**

---

## 2. Custom Specialized Components (11 total) 🎨

These use the **composable pattern** and should remain as-is:

| Component | Status | Type | Description |
|-----------|--------|------|-------------|
| Timeline | 🎨 ✅ | Data Viz | Interactive timeline with TimelineJS |
| Maps | 🎨 ✅ | Data Viz | Leaflet maps with markers |
| ThreeScene | 🎨 ✅ | 3D | Three.js 3D scenes |
| SVGPreview | 🎨 ✅ | Media | SVG viewer with source |
| NodeEditor | 🎨 ✅ | Data Viz | React Flow node editor |
| KnowledgeGraph | 🎨 ✅ | Data Viz | Entity-relationship graphs |
| Latex | 🎨 ✅ | Math | KaTeX equation renderer |
| ModelViewer | 🎨 ✅ | 3D | 3D model viewer (GLTF, etc.) |
| Phaser | 🎨 ✅ | Game | Phaser game engine |
| Mermaid | 🎨 ✅ | Diagram | Mermaid diagrams |
| Remotion | 🎨 ✅ | Video | Remotion video composition |

---

## 3. AI Elements (70+ components)

### Chat/Conversation (10 components)
| Component | Recommendation | Priority |
|-----------|---------------|----------|
| message | Create simple adapter | High |
| prompt-input | Create simple adapter | High |
| conversation | Create simple adapter | High |
| reasoning | Create simple adapter | Medium |
| chain-of-thought | Create simple adapter | Medium |
| suggestion | Create simple adapter | Medium |
| confirmation | Create simple adapter | Medium |
| persona | Create simple adapter | Low |
| agent | Create simple adapter | Low |
| open-in-chat | Keep as-is | Low |

### Development Tools (15 components)
| Component | Recommendation | Priority |
|-----------|---------------|----------|
| code-block | Create simple adapter | High |
| terminal | Create simple adapter | High |
| file-tree | Create simple adapter | High |
| sandbox | Create simple adapter | Medium |
| test-results | Create simple adapter | Medium |
| stack-trace | Create simple adapter | Medium |
| commit | Create simple adapter | Medium |
| package-info | Create simple adapter | Low |
| environment-variables | Create simple adapter | Low |
| snippet | Keep as-is | Low |
| jsx-preview | Keep as-is (complex) | Low |
| web-preview | Keep as-is (complex) | Low |
| schema-display | Keep as-is | Low |
| connection | Keep as-is | Low |
| context | Keep as-is | Low |

### UI Components (20 components)
| Component | Recommendation | Priority |
|-----------|---------------|----------|
| artifact | Create simple adapter | High |
| canvas | Create simple adapter | Medium |
| panel | Create simple adapter | Medium |
| toolbar | Create simple adapter | Medium |
| controls | Create simple adapter | Medium |
| shimmer | Create simple adapter | Low |
| checkpoint | Keep as-is | Low |
| edge | Keep as-is (React Flow) | Low |
| node | Keep as-is (React Flow) | Low |
| plan | Keep as-is | Low |
| queue | Keep as-is | Low |
| task | Keep as-is | Low |
| generative-message | Keep as-is (complex) | Low |
| attachments | Keep as-is | Low |
| image | Keep as-is | Low |
| inline-citation | Keep as-is | Low |
| sources | Keep as-is | Low |
| audio-player | Keep as-is | Low |
| transcription | Keep as-is | Low |
| tool | Keep as-is | Low |

### Input Components (10 components)
| Component | Recommendation | Priority |
|-----------|---------------|----------|
| mic-selector | Keep as-is (specialized) | Low |
| voice-selector | Keep as-is (specialized) | Low |
| model-selector | Keep as-is (specialized) | Low |
| speech-input | Keep as-is (specialized) | Low |

---

## Implementation Priority

### Phase 1: Core UI Adapters (High Priority) - 41 components
1. Complete remaining form adapters (Select, RadioGroup, DateTimeInput)
2. Add feedback adapters (Alert, Progress, Spinner, Toast, Tooltip)
3. Add navigation adapters (Tabs, Breadcrumb, Pagination)
4. Add data display adapters (List, Table components, Skeleton)
5. Add disclosure adapters (Accordion, Dialog, Sheet, Popover, DropdownMenu)
6. Add utility adapters (Separator, ScrollArea, AspectRatio)

### Phase 2: AI Element Adapters (Medium Priority) - 25 components
1. Chat components (message, prompt-input, conversation, etc.)
2. Development tools (code-block, terminal, file-tree, etc.)
3. UI components (artifact, canvas, panel, etc.)

### Phase 3: Low Priority - 15 components
1. Specialized input components
2. Complex components that work fine as-is

---

## Deduplication Strategy

For components that exist in both `/components/ui` and adapters:
1. ✅ **Use existing shadcn component** - Import and wrap with adapter
2. ⚠️ **No duplication** - Single source of truth in `/components/ui`
3. 🎨 **Specialized components** - Keep in `/components/ai-elements`

Example:
```typescript
// ✅ Good - Uses existing component
import { Button } from '@/components/ui/button';
export const ButtonAdapter = createAdapter(Button, { ... });

// ❌ Bad - Duplicates component
export const ButtonAdapter = () => <button>...</button>;
```
