-- Fix RLS policies to allow INSERT, UPDATE, and DELETE
-- Previously only SELECT was allowed, causing "Failed to create authorization code" error

-- OAuth Codes Policies
CREATE POLICY "Users can insert own OAuth codes"
  ON oauth_codes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own OAuth codes"
  ON oauth_codes FOR DELETE
  USING (auth.uid() = user_id);

-- VSCode Tokens Policies
CREATE POLICY "Users can insert own VSCode tokens"
  ON vscode_tokens FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own VSCode tokens"
  ON vscode_tokens FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own VSCode tokens"
  ON vscode_tokens FOR DELETE
  USING (auth.uid() = user_id);
