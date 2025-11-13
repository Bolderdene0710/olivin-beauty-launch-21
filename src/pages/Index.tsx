import Hero from "@/components/Hero";
import BestSellers from "@/components/BestSellers";
import WhyUs from "@/components/WhyUs";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <BestSellers />
      <WhyUs />
      <Footer />
    </div>
  );
};

export default Index;
