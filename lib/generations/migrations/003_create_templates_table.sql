-- Create templates table for component templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  ui_components JSONB NOT NULL DEFAULT '{}'::jsonb,
  component_layouts JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT FALSE,
  is_system_template BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_tags ON templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_templates_is_public ON templates(is_public);
CREATE INDEX IF NOT EXISTS idx_templates_is_system_template ON templates(is_system_template);
CREATE INDEX IF NOT EXISTS idx_templates_usage_count ON templates(usage_count DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_templates_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_templates_updated_at_trigger ON templates;
CREATE TRIGGER update_templates_updated_at_trigger
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_templates_updated_at_column();

-- Insert system templates
INSERT INTO templates (
  user_id,
  name,
  description,
  category,
  tags,
  ui_components,
  component_layouts,
  is_public,
  is_system_template
) VALUES
  (
    'system',
    'Basic Chat Interface',
    'A simple chat interface with message history',
    'chat',
    ARRAY['chat', 'basic', 'simple'],
    '{"chat": {"type": "chat", "position": "main"}}'::jsonb,
    '{"main": {"type": "chat", "props": {}}}'::jsonb,
    TRUE,
    TRUE
  ),
  (
    'system',
    'Dashboard Layout',
    'A dashboard layout with multiple panels',
    'dashboard',
    ARRAY['dashboard', 'layout', 'panels'],
    '{"dashboard": {"type": "dashboard", "position": "main"}}'::jsonb,
    '{"main": {"type": "dashboard", "props": {}}}'::jsonb,
    TRUE,
    TRUE
  ),
  (
    'system',
    'Form Template',
    'A form template with validation',
    'form',
    ARRAY['form', 'validation', 'input'],
    '{"form": {"type": "form", "position": "main"}}'::jsonb,
    '{"main": {"type": "form", "props": {}}}'::jsonb,
    TRUE,
    TRUE
  ),
  (
    'system',
    'Data Table',
    'A data table with sorting and filtering',
    'table',
    ARRAY['table', 'data', 'grid'],
    '{"table": {"type": "table", "position": "main"}}'::jsonb,
    '{"main": {"type": "table", "props": {}}}'::jsonb,
    TRUE,
    TRUE
  ),
  (
    'system',
    'Chart Visualization',
    'A chart visualization component',
    'chart',
    ARRAY['chart', 'visualization', 'graph'],
    '{"chart": {"type": "chart", "position": "main"}}'::jsonb,
    '{"main": {"type": "chart", "props": {}}}'::jsonb,
    TRUE,
    TRUE
  )
ON CONFLICT DO NOTHING;
