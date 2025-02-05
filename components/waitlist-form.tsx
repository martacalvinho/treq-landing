"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

// Replace this with your Google Apps Script web app URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx_zJTPA78ZuZ9ogEQ6fPq4lXR53f2_ZFEYYpfnk4glxNdD9YesbGBNJVm93O0W8p1U/exec'

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log('Starting form submission...')

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      const data = Object.fromEntries(formData.entries())
      console.log('Form data:', data)

      // Submit to Google Sheets
      console.log('Sending request to:', GOOGLE_SCRIPT_URL)
      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors', 
      })

      console.log('Response:', response)

      // Since we're using no-cors, we won't get response details
      // So we'll assume success if we get here
      console.log('Form submitted successfully')

      // Track successful signup
      if (typeof window !== 'undefined' && (window as any).gtag) {
        console.log('Tracking signup in GA...')
        ;(window as any).gtag('event', 'generate_lead', {
          'event_category': 'waitlist',
          'event_label': data.plan,
          'value': data.plan === 'enterprise' ? 250 : 99,
          'locations': data.locations,
          'company': data.company
        })
      }

      // Show success message
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      })

      setSubmitted(true)
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // If form was submitted successfully, show success message
  if (submitted) {
    return (
      <div className="text-center p-6 space-y-4">
        <h3 className="text-2xl font-semibold">Thank you for joining!</h3>
        <p className="text-muted-foreground">
          We'll be in touch soon with more information about TREQ.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
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

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? "Joining..." : "Join Waitlist"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        By joining the waitlist, you'll be notified when we launch and receive your exclusive 30% discount on annual
        plans.
      </p>
    </form>
  )
}
