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
];

export const getProductById = (id: number): Product | undefined => {
  return PRODUCTS.find((p) => p.id === id);
};
