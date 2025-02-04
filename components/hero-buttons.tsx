"use client"

import { Button } from "@/components/ui/button"

export function HeroButtons() {
  return (
    <div className="flex flex-col gap-4 min-[400px]:flex-row">
      <Button size="lg" onClick={() => document.getElementById("waitlist")?.scrollIntoView()}>
        Join the Waitlist
      </Button>
      <Button size="lg" variant="outline" onClick={() => document.getElementById("features")?.scrollIntoView()}>
        See Features
      </Button>
    </div>
  )
}
