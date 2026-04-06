import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, ShoppingCart, Search } from "lucide-react";
import { PRODUCTS } from "@/data/products";

const STORE_LOGO = "https://panpannovapromo.site/ofertas/pratos/images/logo_oxford.png";
const TABS = ["Página inicial", "Produtos", "Categorias"];
const FILTERS = ["Recomendado", "Mais vendidos", "Lançamentos"];

interface StorePanelProps {
  open: boolean;
  onClose: () => void;
}

const StorePanel = ({ open, onClose }: StorePanelProps) => {
  const [activeTab, setActiveTab] = useState("Produtos");
  const [activeFilter, setActiveFilter] = useState("Recomendado");
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background max-w-lg mx-auto">
      {/* Header */}
      <div className="bg-foreground px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="text-background">
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1" />
        <Search className="w-5 h-5 text-background" />
        <ShoppingCart className="w-5 h-5 text-background" />
      </div>

      {/* Store info */}
      <div className="bg-background px-4 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={STORE_LOGO} alt="Oxford" className="w-14 h-14 rounded-full object-contain bg-secondary p-1" />
          <div className="flex-1">
            <p className="font-bold text-foreground">Oxford Store</p>
            <p className="text-xs text-muted-foreground">621 vendido(s)</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <button className="bg-primary text-primary-foreground text-xs font-bold px-5 py-1.5 rounded-full">Seguir</button>
            <button className="border border-border text-foreground text-xs font-medium px-5 py-1.5 rounded-full">Mensagem</button>
          </div>
        </div>
        <div className="mt-3 border border-primary/30 rounded-lg px-3 py-2 flex items-center justify-between bg-primary/5">
          <div>
            <p className="text-sm font-bold text-foreground">1% OFF</p>
            <p className="text-xs text-muted-foreground">Sem gasto mínimo</p>
          </div>
          <button className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-md">Resgatar</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-background">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === tab ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 px-4 py-2.5 bg-background border-b border-border">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`text-sm ${activeFilter === filter ? "font-bold text-foreground" : "text-muted-foreground"}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Product list */}
      <div className="flex-1 overflow-y-auto bg-background">
        {PRODUCTS.map((product) => (
          <div key={product.id} className="flex gap-3 px-4 py-3 border-b border-border">
            <img src={product.thumbnailImage} alt={product.name} className="w-28 h-28 rounded-lg object-cover flex-shrink-0" />
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div>
                <p className="text-sm text-foreground font-medium line-clamp-2 leading-snug">{product.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="bg-sale/10 text-sale text-[10px] font-bold px-1.5 py-0.5 rounded">🔥 {product.discount}</span>
                  <span className="bg-sale/10 text-sale text-[10px] font-bold px-1.5 py-0.5 rounded">{product.installments}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{product.sold} vendidos online</p>
              </div>
              <div className="flex items-end justify-between mt-1">
                <div>
                  <span className="text-sale font-bold text-lg">R$ {product.price.toFixed(2).replace(".", ",")}</span>
                  <p className="text-xs text-muted-foreground line-through">R$ {product.oldPrice.toFixed(2).replace(".", ",")}</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-sale text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StorePanel;
