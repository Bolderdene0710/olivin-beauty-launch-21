import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCarouselSection from "./ProductCarouselSection";

const NewArrivalsSection = () => {
  const { data: products = [], isLoading } = useProducts();

  const displayProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 12);
  }, [products]);

  return (
    <ProductCarouselSection
      title="Шинээр нэмэгдсэн бүтээгдэхүүн"
      products={displayProducts}
      isLoading={isLoading}
    />
  );
};

export default NewArrivalsSection;
