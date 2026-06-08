import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WishlistButton } from "@/components/WishlistButton";

interface ProductCardProps {
  id: string;
  image: string;
  name: string;
  brand: string;
  price: string;
}

const ProductCard = ({ id, image, name, brand, price }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${id}`);
  };

  return (
    <Card
      className="group overflow-hidden border-border hover:border-primary transition-all duration-300 hover:shadow-xl min-w-[280px] bg-card cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 z-10">
          <WishlistButton productId={id} productName={name} />
        </div>
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
