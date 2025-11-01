#  Netlify Deployment Fix - sainocode.netlify.app

##  Problem Identified

**Issue**: Site showing "404 - Site not found" error at sainocode.netlify.app

**Root Cause**: The website code is perfect, but either:
1. Site isn't deployed to Netlify yet
2. Site is deployed but environment variables are missing
3. Build failed due to configuration issues

---

##  Solution: Step-by-Step Fix

### Step 1: Verify Netlify Account

1. Go to: https://app.netlify.com/
2. Log in with your account
3. Check if sainocode site exists in your dashboard

**If site doesn't exist**: Follow Step 2-5 below
**If site exists**: Skip to Step 6 (Configure Environment Variables)

---

### Step 2: Create New Netlify Site

1. Click **"Add new site"**  **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify if prompted
4. Select repository: saichaithanya0705/saino1code-website
5. Select branch: eat/sainocode-website

---

### Step 3: Configure Build Settings

**CRITICAL**: Use these EXACT settings:

`
Branch to deploy: feat/sainocode-website
Base directory: (leave EMPTY)
Build command: npm run build
Publish directory: .next
`

**DO NOT** click Deploy yet! First, add environment variables.

---

### Step 4: Set Site Name

1. Go to **Site settings**  **General**  **Site details**
2. Click **"Change site name"**
3. Enter: sainocode
4. Save changes

This will make your site available at: https://sainocode.netlify.app

---

### Step 5: Add Environment Variables (CRITICAL!)

Go to **Site settings**  **Environment variables**  **Add a variable**

Add ALL of these variables:

#### Supabase Configuration (Required)
`
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
`

**How to get these:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings  API
4. Copy "Project URL" and "anon public" key

#### Razorpay Configuration (Required for payments)
`
NEXT_PUBLIC_RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_secret>
RAZORPAY_WEBHOOK_SECRET=<your_webhook_secret>
`

**How to get these:**
1. Go to https://dashboard.razorpay.com/
2. Settings  API Keys
3. Copy Key ID and Secret
4. Settings  Webhooks  Copy Webhook Secret

---

### Step 6: Deploy the Site

1. Click **"Deploy site"**  OR  **"Trigger deploy"** if site already exists
2. Wait 2-4 minutes for build to complete
3. Check build logs for any errors

**Expected build output:**
`
 Generating static pages
 Finalizing page optimization
 Build complete
`

---

### Step 7: Update OAuth Redirect URLs

After deployment, update these configurations:

#### Supabase Settings

1. Go to https://supabase.com/dashboard
2. Select your project
3. **Authentication**  **URL Configuration**
4. Update:
   - **Site URL**: https://sainocode.netlify.app
   - **Redirect URLs**: Add both:
     `
     https://sainocode.netlify.app/auth/callback
     https://sainocode.netlify.app/**
     `
5. **Save**

#### Google Cloud Console (for Google OAuth)

1. Go to https://console.cloud.google.com/
2. **APIs & Services**  **Credentials**
3. Click your OAuth 2.0 Client ID
4. **Authorized redirect URIs**  Add:
   `
   https://sainocode.netlify.app/auth/callback
   https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback
   `
5. **Authorized JavaScript origins**  Add:
   `
   https://sainocode.netlify.app
   `
6. **Save**

---

##  Test Authentication

After deployment:

1. Visit: https://sainocode.netlify.app/login
2. Click **"Google"** button
3. You should be redirected to Google sign-in
4. After signing in, you should land on the dashboard

**If authentication fails:**
- Check browser console for errors
- Verify environment variables are set correctly
- Verify OAuth redirect URLs match exactly

---

##  Troubleshooting

### Build Fails

**Error**: "Command failed with exit code 1"

**Solution**:
1. Check build logs in Netlify
2. Common issues:
   - Missing environment variables
   - Node version mismatch (should be 18)
   - npm install errors

### 404 Error Persists

**Error**: Still showing "Site not found"

**Solution**:
1. Verify site name is exactly: sainocode
2. Check DNS settings (should be automatic)
3. Wait 5 minutes for DNS propagation
4. Clear browser cache: Ctrl+Shift+R

### OAuth Not Working

**Error**: "redirect_uri_mismatch" or similar

**Solution**:
1. Double-check redirect URLs in Google Cloud Console
2. Ensure they match EXACTLY (including https://)
3. No trailing slashes in origins
4. Wait 5 minutes after saving changes

### Environment Variables Not Loading

**Error**: "NEXT_PUBLIC_SUPABASE_URL is undefined"

**Solution**:
1. Verify variables are added in Netlify (not just .env.local)
2. Variable names must match EXACTLY (case-sensitive)
3. After adding variables, **trigger a new deploy**
4. Old builds don't get new variables automatically

---

##  Final Checklist

Before testing, confirm:

- [x] Site deployed to Netlify successfully
- [x] Site name is sainocode
- [x] URL is accessible: https://sainocode.netlify.app
- [x] All environment variables added in Netlify dashboard
- [x] Supabase redirect URLs updated
- [x] Google Cloud Console redirect URLs updated
- [x] Build completed without errors
- [x] Site loads (no 404)

---

##  Expected Result

After following these steps:

1.  https://sainocode.netlify.app loads successfully
2.  Login page shows Google/GitHub/Microsoft buttons
3.  Clicking Google redirects to Google sign-in
4.  After signing in, user lands on dashboard
5.  API key is generated automatically for VS Code

---

##  Still Having Issues?

If problems persist after following all steps:

1. **Check Netlify build logs**: Site settings  Deploys  Click latest deploy
2. **Check browser console**: F12  Console tab
3. **Verify environment variables**: Site settings  Environment variables
4. **Check Supabase logs**: Dashboard  Logs
5. **Test locally first**: 
pm run dev should work on localhost:3000

---

##  Quick Commands

### Redeploy from Git
`ash
cd d:\sainocode-website
git push origin feat/sainocode-website
`
Then trigger deploy in Netlify dashboard.

### Test locally
`ash
cd d:\sainocode-website
npm install
npm run dev
`
Visit: http://localhost:3000

---

**Last Updated**: November 1, 2025
**Status**: Ready to deploy
**Expected Build Time**: 2-4 minutes
**Expected Result**: Fully functional authentication at https://sainocode.netlify.app
