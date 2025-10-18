import { BookOpen, LifeBuoy, Mail, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const supportChannels = [
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: "Documentation",
    description: "Our comprehensive documentation is the best place to start. Find answers to common questions and detailed guides.",
    href: "/docs",
    cta: "Explore Docs",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-primary" />,
    title: "Community Forum",
    description: "Join our Discord or Slack community to ask questions, share your projects, and connect with other developers.",
    href: "#", // Placeholder for community link
    cta: "Join Community",
  },
  {
    icon: <Mail className="h-8 w-8 text-primary" />,
    title: "Email Support",
    description: "Can't find what you're looking for? Our support team is here to help with any technical issues or account questions.",
    href: "mailto:support@sainocode.com",
    cta: "Email Us",
  },
  {
    icon: <LifeBuoy className="h-8 w-8 text-primary" />,
    title: "Status Page",
    description: "Check our status page for real-time information on system performance and any ongoing incidents.",
    href: "#", // Placeholder for status page link
    cta: "View Status",
  },
];

export default function SupportPage() {
  return (
    <div className="container mx-auto max-w-screen-lg py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold">Support Center</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          We're here to help. Find the resources you need to get the most out of SaiNo1Code.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {supportChannels.map((channel) => (
          <Link key={channel.title} href={channel.href} target={channel.href.startsWith('mailto') ? '_blank' : '_self'}>
            <Card className="h-full hover:border-primary transition-colors">
              <CardHeader className="flex flex-row items-start gap-4">
                <div>{channel.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-xl">{channel.title}</CardTitle>
                  <CardDescription className="mt-2">
                    {channel.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}