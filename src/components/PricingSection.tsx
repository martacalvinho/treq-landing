
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const onboardingFeatures = [
    "Upload up to 100 past projects",
    "AI extracts & tags all materials",
    "Custom taxonomy setup",
    "Dedicated onboarding call",
    "Data migration & cleanup"
  ];

  const subscriptionFeatures = [
    "Unlimited material searches",
    "2 new projects processed monthly",
    "Duplicate detection alerts",
    "Manufacturer tracking",
    "Team collaboration tools",
    "Priority support"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Early-Adopter Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start with complete setup, then maintain with ongoing support
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Onboarding Package */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-gray-200 shadow-lg">
            <div className="bg-gray-600 text-white inline-block px-4 py-2 rounded-full text-sm font-bold mb-6">
              ONE-TIME SETUP
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Onboarding</h3>
            
            <ul className="space-y-3 mb-8">
              {onboardingFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                €1,000
              </div>
              <p className="text-gray-600">One-time setup fee</p>
            </div>
            
            <Button size="lg" variant="outline" className="border-gray-400 text-gray-700 px-8 py-4 text-lg font-semibold w-full hover:bg-gray-50">
              Schedule Setup Call
            </Button>
          </div>

          {/* Subscription Plan */}
          <div className="bg-gradient-to-br from-coral-50 to-coral-100 rounded-2xl p-8 border-2 border-coral-200 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-coral text-white px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </span>
            </div>
            
            <div className="bg-coral text-white inline-block px-4 py-2 rounded-full text-sm font-bold mb-6 mt-2">
              MONTHLY SUBSCRIPTION
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ongoing Access</h3>
            
            <ul className="space-y-3 mb-8">
              {subscriptionFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-coral flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                €49
                <span className="text-lg font-medium text-gray-600">/month</span>
              </div>
              <p className="text-coral font-semibold">First month free</p>
            </div>
            
            <Button size="lg" className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold w-full transition-all duration-200 hover:scale-105 hover:shadow-lg">
              Start Free Trial
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 bg-gray-50 inline-block px-6 py-3 rounded-full border border-gray-200">
            <strong>Bundle both</strong> and save 20% on the setup fee
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
