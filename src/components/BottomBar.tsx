import { Store, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { trackTikTokEvent } from "@/lib/tiktok-server";
import { toast } from "sonner";

interface BottomBarProps {
  product: Product;
  onChat: () => void;
  onStore: () => void;
  onCartOpen: () => void;
}

const BottomBar = ({ product, onChat, onStore, onCartOpen }: BottomBarProps) => {
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const trackAddToCart = () => {
    trackTikTokEvent("AddToCart", {
      content_id: String(product.id),
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "BRL",
    });
  };

  const handleAddToCart = () => {
    const added = addToCart(product);
    if (added) {
      trackAddToCart();
      toast.success("Adicionado ao carrinho!");
      onCartOpen();
      return;
    }

    toast.error("Limite de 2 unidades por produto!");
  };

  const handleBuyNow = () => {
    const alreadyInCart = items.some((item) => item.product.id === product.id);

    if (!alreadyInCart) {
      const added = addToCart(product);
      if (!added) {
        toast.error("Limite de 2 unidades por produto!");
        return;
      }
      trackAddToCart();
    }

    navigate("/checkout");
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
          onClick={handleBuyNow}
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
