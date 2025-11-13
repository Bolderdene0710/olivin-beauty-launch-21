import ProductCard from "./ProductCard";
import { products } from "@/data/products";

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
            <ProductCard 
              key={product.id} 
              id={product.id}
              image={product.image}
              name={product.name}
              brand={product.brand}
              price={product.price}
            />
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
