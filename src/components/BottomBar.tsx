import { Store, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { PRODUCTS } from "@/data/products";
import { ttqTrack } from "@/lib/tiktok-pixel";
import { toast } from "sonner";

interface BottomBarProps {
  onBuy: () => void;
  onChat: () => void;
  onStore: () => void;
  onCartOpen: () => void;
}

const BottomBar = ({ onBuy, onChat, onStore, onCartOpen }: BottomBarProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const product = PRODUCTS[0];
    const added = addToCart(product);
    if (added) {
      toast.success("Adicionado ao carrinho!");
      onCartOpen();
    } else {
      toast.error("Limite de 2 unidades por produto!");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 flex items-center max-w-lg mx-auto">
      <button onClick={onStore} className="flex flex-col items-center justify-center px-4 py-2 text-muted-foreground">
        <Store className="w-5 h-5" />
        <span className="text-[10px]">Loja</span>
      </button>
      <button onClick={onChat} className="flex flex-col items-center justify-center px-4 py-2 text-muted-foreground">
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px]">Chat</span>
      </button>
      <div className="flex-1 flex gap-2 px-2 py-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 py-2.5 text-sm font-semibold text-primary border-2 border-primary rounded-full bg-background"
        >
          Adicionar ao carrinho
        </button>
        <button
          onClick={onBuy}
          className="flex-1 py-2.5 text-sm font-bold bg-sale text-white rounded-full flex flex-col items-center leading-tight"
        >
          <span>Comprar agora</span>
          <span className="text-[10px] font-normal opacity-90">Frete grátis</span>
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
