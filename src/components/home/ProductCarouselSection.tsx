import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Product } from "@/types/product";
import { WishlistButton } from "@/components/WishlistButton";

const AUTOPLAY_MS = 4500;

interface ProductCarouselSectionProps {
  title: string;
  products: Product[];
  isLoading?: boolean;
  decoration?: ReactNode;
  emptyMessage?: string;
}

const ProductCarouselSection = ({
  title,
  products,
  isLoading = false,
  decoration,
  emptyMessage,
}: ProductCarouselSectionProps) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const useCarousel = products.length > 3;

  const handleAdd = (p: Product) => {
    addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
    toast({ title: "Сагсанд нэмлээ!", description: p.name });
  };
  const handleOpen = (p: Product) => navigate(`/product/${p.id}`);

  return (
    <section className="py-20 md:py-28 px-4 relative overflow-hidden">
      {decoration}
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-6 mb-14"
        >
          <h2 className="font-serif-display text-2xl md:text-4xl font-bold uppercase tracking-wide text-foreground whitespace-nowrap">
            {title}
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
        ) : products.length === 0 ? (
          emptyMessage ? (
            <p className="text-center text-muted-foreground py-12">
              {emptyMessage}
            </p>
          ) : null
        ) : useCarousel ? (
          <ProductCarousel
            products={products}
            onAdd={handleAdd}
            onOpen={handleOpen}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <ProductCard
                  product={product}
                  onAdd={() => handleAdd(product)}
                  onOpen={() => handleOpen(product)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

interface ProductCarouselProps {
  products: Product[];
  onAdd: (p: Product) => void;
  onOpen: (p: Product) => void;
}

const ProductCarousel = ({ products, onAdd, onOpen }: ProductCarouselProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!api) return;
    setSnapCount(api.scrollSnapList().length);
    setSelectedIndex(api.selectedScrollSnap());
    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    api.on("select", onSelect);
    api.on("reInit", () => setSnapCount(api.scrollSnapList().length));
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || isPaused) return;
    intervalRef.current = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, AUTOPLAY_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [api, isPaused]);

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="relative"
      >
        <CarouselContent className="-ml-6">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <ProductCard
                product={product}
                onAdd={() => onAdd(product)}
                onOpen={() => onOpen(product)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:flex -left-12 h-10 w-10 border-foreground/20 hover:bg-foreground hover:text-background" />
        <CarouselNext className="hidden md:flex -right-12 h-10 w-10 border-foreground/20 hover:bg-foreground hover:text-background" />
      </Carousel>

      {snapCount > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: snapCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: selectedIndex === i ? 28 : 8,
                background:
                  selectedIndex === i ? "#5a7a4d" : "rgba(0,0,0,0.18)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
  onOpen: () => void;
}

const ProductCard = ({ product, onAdd, onOpen }: ProductCardProps) => (
  <div className="group h-full flex flex-col">
    <div
      className="aspect-square bg-secondary flex items-center justify-center cursor-pointer overflow-hidden mb-5 relative"
      onClick={onOpen}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-3 right-3 z-10">
        <WishlistButton productId={product.id} productName={product.name} />
      </div>
    </div>

    <h3
      className="font-medium text-foreground cursor-pointer hover:text-primary transition-colors"
      onClick={onOpen}
    >
      {product.name}
    </h3>
    {product.brand && (
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        {product.brand}
      </p>
    )}
    <p className="text-sm text-foreground mt-2">{product.price}</p>

    <button
      onClick={onAdd}
      className="mt-3 px-5 py-2 border border-foreground text-foreground text-xs font-bold tracking-[0.12em] uppercase hover:bg-foreground hover:text-background transition-colors duration-200 self-start"
    >
      Худалдан авах
    </button>
  </div>
);

export default ProductCarouselSection;
