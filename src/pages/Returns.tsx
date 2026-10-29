import { PackageCheck, PackageX } from "lucide-react";
import InfoLayout, { InfoSection, Steps } from "@/components/InfoLayout";
import { STORE_CONTACT, STORE_POLICY } from "@/lib/storeInfo";

const Returns = () => (
  <InfoLayout
    kicker="Буцаалт"
    title={
      <>
        {STORE_POLICY.returnDays} хоногт <em className="italic text-primary">буцаах</em> боломжтой
      </>
    }
    intro={`Бүтээгдэхүүнээ хүлээн авснаас хойш ${STORE_POLICY.returnDays} хоногийн дотор буцаах хүсэлт гаргах боломжтой.`}
  >
    <InfoSection title="Буцаах нөхцөл">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-3xl bg-primary/[0.07] border border-primary/20 p-5">
          <PackageCheck className="w-6 h-6 text-primary-dark" strokeWidth={1.6} />
          <p className="mt-3 font-medium text-foreground">Буцаах боломжтой</p>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/80 list-disc pl-4">
            <li>Хүлээн авснаас хойш {STORE_POLICY.returnDays} хоногийн дотор</li>
            <li>Задлагдаагүй, анхны төрхөөрөө</li>
          </ul>
        </div>
        <div className="rounded-3xl bg-secondary/60 p-5">
          <PackageX className="w-6 h-6 text-muted-foreground" strokeWidth={1.6} />
          <p className="mt-3 font-medium text-foreground">Буцаах боломжгүй</p>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/80 list-disc pl-4">
            <li>Задалсан эсвэл хэрэглэсэн бүтээгдэхүүн</li>
            <li>{STORE_POLICY.returnDays} хоногийн хугацаа хэтэрсэн</li>
          </ul>
        </div>
      </div>
    </InfoSection>

    <InfoSection title="Буцаах алхам">
      <Steps
        steps={[
          {
            title: "Бидэнтэй холбогдоно",
            text: `${STORE_CONTACT.phone} дугаарт залгах эсвэл ${STORE_CONTACT.email} хаягаар захиалгын дугаараа бичиж илгээнэ.`,
          },
          { title: "Хүсэлтийг шалгана", text: "Бид нөхцөлийг шалгаад буцаах заавар өгнө." },
          { title: "Бүтээгдэхүүнээ хүлээлгэн өгнө", text: "Бүтээгдэхүүн хүлээн авсны дараа буцаалтыг шийдвэрлэнэ." },
        ]}
      />
    </InfoSection>
  </InfoLayout>
);

export default Returns;
