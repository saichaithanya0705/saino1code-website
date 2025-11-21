-- VSCode OAuth Tables
-- These tables store temporary OAuth authorization codes and access tokens for VSCode extension authentication

-- Table for storing authorization codes (temporary, expires in 10 minutes)
CREATE TABLE IF NOT EXISTS oauth_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,  -- SHA-256 hashed authorization code
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_challenge TEXT NOT NULL,  -- PKCE code challenge
  state TEXT NOT NULL,  -- CSRF protection state
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_oauth_codes_code ON oauth_codes(code);
CREATE INDEX IF NOT EXISTS idx_oauth_codes_expires_at ON oauth_codes(expires_at);

-- Table for storing VSCode access tokens (long-lived)
CREATE TABLE IF NOT EXISTS vscode_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token TEXT NOT NULL UNIQUE,  -- SHA-256 hashed access token
  refresh_token TEXT NOT NULL UNIQUE,  -- SHA-256 hashed refresh token
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups  
CREATE INDEX IF NOT EXISTS idx_vscode_tokens_access_token ON vscode_tokens(access_token);
CREATE INDEX IF NOT EXISTS idx_vscode_tokens_refresh_token ON vscode_tokens(refresh_token);
CREATE INDEX IF NOT EXISTS idx_vscode_tokens_user_id ON vscode_tokens(user_id);

-- RLS Policies (users can only access their own tokens)
ALTER TABLE oauth_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vscode_tokens ENABLE ROW LEVEL SECURITY;

-- Users can view their own OAuth codes
CREATE POLICY "Users can view own OAuth codes"
  ON oauth_codes FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view their own VSCode tokens
CREATE POLICY "Users can view own VSCode tokens"
  ON vscode_tokens FOR SELECT
  USING (auth.uid() = user_id);

-- Cleanup function to delete expired OAuth codes (run periodically via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_oauth_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM oauth_codes WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE oauth_codes IS 'Temporary storage for OAuth authorization codes used in VSCode extension authentication';
COMMENT ON TABLE vscode_tokens IS 'Long-lived access tokens for VSCode extension authentication';
COMMENT ON COLUMN oauth_codes.code IS 'SHA-256 hashed authorization code for security';
COMMENT ON COLUMN oauth_codes.code_challenge IS 'PKCE code challenge for verification';
COMMENT ON COLUMN vscode_tokens.access_token IS 'SHA-256 hashed access token';
COMMENT ON COLUMN vscode_tokens.refresh_token IS 'SHA-256 hashed refresh token for token renewal';
