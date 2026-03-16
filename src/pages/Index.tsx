import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import StorySection from "@/components/home/StorySection";
import CategoriesSection from "@/components/home/CategoriesSection";
import BestsellersSection from "@/components/home/BestsellersSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <HeroSection />
      <StorySection />
      <CategoriesSection />
      <BestsellersSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
