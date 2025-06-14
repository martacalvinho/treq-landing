
import React from 'react';
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      description: "Includes setup of up to 100 materials",
      price: "$99",
      period: "one-time onboarding"
    },
    {
      name: "Studio",
      description: "Includes setup of up to 500 materials",
      price: "$499",
      period: "one-time onboarding"
    },
    {
      name: "Growth",
      description: "Includes setup of up to 1,500 materials",
      price: "$999",
      period: "one-time onboarding"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Each plan includes a one-time onboarding fee based on how much past material history you want us to import for you:
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-600">{plan.period}</div>
              </div>
              
              <Button className="w-full bg-coral hover:bg-coral-600 text-white font-semibold py-3">
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Want to bring in more history? It's just $1.50 per extra material
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
