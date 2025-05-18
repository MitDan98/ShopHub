
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

export const CartItem = ({
  id,
  title,
  price,
  image,
  quantity,
  updateQuantity,
  removeFromCart,
}: CartItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4">
      <img src={image} alt={title} className="w-24 h-24 object-cover rounded" />
      <div className="flex-1">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-primary font-bold">${price}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(id, Math.max(0, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => updateQuantity(id, quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto text-red-500 hover:text-red-600"
            onClick={() => removeFromCart(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
