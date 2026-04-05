import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

// ======================================
// CONFIGURE SUA API PIX AQUI
// ======================================
const PIX_CONFIG = {
  // Substitua pela sua chave Pix
  pixKey: "sua-chave-pix@email.com",
  pixKeyType: "email", // cpf, cnpj, email, telefone, aleatoria
  beneficiaryName: "SUA LOJA LTDA",
  amount: 47.90,
  description: "Kit Pratos Oxford 30 Peças",

  // Se você usa uma API de pagamento, configure aqui:
  // apiUrl: "https://sua-api-pix.com/api/v1/pix",
  // apiKey: "sua-api-key",
};

const CheckoutModal = ({ open, onClose }: CheckoutModalProps) => {
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [step, setStep] = useState<"form" | "pix">("form");

  const handleCopy = () => {
    navigator.clipboard.writeText(PIX_CONFIG.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && cpf) {
      setStep("pix");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative bg-background w-full max-w-lg rounded-t-2xl p-5 pb-8 animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground">
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

        {step === "form" ? (
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
              className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg text-base"
            >
              Continuar para pagamento
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-center">Pague com Pix</h3>
            <p className="text-sm text-muted-foreground text-center">
              Copie a chave Pix abaixo e realize o pagamento pelo app do seu banco.
            </p>

            {/* QR Code placeholder */}
            <div className="flex justify-center py-4">
              <div className="w-48 h-48 bg-secondary rounded-xl flex items-center justify-center border border-border">
                <div className="text-center text-muted-foreground">
                  <p className="text-sm font-medium">QR Code Pix</p>
                  <p className="text-xs mt-1">Escaneie para pagar</p>
                </div>
              </div>
            </div>

            {/* Pix key */}
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Chave Pix ({PIX_CONFIG.pixKeyType})</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono font-medium flex-1 break-all">
                  {PIX_CONFIG.pixKey}
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

            <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 text-center">
              <p className="text-sm font-medium text-foreground">
                Valor: <span className="font-bold text-sale">R$ {PIX_CONFIG.amount.toFixed(2).replace(".", ",")}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Beneficiário: {PIX_CONFIG.beneficiaryName}
              </p>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              ⏱️ O pagamento é confirmado automaticamente em até 2 minutos.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
