import { Truck, ChevronRight, CheckCircle } from "lucide-react";

const ShippingInfo = () => {
  return (
    <div className="space-y-0">
      {/* Shipping estimate */}
      <div className="px-3 py-3 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Frete grátis
                </span>
                <span className="text-sm text-muted-foreground line-through">R$ 9,60</span>
              </div>
              <p className="text-sm text-foreground mt-0.5">Receba até 7–10 de abr</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      {/* Customer protection */}
      <div className="bg-success/5 px-3 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="text-success font-bold text-sm">Proteção do cliente</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 pl-7">
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <span className="text-success text-xs">●</span>
            Devolução gratuita
          </div>
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <span className="text-success text-xs">●</span>
            Pagamento seguro
          </div>
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <span className="text-success text-xs">●</span>
            Reembolso automático por dano
          </div>
          <div className="flex items-center gap-1.5 text-xs text-foreground">
            <span className="text-success text-xs">●</span>
            Cupom por atraso na coleta
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
