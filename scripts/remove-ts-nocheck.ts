#!/usr/bin/env tsx
/**
 * Remove @ts-nocheck comments and fix remaining errors
 */

import { readFileSync, writeFileSync } from 'fs';

const filesToFix = [
  'lib/a2ui/adapters/disclosure.tsx',
  'lib/a2ui/adapters/feedback.tsx',
  'lib/a2ui/adapters/form-advanced.tsx',
  'lib/a2ui/adapters/navigation.tsx',
];

function removeTsNoCheck(content: string): string {
  // Remove @ts-nocheck comment
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '// @ts-nocheck') {
      lines.splice(i, 1);
      break;
    }
  }
  
  return lines.join('\n');
}

function addTypeAssertions(content: string): string {
  // Fix unknown types by adding 'as any' type assertions
  const fixes: [RegExp, string][] = [
    // Fix trigger: a2ui.trigger -> (a2ui.trigger as React.ReactNode)
    [/trigger: a2ui\.trigger,/g, 'trigger: (a2ui.trigger as React.ReactNode),'],
    // Fix content: a2ui.content -> (a2ui.content as React.ReactNode)
    [/content: a2ui\.content,/g, 'content: (a2ui.content as React.ReactNode),'],
    // Fix side: a2ui.side -> (a2ui.side as any)
    [/side: a2ui\.side,/g, 'side: (a2ui.side as any),'],
    // Fix align: a2ui.align -> (a2ui.align as any)
    [/align: a2ui\.align,/g, 'align: (a2ui.align as any),'],
    // Fix defaultOpen: a2ui.defaultOpen -> (a2ui.defaultOpen as any)
    [/defaultOpen: a2ui\.defaultOpen,/g, 'defaultOpen: (a2ui.defaultOpen as any),'],
    // Fix items.map -> (a2ui.items as any[]).map
    [/items\.map\(/g, '(a2ui.items as any[]).map('],
    // Fix links.map -> (a2ui.links as any[]).map
    [/links\.map\(/g, '(a2ui.links as any[]).map('],
    // Fix item.title -> (item as any).title
    [/item\.title/g, '(item as any).title'],
    // Fix item.label -> (item as any).label
    [/item\.label/g, '(item as any).label'],
    // Fix item.value -> (item as any).value
    [/item\.value/g, '(item as any).value'],
    // Fix link.label -> (link as any).label
    [/link\.label/g, '(link as any).label'],
    // Fix link.text -> (link as any).text
    [/link\.text/g, '(link as any).text'],
    // Fix link.href -> (link as any).href
    [/link\.href/g, '(link as any).href'],
    // Fix link.url -> (link as any).url
    [/link\.url/g, '(link as any).url'],
    // Fix link.length -> (link as any).length
    [/link\.length/g, '(link as any).length'],
    // Fix key: String(item.value) -> String((item as any).value)
    [/key: String\(item\.value\),/g, 'key: String((item as any).value),'],
    // Fix value: String(item.value) -> String((item as any).value)
    [/value: String\(item\.value\),/g, 'value: String((item as any).value),'],
    // Fix key: String(link.label) -> String((link as any).label)
    [/key: String\(link\.label\),/g, 'key: String((link as any).label),'],
    // Fix label: a2ui.label -> (a2ui.label as any)
    [/label: a2ui\.label,/g, 'label: (a2ui.label as any),'],
    // Fix value: a2ui.value -> (a2ui.value as any)
    [/value: a2ui\.value,/g, 'value: (a2ui.value as any),'],
    // Fix children: a2ui.children -> (a2ui.children as any)
    [/children: a2ui\.children,/g, 'children: (a2ui.children as any),'],
    // Fix title: a2ui.title -> (a2ui.title as any)
    [/title: a2ui\.title,/g, 'title: (a2ui.title as any),'],
    // Fix description: a2ui.description -> (a2ui.description as any)
    [/description: a2ui\.description,/g, 'description: (a2ui.description as any),'],
    // Fix field.name -> (field as any).name
    [/field\.name/g, '(field as any).name'],
    // Fix createActionHandler(a2ui.action -> createActionHandler(a2ui.action as any
    [/createActionHandler\(a2ui\.action,/g, 'createActionHandler(a2ui.action as any'],
  ];
  
  let fixedContent = content;
  for (const [pattern, replacement] of fixes) {
    fixedContent = fixedContent.replace(pattern, replacement);
  }
  
  return fixedContent;
}

// Main execution
function main() {
  let fixedCount = 0;

  for (const file of filesToFix) {
    try {
      const content = readFileSync(file, 'utf-8');
      let fixedContent = removeTsNoCheck(content);
      fixedContent = addTypeAssertions(fixedContent);
      
      if (content !== fixedContent) {
        writeFileSync(file, fixedContent, 'utf-8');
        console.log(`✓ Fixed: ${file}`);
        fixedCount++;
      } else {
        console.log(`- No changes: ${file}`);
      }
    } catch (error) {
      console.error(`✗ Error fixing ${file}:`, error);
    }
  }

  console.log(`\nFixed ${fixedCount} file(s)`);
}

main();
