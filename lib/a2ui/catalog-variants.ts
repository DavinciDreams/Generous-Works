/**
 * Token-Optimized A2UI Catalog Variants
 *
 * Reduces catalog size from ~16K tokens to 3-10K depending on use case.
 * Enables faster AI responses and more context space for complex tasks.
 */

import { componentCatalog } from './catalog';
import { componentCategories } from './components';

export type CatalogLevel = 'minimal' | 'basic' | 'standard' | 'full';
export type UseCaseCategory =
  | 'development'
  | 'multimedia'
  | '3d-games'
  | 'productivity'
  | 'maps-geospatial'
  | 'charts'
  | 'social'
  | 'forms'
  | 'layout'
  | 'typography';

/**
 * Get minimal catalog with just component names and key props
 * ~3-5K tokens (70% reduction)
 */
export function getMinimalCatalog(): string {
  const components = Object.entries(componentCatalog).map(([name, def]) => {
    const keyProps = def.props.slice(0, 3).join(', ');
    return `- ${name}: ${def.description.split('.')[0]}. Props: ${keyProps}`;
  }).join('\n');

  return `# A2UI Components (Minimal)

${components}

Use surfaceUpdate to modify or create components.`;
}

/**
 * Get catalog filtered by use case category
 * ~2-5K tokens per category
 */
export function getCatalogByCategory(category: UseCaseCategory): string {
  const categoryComponents = componentCategories[category] || [];

  if ((categoryComponents.length as number) === 0) {
    return `No components found for category: ${category}`;
  }

  const components = categoryComponents
    .map(componentName => {
      const def = componentCatalog[componentName];
      if (!def) return null;

      const propsStr = def.props.slice(0, 5).join(', ');
      const example = def.examples?.[0];

      return `## ${componentName}
${def.description}

Key Props: ${propsStr}

Example:
\`\`\`json
${JSON.stringify(example?.spec, null, 2)}
\`\`\`
`;
    })
    .filter(Boolean)
    .join('\n');

  return `# ${category.toUpperCase()} Components

${components}

Use surfaceUpdate to create or modify these components.`;
}

/**
 * Get catalog with progressive detail levels
 * - minimal: Just names and descriptions (~3K tokens)
 * - basic: + key props (~5K tokens)
 * - standard: + examples (~10K tokens)
 * - full: Everything (~16K tokens)
 */
export function getProgressiveCatalog(level: CatalogLevel = 'basic'): string {
  const entries = Object.entries(componentCatalog);

  if (level === 'minimal') {
    const list = entries
      .map(([name, def]) => `- ${name}: ${def.description.split('.')[0]}`)
      .join('\n');

    return `# A2UI Components\n\n${list}\n\nUse surfaceUpdate to create components.`;
  }

  if (level === 'basic') {
    const components = entries
      .map(([name, def]) => {
        const props = def.props.slice(0, 3).join(', ');
        return `## ${name}\n${def.description}\nProps: ${props}\n`;
      })
      .join('\n');

    return `# A2UI Components\n\n${components}\nUse surfaceUpdate to create components.`;
  }

  if (level === 'standard') {
    const components = entries
      .map(([name, def]) => {
        const props = def.props.join(', ');
        const example = def.examples?.[0];
        const exampleStr = example ? `\nExample:\n\`\`\`json\n${JSON.stringify(example.spec, null, 2)}\n\`\`\`\n` : '';

        return `## ${name}\n${def.description}\nProps: ${props}${exampleStr}`;
      })
      .join('\n');

    return `# A2UI Components\n\n${components}\nUse surfaceUpdate to create components.`;
  }

  // level === 'full' - return full catalog with all details
  const components = entries
    .map(([name, def]) => {
      const props = def.props.join(', ');
      const examples = def.examples
        ?.map((ex, i) => `\nExample ${i + 1}:\n\`\`\`json\n${JSON.stringify(ex.spec, null, 2)}\n\`\`\``)
        .join('\n');

      return `## ${name}\n${def.description}\nProps: ${props}${examples || ''}\n`;
    })
    .join('\n');

  return `# A2UI Components (Full Catalog)\n\n${components}\nUse surfaceUpdate to create components.`;

}

/**
 * Get catalog for multiple related categories
 * Example: ['development', 'productivity'] for a dev-focused chat
 */
export function getMultiCategoryCatalog(categories: UseCaseCategory[]): string {
  const allComponents = new Set<string>();

  categories.forEach(category => {
    const categoryComponents = componentCategories[category] || [];
    categoryComponents.forEach(comp => allComponents.add(comp));
  });

  const components = Array.from(allComponents)
    .map(componentName => {
      const def = componentCatalog[componentName];
      if (!def) return null;

      const propsStr = def.props.slice(0, 5).join(', ');
      const example = def.examples?.[0];

      return `## ${componentName}
${def.description}

Key Props: ${propsStr}

Example:
\`\`\`json
${JSON.stringify(example?.spec, null, 2)}
\`\`\`
`;
    })
    .filter(Boolean)
    .join('\n');

  return `# ${categories.map(c => c.toUpperCase()).join(' + ')} Components

${components}

Use surfaceUpdate to create or modify these components.`;
}

/**
 * Get catalog optimized for specific task types
 */
export function getCatalogForTask(taskType: 'data-viz' | 'social-media' | 'documents' | 'gaming'): string {
  const taskCategories: Record<string, UseCaseCategory[]> = {
    'data-viz': ['charts', 'maps-geospatial', 'productivity'],
    'social-media': ['social', 'multimedia'],
    'documents': ['productivity', 'development'],
    'gaming': ['3d-games', 'multimedia'],
  };

  const categories = taskCategories[taskType] || [];
  return getMultiCategoryCatalog(categories);
}

/**
 * Get token count estimate for a catalog string
 */
export function estimateTokens(catalogStr: string): number {
  return Math.floor(catalogStr.length / 4);
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): UseCaseCategory[] {
  return Object.keys(componentCategories) as UseCaseCategory[];
}

/**
 * Get category info with component count
 */
export function getCategoryInfo() {
  return Object.entries(componentCategories).map(([name, components]) => ({
    name,
    count: components.length,
    components: components,
  }));
}
