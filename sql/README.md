# ✅ Database Schema - VERIFIED & UPDATED

## 📋 Schema Status

**Status:** ✅ **READY TO USE**  
**Last Updated:** Migrated from Stripe to Razorpay  
**Compatibility:** Supabase PostgreSQL

---

## 📁 Files in this Directory

### 1. `schema.md` ⭐ **START HERE**
Complete SQL schema for your SaiNo1Code application.

**What it contains:**
- ✅ Profiles table (with Razorpay fields)
- ✅ API Keys table
- ✅ Custom Provider Keys table
- ✅ All required functions and triggers
- ✅ Row Level Security (RLS) policies
- ✅ Indexes for performance

**How to use:**
1. Open Supabase Dashboard → SQL Editor
2. Copy entire content from `schema.md`
3. Click **Run** to execute
4. Done! ✅

### 2. `SCHEMA_VERIFICATION.md`
Comprehensive testing and verification guide.

**What it contains:**
- Step-by-step verification queries
- Expected results for each check
- Common issues and solutions
- Quick test script

**Use this to:**
- Verify schema is correctly installed
- Troubleshoot any issues
- Confirm everything works

---

## 🔄 Changes from Original

### Updated for Razorpay Integration

**Replaced Stripe fields with Razorpay fields:**

| Old (Stripe) | New (Razorpay) |
|-------------|----------------|
| `stripe_customer_id` | `razorpay_customer_id` |
| `stripe_subscription_id` | `razorpay_subscription_id` |
| `stripe_price_id` | `razorpay_plan_id` |
| `stripe_current_period_end` | `razorpay_current_period_start` + `razorpay_current_period_end` |
| - | `subscription_status` (new) |
| - | `last_payment_id` (new) |
| - | `last_payment_amount` (new) |
| - | `last_payment_date` (new) |

**Added indexes for better performance:**
- `idx_razorpay_subscription_id`
- `idx_razorpay_customer_id`
- `idx_subscription_status`

---

## 📊 Tables Overview

### 1. Profiles Table
**Purpose:** Store user profile data and Razorpay subscription info

**Key Fields:**
- User identification (id, full_name, avatar_url)
- Razorpay customer info
- Subscription status and billing periods
- Payment history

**Security:** RLS enabled with policies for view/insert/update

### 2. API Keys Table
**Purpose:** Store hashed API keys for VS Code extension

**Key Fields:**
- User ID reference
- Key prefix (visible)
- Hashed key (secure)
- Creation timestamp

**Security:** RLS enabled, users can only manage their own keys

### 3. Custom Provider Keys Table
**Purpose:** Store encrypted third-party API keys (OpenAI, Groq, etc.)

**Key Fields:**
- User ID reference
- Provider name (openai, groq, ollama)
- Encrypted key (using pgsodium)
- Creation timestamp

**Security:** 
- Encrypted at rest using pgsodium
- RLS enabled
- Requires encryption key setup

---

## 🚀 Quick Setup

### Option 1: Fresh Install (Recommended)

```bash
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy content from schema.md
4. Click Run
5. Verify with queries from SCHEMA_VERIFICATION.md
```

### Option 2: Migrating from Stripe Schema

If you already have the old Stripe schema:

```sql
-- Add new Razorpay columns
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS razorpay_customer_id text,
ADD COLUMN IF NOT EXISTS razorpay_subscription_id text,
ADD COLUMN IF NOT EXISTS razorpay_plan_id text,
ADD COLUMN IF NOT EXISTS razorpay_current_period_start timestamp with time zone,
ADD COLUMN IF NOT EXISTS razorpay_current_period_end timestamp with time zone,
ADD COLUMN IF NOT EXISTS subscription_status text default 'inactive',
ADD COLUMN IF NOT EXISTS last_payment_id text,
ADD COLUMN IF NOT EXISTS last_payment_amount numeric,
ADD COLUMN IF NOT EXISTS last_payment_date timestamp with time zone;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_razorpay_subscription_id ON profiles(razorpay_subscription_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_customer_id ON profiles(razorpay_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscription_status ON profiles(subscription_status);
```

---

## ✅ Verification Checklist

Run through this checklist after executing the schema:

- [ ] All 3 tables created (profiles, api_keys, custom_provider_keys)
- [ ] Profiles table has 14 columns
- [ ] RLS enabled on all tables
- [ ] 9 policies created (3 per table)
- [ ] 3 functions created (handle_new_user, upsert_custom_provider_key, transactional_regenerate_api_key)
- [ ] Trigger created (on_auth_user_created)
- [ ] 4 indexes on profiles table
- [ ] pgsodium encryption key created (for custom_provider_keys)

**How to verify:** See `SCHEMA_VERIFICATION.md` for detailed queries

---

## 🔐 Security Features

### Row Level Security (RLS)
All tables have RLS enabled to ensure users can only access their own data.

### Encryption
Custom provider API keys are encrypted using `pgsodium` extension with AES-GCM encryption.

### Automatic Profile Creation
New user profiles are automatically created via trigger when users sign up.

### Hashed API Keys
Application API keys are hashed before storage using bcrypt/scrypt.

---

## 🛠️ Required Extensions

Make sure these extensions are enabled in Supabase:

1. **pgsodium** - For encryption (Settings → Database → Extensions)
2. **pgcrypto** - For UUID generation (usually enabled by default)

---

## 📝 Notes

### Backward Compatibility
If you need to preserve old Stripe data, the old columns can coexist with new Razorpay columns. See migration section above.

### Data Migration
No automatic data migration is performed. Old Stripe subscription data remains unchanged. New subscriptions will use Razorpay fields.

### Testing
After setup, test by:
1. Creating a new user (profile should auto-create)
2. Generating an API key from dashboard
3. Adding a custom provider key

---

## 🆘 Troubleshooting

### Common Issues

**1. Encryption key not found**
```sql
SELECT pgsodium.create_key('aead-ietf', 'custom_keys_encryption_key');
```

**2. pgsodium extension not available**
- Go to Supabase Dashboard → Database → Extensions
- Find "pgsodium" and enable it

**3. Trigger not firing**
- Check if trigger exists in `information_schema.triggers`
- Recreate from schema.md if missing

**4. Permission denied errors**
- Verify RLS policies are correctly created
- Check user authentication

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Row Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [pgsodium Encryption](https://github.com/michelp/pgsodium)

---

## ✅ Schema is Ready!

Once you've executed the schema from `schema.md` and verified it using `SCHEMA_VERIFICATION.md`, your database is fully set up and ready to use with your SaiNo1Code application!

**Next steps:**
1. Add Supabase credentials to `.env.local`
2. Test user registration
3. Configure Razorpay (when ready)
4. Start accepting subscriptions! 🚀
