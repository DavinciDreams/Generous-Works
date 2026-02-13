/**
 * A2UI Component Registry Validation Tests
 *
 * Ensures all components are properly registered in:
 * - Component registry
 * - Schema registry (where applicable)
 * - Catalog entries
 */

import { describe, it, expect } from 'vitest';
import { a2uiComponents, specializedComponents, getAvailableComponents, componentCategories } from '../components';
import { schemaRegistry } from '../../schemas/index';
import { componentCatalog, getCatalogPrompt, getComponentTypes, getComponentDefinition } from '../catalog';

// Tool UI components that use ToolUIPropsSchema instead of individual schemas
const TOOL_UI_COMPONENTS = [
  'DataTable',
  'ImageGallery',
  'ApprovalCard',
  'WeatherWidget',
  'StatsDisplay',
  'ProgressTracker',
  'OptionList',
  'InstagramPost',
  'LinkedInPost',
  'XPost',
  'LinkPreview',
  'Video',
  'MessageDraft',
  'ItemCarousel',
  'OrderSummary',
  'ParameterSlider',
  'PreferencesPanel',
  'QuestionFlow',
];

// Core specialized components (should have individual schemas)
const CORE_SPECIALIZED = [
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
  'Charts',
  'Geospatial',
  'WYSIWYG',
  'VRM',
  'ToolUI',
  'Calendar',
  'JSONViewer',
  'CodeEditor',
  'Markdown',
];

describe('A2UI Component Registry', () => {
  describe('Component Registration', () => {
    it('should have all specialized components registered', () => {
      const specializedList = Object.keys(specializedComponents);
      expect(specializedList.length).toBe(38);

      specializedList.forEach(componentName => {
        expect(a2uiComponents).toHaveProperty(componentName);
      });
    });

    it('should have correct component counts', () => {
      const allComponents = getAvailableComponents();
      const specializedList = Object.keys(specializedComponents);

      // 38 specialized + 76 standard UI = 114 total
      expect(allComponents.length).toBeGreaterThanOrEqual(110);
      expect(specializedList.length).toBe(38);
    });

    it('should have all core specialized components', () => {
      CORE_SPECIALIZED.forEach(componentName => {
        expect(specializedComponents).toHaveProperty(componentName);
      });
    });

    it('should have all Tool-UI components', () => {
      TOOL_UI_COMPONENTS.forEach(componentName => {
        expect(specializedComponents).toHaveProperty(componentName);
      });
    });
  });

  describe('Schema Registry', () => {
    it('should have schemas for core specialized components', () => {
      // Core specialized components should have individual schemas
      CORE_SPECIALIZED.forEach(componentName => {
        expect(schemaRegistry).toHaveProperty(componentName);
      });
    });

    it('should have ToolUI wrapper schema', () => {
      expect(schemaRegistry).toHaveProperty('ToolUI');
    });

    it('should have DataTable and ImageGallery schemas', () => {
      // These are technically Tool-UI but also have their own schemas
      expect(schemaRegistry).toHaveProperty('DataTable');
      expect(schemaRegistry).toHaveProperty('ImageGallery');
    });

    it('should have correct schema count', () => {
      const schemaCount = Object.keys(schemaRegistry).length;
      // Core specialized (20) + ToolUI (1) + DataTable (1) + ImageGallery (1) = 23 minimum
      expect(schemaCount).toBeGreaterThanOrEqual(22);
    });
  });

  describe('Catalog Entries', () => {
    it('should have catalog entries for all specialized components', () => {
      const specializedList = Object.keys(specializedComponents);

      specializedList.forEach(componentName => {
        expect(componentCatalog).toHaveProperty(componentName);
      });
    });

    it('should have descriptions for all specialized components', () => {
      const specializedList = Object.keys(specializedComponents);

      specializedList.forEach(componentName => {
        const catalogEntry = componentCatalog[componentName];
        expect(catalogEntry?.description).toBeTruthy();
        expect(catalogEntry?.description.length).toBeGreaterThan(10);
      });
    });

    it('should have props defined for all specialized components', () => {
      const specializedList = Object.keys(specializedComponents);

      specializedList.forEach(componentName => {
        const catalogEntry = componentCatalog[componentName];
        expect(catalogEntry?.props).toBeTruthy();
        expect(Array.isArray(catalogEntry?.props)).toBe(true);
        expect(catalogEntry?.props.length).toBeGreaterThan(0);
      });
    });

    it('should have examples for all specialized components', () => {
      const specializedList = Object.keys(specializedComponents);

      specializedList.forEach(componentName => {
        const catalogEntry = componentCatalog[componentName];
        expect(catalogEntry?.examples).toBeTruthy();
        expect(Array.isArray(catalogEntry?.examples)).toBe(true);
        expect(catalogEntry?.examples?.length).toBeGreaterThan(0);
      });
    });

    it('should have valid example specs', () => {
      const specializedList = Object.keys(specializedComponents);

      specializedList.forEach(componentName => {
        const catalogEntry = componentCatalog[componentName];
        const firstExample = catalogEntry?.examples?.[0];

        expect(firstExample).toBeTruthy();
        expect(firstExample?.spec).toBeTruthy();
        expect(firstExample?.spec.id).toBeTruthy();
        expect(firstExample?.spec.component).toBeTruthy();
      });
    });
  });

  describe('Component Categories', () => {
    it('should categorize components correctly', () => {
      expect(componentCategories.specialized).toBeTruthy();
      expect(componentCategories.toolui).toBeTruthy();
      expect(componentCategories.layout).toBeTruthy();
      expect(componentCategories.typography).toBeTruthy();
      expect(componentCategories.forms).toBeTruthy();

      // Check counts
      expect(componentCategories.specialized.length).toBe(20); // Core specialized
      expect(componentCategories.toolui.length).toBe(18); // Tool-UI components
    });
  });

  describe('Registry Consistency', () => {
    it('should have matching component names across registries', () => {
      const specializedList = Object.keys(specializedComponents);
      const catalogComponents = Object.keys(componentCatalog).filter(
        key => specializedList.includes(key)
      );

      // All specialized components should be in catalog
      specializedList.forEach(componentName => {
        expect(catalogComponents).toContain(componentName);
      });
    });

    it('should have type field matching component name in catalog', () => {
      const specializedList = Object.keys(specializedComponents);

      specializedList.forEach(componentName => {
        const catalogEntry = componentCatalog[componentName];
        expect(catalogEntry?.type).toBe(componentName);
      });
    });
  });

  describe('Catalog Helper Functions', () => {
    it('should generate catalog prompt', () => {
      const prompt = getCatalogPrompt();

      expect(prompt).toBeTruthy();
      expect(prompt.length).toBeGreaterThan(1000);
      expect(prompt).toContain('SPECIALIZED COMPONENTS');
      expect(prompt).toContain('STANDARD UI COMPONENTS');
      expect(prompt).toContain('surfaceUpdate');
    });

    it('should get component types', () => {
      const types = getComponentTypes();

      expect(Array.isArray(types)).toBe(true);
      // Catalog contains specialized components only (38-49 total)
      expect(types.length).toBeGreaterThanOrEqual(38);
      expect(types.length).toBeLessThanOrEqual(60);
    });

    it('should get component definition', () => {
      const def = getComponentDefinition('Timeline');

      expect(def).toBeTruthy();
      expect(def.type).toBe('Timeline');
      expect(def.description).toBeTruthy();
      expect(def.props).toBeTruthy();
      expect(def.examples).toBeTruthy();
    });
  });
});
