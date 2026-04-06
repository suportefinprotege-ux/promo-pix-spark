import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatSession {
  id: string;
  created_at: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  status: string;
  last_message_at: string | null;
  last_message?: string;
  unread?: boolean;
}

interface ChatMsg {
  id: string;
  session_id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const AdminChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchSessions = useCallback(async () => {
    const { data } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("last_message_at", { ascending: false });
    
    if (data) {
      // Fetch last message for each session
      const sessionsWithMessages = await Promise.all(
        data.map(async (s) => {
          const { data: msgs } = await supabase
            .from("chat_messages")
            .select("message, sender_type")
            .eq("session_id", s.id)
            .order("created_at", { ascending: false })
            .limit(1);
          return {
            ...s,
            last_message: msgs?.[0]?.message || "",
            unread: msgs?.[0]?.sender_type === "customer",
          } as ChatSession;
        })
      );
      setSessions(sessionsWithMessages);
    }
  }, []);

  useEffect(() => {
    fetchSessions();

    const channel = supabase
      .channel("admin-chat-sessions")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_sessions" }, () => {
        fetchSessions();
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages" }, () => {
        fetchSessions();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchSessions]);

  // Fetch messages for active session
  useEffect(() => {
    if (!activeSession) return;

    const fetchMsgs = async () => {
      const { data } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("session_id", activeSession)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    };
    fetchMsgs();

    const channel = supabase
      .channel(`admin-chat-${activeSession}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `session_id=eq.${activeSession}` },
        (payload) => {
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === (payload.new as ChatMsg).id);
            if (exists) return prev;
            return [...prev, payload.new as ChatMsg];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeSession]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeSession || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");

    await supabase.from("chat_messages").insert({
      session_id: activeSession,
      sender_type: "admin",
      message: text,
    });

    await supabase
      .from("chat_sessions")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", activeSession);

    setSending(false);
  };

  // Session list view
  if (!activeSession) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Chat com Clientes
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-sm">
              Nenhuma conversa ainda
            </div>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSession(s.id)}
                className="w-full text-left px-4 py-3 border-b hover:bg-muted/50 transition-colors flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate">
                      {s.visitor_name || `Visitante`}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {s.last_message_at ? formatTime(s.last_message_at) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">
                      {s.last_message || "Sem mensagens"}
                    </span>
                    {s.unread && (
                      <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
                        !
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    );
  }

  // Conversation view
  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center gap-3">
        <button onClick={() => setActiveSession(null)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="font-medium text-sm">
            {sessions.find((s) => s.id === activeSession)?.visitor_name || "Visitante"}
          </p>
          <p className="text-xs text-muted-foreground">Chat em tempo real</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-muted/20">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.sender_type === "customer" ? (
              <div className="flex items-start gap-2">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">C</span>
                </div>
                <div className="bg-background rounded-2xl rounded-tl-sm px-4 py-3 text-sm shadow-sm max-w-[85%]">
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

      <div className="bg-background border-t px-4 py-3 flex items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Responder..."
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

export default AdminChat;
