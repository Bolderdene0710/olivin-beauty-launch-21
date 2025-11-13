import ProductCard from "./ProductCard";
import productSerum from "@/assets/product-serum.jpg";
import productToner from "@/assets/product-toner.jpg";
import productCream from "@/assets/product-cream.jpg";

const products = [
  {
    id: 1,
    image: productSerum,
    name: "Dive-In Low Molecular Hyaluronic Acid Serum",
    brand: "Torriden",
    price: "89,000₮",
  },
  {
    id: 2,
    image: productToner,
    name: "1025 Dokdo Toner",
    brand: "Round Lab",
    price: "79,000₮",
  },
  {
    id: 3,
    image: productCream,
    name: "Ceramide Ato Concentrate Cream",
    brand: "Illiyoon",
    price: "69,000₮",
  },
];

const BestSellers = () => {
  return (
    <section id="best-sellers" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Best Sellers
          </h2>
          <p className="text-xl text-muted-foreground">
            Our most loved K-Beauty essentials
          </p>
        </div>
        
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
      
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default BestSellers;
