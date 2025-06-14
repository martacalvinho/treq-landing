
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Search } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 py-20 md:py-32 pt-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-[0.9] mb-4">
                Your Studio's
              </h1>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[0.9] mb-6">
                <span className="text-coral bg-gradient-to-r from-coral to-coral-600 bg-clip-text text-transparent">
                  Material Memory
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 leading-relaxed font-medium">
              Never lose track of specifications again.
            </p>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Instantly search every product you've ever specified—by project, typology, or manufacturer. Build your complete material library in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg group"
              >
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-200 text-gray-700 px-8 py-4 text-lg font-medium hover:bg-gray-50 hover:border-gray-300 hover:shadow-md transition-all duration-200 group"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                Watch 60-sec demo
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-105">
              {/* Dashboard Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-5 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <Search className="h-4 w-4 text-coral" />
                  </div>
                  <span className="font-semibold text-gray-800">Material Search</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-white px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:bg-coral-50 hover:border-coral-200 transition-all duration-200 cursor-pointer">
                    Project: Office Tower
                  </span>
                  <span className="bg-white px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:bg-coral-50 hover:border-coral-200 transition-all duration-200 cursor-pointer">
                    Typology: Commercial
                  </span>
                  <span className="bg-white px-3 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:shadow-md hover:bg-coral-50 hover:border-coral-200 transition-all duration-200 cursor-pointer">
                    Manufacturer: Rockfon
                  </span>
                </div>
                <div className="bg-gradient-to-r from-coral-100 to-coral-50 border border-coral-300 rounded-xl p-4 hover:from-coral-200 hover:to-coral-100 transition-all duration-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-coral rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-coral-800 font-bold text-base">12 duplicates found</span>
                    </div>
                    <span className="text-coral-600 text-sm font-medium">Auto-detected</span>
                  </div>
                </div>
              </div>
              
              {/* Material Cards */}
              <div className="p-6 space-y-4 bg-gradient-to-b from-white to-gray-50">
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-coral transition-colors duration-200">
                        Acoustic Panel System
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">Rockfon Blanka Activity™</p>
                      <p className="text-xs text-gray-500">Last used: Q2 2024</p>
                    </div>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full font-semibold border border-yellow-200 shadow-sm">
                      Duplicate
                    </span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer group">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-coral transition-colors duration-200">
                        Ceramic Tile Collection
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">Mutina Puzzle Indoor</p>
                      <p className="text-xs text-gray-500">In stock • Lead time: 4-6 weeks</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-semibold border border-green-200 shadow-sm">
                      Available
                    </span>
                  </div>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer group opacity-75">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-base mb-1 group-hover:text-coral transition-colors duration-200">
                        LED Strip Lighting
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">Artemide Profile Series</p>
                      <p className="text-xs text-gray-500">Alternative: Similar products available</p>
                    </div>
                    <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-semibold border border-red-200 shadow-sm">
                      Discontinued
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements for visual interest */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-coral rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
