import { motion } from "framer-motion";
import { Heart, Leaf, SprayCan, ShieldOff } from "lucide-react";
import { PalmBranchLeft, LeafSprigRight } from "@/components/botanicals/BotanicalSVG";

const values = [
  { icon: Heart, label: "Cruelty-Free", desc: "Амьтан дээр туршилт хийгээгүй" },
  { icon: ShieldOff, label: "Sulfate Free", desc: "Сульфатгүй найрлага" },
  { icon: Leaf, label: "Vegan", desc: "100% ургамлын гаралтай" },
  { icon: SprayCan, label: "No Added Fragrance", desc: "Нэмэлт үнэргүй" },
];

const ValuesSection = () => {
  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden bg-background">
      {/* Botanical decorations */}
      <div className="absolute -left-6 -top-10 hidden md:block animate-sway-8 opacity-60">
        <PalmBranchLeft />
      </div>
      <div className="absolute -right-4 bottom-0 hidden md:block animate-sway-13 opacity-60">
        <LeafSprigRight />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm md:text-base font-medium tracking-[0.25em] uppercase text-foreground mb-16"
        >
          ТАНЫ АРЬСАНД ЗӨВ ОРЦЫГ ЗӨВ ХЭМЖЭЭГЭЭР
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left values */}
          <div className="flex flex-col gap-10">
            {values.slice(0, 2).map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center md:text-right"
              >
                <v.icon className="w-8 h-8 stroke-[1.2] text-primary mx-auto md:ml-auto md:mr-0 mb-3" />
                <h3 className="font-medium text-foreground tracking-wide text-sm uppercase">{v.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Center image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <div className="w-56 h-72 md:w-64 md:h-96 bg-secondary rounded-[2rem] overflow-hidden">
              <img
                src="/placeholder.svg"
                alt="Woman applying serum"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Right values */}
          <div className="flex flex-col gap-10">
            {values.slice(2, 4).map((v, i) => (
              <motion.div
                key={v.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <v.icon className="w-8 h-8 stroke-[1.2] text-primary mx-auto md:mr-auto md:ml-0 mb-3" />
                <h3 className="font-medium text-foreground tracking-wide text-sm uppercase">{v.label}</h3>
                <p className="text-sm text-muted-foreground mt-1">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
