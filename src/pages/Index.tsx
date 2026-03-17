import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import BestsellersSection from "@/components/home/BestsellersSection";
import ValuesSection from "@/components/home/ValuesSection";
import EmailSignupSection from "@/components/home/EmailSignupSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <BestsellersSection />
      <ValuesSection />
      <EmailSignupSection />
      <Footer />
    </div>
  );
};

export default Index;
