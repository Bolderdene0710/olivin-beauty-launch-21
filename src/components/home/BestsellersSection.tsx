import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { PalmBranchLeft } from "@/components/botanicals/BotanicalSVG";

const BestsellersSection = () => {
  const { data: products = [], isLoading } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const displayProducts = products.slice(0, 3);

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      {/* Botanical decoration */}
      <div className="absolute -left-10 top-20 hidden md:block animate-sway-10">
        <PalmBranchLeft />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section header with divider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6 mb-14"
        >
          <h2 className="font-serif-display text-3xl md:text-4xl font-light text-foreground whitespace-nowrap">
            Best Sellers
          </h2>
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group"
              >
                {/* Product Image */}
                <div
                  className="aspect-square bg-secondary flex items-center justify-center cursor-pointer overflow-hidden mb-5"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Product Info */}
                <h3
                  className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {product.brand}
                </p>
                <p className="text-sm text-foreground mt-2">{product.price}</p>

                <button
                  onClick={() => {
                    addItem({ id: product.id, name: product.name, price: product.price, image: product.image });
                    toast({ title: "Сагсанд нэмлээ!", description: product.name });
                  }}
                  className="mt-3 px-5 py-2 border border-foreground text-foreground text-xs tracking-[0.12em] uppercase hover:bg-foreground hover:text-background transition-colors duration-200"
                >
                  Shop
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestsellersSection;
