import { useState } from "react";
import { Building2, QrCode, MapPin, Truck, Copy, Check } from "lucide-react";
import InfoLayout, { InfoSection, FeatureGrid, Steps, InfoLink } from "@/components/InfoLayout";
import { STORE_BANK, STORE_POLICY } from "@/lib/storeInfo";

const Payment = () => {
  const [copied, setCopied] = useState(false);

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(STORE_BANK.accountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable — the number is still visible to copy manually.
    }
  };

  return (
    <InfoLayout
      kicker="Төлбөр ба хүргэлт"
      title={
        <>
          Хялбар төлж, <em className="italic text-primary">хурдан</em> аваарай
        </>
      }
      intro="Захиалгаа хийгээд дансаар шилжүүлэхэд л хангалттай. Төлбөр баталгаажмагц бид хүргэлтэнд гаргана."
    >
      <InfoSection title="Захиалга хэрхэн явагддаг вэ?">
        <Steps
          steps={[
            { title: "Сагсандаа нэмээд захиална", text: "Хүргэлтийн хаягаа оруулж захиалгаа баталгаажуулна." },
            { title: "Дансаар шилжүүлнэ", text: "Гүйлгээний утга дээр захиалгын дугаараа заавал бичнэ." },
            { title: "Төлбөр баталгаажна", text: "Бид шалгаад захиалгыг баталгаажуулна. Төлөв нь сайт дээр шууд шинэчлэгдэнэ." },
            { title: "Хүргэлтээр очно", text: "Захиалгын дугаараараа хаана явааг хянах боломжтой." },
          ]}
        />
      </InfoSection>

      <InfoSection title="Төлбөрийн арга">
        <div className="rounded-3xl border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 bg-secondary/60">
            <Building2 className="w-5 h-5 text-primary-dark" strokeWidth={1.7} />
            <p className="font-medium text-foreground">Дансаар шилжүүлэх</p>
          </div>
          <dl className="divide-y divide-border/70 text-sm">
            {[
              ["Банк", STORE_BANK.bank],
              ["Дансны нэр", STORE_BANK.accountName],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 px-5 py-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-foreground">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-5 py-3">
              <dt className="text-muted-foreground">Дансны дугаар</dt>
              <dd>
                <button
                  onClick={copyAccount}
                  className="inline-flex items-center gap-2 font-mono font-medium text-foreground hover:text-primary-dark"
                >
                  {STORE_BANK.accountNumber}
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                </button>
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border px-5 py-4">
          <QrCode className="w-5 h-5 mt-0.5 text-muted-foreground shrink-0" strokeWidth={1.7} />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">QPay</span> — тун удахгүй нэмэгдэнэ.
          </p>
        </div>
      </InfoSection>

      <InfoSection title="Хүргэлт" id="delivery">
        <FeatureGrid
          items={[
            { icon: Truck, title: "Улаанбаатар хот", text: `Захиалга баталгаажсанаас хойш ${STORE_POLICY.deliveryCity}.` },
            { icon: MapPin, title: "Орон нутаг", text: `Захиалга баталгаажсанаас хойш ${STORE_POLICY.deliveryCountryside}.` },
          ]}
        />
        <p className="text-sm text-muted-foreground">Хүргэлтийн хугацаа төлбөр баталгаажсан өдрөөс эхэлж тоологдоно.</p>
        <InfoLink to="/track-order">Захиалгаа хянах</InfoLink>
      </InfoSection>
    </InfoLayout>
  );
};

export default Payment;
