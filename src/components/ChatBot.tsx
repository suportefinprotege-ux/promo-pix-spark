import { useState, useRef, useEffect } from "react";
import { X, Send, ChevronRight } from "lucide-react";

const STORE_LOGO = "https://panpannovapromo.site/ofertas/pratos/images/logo_oxford.png";
const STORE_NAME = "Oxford";

type Message = {
  id: number;
  from: "bot" | "user" | "typing";
  text: string;
  quickReplies?: string[];
};

const ALL_QUESTIONS: { question: string; answer: string }[] = [
  {
    question: "Você tem esse produto em estoque?",
    answer: "Sim! Temos o Conjunto 30 Peças Perfeitas disponível em estoque. Aproveite que as unidades estão acabando! 🔥",
  },
  {
    question: "Estou tentando comprar",
    answer: "Para comprar, clique no botão 'Comprar agora' na página do produto. Você será levado ao checkout seguro onde poderá preencher seus dados e pagar via Pix.",
  },
  {
    question: "Já paguei",
    answer: "Ótimo! Se o pagamento foi via Pix, a confirmação é automática e leva poucos segundos. Você será redirecionado para a página de rastreio.",
  },
  {
    question: "Como faço para usar?",
    answer: "O conjunto vem pronto para uso! Recomendamos lavar as peças antes do primeiro uso com água morna e detergente neutro. São peças de porcelana de alta qualidade.",
  },
  {
    question: "O que está incluído no produto?",
    answer: "O Conjunto 30 Peças Perfeitas inclui:\n• 6 pratos rasos\n• 6 pratos fundos\n• 6 pratos de sobremesa\n• 6 xícaras\n• 6 pires\nTotal de 30 peças para servir 6 pessoas!",
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo de entrega é de até 5 dias úteis via transportadora Loggi após a confirmação do pagamento. O frete custa R$ 26,87.",
  },
  {
    question: "Posso devolver se não gostar?",
    answer: "Sim! Você tem garantia de satisfação. Caso não fique satisfeito, pode solicitar a devolução.",
  },
  {
    question: "O produto é original?",
    answer: "Sim! Trabalhamos apenas com produtos originais Oxford com nota fiscal e garantia do fabricante.",
  },
];

interface ChatBotProps {
  open: boolean;
  onClose: () => void;
}

const ChatBot = ({ open, onClose }: ChatBotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Initialize with welcome message
  useEffect(() => {
    if (open && !initialized.current) {
      initialized.current = true;
      const availableQs = ALL_QUESTIONS.map((q) => q.question);
      setMessages([
        {
          id: 1,
          from: "bot",
          text: "Agradecemos por entrar em contato.\nComo posso ajudar hoje?",
          quickReplies: availableQs,
        },
      ]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getRemainingQuestions = (asked: Set<string>) => {
    return ALL_QUESTIONS.filter((q) => !asked.has(q.question)).map((q) => q.question);
  };

  const handleQuickReply = (text: string) => {
    const userMsg: Message = { id: Date.now(), from: "user", text };
    const newAsked = new Set(askedQuestions);
    newAsked.add(text);
    setAskedQuestions(newAsked);

    // Add user message and show typing
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      const faq = ALL_QUESTIONS.find((q) => q.question === text);
      const answer = faq?.answer || "Obrigado pela sua mensagem!";
      const remaining = getRemainingQuestions(newAsked);

      const botMsg: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: answer,
        quickReplies: remaining.length > 0 ? remaining : undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const remaining = getRemainingQuestions(askedQuestions);
      const botMsg: Message = {
        id: Date.now() + 1,
        from: "bot",
        text: "Obrigado pela sua mensagem! Nossa equipe irá responder em breve.",
        quickReplies: remaining.length > 0 ? remaining : undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
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
          <p className="text-xs text-muted-foreground">Normalmente responde em algumas horas</p>
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
                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="bg-background rounded-2xl px-4 py-3 shadow-sm">
                      <p className="font-bold text-sm text-foreground mb-2">
                        Como posso ajudar você hoje?
                      </p>
                      {msg.quickReplies.map((qr) => (
                        <button
                          key={qr}
                          onClick={() => handleQuickReply(qr)}
                          className="w-full flex items-center justify-between py-3 border-t border-border text-sm text-foreground hover:bg-secondary/50 transition-colors text-left"
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
              <div className="flex justify-end items-end gap-1.5">
                <span className="text-success text-xs">✓</span>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%]">
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-start gap-2">
            <img
              src={STORE_LOGO}
              alt=""
              className="w-7 h-7 rounded-full object-contain bg-secondary p-0.5 mt-0.5 flex-shrink-0"
            />
            <div className="bg-background rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}

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
  );
};

export default ChatBot;
