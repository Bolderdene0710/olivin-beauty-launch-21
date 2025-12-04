import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-primary/20 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Olivin Beauty
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Монголд K-Beauty бүтээгдэхүүн худалдаалагч
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="space-y-12">
              {/* Mission */}
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Бидний зорилго
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Olivin Beauty нь Солонгосын шилдэг арьс арчилгааны бүтээгдэхүүнүүдийг 
                  Монголын хэрэглэгчдэд хүргэх зорилготой. Бид зөвхөн 100% жинхэнэ, 
                  чанартай бүтээгдэхүүнүүдийг санал болгодог.
                </p>
              </div>

              {/* Values */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-2xl bg-accent/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Жинхэнэ бүтээгдэхүүн
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Бүх бүтээгдэхүүн шууд Солонгосоос ирдэг
                  </p>
                </div>

                <div className="text-center p-6 rounded-2xl bg-accent/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">🚚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Хурдан хүргэлт
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Улаанбаатар хотод түргэн шуурхай хүргэлт
                  </p>
                </div>

                <div className="text-center p-6 rounded-2xl bg-accent/30">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl">💚</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Найдвартай үйлчилгээ
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Хэрэглэгчийн сэтгэл ханамж бидний тэргүүлэх зорилт
                  </p>
                </div>
              </div>

              {/* Story */}
              <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Бидний түүх
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Olivin Beauty нь K-Beauty-д дурлагсад хамтдаа үүсгэн байгуулсан. 
                  Бид Солонгосын арьс арчилгааны соёлыг Монголд түгээж, хүн бүрт 
                  гоо сайхны шилдэг бүтээгдэхүүнийг хүргэхийг зорьдог.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
