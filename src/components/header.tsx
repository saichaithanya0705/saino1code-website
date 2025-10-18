"use client"

import { useState } from "react"
import { Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { UserAvatar } from "@/components/user-avatar"
import { useAuth } from "@/hooks/use-auth"

const mainNav = [
  { href: "/#features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { isAuthenticated, shouldShowTrialButton, loading } = useAuth()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          {/* <Logo /> */}
          <span className="font-bold sm:inline-block">
            SaiNo1Code
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!loading && (
            <>
              {!isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Start Free Trial</Link>
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  {shouldShowTrialButton && (
                    <Button asChild>
                      <Link href="/pricing">Start Free Trial</Link>
                    </Button>
                  )}
                  <UserAvatar />
                </div>
              )}
            </>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">SaiNo1Code</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                    </Button>
                </div>
                <div className="flex flex-col space-y-4">
                  {mainNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {!loading && (
                    <div className="border-t pt-4 mt-4 flex flex-col space-y-3">
                      {!isAuthenticated ? (
                        <>
                          <Button variant="outline" asChild>
                            <Link href="/login">Sign In</Link>
                          </Button>
                          <Button asChild>
                            <Link href="/signup">Start Free Trial</Link>
                          </Button>
                        </>
                      ) : (
                        <>
                          {shouldShowTrialButton && (
                            <Button asChild>
                              <Link href="/pricing">Start Free Trial</Link>
                            </Button>
                          )}
                          <Button variant="outline" asChild>
                            <Link href="/dashboard">Dashboard</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}