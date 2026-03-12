import { Menu, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const BombonHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-5">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="font-display text-3xl md:text-4xl uppercase tracking-wider text-foreground">
          OLIVIN
        </Link>

        {/* Center - Hamburger */}
        <button className="p-2 hover:opacity-70 transition-opacity">
          <Menu className="w-7 h-7 text-foreground" strokeWidth={2.5} />
        </button>

        {/* Right - Shop & Cart */}
        <div className="flex items-center gap-6">
          <Link
            to="/shop"
            className="font-display text-lg uppercase tracking-wide text-foreground relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-foreground after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left"
          >
            shop
          </Link>
          <Link
            to="/cart"
            className="font-display text-lg uppercase tracking-wide text-foreground relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[2px] after:bottom-0 after:left-0 after:bg-foreground after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left flex items-center gap-2"
          >
            cart
            <ShoppingBag className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default BombonHeader;
