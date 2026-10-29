import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  LogOut,
  User as UserIcon,
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Package,
  XCircle,
  ShoppingBag,
  ArrowRight,
  LayoutGrid,
  Heart,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WishlistButton } from "@/components/WishlistButton";
import { useWishlist } from "@/hooks/useWishlist";
import PriceTag from "@/components/PriceTag";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/contexts/CartContext";

type Section = "dashboard" | "profile" | "wishlist" | "orders";
type OrderTab = "ordered" | "delivered" | "cancelled";
type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

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

const STATUS_FLOW: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered"];

const categorize = (status: string): OrderTab => {
  if (status === "delivered") return "delivered";
  if (status === "cancelled") return "cancelled";
  return "ordered";
};

const STATUS_BADGE: Record<OrderStatus, { label: string; className: string; Icon: typeof Clock }> = {
  pending: { label: "Төлбөр хүлээж буй", className: "bg-amber-50 text-amber-700", Icon: Clock },
  confirmed: { label: "Баталгаажсан", className: "bg-primary/10 text-primary-dark", Icon: CheckCircle2 },
  shipped: { label: "Хүргэлтэнд", className: "bg-sky-50 text-sky-700", Icon: Truck },
  delivered: { label: "Хүргэгдсэн", className: "bg-primary/10 text-primary-dark", Icon: Package },
  cancelled: { label: "Цуцлагдсан", className: "bg-red-50 text-red-700", Icon: XCircle },
};

const NAV: { group?: string; items: { key: Section; label: string; icon: typeof LayoutGrid }[] }[] = [
  { items: [{ key: "dashboard", label: "Хянах самбар", icon: LayoutGrid }] },
  {
    group: "Хувийн",
    items: [
      { key: "profile", label: "Миний мэдээлэл", icon: UserIcon },
      { key: "wishlist", label: "Хадгалсан", icon: Heart },
    ],
  },
  { group: "Захиалга", items: [{ key: "orders", label: "Миний захиалга", icon: Package }] },
];

const SECTION_KEYS = NAV.flatMap((g) => g.items.map((i) => i.key));

const SECTION_TITLE: Record<Section, string> = {
  dashboard: "Хянах самбар",
  profile: "Миний мэдээлэл",
  wishlist: "Хадгалсан бараа",
  orders: "Миний захиалга",
};

const ORDER_TABS: { key: OrderTab; label: string }[] = [
  { key: "ordered", label: "Идэвхтэй" },
  { key: "delivered", label: "Хүргэгдсэн" },
  { key: "cancelled", label: "Цуцлагдсан" },
];

