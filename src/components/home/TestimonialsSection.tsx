import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Болормаа",
    text: "Olivin-ийн серум миний арьсыг бүрэн өөрчилсөн! Маш гайхалтай чанартай бүтээгдэхүүн.",
    rating: 5,
  },
  {
    name: "Сарантуяа",
    text: "Тонер маш зөөлөн, арьсыг чийгшүүлдэг. Одоо өдөр бүр хэрэглэдэг болсон!",
    rating: 5,
  },
  {
    name: "Нарангэрэл",
    text: "K-Beauty бүтээгдэхүүнүүд дотроос хамгийн шилдэг нь Olivin юм. Найзуудадаа заавал санал болгодог.",
    rating: 5,
  },
  {
    name: "Оюунчимэг",
    text: "Крем нь маш хөнгөн, хурдан шингэдэг. Арьс тод гэрэлтэй болсон!",
    rating: 4,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 md:py-28 px-4 bg-gradient-to-b from-pastel-lilac/30 to-pastel-peach/20 relative overflow-hidden">
      <div className="absolute top-0 right-[20%] w-48 h-48 rounded-full bg-pastel-pink/20 blur-[80px]" />
      <div className="absolute bottom-0 left-[15%] w-56 h-56 rounded-full bg-pastel-mint/15 blur-[80px]" />

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl md:text-6xl uppercase text-foreground">
            ХЭРЭГЛЭГЧДИЙН СЭТГЭГДЭЛ
          </h2>
          <p className="text-muted-foreground mt-3 text-lg">
            OLIVIN FANS CAN'T STOP TALKING!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -1 : 1 }}
              whileInView={{ opacity: 1, y: 0, rotate: i % 2 === 0 ? -1 : 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card rounded-3xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star
                    key={j}
                    className="w-5 h-5 fill-pastel-yellow text-pastel-yellow"
                  />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-4">{review.text}</p>
              <p className="font-display text-sm uppercase text-muted-foreground tracking-wider">
                — {review.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
