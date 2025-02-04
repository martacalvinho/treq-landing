"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/components/ui/use-toast"
import { useForm, ValidationError } from '@formspree/react'

export function WaitlistForm() {
  const [state, handleSubmit] = useForm("mjkgrqaz")

  // Use useEffect to handle success/error states
  useEffect(() => {
    if (state.succeeded) {
      // Track successful signup
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'generate_lead', {
          'event_category': 'waitlist',
          'event_label': state.values?.plan || 'professional',
          'value': state.values?.plan === 'enterprise' ? 250 : 99,
          'locations': state.values?.locations || '1',
          'company': state.values?.company
        });
      }

      // Show success toast
      toast({
        title: "Success!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      })
    }

    // Show error toast if there are any errors
    if (state.errors?.length > 0) {
      toast({
        title: "Error",
        description: state.errors[0].message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }, [state.succeeded, state.errors])

  // If form was submitted successfully, show success message
  if (state.succeeded) {
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
        <ValidationError prefix="Email" field="email" errors={state.errors} className="text-sm text-red-500" />
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
        <ValidationError prefix="Name" field="name" errors={state.errors} className="text-sm text-red-500" />
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
        <ValidationError prefix="Company" field="company" errors={state.errors} className="text-sm text-red-500" />
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
        <ValidationError prefix="Locations" field="locations" errors={state.errors} className="text-sm text-red-500" />
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
        <ValidationError prefix="Plan" field="plan" errors={state.errors} className="text-sm text-red-500" />
      </div>

      <Button type="submit" className="w-full" disabled={state.submitting}>
        {state.submitting ? "Joining..." : "Join Waitlist"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        By joining the waitlist, you'll be notified when we launch and receive your exclusive 30% discount on annual
        plans.
      </p>
    </form>
  )
}
