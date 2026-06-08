import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useScroll, useTransform } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  ShoppingBag,
  Minus,
  Plus,
  ArrowLeft,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import {
  fetchProductWithVariants,
  type ProductVariant,
} from "@/lib/supabase";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { WishlistButton } from "@/components/WishlistButton";
import {
  LeafSprigRight,
  SmallLeaf,
  PalmBranchLeft,
} from "@/components/botanicals/BotanicalSVG";

const PLACEHOLDER_IMAGE = "/placeholder.svg";
const SAGE = "#7d9b6e";
const SAGE_DARK = "#5a7a4d";
const SAGE_TINT = "#e8eee2";
const CREAM = "#f5f5f3";

const ChapterMark = ({ num, label }: { num: string; label: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <span
      className="text-4xl md:text-5xl font-bold leading-none"
      style={{ color: SAGE_DARK }}
    >
      {num}
    </span>
    <div className="flex-1 h-px" style={{ background: "rgba(90,122,77,0.25)" }} />
    <span
      className="text-[11px] uppercase tracking-[0.3em] font-bold"
      style={{ color: SAGE_DARK }}
    >
      {label}
    </span>
  </div>
);

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], [0, -60]);

  const { data: rawProduct, isLoading, error } = useQuery({
    queryKey: ["product-with-variants", id],
    queryFn: () => fetchProductWithVariants(id!),
    enabled: !!id,
  });

  const { data: allProducts } = useProducts();

  const variantsByType = useMemo(() => {
    if (!rawProduct?.product_variants?.length) return {};
    const groups: Record<string, ProductVariant[]> = {};
    for (const v of rawProduct.product_variants) {
      const type = v.variant_type || "Сонголт";
      if (!groups[type]) groups[type] = [];
      groups[type].push(v);
    }
    return groups;
  }, [rawProduct]);

  const basePrice = rawProduct?.price ?? 0;
  const adjustment = selectedVariant?.price_adjustment ?? 0;
  const displayPrice = basePrice + adjustment;
  const formattedPrice = `${displayPrice.toLocaleString()}₮`;

  const product = rawProduct
    ? {
        id: rawProduct.id,
        name: rawProduct.title,
        brand: rawProduct.brand,
        price: formattedPrice,
        image: rawProduct.image_url || PLACEHOLDER_IMAGE,
        images:
          (Array.isArray(rawProduct.images) && rawProduct.images.length > 0
            ? rawProduct.images
            : [rawProduct.image_url || PLACEHOLDER_IMAGE]) as string[],
        category: rawProduct.category,
        description: rawProduct.description || "",
        ingredients: (rawProduct.ingredients || []) as string[],
        howToUse: rawProduct.how_to_use || "",
        benefits: (rawProduct.benefits || []) as string[],
        badges: (rawProduct.badges || []) as string[],
        reviews: [] as {
          id: number;
          author: string;
          rating: number;
          date: string;
          comment: string;
        }[],
      }
    : null;

  const relatedProducts = useMemo(
    () =>
      allProducts
        ?.filter((p) => p.id !== id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 4),
    [allProducts, id]
  );

  // Reset image idx when product changes
  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedVariant(null);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !rawProduct) return;
    const cartId = selectedVariant
      ? `${rawProduct.id}_${selectedVariant.id}`
      : rawProduct.id;
    const cartName = selectedVariant
      ? `${product.name} (${selectedVariant.option_name || selectedVariant.variant_name})`
      : product.name;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: cartId,
        name: cartName,
        price: formattedPrice,
        image: product.image,
      });
    }
    toast({
      title: "Сагсанд нэмэгдлээ",
      description: `${cartName} (${quantity}ш)`,
    });
    setQuantity(1);
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ background: CREAM }}>
        <Header />
        <main className="max-w-7xl mx-auto px-5 md:px-10 py-12">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7">
              <Skeleton className="aspect-[4/5] w-full rounded-[36px]" />
            </div>
            <div className="lg:col-span-5 space-y-5 lg:pt-10">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-10 w-40" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen" style={{ background: CREAM }}>
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-5">
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wide">
              Бүтээгдэхүүн олдсонгүй
            </h1>
            <p className="text-muted-foreground">
              Уучлаарай, энэ бүтээгдэхүүн олдсонгүй.
            </p>
            <button
              onClick={() => navigate("/shop")}
              className="px-8 py-3 rounded-full text-white text-sm uppercase tracking-wider"
              style={{ background: SAGE }}
            >
              Дэлгүүр рүү буцах
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = [
    { Icon: Truck, label: "Хүргэлттэй", note: "1-3 өдөр" },
    { Icon: Shield, label: "Баталгаат", note: "100% жинхэнэ" },
    { Icon: RefreshCw, label: "Буцаалт", note: "7 хоног" },
  ];

  return (
    <div className="min-h-screen" style={{ background: CREAM }}>
      <Header />

      <main className="relative">
        {/* Floating botanical decorations */}
        <div className="absolute top-32 -left-10 hidden lg:block opacity-50 pointer-events-none">
          <PalmBranchLeft />
        </div>
        <div className="absolute top-[60vh] right-0 hidden lg:block opacity-40 pointer-events-none">
          <SmallLeaf className="scale-150" />
        </div>

        <div className="max-w-7xl mx-auto px-5 md:px-10 pt-6">
          {/* Back link */}
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/60 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            Буцах
          </button>
        </div>

        {/* SECTION 01 — HERO */}
        <section
          ref={heroRef}
          className="max-w-7xl mx-auto px-5 md:px-10 pt-8 pb-20 md:pt-14 md:pb-32 relative"
        >
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            {/* Image stack */}
            <div className="lg:col-span-7 relative">
              <motion.div
                style={{ y: parallaxY }}
                className="relative aspect-[4/5] rounded-[36px] overflow-hidden shadow-[0_40px_80px_-30px_rgba(90,122,77,0.4)]"
              >
                <motion.img
                  key={`hero-${activeImageIdx}-${product.images[activeImageIdx]}`}
                  src={product.images[activeImageIdx] || product.image}
                  alt={product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />

                {/* Top-left chapter pill */}
                <div className="absolute top-5 left-5">
                  <span
                    className="px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] uppercase tracking-[0.25em] font-medium"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      color: SAGE_DARK,
                    }}
                  >
                    01 · Бүтээгдэхүүн
                  </span>
                </div>

                {/* Top-right wishlist */}
                <div className="absolute top-4 right-4">
                  <WishlistButton
                    productId={product.id}
                    productName={product.name}
                  />
                </div>

                {/* Botanical accent overlapping */}
                <LeafSprigRight className="absolute -top-6 -right-8 opacity-70 mix-blend-multiply pointer-events-none" />
              </motion.div>

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
                  {product.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      aria-label={`Image ${i + 1}`}
                      className="shrink-0 h-20 w-20 rounded-2xl overflow-hidden transition-all"
                      style={{
                        outline:
                          activeImageIdx === i
                            ? `2px solid ${SAGE_DARK}`
                            : "2px solid transparent",
                        outlineOffset: "2px",
                      }}
                    >
                      <img
                        src={src}
                        alt={`thumb-${i}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Editorial info column */}
            <div className="lg:col-span-5 lg:pt-6">
              {/* Badges */}
              {product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {product.badges.map((b) => (
                    <span
                      key={b}
                      className="px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium"
                      style={{ background: SAGE_TINT, color: SAGE_DARK }}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              )}

              {/* Brand kicker */}
              <p
                className="text-[11px] uppercase tracking-[0.3em] font-bold mb-4"
                style={{ color: SAGE_DARK }}
              >
                {product.brand || "Olivin Beauty"}
              </p>

              {/* Title — bold uppercase, magazine style */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase leading-[1.15] tracking-wide text-foreground">
                {product.name}
              </h1>

              {/* Price + tiny rule */}
              <div className="mt-8 flex items-baseline gap-3">
                <span
                  className="text-3xl md:text-4xl font-bold"
                  style={{ color: SAGE_DARK }}
                >
                  {formattedPrice}
                </span>
                {selectedVariant && selectedVariant.price_adjustment !== 0 && (
                  <span className="text-sm text-muted-foreground line-through">
                    {basePrice.toLocaleString()}₮
                  </span>
                )}
              </div>

              <div className="my-7 h-px" style={{ background: SAGE_TINT }} />

              {/* Short description */}
              {product.description && (
                <p className="text-[15px] leading-relaxed text-foreground/70 mb-8">
                  {product.description.slice(0, 220)}
                  {product.description.length > 220 ? "…" : ""}
                </p>
              )}

              {/* Variants */}
              {Object.keys(variantsByType).length > 0 && (
                <div className="space-y-5 mb-8">
                  {Object.entries(variantsByType).map(([type, variants]) => (
                    <div key={type}>
                      <p
                        className="text-[10px] uppercase tracking-[0.25em] font-medium mb-3"
                        style={{ color: SAGE_DARK }}
                      >
                        {type}
                        {selectedVariant &&
                          variants.some((v) => v.id === selectedVariant.id) && (
                            <span className="ml-2 text-foreground/70 normal-case tracking-normal">
                              · {selectedVariant.option_name || selectedVariant.variant_name}
                            </span>
                          )}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((v) => {
                          const isSelected = selectedVariant?.id === v.id;
                          const oos = (v.stock ?? v.stock_quantity ?? 0) <= 0;
                          return (
                            <button
                              key={v.id}
                              onClick={() =>
                                setSelectedVariant(isSelected ? null : v)
                              }
                              disabled={oos}
                              className={`px-4 py-2 rounded-full text-sm transition-all border ${
                                oos
                                  ? "opacity-40 cursor-not-allowed line-through"
                                  : ""
                              }`}
                              style={{
                                borderColor: isSelected ? SAGE_DARK : SAGE_TINT,
                                background: isSelected ? SAGE_DARK : "white",
                                color: isSelected ? "white" : SAGE_DARK,
                              }}
                            >
                              {v.option_name || v.variant_name}
                              {v.price_adjustment > 0 && (
                                <span className="ml-1 opacity-70 text-xs">
                                  +{v.price_adjustment.toLocaleString()}₮
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quantity + Add */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center rounded-full border bg-white"
                  style={{ borderColor: SAGE_TINT }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="h-12 w-12 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Хасах"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-base font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="h-12 w-12 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
                    aria-label="Нэмэх"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="group flex-1 h-12 px-6 rounded-full inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider text-white shadow-[0_10px_24px_-8px_rgba(125,155,110,0.6)] hover:opacity-95 transition-opacity"
                  style={{ background: SAGE }}
                >
                  <ShoppingBag className="w-4 h-4" strokeWidth={2.4} />
                  Сагсанд нэмэх · {formattedPrice}
                </button>
              </div>

              {/* Trust strip */}
              <div className="grid grid-cols-3 gap-4 mt-10">
                {stats.map(({ Icon, label, note }) => (
                  <div
                    key={label}
                    className="rounded-2xl px-4 py-4 bg-white"
                    style={{ border: `1px solid ${SAGE_TINT}` }}
                  >
                    <Icon
                      className="h-4 w-4 mb-2"
                      style={{ color: SAGE_DARK }}
                      strokeWidth={1.6}
                    />
                    <p className="text-[11px] uppercase tracking-wider font-bold text-foreground">
                      {label}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Soft band divider */}
        <div className="h-16 md:h-24" style={{ background: "white" }} />

        {/* SECTION 02 — STORY */}
        {(product.description || product.benefits.length > 0) && (
          <section
            className="bg-white py-20 md:py-28 relative overflow-hidden"
          >
            <div className="max-w-5xl mx-auto px-5 md:px-10">
              <ChapterMark num="02" label="Story" />
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-[1.1] mb-10 max-w-3xl">
                {product.brand
                  ? `${product.brand}-ийн `
                  : ""}
                <span style={{ color: SAGE_DARK }} className="">
                  {product.name}
                </span>{" "}
                танд.
              </h2>

              {product.description && (
                <p className="text-base md:text-lg leading-[1.8] text-foreground/80 max-w-2xl mb-12 whitespace-pre-line">
                  {product.description}
                </p>
              )}

              {product.benefits.length > 0 && (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
                  {product.benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.06 }}
                      className="rounded-2xl px-5 py-5"
                      style={{
                        background: SAGE_TINT,
                      }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: SAGE_DARK }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm text-foreground/80 mt-2 leading-relaxed">
                        {benefit}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* SECTION 03 — INGREDIENTS */}
        {product.ingredients.length > 0 && (
          <section
            className="py-20 md:py-28 relative overflow-hidden"
            style={{ background: CREAM }}
          >
            <div className="max-w-5xl mx-auto px-5 md:px-10">
              <ChapterMark num="03" label="Найрлага" />
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-[1.1] mb-10 max-w-3xl">
                Цэвэр найрлага.{" "}
                <span style={{ color: SAGE_DARK }} className="">
                  Зориудаар.
                </span>
              </h2>

              <div className="flex flex-wrap gap-3 max-w-4xl">
                {product.ingredients.map((ing, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: (i % 12) * 0.04 }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white"
                    style={{ border: `1px solid ${SAGE_TINT}` }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: SAGE }}
                    />
                    <span className="text-sm text-foreground">{ing}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 04 — RITUAL */}
        {product.howToUse && (
          <section className="bg-white py-20 md:py-28 relative">
            <div className="max-w-5xl mx-auto px-5 md:px-10">
              <ChapterMark num="04" label="Хэрэглэх заавар" />
              <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-[1.1] mb-12 max-w-3xl">
                Танай{" "}
                <span style={{ color: SAGE_DARK }} className="">
                  өдрийн зан үйл.
                </span>
              </h2>

              <div className="space-y-6 max-w-3xl">
                {product.howToUse
                  .split(/\n+/)
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex gap-6 items-start"
                    >
                      <span
                        className="text-3xl md:text-4xl font-bold leading-none shrink-0"
                        style={{ color: SAGE_DARK }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="text-base md:text-lg leading-relaxed text-foreground/80 pt-1">
                        {step}
                      </p>
                    </motion.div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 05 — REVIEWS */}
        <section
          className="py-20 md:py-28 relative"
          style={{ background: CREAM }}
        >
          <div className="max-w-5xl mx-auto px-5 md:px-10">
            <ChapterMark num="05" label="Сэтгэгдэл" />
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide leading-[1.1] mb-10 max-w-3xl">
              Хэрэглэгчдийн{" "}
              <span style={{ color: SAGE_DARK }} className="">
                сэтгэгдэл.
              </span>
            </h2>

            {product.reviews.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-5 max-w-4xl">
                {product.reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white rounded-2xl p-6"
                    style={{ border: `1px solid ${SAGE_TINT}` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">{r.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(r.date).toLocaleDateString("mn-MN")}
                        </p>
                      </div>
                      {renderStars(r.rating)}
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {r.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground/60 italic">
                Хамгийн анхны сэтгэгдлийг бичих хүн та бай.
              </p>
            )}
          </div>
        </section>

        {/* RELATED */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="bg-white py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-5 md:px-10">
              <div className="flex items-end justify-between mb-10">
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
                  Танд{" "}
                  <span style={{ color: SAGE_DARK }} className="">
                    таалагдаж магадгүй
                  </span>
                </h2>
                <Link
                  to="/shop"
                  className="text-xs uppercase tracking-[0.2em] font-medium hover:opacity-70 transition-opacity"
                  style={{ color: SAGE_DARK }}
                >
                  Бүгд →
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    image={p.image}
                    name={p.name}
                    brand={p.brand}
                    price={p.price}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Mobile sticky purchase bar */}
      <div
        className="fixed bottom-0 left-0 right-0 px-4 py-3 backdrop-blur-md border-t lg:hidden z-50"
        style={{
          background: "rgba(255,255,255,0.92)",
          borderColor: SAGE_TINT,
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2.5">
          <div
            className="flex items-center rounded-full bg-white"
            style={{ border: `1px solid ${SAGE_TINT}` }}
          >
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="h-11 w-10 flex items-center justify-center text-foreground/60"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-7 text-center text-sm font-medium">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="h-11 w-10 flex items-center justify-center text-foreground/60"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 h-11 px-4 rounded-full inline-flex items-center justify-center gap-2 text-sm font-medium text-white"
            style={{ background: SAGE }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{formattedPrice}</span>
          </button>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
      <Footer />
    </div>
  );
};

export default ProductDetail;
