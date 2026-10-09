-- Create shares table for generation sharing
CREATE TABLE IF NOT EXISTS shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id UUID NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  share_token TEXT NOT NULL UNIQUE,
  share_url TEXT NOT NULL,
  is_readonly BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shares_generation_id ON shares(generation_id);
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON shares(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_share_token ON shares(share_token);
CREATE INDEX IF NOT EXISTS idx_shares_expires_at ON shares(expires_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shares_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_shares_updated_at_trigger ON shares;
CREATE TRIGGER update_shares_updated_at_trigger
  BEFORE UPDATE ON shares
  FOR EACH ROW
  EXECUTE FUNCTION update_shares_updated_at_column();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_share_view_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.view_count = NEW.view_count + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically increment view count on access
DROP TRIGGER IF EXISTS increment_share_view_count_trigger ON shares;
CREATE TRIGGER increment_share_view_count_trigger
  AFTER UPDATE ON shares
  FOR EACH ROW
  EXECUTE FUNCTION increment_share_view_count();
