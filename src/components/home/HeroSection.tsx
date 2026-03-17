import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HollowCircle from "@/components/botanicals/HollowCircles";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-stretch overflow-hidden">
      {/* Left: Text */}
      <div className="relative flex-1 flex items-center px-8 md:px-16 lg:px-24 py-20 bg-background">
        {/* Decorative circles */}
        <HollowCircle size={140} className="absolute top-16 right-12 hidden md:block" speed="slow" />
        <HollowCircle size={60} className="absolute bottom-32 right-24 hidden md:block" speed="fast" />
        <HollowCircle size={80} className="absolute top-1/2 right-4 hidden md:block" speed="normal" />

        <div className="max-w-lg relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-serif-display text-4xl md:text-5xl font-light text-muted-foreground italic"
          >
            The
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-7xl md:text-8xl lg:text-9xl font-semibold tracking-tight text-foreground leading-[0.9] mt-1"
          >
            OLIVIN.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-serif-display text-xl md:text-2xl text-muted-foreground mt-6 font-light"
          >
            Солонгосын Гоо Сайхны Ертөнц
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-sm text-muted-foreground mt-4 leading-relaxed max-w-sm"
          >
            Байгалийн гаралтай, тансаг чанартай K-Beauty бүтээгдэхүүнүүд таны арьсыг гэрэлтүүлнэ. Зөвхөн албан ёсны эрхтэй бүтээгдэхүүнүүд.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          >
            <Link
              to="/shop"
              className="inline-block mt-8 px-8 py-3 border border-foreground text-foreground text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
            >
              Дэлгэрэнгүй
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Right: Product Image */}
      <div className="hidden md:flex flex-1 items-center justify-center bg-secondary relative">
        <HollowCircle size={200} className="absolute top-20 left-10" speed="slow" />
        <HollowCircle size={50} className="absolute bottom-24 right-16" speed="fast" />

        {/* Product display pedestal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 flex flex-col items-center"
        >
          <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-background shadow-lg flex items-center justify-center">
            <img
              src="/placeholder.svg"
              alt="Featured product"
              className="w-3/4 h-3/4 object-contain"
            />
          </div>
          <div className="w-72 lg:w-88 h-4 bg-background/60 rounded-full blur-md mt-4" />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
