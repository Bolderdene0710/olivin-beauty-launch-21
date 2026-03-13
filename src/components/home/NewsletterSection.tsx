import { motion } from "framer-motion";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({ title: "Амжилттай!", description: "Та мэдээллийн жагсаалтад бүртгэгдлээ." });
      setEmail("");
    }
  };

  return (
    <section className="py-24 md:py-32 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-pastel-mint/20 to-transparent" />
      
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl uppercase text-foreground leading-tight"
        >
          ШИНЭ МЭДЭЭЛЭЛ АВАХ
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-muted-foreground mt-4 text-lg"
        >
          THE GLOWING NEWS EVER!
        </motion.p>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSubmit}
          className="mt-10 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Имэйл хаягаа оруулна уу..."
            className="flex-1 px-6 py-4 rounded-full bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            required
          />
          <button
            type="submit"
            className="px-8 py-4 rounded-full bg-foreground text-background font-display uppercase tracking-wider text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 shadow-md"
          >
            БҮРТГҮҮЛЭХ
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default NewsletterSection;
