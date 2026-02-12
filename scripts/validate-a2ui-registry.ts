#!/usr/bin/env tsx
/**
 * Validation script for A2UI component registry
 *
 * Run with: npx tsx scripts/validate-a2ui-registry.ts
 */

import { printValidationReport, validateRegistry, getComponentInfo } from '../lib/a2ui/validate-registry';

console.log('🔍 A2UI Component Registry Validation\n');

// Run validation
printValidationReport();

// Get summary
const summary = validateRegistry();

// Exit with error code if issues found
if (summary.issues.length > 0) {
  console.error(`\n❌ Validation failed with ${summary.issues.length} issue(s)\n`);
  process.exit(1);
} else {
  console.log('\n✅ All validations passed!\n');
  process.exit(0);
}
