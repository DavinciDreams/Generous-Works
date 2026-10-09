-- Create generations_history table for version control
CREATE TABLE IF NOT EXISTS generations_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  version INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  ui_components JSONB NOT NULL DEFAULT '{}'::jsonb,
  component_layouts JSONB DEFAULT '{}'::jsonb,
  change_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_current_version BOOLEAN DEFAULT FALSE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_generations_history_generation_id ON generations_history(generation_id);
CREATE INDEX IF NOT EXISTS idx_generations_history_user_id ON generations_history(user_id);
CREATE INDEX IF NOT EXISTS idx_generations_history_version ON generations_history(generation_id, version);
CREATE INDEX IF NOT EXISTS idx_generations_history_created_at ON generations_history(created_at DESC);

-- Create unique constraint to ensure only one current version per generation
CREATE UNIQUE INDEX IF NOT EXISTS idx_generations_history_current_version 
  ON generations_history(generation_id) 
  WHERE is_current_version = TRUE;

-- Create function to manage version history on update
CREATE OR REPLACE FUNCTION manage_generation_version_history()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is an update operation
  IF TG_OP = 'UPDATE' THEN
    -- Archive the old version
    INSERT INTO generations_history (
      generation_id,
      user_id,
      version,
      name,
      description,
      messages,
      ui_components,
      component_layouts,
      change_reason,
      created_at,
      is_current_version
    )
    SELECT
      OLD.id,
      OLD.user_id,
      OLD.version,
      OLD.name,
      OLD.description,
      OLD.messages,
      OLD.ui_components,
      OLD.component_layouts,
      'Version archived'::TEXT,
      OLD.updated_at,
      FALSE
    WHERE OLD.version < NEW.version;
    
    -- Mark the new version as current
    INSERT INTO generations_history (
      generation_id,
      user_id,
      version,
      name,
      description,
      messages,
      ui_components,
      component_layouts,
      change_reason,
      created_at,
      is_current_version
    )
    SELECT
      NEW.id,
      NEW.user_id,
      NEW.version,
      NEW.name,
      NEW.description,
      NEW.messages,
      NEW.ui_components,
      NEW.component_layouts,
      'Current version'::TEXT,
      NEW.updated_at,
      TRUE
    ON CONFLICT (generation_id) WHERE is_current_version = TRUE
    DO UPDATE SET
      version = NEW.version,
      name = NEW.name,
      description = NEW.description,
      messages = NEW.messages,
      ui_components = NEW.ui_components,
      component_layouts = NEW.component_layouts,
      created_at = NEW.updated_at;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically manage version history
DROP TRIGGER IF EXISTS manage_generation_version_history_trigger ON generations;
CREATE TRIGGER manage_generation_version_history_trigger
  AFTER UPDATE ON generations
  FOR EACH ROW
  EXECUTE FUNCTION manage_generation_version_history();
