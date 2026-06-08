import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  XCircle,
  MapPin,
  User,
  Mail,
  Phone,
  Loader2,
  ChevronLeft,
  Radio,
} from "lucide-react";

const SAGE = "#7d9b6e";
const SAGE_DARK = "#5a7a4d";
const SAGE_TINT = "#e8eee2";
const CREAM = "#f5f5f3";

type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

interface Order {
  id: string;
  order_number: string;
  status: OrderStatus | string;
  customer_name: string;
  customer_email: string;
  phone_number: string;
  district: string;
  khoroo: string | number;
  detailed_address: string;
  total_amount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
  created_at: string;
}

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

const STATUS_META: Record<
  OrderStatus,
  { label: string; sub: string; Icon: typeof Clock; color: string }
> = {
  pending: {
    label: "Төлбөр хүлээгдэж байна",
    sub: "Гүйлгээ баталгаажихыг хүлээж байна",
    Icon: Clock,
    color: "#d4a017",
  },
  confirmed: {
    label: "Төлбөр баталгаажсан",
    sub: "Захиалга бэлдэх шатанд орлоо",
    Icon: CheckCircle2,
    color: SAGE,
  },
  shipped: {
    label: "Хүргэлтэнд гарсан",
    sub: "Тантай удахгүй холбогдоно",
    Icon: Truck,
    color: "#5b8def",
  },
  delivered: {
    label: "Хүргэгдсэн",
    sub: "Манайхыг сонгосонд баярлалаа 🌿",
    Icon: Package,
    color: SAGE_DARK,
  },
  cancelled: {
    label: "Цуцлагдсан",
    sub: "Энэ захиалга цуцлагдсан байна",
    Icon: XCircle,
    color: "#dc2626",
  },
};

