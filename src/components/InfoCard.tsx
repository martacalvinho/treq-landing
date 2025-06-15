
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const InfoCard = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6">
        <Card className="max-w-4xl mx-auto bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Questions? Need a custom quote?
          </h3>
          <p className="text-lg text-gray-600 mb-6">
            We're here to help you get started
          </p>
          <Button 
            className="bg-coral hover:bg-coral-600 text-white px-8 py-3 text-lg font-semibold"
            onClick={() => window.open('mailto:hello@treqy.com', '_blank')}
          >
            Contact Us
          </Button>
        </Card>
      </div>
    </section>
  );
};

export default InfoCard;
