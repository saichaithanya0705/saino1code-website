import Link from "next/link"

const footerLinks = {
  product: [
    { href: "/#features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    { href: "/docs", label: "Documentation" },
    { href: "/#integrations", label: "Integrations" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact Us" },
  ],
  resources: [
    { href: "/docs/getting-started", label: "Getting Started" },
    { href: "/support", label: "Support Center" },
    { href: "/status", label: "Status" },
    { href: "/community", label: "Community" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-screen-2xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <span className="font-bold text-lg">SaiNo1Code</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Enterprise AI Coding with Sub-40ms Response Times.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Product</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SaiNo1Code, Inc. All rights reserved.
          </p>
          {/* Add social links here later */}
        </div>
      </div>
    </footer>
  )
}