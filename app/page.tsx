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

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 sm:py-32">
          <div className="flex flex-col items-center gap-4 text-center">
            <Badge variant="secondary" className="w-fit">
              Limited Time Offer - 30% Off Annual Plans
            </Badge>
            <h1 className="text-2xl font-bold leading-tight tracking-tighter md:text-3xl lg:text-5xl lg:leading-[1.1] px-4 md:px-0 space-y-4">
              <div>Never Miss a <span className="bg-[#2563EB] text-white px-3 py-1 rounded-md">NYC Restaurant License</span></div>
              <div className="mt-4">or <span className="bg-[#2563EB] text-white px-3 py-1 rounded-md">Permit Renewal</span> Again</div>
            </h1>
            <p className="max-w-[750px] text-base text-muted-foreground sm:text-lg md:text-xl px-4 md:px-0">
              <span className="font-bold text-foreground">One dashboard</span> for all your restaurant's permits, licenses, and compliance deadlines. Get <span className="font-semibold text-foreground">automatic reminders</span>, <span className="font-semibold text-foreground">document tracking</span>, and <span className="font-semibold text-foreground">pre-made checklists</span> to stay compliant year-round.
            </p>
            <HeroButtons />
          </div>
        </section>

        <section id="features" className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-6 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-4xl md:text-5xl">Features</h2>
            <div className="space-y-3">
              <p className="text-xl sm:text-2xl font-medium text-foreground">
                NYC Compliance - Managed by You, Simplified by Treq
              </p>
              <div className="space-y-4 max-w-[100%] mx-auto">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  A complete toolkit for managing permits, licenses, and operations.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <Clock4 className="h-5 w-5 text-primary" />
                    Save 10+ hours every week on compliance tasks.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="dashboard" className="w-full mt-12">
            <div className="px-4 md:px-0 overflow-x-auto pb-2">
              <TabsList className="inline-flex w-[600px] md:w-full">
                <TabsTrigger value="dashboard" className="flex-1 min-w-[120px]">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="compliance" className="flex-1 min-w-[120px]">
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="tasks" className="flex-1 min-w-[120px]">
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="waste" className="flex-1 min-w-[120px]">
                  Waste
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex-1 min-w-[120px]">
                  Staff
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <div className="flex flex-col justify-center space-y-4 px-4 lg:w-1/2 lg:px-0">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold sm:text-3xl">Comprehensive Dashboard</h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      Get a bird's eye view of your business operations with real-time insights and alerts.
                    </p>
                  </div>
                  <ul className="grid gap-4 mt-6">
                    <li className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-base">Real-time compliance alerts</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-base">Activity monitoring</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-base">Key metrics overview</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-base">Customizable widgets</span>
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Dashboard-CA9B553AARFZjv4J8sbg4UW85FWcoN.png",
                        alt: "Dashboard Overview",
                        label: "Overview",
                      },
                    ]}
                    className="rounded-lg border bg-background shadow-xl"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="compliance" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <div className="flex flex-col justify-center space-y-4 px-4 lg:w-1/2 lg:px-0">
                  <h3 className="text-xl font-bold sm:text-2xl">Compliance Management</h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Stay on top of your regulatory requirements with automated reminders and document tracking.
                  </p>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Document expiration alerts
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Compliance calendar
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Digital document vault
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Audit trail tracking
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Compliance%20-%20document%20vault.JPG-DGGYGAAvMonEbICz4snTFiQsK0PmOn.jpeg",
                        alt: "Compliance Management - Document Vault",
                        label: "Document Vault",
                      },
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Compliance-%20calendar.JPG-YVk0bupaKAxw7cKMGBrL8Pvlmr6QZs.jpeg",
                        alt: "Compliance Management - Calendar View",
                        label: "Calendar",
                      },
                    ]}
                    className="rounded-lg border bg-background shadow-xl"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="tasks" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <div className="flex flex-col justify-center space-y-4 px-4 lg:w-1/2 lg:px-0">
                  <h3 className="text-xl font-bold sm:text-2xl">Task Management</h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Efficiently manage and track tasks across your organization with our intuitive task management
                    system.
                  </p>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Multiple task views
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Customizable checklists
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Email reminders
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Progress tracking
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tasks-%20List%20View.JPG-WNrpCq1gFCJ815aUJQiZihuNmaijRI.jpeg",
                        alt: "Task Management - List View",
                        label: "List View",
                      },
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tasks-%20Board%20View.JPG-rO6qjFhidWVzXxUjIr42PjAjChlkvJ.jpeg",
                        alt: "Task Management - Board View",
                        label: "Board View",
                      },
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tasks-%20Checklists.JPG-esvxL6GbDaonGhBaXU9DufWC3n5t1f.jpeg",
                        alt: "Task Management - Checklists",
                        label: "Checklists",
                      },
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tasks-%20Saved%20Checklists.JPG-A2hvpibdyafIhyz7E7eEGDigr7xsPe.jpeg",
                        alt: "Task Management - Saved Checklists",
                        label: "Saved Lists",
                      },
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tasks-%20Email%20Reminders.JPG-f2CIbsNQuJGtOB4vhu9otOSH4JYyll.jpeg",
                        alt: "Task Management - Email Reminders",
                        label: "Reminders",
                      },
                    ]}
                    className="rounded-lg border bg-background shadow-xl"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="waste" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <div className="flex flex-col justify-center space-y-4 px-4 lg:w-1/2 lg:px-0">
                  <h3 className="text-xl font-bold sm:text-2xl">Waste Management</h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Track and optimize your waste management processes with detailed logging and analytics.
                  </p>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Waste tracking logs
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Pickup scheduling
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Cost analysis
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Environmental reporting
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Waste%20-%20Log.JPG-L4Fjzd3XVpFUYCTvRxibDzudtLId8o.jpeg",
                        alt: "Waste Management - Waste Log",
                        label: "Waste Log",
                      },
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/waste%20-%20schedule.JPG-hGrtNnIh8mrATJVRfLt7xMYAcLAQTS.jpeg",
                        alt: "Waste Management - Schedule",
                        label: "Schedule",
                      },
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Waste%20-%20report.JPG-V7PfLRbXLzmyZDJ41DpgylMXXqJvH3.jpeg",
                        alt: "Waste Management - Reports",
                        label: "Reports",
                      },
                    ]}
                    className="rounded-lg border bg-background shadow-xl"
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="staff" className="mt-6">
              <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                <div className="flex flex-col justify-center space-y-4 px-4 lg:w-1/2 lg:px-0">
                  <h3 className="text-xl font-bold sm:text-2xl">Staff Management</h3>
                  <p className="text-base sm:text-lg text-muted-foreground">
                    Efficiently manage your staff with integrated scheduling, certification tracking, and performance
                    monitoring.
                  </p>
                  <ul className="grid gap-3">
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Staff directory
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Shift scheduling
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Certification tracking
                    </li>
                    <li className="flex items-center gap-3">
                      <Check className="h-5 w-5 flex-shrink-0" /> Time-off management
                    </li>
                  </ul>
                </div>
                <div className="lg:w-1/2">
                  <TabbedShowcase
                    images={[
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Staff-%20Staff%20directory.JPG-3kaDoXyggxNE4YqMa92bpZHkoYVxGr.jpeg",
                        alt: "Staff Management - Directory",
                        label: "Directory",
                      },
                      {
                        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Staff-%20%20schedule.JPG-BSbXe0Lt8nmS24HCOsCwpW2X8rI8nR.jpeg",
                        alt: "Staff Management - Schedule",
                        label: "Schedule",
                      },
                    ]}
                    className="rounded-lg border bg-background shadow-xl"
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
              Choose the plan that's right for your business. Save 30% with annual billing.
            </p>
          </div>

          <div className="grid gap-6 pt-12 px-4 md:px-0 lg:grid-cols-2 xl:gap-12">
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
                  Save 30% with annual billing - First 200 waitlist members only
                </p>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Single location
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Up to 50 staff members
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> All core features
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Email support
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
                    <Check className="h-4 w-4" /> Up to 3 locations included
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Unlimited staff members
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4" /> Custom integrations
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="mt-auto">
                <PricingCardButton className="w-full" />
              </CardFooter>
            </Card>
          </div>
        </section>

        <section id="waitlist" className="container mx-auto px-4 py-24 sm:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">Join the Waitlist</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Be one of the first 200 members to get 30% off annual plans when we launch.
            </p>
          </div>

          <div className="mx-auto max-w-lg pt-12 px-4 md:px-0">
            <WaitlistForm />
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
                  The 30% discount on annual plans is available to the first 200 members who join our waitlist. Once we
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
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Treq-FxPFWJ6qzF7ntQv8yF2ds4lE6SW1Wd.png"
              alt="TREQ Logo"
              width={80}
              height={27}
              className="dark:brightness-0 dark:invert"
            />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by{" "}
              <a href="#" className="font-medium underline underline-offset-4">
                TREQ
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
