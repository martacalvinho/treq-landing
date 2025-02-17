"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { Analytics } from "@vercel/analytics/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import toast from "@/components/ui/toast"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Replace this with your Google Apps Script web app URL for the audit responses
const AUDIT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyTL3CJdIJIhVOJEC3VmjZUFC3P1TOM_tlO9hAj-YwpHxD0ypgUs4VHTarzdn282AzR/exec'

const complianceQuestions = [
  {
    id: 1,
    question: "Have you renewed your Food Service Establishment permit?",
    riskAmount: 1500,
    info: "Food Service Establishment permits must be renewed annually. Operating without a valid permit can result in fines up to $1,500."
  },
  {
    id: 2,
    question: "Is your outdoor dining structure compliant with 2025 rules?",
    riskAmount: 1000,
    info: "New 2025 rules require structures to be easily removable, have no enclosed ceiling, and maintain clear paths for pedestrians and emergency access."
  },
  {
    id: 3,
    question: "Do you have a valid Certificate of Fitness for fire safety?",
    riskAmount: 1000,
    info: "Required for staff handling fire systems and equipment. Must be renewed every 3 years with proper training."
  },
  {
    id: 4,
    question: "Are your food handlers certified?",
    riskAmount: 600,
    info: "At least one supervisor with food protection certification must be on duty at all times. Certification valid for 5 years."
  },
  {
    id: 5,
    question: "Do you maintain proper food temperatures?",
    riskAmount: 1000,
    info: "Cold foods must be kept at 41°F or below, hot foods at 140°F or above. Regular temperature logs required."
  },
  {
    id: 6,
    question: "Is your grease interceptor cleaned monthly?",
    riskAmount: 500,
    info: "Monthly cleaning and maintenance required. Records must be kept for minimum of 2 years."
  },
  {
    id: 7,
    question: "Do you have proper pest control measures?",
    riskAmount: 300,
    info: "Professional pest control service required monthly. Must maintain service records and pest monitoring logs."
  },
  {
    id: 8,
    question: "Are your food storage areas properly maintained?",
    riskAmount: 300,
    info: "Food must be stored 6 inches off floor, properly labeled, and in approved containers. FIFO rotation required."
  },
  {
    id: 9,
    question: "Do you have proper hand washing stations?",
    riskAmount: 400,
    info: "Dedicated hand washing sinks required in food prep areas with hot water, soap, and paper towels."
  },
  {
    id: 10,
    question: "Are your cleaning logs up to date?",
    riskAmount: 200,
    info: "Daily cleaning logs required for all food contact surfaces and equipment. Must be readily available for inspection."
  },
  {
    id: 11,
    question: "Is your ventilation system regularly cleaned?",
    riskAmount: 800,
    info: "Professional hood cleaning required quarterly. Inspection certificates must be displayed."
  },
  {
    id: 12,
    question: "Do you have proper food labeling?",
    riskAmount: 300,
    info: "All prepared foods must be labeled with name, date of preparation, and use-by date."
  },
  {
    id: 13,
    question: "Are your refrigeration units working properly?",
    riskAmount: 500,
    info: "Units must maintain 41°F or below. Daily temperature logs and regular maintenance required."
  },
  {
    id: 14,
    question: "Do you have a current health inspection grade card displayed?",
    riskAmount: 1000,
    info: "Grade card must be prominently displayed. Failure to post can result in additional fines."
  },
  {
    id: 15,
    question: "Are your employees wearing proper hair restraints?",
    riskAmount: 200,
    info: "All food handlers must wear hair nets or caps. Beard guards required for facial hair."
  },
  {
    id: 16,
    question: "Do you have a valid workers' compensation insurance?",
    riskAmount: 2500,
    info: "Required for all employees. Failure to provide can result in fines and penalties."
  },
  {
    id: 17,
    question: "Is your alcohol license current (if applicable)?",
    riskAmount: 5000,
    info: "Required for all establishments serving alcohol. Must be renewed annually."
  },
  {
    id: 18,
    question: "Do you have proper waste disposal contracts?",
    riskAmount: 1000,
    info: "Required for all establishments generating waste. Must be renewed annually."
  },
  {
    id: 19,
    question: "Are your emergency exits properly marked and accessible?",
    riskAmount: 2000,
    info: "Required for all establishments. Must be clearly marked and accessible at all times."
  },
  {
    id: 20,
    question: "Do you have proper food allergen warnings?",
    riskAmount: 1000,
    info: "Required for all establishments serving food. Must be clearly displayed."
  },
  {
    id: 21,
    question: "Are ADA-compliant entrances/main facilities provided?",
    riskAmount: 20000,
    info: "Required for all establishments. Must be compliant with ADA regulations."
  },
  {
    id: 22,
    question: "Are you using approved trash containers with secure lids?",
    riskAmount: 200,
    info: "Required for all establishments generating waste. Must be approved and have secure lids."
  }
]

