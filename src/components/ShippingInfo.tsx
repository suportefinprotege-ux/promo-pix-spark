import { Truck, Shield, RotateCcw, Clock } from "lucide-react";

const ShippingInfo = () => {
  return (
    <div className="px-3 py-3 space-y-3">
      <div className="border border-border rounded-lg p-3 space-y-3">
        <div className="flex items-center gap-3">
          <Truck className="w-5 h-5 text-success flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Receba até 8–13 de abr.</p>
            <p className="text-xs text-success font-semibold">Taxa de envio: Grátis</p>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-sm font-semibold mb-2">Proteção do cliente</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <RotateCcw className="w-3.5 h-3.5" />
              Devolução gratuita
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              Pagamento seguro
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              Reembolso por dano
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Cupom por atraso
            </div>
          </div>
        </div>
      </div>

      <div className="bg-success/10 border border-success/20 rounded-lg p-3 flex items-center gap-2">
        <span className="text-success font-bold text-sm">🚚 Frete Grátis</span>
        <span className="text-xs text-muted-foreground">Entrega gratuita para todo o Brasil acima de R$50</span>
      </div>
    </div>
  );
};

export default ShippingInfo;
