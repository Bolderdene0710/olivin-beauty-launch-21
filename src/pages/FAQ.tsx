import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Захиалга хэрхэн өгөх вэ?",
    answer: "Та манай вэбсайтаас хүссэн бүтээгдэхүүнээ сонгон сагсанд хийж, төлбөрөө шилжүүлснээр захиалга өгөх боломжтой. Захиалга баталгаажсаны дараа бид тантай холбогдох болно."
  },
  {
    question: "Хүргэлт хэр удаан үргэлжлэх вэ?",
    answer: "Улаанбаатар хотод 1-3 өдөрт хүргэлт хийгдэнэ. Орон нутагт 3-7 өдөр шаардлагатай. Захиалга баталгаажсаны дараа хүргэлтийн хугацаа эхэлнэ."
  },
  {
    question: "Төлбөр хэрхэн төлөх вэ?",
    answer: "Бид банкны шилжүүлгээр төлбөр хүлээн авдаг. Захиалга хийсний дараа дансны мэдээлэл танд илгээгдэх болно. Төлбөр баталгаажсаны дараа захиалга боловсруулагдана."
  },
  {
    question: "Бүтээгдэхүүн буцаах боломжтой юу?",
    answer: "Тийм, хүлээн авснаас хойш 7 хоногийн дотор буцаах боломжтой. Бүтээгдэхүүн задлагдаагүй, анхны төрхөөрөө байх шаардлагатай. Буцаалтын хүсэлтээ манай утсаар эсвэл и-мэйлээр илгээнэ үү."
  },
  {
    question: "Бүтээгдэхүүн жинхэнэ эсэхийг яаж мэдэх вэ?",
    answer: "Бид зөвхөн Солонгосын албан ёсны борлуулагчдаас бүтээгдэхүүн авч ирдэг. Бүх бүтээгдэхүүн 100% жинхэнэ бөгөөд баталгаатай."
  },
  {
    question: "Захиалгаа хэрхэн хянах вэ?",
    answer: "Захиалга хийсний дараа танд захиалгын дугаар илгээгдэнэ. Тэр дугаараар манай вэбсайтын \"Захиалга хянах\" хэсгээс өөрийн захиалгын явцыг хянах боломжтой."
  },
  {
    question: "Хямдралын код хэрхэн ашиглах вэ?",
    answer: "Төлбөр тооцооны үед хямдралын код оруулах талбарт кодоо бичнэ үү. Хямдрал автоматаар тооцогдоно."
  },
  {
    question: "Холбоо барих хамгийн хурдан арга юу вэ?",
    answer: "Манай 7700-8686 дугаарт залгах эсвэл info@olivin.mn хаягаар и-мэйл илгээх нь хамгийн хурдан арга юм. Ажлын өдрүүдэд 09:00-18:00 цагийн хооронд бид таны дуудлагад хариулна."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/20 py-12 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Түгээмэл асуулт, хариулт
            </h1>
            <p className="text-muted-foreground">
              Хэрэглэгчдээс ирдэг түгээмэл асуултуудад хариулав
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact CTA */}
            <div className="mt-12 text-center p-8 bg-accent/30 rounded-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Асуултаа олсонгүй юу?
              </h2>
              <p className="text-muted-foreground mb-4">
                Бидэнтэй холбогдоорой, бид танд туслахад бэлэн
              </p>
              <p className="text-sm text-muted-foreground">
                Утас: <span className="text-foreground">7700-8686</span> | И-мэйл: <span className="text-foreground">info@olivin.mn</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
