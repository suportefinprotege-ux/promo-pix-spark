// TikTok Pixel helper
// Docs: https://ads.tiktok.com/marketing_api/docs?id=1739585700402178

declare global {
  interface Window {
    ttq: {
      track: (event: string, params?: Record<string, unknown>) => void;
      page: () => void;
      identify: (params: Record<string, unknown>) => void;
    };
  }
}

export const ttqTrack = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, params);
  }
};

export const ttqIdentify = (params: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.identify(params);
  }
};

// Standard TikTok events:
// ViewContent - user views a product
// ClickButton - user clicks a CTA
// AddToCart - user adds item to cart
// InitiateCheckout - user starts checkout
// AddPaymentInfo - user adds payment info
// PlaceAnOrder - user places order
// CompletePayment - user completes payment
