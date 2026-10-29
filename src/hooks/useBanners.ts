import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { BannerRow } from "@/types/product";

export function useBanners() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("banners-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "banners" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["banners"] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ["banners"],
    queryFn: async (): Promise<BannerRow[]> => {
      const { data, error } = await (supabase as any)
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      // Respect the optional schedule set in the admin panel
      const now = Date.now();
      return ((data as BannerRow[]) || []).filter(
        (b) =>
          (!b.starts_at || new Date(b.starts_at).getTime() <= now) &&
          (!b.ends_at || new Date(b.ends_at).getTime() > now)
      );
    },
  });
}
