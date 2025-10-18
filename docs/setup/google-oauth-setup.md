# 🔐 Google OAuth Setup for Supabase

This guide will walk you through setting up Google Sign-In for your Supabase application.

---

## 📋 Overview

You need to:
1. Create a Google Cloud Project
2. Configure OAuth consent screen
3. Create OAuth 2.0 credentials
4. Add credentials to Supabase
5. Enable Google provider in Supabase

**Time required:** ~10-15 minutes

---

## 🚀 Step-by-Step Guide

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click the project dropdown at the top
   - Click **"New Project"**
   - Enter project name: `SaiNo1Code` (or your app name)
   - Click **"Create"**
   - Wait for project creation (~30 seconds)

3. **Select Your Project**
   - Click the project dropdown again
   - Select your newly created project

---

### Step 2: Enable Google+ API (Required)

1. **Go to APIs & Services**
   - In the left sidebar, click **"APIs & Services"** → **"Library"**
   - Or visit: https://console.cloud.google.com/apis/library

2. **Search for Google+ API**
   - In the search bar, type: `Google+ API`
   - Click on **"Google+ API"**

3. **Enable the API**
   - Click **"Enable"** button
   - Wait for it to activate

---

### Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Left sidebar → **"OAuth consent screen"**
   - Or visit: https://console.cloud.google.com/apis/credentials/consent

2. **Choose User Type**
   - Select **"External"** (for public apps)
   - Click **"Create"**

3. **App Information (Page 1)**
   Fill in the following:

   **App name:** `SaiNo1Code Website` (or your app name)
   
   **User support email:** Select your email from dropdown
   
   **App logo:** (Optional) Upload your logo (120x120px PNG/JPG)
   
   **Application home page:** `https://yourdomain.com` (or `http://localhost:3001` for testing)
   
   **Application privacy policy link:** `https://yourdomain.com/privacy`
   
   **Application terms of service link:** `https://yourdomain.com/terms`
   
   **Authorized domains:**
   - Add: `yourdomain.com` (your production domain)
   - Add: `supabase.co` (required for Supabase)
   
   **Developer contact information:**
   - Enter your email address

   Click **"Save and Continue"**

4. **Scopes (Page 2)**
   - Click **"Add or Remove Scopes"**
   - Select these scopes:
     - ✅ `.../auth/userinfo.email`
     - ✅ `.../auth/userinfo.profile`
     - ✅ `openid`
   - Click **"Update"**
   - Click **"Save and Continue"**

5. **Test Users (Page 3)**
   - For development, add test user emails (optional)
   - Click **"Save and Continue"**

6. **Summary (Page 4)**
   - Review your settings
   - Click **"Back to Dashboard"**

---

### Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Left sidebar → **"Credentials"**
   - Or visit: https://console.cloud.google.com/apis/credentials

2. **Create Credentials**
   - Click **"+ Create Credentials"** at the top
   - Select **"OAuth client ID"**

3. **Configure OAuth Client**

   **Application type:** Select **"Web application"**
   
   **Name:** `SaiNo1Code Auth` (or any name you prefer)

4. **Add Authorized Redirect URIs** ⚠️ **IMPORTANT!**

   You need to get the callback URL from Supabase first:

   **Get Supabase Callback URL:**
   - Go to your Supabase Dashboard: https://supabase.com/dashboard
   - Select your project
   - Go to **Authentication** → **Providers**
   - Click on **Google** provider
   - Copy the **Callback URL (for OAuth)** - it looks like:
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```

   **Add to Google Console:**
   - In "Authorized redirect URIs" section
   - Click **"+ Add URI"**
   - Paste your Supabase callback URL
   - Example: `https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback`

   **For Local Development (Optional):**
   - Add: `http://localhost:3001/auth/callback`
   - Add: `http://localhost:3000/auth/callback`

5. **Create**
   - Click **"Create"** button

6. **Copy Your Credentials** 🔑
   A popup will appear with your credentials:

   ```
   Client ID: 1234567890-abcdefghijklmnop.apps.googleusercontent.com
   Client Secret: GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
   ```

   ⚠️ **Important:** Copy both values immediately!
   - Click the **Copy** icon next to each
   - Paste them somewhere safe (like a text file)
   - You'll need these in the next step

---

### Step 5: Add Credentials to Supabase

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `kgpctabhtsrrdyxetawz`

2. **Navigate to Authentication**
   - Left sidebar → **Authentication**
   - Click **"Providers"** tab

3. **Configure Google Provider**
   - Scroll down to **Google** provider
   - Toggle **"Enable Sign in with Google"** to ON ✅

4. **Enter Your Credentials**
   
   **Client ID (for OAuth):**
   ```
   Paste your Google Client ID here
   Example: 1234567890-abcdefghijklmnop.apps.googleusercontent.com
   ```

   **Client Secret (for OAuth):**
   ```
   Paste your Google Client Secret here
   Example: GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
   ```

5. **Additional Settings (Optional)**

   **Skip nonce check:** Leave unchecked (recommended)
   
   **Authorized Client IDs:** Leave empty (unless you have mobile apps)

6. **Save Configuration**
   - Click **"Save"** button at the bottom
   - You should see a success message

---

## 🧪 Test Google Sign-In

### Option 1: Test in Your Application

1. **Start your dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Open your app:**
   - Visit: http://localhost:3001

3. **Try Sign Up with Google:**
   - Click **"Sign Up"** or **"Login"**
   - Look for **"Continue with Google"** button
   - Click it
   - Select your Google account
   - Grant permissions
   - You should be redirected back and logged in!

