# Razorpay Integration Setup Guide

This guide will help you set up Razorpay payment gateway for your SaiNo1Code application.

## Why Razorpay?

Razorpay is India's leading payment gateway that supports:
- ✅ UPI, Cards, NetBanking, Wallets
- ✅ Easy signup for individuals (no company registration required initially)
- ✅ Test mode available immediately
- ✅ Full subscription/recurring billing support
- ✅ Developer-friendly API similar to Stripe

---

## Step 1: Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Click "Sign Up" and create your account
3. Verify your email address
4. You'll land on the Razorpay Dashboard

---

## Step 2: Get Your API Keys

### Test Mode Keys (Start Here)
1. In the Razorpay Dashboard, go to **Settings** → **API Keys**
2. Click **Generate Test Key**
3. You'll see:
   - **Key ID**: `rzp_test_xxxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxxxxx`
4. Copy both keys - you'll need them in your `.env.local` file

### Live Mode Keys (For Production)
1. Complete KYC verification:
   - Submit PAN card
   - Bank account details
   - Business/Individual verification
2. Once approved, generate Live API Keys:
   - **Key ID**: `rzp_live_xxxxxxxxxxxxx`
   - **Key Secret**: `xxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 3: Create Subscription Plans

You need to create subscription plans in the Razorpay Dashboard that match your pricing tiers.

1. Go to **Subscriptions** → **Plans**
2. Click **Create New Plan**

### Create these plans:

#### Starter Plan - Monthly
- **Plan Name**: Starter Monthly
- **Billing Interval**: Monthly
- **Billing Amount**: ₹1,200 (or $15 equivalent in INR)
- **Currency**: INR
- **Description**: Individual developers & small projects
- **Plan ID**: Copy this (e.g., `plan_xxxxxxxxxxxxx`)

#### Starter Plan - Annual
- **Plan Name**: Starter Annual
- **Billing Interval**: Monthly
- **Billing Amount**: ₹1,350 (₹162 annual / 12 months)
- **Currency**: INR
- **Total Billing Cycles**: 12
- **Plan ID**: Copy this

#### Professional Plan - Monthly
- **Plan Name**: Professional Monthly
- **Billing Interval**: Monthly
- **Billing Amount**: ₹3,900 (or $49 equivalent in INR)
- **Currency**: INR
- **Plan ID**: Copy this

#### Professional Plan - Annual
- **Plan Name**: Professional Annual
- **Billing Interval**: Monthly
- **Billing Amount**: ₹4,400 (₹529 annual / 12 months)
- **Currency**: INR
- **Total Billing Cycles**: 12
- **Plan ID**: Copy this

#### Team Plan - Monthly
- **Plan Name**: Team Monthly
- **Billing Interval**: Monthly
- **Billing Amount**: ₹7,900 (or $99 equivalent in INR)
- **Currency**: INR
- **Plan ID**: Copy this

#### Team Plan - Annual
- **Plan Name**: Team Annual
- **Billing Interval**: Monthly
- **Billing Amount**: ₹8,900 (₹1069 annual / 12 months)
- **Currency**: INR
- **Total Billing Cycles**: 12
- **Plan ID**: Copy this

---

## Step 4: Update Your Environment Variables

Create or update your `.env.local` file with the following:

```bash
# Razorpay API Keys (Test Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here

# Razorpay Webhook Secret (see Step 5)
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here

# Keep your existing Supabase keys
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Important Notes:**
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` is exposed to the client (browser)
- `RAZORPAY_KEY_SECRET` must remain server-side only
- Never commit these keys to version control

---

## Step 5: Setup Webhooks

Webhooks allow Razorpay to notify your application about payment events.

1. Go to **Settings** → **Webhooks** in Razorpay Dashboard
2. Click **Create New Webhook**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/razorpay
   ```
   (For local testing, use ngrok or similar tunnel service)

4. Select these events:
   - ✅ `subscription.activated`
   - ✅ `subscription.charged`
   - ✅ `subscription.cancelled`
   - ✅ `subscription.paused`
   - ✅ `subscription.resumed`

5. Set **Alert Email** (optional)
6. Click **Create Webhook**
7. Copy the **Webhook Secret** and add it to your `.env.local` as `RAZORPAY_WEBHOOK_SECRET`

---

## Step 6: Update Plan IDs in Code

Open `src/app/pricing/page.tsx` and replace the placeholder plan IDs with your actual Razorpay plan IDs:

```typescript
const pricingTiers = [
  {
    name: "Starter",
    priceIds: { 
      monthly: 'plan_xxxxxxxxxxxxx', // Replace with your actual plan_id
      annual: 'plan_xxxxxxxxxxxxx'   // Replace with your actual plan_id
    },
    // ...
  },
  // ... update all plans
];
```

