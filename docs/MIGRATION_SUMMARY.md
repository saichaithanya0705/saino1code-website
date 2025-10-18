# Stripe to Razorpay Migration Summary

## Overview
This document summarizes the migration from Stripe to Razorpay payment gateway for the SaiNo1Code application.

---

## Why Razorpay?

**Problem:** Stripe is not available in India, making it impossible to accept payments from Indian customers.

**Solution:** Razorpay is India's leading payment gateway that:
- ✅ Works for individuals without company registration (initially)
- ✅ Supports all Indian payment methods (UPI, Cards, NetBanking, Wallets)
- ✅ Has a similar API to Stripe for easy migration
- ✅ Provides immediate test mode access
- ✅ Fully supports subscription/recurring billing

---

## Changes Made

### 1. Dependencies Updated
**File:** `package.json`

**Removed:**
```json
"@stripe/stripe-js": "^3.5.0",
"stripe": "^15.8.0"
```

**Added:**
```json
"razorpay": "^2.9.4"
```

### 2. New Library Files Created

#### `src/lib/razorpay.ts`
- Server-side Razorpay initialization
- Payment signature verification
- Webhook signature verification

#### `src/lib/razorpay-client.ts`
- Client-side Razorpay script loader
- Checkout modal helpers
- TypeScript interfaces for Razorpay options

### 3. API Routes Updated

#### `src/app/api/create-checkout-session/route.ts`
**Changes:**
- Replaced Stripe session creation with Razorpay subscription creation
- Added billing cycle handling
- Returns subscription ID and Razorpay key ID for client-side checkout

#### `src/app/api/webhooks/stripe/route.ts`
**Changes:**
- Replaced Stripe webhook handling with Razorpay webhook handling
- Added signature verification for security
- Handles multiple subscription events:
  - `subscription.activated` - Initial payment success
  - `subscription.charged` - Recurring payment success
  - `subscription.cancelled` - User cancelled subscription
  - `subscription.paused` - Subscription paused
  - `subscription.resumed` - Subscription resumed

#### `src/app/api/create-portal-session/route.ts`
**Changes:**
- Replaced Stripe billing portal with custom subscription info API
- Returns subscription details for display in dashboard
- Note: Razorpay doesn't have a built-in customer portal like Stripe

### 4. Frontend Components Updated

#### `src/app/pricing/page.tsx`
**Changes:**
- Replaced Stripe checkout with Razorpay checkout
- Updated plan IDs to use Razorpay format
- Integrated Razorpay checkout modal
- Added billing cycle parameter
- Updated checkout handler to use `openRazorpayCheckout`

#### `src/components/billing-form.tsx`
**Changes:**
- Replaced Stripe portal redirect with custom subscription display
- Shows current subscription details
- Displays payment history and next billing date
- Links to support for subscription management

### 5. Documentation Created

#### `docs/setup/razorpay-setup.md`
Complete setup guide covering:
- Account creation
- API key generation
- Subscription plan creation
- Environment variable configuration
- Webhook setup
- Database schema updates
- Testing procedures
- Going live checklist
- Troubleshooting guide

#### `docs/setup/QUICK_REFERENCE.md`
Quick reference guide with:
- Setup checklist
- Files modified list
- Environment variables needed
- Database schema SQL
- Webhook configuration
- Test cards
- Common issues and solutions
- Resource links

#### `.env.example`
Updated template with:
- Razorpay API keys
- Webhook secret
- Supabase configuration
- Clear comments and instructions

---

## Database Schema Changes

### New Columns in `profiles` Table

```sql
razorpay_customer_id TEXT
razorpay_subscription_id TEXT
razorpay_plan_id TEXT
razorpay_current_period_start TIMESTAMP
razorpay_current_period_end TIMESTAMP
subscription_status TEXT
last_payment_id TEXT
last_payment_amount NUMERIC
last_payment_date TIMESTAMP
```

**Old Stripe columns can be kept for historical data or removed:**
```sql
stripe_customer_id
stripe_subscription_id
stripe_price_id
stripe_current_period_end
```

---

## Environment Variables

### Required New Variables:
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

### No Longer Needed (can remove):
```bash
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
```

---

## Implementation Differences: Stripe vs Razorpay

| Feature | Stripe | Razorpay |
|---------|--------|----------|
| **Checkout** | Redirect to Stripe hosted page | Modal popup on same page |
| **Customer Portal** | Built-in portal | Custom implementation needed |
| **Webhook Events** | `checkout.session.completed` | `subscription.activated` |
| **API Keys** | `sk_test_...`, `pk_test_...` | `rzp_test_...` (single format) |
| **Currency** | USD | INR (Indian Rupees) |
| **Payment Methods** | Cards, wallets | Cards, UPI, NetBanking, wallets |
| **Test Cards** | 4242 4242 4242 4242 | 4111 1111 1111 1111 |

---

## Testing Checklist

Before going live, ensure:

- [ ] API keys configured in `.env.local`
- [ ] Subscription plans created in Razorpay Dashboard
- [ ] Plan IDs updated in pricing page
- [ ] Webhook configured and tested
- [ ] Database schema updated
- [ ] Dependencies installed
- [ ] Test payment completed successfully
- [ ] Webhook events received and processed
- [ ] User profile updated correctly
- [ ] Subscription visible in dashboard
- [ ] Error handling works correctly
- [ ] Loading states work properly

---

## Next Steps for You

1. **Create Razorpay Account**
   - Go to https://razorpay.com and sign up
   - Verify your email

2. **Get API Keys**
   - Dashboard → Settings → API Keys
   - Generate test keys
   - Copy Key ID and Key Secret

3. **Create Subscription Plans**
   - Dashboard → Subscriptions → Plans
   - Create 6 plans (Starter, Pro, Team - each monthly & annual)
   - Note down all plan IDs

4. **Update Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in your Razorpay API keys
   - Add webhook secret (after step 5)

5. **Setup Webhook**
   - Dashboard → Settings → Webhooks
   - Add webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
   - Select subscription events
   - Copy webhook secret to `.env.local`

6. **Update Plan IDs in Code**
   - Open `src/app/pricing/page.tsx`
   - Replace placeholder plan IDs with your actual Razorpay plan IDs

7. **Update Database**
   - Run the SQL schema update in Supabase
   - Create indexes for performance

8. **Install Dependencies**
   ```bash
   npm install
   ```

9. **Test Everything**
   - Run the app: `npm run dev`
   - Try a test payment
   - Verify webhook events
   - Check database updates

10. **Go Live**
    - Complete KYC in Razorpay
    - Switch to live API keys
    - Update webhook to production URL
    - Test with real payment (small amount)

---

## Support & Resources

- **Setup Guide:** `docs/setup/razorpay-setup.md`
- **Quick Reference:** `docs/setup/QUICK_REFERENCE.md`
- **Razorpay Docs:** https://razorpay.com/docs/
- **Razorpay Support:** support@razorpay.com

---

## Migration Completion Status

✅ **Completed:**
- [x] Dependencies updated
- [x] Library files created
- [x] API routes updated
- [x] Frontend components updated
- [x] Documentation created
- [x] Environment template created

⏳ **Pending (Your Action Required):**
- [ ] Create Razorpay account
- [ ] Get API keys
- [ ] Create subscription plans
- [ ] Update `.env.local`
- [ ] Update plan IDs in code
- [ ] Setup webhook
- [ ] Update database schema
- [ ] Install dependencies
- [ ] Test the integration

---

**All code changes are complete!** You now need to configure your Razorpay account and update the environment variables to start accepting payments.