---

### Option 2: Test with Supabase Client

Create a test file to verify:

```typescript
// test-google-auth.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://kgpctabhtsrrdyxetawz.supabase.co',
  'your-anon-key-here'
)

async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3001/auth/callback'
    }
  })

  if (error) {
    console.error('Error:', error.message)
  } else {
    console.log('Success! Redirecting to Google...')
    console.log(data)
  }
}

signInWithGoogle()
```

---

## 🔧 Add Google Sign-In Button to Your App

### Update Login Page

Edit `src/app/login/page.tsx`:

```typescript
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    })

    if (error) {
      console.error('Error signing in with Google:', error.message)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Existing email/password form */}
      
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* Google Sign-In Button */}
      <Button
        variant="outline"
        type="button"
        onClick={handleGoogleSignIn}
      >
        <Icons.google className="mr-2 h-4 w-4" />
        Continue with Google
      </Button>
    </div>
  )
}
```

---

### Add Google Icon

Edit `src/components/icons.tsx`:

```typescript
export const Icons = {
  // ... existing icons ...
  
  google: (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  ),
}
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth Client ID created
- [ ] Redirect URI added in Google Console
- [ ] Credentials added to Supabase
- [ ] Google provider enabled in Supabase
- [ ] "Continue with Google" button appears in your app
- [ ] Clicking button redirects to Google
- [ ] After signing in, redirected back to app
- [ ] User is logged in
- [ ] Profile created in database

---

## 🔍 Verify User in Database

After a successful Google sign-in, check Supabase:

```sql
-- Check authenticated users
SELECT 
  id,
  email,
  raw_user_meta_data->>'full_name' as full_name,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  provider,
  created_at
FROM auth.users
WHERE provider = 'google'
ORDER BY created_at DESC;
```

```sql
-- Check profiles were created
SELECT 
  p.id,
  p.full_name,
  p.avatar_url,
  p.subscription_status,
  u.email
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.provider = 'google'
ORDER BY p.created_at DESC;
```

---

## 🆘 Troubleshooting

### Issue: "Redirect URI mismatch" error

**Cause:** The redirect URI in Google Console doesn't match Supabase callback URL

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth Client ID
3. Check "Authorized redirect URIs"
4. Make sure it **exactly matches** your Supabase callback URL:
   ```
   https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback
   ```
5. Save changes
6. Wait 5 minutes for changes to propagate
7. Try again

---

### Issue: "Invalid client ID" error

**Cause:** Client ID not correctly configured in Supabase

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Copy your Client ID again (the full string)
3. Go to Supabase → Authentication → Providers → Google
4. Re-paste the Client ID
5. Make sure there are no extra spaces
6. Save

---

### Issue: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not properly configured

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Make sure "Publishing status" is set to "Testing" or "Published"
3. Add your email to "Test users" if in testing mode
4. Make sure `supabase.co` is in "Authorized domains"
5. Save and try again

---

### Issue: Button doesn't appear

**Check:**
1. Google provider is enabled in Supabase
2. Client ID and Secret are saved in Supabase
3. Your code imports and uses the button component
4. No JavaScript errors in browser console

---

### Issue: User signs in but profile not created

**Check trigger:**
```sql
-- Verify trigger exists
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

**If missing, recreate:**
```sql
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

---

## 🔒 Security Best Practices

### 1. Keep Secrets Safe
- ✅ Never commit Client Secret to Git
- ✅ Store in environment variables (not needed for frontend)
- ✅ Only add in Supabase dashboard

### 2. Production Checklist
Before going live:
- [ ] Update OAuth consent screen with production URLs
- [ ] Add production domain to authorized domains
- [ ] Update redirect URIs to production Supabase URL
- [ ] Consider publishing OAuth app (for >100 users)
- [ ] Test thoroughly in production environment

### 3. User Data Handling
- ✅ Only request necessary scopes (email, profile)
- ✅ Follow Google's OAuth policies
- ✅ Provide privacy policy and terms of service
- ✅ Handle user data securely

---

## 📚 Additional Resources

### Google Documentation
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)
- [OAuth Consent Screen](https://support.google.com/cloud/answer/10311615)
- [OAuth Policies](https://developers.google.com/terms/api-services-user-data-policy)

### Supabase Documentation
- [Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [OAuth Flow](https://supabase.com/docs/guides/auth/social-login)

---

## 🎯 Summary

**What you need:**
1. Google Cloud Project
2. OAuth Client ID
3. OAuth Client Secret
4. Supabase callback URL as redirect URI

**Setup time:** ~10-15 minutes

**What users get:**
- ✨ One-click sign-in with Google
- ✨ No password to remember
- ✨ Automatic profile creation
- ✨ Avatar and name pre-filled

**Your app now supports:**
- ✅ Email/Password authentication
- ✅ Google OAuth authentication
- ✅ Automatic profile creation for both methods

---

## ✅ Next Steps

After setting up Google OAuth:

1. **Test thoroughly** with different Google accounts
2. **Add more providers** (GitHub, Facebook, etc.) if needed
3. **Update UI** to prominently show social login options
4. **Monitor usage** in Supabase dashboard
5. **Prepare for production** by updating all URLs

---

**Need help?** 
- Check the troubleshooting section above
- Review Supabase logs: Dashboard → Logs → Auth logs
- Check browser console for JavaScript errors
- Review Google Cloud Console audit logs
