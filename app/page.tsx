"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { WaitlistForm } from "@/components/waitlist-form"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { TabbedShowcase } from "@/components/tabbed-showcase"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SiteHeader } from "@/components/site-header"
import { HeroButtons } from "@/components/hero-buttons"
import { PricingCardButton } from "@/components/pricing-card-button"
import { Clock4 } from "lucide-react"
import { CheckCircle } from "lucide-react"
import { useState } from "react"

export default function LandingPage() {
  const [waitlistCount, setWaitlistCount] = useState(234)
  const totalSpots = 2000
  const spotsRemaining = totalSpots - waitlistCount
  const progressPercentage = (waitlistCount / totalSpots) * 100

  const handleWaitlistJoin = () => {
    setWaitlistCount(prev => Math.min(prev + 1, totalSpots))
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 sm:py-32">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="w-fit">
              Limited Time Offer - 30% Off Annual Plans
            </Badge>
            <h1 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:text-5xl lg:leading-[1.3] px-4 md:px-0 text-center mb-10">
              {/* Mobile Layout */}
              <div className="flex flex-col items-center gap-4 md:hidden">
                <div>
                  Never Miss a
                </div>
                <div>
                  <span className="bg-[#2D5BFF] text-white px-3 py-1 rounded-md">NYC Restaurant License</span>
                </div>
                <div>
                  or <span className="bg-[#2D5BFF] text-white px-3 py-1 rounded-md">Permit Renewal</span> Again
                </div>
              </div>
              
              {/* Desktop Layout */}
              <div className="hidden md:flex md:flex-col md:items-center md:gap-6">
                <div>
                  Never Miss a <span className="bg-[#2D5BFF] text-white px-3 py-1 rounded-md">NYC Restaurant License</span>
                </div>
                <div>
                  or <span className="bg-[#2D5BFF] text-white px-3 py-1 rounded-md">Permit Renewal</span> Again
                </div>
              </div>
            </h1>
            <div className="max-w-[1000px] text-base text-muted-foreground sm:text-lg md:text-xl px-4 md:px-0 flex flex-col items-center gap-3">
              <div className="font-bold text-foreground text-center mb-6 text-xl sm:text-2xl">One dashboard for all your restaurant's permits, licenses, and compliance deadlines.</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-16 w-full max-w-4xl text-gray-600 mb-12">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Automatic reminders for licenses & permits</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Document tracking in one place</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Pre-made checklists for compliance tasks</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Waste Management and much more!</span>
                </div>
              </div>
              <div className="flex flex-col gap-4 min-[400px]:gap-16 pt-4">
                <HeroButtons />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">Features</h2>
            <div className="space-y-3">
              <p className="text-xl sm:text-2xl font-medium text-foreground">
                NYC Compliance - Managed by You, Simplified by Treqy
              </p>
              <div className="space-y-4 max-w-[100%] mx-auto">
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  A complete toolkit for managing permits, licenses, and operations.
                </p>
                <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                  <span className="inline-flex items-center gap-1 md:gap-2">
                    <Clock4 className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span className="md:hidden">Save 10+ hours/week</span>
                    <span className="hidden md:inline">Save 10+ hours every week on compliance tasks</span>
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full mt-12">
            <div className="px-4 md:px-0 overflow-x-auto pb-2">
              <TabsList className="inline-flex h-9 w-full md:w-auto min-w-[300px] md:min-w-0">
                <TabsTrigger value="dashboard" className="flex-1 px-2 md:px-4 text-sm">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="compliance" className="flex-1 px-2 md:px-4 text-sm">
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex-1 px-2 md:px-4 text-sm">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="waste" className="flex-1 px-2 md:px-4 text-sm">
                  Waste
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex-1 px-2 md:px-4 text-sm">
                  Staff
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-col justify-center space-y-6 px-4 lg:w-1/2 lg:px-0">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold sm:text-3xl">Comprehensive Dashboard</h3>
                    <p className="text-muted-foreground">
                      Get a bird's eye view of your restaurant's compliance and operations.
                    </p>
                  </div>
                  <ul className="grid gap-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Real-time alerts and notifications</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Key metrics overview</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Quick action shortcuts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Recent activity feed</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "/Dashboard.JPG",
                        alt: "Dashboard Overview",
                        label: "Overview",
                      }
                    ]}
                    className="bg-background shadow-md"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-col justify-center space-y-6 px-4 lg:w-1/2 lg:px-0">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold sm:text-3xl">Compliance Management</h3>
                    <p className="text-muted-foreground">
                      Keep your restaurant compliant with NYC regulations through our comprehensive document management system.
                    </p>
                  </div>
                  <ul className="grid gap-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Centralized document vault</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Automated expiration tracking</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Required documents checklist</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Inspection history and scheduling</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Training records management</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Equipment maintenance tracking</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "/Compliance- Documents.JPG",
                        alt: "Compliance Management - Document Vault",
                        label: "Documents",
                      },
                      {
                        src: "/Compliance- Inspections.jpg",
                        alt: "Compliance Management - Inspections",
                        label: "Inspections",
                      },
                      {
                        src: "/Compliance- Training.jpg",
                        alt: "Compliance Management - Training",
                        label: "Training",
                      },
                      {
                        src: "/Compliance- Equipment.jpg",
                        alt: "Compliance Management - Equipment",
                        label: "Equipment",
                      },
                      {
                        src: "/Compliance- Safety.jpg",
                        alt: "Compliance Management - Safety",
                        label: "Safety",
                      },
                      {
                        src: "/Compliance- Signage.jpg",
                        alt: "Compliance Management - Signage",
                        label: "Signage",
                      },
                      {
                        src: "/Compliance- Calendar.jpg",
                        alt: "Compliance Management - Calendar",
                        label: "Calendar",
                      },
                      {
                        src: "/Compliance- Information.jpg",
                        alt: "Compliance Management - Information",
                        label: "Information",
                      }
                    ]}
                    className="bg-background shadow-md"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-col justify-center space-y-6 px-4 lg:w-1/2 lg:px-0">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold sm:text-3xl">Task Management</h3>
                    <p className="text-muted-foreground">
                      Streamline your operations with flexible task management.
                    </p>
                  </div>
                  <ul className="grid gap-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Multiple task views (List & Board)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Customizable checklists</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Template management</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Email notifications</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "/Tasks- List View.jpg",
                        alt: "Tasks Management - List View",
                        label: "List View",
                      },
                      {
                        src: "/Tasks- Board View.jpg",
                        alt: "Tasks Management - Board View",
                        label: "Board View",
                      },
                      {
                        src: "/Tasks- Checklists.jpg",
                        alt: "Tasks Management - Checklists",
                        label: "Checklists",
                      },
                      {
                        src: "/Tasks- Saved Checklists.jpg",
                        alt: "Tasks Management - Saved Checklists",
                        label: "Saved Checklists",
                      },
                      {
                        src: "/Tasks- Email Reminders.jpg",
                        alt: "Tasks Management - Email Reminders",
                        label: "Email Reminders",
                      }
                    ]}
                    className="bg-background shadow-md"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="waste" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-col justify-center space-y-6 px-4 lg:w-1/2 lg:px-0">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold sm:text-3xl">Waste Management</h3>
                    <p className="text-muted-foreground">
                      Track and optimize your waste management operations.
                    </p>
                  </div>
                  <ul className="grid gap-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Comprehensive waste logging</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Pickup schedule management</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Performance metrics and reports</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Recycling rate tracking</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "/Waste- Waste Log.jpg",
                        alt: "Waste Management - Waste Log",
                        label: "Waste Log",
                      },
                      {
                        src: "/Waste- Schedule.jpg",
                        alt: "Waste Management - Schedule",
                        label: "Schedule",
                      },
                      {
                        src: "/Waste- Report.jpg",
                        alt: "Waste Management - Report",
                        label: "Report",
                      }
                    ]}
                    className="bg-background shadow-md"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="staff" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row">
                <div className="flex flex-col justify-center space-y-6 px-4 lg:w-1/2 lg:px-0">
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold sm:text-3xl">Staff Management</h3>
                    <p className="text-muted-foreground">
                      Track staff certifications and maintain compliance records.
                    </p>
                  </div>
                  <ul className="grid gap-4">
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Staff directory and profiles</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Certification tracking</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Document status monitoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Incident tracking</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "/Staff.jpg",
                        alt: "Staff Management - Overview",
                        label: "Overview",
                      }
                    ]}
                    className="bg-background shadow-md"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section id="pricing" className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Choose the plan that's right for your business. Save 30% on annual plans by joining the waitlist now.
            </p>
          </div>

          <div className="grid gap-6 pt-12 px-4 md:px-0">
            <Tabs defaultValue="monthly" className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-[300px] grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="annual">Annual (30% off)</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="monthly">
                <div className="grid gap-6 lg:grid-cols-2 xl:gap-12">
                  <Card className="flex flex-col h-full">
                    <CardHeader className="space-y-2">
                      <CardTitle>Professional</CardTitle>
                      <CardDescription>Perfect for single location businesses</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                      <div>
                        <span className="text-4xl font-bold">$99</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Switch to annual billing to save 30%
                      </p>
                      <ul className="grid gap-2">
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Single location</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Up to 50 staff members</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>All core features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Email support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <PricingCardButton className="w-full" />
                    </CardFooter>
                  </Card>

                  <Card className="flex flex-col h-full">
                    <CardHeader className="space-y-2">
                      <CardTitle>Enterprise</CardTitle>
                      <CardDescription>For businesses with multiple locations</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                      <div>
                        <span className="text-4xl font-bold">$250</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Additional locations $50/month each</p>
                      <ul className="grid gap-2">
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Up to 3 locations included</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Unlimited staff members</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Custom integrations</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <PricingCardButton className="w-full" />
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="annual">
                <div className="grid gap-6 lg:grid-cols-2 xl:gap-12">
                  <Card className="flex flex-col h-full">
                    <CardHeader className="space-y-2">
                      <CardTitle>Professional</CardTitle>
                      <CardDescription>Perfect for single location businesses</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <div>
                          <span className="text-4xl font-bold">$69</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <div className="text-sm text-muted-foreground line-through">
                          $99/month
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Billed annually at $828 (30% off)
                      </p>
                      <ul className="grid gap-2">
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Single location</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Up to 50 staff members</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>All core features</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Email support</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <PricingCardButton className="w-full" />
                    </CardFooter>
                  </Card>

                  <Card className="flex flex-col h-full">
                    <CardHeader className="space-y-2">
                      <CardTitle>Enterprise</CardTitle>
                      <CardDescription>For businesses with multiple locations</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <div>
                          <span className="text-4xl font-bold">$175</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <div className="text-sm text-muted-foreground line-through">
                          $250/month
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Additional locations $35/month each (billed annually)</p>
                      <ul className="grid gap-2">
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Up to 3 locations included</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Unlimited staff members</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Check className="h-4 w-4" />
                          </div>
                          <span>Custom integrations</span>
                        </li>
                      </ul>
                    </CardContent>
                    <CardFooter className="mt-auto">
                      <PricingCardButton className="w-full" />
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section id="waitlist" className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-3 sm:space-y-4 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold leading-[1.1] md:text-5xl">Join the Waitlist</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground text-sm sm:text-lg sm:leading-7">
              Be one of the first 2000 members to get 30% off annual plans when we launch.
            </p>
            <div className="w-full max-w-md mt-2 sm:mt-4">
              <div className="mb-1.5 sm:mb-2 flex justify-between text-xs sm:text-sm">
                <span>{waitlistCount} spots claimed</span>
                <span>{totalSpots} spots total</span>
              </div>
              <div className="h-1.5 sm:h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
                Only {spotsRemaining} spots remaining - Join now to secure your discount!
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-lg pt-8 sm:pt-12 px-4 md:px-0">
            <WaitlistForm onSuccessfulJoin={handleWaitlistJoin} />
          </div>
        </section>

        <section id="faq" className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Frequently Asked Questions</h2>
          </div>

          <div className="mx-auto max-w-[58rem] pt-12 px-4 md:px-0">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What's included in the Professional plan?</AccordionTrigger>
                <AccordionContent>
                  The Professional plan includes all core features for a single location with up to 50 staff members.
                  This includes the dashboard, compliance management, task management, waste tracking, and staff
                  management features.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How does the Enterprise pricing work?</AccordionTrigger>
                <AccordionContent>
                  Enterprise pricing starts at $250/month for up to 3 locations. Each additional location is $50/month.
                  This plan includes unlimited staff members, advanced analytics, and priority support.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How do I claim the 30% discount?</AccordionTrigger>
                <AccordionContent>
                  The 30% discount on annual plans is available to the first 2000 members who join our waitlist. Once we
                  launch, waitlist members will receive instructions on how to claim their discount.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Can I switch plans later?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can upgrade or downgrade your plan at any time. If you switch to an annual plan, you'll be
                  prorated for the remainder of your billing cycle.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>What kind of support do you offer?</AccordionTrigger>
                <AccordionContent>
                  Professional plan members receive email support with 24-hour response times. Enterprise plan members
                  get priority support with 4-hour response times and access to phone support during business hours.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Image
              src="/treqy-logo.svg"
              alt="Treqy Logo"
              width={80}
              height={27}
              className="dark:brightness-0 dark:invert"
            />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a href="#" className="font-medium underline underline-offset-4">
                Treqy
              </a>
              . All rights reserved.
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Questions? Contact us at{" "}
            <a href="mailto:hello@treqy.com" className="text-[#2563EB] hover:underline">
              hello@treqy.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
