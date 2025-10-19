/**
 * SPECIAL USER CONFIGURATION TEMPLATE
 * 
 * This is a template file. Copy this to special-user.config.ts and configure.
 * 
 * TO SET THE SPECIAL USER:
 * 1. Copy this file to: src/config/special-user.config.ts
 * 2. Log in to https://assistant7.netlify.app/
 * 3. Visit: https://assistant7.netlify.app/api/auth/me
 * 4. Copy your user ID from the response
 * 5. Set SPECIAL_USER_ID below (in quotes)
 * 6. Rebuild and redeploy
 * 
 * SECURITY NOTE:
 * - Only the user ID listed here gets unlimited access
 * - The actual config file is in .gitignore and won't be committed
 * - This template can be safely committed to Git
 */

/**
 * User ID that should have unlimited Professional access
 * 
 * Set this to YOUR user ID to get unlimited access.
 * Leave as null to disable special user feature entirely.
 * 
 * Example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
 */
export const SPECIAL_USER_ID: string | null = null;

/**
 * Alternative: Use email instead of ID
 * If you prefer to identify by email, set this and leave SPECIAL_USER_ID as null
 * 
 * Example: 'admin@example.com'
 */
export const SPECIAL_USER_EMAIL: string | null = null;

/**
 * Feature flag to enable/disable special user functionality
 * Set to false to temporarily disable without removing the user ID
 */
export const ENABLE_SPECIAL_USER: boolean = true;