---

## Step 7: Update Supabase Database Schema

Add these columns to your `profiles` table in Supabase:

```sql
-- Add Razorpay subscription columns
ALTER TABLE profiles
ADD COLUMN razorpay_customer_id TEXT,
ADD COLUMN razorpay_subscription_id TEXT,
ADD COLUMN razorpay_plan_id TEXT,
ADD COLUMN razorpay_current_period_start TIMESTAMP,
ADD COLUMN razorpay_current_period_end TIMESTAMP,
ADD COLUMN subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN last_payment_id TEXT,
ADD COLUMN last_payment_amount NUMERIC,
ADD COLUMN last_payment_date TIMESTAMP;

-- Create index for faster lookups
CREATE INDEX idx_razorpay_subscription_id ON profiles(razorpay_subscription_id);
CREATE INDEX idx_razorpay_customer_id ON profiles(razorpay_customer_id);
```

---

## Step 8: Install Dependencies

Run the following command to install Razorpay SDK:

```bash
npm install razorpay
```

Remove old Stripe dependencies:
```bash
npm uninstall stripe @stripe/stripe-js
```

---

## Step 9: Test the Integration

### Test Mode Testing
1. Ensure you're using test API keys
2. Use Razorpay's test cards:
   - **Card Number**: `4111 1111 1111 1111`
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date
   - **Name**: Any name

3. Test the checkout flow:
   - Go to `/pricing`
   - Click "Get Started" on any plan
   - Complete the checkout with test card
   - Verify the subscription in Razorpay Dashboard

### Webhook Testing (Local Development)
1. Install ngrok: `npm install -g ngrok`
2. Run your app: `npm run dev`
3. In another terminal: `ngrok http 3000`
4. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
5. Update webhook URL in Razorpay Dashboard to: `https://abc123.ngrok.io/api/webhooks/razorpay`
6. Test a payment and check terminal logs for webhook events

---

## Step 10: Go Live

When ready for production:

1. **Complete KYC** in Razorpay Dashboard
2. **Switch to Live Keys**:
   ```bash
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_live_secret
   ```
3. **Update Webhook URL** to production domain
4. **Test with real payment** (use small amount first)
5. **Monitor** Razorpay Dashboard for successful payments

---

## Troubleshooting

### Issue: "Cannot find module 'razorpay'"
**Solution**: Run `npm install` after updating package.json

### Issue: Webhook signature verification fails
**Solution**: 
- Check that `RAZORPAY_WEBHOOK_SECRET` matches the one in Razorpay Dashboard
- Ensure webhook URL is correct
- Check server logs for detailed error messages

### Issue: Checkout not opening
**Solution**:
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is correct
- Check browser console for JavaScript errors
- Ensure Razorpay script is loading (check Network tab)

### Issue: Payment successful but user not upgraded
**Solution**:
- Check webhook logs in your application
- Verify webhook is configured correctly in Razorpay Dashboard
- Check Supabase `profiles` table for updates

---

## Razorpay Dashboard URLs

- **Test Dashboard**: https://dashboard.razorpay.com/test/dashboard
- **Live Dashboard**: https://dashboard.razorpay.com/live/dashboard
- **API Documentation**: https://razorpay.com/docs/api/

---

## Pricing & Fees

### Razorpay Transaction Fees
- **Domestic Cards**: 2% per transaction
- **International Cards**: 3% per transaction
- **UPI**: 2% per transaction
- **Wallets**: 2% per transaction
- **Net Banking**: 2% per transaction

### Settlement Time
- **Standard**: T+2 days (2 business days)
- **Instant Settlement**: Available with extra fee

---

## Support

If you encounter any issues:
1. Check Razorpay documentation: https://razorpay.com/docs/
2. Contact Razorpay support: support@razorpay.com
3. Check your application logs for detailed error messages

---

## Security Best Practices

1. ✅ Never expose `RAZORPAY_KEY_SECRET` to the client
2. ✅ Always verify webhook signatures
3. ✅ Use HTTPS in production
4. ✅ Store payment data securely in Supabase
5. ✅ Log all payment events for audit trail
6. ✅ Implement rate limiting on payment endpoints
7. ✅ Monitor for suspicious payment patterns

---

## Next Steps

1. ✅ Complete Razorpay account setup
2. ✅ Get API keys
3. ✅ Create subscription plans
4. ✅ Update environment variables
5. ✅ Setup webhooks
6. ✅ Update plan IDs in code
7. ✅ Update database schema
8. ✅ Test with test keys
9. ✅ Go live with production keys

---

**Congratulations!** 🎉 Your Razorpay integration is now complete. You can now accept payments from customers in India.
