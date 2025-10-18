import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BillingForm } from '@/components/billing-form'
import { ApiKeyManager } from '@/components/api-key-manager'
import { CustomProviderKeyManager } from '@/components/custom-provider-key-manager'
import { DashboardTrialWrapper } from '@/components/dashboard-trial-wrapper'
import { regenerateApiKey } from './actions'

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  // Fetch API key and custom provider keys in parallel
  const [apiKeyRes, customKeysRes] = await Promise.all([
      supabase.from('api_keys').select('key_prefix').eq('user_id', user.id).maybeSingle(),
      supabase.from('custom_provider_keys').select('provider_name').eq('user_id', user.id)
  ]);

  let apiKeyPrefix = apiKeyRes.data?.key_prefix || null;
  let initialApiKey: string | null = null;

  // If user has no API key, generate one for them on their first visit.
  if (!apiKeyPrefix) {
      const { newApiKey } = await regenerateApiKey();
      initialApiKey = newApiKey;
      // Manually set the prefix for the initial render to avoid a layout shift
      apiKeyPrefix = newApiKey.slice(0, 6);
  }

  const savedProviders = customKeysRes.data || [];

  return (
    <DashboardTrialWrapper>
      <div className="container mx-auto max-w-screen-lg py-12">
        <div className="flex flex-col space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! This is your central hub for managing your account and settings.
            </p>
          </div>

          <div className="p-6 border rounded-lg space-y-8">
              <ApiKeyManager apiKeyPrefix={apiKeyPrefix} initialApiKey={initialApiKey} />
              <div className="border-t pt-8">
                <CustomProviderKeyManager savedProviders={savedProviders} />
              </div>
              <div className="border-t pt-8">
                  <BillingForm />
              </div>
          </div>

          <form action="/auth/signout" method="post">
            <Button type="submit" variant="outline">
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </DashboardTrialWrapper>
  )
}