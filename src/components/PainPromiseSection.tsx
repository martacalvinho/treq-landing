
import { AlertTriangle, CheckCircle } from "lucide-react";

const PainPromiseSection = () => {
  const painPoints = [
    '"Where did we use that acoustic panel?"',
    'New hires spend weeks digging through old specs.',
    'Duplicate orders waste money and time.'
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-coral" />
              Sound Familiar?
            </h3>
            <ul className="space-y-4">
              {painPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-coral rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-lg text-gray-700">{point}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-coral-50 to-coral-100 rounded-xl p-8 border border-coral-200">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="h-6 w-6 text-coral" />
              <h3 className="text-2xl font-bold text-gray-900">Our Promise</h3>
            </div>
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              We parse your PDF schedules → build a live, searchable library in 24 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainPromiseSection;
