"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroButtons() {
  return (
    <div className="flex flex-col gap-4 min-[400px]:flex-row">
      <Link href="/nyc-audit">
        <Button 
          size="lg" 
          variant="outline" 
          className="bg-white text-black hover:bg-gray-50 border-2 border-black w-full min-[400px]:w-auto"
        >
          Free NYC Compliance Quiz →
        </Button>
      </Link>
      <Button 
        size="lg" 
        onClick={() => document.getElementById("waitlist")?.scrollIntoView()}
        className="w-full min-[400px]:w-auto"
      >
        Join the Waitlist
      </Button>
    </div>
  )
}
