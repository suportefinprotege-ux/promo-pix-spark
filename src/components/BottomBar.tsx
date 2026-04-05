import { Home, MessageCircle } from "lucide-react";

interface BottomBarProps {
  onBuy: () => void;
}

const BottomBar = ({ onBuy }: BottomBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 flex items-center">
      <button className="flex flex-col items-center justify-center px-4 py-2 text-muted-foreground">
        <Home className="w-5 h-5" />
        <span className="text-[10px]">Loja</span>
      </button>
      <button className="flex flex-col items-center justify-center px-4 py-2 text-muted-foreground">
        <MessageCircle className="w-5 h-5" />
        <span className="text-[10px]">Chat</span>
      </button>
      <div className="flex-1 flex">
        <button className="flex-1 py-3 text-sm font-semibold text-primary border-t-2 border-primary bg-badge">
          Adicionar ao carrinho
        </button>
        <button
          onClick={onBuy}
          className="flex-1 py-3 text-sm font-bold bg-primary text-primary-foreground"
        >
          COMPRAR
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
