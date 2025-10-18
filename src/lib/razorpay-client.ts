/**
 * Razorpay Client-Side Helper
 * 
 * This file contains utilities for loading and using Razorpay checkout on the client-side
 */

/**
 * Load Razorpay checkout script dynamically
 * 
 * @returns Promise<boolean> - true if script loaded successfully
 */
export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      console.error('Failed to load Razorpay checkout script')
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

/**
 * Razorpay checkout options interface
 */
export interface RazorpayOptions {
  key: string
  subscription_id?: string
  order_id?: string
  name: string
  description: string
  image?: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, any>
  theme?: {
    color?: string
    backdrop_color?: string
  }
  handler: (response: RazorpayResponse) => void
  modal?: {
    ondismiss?: () => void
    escape?: boolean
    animation?: boolean
  }
}

/**
 * Razorpay payment response interface
 */
export interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id?: string
  razorpay_subscription_id?: string
  razorpay_signature: string
}

/**
 * Open Razorpay checkout modal
 * 
 * @param options - Razorpay checkout options
 * @returns Promise<void>
 */
export const openRazorpayCheckout = async (
  options: RazorpayOptions
): Promise<void> => {
  const loaded = await loadRazorpay()
  
  if (!loaded) {
    throw new Error('Failed to load Razorpay. Please check your internet connection.')
  }

  const razorpay = new (window as any).Razorpay(options)
  razorpay.open()
}

/**
 * Get Razorpay instance (for custom implementations)
 * 
 * @returns Promise<any> - Razorpay constructor
 */
export const getRazorpay = async (): Promise<any> => {
  const loaded = await loadRazorpay()
  
  if (!loaded) {
    throw new Error('Failed to load Razorpay')
  }

  return (window as any).Razorpay
}
