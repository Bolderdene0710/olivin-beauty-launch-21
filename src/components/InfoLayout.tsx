import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { STORE_CONTACT } from "@/lib/storeInfo";

const INFO_PAGES = [
  { to: "/about", label: "Бидний тухай" },
  { to: "/payment", label: "Төлбөр ба хүргэлт" },
  { to: "/promotions", label: "Урамшуулал" },
  { to: "/returns", label: "Буцаалт" },
  { to: "/privacy", label: "Нууцлал" },
  { to: "/contact", label: "Холбоо барих" },
  { to: "/faq", label: "Түгээмэл асуулт" },
];

interface InfoLayoutProps {
  kicker: string;
  title: React.ReactNode;
  intro?: string;
  children: React.ReactNode;
}

const InfoLayout = ({ kicker, title, intro, children }: InfoLayoutProps) => (
  <div className="min-h-screen flex flex-col bg-background">
    <Header />

    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(var(--sage-light)/0.45),transparent_55%),radial-gradient(ellipse_at_bottom_right,hsl(30_60%_88%/0.5),transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto px-4 md:px-8 pt-12 pb-10 md:pt-16 md:pb-14">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs font-medium tracking-[0.2em] uppercase text-primary-dark"
        >
          {kicker}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-3 font-serif-display text-4xl md:text-6xl font-light tracking-tight leading-[1.05] text-foreground"
        >
          {title}
        </motion.h1>
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </section>

    <main className="flex-1 max-w-6xl w-full mx-auto px-4 md:px-8 py-8 md:py-14">
      <div className="grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-14 items-start">
        <nav className="lg:sticky lg:top-36 flex lg:flex-col gap-1 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 [scrollbar-width:none]">
          {INFO_PAGES.map((p) => (
            <NavLink
              key={p.to}
              to={p.to}
              className={({ isActive }) =>
                `shrink-0 px-4 py-2.5 rounded-full lg:rounded-xl text-sm transition-colors ${
                  isActive
                    ? "bg-foreground text-background font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`
              }
            >
              {p.label}
            </NavLink>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="min-w-0 max-w-3xl"
        >
          {children}

          {/* Help CTA */}
          <div className="mt-14 rounded-3xl bg-foreground text-background p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
            <div className="flex-1">
              <p className="font-serif-display text-2xl font-light">Асуулт байна уу?</p>
              <p className="mt-1 text-sm text-background/70">{STORE_CONTACT.hours} бид хариулна.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={STORE_CONTACT.phoneHref}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-background text-foreground text-sm font-medium hover:bg-primary-light transition-colors"
              >
                <Phone className="w-4 h-4" /> {STORE_CONTACT.phone}
              </a>
              <a
                href={`mailto:${STORE_CONTACT.email}`}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-background/30 text-sm font-medium hover:bg-background/10 transition-colors"
              >
                <Mail className="w-4 h-4" /> Имэйл
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </main>

    <Footer />
  </div>
);

/* ---------- Shared content blocks ---------- */

export const InfoSection = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => (
  <section id={id} className="scroll-mt-40 py-8 first:pt-0 border-b border-border/60 last:border-0">
    <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{title}</h2>
    <div className="space-y-4 text-[15px] leading-[1.8] text-foreground/80">{children}</div>
  </section>
);

interface FeatureItem {
  icon: typeof ArrowRight;
  title: string;
  text: string;
}

export const FeatureGrid = ({ items }: { items: FeatureItem[] }) => (
  <div className="grid sm:grid-cols-2 gap-3">
    {items.map(({ icon: Icon, title, text }) => (
      <div key={title} className="rounded-3xl bg-secondary/60 p-5">
        <span className="w-10 h-10 rounded-2xl bg-background flex items-center justify-center shadow-sm">
          <Icon className="w-5 h-5 text-primary-dark" strokeWidth={1.7} />
        </span>
        <p className="mt-4 font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{text}</p>
      </div>
    ))}
  </div>
);

export const Steps = ({ steps }: { steps: { title: string; text: string }[] }) => (
  <ol className="space-y-5">
    {steps.map((s, i) => (
      <li key={s.title} className="relative flex gap-4">
        {i < steps.length - 1 && <span className="absolute left-[15px] top-9 bottom-[-20px] w-px bg-border" aria-hidden />}
        <span className="relative h-8 w-8 shrink-0 rounded-full bg-foreground text-background text-sm font-semibold flex items-center justify-center">
          {i + 1}
        </span>
        <div className="pt-0.5">
          <p className="font-medium text-foreground">{s.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
        </div>
      </li>
    ))}
  </ol>
);

export const InfoLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Link to={to} className="inline-flex items-center gap-1 font-medium text-primary-dark underline underline-offset-4 hover:text-foreground">
    {children} <ArrowRight className="w-3.5 h-3.5" />
  </Link>
);

export default InfoLayout;
