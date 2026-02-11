"use client";

import {
  CodeEditor,
  CodeEditorHeader,
  CodeEditorTitle,
  CodeEditorActions,
  CodeEditorCopyButton,
  CodeEditorDownloadButton,
  CodeEditorFullscreenButton,
  CodeEditorContent,
  type CodeEditorData,
} from "@/components/ai-elements/codeeditor";

// JavaScript example
const javascriptCode: CodeEditorData = {
  code: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Example usage
console.log(fibonacci(10)); // 55

// More efficient iterative version
function fibonacciIterative(n) {
  if (n <= 1) return n;

  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }
  return curr;
}

console.log(fibonacciIterative(10)); // 55`,
  language: "javascript",
  filename: "fibonacci.js",
};

// Python example
const pythonCode: CodeEditorData = {
  code: `import numpy as np
import matplotlib.pyplot as plt

def mandelbrot(c, max_iter=100):
    """Calculate whether point c is in the Mandelbrot set"""
    z = 0
    for n in range(max_iter):
        if abs(z) > 2:
            return n
        z = z*z + c
    return max_iter

# Generate mandelbrot set
width, height = 800, 600
xmin, xmax, ymin, ymax = -2.5, 1.0, -1.25, 1.25

x = np.linspace(xmin, xmax, width)
y = np.linspace(ymin, ymax, height)
mandelbrot_set = np.zeros((height, width))

for i in range(height):
    for j in range(width):
        c = x[j] + 1j * y[i]
        mandelbrot_set[i, j] = mandelbrot(c)

# Plot
plt.imshow(mandelbrot_set, cmap='hot', extent=[xmin, xmax, ymin, ymax])
plt.title('Mandelbrot Set')
plt.xlabel('Real axis')
plt.ylabel('Imaginary axis')
plt.colorbar()
plt.show()`,
  language: "python",
  filename: "mandelbrot.py",
};

// TypeScript example
const typescriptCode: CodeEditorData = {
  code: `interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

class UserManager {
  private users: Map<number, User> = new Map();

  addUser(user: User): void {
    this.users.set(user.id, user);
  }

  getUser(id: number): User | undefined {
    return this.users.get(id);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  getUsersByRole(role: User['role']): User[] {
    return this.getAllUsers().filter(user => user.role === role);
  }

  removeUser(id: number): boolean {
    return this.users.delete(id);
  }
}

// Example usage
const manager = new UserManager();

manager.addUser({
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin'
});

manager.addUser({
  id: 2,
  name: 'Bob',
  email: 'bob@example.com',
  role: 'user'
});

console.log('All users:', manager.getAllUsers());
console.log('Admins:', manager.getUsersByRole('admin'));`,
  language: "typescript",
  filename: "user-manager.ts",
};

// HTML example
const htmlCode: CodeEditorData = {
  code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Landing Page</title>
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
    }

    .hero {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 100px 20px;
      text-align: center;
    }

    .hero h1 {
      font-size: 3rem;
      margin-bottom: 20px;
    }

    .cta-button {
      background: white;
      color: #667eea;
      padding: 15px 40px;
      border: none;
      border-radius: 30px;
      font-size: 1.1rem;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .cta-button:hover {
      transform: scale(1.05);
    }
  </style>
</head>
<body>
  <section class="hero">
    <h1>Welcome to the Future</h1>
    <p>Build amazing experiences with modern web technology</p>
    <button class="cta-button">Get Started</button>
  </section>
</body>
</html>`,
  language: "html",
  filename: "landing.html",
};

// JSON example
const jsonCode: CodeEditorData = {
  code: `{
  "name": "@myapp/core",
  "version": "1.0.0",
  "description": "Core functionality for MyApp",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "keywords": [
    "typescript",
    "library",
    "core"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.40.0",
    "jest": "^29.5.0",
    "prettier": "^2.8.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "zod": "^3.21.0"
  }
}`,
  language: "json",
  filename: "package.json",
  readOnly: true,
};

// Markdown example
const markdownCode: CodeEditorData = {
  code: `# CodeEditor Component

A powerful, composable code editor built with CodeMirror 6.

## Features

- 🎨 **Multiple Themes** - Light, dark, and custom themes
- 🌍 **Multi-Language** - Support for 20+ programming languages
- 📋 **Copy & Download** - Built-in copy and download functionality
- 🔍 **Syntax Highlighting** - Powered by CodeMirror 6
- ⌨️ **Keyboard Shortcuts** - Full keyboard navigation support
- 📱 **Responsive** - Works on all screen sizes
- 🎯 **Composable** - Flexible component composition

## Installation

\`\`\`bash
npm install @uiw/react-codemirror
\`\`\`

## Usage

\`\`\`tsx
import { CodeEditor } from '@/components/ai-elements/codeeditor';

<CodeEditor
  data={{
    code: 'console.log("Hello, world!");',
    language: 'javascript',
    filename: 'hello.js'
  }}
  options={{
    height: 400,
    theme: 'dark',
    lineNumbers: true
  }}
/>
\`\`\`

## Supported Languages

- JavaScript/TypeScript
- Python
- HTML/CSS
- JSON
- Markdown
- And many more...

## License

MIT © 2026`,
  language: "markdown",
  filename: "README.md",
};

