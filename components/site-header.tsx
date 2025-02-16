"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { label: "Features", id: "features" },
    { label: "Pricing", id: "pricing" },
    { label: "FAQ", id: "faq" }
  ]

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center mt-5">
            <Link href="/">
              <Image
                src="/treqy-logo.svg"
                alt="Treqy Logo"
                width={100}
                height={34}
                className="dark:brightness-0 dark:invert"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Link href="/nyc-audit">
              <Button
                variant="outline"
                className="bg-white text-black hover:bg-gray-50 border-2 border-black"
              >
                Free NYC Compliance Quiz →
              </Button>
            </Link>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => scrollToSection("waitlist")}
            >
              Join Waitlist
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded-md transition-colors"
              >
                {item.label}
              </button>
            ))}
            <Link href="/nyc-audit" className="w-full">
              <Button
                variant="outline"
                className="w-full bg-white text-black hover:bg-gray-50 border-2 border-black"
              >
                Free NYC Compliance Quiz →
              </Button>
            </Link>
            <div className="pt-2 px-4">
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => scrollToSection("waitlist")}
              >
                Join Waitlist
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
