-- Create analytics table for tracking component usage
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  generation_id UUID REFERENCES generations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  component_type TEXT,
  action TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_generation_id ON analytics(generation_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_component_type ON analytics(component_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics(created_at DESC);

-- Create composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_analytics_user_event ON analytics(user_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_generation_event ON analytics(generation_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_component_event ON analytics(component_type, event_type, created_at DESC);
