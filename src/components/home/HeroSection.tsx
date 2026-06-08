import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-skincare.jpg";
import { LeafSprigRight, SmallLeaf } from "@/components/botanicals/BotanicalSVG";
import { useBanners } from "@/hooks/useBanners";

const SAGE = "#7d9b6e";
const SAGE_DARK = "#5a7a4d";
const SAGE_TINT = "#e8eee2";
const CREAM = "#f5f5f3";

const DEFAULT_TITLE_LINES = ["Натурал", "гоо сайхны", "амьдрал."];
const DEFAULT_SUBTITLE =
  "Байгалийн гаралтай, тансаг чанартай K-Beauty бүтээгдэхүүнүүд таны арьсыг сэргээх, гэрэлтүүлэхийн төлөө.";
const DEFAULT_LINK = "/shop";
const ROTATE_MS = 6000;

const HeroSection = () => {
  const { data: banners = [] } = useBanners();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (banners.length <= 1) {
      setActiveIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % banners.length);
    }, ROTATE_MS);
    return () => clearInterval(interval);
  }, [banners.length]);

  const banner = banners[activeIdx];
  const titleLines = banner?.title
    ? banner.title.split("\n").map((s) => s.trim()).filter(Boolean)
    : DEFAULT_TITLE_LINES;
  const subtitle = banner?.subtitle || DEFAULT_SUBTITLE;
  const ctaLink = banner?.button_link || DEFAULT_LINK;
  const portraitImage = banner?.image_url || heroImage;
  const isExternal = /^https?:\/\//i.test(ctaLink);

  return (
    <section
      className="relative overflow-hidden font-['Roboto']"
      style={{ background: CREAM }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT — text */}
          <div className="lg:col-span-7 relative">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: "white", border: `1px solid ${SAGE_TINT}` }}
            >
              <Leaf
                className="h-3.5 w-3.5"
                style={{ color: SAGE }}
                strokeWidth={2}
              />
              <span
                className="text-[11px] uppercase tracking-[0.22em] font-medium"
                style={{ color: SAGE_DARK }}
              >
                Olivin · since 2026
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${activeIdx}-${titleLines.join("|")}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
                className="font-serif-display text-5xl md:text-6xl lg:text-7xl text-foreground leading-[1.05] tracking-tight"
              >
                {titleLines.length === 3 ? (
                  <>
                    {titleLines[0]}
                    <br />
                    <span className="italic font-light text-foreground/70">
                      {titleLines[1]}
                    </span>
                    <br />
                    <span style={{ color: SAGE_DARK }}>{titleLines[2]}</span>
                  </>
                ) : titleLines.length === 2 ? (
                  <>
                    {titleLines[0]}
                    <br />
                    <span style={{ color: SAGE_DARK }}>{titleLines[1]}</span>
                  </>
                ) : (
                  <span style={{ color: SAGE_DARK }}>{titleLines[0]}</span>
                )}
              </motion.h1>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`subtitle-${activeIdx}-${subtitle}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-base md:text-lg text-muted-foreground mt-7 leading-relaxed max-w-md"
              >
                {subtitle}
              </motion.p>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 mt-9"
            >
              {isExternal ? (
                <a
                  href={ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 h-12 px-7 rounded-full text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(125,155,110,0.6)] hover:opacity-95 transition-opacity"
                  style={{ background: SAGE }}
                >
                  Дэлгүүр үзэх
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </a>
              ) : (
                <Link
                  to={ctaLink}
                  className="group inline-flex items-center gap-2 h-12 px-7 rounded-full text-sm font-medium text-white shadow-[0_8px_24px_-8px_rgba(125,155,110,0.6)] hover:opacity-95 transition-opacity"
                  style={{ background: SAGE }}
                >
                  Дэлгүүр үзэх
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2}
                  />
                </Link>
              )}
              <Link
                to="/about"
                className="inline-flex items-center gap-2 h-12 px-7 rounded-full text-sm font-medium border bg-white hover:bg-[#fafaf9] transition-colors"
                style={{ borderColor: SAGE_TINT, color: SAGE_DARK }}
              >
                Манай түүх
              </Link>
            </motion.div>

            {banners.length > 1 && (
              <div className="flex gap-2 mt-6">
                {banners.map((b, i) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveIdx(i)}
                    aria-label={`Banner ${i + 1}`}
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: activeIdx === i ? 28 : 8,
                      background: activeIdx === i ? SAGE_DARK : "rgba(0,0,0,0.18)",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="grid grid-cols-3 gap-6 mt-12 max-w-md"
            >
              {[
                { num: "50+", label: "K-Beauty брэнд" },
                { num: "100%", label: "Албан ёсны" },
                { num: "24ц", label: "Хүргэлт" },
              ].map(({ num, label }) => (
                <div key={label}>
                  <div
                    className="text-2xl md:text-3xl font-semibold"
                    style={{ color: SAGE_DARK }}
                  >
                    {num}
                  </div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>

            <SmallLeaf className="absolute -bottom-6 -left-6 opacity-40 hidden lg:block" />
          </div>

          {/* RIGHT — portrait card */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative aspect-[3/4] lg:aspect-[4/5] rounded-[28px] overflow-hidden shadow-[0_24px_60px_-20px_rgba(90,122,77,0.35)]"
            >
              {/* Image */}
              <AnimatePresence mode="wait">
                <motion.img
                  key={`hero-img-${activeIdx}-${portraitImage}`}
                  src={portraitImage}
                  alt={banner?.title || "Olivin K-Beauty"}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.7 }}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = heroImage;
                  }}
                />
              </AnimatePresence>

              {/* Sage gradient wash */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, rgba(90,122,77,0.05) 0%, rgba(90,122,77,0) 35%, rgba(90,122,77,0.55) 100%)`,
                }}
              />

              {/* Top wordmark */}
              <div className="absolute top-5 left-5 right-5 flex items-start justify-between">
                <div
                  className="px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] uppercase tracking-[0.25em] font-medium"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    color: SAGE_DARK,
                  }}
                >
                  Olivin · est. 2026
                </div>
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center backdrop-blur-md"
                  style={{ background: "rgba(255,255,255,0.85)" }}
                >
                  <Leaf
                    className="h-4 w-4"
                    style={{ color: SAGE_DARK }}
                    strokeWidth={2}
                  />
                </div>
              </div>

              {/* Botanical accent overlapping the card */}
              <LeafSprigRight className="absolute -top-4 -right-6 opacity-70 mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
