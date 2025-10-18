# 🚀 Quick Deployment Checklist for Netlify

## ✅ Pre-Deployment Setup (Complete)

- [x] `netlify.toml` created with correct configuration
- [x] `.nvmrc` created (Node.js 18)
- [x] `@netlify/plugin-nextjs` installed
- [x] npm script `netlify` added to package.json
- [x] Authentication flow implemented and tested

## 📋 Next Steps (You Need to Do)

### 1. Push Code to Git (Required)

```powershell
# If not already done
git add .
git commit -m "Add Netlify configuration and authentication"
git push origin main
```

### 2. Deploy to Netlify

**Option A: Via Netlify Dashboard (Easiest)**

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Use these settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

**Option B: Via CLI**

```powershell
# Install Netlify CLI globally
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### 3. Add Environment Variables in Netlify

Go to **Site settings** → **Environment variables** and add:

```env
# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://kgpctabhtsrrdyxetawz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Razorpay (REQUIRED)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Encryption (REQUIRED)
ENCRYPTION_KEY=your_32_character_encryption_key
```

### 4. Update OAuth Redirect URIs

**After deployment, update these:**

#### Google Cloud Console:
1. Go to APIs & Services → Credentials
2. Edit OAuth 2.0 Client ID
3. Add Authorized redirect URI:
   ```
   https://your-site-name.netlify.app/auth/callback
   ```
4. Add Authorized JavaScript origin:
   ```
   https://your-site-name.netlify.app
   ```

#### Supabase Dashboard:
1. Go to Authentication → URL Configuration
2. Update **Site URL**:
   ```
   https://your-site-name.netlify.app
   ```
3. Add **Redirect URLs**:
   ```
   https://your-site-name.netlify.app/auth/callback
   https://your-site-name.netlify.app/dashboard
   ```

### 5. Test After Deployment

- [ ] Homepage loads
- [ ] Sign in with Google works
- [ ] Dashboard accessible
- [ ] API routes work
- [ ] Database connections work
- [ ] Trial modal appears for new users
- [ ] Avatar dropdown works
- [ ] Mobile responsive

## 🎯 Important Configuration Values

### Base Directory
```
(leave empty) or "."
```

### Build Command
```
npm run build
```

### Publish Directory
```
.next
```

### Node Version
```
18
```

## 📝 Files Created for Netlify

- ✅ `netlify.toml` - Main configuration
- ✅ `.nvmrc` - Node version specification
- ✅ `NETLIFY_DEPLOYMENT_GUIDE.md` - Full documentation
- ✅ Updated `package.json` with netlify script

## 🔗 Your Site URL

After deployment, your site will be available at:
```
https://your-site-name.netlify.app
```

You can customize the subdomain or add a custom domain in Netlify settings.

## 🐛 Common Issues

### Build Fails
- Check environment variables are set
- Check Node version is 18
- Check build logs in Netlify dashboard

### OAuth Not Working
- Verify redirect URIs are updated
- Check Supabase redirect URLs
- Test with incognito mode

### API Routes 404
- Ensure `@netlify/plugin-nextjs` is installed
- Check `netlify.toml` has the plugin
- Redeploy after adding plugin

## 📚 Documentation

See `NETLIFY_DEPLOYMENT_GUIDE.md` for complete step-by-step instructions.

---

**Status**: ✅ Ready to deploy!  
**Next Action**: Push to Git and deploy via Netlify dashboard or CLI
