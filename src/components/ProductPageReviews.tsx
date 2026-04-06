const REVIEWS = [
  {
    name: "M**a M**a",
    avatar: "https://panpannovapromo.site/ofertas/pratos/images/menina1.jpg",
    stars: 5,
    item: "Padrão",
    text: "Perfeito lindo",
    date: "19/11/2025",
    photos: ["/images/rev-pf-1.png", "/images/rev-pf-2.png"],
  },
  {
    name: "r**l",
    avatar: "https://panpannovapromo.site/ofertas/pratos/images/vjssas123.jpg",
    stars: 5,
    item: "Padrão",
    text: "Recomendo 👏👏👏👏",
    date: "30/11/2025",
    photos: ["/images/rev-pf-3.png"],
  },
  {
    name: "j**a",
    avatar: "https://panpannovapromo.site/ofertas/pratos/images/menina3.jpg",
    stars: 5,
    item: "Padrão",
    text: "Lindos amei",
    date: "13/11/2025",
    photos: ["/images/rev-pf-4.png", "/images/rev-pf-5.png"],
  },
  {
    name: "T**1",
    avatar: "",
    stars: 5,
    item: "Padrão",
    text: "Perfeito",
    date: "28/11/2025",
    photos: [],
  },
];

const ProductPageReviews = () => {
  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold">Avaliações do produto</h2>
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold">4.9</span>
          <span className="text-star">★★★★★</span>
        </div>
      </div>

      <div className="space-y-0">
        {REVIEWS.map((review, i) => (
          <div key={i} className="border-b border-border py-3 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              {review.avatar ? (
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-8 h-8 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">👤</span>
                </div>
              )}
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
            <p className="text-sm font-semibold text-foreground mb-1.5">{review.text}</p>
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
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground text-lg">···</span>
                <span className="text-muted-foreground text-sm">👍</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPageReviews;
