import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "HOME" },
  { to: "/shop", label: "SHOP" },
  { to: "/track-order", label: "TRACK ORDER" },
  { to: "/about", label: "ABOUT" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Announcement Bar */}
      <div className="w-full bg-foreground text-background text-center py-2 text-xs md:text-sm font-semibold tracking-wide z-[60] relative">
        🚚 50,000₮-с дээш худалдан авалтад хүргэлт үнэгүй
      </div>

      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? "bg-background/50 backdrop-blur-xl shadow-lg shadow-primary/5 border-b border-border/40"
            : "bg-background/20 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex h-16 md:h-18 items-center justify-between">
            {/* Logo */}
            <NavLink to="/" className="flex items-center group">
              <span className="text-2xl md:text-3xl font-black tracking-[0.2em] uppercase text-foreground group-hover:text-primary transition-colors duration-300">
                OLIVIN
              </span>
            </NavLink>

            {/* Desktop Navigation - Center */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className="relative px-5 py-2 text-[11px] font-bold tracking-[0.15em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-3/5"
                  activeClassName="text-primary after:!w-3/5"
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="hidden md:flex rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-9 w-9"
                onClick={() => navigate("/shop")}
              >
                <Search className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                asChild
                className="hidden md:flex rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-9 w-9"
              >
                <NavLink to={user ? "/profile" : "/auth"}>
                  <User className="h-4 w-4" />
                </NavLink>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 h-9 w-9"
                onClick={() => navigate("/cart")}
              >
                <ShoppingBag className="h-4 w-4" />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-[18px] w-[18px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center shadow-md"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 h-9 w-9"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-background/70 backdrop-blur-xl border-t border-border/40"
            >
              <div className="container mx-auto px-4 py-3 flex flex-col gap-0.5">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <NavLink
                      to={item.to}
                      className="block px-4 py-2.5 text-sm font-bold tracking-[0.1em] uppercase text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                      activeClassName="text-primary bg-primary/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.04 }}
                >
                  <NavLink
                    to={user ? "/profile" : "/auth"}
                    className="block px-4 py-2.5 text-sm font-bold tracking-[0.1em] uppercase text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                    activeClassName="text-primary bg-primary/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {user ? "PROFILE" : "ACCOUNT"}
                  </NavLink>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Header;
