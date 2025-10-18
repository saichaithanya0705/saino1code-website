# Deploying SaiNo1Code Website to Netlify

## 📋 Prerequisites

- Netlify account (sign up at https://www.netlify.com)
- Git repository (GitHub, GitLab, or Bitbucket)
- Project pushed to your Git repository

---

## 🚀 Deployment Methods

### Method 1: Deploy via Netlify Dashboard (Recommended)

This is the easiest method with automatic deployments on every git push.

#### Step 1: Push Your Code to Git

```powershell
# If you haven't initialized git yet
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Ready for Netlify deployment"

# Add your remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/saino1code-website.git

# Push to main branch
git push -u origin main
```

#### Step 2: Connect to Netlify

1. Go to https://app.netlify.com/
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose your Git provider (GitHub/GitLab/Bitbucket)
4. Authorize Netlify to access your repositories
5. Select your `saino1code-website` repository

#### Step 3: Configure Build Settings

In the Netlify deployment configuration, use these settings:

| Setting | Value |
|---------|-------|
| **Base directory** | `(leave empty)` or `.` |
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |
| **Functions directory** | `netlify/functions` (optional) |

**IMPORTANT**: For Next.js on Netlify, you must use the **Essential Next.js Build Plugin**.

#### Step 4: Environment Variables

Before deploying, add your environment variables:

1. In Netlify dashboard, go to **Site settings** → **Environment variables**
2. Add all variables from your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=https://kgpctabhtsrrdyxetawz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
ENCRYPTION_KEY=your_encryption_key
```

⚠️ **Never commit `.env.local` to Git!**

#### Step 5: Deploy

1. Click **"Deploy site"**
2. Netlify will automatically:
   - Install dependencies (`npm install`)
   - Run build command (`npm run build`)
   - Deploy to CDN

---

### Method 2: Deploy via Netlify CLI

For more control and local deployments.

#### Step 1: Install Netlify CLI

```powershell
# Install globally
npm install -g netlify-cli

# Or install as dev dependency
npm install --save-dev netlify-cli
```

#### Step 2: Login to Netlify

```powershell
# Login to your Netlify account
netlify login
```

This will open a browser window to authorize the CLI.

#### Step 3: Initialize Netlify Site

```powershell
# Initialize Netlify configuration
netlify init
```

Follow the prompts:
- **Create & configure a new site**: Yes
- **Team**: Select your team
- **Site name**: Enter a unique name (e.g., `saino1code-app`)
- **Build command**: `npm run build`
- **Directory to deploy**: `.next`
- **Functions directory**: `netlify/functions` (optional)

This creates a `netlify.toml` configuration file.

#### Step 4: Deploy

```powershell
# Deploy to production
netlify deploy --prod

# Or deploy to draft URL first (for testing)
netlify deploy
```

---

## 📝 Configuration Files

### 1. Create `netlify.toml` (Essential!)

Create this file in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"
  # Base directory - leave empty for root
  base = ""

# Essential Next.js Plugin for Netlify
[[plugins]]
  package = "@netlify/plugin-nextjs"

# Redirect rules for Next.js
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Headers for security and performance
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Cache static assets
[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Environment variables (optional - better to use Netlify dashboard)
# [build.environment]
#   NODE_VERSION = "18"
```

### 2. Update `package.json` Scripts

Make sure your `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "netlify": "netlify deploy --prod"
  }
}
```

### 3. Create `.nvmrc` (Optional but Recommended)

Specify Node.js version for consistency:

```
18
```

Or for Node 20:

```
20
```

---

## 🔧 Build Settings Summary

### For Netlify Dashboard:

```
Base directory: (empty)
Build command: npm run build
Publish directory: .next
Node version: 18 or 20
```

### Environment Variables Needed:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://kgpctabhtsrrdyxetawz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Encryption
ENCRYPTION_KEY=your_32_char_key_here
```

---

## ⚠️ Important Next.js on Netlify Notes

### 1. Install Essential Next.js Plugin

The `@netlify/plugin-nextjs` is **required** for Next.js to work properly on Netlify.

```powershell
npm install --save-dev @netlify/plugin-nextjs
```

### 2. API Routes

Your Next.js API routes (`/api/*`) will automatically work as serverless functions on Netlify.

### 3. Middleware

Your `src/middleware.ts` will work correctly with the Next.js plugin.

### 4. ISR (Incremental Static Regeneration)

Next.js ISR features are supported with the plugin.

### 5. Image Optimization

Next.js Image component works, but consider using Netlify's image optimization for better performance.

---

## 🎯 Complete Deployment Checklist

### Before Deployment:

- [ ] Code pushed to Git repository
- [ ] `.env.local` added to `.gitignore`
- [ ] `netlify.toml` created with correct settings
- [ ] `@netlify/plugin-nextjs` installed
- [ ] All environment variables documented

### In Netlify Dashboard:

- [ ] Repository connected
- [ ] Build command set to `npm run build`
- [ ] Publish directory set to `.next`
- [ ] All environment variables added
- [ ] Essential Next.js plugin enabled

### After First Deployment:

- [ ] Test all pages load correctly
- [ ] Test API routes work
- [ ] Test authentication (Google OAuth redirect URIs)
- [ ] Test database connections
- [ ] Test Razorpay integration
- [ ] Check console for errors
- [ ] Test mobile responsiveness

---

## 🔄 Update Google OAuth Redirect URIs

After deployment, update your Google Cloud Console OAuth settings:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Select your OAuth 2.0 Client ID
3. Add Authorized redirect URIs:
   ```
   https://your-site-name.netlify.app/auth/callback
   https://kgpctabhtsrrdyxetawz.supabase.co/auth/v1/callback
   ```
4. Add Authorized JavaScript origins:
   ```
   https://your-site-name.netlify.app
   ```

---

## 🔄 Update Supabase Settings

Update your Supabase project settings:

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Update **Site URL**:
   ```
   https://your-site-name.netlify.app
   ```
3. Add **Redirect URLs**:
   ```
   https://your-site-name.netlify.app/auth/callback
   https://your-site-name.netlify.app/dashboard
   ```

---

## 🚀 CLI Commands Quick Reference

```powershell
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize new site
netlify init

# Deploy to draft URL (testing)
netlify deploy

# Deploy to production
netlify deploy --prod

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# View build logs
netlify build

# Link existing site
netlify link

# Check status
netlify status

# Set environment variables
netlify env:set VARIABLE_NAME value

# List environment variables
netlify env:list
```

---

## 🐛 Troubleshooting

### Build Fails with "Module not found"

```powershell
# Clear node_modules and reinstall
rm -r node_modules
npm install

# Or clear cache and reinstall
npm cache clean --force
npm install
```

### API Routes Return 404

- Ensure `@netlify/plugin-nextjs` is installed
- Check `netlify.toml` has the plugin configured
- Verify `export const dynamic = "force-dynamic"` in API routes

### Environment Variables Not Working

- Check variable names match exactly (case-sensitive)
- Redeploy after adding variables
- Check Netlify build logs for variable loading

### OAuth Redirect Fails

- Update Google Cloud Console redirect URIs
- Update Supabase redirect URLs
- Check callback route is `/auth/callback`

### Build Takes Too Long

- Optimize dependencies
- Use `npm ci` instead of `npm install` in build command
- Enable Netlify build plugins caching

---

## 📊 Deployment Flow Diagram

```
Local Development
       ↓
Git Push to Repository (GitHub/GitLab)
       ↓
Netlify Detects Changes
       ↓
Netlify Build Process:
  1. Clone repository
  2. Install Node.js 18/20
  3. npm install
  4. Load environment variables
  5. npm run build
  6. Deploy .next folder to CDN
       ↓
Site Live at: https://your-site-name.netlify.app
       ↓
Automatic deployments on every push!
```

---

## 🎉 Post-Deployment

### 1. Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Follow DNS configuration instructions
4. SSL certificate auto-generated

### 2. Monitor Deployments

- View deployment history in dashboard
- Check build logs for errors
- Set up deployment notifications (Slack, email)

### 3. Performance Optimization

- Enable Netlify Analytics
- Use Netlify Edge Functions for faster API responses
- Enable asset optimization
- Configure caching headers

---

## 📝 Example `netlify.toml` for This Project

```toml
[build]
  command = "npm run build"
  publish = ".next"
  base = ""

[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 🎯 Quick Start Commands

```powershell
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Install Next.js plugin
npm install --save-dev @netlify/plugin-nextjs

# 3. Login
netlify login

# 4. Initialize and deploy
netlify init

# 5. Deploy to production
netlify deploy --prod
```

---

**Base Directory**: Leave **empty** or set to `.` (root)  
**Build Command**: `npm run build`  
**Publish Directory**: `.next`  
**Node Version**: `18` or `20`

Your site will be live at: `https://your-site-name.netlify.app`

🚀 **Ready to deploy!**
