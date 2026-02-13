/**
 * A2UI Component Registry Validator
 *
 * Validates completeness of component registrations across:
 * - Component registry (components.ts)
 * - Schema registry (schemas/index.ts)
 * - Catalog entries (catalog.ts)
 * - Tool UI schemas (schemas/toolui.schema.ts)
 */

import { a2uiComponents, specializedComponents, getAvailableComponents } from './components';
import { schemaRegistry } from '../schemas/index';
import { componentCatalog } from './catalog';

// List of Tool UI components that are part of the specialized ToolUI wrapper
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

// Core specialized components (non-ToolUI)
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

// All specialized components that should have schemas
// Unused for now, but kept for future validation
// const ALL_SPECIALIZED = [...CORE_SPECIALIZED];

interface ValidationResult {
  componentName: string;
  registered: boolean;
  hasSchema: boolean;
  hasCatalogEntry: boolean;
  hasExample: boolean;
  category: string;
  issues: string[];
}

interface ValidationSummary {
  totalComponents: number;
  totalSpecialized: number;
  totalStandardUI: number;
  totalToolUI: number;
  allRegistered: number;
  withSchemas: number;
  withCatalogEntries: number;
  withExamples: number;
  results: ValidationResult[];
  issues: string[];
}

/**
 * Validate component registry completeness
 */
export function validateRegistry(): ValidationSummary {
  const results: ValidationResult[] = [];
  const issues: string[] = [];

  // Get all registered components
  const registeredComponents = getAvailableComponents();

  // Count by category
  const specializedList = Object.keys(specializedComponents);
  const toolUIList = TOOL_UI_COMPONENTS;
  const coreSpecializedList = CORE_SPECIALIZED;

  // Standard UI components = total - specialized
  const standardUICount = registeredComponents.length - specializedList.length;

  console.log('📊 Component Registry Validation\n');
  console.log(`Total Registered Components: ${registeredComponents.length}`);
  console.log(`  - Specialized Components: ${specializedList.length}`);
  console.log(`    - Core Specialized: ${coreSpecializedList.length}`);
  console.log(`    - Tool UI Components: ${toolUIList.length}`);
  console.log(`  - Standard UI Components: ${standardUICount}\n`);

  // Validate each specialized component
  for (const componentName of specializedList) {
    const isToolUI = toolUIList.includes(componentName);
    const category = isToolUI ? 'tool-ui' : 'specialized';

    const result: ValidationResult = {
      componentName,
      registered: registeredComponents.includes(componentName),
      hasSchema: componentName in schemaRegistry,
      hasCatalogEntry: componentName in componentCatalog,
      hasExample: (componentCatalog[componentName]?.examples?.length ?? 0) > 0,
      category,
      issues: [],
    };

    // Check for issues
    if (!result.registered) {
      result.issues.push('Not registered in components.ts');
    }

    // ToolUI components don't need individual schemas (they use ToolUIPropsSchema)
    // But core specialized components should have schemas
    if (!isToolUI && componentName !== 'ToolUI' && !result.hasSchema) {
      result.issues.push('Missing schema in schemas/index.ts');
    }

    if (!result.hasCatalogEntry) {
      result.issues.push('Missing catalog entry in catalog.ts');
    }

    if (!result.hasExample) {
      result.issues.push('Missing example in catalog');
    }

    if (result.issues.length > 0) {
      issues.push(`${componentName}: ${result.issues.join(', ')}`);
    }

    results.push(result);
  }

  // Summary
  const summary: ValidationSummary = {
    totalComponents: registeredComponents.length,
    totalSpecialized: specializedList.length,
    totalStandardUI: standardUICount,
    totalToolUI: toolUIList.length,
    allRegistered: results.filter(r => r.registered).length,
    withSchemas: results.filter(r => r.hasSchema || TOOL_UI_COMPONENTS.includes(r.componentName)).length,
    withCatalogEntries: results.filter(r => r.hasCatalogEntry).length,
    withExamples: results.filter(r => r.hasExample).length,
    results,
    issues,
  };

  return summary;
}

/**
 * Print validation report
 */
