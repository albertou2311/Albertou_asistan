export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  images: string[];
  stock: number;
  created_at: string;
  yarn_brand?: string;
  yarn_type?: string;
  specifications?: string[];
}

export type ProductCategory = 
  | 'elbise'
  | 'patik'
  | 'sapka'
  | 'yelek'
  | 'kazak'
  | 'takim'
  | 'bluz'
  | 'canta';