import { describe, it, expect } from 'vitest';
import {
  getMinimalCatalog,
  getCatalogByCategory,
  getProgressiveCatalog,
  getCatalogForTask,
  getMultiCategoryCatalog,
  estimateTokens,
  getCategoryInfo,
  getAvailableCategories,
} from '../catalog-variants';

describe('Catalog Variants', () => {
  describe('Token Optimization', () => {
    it('should generate minimal catalog with significant token savings', () => {
      const minimal = getMinimalCatalog();
      const standard = getProgressiveCatalog('standard');

      const minimalTokens = estimateTokens(minimal);
      const standardTokens = estimateTokens(standard);

      // Minimal should be at least 50% smaller
      expect(minimalTokens).toBeLessThan(standardTokens * 0.5);

      // Should still contain component info
      expect(minimal).toContain('A2UI Components');
      expect(minimal).toContain('surfaceUpdate');
    });

    it('should generate progressive catalogs with increasing detail', () => {
      const minimal = getProgressiveCatalog('minimal');
      const basic = getProgressiveCatalog('basic');
      const standard = getProgressiveCatalog('standard');
      const full = getProgressiveCatalog('full');

      const minimalTokens = estimateTokens(minimal);
      const basicTokens = estimateTokens(basic);
      const standardTokens = estimateTokens(standard);
      const fullTokens = estimateTokens(full);

      // Each level should be larger than the previous
      expect(minimalTokens).toBeLessThan(basicTokens);
      expect(basicTokens).toBeLessThan(standardTokens);
      expect(standardTokens).toBeLessThan(fullTokens);

      console.log('\n📊 Progressive Catalog Sizes:');
      console.log(`   Minimal:  ${minimalTokens.toLocaleString()} tokens`);
      console.log(`   Basic:    ${basicTokens.toLocaleString()} tokens`);
      console.log(`   Standard: ${standardTokens.toLocaleString()} tokens`);
      console.log(`   Full:     ${fullTokens.toLocaleString()} tokens`);
    });
  });

  describe('Category-Specific Catalogs', () => {
    it('should generate development category catalog', () => {
      const catalog = getCatalogByCategory('development');

      expect(catalog).toContain('DEVELOPMENT');
      expect(catalog).toContain('CodeEditor');
      expect(catalog).toContain('JSONViewer');
      expect(catalog).toContain('surfaceUpdate');

      const tokens = estimateTokens(catalog);
      console.log(`\n🔧 Development catalog: ${tokens.toLocaleString()} tokens`);
    });

    it('should generate multimedia category catalog', () => {
      const catalog = getCatalogByCategory('multimedia');

      expect(catalog).toContain('MULTIMEDIA');
      expect(catalog).toContain('Video');
      expect(catalog).toContain('ImageGallery');

      const tokens = estimateTokens(catalog);
      console.log(`🎬 Multimedia catalog: ${tokens.toLocaleString()} tokens`);
    });

    it('should generate charts category catalog', () => {
      const catalog = getCatalogByCategory('charts');

      expect(catalog).toContain('CHARTS');
      expect(catalog).toContain('Charts');
      expect(catalog).toContain('Timeline');

      const tokens = estimateTokens(catalog);
      console.log(`📈 Charts catalog: ${tokens.toLocaleString()} tokens`);
    });

    it('should generate social category catalog', () => {
      const catalog = getCatalogByCategory('social');

      expect(catalog).toContain('SOCIAL');
      expect(catalog).toContain('InstagramPost');
      expect(catalog).toContain('LinkedInPost');

      const tokens = estimateTokens(catalog);
      console.log(`📱 Social catalog: ${tokens.toLocaleString()} tokens`);
    });

    it('should handle invalid category gracefully', () => {
      const catalog = getCatalogByCategory('invalid' as any);

      expect(catalog).toContain('No components found');
    });
  });

  describe('Multi-Category Catalogs', () => {
    it('should combine multiple categories', () => {
      const catalog = getMultiCategoryCatalog(['development', 'productivity']);

      expect(catalog).toContain('DEVELOPMENT + PRODUCTIVITY');
      expect(catalog).toContain('CodeEditor');
      expect(catalog).toContain('Calendar');

      const tokens = estimateTokens(catalog);
      console.log(`\n🎯 Dev + Productivity: ${tokens.toLocaleString()} tokens`);
    });

    it('should deduplicate components across categories', () => {
      const catalog = getMultiCategoryCatalog(['development', 'productivity']);

      // Markdown appears in development, should only appear once
      const markdownOccurrences = (catalog.match(/## Markdown/g) || []).length;
      expect(markdownOccurrences).toBe(1);
    });
  });

  describe('Task-Specific Catalogs', () => {
    it('should generate data visualization catalog', () => {
      const catalog = getCatalogForTask('data-viz');

      expect(catalog).toContain('Charts');
      expect(catalog).toContain('Maps');

      const tokens = estimateTokens(catalog);
      console.log(`\n📊 Data-viz task: ${tokens.toLocaleString()} tokens`);
    });

    it('should generate social media catalog', () => {
      const catalog = getCatalogForTask('social-media');

      expect(catalog).toContain('InstagramPost');
      expect(catalog).toContain('Video');

      const tokens = estimateTokens(catalog);
      console.log(`📱 Social-media task: ${tokens.toLocaleString()} tokens`);
    });

    it('should generate documents catalog', () => {
      const catalog = getCatalogForTask('documents');

      expect(catalog).toContain('WYSIWYG');
      expect(catalog).toContain('Markdown');

      const tokens = estimateTokens(catalog);
      console.log(`📄 Documents task: ${tokens.toLocaleString()} tokens`);
    });

    it('should generate gaming catalog', () => {
      const catalog = getCatalogForTask('gaming');

      expect(catalog).toContain('ThreeScene');
      expect(catalog).toContain('Phaser');

      const tokens = estimateTokens(catalog);
      console.log(`🎮 Gaming task: ${tokens.toLocaleString()} tokens`);
    });
  });

  describe('Helper Functions', () => {
    it('should estimate tokens correctly', () => {
      const text = 'a'.repeat(400); // 400 chars = ~100 tokens
      const tokens = estimateTokens(text);

      expect(tokens).toBe(100);
    });

    it('should return available categories', () => {
      const categories = getAvailableCategories();

      expect(categories).toContain('development');
      expect(categories).toContain('multimedia');
      expect(categories).toContain('charts');
      expect(categories).toContain('social');
      expect(categories.length).toBeGreaterThan(5);
    });

    it('should return category info with counts', () => {
      const info = getCategoryInfo();

      expect(Array.isArray(info)).toBe(true);
      expect(info.length).toBeGreaterThan(5);

      const devCategory = info.find(c => c.name === 'development');
      expect(devCategory).toBeDefined();
      expect(devCategory!.count).toBeGreaterThan(0);
      expect(devCategory!.components).toContain('CodeEditor');
    });
  });

  describe('Content Quality', () => {
    it('should include examples in standard level', () => {
      const catalog = getProgressiveCatalog('standard');

      expect(catalog).toContain('Example:');
      expect(catalog).toContain('```json');
    });

    it('should not include examples in basic level', () => {
      const catalog = getProgressiveCatalog('basic');

      expect(catalog).not.toContain('Example:');
      expect(catalog).not.toContain('```json');
    });

    it('should include multiple examples in full level', () => {
      const catalog = getProgressiveCatalog('full');

      expect(catalog).toContain('Example');
      // Full catalog should have more examples
      const exampleCount = (catalog.match(/Example/g) || []).length;
      expect(exampleCount).toBeGreaterThan(10);
    });
  });
});
