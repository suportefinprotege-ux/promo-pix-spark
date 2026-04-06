import { useState } from "react";
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
import BuyConfirmSheet from "@/components/BuyConfirmSheet";

const Index = () => {
  const [buySheetOpen, setBuySheetOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto pb-16">
      <TopHeader />
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
        onBuy={() => setBuySheetOpen(true)}
        onChat={() => setChatOpen(true)}
        onStore={() => setStoreOpen(true)}
      />
      <BuyConfirmSheet
        open={buySheetOpen}
        onClose={() => setBuySheetOpen(false)}
      />
      <ChatBot open={chatOpen} onClose={() => setChatOpen(false)} />
      <StorePanel open={storeOpen} onClose={() => setStoreOpen(false)} onBuy={() => { setStoreOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
};

export default Index;
