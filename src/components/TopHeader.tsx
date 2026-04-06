import { ArrowLeft, Search, Share, ShoppingCart, MoreHorizontal } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

interface TopHeaderProps {
  onCartOpen?: () => void;
}

const TopHeader = ({ onCartOpen }: TopHeaderProps) => {
  const { totalItems } = useCart();

  return (
    <div className="sticky top-0 z-30 bg-background flex items-center gap-2 px-3 py-2 border-b border-border">
      <button className="p-1 text-foreground flex-shrink-0">
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className="flex-1 flex items-center bg-secondary rounded-lg px-3 py-1.5 gap-2">
        <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="text-sm text-muted-foreground">Kit Pratos Oxford</span>
      </div>
      <button className="p-1 text-foreground flex-shrink-0">
        <Share className="w-5 h-5" />
      </button>
      <button onClick={onCartOpen} className="p-1 text-foreground flex-shrink-0 relative">
        <ShoppingCart className="w-5 h-5" />
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-sale text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
      </button>
      <button className="p-1 text-foreground flex-shrink-0">
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TopHeader;
