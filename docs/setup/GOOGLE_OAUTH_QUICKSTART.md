# 🚀 Quick Guide: Google OAuth Setup

**Time:** 10 minutes | **Difficulty:** Easy

---

## 📝 Quick Steps

### 1. Google Cloud Console (5 min)

**Create Project:**
- Go to: https://console.cloud.google.com/
- New Project → Name: "SaiNo1Code" → Create

**Enable API:**
- APIs & Services → Library
- Search: "Google+ API" → Enable

**OAuth Consent Screen:**
- OAuth consent screen → External → Create
- App name: "SaiNo1Code Website"
- User support email: your@email.com
- Authorized domains: `supabase.co`, `yourdomain.com`
- Scopes: email, profile, openid
- Save

**Create Credentials:**
- Credentials → Create → OAuth client ID
- Type: Web application
- Name: "SaiNo1Code Auth"
- Authorized redirect URIs: 
  - `https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback`
  - `http://localhost:3000/auth/callback` (for local testing)
- Create → **Copy Client ID & Secret** 🔑

---

### 2. Supabase Dashboard (2 min)

**Get Callback URL:**
- Dashboard → Authentication → Providers
- Click Google → Copy "Callback URL"
- Example: `https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback`

**Configure Provider:**
- Toggle "Enable Sign in with Google" → ON
- Paste Client ID
- Paste Client Secret
- Save

---

### 3. Your App (3 min)

**Add Google Button:**

```typescript
// In your login/signup page
const supabase = createClientComponentClient()

const handleGoogleSignIn = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
}

<Button onClick={handleGoogleSignIn}>
  <GoogleIcon /> Continue with Google
</Button>
```

---

## ✅ Done!

Test: 
- Open: http://localhost:3000/login or http://localhost:3000/signup
- Click "Continue with Google" 
- Sign in → Get redirected back → Logged in! 🎉

---

## 🔑 What You Need

From Google Console:
```
Client ID: 1234567890-abc123.apps.googleusercontent.com
Client Secret: GOCSPX-xyz789abc456
```

From Supabase:
```
Callback URL: https://YOUR-PROJECT.supabase.co/auth/v1/callback
```

---

## 🆘 Common Errors

**"Redirect URI mismatch"**
→ Make sure redirect URI in Google Console matches Supabase callback URL exactly

**"Access blocked"**
→ Add your email to test users in OAuth consent screen

**"Invalid client"**
→ Double-check Client ID and Secret in Supabase (no extra spaces)

---

## 📚 Full Guide

See: `docs/setup/google-oauth-setup.md` for detailed instructions

---

**Your Supabase Project:** `kgpctabhtsrrdyxetawz`  
**Your Callback URL:** `https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback`
