
import { Upload, Search, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Specs",
      description: "Drag 3–5 PDFs—no cleanup needed.",
      number: "1"
    },
    {
      icon: Search,
      title: "We Extract & Tag",
      description: "AI pulls Tag · Category · Manufacturer · Notes.",
      number: "2"
    },
    {
      icon: CheckCircle,
      title: "You Explore",
      description: "Filter by project, typology, or brand. Spot duplicates & discontinued SKUs.",
      number: "3"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get from specs to searchable library in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-coral rounded-full flex items-center justify-center text-white font-bold text-sm">
                {step.number}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-coral-50 rounded-lg flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-coral" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500 bg-white inline-block px-6 py-3 rounded-full border border-gray-200">
            <strong>First project is on us</strong>—so you see the value before paying.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
