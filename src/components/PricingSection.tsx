
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const PricingSection = () => {
  const onboardingPlans = [
    {
      name: "Mini Setup",
      price: "€199",
      description: "Up to 25 projects",
      features: [
        "Material tagging",
        "Project-by-project dashboard setup",
        "Manufacturer normalization",
        "Dedicated onboarding call"
      ]
    },
    {
      name: "Pro Setup",
      price: "€499",
      description: "Up to 75 projects",
      features: [
        "Material tagging",
        "Project-by-project dashboard setup",
        "Manufacturer normalization",
        "Dedicated onboarding call",
        "Priority processing"
      ]
    },
    {
      name: "Full Studio Setup",
      price: "€799",
      description: "Up to 150 projects",
      features: [
        "Material tagging",
        "Project-by-project dashboard setup",
        "Manufacturer normalization",
        "Dedicated onboarding call",
        "Priority processing",
        "Team collaboration setup"
      ]
    },
    {
      name: "Custom",
      price: "Contact Us",
      description: "For more than 150",
      features: [
        "Everything in Full Studio",
        "Custom integrations",
        "Dedicated support",
        "Enterprise security"
      ]
    }
  ];

  const subscriptionPlans = [
    {
      name: "Starter",
      price: "€29",
      period: "/mo",
      description: "2 new projects/month, search access",
      features: [
        "2 new projects monthly",
        "Unlimited material searches",
        "Basic dashboard access",
        "Email support"
      ],
      popular: true
    },
    {
      name: "Studio",
      price: "€49",
      period: "/mo",
      description: "10 projects/month, duplicate alerts, manufacturer tracking",
      features: [
        "10 new projects monthly",
        "Duplicate detection alerts",
        "Manufacturer tracking",
        "Team collaboration tools",
        "Priority support"
      ]
    },
    {
      name: "Growth",
      price: "€99",
      period: "/mo",
      description: "20 projects/month, team tools, export",
      features: [
        "20 new projects monthly",
        "Advanced team tools",
        "Data export capabilities",
        "Custom reports",
        "API access"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Unlimited, SSO, integrations, support",
      features: [
        "Unlimited projects",
        "SSO integration",
        "Custom integrations",
        "Dedicated support",
        "Enterprise security"
      ]
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Started in 3 Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Try for free, then choose your setup and ongoing plan
          </p>
        </div>

        {/* Step 1: Free Trial */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-coral-50 to-coral-100 rounded-2xl p-8 border-2 border-coral-200 shadow-lg text-center max-w-3xl mx-auto">
            <div className="bg-coral text-white inline-block px-4 py-2 rounded-full text-sm font-bold mb-6">
              STEP 1 – TRY IT FREE
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Try It Free</h3>
            <p className="text-lg text-gray-700 mb-6">
              Upload up to 4 past materials sheets—get a live searchable dashboard within 48 hours.
            </p>
            <Button size="lg" className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg mb-4">
              Upload First Specs Free
            </Button>
            <p className="text-sm text-coral font-semibold">No credit card required</p>
          </div>
        </div>

        {/* Step 2: Onboarding Tiers */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="bg-gray-600 text-white inline-block px-4 py-2 rounded-full text-sm font-bold mb-4">
              STEP 2 – ONE-TIME SETUP
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Your Onboarding Plan</h3>
            <p className="text-gray-600">Complete setup of your historical project data</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {onboardingPlans.map((plan, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h4>
                <div className="text-2xl font-bold text-gray-900 mb-2">{plan.price}</div>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button size="sm" variant="outline" className="border-gray-400 text-gray-700 font-semibold w-full hover:bg-gray-50">
                  {plan.name === "Custom" ? "Contact Us" : "Schedule Setup"}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 bg-gray-50 inline-block px-6 py-3 rounded-full border border-gray-200">
              💡 <strong>What counts as a project?</strong> Any building, renovation, or space with its own material schedule
            </p>
          </div>
        </div>

        {/* Step 3: Monthly Subscription */}
        <div>
          <div className="text-center mb-12">
            <div className="bg-coral text-white inline-block px-4 py-2 rounded-full text-sm font-bold mb-4">
              STEP 3 – MONTHLY ACCESS
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ongoing Plans</h3>
            <p className="text-gray-600">Keep your library updated with new projects</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <div key={index} className={`rounded-2xl p-6 border-2 shadow-lg hover:shadow-xl transition-shadow duration-200 relative ${
                plan.popular 
                  ? "bg-gradient-to-br from-coral-50 to-coral-100 border-coral-200" 
                  : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-coral text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <h4 className="text-lg font-bold text-gray-900 mb-2 mt-2">{plan.name}</h4>
                <div className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.price}
                  {plan.period && <span className="text-lg font-medium text-gray-600">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 flex-shrink-0 mt-0.5 ${plan.popular ? "text-coral" : "text-gray-600"}`} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  size="sm" 
                  className={plan.popular 
                    ? "bg-coral hover:bg-coral-600 text-white w-full font-semibold transition-all duration-200 hover:scale-105" 
                    : "border-gray-400 text-gray-700 font-semibold w-full hover:bg-gray-50"
                  }
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Start Monthly Plan"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
