import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ShoppingBag, SlidersHorizontal, Sparkles, ChevronDown } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { WishlistButton } from "@/components/WishlistButton";
import type { Product } from "@/types/product";

const ALL = "All";
const NEW_ARRIVALS_LIMIT = 12;
const NEW_BADGE_DAYS = 30;

type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Санал болгох" },
  { value: "newest", label: "Шинэ эхэндээ" },
  { value: "price-asc", label: "Үнэ: бага → их" },
  { value: "price-desc", label: "Үнэ: их → бага" },
];

const PRICE_RANGES = [
  { value: "u30", label: "30,000₮ хүртэл", min: 0, max: 30000 },
  { value: "30-60", label: "30,000 – 60,000₮", min: 30000, max: 60000 },
  { value: "60-100", label: "60,000 – 100,000₮", min: 60000, max: 100000 },
  { value: "100+", label: "100,000₮-с дээш", min: 100000, max: Infinity },
];

const createdTime = (p: Product) => (p.createdAt ? new Date(p.createdAt).getTime() : 0);

const isRecent = (p: Product) =>
  !!p.createdAt && Date.now() - createdTime(p) < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000;

const Shop = () => {
  const { data: products = [], isLoading, error } = useProducts();
  const { data: categories = [] } = useCategories();
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL is the source of truth: Header search sends ?q=, Header categories send ?cat=,
  // Footer "Шинэ" sends ?filter=new.
  const urlQuery = searchParams.get("q") ?? "";
  const activeFilter = searchParams.get("cat") || searchParams.get("category") || ALL;
  const showNewOnly = searchParams.get("filter") === "new";
  const activeBrand = searchParams.get("brand") ?? "";
  const activeTag = searchParams.get("tag") ?? "";
  const activePrice = searchParams.get("price") ?? "";

  const [searchInput, setSearchInput] = useState(urlQuery);
  const [sort, setSort] = useState<SortKey>(showNewOnly ? "newest" : "featured");

  useEffect(() => setSearchInput(urlQuery), [urlQuery]);
  useEffect(() => {
    if (showNewOnly) setSort("newest");
  }, [showNewOnly]);

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    next.delete("category");
    setSearchParams(next, { replace: true });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ q: searchInput.trim() || null });
  };

  const filterPills: string[] = [ALL, ...categories.map((c) => c.name)];

  // Brand and need (tag) options come from the catalog itself, so they never point at empty results.
  const brandOptions = useMemo(
    () => [...new Set(products.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [products]
  );
  const tagOptions = useMemo(
    () => [...new Set(products.flatMap((p) => p.badges))].sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (activeBrand) filtered = filtered.filter((p) => p.brand === activeBrand);
    if (activeTag) filtered = filtered.filter((p) => p.badges.includes(activeTag));

    const priceRange = PRICE_RANGES.find((r) => r.value === activePrice);
    if (priceRange) {
      filtered = filtered.filter((p) => p.priceNumber >= priceRange.min && p.priceNumber < priceRange.max);
    }

    if (activeFilter !== ALL) {
      // Match either by category name (joined from categories table) or by id
      const target = activeFilter.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          (p.category && p.category.toLowerCase() === target) ||
          p.categoryId === activeFilter
      );
    }

    if (urlQuery.trim()) {
      const q = urlQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.brand ?? "").toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q)
      );
    }

    const sorted = [...filtered];
    if (sort === "newest" || showNewOnly) sorted.sort((a, b) => createdTime(b) - createdTime(a));
    else if (sort === "price-asc") sorted.sort((a, b) => a.priceNumber - b.priceNumber);
    else if (sort === "price-desc") sorted.sort((a, b) => b.priceNumber - a.priceNumber);

    return showNewOnly ? sorted.slice(0, NEW_ARRIVALS_LIMIT) : sorted;
  }, [products, activeFilter, urlQuery, sort, showNewOnly, activeBrand, activeTag, activePrice]);

  const hasActiveFilters =
    activeFilter !== ALL || !!urlQuery || showNewOnly || !!activeBrand || !!activeTag || !!activePrice;

  const handleAdd = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({ title: "Сагсанд нэмлээ!", description: product.name });
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--sage-light)/0.45),transparent_55%),radial-gradient(ellipse_at_bottom_right,hsl(30_60%_88%/0.6),transparent_60%)]" />
        <motion.div
          aria-hidden
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-14 pb-12 md:pt-20 md:pb-16">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase text-primary-dark bg-background/70 backdrop-blur px-3 py-1.5 rounded-full border border-primary/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {showNewOnly ? "Шинээр ирсэн" : "K-Beauty каталог"}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-serif-display text-4xl md:text-6xl lg:text-7xl font-light text-foreground mt-5 leading-[1.05] tracking-tight"
          >
            {showNewOnly ? (
              <>
                Шинэ <em className="italic text-primary">бүтээгдэхүүн</em>
              </>
            ) : (
              <>
                Арьсандаа <em className="italic text-primary">тохирохыг</em>
                <br className="hidden sm:block" /> олоорой
              </>
            )}
          </motion.h1>

          {/* Search */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 max-w-xl"
          >
            <div className="group flex items-center gap-2 p-1.5 pl-5 rounded-full bg-background/90 backdrop-blur border border-border shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)] focus-within:border-primary focus-within:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.35)] transition-all">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Бүтээгдэхүүн, брэнд хайх..."
                className="flex-1 min-w-0 bg-transparent py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none [&::-webkit-search-cancel-button]:hidden"
              />
              {searchInput && (
                <button
                  type="button"
                  aria-label="Цэвэрлэх"
                  onClick={() => {
                    setSearchInput("");
                    updateParams({ q: null });
                  }}
                  className="p-1.5 rounded-full text-muted-foreground hover:bg-secondary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Хайх
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Filter bar */}
      <div className="relative z-10 bg-background/85 backdrop-blur-xl border-y border-border/60">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 [scrollbar-width:none]">
            <button
              onClick={() => updateParams({ filter: showNewOnly ? null : "new" })}
              className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                showNewOnly
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "bg-secondary text-foreground hover:bg-primary/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Шинэ
            </button>
            {filterPills.map((pill) => {
              const active = activeFilter === pill;
              return (
                <button
                  key={pill}
                  onClick={() => updateParams({ cat: pill === ALL ? null : pill })}
                  className={`relative shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    active ? "text-background" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="shop-active-pill"
                      className="absolute inset-0 rounded-full bg-foreground"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{pill === ALL ? "Бүгд" : pill}</span>
                </button>
              );
            })}
          </div>

          <label className="shrink-0 relative flex items-center">
            <SlidersHorizontal className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Эрэмбэлэх"
              className="appearance-none pl-9 pr-4 py-2 rounded-full bg-secondary text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      <main className="px-4 md:px-8 pt-6 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Secondary filters: need · brand · price */}
          <div className="flex flex-wrap gap-2 mb-6">
            <FilterSelect
              label="Хэрэгцээ"
              value={activeTag}
              options={tagOptions.map((t) => ({ value: t, label: t }))}
              onChange={(v) => updateParams({ tag: v || null })}
            />
            <FilterSelect
              label="Брэнд"
              value={activeBrand}
              options={brandOptions.map((b) => ({ value: b, label: b }))}
              onChange={(v) => updateParams({ brand: v || null })}
            />
            <FilterSelect
              label="Үнэ"
              value={activePrice}
              options={PRICE_RANGES.map(({ value, label }) => ({ value, label }))}
              onChange={(v) => updateParams({ price: v || null })}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <p className="text-sm text-muted-foreground">
              {isLoading ? (
                "Ачааллаж байна..."
              ) : (
                <>
                  <span className="font-semibold text-foreground">{filteredProducts.length}</span>{" "}
                  бүтээгдэхүүн
                  {urlQuery && (
                    <>
                      {" "}· “<span className="text-foreground">{urlQuery}</span>”
                    </>
                  )}
                </>
              )}
            </p>
            {hasActiveFilters && (
              <button
                onClick={() => setSearchParams({}, { replace: true })}
                className="text-sm text-primary-dark underline underline-offset-4 hover:text-foreground"
              >
                Шүүлтүүр цэвэрлэх
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
                  <Skeleton className="h-3 w-1/3 mt-4" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                  <Skeleton className="h-4 w-1/4 mt-3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <EmptyState title="Бүтээгдэхүүн ачааллахад алдаа гарлаа." />
          ) : filteredProducts.length === 0 ? (
            <EmptyState
              title="Бүтээгдэхүүн олдсонгүй"
              subtitle="Өөр түлхүүр үгээр хайх эсвэл шүүлтүүрээ цэвэрлээд үзээрэй."
              onReset={() => setSearchParams({}, { replace: true })}
            />
          ) : (
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, i) => (
                  <ShopCard
                    key={product.id}
                    product={product}
                    index={i}
                    onOpen={() => navigate(`/product/${product.id}`)}
                    onAdd={() => handleAdd(product)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

interface ShopCardProps {
  product: Product;
  index: number;
  onOpen: () => void;
  onAdd: () => void;
}

const ShopCard = ({ product, index, onOpen, onAdd }: ShopCardProps) => {
  const soldOut = product.stockQuantity <= 0;
  const badges = isRecent(product) ? ["Шинэ", ...product.badges] : product.badges;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: (index % 8) * 0.04 }}
      className="group flex flex-col"
    >
      <div
        className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-secondary cursor-pointer"
        onClick={onOpen}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] ${
            soldOut ? "opacity-60 grayscale" : ""
          }`}
        />

        {badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {badges.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider backdrop-blur ${
                  tag === "Шинэ" ? "bg-primary text-primary-foreground" : "bg-background/85 text-foreground"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="absolute top-3 right-3 z-10" onClick={(e) => e.stopPropagation()}>
          <WishlistButton productId={product.id} productName={product.name} size="sm" />
        </div>

        {soldOut ? (
          <div className="absolute inset-x-3 bottom-3 py-2.5 rounded-2xl bg-background/90 backdrop-blur text-center text-xs font-medium text-muted-foreground">
            Дууссан
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd();
            }}
            className="absolute inset-x-3 bottom-3 flex items-center justify-center gap-2 py-3 rounded-2xl bg-foreground/90 backdrop-blur text-background text-sm font-medium transition-all duration-300 md:translate-y-[calc(100%+12px)] md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 hover:bg-primary-dark active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
            Сагсанд нэмэх
          </button>
        )}
      </div>

      <div className="pt-4 px-1 cursor-pointer" onClick={onOpen}>
        {product.brand && (
          <p className="text-[11px] text-muted-foreground uppercase tracking-[0.15em]">
            {product.brand}
          </p>
        )}
        <h3 className="mt-1 text-sm md:text-[15px] font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary-dark transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-base font-semibold text-foreground">{product.price}</p>
      </div>
    </motion.article>
  );
};

interface FilterSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const FilterSelect = ({ label, value, options, onChange }: FilterSelectProps) => {
  if (options.length === 0) return null;
  const active = !!value;
  return (
    <label className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={`appearance-none h-9 pl-4 pr-9 rounded-full text-sm font-medium cursor-pointer border transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
          active
            ? "bg-primary/10 border-primary/40 text-primary-dark"
            : "bg-background border-border text-foreground hover:border-foreground/30"
        }`}
      >
        <option value="">{label}: Бүгд</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {label}: {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 w-4 h-4 text-muted-foreground pointer-events-none" />
    </label>
  );
};

interface EmptyStateProps {
  title: string;
  subtitle?: string;
  onReset?: () => void;
}

const EmptyState = ({ title, subtitle, onReset }: EmptyStateProps) => (
  <div className="flex flex-col items-center text-center py-20 px-6 rounded-3xl bg-secondary/60">
    <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center mb-5 shadow-sm">
      <Search className="w-6 h-6 text-muted-foreground" />
    </div>
    <p className="text-lg font-medium text-foreground">{title}</p>
    {subtitle && <p className="text-sm text-muted-foreground mt-2 max-w-sm">{subtitle}</p>}
    {onReset && (
      <button
        onClick={onReset}
        className="mt-6 px-6 py-2.5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        Бүх бүтээгдэхүүн үзэх
      </button>
    )}
  </div>
);

export default Shop;
