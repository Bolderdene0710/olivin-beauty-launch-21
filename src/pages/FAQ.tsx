import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";
import { useFaqs } from "@/hooks/useFaqs";

const FAQ = () => {
  const { data: faqs = [], isLoading } = useFaqs();

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
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                Одоогоор асуулт нэмэгдээгүй байна.
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="bg-card border border-border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            {/* Contact CTA */}
            <div className="mt-12 text-center p-8 bg-accent/30 rounded-2xl">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Асуултаа олсонгүй юу?
              </h2>
              <p className="text-muted-foreground mb-4">
                Бидэнтэй холбогдоорой, бид танд туслахад бэлэн
              </p>
              <p className="text-sm text-muted-foreground">
                Утас: <span className="text-foreground">7700-8686</span> | И-мэйл:{" "}
                <span className="text-foreground">info@olivin.mn</span>
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
