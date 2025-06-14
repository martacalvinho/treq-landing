
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import MaterialDashboard from "./MaterialDashboard";
import MobileMaterialView from "./MobileMaterialView";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50 to-blue-50 py-20 md:py-32 pt-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-in">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[0.95] mb-6">
                Your Studio's
                <br />
                <span className="text-coral bg-gradient-to-r from-coral to-coral-600 bg-clip-text text-transparent">
                  Material Memory
                </span>
              </h1>
            </div>
            <div className="space-y-6 mb-10">
              <p className="text-xl md:text-2xl text-gray-700 font-semibold leading-tight">
                Never lose track of materials again.
              </p>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Instantly search everything you've ever specified - by project, client, type or manufacturer. Build your own complete intelligent material library.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/auth')}
                size="lg" 
                className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg group"
              >
                Get Started
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
          
          {/* Enhanced Desktop Dashboard */}
          <div className="relative hidden lg:block">
            <MaterialDashboard />
            
            {/* Enhanced floating elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-coral/10 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-coral/20 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute -bottom-6 -left-6 w-10 h-10 bg-blue-400/10 rounded-full flex items-center justify-center" style={{ animationDelay: '1s' }}>
              <div className="w-4 h-4 bg-blue-400/20 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-indigo-400/10 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>

          {/* Mobile Alternative */}
          <MobileMaterialView />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
