"use client"

import { Button } from "@/components/ui/button"

interface PricingCardButtonProps {
  className?: string
}

export function PricingCardButton({ className }: PricingCardButtonProps) {
  return (
    <Button
      className={className}
      size="lg"
      onClick={() => document.getElementById("waitlist")?.scrollIntoView()}
    >
      Join Waitlist
    </Button>
  )
}
