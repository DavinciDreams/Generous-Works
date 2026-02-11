import { z } from 'zod';

/**
 * Supported programming languages for syntax highlighting
 */
export const CodeLanguageSchema = z.enum([
  'javascript',
  'typescript',
  'python',
  'java',
  'csharp',
  'cpp',
  'c',
  'go',
  'rust',
  'php',
  'ruby',
  'html',
  'css',
  'scss',
  'json',
  'xml',
  'yaml',
  'markdown',
  'sql',
  'bash',
  'shell',
  'plaintext',
]);

export type CodeLanguage = z.infer<typeof CodeLanguageSchema>;

/**
 * Theme options for code editor
 */
export const CodeEditorThemeSchema = z.enum([
  'light',
  'dark',
  'github-light',
  'github-dark',
  'vscode-light',
  'vscode-dark',
  'sublime',
  'material',
  'dracula',
  'nord',
]);

export type CodeEditorTheme = z.infer<typeof CodeEditorThemeSchema>;

/**
 * Code editor data structure
 */
export const CodeEditorDataSchema = z.object({
  code: z.string(), // The code content
  language: CodeLanguageSchema.optional(), // Programming language (default: 'plaintext')
  filename: z.string().optional(), // Optional filename for context
  readOnly: z.boolean().optional(), // Whether the editor is read-only (default: false)
});

export type CodeEditorData = z.infer<typeof CodeEditorDataSchema>;

/**
 * Code editor display options
 */
export const CodeEditorOptionsSchema = z.object({
  height: z.union([z.number(), z.string()]).optional(), // Editor height
  width: z.union([z.number(), z.string()]).optional(), // Editor width
  theme: CodeEditorThemeSchema.optional(), // Color theme
  lineNumbers: z.boolean().optional(), // Show line numbers (default: true)
  lineWrapping: z.boolean().optional(), // Enable line wrapping (default: false)
  highlightActiveLine: z.boolean().optional(), // Highlight active line (default: true)
  tabSize: z.number().optional(), // Tab size in spaces (default: 2)
  indentWithTab: z.boolean().optional(), // Use tab character for indentation (default: false)
  editable: z.boolean().optional(), // Allow editing (default: true)
  placeholder: z.string().optional(), // Placeholder text when empty
}).optional();

export type CodeEditorOptions = z.infer<typeof CodeEditorOptionsSchema>;

/**
 * Complete CodeEditor props schema
 * Note: onChange callback is not included in schema (it's a client-side callback)
 */
export const CodeEditorPropsSchema = z.object({
  data: CodeEditorDataSchema,
  options: CodeEditorOptionsSchema,
});