const OrderTracking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [liveBlink, setLiveBlink] = useState(false);
  const { toast } = useToast();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const orderParam = searchParams.get("order");
    if (orderParam) {
      setOrderNumber(orderParam);
      handleTrackOrder(orderParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Subscribe to realtime status updates whenever order is loaded
  useEffect(() => {
    if (!order?.id) return;

    const channel = supabase
      .channel(`order-${order.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          const next = payload.new as Order;
          setOrder((prev) =>
            prev ? { ...prev, ...next } : (next as Order)
          );
          setLiveBlink(true);
          setTimeout(() => setLiveBlink(false), 1500);
          toast({
            title: "Захиалгын төлөв шинэчлэгдлээ",
            description:
              STATUS_META[next.status as OrderStatus]?.label ?? next.status,
          });
        }
      )
      .subscribe();

    channelRef.current = channel;
    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [order?.id, toast]);

  const handleTrackOrder = async (orderNum?: string) => {
    const numToTrack = orderNum || orderNumber;
    if (!numToTrack.trim()) {
      toast({
        title: "Захиалгын дугаар оруулна уу",
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
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setOrder(data as Order);
      } else {
        setOrder(null);
        toast({
          title: "Олдсонгүй",
          description: "Захиалгын дугаараа дахин шалгана уу",
          variant: "destructive",
        });
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Хайхад алдаа гарлаа";
      toast({
        title: "Алдаа",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusTimeline = (status: OrderStatus) => {
    const isCancelled = status === "cancelled";
    const currentIndex = STATUS_FLOW.indexOf(status);

    if (isCancelled) {
      return (
        <div
          className="flex items-center gap-3 rounded-2xl p-4"
          style={{ background: "#fee2e2" }}
        >
          <XCircle className="h-5 w-5" style={{ color: "#dc2626" }} />
          <div>
            <div className="text-sm font-semibold text-foreground">
              Цуцлагдсан
            </div>
            <div className="text-xs text-muted-foreground">
              Энэ захиалга цуцлагдсан байна
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* progress line behind nodes */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-border/40" />
        <div
          className="absolute top-5 left-5 h-0.5 transition-all duration-700"
          style={{
            background: SAGE,
            width:
              currentIndex < 0
                ? "0%"
                : `calc(${(currentIndex / (STATUS_FLOW.length - 1)) * 100}% - ${currentIndex === STATUS_FLOW.length - 1 ? "0px" : "0px"})`,
            maxWidth: "calc(100% - 40px)",
          }}
        />

        <div className="relative grid grid-cols-4 gap-2">
          {STATUS_FLOW.map((step, i) => {
            const meta = STATUS_META[step];
            const Icon = meta.Icon;
            const reached = i <= currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <div key={step} className="flex flex-col items-center text-center">
                <div
                  className="relative h-10 w-10 rounded-full flex items-center justify-center transition-all"
                  style={{
                    background: reached ? SAGE : "white",
                    border: reached
                      ? `2px solid ${SAGE}`
                      : "2px solid rgb(229 229 229)",
                    boxShadow: isCurrent
                      ? `0 0 0 6px ${SAGE_TINT}`
                      : "none",
                  }}
                >
                  <Icon
                    className="h-4 w-4"
                    style={{
                      color: reached ? "white" : "rgb(150 150 150)",
                    }}
                    strokeWidth={2}
                  />
                  {isCurrent && (
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: SAGE, opacity: 0.25 }}
                    />
                  )}
                </div>
                <div
                  className={`mt-2 text-[11px] leading-tight ${
                    reached
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {meta.label.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col font-['Roboto']"
      style={{ background: CREAM }}
    >
      <Header />

      <main className="flex-1 px-4 md:px-8 py-10 md:py-14">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Буцах
          </button>

          {/* Title */}
          <div className="mb-8">
            <p
              className="text-[11px] uppercase tracking-[0.25em] mb-2"
              style={{ color: SAGE }}
            >
              · Olivin · Захиалга
            </p>
            <h1 className="text-3xl md:text-4xl font-medium text-foreground">
              Захиалгын хяналт
            </h1>
            <p className="text-sm text-muted-foreground mt-2">
              Захиалгын дугаараа оруулж төлөв байдлыг хянана уу
            </p>
          </div>

          {/* Search card */}
          <div className="bg-white rounded-3xl p-5 md:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ORD..."
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrackOrder()}
                  className="pl-11 h-12 rounded-2xl border-border/60 bg-[#fafaf9] focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] text-sm"
                />
              </div>
              <Button
                onClick={() => handleTrackOrder()}
                disabled={isLoading}
                className="h-12 px-7 rounded-2xl text-white text-sm font-medium shadow-none hover:opacity-90"
                style={{ background: SAGE }}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Хайх"
                )}
              </Button>
            </div>
          </div>

          {/* Order detail */}
          {order && (
            <div className="space-y-5">
              {/* Status hero */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background:
                          STATUS_META[order.status as OrderStatus]?.color
                            ? `${STATUS_META[order.status as OrderStatus].color}1A`
                            : SAGE_TINT,
                      }}
                    >
                      {(() => {
                        const meta =
                          STATUS_META[order.status as OrderStatus] ??
                          STATUS_META.pending;
                        const Icon = meta.Icon;
                        return (
                          <Icon
                            className="h-5 w-5"
                            style={{ color: meta.color }}
                            strokeWidth={2}
                          />
                        );
                      })()}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg md:text-xl font-semibold text-foreground truncate">
                        {STATUS_META[order.status as OrderStatus]?.label ??
                          order.status}
                      </h2>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {STATUS_META[order.status as OrderStatus]?.sub ?? ""}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-2 font-mono">
                        #{order.order_number}
                      </p>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider transition-colors"
                    style={{
                      background: liveBlink ? SAGE_TINT : CREAM,
                      color: liveBlink ? SAGE_DARK : "rgb(120 120 120)",
                    }}
                  >
                    <Radio
                      className={`h-3 w-3 ${liveBlink ? "animate-pulse" : ""}`}
                    />
                    Live
                  </div>
                </div>

                {renderStatusTimeline(order.status as OrderStatus)}
              </div>

              {/* Customer + shipping */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-2 mb-4">
                    <User
                      className="h-4 w-4"
                      style={{ color: SAGE_DARK }}
                      strokeWidth={1.8}
                    />
                    <h3 className="text-sm font-semibold text-foreground">
                      Хэрэглэгчийн мэдээлэл
                    </h3>
                  </div>
                  <dl className="space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      {order.customer_name}
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {order.customer_email}
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {order.phone_number}
                    </div>
                  </dl>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin
                      className="h-4 w-4"
                      style={{ color: SAGE_DARK }}
                      strokeWidth={1.8}
                    />
                    <h3 className="text-sm font-semibold text-foreground">
                      Хүргэлтийн хаяг
                    </h3>
                  </div>
                  <p className="text-sm text-foreground/80">
                    {order.district} дүүрэг, {order.khoroo}-р хороо
                  </p>
                  <p className="text-sm text-foreground/70 mt-1.5">
                    {order.detailed_address}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 mb-5">
                  <Package
                    className="h-4 w-4"
                    style={{ color: SAGE_DARK }}
                    strokeWidth={1.8}
                  />
                  <h3 className="text-sm font-semibold text-foreground">
                    Захиалгын бараа
                  </h3>
                </div>

                <div className="space-y-3">
                  {order.items?.map((item, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2.5 border-b border-border/40 last:border-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: CREAM }}
                        >
                          <span className="text-xs font-medium text-foreground/70">
                            ×{item.quantity}
                          </span>
                        </div>
                        <span className="text-sm text-foreground/90 truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground whitespace-nowrap">
                        {(item.price * item.quantity).toLocaleString()}₮
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  className="mt-5 pt-5 border-t-2 flex justify-between items-baseline"
                  style={{ borderColor: SAGE_TINT }}
                >
                  <span className="text-sm text-muted-foreground">
                    Нийт дүн
                  </span>
                  <span
                    className="text-2xl font-bold"
                    style={{ color: SAGE_DARK }}
                  >
                    {order.total_amount.toLocaleString()}₮
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground mt-4">
                  Захиалга үүссэн: {" "}
                  {new Date(order.created_at).toLocaleString("mn-MN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <Button
                onClick={() =>
                  navigate(`/invoice?order=${order.order_number}`)
                }
                variant="outline"
                className="w-full h-12 rounded-2xl border-border/60 bg-white hover:bg-[#fafaf9] text-sm font-medium gap-2"
              >
                <FileText className="w-4 h-4" />
                Нэхэмжлэл харах
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderTracking;
