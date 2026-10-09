/**
 * API Tests for Generations Management
 * Tests for POST /api/generations and GET /api/generations
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST, GET } from '../route';
import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import {
  saveGeneration,
  listGenerations,
} from '@/lib/generations/neon-storage';

// Mock Clerk auth
vi.mock('@clerk/nextjs/server', () => ({
  auth: vi.fn(),
}));

// Mock storage functions
vi.mock('@/lib/generations/neon-storage', () => ({
  saveGeneration: vi.fn(),
  listGenerations: vi.fn(),
}));

describe('POST /api/generations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const request = new NextRequest('http://localhost:3000/api/generations', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Generation',
        messages: [],
        ui_components: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 if name is missing', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);

    const request = new NextRequest('http://localhost:3000/api/generations', {
      method: 'POST',
      body: JSON.stringify({
        messages: [],
        ui_components: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('should save generation and return 201', async () => {
    const mockGeneration = {
      id: 'gen-123',
      user_id: 'user-123',
      name: 'Test Generation',
      description: null,
      messages: [],
      ui_components: {},
      component_layouts: null,
      created_at: new Date(),
      updated_at: new Date(),
      version: 1,
    };

    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(saveGeneration).mockResolvedValue(mockGeneration);

    const request = new NextRequest('http://localhost:3000/api/generations', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Generation',
        description: 'Test description',
        messages: [{ role: 'user', content: 'Hello' }],
        ui_components: { component1: {} },
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.generation).toEqual(mockGeneration);
    expect(saveGeneration).toHaveBeenCalledWith({
      user_id: 'user-123',
      name: 'Test Generation',
      description: 'Test description',
      messages: [{ role: 'user', content: 'Hello' }],
      ui_components: { component1: {} },
    });
  });

  it('should handle server errors', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(saveGeneration).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/generations', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Generation',
        messages: [],
        ui_components: {},
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to save generation');
  });
});

describe('GET /api/generations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const request = new NextRequest('http://localhost:3000/api/generations');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should list generations with default pagination', async () => {
    const mockGenerations = [
      {
        id: 'gen-1',
        user_id: 'user-123',
        name: 'Generation 1',
        description: null,
        messages: [],
        ui_components: {},
        component_layouts: null,
        created_at: new Date(),
        updated_at: new Date(),
        version: 1,
      },
    ];

    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(listGenerations).mockResolvedValue({
      generations: mockGenerations,
      total: 1,
    });

    const request = new NextRequest('http://localhost:3000/api/generations');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.generations).toEqual(mockGenerations);
    expect(data.total).toBe(1);
    expect(data.limit).toBe(20);
    expect(data.offset).toBe(0);
    expect(listGenerations).toHaveBeenCalledWith({
      user_id: 'user-123',
      limit: 20,
      offset: 0,
      search: undefined,
    });
  });

  it('should list generations with custom pagination and search', async () => {
    const mockGenerations = [];

    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(listGenerations).mockResolvedValue({
      generations: mockGenerations,
      total: 0,
    });

    const request = new NextRequest(
      'http://localhost:3000/api/generations?limit=10&offset=20&search=test'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(listGenerations).toHaveBeenCalledWith({
      user_id: 'user-123',
      limit: 10,
      offset: 20,
      search: 'test',
    });
  });

  it('should validate pagination parameters', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);

    const request = new NextRequest(
      'http://localhost:3000/api/generations?limit=invalid&offset=-5'
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation error');
  });

  it('should handle server errors', async () => {
    vi.mocked(auth).mockResolvedValue({ userId: 'user-123' } as any);
    vi.mocked(listGenerations).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3000/api/generations');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to list generations');
  });
});
