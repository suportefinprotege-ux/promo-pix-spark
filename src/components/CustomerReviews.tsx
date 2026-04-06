import { useState } from "react";
import { ThumbsUp, MoreHorizontal } from "lucide-react";

const REVIEWS = [
  {
    name: "L**h M**s",
    avatar: "/images/avatar-main-1.png",
    stars: 5,
    item: "Padrão",
    text: "Produto incrível! Chegou bem embalado, todas as peças perfeitas. A qualidade Oxford é impecável, as xícaras são lindas com essa borda. Super recomendo!",
    date: "18/03/2026",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev1a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev1b.jpg",
    ],
  },
  {
    name: "C**s A**e",
    avatar: "/images/avatar-main-2.png",
    stars: 5,
    item: "Padrão",
    text: "Chegou super bem embalado, cada peça em caixinha individual. Qualidade absurda pelo preço. Porcelana pesada e bonita.",
    date: "25/03/2026",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev2a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev2b.jpg",
    ],
  },
  {
    name: "E**e C**a",
    avatar: "/images/avatar-main-3.png",
    stars: 5,
    item: "Padrão",
    text: "Produto chegou em perfeito estado! As peças são lindas, muito mais bonitas pessoalmente do que nas fotos. Mesa posta ficou um espetáculo.",
    date: "22/03/2026",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev3a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev3b.jpg",
    ],
  },
  {
    name: "S**a D**s",
    avatar: "/images/avatar-main-4.png",
    stars: 4,
    item: "Padrão",
    text: "O produto é ótimo, porcelana de qualidade. Tirei uma estrela porque uma das xícaras veio com uma leve imperfeição no esmalte — não afeta o uso.",
    date: "30/03/2026",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev4a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev4b.jpg",
    ],
  },
  {
    name: "B**a P**o",
    avatar: "/images/avatar-main-5.png",
    stars: 5,
    item: "Padrão",
    text: "Simplesmente apaixonada! A textura da porcelana com aquelas bolinhas sutis é muito sofisticada. Cada peça parece única. Vale cada centavo.",
    date: "27/03/2026",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev5a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev5b.jpg",
    ],
  },
];

const CustomerReviews = () => {
  const [likes, setLikes] = useState<Record<number, number>>({});

  const handleLike = (index: number) => {
    setLikes((prev) => ({ ...prev, [index]: (prev[index] || 0) + 1 }));
  };

  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold">Avaliações dos clientes (207)</h2>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold">4.7</span>
          <span className="text-star">★★★★★</span>
        </div>
      </div>

      <div className="space-y-0">
        {REVIEWS.map((review, i) => (
          <div key={i} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-semibold">{review.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-star text-xs">
                    {"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
                  </span>
                  <span className="text-xs text-muted-foreground">· Item: {review.item}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-foreground/80 mb-2">{review.text}</p>
            {review.photos.length > 0 && (
              <div className="flex gap-2 mb-1.5">
                {review.photos.map((photo, j) => (
                  <img
                    key={j}
                    src={photo}
                    alt="Foto da avaliação"
                    className="w-20 h-20 rounded-lg object-cover"
                    loading="lazy"
                  />
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{review.date}</span>
              <div className="flex items-center gap-4">
                <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                <button
                  onClick={() => handleLike(i)}
                  className="flex items-center gap-1 transition-colors"
                >
                  <ThumbsUp
                    className={`w-5 h-5 ${likes[i] ? "text-primary fill-primary" : "text-muted-foreground"}`}
                  />
                  {likes[i] && (
                    <span className="text-xs text-primary font-medium">{likes[i]}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
