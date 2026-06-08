import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CategoryRow } from "@/types/product";

export function useCategories() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("categories-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["categories"] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryRow[]> => {
      const { data, error } = await (supabase as any)
        .from("categories")
        .select("id, name, description, image_url, sort_order, is_active, created_at")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return (data as CategoryRow[]) || [];
    },
  });
}
