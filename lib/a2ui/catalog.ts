/**
 * A2UI Component Catalog
 * Defines available AI Elements for agent-generated UIs
 *
 * Includes:
 * - Specialized components (Timeline, Maps, 3D, etc.)
 * - Standard UI components (Button, Input, Card, etc.)
 */

import type { ComponentCatalog, ComponentExample } from './types';
import { standardUICatalog, getStandardUICatalogPrompt } from './catalog-standard-ui';

/**
 * Timeline Component Examples
 */
const timelineExamples: ComponentExample[] = [
  {
    description: 'Simple timeline with 3 events',
    spec: {
      id: 'timeline-1',
      component: {
        Timeline: {
          data: {
            events: [
              {
                unique_id: 'event-1',
                start_date: { year: 2020, month: 1 },
                text: { headline: 'Event 1', text: 'Description' }
              },
              {
                unique_id: 'event-2',
                start_date: { year: 2021, month: 6 },
                text: { headline: 'Event 2', text: 'Description' }
              },
              {
                unique_id: 'event-3',
                start_date: { year: 2022, month: 12 },
                text: { headline: 'Event 3', text: 'Description' }
              }
            ]
          }
        }
      }
    }
  }
];

/**
 * Maps Component Examples
 */
const mapsExamples: ComponentExample[] = [
  {
    description: 'Map with single marker',
    spec: {
      id: 'maps-1',
      component: {
        Maps: {
          data: {
            center: { longitude: -122.4194, latitude: 37.7749 },
            zoom: 12,
            markers: [
              {
                id: 'marker-1',
                coordinates: { longitude: -122.4194, latitude: 37.7749 },
                label: 'San Francisco',
                color: 'blue'
              }
            ]
          }
        }
      }
    }
  }
];

/**
 * ThreeScene Component Examples
 */
const threeSceneExamples: ComponentExample[] = [
  {
    description: '3D scene with cube',
    spec: {
      id: 'threescene-1',
      component: {
        ThreeScene: {
          data: {
            camera: {
              type: 'perspective',
              position: { x: 5, y: 5, z: 5 },
              fov: 75
            },
            lights: [
              {
                type: 'ambient',
                color: 0xffffff,
                intensity: 0.6
              }
            ],
            objects: []
          },
          options: {
            enableControls: true,
            gridHelper: true
          }
        }
      }
    }
  }
];

/**
 * SVGPreview Component Examples
 */
const svgPreviewExamples: ComponentExample[] = [
  {
    description: 'Simple SVG circle',
    spec: {
      id: 'svgpreview-1',
      component: {
        SVGPreview: {
          svg: '<svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="blue" /></svg>',
          title: 'Blue Circle',
          filename: 'circle.svg'
        }
      }
    }
  }
];

/**
 * NodeEditor Component Examples
 */
const nodeEditorExamples: ComponentExample[] = [
  {
    description: 'Simple flow diagram with 2 nodes',
    spec: {
      id: 'nodeeditor-1',
      component: {
        NodeEditor: {
          data: {
            nodes: [
              {
                id: 'node-1',
                type: 'default',
                position: { x: 100, y: 100 },
                data: { label: 'Start' }
              },
              {
                id: 'node-2',
                type: 'default',
                position: { x: 300, y: 100 },
                data: { label: 'End' }
              }
            ],
            edges: [
              {
                id: 'edge-1',
                source: 'node-1',
                target: 'node-2',
                label: 'flow'
              }
            ]
          },
          options: {
            fitView: true,
            showControls: true
          }
        }
      }
    }
  }
];

/**
 * KnowledgeGraph Component Examples
 */
const knowledgeGraphExamples: ComponentExample[] = [
  {
    description: 'Simple knowledge graph with person and organization',
    spec: {
      id: 'knowledgegraph-1',
      component: {
        KnowledgeGraph: {
          data: {
            entities: [
              {
                id: 'person-1',
                label: 'John Doe',
                type: 'person',
                description: 'Software Engineer'
              },
              {
                id: 'org-1',
                label: 'Tech Corp',
                type: 'organization',
                description: 'Technology Company'
              }
            ],
            relationships: [
              {
                id: 'rel-1',
                source: 'person-1',
                target: 'org-1',
                type: 'works_at',
                label: 'works at'
              }
            ]
          },
          options: {
            layout: 'force',
            interactive: true
          }
        }
      }
    }
  }
];

/**
 * Latex Component Examples
 */
const latexExamples: ComponentExample[] = [
  {
    description: 'Quadratic formula',
    spec: {
      id: 'latex-1',
      component: {
        Latex: {
          data: {
            equation: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
            displayMode: true
          }
        }
      }
    }
  }
];

/**
 * ModelViewer Component Examples
 */
const modelViewerExamples: ComponentExample[] = [
  {
    description: '3D model viewer',
    spec: {
      id: 'modelviewer-1',
      component: {
        ModelViewer: {
          data: {
            url: 'https://example.com/model.glb',
            format: 'glb',
            scale: 1
          },
          options: {
            enableControls: true,
            autoRotate: true,
            showGrid: true
          }
        }
      }
    }
  }
];

/**
 * Phaser Component Examples
 */
