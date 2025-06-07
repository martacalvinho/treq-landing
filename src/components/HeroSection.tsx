
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 py-20 md:py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              Your Studio's
              <span className="text-coral block">Material Memory</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Search every product you've ever specified—by project, typology, or manufacturer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 px-8 py-4 text-lg font-medium hover:bg-gray-50">
                Watch 60-sec demo
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-100">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border">Project</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border">Material</span>
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 border">Manufacturer</span>
                </div>
                <div className="bg-coral-50 border border-coral-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-coral rounded-full"></div>
                    <span className="text-coral-700 font-medium text-sm">12 duplicates found</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {['Acoustic Panel - Rockfon Blanka', 'Ceramic Tile - Mutina Puzzle', 'LED Strip - Artemide Profile'].map((item, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
