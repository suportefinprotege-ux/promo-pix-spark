import { useState, useEffect, useRef, useCallback } from "react";

const IMAGES = [
  "https://panpannovapromo.site/ofertas/pratos/images/img1.jpg",
  "https://panpannovapromo.site/ofertas/pratos/images/img2.jpg",
  "https://panpannovapromo.site/ofertas/pratos/images/img3.jpg",
  "https://panpannovapromo.site/ofertas/pratos/images/img4.jpg",
  "https://panpannovapromo.site/ofertas/pratos/images/img5.jpg",
  "https://panpannovapromo.site/ofertas/pratos/images/img6.jpg",
  "https://panpannovapromo.site/ofertas/pratos/images/img7.jpg",
];

const AUTO_PLAY_INTERVAL = 3000;

const ImageCarousel = () => {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, AUTO_PLAY_INTERVAL);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const goTo = (idx: number) => {
    setCurrent(Math.max(0, Math.min(idx, IMAGES.length - 1)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
    setTouchStart(null);
  };

  return (
    <div className="relative bg-background">
      <div
        className="w-full aspect-square overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={IMAGES[current]}
          alt={`Produto ${current + 1}`}
          className="w-full h-full object-contain"
          loading={current === 0 ? "eager" : "lazy"}
        />
      </div>

      {/* Counter */}
      <div className="absolute bottom-3 right-3 bg-foreground/60 text-primary-foreground text-xs px-2 py-1 rounded-full">
        {current + 1}/{IMAGES.length}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-1.5 px-3 py-2 overflow-x-auto">
        {IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-14 h-14 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
              i === current ? "border-primary" : "border-transparent"
            }`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
