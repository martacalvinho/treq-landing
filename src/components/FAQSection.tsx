
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What counts as a \"material\"?",
      answer: "Any distinct product you specify for a project—flooring type, paint color, hardware item, surface finish, etc. counts as one material. If it has its own spec, it counts."
    },
    {
      question: "Do you charge per project?",
      answer: "No. We only charge based on the number of materials you process each month, regardless of how many projects they're used in."
    },
    {
      question: "What's included in the onboarding fee?",
      answer: "We manually set up your studio's material history—linking each material to the right project, manufacturer, and client—so your dashboard is ready to go from day one."
    },
    {
      question: "What happens if I exceed my monthly material limit?",
      answer: "We'll notify you and give you the option to upgrade your plan. We won't block access, but continued overages may result in a plan adjustment."
    },
    {
      question: "Can I upload materials myself?",
      answer: "Yes, once onboarding is complete, you'll be able to add materials and projects manually or just send the information to us and we will take care of it."
    },
    {
      question: "Is my studio's data private?",
      answer: "Yes. Each studio has its own isolated dashboard. Your materials, projects, and manufacturer contacts are only visible to your team."
    },
    {
      question: "Can I switch plans later?",
      answer: "Absolutely. You can upgrade or downgrade based on your monthly material volume."
    },
    {
      question: "What if I need to import more than 1,500 materials during onboarding?",
      answer: "No problem. We charge $1.50 per additional material beyond your plan limit, or you can request a custom enterprise quote."
    },
    {
      question: "How do I know what's the best plan for me?",
      answer: "We offer a free consultation to help you understand how many materials you'd need to track and what plan fits best."
    },
    {
      question: "Do you offer physical material library setup?",
      answer: "Coming soon! We're working on a DIY physical kit and an in-person organization service for select regions."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about SpecClarity
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gray-50 rounded-lg border border-gray-200 px-6"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-coral py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-4 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
