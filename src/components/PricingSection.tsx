
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const features = [
    "Unlimited projects until 2025",
    "Dedicated onboarding call",
    "Influence the roadmap"
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Early-Adopter Offer
          </h2>
          
          <div className="bg-gradient-to-br from-coral-50 to-coral-100 rounded-2xl p-8 border-2 border-coral-200 shadow-lg">
            <div className="bg-coral text-white inline-block px-4 py-2 rounded-full text-sm font-bold mb-6">
              FOUNDING STUDIO PLAN
            </div>
            
            <ul className="space-y-3 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3 justify-center">
                  <Check className="h-5 w-5 text-coral flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            
            <div className="mb-6">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                €25 
                <span className="text-lg font-medium text-gray-600">/mo</span>
              </div>
              <p className="text-coral font-semibold">First month free</p>
            </div>
            
            <Button size="lg" className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold w-full transition-all duration-200 hover:scale-105">
              Book My Onboarding Call
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
