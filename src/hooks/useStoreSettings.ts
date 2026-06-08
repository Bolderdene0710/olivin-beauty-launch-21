import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface StoreSettings {
  id: string;
  store_name: string;
  currency: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useStoreSettings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("store-settings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "store_settings" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["store-settings"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["store-settings"],
    queryFn: async (): Promise<StoreSettings | null> => {
      const { data, error } = await (supabase as any)
        .from("store_settings")
        .select("id, store_name, currency, logo_url, created_at, updated_at")
        .maybeSingle();
      if (error) throw error;
      return (data as StoreSettings) ?? null;
    },
    staleTime: 60_000,
  });
}
