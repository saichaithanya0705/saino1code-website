"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function BillingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState<any>(null);

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
      });
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Razorpay doesn't have a built-in portal, so we'll display the subscription info
      setSubscriptionData(data);
    } catch (error) {
      console.error("Billing management error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Billing & Subscription</h2>
        <p className="text-muted-foreground mt-2 mb-4">
          Manage your subscription and view your payment details.
        </p>
      </div>

      {!subscriptionData ? (
        <Button onClick={handleManageBilling} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          View Subscription Details
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Plan: {subscriptionData.planName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground capitalize">
                {subscriptionData.subscription?.status || 'Active'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Subscription ID</p>
              <p className="text-sm text-muted-foreground font-mono">
                {subscriptionData.subscription?.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Next Billing Date</p>
              <p className="text-sm text-muted-foreground">
                {subscriptionData.subscription?.current_end 
                  ? new Date(subscriptionData.subscription.current_end * 1000).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Payments</p>
              <p className="text-sm text-muted-foreground">
                {subscriptionData.subscription?.paid_count || 0} of{' '}
                {subscriptionData.subscription?.total_count || 0} payments completed
              </p>
            </div>
            <div className="pt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                To cancel or modify your subscription, please contact support or visit the Razorpay dashboard.
              </p>
              <Button variant="outline" asChild>
                <a href="/support" target="_blank">Contact Support</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}