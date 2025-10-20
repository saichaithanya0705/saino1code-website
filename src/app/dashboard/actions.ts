"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { createHash } from "crypto"

/**
 * Revokes any existing API key for the user and generates a new one transactionally.
 * Ensures a user has only one primary API key at a time.
 */
export async function regenerateApiKey() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Generate a new API key (sk_ prefix for SaiNo1Code)
  const apiKey = `sk_${Buffer.from(crypto.getRandomValues(new Uint8Array(24))).toString('hex')}`
  const keyPrefix = apiKey.slice(0, 5) // sk_ is 3 chars, but we store 5 to be consistent

  // Hash the key for secure storage
  const hashedKey = createHash('sha256').update(apiKey).digest('hex')

  // Call the transactional database function to regenerate the key
  const { error } = await supabase.rpc('transactional_regenerate_api_key', {
    p_key_prefix: keyPrefix,
    p_hashed_key: hashedKey,
  })

  if (error) {
    console.error("Error regenerating API key transactionally:", error)
    throw new Error("Could not generate API key.")
  }

  revalidatePath('/dashboard')

  // Return the full key to be displayed to the user ONCE.
  return { newApiKey: apiKey }
}

/**
 * Adds or updates a custom provider's API key for the user.
 * The key is encrypted in the database using pgsodium.
 * IMPORTANT: This requires RPC functions and pgsodium to be set up in Supabase.
 */
export async function addCustomProviderKey(providerName: string, apiKey: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    // This calls a PostgreSQL function that uses pgsodium to encrypt the key.
    // You must create this `upsert_custom_provider_key` function in your Supabase SQL editor.
    const { error } = await supabase.rpc('upsert_custom_provider_key', {
        p_provider_name: providerName,
        p_api_key: apiKey
    });

    if (error) {
        console.error("Error adding custom provider key:", error);
        throw new Error("Could not save the API key. Please ensure it's a valid key.");
    }

    revalidatePath('/dashboard');
    return { success: true };
}

/**
 * Deletes a custom provider's API key for the user.
 */
export async function deleteCustomProviderKey(providerName: string) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { error } = await supabase
        .from('custom_provider_keys')
        .delete()
        .match({ user_id: user.id, provider_name: providerName });

    if (error) {
        console.error("Error deleting custom provider key:", error);
        throw new Error("Could not delete the API key.");
    }

    revalidatePath('/dashboard');
    return { success: true };
}