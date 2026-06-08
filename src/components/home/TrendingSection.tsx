import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCarouselSection from "./ProductCarouselSection";

const TRENDING_TAGS = [
  "trending",
  "popular",
  "bestseller",
  "хит",
  "эрэлттэй",
  "popular",
];

const TrendingSection = () => {
  const { data: products = [], isLoading } = useProducts();

  const displayProducts = useMemo(() => {
    const tagged = products.filter((p) =>
      p.badges.some((b) => TRENDING_TAGS.includes(b.toLowerCase().trim()))
    );
    const source = tagged.length > 0 ? tagged : products;
    return source.slice(0, 12);
  }, [products]);

  return (
    <ProductCarouselSection
      title="Эрэлттэй бүтээгдэхүүн"
      products={displayProducts}
      isLoading={isLoading}
    />
  );
};

export default TrendingSection;
