import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, UserPlus, Sparkles, ArrowRight } from "lucide-react";
import InfoLayout, { InfoSection, FeatureGrid } from "@/components/InfoLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { useBanners } from "@/hooks/useBanners";

const Promotions = () => {
  // Active promotions are managed by admin as banners
  const { data: banners = [], isLoading } = useBanners();

  return (
    <InfoLayout
      kicker="Урамшуулал"
      title={
        <>
          Одоо <em className="italic text-primary">үргэлжилж</em> буй
        </>
      }
      intro="Хямдрал, шинэ бүтээгдэхүүн болон онцгой саналуудыг энд нэг дороос хараарай."
    >
      <InfoSection title="Идэвхтэй урамшуулал">
        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <Skeleton className="aspect-[16/10] rounded-3xl" />
            <Skeleton className="aspect-[16/10] rounded-3xl" />
          </div>
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center text-center py-12 px-6 rounded-3xl bg-secondary/60">
            <Gift className="w-8 h-8 text-primary" strokeWidth={1.5} />
            <p className="mt-4 font-medium text-foreground">Одоогоор идэвхтэй урамшуулал алга</p>
            <p className="mt-1 text-sm text-muted-foreground">Шинэ урамшууллыг сошиал хуудаснаас маань түрүүлж мэдээрэй.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {banners.map((b, i) => {
              const content = (
                <>
                  <div className="aspect-[16/10] overflow-hidden bg-secondary">
                    <img
                      src={b.image_url}
                      alt={b.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-medium text-foreground">{b.title}</p>
                    {b.subtitle && <p className="mt-1 text-sm text-muted-foreground">{b.subtitle}</p>}
                    {b.button_link && (
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-dark">
                        Үзэх <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </div>
                </>
              );
              const className =
                "group block rounded-3xl overflow-hidden border border-border bg-card hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.3)] transition-shadow";
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  {b.button_link?.startsWith("/") ? (
                    <Link to={b.button_link} className={className}>
                      {content}
                    </Link>
                  ) : b.button_link ? (
                    <a href={b.button_link} target="_blank" rel="noopener noreferrer" className={className}>
                      {content}
                    </a>
                  ) : (
                    <div className={className}>{content}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </InfoSection>

      <InfoSection title="Урамшууллаас хоцрохгүй байх">
        <FeatureGrid
          items={[
            { icon: UserPlus, title: "Бүртгэл үүсгэх", text: "Захиалгаа хянах, хадгалсан бараагаа нэг дороос харах боломжтой." },
            { icon: Sparkles, title: "Шинэ бүтээгдэхүүн", text: "Шинээр ирсэн бараануудыг дэлгүүрийн “Шинэ” хэсгээс хараарай." },
          ]}
        />
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Бүртгүүлэх
          </Link>
          <Link
            to="/shop?filter=new"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-full border border-foreground text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            Шинэ бүтээгдэхүүн
          </Link>
        </div>
      </InfoSection>
    </InfoLayout>
  );
};

export default Promotions;
