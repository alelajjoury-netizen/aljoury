export type ProductCategory = 'plants' | 'pots' | 'care';

export type PotColor = {
  name: string;
  hex: string;
};

export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  featured: boolean;
  label: string;
  careLevel?: string;
  wateringGuide?: string;
  art?: 'monstera' | 'snake' | 'pothos' | 'pot' | 'kit';
  potColors: PotColor[];
};

export type CartLine = {
  product: StoreProduct;
  quantity: number;
  color: PotColor;
};
