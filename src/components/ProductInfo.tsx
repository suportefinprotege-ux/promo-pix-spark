const ProductInfo = () => {
  return (
    <div className="px-3 py-2 space-y-2">
      <div className="flex items-start gap-2">
        <span className="bg-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
          💜 OFERTA DIA DA MULHER
        </span>
        <h1 className="text-sm font-semibold text-foreground leading-snug">
          Aparelho de Jantar e Cha Porcelana 30 Pecas Ryo Maresia Jogo de Pratos e Xicaras Oxford
        </h1>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-0.5">
          <span className="text-star">★</span>
        </div>
        <span className="font-semibold">4.7</span>
        <span className="text-muted-foreground">(204)</span>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">4473 vendidos</span>
      </div>
    </div>
  );
};

export default ProductInfo;
