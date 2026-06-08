import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export function useFaqs() {
  return useQuery({
    queryKey: ["faqs", "active"],
    queryFn: async (): Promise<Faq[]> => {
      const { data, error } = await (supabase as any)
        .from("faqs")
        .select("id, question, answer, display_order")
        .eq("is_active", true)
        .order("display_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Faq[];
    },
    staleTime: 5 * 60_000,
  });
}
