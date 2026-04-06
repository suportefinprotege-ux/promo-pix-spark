import { X, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeFromCart, totalItems, totalCents, freeShipping } = useCart();
  const navigate = useNavigate();

  if (!open) return null;

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative bg-background w-full max-w-lg rounded-t-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            <h2 className="font-bold text-foreground">Carrinho ({totalItems})</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Seu carrinho está vazio</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3 bg-secondary/50 rounded-xl p-3">
                <img
                  src={item.product.thumbnailImage}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{item.product.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-sale">
                      R$ {item.product.price.toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      R$ {item.product.oldPrice.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 border border-border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-medium w-5 text-center text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= 2}
                        className="p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total ({totalItems} {totalItems === 1 ? "item" : "itens"})</span>
              <span className="text-lg font-bold text-sale">
                R$ {(totalCents / 100).toFixed(2).replace(".", ",")}
              </span>
            </div>
            {freeShipping && (
              <p className="text-xs text-green-600 font-medium">🎉 Frete grátis aplicado (compra acima de R$ 150)</p>
            )}
            {!freeShipping && totalCents > 0 && (
              <p className="text-xs text-muted-foreground">
                Falta R$ {((15000 - totalCents) / 100).toFixed(2).replace(".", ",")} para frete grátis
              </p>
            )}
            <button
              onClick={handleCheckout}
              className="w-full bg-sale text-white font-bold py-4 rounded-2xl text-lg flex flex-col items-center leading-tight"
            >
              <span>Finalizar compra</span>
              {freeShipping && <span className="text-sm font-normal opacity-90">Frete grátis</span>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
