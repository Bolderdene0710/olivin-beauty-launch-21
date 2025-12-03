import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="border-t border-background/20 pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1 - Introduction */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                ТАНИЛЦУУЛГА
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/about" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Бидний тухай
                  </Link>
                </li>
                <li>
                  <Link to="/careers" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Ажлын анкет
                  </Link>
                </li>
                <li>
                  <Link to="/delivery" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Хүргэлт
                  </Link>
                </li>
                <li>
                  <Link to="/gift-cards" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Бэлгийн карт
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 - Help */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                ТУСЛАМЖ
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/privacy" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Нууцлал
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Түгээмэл асуулт, хариулт
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Үйлчилгээний нөхцөл
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="text-background/70 hover:text-primary transition-colors text-sm">
                    Бараа буцаалтын журам
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 - Contact */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                ХОЛБОО БАРИХ
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-background/70 text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>7700-8686</span>
                </li>
                <li className="flex items-center gap-2 text-background/70 text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href="mailto:marketing@zayabilgee.mn" className="hover:text-primary transition-colors">
                    marketing@zayabilgee.mn
                  </a>
                </li>
                <li className="flex items-start gap-2 text-background/70 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Parkside, Ulaanbaatar 11000, Mongolia</span>
                </li>
              </ul>
            </div>

            {/* Column 4 - Locations */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider mb-4">
                САЛБАРЫН БАЙРШИЛ
              </h4>
              <Link 
                to="/locations" 
                className="inline-flex items-center gap-2 text-background/70 hover:text-primary transition-colors text-sm"
              >
                <MapPin className="w-4 h-4" />
                Салбарын байршил харах
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-foreground/90 border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-xs text-background/50">
            © 2025 Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
