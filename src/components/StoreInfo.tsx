const StoreInfo = () => {
  return (
    <div className="px-3 py-3 border-t border-border">
      <div className="flex items-center gap-3">
        <img
          src="https://panpannovapromo.site/ofertas/pratos/images/logo_oxford.png"
          alt="Oxford"
          className="w-12 h-12 rounded-full object-contain bg-secondary p-1"
        />
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm">Oxford</span>
            <span className="bg-success text-success-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
              Loja Verificada
            </span>
          </div>
          <p className="text-xs text-muted-foreground">1706 produtos • 100% recomenda</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Confiança</p>
          <p className="text-sm font-bold text-success">100%</p>
        </div>
      </div>
    </div>
  );
};

export default StoreInfo;
