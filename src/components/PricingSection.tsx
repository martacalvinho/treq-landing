
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      setup: "Free up to 4 specs",
      setupSub: "Then €8 per project",
      monthlyPrice: "€29",
      period: "/mo",
      description: "Perfect for small studios",
      features: [
        { name: "Projects per month", value: "2" },
        { name: "Search Access", included: true },
        { name: "Duplicate Alerts", included: false },
        { name: "Manufacturer Insights", included: false },
        { name: "Team Tools", included: false },
        { name: "Export / API", included: false },
        { name: "Support", value: "Email" }
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Studio",
      setup: "Includes 25 projects",
      setupSub: "(€199 value)",
      monthlyPrice: "€49",
      period: "/mo",
      description: "Most popular for growing studios",
      features: [
        { name: "Projects per month", value: "10" },
        { name: "Search Access", included: true },
        { name: "Duplicate Alerts", included: true },
        { name: "Manufacturer Insights", included: true },
        { name: "Team Tools", included: true },
        { name: "Export / API", included: false },
        { name: "Support", value: "Priority" }
      ],
      cta: "Start Plan",
      popular: true
    },
    {
      name: "Growth",
      setup: "Includes 75 projects",
      setupSub: "(€499 value)",
      monthlyPrice: "€99",
      period: "/mo",
      description: "For established studios",
      features: [
        { name: "Projects per month", value: "20" },
        { name: "Search Access", included: true },
        { name: "Duplicate Alerts", included: true },
        { name: "Manufacturer Insights", included: true },
        { name: "Team Tools", value: "Advanced" },
        { name: "Export / API", included: true },
        { name: "Support", value: "Priority + Reports" }
      ],
      cta: "Start Plan",
      popular: false
    },
    {
      name: "Enterprise",
      setup: "Custom ingestion",
      setupSub: "White-glove service",
      monthlyPrice: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        { name: "Projects per month", value: "Unlimited" },
        { name: "Search Access", included: true },
        { name: "Duplicate Alerts", included: true },
        { name: "Manufacturer Insights", included: true },
        { name: "Team Tools", included: true },
        { name: "Export / API", included: true },
        { name: "Support", value: "Dedicated" }
      ],
      cta: "Contact Sales",
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start free, then scale with your studio's needs
          </p>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <div className="min-w-4xl">
            {/* Desktop View */}
            <div className="hidden lg:block">
              <div className="grid grid-cols-4 gap-6">
                {plans.map((plan, index) => (
                  <div key={index} className={`rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-shadow duration-200 relative ${
                    plan.popular 
                      ? "bg-gradient-to-br from-coral-50 to-coral-100 border-coral-200 scale-105" 
                      : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-coral text-white px-4 py-1 rounded-full text-sm font-bold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}
                    
                    <div className="text-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 mt-2">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                      
                      {/* One-Time Setup */}
                      <div className="mb-4 p-3 bg-white/50 rounded-lg border">
                        <div className="text-sm font-semibold text-gray-700 mb-1">One-Time Setup</div>
                        <div className="text-sm font-bold text-gray-900">{plan.setup}</div>
                        <div className="text-xs text-gray-600">{plan.setupSub}</div>
                      </div>
                      
                      {/* Monthly Price */}
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {plan.monthlyPrice}
                        {plan.period && <span className="text-lg font-medium text-gray-600">{plan.period}</span>}
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-between text-sm">
                          <span className="text-gray-700">{feature.name}</span>
                          <div className="flex items-center">
                            {feature.included !== undefined ? (
                              feature.included ? (
                                <Check className={`h-4 w-4 ${plan.popular ? "text-coral" : "text-green-600"}`} />
                              ) : (
                                <X className="h-4 w-4 text-gray-400" />
                              )
                            ) : (
                              <span className="text-gray-900 font-medium">{feature.value}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className={plan.popular 
                        ? "bg-coral hover:bg-coral-600 text-white w-full font-semibold transition-all duration-200 hover:scale-105" 
                        : "border-gray-400 text-gray-700 font-semibold w-full hover:bg-gray-50"
                      }
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View */}
            <div className="lg:hidden space-y-6">
              {plans.map((plan, index) => (
                <div key={index} className={`rounded-2xl p-6 border-2 shadow-lg ${
                  plan.popular 
                    ? "bg-gradient-to-br from-coral-50 to-coral-100 border-coral-200" 
                    : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                }`}>
                  {plan.popular && (
                    <div className="text-center mb-4">
                      <span className="bg-coral text-white px-4 py-1 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                    
                    {/* One-Time Setup */}
                    <div className="mb-4 p-3 bg-white/50 rounded-lg border">
                      <div className="text-sm font-semibold text-gray-700 mb-1">One-Time Setup</div>
                      <div className="text-sm font-bold text-gray-900">{plan.setup}</div>
                      <div className="text-xs text-gray-600">{plan.setupSub}</div>
                    </div>
                    
                    {/* Monthly Price */}
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {plan.monthlyPrice}
                      {plan.period && <span className="text-lg font-medium text-gray-600">{plan.period}</span>}
                    </div>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{feature.name}</span>
                        <div className="flex items-center">
                          {feature.included !== undefined ? (
                            feature.included ? (
                              <Check className={`h-4 w-4 ${plan.popular ? "text-coral" : "text-green-600"}`} />
                            ) : (
                              <X className="h-4 w-4 text-gray-400" />
                            )
                          ) : (
                            <span className="text-gray-900 font-medium">{feature.value}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    size="sm" 
                    className={plan.popular 
                      ? "bg-coral hover:bg-coral-600 text-white w-full font-semibold transition-all duration-200 hover:scale-105" 
                      : "border-gray-400 text-gray-700 font-semibold w-full hover:bg-gray-50"
                    }
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Notes */}
        <div className="text-center mt-12">
          <div className="bg-gray-50 rounded-lg p-6 max-w-3xl mx-auto border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-2">What's the setup fee?</h4>
            <p className="text-gray-600 text-sm">
              You can start free with 4 projects. After that, it's €8/project or included in your plan. 
              We process all your old specs, normalize manufacturers, and structure your data for search.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
