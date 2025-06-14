
import { Upload, Search, CheckCircle, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Specs",
      description: "Drag 3–5 PDFs—no cleanup needed.",
      number: "1",
      mockup: (
        <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Drop PDF schedules here</p>
            <div className="space-y-1">
              <div className="bg-white rounded px-2 py-1 text-xs text-gray-700 border">Floor_Plans_Q3.pdf</div>
              <div className="bg-white rounded px-2 py-1 text-xs text-gray-700 border">Material_Schedule_v2.pdf</div>
              <div className="bg-white rounded px-2 py-1 text-xs text-gray-700 border">FF&E_Spec.pdf</div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Search,
      title: "We Extract & Tag",
      description: "AI pulls Tag · Category · Manufacturer · Notes.",
      number: "2",
      mockup: (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Processing...</span>
              <span>78%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-coral h-2 rounded-full transition-all duration-1000" style={{ width: '78%' }}></div>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex gap-2">
                <span className="bg-coral-100 text-coral-800 px-2 py-1 rounded">Flooring</span>
                <span className="text-gray-600">Daltile Ceramic</span>
              </div>
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Lighting</span>
                <span className="text-gray-600">Philips LED Panel</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: CheckCircle,
      title: "You Explore",
      description: "Filter by project, typology, or brand. Spot duplicates & discontinued SKUs.",
      number: "3",
      mockup: (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="mb-2">
            <input type="text" placeholder="Search materials..." className="w-full text-xs p-2 border border-gray-300 rounded" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <span>Acoustic panels</span>
              <span className="text-coral font-semibold">12 matches</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors cursor-pointer">
              <span>Ceramic tiles</span>
              <span className="text-coral font-semibold">8 matches</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get from specs to searchable library in three simple steps
          </p>
        </div>
        
        {/* Progress Timeline */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-coral rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.number}
                  </div>
                  <span className="text-sm font-medium text-gray-600 mt-2">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative bg-white rounded-xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-coral-50 rounded-lg flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-coral" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>
              <div className="transition-transform duration-200 hover:scale-105">
                {step.mockup}
              </div>
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
