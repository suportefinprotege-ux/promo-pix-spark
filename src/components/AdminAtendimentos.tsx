import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";

interface Session {
  id: string;
  created_at: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  status: string;
  last_message_at: string | null;
  message_count: number;
  last_message: string;
  last_sender: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Ativo", variant: "default" },
  closed: { label: "Encerrado", variant: "secondary" },
};

interface AdminAtendimentosProps {
  onOpenChat: (sessionId?: string) => void;
}

const AdminAtendimentos = ({ onOpenChat }: AdminAtendimentosProps) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    const { data: rawSessions } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (rawSessions) {
      const enriched = await Promise.all(
        rawSessions.map(async (s) => {
          const { count } = await supabase
            .from("chat_messages")
            .select("*", { count: "exact", head: true })
            .eq("session_id", s.id);

          const { data: lastMsg } = await supabase
            .from("chat_messages")
            .select("message, sender_type")
            .eq("session_id", s.id)
            .order("created_at", { ascending: false })
            .limit(1);

          return {
            ...s,
            message_count: count || 0,
            last_message: lastMsg?.[0]?.message || "",
            last_sender: lastMsg?.[0]?.sender_type || "",
          } as Session;
        })
      );
      setSessions(enriched);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 3000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  const handleCloseSession = async (id: string) => {
    await supabase.from("chat_sessions").update({ status: "closed" }).eq("id", id);
    fetchSessions();
  };

  const handleReopenSession = async (id: string) => {
    await supabase.from("chat_sessions").update({ status: "active" }).eq("id", id);
    fetchSessions();
  };

  const activeCount = sessions.filter((s) => s.status === "active").length;
  const closedCount = sessions.filter((s) => s.status === "closed").length;
  const totalMessages = sessions.reduce((sum, s) => sum + s.message_count, 0);
  const awaitingReply = sessions.filter((s) => s.status === "active" && s.last_sender === "customer").length;

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Total Conversas</p>
              <p className="text-xl font-bold">{sessions.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-8 h-8" style={{ color: "hsl(var(--warning))" }} />
            <div>
              <p className="text-xs text-muted-foreground">Ativos</p>
              <p className="text-xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8" style={{ color: "hsl(var(--success))" }} />
            <div>
              <p className="text-xs text-muted-foreground">Encerrados</p>
              <p className="text-xl font-bold">{closedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-xs text-muted-foreground">Aguardando Resposta</p>
              <p className="text-xl font-bold">{awaitingReply}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Início</TableHead>
                  <TableHead>Visitante</TableHead>
                  <TableHead>Última mensagem</TableHead>
                  <TableHead className="text-center">Mensagens</TableHead>
                  <TableHead className="text-center">Última atividade</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : sessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhum atendimento ainda
                    </TableCell>
                  </TableRow>
                ) : (
                  sessions.map((s) => {
                    const status = statusConfig[s.status] || statusConfig.active;
                    return (
                      <TableRow key={s.id}>
                        <TableCell className="whitespace-nowrap text-xs">
                          {formatDate(s.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{s.visitor_name || "Visitante"}</div>
                          {s.visitor_phone && (
                            <div className="text-xs text-muted-foreground">{s.visitor_phone}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground max-w-[200px] truncate">
                            {s.last_sender === "customer" && (
                              <span className="text-destructive font-medium">Cliente: </span>
                            )}
                            {s.last_sender === "admin" && (
                              <span className="text-primary font-medium">Você: </span>
                            )}
                            {s.last_message || "—"}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline">{s.message_count}</Badge>
                        </TableCell>
                        <TableCell className="text-center whitespace-nowrap text-xs">
                          {s.last_message_at ? formatDate(s.last_message_at) : "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Abrir chat"
                              onClick={() => onOpenChat(s.id)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {s.status === "active" ? (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive"
                                title="Encerrar"
                                onClick={() => handleCloseSession(s.id)}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary"
                                title="Reabrir"
                                onClick={() => handleReopenSession(s.id)}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAtendimentos;