const EMPTY_TEXT: Record<OrderTab, string> = {
  ordered: "Идэвхтэй захиалга алга",
  delivered: "Хүргэгдсэн захиалга алга",
  cancelled: "Цуцлагдсан захиалга алга",
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [orderTab, setOrderTab] = useState<OrderTab>("ordered");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem } = useCart();
  const { productIds: wishlistIds, isLoading: wishlistLoading } = useWishlist();
  const { data: allProducts = [], isLoading: productsLoading } = useProducts();

  // ?tab= keeps the section linkable (e.g. /profile?tab=wishlist)
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as Section | null;
  const section: Section = tabParam && SECTION_KEYS.includes(tabParam) ? tabParam : "dashboard";
  const setSection = (next: Section) =>
    setSearchParams(next === "dashboard" ? {} : { tab: next }, { replace: true });

  const wishlistProducts = useMemo(() => {
    const set = new Set(wishlistIds);
    return allProducts.filter((p) => set.has(p.id));
  }, [allProducts, wishlistIds]);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/auth");
    });

    const loadProfile = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
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
        .select("id, order_number, status, total_amount, items, created_at, district, khoroo")
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
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  const displayName = fullName.trim() || username || user?.email?.split("@")[0] || "Хэрэглэгч";
  const firstName = displayName.split(" ").pop() || displayName;
  const initial = displayName.charAt(0).toUpperCase();

  const orderCounts = orders.reduce(
    (acc, o) => {
      acc[categorize(o.status)] += 1;
      return acc;
    },
    { ordered: 0, delivered: 0, cancelled: 0 } as Record<OrderTab, number>
  );
  const filteredOrders = orders.filter((o) => categorize(o.status) === orderTab);
  const activeOrder = orders.find((o) => categorize(o.status) === "ordered");

  const profileFields = [
    { done: !!fullName.trim(), label: "Овог нэр" },
    { done: !!phoneNumber.trim(), label: "Утас" },
    { done: !!homeAddress.trim(), label: "Хаяг" },
  ];
  const profileDone = profileFields.filter((f) => f.done).length;

  const navBadge: Partial<Record<Section, number>> = {
    wishlist: wishlistIds.length,
    orders: orderCounts.ordered,
  };

  const handleAddToCart = (p: (typeof wishlistProducts)[number]) => {
    addItem({ id: p.id, name: p.name, price: p.price, image: p.image });
    toast({ title: "Сагсанд нэмлээ!", description: p.name });
  };

  const sectionAction: Partial<Record<Section, { label: string; to: string }>> = {
    wishlist: { label: "Дэлгүүр хэсэх", to: "/shop" },
    orders: { label: "Захиалга хянах", to: "/track-order" },
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/40">
      <Header />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          {/* SIDEBAR */}
          <aside className="lg:sticky lg:top-28 rounded-3xl bg-background border border-border/60 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.25)] overflow-hidden">
            {/* User */}
            <div className="relative px-5 pt-6 pb-5 flex lg:flex-col items-center gap-4 lg:gap-3 lg:text-center">
              <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(ellipse_at_top,hsl(var(--sage-light)/0.6),transparent_75%)] hidden lg:block" />
              <Avatar className="relative h-14 w-14 lg:h-20 lg:w-20 ring-4 ring-background shadow-md">
                <AvatarImage src={avatarUrl} alt={displayName} />
                <AvatarFallback className="text-xl lg:text-2xl font-serif-display bg-primary text-primary-foreground">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="relative min-w-0 flex-1 lg:flex-none lg:w-full">
                <p className="font-semibold text-foreground truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                aria-label="Гарах"
                className="lg:hidden p-2.5 rounded-full text-muted-foreground hover:bg-secondary"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>

            {/* Nav: horizontal tabs on mobile, grouped list on desktop */}
            <nav className="border-t border-border/60 px-3 py-3 flex lg:flex-col gap-1 overflow-x-auto [scrollbar-width:none]">
              {NAV.map((group, gi) => (
                <div key={gi} className="contents lg:block">
                  {group.group && (
                    <p className="hidden lg:block px-3 pt-4 pb-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                      {group.group}
                    </p>
                  )}
                  {group.items.map(({ key, label, icon: Icon }) => {
                    const active = section === key;
                    const badge = navBadge[key];
                    return (
                      <button
                        key={key}
                        onClick={() => setSection(key)}
                        className={`relative shrink-0 lg:w-full flex items-center gap-3 px-3.5 h-11 rounded-2xl text-sm transition-colors ${
                          active ? "text-primary-foreground font-medium" : "text-foreground/80 hover:bg-secondary"
                        }`}
                      >
                        {active && (
                          <motion.span
                            layoutId="profile-nav"
                            className="absolute inset-0 rounded-2xl bg-primary-dark shadow-md shadow-primary/25"
                            transition={{ type: "spring", stiffness: 450, damping: 35 }}
                          />
                        )}
                        <Icon className="relative h-[18px] w-[18px]" strokeWidth={1.8} />
                        <span className="relative whitespace-nowrap">{label}</span>
                        {!!badge && (
                          <span
                            className={`relative ml-auto min-w-5 h-5 px-1.5 rounded-full text-[11px] font-semibold flex items-center justify-center ${
                              active ? "bg-white/20 text-primary-foreground" : "bg-primary/10 text-primary-dark"
                            }`}
                          >
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="hidden lg:block border-t border-border/60 p-3">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3.5 h-11 rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
                Системээс гарах
              </button>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="min-w-0">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h1 className="font-serif-display text-2xl md:text-3xl font-light tracking-tight text-foreground">
                {section === "dashboard" ? (
                  <>
                    Сайн уу, <em className="italic text-primary">{firstName}</em>
                  </>
                ) : (
                  SECTION_TITLE[section]
                )}
              </h1>
              {sectionAction[section] && (
                <button
                  onClick={() => navigate(sectionAction[section]!.to)}
                  className="shrink-0 inline-flex items-center gap-1.5 h-10 px-4 rounded-full border border-foreground/80 text-sm font-medium hover:bg-foreground hover:text-background transition-colors"
                >
                  {sectionAction[section]!.label}
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {section === "dashboard" && (
                  <div className="grid md:grid-cols-5 gap-4">
                    {/* Active order */}
                    <Card className="md:col-span-3">
                      <CardTitle
                        title="Идэвхтэй захиалга"
                        action={orders.length > 0 ? { label: "Бүгдийг үзэх", onClick: () => setSection("orders") } : undefined}
                      />
                      {ordersLoading ? (
                        <div className="h-28 rounded-2xl bg-secondary animate-pulse" />
                      ) : activeOrder ? (
                        <ActiveOrder order={activeOrder} onOpen={() => navigate(`/track-order?order=${activeOrder.order_number}`)} />
                      ) : (
                        <MiniEmpty
                          icon={ShoppingBag}
                          text="Одоогоор идэвхтэй захиалга алга"
                          cta="Дэлгүүр хэсэх"
                          onClick={() => navigate("/shop")}
                        />
                      )}
                    </Card>

                    {/* Wishlist preview */}
                    <Card className="md:col-span-2">
                      <CardTitle
                        title="Хадгалсан"
                        count={wishlistIds.length}
                        action={wishlistIds.length > 0 ? { label: "Үзэх", onClick: () => setSection("wishlist") } : undefined}
                      />
                      {wishlistLoading || productsLoading ? (
                        <div className="h-28 rounded-2xl bg-secondary animate-pulse" />
                      ) : wishlistProducts.length > 0 ? (
                        <button onClick={() => setSection("wishlist")} className="grid grid-cols-3 gap-2 w-full">
                          {wishlistProducts.slice(0, 3).map((p, i) => (
                            <div key={p.id} className="relative aspect-square rounded-2xl overflow-hidden bg-secondary">
                              <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              {i === 2 && wishlistProducts.length > 3 && (
                                <span className="absolute inset-0 bg-foreground/50 text-background text-sm font-semibold flex items-center justify-center">
                                  +{wishlistProducts.length - 3}
                                </span>
                              )}
                            </div>
                          ))}
                        </button>
                      ) : (
                        <MiniEmpty icon={Heart} text="Таалагдсан бараагаа ♥ дарж хадгалаарай" />
                      )}
                    </Card>

                    {/* Profile completeness */}
                    <Card className="md:col-span-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">
                              {profileDone === profileFields.length
                                ? "Мэдээлэл бүрэн бөглөгдсөн 🌿"
                                : `Мэдээлэл ${profileDone}/${profileFields.length} бөглөгдсөн`}
                            </p>
                            <span className="text-xs text-muted-foreground tabular-nums">
                              {Math.round((profileDone / profileFields.length) * 100)}%
                            </span>
                          </div>
                          <div className="mt-2.5 h-1.5 rounded-full bg-secondary overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(profileDone / profileFields.length) * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full rounded-full bg-primary"
                            />
                          </div>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {profileDone === profileFields.length
                              ? "Захиалга хийхэд таны мэдээлэл автоматаар бөглөгдөнө."
                              : `Дутуу: ${profileFields.filter((f) => !f.done).map((f) => f.label).join(", ")} — бөглөвөл захиалга илүү хурдан.`}
                          </p>
                        </div>
                        {profileDone < profileFields.length && (
                          <button
                            onClick={() => setSection("profile")}
                            className="shrink-0 inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:bg-primary-dark transition-colors"
                          >
                            Бөглөх <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </Card>
                  </div>
                )}

                {section === "wishlist" && (
                  <Card>
                    <CardTitle title="Миний сонголт" count={wishlistProducts.length} />
                    {wishlistLoading || productsLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                          <div key={i} className="aspect-[4/5] rounded-2xl bg-secondary animate-pulse" />
                        ))}
                      </div>
                    ) : wishlistProducts.length === 0 ? (
                      <BigEmpty
                        icon={Heart}
                        title="Хадгалсан бараа алга"
                        text="Бүтээгдэхүүн дээрх ♥ товчийг дарж хадгалаарай."
                        cta="Дэлгүүр хэсэх"
                        onClick={() => navigate("/shop")}
                      />
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                        {wishlistProducts.map((p) => (
                          <div key={p.id} className="group">
                            <div
                              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary cursor-pointer"
                              onClick={() => navigate(`/product/${p.id}`)}
                            >
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute top-2.5 right-2.5" onClick={(e) => e.stopPropagation()}>
                                <WishlistButton productId={p.id} productName={p.name} size="sm" />
                              </div>
                            </div>
                            {p.brand && (
                              <p className="mt-3 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{p.brand}</p>
                            )}
                            <p className="mt-0.5 text-sm font-medium text-foreground line-clamp-1">{p.name}</p>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <PriceTag
                                className="text-sm"
                                price={p.price}
                                compareAtPrice={p.compareAtPrice}
                                discountPercent={p.discountPercent}
                              />
                              <button
                                onClick={() => handleAddToCart(p)}
                                aria-label="Сагсанд нэмэх"
                                className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center hover:bg-primary-dark transition-colors"
                              >
                                <ShoppingBag className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {section === "orders" && (
                  <Card>
                    <div className="inline-flex p-1 rounded-full bg-secondary mb-5 max-w-full overflow-x-auto">
                      {ORDER_TABS.map(({ key, label }) => {
                        const active = orderTab === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setOrderTab(key)}
                            className={`relative shrink-0 px-4 md:px-5 h-9 rounded-full text-sm transition-colors ${
                              active ? "text-background font-medium" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {active && (
                              <motion.span
                                layoutId="profile-order-tab"
                                className="absolute inset-0 rounded-full bg-foreground"
                                transition={{ type: "spring", stiffness: 450, damping: 35 }}
                              />
                            )}
                            <span className="relative">
                              {label}
                              <span className="ml-1 text-[11px] opacity-70">{orderCounts[key]}</span>
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {ordersLoading ? (
                      <div className="space-y-3">
                        {[0, 1].map((i) => (
                          <div key={i} className="h-32 rounded-3xl bg-secondary animate-pulse" />
                        ))}
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <BigEmpty
                        icon={ShoppingBag}
                        title={EMPTY_TEXT[orderTab]}
                        text="Арьсандаа тохирох бүтээгдэхүүнээ сонгоорой"
                        cta="Дэлгүүр хэсэх"
                        onClick={() => navigate("/shop")}
                      />
                    ) : (
                      <div className="grid gap-3">
                        {filteredOrders.map((o, i) => (
                          <OrderCard
                            key={o.id}
                            order={o}
                            index={i}
                            onOpen={() => navigate(`/track-order?order=${o.order_number}`)}
                          />
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {section === "profile" && (
                  <Card>
                    <form onSubmit={handleSave} className="max-w-xl">
                      <p className="text-sm text-muted-foreground mb-6">
                        Эдгээр мэдээллийг захиалга хийх үед автоматаар бөглөнө.
                      </p>
                      <div className="space-y-5">
                        <SettingsField id="full-name" label="Овог нэр" icon={UserIcon}>
                          <input
                            id="full-name"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Овог нэр"
                            autoComplete="name"
                            disabled={saving}
                            className={INPUT_CLASS}
                          />
                        </SettingsField>
                        <SettingsField id="phone" label="Утасны дугаар" icon={Phone}>
                          <input
                            id="phone"
                            type="tel"
                            inputMode="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="9911 2233"
                            autoComplete="tel"
                            disabled={saving}
                            className={INPUT_CLASS}
                          />
                        </SettingsField>
                        <SettingsField id="address" label="Гэрийн хаяг" icon={MapPin} multiline>
                          <textarea
                            id="address"
                            value={homeAddress}
                            onChange={(e) => setHomeAddress(e.target.value)}
                            placeholder="Дүүрэг, хороо, байр, тоот"
                            disabled={saving}
                            rows={3}
                            className={`${INPUT_CLASS} h-auto py-3 resize-none`}
                          />
                        </SettingsField>
                      </div>

                      <button
                        type="submit"
                        disabled={saving}
                        className="mt-8 inline-flex items-center gap-2 h-12 px-8 rounded-2xl bg-foreground text-background text-[15px] font-medium hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-70"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Хадгалж байна...
                          </>
                        ) : (
                          "Хадгалах"
                        )}
                      </button>
                    </form>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div
    className={`rounded-3xl bg-background border border-border/60 p-5 md:p-6 shadow-[0_8px_30px_-20px_rgba(0,0,0,0.25)] ${className}`}
  >
    {children}
  </div>
);

interface CardTitleProps {
  title: string;
  count?: number;
  action?: { label: string; onClick: () => void };
}

const CardTitle = ({ title, count, action }: CardTitleProps) => (
  <div className="flex items-center justify-between gap-3 mb-4">
    <p className="font-medium text-foreground">
      {title}
      {count !== undefined && <span className="ml-1.5 text-muted-foreground font-normal">({count})</span>}
    </p>
    {action && (
      <button
        onClick={action.onClick}
        className="group inline-flex items-center gap-1 text-sm text-primary-dark hover:text-foreground transition-colors"
      >
        {action.label}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </button>
    )}
  </div>
);

interface EmptyProps {
  icon: typeof Heart;
  text: string;
  cta?: string;
  onClick?: () => void;
}

const MiniEmpty = ({ icon: Icon, text, cta, onClick }: EmptyProps) => (
  <div className="h-28 rounded-2xl bg-secondary/60 flex flex-col items-center justify-center gap-2 px-4 text-center">
    <Icon className="h-5 w-5 text-primary" strokeWidth={1.6} />
    <p className="text-xs text-muted-foreground">{text}</p>
    {cta && (
      <button onClick={onClick} className="text-xs font-medium text-primary-dark underline underline-offset-4">
        {cta}
      </button>
    )}
  </div>
);

const BigEmpty = ({ icon: Icon, title, text, cta, onClick }: EmptyProps & { title: string }) => (
  <div className="flex flex-col items-center text-center py-14 px-6">
    <div className="relative">
      <div className="absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle,hsl(var(--sage-light)/0.5),transparent_70%)]" />
      <div className="relative h-16 w-16 rounded-full bg-background border border-border flex items-center justify-center shadow-sm">
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
      </div>
    </div>
    <p className="mt-6 text-base font-medium text-foreground">{title}</p>
    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
    {cta && (
      <button
        onClick={onClick}
        className="mt-6 inline-flex items-center gap-2 h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:bg-primary-dark transition-colors"
      >
        {cta} <ArrowRight className="h-4 w-4" />
      </button>
    )}
  </div>
);

const ActiveOrder = ({ order: o, onOpen }: { order: OrderRow; onOpen: () => void }) => {
  const meta = STATUS_BADGE[o.status as OrderStatus] ?? STATUS_BADGE.pending;
  const step = Math.max(0, STATUS_FLOW.indexOf(o.status as OrderStatus));
  const labels = ["Төлбөр", "Баталгаажсан", "Хүргэлтэнд", "Хүргэгдсэн"];

  return (
    <button onClick={onOpen} className="group w-full text-left rounded-2xl bg-secondary/60 hover:bg-secondary p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-muted-foreground">#{o.order_number}</p>
          <p className="mt-1 text-sm font-medium text-foreground truncate">{o.items?.[0]?.name ?? "—"}</p>
        </div>
        <span className="text-sm font-semibold tabular-nums">{(o.total_amount ?? 0).toLocaleString()}₮</span>
      </div>

      <div className="mt-4 flex items-center">
        {labels.map((label, i) => (
          <div key={label} className={`flex items-center ${i < labels.length - 1 ? "flex-1" : ""}`}>
            <span
              className={`h-3 w-3 rounded-full border-2 shrink-0 ${
                i <= step ? "bg-primary border-primary" : "bg-background border-border"
              } ${i === step ? "ring-4 ring-primary/20" : ""}`}
            />
            {i < labels.length - 1 && <span className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${meta.className}`}>
          <meta.Icon className="h-3 w-3" strokeWidth={2.2} />
          {meta.label}
        </span>
        <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground group-hover:text-foreground">
          Хянах <ChevronRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
};

const INPUT_CLASS =
  "w-full h-12 bg-transparent pl-11 pr-4 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none disabled:opacity-60";

interface SettingsFieldProps {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  multiline?: boolean;
  children: React.ReactNode;
}

const SettingsField = ({ id, label, icon: Icon, multiline, children }: SettingsFieldProps) => (
  <div className="space-y-1.5">
    <label htmlFor={id} className="text-sm font-medium text-foreground/80">
      {label}
    </label>
    <div className="group relative rounded-2xl bg-secondary/70 border border-transparent transition-all focus-within:bg-background focus-within:border-primary focus-within:shadow-[0_0_0_4px_hsl(var(--primary)/0.12)]">
      <Icon
        className={`absolute left-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary-dark ${
          multiline ? "top-4" : "top-1/2 -translate-y-1/2"
        }`}
      />
      {children}
    </div>
  </div>
);

interface OrderCardProps {
  order: OrderRow;
  index: number;
  onOpen: () => void;
}

const OrderCard = ({ order: o, index, onOpen }: OrderCardProps) => {
  const meta = STATUS_BADGE[o.status as OrderStatus] ?? STATUS_BADGE.pending;
  const StatusIcon = meta.Icon;
  const itemCount = (o.items ?? []).reduce((s, i) => s + (i.quantity ?? 0), 0);
  const firstItemName = o.items?.[0]?.name ?? "—";
  const moreCount = (o.items?.length ?? 0) - 1;
  const step = STATUS_FLOW.indexOf(o.status as OrderStatus);

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={onOpen}
      className="group w-full text-left p-5 md:p-6 rounded-3xl border border-border/70 bg-card hover:border-foreground/20 hover:shadow-[0_12px_32px_-16px_rgba(0,0,0,0.2)] transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-mono text-muted-foreground">
            #{o.order_number} ·{" "}
            {new Date(o.created_at).toLocaleDateString("mn-MN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p className="mt-1.5 text-[15px] font-medium text-foreground truncate">
            {firstItemName}
            {moreCount > 0 && <span className="text-muted-foreground font-normal"> +{moreCount} бусад</span>}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium shrink-0 ${meta.className}`}
        >
          <StatusIcon className="h-3 w-3" strokeWidth={2.2} />
          {meta.label}
        </span>
      </div>

      {step >= 0 && o.status !== "delivered" && (
        <div className="mt-4 grid grid-cols-4 gap-1.5">
          {STATUS_FLOW.map((s, i) => (
            <span
              key={s}
              className={`h-1 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{itemCount} бараа</span>
        <span className="flex items-center gap-3">
          <span className="text-base font-semibold text-foreground tabular-nums">
            {(o.total_amount ?? 0).toLocaleString()}₮
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </motion.button>
  );
};

export default Profile;
