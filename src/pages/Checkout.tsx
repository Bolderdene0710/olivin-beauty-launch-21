import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createManualOrder, fetchOrderByNumber, supabase } from "@/lib/supabase";
import { Mail, Phone, MapPin, User, ShoppingBag, ChevronLeft, Shield, CheckCircle2, Tag, X, Loader2 } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState("");
  const [checkingPromo, setCheckingPromo] = useState(false);

  const discount = appliedPromo?.discount ?? 0;
  const payableTotal = Math.max(cartTotal - discount, 0);

  // The database decides validity and the amount; this is only a preview.
  // The order trigger recomputes the same discount when the order is placed.
  const checkPromo = async (code: string, subtotal: number) => {
    const { data, error } = await supabase.rpc("check_promo_code", { p_code: code, p_subtotal: subtotal });
    if (error) throw error;
    return data as { valid: boolean; code?: string; discount?: number; message?: string };
  };

  const handleApplyPromo = async () => {
    const code = promoInput.trim();
    if (!code) return;
    setCheckingPromo(true);
    setPromoError("");
    try {
      const result = await checkPromo(code, cartTotal);
      if (result.valid && result.code) {
        setAppliedPromo({ code: result.code, discount: Number(result.discount) || 0 });
        setPromoInput("");
      } else {
        setAppliedPromo(null);
        setPromoError(result.message || "Промо код хүчингүй");
      }
    } catch {
      setPromoError("Шалгахад алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setCheckingPromo(false);
    }
  };

  // Percentage codes depend on the cart total, so refresh the preview when it changes
  useEffect(() => {
    if (!appliedPromo || cartTotal <= 0) return;
    let active = true;
    checkPromo(appliedPromo.code, cartTotal)
      .then((result) => {
        if (!active) return;
        if (result.valid && result.code) {
          setAppliedPromo({ code: result.code, discount: Number(result.discount) || 0 });
        } else {
          setAppliedPromo(null);
          setPromoError(result.message || "Промо код хүчингүй болсон");
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartTotal]);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    detailedAddress: "",
    city: "",
    district: "",
    khoroo: "",
    phoneNumber: "",
  });

  // Prefill from logged-in user's session + profile
  useEffect(() => {
    let active = true;
    const prefillFromSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active || !session?.user) return;

      const email = session.user.email ?? "";
      setIsLoggedIn(true);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone_number, home_address")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!active) return;

      const parts = (profile?.full_name ?? "").trim().split(/\s+/).filter(Boolean);
      const surname = parts[0] ?? "";
      const givenName = parts.slice(1).join(" ");

      setFormData((prev) => ({
        ...prev,
        email: prev.email || email,
        firstName: prev.firstName || surname,
        lastName: prev.lastName || givenName,
        phoneNumber: prev.phoneNumber || (profile?.phone_number ?? ""),
        detailedAddress:
          prev.detailedAddress || (profile?.home_address ?? ""),
      }));
    };

    prefillFromSession();
    return () => {
      active = false;
    };
  }, []);

  const mongolianDistricts = [
    "Баянзүрх",
    "Сүхбаатар",
    "Хан-Уул",
    "Баянгол",
    "Сонгинохайрхан",
    "Чингэлтэй",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    if (items.length === 0 && !showPaymentModal) {
      navigate("/cart");
    }
  }, [items.length, showPaymentModal, navigate]);

  const handleSubmit = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.district || !formData.khoroo || !formData.detailedAddress) {
      toast({ title: "Бүх талбарыг бөглөнө үү", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      // Order number doubles as the guest lookup key, so make it hard to guess.
      const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => b.toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase();
      const newOrderNumber = `ORD${Date.now().toString(36).toUpperCase()}${randomPart}`;
      const snapshotTotal = payableTotal;

      await createManualOrder({
        order_number: newOrderNumber,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        phone_number: formData.phoneNumber,
        district: formData.district,
        khoroo: formData.khoroo,
        detailed_address: formData.detailedAddress,
        total_amount: snapshotTotal,
        promo_code: appliedPromo?.code ?? null,
        status: "pending",
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price.replace(/[^0-9.]/g, "")),
          quantity: item.quantity,
        })),
      });

      // The database recomputes prices and the total from current product data,
      // so show the amount it actually stored (e.g. a price changed while in the cart).
      let finalTotal = snapshotTotal;
      try {
        const saved = await fetchOrderByNumber(newOrderNumber);
        if (saved?.total_amount != null) finalTotal = Number(saved.total_amount);
      } catch {
        // Fall back to the cart total; the order itself was stored
      }
      if (finalTotal !== snapshotTotal) {
        toast({
          title: "Үнэ шинэчлэгдсэн",
          description: `Зарим барааны үнэ өөрчлөгдсөн тул төлөх дүн ${finalTotal.toLocaleString()}₮ боллоо.`,
        });
      }

      setOrderNumber(newOrderNumber);
      setPaidAmount(finalTotal);
      setShowPaymentModal(true);
      clearCart();
    } catch (error: any) {
      toast({
        title: "Алдаа",
        description: error.message || "Захиалга илгээхэд алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !showPaymentModal) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-[Roboto]"
        >
          <ChevronLeft className="w-4 h-4" />
          Сагс руу буцах
        </button>

        <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2 font-[Fraunces]">
          Захиалга баталгаажуулах
        </h1>
        <p className="text-muted-foreground text-sm mb-8 font-[Roboto]">
          Мэдээллээ бөглөөд захиалгаа баталгаажуулна уу
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-medium font-[Roboto]">Холбоо барих мэдээлэл</h2>
                  </div>
                  {isLoggedIn && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full font-[Roboto]">
                      <CheckCircle2 className="w-3 h-3" />
                      Нэвтэрсэн
                    </span>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-[Roboto] mb-1.5 block">
                    Имэйл хаяг
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      readOnly={isLoggedIn}
                      className={`pl-10 h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Roboto] ${
                        isLoggedIn ? "cursor-not-allowed text-muted-foreground" : ""
                      }`}
                    />
                  </div>
                  {isLoggedIn && (
                    <p className="text-[11px] text-muted-foreground mt-1.5 font-[Roboto]">
                      Нэвтэрсэн хэрэглэгчийн имэйлээр захиалга илгээгдэнэ
                    </p>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-medium font-[Roboto]">Хүргэлтийн хаяг</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-muted-foreground font-[Roboto] mb-1.5 block">
                        Овог
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="pl-10 h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Roboto]"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-muted-foreground font-[Roboto] mb-1.5 block">
                        Нэр
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="pl-10 h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Roboto]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-xs uppercase tracking-wider text-muted-foreground font-[Roboto] mb-1.5 block">
                      Утасны дугаар
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        required
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+976 99123456"
                        className="pl-10 h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Roboto]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-xs uppercase tracking-wider text-muted-foreground font-[Roboto] mb-1.5 block">
                      Хот
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Улаанбаатар"
                      className="h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Roboto]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district" className="text-xs uppercase tracking-wider text-muted-foreground font-[Roboto] mb-1.5 block">
                        Дүүрэг
                      </Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => handleSelectChange("district", value)}
                        required
                      >
                        <SelectTrigger className="h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Roboto]">
                          <SelectValue placeholder="Дүүрэг сонгох" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50 rounded-xl font-[Roboto]">
                          {mongolianDistricts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="khoroo" className="text-xs uppercase tracking-wider text-muted-foreground font-[Roboto] mb-1.5 block">
                        Хороо
                      </Label>
                      <Input
                        id="khoroo"
                        name="khoroo"
                        type="number"
                        required
                        value={formData.khoroo}
                        onChange={handleInputChange}
                        placeholder="1"
                        min="1"
                        className="h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Roboto]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="detailedAddress" className="text-xs uppercase tracking-wider text-muted-foreground font-[Roboto] mb-1.5 block">
                      Дэлгэрэнгүй хаяг
                    </Label>
                    <Input
                      id="detailedAddress"
                      name="detailedAddress"
                      required
                      value={formData.detailedAddress}
                      onChange={handleInputChange}
                      placeholder="Байр 5, Тоот 12"
                      className="h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Roboto]"
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40 sticky top-24">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-medium font-[Roboto]">Захиалгын хураангуй</h2>
              </div>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f5f5f3] flex-shrink-0 border border-border/30">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate font-[Roboto]">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-[Roboto] mt-0.5">
                        Тоо: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm font-[Roboto] whitespace-nowrap">
                      {(parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toLocaleString()}₮
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4 bg-border/40" />

              <div className="mb-5 font-[Roboto]">
                {appliedPromo ? (
                  <div className="flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm">
                    <span className="flex items-center gap-2 font-medium">
                      <Tag className="h-4 w-4 text-primary" />
                      {appliedPromo.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedPromo(null)}
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Промо код хасах"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <form
                    className="flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleApplyPromo();
                    }}
                  >
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={promoInput}
                        onChange={(e) => {
                          setPromoInput(e.target.value.toUpperCase());
                          setPromoError("");
                        }}
                        placeholder="Промо код"
                        className="h-11 rounded-xl pl-9 uppercase"
                        aria-label="Промо код"
                      />
                    </div>
                    <Button
                      type="submit"
                      variant="outline"
                      className="h-11 rounded-xl px-5"
                      disabled={!promoInput.trim() || checkingPromo}
                    >
                      {checkingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Ашиглах"}
                    </Button>
                  </form>
                )}
                {promoError && <p className="mt-2 text-xs text-destructive">{promoError}</p>}
              </div>

              <div className="space-y-2.5 mb-6 font-[Roboto]">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Дүн</span>
                  <span>{cartTotal.toLocaleString()}₮</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Хөнгөлөлт ({appliedPromo.code})</span>
                    <span className="font-medium text-primary">−{discount.toLocaleString()}₮</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Хүргэлт</span>
                  <span className="text-primary font-medium">Үнэгүй</span>
                </div>
                <Separator className="bg-border/40" />
                <div className="flex justify-between text-xl font-semibold pt-1">
                  <span>Нийт</span>
                  <span className="text-primary">{payableTotal.toLocaleString()}₮</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 rounded-xl text-base font-medium font-[Roboto] shadow-md hover:shadow-lg transition-all"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Боловсруулж байна...
                  </span>
                ) : (
                  "Төлбөр төлөх"
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground font-[Roboto]">
                <Shield className="w-3.5 h-3.5" />
                <span>Аюулгүй төлбөр</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <PaymentModal
        open={showPaymentModal}
        onOpenChange={(open) => {
          setShowPaymentModal(open);
          if (!open) navigate(`/track-order?order=${orderNumber}`);
        }}
        orderNumber={orderNumber}
        totalAmount={paidAmount}
      />
    </div>
  );
};

export default Checkout;