export function printValidationReport() {
  const summary = validateRegistry();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 COMPONENT VALIDATION REPORT');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📊 TOTALS:');
  console.log(`  Total Components:        ${summary.totalComponents}`);
  console.log(`  - Specialized:           ${summary.totalSpecialized}`);
  console.log(`    - Core:                ${summary.totalSpecialized - summary.totalToolUI}`);
  console.log(`    - Tool UI:             ${summary.totalToolUI}`);
  console.log(`  - Standard UI:           ${summary.totalStandardUI}\n`);

  console.log('✅ REGISTRATION STATUS:');
  console.log(`  Components Registered:   ${summary.allRegistered}/${summary.totalSpecialized}`);
  console.log(`  With Schemas:            ${summary.withSchemas}/${summary.totalSpecialized}`);
  console.log(`  With Catalog Entries:    ${summary.withCatalogEntries}/${summary.totalSpecialized}`);
  console.log(`  With Examples:           ${summary.withExamples}/${summary.totalSpecialized}\n`);

  // Group results by category
  const coreSpecialized = summary.results.filter(r => r.category === 'specialized');
  const toolUI = summary.results.filter(r => r.category === 'tool-ui');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔧 CORE SPECIALIZED COMPONENTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  printComponentTable(coreSpecialized);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🛠️  TOOL-UI COMPONENTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  printComponentTable(toolUI);

  // Show issues
  if (summary.issues.length > 0) {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  ISSUES FOUND');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    summary.issues.forEach(issue => console.log(`  ❌ ${issue}`));
  } else {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ALL COMPONENTS VALIDATED SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  console.log('');
}

/**
 * Print component table
 */
function printComponentTable(results: ValidationResult[]) {
  // Calculate max name length for padding
  const maxNameLength = Math.max(...results.map(r => r.componentName.length));

  console.log('  Component'.padEnd(maxNameLength + 4) + '│ Reg │ Schema │ Catalog │ Example');
  console.log('  ' + '─'.repeat(maxNameLength + 2) + '┼─────┼────────┼─────────┼────────');

  for (const result of results) {
    const name = result.componentName.padEnd(maxNameLength + 2);
    const reg = result.registered ? '✓' : '✗';

    // For ToolUI components, schema check is different
    const hasSchemaCheck = TOOL_UI_COMPONENTS.includes(result.componentName)
      ? '✓' // ToolUI components use ToolUIPropsSchema
      : result.hasSchema ? '✓' : '✗';

    const catalog = result.hasCatalogEntry ? '✓' : '✗';
    const example = result.hasExample ? '✓' : '✗';

    const regColor = result.registered ? '' : '';
    const schemaColor = (TOOL_UI_COMPONENTS.includes(result.componentName) || result.hasSchema) ? '' : '';
    const catalogColor = result.hasCatalogEntry ? '' : '';
    const exampleColor = result.hasExample ? '' : '';

    console.log(`  ${name}│  ${regColor}${reg}  │   ${schemaColor}${hasSchemaCheck}    │    ${catalogColor}${catalog}    │   ${exampleColor}${example}`);
  }
}

/**
 * Get detailed component information
 */
export function getComponentInfo(componentName: string) {
  const isRegistered = componentName in a2uiComponents;
  const hasSchema = componentName in schemaRegistry;
  const hasCatalog = componentName in componentCatalog;
  const catalogEntry = componentCatalog[componentName];

  return {
    name: componentName,
    registered: isRegistered,
    hasSchema,
    hasCatalog,
    description: catalogEntry?.description,
    props: catalogEntry?.props,
    examples: catalogEntry?.examples?.length || 0,
  };
}

/**
 * Test schema validation for a component
 */
export function testSchemaValidation(componentName: string, props: any): boolean {
  const schema = schemaRegistry[componentName];

  if (!schema) {
    console.error(`No schema found for ${componentName}`);
    return false;
  }

  try {
    schema.parse(props);
    console.log(`✅ ${componentName} props validation passed`);
    return true;
  } catch (error) {
    console.error(`❌ ${componentName} props validation failed:`, error);
    return false;
  }
}

// Run validation if executed directly
if (require.main === module) {
  printValidationReport();
}
