import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const categories = [
  { name: "TONERS", mongolian: "ТОНЕР", bg: "bg-pastel-pink", link: "/shop?category=Toners" },
  { name: "SERUMS", mongolian: "СЕРУМ", bg: "bg-pastel-mint", link: "/shop?category=Serums" },
  { name: "CREAMS", mongolian: "ТОСОН КРЕМ", bg: "bg-pastel-yellow", link: "/shop?category=Creams" },
];

const CategoriesSection = () => {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-6xl uppercase text-center mb-12 md:mb-16 text-foreground"
        >
          THE REALMS
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link
                to={cat.link}
                className={`${cat.bg} rounded-3xl p-10 md:p-14 flex flex-col items-center justify-center min-h-[280px] md:min-h-[360px] group hover:scale-[1.03] transition-transform duration-300 shadow-lg hover:shadow-2xl block`}
              >
                <span className="font-display text-5xl md:text-7xl text-foreground uppercase">
                  {cat.name}
                </span>
                <span className="text-sm text-muted-foreground mt-2 font-medium">
                  {cat.mongolian}
                </span>
                <span className="mt-8 px-8 py-3 bg-foreground text-background rounded-full font-display text-sm uppercase tracking-wider group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  SHOP NOW
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
