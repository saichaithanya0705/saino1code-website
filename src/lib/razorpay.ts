import Razorpay from 'razorpay'

/**
 * Initialize Razorpay instance with API credentials
 * 
 * Required Environment Variables:
 * - RAZORPAY_KEY_ID: Your Razorpay API Key ID (starts with rzp_test_ or rzp_live_)
 * - RAZORPAY_KEY_SECRET: Your Razorpay API Key Secret
 * 
 * Get your keys from: https://dashboard.razorpay.com/app/keys
 */

// Create a getter function instead of immediate initialization to avoid build-time errors
let razorpayInstance: Razorpay | null = null

export const getRazorpay = (): Razorpay => {
  if (!razorpayInstance) {
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new Error('Razorpay API keys are not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env.local file.')
    }
    
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  }
  
  return razorpayInstance
}

// For backwards compatibility
export const razorpay = new Proxy({} as Razorpay, {
  get: (target, prop) => {
    const instance = getRazorpay()
    return (instance as any)[prop]
  }
})

/**
 * Verify Razorpay payment signature for security
 * 
 * @param orderId - Razorpay order ID
 * @param paymentId - Razorpay payment ID
 * @param signature - Signature received from Razorpay
 * @returns boolean - true if signature is valid
 */
export function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const crypto = require('crypto')
  const body = orderId + '|' + paymentId
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body.toString())
    .digest('hex')
  
  return expectedSignature === signature
}

/**
 * Verify Razorpay webhook signature
 * 
 * @param body - Webhook request body
 * @param signature - X-Razorpay-Signature header value
 * @returns boolean - true if webhook is authentic
 */
export function verifyWebhookSignature(body: string, signature: string): boolean {
  const crypto = require('crypto')
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')
  
  return expectedSignature === signature
}
