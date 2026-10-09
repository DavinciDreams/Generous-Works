/**
 * Tests for SaveDialog component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SaveDialog } from '../save-dialog';
import { useGenerativeUIStore } from '@/lib/store';

// Mock the store
vi.mock('@/lib/store', () => ({
  useGenerativeUIStore: vi.fn(),
}));

describe('SaveDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnSaveSuccess = vi.fn();

  const mockStore = {
    messages: [
      { id: '1', role: 'user', content: 'Hello' },
      { id: '2', role: 'assistant', content: 'Hi there!' },
    ],
    uiComponents: {
      'comp-1': { type: 'Button', props: { label: 'Click me' } },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useGenerativeUIStore as any).mockReturnValue(mockStore);
    global.fetch = vi.fn();
  });

  it('should render dialog when isOpen is true', () => {
    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    expect(screen.getByText('Save Generation')).toBeInTheDocument();
    expect(screen.getByText(/Save your current generation/)).toBeInTheDocument();
  });

  it('should not render dialog when isOpen is false', () => {
    render(
      <SaveDialog
        isOpen={false}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    expect(screen.queryByText('Save Generation')).not.toBeInTheDocument();
  });

  it('should render name and description fields', () => {
    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    expect(screen.getByLabelText(/Name/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
  });

  it('should display message and component count', () => {
    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    expect(screen.getByText('2 messages')).toBeInTheDocument();
    expect(screen.getByText('1 UI components')).toBeInTheDocument();
  });

  it('should show validation error when name is empty', async () => {
    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    const saveButton = screen.getByRole('button', { name: /Save Generation/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a name/)).toBeInTheDocument();
    });
  });

  it('should call API with correct data when saving', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        generation: { id: 'gen-123', name: 'Test Generation' },
      }),
    });

    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    const nameInput = screen.getByLabelText(/Name/);
    const descriptionInput = screen.getByLabelText(/Description/);
    const saveButton = screen.getByRole('button', { name: /Save Generation/i });

    fireEvent.change(nameInput, { target: { value: 'Test Generation' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('Test Generation'),
      });
    });
  });

  it('should call onSaveSuccess and onClose on successful save', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        generation: { id: 'gen-123', name: 'Test Generation' },
      }),
    });

    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    const nameInput = screen.getByLabelText(/Name/);
    const saveButton = screen.getByRole('button', { name: /Save Generation/i });

    fireEvent.change(nameInput, { target: { value: 'Test Generation' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSaveSuccess).toHaveBeenCalledWith('gen-123');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should display error message on API failure', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to save' }),
    });

    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    const nameInput = screen.getByLabelText(/Name/);
    const saveButton = screen.getByRole('button', { name: /Save Generation/i });

    fireEvent.change(nameInput, { target: { value: 'Test Generation' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to save/)).toBeInTheDocument();
    });
  });

  it('should disable save button while saving', async () => {
    (global.fetch as any).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, generation: { id: 'gen-123' } }),
      }), 100))
    );

    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    const nameInput = screen.getByLabelText(/Name/);
    const saveButton = screen.getByRole('button', { name: /Save Generation/i });

    fireEvent.change(nameInput, { target: { value: 'Test Generation' } });
    fireEvent.click(saveButton);

    // Button should be disabled while saving
    expect(saveButton).toBeDisabled();
    expect(screen.getByText(/Saving.../)).toBeInTheDocument();

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    }, { timeout: 200 });
  });

  it('should call onClose when cancel button is clicked', () => {
    render(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should reset form when dialog opens', () => {
    const { rerender } = render(
      <SaveDialog
        isOpen={false}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    rerender(
      <SaveDialog
        isOpen={true}
        onClose={mockOnClose}
        onSaveSuccess={mockOnSaveSuccess}
      />
    );

    const nameInput = screen.getByLabelText(/Name/) as HTMLInputElement;
    expect(nameInput.value).toBe('');
  });
});