function InfoButton({ info }: { info: string }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <>
      {/* Desktop Tooltip */}
      <div className="hidden md:block">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                <Info className="h-5 w-5 text-muted-foreground hover:text-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-[300px] p-4 text-sm">
              <p>{info}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile Dialog */}
      <div className="md:hidden">
        <button 
          onClick={() => setIsDialogOpen(true)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Info className="h-5 w-5 text-muted-foreground hover:text-foreground" />
        </button>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Additional Information</DialogTitle>
            </DialogHeader>
            <div className="p-4 text-sm">
              <p>{info}</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}

export default function NYCAuditPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: boolean }>({})
  const [showResults, setShowResults] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDialog, setShowDialog] = useState(true)
  const [showQuestions, setShowQuestions] = useState(false)
  const [email, setEmail] = useState("")
  const [restaurantName, setRestaurantName] = useState("")

  const calculateRiskAmount = () => {
    return Object.entries(answers).reduce((total, [questionId, answer]) => {
      if (!answer) {
        return total + complianceQuestions[parseInt(questionId)].riskAmount
      }
      return total
    }, 0)
  }

  const progress = ((currentQuestion + 1) / complianceQuestions.length) * 100
  const currentViolations = Object.values(answers).filter(a => !a).length
  const currentRiskAmount = calculateRiskAmount()

  const jsonp = (url: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      
      const script = document.createElement('script');
      script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${callbackName}`;
      
      (window as any)[callbackName] = (data: any) => {
        delete (window as any)[callbackName];
        document.body.removeChild(script);
        resolve(data);
      };
      
      script.onerror = () => {
        delete (window as any)[callbackName];
        document.body.removeChild(script);
        reject(new Error('JSONP request failed'));
      };
      
      document.body.appendChild(script);
    });
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && restaurantName) {
      setShowQuestions(true);
    }
  };

  const handleAnswer = async (answer: boolean) => {
    const newAnswers = { ...answers, [currentQuestion]: answer }
    setAnswers(newAnswers)

    if (currentQuestion === complianceQuestions.length - 1) {
      setIsSubmitting(true)
      try {
        // Prepare data for submission
        const formData = {
          email,
          restaurantName,
          answers: Object.entries(newAnswers).map(([questionId, answer]) => ({
            question: complianceQuestions[parseInt(questionId)].question,
            answer: answer ? 'Yes' : 'No',
            riskAmount: answer ? 0 : complianceQuestions[parseInt(questionId)].riskAmount
          })),
          totalRisk: calculateRiskAmount(),
          totalViolations: Object.values(newAnswers).filter(a => !a).length,
          timestamp: new Date().toISOString()
        }

        console.log('Submitting audit results:', formData)

        // Create URL with parameters
        const params = new URLSearchParams({
          email,
          restaurantName,
          data: JSON.stringify(formData)
        }).toString()

        const url = `${AUDIT_SCRIPT_URL}?${params}`
        console.log('Sending request to:', url)

        // Use JSONP
        const result = await jsonp(url)
        console.log('Response:', result)

        if (result.result === 'error') {
          throw new Error(result.message || 'Failed to save audit results')
        }

        // Track completion in GA
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'complete_audit', {
            'event_category': 'audit',
            'total_violations': formData.totalViolations,
            'total_risk': formData.totalRisk,
            'restaurant': restaurantName
          })
        }

      } catch (error) {
        console.error('Failed to save audit results:', error)
        toast({
          title: "Error",
          description: "Failed to save your audit results. Please try again.",
          variant: "destructive"
        })
      } finally {
        setIsSubmitting(false)
        setShowResults(true)
      }
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  if (showResults) {
    const riskAmount = calculateRiskAmount()
    const violations = Object.values(answers).filter(a => !a).length

    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <section className="container mx-auto px-4 py-24 sm:py-32">
            <div className="mx-auto max-w-4xl">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-6">
                  <CardTitle className="text-3xl font-bold text-center">
                    NYC Restaurant Compliance Check
                  </CardTitle>
                  <p className="text-center text-muted-foreground">
                    Answer 15 quick questions about your restaurant's compliance with NYC regulations. This check is for informational purposes only and does not constitute legal or professional advice.
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-red-50 border-8 border-red-100">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-red-600">
                          ${riskAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-red-600 font-medium">Potential Fines</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-16">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#2563EB]">
                          {violations}
                        </p>
                        <p className="text-sm text-gray-600">Violations</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#2563EB]">
                          {complianceQuestions.length - violations}
                        </p>
                        <p className="text-sm text-gray-600">Compliant Areas</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-amber-500">⚠️</span>
                      Areas to Look Into:
                    </h4>
                    <ul className="space-y-3">
                      {Object.entries(answers).map(([questionId, answer]) => {
                        if (!answer) {
                          const q = complianceQuestions[parseInt(questionId)]
                          return (
                            <li key={q.id} className="bg-white rounded-lg border border-amber-100 p-4">
                              <p className="font-medium">{q.question}</p>
                              <p className="text-sm text-red-600 font-medium mt-2">
                                Potential fine: ${q.riskAmount}
                              </p>
                            </li>
                          )
                        }
                        return null
                      })}
                    </ul>
                  </div>

                  <div className="bg-[#2563EB]/5 p-8 rounded-lg border border-[#2563EB]/10 text-center space-y-6">
                    <h4 className="text-2xl font-semibold">Ready to protect your business?</h4>
                    <p className="text-lg text-muted-foreground">
                      Get 30% off annual Treqy subscription to fix these compliance risks
                    </p>
                    <Link href="/#waitlist" className="inline-block w-full sm:w-auto">
                      <Button 
                        size="lg"
                        className="w-full sm:w-auto bg-black hover:bg-black/90 text-lg px-8 py-6 h-auto"
                      >
                        Get Protected Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
        <footer className="py-6 border-t">
          <div className="container mx-auto px-4">
            <p className="text-sm text-muted-foreground text-center">
              This compliance check is for informational purposes only and does not constitute legal or professional advice. 
              Results are based on your responses and may not reflect all compliance requirements. Always consult with qualified professionals for specific advice.
            </p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Questions? Contact us at{" "}
              <a href="mailto:hello@treqy.com" className="text-[#2563EB] hover:underline">
                hello@treqy.com
              </a>
            </p>
          </div>
        </footer>
        <Analytics />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SiteHeader />
      <Analytics />

      {/* Submitting Modal */}
      <Dialog open={isSubmitting} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Submitting Your Answers</DialogTitle>
            <DialogDescription>
              Please wait while we save your audit results...
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 sm:py-32">
          {showResults ? (
            <div className="mx-auto max-w-4xl">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-6">
                  <CardTitle className="text-3xl font-bold text-center">
                    NYC Restaurant Compliance Check
                  </CardTitle>
                  <p className="text-center text-muted-foreground">
                    Answer 15 quick questions about your restaurant's compliance with NYC regulations. This check is for informational purposes only and does not constitute legal or professional advice.
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-48 h-48 rounded-full bg-red-50 border-8 border-red-100">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-red-600">
                          ${calculateRiskAmount().toLocaleString()}
                        </p>
                        <p className="text-sm text-red-600 font-medium">Potential Fines</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-16">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#2563EB]">
                          {Object.values(answers).filter(a => !a).length}
                        </p>
                        <p className="text-sm text-gray-600">Violations</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-[#2563EB]">
                          {complianceQuestions.length - Object.values(answers).filter(a => !a).length}
                        </p>
                        <p className="text-sm text-gray-600">Compliant Areas</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <span className="text-amber-500">⚠️</span>
                      Areas to Look Into:
                    </h4>
                    <ul className="space-y-3">
                      {Object.entries(answers).map(([questionId, answer]) => {
                        if (!answer) {
                          const q = complianceQuestions[parseInt(questionId)]
                          return (
                            <li key={q.id} className="bg-white rounded-lg border border-amber-100 p-4">
                              <p className="font-medium">{q.question}</p>
                              <p className="text-sm text-red-600 font-medium mt-2">
                                Potential fine: ${q.riskAmount}
                              </p>
                            </li>
                          )
                        }
                        return null
                      })}
                    </ul>
                  </div>

                  <div className="bg-[#2563EB]/5 p-8 rounded-lg border border-[#2563EB]/10 text-center space-y-6">
                    <h4 className="text-2xl font-semibold">Ready to protect your business?</h4>
                    <p className="text-lg text-muted-foreground">
                      Get 30% off annual Treqy subscription to fix these compliance risks
                    </p>
                    <Link href="/#waitlist" className="inline-block w-full sm:w-auto">
                      <Button 
                        size="lg"
                        className="w-full sm:w-auto bg-black hover:bg-black/90 text-lg px-8 py-6 h-auto"
                      >
                        Get Protected Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : !showQuestions ? (
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center gap-4 text-center mb-12">
                <Badge variant="secondary" className="w-fit">
                  Limited Time Offer - 30% Off Annual Plans
                </Badge>
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.2]">
                  Do a Quick Check on your{" "}
                  <span className="bg-[#2D5BFF] text-white px-3 py-1 rounded-md">NYC</span>{" "}
                  <span className="bg-[#2D5BFF] text-white px-3 py-1 rounded-md">Compliance</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Take 2 minutes to see how your restaurant is doing
                </p>
                <p className="text-sm font-medium text-red-600">
                  92% of NYC restaurants find areas for improvement
                </p>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="relative pt-1">
                      <Progress value={0} className="h-2" />
                      <div className="flex justify-between mt-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Question 1 of {complianceQuestions.length}
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                          0% Complete
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-[#2563EB]/5 p-8 rounded-xl">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="text-xl md:text-2xl font-medium text-center">
                          {complianceQuestions[0].question}
                        </h3>
                        <InfoButton info={complianceQuestions[0].info} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto opacity-50">
                      <Button
                        size="lg"
                        className="bg-black hover:bg-black/90 h-16 text-lg"
                        disabled
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Yes
                        </span>
                      </Button>
                      <Button
                        size="lg"
                        className="bg-black hover:bg-black/90 h-16 text-lg"
                        disabled
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          No
                        </span>
                      </Button>
                    </div>
                  </div>

                  {!showQuestions && (
                    <div className="text-center">
                      <Button
                        onClick={() => setShowDialog(true)}
                        className="bg-[#2563EB] hover:bg-[#2563EB]/90"
                      >
                        Enter Your Details to Start
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Dialog 
                open={showDialog} 
                onOpenChange={setShowDialog}
                onClose={(open) => {
                  // Only allow closing if questions are started
                  if (showQuestions) {
                    setShowDialog(open)
                  }
                }}
              >
                <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => {
                  // Prevent closing on click outside if questions haven't started
                  if (!showQuestions) {
                    e.preventDefault()
                  }
                }}>
                  <DialogHeader>
                    <DialogTitle>Start Your Assessment</DialogTitle>
                    <DialogDescription>
                      Enter your details to begin the compliance check
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="restaurant">Restaurant Name</Label>
                        <Input
                          id="restaurant"
                          type="text"
                          placeholder="Your Restaurant Name"
                          value={restaurantName}
                          onChange={(e) => setRestaurantName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@restaurant.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-black hover:bg-black/90"
                    >
                      Start Assessment
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center gap-4 text-center mb-12">
                <Badge variant="secondary" className="w-fit">
                  Limited Time Offer - 30% Off Annual Plans
                </Badge>
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.2]">
                  Do a Quick Check on your{" "}
                  <span className="bg-[#2D5BFF] text-white px-3 py-1 rounded-md">NYC</span>{" "}
                  <span className="bg-[#2D5BFF] text-white px-3 py-1 rounded-md">Compliance</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  Take 2 minutes to see how your restaurant is doing
                </p>
                <p className="text-sm font-medium text-red-600">
                  92% of NYC restaurants find areas for improvement
                </p>
              </div>

              <Card className="border-0 shadow-lg">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <div className="relative pt-1">
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between mt-2">
                        <p className="text-sm font-medium text-muted-foreground">
                          Question {currentQuestion + 1} of {complianceQuestions.length}
                        </p>
                        <p className="text-sm font-medium text-muted-foreground">
                          {Math.round(progress)}% Complete
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-[#2563EB]/5 p-8 rounded-xl">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="text-xl md:text-2xl font-medium text-center">
                          {complianceQuestions[currentQuestion].question}
                        </h3>
                        <InfoButton info={complianceQuestions[currentQuestion].info} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                      <Button
                        size="lg"
                        className="bg-black hover:bg-black/90 h-16 text-lg"
                        onClick={() => handleAnswer(true)}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Yes
                        </span>
                      </Button>
                      <Button
                        size="lg"
                        className="bg-black hover:bg-black/90 h-16 text-lg"
                        onClick={() => handleAnswer(false)}
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          No
                        </span>
                      </Button>
                    </div>

                    {currentQuestion > 0 && (
                      <div className="mt-8 grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl border p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Current Risk</p>
                              <p className="text-3xl font-bold text-[#2563EB] mt-1">
                                ${currentRiskAmount.toLocaleString()}
                              </p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl border p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Violations Found</p>
                              <p className="text-3xl font-bold text-[#2563EB] mt-1">{currentViolations}</p>
                            </div>
                            <div className="h-12 w-12 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                              <svg className="w-6 h-6 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <p className="text-sm text-muted-foreground text-center">
            This compliance check is for informational purposes only and does not constitute legal or professional advice. 
            Results are based on your responses and may not reflect all compliance requirements. Always consult with qualified professionals for specific advice.
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Questions? Contact us at{" "}
            <a href="mailto:hello@treqy.com" className="text-[#2563EB] hover:underline">
              hello@treqy.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
