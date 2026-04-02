import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { Star, ShoppingCart, Minus, Plus, Home, Truck, Shield, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";
import { fetchProductWithVariants, type ProductVariant } from "@/lib/supabase";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";

const PLACEHOLDER_IMAGE = "/placeholder.svg";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Fetch product with variants using manual API
  const { data: rawProduct, isLoading, error } = useQuery({
    queryKey: ["product-with-variants", id],
    queryFn: () => fetchProductWithVariants(id!),
    enabled: !!id,
  });

  const { data: allProducts } = useProducts();

  // Group variants by type
  const variantsByType = useMemo(() => {
    if (!rawProduct?.product_variants?.length) return {};
    const groups: Record<string, ProductVariant[]> = {};
    for (const v of rawProduct.product_variants) {
      const type = v.variant_type || "Сонголт";
      if (!groups[type]) groups[type] = [];
      groups[type].push(v);
    }
    return groups;
  }, [rawProduct]);

  // Calculate displayed price
  const basePrice = rawProduct?.price ?? 0;
  const adjustment = selectedVariant?.price_adjustment ?? 0;
  const displayPrice = basePrice + adjustment;
  const formattedPrice = `${displayPrice.toLocaleString()}₮`;

  // Map to frontend product shape for related products filtering
  const product = rawProduct
    ? {
        id: rawProduct.id,
        name: rawProduct.title,
        brand: rawProduct.brand,
        price: formattedPrice,
        image: rawProduct.image_url || PLACEHOLDER_IMAGE,
        images: rawProduct.images || [],
        category: rawProduct.category,
        description: rawProduct.description || "",
        ingredients: rawProduct.ingredients || [],
        howToUse: rawProduct.how_to_use || "",
        benefits: rawProduct.benefits || [],
        badges: rawProduct.badges || [],
        reviews: [] as { id: number; author: string; rating: number; date: string; comment: string }[],
      }
    : null;

  const relatedProducts = allProducts
    ?.filter((p) => p.id !== id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!product || !rawProduct) return;

    const cartId = selectedVariant ? `${rawProduct.id}_${selectedVariant.id}` : rawProduct.id;
    const cartName = selectedVariant
      ? `${product.name} (${selectedVariant.variant_name})`
      : product.name;

    for (let i = 0; i < quantity; i++) {
      addItem({
        id: cartId,
        name: cartName,
        price: formattedPrice,
        image: product.image,
      });
    }

    toast({
      title: "Сагсанд нэмэгдлээ",
      description: `${cartName} (${quantity}ш) таны сагсанд нэмэгдлээ.`,
    });
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"
          }`}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 md:py-12">
          <Skeleton className="h-5 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-12 w-full max-w-md" />
              <Skeleton className="h-10 w-36" />
              <Skeleton className="h-24 w-full" />
              <div className="flex gap-4 pt-6">
                <Skeleton className="h-16 w-40" />
                <Skeleton className="h-16 flex-1" />
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
            <h1 className="text-3xl font-bold text-foreground">Бүтээгдэхүүн олдсонгүй</h1>
            <p className="text-muted-foreground">Уучлаарай, энэ бүтээгдэхүүн олдсонгүй.</p>
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
          <BreadcrumbList className="text-sm">
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                  <Home className="w-3.5 h-3.5" />
                  <span>Нүүр</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground/50" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  Дэлгүүр
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-muted-foreground/50" />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[180px] truncate font-medium text-foreground">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Left - Image */}
          <div className="w-full">
            <div className="aspect-square w-full max-w-xl mx-auto lg:max-w-none rounded-3xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted border border-border/50 shadow-2xl shadow-primary/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain p-6 transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>

          {/* Right - Info */}
          <div className="flex flex-col lg:py-4">
            {/* Brand */}
            <span className="inline-block text-xs text-primary/80 uppercase tracking-[0.25em] font-semibold mb-3">
              {product.brand || "OLIVIN BEAUTY"}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-5">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mb-6">
              <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {formattedPrice}
              </span>
              {selectedVariant && selectedVariant.price_adjustment !== 0 && (
                <span className="ml-3 text-sm text-muted-foreground line-through">
                  {basePrice.toLocaleString()}₮
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed text-base mb-6 max-w-lg">
              {product.description && product.description.trim() !== ""
                ? product.description
                : "Энэ бүтээгдэхүүний дэлгэрэнгүй тайлбар удахгүй нэмэгдэнэ."}
            </p>

            {/* Variant Selectors */}
            {Object.keys(variantsByType).length > 0 && (
              <div className="mb-8 space-y-4">
                {Object.entries(variantsByType).map(([type, variants]) => (
                  <div key={type}>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      {type}
                      {selectedVariant && variants.some(v => v.id === selectedVariant.id) && (
                        <span className="ml-2 text-primary font-normal">— {selectedVariant.variant_name}</span>
                      )}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => {
                        const isSelected = selectedVariant?.id === variant.id;
                        const isOutOfStock = variant.stock_quantity <= 0;
                        return (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(isSelected ? null : variant)}
                            disabled={isOutOfStock}
                            className={`
                              px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200
                              ${isSelected
                                ? "border-primary bg-primary/10 text-primary shadow-sm"
                                : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-muted/50"
                              }
                              ${isOutOfStock ? "opacity-40 cursor-not-allowed line-through" : "cursor-pointer"}
                            `}
                          >
                            {variant.variant_name}
                            {variant.price_adjustment > 0 && (
                              <span className="ml-1 text-xs text-muted-foreground">+{variant.price_adjustment.toLocaleString()}₮</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="mb-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <ul className="space-y-2">
                  {product.benefits.slice(0, 3).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary text-xs font-bold">✓</span>
                      </span>
                      <span className="text-foreground/80">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 mb-8">
              <div className="flex items-center border-2 border-border rounded-2xl bg-background overflow-hidden">
                <button
                  onClick={decrementQuantity}
                  className="p-4 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Тоо хэмжээ хасах"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-8 py-4 font-bold text-xl min-w-[80px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-4 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  aria-label="Тоо хэмжээ нэмэх"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Button
                size="lg"
                className="flex-1 text-base gap-3 h-16 rounded-2xl font-bold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.02]"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-5 h-5" />
                Сагсанд нэмэх
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Хүргэлттэй</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Баталгаат</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground font-medium">Буцаалттай</span>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Details */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-xl font-bold text-foreground mb-6">Дэлгэрэнгүй мэдээлэл</h2>
          <Accordion type="multiple" className="w-full space-y-3" defaultValue={["description"]}>
            <AccordionItem value="description" className="border border-border/50 rounded-2xl px-6 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline">
                Тайлбар
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground leading-relaxed">
                {product.description && product.description.trim() !== ""
                  ? product.description
                  : "Энэ бүтээгдэхүүний тайлбар одоогоор байхгүй байна."}
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mt-5">
                    <p className="font-medium text-foreground mb-3">Давуу талууд:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <span className="text-primary font-bold">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="ingredients" className="border border-border/50 rounded-2xl px-6 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline">
                Найрлага
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                {product.ingredients && product.ingredients.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-primary/10 text-primary/90 rounded-full text-sm font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Найрлагын мэдээлэл одоогоор байхгүй.</p>
                )}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="howToUse" className="border border-border/50 rounded-2xl px-6 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline">
                Хэрэглэх заавар
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.howToUse && product.howToUse.trim() !== ""
                  ? product.howToUse
                  : "Хэрэглэх зааврын мэдээлэл одоогоор байхгүй."}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reviews" className="border border-border/50 rounded-2xl px-6 data-[state=open]:bg-muted/30">
              <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline">
                Сэтгэгдэл ({product.reviews?.length || 0})
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-4">
                    {product.reviews.map((review) => (
                      <div key={review.id} className="p-4 bg-background rounded-xl border border-border/50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-foreground">{review.author}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.date).toLocaleDateString("mn-MN")}
                            </p>
                          </div>
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-muted-foreground text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Одоогоор сэтгэгдэл алга байна.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Танд таалагдаж магадгүй</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} id={p.id} image={p.image} name={p.name} brand={p.brand} price={p.price} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Mobile Sticky Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t border-border lg:hidden z-50">
        <div className="container mx-auto flex items-center gap-3">
          <div className="flex items-center border-2 border-border rounded-xl bg-background">
            <button onClick={decrementQuantity} className="p-3 hover:bg-muted transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 font-bold min-w-[40px] text-center">{quantity}</span>
            <button onClick={incrementQuantity} className="p-3 hover:bg-muted transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <Button
            size="lg"
            className="flex-1 gap-2 h-14 rounded-xl font-bold shadow-lg shadow-primary/20"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{formattedPrice}</span>
          </Button>
        </div>
      </div>

      <div className="h-24 lg:hidden" />
      <Footer />
    </div>
  );
};

export default ProductDetail;
