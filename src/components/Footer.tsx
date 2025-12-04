import { useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    toast({
      title: "Бүртгэгдлээ!",
      description: "Мэдээлэл авах жагсаалтад нэмэгдлээ.",
    });
    setEmail("");
  };

  return (
    <footer className="bg-secondary/50 border-t border-border">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Olivin Beauty
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Бид танд Солонгосын хамгийн шилдэг, чанартай гоо сайхны бүтээгдэхүүнийг албан ёсны эрхтэйгээр хүргэж байна.
            </p>
            <div className="flex flex-col space-y-2 pt-2">
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Бидний тухай
              </Link>
              <Link
                to="/shop"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Брэндүүд
              </Link>
            </div>
          </div>

          {/* Column 2: Help */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Тусламж
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                to="/faq"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Түгээмэл асуулт
              </Link>
              <Link
                to="/delivery"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Хүргэлтийн нөхцөл
              </Link>
              <Link
                to="/returns"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Буцаах журам
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Нууцлалын бодлого
              </Link>
            </div>
          </div>

          {/* Column 3: Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Холбоо барих
            </h3>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">7700-8686</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">info@olivin.mn</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Улаанбаатар хот, Сүхбаатар дүүрэг, Parkside
                </span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
              Мэдээлэл авах
            </h3>
            <p className="text-sm text-muted-foreground">
              Шинэ бүтээгдэхүүн, хямдралын мэдээллийг цаг алдалгүй аваарай.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="И-мэйл хаяг"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 text-sm bg-background"
              />
              <Button type="submit" size="sm" className="h-10 px-4">
                Бүртгүүлэх
              </Button>
            </form>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-4">
          <p className="text-xs text-muted-foreground text-center">
            © 2025 Olivin Beauty. Бүх эрх хуулиар хамгаалагдсан.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
