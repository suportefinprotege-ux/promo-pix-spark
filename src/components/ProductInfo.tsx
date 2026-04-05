const ProductInfo = () => {
  return (
    <div className="px-3 py-2 space-y-2">
      <h1 className="text-base font-bold text-foreground leading-tight">
        ❤️ OFERTA DIA DA MULHER — Aparelho de Jantar e Chá Porcelana 30 Peças Ryo Maresia Jogo de Pratos e Xícaras Oxford
      </h1>

      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className={i <= 4 ? "text-star" : "text-star opacity-60"}>
              ★
            </span>
          ))}
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
