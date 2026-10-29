import { ShieldCheck, Truck, Wallet, Heart } from "lucide-react";
import InfoLayout, { InfoSection, FeatureGrid, InfoLink } from "@/components/InfoLayout";
import { STORE_POLICY } from "@/lib/storeInfo";

const About = () => (
  <InfoLayout
    kicker="Бидний тухай"
    title={
      <>
        Сөүлээс <em className="italic text-primary">таны арьсанд</em>
      </>
    }
    intro="OLIVIN нь Солонгосын жинхэнэ арьс арчилгааны бүтээгдэхүүнийг Монголын хэрэглэгчдэд итгэлтэй, хялбараар хүргэх онлайн дэлгүүр юм."
  >
    <InfoSection title="Бидний зорилго">
      <p>
        Бид Солонгосын шилдэг арьс арчилгааны бүтээгдэхүүнийг Монголд хүргэж, хэрэглэгч бүр өөрийн арьсанд
        тохирохыг итгэлтэй сонгох боломжийг бүрдүүлэхийг зорьдог. Зөвхөн 100% жинхэнэ, чанартай бүтээгдэхүүн
        санал болгоно.
      </p>
    </InfoSection>

    <InfoSection title="Бид юугаараа ялгардаг вэ?">
      <FeatureGrid
        items={[
          { icon: ShieldCheck, title: "100% жинхэнэ", text: "Солонгосын албан ёсны борлуулагчдаас шууд авч ирдэг." },
          { icon: Truck, title: "Хурдан хүргэлт", text: `Улаанбаатарт ${STORE_POLICY.deliveryCity}, орон нутагт ${STORE_POLICY.deliveryCountryside}.` },
          { icon: Wallet, title: "Хялбар төлбөр", text: "Дансаар шилжүүлээд захиалгаа онлайнаар хянана." },
          { icon: Heart, title: "Найдвартай үйлчилгээ", text: "Хэрэглэгчийн сэтгэл ханамж бидний тэргүүлэх зорилт." },
        ]}
      />
    </InfoSection>

    <InfoSection title="Бидний түүх">
      <p>
        OLIVIN-ийг K-Beauty-д дурлагсад хамтдаа үүсгэн байгуулсан. Бид Солонгосын арьс арчилгааны соёлыг Монголд
        түгээж, хүн бүрт гоо сайхны шилдэг бүтээгдэхүүнийг хүргэхийг зорьдог.
      </p>
      <InfoLink to="/shop">Бүтээгдэхүүн үзэх</InfoLink>
    </InfoSection>
  </InfoLayout>
);

export default About;
