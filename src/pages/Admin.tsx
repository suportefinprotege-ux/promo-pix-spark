import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  LogOut, RefreshCw, Search, Package, DollarSign, Clock, CheckCircle2, MessageCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminChat from "@/components/AdminChat";

interface Order {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  phone: string;
  cpf: string;
  cep: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  quantity: number;
  product_total_cents: number;
  shipping_cents: number;
  total_cents: number;
  shipping_method: string;
  pix_transaction_id: string | null;
  payment_status: string;
  paid_at: string | null;
}

const formatCents = (cents: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Pendente", variant: "secondary" },
  approved: { label: "Aprovado", variant: "default" },
  failed: { label: "Falhou", variant: "destructive" },
  expired: { label: "Expirado", variant: "outline" },
};

const Admin = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "chat">("orders");
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }

    const { data, error } = await supabase.functions.invoke("list-orders", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (error || data?.error) {
      toast({ title: "Erro", description: "Não foi possível carregar os pedidos.", variant: "destructive" });
    } else {
      setOrders(data.orders || []);
    }
    setLoading(false);
  }, [navigate, toast]);

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/admin/login");
      } else {
        fetchOrders();
      }
    });

    // Realtime subscription
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchOrders, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.name.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      o.cpf.includes(q) ||
      o.id.includes(q) ||
      (o.email && o.email.toLowerCase().includes(q))
    );
  });

  const totalRevenue = orders.filter((o) => o.payment_status === "approved").reduce((s, o) => s + o.total_cents, 0);
  const pendingCount = orders.filter((o) => o.payment_status === "pending").length;
  const approvedCount = orders.filter((o) => o.payment_status === "approved").length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">Painel Admin</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="p-4 max-w-7xl mx-auto space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Pedidos</p>
                <p className="text-xl font-bold">{orders.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <DollarSign className="w-8 h-8" style={{ color: "hsl(var(--success))" }} />
              <div>
                <p className="text-xs text-muted-foreground">Receita</p>
                <p className="text-xl font-bold">{formatCents(totalRevenue)}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" style={{ color: "hsl(var(--success))" }} />
              <div>
                <p className="text-xs text-muted-foreground">Aprovados</p>
                <p className="text-xl font-bold">{approvedCount}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Clock className="w-8 h-8" style={{ color: "hsl(var(--warning))" }} />
              <div>
                <p className="text-xs text-muted-foreground">Pendentes</p>
                <p className="text-xl font-bold">{pendingCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, CPF, telefone, email ou ID..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Pedidos ({filtered.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead className="text-center">Qtd</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        {loading ? "Carregando..." : "Nenhum pedido encontrado"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((order) => {
                      const status = statusMap[order.payment_status] || statusMap.pending;
                      return (
                        <TableRow key={order.id}>
                          <TableCell className="whitespace-nowrap text-xs">
                            {formatDate(order.created_at)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-medium">{order.name}</div>
                            <div className="text-xs text-muted-foreground">CPF: {order.cpf}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">{order.phone}</div>
                            {order.email && <div className="text-xs text-muted-foreground">{order.email}</div>}
                          </TableCell>
                          <TableCell>
                            <div className="text-xs">
                              {order.endereco}, {order.numero}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {order.bairro} - {order.cidade}/{order.estado}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{order.quantity}</TableCell>
                          <TableCell className="text-right whitespace-nowrap font-medium">
                            {formatCents(order.total_cents)}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant={status.variant}>{status.label}</Badge>
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
    </div>
  );
};

export default Admin;
