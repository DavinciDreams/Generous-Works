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
