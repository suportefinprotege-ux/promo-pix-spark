import { useState, useEffect } from "react";
import { PRODUCTS } from "@/data/products";
import { trackTikTokEvent } from "@/lib/tiktok-server";
import TopHeader from "@/components/TopHeader";
import ChatBot from "@/components/ChatBot";
import StorePanel from "@/components/StorePanel";
import ImageCarousel from "@/components/ImageCarousel";
import PriceSection from "@/components/PriceSection";
import ProductInfo from "@/components/ProductInfo";
import ShippingInfo from "@/components/ShippingInfo";
import ProductOptions from "@/components/ProductOptions";
import CustomerReviews from "@/components/CustomerReviews";
import StoreInfo from "@/components/StoreInfo";
import ProductDescription from "@/components/ProductDescription";
import BottomBar from "@/components/BottomBar";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  const product = PRODUCTS[0];
  const [chatOpen, setChatOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    if (!product) return;

    trackTikTokEvent("ViewContent", {
      content_id: String(product.id),
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "BRL",
    });
  }, [product]);

  if (!product) return null;

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-16">
      <TopHeader onCartOpen={() => setCartOpen(true)} />
      <ImageCarousel />
      <PriceSection />
      <div className="h-2 bg-secondary" />
      <ProductInfo />
      <div className="h-2 bg-secondary" />
      <ShippingInfo />
      <div className="h-2 bg-secondary" />
      <ProductOptions />
      <div className="h-2 bg-secondary" />
      <StoreInfo />
      <ProductDescription />
      <div className="h-2 bg-secondary" />
      <CustomerReviews />
      <BottomBar
        product={product}
        onChat={() => setChatOpen(true)}
        onStore={() => setStoreOpen(true)}
        onCartOpen={() => setCartOpen(true)}
      />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <ChatBot open={chatOpen} onClose={() => setChatOpen(false)} />
      <StorePanel open={storeOpen} onClose={() => setStoreOpen(false)} />
    </div>
  );
};

export default Index;
