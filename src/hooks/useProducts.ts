import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProductRow, Product, ProductCategory, mapProductRowToProduct } from "@/types/product";

export function useProducts() {
  const queryClient = useQueryClient();

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("products-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await (supabase as any)
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      if (!data || data.length === 0) return [];
      return (data as unknown as ProductRow[]).map(mapProductRowToProduct);
    },
  });
}

export function useProductById(id: string) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      const { data, error } = await (supabase as any)
        .from("products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;
      return mapProductRowToProduct(data as unknown as ProductRow);
    },
    enabled: !!id,
  });
}

export function useProductsByCategory(category: ProductCategory | "All") {
  return useQuery({
    queryKey: ["products", "category", category],
    queryFn: async (): Promise<Product[]> => {
      const { data, error } = await (supabase as any)
        .from("products")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      if (!data || data.length === 0) return [];

      const allProducts = (data as unknown as ProductRow[]).map(mapProductRowToProduct);
      if (category === "All") return allProducts;
      return allProducts.filter(p => p.category === category);
    },
  });
}
