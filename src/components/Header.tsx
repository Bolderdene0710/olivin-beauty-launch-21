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
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/60 backdrop-blur-xl shadow-lg shadow-primary/5 border-b border-border/50"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-18 md:h-20 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-1 group">
            <span className="text-2xl md:text-3xl font-black tracking-[0.15em] uppercase text-foreground group-hover:text-primary transition-colors duration-300">
              OLIVIN
            </span>
          </NavLink>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-2/3"
                activeClassName="text-primary after:!w-2/3"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:flex rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
              onClick={() => navigate("/shop")}
            >
              <Search className="h-[18px] w-[18px]" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden md:flex rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
            >
              <NavLink to={user ? "/profile" : "/auth"}>
                <User className="h-[18px] w-[18px]" />
              </NavLink>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-md"
                >
                  {cartCount}
                </motion.span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
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
            className="md:hidden overflow-hidden bg-background/80 backdrop-blur-xl border-t border-border/50"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <NavLink
                    to={item.to}
                    className="block px-4 py-3 text-sm font-bold tracking-[0.1em] uppercase text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
                    activeClassName="text-primary bg-primary/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.05 }}
              >
                <NavLink
                  to={user ? "/profile" : "/auth"}
                  className="block px-4 py-3 text-sm font-bold tracking-[0.1em] uppercase text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-200"
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
  );
};

export default Header;
