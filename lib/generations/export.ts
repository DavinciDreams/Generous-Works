/**
 * Export utilities for generations
 * Provides functionality to export generations as JSON or HTML files
 */

import type { Generation } from './neon-storage';

/**
 * Export generation data as JSON file
 * @param generation - The generation to export
 * @param filename - Optional custom filename (defaults to generation name)
 */
export async function exportAsJSON(
  generation: Generation,
  filename?: string
): Promise<void> {
  try {
    // Create export data structure
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      generation: {
        id: generation.id,
        name: generation.name,
        description: generation.description,
        messages: generation.messages,
        uiComponents: generation.ui_components,
        componentLayouts: generation.component_layouts,
        createdAt: generation.created_at,
        updatedAt: generation.updated_at,
      },
    };

    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${generation.name.replace(/\s+/g, '-')}-${generation.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export as JSON:', error);
    throw new Error('Failed to export generation as JSON');
  }
}

/**
 * Export generation as HTML file
 * @param generation - The generation to export
 * @param filename - Optional custom filename (defaults to generation name)
 */
export async function exportAsHTML(
  generation: Generation,
  filename?: string
): Promise<void> {
  try {
    // Create HTML content
    const htmlContent = generateHTMLContent(generation);

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `${generation.name.replace(/\s+/g, '-')}-${generation.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export as HTML:', error);
    throw new Error('Failed to export generation as HTML');
  }
}

/**
 * Generate HTML content from generation data
 * @param generation - The generation to convert to HTML
 * @returns HTML string
 */
function generateHTMLContent(generation: Generation): string {
  const title = generation.name;
  const description = generation.description || '';
  const createdAt = new Date(generation.created_at).toLocaleString();
  const updatedAt = new Date(generation.updated_at).toLocaleString();

  // Generate messages HTML
  const messagesHTML = generation.messages.map((msg: any) => {
    const role = msg.role || 'unknown';
    const content = msg.content || '';
    return `
      <div class="message message-${role}">
        <div class="message-role">${role.charAt(0).toUpperCase() + role.slice(1)}</div>
        <div class="message-content">${escapeHtml(content)}</div>
      </div>
    `;
  }).join('\n');

  // Generate UI components summary
  const componentCount = Object.keys(generation.ui_components).length;
  const componentsHTML = `
    <div class="components-summary">
      <h3>UI Components (${componentCount})</h3>
      ${componentCount > 0 ? `
        <ul>
          ${Object.entries(generation.ui_components).map(([id, comp]: [string, any]) => `
            <li><strong>${comp.type || 'Unknown'}</strong> - ${id}</li>
          `).join('')}
        </ul>
      ` : '<p>No components</p>'}
    </div>
  `;

  // Generate full HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} - Generation Export</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #f9fafb;
    }
    header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e5e7eb;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #111827;
    }
    .meta {
      color: #6b7280;
      font-size: 0.875rem;
    }
    .description {
      margin: 1rem 0;
      padding: 1rem;
      background: #f3f4f6;
      border-radius: 0.5rem;
    }
    .messages {
      margin: 2rem 0;
    }
    .messages h2 {
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }
    .message {
      margin: 1rem 0;
      padding: 1rem;
      border-radius: 0.5rem;
      border-left: 4px solid #d1d5db;
    }
    .message-user {
      background: #dbeafe;
      border-left-color: #3b82f6;
    }
    .message-assistant {
      background: #f0fdf4;
      border-left-color: #22c55e;
    }
    .message-system {
      background: #fef3c7;
      border-left-color: #f59e0b;
    }
    .message-role {
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
      color: #4b5563;
    }
    .message-content {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .components-summary {
      margin: 2rem 0;
      padding: 1rem;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
    }
    .components-summary h3 {
      margin-bottom: 1rem;
      font-size: 1.25rem;
    }
    .components-summary ul {
      list-style: none;
      padding-left: 0;
    }
    .components-summary li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .components-summary li:last-child {
      border-bottom: none;
    }
    footer {
      margin-top: 3rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    <div class="meta">
      <div>Created: ${escapeHtml(createdAt)}</div>
      <div>Last Updated: ${escapeHtml(updatedAt)}</div>
      <div>ID: ${escapeHtml(generation.id)}</div>
    </div>
    ${description ? `<div class="description">${escapeHtml(description)}</div>` : ''}
  </header>

  <main>
    <section class="messages">
      <h2>Conversation</h2>
      ${messagesHTML}
    </section>

    ${componentsHTML}
  </main>

  <footer>
    <p>Exported from Generous on ${new Date().toLocaleString()}</p>
  </footer>
</body>
</html>`;
}

/**
 * Escape HTML special characters to prevent XSS
 * @param text - Text to escape
 * @returns Escaped text
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
