import { Phone, Mail, Clock, PackageSearch } from "lucide-react";
import { Link } from "react-router-dom";
import InfoLayout, { InfoSection } from "@/components/InfoLayout";
import { STORE_CONTACT } from "@/lib/storeInfo";

const channels = [
  { icon: Phone, label: "Утас", value: STORE_CONTACT.phone, href: STORE_CONTACT.phoneHref, note: "Хамгийн хурдан арга" },
  { icon: Mail, label: "Имэйл", value: STORE_CONTACT.email, href: `mailto:${STORE_CONTACT.email}`, note: "Буцаалт, асуулт" },
];

const Contact = () => (
  <InfoLayout
    kicker="Холбоо барих"
    title={
      <>
        Бид <em className="italic text-primary">туслахад</em> бэлэн
      </>
    }
    intro="Захиалга, бүтээгдэхүүн, буцаалтын талаар асуух зүйл байвал бидэнтэй холбогдоорой."
  >
    <InfoSection title="Холбогдох суваг">
      <div className="grid sm:grid-cols-2 gap-3">
        {channels.map(({ icon: Icon, label, value, href, note }) => (
          <a
            key={label}
            href={href}
            className="group rounded-3xl border border-border p-5 hover:border-foreground/30 hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.35)] transition-all"
          >
            <span className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-dark" strokeWidth={1.7} />
            </span>
            <p className="mt-4 text-xs text-muted-foreground">{label} · {note}</p>
            <p className="mt-1 text-lg font-medium text-foreground group-hover:text-primary-dark transition-colors break-all">
              {value}
            </p>
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-5 py-4">
        <Clock className="w-5 h-5 text-primary-dark shrink-0" strokeWidth={1.7} />
        <p className="text-sm">
          <span className="font-medium text-foreground">Ажлын цаг:</span>{" "}
          <span className="text-muted-foreground">{STORE_CONTACT.hours}</span>
        </p>
      </div>
    </InfoSection>

    <InfoSection title="Захиалгын талаар асуух уу?">
      <p>Захиалгынхаа төлөвийг захиалгын дугаараараа шууд шалгах боломжтой.</p>
      <Link
        to="/track-order"
        className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        <PackageSearch className="w-4 h-4" /> Захиалга хянах
      </Link>
    </InfoSection>
  </InfoLayout>
);

export default Contact;
