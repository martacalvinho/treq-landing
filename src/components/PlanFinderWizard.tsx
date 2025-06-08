import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { X, CheckCircle } from "lucide-react";

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WizardAnswers {
  importSize: string;
  monthlyProjects: string;
  advancedNeeds: string;
}

interface RecommendationResult {
  setupPlan: string;
  setupPrice: string;
  monthlyPlan: string;
  monthlyPrice: string;
  isCustom: boolean;
}

const PlanFinderWizard: React.FC<WizardProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<WizardAnswers>({
    importSize: '',
    monthlyProjects: '',
    advancedNeeds: ''
  });
  const [recommendation, setRecommendation] = useState<RecommendationResult | null>(null);

  const questions = [
    {
      id: 'importSize' as keyof WizardAnswers,
      title: 'How many historical material schedules do you want digitised right now?',
      options: [
        { value: 'import_tiny', label: '0-4 specs' },
        { value: 'import_small', label: 'Up to 25' },
        { value: 'import_mid', label: '26-75' },
        { value: 'import_large', label: '76-150' },
        { value: 'import_custom', label: '150+' }
      ]
    },
    {
      id: 'monthlyProjects' as keyof WizardAnswers,
      title: 'Roughly how many new projects will you spec each month?',
      options: [
        { value: 'new_low', label: '0-2' },
        { value: 'new_med', label: '3-10' },
        { value: 'new_high', label: '11-20' },
        { value: 'new_ultra', label: '20+' }
      ]
    },
    {
      id: 'advancedNeeds' as keyof WizardAnswers,
      title: 'Do you need advanced team permissions or API/export access?',
      options: [
        { value: 'adv_yes', label: 'Yes' },
        { value: 'adv_no', label: 'No' }
      ]
    }
  ];

  const calculateRecommendation = (answers: WizardAnswers): RecommendationResult => {
    // Setup plan mapping
    const setupMapping = {
      'import_tiny': { plan: 'Free Setup', price: 'Free up to 4 specs' },
      'import_small': { plan: 'Mini Setup', price: '€199' },
      'import_mid': { plan: 'Pro Setup', price: '€499' },
      'import_large': { plan: 'Full Studio Setup', price: '€799' },
      'import_custom': { plan: 'Custom Setup', price: 'Contact Sales' }
    };

    // Monthly plan mapping
    let monthlyMapping = {
      'new_low': { plan: 'Starter', price: '€29/mo' },
      'new_med': { plan: 'Studio', price: '€49/mo' },
      'new_high': { plan: 'Growth', price: '€99/mo' },
      'new_ultra': { plan: 'Enterprise', price: 'Custom' }
    };

    let setupPlan = setupMapping[answers.importSize as keyof typeof setupMapping];
    let monthlyPlan = monthlyMapping[answers.monthlyProjects as keyof typeof monthlyMapping];

    // Advanced needs logic
    if (answers.advancedNeeds === 'adv_yes') {
      if (answers.monthlyProjects === 'new_low') {
        monthlyPlan = { plan: 'Studio', price: '€49/mo' };
      } else if (answers.monthlyProjects === 'new_med') {
        monthlyPlan = { plan: 'Growth', price: '€99/mo' };
      }
    }

    const isCustom = answers.importSize === 'import_custom' || answers.monthlyProjects === 'new_ultra';

    return {
      setupPlan: setupPlan.plan,
      setupPrice: setupPlan.price,
      monthlyPlan: monthlyPlan.plan,
      monthlyPrice: monthlyPlan.price,
      isCustom
    };
  };

  const handleAnswer = (questionId: keyof WizardAnswers, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate and show recommendation
      const result = calculateRecommendation(newAnswers);
      setRecommendation(result);
    }
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setAnswers({ importSize: '', monthlyProjects: '', advancedNeeds: '' });
    setRecommendation(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Find Your Perfect Plan</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!recommendation ? (
            <>
              {/* Progress */}
              <div className="flex items-center justify-center mb-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep ? 'bg-coral text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 ${
                        step < currentStep ? 'bg-coral' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Question */}
              <div className="text-center mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {questions[currentStep - 1].title}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {questions[currentStep - 1].options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(questions[currentStep - 1].id, option.value)}
                    className="w-full p-4 text-left border border-gray-200 rounded-lg hover:border-coral hover:bg-coral-50 transition-colors"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Recommendation Result */
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-6">
                Here's your perfect SpecClarity plan
              </h4>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <h5 className="font-semibold text-gray-900 mb-2">Setup</h5>
                    <div className="text-lg font-bold text-coral">{recommendation.setupPlan}</div>
                    <div className="text-sm text-gray-600">{recommendation.setupPrice}</div>
                  </div>
                  <div className="text-center">
                    <h5 className="font-semibold text-gray-900 mb-2">Monthly</h5>
                    <div className="text-lg font-bold text-coral">{recommendation.monthlyPlan}</div>
                    <div className="text-sm text-gray-600">{recommendation.monthlyPrice}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {recommendation.isCustom ? (
                  <Button className="w-full bg-coral hover:bg-coral-600 text-white">
                    Contact Sales
                  </Button>
                ) : (
                  <>
                    <Button className="w-full bg-coral hover:bg-coral-600 text-white">
                      {recommendation.setupPlan === 'Free Setup' ? 'Start Free Upload' : 'Schedule Setup Call'}
                    </Button>
                    <button
                      onClick={resetWizard}
                      className="w-full text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Try different answers
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanFinderWizard;
