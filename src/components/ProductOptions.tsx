const OPTIONS = [
  { qty: 262, available: true },
  { qty: 24, available: false },
  { qty: 48, available: false },
  { qty: 60, available: false },
  { qty: 80, available: false },
  { qty: 100, available: false },
];

const ProductOptions = () => {
  return (
    <div className="px-3 py-3">
      <p className="text-sm font-semibold mb-2">Selecionar opções — Quantidade</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.qty}
            disabled={!opt.available}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              opt.available
                ? "border-primary text-primary bg-badge"
                : "border-border text-muted-foreground bg-muted opacity-50 cursor-not-allowed"
            }`}
          >
            {opt.qty}
            {!opt.available && (
              <span className="block text-[10px]">Esgotado</span>
            )}
            {opt.available && (
              <span className="block text-[10px]">Disponível</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductOptions;
