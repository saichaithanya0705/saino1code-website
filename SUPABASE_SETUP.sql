-- ============================================
-- SUPABASE SETUP FOR VS CODE AUTHENTICATION
-- ============================================
-- Copy and paste this entire file into Supabase SQL Editor
-- Run it all at once to set up the authentication system

-- ============================================
-- STEP 1: CREATE API_KEYS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS api_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hashed_key TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hashed_key ON api_keys(hashed_key);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own API keys" ON api_keys;
DROP POLICY IF EXISTS "Users can insert their own API keys via RPC" ON api_keys;
DROP POLICY IF EXISTS "Users can update their own API keys" ON api_keys;

-- Create RLS policy: Users can only see their own keys
CREATE POLICY "Users can view their own API keys"
  ON api_keys
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policy: Users can insert their own keys via RPC
CREATE POLICY "Users can insert their own API keys via RPC"
  ON api_keys
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policy: Users can update their own keys
CREATE POLICY "Users can update their own API keys"
  ON api_keys
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 2: CREATE RPC FUNCTION
-- ============================================

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS transactional_regenerate_api_key(TEXT, TEXT);

-- Create the RPC function for atomic API key regeneration
CREATE OR REPLACE FUNCTION transactional_regenerate_api_key(
  p_key_prefix TEXT,
  p_hashed_key TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Deactivate all existing API keys for this user
  UPDATE api_keys
  SET is_active = FALSE
  WHERE user_id = auth.uid();

  -- Insert the new API key
  INSERT INTO api_keys (user_id, hashed_key, key_prefix, is_active)
  VALUES (auth.uid(), p_hashed_key, p_key_prefix, TRUE);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION transactional_regenerate_api_key(TEXT, TEXT) TO authenticated;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Run these queries to verify everything was created correctly:

-- 1. Check if table exists and see its structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'api_keys'
ORDER BY ordinal_position;

-- 2. Check if indexes were created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'api_keys';

-- 3. Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'api_keys';

-- 4. Check if policies exist
SELECT policyname, cmd, qual
FROM pg_policies
WHERE tablename = 'api_keys';

-- 5. Check if function exists
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_name = 'transactional_regenerate_api_key';

-- ============================================
-- SUCCESS!
-- ============================================
-- If all verification queries return results, you're ready to go!
-- 
-- Next steps:
-- 1. Wait for Netlify deployment to complete
-- 2. Test the authentication flow
-- 3. Check the QUICK_START_DEPLOYMENT.md file for testing steps
