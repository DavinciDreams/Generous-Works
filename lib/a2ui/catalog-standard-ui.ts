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
    props: ['child', 'children'],
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
    props: ['child', 'action', 'variant', 'disabled', 'fullWidth', 'compact'],
    examples: [{
      description: 'Primary button with action',
      spec: {
        id: 'btn-1',
        component: {
          Button: {
            child: 'btn-text',
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
