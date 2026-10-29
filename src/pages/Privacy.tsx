import InfoLayout, { InfoSection } from "@/components/InfoLayout";
import { STORE_CONTACT } from "@/lib/storeInfo";

const Privacy = () => (
  <InfoLayout
    kicker="Нууцлал"
    title={
      <>
        Таны мэдээлэл <em className="italic text-primary">хамгаалагдсан</em>
      </>
    }
    intro="Бид захиалгыг тань хүргэхэд шаардлагатай мэдээллийг л цуглуулж, түүнийг хамгаалалттайгаар хадгална."
  >
    <InfoSection title="Ямар мэдээлэл цуглуулдаг вэ?">
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Бүртгэлийн мэдээлэл: имэйл хаяг, хэрэглэгчийн нэр</li>
        <li>Захиалгын мэдээлэл: овог нэр, утасны дугаар, хүргэлтийн хаяг, захиалсан бүтээгдэхүүн</li>
        <li>Таны хадгалсан (♥) бүтээгдэхүүний жагсаалт</li>
      </ul>
      <p>Бид таны банкны карт эсвэл дансны нууц мэдээллийг хадгалдаггүй — төлбөрийг та өөрийн банкаар шилжүүлдэг.</p>
    </InfoSection>

    <InfoSection title="Мэдээллийг юунд ашигладаг вэ?">
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Захиалгыг боловсруулж, хүргэх</li>
        <li>Захиалгын төлөвийн талаар танд мэдээлэх</li>
        <li>Дараагийн захиалгад таны мэдээллийг автоматаар бөглөх</li>
      </ul>
      <p>Бид таны мэдээллийг гуравдагч этгээдэд худалдахгүй.</p>
    </InfoSection>

    <InfoSection title="Таны эрх">
      <p>
        Та өөрийн мэдээллийг профайл хэсгээс хүссэн үедээ засах боломжтой. Бүртгэлээ устгуулах эсвэл мэдээллийн
        талаар асуух бол{" "}
        <a href={`mailto:${STORE_CONTACT.email}`} className="font-medium text-primary-dark underline underline-offset-4">
          {STORE_CONTACT.email}
        </a>{" "}
        хаягаар холбогдоно уу.
      </p>
    </InfoSection>
  </InfoLayout>
);

export default Privacy;
