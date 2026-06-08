import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, QrCode, Building2, AlertTriangle, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  totalAmount: number;
}

const PaymentModal = ({ open, onOpenChange, orderNumber, totalAmount }: PaymentModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({ title: "Хуулагдлаа!", duration: 1500 });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const bankDetails = [
    { label: "Банкны нэр", value: "Хаан Банк", key: "bank" },
    { label: "Дансны нэр", value: "OLIVIN LLC", key: "name" },
    { label: "Дансны дугаар", value: "5037716403", key: "account" },
    { label: "Мөнгөн дүн", value: `${totalAmount.toLocaleString()}₮`, key: "amount" },
    { label: "Гүйлгээний утга", value: orderNumber, key: "desc" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border-border/40 font-[Roboto]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-6">
            <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-5" />
            <p className="text-base font-medium text-foreground">Нэхэмжлэл үүсгэж байна...</p>
            <p className="text-sm text-muted-foreground mt-1">Түр хүлээнэ үү</p>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-0">
              <DialogTitle className="text-xl font-semibold font-[Roboto] text-center">
                Төлбөр төлөх
              </DialogTitle>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Захиалгын дугаар: <span className="font-mono font-medium text-foreground">{orderNumber}</span>
              </p>
            </DialogHeader>

            <Tabs defaultValue="qr" className="px-6 pb-6 pt-4">
              <TabsList className="w-full grid grid-cols-2 h-11 rounded-xl bg-secondary">
                <TabsTrigger value="qr" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <QrCode className="w-4 h-4 mr-1.5" />
                  QR кодоор төлөх
                </TabsTrigger>
                <TabsTrigger value="bank" className="rounded-lg text-sm font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Building2 className="w-4 h-4 mr-1.5" />
                  Дансаар шилжүүлэх
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="mt-5">
                <div className="flex flex-col items-center">
                  <div className="w-56 h-56 bg-secondary rounded-2xl flex items-center justify-center border border-border/40 mb-4">
                    <div className="text-center">
                      <QrCode className="w-24 h-24 text-muted-foreground/40 mx-auto" />
                      <p className="text-xs text-muted-foreground mt-2">QR код</p>
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-foreground mb-1">
                    {totalAmount.toLocaleString()}₮
                  </p>
                  <p className="text-sm text-muted-foreground mb-5">Төлөх дүн</p>
                  <Button className="w-full h-12 rounded-xl text-base font-medium bg-foreground text-background hover:bg-foreground/90">
                    Төлбөр шалгах
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="mt-5">
                <div className="space-y-0 rounded-xl border border-border/40 overflow-hidden">
                  {bankDetails.map((detail, i) => (
                    <div
                      key={detail.key}
                      className={`flex items-center justify-between px-4 py-3.5 ${
                        i < bankDetails.length - 1 ? "border-b border-border/40" : ""
                      }`}
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">{detail.label}</p>
                        <p className="font-medium text-sm mt-0.5">{detail.value}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(detail.value, detail.key)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        {copiedField === detail.key ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3.5 rounded-xl bg-[#fef9e7] border border-[#f5e6a3] flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-[#d4a017] mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-[#8a6d0b] leading-relaxed">
                    Гүйлгээний утга дээрх захиалгын дугаарыг заавал бичнэ үү!
                  </p>
                </div>

                <Button className="w-full h-12 rounded-xl text-base font-medium mt-4 bg-foreground text-background hover:bg-foreground/90">
                  Төлбөр шалгах
                </Button>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
