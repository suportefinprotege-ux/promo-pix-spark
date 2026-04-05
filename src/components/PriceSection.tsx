import CountdownTimer from "./CountdownTimer";

const PriceSection = () => {
  return (
    <div>
      {/* Orange banner */}
      <div className="bg-sale px-3 py-3 space-y-2">
        {/* Price row with countdown */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-white">R$ 47,90</span>
            <span className="text-sm text-white/70 line-through flex items-center gap-0.5">
              <span className="text-xs">🏷️</span> R$ 589,43
            </span>
            <span className="text-sm text-white font-semibold">Economize 85%</span>
          </div>
          <CountdownTimer />
        </div>

        {/* Savings badges */}
        <div className="flex items-center gap-2">
          <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded">
            Economize R$490,46
          </span>
          <span className="border border-white/50 text-white text-xs font-bold px-2.5 py-1 rounded">
            Economize 85% COM CUPOM
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceSection;
