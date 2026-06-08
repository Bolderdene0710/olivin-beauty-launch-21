import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import productCream from "@/assets/product-cream.jpg";
import { PalmBranchLeft } from "@/components/botanicals/BotanicalSVG";

const SAGE = "#7d9b6e";
const SAGE_DARK = "#5a7a4d";
const SAGE_TINT = "#e8eee2";

const LifestyleBanner = () => {
  return (
    <section className="font-['Roboto'] py-16 md:py-24 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-[32px] grid lg:grid-cols-2 gap-0 shadow-[0_24px_60px_-30px_rgba(90,122,77,0.4)]"
          style={{ background: SAGE_TINT }}
        >
          {/* LEFT — image with overlap */}
          <div className="relative aspect-[5/4] lg:aspect-auto lg:min-h-[520px] overflow-hidden">
            <img
              src={productCream}
              alt="Manai tüükh"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Soft sage tint */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, rgba(125,155,110,0.08) 0%, rgba(125,155,110,0.25) 100%)`,
              }}
            />
            {/* Botanical overlay */}
            <PalmBranchLeft className="absolute -bottom-8 -left-6 opacity-60 mix-blend-multiply" />

            {/* Floating badge */}
            <div className="absolute top-6 left-6">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md"
                style={{ background: "rgba(255,255,255,0.92)" }}
              >
                <Sparkles
                  className="h-3.5 w-3.5"
                  style={{ color: SAGE_DARK }}
                  strokeWidth={2}
                />
                <span
                  className="text-[10px] uppercase tracking-[0.22em] font-medium"
                  style={{ color: SAGE_DARK }}
                >
                  Брэндийн түүх
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — copy */}
          <div className="relative px-7 md:px-10 lg:px-14 py-10 md:py-14 lg:py-16 flex flex-col justify-center">
            <p
              className="text-[11px] uppercase tracking-[0.28em] mb-4 font-medium"
              style={{ color: SAGE_DARK }}
            >
              · Olivin Story
            </p>

            <h2 className="font-serif-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-[1.1] tracking-tight">
              Жижиг ритуал,
              <br />
              <span className="italic font-light text-foreground/75">
                агуу үр дүн.
              </span>
            </h2>

            <p className="text-sm md:text-base text-muted-foreground mt-5 leading-relaxed max-w-md">
              Өглөө бүрийн арьс арчилгаа бол хайр сэтгэлийн жижиг үйлдэл.
              Хүйтэн дөрвөн улирал, хатуу нарны шарлагаас арьсыг хамгаалах
              сонгомол найрлагатай бүтээгдэхүүнүүд.
            </p>

            {/* Highlight chips */}
            <div className="flex flex-wrap gap-2 mt-6">
              {[
                "Цэвэр найрлага",
                "Vegan friendly",
                "Cruelty-free",
                "Дерматологид шалгасан",
              ].map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/70 backdrop-blur-sm"
                  style={{ color: SAGE_DARK, border: `1px solid ${SAGE}33` }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 h-12 px-7 rounded-full text-sm font-medium text-white hover:opacity-95 transition-opacity"
                style={{ background: SAGE_DARK }}
              >
                Манай түүх унших
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  strokeWidth={2}
                />
              </Link>
              <Link
                to="/shop"
                className="text-sm font-medium underline underline-offset-4 hover:opacity-70"
                style={{ color: SAGE_DARK }}
              >
                Цуглуулга үзэх
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LifestyleBanner;
