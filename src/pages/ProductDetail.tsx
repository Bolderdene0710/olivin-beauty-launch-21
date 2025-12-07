import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Star, ShoppingCart, Minus, Plus, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProductById, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useProductById(id || "");
  const { data: allProducts } = useProducts();

  // Get 4 random related products (excluding current product)
  const relatedProducts = allProducts
    ?.filter((p) => p.id !== id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }

    toast({
      title: "Сагсанд нэмэгдлээ",
      description: `${product.name} (${quantity}ш) таны сагсанд нэмэгдлээ.`,
    });
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-12">
          <Skeleton className="h-5 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full max-w-md" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-20 w-full" />
              <div className="flex gap-4 pt-4">
                <Skeleton className="h-14 w-36" />
                <Skeleton className="h-14 flex-1" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">
              Бүтээгдэхүүн олдсонгүй
            </h1>
            <p className="text-muted-foreground">
              Уучлаарай, энэ бүтээгдэхүүн олдсонгүй.
            </p>
            <Button onClick={() => navigate("/shop")} size="lg">
              Дэлгүүр рүү буцах
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 md:py-10">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-6 md:mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
                  <Home className="w-4 h-4" />
                  <span>Нүүр</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/shop" className="text-muted-foreground hover:text-foreground">
                  Дэлгүүр
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate text-foreground">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Section - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
          {/* Left Column - Product Image */}
          <div className="w-full">
            <div className="aspect-square w-full max-w-lg mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-muted shadow-lg border border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="flex flex-col space-y-5">
            {/* Brand */}
            <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-medium">
              {product.brand || "OLIVIN BEAUTY"}
            </p>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl md:text-3xl font-bold text-primary">
              {product.price}
            </p>

            {/* Description */}
            <div className="py-2">
              <p className="text-muted-foreground leading-relaxed">
                {product.description && product.description.trim() !== ""
                  ? product.description
                  : "Энэ бүтээгдэхүүний тайлбар одоогоор байхгүй байна."}
              </p>
            </div>

            {/* Benefits Preview */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-2 py-2">
                <p className="text-sm font-semibold text-foreground">Давуу талууд:</p>
                <ul className="space-y-1.5">
                  {product.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary font-bold">✓</span>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-center border border-border rounded-xl bg-background">
                <button
                  onClick={decrementQuantity}
                  className="p-4 hover:bg-muted transition-colors rounded-l-xl"
                  aria-label="Тоо хэмжээ хасах"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-4 font-semibold text-lg min-w-[60px] text-center border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-4 hover:bg-muted transition-colors rounded-r-xl"
                  aria-label="Тоо хэмжээ нэмэх"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="flex-1 text-base gap-2 h-14 rounded-xl font-semibold"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Сагсанд нэмэх
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <div className="mb-12 lg:mb-16 max-w-3xl">
          <Accordion type="multiple" className="w-full" defaultValue={["description"]}>
            {/* Description */}
            <AccordionItem value="description" className="border-b border-border">
              <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline">
                Тайлбар
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description && product.description.trim() !== ""
                    ? product.description
                    : "Энэ бүтээгдэхүүний тайлбар одоогоор байхгүй байна."}
                </p>
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-foreground mb-2">Бүх давуу талууд:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-bold">✓</span>
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Ingredients */}
            <AccordionItem value="ingredients" className="border-b border-border">
              <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline">
                Найрлага
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                {product.ingredients && product.ingredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-accent text-accent-foreground rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Найрлагын мэдээлэл одоогоор байхгүй байна.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* How to Use */}
            <AccordionItem value="howToUse" className="border-b border-border">
              <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline">
                Хэрэглэх заавар
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.howToUse && product.howToUse.trim() !== ""
                    ? product.howToUse
                    : "Хэрэглэх зааврын мэдээлэл одоогоор байхгүй байна."}
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Reviews */}
            <AccordionItem value="reviews" className="border-b border-border">
              <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline">
                Сэтгэгдэл ({product.reviews?.length || 0})
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-muted/50 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">
                              {review.author}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString("mn-MN", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Одоогоор сэтгэгдэл алга байна.
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mb-12 lg:mb-16">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
              Танд таалагдаж магадгүй
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  image={p.image}
                  name={p.name}
                  brand={p.brand}
                  price={p.price}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky Add to Cart on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border lg:hidden z-50">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex items-center border border-border rounded-xl bg-background">
            <button
              onClick={decrementQuantity}
              className="p-3 hover:bg-muted transition-colors"
              aria-label="Тоо хэмжээ хасах"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-semibold min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="p-3 hover:bg-muted transition-colors"
              aria-label="Тоо хэмжээ нэмэх"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <Button
            size="lg"
            className="flex-1 gap-2 h-12 rounded-xl font-semibold"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Нэмэх</span>
            <span className="font-bold">{product.price}</span>
          </Button>
        </div>
      </div>

      {/* Spacer for sticky footer on mobile */}
      <div className="h-24 lg:hidden" />

      <Footer />
    </div>
  );
};

export default ProductDetail;
