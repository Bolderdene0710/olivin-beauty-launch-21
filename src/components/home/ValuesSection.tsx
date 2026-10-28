import { motion } from "framer-motion";
import { ShieldCheck, Truck, Wallet, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-skincare.jpg";

// Store-level promises (kept in sync with the ProductDetail trust strip).
// Avoid per-product claims like "vegan" here — we sell many brands.
const promises = [
  { icon: ShieldCheck, label: "100% жинхэнэ", desc: "Солонгосын албан ёсны нийлүүлэгчээс шууд" },
  { icon: Truck, label: "Хурдан хүргэлт", desc: "Улаанбаатар даяар 1–3 өдөрт" },
  { icon: Wallet, label: "Хялбар төлбөр", desc: "Дансаар шилжүүлээд захиалгаа онлайн хянана" },
  { icon: RefreshCw, label: "7 хоногт буцаалт", desc: "Худалдан авснаас хойш 7 хоногийн дотор" },
];

const ValuesSection = () => {
  return (
    <section className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] max-h-[560px] w-full rounded-[2rem] overflow-hidden bg-secondary"
        >
          <img src={heroImage} alt="" loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-background/85 backdrop-blur px-5 py-4">
            <p className="font-serif-display text-xl text-foreground">
              Сөүлээс <em className="italic text-primary">таны арьсанд</em>
            </p>
            <p className="text-xs text-muted-foreground mt-1">K-Beauty-г Монголд итгэлтэйгээр</p>
          </div>
        </motion.div>

        <div>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-medium tracking-[0.2em] uppercase text-primary-dark"
          >
            Яагаад OLIVIN гэж?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-serif-display text-3xl md:text-5xl font-light tracking-tight leading-[1.1] text-foreground mt-3"
          >
            Итгэлтэй сонгож, <em className="italic text-primary">хялбар</em> захиал
          </motion.h2>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            {promises.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-3xl bg-secondary/60 p-5"
              >
                <span className="w-10 h-10 rounded-2xl bg-background flex items-center justify-center shadow-sm">
                  <p.icon className="w-5 h-5 text-primary-dark" strokeWidth={1.6} />
                </span>
                <h3 className="mt-4 font-medium text-foreground">{p.label}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          <Link
            to="/faq"
            className="mt-8 inline-flex text-sm font-medium text-primary-dark underline underline-offset-4 hover:text-foreground"
          >
            Хүргэлт, төлбөр, буцаалтын нөхцөл →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
