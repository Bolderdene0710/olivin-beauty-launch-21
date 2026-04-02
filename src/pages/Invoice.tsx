import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Printer, ArrowLeft } from "lucide-react";

const Invoice = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (!orderParam) {
      navigate("/track-order");
      return;
    }

    loadOrder(orderParam);
  }, [searchParams, navigate]);

  const loadOrder = async (orderNumber: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .single();

      if (error) throw error;

      if (data) {
        setOrder(data);
      } else {
        toast({
          title: "Not Found",
          description: "Order not found",
          variant: "destructive",
        });
        navigate("/track-order");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load order",
        variant: "destructive",
      });
      navigate("/track-order");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading invoice...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
        }
      `}</style>

      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="no-print flex gap-4 mb-6">
            <Button
              variant="outline"
              onClick={() => navigate(`/track-order?order=${order.order_number}`)}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Order
            </Button>
            <Button onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print Invoice
            </Button>
          </div>

          <Card id="invoice-content" className="p-8 md:p-12">
            {/* Header */}
            <div className="border-b pb-8 mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">INVOICE</h1>
                  <p className="text-muted-foreground">
                    Invoice #: {order.order_number}
                  </p>
                  <p className="text-muted-foreground">
                    Date: {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <h2 className="text-2xl font-bold mb-2">Pure Glow Skincare</h2>
                  <p className="text-sm text-muted-foreground">
                    Ulaanbaatar, Mongolia
                  </p>
                  <p className="text-sm text-muted-foreground">
                    contact@pureglow.mn
                  </p>
                  <p className="text-sm text-muted-foreground">
                    +976 7011-1234
                  </p>
                </div>
              </div>
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">Bill To:</h3>
                <p className="font-medium">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer_email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.phone_number}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3">Ship To:</h3>
                <p className="text-sm text-muted-foreground">
                  {order.district} District, Khoroo {order.khoroo}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.detailed_address}
                </p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Item</th>
                    <th className="text-center py-3 font-semibold">Quantity</th>
                    <th className="text-right py-3 font-semibold">Price</th>
                    <th className="text-right py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-4">{item.name}</td>
                      <td className="text-center py-4">{item.quantity}</td>
                      <td className="text-right py-4">₮{item.price.toLocaleString()}</td>
                      <td className="text-right py-4">
                        ₮{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end mb-8">
              <div className="w-full md:w-1/2">
                <div className="flex justify-between py-2 border-t">
                  <span className="font-semibold text-xl">Total Amount:</span>
                  <span className="font-bold text-2xl">
                    ₮{order.total_amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-3">Payment Information</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm mb-2">
                  <span className="font-medium">Payment Method:</span> Bank Transfer
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Bank:</span> Khan Bank
                </p>
                <p className="text-sm mb-2">
                  <span className="font-medium">Account Number:</span> 5037716403
                </p>
                <p className="text-sm">
                  <span className="font-medium">Account Name:</span> Account Name
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Thank you for your purchase!
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                For any questions, please contact us at contact@pureglow.mn
              </p>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Invoice;
