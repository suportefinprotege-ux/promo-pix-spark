import { Store, MessageCircle } from "lucide-react";

interface BottomBarProps {
  onBuy: () => void;
}

const BottomBar = ({ onBuy }: BottomBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 flex items-center max-w-lg mx-auto">
      <button className="flex flex-col items-center justify-center px-4 py-2 text-muted-foreground">
        <Store className="w-5 h-5" />
        <span className="text-[10px]">Loja</span>
      </button>
      <button className="flex flex-col items-center justify-center px-4 py-2 text-muted-foreground">
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px]">Chat</span>
      </button>
      <div className="flex-1 flex gap-2 px-2 py-2">
        <button className="flex-1 py-2.5 text-sm font-semibold text-primary border-2 border-primary rounded-full bg-background">
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
