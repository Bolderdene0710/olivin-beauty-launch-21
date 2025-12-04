import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
          {/* Breadcrumb Skeleton */}
          <Skeleton className="h-5 w-64 mb-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Skeleton */}
            <Skeleton className="aspect-square rounded-xl" />

            {/* Info Skeleton */}
            <div className="space-y-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-12 w-40" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-4">
                <Skeleton className="h-14 w-32" />
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
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  Нүүр
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/shop">Дэлгүүр</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Section - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Product Image */}
          <div className="sticky top-24">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted border border-border shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6 lg:space-y-8">
            {/* Brand & Title */}
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mb-2">
                {product.brand}
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <p className="text-3xl md:text-4xl font-bold text-primary">
              {product.price}
            </p>

            {/* Short Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed text-base">
                {product.description}
              </p>
            )}

            {/* Benefits */}
            {product.benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">Үндсэн давуу талууд:</h3>
                <ul className="space-y-2">
                  {product.benefits.slice(0, 4).map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">✓</span>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {/* Quantity Selector */}
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  className="p-4 hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-6 py-4 font-semibold text-lg min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-4 hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className="flex-1 text-lg gap-2 h-14 rounded-xl"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Сагсанд нэмэх
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent p-0 h-auto mb-8 overflow-x-auto">
              <TabsTrigger
                value="description"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-base"
              >
                Тайлбар
              </TabsTrigger>
              {product.ingredients.length > 0 && (
                <TabsTrigger
                  value="ingredients"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-base"
                >
                  Найрлага
                </TabsTrigger>
              )}
              {product.howToUse && (
                <TabsTrigger
                  value="howToUse"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-base"
                >
                  Хэрэглэх заавар
                </TabsTrigger>
              )}
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-6 py-4 text-base"
              >
                Сэтгэгдэл ({product.reviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <Card className="p-6 md:p-8 rounded-xl">
                <p className="text-muted-foreground leading-relaxed text-base">
                  {product.description || "Тайлбар байхгүй байна."}
                </p>
                {product.benefits.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-foreground mb-4">
                      Бүх давуу талууд:
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">✓</span>
                          <span className="text-muted-foreground">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="ingredients" className="mt-0">
              <Card className="p-6 md:p-8 rounded-xl">
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="howToUse" className="mt-0">
              <Card className="p-6 md:p-8 rounded-xl">
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
                  {product.howToUse}
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              {product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <Card key={review.id} className="p-6 rounded-xl">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">
                            {review.author}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(review.date).toLocaleDateString("mn-MN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 rounded-xl text-center">
                  <p className="text-muted-foreground">
                    Одоогоор сэтгэгдэл алга байна.
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
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
        <div className="container mx-auto flex items-center gap-4">
          <div className="flex items-center border border-border rounded-xl overflow-hidden">
            <button
              onClick={decrementQuantity}
              className="p-3 hover:bg-muted transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-semibold min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              className="p-3 hover:bg-muted transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <Button
            size="lg"
            className="flex-1 gap-2 h-12 rounded-xl"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            Сагсанд нэмэх - {product.price}
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
