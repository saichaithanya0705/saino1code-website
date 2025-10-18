# 🚀 Netlify Deployment - Quick Commands

## Installation & Setup

```powershell
# Install Netlify CLI (if using CLI method)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize Netlify site
netlify init
```

## Deployment Commands

```powershell
# Deploy to draft URL (testing)
netlify deploy

# Deploy to production
netlify deploy --prod

# Or use the npm script
npm run netlify
```

## Configuration Summary

```
Base Directory:     (empty) or "."
Build Command:      npm run build
Publish Directory:  .next
Node Version:       18
```

## Files Created

- ✅ netlify.toml
- ✅ .nvmrc
- ✅ NETLIFY_DEPLOYMENT_GUIDE.md
- ✅ DEPLOYMENT_CHECKLIST.md

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=https://kgpctabhtsrrdyxetawz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_secret
ENCRYPTION_KEY=your_key
```

Add these in Netlify Dashboard → Site Settings → Environment Variables

## Post-Deployment Updates

### Google OAuth
Add redirect URI in Google Cloud Console:
```
https://your-site-name.netlify.app/auth/callback
```

### Supabase
Update Site URL and Redirect URLs in Supabase Dashboard:
```
https://your-site-name.netlify.app
```

---

**See NETLIFY_DEPLOYMENT_GUIDE.md for detailed instructions**
