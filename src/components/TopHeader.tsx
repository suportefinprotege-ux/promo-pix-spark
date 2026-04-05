import { X, Share2, ShoppingCart, MoreHorizontal } from "lucide-react";

const TopHeader = () => {
  return (
    <div className="sticky top-0 z-30 bg-background flex items-center justify-between px-3 py-2 border-b border-border">
      <button className="p-1.5 text-foreground">
        <X className="w-6 h-6" />
      </button>
      <div className="flex items-center gap-2">
        <button className="p-1.5 text-foreground">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="p-1.5 text-foreground relative">
          <ShoppingCart className="w-5 h-5" />
        </button>
        <button className="p-1.5 text-foreground">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TopHeader;
