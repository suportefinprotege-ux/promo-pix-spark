import { Bookmark } from "lucide-react";

const ProductInfo = () => {
  return (
    <div className="px-3 py-2 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h1 className="text-sm font-semibold text-foreground leading-snug flex-1">
          Aparelho de Jantar e Cha Porcelana 30 Pecas Ryo Maresia Jogo de Pratos e Xicaras Oxford
        </h1>
        <Bookmark className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-star text-base">★</span>
        <span className="font-semibold">4.7</span>
        <span className="text-muted-foreground">(204)</span>
        <span className="text-muted-foreground">|</span>
        <span className="text-muted-foreground">4473 vendidos</span>
      </div>
    </div>
  );
};

export default ProductInfo;
