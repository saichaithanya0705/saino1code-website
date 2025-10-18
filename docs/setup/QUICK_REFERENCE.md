# Razorpay Integration - Quick Reference

## 🚀 Quick Start Checklist

- [ ] 1. Create Razorpay account at [razorpay.com](https://razorpay.com)
- [ ] 2. Get API keys from Dashboard → Settings → API Keys
- [ ] 3. Create subscription plans in Dashboard → Subscriptions → Plans
- [ ] 4. Update `.env.local` with API keys and webhook secret
- [ ] 5. Update plan IDs in `src/app/pricing/page.tsx`
- [ ] 6. Setup webhook in Razorpay Dashboard
- [ ] 7. Update Supabase database schema
- [ ] 8. Run `npm install` to install dependencies
- [ ] 9. Test with test API keys
- [ ] 10. Go live with production keys

---

## 📝 Files Modified

### New Files Created:
- `src/lib/razorpay.ts` - Server-side Razorpay configuration
- `src/lib/razorpay-client.ts` - Client-side Razorpay helpers
- `docs/setup/razorpay-setup.md` - Complete setup guide
- `.env.example` - Environment variables template

### Files Updated:
- `package.json` - Updated dependencies
- `src/app/api/create-checkout-session/route.ts` - Razorpay checkout
- `src/app/api/webhooks/stripe/route.ts` - Razorpay webhooks (rename to razorpay)
- `src/app/api/create-portal-session/route.ts` - Subscription management
- `src/app/pricing/page.tsx` - Razorpay integration
- `src/components/billing-form.tsx` - Subscription display

---

## 🔑 Environment Variables Required

```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## 📦 Subscription Plan IDs to Update

In `src/app/pricing/page.tsx`, replace placeholders with actual Razorpay plan IDs:

```typescript
// TODO: Update these with your Razorpay plan_ids
priceIds: { 
  monthly: 'plan_xxxxxxxxxxxxx',  // From Razorpay Dashboard
  annual: 'plan_xxxxxxxxxxxxx'     // From Razorpay Dashboard
}
```

You need to create 6 plans total:
1. Starter Monthly
2. Starter Annual
3. Professional Monthly
4. Professional Annual
5. Team Monthly
6. Team Annual

---

## 🗄️ Database Schema Changes

Run this SQL in Supabase SQL Editor:

```sql
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

CREATE INDEX idx_razorpay_subscription_id ON profiles(razorpay_subscription_id);
CREATE INDEX idx_razorpay_customer_id ON profiles(razorpay_customer_id);
```

---

## 🔗 Webhook Configuration

**Webhook URL:** `https://yourdomain.com/api/webhooks/razorpay`

**Events to Subscribe:**
- `subscription.activated`
- `subscription.charged`
- `subscription.cancelled`
- `subscription.paused`
- `subscription.resumed`

**For Local Testing:**
1. Install ngrok: `npm install -g ngrok`
2. Run: `ngrok http 3000`
3. Use ngrok URL as webhook URL
4. Example: `https://abc123.ngrok.io/api/webhooks/razorpay`

---

## 🧪 Test Cards

Use these test cards in Razorpay test mode:

| Card Number | Type | Result |
|-------------|------|--------|
| 4111 1111 1111 1111 | Visa | Success |
| 5555 5555 5555 4444 | Mastercard | Success |
| Any CVV | - | Any 3 digits |
| Any Expiry | - | Any future date |

---

## 💰 Pricing Conversion (USD to INR)

Current exchange rate: ~₹80 per $1

| Plan | USD | INR (approx) |
|------|-----|--------------|
| Starter Monthly | $15 | ₹1,200 |
| Starter Annual | $162 | ₹12,960 |
| Professional Monthly | $49 | ₹3,920 |
| Professional Annual | $529 | ₹42,320 |
| Team Monthly | $99 | ₹7,920 |
| Team Annual | $1,069 | ₹85,520 |

**Note:** Adjust pricing based on current exchange rates and your business needs.

---

## 🚨 Important File Rename

Rename the webhook file:
```
src/app/api/webhooks/stripe/route.ts 
→ 
src/app/api/webhooks/razorpay/route.ts
```

Or update your webhook URL configuration to point to the correct path.

---

## 🛠️ Installation Commands

```bash
# Install Razorpay
npm install razorpay

# Remove old Stripe packages (optional)
npm uninstall stripe @stripe/stripe-js

# Install all dependencies
npm install
```

---

## 🐛 Common Issues & Solutions

### Issue: TypeScript errors about 'process' not defined
**Solution:** These will resolve after running `npm install` (installs @types/node)

### Issue: Module 'razorpay' not found
**Solution:** Run `npm install razorpay`

### Issue: Webhook signature verification fails
**Solution:** 
- Check `RAZORPAY_WEBHOOK_SECRET` in `.env.local`
- Ensure webhook URL is correct in Razorpay Dashboard
- Check server logs for detailed errors

### Issue: Checkout modal doesn't open
**Solution:**
- Verify `NEXT_PUBLIC_RAZORPAY_KEY_ID` is correct
- Check browser console for errors
- Ensure Razorpay script loaded (check Network tab)

---

## 📚 Resources

- **Razorpay Dashboard:** https://dashboard.razorpay.com
- **API Documentation:** https://razorpay.com/docs/api/
- **Subscription API:** https://razorpay.com/docs/api/subscriptions/
- **Webhooks Guide:** https://razorpay.com/docs/webhooks/
- **Test Mode:** https://razorpay.com/docs/payment-gateway/test-card-details/

---

## 📞 Support

- **Razorpay Support:** support@razorpay.com
- **Documentation:** See `docs/setup/razorpay-setup.md` for detailed guide

---

## ✅ Testing Checklist

- [ ] API keys configured in `.env.local`
- [ ] Subscription plans created in Razorpay Dashboard
- [ ] Plan IDs updated in `src/app/pricing/page.tsx`
- [ ] Webhook configured in Razorpay Dashboard
- [ ] Database schema updated in Supabase
- [ ] Dependencies installed (`npm install`)
- [ ] Test payment with test card
- [ ] Webhook events received and processed
- [ ] User profile updated in database
- [ ] Subscription visible in dashboard

---

**Ready to Accept Payments!** 🎉

Once you complete all steps, your application will be ready to accept subscription payments from customers in India using Razorpay.
