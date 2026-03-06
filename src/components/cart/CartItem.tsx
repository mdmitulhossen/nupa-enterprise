import { CartItem as CartItemType, useCartStore } from "@/store/cartStore";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex items-center gap-4 p-4 border-b border-border last:border-b-0">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-cover rounded-lg border border-border flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.sku}</p>
        <p className="text-sm font-semibold mt-1">BDT {item.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Minus className="w-3 h-3" />
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          disabled={item.quantity >= item.stock}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
      <div className="flex-shrink-0 text-right min-w-[80px]">
        <p className="font-semibold text-sm">
          BDT {(Number(item.price) * item.quantity).toLocaleString()}
        </p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-destructive hover:text-destructive/80 mt-1 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;