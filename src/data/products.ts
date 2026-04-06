export interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice: number;
  discount: string;
  installments: string;
  sold: number;
  rating: number;
  reviews: number;
  images: string[];
  thumbnailImage: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Jogo de Jantar 30 Peças Porcelana Chá Maresia Oxford",
    price: 47.90,
    oldPrice: 758.20,
    discount: "94% OFF",
    installments: "6x sem juros",
    sold: 1010,
    rating: 4.7,
    reviews: 204,
    images: [
      "https://panpannovapromo.site/ofertas/pratos/images/img1.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img2.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img3.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img4.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img5.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img6.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img7.jpg",
    ],
    thumbnailImage: "https://panpannovapromo.site/ofertas/pratos/images/img1.jpg",
  },
  {
    id: 6,
    name: "Conjunto de Pratos Fundos Com 06 Peças 22,5cm Ryo Maresia Oxford",
    price: 34.90,
    oldPrice: 149.00,
    discount: "77% OFF",
    installments: "3x sem juros",
    sold: 4175,
    rating: 3.9,
    reviews: 12,
    images: [
      "/images/pratos-fundos-1.png",
      "/images/pratos-fundos-2.png",
      "/images/pratos-fundos-3.png",
      "/images/pratos-fundos-4.png",
      "/images/pratos-fundos-5.png",
    ],
    thumbnailImage: "/images/pratos-fundos-1.png",
  },
  {
    id: 2,
    name: "Conjunto 6 Pratos Fundos 21cm Porcelana Floralis Tramontina",
    price: 39.90,
    oldPrice: 121.42,
    discount: "67% OFF",
    installments: "3x sem juros",
    sold: 739,
    rating: 4.2,
    reviews: 38,
    images: [
      "https://panpannovapromo.site/ofertas/pratos/images/img2.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img3.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img4.jpg",
    ],
    thumbnailImage: "https://panpannovapromo.site/ofertas/pratos/images/img2.jpg",
  },
  {
    id: 3,
    name: "Conjunto 6 Tigelas Bowl Ryo Maresia 500ml Porcelana Oxford",
    price: 29.90,
    oldPrice: 220.32,
    discount: "86% OFF",
    installments: "5x sem juros",
    sold: 887,
    rating: 4.5,
    reviews: 56,
    images: [
      "https://panpannovapromo.site/ofertas/pratos/images/img3.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img1.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img5.jpg",
    ],
    thumbnailImage: "https://panpannovapromo.site/ofertas/pratos/images/img3.jpg",
  },
  {
    id: 4,
    name: "Jogo de Jantar Canyon Porcelana Decorada 30 Peças Tramontina",
    price: 52.90,
    oldPrice: 468.00,
    discount: "89% OFF",
    installments: "6x sem juros",
    sold: 9005,
    rating: 4.8,
    reviews: 312,
    images: [
      "https://panpannovapromo.site/ofertas/pratos/images/img4.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img2.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img6.jpg",
    ],
    thumbnailImage: "https://panpannovapromo.site/ofertas/pratos/images/img4.jpg",
  },
  {
    id: 5,
    name: "Aparelho de Jantar 20 Peças Porcelana Branca Schmidt",
    price: 44.90,
    oldPrice: 389.90,
    discount: "88% OFF",
    installments: "4x sem juros",
    sold: 2341,
    rating: 4.3,
    reviews: 89,
    images: [
      "https://panpannovapromo.site/ofertas/pratos/images/img5.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img1.jpg",
      "https://panpannovapromo.site/ofertas/pratos/images/img7.jpg",
    ],
    thumbnailImage: "https://panpannovapromo.site/ofertas/pratos/images/img5.jpg",
  },
];

export const getProductById = (id: number): Product | undefined => {
  return PRODUCTS.find((p) => p.id === id);
};
