# Database Schema Verification Guide

This guide helps you verify that the database schema is correctly set up in Supabase.

## How to Test the Schema

### Step 1: Execute the Schema
1. Open your Supabase Dashboard
2. Go to **SQL Editor**
3. Copy and paste the SQL from `schema.md`
4. Click **Run** to execute

### Step 2: Verify Tables Created

Run this query to check all tables:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Expected tables:**
- ✅ `profiles`
- ✅ `api_keys`
- ✅ `custom_provider_keys`

### Step 3: Verify Profiles Table Columns

Run this query:
```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;
```

**Expected columns:**
- ✅ `id` (uuid, NOT NULL)
- ✅ `updated_at` (timestamp with time zone)
- ✅ `full_name` (text)
- ✅ `avatar_url` (text)
- ✅ `razorpay_customer_id` (text)
- ✅ `razorpay_subscription_id` (text)
- ✅ `razorpay_plan_id` (text)
- ✅ `razorpay_current_period_start` (timestamp with time zone)
- ✅ `razorpay_current_period_end` (timestamp with time zone)
- ✅ `subscription_status` (text)
- ✅ `last_payment_id` (text)
- ✅ `last_payment_amount` (numeric)
- ✅ `last_payment_date` (timestamp with time zone)
- ✅ `plan_name` (text)

### Step 4: Verify Indexes

Run this query:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'profiles';
```

**Expected indexes:**
- ✅ `profiles_pkey` (primary key on id)
- ✅ `idx_razorpay_subscription_id`
- ✅ `idx_razorpay_customer_id`
- ✅ `idx_subscription_status`

### Step 5: Verify Row Level Security (RLS)

Run this query:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'api_keys', 'custom_provider_keys');
```

**Expected:** All tables should have `rowsecurity = true`

### Step 6: Verify Policies

Run this query:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected policies:**

**For `profiles`:**
- ✅ "Public profiles are viewable by everyone." (SELECT)
- ✅ "Users can insert their own profile." (INSERT)
- ✅ "Users can update own profile." (UPDATE)

**For `api_keys`:**
- ✅ "Users can view their own API key prefixes." (SELECT)
- ✅ "Users can insert their own API keys." (INSERT)
- ✅ "Users can revoke their own API keys." (DELETE)

**For `custom_provider_keys`:**
- ✅ "Users can view their own custom keys." (SELECT)
- ✅ "Users can insert their own custom keys." (INSERT)
- ✅ "Users can delete their own custom keys." (DELETE)

### Step 7: Verify Functions

Run this query:
```sql
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'handle_new_user',
  'upsert_custom_provider_key',
  'transactional_regenerate_api_key'
);
```

**Expected functions:**
- ✅ `handle_new_user` (FUNCTION)
- ✅ `upsert_custom_provider_key` (FUNCTION)
- ✅ `transactional_regenerate_api_key` (FUNCTION)

### Step 8: Verify Trigger

Run this query:
```sql
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
OR event_object_schema = 'auth';
```

**Expected trigger:**
- ✅ `on_auth_user_created` on `auth.users` table (AFTER INSERT)

### Step 9: Test Encryption Key (For Custom Provider Keys)

Run this query:
```sql
SELECT name FROM pgsodium.key WHERE name = 'custom_keys_encryption_key';
```

**If the key doesn't exist, create it:**
```sql
SELECT pgsodium.create_key('aead-ietf', 'custom_keys_encryption_key');
```

### Step 10: Test Profile Creation (Manual Test)

1. Sign up a new user through your application
2. Check if profile is automatically created:
```sql
SELECT id, full_name, avatar_url, subscription_status, plan_name
FROM profiles
WHERE id = '<your-user-id>';
```

**Expected:** A new row should exist with `subscription_status = 'inactive'`

---

## Common Issues & Solutions

### Issue 1: Encryption key not found
**Error:** `Encryption key not found. Please run...`

**Solution:**
```sql
SELECT pgsodium.create_key('aead-ietf', 'custom_keys_encryption_key');
```

### Issue 2: Profile not created automatically
**Problem:** User signs up but no profile row created

**Solution:**
1. Check if trigger exists:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

2. If missing, recreate the trigger from `schema.md`

### Issue 3: RLS prevents access
**Problem:** Can't query profiles table

**Solution:** Ensure you're querying as an authenticated user or check RLS policies:
```sql
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

### Issue 4: Indexes not created
**Problem:** Slow queries on subscription lookups

**Solution:** Manually create indexes:
```sql
CREATE INDEX IF NOT EXISTS idx_razorpay_subscription_id ON profiles(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_customer_id ON profiles(razorpay_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscription_status ON profiles(subscription_status);
```

---

## Schema Compatibility Check

### Migration from Stripe to Razorpay

If you previously had Stripe columns, you can keep them for historical data:

```sql
-- Optional: Keep Stripe columns for reference
-- These are NOT used by the application anymore
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id_legacy text,
ADD COLUMN IF NOT EXISTS stripe_subscription_id_legacy text,
ADD COLUMN IF NOT EXISTS stripe_price_id_legacy text,
ADD COLUMN IF NOT EXISTS stripe_current_period_end_legacy timestamp with time zone;

-- Copy old Stripe data to legacy columns (if you want to preserve it)
UPDATE profiles 
SET 
  stripe_customer_id_legacy = stripe_customer_id,
  stripe_subscription_id_legacy = stripe_subscription_id,
  stripe_price_id_legacy = stripe_price_id,
  stripe_current_period_end_legacy = stripe_current_period_end
WHERE stripe_customer_id IS NOT NULL;
```

---

## ✅ Verification Complete

Once all checks pass, your database schema is correctly set up and ready to use!

**Next steps:**
1. Add Supabase connection details to `.env.local`
2. Test user signup/login
3. Test API key generation in dashboard
4. When ready, configure Razorpay and test payments

---

## Quick Test Script

Copy and run this entire script to quickly verify everything:

```sql
-- 1. Check tables
SELECT 'Tables' as check_type, COUNT(*) as count 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'api_keys', 'custom_provider_keys');

-- 2. Check profiles columns
SELECT 'Profiles Columns' as check_type, COUNT(*) as count 
FROM information_schema.columns 
WHERE table_name = 'profiles';

-- 3. Check indexes
SELECT 'Indexes' as check_type, COUNT(*) as count 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- 4. Check RLS enabled
SELECT 'RLS Enabled' as check_type, COUNT(*) as count 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'api_keys', 'custom_provider_keys')
AND rowsecurity = true;

-- 5. Check policies
SELECT 'Policies' as check_type, COUNT(*) as count 
FROM pg_policies 
WHERE schemaname = 'public';

-- 6. Check functions
SELECT 'Functions' as check_type, COUNT(*) as count 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN (
  'handle_new_user',
  'upsert_custom_provider_key',
  'transactional_regenerate_api_key'
);

-- 7. Check trigger
SELECT 'Triggers' as check_type, COUNT(*) as count 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**Expected Results:**
- Tables: 3
- Profiles Columns: 14
- Indexes: 4
- RLS Enabled: 3
- Policies: 9
- Functions: 3
- Triggers: 1

If all counts match, your schema is perfect! ✅