const phaserExamples: ComponentExample[] = [
  {
    description: 'Simple Phaser game',
    spec: {
      id: 'phaser-1',
      component: {
        Phaser: {
          data: {
            config: {
              width: 800,
              height: 600,
              backgroundColor: '#2d2d2d'
            },
            scenes: [
              {
                key: 'main',
                create: 'scene.add.text(400, 300, "Hello Phaser!", { fontSize: "32px", color: "#fff" }).setOrigin(0.5);'
              }
            ]
          },
          options: {
            autoStart: true,
            showControls: true
          }
        }
      }
    }
  }
];

/**
 * Mermaid Component Examples
 */
const mermaidExamples: ComponentExample[] = [
  {
    description: 'Simple flowchart',
    spec: {
      id: 'mermaid-1',
      component: {
        Mermaid: {
          data: {
            diagram: `graph TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Action 1]\n    B -->|No| D[Action 2]\n    C --> E[End]\n    D --> E`
          }
        }
      }
    }
  }
];

/**
 * Remotion Component Examples
 */
const remotionExamples: ComponentExample[] = [
  {
    description: 'Simple video composition',
    spec: {
      id: 'remotion-1',
      component: {
        Remotion: {
          data: {
            composition: {
              id: 'MyVideo',
              component: 'MyComposition',
              width: 1920,
              height: 1080,
              fps: 30,
              durationInFrames: 150
            }
          },
          options: {
            autoPlay: false,
            loop: false,
            controls: true
          }
        }
      }
    }
  }
];

/**
 * Geospatial Component Examples
 */
const geospatialExamples: ComponentExample[] = [
  {
    description: 'Heatmap of population density',
    spec: {
      id: 'geospatial-1',
      component: {
        Geospatial: {
          data: {
            center: { lng: -122.4194, lat: 37.7749 },
            zoom: 10,
            layers: [
              {
                id: 'population-heatmap',
                type: 'heatmap',
                data: [
                  { lng: -122.4194, lat: 37.7749, value: 100 },
                  { lng: -122.4084, lat: 37.7849, value: 80 },
                  { lng: -122.4294, lat: 37.7649, value: 120 }
                ],
                style: {
                  color: ['#blue', '#red'],
                  opacity: 0.6
                }
              }
            ],
            basemap: 'dark'
          },
          options: {
            height: 600,
            showControls: true
          }
        }
      }
    }
  },
  {
    description: 'Hexagon binning visualization',
    spec: {
      id: 'geospatial-2',
      component: {
        Geospatial: {
          data: {
            center: { lng: -73.9857, lat: 40.7484 },
            zoom: 11,
            layers: [
              {
                id: 'hexagon-layer',
                type: 'hexagon',
                data: [
                  { lng: -73.9857, lat: 40.7484, value: 50 },
                  { lng: -73.9757, lat: 40.7584, value: 75 }
                ],
                style: {
                  color: '#3b82f6',
                  opacity: 0.8
                }
              }
            ]
          }
        }
      }
    }
  }
];

/**
 * ToolUI Component Examples
 */
const toolUIExamples: ComponentExample[] = [
  {
    description: 'Successful tool invocation',
    spec: {
      id: 'toolui-1',
      component: {
        ToolUI: {
          data: {
            tool: {
              name: 'searchDatabase',
              description: 'Search the database for records',
              parameters: {
                query: {
                  type: 'string',
                  description: 'Search query string',
                  required: true
                },
                limit: {
                  type: 'number',
                  description: 'Maximum results to return',
                  default: 10
                }
              }
            },
            invocation: {
              args: { query: 'user data', limit: 5 },
              result: { count: 5, records: ['Record 1', 'Record 2'] },
              status: 'success'
            }
          }
        }
      }
    }
  },
  {
    description: 'Failed tool invocation',
    spec: {
      id: 'toolui-2',
      component: {
        ToolUI: {
          data: {
            tool: {
              name: 'deleteFile',
              description: 'Delete a file from storage',
              parameters: {
                path: {
                  type: 'string',
                  description: 'File path',
                  required: true
                }
              }
            },
            invocation: {
              args: { path: '/invalid/path' },
              status: 'error',
              error: 'File not found: /invalid/path'
            }
          }
        }
      }
    }
  }
];

/**
 * Charts Component Examples
 */
