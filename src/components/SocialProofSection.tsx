
const SocialProofSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-6 leading-relaxed">
            "We recovered €12k in duplicate orders after the first upload."
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center">
              <span className="text-coral font-bold text-lg">A</span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Ana S.</p>
              <p className="text-gray-600">Interior Architect</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
