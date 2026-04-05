import { useState, useEffect, useRef } from "react";
import { X, Copy, Check, Loader2, Minus, Plus, ChevronDown, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import tiktokLogo from "@/assets/faixa_2.png";
import tiktokShopBanner from "@/assets/faixa_1.jpg";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

const PRODUCT_VALUE_CENTS = 4790;

const CheckoutModal = ({ open, onClose }: CheckoutModalProps) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [noEmail, setNoEmail] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    id: string;
    qr_code: string;
    qr_code_base64: string;
    status: string;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("created");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Address fields
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

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
        body: { value: PRODUCT_VALUE_CENTS * quantity },
      });
      if (error) throw error;
      setPixData(data);
      setPaymentStatus("created");
      setStep(3);
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
      const url = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
      const response = await fetch(
        `${url}/functions/v1/check-pix?id=${transactionId}`,
        { headers: { Authorization: `Bearer ${anonKey}`, apikey: anonKey } }
      );
      if (!response.ok) return;
      const result = await response.json();
      if (result.status) {
        setPaymentStatus(result.status);
        if (result.status === "paid") stopPolling();
      }
    } catch (err) {
      console.error("Erro ao verificar pagamento:", err);
    }
  };

  const startPolling = (transactionId: string) => {
    stopPolling();
    pollRef.current = setInterval(() => checkPaymentStatus(transactionId), 5000);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const handleClose = () => {
    stopPolling();
    setStep(1);
    setPixData(null);
    setPaymentStatus("created");
    onClose();
  };

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  useEffect(() => {
    return () => stopPolling();
  }, []);

  if (!open) return null;

  const total = (PRODUCT_VALUE_CENTS * quantity / 100).toFixed(2).replace(".", ",");

  const stepLabels = ["Identificação", "Entrega", "Pagamento"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-foreground/50" onClick={handleClose} />
      <div className="relative bg-secondary/30 w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">

        {/* Header - TikTok style */}
        <div className="bg-background px-4 py-3 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-2">
            <img src={tiktokLogo} alt="TikTok" className="h-6 object-contain" />
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            <div className="text-right leading-tight">
              <p className="text-[10px] font-bold text-foreground uppercase tracking-wide">PAGAMENTO</p>
              <p className="text-[10px] font-bold text-success uppercase">100% SEGURO</p>
            </div>
          </div>
          <button onClick={handleClose} className="absolute top-3 right-3 text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TikTok Shop banner */}
        <div className="w-full">
          <img src={tiktokShopBanner} alt="TikTok Shop" className="w-full h-auto object-cover" />
        </div>

        {/* Cart section */}
        <div className="bg-background mx-3 mt-4 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-foreground">Seu carrinho</h3>
            <div className="flex items-center gap-2">
              <span className="bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {quantity}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-3 pb-3">
            <img
              src="https://panpannovapromo.site/ofertas/pratos/images/img1.jpg"
              alt="Produto"
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-foreground">Conjunto 30 Peças Perfeitas</p>
              <p className="text-xs text-sale font-medium">Últimos unidades</p>
            </div>
            <div className="flex items-center gap-0 border border-border rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-sale"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-sm font-medium w-6 text-center text-foreground">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-primary"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">R$ {total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Frete</span>
              <span className="text-muted-foreground">-</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-border">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">R$ {total}</span>
            </div>
          </div>
        </div>

        {/* Step indicators */}
        <div className="bg-background mx-3 mt-3 rounded-xl p-4">
          <div className="flex items-center justify-between">
            {stepLabels.map((label, i) => {
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              return (
                <div key={label} className="flex flex-col items-center gap-1.5 flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-foreground text-background"
                        : isDone
                        ? "bg-success text-success-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="bg-background mx-3 mt-3 rounded-xl p-4 mb-4">
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
          ) : step === 1 ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={noEmail}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                  placeholder="email@email.com"
                />
                <label className="flex items-center gap-2 mt-2 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={noEmail}
                    onChange={(e) => { setNoEmail(e.target.checked); if (e.target.checked) setEmail(""); }}
                    className="w-4 h-4 rounded border-border"
                  />
                  Não tenho e-mail
                </label>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="(99) 99999-9999"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">Nome completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Nome e Sobrenome"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">CPF</label>
                <input
                  type="text"
                  value={cpf}
                  onChange={(e) => setCpf(formatCPF(e.target.value))}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="123.456.789-12"
                />
              </div>

              {/* Security info box */}
              <div className="border-2 border-dashed border-border rounded-xl p-4 space-y-3">
                <p className="font-bold text-sm text-foreground">
                  Usamos seus dados de forma 100% segura para garantir a sua satisfação:
                </p>
                {[
                  "Enviar o seu comprovante de compra e pagamento;",
                  "Ativar a sua garantia de devolução caso não fique satisfeito;",
                  "Acompanhar o andamento do seu pedido;",
                ].map((text) => (
                  <div key={text} className="flex items-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (name && cpf && phone) setStep(2);
                }}
                className="w-full bg-foreground text-background font-bold py-4 rounded-xl text-base uppercase tracking-wide"
              >
                IR PARA A ENTREGA
              </button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">CEP</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value.replace(/\D/g, "").slice(0, 8))}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="00000-000"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground block mb-1.5">Endereço</label>
                <input
                  type="text"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Rua, Avenida..."
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Número</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Nº"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Bairro</label>
                  <input
                    type="text"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Bairro"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Cidade</label>
                  <input
                    type="text"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Cidade"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-semibold text-foreground block mb-1.5">Estado</label>
                  <input
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value.toUpperCase().slice(0, 2))}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="UF"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-border text-foreground font-bold py-4 rounded-xl text-base"
                >
                  VOLTAR
                </button>
                <button
                  onClick={() => createPixCharge()}
                  disabled={loading}
                  className="flex-1 bg-foreground text-background font-bold py-4 rounded-xl text-base uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Gerando...
                    </>
                  ) : (
                    "IR PARA PAGAMENTO"
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Step 3 - Pix Payment */
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-center text-foreground">Pague com Pix</h3>
              <p className="text-sm text-muted-foreground text-center">
                Escaneie o QR Code ou copie o código Pix abaixo.
              </p>

              <div className="flex justify-center py-2">
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

              {pixData?.qr_code && (
                <div className="bg-secondary rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Pix Copia e Cola</p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-mono font-medium flex-1 break-all line-clamp-2 text-foreground">
                      {pixData.qr_code}
                    </p>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 bg-foreground text-background px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copiado!" : "Copiar"}
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-warning/10 border border-warning/20 rounded-xl p-3 text-center">
                <p className="text-sm font-medium text-foreground">
                  Valor: <span className="font-bold text-sale">R$ {total}</span>
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Aguardando confirmação do pagamento...
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pb-6 space-y-2">
          <p className="text-xs text-muted-foreground">Formas de pagamento</p>
          <p className="text-[10px] text-muted-foreground">© 2026 TikTok Shop</p>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            <span className="text-xs text-muted-foreground font-medium">Ambiente seguro</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
