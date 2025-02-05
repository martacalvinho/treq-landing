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
      <div className="overflow-x-auto -mx-4 px-4 pb-2">
        <TabsList className="inline-flex min-w-[300px] w-full">
          {images.map((image) => (
            <TabsTrigger 
              key={image.label} 
              value={image.label} 
              className="flex-1 px-2 py-1.5 text-sm"
            >
              {image.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="relative h-[600px] mt-6 overflow-hidden rounded-xl border bg-background">
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
                "object-contain",
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