const chartsExamples: ComponentExample[] = [
  {
    description: 'Line chart with multiple series',
    spec: {
      id: 'charts-1',
      component: {
        Charts: {
          data: {
            type: 'line',
            series: [
              {
                name: 'Revenue',
                data: [
                  { x: 'Jan', y: 1000 },
                  { x: 'Feb', y: 1200 },
                  { x: 'Mar', y: 1500 }
                ],
                color: '#3b82f6'
              },
              {
                name: 'Costs',
                data: [
                  { x: 'Jan', y: 800 },
                  { x: 'Feb', y: 900 },
                  { x: 'Mar', y: 1100 }
                ],
                color: '#ef4444'
              }
            ],
            title: 'Monthly Revenue vs Costs'
          },
          options: {
            height: 400,
            showLegend: true,
            animated: true
          }
        }
      }
    }
  },
  {
    description: 'Pie chart',
    spec: {
      id: 'charts-2',
      component: {
        Charts: {
          data: {
            type: 'pie',
            series: [
              {
                name: 'Market Share',
                data: [
                  { x: 'Product A', y: 45 },
                  { x: 'Product B', y: 30 },
                  { x: 'Product C', y: 25 }
                ]
              }
            ]
          }
        }
      }
    }
  },
  {
    description: 'Histogram for statistical distribution',
    spec: {
      id: 'charts-3',
      component: {
        Charts: {
          data: {
            type: 'histogram',
            series: [
              {
                name: 'Frequency',
                data: [
                  { x: '0-10', y: 5 },
                  { x: '10-20', y: 15 },
                  { x: '20-30', y: 25 },
                  { x: '30-40', y: 20 },
                  { x: '40-50', y: 10 }
                ],
                color: '#8b5cf6'
              }
            ],
            title: 'Age Distribution'
          },
          options: {
            height: 350
          }
        }
      }
    }
  },
  {
    description: 'Heatmap for correlation matrix',
    spec: {
      id: 'charts-4',
      component: {
        Charts: {
          data: {
            type: 'heatmap',
            data: [
              { x: 'Mon', y: '9am', value: 10 },
              { x: 'Mon', y: '12pm', value: 25 },
              { x: 'Mon', y: '3pm', value: 15 },
              { x: 'Tue', y: '9am', value: 20 },
              { x: 'Tue', y: '12pm', value: 30 },
              { x: 'Tue', y: '3pm', value: 18 },
              { x: 'Wed', y: '9am', value: 15 },
              { x: 'Wed', y: '12pm', value: 28 },
              { x: 'Wed', y: '3pm', value: 22 }
            ],
            title: 'Activity Heatmap'
          },
          options: {
            height: 300
          }
        }
      }
    }
  },
  {
    description: 'Funnel chart for conversion analytics',
    spec: {
      id: 'charts-5',
      component: {
        Charts: {
          data: {
            type: 'funnel',
            stages: [
              { name: 'Website Visits', value: 10000 },
              { name: 'Product Views', value: 5000 },
              { name: 'Add to Cart', value: 2000 },
              { name: 'Checkout Started', value: 800 },
              { name: 'Purchase Completed', value: 500 }
            ],
            title: 'Sales Funnel'
          },
          options: {
            height: 400
          }
        }
      }
    }
  },
  {
    description: 'Gauge chart for KPI dashboard',
    spec: {
      id: 'charts-6',
      component: {
        Charts: {
          data: {
            type: 'gauge',
            value: 75,
            min: 0,
            max: 100,
            ranges: [
              { start: 0, end: 33, color: '#ef4444', label: 'Low' },
              { start: 33, end: 66, color: '#f59e0b', label: 'Medium' },
              { start: 66, end: 100, color: '#10b981', label: 'High' }
            ],
            target: 80,
            title: 'Customer Satisfaction Score'
          },
          options: {
            height: 350
          }
        }
      }
    }
  },
  {
    description: 'Candlestick chart for financial data',
    spec: {
      id: 'charts-7',
      component: {
        Charts: {
          data: {
            type: 'candlestick',
            data: [
              { date: '2026-01-01', open: 100, high: 110, low: 95, close: 105, volume: 1000000 },
              { date: '2026-01-02', open: 105, high: 115, low: 103, close: 112, volume: 1200000 },
              { date: '2026-01-03', open: 112, high: 118, low: 108, close: 110, volume: 950000 },
              { date: '2026-01-04', open: 110, high: 112, low: 102, close: 108, volume: 1100000 },
              { date: '2026-01-05', open: 108, high: 120, low: 107, close: 118, volume: 1500000 }
            ],
            showVolume: true,
            title: 'Stock Price'
          },
          options: {
            height: 450
          }
        }
      }
    }
  }
];

/**
 * WYSIWYG Component Examples
 */
const wysiwygExamples: ComponentExample[] = [
  {
    description: 'Rich text editor with HTML content',
    spec: {
      id: 'wysiwyg-1',
      component: {
        WYSIWYG: {
          data: {
            content: '<h2>Hello World</h2><p>This is <strong>bold</strong> text.</p>',
            format: 'html',
            editable: true
          },
          options: {
            height: 300,
            placeholder: 'Start typing...'
          }
        }
      }
    }
  },
  {
    description: 'Markdown viewer (read-only)',
    spec: {
      id: 'wysiwyg-2',
      component: {
        WYSIWYG: {
          data: {
            content: '# Title\n\nThis is a paragraph with **bold** text.',
            format: 'markdown',
            editable: false
          }
        }
      }
    }
  }
];

/**
 * VRM Component Examples
 */
const vrmExamples: ComponentExample[] = [
  {
    description: 'VRM avatar with animation',
    spec: {
      id: 'vrm-1',
      component: {
        VRM: {
          data: {
            modelUrl: 'https://example.com/avatar.vrm',
            animations: [
              {
                name: 'wave',
                loop: true
              }
            ],
            camera: {
              position: { x: 0, y: 1.5, z: 2 },
              target: { x: 0, y: 1, z: 0 }
            },
            lighting: {
              ambient: 0.5,
              directional: {
                color: '#ffffff',
                intensity: 1
              }
            },
            background: '#f0f0f0'
          },
          options: {
            height: 500,
            enableControls: true,
            antialias: true
          }
        }
      }
    }
  }
];

/**
 * Calendar Examples
 */
