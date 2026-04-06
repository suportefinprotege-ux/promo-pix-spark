import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ChevronRight } from "lucide-react";

const STORE_LOGO = "https://panpannovapromo.site/ofertas/pratos/images/logo_oxford.png";
const STORE_NAME = "Oxford";

type Message = {
  id: number;
  from: "bot" | "user";
  text: string;
  quickReplies?: string[];
};

const FAQ: Record<string, string> = {
  "Você tem esse produto em estoque?":
    "Sim! Temos o Conjunto 30 Peças Perfeitas disponível em estoque. Aproveite que as unidades estão acabando! 🔥",
  "Estou tentando comprar":
    "Para comprar, clique no botão 'Comprar agora' na página do produto. Você será levado ao checkout seguro onde poderá preencher seus dados e pagar via Pix. Se tiver algum problema, me conte qual é!",
  "Já paguei":
    "Ótimo! Se o pagamento foi via Pix, a confirmação é automática e leva poucos segundos. Você será redirecionado para a página de rastreio. Caso tenha algum problema, entre em contato com nosso suporte.",
  "Como faço para usar?":
    "O conjunto vem pronto para uso! Recomendamos lavar as peças antes do primeiro uso com água morna e detergente neutro. São peças de porcelana de alta qualidade, seguras para micro-ondas e lava-louças.",
  "O que está incluído no produto?":
    "O Conjunto 30 Peças Perfeitas inclui:\n• 6 pratos rasos\n• 6 pratos fundos\n• 6 pratos de sobremesa\n• 6 xícaras\n• 6 pires\nTotal de 30 peças para servir 6 pessoas!",
  "Qual o prazo de entrega?":
    "O prazo de entrega é de até 5 dias úteis via transportadora Loggi após a confirmação do pagamento. O frete custa R$ 26,87.",
  "Posso devolver se não gostar?":
    "Sim! Você tem garantia de satisfação. Caso não fique satisfeito, pode solicitar a devolução.",
};

const QUICK_REPLIES_INITIAL = [
  "Você tem esse produto em estoque?",
  "Estou tentando comprar",
  "Já paguei",
  "Como faço para usar?",
  "O que está incluído no produto?",
];

const QUICK_REPLIES_FOLLOWUP = [
  "Qual o prazo de entrega?",
  "Posso devolver se não gostar?",
  "Estou tentando comprar",
];

interface ChatBotProps {
  open: boolean;
  onClose: () => void;
}

const ChatBot = ({ open, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      from: "bot",
      text: "Agradecemos por entrar em contato.\nComo posso ajudar hoje?",
      quickReplies: QUICK_REPLIES_INITIAL,
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleQuickReply = (text: string) => {
    const userMsg: Message = { id: Date.now(), from: "user", text };
    const answer = FAQ[text] || "Obrigado pela sua mensagem! Em breve retornaremos.";
    const botMsg: Message = {
      id: Date.now() + 1,
      from: "bot",
      text: answer,
      quickReplies: QUICK_REPLIES_FOLLOWUP,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: input.trim() };
    const bestMatch = Object.keys(FAQ).find((key) =>
      input.toLowerCase().includes(key.toLowerCase().split(" ").slice(0, 2).join(" "))
    );
    const answer = bestMatch
      ? FAQ[bestMatch]
      : "Obrigado pela sua mensagem! Nossa equipe irá responder em breve. Enquanto isso, veja as opções abaixo:";
    const botMsg: Message = {
      id: Date.now() + 1,
      from: "bot",
      text: answer,
      quickReplies: QUICK_REPLIES_FOLLOWUP,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-background border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
            <img
              src={STORE_LOGO}
              alt={STORE_NAME}
              className="w-10 h-10 rounded-full object-contain bg-secondary p-0.5"
            />
            <div className="flex-1">
              <p className="font-bold text-sm text-foreground">{STORE_NAME}</p>
              <p className="text-xs text-muted-foreground">Normalmente responde em até 24 horas</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-secondary/30">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.from === "bot" ? (
                  <div className="flex items-start gap-2">
                    <img
                      src={STORE_LOGO}
                      alt=""
                      className="w-7 h-7 rounded-full object-contain bg-secondary p-0.5 mt-0.5 flex-shrink-0"
                    />
                    <div className="space-y-2 max-w-[85%]">
                      <div className="bg-background rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-foreground shadow-sm whitespace-pre-line">
                        {msg.text}
                      </div>
                      {msg.quickReplies && (
                        <div className="bg-background rounded-2xl px-4 py-3 shadow-sm space-y-0">
                          <p className="font-bold text-sm text-foreground mb-2">
                            Como posso ajudar você hoje?
                          </p>
                          {msg.quickReplies.map((qr) => (
                            <button
                              key={qr}
                              onClick={() => handleQuickReply(qr)}
                              className="w-full flex items-center justify-between py-3 border-t border-border text-sm text-foreground hover:bg-secondary/50 transition-colors"
                            >
                              <span>{qr}</span>
                              <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            </button>
                          ))}
                          <p className="text-[11px] text-muted-foreground mt-2 pt-1">
                            Enviado por chatbot
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%]">
                      {msg.text}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-background border-t border-border px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Enviar mensagem..."
              className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
    </div>
  );
};

export default ChatBot;
