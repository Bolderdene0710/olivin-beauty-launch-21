import { cn } from "@/lib/utils";

interface PriceTagProps {
  price: string;
  compareAtPrice?: string | null;
  discountPercent?: number | null;
  className?: string;
  priceClassName?: string;
}

// Shows the price a customer pays; while on sale also the struck-through
// original price and the discount percentage.
const PriceTag = ({ price, compareAtPrice, discountPercent, className, priceClassName }: PriceTagProps) => (
  <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
    <span className={cn("font-semibold tabular-nums", compareAtPrice && "text-red-600", priceClassName)}>
      {price}
    </span>
    {compareAtPrice && (
      <>
        <span className="text-xs text-muted-foreground line-through tabular-nums">{compareAtPrice}</span>
        {discountPercent ? (
          <span className="rounded-full bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
            -{discountPercent}%
          </span>
        ) : null}
      </>
    )}
  </div>
);

export default PriceTag;
