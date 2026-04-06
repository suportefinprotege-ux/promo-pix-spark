import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Check, Loader2, Minus, Plus, ChevronDown, ShieldCheck, ArrowLeft, Smartphone, QrCode, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import tiktokLogo from "@/assets/faixa_2.png";
import tiktokShopBanner from "@/assets/faixa_1.jpg";
import pixLogo from "@/assets/pix-logo.png";

const PRODUCT_VALUE_CENTS = 4790;

type SubStep = "form" | "shipping" | "payment-method" | "processing" | "qrcode";

const SHIPPING_OPTIONS = [
  { id: "free", label: "Frete gratis", days: "de 7 até 10 dias", price: 0, priceLabel: "Grátis" },
  { id: "loggi", label: "Transportadora Loggi", days: "de 3 até 5 dias úteis", price: 1523, priceLabel: "R$15,23" },
  { id: "full", label: "Entrega FULL (Mais rápida)", days: "de 2 até 3 dias úteis", price: 2670, priceLabel: "R$26,70" },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [noEmail, setNoEmail] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [subStep, setSubStep] = useState<SubStep>("form");
  const [loading, setLoading] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("free");
  const [pixData, setPixData] = useState<{
    id: string;
    qr_code: string;
    qr_code_base64: string;
    status: string;
  } | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>("created");
  const [expirySeconds, setExpirySeconds] = useState(480);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [cep, setCep] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const fetchCep = async (cepValue: string) => {
    if (cepValue.length !== 8) return;
    setLoadingCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setEndereco(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setEstado(data.uf || "");
      }
    } catch (err) {
      console.error("Erro ao buscar CEP:", err);
    } finally {
      setLoadingCep(false);
    }
  };

  const handleCopy = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const createPixCharge = async () => {
    setLoading(true);
    setSubStep("processing");
    try {
      const { data, error } = await supabase.functions.invoke("create-pix", {
        body: { value: PRODUCT_VALUE_CENTS * quantity },
      });
      if (error) throw error;
      setPixData(data);
      setPaymentStatus("created");
      setExpirySeconds(480);
      // Show processing for 2 seconds then show QR
      setTimeout(() => {
        setSubStep("qrcode");
        startPolling(data.id);
        startExpiryTimer();
      }, 2000);
    } catch (err) {
      console.error("Erro ao criar cobrança Pix:", err);
      alert("Erro ao gerar cobrança Pix. Tente novamente.");
      setSubStep("payment-method");
    } finally {
      setLoading(false);
    }
  };

  const startExpiryTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setExpirySeconds((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    return () => {
      stopPolling();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === selectedShipping)?.price || 0;
  const productTotal = PRODUCT_VALUE_CENTS * quantity;
  const grandTotal = productTotal + shippingCost;
  const total = (grandTotal / 100).toFixed(2).replace(".", ",");
  const subtotal = (productTotal / 100).toFixed(2).replace(".", ",");
  const freteLabel = shippingCost === 0 ? "Grátis" : `R$ ${(shippingCost / 100).toFixed(2).replace(".", ",")}`;

  const stepLabels = ["Identificação", "Entrega", "Pagamento"];

  // Determine visual step based on subStep
  const getVisualStep = (): 1 | 2 | 3 => {
    if (subStep === "form") return 1;
    if (subStep === "shipping") return 2;
    return 3;
  };

  const visualStep = getVisualStep();

  return (
    <div className="min-h-screen bg-secondary/30 max-w-lg mx-auto">
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
            <p className="text-[10px] font-bold text-foreground uppercase tracking-wide">PAGAMENTO</p>
            <p className="text-[10px] font-bold text-success uppercase">100% SEGURO</p>
          </div>
        </div>
      </div>

      {/* TikTok Shop banner */}
      <div className="w-full">
        <img src={tiktokShopBanner} alt="TikTok Shop" className="w-full h-auto object-cover" />
      </div>

      {/* QR Code full page */}
      {subStep === "qrcode" && !paymentStatus.includes("paid") ? (
        <div className="bg-background mx-3 mt-4 rounded-xl p-6 mb-4">
          <h2 className="text-xl font-bold text-center text-foreground mb-1">
            Falta pouco! Para finalizar a compra,
          </h2>
          <p className="text-xl font-bold text-center text-foreground mb-6">
            escaneie o QR Code abaixo.
          </p>

          {/* Timer */}
          <div className="bg-secondary rounded-xl p-3 text-center mb-4">
            <span className="text-sm text-muted-foreground">O código expira em: </span>
            <span className="text-sm font-bold text-sale">{formatTime(expirySeconds)}</span>
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-4">
            {pixData?.qr_code_base64 ? (
              <img
                src={pixData.qr_code_base64}
                alt="QR Code Pix"
                className="w-56 h-56"
              />
            ) : (
              <div className="w-56 h-56 bg-secondary rounded-xl flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Pix copia e cola */}
          {pixData?.qr_code && (
            <div className="mt-4">
              <p className="text-sm text-muted-foreground text-center mb-2">
                Se preferir, pague com a opção <span className="font-bold text-foreground">PIX Copia e Cola:</span>
              </p>
              <div className="border border-border rounded-xl px-4 py-3 mb-3">
                <p className="text-xs font-mono text-muted-foreground break-all line-clamp-1">
                  {pixData.qr_code}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="w-full bg-success text-white font-bold py-3 rounded-xl text-sm uppercase flex items-center justify-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "COPIADO!" : "COPIAR CÓDIGO"}
              </button>
            </div>
          )}

          {/* Details sidebar inline on mobile */}
          <div className="mt-6 border-t border-border pt-4">
            <p className="font-bold text-foreground mb-2">Detalhes da compra:</p>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Valor total:</span>
              <span className="font-bold text-sale">R$ {total}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-4 border-t border-border pt-4">
            <p className="font-bold text-foreground mb-3">Instruções para pagamento</p>
            <div className="space-y-3">
              {[
                { icon: <Smartphone className="w-5 h-5" />, text: "Abra o app do seu banco e entre no ambiente Pix" },
                { icon: <QrCode className="w-5 h-5" />, text: "Escolha Pagar com QR Code e aponte a câmera para o código acima." },
                { icon: <CheckCircle2 className="w-5 h-5" />, text: "Confirme as informações e finalize sua compra." },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Aguardando confirmação do pagamento...
          </div>
        </div>
      ) : subStep === "processing" ? (
        /* Processing overlay */
        <div className="bg-background mx-3 mt-4 rounded-xl p-8 mb-4 text-center">
          <div className="flex justify-center mb-4">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-muted-foreground/40">
              <rect x="25" y="10" width="30" height="50" rx="4" stroke="currentColor" strokeWidth="2" fill="none" />
              <rect x="30" y="20" width="20" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <line x1="32" y1="40" x2="38" y2="40" stroke="currentColor" strokeWidth="1.5" />
              <line x1="42" y1="40" x2="48" y2="40" stroke="currentColor" strokeWidth="1.5" />
              <line x1="32" y1="44" x2="38" y2="44" stroke="currentColor" strokeWidth="1.5" />
              <line x1="42" y1="44" x2="48" y2="44" stroke="currentColor" strokeWidth="1.5" />
              <rect x="35" y="55" width="10" height="15" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-foreground">Processando pagamento!</h3>
          <div className="mt-4">
            <Loader2 className="w-6 h-6 animate-spin text-success mx-auto" />
          </div>
        </div>
      ) : paymentStatus === "paid" ? (
        <div className="bg-background mx-3 mt-4 rounded-xl p-8 mb-4 text-center space-y-4">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h3 className="text-xl font-bold text-success">Pagamento Confirmado!</h3>
          <p className="text-sm text-muted-foreground">
            Seu pagamento foi recebido com sucesso. Você receberá os detalhes do pedido em breve.
          </p>
        </div>
      ) : (
        <>
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
                  onClick={() => setQuantity(Math.min(3, quantity + 1))}
                  className="w-8 h-8 flex items-center justify-center text-primary"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="border-t border-border pt-3 space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">R$ {subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className={`${shippingCost === 0 ? "text-success font-medium" : "text-foreground"}`}>{freteLabel}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-border">
                <span className="text-foreground">Total</span>
                <span className="text-sale">R$ {total}</span>
              </div>
            </div>
          </div>

          {/* Step indicators */}
          <div className="bg-background mx-3 mt-3 rounded-xl p-4">
            <div className="flex items-center justify-between relative">
              {/* Connecting lines */}
              <div className="absolute top-4 left-0 right-0 flex items-center justify-center px-16 z-0">
                <div className={`flex-1 h-0.5 ${visualStep > 1 ? "bg-success" : "bg-border"}`} />
                <div className={`flex-1 h-0.5 ${visualStep > 2 ? "bg-success" : "bg-border"}`} />
              </div>
              {stepLabels.map((label, i) => {
                const stepNum = (i + 1) as 1 | 2 | 3;
                const isActive = visualStep === stepNum;
                const isDone = visualStep > stepNum;
                return (
                  <div key={label} className="flex flex-col items-center gap-1.5 flex-1 z-10">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-foreground text-background"
                          : isDone
                          ? "bg-success text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : stepNum}
                    </div>
                    <span className={`text-xs font-medium ${isActive ? "text-foreground" : isDone ? "text-success" : "text-muted-foreground"}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step content */}
          <div className="bg-background mx-3 mt-3 rounded-xl p-4 mb-4">
            {subStep === "form" ? (
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
                    if (name && cpf && phone) setSubStep("shipping");
                  }}
                  className="w-full bg-foreground text-background font-bold py-4 rounded-xl text-base uppercase tracking-wide"
                >
                  IR PARA A ENTREGA
                </button>
              </div>
            ) : subStep === "shipping" ? (
              <div className="space-y-4">
                {/* Address fields */}
                <div>
                  <label className="text-sm font-semibold text-foreground block mb-1.5">CEP</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").slice(0, 8);
                        setCep(v);
                        fetchCep(v);
                      }}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="00000-000"
                    />
                    {loadingCep && (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground absolute right-3 top-3.5" />
                    )}
                  </div>
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

                {/* Shipping options */}
                <div className="mt-2">
                  <p className="font-semibold text-foreground mb-3">Escolha o melhor frete para você</p>
                  <div className="space-y-2.5">
                    {SHIPPING_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedShipping(option.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-colors text-left ${
                          selectedShipping === option.id
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedShipping === option.id
                              ? "border-primary"
                              : "border-muted-foreground/40"
                          }`}
                        >
                          {selectedShipping === option.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-foreground">{option.label}</p>
                          <p className="text-xs text-muted-foreground">{option.days}</p>
                        </div>
                        <span className={`text-sm font-medium ${option.price === 0 ? "text-success" : "text-foreground"}`}>
                          {option.priceLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    A previsão de entrega pode variar de acordo com a região e facilidade de acesso ao seu endereço
                  </p>
                </div>

                <div className="flex gap-3 items-center pt-2">
                  <button
                    onClick={() => setSubStep("form")}
                    className="flex items-center gap-2 text-muted-foreground font-medium text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>
                  <button
                    onClick={() => setSubStep("payment-method")}
                    className="flex-1 bg-foreground text-background font-bold py-4 rounded-xl text-base uppercase tracking-wide"
                  >
                    IR PARA O PAGAMENTO
                  </button>
                </div>
              </div>
            ) : subStep === "payment-method" ? (
              <div className="space-y-4">
                <h3 className="font-bold text-foreground text-lg">Pagamento</h3>

                {/* Pix option selected */}
                <div className="border-2 border-foreground rounded-xl p-4 w-fit mx-auto flex items-center justify-center">
                  <img src={pixLogo} alt="Pix" className="h-10 object-contain" />
                </div>

                <div className="border border-border rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">
                    Ao selecionar o Pix, você será encaminhado para um ambiente seguro para finalizar seu pagamento.
                  </p>
                </div>

                <div className="flex gap-3 items-center pt-2">
                  <button
                    onClick={() => setSubStep("shipping")}
                    className="flex items-center gap-2 text-muted-foreground font-medium text-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar
                  </button>
                  <button
                    onClick={() => createPixCharge()}
                    disabled={loading}
                    className="flex-1 bg-success text-white font-bold py-4 rounded-xl text-base uppercase tracking-wide flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "FINALIZAR COMPRA"
                    )}
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}

      {/* Footer */}
      <div className="text-center pb-8 pt-4 space-y-2">
        <p className="text-xs text-muted-foreground">Formas de pagamento</p>
        <p className="text-[10px] text-muted-foreground">© 2026 TikTok Shop</p>
        <div className="flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-success" />
          <span className="text-xs text-muted-foreground font-medium">Ambiente seguro</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
