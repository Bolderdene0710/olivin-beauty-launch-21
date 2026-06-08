import {
  Search,
  Heart,
  User,
  Menu,
  X,
  ShoppingBag,
  Wallet,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Droplet,
  Brush,
  Wind,
  Gift,
  Tag,
  Scissors,
  Leaf,
} from "lucide-react";
import olivinLogo from "@/assets/olivin-logo.png";
import heroImage from "@/assets/hero-skincare.jpg";
import { NavLink } from "@/components/NavLink";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { useWishlist } from "@/hooks/useWishlist";
import { useState, useEffect, useRef, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { useCategories } from "@/hooks/useCategories";

const SAGE = "#7d9b6e";
const SAGE_DARK = "#5a7a4d";
const SAGE_TINT = "#e8eee2";
const CREAM = "#f5f5f3";

const accentItems = [
  { to: "/shop?filter=sale", label: "Хямдрал", accent: true },
  { to: "/about", label: "Зөвлөгөө", accent: false },
  { to: "/shop", label: "Албан ёсны брэндүүд", accent: false },
];

// Pick an icon based on keywords in the category name. Falls back to Leaf.
const pickIcon = (name: string): typeof Leaf => {
  const n = name.toLowerCase();
  if (/(set|багц|gift|бэлэг)/.test(n)) return Gift;
  if (/(new|шинэ|sparkle)/.test(n)) return Sparkles;
  if (/(skin|арьс|toner|serum|cream|moistur)/.test(n)) return Droplet;
  if (/(make ?up|нүүр будалт|lipstick|brush)/.test(n)) return Brush;
  if (/(hair|үс|scissor)/.test(n)) return Scissors;
  if (/(fragrance|perfume|үнэр|wind)/.test(n)) return Wind;
  if (/(sale|хямдр|discount|tag)/.test(n)) return Tag;
  return Leaf;
};

type MegaCategory = {
  to: string;
  label: string;
  Icon: typeof Leaf;
  imageUrl: string | null;
};

// Static fallback shown only when admin has not added any categories yet.
const fallbackCategories: MegaCategory[] = [
  { to: "/shop?filter=new", label: "Шинэ бүтээгдэхүүн", Icon: Sparkles, imageUrl: null },
  { to: "/shop", label: "Бүх бүтээгдэхүүн", Icon: Leaf, imageUrl: null },
  { to: "/shop?filter=sale", label: "Хямдрал", Icon: Tag, imageUrl: null },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const megaRef = useRef<HTMLDivElement | null>(null);
  const { data: dbCategories = [] } = useCategories();
  const { data: storeSettings } = useStoreSettings();
  const { productIds: wishlistIds } = useWishlist();
  const wishlistCount = wishlistIds.length;
  const logoSrc = storeSettings?.logo_url || olivinLogo;
  const storeName = storeSettings?.store_name || "Olivin";

  const megaCategories = useMemo<MegaCategory[]>(() => {
    if (dbCategories.length === 0) return fallbackCategories;
    return dbCategories.map((c) => ({
      to: `/shop?cat=${encodeURIComponent(c.name)}`,
      label: c.name,
      Icon: pickIcon(c.name),
      imageUrl: c.image_url ?? null,
    }));
  }, [dbCategories]);

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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu on outside click + ESC
  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMegaOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [megaOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    } else {
      navigate("/shop");
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-white border-b border-border/60 transition-shadow duration-300 font-['Roboto'] ${
        scrolled ? "shadow-[0_2px_12px_rgba(0,0,0,0.04)]" : ""
      }`}
    >
      {/* TOP ROW: Logo · Search · Icons */}
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-16 md:h-20 items-center gap-4 md:gap-8">
          <NavLink to="/" className="flex items-center shrink-0">
            <img
              src={logoSrc}
              alt={storeName}
              className="h-9 md:h-11 w-auto object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = olivinLogo;
              }}
            />
          </NavLink>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl"
          >
            <motion.div
              whileFocus={{ scale: 1.01 }}
              className="relative w-full group"
            >
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors"
                style={{ color: searchValue ? SAGE : "rgb(150 150 150)" }}
                strokeWidth={1.8}
              />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Эндээс бүхнийг хайж олох..."
                className="w-full h-11 pl-11 pr-4 rounded-full text-sm placeholder:text-muted-foreground/70 outline-none transition-all border"
                style={{
                  background: CREAM,
                  borderColor: "transparent",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.borderColor = SAGE;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.background = CREAM;
                  e.currentTarget.style.borderColor = "transparent";
                }}
              />
            </motion.div>
          </form>

          {/* Icon cluster */}
          <div className="flex items-center gap-1 md:gap-1 ml-auto">
            <button
              onClick={() => navigate("/profile")}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#fafaf9] transition-colors text-foreground/70 hover:text-foreground"
              aria-label="Wallet"
            >
              <Wallet className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </button>
            <button
              onClick={() => navigate("/wishlist")}
              className="relative hidden md:flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#fafaf9] transition-colors text-foreground/70 hover:text-foreground"
              aria-label="Wishlist"
            >
              <Heart className="w-[18px] h-[18px]" strokeWidth={1.6} />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span
                    key={wishlistCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ background: SAGE }}
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => navigate("/cart")}
              className="relative h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#fafaf9] transition-colors text-foreground/70 hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.6} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                    className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ background: SAGE }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button
              onClick={() => navigate(user ? "/profile" : "/auth")}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#fafaf9] transition-colors text-foreground/70 hover:text-foreground"
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px]" strokeWidth={1.6} />
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden h-10 w-10 flex items-center justify-center rounded-full hover:bg-[#fafaf9] text-foreground/80"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" strokeWidth={1.6} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>

        {/* SECOND ROW: mega + nav (desktop only) */}
        <div className="hidden lg:flex items-center gap-2 h-12 -mt-1 pb-2 relative">
          {/* Mega menu trigger */}
          <button
            onClick={() => setMegaOpen((v) => !v)}
            className="relative inline-flex items-center gap-2 h-10 px-5 rounded-full text-sm font-bold uppercase tracking-wide text-white transition-all"
            style={{
              background: megaOpen ? SAGE_DARK : SAGE,
            }}
          >
            <motion.span
              animate={{ rotate: megaOpen ? 90 : 0 }}
              transition={{ duration: 0.25 }}
              className="inline-flex"
            >
              <LayoutGrid className="w-4 h-4" strokeWidth={2} />
            </motion.span>
            Бүх ангилал
            <motion.span
              animate={{ rotate: megaOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="inline-flex"
            >
              <ChevronDown className="w-3.5 h-3.5" strokeWidth={2} />
            </motion.span>
          </button>

          {/* Right accent links */}
          <div className="flex items-center gap-3 ml-auto">
            {accentItems.map((item) => (
              <NavLink
                key={item.to + item.label}
                to={item.to}
                className={`text-[13px] font-bold uppercase tracking-wide transition-colors duration-200 ${
                  item.accent
                    ? "px-3 py-1.5 rounded-full"
                    : "text-foreground/80 hover:text-foreground"
                }`}
                style={
                  item.accent
                    ? { color: SAGE_DARK, background: SAGE_TINT }
                    : undefined
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* MEGA MENU PANEL */}
      <AnimatePresence>
        {megaOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-32 bg-black/20 backdrop-blur-[2px] z-40"
            />
            <motion.div
              ref={megaRef}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full bg-white border-t border-border/60 z-50 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)]"
            >
              <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid lg:grid-cols-[1.4fr_1fr] gap-8">
                {/* Categories list */}
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.25em] font-bold mb-4"
                    style={{ color: SAGE_DARK }}
                  >
                    Ангиллууд
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {megaCategories.map((cat, i) => (
                      <motion.button
                        key={cat.to}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.25,
                          delay: 0.04 * i,
                        }}
                        onClick={() => {
                          navigate(cat.to);
                          setMegaOpen(false);
                        }}
                        className="group flex items-center gap-3 p-3 rounded-2xl text-left transition-colors hover:bg-[#fafaf9]"
                      >
                        <div
                          className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ background: SAGE_TINT }}
                        >
                          {cat.imageUrl ? (
                            <img
                              src={cat.imageUrl}
                              alt={cat.label}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <cat.Icon
                              className="h-4 w-4"
                              style={{ color: SAGE_DARK }}
                              strokeWidth={1.8}
                            />
                          )}
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wide text-foreground flex-1">
                          {cat.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Lifestyle banner */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  onClick={() => {
                    navigate("/shop?filter=new");
                    setMegaOpen(false);
                  }}
                  className="relative aspect-[4/5] lg:aspect-auto rounded-3xl overflow-hidden group text-left"
                >
                  <img
                    src={heroImage}
                    alt="Featured"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(90,122,77,0) 30%, rgba(90,122,77,0.75) 100%)",
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <div
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md"
                      style={{ background: "rgba(255,255,255,0.9)" }}
                    >
                      <Leaf
                        className="h-3 w-3"
                        style={{ color: SAGE_DARK }}
                        strokeWidth={2}
                      />
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold"
                        style={{ color: SAGE_DARK }}
                      >
                        Шинэ цуглуулга
                      </span>
                    </div>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <p className="text-[10px] uppercase tracking-[0.22em] font-bold opacity-90">
                      Olivin · Featured
                    </p>
                    <h3 className="text-xl font-bold uppercase mt-1.5 leading-tight">
                      Glow Drop
                      <br />
                      <span className="italic font-light opacity-90 normal-case">
                        цуглуулга
                      </span>
                    </h3>
                    <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wide mt-3 underline underline-offset-4 group-hover:no-underline">
                      Цуглуулга үзэх <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE NAV */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="lg:hidden overflow-hidden border-t border-border bg-white"
          >
            <div className="px-4 py-4 space-y-3">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Хайх..."
                  className="w-full h-11 pl-11 pr-4 rounded-full text-sm bg-[#f5f5f3] outline-none focus:bg-white focus:border-[#7d9b6e] border border-transparent"
                />
              </form>

              <div className="flex flex-col gap-1 pt-2">
                {accentItems.map((item) => (
                  <NavLink
                    key={item.to + item.label}
                    to={item.to}
                    className="block px-3 py-2.5 text-sm font-bold uppercase tracking-wide rounded-xl transition-colors"
                    style={
                      item.accent
                        ? { color: SAGE_DARK, background: SAGE_TINT }
                        : { color: "rgb(40 40 40)" }
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <NavLink
                  to={user ? "/profile" : "/auth"}
                  className="block px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-foreground/90 hover:text-foreground hover:bg-[#fafaf9] rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {user ? "Профайл" : "Нэвтрэх"}
                </NavLink>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
