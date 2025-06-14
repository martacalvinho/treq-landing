
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import PlanFinderWizard from "./PlanFinderWizard";

const PricingSection = () => {
  const [showWizard, setShowWizard] = useState(false);

  const studioFeatures = [
    "10 new projects per month",
    "Full search access",
    "Duplicate alerts",
    "Manufacturer insights", 
    "Team collaboration tools",
    "Priority support"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with our most popular plan or find your perfect fit
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Left Column - Most Popular Studio Plan */}
          <div className="relative bg-gradient-to-br from-coral-50 to-coral-100 border-2 border-coral-200 rounded-2xl p-8 shadow-xl">
            {/* Most Popular Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-coral text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                <Star className="h-4 w-4" />
                MOST POPULAR
              </div>
            </div>
            
            <div className="text-center mb-6 mt-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Studio</h3>
              <p className="text-gray-600 mb-6">Perfect for growing studios</p>
              
              {/* Setup Fee Section */}
              <div className="mb-6 p-4 bg-white/70 rounded-lg border border-coral-200">
                <div className="text-sm font-semibold text-coral mb-2">Required One-Time Setup</div>
                <div className="text-lg font-bold text-gray-900 mb-1">€199 for 25 projects</div>
                <div className="text-xs text-gray-600 mb-2">or €8 per project after free trial</div>
                <div className="text-xs text-gray-500 italic">*Setup fee is mandatory to organize your materials database</div>
              </div>
              
              {/* Monthly Price */}
              <div className="mb-1">
                <span className="text-sm text-gray-600">Then monthly:</span>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-4">
                €49<span className="text-lg font-medium text-gray-600">/mo</span>
              </div>
            </div>
            
            {/* Features */}
            <div className="space-y-3 mb-8">
              {studioFeatures.map((feature, index) => (
                <div key={index} className="flex items-center text-sm">
                  <Check className="h-4 w-4 text-coral mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button className="w-full bg-coral hover:bg-coral-600 text-white font-semibold py-3 transition-all duration-200 hover:scale-105">
              Start Studio Plan
            </Button>
          </div>

          {/* Right Column - Helper Sections */}
          <div className="space-y-6">
            
            {/* Plan Finder */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Not sure which plan fits?</h4>
              <p className="text-gray-600 text-sm mb-6">
                Answer three quick questions and we'll recommend the ideal setup & monthly plan for your studio.
              </p>
              <Button 
                onClick={() => setShowWizard(true)}
                variant="outline" 
                className="w-full border-coral text-coral hover:bg-coral hover:text-white font-semibold"
              >
                Find My Perfect Plan
              </Button>
            </div>

            {/* Setup Fee Explanation */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">What's the setup fee?</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong>Free trial:</strong> Start with up to 4 projects at no cost
                </p>
                <p>
                  <strong>After trial:</strong> €8 per project or included in your monthly plan
                </p>
                <p>
                  We process all your historical specs, normalize manufacturer data, and structure everything for instant search. This one-time setup creates your searchable materials database.
                </p>
              </div>
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
