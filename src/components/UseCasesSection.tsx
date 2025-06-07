
const UseCasesSection = () => {
  const useCases = [
    {
      title: "New-Hire Onboarding",
      description: "Day-one access to every material ever used—no binder hunt.",
      icon: "🎓",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Spec QA",
      description: "Instantly flag duplicates or missing manufacturer info before tender.",
      icon: "✅",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Manufacturer Shortlist",
      description: "Auto-generated 'Top 20 brands our studio trusts' list.",
      icon: "🏷️",
      bgColor: "bg-coral-50",
      borderColor: "border-coral-200"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Key Use Cases
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how studios are transforming their workflow with SpecClarity
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div key={index} className={`${useCase.bgColor} ${useCase.borderColor} border-2 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105`}>
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{useCase.title}</h3>
              <p className="text-gray-700 leading-relaxed">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
