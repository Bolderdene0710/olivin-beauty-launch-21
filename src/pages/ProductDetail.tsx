import { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingBag,
  Minus,
  Plus,
  ChevronRight,
  ChevronLeft,
  Truck,
  ShieldCheck,
  RefreshCw,
  Check,
  Sparkles,
  FlaskConical,
  ListOrdered,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { fetchProductWithVariants, type ProductVariant } from "@/lib/supabase";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { WishlistButton } from "@/components/WishlistButton";

const PLACEHOLDER_IMAGE = "/placeholder.svg";
const LOW_STOCK = 5;
const RELATED_COUNT = 4;

// Same store promises as the home page "Яагаад OLIVIN гэж?" section.
const TRUST = [
  { Icon: Truck, label: "Улаанбаатар даяар 1–3 өдөрт хүргэнэ" },
  { Icon: ShieldCheck, label: "100% жинхэнэ, албан ёсны нийлүүлэгчээс" },
  { Icon: RefreshCw, label: "7 хоногийн дотор буцаах боломжтой" },
];

type SectionKey = "about" | "ingredients" | "usage";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>("about");
  const buyBoxRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Partial<Record<SectionKey, HTMLElement | null>>>({});

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

  const product = useMemo(() => {
    if (!rawProduct) return null;
    return {
      id: rawProduct.id,
      name: rawProduct.title as string,
      brand: (rawProduct.brand as string | null) ?? "",
      image: rawProduct.image_url || PLACEHOLDER_IMAGE,
      // Admin stores the full gallery in image_urls; image_url is only the cover
      images: (Array.isArray(rawProduct.image_urls) && rawProduct.image_urls.length > 0
        ? rawProduct.image_urls
        : [rawProduct.image_url || PLACEHOLDER_IMAGE]) as string[],
      category: (rawProduct.categories?.name as string | undefined) ?? "",
      categoryId: rawProduct.category_id as string | null,
      description: (rawProduct.description as string | null) || "",
      ingredients: (rawProduct.ingredients || []) as string[],
      howToUse: (rawProduct.how_to_use as string | null) || "",
      benefits: (rawProduct.benefits || []) as string[],
      badges: (rawProduct.tags || []) as string[],
    };
  }, [rawProduct]);

  const stock: number = selectedVariant
    ? selectedVariant.stock ?? selectedVariant.stock_quantity ?? 0
    : rawProduct?.stock_quantity ?? 0;
  const soldOut = !!rawProduct && stock <= 0;

  const usageSteps = useMemo(
    () =>
      (product?.howToUse ?? "")
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
    [product?.howToUse]
  );

  const sections = useMemo(() => {
    if (!product) return [];
    const list: { key: SectionKey; label: string }[] = [];
    if (product.description || product.benefits.length) list.push({ key: "about", label: "Тайлбар" });
    if (product.ingredients.length) list.push({ key: "ingredients", label: "Найрлага" });
    if (usageSteps.length) list.push({ key: "usage", label: "Хэрэглэх заавар" });
    return list;
  }, [product, usageSteps.length]);

  // Same category first, then fill with others — stable order, no reshuffle on re-render.
  const relatedProducts = useMemo(() => {
    if (!allProducts || !product) return [];
    const others = allProducts.filter((p) => p.id !== product.id);
    const sameCat = others.filter((p) => product.categoryId && p.categoryId === product.categoryId);
    const rest = others.filter((p) => !sameCat.includes(p));
    return [...sameCat, ...rest].slice(0, RELATED_COUNT);
  }, [allProducts, product]);

  // Reset state when product changes
  useEffect(() => {
    setActiveImageIdx(0);
    setSelectedVariant(null);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [id]);

  // Keep quantity within stock when variant changes
  useEffect(() => {
    if (stock > 0) setQuantity((q) => Math.min(q, stock));
  }, [stock]);

  // Mobile sticky bar appears only once the main buy box scrolls out of view
  useEffect(() => {
    const el = buyBoxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setShowStickyBar(!entry.isIntersecting), {
      rootMargin: "0px 0px -80px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [rawProduct]);

  // Highlight the section-nav item for the section currently in view
  useEffect(() => {
    const entries = sections
      .map((s) => sectionRefs.current[s.key])
      .filter((el): el is HTMLElement => !!el);
    if (!entries.length) return;
    const observer = new IntersectionObserver(
      (obs) => {
        const visible = obs.filter((o) => o.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveSection(visible[0].target.getAttribute("data-section") as SectionKey);
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    entries.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (key: SectionKey) => {
    const el = sectionRefs.current[key];
    if (!el) return;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 140, behavior: "smooth" });
  };

  const handleAddToCart = () => {
    if (!product || !rawProduct || soldOut) return;
    const cartId = selectedVariant ? `${rawProduct.id}_${selectedVariant.id}` : rawProduct.id;
    const cartName = selectedVariant
      ? `${product.name} (${selectedVariant.option_name || selectedVariant.variant_name})`
      : product.name;

    for (let i = 0; i < quantity; i++) {
      addItem({ id: cartId, name: cartName, price: formattedPrice, image: product.image });
    }
    toast({ title: "Сагсанд нэмэгдлээ", description: `${cartName} (${quantity}ш)` });
    setQuantity(1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (!soldOut) navigate("/cart");
  };

  const showImage = (idx: number) => {
    if (!product) return;
    const n = product.images.length;
    setActiveImageIdx(((idx % n) + n) % n);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <Skeleton className="h-4 w-48 mb-6" />
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
            <Skeleton className="aspect-square w-full rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
          <h1 className="font-serif-display text-3xl md:text-4xl font-light">Бүтээгдэхүүн олдсонгүй</h1>
          <p className="mt-3 text-muted-foreground">Энэ бүтээгдэхүүн устгагдсан эсвэл холбоос буруу байна.</p>
          <button
            onClick={() => navigate("/shop")}
            className="mt-8 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Дэлгүүр рүү буцах <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const stockLabel = soldOut
    ? { text: "Дууссан", className: "text-destructive", dot: "bg-destructive" }
    : stock <= LOW_STOCK
      ? { text: `Цөөн үлдсэн · ${stock} ширхэг`, className: "text-amber-700", dot: "bg-amber-500" }
      : { text: "Бэлэн байгаа", className: "text-primary-dark", dot: "bg-primary" };

  const multipleImages = product.images.length > 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 md:px-8 pt-5 md:pt-8 pb-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-5 md:mb-8 overflow-hidden">
          <Link to="/" className="hover:text-foreground shrink-0">Нүүр</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link to="/shop" className="hover:text-foreground shrink-0">Дэлгүүр</Link>
          {product.category && (
            <>
              <ChevronRight className="w-3 h-3 shrink-0" />
              <Link to={`/shop?cat=${encodeURIComponent(product.category)}`} className="hover:text-foreground shrink-0">
                {product.category}
              </Link>
            </>
          )}
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-foreground truncate">{product.name}</span>
        </nav>

        {/* HERO: gallery + buy box */}
        <section className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-secondary group">
              <AnimatePresence initial={false} mode="popLayout">
                <motion.img
                  key={product.images[activeImageIdx]}
                  src={product.images[activeImageIdx] || product.image}
                  alt={product.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  drag={multipleImages ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) showImage(activeImageIdx + 1);
                    else if (info.offset.x > 60) showImage(activeImageIdx - 1);
                  }}
                  className="absolute inset-0 w-full h-full object-cover touch-pan-y select-none"
                  draggable={false}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
              </AnimatePresence>

              {product.badges.length > 0 && (
                <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 pointer-events-none">
                  {product.badges.slice(0, 3).map((b) => (
                    <span key={b} className="px-2.5 py-1 rounded-full bg-background/85 backdrop-blur text-[10px] font-semibold uppercase tracking-wider">
                      {b}
                    </span>
                  ))}
                </div>
              )}
              <div className="absolute top-3 right-3">
                <WishlistButton productId={product.id} productName={product.name} />
              </div>

              {multipleImages && (
                <>
                  {[
                    { dir: -1, Icon: ChevronLeft, pos: "left-3", label: "Өмнөх зураг" },
                    { dir: 1, Icon: ChevronRight, pos: "right-3", label: "Дараагийн зураг" },
                  ].map(({ dir, Icon, pos, label }) => (
                    <button
                      key={dir}
                      onClick={() => showImage(activeImageIdx + dir)}
                      aria-label={label}
                      className={`absolute ${pos} top-1/2 -translate-y-1/2 hidden md:flex h-10 w-10 items-center justify-center rounded-full bg-background/85 backdrop-blur shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                    {product.images.map((_, i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === activeImageIdx ? "w-5 bg-foreground" : "w-1.5 bg-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {multipleImages && (
              <div className="hidden md:flex gap-3 mt-4">
                {product.images.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImageIdx(i)}
                    aria-label={`Зураг ${i + 1}`}
                    className={`h-20 w-20 rounded-2xl overflow-hidden bg-secondary transition-all ${
                      activeImageIdx === i ? "ring-2 ring-foreground ring-offset-2" : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy box */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {product.brand && (
              <Link
                to={`/shop?brand=${encodeURIComponent(product.brand)}`}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark hover:underline underline-offset-4"
              >
                {product.brand}
              </Link>
            )}
            <h1 className="mt-2 font-serif-display text-3xl md:text-4xl font-light leading-tight tracking-tight text-foreground">
              {product.name}
            </h1>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div className="flex items-baseline gap-2">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={displayPrice}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-3xl font-semibold tabular-nums text-foreground"
                  >
                    {formattedPrice}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${stockLabel.className}`}>
                <span className={`h-2 w-2 rounded-full ${stockLabel.dot}`} />
                {stockLabel.text}
              </span>
            </div>

            {product.description && (
              <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground line-clamp-3">{product.description}</p>
            )}
            {product.benefits.length > 0 && (
              <ul className="mt-5 space-y-2">
                {product.benefits.slice(0, 3).map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-foreground/85">
                    <span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-dark" strokeWidth={3} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            )}

            {/* Variants */}
            {Object.entries(variantsByType).map(([type, variants]) => (
              <div key={type} className="mt-7">
                <p className="text-sm font-medium text-foreground mb-3">
                  {type}
                  {selectedVariant && variants.some((v) => v.id === selectedVariant.id) && (
                    <span className="ml-1.5 font-normal text-muted-foreground">
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
                        onClick={() => setSelectedVariant(isSelected ? null : v)}
                        disabled={oos}
                        className={`px-4 h-10 rounded-xl text-sm border transition-all ${
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background hover:border-foreground/40"
                        } ${oos ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                      >
                        {v.option_name || v.variant_name}
                        {v.price_adjustment > 0 && (
                          <span className="ml-1 opacity-70 text-xs">+{v.price_adjustment.toLocaleString()}₮</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Quantity + actions */}
            <div ref={buyBoxRef} className="mt-8 space-y-3">
              <div className="flex gap-3">
                <QuantityStepper
                  value={quantity}
                  max={Math.max(1, stock)}
                  disabled={soldOut}
                  onChange={setQuantity}
                />
                <AddButton soldOut={soldOut} justAdded={justAdded} onClick={handleAddToCart} className="flex-1 h-12" />
              </div>
              {!soldOut && (
                <button
                  onClick={handleBuyNow}
                  className="w-full h-12 rounded-2xl border border-foreground text-foreground text-[15px] font-medium hover:bg-foreground hover:text-background transition-colors"
                >
                  Шууд худалдан авах
                </button>
              )}
            </div>

            {/* Trust */}
            <ul className="mt-8 rounded-2xl bg-secondary/60 divide-y divide-border/60">
              {TRUST.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-3 px-4 py-3 text-sm text-foreground/85">
                  <Icon className="w-4 h-4 text-primary-dark shrink-0" strokeWidth={1.8} />
                  {label}
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* DETAILS with section nav */}
        {sections.length > 0 && (
          <section className="mt-16 md:mt-24">
            <div className="sticky top-16 md:top-20 lg:top-32 z-20 -mx-4 px-4 md:mx-0 md:px-0 bg-background/90 backdrop-blur-xl border-b border-border">
              <div className="flex gap-6 overflow-x-auto [scrollbar-width:none]">
                {sections.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => scrollToSection(s.key)}
                    className={`relative shrink-0 py-4 text-sm font-medium transition-colors ${
                      activeSection === s.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s.label}
                    {activeSection === s.key && (
                      <motion.span layoutId="pdp-section" className="absolute left-0 right-0 -bottom-px h-0.5 bg-foreground" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="max-w-3xl">
              {sections.some((s) => s.key === "about") && (
                <DetailSection
                  sectionKey="about"
                  icon={Sparkles}
                  title="Тайлбар"
                  refCallback={(el) => (sectionRefs.current.about = el)}
                >
                  {product.description && (
                    <p className="text-[15px] md:text-base leading-[1.8] text-foreground/80 whitespace-pre-line">
                      {product.description}
                    </p>
                  )}
                  {product.benefits.length > 0 && (
                    <div className="mt-6 grid sm:grid-cols-2 gap-3">
                      {product.benefits.map((b) => (
                        <div key={b} className="flex items-start gap-3 rounded-2xl bg-secondary/60 px-4 py-3.5">
                          <Check className="w-4 h-4 mt-0.5 text-primary-dark shrink-0" strokeWidth={2.5} />
                          <span className="text-sm text-foreground/85 leading-relaxed">{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </DetailSection>
              )}

              {sections.some((s) => s.key === "ingredients") && (
                <DetailSection
                  sectionKey="ingredients"
                  icon={FlaskConical}
                  title="Найрлага"
                  subtitle="Гол найрлагууд"
                  refCallback={(el) => (sectionRefs.current.ingredients = el)}
                >
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ing) => (
                      <span key={ing} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border text-sm text-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {ing}
                      </span>
                    ))}
                  </div>
                </DetailSection>
              )}

              {sections.some((s) => s.key === "usage") && (
                <DetailSection
                  sectionKey="usage"
                  icon={ListOrdered}
                  title="Хэрэглэх заавар"
                  refCallback={(el) => (sectionRefs.current.usage = el)}
                >
                  <ol className="relative space-y-5">
                    {usageSteps.map((step, i) => (
                      <li key={i} className="relative flex gap-4">
                        {i < usageSteps.length - 1 && (
                          <span className="absolute left-[15px] top-9 bottom-[-20px] w-px bg-border" aria-hidden />
                        )}
                        <span className="relative h-8 w-8 shrink-0 rounded-full bg-foreground text-background text-sm font-semibold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <p className="pt-1 text-[15px] leading-relaxed text-foreground/85">{step}</p>
                      </li>
                    ))}
                  </ol>
                </DetailSection>
              )}
            </div>
          </section>
        )}

        {/* RELATED */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 md:mt-28">
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2 className="font-serif-display text-2xl md:text-3xl font-light tracking-tight">
                Танд <em className="italic text-primary">таалагдаж</em> магадгүй
              </h2>
              <Link to="/shop" className="shrink-0 inline-flex items-center gap-1 text-sm text-primary-dark hover:text-foreground">
                Бүгд <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group block">
                  <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute top-3 right-3" onClick={(e) => e.preventDefault()}>
                      <WishlistButton productId={p.id} productName={p.name} size="sm" />
                    </div>
                  </div>
                  {p.brand && <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{p.brand}</p>}
                  <p className="mt-1 text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary-dark transition-colors">
                    {p.name}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold">{p.price}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Mobile sticky purchase bar — slides in once the main buy box is off-screen */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-background/95 backdrop-blur-xl border-t border-border px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center gap-3">
              <img src={product.images[0] || product.image} alt="" className="h-11 w-11 rounded-xl object-cover bg-secondary shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">{product.name}</p>
                <p className="text-sm font-semibold tabular-nums">{formattedPrice}</p>
              </div>
              <AddButton soldOut={soldOut} justAdded={justAdded} onClick={handleAddToCart} className="h-11 px-5" compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

interface QuantityStepperProps {
  value: number;
  max: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const QuantityStepper = ({ value, max, disabled, onChange }: QuantityStepperProps) => (
  <div className={`flex items-center h-12 rounded-2xl border border-border ${disabled ? "opacity-50" : ""}`}>
    <button
      onClick={() => onChange(Math.max(1, value - 1))}
      disabled={disabled || value <= 1}
      className="h-full w-11 flex items-center justify-center text-foreground/70 hover:text-foreground disabled:opacity-40"
      aria-label="Хасах"
    >
      <Minus className="w-4 h-4" />
    </button>
    <span className="w-8 text-center text-[15px] font-medium tabular-nums">{value}</span>
    <button
      onClick={() => onChange(Math.min(max, value + 1))}
      disabled={disabled || value >= max}
      className="h-full w-11 flex items-center justify-center text-foreground/70 hover:text-foreground disabled:opacity-40"
      aria-label="Нэмэх"
    >
      <Plus className="w-4 h-4" />
    </button>
  </div>
);

interface AddButtonProps {
  soldOut: boolean;
  justAdded: boolean;
  onClick: () => void;
  className?: string;
  compact?: boolean;
}

const AddButton = ({ soldOut, justAdded, onClick, className = "", compact }: AddButtonProps) => (
  <button
    onClick={onClick}
    disabled={soldOut}
    className={`relative overflow-hidden rounded-2xl text-[15px] font-medium inline-flex items-center justify-center gap-2 transition-colors active:scale-[0.98] disabled:cursor-not-allowed ${
      soldOut
        ? "bg-secondary text-muted-foreground"
        : justAdded
          ? "bg-primary text-primary-foreground"
          : "bg-foreground text-background hover:bg-primary-dark"
    } ${className}`}
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={soldOut ? "soldout" : justAdded ? "added" : "add"}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="inline-flex items-center gap-2"
      >
        {soldOut ? (
          "Дууссан"
        ) : justAdded ? (
          <>
            <Check className="w-4 h-4" strokeWidth={2.5} /> Нэмэгдлээ
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" /> {compact ? "Сагслах" : "Сагсанд нэмэх"}
          </>
        )}
      </motion.span>
    </AnimatePresence>
  </button>
);

interface DetailSectionProps {
  sectionKey: SectionKey;
  icon: typeof Sparkles;
  title: string;
  subtitle?: string;
  refCallback: (el: HTMLElement | null) => void;
  children: React.ReactNode;
}

const DetailSection = ({ sectionKey, icon: Icon, title, subtitle, refCallback, children }: DetailSectionProps) => (
  <motion.section
    ref={refCallback}
    data-section={sectionKey}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.45 }}
    className="py-10 md:py-12 border-b border-border/60 last:border-0"
  >
    <div className="flex items-center gap-3 mb-6">
      <span className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
        <Icon className="w-[18px] h-[18px] text-primary-dark" strokeWidth={1.8} />
      </span>
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
    {children}
  </motion.section>
);

export default ProductDetail;
