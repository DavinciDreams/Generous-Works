# Generations Management - Storage Infrastructure

This module provides the storage infrastructure for the Generations Management system using Neon DB (PostgreSQL).

## Overview

The storage infrastructure consists of:
- **Database Schema**: PostgreSQL schema with the `generations` table
- **Storage Client**: TypeScript client for CRUD operations
- **API Routes**: RESTful API endpoints for generations management
- **Authentication**: Protected routes using Clerk authentication

## Setup

### 1. Database Setup

1. Create a Neon DB project at [console.neon.tech](https://console.neon.tech/)
2. Get your connection string
3. Run the migration script to create the table:

```bash
# Run the migration
psql $DATABASE_URL -f lib/generations/migrations/001_create_generations_table.sql
```

Or use the Neon SQL editor to run the migration manually.

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### 3. Install Dependencies

The following dependencies are required:

```bash
npm install @neondatabase/serverless uuid
npm install --save-dev @types/uuid
```

## Database Schema

### Generations Table

```sql
CREATE TABLE generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  ui_components JSONB NOT NULL DEFAULT '{}'::jsonb,
  component_layouts JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1
);
```

### Indexes

- `idx_generations_user_id` - For user-specific queries
- `idx_generations_created_at` - For sorting by creation date
- `idx_generations_updated_at` - For sorting by update date
- `idx_generations_name_gin` - Full-text search on name
- `idx_generations_description_gin` - Full-text search on description

## Storage Client API

### `saveGeneration(input: CreateGenerationInput): Promise<Generation>`

Save a new generation to the database.

```typescript
const generation = await saveGeneration({
  user_id: 'user-123',
  name: 'My Generation',
  description: 'A test generation',
  messages: [{ role: 'user', content: 'Hello' }],
  ui_components: { component1: {} },
  component_layouts: { layout1: {} },
});
```

### `listGenerations(options: ListGenerationsOptions): Promise<{ generations: Generation[]; total: number }>`

List generations for a user with pagination and search.

```typescript
const { generations, total } = await listGenerations({
  user_id: 'user-123',
  limit: 20,
  offset: 0,
  search: 'test', // optional
});
```

### `loadGeneration(id: string, user_id: string): Promise<Generation | null>`

Load a single generation by ID.

```typescript
const generation = await loadGeneration('gen-123', 'user-123');
```

### `updateGeneration(id: string, user_id: string, updates: UpdateGenerationInput): Promise<Generation | null>`

Update an existing generation.

```typescript
const generation = await updateGeneration('gen-123', 'user-123', {
  name: 'Updated Name',
  description: 'Updated description',
});
```

### `deleteGeneration(id: string, user_id: string): Promise<boolean>`

Delete a generation by ID.

```typescript
const deleted = await deleteGeneration('gen-123', 'user-123');
```

### `generationExists(id: string, user_id: string): Promise<boolean>`

Check if a generation exists for a user.

```typescript
const exists = await generationExists('gen-123', 'user-123');
```

## API Routes

### POST /api/generations

Save a new generation.

**Request Body:**
```json
{
  "name": "My Generation",
  "description": "A test generation",
  "messages": [],
  "ui_components": {},
  "component_layouts": {}
}
```

**Response:**
```json
{
  "success": true,
  "generation": {
    "id": "gen-123",
    "user_id": "user-123",
    "name": "My Generation",
    "description": "A test generation",
    "messages": [],
    "ui_components": {},
    "component_layouts": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "version": 1
  }
}
```

### GET /api/generations

List generations for the authenticated user.

**Query Parameters:**
- `limit` (optional, default: 20) - Number of generations to return
- `offset` (optional, default: 0) - Number of generations to skip
- `search` (optional) - Search term for name and description

**Response:**
```json
{
  "success": true,
  "generations": [],
  "total": 0,
  "limit": 20,
  "offset": 0
}
```

### GET /api/generations/[id]

Load a specific generation by ID.

**Response:**
```json
{
  "success": true,
  "generation": {
    "id": "gen-123",
    "user_id": "user-123",
    "name": "My Generation",
    "description": "A test generation",
    "messages": [],
    "ui_components": {},
    "component_layouts": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "version": 1
  }
}
```

### PUT /api/generations/[id]

Update a specific generation.

**Request Body:**
```json
{
  "name": "Updated Name",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "generation": {
    "id": "gen-123",
    "user_id": "user-123",
    "name": "Updated Name",
    "description": "Updated description",
    "messages": [],
    "ui_components": {},
    "component_layouts": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T01:00:00.000Z",
    "version": 2
  }
}
```

### DELETE /api/generations/[id]

Delete a specific generation.

**Response:**
```json
{
  "success": true,
  "message": "Generation deleted successfully"
}
```

## Authentication

All API routes are protected using Clerk authentication. Users must be authenticated to access any generation endpoints. The middleware automatically injects the user ID into the request context.

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `404` - Not Found
- `500` - Internal Server Error

## Testing

Run the test suite:

```bash
npm test
```

Run tests for a specific file:

```bash
npm test app/api/generations/__tests__/route.test.ts
```

## Files

- `lib/generations/neon-storage.ts` - Storage client module
- `lib/generations/migrations/001_create_generations_table.sql` - Database migration
- `app/api/generations/route.ts` - API routes for save/list
- `app/api/generations/[id]/route.ts` - API routes for load/update/delete
- `app/api/generations/__tests__/route.test.ts` - API route tests
- `app/api/generations/[id]/__tests__/route.test.ts` - Individual generation route tests
- `lib/generations/__tests__/neon-storage.test.ts` - Storage client tests

## Next Steps

After completing Phase 5, the next phases will implement:

- **Phase 6**: Save/Download/Delete UI components
- **Phase 7**: Draggable/Resizable Wrapper for components
- **Phase 8**: Version Control System
- **Phase 9**: Sharing and Collaboration
- **Phase 10**: Analytics and Insights
- **Phase 11**: Performance Optimization

See `plans/PHASE2_GENERATIONS_MANAGEMENT.md` for more details.
