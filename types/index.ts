export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  imageUrl: string;
  hoverImageUrl?: string;
  colors: string[];
  category: string;
  gender: 'men' | 'women' | 'unisex';
  isNew?: boolean;
  isSale?: boolean;
}

export interface CartLineItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface CategoryNavItem {
  name: string;
  slug: string;
  href: string;
  featured?: boolean;
}
