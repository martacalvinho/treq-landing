"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"

export function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    company: "",
    locations: "1",
    plan: "professional",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)

      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData as any).toString(),
      })

      if (!response.ok) {
        throw new Error('Form submission failed')
      }

      // Track successful signup with detailed data
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          'event_category': 'waitlist',
          'event_label': formData.get('plan'),
          'value': formData.get('plan') === 'enterprise' ? 250 : 99,
          'locations': formData.get('locations'),
          'company': formData.get('company')
        });
      }

      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      })
      
      setFormData({
        email: "",
        name: "",
        company: "",
        locations: "1",
        plan: "professional",
      })
    } catch (error) {
      console.error('Form submission error:', error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Hidden form for Netlify form detection */}
      <form name="waitlist" data-netlify="true" hidden>
        <input type="text" name="name" />
        <input type="email" name="email" />
        <input type="text" name="company" />
        <input type="text" name="locations" />
        <input type="text" name="plan" />
      </form>

      {/* Actual form */}
      <form
        name="waitlist"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="space-y-6 w-full"
      >
        <input type="hidden" name="form-name" value="waitlist" />
        <p hidden>
          <label>
            Don't fill this out if you're human: <input name="bot-field" />
          </label>
        </p>

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
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2 w-full">
        <Label className="text-sm font-medium">Number of Locations</Label>
        <RadioGroup
          name="locations"
          value={formData.locations}
          onValueChange={(value) => setFormData({ ...formData, locations: value })}
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
          value={formData.plan}
          onValueChange={(value) => setFormData({ ...formData, plan: value })}
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
    </>
  )
}
