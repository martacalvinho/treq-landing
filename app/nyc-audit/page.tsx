"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { SiteHeader } from "@/components/site-header"
import { Badge } from "@/components/ui/badge"
import { Analytics } from '@vercel/analytics/react'

const complianceQuestions = [
  {
    id: 1,
    question: "Have you renewed your Food Service Establishment permit this year?",
    riskAmount: 1000
  },
  {
    id: 2,
    question: "Have you renewed your Sidewalk Café Permit this year?",
    riskAmount: 800
  },
  {
    id: 3,
    question: "Do you have a certified food protection manager on site during all hours of operation?",
    riskAmount: 600
  },
  {
    id: 4,
    question: "Are your food temperature logs up to date?",
    riskAmount: 500
  },
  {
    id: 5,
    question: "Do you have proper pest control measures in place?",
    riskAmount: 700
  },
  {
    id: 6,
    question: "Is your grease interceptor properly maintained?",
    riskAmount: 900
  },
  {
    id: 7,
    question: "Do you have proper food storage containers and labels?",
    riskAmount: 400
  },
  {
    id: 8,
    question: "Are your employees wearing proper hair restraints?",
    riskAmount: 300
  },
  {
    id: 9,
    question: "Is your hand washing station properly equipped?",
    riskAmount: 500
  },
  {
    id: 10,
    question: "Do you have a current letter grade posted?",
    riskAmount: 1000
  },
  {
    id: 11,
    question: "Are your cleaning logs properly maintained?",
    riskAmount: 400
  },
  {
    id: 12,
    question: "Do you have proper sanitizer test strips?",
    riskAmount: 300
  },
  {
    id: 13,
    question: "Is your employee health policy up to date?",
    riskAmount: 600
  },
  {
    id: 14,
    question: "Do you have a proper allergen awareness program?",
    riskAmount: 500
  },
  {
    id: 15,
    question: "Are your refrigeration units maintaining proper temperature?",
    riskAmount: 800
  },
  {
    id: 16,
    question: "Do you have a current fire suppression system inspection certificate?",
    riskAmount: 1200
  },
  {
    id: 17,
    question: "Is your Choking First Aid poster properly displayed in a visible location?",
    riskAmount: 400
  },
  {
    id: 18,
    question: "Do you maintain proper documentation of your employee food handler certifications?",
    riskAmount: 600
  },
  {
    id: 19,
    question: "Is your waste oil storage and disposal properly documented?",
    riskAmount: 700
  },
  {
    id: 20,
    question: "Do you have proper documentation for your food suppliers and deliveries?",
    riskAmount: 500
  }
]

export default function NYCAuditPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{[key: number]: boolean}>({})
  const [showResults, setShowResults] = useState(false)

  const handleAnswer = (answer: boolean) => {
    setAnswers(prev => ({ ...prev, [currentQuestion]: answer }))
    if (currentQuestion < complianceQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

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
                    Your Restaurant{" "}
                    <span className="bg-[#2563EB] text-white px-3 py-1 rounded-md">
                      Quick Check Results
                    </span>
                  </CardTitle>
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
              This quick assessment is for informational purposes only and does not constitute legal or professional advice. 
              Results are based on your responses and may not reflect all compliance requirements.
            </p>
          </div>
        </footer>
        <Analytics />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 sm:py-32">
          {showResults ? (
            <div className="mx-auto max-w-4xl">
              <Card className="border-0 shadow-lg">
                <CardHeader className="space-y-6">
                  <CardTitle className="text-3xl font-bold text-center">
                    Your Restaurant{" "}
                    <span className="bg-[#2563EB] text-white px-3 py-1 rounded-md">
                      Quick Check Results
                    </span>
                  </CardTitle>
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
          ) : (
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-col items-center gap-4 text-center mb-12">
                <Badge variant="secondary" className="w-fit">
                  Limited Time Offer - 30% Off Annual Plans
                </Badge>
                <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.2]">
                  Do a Quick Check on your{" "}
                  <span className="bg-[#2563EB] text-white px-3 py-1 rounded-md">
                    NYC Compliance
                  </span>
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
                      <h3 className="text-xl md:text-2xl font-medium text-center">
                        {complianceQuestions[currentQuestion].question}
                      </h3>
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
            This quick assessment is for informational purposes only and does not constitute legal or professional advice. 
            Results are based on your responses and may not reflect all compliance requirements.
          </p>
        </div>
      </footer>
      <Analytics />
    </div>
  )
}
