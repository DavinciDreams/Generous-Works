-- Enable pg_trgm extension for trigram matching (must be before GIN indexes)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create generations table
CREATE TABLE IF NOT EXISTS generations (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_generations_user_id ON generations(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_generations_updated_at ON generations(updated_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_generations_updated_at ON generations;
CREATE TRIGGER update_generations_updated_at
  BEFORE UPDATE ON generations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Full-text search index using GIN
CREATE INDEX IF NOT EXISTS idx_generations_name_gin ON generations USING gin(name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_generations_description_gin ON generations USING gin(description gin_trgm_ops);
