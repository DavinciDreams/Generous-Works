/**
 * Tests for export utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportAsJSON, exportAsHTML } from './export';
import type { Generation } from './neon-storage';

// Mock document methods
const mockCreateElement = vi.fn();
const mockAppendChild = vi.fn();
const mockClick = vi.fn();
const mockRemoveChild = vi.fn();
const mockRevokeObjectURL = vi.fn();
const mockCreateObjectURL = vi.fn();

const mockElement = {
  href: '',
  download: '',
  click: mockClick,
};

beforeEach(() => {
  // Setup document mocks
  global.document = {
    createElement: mockCreateElement,
    body: {
      appendChild: mockAppendChild,
      removeChild: mockRemoveChild,
    },
  } as any;

  global.URL = {
    createObjectURL: mockCreateObjectURL,
    revokeObjectURL: mockRevokeObjectURL,
  } as any;

  mockCreateElement.mockReturnValue(mockElement);
  mockCreateObjectURL.mockReturnValue('blob:url');
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('exportAsJSON', () => {
  const mockGeneration: Generation = {
    id: 'test-id',
    user_id: 'user-123',
    name: 'Test Generation',
    description: 'A test generation',
    messages: [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ],
    ui_components: {
      'comp-1': { type: 'Button', props: { label: 'Click me' } },
    },
    component_layouts: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    version: 1,
  };

  it('should export generation as JSON file', async () => {
    await exportAsJSON(mockGeneration);

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockElement.download).toContain('Test-Generation');
    expect(mockElement.download).toContain('.json');
    expect(mockAppendChild).toHaveBeenCalledWith(mockElement);
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalledWith(mockElement);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:url');
  });

  it('should use custom filename if provided', async () => {
    await exportAsJSON(mockGeneration, 'custom-name.json');

    expect(mockElement.download).toBe('custom-name.json');
  });

  it('should generate valid JSON structure', async () => {
    await exportAsJSON(mockGeneration);

    const blobCall = mockCreateObjectURL.mock.calls[0][0];
    const text = await blobCall.text();
    const data = JSON.parse(text);

    expect(data.version).toBe('1.0');
    expect(data.generation.id).toBe('test-id');
    expect(data.generation.name).toBe('Test Generation');
    expect(data.generation.messages).toHaveLength(2);
    expect(data.exportedAt).toBeDefined();
  });

  it('should handle generation with spaces in name', async () => {
    const genWithSpaces = { ...mockGeneration, name: 'My Test Generation' };
    await exportAsJSON(genWithSpaces);

    expect(mockElement.download).toContain('My-Test-Generation');
    expect(mockElement.download).not.toContain(' ');
  });

  it('should throw error if export fails', async () => {
    mockCreateObjectURL.mockImplementation(() => {
      throw new Error('Failed to create blob');
    });

    await expect(exportAsJSON(mockGeneration)).rejects.toThrow('Failed to export generation as JSON');
  });
});

describe('exportAsHTML', () => {
  const mockGeneration: Generation = {
    id: 'test-id',
    user_id: 'user-123',
    name: 'Test Generation',
    description: 'A test generation',
    messages: [
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
    ],
    ui_components: {
      'comp-1': { type: 'Button', props: { label: 'Click me' } },
      'comp-2': { type: 'Card', props: { title: 'Test Card' } },
    },
    component_layouts: null,
    created_at: new Date('2024-01-01'),
    updated_at: new Date('2024-01-01'),
    version: 1,
  };

  it('should export generation as HTML file', async () => {
    await exportAsHTML(mockGeneration);

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockElement.download).toContain('Test-Generation');
    expect(mockElement.download).toContain('.html');
    expect(mockAppendChild).toHaveBeenCalledWith(mockElement);
    expect(mockClick).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalledWith(mockElement);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:url');
  });

  it('should use custom filename if provided', async () => {
    await exportAsHTML(mockGeneration, 'custom-name.html');

    expect(mockElement.download).toBe('custom-name.html');
  });

  it('should generate valid HTML structure', async () => {
    await exportAsHTML(mockGeneration);

    const blobCall = mockCreateObjectURL.mock.calls[0][0];
    const html = await blobCall.text();

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('<head>');
    expect(html).toContain('<body>');
    expect(html).toContain('Test Generation');
    expect(html).toContain('A test generation');
    expect(html).toContain('Hello');
    expect(html).toContain('Hi there!');
  });

  it('should include messages in HTML', async () => {
    await exportAsHTML(mockGeneration);

    const blobCall = mockCreateObjectURL.mock.calls[0][0];
    const html = await blobCall.text();

    expect(html).toContain('message-user');
    expect(html).toContain('message-assistant');
    expect(html).toContain('User');
    expect(html).toContain('Assistant');
  });

  it('should include components summary in HTML', async () => {
    await exportAsHTML(mockGeneration);

    const blobCall = mockCreateObjectURL.mock.calls[0][0];
    const html = await blobCall.text();

    expect(html).toContain('UI Components (2)');
    expect(html).toContain('Button');
    expect(html).toContain('Card');
  });

  it('should escape HTML special characters in content', async () => {
    const genWithSpecialChars = {
      ...mockGeneration,
      name: 'Test <script>alert("xss")</script>',
      messages: [{ role: 'user', content: '<div>test</div>' }],
    };

    await exportAsHTML(genWithSpecialChars);

    const blobCall = mockCreateObjectURL.mock.calls[0][0];
    const html = await blobCall.text();

    expect(html).not.toContain('<script>alert("xss")</script>');
    expect(html).toContain('<script>');
  });

  it('should handle generation without description', async () => {
    const genWithoutDesc = { ...mockGeneration, description: null };
    await exportAsHTML(genWithoutDesc);

    const blobCall = mockCreateObjectURL.mock.calls[0][0];
    const html = await blobCall.text();

    expect(html).toContain('Test Generation');
    expect(html).toContain('Exported from Generous');
  });

  it('should throw error if export fails', async () => {
    mockCreateObjectURL.mockImplementation(() => {
      throw new Error('Failed to create blob');
    });

    await expect(exportAsHTML(mockGeneration)).rejects.toThrow('Failed to export generation as HTML');
  });
});
