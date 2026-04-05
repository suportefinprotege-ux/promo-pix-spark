const REVIEWS = [
  {
    name: "Luh Moraes",
    avatar: "https://panpannovapromo.site/ofertas/pratos/images/menina1.jpg",
    time: "há 23 minutos",
    stars: 5,
    text: "Produto incrível! Chegou bem embalado, todas as peças perfeitas. A qualidade Oxford é impecável, as xícaras são lindas com essa borda. Super recomendo!",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev1a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev1b.jpg",
    ],
  },
  {
    name: "Carlos Albuquerque",
    avatar: "https://panpannovapromo.site/ofertas/pratos/images/vjssas123.jpg",
    time: "há 41 minutos",
    stars: 5,
    text: "Chegou super bem embalado, cada peça em caixinha individual. Qualidade absurda pelo preço. Porcelana pesada e bonita.",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev2a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev2b.jpg",
    ],
  },
  {
    name: "Elane Costa",
    avatar: "https://panpannovapromo.site/ofertas/pratos/images/menina3.jpg",
    time: "há 50 minutos",
    stars: 5,
    text: "Produto chegou em perfeito estado! As peças são lindas, muito mais bonitas pessoalmente do que nas fotos. Mesa posta ficou um espetáculo.",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev3a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev3b.jpg",
    ],
  },
  {
    name: "Sofia Dias",
    avatar: "https://panpannovapromo.site/ofertas/pratos/images/menina5.jpg",
    time: "há 1 hora",
    stars: 4,
    text: "O produto é ótimo, porcelana de qualidade. Tirei uma estrela porque uma das xícaras veio com uma leve imperfeição no esmalte — não afeta o uso.",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev4a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev4b.jpg",
    ],
  },
  {
    name: "Bela Prado",
    avatar: "https://panpannovapromo.site/ofertas/pratos/images/menina2.jpg",
    time: "há 1 hora",
    stars: 5,
    text: "Simplesmente apaixonada! A textura da porcelana com aquelas bolinhas sutis é muito sofisticada. Cada peça parece única. Vale cada centavo.",
    photos: [
      "https://panpannovapromo.site/ofertas/pratos/images/rev5a.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/rev5b.jpg",
    ],
  },
];

const CustomerReviews = () => {
  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold">Avaliações dos clientes (207)</h2>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold">4.7</span>
          <span className="text-star">★★★★★</span>
        </div>
      </div>

      <div className="space-y-4">
        {REVIEWS.map((review, i) => (
          <div key={i} className="border-b border-border pb-4 last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={review.avatar}
                alt={review.name}
                className="w-8 h-8 rounded-full object-cover"
                loading="lazy"
              />
              <div>
                <p className="text-sm font-semibold">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.time}</p>
              </div>
              <div className="ml-auto text-star text-xs">
                {"★".repeat(review.stars)}
                {"☆".repeat(5 - review.stars)}
              </div>
            </div>
            <p className="text-sm text-foreground/80 mb-2">{review.text}</p>
            {review.photos.length > 0 && (
              <div className="flex gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
