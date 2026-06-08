import { useMemo } from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { WishlistButton } from "@/components/WishlistButton";

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated, productIds, isLoading: wishlistLoading } = useWishlist();
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();

  const wishlistProducts = useMemo(() => {
    const set = new Set(productIds);
    return allProducts.filter((p) => set.has(p.id));
  }, [allProducts, productIds]);

  const isLoading = wishlistLoading || productsLoading;

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3 mb-10"
        >
          <Heart className="w-7 h-7" strokeWidth={1.6} />
          <h1 className="font-serif-display text-3xl md:text-4xl font-light">
            Хадгалсан бүтээгдэхүүн
          </h1>
        </motion.div>

        {!isAuthenticated ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-6">
              Хадгалсан бүтээгдэхүүнээ үзэхийн тулд нэвтэрнэ үү.
            </p>
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-3 rounded-full bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Нэвтрэх
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <Heart
              className="w-16 h-16 mx-auto mb-6 text-muted-foreground/30"
              strokeWidth={1.2}
            />
            <h2 className="text-xl font-medium mb-2">
              Хадгалсан бүтээгдэхүүн байхгүй байна
            </h2>
            <p className="text-muted-foreground mb-8">
              Дуртай бүтээгдэхүүндээ ♡ дарж хадгалаарай.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-3 rounded-full bg-foreground text-background text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Дэлгүүр үзэх
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlistProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: (i % 6) * 0.06 }}
                className="rounded-[32px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col bg-card"
              >
                <div
                  className="bg-card relative p-6 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="absolute top-4 right-4 z-10">
                    <WishlistButton
                      productId={product.id}
                      productName={product.name}
                    />
                  </div>
                  <div className="aspect-square flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="bg-pastel-lilac/30 p-6 flex flex-col flex-1">
                  {product.brand && (
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      {product.brand}
                    </p>
                  )}
                  <h3
                    className="font-bold text-lg text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3 mb-4">
                    <span className="text-xl font-bold text-foreground">
                      {product.price}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      addItem({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      });
                      toast({
                        title: "Сагсанд нэмлээ!",
                        description: product.name,
                      });
                    }}
                    className="w-full py-3 rounded-full font-display text-sm uppercase tracking-wider text-background bg-foreground hover:opacity-90 transition-opacity mt-auto"
                  >
                    Сагсанд нэмэх
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
