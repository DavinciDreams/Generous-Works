/**
 * Tests for DeleteDialog component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DeleteDialog } from '../delete-dialog';

describe('DeleteDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnDeleteSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  it('should render dialog when isOpen is true', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    expect(screen.getByText('Delete Generation')).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
    expect(screen.getByText('Test Generation')).toBeInTheDocument();
  });

  it('should not render dialog when isOpen is false', () => {
    render(
      <DeleteDialog
        isOpen={false}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    expect(screen.queryByText('Delete Generation')).not.toBeInTheDocument();
  });

  it('should display generation name and ID', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    expect(screen.getByText('Test Generation')).toBeInTheDocument();
    expect(screen.getByText('ID: gen-123')).toBeInTheDocument();
  });

  it('should display warning message', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    expect(screen.getByText(/This action is permanent/)).toBeInTheDocument();
  });

  it('should call API with correct method when delete is clicked', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Deleted successfully' }),
    });

    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete Generation/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generations/gen-123', {
        method: 'DELETE',
      });
    });
  });

  it('should call onDeleteSuccess and onClose on successful delete', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Deleted successfully' }),
    });

    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete Generation/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOnDeleteSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should display error message on API failure', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to delete' }),
    });

    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete Generation/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to delete/)).toBeInTheDocument();
    });
  });

  it('should disable delete button while deleting', async () => {
    (global.fetch as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true }),
      }), 100))
    );

    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete Generation/i });
    fireEvent.click(deleteButton);

    // Button should be disabled while deleting
    expect(deleteButton).toBeDisabled();
    expect(screen.getByText(/Deleting.../)).toBeInTheDocument();

    await waitFor(() => {
      expect(deleteButton).not.toBeDisabled();
    }, { timeout: 200 });
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should have destructive variant for delete button', () => {
    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete Generation/i });
    expect(deleteButton).toHaveClass('bg-destructive');
  });

  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    render(
      <DeleteDialog
        isOpen={true}
        onClose={mockOnClose}
        generationId="gen-123"
        generationName="Test Generation"
        onDeleteSuccess={mockOnDeleteSuccess}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /Delete Generation/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText(/An unexpected error occurred/)).toBeInTheDocument();
    });
  });
});
