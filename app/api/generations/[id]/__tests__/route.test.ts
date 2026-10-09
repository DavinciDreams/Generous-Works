/**
 * API Tests for Individual Generation Management
 * Tests for GET /api/generations/[id], PUT /api/generations/[id], DELETE /api/generations/[id]
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, PUT, DELETE } from '../route';
import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  loadGeneration,
  updateGeneration,
  deleteGeneration,
} from '@/lib/generations/neon-storage';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

// Mock storage functions
vi.mock('@/lib/generations/neon-storage', () => ({
  loadGeneration: vi.fn(),
  updateGeneration: vi.fn(),
  deleteGeneration: vi.fn(),
}));

describe('GET /api/generations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123');

    const response = await GET(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if ID is invalid', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);

    const request = new NextRequest('http://localhost:3000/api/generations/');

    const response = await GET(request, { params: Promise.resolve({ id: '' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid generation ID');
  });

  it('should return 404 if generation not found', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(loadGeneration).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123');

    const response = await GET(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Generation not found');
  });

  it('should return generation if found', async () => {
    const mockGeneration = {
      id: 'gen-123',
      user_id: 'user-123',
      name: 'Test Generation',
      description: 'Test description',
      messages: [],
      ui_components: {},
      component_layouts: null,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
    };

    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(loadGeneration).mockResolvedValue(mockGeneration);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123');

    const response = await GET(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.generation).toEqual(mockGeneration);
    expect(loadGeneration).toHaveBeenCalledWith('gen-123', 'user-123');
  });

  it('should handle server errors', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(loadGeneration).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123');

    const response = await GET(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to load generation');
  });
});

describe('PUT /api/generations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if ID is invalid', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);

    const request = new NextRequest('http://localhost:3000/api/generations/', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: '' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid generation ID');
  });

  it('should return 400 if no fields to update', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'PUT',
      body: JSON.stringify({}),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('No fields to update');
  });

  it('should update generation and return 200', async () => {
    const mockGeneration = {
      id: 'gen-123',
      user_id: 'user-123',
      name: 'Updated Name',
      description: 'Updated description',
      messages: [],
      ui_components: {},
      component_layouts: null,
      created_at: new Date(),
      updated_at: new Date(),
      version: 2,
    };

    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(updateGeneration).mockResolvedValue(mockGeneration);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'PUT',
      body: JSON.stringify({
        name: 'Updated Name',
        description: 'Updated description',
      }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.generation).toEqual(mockGeneration);
    expect(updateGeneration).toHaveBeenCalledWith('gen-123', 'user-123', {
      name: 'Updated Name',
      description: 'Updated description',
    });
  });

  it('should return 404 if generation not found', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(updateGeneration).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Generation not found');
  });

  it('should handle server errors', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(updateGeneration).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'PUT',
      body: JSON.stringify({ name: 'Updated Name' }),
    });

    const response = await PUT(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to update generation');
  });
});

describe('DELETE /api/generations/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if ID is invalid', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);

    const request = new NextRequest('http://localhost:3000/api/generations/', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: '' }) });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid generation ID');
  });

  it('should delete generation and return 200', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(deleteGeneration).mockResolvedValue(true);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Generation deleted successfully');
    expect(deleteGeneration).toHaveBeenCalledWith('gen-123', 'user-123');
  });

  it('should return 404 if generation not found', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(deleteGeneration).mockResolvedValue(false);

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('Generation not found');
  });

  it('should handle server errors', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(deleteGeneration).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/generations/gen-123', {
      method: 'DELETE',
    });

    const response = await DELETE(request, { params: Promise.resolve({ id: 'gen-123' }) });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to delete generation');
  });
});
