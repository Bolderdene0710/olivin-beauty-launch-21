import { useState } from "react";
import ProductCard from "./ProductCard";
import { ProductCategory } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const BestSellers = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All">("All");
  const { data: products = [], isLoading, error } = useProducts();

  const categories: (ProductCategory | "All")[] = ["All", "Serums", "Toners", "Creams", "Cleansers"];

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <section id="best-sellers" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Best Sellers
          </h2>
          <p className="text-xl text-muted-foreground">
            Our most loved K-Beauty essentials
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as ProductCategory | "All")}>
            <SelectTrigger className="w-[200px] bg-background">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[280px]">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-20 mt-4" />
                <Skeleton className="h-6 w-full mt-2" />
                <Skeleton className="h-6 w-24 mt-2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 text-muted-foreground">
            Failed to load products. Please try again later.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No products found in this category.
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id}
                image={product.image}
                name={product.name}
                brand={product.brand}
                price={product.price}
              />
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
