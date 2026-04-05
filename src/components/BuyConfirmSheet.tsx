import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BuyConfirmSheetProps {
  open: boolean;
  onClose: () => void;
}

const BuyConfirmSheet = ({ open, onClose, onConfirm }: BuyConfirmSheetProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-foreground/50" onClick={onClose} />
      <div className="relative bg-background w-full max-w-lg rounded-t-2xl p-5 pb-8 animate-in slide-in-from-bottom duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground">
          <X className="w-6 h-6" />
        </button>

        {/* Product summary */}
        <div className="flex items-center gap-4 pb-5">
          <img
            src="https://panpannovapromo.site/ofertas/pratos/images/img1.jpg"
            alt="Produto"
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-sale text-white text-xs font-extrabold px-2.5 py-1 rounded-lg">
                -85%
              </span>
              <span className="text-2xl font-extrabold text-sale">R$ 47,90</span>
            </div>
            <p className="text-sm text-muted-foreground line-through mt-1">R$ 589,43</p>
          </div>
        </div>

        {/* Buy button */}
        <button
          onClick={() => {
            onClose();
            onConfirm();
          }}
          className="w-full bg-sale text-white font-bold py-4 rounded-2xl text-lg flex flex-col items-center leading-tight"
        >
          <span>Comprar agora</span>
          <span className="text-sm font-normal opacity-90">Frete grátis</span>
        </button>
      </div>
    </div>
  );
};

export default BuyConfirmSheet;
