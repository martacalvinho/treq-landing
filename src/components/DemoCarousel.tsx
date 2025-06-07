
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DemoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Library view filtered by 'Healthcare projects'",
      icon: "📊",
      description: "Browse materials by project type with intelligent filtering"
    },
    {
      title: "Search 'EGGER' → see 22 results + last used dates",
      icon: "🔍",
      description: "Instantly find all instances of any manufacturer or product"
    },
    {
      title: "Alert panel 'Lavabo S-1 discontinued—click for alternates'",
      icon: "⚠️",
      description: "Stay ahead of discontinuations with smart alerts and alternatives"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch how SpecClarity transforms your material workflow
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="text-6xl mb-4">{slides[currentSlide].icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 max-w-md">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-gray-600 max-w-sm">
                  {slides[currentSlide].description}
                </p>
              </div>
            </div>
            
            <div className="p-6 bg-white">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <div className="flex gap-2">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-coral' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoCarousel;
