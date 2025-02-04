"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('1. Form submission started')
    e.preventDefault()
    console.log('2. Default form submission prevented')
    setIsSubmitting(true)
    console.log('3. Set isSubmitting to true')

    try {
      const form = e.target as HTMLFormElement
      console.log('4. Got form element:', form)
      console.log('5. Form attributes:', {
        name: form.getAttribute('name'),
        method: form.getAttribute('method'),
        'data-netlify': form.getAttribute('data-netlify'),
        action: form.getAttribute('action')
      })

      const data = new FormData(form)
      console.log('6. Form data created:', Object.fromEntries(data.entries()))
      
      // Show toast before submitting (since submit will refresh the page)
      toast({
        title: "Submitting...",
        description: "Adding you to our waitlist...",
      })
      console.log('7. Submitting toast shown')
      
      // Small delay to ensure toast is visible
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Submit the form
      console.log('8. About to submit form...')
      form.submit()
      console.log('9. Form submitted')

    } catch (error) {
      console.error('❌ Form submission error:', error)
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      })
      
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      console.log('10. Setting isSubmitting back to false')
      setIsSubmitting(false)
    }
  }

  return (
    <form
      name="waitlist"
      method="POST"
      data-netlify="true"
      onSubmit={handleSubmit}
      className="space-y-6 w-full"
    >
      <input type="hidden" name="form-name" value="waitlist" />

      <div className="space-y-2 w-full">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          className="w-full h-10"
          required
        />
      </div>

      <div className="space-y-2 w-full">
        <Label htmlFor="name" className="text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          className="w-full h-10"
          required
        />
      </div>

      <div className="space-y-2 w-full">
        <Label htmlFor="company" className="text-sm font-medium">
          Company Name
        </Label>
        <Input
          id="company"
          name="company"
          placeholder="Acme Inc"
          className="w-full h-10"
          required
        />
      </div>

      <div className="space-y-2 w-full">
        <Label className="text-sm font-medium">Number of Locations</Label>
        <RadioGroup
          name="locations"
          defaultValue="1"
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 h-10">
            <RadioGroupItem value="1" id="1-location" />
            <Label htmlFor="1-location">1 Location</Label>
          </div>
          <div className="flex items-center space-x-3 h-10">
            <RadioGroupItem value="2-3" id="2-3-locations" />
            <Label htmlFor="2-3-locations">2-3 Locations</Label>
          </div>
          <div className="flex items-center space-x-3 h-10">
            <RadioGroupItem value="4+" id="4-plus-locations" />
            <Label htmlFor="4-plus-locations">4+ Locations</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2 w-full">
        <Label className="text-sm font-medium">Interested Plan</Label>
        <RadioGroup
          name="plan"
          defaultValue="professional"
          className="space-y-3"
        >
          <div className="flex items-center space-x-3 h-10">
            <RadioGroupItem value="professional" id="professional" />
            <Label htmlFor="professional">Professional ($99/month)</Label>
          </div>
          <div className="flex items-center space-x-3 h-10">
            <RadioGroupItem value="enterprise" id="enterprise" />
            <Label htmlFor="enterprise">Enterprise (Starting at $250/month)</Label>
          </div>
        </RadioGroup>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Join Waitlist"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        By joining the waitlist, you'll be notified when we launch and receive your exclusive 30% discount on annual
        plans.
      </p>
    </form>
  )
}
