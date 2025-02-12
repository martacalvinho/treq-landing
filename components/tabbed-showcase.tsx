"use client"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabbledShowcaseProps {
  images: { src: string; alt: string; label: string }[]
  className?: string
  imageClassName?: string
}

export function TabbedShowcase({ images, className, imageClassName }: TabbledShowcaseProps) {
  return (
    <Tabs defaultValue={images[0].label} className={cn("w-full", className)}>
      <div className="overflow-x-auto -mx-4 px-4 pb-2 scrollbar-none">
        <TabsList className="inline-flex h-10 items-center justify-start gap-1">
          {images.map((image) => (
            <TabsTrigger 
              key={image.label} 
              value={image.label} 
              className="rounded-md px-3 py-1.5 text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              {image.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="relative mt-4 h-[400px] sm:h-[500px] md:h-[600px] overflow-hidden rounded-xl border bg-background">
        {images.map((image) => (
          <TabsContent 
            key={image.label} 
            value={image.label} 
            className="absolute inset-0 h-full w-full"
          >
            <Image
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              fill
              className={cn(
                "object-contain p-2",
                imageClassName
              )}
              priority
            />
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
