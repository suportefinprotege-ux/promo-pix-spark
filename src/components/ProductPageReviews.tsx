import { ThumbsUp, MoreHorizontal } from "lucide-react";

const REVIEWS = [
  {
    name: "M**a M**a",
    avatar: "/images/avatar-pf-1.png",
    stars: 5,
    item: "Padrão",
    text: "Comprei esse conjunto de pratos e me surpreendi demais com a qualidade, acabamento lindo e parece bem resistente. Vale muito a pena pelo preço!",
    date: "19/03/2026",
    photos: ["/images/rev-pf-1.png", "/images/rev-pf-2.png"],
  },
  {
    name: "r**l",
    avatar: "/images/avatar-pf-2.png",
    stars: 5,
    item: "Padrão",
    text: "Gente, sério… chegou aqui em casa e é ainda mais bonito pessoalmente 😍 uso todo dia e continua perfeito, não mancha fácil e é bem firme.",
    date: "30/03/2026",
    photos: ["/images/rev-pf-3.png"],
  },
  {
    name: "j**a",
    avatar: "/images/avatar-pf-3.png",
    stars: 5,
    item: "Padrão",
    text: "Eu fiquei com medo de comprar, mas arrisquei e não me arrependi. Produto muito bom, bem acabado e chegou rápido. Recomendo demais!",
    date: "22/03/2026",
    photos: ["/images/rev-pf-4.png", "/images/rev-pf-5.png"],
  },
  {
    name: "T**1",
    avatar: "/images/avatar-pf-4.png",
    stars: 5,
    item: "Padrão",
    text: "Comprei pra minha casa nova e todo mundo que vem elogia, além de bonito, é prático e combina com tudo. Compra certa!",
    date: "28/03/2026",
    photos: [],
  },
  {
    name: "A**a",
    avatar: "/images/avatar-pf-1.png",
    stars: 5,
    item: "Padrão",
    text: "Peguei esse kit e achei top! Material bom, não é frágil e dá um toque mais elegante na mesa. Pelo valor, vale muito a pena mesmo.",
    date: "25/03/2026",
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
                <div className="flex items-center gap-1 text-muted-foreground">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-xs">Curtir</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPageReviews;
