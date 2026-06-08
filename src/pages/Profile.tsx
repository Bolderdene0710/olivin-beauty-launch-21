import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  LogOut,
  Mail,
  User as UserIcon,
  ChevronRight,
  PackageSearch,
  Settings,
  HelpCircle,
  Leaf,
  Ticket,
  Sparkles,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Section = "orders" | "settings" | "help";
type OrderTab = "ordered" | "delivered" | "cancelled";
type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderRow {
  id: string;
  order_number: string;
  status: OrderStatus | string;
  total_amount: number;
  items: Array<{ name: string; quantity: number; price: number }> | null;
  created_at: string;
  district: string | null;
  khoroo: string | number | null;
}

const SAGE = "#7d9b6e";
const SAGE_DARK = "#5a7a4d";
const SAGE_TINT = "#e8eee2";
const CREAM = "#f5f5f3";

const categorize = (status: string): OrderTab => {
  if (status === "delivered") return "delivered";
  if (status === "cancelled") return "cancelled";
  return "ordered";
};

const STATUS_BADGE: Record<
  OrderStatus,
  { label: string; color: string; bg: string; Icon: typeof Clock }
> = {
  pending: { label: "Төлбөр хүлээж буй", color: "#a47408", bg: "#fef3c7", Icon: Clock },
  confirmed: { label: "Баталгаажсан", color: SAGE_DARK, bg: SAGE_TINT, Icon: CheckCircle2 },
  shipped: { label: "Хүргэлтэнд", color: "#1e40af", bg: "#dbeafe", Icon: Truck },
  delivered: { label: "Хүргэгдсэн", color: SAGE_DARK, bg: SAGE_TINT, Icon: Package },
  cancelled: { label: "Цуцлагдсан", color: "#991b1b", bg: "#fee2e2", Icon: XCircle },
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [section, setSection] = useState<Section>("orders");
  const [orderTab, setOrderTab] = useState<OrderTab>("ordered");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, avatar_url, full_name, phone_number, home_address")
        .eq("id", session.user.id)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Профайл ачаалахад алдаа гарлаа",
          description: error.message,
        });
      } else if (profile) {
        setUsername(profile.username || "");
        setAvatarUrl(profile.avatar_url || "");
        setFullName(profile.full_name || "");
        setPhoneNumber(profile.phone_number || "");
        setHomeAddress(profile.home_address || "");
      }

      setLoading(false);
    };

    loadProfile();
    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  // Fetch and subscribe to user's orders by email
  useEffect(() => {
    const email = user?.email;
    if (!email) return;

    let active = true;

    const fetchOrders = async () => {
      setOrdersLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, status, total_amount, items, created_at, district, khoroo"
        )
        .eq("customer_email", email)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        toast({
          variant: "destructive",
          title: "Захиалга ачаалахад алдаа гарлаа",
          description: error.message,
        });
        setOrders([]);
      } else {
        setOrders((data ?? []) as OrderRow[]);
      }
      setOrdersLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel(`profile-orders-${email}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `customer_email=eq.${email}`,
        },
        (payload) => {
          setOrders((prev) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as OrderRow, ...prev];
            }
            if (payload.eventType === "UPDATE") {
              const next = payload.new as OrderRow;
              return prev.map((o) => (o.id === next.id ? { ...o, ...next } : o));
            }
            if (payload.eventType === "DELETE") {
              const old = payload.old as { id: string };
              return prev.filter((o) => o.id !== old.id);
            }
            return prev;
          });
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [user?.email, toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        phone_number: phoneNumber.trim() || null,
        home_address: homeAddress.trim() || null,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast({
        variant: "destructive",
        title: "Хадгалахад алдаа гарлаа",
        description: error.message,
      });
    } else {
      toast({ title: "Амжилттай", description: "Профайл шинэчлэгдлээ." });
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Гарахад алдаа гарлаа",
        description: error.message,
      });
    } else {
      toast({ title: "Системээс гарлаа", description: "Дахин уулзацгаая." });
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: CREAM }}>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin" style={{ color: SAGE }} />
        </div>
        <Footer />
      </div>
    );
  }

  const displayName =
    fullName.trim() || username || user?.email?.split("@")[0] || "Хэрэглэгч";
  const initial = (displayName || "U").charAt(0).toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at)
        .toLocaleDateString("en-CA")
        .replace(/-/g, ".")
    : "—";

  const menuItems: {
    key: Section;
    icon: typeof PackageSearch;
    label: string;
    desc: string;
  }[] = [
    {
      key: "orders",
      icon: PackageSearch,
      label: "Миний захиалгууд",
      desc: "Захиалсан, хүргэгдсэн, цуцлагдсан",
    },
    {
      key: "settings",
      icon: Settings,
      label: "Тохиргоо",
      desc: "Хувийн мэдээлэл, аватар",
    },
    {
      key: "help",
      icon: HelpCircle,
      label: "Туслэмж",
      desc: "Түгээмэл асуулт, холбоо барих",
    },
  ];

  const orderCounts = orders.reduce(
    (acc, o) => {
      acc[categorize(o.status)] += 1;
      return acc;
    },
    { ordered: 0, delivered: 0, cancelled: 0 } as Record<OrderTab, number>
  );

  const orderTabs: { key: OrderTab; label: string; count: number }[] = [
    { key: "ordered", label: "Захиалсан", count: orderCounts.ordered },
    { key: "delivered", label: "Хүргэгдсэн", count: orderCounts.delivered },
    { key: "cancelled", label: "Цуцлагдсан", count: orderCounts.cancelled },
  ];

  const filteredOrders = orders.filter((o) => categorize(o.status) === orderTab);

  return (
    <div
      className="min-h-screen flex flex-col font-['Roboto']"
      style={{ background: CREAM }}
    >
      <Header />

      <main className="flex-1 px-4 md:px-8 lg:px-12 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Page header */}
          <div className="mb-8 md:mb-10">
            <p
              className="text-[11px] uppercase tracking-[0.25em] mb-2"
              style={{ color: SAGE }}
            >
              · Olivin · Миний хэсэг
            </p>
            <h1 className="text-3xl md:text-4xl font-medium text-foreground">
              Профайл
            </h1>
          </div>

          <div className="grid lg:grid-cols-[340px_1fr] gap-6 lg:gap-10">
            {/* LEFT SIDEBAR */}
            <aside className="space-y-3">
              {/* User card */}
              <div className="rounded-3xl bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                <button
                  onClick={() => setSection("settings")}
                  className="w-full flex items-center gap-3 group"
                >
                  <div className="relative">
                    <Avatar
                      className="h-14 w-14 ring-4"
                      style={{ "--tw-ring-color": SAGE_TINT } as React.CSSProperties}
                    >
                      <AvatarImage src={avatarUrl} alt={displayName} />
                      <AvatarFallback
                        className="text-base font-medium"
                        style={{ background: SAGE_TINT, color: SAGE_DARK }}
                      >
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ring-2 ring-white flex items-center justify-center"
                      style={{ background: SAGE }}
                    >
                      <Leaf className="h-2 w-2 text-white" strokeWidth={2.5} />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {displayName}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {memberSince}-нд бүртгэгдсэн
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <div className="h-px bg-border/50 my-4" />

                {/* Points + coupon */}
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="rounded-2xl p-3"
                    style={{ background: SAGE_TINT }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Sparkles
                        className="h-3.5 w-3.5"
                        style={{ color: SAGE_DARK }}
                      />
                      <span
                        className="text-[10px] uppercase tracking-wider font-medium"
                        style={{ color: SAGE_DARK }}
                      >
                        Olivin point
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span
                        className="text-xl font-bold"
                        style={{ color: SAGE_DARK }}
                      >
                        0
                      </span>
                      <span
                        className="text-[11px]"
                        style={{ color: SAGE_DARK, opacity: 0.7 }}
                      >
                        / ₮
                      </span>
                    </div>
                    <div
                      className="text-[10px] mt-0.5"
                      style={{ color: SAGE_DARK, opacity: 0.7 }}
                    >
                      1pt = 1₮
                    </div>
                  </div>

                  <div
                    className="rounded-2xl p-3"
                    style={{ background: CREAM }}
                  >
                    <div className="flex items-center gap-1.5">
                      <Ticket className="h-3.5 w-3.5 text-foreground/70" />
                      <span className="text-[10px] uppercase tracking-wider font-medium text-foreground/70">
                        Купон
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-xl font-bold text-foreground">
                        0
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        ш
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      Идэвхтэй купон
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <nav className="space-y-1.5 pt-1">
                {menuItems.map(({ key, icon: Icon, label, desc }) => {
                  const active = section === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSection(key)}
                      className="w-full flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors"
                      style={{
                        background: active ? "white" : "transparent",
                        boxShadow: active
                          ? "0 4px 16px rgba(0,0,0,0.04)"
                          : "none",
                      }}
                    >
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          background: active ? SAGE_TINT : "transparent",
                        }}
                      >
                        <Icon
                          className="h-5 w-5"
                          style={{
                            color: active ? SAGE_DARK : "rgb(100 100 100)",
                          }}
                          strokeWidth={1.6}
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div
                          className={`text-sm ${
                            active
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground/85"
                          }`}
                        >
                          {label}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {desc}
                        </div>
                      </div>
                      <ChevronRight
                        className="h-4 w-4 text-muted-foreground shrink-0 transition-transform"
                        style={{
                          transform: active ? "translateX(2px)" : "none",
                        }}
                      />
                    </button>
                  );
                })}
              </nav>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.6} />
                Гарах
              </button>
            </aside>

            {/* RIGHT CONTENT */}
            <section className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.03)] min-h-[520px]">
              {section === "orders" && (
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ background: SAGE_TINT }}
                    >
                      <PackageSearch
                        className="h-4.5 w-4.5"
                        style={{ color: SAGE_DARK, height: 18, width: 18 }}
                        strokeWidth={1.8}
                      />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">
                      Миний захиалгууд
                    </h2>
                  </div>

                  {/* Tabs (segmented) */}
                  <div
                    className="inline-flex p-1 rounded-full mb-12"
                    style={{ background: CREAM }}
                  >
                    {orderTabs.map(({ key, label, count }) => {
                      const active = orderTab === key;
                      return (
                        <button
                          key={key}
                          onClick={() => setOrderTab(key)}
                          className="px-5 md:px-6 h-10 rounded-full text-sm transition-all"
                          style={{
                            background: active ? SAGE : "transparent",
                            color: active ? "white" : "rgb(80 80 80)",
                            fontWeight: active ? 500 : 400,
                          }}
                        >
                          {label}{" "}
                          <span
                            className="text-[11px] ml-0.5"
                            style={{ opacity: active ? 0.85 : 0.6 }}
                          >
                            ({count})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {ordersLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2
                        className="h-6 w-6 animate-spin"
                        style={{ color: SAGE }}
                      />
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 md:py-16">
                      <div
                        className="h-20 w-20 rounded-full flex items-center justify-center mb-5"
                        style={{ background: CREAM }}
                      >
                        <Leaf
                          className="h-9 w-9"
                          style={{ color: SAGE }}
                          strokeWidth={1.3}
                        />
                      </div>
                      <p className="text-base font-medium text-foreground">
                        {orderTab === "ordered" &&
                          "Захиалсан бараа алга байна"}
                        {orderTab === "delivered" &&
                          "Хүргэгдсэн бараа алга байна"}
                        {orderTab === "cancelled" &&
                          "Цуцлагдсан бараа алга байна"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Шинэ бүтээгдэхүүн рүү аялалаа эхлүүлээрэй
                      </p>
                      <button
                        onClick={() => navigate("/shop")}
                        className="mt-7 inline-flex items-center gap-1.5 h-11 px-6 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
                        style={{ background: SAGE }}
                      >
                        Бараа сонирхох
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredOrders.map((o) => {
                        const meta =
                          STATUS_BADGE[o.status as OrderStatus] ??
                          STATUS_BADGE.pending;
                        const StatusIcon = meta.Icon;
                        const itemCount = (o.items ?? []).reduce(
                          (s, i) => s + (i.quantity ?? 0),
                          0
                        );
                        const firstItemName = o.items?.[0]?.name ?? "—";
                        const moreCount = (o.items?.length ?? 0) - 1;
                        return (
                          <button
                            key={o.id}
                            onClick={() =>
                              navigate(
                                `/track-order?order=${o.order_number}`
                              )
                            }
                            className="w-full text-left p-4 md:p-5 rounded-2xl border border-border/50 hover:border-foreground/20 transition-colors bg-white"
                          >
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="min-w-0">
                                <div className="text-[11px] font-mono text-muted-foreground">
                                  #{o.order_number}
                                </div>
                                <div className="text-sm font-medium text-foreground mt-1 truncate">
                                  {firstItemName}
                                  {moreCount > 0 && (
                                    <span className="text-muted-foreground font-normal">
                                      {" "}
                                      +{moreCount} бусад
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-muted-foreground mt-1">
                                  {new Date(o.created_at).toLocaleDateString(
                                    "mn-MN",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                  {" · "}
                                  {itemCount} бараа
                                </div>
                              </div>

                              <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0"
                                style={{
                                  background: meta.bg,
                                  color: meta.color,
                                }}
                              >
                                <StatusIcon
                                  className="h-3 w-3"
                                  strokeWidth={2.2}
                                />
                                {meta.label}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-border/40">
                              <span
                                className="text-base font-semibold"
                                style={{ color: SAGE_DARK }}
                              >
                                {(o.total_amount ?? 0).toLocaleString()}₮
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                                Дэлгэрэнгүй
                                <ChevronRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {section === "settings" && (
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ background: SAGE_TINT }}
                    >
                      <Settings
                        style={{ color: SAGE_DARK, height: 18, width: 18 }}
                        strokeWidth={1.8}
                      />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">
                      Тохиргоо
                    </h2>
                  </div>

                  <form onSubmit={handleSave} className="max-w-xl space-y-5">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="full-name"
                        className="text-sm text-foreground/80"
                      >
                        Овог нэр
                      </Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="full-name"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Овог нэр"
                          disabled={saving}
                          className="pl-10 h-12 rounded-xl border-border/60 bg-[#fafaf9] focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="email"
                        className="text-sm text-foreground/80"
                      >
                        Имэйл хаяг
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="pl-10 h-12 rounded-xl border-border/60 bg-[#fafaf9] text-sm"
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        Имэйл өөрчлөхийн тулд тусламжтай холбогдоно уу
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="phone"
                        className="text-sm text-foreground/80"
                      >
                        Утасны дугаар
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          inputMode="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="9911 2233"
                          disabled={saving}
                          className="pl-10 h-12 rounded-xl border-border/60 bg-[#fafaf9] focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="address"
                        className="text-sm text-foreground/80"
                      >
                        Гэрийн хаяг
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                        <textarea
                          id="address"
                          value={homeAddress}
                          onChange={(e) => setHomeAddress(e.target.value)}
                          placeholder="Дүүрэг, хороо, байр, тоот"
                          disabled={saving}
                          rows={3}
                          className="w-full pl-10 pr-3 py-3 rounded-xl border border-border/60 bg-[#fafaf9] focus-visible:ring-2 focus-visible:ring-[#7d9b6e] focus-visible:border-[#7d9b6e] text-sm font-['Roboto'] resize-none outline-none"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={saving}
                      className="h-12 px-8 rounded-full text-white text-sm font-medium shadow-none hover:opacity-90"
                      style={{ background: SAGE }}
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Хадгалж байна...
                        </>
                      ) : (
                        "Өөрчлөлтийг хадгалах"
                      )}
                    </Button>
                  </form>
                </div>
              )}

              {section === "help" && (
                <div>
                  <div className="flex items-center gap-2.5 mb-6">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ background: SAGE_TINT }}
                    >
                      <HelpCircle
                        style={{ color: SAGE_DARK, height: 18, width: 18 }}
                        strokeWidth={1.8}
                      />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">
                      Туслэмж
                    </h2>
                  </div>

                  <div className="max-w-xl space-y-3">
                    {[
                      {
                        title: "Түгээмэл асуултууд",
                        desc: "FAQ хэсэг рүү очих",
                        to: "/faq",
                      },
                      {
                        title: "Холбоо барих",
                        desc: "Бидэнтэй холбогдох",
                        to: "/about",
                      },
                      {
                        title: "Захиалгын хяналт",
                        desc: "Захиалгын төлөв шалгах",
                        to: "/track-order",
                      },
                    ].map((item) => (
                      <button
                        key={item.to}
                        onClick={() => navigate(item.to)}
                        className="w-full flex items-center justify-between p-4 rounded-2xl transition-colors text-left hover:bg-[#fafaf9]"
                        style={{ background: CREAM }}
                      >
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
