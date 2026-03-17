import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block">
              <span className="text-xl font-semibold tracking-wider text-foreground">OLIVIN.</span>
            </Link>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed max-w-[200px]">
              Солонгосын гоо сайхны бүтээгдэхүүнийг албан ёсны эрхтэйгээр хүргэж байна.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-4">
              Бүтээгдэхүүн
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop?filter=new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Шинэ</Link>
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Каталог</Link>
              <Link to="/track-order" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Хүргэлт</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-4">
              Компани
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Бидний тухай</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Төлбөр</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Урамшуулал</Link>
            </div>
          </div>

          {/* Customer care */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-4">
              Тусламж
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Холбоо барих</Link>
              <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Буцаалт</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Нууцлал</Link>
            </div>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-xs font-medium tracking-[0.15em] uppercase text-foreground mb-4">
              Сошиал
            </h4>
            <div className="flex items-center gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube className="w-4 h-4 stroke-[1.5]" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <p className="text-xs text-muted-foreground text-center">
            © 2025 OLIVIN. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
