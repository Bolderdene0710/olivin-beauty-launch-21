import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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

const Checkout = () => {
  const { items, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Generate order number
      const orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
      
      // Prepare order data for external database
      // Using type assertion to bypass auto-generated types that don't match external DB
      const orderData = {
        order_number: orderNumber,
        customer_name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email, // Using 'email' instead of 'customer_email' for external DB
        phone_number: formData.phoneNumber,
        district: formData.district,
        khoroo: formData.khoroo,
        detailed_address: formData.detailedAddress,
        total_amount: cartTotal,
        status: "pending",
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: parseFloat(item.price.replace("$", "")),
          quantity: item.quantity,
        })),
      };

      // Save order to database - using type assertion for external DB compatibility
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("orders") as any).insert([orderData]);

      if (error) throw error;

      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order number is ${orderNumber}. Please save it to track your order.`,
        duration: 6000,
      });
      
      // Navigate to order tracking with the order number
      navigate(`/track-order?order=${orderNumber}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to place order. Please try again.",
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
              </Card>

              {/* Shipping Address */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+976 99123456"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Ulaanbaatar"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="district">District *</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => handleSelectChange("district", value)}
                        required
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select district" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          {mongolianDistricts.map((district) => (
                            <SelectItem key={district} value={district}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="khoroo">Khoroo *</Label>
                      <Input
                        id="khoroo"
                        name="khoroo"
                        type="number"
                        required
                        value={formData.khoroo}
                        onChange={handleInputChange}
                        placeholder="1"
                        min="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="detailedAddress">Detailed Address (Street/Apartment) *</Label>
                    <Input
                      id="detailedAddress"
                      name="detailedAddress"
                      required
                      value={formData.detailedAddress}
                      onChange={handleInputChange}
                      placeholder="Building 5, Apartment 12"
                    />
                  </div>
                </div>
              </Card>

              {/* Payment */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Payment</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    </div>
                    <span className="font-medium">Bank Transfer</span>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="text-sm">
                      Please transfer the total amount to:
                    </p>
                    <div className="font-mono text-sm space-y-1">
                      <p><span className="font-semibold">Bank:</span> Khan Bank</p>
                      <p><span className="font-semibold">Account:</span> 5037716403</p>
                      <p><span className="font-semibold">Account Name:</span> Account Name</p>
                    </div>
                    <p className="text-xs text-muted-foreground pt-2">
                      Your order will be processed after payment confirmation.
                    </p>
                  </div>
                </div>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-sm">
                      ${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full"
                onClick={handleSubmit}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm Order"}
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
