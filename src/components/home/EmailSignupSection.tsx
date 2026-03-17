import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import HollowCircle from "@/components/botanicals/HollowCircles";

const EmailSignupSection = () => {
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && agreed) {
      toast({ title: "Амжилттай!", description: "Та мэдээллийн жагсаалтад бүртгэгдлээ." });
      setEmail("");
      setAgreed(false);
    }
  };

  return (
    <section className="bg-secondary relative overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
        {/* Left: Form */}
        <div className="flex items-center px-8 md:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <h2 className="font-serif-display text-3xl md:text-4xl font-light text-foreground leading-snug">
              Reveal Your Skin's
              <br />
              <span className="italic">Radiance.</span>
            </h2>

            <form onSubmit={handleSubmit} className="mt-8">
              <div className="flex border border-border bg-background rounded-md overflow-hidden">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Имэйл хаягаа оруулна уу"
                  className="flex-1 px-4 py-3 text-sm bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowRight className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <label className="flex items-start gap-2 mt-4 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 rounded border-border"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  Би нууцлалын бодлогыг зөвшөөрч, шинэ мэдээлэл авахыг хүсэж байна.
                </span>
              </label>
            </form>
          </motion.div>
        </div>

        {/* Right: Decorative */}
        <div className="hidden md:flex items-center justify-center relative">
          <HollowCircle size={180} className="absolute top-12 right-20" speed="slow" />
          <HollowCircle size={60} className="absolute bottom-20 left-16" speed="fast" />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative z-10"
          >
            <div className="w-56 h-72 bg-background/50 rounded-2xl overflow-hidden shadow-sm">
              <img
                src="/placeholder.svg"
                alt="Serum product"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmailSignupSection;
