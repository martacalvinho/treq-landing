
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const DemoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Library filtered by 'Healthcare projects'",
      description: "Browse materials by project type with intelligent filtering",
      mockup: (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex gap-2 mb-4">
            <span className="bg-coral text-white px-3 py-1 rounded-full text-sm font-medium">Healthcare</span>
            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">2019-2024</span>
          </div>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold text-sm">Antimicrobial Vinyl</h4>
                  <p className="text-xs text-gray-600">Tarkett SafeTred</p>
                </div>
                <span className="text-xs text-gray-500">St. Mary's Hospital</span>
              </div>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-semibold text-sm">LED Panel 2x2</h4>
                  <p className="text-xs text-gray-600">Cree CR24</p>
                </div>
                <span className="text-xs text-gray-500">Wellness Center</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Manufacturer summary table (Top 10 brands used)",
      description: "See which brands your studio trusts most",
      mockup: (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold mb-4 text-sm">Top Manufacturers</h4>
          <div className="space-y-2">
            {['Daltile', 'Armstrong', 'Sherwin Williams', 'Herman Miller', 'Steelcase'].map((brand, index) => (
              <div key={brand} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <span className="text-coral font-bold text-sm">#{index + 1}</span>
                  <span className="text-sm font-medium">{brand}</span>
                </div>
                <span className="text-xs text-gray-500">{45 - index * 7} products</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Duplicate alert modal with flagged materials",
      description: "Instantly spot potential cost savings",
      mockup: (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-yellow-800 font-semibold text-sm">3 Potential Duplicates Found</span>
            </div>
            <div className="space-y-2">
              <div className="text-xs">
                <div className="font-medium">Ceramic Tile 12x24"</div>
                <div className="text-gray-600">Found in: Office Lobby, Conference Room</div>
              </div>
              <div className="text-xs">
                <div className="font-medium">LED Downlight 6"</div>
                <div className="text-gray-600">Found in: Reception, Hallway</div>
              </div>
            </div>
            <Button size="sm" className="mt-3 bg-coral hover:bg-coral-600 text-white text-xs">
              Review Duplicates
            </Button>
          </div>
        </div>
      )
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
            <div className="h-80 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
              <div className="w-full max-w-md">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {slides[currentSlide].title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {slides[currentSlide].description}
                  </p>
                </div>
                {slides[currentSlide].mockup}
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
