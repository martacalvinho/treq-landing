
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const PricingSection = () => {
  const monthlyPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "month",
      description: "Up to 100 materials/month",
      subtitle: "Ideal for small studios with light usage.",
      isPopular: false
    },
    {
      name: "Studio",
      price: "$89",
      period: "month", 
      description: "Up to 500 materials/month",
      subtitle: "Designed for most active studios.",
      isPopular: true
    },
    {
      name: "Growth",
      price: "$299",
      period: "month",
      description: "Up to 1,500 materials/month", 
      subtitle: "For large firms managing many projects.",
      isPopular: false
    }
  ];

  const onboardingPlans = [
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
        </div>

        <Tabs defaultValue="monthly" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
            <TabsTrigger value="monthly">Monthly Pricing</TabsTrigger>
            <TabsTrigger value="onboarding">Onboarding Fee</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monthly">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {monthlyPlans.map((plan, index) => (
                <div key={index} className={`bg-white border-2 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative flex flex-col ${plan.isPopular ? 'border-coral' : 'border-gray-200'}`}>
                  {plan.isPopular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-coral text-white">
                      Most Popular
                    </Badge>
                  )}
                  <div className="text-center mb-6 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {plan.price}<span className="text-lg font-normal text-gray-600">/{plan.period}</span>
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-2">{plan.description}</p>
                    <p className="text-gray-600 text-sm">{plan.subtitle}</p>
                  </div>
                  
                  <Button className="w-full bg-coral hover:bg-coral-600 text-white font-semibold py-3 mt-auto">
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600">
                $1.50 per extra material per month.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="onboarding">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {onboardingPlans.map((plan, index) => (
                <div key={index} className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                  <div className="text-center mb-6 flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-6">{plan.description}</p>
                    
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {plan.price}
                    </div>
                    <div className="text-sm text-gray-600">{plan.period}</div>
                  </div>
                  
                  <Button className="w-full bg-coral hover:bg-coral-600 text-white font-semibold py-3 mt-auto">
                    Get Started
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Want to bring in more history? It's just $1.50 per extra material.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default PricingSection;
