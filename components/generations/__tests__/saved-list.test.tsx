/**
 * Tests for SavedList component
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SavedList } from '../saved-list';
import { useGenerativeUIStore } from '@/lib/store';
import type { Generation } from '@/lib/generations/neon-storage';

// Mock the store
vi.mock('@/lib/store', () => ({
  useGenerativeUIStore: vi.fn(),
}));

describe('SavedList', () => {
  const mockOnLoadGeneration = vi.fn();

  const mockStore = {
    messages: [],
    uiComponents: {},
    setMessages: vi.fn(),
    clearUIComponents: vi.fn(),
    addUIComponent: vi.fn(),
  };

  const mockGenerations: Generation[] = [
    {
      id: 'gen-1',
      user_id: 'user-123',
      name: 'First Generation',
      description: 'First test generation',
      messages: [{ role: 'user', content: 'Hello' }],
      ui_components: { 'comp-1': { type: 'Button', props: {} } },
      component_layouts: null,
      created_at: new Date('2024-01-01'),
      updated_at: new Date('2024-01-01'),
      version: 1,
    },
    {
      id: 'gen-2',
      user_id: 'user-123',
      name: 'Second Generation',
      description: 'Second test generation',
      messages: [{ role: 'user', content: 'Hi' }],
      ui_components: { 'comp-2': { type: 'Card', props: {} } },
      component_layouts: null,
      created_at: new Date('2024-01-02'),
      updated_at: new Date('2024-01-02'),
      version: 1,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useGenerativeUIStore as any).mockReturnValue(mockStore);
    global.fetch = vi.fn();
  });

  it('should render loading state initially', () => {
    (global.fetch as any).mockImplementation(
      () => new Promise(() => {})
    );

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    expect(screen.getByText(/Loading generations.../)).toBeInTheDocument();
  });

  it('should fetch generations on mount', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: mockGenerations }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generations');
    });
  });

  it('should display generations after loading', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: mockGenerations }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText('First Generation')).toBeInTheDocument();
      expect(screen.getByText('Second Generation')).toBeInTheDocument();
    });
  });

  it('should display empty state when no generations', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: [] }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText(/No saved generations yet/)).toBeInTheDocument();
    });
  });

  it('should display error message on fetch failure', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Failed to load' }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load/)).toBeInTheDocument();
    });
  });

  it('should filter generations by search query', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: mockGenerations }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText('First Generation')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search generations.../);
    fireEvent.change(searchInput, { target: { value: 'First' } });

    await waitFor(() => {
      expect(screen.getByText('First Generation')).toBeInTheDocument();
      expect(screen.queryByText('Second Generation')).not.toBeInTheDocument();
    });
  });

  it('should refresh generations when refresh button is clicked', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: mockGenerations }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    const refreshButton = screen.getByRole('button');
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it('should load generation when load button is clicked', async () => {
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, generations: mockGenerations }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          generation: mockGenerations[0],
        }),
      });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText('First Generation')).toBeInTheDocument();
    });

    const loadButton = screen.getAllByText(/Load/i)[0];
    fireEvent.click(loadButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generations/gen-1');
    });

    await waitFor(() => {
      expect(mockStore.setMessages).toHaveBeenCalledWith(mockGenerations[0].messages);
      expect(mockOnLoadGeneration).toHaveBeenCalledWith(mockGenerations[0]);
    });
  });

  it('should display component count badge', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: mockGenerations }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText('1 components')).toBeInTheDocument();
    });
  });

  it('should display formatted date', async () => {
    const recentGeneration = {
      ...mockGenerations[0],
      created_at: new Date(),
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: [recentGeneration] }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText(/ago/)).toBeInTheDocument();
    });
  });

  it('should handle search with API', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: [mockGenerations[0]] }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    const searchInput = screen.getByPlaceholderText(/Search generations.../);
    fireEvent.change(searchInput, { target: { value: 'First' } });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/generations?search=First');
    });
  });

  it('should clear search when input is empty', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: mockGenerations }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText('First Generation')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search generations.../);
    fireEvent.change(searchInput, { target: { value: 'First' } });

    await waitFor(() => {
      expect(screen.queryByText('Second Generation')).not.toBeInTheDocument();
    });

    fireEvent.change(searchInput, { target: { value: '' } });

    await waitFor(() => {
      expect(screen.getByText('Second Generation')).toBeInTheDocument();
    });
  });

  it('should display generation description if present', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: [mockGenerations[0]] }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText('First test generation')).toBeInTheDocument();
    });
  });

  it('should handle generation without description', async () => {
    const genWithoutDesc = {
      ...mockGenerations[0],
      description: null,
    };

    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, generations: [genWithoutDesc] }),
    });

    render(<SavedList onLoadGeneration={mockOnLoadGeneration} />);

    await waitFor(() => {
      expect(screen.getByText('First Generation')).toBeInTheDocument();
      // Description should not be present
      expect(screen.queryByText('First test generation')).not.toBeInTheDocument();
    });
  });
});
