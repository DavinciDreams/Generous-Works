/**
 * A2UI Component Catalog
 * Defines available AI Elements for agent-generated UIs
 *
 * Includes:
 * - Specialized components (Timeline, Maps, 3D, etc.)
 * - Standard UI components (Button, Input, Card, etc.)
 */

import type { ComponentCatalog, ComponentExample } from './types';
import { standardUICatalog } from './catalog-standard-ui';

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
    description: 'Heatmap of population density with point markers',
    spec: {
      id: 'geospatial-1',
      component: {
        Geospatial: {
          data: {
            center: { lng: -122.4194, lat: 37.7749 },
            zoom: 12,
            layers: [
              {
                id: 'density-heatmap',
                type: 'heatmap',
                data: [
                  { lng: -122.4194, lat: 37.7749, value: 100 },
                  { lng: -122.4084, lat: 37.7849, value: 80 },
                  { lng: -122.4294, lat: 37.7649, value: 120 },
                  { lng: -122.3994, lat: 37.7549, value: 95 },
                  { lng: -122.4394, lat: 37.7949, value: 110 }
                ],
                style: {
                  color: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026'],
                  size: 40,
                  opacity: 0.8
                }
              },
              {
                id: 'landmarks',
                type: 'point',
                data: [
                  { lng: -122.4194, lat: 37.7749, value: 1, properties: { name: 'Downtown' } },
                  { lng: -122.4083, lat: 37.7858, value: 1, properties: { name: 'North Beach' } }
                ],
                style: {
                  color: '#3b82f6',
                  size: 200,
                  opacity: 0.9
                }
              }
            ],
            basemap: 'dark'
          },
          options: {
            height: 500,
            showControls: true
          }
        }
      }
    }
  },
  {
    description: 'Arc layer showing routes/connections between locations',
    spec: {
      id: 'geospatial-2',
      component: {
        Geospatial: {
          data: {
            center: { lng: -40, lat: 35 },
            zoom: 3,
            pitch: 30,
            layers: [
              {
                id: 'voyage-routes',
                type: 'arc',
                data: [
                  { lng: -6.0, lat: 36.7, targetLng: -75.5, targetLat: 24.0, value: 1, properties: { route: 'Spain to Caribbean' } },
                  { lng: -6.0, lat: 36.7, targetLng: -61.5, targetLat: 15.4, value: 1, properties: { route: 'Spain to Dominica' } }
                ],
                style: {
                  color: ['#ff6600', '#ffcc00'],
                  size: 3,
                  opacity: 0.8
                }
              },
              {
                id: 'ports',
                type: 'point',
                data: [
                  { lng: -6.0, lat: 36.7, value: 1, properties: { name: 'Cadiz, Spain' } },
                  { lng: -75.5, lat: 24.0, value: 1, properties: { name: 'Bahamas' } },
                  { lng: -61.5, lat: 15.4, value: 1, properties: { name: 'Dominica' } }
                ],
                style: {
                  color: '#ffffff',
                  size: 300,
                  opacity: 1
                }
              }
            ],
            basemap: 'dark'
          },
          options: {
            height: 500,
            showControls: true
          }
        }
      }
    }
  },
  {
    description: '3D hexagon bins with elevation',
    spec: {
      id: 'geospatial-3',
      component: {
        Geospatial: {
          data: {
            center: { lng: -73.9857, lat: 40.7484 },
            zoom: 12,
            pitch: 45,
            bearing: -17,
            layers: [
              {
                id: 'hex-density',
                type: 'hexagon',
                data: [
                  { lng: -73.9857, lat: 40.7484, value: 50 },
                  { lng: -73.9757, lat: 40.7584, value: 75 },
                  { lng: -73.9657, lat: 40.7384, value: 100 },
                  { lng: -73.9957, lat: 40.7684, value: 60 }
                ],
                style: {
                  color: ['#0198bd', '#49e3ce', '#d8feb5', '#feecb1', '#fead54', '#d1364e'],
                  size: 300,
                  extruded: true,
                  elevation: 8,
                  opacity: 0.8
                }
              }
            ],
            basemap: 'dark'
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
 * ApprovalCard Examples
 */
const approvalCardExamples: ComponentExample[] = [
  {
    description: 'Approval request for destructive action',
    spec: {
      id: 'approvalcard-1',
      component: {
        ApprovalCard: {
          id: 'approval-1',
          title: 'Delete Database Table',
          description: 'This action will permanently delete the "users_archive" table and all its data. This cannot be undone.',
          variant: 'destructive',
          metadata: [
            { key: 'Table', value: 'users_archive' },
            { key: 'Records', value: '1,247' },
            { key: 'Size', value: '45.3 MB' }
          ],
          confirmLabel: 'Delete Table',
          cancelLabel: 'Cancel'
        }
      }
    }
  },
  {
    description: 'Approval request with pending choice',
    spec: {
      id: 'approvalcard-2',
      component: {
        ApprovalCard: {
          id: 'approval-2',
          title: 'Deploy to Production',
          description: 'Deploy version 2.5.0 to production environment. This will update all services.',
          icon: 'rocket',
          metadata: [
            { key: 'Version', value: 'v2.5.0' },
            { key: 'Environment', value: 'production' },
            { key: 'Services', value: '8 services' }
          ],
          choice: 'approved'
        }
      }
    }
  }
];

/**
 * WeatherWidget Examples
 */
const weatherWidgetExamples: ComponentExample[] = [
  {
    description: 'Weather widget with current conditions and forecast',
    spec: {
      id: 'weatherwidget-1',
      component: {
        WeatherWidget: {
          id: 'weather-1',
          location: 'San Francisco, CA',
          current: {
            temp: 68,
            tempMin: 62,
            tempMax: 72,
            condition: 'partly-cloudy',
            humidity: 65,
            windSpeed: 12
          },
          forecast: [
            { day: 'Mon', tempMin: 60, tempMax: 70, condition: 'clear' },
            { day: 'Tue', tempMin: 62, tempMax: 72, condition: 'partly-cloudy' },
            { day: 'Wed', tempMin: 58, tempMax: 68, condition: 'rain' }
          ],
          unit: 'fahrenheit',
          updatedAt: '2026-02-11T10:00:00Z'
        }
      }
    }
  }
];

/**
 * StatsDisplay Examples
 */
const statsDisplayExamples: ComponentExample[] = [
  {
    description: 'Dashboard statistics with trends and sparklines',
    spec: {
      id: 'statsdisplay-1',
      component: {
        StatsDisplay: {
          id: 'stats-1',
          title: 'Business Metrics',
          description: 'Key performance indicators for Q1 2026',
          stats: [
            {
              key: 'revenue',
              label: 'Total Revenue',
              value: 284500,
              format: { kind: 'currency', currency: 'USD', decimals: 0 },
              diff: { value: 12.5, decimals: 1, upIsPositive: true, label: 'vs last quarter' },
              sparkline: { data: [200000, 220000, 245000, 268000, 284500], color: '#10b981' }
            },
            {
              key: 'users',
              label: 'Active Users',
              value: 8427,
              format: { kind: 'number', compact: true },
              diff: { value: 8.2, decimals: 1, upIsPositive: true }
            },
            {
              key: 'conversion',
              label: 'Conversion Rate',
              value: 0.0342,
              format: { kind: 'percent', decimals: 2, basis: 'fraction' },
              diff: { value: -0.8, decimals: 1, upIsPositive: true, label: 'vs last month' }
            }
          ]
        }
      }
    }
  }
];

/**
 * ProgressTracker Examples
 */
const progressTrackerExamples: ComponentExample[] = [
  {
    description: 'Multi-step deployment progress',
    spec: {
      id: 'progresstracker-1',
      component: {
        ProgressTracker: {
          id: 'progress-1',
          steps: [
            { id: 'build', label: 'Build Application', description: 'Compiling source code', status: 'completed' },
            { id: 'test', label: 'Run Tests', description: 'Running unit and integration tests', status: 'completed' },
            { id: 'deploy', label: 'Deploy to Production', description: 'Deploying to servers', status: 'in-progress' },
            { id: 'verify', label: 'Verify Deployment', status: 'pending' }
          ],
          elapsedTime: 127
        }
      }
    }
  }
];

/**
 * OptionList Examples
 */
const optionListExamples: ComponentExample[] = [
  {
    description: 'Single selection option list',
    spec: {
      id: 'optionlist-1',
      component: {
        OptionList: {
          id: 'optionlist-1',
          options: [
            { id: 'staging', label: 'Staging', description: 'Deploy to staging environment for testing' },
            { id: 'production', label: 'Production', description: 'Deploy directly to production' },
            { id: 'canary', label: 'Canary', description: 'Gradual rollout to 10% of users first', disabled: false }
          ],
          selectionMode: 'single',
          defaultValue: 'staging'
        }
      }
    }
  },
  {
    description: 'Multi-select option list with choice',
    spec: {
      id: 'optionlist-2',
      component: {
        OptionList: {
          id: 'optionlist-2',
          options: [
            { id: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
            { id: 'sms', label: 'SMS Alerts', description: 'Get text messages for urgent issues' },
            { id: 'slack', label: 'Slack Integration', description: 'Post updates to Slack channel' }
          ],
          selectionMode: 'multi',
          choice: ['email', 'slack']
        }
      }
    }
  }
];

/**
 * InstagramPost Examples
 */
const instagramPostExamples: ComponentExample[] = [
  {
    description: 'Instagram post with image and engagement stats',
    spec: {
      id: 'instagrampost-1',
      component: {
        InstagramPost: {
          id: 'ig-post-1',
          author: {
            name: 'Sarah Chen',
            handle: '@sarahcodes',
            avatarUrl: 'https://i.pravatar.cc/150?img=1',
            verified: true
          },
          text: 'Beautiful sunset at the Golden Gate Bridge 🌉 #sanfrancisco #sunset',
          media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1537402265843-5c35ad24413b', alt: 'Golden Gate Bridge sunset' }
          ],
          stats: { likes: 1247, isLiked: false },
          createdAt: '2026-02-10T18:30:00Z'
        }
      }
    }
  }
];

/**
 * LinkedInPost Examples
 */
const linkedInPostExamples: ComponentExample[] = [
  {
    description: 'LinkedIn professional post with link preview',
    spec: {
      id: 'linkedinpost-1',
      component: {
        LinkedInPost: {
          id: 'li-post-1',
          author: {
            name: 'Alex Johnson',
            avatarUrl: 'https://i.pravatar.cc/150?img=2',
            headline: 'Senior Software Engineer at TechCorp'
          },
          text: 'Excited to share our new open-source project! Check out the article below to learn more about how we built this.',
          linkPreview: {
            url: 'https://techblog.example.com/article',
            title: 'Building Scalable Microservices',
            description: 'A deep dive into our microservices architecture',
            imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
            domain: 'techblog.example.com'
          },
          stats: { likes: 342, isLiked: true },
          createdAt: '2026-02-11T09:15:00Z'
        }
      }
    }
  }
];

/**
 * XPost Examples
 */
const xPostExamples: ComponentExample[] = [
  {
    description: 'X/Twitter post with quoted post',
    spec: {
      id: 'xpost-1',
      component: {
        XPost: {
          id: 'x-post-1',
          author: {
            name: 'Jordan Lee',
            handle: '@jordantech',
            avatarUrl: 'https://i.pravatar.cc/150?img=3',
            verified: true
          },
          text: 'This is a game changer for web development!',
          quotedPost: {
            id: 'x-post-2',
            author: {
              name: 'Tech News',
              handle: '@technews',
              avatarUrl: 'https://i.pravatar.cc/150?img=4',
              verified: true
            },
            text: 'New framework released with 10x performance improvements',
            linkPreview: {
              url: 'https://framework.dev',
              title: 'Framework v2.0 Released',
              domain: 'framework.dev'
            },
            createdAt: '2026-02-11T08:00:00Z'
          },
          stats: { likes: 523, isLiked: false, isReposted: true },
          createdAt: '2026-02-11T10:30:00Z'
        }
      }
    }
  }
];

/**
 * LinkPreview Examples
 */
const linkPreviewExamples: ComponentExample[] = [
  {
    description: 'Rich link preview with image and metadata',
    spec: {
      id: 'linkpreview-1',
      component: {
        LinkPreview: {
          id: 'link-1',
          href: 'https://blog.example.com/article',
          title: 'The Future of Web Development',
          description: 'Exploring emerging trends and technologies shaping the web in 2026',
          image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
          domain: 'blog.example.com',
          favicon: 'https://blog.example.com/favicon.ico',
          ratio: '16:9'
        }
      }
    }
  }
];

/**
 * Video Examples
 */
const videoExamples: ComponentExample[] = [
  {
    description: 'Video player with poster and metadata',
    spec: {
      id: 'video-1',
      component: {
        Video: {
          id: 'video-1',
          assetId: 'asset-12345',
          src: 'https://example.com/videos/demo.mp4',
          poster: 'https://images.unsplash.com/photo-1536240478700-b869070f9279',
          title: 'Product Demo Video',
          description: 'Learn how to use our new features in 5 minutes',
          href: 'https://example.com/docs',
          domain: 'example.com',
          durationMs: 300000,
          ratio: '16:9',
          source: { label: 'YouTube', url: 'https://youtube.com/watch?v=demo' }
        }
      }
    }
  }
];

/**
 * MessageDraft Examples
 */
const messageDraftExamples: ComponentExample[] = [
  {
    description: 'Email draft with recipients',
    spec: {
      id: 'messagedraft-1',
      component: {
        MessageDraft: {
          id: 'draft-1',
          channel: 'email',
          subject: 'Q1 Planning Meeting',
          from: 'sarah@company.com',
          to: ['team@company.com', 'john@company.com'],
          cc: ['manager@company.com'],
          body: 'Hi team,\n\nLet\'s schedule our Q1 planning meeting for next week. Please review the attached agenda.\n\nBest,\nSarah'
        }
      }
    }
  },
  {
    description: 'Slack message draft',
    spec: {
      id: 'messagedraft-2',
      component: {
        MessageDraft: {
          id: 'draft-2',
          channel: 'slack',
          target: { type: 'channel', name: '#engineering', memberCount: 47 },
          body: 'Hey team! The deployment to staging is complete. Please test and report any issues. 🚀',
          outcome: 'sent'
        }
      }
    }
  }
];

/**
 * ItemCarousel Examples
 */
const itemCarouselExamples: ComponentExample[] = [
  {
    description: 'Product carousel with images',
    spec: {
      id: 'itemcarousel-1',
      component: {
        ItemCarousel: {
          id: 'carousel-1',
          title: 'Featured Products',
          description: 'Browse our top selling items',
          items: [
            { id: 'prod-1', name: 'Wireless Headphones', subtitle: '$199.99', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', color: '#000000' },
            { id: 'prod-2', name: 'Smart Watch', subtitle: '$299.99', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', color: '#1f1f1f' },
            { id: 'prod-3', name: 'Laptop Stand', subtitle: '$49.99', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46', color: '#4a4a4a' }
          ]
        }
      }
    }
  }
];

/**
 * OrderSummary Examples
 */
const orderSummaryExamples: ComponentExample[] = [
  {
    description: 'E-commerce order summary with pricing breakdown',
    spec: {
      id: 'ordersummary-1',
      component: {
        OrderSummary: {
          id: 'order-1',
          title: 'Order Summary',
          items: [
            { id: 'item-1', name: 'Wireless Headphones', description: 'Noise-cancelling, Black', quantity: 1, unitPrice: 199.99, imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
            { id: 'item-2', name: 'USB-C Cable', description: '2m, White', quantity: 2, unitPrice: 19.99 }
          ],
          pricing: {
            subtotal: 239.97,
            tax: 21.60,
            taxLabel: 'Sales Tax (9%)',
            shipping: 9.99,
            discount: 24.00,
            discountLabel: 'Coupon: SAVE10',
            total: 247.56,
            currency: 'USD'
          }
        }
      }
    }
  }
];

/**
 * ParameterSlider Examples
 */
const parameterSliderExamples: ComponentExample[] = [
  {
    description: 'Interactive parameter controls for image generation',
    spec: {
      id: 'parameterslider-1',
      component: {
        ParameterSlider: {
          id: 'params-1',
          sliders: [
            { id: 'temperature', label: 'Temperature', min: 0, max: 1, step: 0.1, value: 0.7, precision: 1 },
            { id: 'steps', label: 'Inference Steps', min: 10, max: 100, step: 5, value: 50, unit: 'steps' },
            { id: 'guidance', label: 'Guidance Scale', min: 1, max: 20, step: 0.5, value: 7.5, precision: 1 }
          ]
        }
      }
    }
  }
];

/**
 * PreferencesPanel Examples
 */
const preferencesPanelExamples: ComponentExample[] = [
  {
    description: 'User preferences with switches, toggles, and select',
    spec: {
      id: 'preferencespanel-1',
      component: {
        PreferencesPanel: {
          id: 'prefs-1',
          title: 'Notification Settings',
          sections: [
            {
              heading: 'Communication',
              items: [
                { id: 'email-notifs', type: 'switch', label: 'Email Notifications', description: 'Receive email updates', defaultChecked: true },
                { id: 'push-notifs', type: 'switch', label: 'Push Notifications', description: 'Get push notifications on mobile', defaultChecked: false }
              ]
            },
            {
              heading: 'Display',
              items: [
                { id: 'theme', type: 'toggle', label: 'Theme', options: [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }], defaultValue: 'light' },
                { id: 'language', type: 'select', label: 'Language', selectOptions: [
                  { value: 'en', label: 'English' },
                  { value: 'es', label: 'Spanish' },
                  { value: 'fr', label: 'French' },
                  { value: 'de', label: 'German' },
                  { value: 'ja', label: 'Japanese' }
                ], defaultSelected: 'en' }
              ]
            }
          ]
        }
      }
    }
  }
];

/**
 * QuestionFlow Examples
 */
const questionFlowExamples: ComponentExample[] = [
  {
    description: 'Progressive question flow (one step at a time)',
    spec: {
      id: 'questionflow-1',
      component: {
        QuestionFlow: {
          id: 'qflow-1',
          step: 1,
          title: 'Choose your deployment target',
          description: 'Where would you like to deploy this application?',
          options: [
            { id: 'aws', label: 'Amazon Web Services', description: 'Deploy to AWS using ECS' },
            { id: 'gcp', label: 'Google Cloud Platform', description: 'Deploy to GCP using Cloud Run' },
            { id: 'azure', label: 'Microsoft Azure', description: 'Deploy to Azure using Container Instances' }
          ],
          selectionMode: 'single'
        }
      }
    }
  },
  {
    description: 'Upfront question flow (all steps visible)',
    spec: {
      id: 'questionflow-2',
      component: {
        QuestionFlow: {
          id: 'qflow-2',
          steps: [
            {
              id: 'step1',
              title: 'Choose deployment target',
              options: [
                { id: 'aws', label: 'AWS' },
                { id: 'gcp', label: 'GCP' },
                { id: 'azure', label: 'Azure' }
              ],
              selectionMode: 'single'
            },
            {
              id: 'step2',
              title: 'Select region',
              options: [
                { id: 'us-east', label: 'US East' },
                { id: 'us-west', label: 'US West' },
                { id: 'eu-west', label: 'EU West' }
              ],
              selectionMode: 'single'
            }
          ]
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
    description: `Advanced geospatial visualization using deck.gl + MapLibre GL. GPU-accelerated
    rendering for large-scale data (100k+ points). Supports:
    - Heatmaps (type: 'heatmap') for density visualization with color gradients
    - 3D Hexagon bins (type: 'hexagon') with extrusion for spatial aggregation (set pitch: 45 to see 3D)
    - Arc layers (type: 'arc') for routes, flights, connections between locations.
      Arc data uses targetLng/targetLat for destination: { lng, lat, targetLng, targetLat }
    - Point layers (type: 'point') as scatter plots with configurable radius
    - Line layers (type: 'line') as paths connecting points
    - Polygon layers (type: 'polygon') for area fills
    - Multiple simultaneous layers with layer visibility toggling
    - Custom color scales: pass array of hex colors for gradients, single hex for solid
    - Basemaps: 'light' (Positron), 'dark' (Dark Matter), 'voyager' (CARTO Voyager)
    - 3D perspective: set pitch (0-60) and bearing for tilted/rotated views
    - Style props: size, opacity, extruded (boolean), elevation (number)
    IMPORTANT: For showing routes/voyages/flights between locations, use type: 'arc' with
    targetLng and targetLat fields. Do NOT use type: 'point' for route visualization.
    Note: Different from Maps component - Geospatial is for advanced data visualization
    (heatmaps, hex bins, arcs, flows), while Maps is for simple 2D marker display.
    Coordinates use { lng, lat } format (NOT longitude/latitude).`,
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
  },

  ApprovalCard: {
    type: 'ApprovalCard',
    description: `Approval card for user decision-making with confirm/cancel actions. Request user approval
    for sensitive or destructive operations. Supports:
    - Title and description text
    - Variant modes: default or destructive (red styling for dangerous actions)
    - Metadata key-value pairs for context
    - Custom confirm and cancel button labels
    - Choice tracking (approved/denied status)
    - Icon display
    - Callback handlers for confirm and cancel actions
    - Visual status indicators
    Note: Perfect for confirming deletions, deployments, purchases, or any action requiring explicit user consent.
    Use destructive variant for dangerous operations like data deletion.`,
    props: ['id', 'role', 'title', 'description', 'icon', 'metadata', 'variant', 'confirmLabel', 'cancelLabel', 'choice'],
    examples: approvalCardExamples
  },

  WeatherWidget: {
    type: 'WeatherWidget',
    description: `Interactive weather widget with current conditions and forecast. Display weather data
    with visual effects and animations. Supports:
    - Current weather: temperature, conditions (clear, rain, snow, etc.), min/max temps
    - Extended data: humidity, wind speed/direction, visibility, precipitation level
    - Multi-day forecast (up to 7 days)
    - Weather condition types: clear, partly-cloudy, cloudy, overcast, fog, drizzle, rain, heavy-rain,
      thunderstorm, snow, sleet, hail, windy
    - Temperature units: celsius or fahrenheit
    - Visual weather effects (optional): rain, snow, clouds animations
    - Effect quality settings: low, medium, high, auto
    - Reduced motion support for accessibility
    - Last update timestamp
    - Locale support for internationalization
    Note: Perfect for weather apps, dashboards, or any application showing location-based weather data.
    Visual effects create immersive experience but can be disabled for performance.`,
    props: ['id', 'role', 'location', 'current', 'forecast', 'unit', 'updatedAt', 'locale', 'effects'],
    examples: weatherWidgetExamples
  },

  StatsDisplay: {
    type: 'StatsDisplay',
    description: `Statistics dashboard component for displaying metrics with trends and sparklines. Show key
    performance indicators with rich formatting and visualizations. Supports:
    - Multiple stat items with labels and values
    - Format types: text, number (with compact notation), currency (with currency codes), percent
    - Difference/trend indicators: positive/negative changes with customizable "up is positive" logic
    - Sparkline mini-charts: show trends with line graphs, custom colors
    - Number formatting: decimal places, compact notation (1.2K, 3.4M)
    - Currency formatting: multi-currency support with symbols
    - Percentage formatting: fraction (0-1) or unit (0-100) basis
    - Title and description text
    - Locale support for number/currency formatting
    - Visual trend indicators with colors (green for positive, red for negative)
    Note: Perfect for dashboards, analytics displays, KPI tracking, business metrics, and data visualization.
    Sparklines provide quick visual context for trends.`,
    props: ['id', 'role', 'title', 'description', 'stats', 'locale'],
    examples: statsDisplayExamples
  },

  ProgressTracker: {
    type: 'ProgressTracker',
    description: `Multi-step progress tracker for workflows and processes. Display step-by-step progress
    with status indicators. Supports:
    - Multiple sequential steps with unique IDs
    - Step status: pending, in-progress, completed, failed
    - Step labels and optional descriptions
    - Elapsed time tracking
    - Visual progress indicators with icons and colors
    - Receipt mode: show workflow outcome after completion
    - Response actions: buttons for user interactions
    - Timeline-style visual layout
    - Status-specific styling (gray=pending, blue=in-progress, green=completed, red=failed)
    Note: Perfect for deployment workflows, onboarding processes, checkout flows, installation wizards,
    and any multi-step operation requiring progress visualization. Receipt mode shows final results.`,
    props: ['id', 'role', 'steps', 'elapsedTime', 'choice', 'responseActions'],
    examples: progressTrackerExamples
  },

  OptionList: {
    type: 'OptionList',
    description: `Selectable option list with single or multi-select modes. Present choices to users with
    rich descriptions and interactive selection. Supports:
    - Single selection or multi-selection modes
    - Option labels and descriptions
    - Icon support for visual identification
    - Disabled state for individual options
    - Default value or controlled value
    - Choice/receipt mode: show final selection after confirmation
    - Min/max selection constraints for multi-select
    - Response actions: custom action buttons
    - Search and filtering capabilities
    - Keyboard navigation
    - onChange and onConfirm callbacks
    Note: Perfect for configuration wizards, deployment target selection, feature toggles, multi-option
    surveys, and any scenario requiring user choice from multiple options. Receipt mode preserves user decisions.`,
    props: ['id', 'role', 'options', 'selectionMode', 'defaultValue', 'choice', 'responseActions', 'minSelections', 'maxSelections'],
    examples: optionListExamples
  },

  InstagramPost: {
    type: 'InstagramPost',
    description: `Instagram-style social media post component. Display posts with images, captions,
    and engagement metrics in authentic Instagram styling. Supports:
    - Author information: name, handle, avatar, verified badge
    - Post text/caption
    - Media attachments: images or videos (array for carousel)
    - Engagement statistics: like count, liked status
    - Timestamp with relative time display
    - Instagram-authentic UI: profile pictures, three-dot menu, engagement buttons
    - Image galleries for multiple photos
    - Responsive design
    Note: Perfect for social media mockups, content previews, influencer dashboards, social listening tools,
    or displaying Instagram-style content in applications. Provides authentic Instagram look and feel.`,
    props: ['id', 'author', 'text', 'media', 'stats', 'createdAt'],
    examples: instagramPostExamples
  },

  LinkedInPost: {
    type: 'LinkedInPost',
    description: `LinkedIn-style professional social media post. Display professional posts with rich media
    and link previews in authentic LinkedIn styling. Supports:
    - Author information: name, avatar, professional headline
    - Post text content
    - Single media attachment: image or video
    - Link preview cards: URL, title, description, image, domain
    - Engagement statistics: like count, liked status
    - Timestamp with relative time display
    - LinkedIn-authentic UI: professional styling, engagement buttons
    - Responsive design
    Note: Perfect for professional network mockups, content management systems, social media monitoring,
    LinkedIn integrations, or displaying professional posts in applications. Authentic LinkedIn design.`,
    props: ['id', 'author', 'text', 'media', 'linkPreview', 'stats', 'createdAt'],
    examples: linkedInPostExamples
  },

  XPost: {
    type: 'XPost',
    description: `X (formerly Twitter) post component with full feature support. Display tweets/posts with
    media, link previews, and quoted posts in authentic X styling. Supports:
    - Author information: name, handle, avatar, verified badge
    - Post text content
    - Single media attachment: image or video with aspect ratio (1:1, 4:3, 16:9, 9:16)
    - Link preview cards
    - Quoted posts: embed another post within the main post (recursive structure)
    - Engagement statistics: likes, reposts, bookmarks with interaction states
    - Timestamp with relative time display
    - X-authentic UI: styling, three-dot menu, engagement buttons
    - Responsive design
    Note: Perfect for Twitter/X integrations, social media dashboards, content moderation tools,
    social listening platforms, or displaying X-style content. Supports complex nested quote tweets.`,
    props: ['id', 'author', 'text', 'media', 'linkPreview', 'quotedPost', 'stats', 'createdAt'],
    examples: xPostExamples
  },

  LinkPreview: {
    type: 'LinkPreview',
    description: `Rich link preview card with metadata and images. Display external links with Open Graph
    style preview cards. Supports:
    - Target URL (href)
    - Title and description text
    - Preview image with aspect ratio control (16:9, 4:3, 1:1, etc.)
    - Image fit modes: cover, contain, fill
    - Domain name display
    - Favicon icon
    - Timestamp metadata
    - Locale support
    - Clickable card linking to URL
    - Responsive design
    - Receipt mode for workflow tracking
    Note: Perfect for chat applications, social media posts, content management systems, bookmarking tools,
    or anywhere external links need rich visual previews. Similar to Open Graph protocol displays.`,
    props: ['id', 'role', 'receipt', 'href', 'title', 'description', 'image', 'domain', 'favicon', 'ratio', 'fit', 'createdAt', 'locale'],
    examples: linkPreviewExamples
  },

  Video: {
    type: 'Video',
    description: `Video player component with controls and metadata. Display and play video content with
    rich preview information. Supports:
    - Video source URL (MP4, WebM, etc.)
    - Poster image for video preview
    - Title and description
    - Duration display in milliseconds
    - Aspect ratio control (16:9, 4:3, 1:1, 9:16)
    - Video fit modes: cover, contain, fill
    - External link (href) to full video page
    - Domain and source information
    - Timestamp metadata
    - Locale support
    - Asset ID tracking
    - Native video controls
    - Receipt mode for workflow tracking
    Note: Perfect for video platforms, content management systems, social media, educational apps,
    or any application displaying video content with rich metadata.`,
    props: ['id', 'role', 'receipt', 'assetId', 'src', 'poster', 'title', 'description', 'href', 'domain', 'durationMs', 'ratio', 'fit', 'createdAt', 'locale', 'source'],
    examples: videoExamples
  },

  MessageDraft: {
    type: 'MessageDraft',
    description: `Email or Slack message draft composer. Draft and send messages across different communication
    channels with channel-specific features. Supports:
    - Two channel types: email and slack
    - Email channel: subject, from, to, cc, bcc recipients
    - Slack channel: target (channel or DM), member count
    - Message body text
    - Outcome tracking: sent or cancelled status
    - Undo grace period with countdown timer
    - Send confirmation
    - Cancel/discard actions
    - Email address validation
    - Slack channel/DM targeting
    - Visual differentiation by channel type
    Note: Perfect for communication tools, chatbots, automation platforms, notification systems,
    or any application that drafts and sends messages. Supports both async email and real-time Slack.`,
    props: ['id', 'role', 'channel', 'body', 'outcome', 'subject', 'from', 'to', 'cc', 'bcc', 'target'],
    examples: messageDraftExamples
  },

  ItemCarousel: {
    type: 'ItemCarousel',
    description: `Horizontal scrollable carousel for displaying items. Show collections of items (products,
    services, media) in a scrollable carousel layout. Supports:
    - Multiple items with unique IDs
    - Item names and subtitles
    - Item images (optional)
    - Color theming per item
    - Custom actions per item (buttons/links)
    - Title and description for carousel
    - Horizontal scroll with navigation arrows
    - Touch/swipe support for mobile
    - Click handlers for item selection
    - Action button callbacks
    - Responsive grid layout
    Note: Perfect for e-commerce product displays, media galleries, feature showcases, recommendation feeds,
    or any scenario requiring horizontal browsing of items. Great for mobile-first experiences.`,
    props: ['id', 'title', 'description', 'items', 'className'],
    examples: itemCarouselExamples
  },

  OrderSummary: {
    type: 'OrderSummary',
    description: `E-commerce order summary with itemized pricing. Display order details with items, quantities,
    and complete pricing breakdown. Supports:
    - Order items: name, description, image, quantity, unit price
    - Pricing breakdown: subtotal, tax, shipping, discounts, total
    - Custom labels: tax label, discount label
    - Currency support with symbols
    - Item images (optional)
    - Order confirmation choice tracking
    - Confirmed order ID and timestamp
    - Response actions: confirm, cancel, edit buttons
    - Professional e-commerce styling
    - Receipt mode: show final confirmed order
    Note: Perfect for checkout flows, order confirmations, purchase summaries, shopping carts, invoices,
    or any e-commerce transaction display. Shows complete cost breakdown for transparency.`,
    props: ['id', 'role', 'title', 'items', 'pricing', 'choice', 'responseActions'],
    examples: orderSummaryExamples
  },

  ParameterSlider: {
    type: 'ParameterSlider',
    description: `Interactive multi-slider parameter control panel. Adjust multiple numeric parameters with
    sliders and real-time value display. Supports:
    - Multiple sliders with unique IDs
    - Min, max, and step values per slider
    - Current value display
    - Unit labels (%, px, steps, etc.)
    - Precision control for decimal places
    - Custom styling per slider: track, fill, handle
    - Value change callbacks
    - Response actions: apply, reset, save buttons
    - Real-time value updates
    - Keyboard support for fine adjustments
    Note: Perfect for AI model parameters (temperature, steps), image editing controls, audio/video settings,
    game configuration, visualization tuning, or any scenario requiring multiple numeric inputs.
    Great for parameter exploration and fine-tuning.`,
    props: ['id', 'role', 'sliders', 'responseActions'],
    examples: parameterSliderExamples
  },

  PreferencesPanel: {
    type: 'PreferencesPanel',
    description: `Comprehensive settings and preferences management panel. Organize user preferences with
    multiple control types in logical sections. Supports:
    - Multiple sections with optional headings
    - Three control types: switch (boolean), toggle (2 options), select (5+ options)
    - Switch items: simple on/off preferences
    - Toggle items: binary choice between two labeled options
    - Select items: dropdown for 5+ choices
    - Labels and descriptions per item
    - Default values per control type
    - Grouped sections for organization
    - Save and cancel actions
    - Receipt mode: show confirmed preferences
    - Response actions: custom action buttons
    - Value change tracking
    Note: Perfect for user settings, application configuration, notification preferences, privacy controls,
    display options, or any complex preference management interface. Organizes many settings cleanly.`,
    props: ['id', 'role', 'receipt', 'title', 'sections', 'responseActions'],
    examples: preferencesPanelExamples
  },

  QuestionFlow: {
    type: 'QuestionFlow',
    description: `Multi-step question flow for guided decision making. Present questions progressively or
    all at once for complex user input collection. Supports:
    - Two flow modes: progressive (one step at a time) and upfront (all steps visible)
    - Progressive mode: shows single question, advances on selection, shows step number
    - Upfront mode: displays all questions at once, allows any-order completion
    - Single or multi-select per question
    - Options with labels, descriptions, icons, and disabled states
    - Step labels and descriptions
    - Back navigation in progressive mode
    - Receipt mode: shows summary of all answers after completion
    - Summary formatting: question label -> answer(s)
    - Completion callbacks with all answers
    - Step change tracking
    Note: Perfect for onboarding flows, configuration wizards, surveys, multi-step forms, decision trees,
    or any scenario requiring structured question-answer collection. Progressive mode reduces cognitive load.`,
    props: ['id', 'role', 'step', 'title', 'description', 'options', 'steps', 'choice', 'selectionMode'],
    examples: questionFlowExamples
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
