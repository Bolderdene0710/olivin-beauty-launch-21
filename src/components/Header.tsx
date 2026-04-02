import { Search, Heart, User, Menu, X, ShoppingBag } from "lucide-react";
import olivinLogo from "@/assets/olivin-logo.png";
import { NavLink } from "@/components/NavLink";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";

const navItems = [
  { to: "/shop?filter=new", label: "Шинэ бүтээгдэхүүн" },
  { to: "/shop?filter=best", label: "Шилдэг" },
  { to: "/shop", label: "Каталог" },
  { to: "/track-order", label: "Хүргэлт" },
  { to: "/about", label: "Холбоо барих" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-background border-b border-border transition-shadow duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center">
            <img src={olivinLogo} alt="Olivin" className="h-9 md:h-12 w-auto" />
          </NavLink>

          {/* Center Nav - Desktop */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-[13px] font-normal tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-200"
                activeClassName="text-foreground"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/shop")}
              className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
            <button className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Heart className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
            <button
              onClick={() => navigate(user ? "/profile" : "/auth")}
              className="hidden md:flex p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <User className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  activeClassName="text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <NavLink
                to={user ? "/profile" : "/auth"}
                className="block px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                activeClassName="text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {user ? "Профайл" : "Нэвтрэх"}
              </NavLink>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
