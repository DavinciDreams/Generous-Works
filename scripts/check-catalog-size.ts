import { getCatalogPrompt } from '../lib/a2ui/catalog';

const prompt = getCatalogPrompt();
const tokens = Math.floor(prompt.length / 4);

console.log('Current A2UI Catalog Size:');
console.log('━'.repeat(50));
console.log(`Characters: ${prompt.length.toLocaleString()}`);
console.log(`Estimated tokens: ${tokens.toLocaleString()}`);
console.log(`Tokens per component: ${(tokens / 114).toFixed(0)}`);
console.log('━'.repeat(50));

// Show first 500 chars as sample
console.log('\nSample (first 500 chars):');
console.log(prompt.substring(0, 500) + '...\n');
