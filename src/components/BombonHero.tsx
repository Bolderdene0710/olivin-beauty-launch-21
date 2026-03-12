import floatingSerum from "@/assets/floating-serum.png";
import floatingCream from "@/assets/floating-cream.png";
import floatingToner from "@/assets/floating-toner.png";
import floatingMask from "@/assets/floating-mask.png";
import floatingSunscreen from "@/assets/floating-sunscreen.png";
import floatingAmpoule from "@/assets/floating-ampoule.png";
import floatingLiptint from "@/assets/floating-liptint.png";
import floatingLeaf from "@/assets/floating-leaf.png";

const products = [
  { src: floatingSerum, alt: "Serum bottle", className: "top-[12%] left-[6%] w-20 md:w-32 animate-float-1" },
  { src: floatingCream, alt: "Cream jar", className: "top-[8%] right-[10%] w-18 md:w-28 animate-float-2" },
  { src: floatingToner, alt: "Toner bottle", className: "top-[40%] left-[2%] w-16 md:w-24 animate-float-3" },
  { src: floatingAmpoule, alt: "Ampoule", className: "bottom-[35%] right-[4%] w-16 md:w-26 animate-float-4" },
  { src: floatingMask, alt: "Sheet mask", className: "top-[18%] left-[42%] w-14 md:w-22 animate-float-5" },
  { src: floatingLiptint, alt: "Lip tint", className: "bottom-[28%] left-[12%] w-16 md:w-24 animate-float-2" },
  { src: floatingSunscreen, alt: "Sunscreen", className: "top-[55%] right-[12%] w-14 md:w-20 animate-float-1" },
  { src: floatingLeaf, alt: "Aloe leaf", className: "top-[5%] left-[28%] w-12 md:w-20 animate-float-4" },
  { src: floatingSerum, alt: "Serum bottle", className: "bottom-[22%] right-[35%] w-12 md:w-18 animate-float-3 opacity-60" },
  { src: floatingCream, alt: "Cream jar", className: "top-[65%] left-[55%] w-10 md:w-16 animate-float-5 opacity-50" },
];

const BombonHero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center px-4">
      {/* Floating Product Elements */}
      {products.map((product, i) => (
        <div
          key={i}
          className={`absolute pointer-events-none select-none z-10 drop-shadow-xl ${product.className}`}
          style={{ opacity: 0 }}
        >
          <img
            src={product.src}
            alt={product.alt}
            className="w-full h-auto object-contain"
            draggable={false}
          />
        </div>
      ))}

      {/* Main Headline */}
      <div className="relative z-20 text-center max-w-6xl mx-auto pt-20">
        <h1 className="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] uppercase text-foreground tracking-tight">
          OLIVIN
        </h1>
        <h1 className="font-display text-[clamp(3rem,12vw,10rem)] leading-[0.9] uppercase text-foreground tracking-tight">
          BEAUTY
        </h1>

        <p className="mt-8 md:mt-12 text-base md:text-xl font-medium text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          In the land of Olivin, beauty holds the crown. Experience the elegance
          of Korean skincare in its purest form.
        </p>
      </div>

      {/* Bottom Product Mockup Area */}
      <div className="relative z-20 mt-12 md:mt-20 flex flex-col items-center">
        <div className="relative w-48 h-64 md:w-64 md:h-80 rounded-3xl bg-gradient-to-b from-primary to-primary-dark shadow-2xl flex items-center justify-center transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500">
          <div className="text-center px-4">
            <span className="font-display text-2xl md:text-3xl text-primary-foreground uppercase tracking-wider">
              OLIVIN
            </span>
            <div className="mt-2 text-xs md:text-sm text-primary-foreground/80 font-medium">
              K-Beauty Box
            </div>
            <div className="mt-4">
              <img src={floatingSerum} alt="Serum" className="w-16 md:w-20 mx-auto drop-shadow-lg" />
            </div>
          </div>
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        </div>

        {/* Shop Now badge */}
        <div className="absolute -bottom-4 -right-8 md:right-[-60px] w-20 h-20 md:w-24 md:h-24 rounded-full bg-accent flex items-center justify-center transform rotate-12 shadow-lg hover:rotate-0 transition-transform duration-300 cursor-pointer">
          <span className="font-display text-xs md:text-sm text-accent-foreground uppercase text-center leading-tight">
            shop<br />NOW
          </span>
        </div>
      </div>

      {/* Fog / Cloud Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-40 md:h-60 z-30 pointer-events-none">
        <div className="absolute bottom-0 left-[-10%] w-[120%] h-full bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute bottom-4 left-[10%] w-64 h-20 bg-primary-light/30 rounded-full blur-3xl animate-fog" />
        <div className="absolute bottom-8 right-[15%] w-48 h-16 bg-primary/20 rounded-full blur-3xl animate-fog" style={{ animationDelay: '3s' }} />
      </div>

      {/* Music Note Badge */}
      <div className="fixed bottom-6 left-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-foreground flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg">
        <span className="text-background text-lg md:text-xl">♪</span>
      </div>

      {/* Side Bar */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-primary w-8 md:w-10 h-32 md:h-40 rounded-l-lg flex items-center justify-center cursor-pointer hover:w-12 transition-all shadow-lg">
        <span className="font-display text-xs md:text-sm text-primary-foreground uppercase tracking-widest" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          K-Beauty
        </span>
      </div>
    </section>
  );
};

export default BombonHero;
