import { useLocation, useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle2, MapPin, Clock, ArrowLeft, ShieldCheck, Copy, Check, Box, Warehouse } from "lucide-react";
import { useState, useEffect } from "react";
import tiktokLogo from "@/assets/faixa_2.png";
import tiktokShopBanner from "@/assets/faixa_1.jpg";

interface OrderState {
  name: string;
  cidade: string;
  estado: string;
  bairro: string;
  endereco: string;
  numero: string;
  cep: string;
  quantity: number;
  total: string;
  shippingLabel: string;
  shippingDays: string;
  email: string;
  phone: string;
}

const generateTrackingCode = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "TK";
  for (let i = 0; i < 11; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  code += "BR";
  return code;
};

const generateOrderNumber = () => {
  return `#${Math.floor(100000000 + Math.random() * 900000000)}`;
};

const OrderTracking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [trackingCode] = useState(generateTrackingCode);
  const [orderNumber] = useState(generateOrderNumber);

  const locationState = location.state as OrderState | null;

  const order: OrderState = locationState || {
    name: "Cliente Demonstração",
    cidade: "São Paulo",
    estado: "SP",
    bairro: "Centro",
    endereco: "Rua Exemplo",
    numero: "123",
    cep: "01001-000",
    quantity: 1,
    total: "47,90",
    shippingLabel: "PAC",
    shippingDays: "de 7 até 10 dias",
    email: "cliente@email.com",
    phone: "(11) 99999-9999",
  };


  const now = new Date();
  const formatDate = (d: Date) =>
    `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()} - ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;

  const timelineSteps = [
    {
      icon: <CheckCircle2 className="w-5 h-5" />,
      title: "Pedido confirmado",
      subtitle: "Pagamento aprovado via Pix",
      time: formatDate(now),
      done: true,
    },
    {
      icon: <Box className="w-5 h-5" />,
      title: "Pedido recebido pelo vendedor",
      subtitle: `${order.cidade} - ${order.estado}`,
      time: formatDate(new Date(now.getTime() + 2 * 60000)),
      done: true,
    },
    {
      icon: <Warehouse className="w-5 h-5" />,
      title: "Em separação no centro de distribuição",
      subtitle: "Produto sendo preparado para envio",
      time: formatDate(new Date(now.getTime() + 15 * 60000)),
      done: true,
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: "Produto embalado",
      subtitle: "Aguardando coleta da transportadora",
      time: null,
      done: false,
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Em trânsito para sua cidade",
      subtitle: `Destino: ${order.cidade} - ${order.estado}`,
      time: null,
      done: false,
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Entregue",
      subtitle: `${order.endereco}, ${order.numero} - ${order.bairro}`,
      time: null,
      done: false,
    },
  ];

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const firstName = order.name.split(" ")[0];

  return (
    <div className="min-h-screen bg-secondary/30 max-w-lg mx-auto pb-8">
      {/* Header */}
      <div className="bg-background px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate("/")} className="p-1 text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <img src={tiktokLogo} alt="TikTok" className="h-6 object-contain" />
        </div>
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-success" />
          <div className="text-right leading-tight">
            <p className="text-[10px] font-bold text-foreground uppercase tracking-wide">PEDIDO</p>
            <p className="text-[10px] font-bold text-success uppercase">CONFIRMADO</p>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="w-full">
        <img src={tiktokShopBanner} alt="TikTok Shop" className="w-full h-auto object-cover" />
      </div>

      {/* Success Card */}
      <div className="bg-background mx-3 mt-4 rounded-xl p-5 text-center space-y-2">
        <div className="w-14 h-14 bg-success/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7 text-success" />
        </div>
        <h2 className="text-lg font-bold text-foreground">
          Obrigado, {firstName}! 🎉
        </h2>
        <p className="text-sm text-muted-foreground">
          Seu pedido foi confirmado e já está sendo processado.
        </p>
      </div>

      {/* Order Info */}
      <div className="bg-background mx-3 mt-3 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-foreground text-sm">Detalhes do pedido</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nº do pedido</span>
            <span className="font-semibold text-foreground">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Quantidade</span>
            <span className="text-foreground">{order.quantity}x Conjunto 30 Peças Perfeitas</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total pago</span>
            <span className="font-bold text-success">R$ {order.total}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Entrega</span>
            <span className="text-foreground">{order.shippingLabel} ({order.shippingDays})</span>
          </div>
        </div>
      </div>

      {/* Tracking Code */}
      <div className="bg-background mx-3 mt-3 rounded-xl p-4 space-y-3">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          Código de rastreio
        </h3>
        <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
          <div>
            <p className="font-mono font-bold text-foreground text-sm tracking-wider">{trackingCode}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Use para acompanhar seu pedido</p>
          </div>
          <button
            onClick={handleCopyTracking}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg flex items-center gap-1.5 text-xs font-medium"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-background mx-3 mt-3 rounded-xl p-4 space-y-2">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Endereço de entrega
        </h3>
        <div className="text-sm text-muted-foreground space-y-0.5">
          <p className="text-foreground font-medium">{order.name}</p>
          <p>{order.endereco}, {order.numero}</p>
          <p>{order.bairro} - {order.cidade}/{order.estado}</p>
          <p>CEP: {order.cep}</p>
        </div>
      </div>

      {/* Tracking Timeline */}
      <div className="bg-background mx-3 mt-3 rounded-xl p-4 space-y-4">
        <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Rastreamento do pedido
        </h3>
        <div className="space-y-0">
          {timelineSteps.map((step, i) => {
            const isLast = i === timelineSteps.length - 1;
            return (
              <div key={i} className="flex gap-3">
                {/* Vertical line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.done
                        ? "bg-success text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.icon}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 flex-1 min-h-[32px] ${
                        step.done && timelineSteps[i + 1]?.done
                          ? "bg-success"
                          : "bg-border"
                      }`}
                    />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
                  <p
                    className={`text-sm font-semibold ${
                      step.done ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                  {step.time && (
                    <p className="text-[11px] text-muted-foreground/70 mt-0.5">{step.time}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Help info */}
      <div className="mx-3 mt-3 p-4 bg-success/5 rounded-xl border border-success/20">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Compra protegida</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Você será notificado por e-mail e SMS sobre cada atualização do seu pedido. Em caso de problemas, entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
