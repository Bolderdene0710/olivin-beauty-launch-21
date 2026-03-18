import { useState, useEffect } from "react";
import { useBanners } from "@/hooks/useBanners";
import { X } from "lucide-react";

const AnnouncementBar = () => {
  const { data: banners = [] } = useBanners();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (dismissed || banners.length === 0) return null;

  const banner = banners[currentIndex];

  return (
    <div className="bg-foreground text-background text-center py-2 px-4 text-xs tracking-[0.15em] uppercase relative">
      {banner.link ? (
        <a href={banner.link} className="hover:underline">
          {banner.title}{banner.subtitle ? ` — ${banner.subtitle}` : ""}
        </a>
      ) : (
        <span>{banner.title}{banner.subtitle ? ` — ${banner.subtitle}` : ""}</span>
      )}
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-70"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default AnnouncementBar;
