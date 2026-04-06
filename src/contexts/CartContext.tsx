import { createContext, useContext, useState, ReactNode } from "react";
import type { Product } from "@/data/products";

const MAX_PER_PRODUCT = 2;

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product) => boolean;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalCents: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product): boolean => {
    const existing = items.find((i) => i.product.id === product.id);
    if (existing && existing.quantity >= MAX_PER_PRODUCT) return false;

    setItems((prev) => {
      const ex = prev.find((i) => i.product.id === product.id);
      if (ex) {
        return prev.map((i) =>
          i.product.id === product.id
            ? { ...i, quantity: Math.min(i.quantity + 1, MAX_PER_PRODUCT) }
            : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    return true;
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId
          ? { ...i, quantity: Math.min(quantity, MAX_PER_PRODUCT) }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCents = items.reduce(
    (sum, i) => sum + Math.round(i.product.price * 100) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalCents }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
