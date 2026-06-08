import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { PalmBranchLeft } from "@/components/botanicals/BotanicalSVG";
import ProductCarouselSection from "./ProductCarouselSection";

const BestsellersSection = () => {
  const { data: products = [], isLoading } = useProducts();

  const displayProducts = useMemo(() => products.slice(0, 12), [products]);

  return (
    <ProductCarouselSection
      title="Best Sellers"
      products={displayProducts}
      isLoading={isLoading}
      decoration={
        <div className="absolute -left-10 top-20 hidden md:block animate-sway-10">
          <PalmBranchLeft />
        </div>
      }
    />
  );
};

export default BestsellersSection;
