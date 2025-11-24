import { ShoppingBag, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Olivin</span>
            <span className="text-2xl font-light text-foreground">Beauty</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
            >
              About
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* User Icon */}
            <Button variant="ghost" size="icon" asChild className="hidden md:flex">
              <NavLink to="/auth">
                <User className="h-5 w-5" />
              </NavLink>
            </Button>

            {/* Cart Icon with Badge */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-4 border-t border-border">
            <NavLink
              to="/"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/shop"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </NavLink>
            <NavLink
              to="/auth"
              className="block text-sm font-medium text-foreground hover:text-primary transition-colors"
              activeClassName="text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Account
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