export default function CodeEditorTestPage() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Code Editor Component Test</h1>
        <p className="text-muted-foreground mt-2">
          Syntax-highlighted code editing with CodeMirror 6
        </p>
      </div>

      {/* JavaScript Example */}
      <CodeEditor data={javascriptCode} options={{ height: 450 }}>
        <CodeEditorHeader>
          <CodeEditorTitle />
          <CodeEditorActions>
            <CodeEditorCopyButton />
            <CodeEditorDownloadButton />
            <CodeEditorFullscreenButton />
          </CodeEditorActions>
        </CodeEditorHeader>
        <CodeEditorContent />
      </CodeEditor>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Python Example */}
        <CodeEditor
          data={pythonCode}
          options={{
            height: 500,
            theme: "dark",
            lineNumbers: true,
          }}
        >
          <CodeEditorHeader>
            <CodeEditorTitle />
            <CodeEditorActions>
              <CodeEditorCopyButton />
              <CodeEditorDownloadButton />
              <CodeEditorFullscreenButton />
            </CodeEditorActions>
          </CodeEditorHeader>
          <CodeEditorContent />
        </CodeEditor>

        {/* TypeScript Example */}
        <CodeEditor
          data={typescriptCode}
          options={{
            height: 500,
            theme: "dark",
            tabSize: 2,
          }}
        >
          <CodeEditorHeader>
            <CodeEditorTitle />
            <CodeEditorActions>
              <CodeEditorCopyButton />
              <CodeEditorDownloadButton />
              <CodeEditorFullscreenButton />
            </CodeEditorActions>
          </CodeEditorHeader>
          <CodeEditorContent />
        </CodeEditor>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* HTML Example */}
        <CodeEditor
          data={htmlCode}
          options={{
            height: 450,
            theme: "light",
            lineWrapping: true,
          }}
        >
          <CodeEditorHeader>
            <CodeEditorTitle />
            <CodeEditorActions>
              <CodeEditorCopyButton />
              <CodeEditorDownloadButton />
              <CodeEditorFullscreenButton />
            </CodeEditorActions>
          </CodeEditorHeader>
          <CodeEditorContent />
        </CodeEditor>

        {/* JSON Example (Read-only) */}
        <CodeEditor
          data={jsonCode}
          options={{
            height: 450,
            theme: "light",
          }}
        >
          <CodeEditorHeader>
            <CodeEditorTitle>
              <span className="text-sm text-muted-foreground ml-2">(Read-only)</span>
            </CodeEditorTitle>
            <CodeEditorActions>
              <CodeEditorCopyButton />
              <CodeEditorDownloadButton />
              <CodeEditorFullscreenButton />
            </CodeEditorActions>
          </CodeEditorHeader>
          <CodeEditorContent />
        </CodeEditor>
      </div>

      {/* Markdown Example */}
      <CodeEditor
        data={markdownCode}
        options={{
          height: 600,
          theme: "github-light",
          lineNumbers: true,
        }}
      >
        <CodeEditorHeader>
          <CodeEditorTitle />
          <CodeEditorActions>
            <CodeEditorCopyButton />
            <CodeEditorDownloadButton />
            <CodeEditorFullscreenButton />
          </CodeEditorActions>
        </CodeEditorHeader>
        <CodeEditorContent />
      </CodeEditor>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">CodeEditor Features:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>Syntax Highlighting:</strong> 20+ programming languages</li>
          <li><strong>Copy:</strong> Copy code to clipboard with one click</li>
          <li><strong>Download:</strong> Export code as file</li>
          <li><strong>Themes:</strong> Light and dark themes available</li>
          <li><strong>Line Numbers:</strong> Toggle line numbers</li>
          <li><strong>Line Wrapping:</strong> Enable/disable line wrapping</li>
          <li><strong>Read-only Mode:</strong> Display code without editing</li>
          <li><strong>Fullscreen:</strong> View code in fullscreen mode</li>
          <li><strong>Autocomplete:</strong> Built-in code completion</li>
          <li><strong>Bracket Matching:</strong> Automatic bracket pairing</li>
        </ul>
        <p className="text-sm text-muted-foreground mt-4">
          Perfect for code snippets, documentation, and interactive coding examples
        </p>
        <p className="text-sm text-muted-foreground">
          Powered by <strong>@uiw/react-codemirror</strong> and <strong>CodeMirror 6</strong>
        </p>
      </div>
    </div>
  );
}
