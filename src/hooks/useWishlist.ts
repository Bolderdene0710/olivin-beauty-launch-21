import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface WishlistRow {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) =>
      setUser(session?.user ?? null)
    );
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) =>
      setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);
  return user;
}

export function useWishlist() {
  const queryClient = useQueryClient();
  const user = useCurrentUser();
  const userId = user?.id ?? null;

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`wishlists-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "wishlists",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  const query = useQuery({
    queryKey: ["wishlist", userId],
    queryFn: async (): Promise<string[]> => {
      if (!userId) return [];
      const { data, error } = await (supabase as any)
        .from("wishlists")
        .select("product_id")
        .eq("user_id", userId);
      if (error) throw error;
      return (data as Pick<WishlistRow, "product_id">[]).map((r) => r.product_id);
    },
    enabled: !!userId,
    staleTime: 30_000,
  });

  const productIds = query.data ?? [];
  const productIdSet = new Set(productIds);
  const isInWishlist = (productId: string) => productIdSet.has(productId);

  const addMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) throw new Error("Not signed in");
      const { error } = await (supabase as any)
        .from("wishlists")
        .insert({ user_id: userId, product_id: productId });
      if (error && error.code !== "23505") throw error;
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist", userId] });
      const previous = queryClient.getQueryData<string[]>(["wishlist", userId]) ?? [];
      if (!previous.includes(productId)) {
        queryClient.setQueryData<string[]>(
          ["wishlist", userId],
          [...previous, productId]
        );
      }
      return { previous };
    },
    onError: (_err, _productId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["wishlist", userId], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!userId) throw new Error("Not signed in");
      const { error } = await (supabase as any)
        .from("wishlists")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);
      if (error) throw error;
    },
    onMutate: async (productId: string) => {
      await queryClient.cancelQueries({ queryKey: ["wishlist", userId] });
      const previous = queryClient.getQueryData<string[]>(["wishlist", userId]) ?? [];
      queryClient.setQueryData<string[]>(
        ["wishlist", userId],
        previous.filter((id) => id !== productId)
      );
      return { previous };
    },
    onError: (_err, _productId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["wishlist", userId], ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", userId] });
    },
  });

  const toggle = async (productId: string) => {
    if (productIdSet.has(productId)) {
      await removeMutation.mutateAsync(productId);
      return "removed" as const;
    }
    await addMutation.mutateAsync(productId);
    return "added" as const;
  };

  return {
    isAuthenticated: !!userId,
    productIds,
    isInWishlist,
    toggle,
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isLoading: query.isLoading,
    isPending: addMutation.isPending || removeMutation.isPending,
  };
}
