import CountdownTimer from "./CountdownTimer";

const PriceSection = () => {
  return (
    <div className="px-3 py-3 space-y-2">
      {/* Price row with countdown */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-sale">R$ 47,90</span>
          <span className="text-sm text-price-old line-through flex items-center gap-0.5">
            <span className="text-xs">🏷️</span> R$ 589,43
          </span>
          <span className="text-sm text-success font-semibold">Economize 85%</span>
        </div>
        <CountdownTimer />
      </div>

      {/* Savings badges */}
      <div className="flex items-center gap-2">
        <span className="bg-sale text-sale-foreground text-xs font-bold px-2.5 py-1 rounded">
          Economize R$490,46
        </span>
        <span className="border border-sale text-sale text-xs font-bold px-2.5 py-1 rounded">
          Economize 85% COM CUPOM
        </span>
      </div>
    </div>
  );
};

export default PriceSection;
