/**
 * A2UI Component Catalog
 * Defines available AI Elements for agent-generated UIs
 */

import type { ComponentCatalog, ComponentExample } from './types';

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
 * Component Catalog
 *
 * This catalog defines all AI Elements available for agent-generated UIs.
 * Each entry includes:
 * - type: Component type identifier
 * - description: Human-readable description for AI agents
 * - props: List of available props
 * - examples: Example usage for AI prompt generation
 */
export const componentCatalog: ComponentCatalog = {
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
  }
};

/**
 * Get catalog as AI prompt
 *
 * Generates a formatted string suitable for AI system prompts.
 * Includes component descriptions, props, and examples.
 */
export function getCatalogPrompt(): string {
  const components = Object.values(componentCatalog);

  const prompt = `You can generate interactive UIs using the following components:

${components.map((comp, i) => `${i + 1}. ${comp.type}
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
