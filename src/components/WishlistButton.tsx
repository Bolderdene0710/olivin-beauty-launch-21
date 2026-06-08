import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/use-toast";

interface WishlistButtonProps {
  productId: string;
  productName?: string;
  size?: "sm" | "md";
  className?: string;
}

const SAGE_DARK = "#5a7a4d";

export function WishlistButton({
  productId,
  productName,
  size = "md",
  className = "",
}: WishlistButtonProps) {
  const { isAuthenticated, isInWishlist, toggle, isPending } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();

  const active = isInWishlist(productId);
  const dimensions = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? 14 : 16;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: "Нэвтрэх шаардлагатай",
        description: "Хадгалахын тулд эхлээд нэвтэрнэ үү.",
      });
      navigate("/auth");
      return;
    }

    try {
      const result = await toggle(productId);
      toast({
        title:
          result === "added"
            ? "Хадгалсан барааны жагсаалтад нэмлээ!"
            : "Хадгалсан жагсаалтаас хаслаа",
        description: productName,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Алдаа гарлаа",
        description: err instanceof Error ? err.message : "Дахин оролдоно уу.",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={active ? "Хадгалсныг хасах" : "Хадгалах"}
      aria-pressed={active}
      className={`${dimensions} flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all hover:scale-110 disabled:opacity-50 ${className}`}
    >
      <Heart
        size={iconSize}
        strokeWidth={1.8}
        fill={active ? SAGE_DARK : "none"}
        color={active ? SAGE_DARK : "currentColor"}
        className="transition-colors"
      />
    </button>
  );
}

export default WishlistButton;
