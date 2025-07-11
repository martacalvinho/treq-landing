
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import PainPromiseSection from "@/components/PainPromiseSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import UseCasesSection from "@/components/UseCasesSection";
import PricingSection from "@/components/PricingSection";
import InfoCard from "@/components/InfoCard";
import FAQSection from "@/components/FAQSection";
import DemoCarousel from "@/components/DemoCarousel";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen font-inter">
      <Navigation />
      <HeroSection />
      <PainPromiseSection />
      <HowItWorksSection />
      <UseCasesSection />
      <PricingSection />
      <InfoCard />
      <FAQSection />
      <DemoCarousel />
      <Footer />
    </div>
  );
};

export default Index;
