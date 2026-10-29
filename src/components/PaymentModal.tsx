import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Copy, QrCode, Building2, AlertTriangle, Check, Loader2, Clock, PackageCheck, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fetchOrderByNumber } from "@/lib/supabase";
import { STORE_BANK } from "@/lib/storeInfo";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  totalAmount: number;
}

type Method = "bank" | "qr";
type PaymentState = "waiting" | "checking" | "paid" | "cancelled";

// Admin moves an order out of "pending" once the transfer is verified.
const POLL_MS = 8000;
const PAID_STATUSES = ["confirmed", "shipped", "delivered"];

const statusToState = (status: string | null | undefined): PaymentState | null => {
  if (!status) return null;
  if (PAID_STATUSES.includes(status)) return "paid";
  if (status === "cancelled") return "cancelled";
  return "waiting";
};

const PaymentModal = ({ open, onOpenChange, orderNumber, totalAmount }: PaymentModalProps) => {
  const [method, setMethod] = useState<Method>("bank");
  const [paymentState, setPaymentState] = useState<PaymentState>("waiting");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) setPaymentState("waiting");
  }, [open, orderNumber]);

  const checkPayment = useCallback(async () => {
    setPaymentState("checking");
    let next: PaymentState | null = null;
    try {
      next = statusToState((await fetchOrderByNumber(orderNumber))?.status);
    } catch {
      next = null;
    }
    if (!next) {
      setPaymentState("waiting");
      toast({ title: "Шалгахад алдаа гарлаа", description: "Дахин оролдоно уу.", variant: "destructive" });
      return;
    }

    setPaymentState(next);
    if (next === "waiting") {
      toast({
        title: "Төлбөр хараахан баталгаажаагүй байна",
        description: "Шилжүүлсний дараа баталгаажихад хэдэн минут шаардагдана.",
      });
    }
  }, [orderNumber, toast]);

  // Poll quietly while waiting so the modal flips as soon as admin confirms.
  // (Guests can't receive realtime events for orders under RLS.)
  useEffect(() => {
    if (!open || !orderNumber || paymentState !== "waiting") return;
    const timer = setInterval(async () => {
      try {
        const next = statusToState((await fetchOrderByNumber(orderNumber))?.status);
        if (next && next !== "waiting") setPaymentState(next);
      } catch {
        // Ignore transient errors; the next tick or the manual check will retry.
      }
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [open, orderNumber, paymentState]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast({ title: "Хуулж чадсангүй", variant: "destructive" });
    }
  };

  const bankDetails = [
    { label: "Банк", value: STORE_BANK.bank, key: "bank" },
    { label: "Дансны нэр", value: STORE_BANK.accountName, key: "name" },
    { label: "Дансны дугаар", value: STORE_BANK.accountNumber, key: "account", mono: true },
    { label: "Гүйлгээний утга", value: orderNumber, key: "desc", mono: true, highlight: true },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden rounded-[28px] border-0 shadow-2xl font-[Roboto] max-h-[92vh] overflow-y-auto">
        <AnimatePresence mode="wait" initial={false}>
          {paymentState === "paid" ? (
            <ResultView
              key="paid"
              tone="success"
              title="Төлбөр баталгаажлаа!"
              text="Таны захиалгыг хүлээн авлаа. Удахгүй хүргэлтэнд гарна."
              orderNumber={orderNumber}
              onClose={() => onOpenChange(false)}
            />
          ) : paymentState === "cancelled" ? (
            <ResultView
              key="cancelled"
              tone="error"
              title="Захиалга цуцлагдсан"
              text="Асуух зүйл байвал бидэнтэй холбогдоно уу."
              orderNumber={orderNumber}
              onClose={() => onOpenChange(false)}
            />
          ) : (
            <motion.div
              key="pay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              {/* Amount header */}
              <div className="relative px-6 pt-7 pb-6 text-center bg-[radial-gradient(ellipse_at_top,hsl(var(--sage-light)/0.55),transparent_70%)]">
                <DialogTitle className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                  Төлөх дүн
                </DialogTitle>
                <p className="mt-2 text-4xl font-semibold tracking-tight text-foreground tabular-nums">
                  {totalAmount.toLocaleString()}
                  <span className="text-2xl text-muted-foreground ml-0.5">₮</span>
                </p>
                <DialogDescription asChild>
                  <button
                    onClick={() => copyToClipboard(orderNumber, "order")}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-background/80 border border-border text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Захиалга <span className="font-mono text-foreground">#{orderNumber}</span>
                    {copiedField === "order" ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                  </button>
                </DialogDescription>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-amber-700">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                  Төлбөр хүлээгдэж байна
                </div>
              </div>

              <div className="px-6 pb-6">
                {/* Method switch */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-secondary">
                  {([
                    { value: "bank", label: "Дансаар", icon: Building2 },
                    { value: "qr", label: "QPay", icon: QrCode },
                  ] as const).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setMethod(value)}
                      className={`relative flex items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-medium transition-colors ${
                        method === value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {method === value && (
                        <motion.span
                          layoutId="payment-method"
                          className="absolute inset-0 rounded-xl bg-background shadow-sm"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}
                      <Icon className="relative w-4 h-4" />
                      <span className="relative">{label}</span>
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait" initial={false}>
                  {method === "bank" ? (
                    <motion.div
                      key="bank"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.18 }}
                      className="mt-5"
                    >
                      <div className="rounded-2xl border border-border/70 divide-y divide-border/70">
                        {bankDetails.map((detail) => (
                          <button
                            key={detail.key}
                            onClick={() => copyToClipboard(detail.value, detail.key)}
                            className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                              detail.highlight ? "bg-primary/[0.07] hover:bg-primary/[0.12]" : "hover:bg-secondary/70"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-[11px] text-muted-foreground">{detail.label}</p>
                              <p
                                className={`mt-0.5 text-[15px] font-medium text-foreground truncate ${
                                  detail.mono ? "font-mono tracking-wide" : ""
                                }`}
                              >
                                {detail.value}
                              </p>
                            </div>
                            <span
                              className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                copiedField === detail.key
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {copiedField === detail.key ? (
                                <>
                                  <Check className="w-3.5 h-3.5" /> Хуулсан
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" /> Хуулах
                                </>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>

                      <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-amber-800 leading-relaxed">
                          Гүйлгээний утга дээр <b className="font-mono">{orderNumber}</b> гэж заавал бичнэ үү. Үгүй бол
                          төлбөр тань автоматаар тулгагдахгүй.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="qr"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      className="mt-5 flex flex-col items-center text-center py-8 px-4 rounded-2xl border border-dashed border-border"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                        <Clock className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="mt-4 font-medium text-foreground">QPay тун удахгүй</p>
                      <p className="mt-1 text-sm text-muted-foreground max-w-[260px]">
                        Одоогоор дансаар шилжүүлэх боломжтой. QPay төлбөрийг удахгүй нэмнэ.
                      </p>
                      <button
                        onClick={() => setMethod("bank")}
                        className="mt-5 text-sm font-medium text-primary-dark underline underline-offset-4"
                      >
                        Дансаар төлөх
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button
                  onClick={checkPayment}
                  disabled={paymentState === "checking"}
                  className="mt-5 w-full h-12 rounded-2xl bg-foreground text-background text-[15px] font-medium flex items-center justify-center gap-2 hover:bg-primary-dark active:scale-[0.99] transition-all disabled:opacity-70"
                >
                  {paymentState === "checking" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Шалгаж байна...
                    </>
                  ) : (
                    "Би төлсөн, шалгах"
                  )}
                </button>
                <p className="mt-3 text-[11px] text-center text-muted-foreground">
                  Төлбөр баталгаажмагц энэ цонх автоматаар шинэчлэгдэнэ.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

interface ResultViewProps {
  tone: "success" | "error";
  title: string;
  text: string;
  orderNumber: string;
  onClose: () => void;
}

const ResultView = ({ tone, title, text, orderNumber, onClose }: ResultViewProps) => {
  const Icon = tone === "success" ? PackageCheck : XCircle;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="px-6 py-12 flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
        className={`w-20 h-20 rounded-full flex items-center justify-center ${
          tone === "success" ? "bg-primary/15 text-primary-dark" : "bg-destructive/10 text-destructive"
        }`}
      >
        <Icon className="w-9 h-9" />
      </motion.div>
      <DialogTitle className="mt-6 text-2xl font-semibold">{title}</DialogTitle>
      <DialogDescription className="mt-2 text-sm text-muted-foreground max-w-[280px]">{text}</DialogDescription>
      <p className="mt-4 text-xs text-muted-foreground">
        Захиалга <span className="font-mono text-foreground">#{orderNumber}</span>
      </p>
      <button
        onClick={onClose}
        className="mt-8 w-full h-12 rounded-2xl bg-foreground text-background text-[15px] font-medium hover:bg-primary-dark transition-colors"
      >
        Захиалгаа хянах
      </button>
    </motion.div>
  );
};

export default PaymentModal;
