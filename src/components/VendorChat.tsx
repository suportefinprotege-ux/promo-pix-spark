import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { getChatSupabase, getVisitorId } from "@/lib/chat-client";

const STORE_LOGO = "https://panpannovapromo.site/ofertas/pratos/images/logo_oxford.png";

type ChatMessage = {
  id: string;
  sender_type: string;
  message: string;
  created_at: string;
};


const VendorChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const visitorId = useRef(getVisitorId());

  // Create or get session
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

  // Poll for messages
  useEffect(() => {
    if (!sessionId) return;

    const fetchMessages = async () => {
      const { data } = await getChatSupabase()
        .from("chat_messages")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !sessionId || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");

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
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-secondary/30">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            Envie uma mensagem para falar com o vendedor
          </div>
        )}
        {messages.map((msg) => (
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
              <div className="flex justify-end">
                <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%]">
                  {msg.message}
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
          placeholder="Enviar mensagem ao vendedor..."
          className="flex-1 bg-secondary rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={handleSend}
          disabled={sending}
          className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VendorChat;
