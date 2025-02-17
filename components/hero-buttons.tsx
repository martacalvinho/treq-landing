"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroButtons() {
  return (
    <div className="flex flex-col gap-4 min-[400px]:flex-row min-[400px]:gap-16">
      <Link href="/nyc-audit">
        <Button 
          size="lg" 
          variant="outline" 
          className="bg-white text-black hover:bg-gray-200 border border-black w-full min-[400px]:w-auto transition-all duration-200 ease-in-out hover:scale-[1.02] font-bold"
        >
          Check Your Restaurant's Compliance Risk →
        </Button>
      </Link>
      <Button 
        size="lg" 
        onClick={() => document.getElementById("waitlist")?.scrollIntoView()}
        className="w-full min-[400px]:w-auto bg-black text-white hover:bg-black/80 transition-all duration-200 ease-in-out hover:scale-[1.02]"
      >
        Join the Waitlist & Get 30% Off →
      </Button>
    </div>
  )
}