const calendarExamples: ComponentExample[] = [
  {
    description: 'Monthly calendar with events',
    spec: {
      id: 'calendar-1',
      component: {
        Calendar: {
          data: {
            title: 'Team Schedule',
            defaultView: 'month-grid',
            views: ['day', 'week', 'month-grid'],
            events: [
              {
                id: '1',
                title: 'Team Meeting',
                start: '2026-02-15T10:00:00',
                end: '2026-02-15T11:00:00',
                description: 'Weekly team sync',
                location: 'Conference Room A'
              },
              {
                id: '2',
                title: 'Project Deadline',
                start: '2026-02-20',
                end: '2026-02-20',
                description: 'Final deliverables due',
                color: '#ef4444'
              },
              {
                id: '3',
                title: 'Workshop',
                start: '2026-02-25T14:00:00',
                end: '2026-02-25T17:00:00',
                description: 'Technical training session',
                location: 'Training Center',
                people: ['Alice', 'Bob', 'Charlie']
              }
            ],
            selectedDate: '2026-02-15'
          },
          options: {
            height: 600,
            isDraggable: true,
            isResizable: true
          }
        }
      }
    }
  },
  {
    description: 'Week view calendar',
    spec: {
      id: 'calendar-2',
      component: {
        Calendar: {
          data: {
            title: 'Weekly Schedule',
            defaultView: 'week',
            views: ['week'],
            events: [
              {
                id: '1',
                title: 'Daily Standup',
                start: '2026-02-17T09:00:00',
                end: '2026-02-17T09:15:00'
              },
              {
                id: '2',
                title: 'Client Call',
                start: '2026-02-18T14:00:00',
                end: '2026-02-18T15:00:00',
                color: '#10b981'
              }
            ],
            config: {
              firstDayOfWeek: 1,
              dayBoundaries: {
                start: '08:00',
                end: '18:00'
              }
            }
          },
          options: {
            height: 500
          }
        }
      }
    }
  }
];

/**
 * JSONViewer Examples
 */
const jsonViewerExamples: ComponentExample[] = [
  {
    description: 'Simple JSON object viewer',
    spec: {
      id: 'jsonviewer-1',
      component: {
        JSONViewer: {
          data: {
            value: {
              name: "John Doe",
              age: 30,
              email: "john@example.com",
              active: true,
              roles: ["admin", "user"]
            },
            rootName: "User",
            collapsed: false
          },
          options: {
            height: 400,
            displayDataTypes: true,
            enableClipboard: true
          }
        }
      }
    }
  },
  {
    description: 'Complex nested JSON with theming',
    spec: {
      id: 'jsonviewer-2',
      component: {
        JSONViewer: {
          data: {
            value: {
              id: "api-response-123",
              success: true,
              data: {
                users: [
                  {
                    id: 1,
                    name: "Alice Smith",
                    email: "alice@company.com",
                    stats: {
                      commits: 247,
                      reviews: 89
                    }
                  }
                ],
                total: 1
              }
            },
            rootName: "API Response",
            collapsed: 2
          },
          options: {
            height: 500,
            theme: "dark",
            displayObjectSize: true,
            displayDataTypes: true
          }
        }
      }
    }
  }
];

/**
 * CodeEditor Examples
 */
const codeEditorExamples: ComponentExample[] = [
  {
    description: 'JavaScript code editor with syntax highlighting',
    spec: {
      id: 'codeeditor-1',
      component: {
        CodeEditor: {
          data: {
            code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55`,
            language: "javascript",
            filename: "fibonacci.js"
          },
          options: {
            height: 400,
            theme: "dark",
            lineNumbers: true,
            highlightActiveLine: true
          }
        }
      }
    }
  },
  {
    description: 'Python code with read-only mode',
    spec: {
      id: 'codeeditor-2',
      component: {
        CodeEditor: {
          data: {
            code: `import numpy as np

def calculate_mean(data):
    """Calculate the arithmetic mean of a list of numbers."""
    return np.mean(data)

# Example usage
numbers = [10, 20, 30, 40, 50]
result = calculate_mean(numbers)
print(f"Mean: {result}")`,
            language: "python",
            filename: "stats.py",
            readOnly: true
          },
          options: {
            height: 400,
            theme: "light",
            lineNumbers: true
          }
        }
      }
    }
  }
];

/**
 * Markdown Examples
 */
const markdownExamples: ComponentExample[] = [
  {
    description: 'Documentation with live preview',
    spec: {
      id: 'markdown-1',
      component: {
        Markdown: {
          data: {
            title: "Getting Started",
            content: `# Getting Started

## Installation

Install the package using npm:

\`\`\`bash
npm install awesome-package
\`\`\`

## Quick Example

\`\`\`javascript
import { Component } from 'awesome-package';

function App() {
  return <Component title="Hello World" />;
}
\`\`\`

## Features

- ✅ Easy to use
- ✅ Fully typed
- ✅ Well documented`
          },
          options: {
            height: 500,
            mode: "live"
          }
        }
      }
    }
  },
  {
    description: 'Read-only documentation preview',
    spec: {
      id: 'markdown-2',
      component: {
        Markdown: {
          data: {
            title: "README",
            content: `# Project Name

> A brief description of your project

## Overview

This project helps developers build amazing applications.

### Key Features

1. **Fast** - Optimized for performance
2. **Reliable** - Battle-tested in production
3. **Scalable** - Handles millions of requests

## Usage

\`\`\`typescript
const result = await api.getData();
console.log(result);
\`\`\`

For more information, visit our [documentation](https://docs.example.com).`
          },
          options: {
            height: 500,
            mode: "preview"
          }
        }
      }
    }
  }
];

