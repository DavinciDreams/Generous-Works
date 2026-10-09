/**
 * Tests for ExportButton component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportButton } from '../export-button';
import { exportAsJSON, exportAsHTML } from '@/lib/generations/export';
import type { Generation } from '@/lib/generations/neon-storage';

// Mock export functions
vi.mock('@/lib/generations/export', () => ({
  exportAsJSON: vi.fn(),
  exportAsHTML: vi.fn(),
}));

describe('ExportButton', () => {
  const mockGeneration: Generation = {
    id: 'gen-123',
    user_id: 'user-123',
    name: 'Test Generation',
    description: 'A test generation',
    messages: [{ role: 'user', content: 'Hello' }],
    ui_components: { 'comp-1': { type: 'Button', props: {} } },
    component_layouts: null,
    created_at: new Date(),
    updated_at: new Date(),
    version: 1,
  };

  const mockOnExportStart = vi.fn();
  const mockOnExportComplete = vi.fn();
  const mockOnError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render export button', () => {
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument();
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <ExportButton
        generation={mockGeneration}
        disabled={true}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    expect(button).toBeDisabled();
  });

  it('should open dropdown menu when clicked', async () => {
    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    expect(screen.getByText(/Export as JSON/i)).toBeInTheDocument();
    expect(screen.getByText(/Export as HTML/i)).toBeInTheDocument();
  });

  it('should call exportAsJSON when JSON option is clicked', async () => {
    (exportAsJSON as any).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const jsonOption = screen.getByText(/Export as JSON/i);
    await user.click(jsonOption);

    expect(exportAsJSON).toHaveBeenCalledWith(mockGeneration);
  });

  it('should call exportAsHTML when HTML option is clicked', async () => {
    (exportAsHTML as any).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const htmlOption = screen.getByText(/Export as HTML/i);
    await user.click(htmlOption);

    expect(exportAsHTML).toHaveBeenCalledWith(mockGeneration);
  });

  it('should call onExportStart when export begins', async () => {
    (exportAsJSON as any).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const jsonOption = screen.getByText(/Export as JSON/i);
    await user.click(jsonOption);

    expect(mockOnExportStart).toHaveBeenCalled();
  });

  it('should call onExportComplete with format on successful export', async () => {
    (exportAsJSON as any).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const jsonOption = screen.getByText(/Export as JSON/i);
    await user.click(jsonOption);

    await waitFor(() => {
      expect(mockOnExportComplete).toHaveBeenCalledWith('json');
    });
  });

  it('should call onExportComplete with html format on successful HTML export', async () => {
    (exportAsHTML as any).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const htmlOption = screen.getByText(/Export as HTML/i);
    await user.click(htmlOption);

    await waitFor(() => {
      expect(mockOnExportComplete).toHaveBeenCalledWith('html');
    });
  });

  it('should display error message on export failure', async () => {
    (exportAsJSON as any).mockRejectedValue(new Error('Export failed'));

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const jsonOption = screen.getByText(/Export as JSON/i);
    await user.click(jsonOption);

    await waitFor(() => {
      expect(screen.getByText(/Export failed/)).toBeInTheDocument();
    });
  });

  it('should call onError callback on export failure', async () => {
    (exportAsJSON as any).mockRejectedValue(new Error('Export failed'));

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const jsonOption = screen.getByText(/Export as JSON/i);
    await user.click(jsonOption);

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Export failed');
    });
  });

  it('should show loading state while exporting', async () => {
    (exportAsJSON as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const jsonOption = screen.getByText(/Export as JSON/i);
    await user.click(jsonOption);

    await waitFor(() => {
      expect(screen.getByText(/Exporting.../)).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.queryByText(/Exporting.../)).not.toBeInTheDocument();
    }, { timeout: 200 });
  });

  it('should disable button while exporting', async () => {
    (exportAsJSON as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
        onExportStart={mockOnExportStart}
        onExportComplete={mockOnExportComplete}
        onError={mockOnError}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const jsonOption = screen.getByText(/Export as JSON/i);
    await user.click(jsonOption);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    }, { timeout: 200 });
  });

  it('should work without optional callbacks', async () => {
    (exportAsJSON as any).mockResolvedValue(undefined);

    const user = userEvent.setup();
    render(
      <ExportButton
        generation={mockGeneration}
      />
    );

    const button = screen.getByRole('button', { name: /Export/i });
    await user.click(button);

    const jsonOption = screen.getByText(/Export as JSON/i);
    await user.click(jsonOption);

    expect(exportAsJSON).toHaveBeenCalledWith(mockGeneration);
  });
});
