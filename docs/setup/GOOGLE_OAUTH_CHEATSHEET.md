# 🎯 Google OAuth - Cheat Sheet

---

## ⚡ 3-Minute Setup

### Step 1: Google Console
```
URL: https://console.cloud.google.com/

1. Create Project → "SaiNo1Code"
2. APIs & Services → Library → Enable "Google+ API"
3. OAuth consent screen → External → Fill form
4. Credentials → Create → OAuth client ID → Web app
5. Add redirect URI:
   https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback
6. Copy: Client ID + Secret
```

### Step 2: Supabase
```
URL: https://supabase.com/dashboard

1. Authentication → Providers → Google
2. Toggle: Enable ON
3. Paste: Client ID + Secret
4. Save
```

### Step 3: Done!
```
Test: http://localhost:3001 → Click "Sign in with Google"
```

---

## 🔑 Your Specific URLs

```
Supabase Project: kgpctabhtsrrdyxetawz
Callback URL: https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback
                                          ▲ Copy this exact URL!
```

---

## 📋 Checklist

```
□ Created Google Cloud project
□ Enabled Google+ API
□ Configured OAuth consent screen
□ Created OAuth Client ID
□ Added redirect URI (matches Supabase callback)
□ Copied Client ID
□ Copied Client Secret
□ Enabled Google in Supabase
□ Pasted credentials in Supabase
□ Saved changes
□ Tested sign-in
□ Verified user in database
```

---

## 🆘 Quick Fixes

**"Redirect URI mismatch"**
→ Check URIs match exactly in Google + Supabase

**"Access blocked"**
→ Add your email to test users

**"Invalid client"**
→ Re-check Client ID (no extra spaces)

---

## 📚 Full Guides

- Quick: `GOOGLE_OAUTH_QUICKSTART.md`
- Detailed: `google-oauth-setup.md`
- Visual: `GOOGLE_OAUTH_VISUAL.md`

---

**Time: 10 min | Difficulty: Easy**