/**
 * DataTable Examples
 */
const dataTableExamples: ComponentExample[] = [
  {
    description: 'User management table with sorting and pagination',
    spec: {
      id: 'datatable-1',
      component: {
        DataTable: {
          data: {
            title: "Users",
            columns: [
              { id: "id", header: "ID", accessorKey: "id", width: 80 },
              { id: "name", header: "Name", accessorKey: "name", width: 200 },
              { id: "email", header: "Email", accessorKey: "email", width: 250 },
              { id: "role", header: "Role", accessorKey: "role", width: 120 },
              { id: "status", header: "Status", accessorKey: "status", width: 120 }
            ],
            rows: [
              { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
              { id: "2", name: "Bob Smith", email: "bob@example.com", role: "User", status: "Active" },
              { id: "3", name: "Carol Williams", email: "carol@example.com", role: "Editor", status: "Active" }
            ]
          },
          options: {
            height: 600,
            enableSorting: true,
            pageSize: 10,
            striped: true
          }
        }
      }
    }
  },
  {
    description: 'Product inventory table with custom styling',
    spec: {
      id: 'datatable-2',
      component: {
        DataTable: {
          data: {
            title: "Product Inventory",
            columns: [
              { id: "sku", header: "SKU", accessorKey: "sku", width: 100 },
              { id: "name", header: "Product Name", accessorKey: "name", width: 250 },
              { id: "category", header: "Category", accessorKey: "category", width: 150 },
              { id: "price", header: "Price", accessorKey: "price", width: 100, align: "right" },
              { id: "stock", header: "Stock", accessorKey: "stock", width: 100, align: "right" }
            ],
            rows: [
              { sku: "LAP-001", name: "ThinkPad X1 Carbon", category: "Laptops", price: "$1,299", stock: "45" },
              { sku: "LAP-002", name: "MacBook Pro 14\"", category: "Laptops", price: "$1,999", stock: "23" },
              { sku: "MON-001", name: "Dell UltraSharp 27\"", category: "Monitors", price: "$449", stock: "67" }
            ]
          },
          options: {
            height: 500,
            enableSorting: true,
            pageSize: 5,
            striped: true,
            bordered: true
          }
        }
      }
    }
  }
];

/**
 * ImageGallery Examples
 */
const imageGalleryExamples: ComponentExample[] = [
  {
    description: 'Nature photo gallery with justified rows layout',
    spec: {
      id: 'imagegallery-1',
      component: {
        ImageGallery: {
          data: {
            title: "Nature Photography",
            images: [
              { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4", alt: "Mountain landscape", title: "Mountain Peak", width: 1200, height: 800 },
              { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", alt: "Forest trail", title: "Forest Path", width: 1200, height: 800 },
              { src: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e", alt: "Ocean waves", title: "Ocean Sunset", width: 1200, height: 800 }
            ]
          },
          options: {
            height: 600,
            layout: "rows",
            targetRowHeight: 200,
            enableLightbox: true,
            enableZoom: true
          }
        }
      }
    }
  },
  {
    description: 'Architecture gallery with masonry layout',
    spec: {
      id: 'imagegallery-2',
      component: {
        ImageGallery: {
          data: {
            title: "Modern Architecture",
            images: [
              { src: "https://images.unsplash.com/photo-1486718448742-163732cd1544", alt: "Modern building", title: "Contemporary Design", width: 1000, height: 1000 },
              { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625", alt: "Glass facade", title: "Reflections", width: 1000, height: 1000 },
              { src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2", alt: "Spiral staircase", title: "Geometric Forms", width: 1000, height: 1000 },
              { src: "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8", alt: "Brutalist architecture", title: "Concrete Poetry", width: 1000, height: 1000 }
            ]
          },
          options: {
            height: 500,
            layout: "masonry",
            columns: 2,
            spacing: 8,
            enableLightbox: true,
            enableCaptions: true,
            enableFullscreen: true
          }
        }
      }
    }
  }
];

/**
 * Specialized Component Catalog
 *
 * Advanced data visualization and interactive components
 * that use the composable pattern with complex internal state.
 */
export const specializedCatalog: ComponentCatalog = {
  Timeline: {
    type: 'Timeline',
    description: `Interactive timeline visualization using TimelineJS. Displays chronological events
    with dates, headlines, text descriptions, and optional media (images). Supports:
    - Event markers on timeline
    - Zoom and navigation
    - Rich media (images with captions)
    - Date formatting (years, months, days)
    - Unique IDs for each event (required for proper rendering)`,
    props: ['data', 'options'],
    examples: timelineExamples
  },

  Maps: {
    type: 'Maps',
    description: `2D interactive map visualization using Leaflet and OpenStreetMap tiles.
    Displays geographic locations with markers. Supports:
    - Zoom and pan navigation
    - Custom markers with colors and labels
    - Popups on marker click
    - Center coordinates and zoom level
    - Fullscreen mode
    Note: Coordinates use { longitude, latitude } format (lon/lat, NOT lat/lon)`,
    props: ['data', 'options'],
    examples: mapsExamples
  },

  ThreeScene: {
    type: 'ThreeScene',
    description: `3D scene viewer using Three.js with OrbitControls. Renders 3D objects
    in an interactive 3D environment. Supports:
    - Multiple 3D objects (meshes)
    - Camera configuration (perspective/orthographic)
    - Lighting (ambient, directional, point, spot)
    - OrbitControls (rotate, pan, zoom)
    - Grid and axes helpers
    - Custom background colors
    Note: This component requires 3D objects to be created on the client side.
    For AI generation, specify the object types and properties, but actual Three.js
    mesh creation happens client-side.`,
    props: ['data', 'options'],
    examples: threeSceneExamples
  },

  SVGPreview: {
    type: 'SVGPreview',
    description: `SVG graphics preview component with source view toggle. Displays SVG
    content with validation. Supports:
    - Inline SVG rendering
    - Source code view
    - Copy to clipboard
    - Download as .svg file
    - Custom width/height
    - Isolated iframe rendering for security
    Note: SVG content must be valid XML. Invalid SVG will show an error message.`,
    props: ['svg', 'title', 'filename', 'width', 'height'],
    examples: svgPreviewExamples
  },

  NodeEditor: {
    type: 'NodeEditor',
    description: `Interactive flow diagram editor using React Flow. Create and edit
    node-based diagrams and workflows. Supports:
    - Custom node types and positions
    - Edges with labels
    - Drag and drop nodes
    - Pan and zoom controls
    - Mini-map navigation
    - Background grid
    - Interactive connections
    Note: Nodes must have unique IDs. Edges reference source/target node IDs.`,
    props: ['data', 'options', 'title'],
    examples: nodeEditorExamples
  },

  KnowledgeGraph: {
    type: 'KnowledgeGraph',
    description: `Entity-relationship knowledge graph visualization. Display semantic
    relationships between entities. Supports:
    - Multiple entity types (person, organization, concept, location, event, document)
    - Directional and bidirectional relationships
    - Custom color schemes per entity type
    - Interactive node exploration
    - Search and filtering
    - Legend display
    - Force-directed layout
    Note: Each entity must have a unique ID. Relationships reference entity IDs.`,
    props: ['data', 'options', 'title'],
    examples: knowledgeGraphExamples
  },

  Latex: {
    type: 'Latex',
    description: `LaTeX mathematical equation renderer using KaTeX. Display mathematical
    formulas and equations. Supports:
    - Single or multiple equations
    - Display mode (block) or inline mode
    - Custom macros
    - Equation labels
    - Copy LaTeX source
    - Error handling with inline display
    Note: Uses KaTeX syntax. Complex LaTeX features may not be supported.`,
    props: ['data', 'options'],
    examples: latexExamples
  },

  ModelViewer: {
    type: 'ModelViewer',
    description: `3D model viewer for loading and displaying 3D assets. Supports multiple
    model formats using Three.js loaders. Supports:
    - Multiple formats (GLTF, GLB, OBJ, FBX, STL, DAE)
    - OrbitControls for camera manipulation
    - Auto-rotation
    - Custom scale, position, rotation
    - Grid and axes helpers
    - Reset camera view
    - Lighting configuration
    Note: Model files must be accessible via URL. Large models may take time to load.`,
    props: ['data', 'options'],
    examples: modelViewerExamples
  },

  Phaser: {
    type: 'Phaser',
    description: `HTML5 game engine for creating interactive 2D games. Build browser games
    with physics, sprites, and animations. Supports:
    - Multiple render modes (WebGL, Canvas, Auto)
    - Physics engines (Arcade, Matter, Impact)
    - Scene management
    - Sprite handling
    - Game loop with preload, create, update lifecycle
    - Keyboard and pointer input
    - Custom game logic via JavaScript code strings
    Note: Game scenes use JavaScript code strings for preload, create, and update methods.`,
    props: ['data', 'options'],
    examples: phaserExamples
  },

  Mermaid: {
    type: 'Mermaid',
    description: `Diagram and flowchart renderer using Mermaid.js. Create diagrams from
    text descriptions using markdown-like syntax. Supports:
    - Flowcharts and sequence diagrams
    - Class diagrams and state diagrams
    - Entity relationship diagrams
    - Gantt charts and pie charts
    - Git graphs and user journey diagrams
    - Multiple themes (default, dark, forest, neutral)
    - Preview and source code view
    Note: Uses Mermaid syntax. Complex diagrams may require specific syntax knowledge.`,
    props: ['data', 'options', 'title'],
    examples: mermaidExamples
  },

  Remotion: {
    type: 'Remotion',
    description: `Programmatic video creation using React and Remotion. Create videos
    with code for animations, motion graphics, and data visualization. Supports:
    - Frame-based video composition
    - Custom width, height, and FPS
    - Duration control in frames
    - Play/pause controls
    - Frame scrubbing timeline
    - Loop and autoplay options
    - React component-based scenes
    Note: This is a simplified preview. Full Remotion features require server-side rendering.`,
    props: ['data', 'options'],
    examples: remotionExamples
  },

  Geospatial: {
    type: 'Geospatial',
    description: `Advanced geospatial visualization using AntV L7. Supports large-scale
    point data (100k+ points) and complex visualizations. Supports:
    - Heatmaps for density visualization
    - Hexagon binning for spatial aggregation
    - Point, line, polygon, and arc layers
    - Multiple simultaneous layers
    - Layer visibility toggling
    - Custom color scales and styling
    - Different basemaps (light, dark, satellite)
    Note: Different from Maps component - L7 is for advanced geospatial analytics,
    while Maps is for simple 2D marker visualization.`,
    props: ['data', 'options'],
    examples: geospatialExamples
  },

  ToolUI: {
    type: 'ToolUI',
    description: `Tool call visualization component using @assistant-ui/react patterns.
    Displays AI tool definitions, invocations, and results. Supports:
    - Tool definition display (name, description, parameters)
    - Parameter type and requirement indicators
    - Invocation argument display
    - Result visualization with status (pending/success/error)
    - Color-coded status indicators
    - Error message display
    - Copy to clipboard functionality
    Note: Useful for debugging AI tool calls and showing execution flow.`,
    props: ['data', 'options'],
    examples: toolUIExamples
  },

  Charts: {
    type: 'Charts',
    description: `Interactive data visualizations using amCharts 5. Professional-grade
    charts with smooth animations and rich interactions. Supports:
    - Basic charts: line, bar, pie, scatter, area, radar
    - Business analytics: histogram, heatmap, funnel, gauge, candlestick
    - Advanced visualizations: sankey, chord, treemap, force-directed, hierarchy, word cloud, venn
    - Multiple series on same chart
    - Custom axis configuration (category, value, time, date)
    - Legend and tooltips
    - Zoom and pan interactions
    - Custom colors and themes
    - Export to image (PNG/SVG)
    - Responsive sizing
    Note: amCharts 5 provides professional data visualization with extensive customization.
    Total: 18 chart types covering business analytics, statistical, and specialized visualizations.`,
    props: ['data', 'options'],
    examples: chartsExamples
  },

  WYSIWYG: {
    type: 'WYSIWYG',
    description: `Rich text editor component with HTML and Markdown support.
    Content-editable WYSIWYG interface. Supports:
    - HTML and Markdown content formats
    - Editable and read-only modes
    - Basic formatting toolbar (bold, italic, underline, lists)
    - Custom placeholder text
    - Copy content to clipboard
    - Configurable height and width
    - Light and dark themes
    Note: Provides basic rich text editing. For advanced features, consider specialized editors.`,
    props: ['data', 'options'],
    examples: wysiwygExamples
  },

  VRM: {
    type: 'VRM',
    description: `VRM avatar viewer using three-vrm and Three.js. Display and animate
    3D VRM avatars in the browser. Supports:
    - VRM model loading from URL
    - Multiple animations with looping
    - Camera positioning and targeting
    - Ambient and directional lighting
    - Custom background colors
    - OrbitControls for interaction
    - Antialiasing and alpha transparency
    Note: VRM is a 3D avatar file format for VR applications. Models must be in .vrm format.`,
    props: ['data', 'options'],
    examples: vrmExamples
  },

  Calendar: {
    type: 'Calendar',
    description: `Modern calendar and scheduling component using schedule-x. Interactive
    event calendar with drag-and-drop, multiple views, and event management. Supports:
    - Multiple view types (day, week, month grid, month agenda)
    - Drag-and-drop event rescheduling
    - Event resizing
    - Event creation, editing, and deletion
    - Multi-day and all-day events
    - Event details (title, description, location, attendees)
    - Custom event colors
    - Time zone support (via ISO date strings)
    - Configurable day boundaries (working hours)
    - First day of week customization
    - Responsive design
    - Light and dark themes
    Note: Perfect for scheduling apps, booking systems, and event management. Uses schedule-x library.`,
    props: ['data', 'options'],
    examples: calendarExamples
  },

  JSONViewer: {
    type: 'JSONViewer',
    description: `Interactive JSON data visualizer with tree view. Displays JSON data with
    expand/collapse, syntax highlighting, and data exploration features. Supports:
    - Interactive tree view with expand/collapse
    - Syntax highlighting for values
    - Data type indicators (string, number, boolean, null, array, object)
    - Object and array size display
    - Copy to clipboard functionality
    - Download as .json file
    - Multiple themes (light, dark, GitHub, VSCode)
    - Customizable indent width
    - Sort object keys alphabetically
    - Show/hide quotes on keys
    - Collapsed depth control (collapse at specific nesting level)
    - Root node naming
    - Fullscreen mode
    Note: Perfect for debugging AI responses, visualizing API data, and exploring complex JSON structures.
    Uses @uiw/react-json-view library.`,
    props: ['data', 'options'],
    examples: jsonViewerExamples
  },

  CodeEditor: {
    type: 'CodeEditor',
    description: `Syntax-highlighted code editor powered by CodeMirror 6. Supports multiple programming
    languages with features for reading and editing code. Supports:
    - 20+ programming languages (JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby, HTML, CSS, JSON, Markdown, SQL, Bash, and more)
    - Syntax highlighting for all supported languages
    - Line numbers and active line highlighting
    - Copy to clipboard functionality
    - Download code as file
    - Multiple themes (light, dark, GitHub, VSCode, Sublime, Material, Dracula, Nord)
    - Line wrapping toggle
    - Read-only mode for displaying code
    - Editable mode for code editing
    - Customizable tab size and indentation
    - Autocomplete and code completion
    - Bracket matching and auto-closing
    - Search and replace (Ctrl+F)
    - Multiple cursors and selections
    - Fullscreen mode
    - Placeholder text for empty editor
    Note: Perfect for code snippets, documentation, tutorials, and interactive coding examples.
    Uses @uiw/react-codemirror and CodeMirror 6.`,
    props: ['data', 'options', 'onChange'],
    examples: codeEditorExamples
  },

  Markdown: {
    type: 'Markdown',
    description: `Full-featured markdown editor with live preview. Edit and preview markdown content
    with GitHub-flavored markdown support. Supports:
    - Three modes: Edit (editor only), Preview (viewer only), Live (side-by-side)
    - GitHub-flavored markdown (GFM) syntax
    - Syntax highlighting in code blocks
    - Live preview as you type
    - Rich editing toolbar with formatting shortcuts
    - Copy to clipboard functionality
    - Download markdown as .md file
    - Fullscreen editing mode
    - Synchronized scrolling between editor and preview
    - Tables, task lists, and emoji support
    - Customizable height and width
    - Toggle toolbar visibility
    - Drag bar to resize editor/preview split
    Note: Perfect for documentation, README files, blog posts, technical writing, and note-taking.
    Uses @uiw/react-md-editor with full MDX support.`,
    props: ['data', 'options', 'onChange'],
    examples: markdownExamples
  },

  DataTable: {
    type: 'DataTable',
    description: `Powerful data table component with sorting, filtering, and pagination. Display tabular data
    with advanced features using TanStack Table. Supports:
    - Column sorting (click headers to sort ascending/descending)
    - Pagination with customizable page size
    - Row selection (single or multiple)
    - Striped rows for better readability
    - Bordered table styling
    - Compact mode for dense data
    - Sticky header that stays visible on scroll
    - Copy to clipboard (CSV format)
    - Download as CSV file
    - Fullscreen mode for detailed viewing
    - Column width customization
    - Text alignment per column (left, center, right)
    - Row count display
    - Responsive horizontal scrolling for wide tables
    Note: Perfect for dashboards, admin panels, data analysis, reports, and any data-heavy applications.
    Uses @tanstack/react-table v8 for headless table functionality.`,
    props: ['data', 'options', 'onRowSelect'],
    examples: dataTableExamples
  },

  ImageGallery: {
    type: 'ImageGallery',
    description: `Responsive image gallery with lightbox viewer. Display collections of images with multiple
    layout options and interactive viewing. Supports:
    - Three layout modes: Rows (justified), Columns (grid), Masonry (Pinterest-style)
    - Lightbox viewer with click to expand
    - Image zoom with mouse wheel or pinch gestures
    - Captions and descriptions in lightbox
    - Keyboard navigation (arrow keys, Escape, Enter)
    - Touch gestures (swipe, pinch-to-zoom)
    - Download individual images
    - Fullscreen viewing mode
    - Slideshow with auto-play
    - Customizable spacing and row height
    - Configurable number of columns
    - Responsive design adapts to screen size
    - Image count display
    - Accessible with ARIA labels and keyboard support
    Note: Perfect for portfolios, product showcases, photo albums, galleries, and any image-heavy applications.
    Uses react-photo-album for grid layouts and yet-another-react-lightbox for image viewing.`,
    props: ['data', 'options', 'onImageClick'],
    examples: imageGalleryExamples
  }
};

/**
 * Complete Component Catalog
 *
 * Merges specialized and standard UI components
 */
export const componentCatalog: ComponentCatalog = {
  ...specializedCatalog,
  ...standardUICatalog,
};

/**
 * Get catalog as AI prompt
 *
 * Generates a formatted string suitable for AI system prompts.
 * Includes component descriptions, props, and examples.
 */
export function getCatalogPrompt(): string {
  const specialized = Object.values(specializedCatalog);
  const standardUI = Object.values(standardUICatalog);

  const prompt = `You can generate interactive UIs using ${specialized.length + standardUI.length} components across two categories:

## SPECIALIZED COMPONENTS (Data Visualization & Interactive)

${specialized.map((comp, i) => `${i + 1}. ${comp.type}
   Description: ${comp.description.trim().replace(/\n\s+/g, ' ')}
   Props: ${comp.props.join(', ')}

   Example A2UI spec:
   ${JSON.stringify(comp.examples?.[0]?.spec || {}, null, 2)}
`).join('\n')}

## STANDARD UI COMPONENTS (Layout, Forms, Typography)

${standardUI.map((comp, i) => `${i + 1}. ${comp.type}
   Description: ${comp.description.trim().replace(/\n\s+/g, ' ')}
   Props: ${comp.props.join(', ')}

   Example A2UI spec:
   ${JSON.stringify(comp.examples?.[0]?.spec || {}, null, 2)}
`).join('\n')}

Generate A2UI messages in this format:
{
  "surfaceUpdate": {
    "components": [
      { "id": "unique-id", "component": { "ComponentType": { ...props } } }
    ]
  }
}

Important rules:
1. Always provide unique IDs for components
2. Timeline events must have unique_id fields
3. Maps coordinates use { longitude, latitude } format (NOT lat/lon)
4. ThreeScene objects should specify type and basic properties
5. All dates use { year, month?, day? } format
6. Validate all required fields before generating`;

  return prompt;
}

/**
 * Get list of available component types
 */
export function getComponentTypes(): string[] {
  return Object.keys(componentCatalog);
}

/**
 * Get component definition by type
 */
export function getComponentDefinition(type: string) {
  return componentCatalog[type];
}
