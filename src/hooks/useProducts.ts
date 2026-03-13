import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductRow, Product, ProductCategory, mapProductRowToProduct } from "@/types/product";

// Using type assertion to work with external Supabase schema
// that isn't reflected in the auto-generated types

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await (supabase as any)
        .from("products")
        .select("*");

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      return (data as unknown as ProductRow[]).map(mapProductRowToProduct);
    },
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await supabase
        .from("products" as "orders")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching product:", error);
        throw error;
      }

      if (!data) {
        return null;
      }

      return mapProductRowToProduct(data as unknown as ProductRow);
    },
    enabled: !!id,
  });
}

export function useProductsByCategory(category: ProductCategory | "All") {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: async (): Promise<Product[]> => {
      // Fetch all and filter client-side to avoid TypeScript complexity
      const { data, error } = await supabase
        .from("products" as "orders")
        .select("*");

      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        return [];
      }

      const allProducts = (data as unknown as ProductRow[]).map(mapProductRowToProduct);
      
      if (category === "All") {
        return allProducts;
      }
      
      return allProducts.filter(p => p.category === category);
    },
  });
}
