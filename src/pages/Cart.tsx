import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const formatPrice = (price: string): number => {
  return parseFloat(price.replace(/[^0-9.]/g, "").replace(/,/g, "")) || 0;
};

const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString()}₮`;
};

const Cart = () => {
  const { items, removeItem, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingThreshold = 50000;
  const isFreeShipping = cartTotal >= shippingThreshold;
  const remainingForFree = shippingThreshold - cartTotal;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-muted/50 flex items-center justify-center">
              <ShoppingBag className="w-14 h-14 text-muted-foreground/60" />
            </div>
            <h1 className="text-3xl font-bold mb-3 text-foreground">Сагс хоосон байна</h1>
            <p className="text-muted-foreground mb-8">
              Бүтээгдэхүүн нэмж сагсаа дүүргээрэй.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/shop")}
              className="rounded-full px-8 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Дэлгүүр үзэх
            </Button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Миний сагс</h1>
          <p className="text-muted-foreground mb-8">{items.length} бүтээгдэхүүн</p>
        </motion.div>

        {/* Free shipping progress */}
        {!isFreeShipping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-2xl bg-primary/5 border border-primary/10"
          >
            <p className="text-sm text-foreground/80 mb-2">
              🚚 Үнэгүй хүргэлт авахын тулд{" "}
              <span className="font-bold text-primary">{formatCurrency(remainingForFree)}</span>{" "}
              дутуу байна
            </p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((cartTotal / shippingThreshold) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => {
                const itemPrice = formatPrice(item.price);
                const itemTotal = itemPrice * item.quantity;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group rounded-2xl border border-border/50 bg-card p-5 hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex gap-5">
                      {/* Image */}
                      <div
                        className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-muted/30 flex-shrink-0 cursor-pointer"
                        onClick={() => navigate(`/product/${item.id.split("_")[0]}`)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base md:text-lg text-foreground mb-1 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-primary font-bold text-lg mb-3">
                          {formatCurrency(itemPrice)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border-2 border-border rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-bold text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-muted transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right flex-shrink-0 hidden sm:block">
                        <p className="font-bold text-lg text-foreground">
                          {formatCurrency(itemTotal)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {item.quantity} x {formatCurrency(itemPrice)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                onClick={() => navigate("/shop")}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4" />
                Дэлгүүр рүү буцах
              </Button>
              <Button
                variant="ghost"
                onClick={clearCart}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Сагс хоослох
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl border border-border/50 bg-card p-6 sticky top-24 shadow-sm"
            >
              <h2 className="text-xl font-bold mb-6 text-foreground">Захиалгын дүн</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Нийт дүн</span>
                  <span className="font-medium text-foreground">{formatCurrency(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Хүргэлт</span>
                  <span className={`font-medium ${isFreeShipping ? "text-primary" : "text-foreground"}`}>
                    {isFreeShipping ? "Үнэгүй 🎉" : "5,000₮"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Нийт төлөх</span>
                  <span className="text-primary">
                    {formatCurrency(isFreeShipping ? cartTotal : cartTotal + 5000)}
                  </span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full mb-3 rounded-xl h-14 text-base font-bold gap-2"
                onClick={() => navigate("/checkout")}
              >
                Захиалга өгөх
                <ArrowRight className="w-5 h-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-xl"
                onClick={() => navigate("/shop")}
              >
                Дэлгүүр үзэх
              </Button>

              {isFreeShipping && (
                <p className="text-center text-xs text-primary mt-4 font-medium">
                  ✅ Үнэгүй хүргэлтэд хамрагдлаа!
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
