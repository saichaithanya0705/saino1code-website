"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Check, Loader2 } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { openRazorpayCheckout, type RazorpayOptions } from '@/lib/razorpay-client';


const pricingTiers = [
  {
    name: "Starter",
    price: { monthly: 15, annual: 162 },
    // TODO: Replace these with actual Razorpay plan_ids from your Razorpay Dashboard
    priceIds: { monthly: 'plan_starter_monthly', annual: 'plan_starter_annual' },
    description: "For individual developers & small projects.",
    features: [
      "GLM-4.5 & DeepSeek-V3 models",
      "Basic RAG search",
      "5 workspaces",
      "Single user",
      "1M tokens/month",
    ],
    cta: "Get Started",
  },
  {
    name: "Professional",
    price: { monthly: 49, annual: 529 },
    // TODO: Replace these with actual Razorpay plan_ids from your Razorpay Dashboard
    priceIds: { monthly: 'plan_pro_monthly', annual: 'plan_pro_annual' },
    description: "For professional developers & teams.",
    features: [
      "All built-in models",
      "Custom API integration",
      "Advanced RAG + semantic search",
      "MAGNETO orchestration",
      "50 workspaces",
      "Priority support",
      "5M tokens/month",
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Team",
    price: { monthly: 99, annual: 1069 },
    // TODO: Replace these with actual Razorpay plan_ids from your Razorpay Dashboard
    priceIds: { monthly: 'plan_team_monthly', annual: 'plan_team_annual' },
    description: "For collaborative teams & organizations.",
    features: [
      "Everything in Pro",
      "Real-time collaboration",
      "Shared context engine",
      "Team analytics",
      "Unlimited workspaces",
      "10M tokens/month/user",
    ],
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceIds: null,
    description: "For large organizations with custom needs.",
    features: [
      "Dedicated infrastructure",
      "Custom model deployment",
      "SLA guarantees",
      "White-label options",
      "Enterprise SSO & SOC2",
    ],
    cta: "Contact Sales",
    href: "/contact"
  },
];

const faqs = [
    {
        question: "Can I try SaiNo1Code for free?",
        answer: "Yes! We offer a 7-day free trial on all our plans, giving you access to all advanced features and a 350,000 token allocation to get you started."
    },
    {
        question: "What happens if I go over my token limit?",
        answer: "If you exceed your monthly token allocation, you can choose to either upgrade to a higher plan or purchase additional token packs. We will notify you when you are approaching your limit."
    },
    {
        question: "Can I bring my own API keys?",
        answer: "Absolutely. The Professional plan and above allow you to integrate your own API keys from providers like OpenAI, Anthropic, Groq, and even local models via Ollama."
    },
    {
        question: "What is your refund policy?",
        answer: "We offer a 30-day money-back guarantee. If you're not satisfied with SaiNo1Code for any reason within the first 30 days of your subscription, just contact support for a full refund."
    }
]

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleCheckout = async (tier: typeof pricingTiers[0]) => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/signup');
      return;
    }

    if (!tier.priceIds) return;

    const billingCycle = isAnnual ? 'annual' : 'monthly';
    const priceId = isAnnual ? tier.priceIds.annual : tier.priceIds.monthly;

    try {
      // Create Razorpay subscription
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          priceId, 
          planName: tier.name,
          billingCycle 
        }),
      });

      const data = await response.json();
      
      if (!data.subscriptionId || !data.razorpayKeyId) {
        throw new Error("Could not create subscription");
      }

      // Open Razorpay checkout
      const options: RazorpayOptions = {
        key: data.razorpayKeyId,
        subscription_id: data.subscriptionId,
        name: 'SaiNo1Code',
        description: `${tier.name} Plan - ${billingCycle}`,
        image: '/logo.png', // Add your logo path
        prefill: {
          name: user.user_metadata?.full_name || '',
          email: user.email || '',
        },
        notes: {
          planName: tier.name,
          billingCycle: billingCycle,
        },
        theme: {
          color: '#3399cc',
        },
        handler: async (response) => {
          // Payment successful
          console.log('Payment successful:', response);
          router.push('/dashboard?payment=success');
        },
        modal: {
          ondismiss: () => {
            console.log('Checkout cancelled');
            setIsLoading(false);
          },
        },
      };

      await openRazorpayCheckout(options);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-screen-xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold">Find the plan that's right for you</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Start for free, then scale up as you grow. All plans include our core AI features.
        </p>
      </div>

      <div className="flex justify-center items-center my-10 space-x-4">
        <Label htmlFor="billing-toggle" className={cn("font-medium", !isAnnual && "text-primary")}>Monthly</Label>
        <Switch id="billing-toggle" checked={isAnnual} onCheckedChange={setIsAnnual} />
        <Label htmlFor="billing-toggle" className={cn("font-medium", isAnnual && "text-primary")}>
          Annual <span className="text-emerald-500">(Save 10%)</span>
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingTiers.map((tier) => (
          <Card key={tier.name} className={cn("flex flex-col", tier.popular && "border-primary border-2")}>
            {tier.popular && <div className="text-center py-1 bg-primary text-primary-foreground font-semibold text-sm">Most Popular</div>}
            <CardHeader>
              <CardTitle className="text-2xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="my-4">
                {typeof tier.price === 'string' ? (
                   <span className="text-4xl font-bold">{tier.price}</span>
                ) : (
                    <>
                        <span className="text-4xl font-bold">${isAnnual ? Math.floor(tier.price.annual / 12) : tier.price.monthly}</span>
                        <span className="text-muted-foreground">/ month</span>
                        {isAnnual && <p className="text-sm text-muted-foreground">Billed as ${tier.price.annual}/year</p>}
                    </>
                )}
              </div>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {tier.href ? (
                <Button asChild className="w-full" variant={tier.popular ? 'default' : 'outline'}>
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              ) : (
                <Button className="w-full" variant={tier.popular ? 'default' : 'outline'} onClick={() => handleCheckout(tier)} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {tier.cta}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <section className="mt-20 md:mt-28 max-w-3xl mx-auto">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-muted-foreground">Have questions? We have answers.</p>
        </div>
        <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i + 1}`}>
                    <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
      </section>
    </div>
  )
}