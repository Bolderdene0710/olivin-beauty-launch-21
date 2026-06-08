import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSection from "@/components/home/HeroSection";
import BestsellersSection from "@/components/home/BestsellersSection";
import NewArrivalsSection from "@/components/home/NewArrivalsSection";
import TrendingSection from "@/components/home/TrendingSection";
import LifestyleBanner from "@/components/home/LifestyleBanner";
import ValuesSection from "@/components/home/ValuesSection";
import EmailSignupSection from "@/components/home/EmailSignupSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <HeroSection />
      <BestsellersSection />
      <NewArrivalsSection />
      <TrendingSection />
      <LifestyleBanner />
      <ValuesSection />
      <EmailSignupSection />
      <Footer />
    </div>
  );
};

export default Index;
