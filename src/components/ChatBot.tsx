import { useState, useRef, useEffect } from "react";
import { X, Send, ChevronRight, Smile, Plus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getChatSupabase, getVisitorId } from "@/lib/chat-client";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const STORE_LOGO = "https://panpannovapromo.site/ofertas/pratos/images/logo_oxford.png";
const STORE_NAME = "Oxford";
const product = PRODUCTS[0];

type BotMessage = {
  id: number;
  from: "bot" | "user" | "typing" | "product";
  text: string;
  quickReplies?: string[];
};

type ChatMessage = {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
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
  {
    question: "Falar com atendente",
    answer: "Certo! A partir de agora suas mensagens serão enviadas diretamente para nosso atendente. Aguarde a resposta! 😊",
  },
];


interface ChatBotProps {
  open: boolean;
  onClose: () => void;
}

const ChatBot = ({ open, onClose }: ChatBotProps) => {
  const navigate = useNavigate();
  const { setSingleItem } = useCart();
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [vendorMessages, setVendorMessages] = useState<ChatMessage[]>([]);
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [liveMode, setLiveMode] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [showProduct, setShowProduct] = useState(true);
  const [productSent, setProductSent] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const visitorId = useRef(getVisitorId());

  const handleSendProduct = () => {
    setProductSent(true);
    setShowProduct(false);
    const productMsg: BotMessage = {
      id: Date.now(),
      from: "product",
      text: product.name,
    };
    setMessages((prev) => [...prev, productMsg]);
  };

  const handleBuyFromChat = () => {
    setSingleItem(product);
    onClose();
    navigate("/checkout");
  };

  // Init session for vendor messages
  useEffect(() => {
    const initSession = async () => {
      const { data: existing } = await getChatSupabase()
        .from("chat_sessions")
        .select("id")
        .eq("visitor_id", visitorId.current)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existing) {
        setSessionId(existing.id);
      } else {
        const { data: created } = await getChatSupabase()
          .from("chat_sessions")
          .insert({ visitor_id: visitorId.current })
          .select("id")
          .single();
        if (created) setSessionId(created.id);
      }
    };
    initSession();
  }, []);

  // Poll for vendor messages
  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      const { data } = await getChatSupabase()
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (data) setVendorMessages(data);
    };
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Init bot welcome
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
  }, [messages, vendorMessages, isTyping]);

  const getRemainingQuestions = (asked: Set<string>) => {
    return ALL_QUESTIONS.filter((q) => !asked.has(q.question)).map((q) => q.question);
  };

  const handleQuickReply = (text: string) => {
    if (text === "Falar com atendente") {
      setLiveMode(true);
    }

    const userMsg: BotMessage = { id: Date.now(), from: "user", text };
    const newAsked = new Set(askedQuestions);
    newAsked.add(text);
    setAskedQuestions(newAsked);
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const faq = ALL_QUESTIONS.find((q) => q.question === text);
      const answer = faq?.answer || "Obrigado pela sua mensagem!";
      const remaining = getRemainingQuestions(newAsked);
      const botMsg: BotMessage = {
        id: Date.now() + 1,
        from: "bot",
        text: answer,
        quickReplies: remaining.length > 0 ? remaining : undefined,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1500);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput("");

    if (liveMode && sessionId) {
      // Send to vendor via supabase
      setSending(true);
      await getChatSupabase().from("chat_messages").insert({
        session_id: sessionId,
        sender_type: "customer",
        message: text,
      });
      await getChatSupabase()
        .from("chat_sessions")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", sessionId);
      setSending(false);
    } else {
      // Bot fallback
      const userMsg: BotMessage = { id: Date.now(), from: "user", text };
      setMessages((prev) => [...prev, userMsg]);
      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
        const remaining = getRemainingQuestions(askedQuestions);
        const botMsg: BotMessage = {
          id: Date.now() + 1,
          from: "bot",
          text: "Obrigado pela sua mensagem! Nossa equipe irá responder em breve.",
          quickReplies: remaining.length > 0 ? remaining : undefined,
        };
        setMessages((prev) => [...prev, botMsg]);
      }, 1500);
    }
  };

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f5f5f5] max-w-lg mx-auto">
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

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Timestamp */}
        <p className="text-center text-xs text-muted-foreground">{timeStr}</p>

        {/* Bot messages */}
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
            ) : msg.from === "product" ? (
              <div className="flex justify-end">
                <div className="bg-background rounded-2xl shadow-sm border border-border p-3 max-w-[85%]">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sold.toLocaleString("pt-BR")} vendidos</p>
                      <p className="text-sm font-bold text-[#EE4D2D] mt-1">R$ {product.price.toFixed(2).replace(".", ",")}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleBuyFromChat}
                    className="w-full bg-[#EE4D2D] hover:bg-[#d73a1d] text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Comprar agora
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end items-end gap-1.5">
                <span className="text-green-500 text-xs">✓</span>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%]">
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Vendor messages (live mode) */}
        {liveMode && vendorMessages.map((msg) => (
          <div key={msg.id}>
            {msg.sender_type === "admin" ? (
              <div className="flex items-start gap-2">
                <img
                  src={STORE_LOGO}
                  alt=""
                  className="w-7 h-7 rounded-full object-contain bg-secondary p-0.5 mt-0.5 flex-shrink-0"
                />
                <div className="bg-background rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-foreground shadow-sm max-w-[85%]">
                  {msg.message}
                </div>
              </div>
            ) : (
              <div className="flex justify-end items-end gap-1.5">
                <span className="text-green-500 text-xs">✓</span>
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%]">
                  {msg.message}
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

      {/* Product card */}
      {showProduct && (
        <div className="mx-3 mb-2 bg-background rounded-xl shadow-sm border border-border flex items-center gap-3 p-3 relative">
          <button
            onClick={() => setShowProduct(false)}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0 pr-6">
            <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
            <p className="text-xs text-muted-foreground">{product.sold.toLocaleString("pt-BR")} vendidos</p>
          </div>
          <button onClick={handleSendProduct} className="bg-[#EE4D2D] hover:bg-[#d73a1d] text-white text-sm font-semibold px-4 py-2 rounded-lg flex-shrink-0 transition-colors">
            Enviar
          </button>
        </div>
      )}

      {/* Input */}
      <div className="bg-background border-t border-border px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Enviar mensagem..."
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          disabled={sending}
        />
        <button className="text-muted-foreground">
          <Smile className="w-5 h-5" />
        </button>
        <button
          onClick={handleSend}
          disabled={sending}
          className="text-muted-foreground disabled:opacity-50"
        >
          {input.trim() ? (
            <Send className="w-5 h-5 text-primary" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
