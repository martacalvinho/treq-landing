
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import PlanFinderWizard from "./PlanFinderWizard";

const PricingSection = () => {
  const [showWizard, setShowWizard] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "$29",
      setupFee: "$99",
      setupDescription: "Includes setup of up to 100 materials",
      features: [
        "2 new projects per month",
        "Full search access",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Studio",
      price: "$49",
      setupFee: "$499",
      setupDescription: "Includes setup of up to 500 materials",
      features: [
        "10 new projects per month",
        "Full search access",
        "Duplicate alerts",
        "Manufacturer insights", 
        "Team collaboration tools",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Growth",
      price: "$99",
      setupFee: "$999",
      setupDescription: "Includes setup of up to 1,500 materials",
      features: [
        "20 new projects per month",
        "Full search access",
        "Duplicate alerts",
        "Manufacturer insights",
        "Advanced team collaboration",
        "API/Export access",
        "Priority support + Reports"
      ],
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <div className="text-lg text-gray-600 max-w-4xl mx-auto mb-6 space-y-4">
            <p>Each plan includes a one-time onboarding fee based on how much past material history you want us to import for you:</p>
            <div className="text-left max-w-2xl mx-auto space-y-2">
              <p>Starter: Includes setup of up to 100 materials - $99 one-time onboarding</p>
              <p>Studio: Includes setup of up to 500 materials – $499 one-time onboarding</p>
              <p>Growth: Includes setup of up to 1,500 materials – $999 one-time onboarding</p>
            </div>
            <p>Want to bring in more history? It's just $1.50 per extra material</p>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <div key={plan.name} className={`relative rounded-2xl p-8 shadow-xl ${
              plan.popular 
                ? 'bg-gradient-to-br from-coral-50 to-coral-100 border-2 border-coral-200' 
                : 'bg-white border border-gray-200'
            }`}>
              {/* Most Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-coral text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    MOST POPULAR
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6 mt-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                
                {/* One-Time Setup Fee Section */}
                <div className={`mb-6 p-4 rounded-lg border ${
                  plan.popular ? 'bg-white/70 border-coral-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className={`text-sm font-semibold mb-2 ${
                    plan.popular ? 'text-coral' : 'text-gray-700'
                  }`}>
                    One-Time Onboarding
                  </div>
                  <div className="text-lg font-bold text-gray-900 mb-1">{plan.setupFee}</div>
                  <div className="text-xs text-gray-600 mb-2">{plan.setupDescription}</div>
                </div>
                
                {/* Monthly Price */}
                <div className="mb-1">
                  <span className="text-sm text-gray-600">Then monthly:</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-4">
                  {plan.price}<span className="text-lg font-medium text-gray-600">/mo</span>
                </div>
              </div>
              
              {/* Features */}
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center text-sm">
                    <Check className={`h-4 w-4 mr-3 flex-shrink-0 ${
                      plan.popular ? 'text-coral' : 'text-green-500'
                    }`} />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button className={`w-full font-semibold py-3 transition-all duration-200 hover:scale-105 ${
                plan.popular 
                  ? 'bg-coral hover:bg-coral-600 text-white' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}>
                Start {plan.name} Plan
              </Button>
            </div>
          ))}
        </div>

        {/* Setup Fee Explanation */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">What's the onboarding fee?</h4>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                We process all your historical specs, normalize manufacturer data, and structure everything for instant search.
              </p>
              <p>
                <strong>Need more materials?</strong> Add extra history at just $1.50 per material beyond your plan's limit.
              </p>
              <p>
                This one-time setup creates your searchable materials database.
              </p>
            </div>
          </div>
        </div>

        {/* Plan Finder Wizard Modal */}
        <PlanFinderWizard 
          isOpen={showWizard} 
          onClose={() => setShowWizard(false)} 
        />
      </div>
    </section>
  );
};

export default PricingSection;
