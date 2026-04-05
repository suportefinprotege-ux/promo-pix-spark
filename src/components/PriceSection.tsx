import CountdownTimer from "./CountdownTimer";

const PriceSection = () => {
  return (
    <div className="px-3 py-3 space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-sale">R$ 47,90</span>
        <span className="text-sm text-price-old line-through">R$ 589,43</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="bg-sale text-sale-foreground text-xs font-bold px-2 py-0.5 rounded">
          -85%
        </span>
        <span className="text-xs text-success font-semibold">
          Economize R$490,46
        </span>
      </div>

      <CountdownTimer />

      <div className="bg-badge rounded-md px-3 py-2 text-xs text-badge font-medium">
        Economize até 81% — Economize 85% COM CUPOM
      </div>
    </div>
  );
};

export default PriceSection;
