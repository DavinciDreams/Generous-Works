import { describe, it, expect } from 'vitest';
import { getSchema, validateProps, schemaRegistry } from './index';
import { TimelinePropsSchema } from './timeline.schema';
import { MapsPropsSchema } from './maps.schema';

describe('schemaRegistry', () => {
  it('should contain all expected component schemas', () => {
    const expectedComponents = [
      'Timeline',
      'Maps',
      'ThreeScene',
      'SVGPreview',
      'NodeEditor',
      'KnowledgeGraph',
      'Latex',
      'ModelViewer',
      'Phaser',
      'Mermaid',
      'Remotion',
      'Geospatial',
      'ToolUI',
      'Charts',
      'WYSIWYG',
      'VRM',
      'Calendar',
      'JSONViewer',
      'CodeEditor',
      'Markdown',
      'DataTable',
      'ImageGallery'
    ];

    expectedComponents.forEach((component) => {
      expect(schemaRegistry).toHaveProperty(component);
      expect(schemaRegistry[component]).toBeDefined();
    });
  });

  it('should have valid Zod schemas for each component', () => {
    Object.entries(schemaRegistry).forEach(([componentType, schema]) => {
      expect(schema).toBeDefined();
      expect(typeof schema.parse).toBe('function');
      expect(typeof schema.safeParse).toBe('function');
    });
  });
});

describe('getSchema', () => {
  it('should return schema for valid component type', () => {
    const schema = getSchema('Timeline');
    expect(schema).toBeDefined();
    expect(schema).toBe(TimelinePropsSchema);
  });

  it('should return undefined for unknown component type', () => {
    const schema = getSchema('UnknownComponent');
    expect(schema).toBeUndefined();
  });

  it('should return correct schema for each registered component', () => {
    const timelineSchema = getSchema('Timeline');
    const mapsSchema = getSchema('Maps');

    expect(timelineSchema).toBe(TimelinePropsSchema);
    expect(mapsSchema).toBe(MapsPropsSchema);
  });

  it('should be case-sensitive', () => {
    const schema = getSchema('timeline');
    expect(schema).toBeUndefined();
  });
});

describe('validateProps - success cases', () => {
  it('should validate valid Timeline props', () => {
    const validProps = {
      data: {
        events: [
          {
            start_date: { year: 2024 },
            text: { headline: 'Event 1' }
          }
        ]
      }
    };

    const result = validateProps('Timeline', validProps);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBeDefined();
      expect(result.data.data.events).toHaveLength(1);
    }
  });

  it('should validate Timeline props with optional fields', () => {
    const validProps = {
      data: {
        events: [
          {
            start_date: { year: 2024, month: 6, day: 15 },
            text: { headline: 'Event', text: 'Description' },
            group: 'Group A'
          }
        ]
      },
      options: {
        height: 600,
        language: 'en'
      }
    };

    const result = validateProps('Timeline', validProps);

    expect(result.success).toBe(true);
  });

  it('should return typed data on success', () => {
    const validProps = {
      data: {
        events: [{ start_date: { year: 2024 } }]
      }
    };

    const result = validateProps<{ data: any }>('Timeline', validProps);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.data.events[0].start_date.year).toBe(2024);
    }
  });
});

describe('validateProps - error cases', () => {
  it('should fail validation for unknown component type', () => {
    const result = validateProps('UnknownComponent', {});

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toContain('No schema found');
      expect(result.error.message).toContain('UnknownComponent');
    }
  });

  it('should fail validation for invalid Timeline props', () => {
    const invalidProps = {
      data: {
        events: 'not an array'
      }
    };

    const result = validateProps('Timeline', invalidProps);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });

  it('should fail validation for missing required fields', () => {
    const invalidProps = {
      // Missing 'data' field
    };

    const result = validateProps('Timeline', invalidProps);

    expect(result.success).toBe(false);
  });

  it('should fail validation for incorrect data types', () => {
    const invalidProps = {
      data: {
        events: [
          {
            start_date: { year: 'not a number' }
          }
        ]
      }
    };

    const result = validateProps('Timeline', invalidProps);

    expect(result.success).toBe(false);
  });

  it('should return Error instance on validation failure', () => {
    const invalidProps = { invalid: 'data' };

    const result = validateProps('Timeline', invalidProps);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBeTruthy();
    }
  });

  it('should handle nested validation errors', () => {
    const invalidProps = {
      data: {
        events: [
          {
            start_date: {
              year: 2024,
              month: 13 // Invalid month
            }
          }
        ]
      }
    };

    const result = validateProps('Timeline', invalidProps);

    expect(result.success).toBe(false);
  });

  it('should convert non-Error exceptions to Error instances', () => {
    // This tests the error handling in the catch block
    const result = validateProps('Timeline', null);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).toBeInstanceOf(Error);
    }
  });
});

describe('validateProps - edge cases', () => {
  it('should handle null input', () => {
    const result = validateProps('Timeline', null);
    expect(result.success).toBe(false);
  });

  it('should handle undefined input', () => {
    const result = validateProps('Timeline', undefined);
    expect(result.success).toBe(false);
  });

  it('should handle empty object', () => {
    const result = validateProps('Timeline', {});
    expect(result.success).toBe(false);
  });

  it('should handle array input when object expected', () => {
    const result = validateProps('Timeline', []);
    expect(result.success).toBe(false);
  });

  it('should handle primitive values', () => {
    const result = validateProps('Timeline', 'string');
    expect(result.success).toBe(false);
  });

  it('should validate Timeline with complex nested structure', () => {
    const complexProps = {
      data: {
        title: {
          start_date: { year: 2020 },
          text: { headline: 'Title', text: 'Description' },
          media: {
            url: 'https://example.com/image.jpg',
            caption: 'Caption',
            credit: 'Credit'
          }
        },
        events: [
          {
            start_date: { year: 2021, month: 1, day: 1 },
            end_date: { year: 2021, month: 12, day: 31 },
            text: { headline: 'Event 1' },
            background: { color: '#ffffff' }
          },
          {
            start_date: { year: 2022 },
            text: { headline: 'Event 2', text: 'Details' },
            media: { url: 'https://example.com/video.mp4' }
          }
        ],
        eras: [
          {
            start_date: { year: 2020 },
            end_date: { year: 2025 },
            text: { headline: 'Era' }
          }
        ]
      },
      options: {
        height: 800,
        width: '100%',
        language: 'en',
        start_at_slide: 1,
        timenav_position: 'bottom'
      }
    };

    const result = validateProps('Timeline', complexProps);
    expect(result.success).toBe(true);
  });

  it('should handle Timeline with minimal valid data', () => {
    const minimalProps = {
      data: {
        events: []
      }
    };

    const result = validateProps('Timeline', minimalProps);
    expect(result.success).toBe(true);
  });
});

describe('validateProps - type inference', () => {
  it('should properly infer Timeline type on success', () => {
    const props = {
      data: {
        events: [{ start_date: { year: 2024 } }]
      }
    };

    type TimelineProps = {
      data: {
        events: Array<{ start_date: { year: number } }>;
      };
      options?: any;
    };

    const result = validateProps<TimelineProps>('Timeline', props);

    if (result.success) {
      // TypeScript should know this is TimelineProps
      const year: number = result.data.data.events[0].start_date.year;
      expect(year).toBe(2024);
    }
  });

  it('should properly type error on failure', () => {
    const result = validateProps('Timeline', {});

    if (!result.success) {
      // TypeScript should know this has an error property
      const errorMessage: string = result.error.message;
      expect(typeof errorMessage).toBe('string');
    }
  });
});
