#!/usr/bin/env tsx
/**
 * Fix remaining TypeScript errors
 * Focuses on isArray, arithmetic operations, and property access
 */

import { readFileSync, writeFileSync } from 'fs';

const fixes: Record<string, (content: string) => string> = {
  'lib/a2ui/adapters/form-advanced.tsx': (content) => {
    // Fix isArray -> Array.isArray
    content = content.replace(/isArray\(/g, 'Array.isArray(');
    // Fix arithmetic operations
    content = content.replace(/index - 1/g, '(index as number) - 1');
    content = content.replace(/index <= 5/g, '(index as number) <= 5');
    // Fix property access
    content = content.replace(/field\.name/g, '(field as any).name');
    // Fix createActionHandler call
    content = content.replace(/createActionHandler\(a2ui\.action,/g, 'createActionHandler(a2ui.action as any,');
    // Fix type assertions
    content = content.replace(/label: a2ui\.label,/g, 'label: (a2ui.label as string),');
    content = content.replace(/required: a2ui\.required,/g, 'required: (a2ui.required as boolean),');
    content = content.replace(/placeholder: a2ui\.placeholder,/g, 'placeholder: (a2ui.placeholder as string),');
    content = content.replace(/description: a2ui\.description,/g, 'description: (a2ui.description as React.ReactNode),');
    content = content.replace(/selected: a2ui\.selected,/g, 'selected: (a2ui.selected as string | undefined),');
    content = content.replace(/multiple: a2ui\.multiple,/g, 'multiple: (a2ui.multiple as boolean),');
    // Fix createActionHandler
    content = content.replace(/createActionHandler\(a2ui\.action,/g, 'createActionHandler(a2ui.action as any,');
    // Fix index access
    content = content.replace(/optionsMap\[value\]/g, '(optionsMap as Record<string, any>)[value]');
    content = content.replace(/optionsMap\[selected\]/g, '(optionsMap as Record<string, any>)[selected]');
    return content;
  },
  
  'lib/a2ui/adapters/navigation.tsx': (content) => {
    // Fix isArray -> Array.isArray
    content = content.replace(/isArray\(/g, 'Array.isArray(');
    // Fix arithmetic operations
    content = content.replace(/index - 1/g, '(index as number) - 1');
    content = content.replace(/index <= 5/g, '(index as number) <= 5');
    content = content.replace(/index \+ 1/g, '(index as number) + 1');
    // Fix property access
    content = content.replace(/field\.name/g, '(field as any).name');
    // Fix items.map and items.length
    content = content.replace(/items\.map\(/g, '(a2ui.items as any[]).map(');
    content = content.replace(/items\.length/g, '(a2ui.items as any[]).length');
    // Fix links.map and links.length
    content = content.replace(/links\.map\(/g, '(a2ui.links as any[]).map(');
    content = content.replace(/links\.length/g, '(a2ui.links as any[]).length');
    // Fix item property access
    content = content.replace(/item\.title/g, '(item as any).title');
    content = content.replace(/item\.label/g, '(item as any).label');
    content = content.replace(/item\.value/g, '(item as any).value');
    // Fix link property access
    content = content.replace(/link\.label/g, '(link as any).label');
    content = content.replace(/link\.text/g, '(link as any).text');
    content = content.replace(/link\.href/g, '(link as any).href');
    content = content.replace(/link\.url/g, '(link as any).url');
    content = content.replace(/link\.length/g, '(link as any).length');
    // Fix key and value assignments
    content = content.replace(/key: String\(item\.value\),/g, 'key: String((item as any).value),');
    content = content.replace(/value: String\(item\.value\),/g, 'value: String((item as any).value),');
    content = content.replace(/key: String\(link\.label\),/g, 'key: String((link as any).label),');
    // Fix type assertions
    content = content.replace(/label: a2ui\.label,/g, 'label: (a2ui.label as string),');
    content = content.replace(/value: a2ui\.value,/g, 'value: (a2ui.value as string),');
    content = content.replace(/children: a2ui\.children,/g, 'children: (a2ui.children as React.ReactNode),');
    content = content.replace(/title: a2ui\.title,/g, 'title: (a2ui.title as React.ReactNode),');
    content = content.replace(/description: a2ui\.description,/g, 'description: (a2ui.description as React.ReactNode),');
    return content;
  },
  
  'lib/a2ui/adapters/disclosure.tsx': (content) => {
    // Fix property access
    content = content.replace(/item\.action/g, '(item as any).action');
    // Fix type assertions
    content = content.replace(/defaultOpen: a2ui\.defaultOpen,/g, 'defaultOpen: (a2ui.defaultOpen as boolean),');
    content = content.replace(/side: a2ui\.side,/g, 'side: (a2ui.side as "left" | "right" | "top" | "bottom"),');
    content = content.replace(/align: a2ui\.align,/g, 'align: (a2ui.align as "center" | "end" | "start"),');
    // Fix trigger and content
    content = content.replace(/trigger: a2ui\.trigger,/g, 'trigger: (a2ui.trigger as React.ReactNode),');
    content = content.replace(/content: a2ui\.content,/g, 'content: (a2ui.content as React.ReactNode),');
    return content;
  },
  
  'lib/a2ui/adapters/feedback.tsx': (content) => {
    // Fix index access
    content = content.replace(/variantMap\[variant\]/g, '(variantMap as Record<string, string>)[variant]');
    content = content.replace(/sizeClasses\[usageHint\]/g, 'sizeClasses[usageHint as string]');
    content = content.replace(/sizeClasses\[size\]/g, 'sizeClasses[size as string]');
    // Fix type assertions
    content = content.replace(/side: a2ui\.side,/g, 'side: (a2ui.side as "left" | "right" | "top" | "bottom"),');
    return content;
  },
};

// Main execution
function main() {
  const filesToFix = Object.keys(fixes);
  let fixedCount = 0;

  for (const file of filesToFix) {
    try {
      const content = readFileSync(file, 'utf-8');
      const fixedContent = fixes[file](content);
      
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
