"use client"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabbledShowcaseProps {
  images: { src: string; alt: string; label: string }[]
  className?: string
}

export function TabbedShowcase({ images, className }: TabbledShowcaseProps) {
  return (
    <Tabs defaultValue={images[0].label} className={cn("w-full", className)}>
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <TabsList className="inline-flex w-[600px] sm:w-full">
          {images.map((image) => (
            <TabsTrigger key={image.label} value={image.label} className="flex-1 min-w-[120px] px-3 py-2 text-sm">
              {image.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {images.map((image) => (
        <TabsContent key={image.label} value={image.label} className="mt-6">
          <div className="overflow-hidden rounded-lg border bg-background">
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              width={500}
              height={300}
              className="w-full object-cover"
              priority
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
