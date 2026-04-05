import { useState, useEffect, useRef } from "react";
import { X, Copy, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const PRODUCT_VALUE_CENTS = 4790; // R$ 47,90

const CheckoutModal = ({ open, onClose }: CheckoutModalProps) => {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [step, setStep] = useState<"form" | "pix">("form");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    id: string;
    qr_code: string;
    qr_code_base64: string;
    status: string;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("created");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleCopy = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const createPixCharge = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-pix", {
        body: { value: PRODUCT_VALUE_CENTS },
      });

      if (error) throw error;

      setPixData(data);
      setPaymentStatus("created");
      setStep("pix");
      startPolling(data.id);
    } catch (err) {
      console.error("Erro ao criar cobrança Pix:", err);
      alert("Erro ao gerar cobrança Pix. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async (transactionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke("check-pix", {
        body: {},
        headers: {},
      });

      // Use query params via direct fetch instead
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const url = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(
        `${url}/functions/v1/check-pix?id=${transactionId}`,
        {
          headers: {
            Authorization: `Bearer ${anonKey}`,
            apikey: anonKey,
          },
        }
      );

      if (!response.ok) return;

      const result = await response.json();
      if (result.status) {
        setPaymentStatus(result.status);
        if (result.status === "paid") {
          stopPolling();
        }
      }
    } catch (err) {
      console.error("Erro ao verificar pagamento:", err);
    }
  };

  const startPolling = (transactionId: string) => {
    stopPolling();
    pollRef.current = setInterval(() => {
      checkPaymentStatus(transactionId);
    }, 5000);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && cpf) {
      createPixCharge();
    }
  };

  const handleClose = () => {
    stopPolling();
    setStep("form");
    setPixData(null);
    setPaymentStatus("created");
    onClose();
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-foreground/50" onClick={handleClose} />
      <div className="relative bg-background w-full max-w-lg rounded-t-2xl p-5 pb-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 text-muted-foreground">
          <X className="w-5 h-5" />
        </button>

        {/* Product summary */}
        <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
          <img
            src="https://panpannovapromo.site/ofertas/pratos/images/img1.jpg"
            alt="Produto"
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <span className="bg-sale text-sale-foreground text-xs font-bold px-2 py-0.5 rounded">
              -85%
            </span>
            <p className="text-xl font-extrabold text-sale mt-1">R$ 47,90</p>
            <p className="text-xs text-price-old line-through">R$ 589,43</p>
          </div>
        </div>

        {paymentStatus === "paid" ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-success">Pagamento Confirmado!</h3>
            <p className="text-sm text-muted-foreground">
              Seu pagamento foi recebido com sucesso. Você receberá os detalhes do pedido em breve.
            </p>
          </div>
        ) : step === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold">Dados do comprador</h3>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">Nome completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Seu nome completo"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="000.000.000-00"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-base flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando Pix...
                </>
              ) : (
                "Continuar para pagamento"
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-center">Pague com Pix</h3>
            <p className="text-sm text-muted-foreground text-center">
              Escaneie o QR Code ou copie o código Pix abaixo.
            </p>

            {/* QR Code from API */}
            <div className="flex justify-center py-4">
              {pixData?.qr_code_base64 ? (
                <img
                  src={pixData.qr_code_base64}
                  alt="QR Code Pix"
                  className="w-48 h-48 rounded-xl border border-border"
                />
              ) : (
                <div className="w-48 h-48 bg-secondary rounded-xl flex items-center justify-center border border-border">
                  <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Pix copia e cola */}
            {pixData?.qr_code && (
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Pix Copia e Cola</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono font-medium flex-1 break-all line-clamp-2">
                    {pixData.qr_code}
                  </p>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-md text-xs font-medium flex-shrink-0"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-foreground">
                Valor: <span className="font-bold text-sale">R$ 47,90</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Aguardando confirmação do pagamento...
            </div>

            <p className="text-[10px] text-muted-foreground text-center leading-tight">
              A PUSHIN PAY atua exclusivamente como processadora de pagamentos e não possui qualquer responsabilidade pela entrega, suporte, conteúdo, qualidade ou cumprimento das obrigações relacionadas aos produtos ou serviços oferecidos pelo vendedor.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
