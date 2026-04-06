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
    id: 6,
    name: "Aparelho de Jantar e Cha Porcelana 30 Pecas Ryo Maresia Jogo de Pratos e Xicaras Oxford",
    price: 47.90,
    oldPrice: 589.43,
    discount: "85% OFF",
    installments: "3x sem juros",
    sold: 4473,
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
];

export const getProductById = (id: number): Product | undefined => {
  return PRODUCTS.find((p) => p.id === id);
};
