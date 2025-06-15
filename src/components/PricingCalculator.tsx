
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const PricingCalculator = () => {
  const [monthlyMaterials, setMonthlyMaterials] = useState([250]);
  const [onboardingMaterials, setOnboardingMaterials] = useState([300]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculateMonthlyPrice = (materials: number) => {
    if (materials <= 100) return 29;
    if (materials <= 500) return 89;
    if (materials <= 1500) return 299;
    return 299 + Math.ceil((materials - 1500) * 1.5);
  };

  const calculateOnboardingPrice = (materials: number) => {
    if (materials <= 100) return 99;
    if (materials <= 500) return 499;
    if (materials <= 1500) return 999;
    return 999 + Math.ceil((materials - 1500) * 1.5);
  };

  const getPlanName = (materials: number) => {
    if (materials <= 100) return "Starter";
    if (materials <= 500) return "Studio";
    if (materials <= 1500) return "Growth";
    return "Enterprise";
  };

  const monthlyPrice = calculateMonthlyPrice(monthlyMaterials[0]);
  const onboardingPrice = calculateOnboardingPrice(onboardingMaterials[0]);
  const planName = getPlanName(monthlyMaterials[0]);

  const handleGetStarted = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          planName,
          amount: monthlyPrice * 100, // convert to cents
          materials: monthlyMaterials[0]
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      window.open('http://calendly.com/treqy', '_blank');
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Pricing Calculator
      </h3>
      
      <div className="space-y-8">
        {/* Monthly Materials */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Monthly Materials: {monthlyMaterials[0]} materials
          </label>
          <Slider
            value={monthlyMaterials}
            onValueChange={setMonthlyMaterials}
            max={2000}
            min={50}
            step={25}
            className="mb-4"
          />
          <div className="text-center">
            <div className="text-3xl font-bold text-coral mb-2">
              ${monthlyPrice}/month
            </div>
            <div className="text-lg font-medium text-gray-700">
              {planName} Plan
            </div>
          </div>
        </div>

        {/* Onboarding Materials */}
        <div className="border-t pt-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Onboarding Materials: {onboardingMaterials[0]} materials
          </label>
          <Slider
            value={onboardingMaterials}
            onValueChange={setOnboardingMaterials}
            max={2000}
            min={50}
            step={25}
            className="mb-4"
          />
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-2">
              ${onboardingPrice} one-time
            </div>
            <div className="text-sm text-gray-600">
              Setup fee for {onboardingMaterials[0]} materials
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="bg-coral-50 rounded-lg p-6 border border-coral-200">
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Your Estimated Cost</h4>
            <div className="text-2xl font-bold text-coral mb-1">
              ${onboardingPrice} + ${monthlyPrice}/month
            </div>
            <p className="text-sm text-gray-600">
              {planName} plan with {monthlyMaterials[0]} monthly materials
            </p>
            <Button 
              className="mt-4 bg-coral hover:bg-coral-600 text-white"
              onClick={handleGetStarted}
            >
              Get Started with {planName}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;
