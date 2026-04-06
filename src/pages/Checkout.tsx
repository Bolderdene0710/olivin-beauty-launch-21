import { useState } from "react";
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
import { createManualOrder } from "@/lib/supabase";
import { Mail, Phone, MapPin, User, ShoppingBag, ChevronLeft, Shield } from "lucide-react";
import PaymentModal from "@/components/PaymentModal";

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

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

  const mongolianDistricts = [
    "Bayanzurkh",
    "Sukhbaatar",
    "Khan-Uul",
    "Bayangol",
    "Songinokhairkhan",
    "Chingeltei",
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

  const handleSubmit = async () => {
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.district || !formData.khoroo || !formData.detailedAddress) {
      toast({ title: "Бүх талбарыг бөглөнө үү", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const newOrderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;

      await createManualOrder({
        order_number: newOrderNumber,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        phone_number: formData.phoneNumber,
        district: formData.district,
        khoroo: formData.khoroo,
        detailed_address: formData.detailedAddress,
        total_amount: cartTotal,
        status: "pending",
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price.replace(/[^0-9.]/g, "")),
          quantity: item.quantity,
        })),
      });

      setOrderNumber(newOrderNumber);
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

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 font-[Jost]"
        >
          <ChevronLeft className="w-4 h-4" />
          Сагс руу буцах
        </button>

        <h1 className="text-3xl md:text-4xl font-light tracking-wide mb-2 font-[Cormorant_Garamond]">
          Захиалга баталгаажуулах
        </h1>
        <p className="text-muted-foreground text-sm mb-8 font-[Jost]">
          Мэдээллээ бөглөөд захиалгаа баталгаажуулна уу
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-medium font-[Jost]">Холбоо барих мэдээлэл</h2>
                </div>
                <div>
                  <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-[Jost] mb-1.5 block">
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
                      className="pl-10 h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Jost]"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-border/40">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-medium font-[Jost]">Хүргэлтийн хаяг</h2>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-xs uppercase tracking-wider text-muted-foreground font-[Jost] mb-1.5 block">
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
                          className="pl-10 h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Jost]"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-xs uppercase tracking-wider text-muted-foreground font-[Jost] mb-1.5 block">
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
                          className="pl-10 h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Jost]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-xs uppercase tracking-wider text-muted-foreground font-[Jost] mb-1.5 block">
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
                        className="pl-10 h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Jost]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-xs uppercase tracking-wider text-muted-foreground font-[Jost] mb-1.5 block">
                      Хот
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Улаанбаатар"
                      className="h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Jost]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district" className="text-xs uppercase tracking-wider text-muted-foreground font-[Jost] mb-1.5 block">
                        Дүүрэг
                      </Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => handleSelectChange("district", value)}
                        required
                      >
                        <SelectTrigger className="h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Jost]">
                          <SelectValue placeholder="Дүүрэг сонгох" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50 rounded-xl font-[Jost]">
                          {mongolianDistricts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="khoroo" className="text-xs uppercase tracking-wider text-muted-foreground font-[Jost] mb-1.5 block">
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
                        className="h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Jost]"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="detailedAddress" className="text-xs uppercase tracking-wider text-muted-foreground font-[Jost] mb-1.5 block">
                      Дэлгэрэнгүй хаяг
                    </Label>
                    <Input
                      id="detailedAddress"
                      name="detailedAddress"
                      required
                      value={formData.detailedAddress}
                      onChange={handleInputChange}
                      placeholder="Байр 5, Тоот 12"
                      className="h-12 rounded-xl border-border/60 bg-[#f5f5f3]/50 focus:ring-2 focus:ring-primary/30 focus:border-primary font-[Jost]"
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
                <h2 className="text-lg font-medium font-[Jost]">Захиалгын хураангуй</h2>
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
                      <p className="font-medium text-sm truncate font-[Jost]">{item.name}</p>
                      <p className="text-xs text-muted-foreground font-[Jost] mt-0.5">
                        Тоо: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm font-[Jost] whitespace-nowrap">
                      {(parseFloat(item.price.replace(/[^0-9.]/g, "")) * item.quantity).toLocaleString()}₮
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4 bg-border/40" />

              <div className="space-y-2.5 mb-6 font-[Jost]">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Дүн</span>
                  <span>{cartTotal.toLocaleString()}₮</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Хүргэлт</span>
                  <span className="text-primary font-medium">Үнэгүй</span>
                </div>
                <Separator className="bg-border/40" />
                <div className="flex justify-between text-xl font-semibold pt-1">
                  <span>Нийт</span>
                  <span className="text-primary">{cartTotal.toLocaleString()}₮</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full h-14 rounded-xl text-base font-medium font-[Jost] shadow-md hover:shadow-lg transition-all"
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

              <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground font-[Jost]">
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
        onOpenChange={setShowPaymentModal}
        orderNumber={orderNumber}
        totalAmount={cartTotal}
      />
    </div>
  );
};

export default Checkout;
