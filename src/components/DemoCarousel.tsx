
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const DemoCarousel = () => {
  const demoSteps = [
    {
      title: "Upload Your Specs",
      description: "Simply drag and drop your specification PDFs into Treqy",
      image: "/placeholder.svg"
    },
    {
      title: "AI Extraction",
      description: "Our AI automatically identifies and extracts all material information",
      image: "/placeholder.svg"
    },
    {
      title: "Search & Find",
      description: "Instantly search your entire material library by name, project, or manufacturer",
      image: "/placeholder.svg"
    },
    {
      title: "Track Usage",
      description: "See which materials you use most and discover patterns in your specifications",
      image: "/placeholder.svg"
    }
  ];

  return (
    <section id="demo" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See It In Action
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Watch how Treqy transforms your material workflow
          </p>
          
          <Button 
            size="lg" 
            className="bg-coral hover:bg-coral-600 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-lg group"
            onClick={() => window.open('http://calendly.com/treqy', '_blank')}
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
            Book a Demo
          </Button>
        </div>

        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {demoSteps.map((step, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="border-2 border-gray-100 hover:border-coral/20 transition-colors">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center w-8 h-8 bg-coral text-white rounded-full text-sm font-bold mx-auto mb-3">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
};

export default DemoCarousel;
