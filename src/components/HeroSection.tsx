
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 py-20 md:py-32 pt-24">
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
              <Button size="lg" className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-200 hover:scale-105 hover:shadow-lg">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 px-8 py-4 text-lg font-medium hover:bg-gray-50 group">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch 60-sec demo
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
              {/* Dashboard Header */}
              <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium text-gray-700 border shadow-sm hover:shadow-md transition-shadow cursor-pointer">Project</span>
                  <span className="bg-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium text-gray-700 border shadow-sm hover:shadow-md transition-shadow cursor-pointer">Typology</span>
                  <span className="bg-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium text-gray-700 border shadow-sm hover:shadow-md transition-shadow cursor-pointer">Manufacturer</span>
                </div>
                <div className="bg-coral-50 border border-coral-200 rounded-lg p-3 hover:bg-coral-100 transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-coral rounded-full animate-pulse"></div>
                    <span className="text-coral-700 font-semibold text-sm">12 duplicates found</span>
                  </div>
                </div>
              </div>
              
              {/* Material Cards */}
              <div className="p-4 md:p-6 space-y-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Acoustic Panel</h4>
                      <p className="text-gray-600 text-xs md:text-sm">Rockfon Blanka</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Duplicate</span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">Ceramic Tile</h4>
                      <p className="text-gray-600 text-xs md:text-sm">Mutina Puzzle</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Available</span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm md:text-base">LED Strip</h4>
                      <p className="text-gray-600 text-xs md:text-sm">Artemide Profile</p>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">Discontinued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
