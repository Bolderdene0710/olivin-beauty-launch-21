import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import { Search, Package, Clock, CheckCircle, Truck } from "lucide-react";

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Auto-load order if order number is in URL
  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setOrderNumber(orderParam);
      handleTrackOrder(orderParam);
    }
  }, [searchParams]);

  const handleTrackOrder = async (orderNum?: string) => {
    const numToTrack = orderNum || orderNumber;
    if (!numToTrack.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", numToTrack.trim())
        .single();

      if (error) throw error;

      if (data) {
        setOrder(data);
      } else {
        toast({
          title: "Not Found",
          description: "Order not found. Please check your order number.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to track order",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case "confirmed":
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-purple-500" />;
      case "delivered":
        return <Package className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending Payment";
      case "confirmed":
        return "Payment Confirmed";
      case "shipped":
        return "Order Shipped";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Track Your Order</h1>
          
          <Card className="p-6 mb-8">
            <div className="flex gap-4">
              <Input
                placeholder="Enter your order number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleTrackOrder()}
                className="flex-1"
              />
              <Button
                onClick={() => handleTrackOrder()}
                disabled={isLoading}
                className="gap-2"
              >
                <Search className="w-4 h-4" />
                {isLoading ? "Searching..." : "Track"}
              </Button>
            </div>
          </Card>

          {order && (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  {getStatusIcon(order.status)}
                  <div>
                    <h2 className="text-2xl font-bold">
                      {getStatusText(order.status)}
                    </h2>
                    <p className="text-muted-foreground">
                      Order #{order.order_number}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Customer Information</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_email}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.phone_number}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">
                      {order.district} District, Khoroo {order.khoroo}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.detailed_address}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Order Items</h3>
                    <div className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>₮{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount</span>
                      <span>₮{order.total_amount}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Order placed on{" "}
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderTracking;
