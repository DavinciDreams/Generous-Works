/**
 * Standard UI Component Catalog
 * Catalog entries for standard shadcn/UI components adapted for A2UI
 */

import type { ComponentCatalog } from './types';

/**
 * Standard UI Component Catalog
 * These components use the adapter pattern and map to shadcn/ui
 */
export const standardUICatalog: ComponentCatalog = {
  // LAYOUT COMPONENTS
  Row: {
    type: 'Row',
    description: `Horizontal flex layout container. Arranges children in a row with distribution and alignment options.`,
    props: ['children', 'distribution', 'alignment'],
    examples: [{
      description: 'Row with centered items',
      spec: {
        id: 'row-1',
        component: {
          Row: {
            distribution: { literalString: 'spaceBetween' },
            alignment: { literalString: 'center' },
            children: ['child-1', 'child-2']
          }
        }
      }
    }]
  },

  Column: {
    type: 'Column',
    description: `Vertical flex layout container. Arranges children in a column with distribution and alignment options.`,
    props: ['children', 'distribution', 'alignment'],
    examples: [{
      description: 'Column with start alignment',
      spec: {
        id: 'col-1',
        component: {
          Column: {
            distribution: { literalString: 'start' },
            alignment: { literalString: 'stretch' },
            children: ['child-1', 'child-2']
          }
        }
      }
    }]
  },

  Card: {
    type: 'Card',
    description: `Card container for grouping related content.`,
    props: ['children'],
    examples: [{
      description: 'Simple card',
      spec: {
        id: 'card-1',
        component: {
          Card: {
            children: ['content-1']
          }
        }
      }
    }]
  },

  // TYPOGRAPHY COMPONENTS
  Text: {
    type: 'Text',
    description: `Text component with adaptive rendering based on usage hint. Supports h1-h6, body, caption.`,
    props: ['text', 'usageHint'],
    examples: [{
      description: 'Heading text',
      spec: {
        id: 'text-1',
        component: {
          Text: {
            text: { literalString: 'Hello World' },
            usageHint: { literalString: 'h1' }
          }
        }
      }
    }]
  },

  Button: {
    type: 'Button',
    description: `Interactive button with variants and action handling.`,
    props: ['children', 'action', 'variant', 'disabled', 'fullWidth', 'compact'],
    examples: [{
      description: 'Primary button with action',
      spec: {
        id: 'btn-1',
        component: {
          Button: {
            children: 'btn-text',
            action: { name: 'submit' },
            variant: { literalString: 'filled' }
          }
        }
      }
    }]
  },

  Badge: {
    type: 'Badge',
    description: `Small badge for labels, tags, or status indicators.`,
    props: ['text', 'variant'],
    examples: [{
      description: 'Status badge',
      spec: {
        id: 'badge-1',
        component: {
          Badge: {
            text: { literalString: 'New' },
            variant: { literalString: 'default' }
          }
        }
      }
    }]
  },

  // FORM COMPONENTS
  Input: {
    type: 'Input',
    description: `Text input field with placeholder and action handling.`,
    props: ['text', 'placeholder', 'disabled', 'action'],
    examples: [{
      description: 'Email input',
      spec: {
        id: 'input-1',
        component: {
          Input: {
            placeholder: { literalString: 'Enter email' },
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  Checkbox: {
    type: 'Checkbox',
    description: `Checkbox input with checked state and action handling.`,
    props: ['checked', 'disabled', 'action'],
    examples: [{
      description: 'Agreement checkbox',
      spec: {
        id: 'check-1',
        component: {
          Checkbox: {
            checked: { literalBoolean: false },
            action: { name: 'onToggle' }
          }
        }
      }
    }]
  },

  Switch: {
    type: 'Switch',
    description: `Toggle switch for boolean states.`,
    props: ['checked', 'disabled', 'action'],
    examples: [{
      description: 'Enable notifications switch',
      spec: {
        id: 'switch-1',
        component: {
          Switch: {
            checked: { literalBoolean: true },
            action: { name: 'onToggle' }
          }
        }
      }
    }]
  },

  Slider: {
    type: 'Slider',
    description: `Slider input for numeric range selection.`,
    props: ['value', 'min', 'max', 'step', 'disabled', 'action'],
    examples: [{
      description: 'Volume slider',
      spec: {
        id: 'slider-1',
        component: {
          Slider: {
            value: { literalNumber: 50 },
            min: { literalNumber: 0 },
            max: { literalNumber: 100 },
            step: { literalNumber: 1 },
            action: { name: 'onValueChange' }
          }
        }
      }
    }]
  },

  Textarea: {
    type: 'Textarea',
    description: `Multi-line text input area.`,
    props: ['text', 'placeholder', 'rows', 'disabled', 'action'],
    examples: [{
      description: 'Comment textarea',
      spec: {
        id: 'textarea-1',
        component: {
          Textarea: {
            placeholder: { literalString: 'Enter your comment' },
            rows: { literalNumber: 4 },
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  // ===== LAYOUT COMPONENTS (11 additional) =====

  HStack: {
    type: 'HStack',
    description: `Horizontal stack layout. Alias for Row component. Arranges children horizontally with spacing.`,
    props: ['children', 'distribution', 'alignment'],
    examples: [{
      description: 'Horizontal stack with centered items',
      spec: {
        id: 'hstack-1',
        component: {
          HStack: {
            distribution: { literalString: 'spaceBetween' },
            alignment: { literalString: 'center' },
            children: ['child-1', 'child-2']
          }
        }
      }
    }]
  },

  VStack: {
    type: 'VStack',
    description: `Vertical stack layout. Alias for Column component. Arranges children vertically with spacing.`,
    props: ['children', 'distribution', 'alignment'],
    examples: [{
      description: 'Vertical stack with start alignment',
      spec: {
        id: 'vstack-1',
        component: {
          VStack: {
            distribution: { literalString: 'start' },
            alignment: { literalString: 'stretch' },
            children: ['child-1', 'child-2']
          }
        }
      }
    }]
  },

  Stack: {
    type: 'Stack',
    description: `Stack layout. Alias for Column component. Arranges children in a vertical stack.`,
    props: ['children', 'distribution', 'alignment'],
    examples: [{
      description: 'Simple stack',
      spec: {
        id: 'stack-1',
        component: {
          Stack: {
            children: ['child-1', 'child-2']
          }
        }
      }
    }]
  },

  Flex: {
    type: 'Flex',
    description: `Generic flex container with configurable direction, wrap, and gap.`,
    props: ['children', 'direction', 'wrap', 'gap'],
    examples: [{
      description: 'Flex row with wrap',
      spec: {
        id: 'flex-1',
        component: {
          Flex: {
            direction: { literalString: 'row' },
            wrap: { literalBoolean: true },
            gap: { literalString: '4' },
            children: ['child-1', 'child-2', 'child-3']
          }
        }
      }
    }]
  },

  Grid: {
    type: 'Grid',
    description: `CSS Grid layout container with configurable columns and gap.`,
    props: ['children', 'columns', 'gap'],
    examples: [{
      description: 'Grid with 3 columns',
      spec: {
        id: 'grid-1',
        component: {
          Grid: {
            columns: { literalNumber: 3 },
            gap: { literalString: '4' },
            children: ['cell-1', 'cell-2', 'cell-3', 'cell-4', 'cell-5', 'cell-6']
          }
        }
      }
    }]
  },

  Box: {
    type: 'Box',
    description: `Generic block-level container for content.`,
    props: ['children'],
    examples: [{
      description: 'Simple box container',
      spec: {
        id: 'box-1',
        component: {
          Box: {
            children: ['content-1']
          }
        }
      }
    }]
  },

  Container: {
    type: 'Container',
    description: `Centered max-width container with horizontal padding.`,
    props: ['children'],
    examples: [{
      description: 'Container with content',
      spec: {
        id: 'container-1',
        component: {
          Container: {
            children: ['content-1']
          }
        }
      }
    }]
  },

  Center: {
    type: 'Center',
    description: `Container that centers its children both horizontally and vertically.`,
    props: ['children'],
    examples: [{
      description: 'Centered content',
      spec: {
        id: 'center-1',
        component: {
          Center: {
            children: ['content-1']
          }
        }
      }
    }]
  },

  Divider: {
    type: 'Divider',
    description: `Visual separator line. Alias for Separator.`,
    props: ['orientation', 'decorative'],
    examples: [{
      description: 'Horizontal divider',
      spec: {
        id: 'divider-1',
        component: {
          Divider: {
            orientation: { literalString: 'horizontal' },
            decorative: { literalBoolean: true }
          }
        }
      }
    }]
  },

  Separator: {
    type: 'Separator',
    description: `Visual separator line with configurable orientation.`,
    props: ['orientation', 'decorative'],
    examples: [{
      description: 'Vertical separator',
      spec: {
        id: 'separator-1',
        component: {
          Separator: {
            orientation: { literalString: 'vertical' },
            decorative: { literalBoolean: true }
          }
        }
      }
    }]
  },

  ScrollArea: {
    type: 'ScrollArea',
    description: `Scrollable container with custom scrollbar styling.`,
    props: ['children', 'height', 'width'],
    examples: [{
      description: 'Scrollable area with fixed height',
      spec: {
        id: 'scrollarea-1',
        component: {
          ScrollArea: {
            height: { literalString: '300px' },
            width: { literalString: '100%' },
            children: ['content-1']
          }
        }
      }
    }]
  },

  AspectRatio: {
    type: 'AspectRatio',
    description: `Container that maintains a specific aspect ratio for its content.`,
    props: ['children', 'ratio'],
    examples: [{
      description: '16:9 aspect ratio container',
      spec: {
        id: 'aspectratio-1',
        component: {
          AspectRatio: {
            ratio: { literalNumber: 1.777 },
            children: ['content-1']
          }
        }
      }
    }]
  },

  // ===== TYPOGRAPHY COMPONENTS (13 additional) =====

  Title: {
    type: 'Title',
    description: `Title/Heading component. Alias for Text with heading hints.`,
    props: ['text', 'usageHint'],
    examples: [{
      description: 'Title as h1',
      spec: {
        id: 'title-1',
        component: {
          Title: {
            text: { literalString: 'Page Title' },
            usageHint: { literalString: 'h1' }
          }
        }
      }
    }]
  },

  Heading: {
    type: 'Heading',
    description: `Heading component. Alias for Text with heading hints.`,
    props: ['text', 'usageHint'],
    examples: [{
      description: 'Heading as h2',
      spec: {
        id: 'heading-1',
        component: {
          Heading: {
            text: { literalString: 'Section Heading' },
            usageHint: { literalString: 'h2' }
          }
        }
      }
    }]
  },

  H1: {
    type: 'H1',
    description: `Level 1 heading. Largest heading style.`,
    props: ['text'],
    examples: [{
      description: 'Main page heading',
      spec: {
        id: 'h1-1',
        component: {
          H1: {
            text: { literalString: 'Welcome to My App' }
          }
        }
      }
    }]
  },

  H2: {
    type: 'H2',
    description: `Level 2 heading. Large heading with bottom border.`,
    props: ['text'],
    examples: [{
      description: 'Section heading',
      spec: {
        id: 'h2-1',
        component: {
          H2: {
            text: { literalString: 'Getting Started' }
          }
        }
      }
    }]
  },

  H3: {
    type: 'H3',
    description: `Level 3 heading. Medium-large heading.`,
    props: ['text'],
    examples: [{
      description: 'Subsection heading',
      spec: {
        id: 'h3-1',
        component: {
          H3: {
            text: { literalString: 'Installation' }
          }
        }
      }
    }]
  },

  H4: {
    type: 'H4',
    description: `Level 4 heading. Medium heading.`,
    props: ['text'],
    examples: [{
      description: 'Topic heading',
      spec: {
        id: 'h4-1',
        component: {
          H4: {
            text: { literalString: 'Configuration' }
          }
        }
      }
    }]
  },

  H5: {
    type: 'H5',
    description: `Level 5 heading. Small heading.`,
    props: ['text'],
    examples: [{
      description: 'Subtopic heading',
      spec: {
        id: 'h5-1',
        component: {
          H5: {
            text: { literalString: 'Options' }
          }
        }
      }
    }]
  },

  H6: {
    type: 'H6',
    description: `Level 6 heading. Smallest heading style.`,
    props: ['text'],
    examples: [{
      description: 'Minor heading',
      spec: {
        id: 'h6-1',
        component: {
          H6: {
            text: { literalString: 'Notes' }
          }
        }
      }
    }]
  },

  Label: {
    type: 'Label',
    description: `Form label for input fields.`,
    props: ['text'],
    examples: [{
      description: 'Email label',
      spec: {
        id: 'label-1',
        component: {
          Label: {
            text: { literalString: 'Email Address' }
          }
        }
      }
    }]
  },

  Code: {
    type: 'Code',
    description: `Inline code element with syntax highlighting style.`,
    props: ['text'],
    examples: [{
      description: 'Inline code',
      spec: {
        id: 'code-1',
        component: {
          Code: {
            text: { literalString: 'const x = 42;' }
          }
        }
      }
    }]
  },

  Blockquote: {
    type: 'Blockquote',
    description: `Block quote element with left border and italic styling.`,
    props: ['text'],
    examples: [{
      description: 'Quoted text',
      spec: {
        id: 'blockquote-1',
        component: {
          Blockquote: {
            text: { literalString: 'The only way to do great work is to love what you do.' }
          }
        }
      }
    }]
  },

  Link: {
    type: 'Link',
    description: `Hyperlink element with underline styling.`,
    props: ['text', 'href', 'url'],
    examples: [{
      description: 'External link',
      spec: {
        id: 'link-1',
        component: {
          Link: {
            text: { literalString: 'Learn More' },
            href: { literalString: 'https://example.com' }
          }
        }
      }
    }]
  },

  Image: {
    type: 'Image',
    description: `Image element with configurable size and usage hints.`,
    props: ['src', 'url', 'alt', 'width', 'height', 'usageHint'],
    examples: [{
      description: 'Profile avatar',
      spec: {
        id: 'image-1',
        component: {
          Image: {
            src: { literalString: 'https://example.com/avatar.jpg' },
            alt: { literalString: 'User avatar' },
            usageHint: { literalString: 'avatar' }
          }
        }
      }
    }]
  },

  Avatar: {
    type: 'Avatar',
    description: `User avatar component with fallback text.`,
    props: ['src', 'url', 'alt', 'name', 'fallback'],
    examples: [{
      description: 'Avatar with fallback',
      spec: {
        id: 'avatar-1',
        component: {
          Avatar: {
            name: { literalString: 'John Doe' },
            fallback: { literalString: 'JD' }
          }
        }
      }
    }]
  },

  // ===== FORM COMPONENTS (12 additional) =====

  ActionIcon: {
    type: 'ActionIcon',
    description: `Icon-only button for actions like edit, delete, or menu.`,
    props: ['icon', 'variant', 'size', 'disabled', 'action'],
    examples: [{
      description: 'Delete action icon',
      spec: {
        id: 'actionicon-1',
        component: {
          ActionIcon: {
            icon: '🗑️',
            variant: { literalString: 'destructive' },
            size: { literalString: 'sm' },
            action: { name: 'delete' }
          }
        }
      }
    }]
  },

  IconButton: {
    type: 'IconButton',
    description: `Icon-only button. Alias for ActionIcon.`,
    props: ['icon', 'variant', 'size', 'disabled', 'action'],
    examples: [{
      description: 'Edit icon button',
      spec: {
        id: 'iconbutton-1',
        component: {
          IconButton: {
            icon: '✏️',
            variant: { literalString: 'outline' },
            action: { name: 'edit' }
          }
        }
      }
    }]
  },

  TextField: {
    type: 'TextField',
    description: `Text input field. Alias for Input.`,
    props: ['text', 'value', 'placeholder', 'disabled', 'action'],
    examples: [{
      description: 'Name text field',
      spec: {
        id: 'textfield-1',
        component: {
          TextField: {
            placeholder: { literalString: 'Enter your name' },
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  TextInput: {
    type: 'TextInput',
    description: `Text input field. Alias for TextField.`,
    props: ['text', 'value', 'placeholder', 'disabled', 'action'],
    examples: [{
      description: 'Email text input',
      spec: {
        id: 'textinput-1',
        component: {
          TextInput: {
            placeholder: { literalString: 'Enter email' },
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  CheckBox: {
    type: 'CheckBox',
    description: `Checkbox input. Alias for Checkbox.`,
    props: ['checked', 'disabled', 'action'],
    examples: [{
      description: 'Terms checkbox',
      spec: {
        id: 'checkbox-1',
        component: {
          CheckBox: {
            checked: { literalBoolean: false },
            action: { name: 'onToggle' }
          }
        }
      }
    }]
  },

  Toggle: {
    type: 'Toggle',
    description: `Toggle switch. Alias for Switch.`,
    props: ['checked', 'disabled', 'action'],
    examples: [{
      description: 'Dark mode toggle',
      spec: {
        id: 'toggle-1',
        component: {
          Toggle: {
            checked: { literalBoolean: false },
            action: { name: 'onToggle' }
          }
        }
      }
    }]
  },

  NumberInput: {
    type: 'NumberInput',
    description: `Numeric input field with min, max, and step constraints.`,
    props: ['value', 'min', 'max', 'step', 'disabled', 'placeholder', 'action'],
    examples: [{
      description: 'Age number input',
      spec: {
        id: 'numberinput-1',
        component: {
          NumberInput: {
            min: { literalNumber: 0 },
            max: { literalNumber: 120 },
            step: { literalNumber: 1 },
            placeholder: { literalString: 'Enter age' },
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  DateTimeInput: {
    type: 'DateTimeInput',
    description: `Date and time input field with configurable mode.`,
    props: ['value', 'mode', 'disabled', 'placeholder', 'action'],
    examples: [{
      description: 'Date picker',
      spec: {
        id: 'datetimeinput-1',
        component: {
          DateTimeInput: {
            mode: { literalString: 'date' },
            placeholder: { literalString: 'Select date' },
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  Select: {
    type: 'Select',
    description: `Dropdown select component with options.`,
    props: ['options', 'items', 'placeholder', 'defaultValue', 'disabled', 'action'],
    examples: [{
      description: 'Country select',
      spec: {
        id: 'select-1',
        component: {
          Select: {
            placeholder: { literalString: 'Select country' },
            options: [
              { value: { literalString: 'us' }, label: { literalString: 'United States' } },
              { value: { literalString: 'uk' }, label: { literalString: 'United Kingdom' } },
              { value: { literalString: 'ca' }, label: { literalString: 'Canada' } }
            ],
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  MultiSelect: {
    type: 'MultiSelect',
    description: `Multi-select component allowing multiple selections.`,
    props: ['options', 'items', 'defaultValue', 'disabled', 'action'],
    examples: [{
      description: 'Interest multi-select',
      spec: {
        id: 'multiselect-1',
        component: {
          MultiSelect: {
            options: [
              { value: { literalString: 'tech' }, label: { literalString: 'Technology' } },
              { value: { literalString: 'sports' }, label: { literalString: 'Sports' } },
              { value: { literalString: 'music' }, label: { literalString: 'Music' } }
            ],
            defaultValue: { literalArray: [] },
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  RadioGroup: {
    type: 'RadioGroup',
    description: `Radio button group for single selection from options.`,
    props: ['options', 'items', 'defaultValue', 'disabled', 'action'],
    examples: [{
      description: 'Gender radio group',
      spec: {
        id: 'radiogroup-1',
        component: {
          RadioGroup: {
            options: [
              { value: { literalString: 'male' }, label: { literalString: 'Male' } },
              { value: { literalString: 'female' }, label: { literalString: 'Female' } },
              { value: { literalString: 'other' }, label: { literalString: 'Other' } }
            ],
            defaultValue: { literalString: 'male' },
            action: { name: 'onChange' }
          }
        }
      }
    }]
  },

  // ===== FEEDBACK COMPONENTS (6 additional) =====

  Progress: {
    type: 'Progress',
    description: `Progress bar showing completion percentage.`,
    props: ['value', 'max'],
    examples: [{
      description: '75% complete',
      spec: {
        id: 'progress-1',
        component: {
          Progress: {
            value: { literalNumber: 75 },
            max: { literalNumber: 100 }
          }
        }
      }
    }]
  },

  Spinner: {
    type: 'Spinner',
    description: `Loading spinner animation.`,
    props: ['size', 'className'],
    examples: [{
      description: 'Loading spinner',
      spec: {
        id: 'spinner-1',
        component: {
          Spinner: {
            size: { literalString: 'default' }
          }
        }
      }
    }]
  },

  Loader: {
    type: 'Loader',
    description: `Loading spinner. Alias for Spinner.`,
    props: ['size', 'className'],
    examples: [{
      description: 'Large loader',
      spec: {
        id: 'loader-1',
        component: {
          Loader: {
            size: { literalString: 'lg' }
          }
        }
      }
    }]
  },

  Loading: {
    type: 'Loading',
    description: `Loading spinner. Alias for Spinner.`,
    props: ['size', 'className'],
    examples: [{
      description: 'Small loading indicator',
      spec: {
        id: 'loading-1',
        component: {
          Loading: {
            size: { literalString: 'sm' }
          }
        }
      }
    }]
  },

  Toast: {
    type: 'Toast',
    description: `Toast notification with title and description.`,
    props: ['title', 'description', 'text', 'variant'],
    examples: [{
      description: 'Success toast',
      spec: {
        id: 'toast-1',
        component: {
          Toast: {
            title: { literalString: 'Success' },
            description: { literalString: 'Your changes have been saved.' },
            variant: { literalString: 'success' }
          }
        }
      }
    }]
  },

  Tooltip: {
    type: 'Tooltip',
    description: `Tooltip that appears on hover over content.`,
    props: ['content', 'text', 'side', 'children'],
    examples: [{
      description: 'Button with tooltip',
      spec: {
        id: 'tooltip-1',
        component: {
          Tooltip: {
            content: { literalString: 'Click to save' },
            side: { literalString: 'top' },
            children: ['button-1']
          }
        }
      }
    }]
  },

  // ===== NAVIGATION COMPONENTS (5 additional) =====

  Tabs: {
    type: 'Tabs',
    description: `Tabbed interface with multiple tab panels.`,
    props: ['tabItems', 'items', 'defaultValue'],
    examples: [{
      description: 'Tabs with 3 panels',
      spec: {
        id: 'tabs-1',
        component: {
          Tabs: {
            tabItems: [
              { title: { literalString: 'Overview' }, value: { literalString: 'tab-0' }, content: { literalString: 'Overview content' } },
              { title: { literalString: 'Details' }, value: { literalString: 'tab-1' }, content: { literalString: 'Details content' } },
              { title: { literalString: 'Settings' }, value: { literalString: 'tab-2' }, content: { literalString: 'Settings content' } }
            ]
          }
        }
      }
    }]
  },

  TabPanel: {
    type: 'TabPanel',
    description: `Individual tab panel content.`,
    props: ['value', 'children'],
    examples: [{
      description: 'Tab panel content',
      spec: {
        id: 'tabpanel-1',
        component: {
          TabPanel: {
            value: { literalString: 'tab-1' },
            children: ['content-1']
          }
        }
      }
    }]
  },

  Breadcrumb: {
    type: 'Breadcrumb',
    description: `Breadcrumb navigation showing page hierarchy.`,
    props: ['items'],
    examples: [{
      description: 'Breadcrumb trail',
      spec: {
        id: 'breadcrumb-1',
        component: {
          Breadcrumb: {
            items: [
              { label: { literalString: 'Home' }, href: { literalString: '/' } },
              { label: { literalString: 'Products' }, href: { literalString: '/products' } },
              { label: { literalString: 'Details' } }
            ]
          }
        }
      }
    }]
  },

  Breadcrumbs: {
    type: 'Breadcrumbs',
    description: `Breadcrumb navigation. Alias for Breadcrumb.`,
    props: ['items'],
    examples: [{
      description: 'Breadcrumbs trail',
      spec: {
        id: 'breadcrumbs-1',
        component: {
          Breadcrumbs: {
            items: [
              { label: { literalString: 'Home' }, href: { literalString: '/' } },
              { label: { literalString: 'About' } }
            ]
          }
        }
      }
    }]
  },

  Pagination: {
    type: 'Pagination',
    description: `Pagination controls for navigating through pages.`,
    props: ['currentPage', 'page', 'totalPages', 'total', 'action'],
    examples: [{
      description: 'Pagination with 5 pages',
      spec: {
        id: 'pagination-1',
        component: {
          Pagination: {
            currentPage: { literalNumber: 2 },
            totalPages: { literalNumber: 5 },
            action: { name: 'onPageChange' }
          }
        }
      }
    }]
  },

  // ===== DATA DISPLAY COMPONENTS (7 additional) =====

  List: {
    type: 'List',
    description: `List component with ordered or unordered items.`,
    props: ['items', 'ordered', 'direction'],
    examples: [{
      description: 'Unordered list',
      spec: {
        id: 'list-1',
        component: {
          List: {
            ordered: { literalBoolean: false },
            items: [
              { text: { literalString: 'Item 1' } },
              { text: { literalString: 'Item 2' } },
              { text: { literalString: 'Item 3' } }
            ]
          }
        }
      }
    }]
  },

  Table: {
    type: 'Table',
    description: `Table container for tabular data.`,
    props: ['children'],
    examples: [{
      description: 'Table with header and body',
      spec: {
        id: 'table-1',
        component: {
          Table: {
            children: ['tableheader-1', 'tablebody-1']
          }
        }
      }
    }]
  },

  TableHeader: {
    type: 'TableHeader',
    description: `Table header row container.`,
    props: ['children'],
    examples: [{
      description: 'Table header',
      spec: {
        id: 'tableheader-1',
        component: {
          TableHeader: {
            children: ['tablerow-1']
          }
        }
      }
    }]
  },

  TableBody: {
    type: 'TableBody',
    description: `Table body rows container.`,
    props: ['children'],
    examples: [{
      description: 'Table body',
      spec: {
        id: 'tablebody-1',
        component: {
          TableBody: {
            children: ['tablerow-2', 'tablerow-3']
          }
        }
      }
    }]
  },

  TableRow: {
    type: 'TableRow',
    description: `Table row with cells.`,
    props: ['cells', 'children'],
    examples: [{
      description: 'Table row with cells',
      spec: {
        id: 'tablerow-1',
        component: {
          TableRow: {
            cells: [
              { content: { literalString: 'Name' } },
              { content: { literalString: 'Age' } },
              { content: { literalString: 'City' } }
            ]
          }
        }
      }
    }]
  },

  TableCell: {
    type: 'TableCell',
    description: `Table cell with optional header styling.`,
    props: ['content', 'header'],
    examples: [{
      description: 'Table cell',
      spec: {
        id: 'tablecell-1',
        component: {
          TableCell: {
            header: { literalBoolean: true },
            content: { literalString: 'Name' }
          }
        }
      }
    }]
  },

  Skeleton: {
    type: 'Skeleton',
    description: `Skeleton loading placeholder with animation.`,
    props: ['width', 'height', 'circle'],
    examples: [{
      description: 'Skeleton text placeholder',
      spec: {
        id: 'skeleton-1',
        component: {
          Skeleton: {
            width: { literalString: '100%' },
            height: { literalString: '1rem' }
          }
        }
      }
    }]
  },

  // ===== DISCLOSURE & OVERLAY COMPONENTS (10 additional) =====

  Accordion: {
    type: 'Accordion',
    description: `Collapsible accordion with multiple items.`,
    props: ['items', 'type', 'collapsible'],
    examples: [{
      description: 'Accordion with 3 items',
      spec: {
        id: 'accordion-1',
        component: {
          Accordion: {
            type: { literalString: 'single' },
            items: [
              { title: { literalString: 'Section 1' }, value: { literalString: 'item-0' }, content: { literalString: 'Content 1' } },
              { title: { literalString: 'Section 2' }, value: { literalString: 'item-1' }, content: { literalString: 'Content 2' } },
              { title: { literalString: 'Section 3' }, value: { literalString: 'item-2' }, content: { literalString: 'Content 3' } }
            ]
          }
        }
      }
    }]
  },

  AccordionItem: {
    type: 'AccordionItem',
    description: `Individual accordion item with title and content.`,
    props: ['value', 'title', 'trigger', 'children'],
    examples: [{
      description: 'Accordion item',
      spec: {
        id: 'accordionitem-1',
        component: {
          AccordionItem: {
            value: { literalString: 'item-1' },
            title: { literalString: 'FAQ Item' },
            children: ['content-1']
          }
        }
      }
    }]
  },

  Collapsible: {
    type: 'Collapsible',
    description: `Collapsible content with trigger button.`,
    props: ['trigger', 'defaultOpen', 'children'],
    examples: [{
      description: 'Collapsible section',
      spec: {
        id: 'collapsible-1',
        component: {
          Collapsible: {
            trigger: { literalString: 'Show Details' },
            defaultOpen: { literalBoolean: false },
            children: ['content-1']
          }
        }
      }
    }]
  },

  Dialog: {
    type: 'Dialog',
    description: `Modal dialog with trigger and content.`,
    props: ['trigger', 'entryPointChild', 'title', 'description', 'content', 'contentChild'],
    examples: [{
      description: 'Dialog with content',
      spec: {
        id: 'dialog-1',
        component: {
          Dialog: {
            trigger: { literalString: 'Open Dialog' },
            title: { literalString: 'Confirm Action' },
            description: { literalString: 'Are you sure you want to proceed?' },
            content: { literalString: 'Dialog content goes here' }
          }
        }
      }
    }]
  },

  Modal: {
    type: 'Modal',
    description: `Modal dialog. Alias for Dialog.`,
    props: ['trigger', 'entryPointChild', 'title', 'description', 'content', 'contentChild'],
    examples: [{
      description: 'Modal dialog',
      spec: {
        id: 'modal-1',
        component: {
          Modal: {
            trigger: { literalString: 'Open Modal' },
            title: { literalString: 'Information' },
            content: { literalString: 'Modal content' }
          }
        }
      }
    }]
  },

  Sheet: {
    type: 'Sheet',
    description: `Side sheet panel that slides in from edge.`,
    props: ['trigger', 'title', 'description', 'side'],
    examples: [{
      description: 'Right-side sheet',
      spec: {
        id: 'sheet-1',
        component: {
          Sheet: {
            trigger: { literalString: 'Open Sheet' },
            title: { literalString: 'Settings' },
            side: { literalString: 'right' }
          }
        }
      }
    }]
  },

  Drawer: {
    type: 'Drawer',
    description: `Side drawer. Alias for Sheet.`,
    props: ['trigger', 'title', 'description', 'side'],
    examples: [{
      description: 'Left-side drawer',
      spec: {
        id: 'drawer-1',
        component: {
          Drawer: {
            trigger: { literalString: 'Open Drawer' },
            title: { literalString: 'Navigation' },
            side: { literalString: 'left' }
          }
        }
      }
    }]
  },

  Popover: {
    type: 'Popover',
    description: `Popover that appears relative to trigger element.`,
    props: ['trigger', 'content', 'side', 'align'],
    examples: [{
      description: 'Popover with content',
      spec: {
        id: 'popover-1',
        component: {
          Popover: {
            trigger: { literalString: 'Click me' },
            content: { literalString: 'Popover content' },
            side: { literalString: 'bottom' }
          }
        }
      }
    }]
  },

  DropdownMenu: {
    type: 'DropdownMenu',
    description: `Dropdown menu with clickable items.`,
    props: ['trigger', 'items'],
    examples: [{
      description: 'Dropdown menu',
      spec: {
        id: 'dropdownmenu-1',
        component: {
          DropdownMenu: {
            trigger: { literalString: 'Menu' },
            items: [
              { label: { literalString: 'Profile' }, action: { name: 'profile' } },
              { label: { literalString: 'Settings' }, action: { name: 'settings' } },
              { label: { literalString: 'Logout' }, action: { name: 'logout' } }
            ]
          }
        }
      }
    }]
  },

  Menu: {
    type: 'Menu',
    description: `Dropdown menu. Alias for DropdownMenu.`,
    props: ['trigger', 'items'],
    examples: [{
      description: 'Menu with items',
      spec: {
        id: 'menu-1',
        component: {
          Menu: {
            trigger: { literalString: 'Options' },
            items: [
              { label: { literalString: 'Copy' }, action: { name: 'copy' } },
              { label: { literalString: 'Paste' }, action: { name: 'paste' } }
            ]
          }
        }
      }
    }]
  },

  HoverCard: {
    type: 'HoverCard',
    description: `Card that appears on hover over trigger.`,
    props: ['trigger', 'content'],
    examples: [{
      description: 'Hover card',
      spec: {
        id: 'hovercard-1',
        component: {
          HoverCard: {
            trigger: { literalString: 'Hover over me' },
            content: { literalString: 'Card content' }
          }
        }
      }
    }]
  },
};

/**
 * Get standard UI catalog as AI prompt
 */
export function getStandardUICatalogPrompt(): string {
  const components = Object.values(standardUICatalog);

  return `Standard UI Components (${components.length} available):

${components.map((comp, i) => `${i + 1}. ${comp.type}
   ${comp.description}
   Props: ${comp.props.join(', ')}

   Example:
   ${JSON.stringify(comp.examples?.[0]?.spec || {}, null, 2)}
`).join('\n')}`;
}
