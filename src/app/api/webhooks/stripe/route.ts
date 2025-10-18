import { razorpay, verifyWebhookSignature } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

/**
 * Razorpay Webhook Handler
 * 
 * This endpoint handles webhook events from Razorpay for subscription management.
 * 
 * Setup Instructions:
 * 1. Go to Razorpay Dashboard -> Settings -> Webhooks
 * 2. Add webhook URL: https://yourdomain.com/api/webhooks/razorpay
 * 3. Select events: subscription.activated, subscription.charged, subscription.cancelled
 * 4. Copy webhook secret and add to .env.local as RAZORPAY_WEBHOOK_SECRET
 */

// Force dynamic rendering - don't pre-render this API route
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('x-razorpay-signature') as string
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!

  // Verify webhook signature for security
  if (!signature || !verifyWebhookSignature(body, signature)) {
    console.error('❌ Invalid Razorpay webhook signature')
    return new NextResponse('Webhook Error: Invalid signature', { status: 400 })
  }

  let event: any

  try {
    event = JSON.parse(body)
  } catch (err: any) {
    console.error(`❌ Error parsing webhook body: ${err.message}`)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  const supabase = createClient()

  // Handle subscription activated event (initial payment successful)
  if (event.event === 'subscription.activated') {
    console.log('✅ Subscription activated!')
    
    const subscription = event.payload.subscription.entity
    const userId = subscription.notes?.userId
    const planName = subscription.notes?.planName

    if (!userId) {
      console.error('Webhook Error: Missing user ID in subscription notes.')
      return new NextResponse('Webhook Error: Missing user ID', { status: 400 })
    }

    // Update the user's profile in Supabase database
    const { error } = await supabase
      .from('profiles')
      .update({
        razorpay_customer_id: subscription.customer_id,
        razorpay_subscription_id: subscription.id,
        razorpay_plan_id: subscription.plan_id,
        razorpay_current_period_end: new Date(subscription.current_end * 1000),
        razorpay_current_period_start: new Date(subscription.current_start * 1000),
        plan_name: planName,
        subscription_status: subscription.status,
      })
      .eq('id', userId)

    if (error) {
      console.error('Error updating user profile:', error)
      return new NextResponse('Webhook Error: Could not update user profile', { status: 500 })
    }

    console.log(`✅ User ${userId} subscribed to ${planName}`)
  }

  // Handle subscription charged event (recurring payment successful)
  if (event.event === 'subscription.charged') {
    console.log('✅ Subscription charged!')
    
    const subscription = event.payload.subscription.entity
    const payment = event.payload.payment.entity

    const { error } = await supabase
      .from('profiles')
      .update({
        razorpay_current_period_end: new Date(subscription.current_end * 1000),
        razorpay_current_period_start: new Date(subscription.current_start * 1000),
        subscription_status: subscription.status,
        last_payment_id: payment.id,
        last_payment_amount: payment.amount / 100, // Convert paise to rupees
        last_payment_date: new Date(payment.created_at * 1000),
      })
      .eq('razorpay_subscription_id', subscription.id)

    if (error) {
      console.error('Error updating subscription payment:', error)
    } else {
      console.log(`✅ Subscription ${subscription.id} payment recorded`)
    }
  }

  // Handle subscription cancelled event
  if (event.event === 'subscription.cancelled') {
    console.log('⚠️ Subscription cancelled')
    
    const subscription = event.payload.subscription.entity

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'cancelled',
        razorpay_current_period_end: new Date(subscription.ended_at * 1000),
      })
      .eq('razorpay_subscription_id', subscription.id)

    if (error) {
      console.error('Error updating subscription cancellation:', error)
    } else {
      console.log(`✅ Subscription ${subscription.id} cancelled`)
    }
  }

  // Handle subscription paused event
  if (event.event === 'subscription.paused') {
    console.log('⏸️ Subscription paused')
    
    const subscription = event.payload.subscription.entity

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'paused',
      })
      .eq('razorpay_subscription_id', subscription.id)

    if (error) {
      console.error('Error updating subscription pause:', error)
    } else {
      console.log(`✅ Subscription ${subscription.id} paused`)
    }
  }

  // Handle subscription resumed event
  if (event.event === 'subscription.resumed') {
    console.log('▶️ Subscription resumed')
    
    const subscription = event.payload.subscription.entity

    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'active',
        razorpay_current_period_end: new Date(subscription.current_end * 1000),
      })
      .eq('razorpay_subscription_id', subscription.id)

    if (error) {
      console.error('Error updating subscription resume:', error)
    } else {
      console.log(`✅ Subscription ${subscription.id} resumed`)
    }
  }

  return new NextResponse(JSON.stringify({ received: true }), { 
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}