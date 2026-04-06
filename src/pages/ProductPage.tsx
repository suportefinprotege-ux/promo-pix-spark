import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, ShoppingCart, MoreHorizontal, Bookmark, Truck, ChevronRight, CheckCircle, Star } from "lucide-react";
import { getProductById } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { trackTikTokEvent } from "@/lib/tiktok-server";
import { toast } from "sonner";
import CartDrawer from "@/components/CartDrawer";
import ProductPageReviews from "@/components/ProductPageReviews";
import ProductPageDescription from "@/components/ProductPageDescription";

const AUTO_PLAY_INTERVAL = 3000;

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const product = getProductById(Number(id));
  const [current, setCurrent] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!product) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % product.images.length);
    }, AUTO_PLAY_INTERVAL);
  }, [product]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Produto não encontrado</p>
      </div>
    );
  }

  const goTo = (idx: number) => {
    setCurrent(Math.max(0, Math.min(idx, product.images.length - 1)));
    resetTimer();
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
    setTouchStart(null);
  };

  const trackAddToCart = () => {
    trackTikTokEvent("AddToCart", {
      content_id: String(product.id),
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "BRL",
    });
  };

  const handleAddToCart = () => {
    const added = addToCart(product);

    if (added) {
      trackAddToCart();
      toast.success("Adicionado ao carrinho!");
      setCartOpen(true);
      return;
    }

    toast.error("Limite de 2 unidades por produto!");
  };

  const handleBuyNow = () => {
    const alreadyInCart = items.some((item) => item.product.id === product.id);

    if (!alreadyInCart) {
      const added = addToCart(product);
      if (!added) {
        toast.error("Limite de 2 unidades por produto!");
        return;
      }
      trackAddToCart();
    }

    navigate("/checkout");
  };

  const savings = (product.oldPrice - product.price).toFixed(2).replace(".", ",");
  const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-16">
      <div className="sticky top-0 z-30 bg-background border-b border-border px-3 py-2.5 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 bg-secondary rounded-lg px-3 py-1.5 text-sm text-muted-foreground truncate">
          {product.name.slice(0, 30)}...
        </div>
        <Share2 className="w-5 h-5 text-foreground" />
        <button onClick={() => setCartOpen(true)} className="text-foreground">
          <ShoppingCart className="w-5 h-5" />
        </button>
        <MoreHorizontal className="w-5 h-5 text-foreground" />
      </div>

      <div className="relative bg-background">
        <div
          className="w-full aspect-square overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={product.images[current]}
            alt={`${product.name} ${current + 1}`}
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex gap-1.5 px-3 py-2 overflow-x-auto">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i);
                resetTimer();
              }}
              className={`w-14 h-14 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                i === current ? "border-primary" : "border-transparent"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#f53d2d] to-[#ff6633] px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white/20 text-white text-xs font-extrabold px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-white/80 text-xs">R$</span>
              <span className="text-3xl font-extrabold text-white">
                {product.price.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-white font-bold text-sm">
              <span>⚡</span>
              <span>Oferta Relâmpago</span>
            </div>
            <p className="text-white/80 text-xs mt-0.5">
              Termina em <span className="font-bold text-white">1 dia</span>
            </p>
          </div>
        </div>
        <p className="text-white/60 text-xs line-through mt-0.5">
          R$ {product.oldPrice.toFixed(2).replace(".", ",")}
        </p>
      </div>

      <div className="px-3 py-2">
        <span className="bg-success/10 text-success text-xs font-bold px-2.5 py-1 rounded">
          Economize R${savings} com bônus
        </span>
      </div>

      <div className="h-2 bg-secondary" />

      <div className="px-3 py-2 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h1 className="text-sm font-semibold text-foreground leading-snug flex-1">
            {product.name}
          </h1>
          <Bookmark className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Star className="w-4 h-4 text-star fill-star" />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviews})</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-muted-foreground">{product.sold} vendidos</span>
        </div>
      </div>

      <div className="h-2 bg-secondary" />

      <div className="space-y-0">
        <div className="px-3 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div>
                <span className="bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Frete grátis
                </span>
                <p className="text-sm text-foreground mt-0.5">Receba em até 5 dias úteis (Loggi)</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
        <div className="bg-success/5 px-3 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-success font-bold text-sm">Proteção do cliente</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 pl-7">
            <div className="flex items-center gap-1.5 text-xs text-foreground">
              <span className="text-success text-xs">●</span>Devolução gratuita
            </div>
            <div className="flex items-center gap-1.5 text-xs text-foreground">
              <span className="text-success text-xs">●</span>Pagamento seguro
            </div>
            <div className="flex items-center gap-1.5 text-xs text-foreground">
              <span className="text-success text-xs">●</span>Reembolso automático por dano
            </div>
            <div className="flex items-center gap-1.5 text-xs text-foreground">
              <span className="text-success text-xs">●</span>Cupom por atraso na coleta
            </div>
          </div>
        </div>
      </div>

      <div className="h-2 bg-secondary" />

      <ProductPageDescription />

      <div className="h-2 bg-secondary" />

      <ProductPageReviews />

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-40 flex items-center max-w-lg mx-auto">
        <div className="flex-1 flex gap-2 px-2 py-2">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 text-sm font-semibold text-primary border-2 border-primary rounded-full bg-background"
          >
            Adicionar ao carrinho
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 text-sm font-bold bg-sale text-white rounded-full flex flex-col items-center leading-tight"
          >
            <span>Comprar agora</span>
            <span className="text-[10px] font-normal opacity-90">Frete grátis</span>
          </button>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ProductPage;
