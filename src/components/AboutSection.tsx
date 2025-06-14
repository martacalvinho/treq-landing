
import { Users, Lightbulb, Target, TrendingUp } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet the Founders
            </h2>
            <p className="text-lg text-gray-600">
              Architecture veterans who've lived your challenges
            </p>
          </div>

          {/* Founder Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-coral" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Marta</h3>
                  <p className="text-gray-600">Co-Founder & Architect</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                A decade of architectural practice spanning global hubs like London, New York, Chicago, and Tokyo. 
                We intimately understand the challenges you face. We've lived the reality of navigating complex projects 
                and the often-overlooked goldmine hidden within material specifications.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-coral-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-coral" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Jed</h3>
                  <p className="text-gray-600">Co-Founder & Technology</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                TBD - Technology background and expertise in building solutions for architecture and design professionals.
              </p>
            </div>
          </div>

          {/* The Aha Moment */}
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Lightbulb className="h-6 w-6 text-coral" />
              <h3 className="text-2xl font-bold text-gray-900">The "Aha!" Moment</h3>
            </div>
            <blockquote className="text-lg text-gray-700 italic mb-4">
              "We knew there had to be a way to transform that chaos into clarity, that history into a powerful, proactive design tool."
            </blockquote>
            <p className="text-gray-700 leading-relaxed">
              Ever felt that critical material knowledge from past projects was just...gone? Lost in old PDFs or forgotten spreadsheets? 
              We've been there. That frustration – seeing valuable data lie dormant while inefficiencies crept in – was the spark for Treqy.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="h-6 w-6 text-coral" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Intuitive Analysis</h4>
                <p className="text-gray-600 text-sm">Automatically analyze specs and reveal actionable insights</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-coral" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Smart Decisions</h4>
                <p className="text-gray-600 text-sm">Make data-driven choices with speed and confidence</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-coral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-coral" />
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Better Outcomes</h4>
                <p className="text-gray-600 text-sm">Boost creativity and slash inefficiencies</p>
              </div>
            </div>
          </div>

          {/* Looking Forward */}
          <div className="bg-gradient-to-br from-coral-50 to-coral-100 rounded-xl p-8 border border-coral-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Looking Forward</h3>
            <blockquote className="text-lg text-gray-700 italic mb-4">
              "We're obsessed with understanding the dynamic needs of modern practice."
            </blockquote>
            <p className="text-gray-700 leading-relaxed mb-6">
              Grounded in real-world architectural experience, Treqy isn't just a tool; it's an evolving partner. 
              We're passionately committed to helping you transform your accumulated material knowledge from a simple record 
              into a powerful strategic asset for every future project.
            </p>
            <div className="text-center">
              <h4 className="text-xl font-bold text-gray-900 mb-2">Ready to Transform Your Material Knowledge?</h4>
              <p className="text-gray-700">Use Treqy to make smarter material decisions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
