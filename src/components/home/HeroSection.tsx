import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FloatingShapes from "./FloatingShapes";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Dreamy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pastel-lilac via-pastel-peach/40 to-pastel-mint/30" />

      {/* Slow floating blobs */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-pastel-pink/30 rounded-full blur-[120px] animate-blob" />
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-pastel-mint/40 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      <div className="absolute top-[40%] right-[30%] w-64 h-64 bg-pastel-yellow/30 rounded-full blur-[80px] animate-blob animation-delay-4000" />

      <FloatingShapes />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.5rem,10vw,8rem)] leading-[0.95] uppercase text-foreground tracking-tight"
        >
          OLIVIN K-BEAUTY
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(2.5rem,10vw,8rem)] leading-[0.95] uppercase text-foreground tracking-tight"
        >
          WONDERLAND
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 md:mt-10 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto font-medium"
        >
          OLIVIN ГОО САЙХНЫ ЕРТӨНЦ
        </motion.p>

        {/* Floating badge with pulse glow */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 12 }}
          transition={{ duration: 0.6, delay: 0.6, type: "spring", stiffness: 200 }}
          className="absolute -right-4 md:right-[5%] top-[10%] md:top-[15%]"
        >
          <Link
            to="/shop"
            className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-pastel-lime flex items-center justify-center shadow-xl cursor-pointer block transition-transform duration-300 hover:scale-110 animate-pulse-glow"
          >
            <span className="font-display text-sm md:text-base text-foreground uppercase text-center leading-tight">
              SHOP<br />NOW ✨
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
