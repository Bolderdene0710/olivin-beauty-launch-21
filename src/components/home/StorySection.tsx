import { motion } from "framer-motion";

const StorySection = () => {
  return (
    <section className="py-24 md:py-36 px-4 relative overflow-hidden">
      {/* Floating accent shapes */}
      <div className="absolute top-10 right-[10%] w-32 h-32 rounded-full bg-pastel-pink/20 blur-[60px]" />
      <div className="absolute bottom-10 left-[8%] w-40 h-40 rounded-full bg-pastel-mint/20 blur-[60px]" />

      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl uppercase text-foreground leading-tight"
        >
          In the land of Olivin,
          <br />
          <span className="text-primary">glowing skin</span> holds the crown.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Солонгос арьс арчилгааны гайхамшгийг эндээс олоорой.
          Байгалийн гаралтай, тансаг чанартай бүтээгдэхүүнүүд таны арьсыг
          гэрэлтүүлнэ.
        </motion.p>
      </div>
    </section>
  );
};

export default StorySection;
