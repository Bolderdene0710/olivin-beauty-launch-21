import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { ProductCategory } from "@/types/product";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import BombonHeader from "@/components/BombonHeader";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type FilterPill = "All" | ProductCategory | "Vegan" | "Cruelty-Free";

const filterPills: FilterPill[] = ["All", "Serums", "Toners", "Creams", "Cleansers", "Vegan", "Cruelty-Free"];

const cardTags = ["VEGAN", "HYDRATING"];
const btnColors = [
  "bg-[hsl(70,90%,63%)]",
  "bg-pastel-pink",
  "bg-pastel-mint",
  "bg-pastel-peach",
  "bg-pastel-lilac",
  "bg-pastel-yellow",
];

const Shop = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") as FilterPill | null;
  const [activeFilter, setActiveFilter] = useState<FilterPill>(initialCategory || "All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeFilter !== "All" && activeFilter !== "Vegan" && activeFilter !== "Cruelty-Free") {
      filtered = filtered.filter((p) => p.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [products, activeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <BombonHeader />

      {/* Hero / Search Section */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Pastel gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-pastel-lilac/40 via-pastel-peach/20 to-background" />

        {/* Floating shapes */}
        <motion.div
          className="absolute top-16 left-[8%] w-20 h-20 rounded-full bg-pastel-pink/30 backdrop-blur-sm"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-24 right-[12%] w-14 h-14 rounded-full bg-pastel-mint/30 backdrop-blur-sm"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute bottom-8 left-[20%] w-10 h-10 rounded-full bg-pastel-yellow/30 backdrop-blur-sm"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-6xl uppercase text-center text-foreground mb-8"
          >
            БҮТЭЭГДЭХҮҮН
          </motion.h1>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex gap-3 max-w-xl mx-auto"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Хайх..."
                className="w-full pl-13 pr-5 py-4 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-base"
                style={{ paddingLeft: "3rem" }}
              />
            </div>
            <button className="px-8 py-4 rounded-full bg-[hsl(70,90%,63%)] font-display text-sm uppercase tracking-wider text-foreground hover:brightness-95 transition-all shadow-md">
              ХАЙХ
            </button>
          </motion.div>

          {/* Filter pills */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {filterPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all duration-200 ${
                  activeFilter === pill
                    ? "bg-foreground text-background shadow-md"
                    : "bg-card text-foreground border border-border shadow-sm hover:shadow-md"
                }`}
              >
                {pill}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <main className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-muted-foreground mb-8 text-center">
            {isLoading
              ? "Ачааллаж байна..."
              : `${filteredProducts.length} бүтээгдэхүүн`}
          </p>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="rounded-[32px] overflow-hidden bg-card">
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-14 w-full rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16 text-muted-foreground">
              Бүтээгдэхүүн ачааллахад алдаа гарлаа.
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              Бүтээгдэхүүн олдсонгүй.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.08 }}
                  className="rounded-[32px] overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                >
                  {/* Top half - white bg with image */}
                  <div
                    className="bg-card relative p-6 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {/* Tags */}
                    <div className="flex gap-2 mb-3">
                      {cardTags.map((tag) => (
                        <Badge
                          key={tag}
                          className="rounded-full text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-pastel-mint/60 text-foreground border-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="aspect-square flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Bottom half - pastel bg */}
                  <div className="bg-pastel-lilac/30 p-6 flex flex-col flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      {product.brand}
                    </p>
                    <h3
                      className="font-bold text-lg text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>

                    {/* Price & volume */}
                    <div className="flex items-center justify-between mt-3 mb-4">
                      <span className="text-xl font-bold text-foreground">
                        {product.price}
                      </span>
                      <span className="text-sm text-muted-foreground font-medium">
                        50ml
                      </span>
                    </div>

                    {/* CTA */}
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
                      className={`w-full py-4 rounded-full font-display text-sm uppercase tracking-wider text-foreground ${btnColors[i % btnColors.length]} hover:brightness-95 transition-all shadow-sm hover:shadow-md mt-auto`}
                    >
                      САГСАНД НЭМЭХ +
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Shop;
