import { Card } from "@/components/ui/card";

interface ProductCardProps {
  image: string;
  name: string;
  brand: string;
  price: string;
}

const ProductCard = ({ image, name, brand, price }: ProductCardProps) => {
  return (
    <Card className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-xl min-w-[280px] bg-card">
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-6 space-y-2">
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          {brand}
        </p>
        <h3 className="font-semibold text-lg text-foreground line-clamp-2">
          {name}
        </h3>
        <p className="text-xl font-bold text-primary">
          {price}
        </p>
      </div>
    </Card>
  );
};

export default ProductCard;
