import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const tags = ["Vegan", "Hydrating", "K-Beauty", "Nourishing"];

const BestsellersSection = () => {
  const { data: products = [], isLoading } = useProducts();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const displayProducts = products.slice(0, 6);
  const colors = [
    "bg-pastel-lime",
    "bg-pastel-pink",
    "bg-pastel-mint",
    "bg-pastel-peach",
    "bg-pastel-lilac",
    "bg-pastel-yellow",
  ];

  return (
    <section className="py-20 md:py-28 px-4 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-6xl uppercase text-foreground">
            ШИЛДЭГ БҮТЭЭГДЭХҮҮНҮҮД
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">THE LATEST DROPS</p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl bg-card p-6">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-5 w-32 mt-4" />
                <Skeleton className="h-8 w-24 mt-3" />
                <Skeleton className="h-12 w-full mt-4 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card rounded-3xl p-5 shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {/* Tags */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  {tags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-full text-xs font-medium"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Product Image */}
                <div
                  className="aspect-square bg-muted/50 rounded-2xl overflow-hidden cursor-pointer mb-4"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info */}
                <p className="text-sm text-muted-foreground uppercase tracking-wider">
                  {product.brand}
                </p>
                <h3
                  className="font-semibold text-foreground mt-1 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  {product.name}
                </h3>
                <p className="text-xl font-bold text-foreground mt-2">
                  {product.price}
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    / 50ml
                  </span>
                </p>

                {/* Add to cart button */}
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
                  className={`mt-4 w-full py-4 rounded-full font-display text-sm uppercase tracking-wider text-foreground ${colors[i % colors.length]} hover:brightness-95 transition-all duration-200 shadow-sm hover:shadow-md`}
                >
                  ADD TO CART +
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
