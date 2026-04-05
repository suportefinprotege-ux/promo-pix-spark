import CountdownTimer from "./CountdownTimer";

const PriceSection = () => {
  return (
    <div>
      {/* Orange gradient banner - Shopee style */}
      <div className="bg-gradient-to-r from-[#f53d2d] to-[#ff6633] px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-xs font-extrabold px-1.5 py-0.5 rounded">
              -85%
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-white/80 text-xs">A partir de R$</span>
              <span className="text-3xl font-extrabold text-white">47,90</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-white font-bold text-sm">
              <span>⚡</span>
              <span>Oferta Relâmpago</span>
            </div>
            <CountdownTimer />
          </div>
        </div>
        <p className="text-white/60 text-xs line-through mt-0.5">R$ 589,43</p>
      </div>


      {/* Savings badge */}
      <div className="px-3 py-2">
        <span className="bg-success/10 text-success text-xs font-bold px-2.5 py-1 rounded">
          Economize R$490,46 com bônus
        </span>
      </div>
    </div>
  );
};

export default PriceSection;
