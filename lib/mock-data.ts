import type { ProductCardData, CategoryNavItem } from '@/types';

// Editorial gradient tiles stand in for real product photography until the
// admin uploads real images to GridFS. Each is a distinct duotone so grids
// still read as a considered lookbook rather than a placeholder wall.
export const GRADIENTS = [
  'from-[#2c2c30] via-[#18181b] to-[#0b0b0c]',
  'from-[#3a3a3f] via-[#232326] to-[#0b0b0c]',
  'from-[#232326] via-[#141416] to-[#0b0b0c]',
  'from-[#454549] via-[#1c1c1e] to-[#0b0b0c]',
  'from-[#26262a] via-[#0f0f10] to-[#0b0b0c]',
  'from-[#33333a] via-[#1a1a1c] to-[#0b0b0c]',
];

export const CATEGORIES: CategoryNavItem[] = [
  { name: 'Outerwear', slug: 'outerwear', href: '/shop?category=outerwear', featured: true },
  { name: 'Knitwear', slug: 'knitwear', href: '/shop?category=knitwear' },
  { name: 'Denim', slug: 'denim', href: '/shop?category=denim' },
  { name: 'Footwear', slug: 'footwear', href: '/shop?category=footwear', featured: true },
  { name: 'Accessories', slug: 'accessories', href: '/shop?category=accessories' },
  { name: 'Essentials', slug: 'essentials', href: '/shop?category=essentials' },
];

const NAMES = [
  'Structured Wool Overcoat',
  'Merino Crewneck Sweater',
  'Tapered Selvedge Denim',
  'Matte Leather Chelsea Boot',
  'Silver-Buckle Belt',
  'Boxy Cotton Overshirt',
  'Pleated Wide-Leg Trouser',
  'Quilted Bomber Jacket',
  'Ribbed Turtleneck',
  'Raw-Edge Cargo Pant',
  'Minimal Canvas Tote',
  'Brushed Cotton Hoodie',
];

function buildProduct(i: number, overrides: Partial<ProductCardData> = {}): ProductCardData {
  return {
    id: `demo-${i}`,
    name: NAMES[i % NAMES.length],
    slug: `product-${i}`,
    price: 89 + ((i * 37) % 260),
    discountPrice: i % 4 === 0 ? 69 + ((i * 19) % 120) : undefined,
    imageUrl: GRADIENTS[i % GRADIENTS.length],
    hoverImageUrl: GRADIENTS[(i + 2) % GRADIENTS.length],
    colors: ['#0B0B0C', '#6C6E72', '#C8CBD0'],
    category: 'outerwear',
    gender: i % 2 === 0 ? 'men' : 'women',
    isNew: i % 3 === 0,
    isSale: i % 4 === 0,
    ...overrides,
  };
}

export const FEATURED_PRODUCTS: ProductCardData[] = Array.from({ length: 8 }, (_, i) =>
  buildProduct(i)
);

export const TRENDING_PRODUCTS: ProductCardData[] = Array.from({ length: 8 }, (_, i) =>
  buildProduct(i + 8)
);

export const NEW_ARRIVALS: ProductCardData[] = Array.from({ length: 4 }, (_, i) =>
  buildProduct(i + 20, { isNew: true })
);

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
export const COLOR_SWATCHES = [
  { name: 'Matte Black', hex: '#0B0B0C' },
  { name: 'Ash Grey', hex: '#6C6E72' },
  { name: 'Soft Silver', hex: '#C8CBD0' },
  { name: 'White', hex: '#FAFAF9' },
];

export interface FullProduct extends ProductCardData {
  description: string;
  sizes: string[];
  images: string[]; // gradient classes standing in for gallery images
  stock: number;
  rating: number;
  reviewCount: number;
}

// Full catalog used by the Shop page (filterable) and Product Details page.
export const ALL_PRODUCTS: FullProduct[] = Array.from({ length: 24 }, (_, i) => {
  const base = buildProduct(i, { category: CATEGORY_SLUGS[i % CATEGORY_SLUGS.length] });
  return {
    ...base,
    description:
      'Cut from a mid-weight fabric with a structured drape, finished with matte hardware and clean top-stitching. Designed to hold its shape wear after wear.',
    sizes: SIZES.slice(0, 4 + (i % 3)),
    images: [
      GRADIENTS[i % GRADIENTS.length],
      GRADIENTS[(i + 1) % GRADIENTS.length],
      GRADIENTS[(i + 2) % GRADIENTS.length],
      GRADIENTS[(i + 3) % GRADIENTS.length],
    ],
    stock: (i * 7) % 20,
    rating: 3.8 + ((i * 0.3) % 1.2),
    reviewCount: 8 + ((i * 13) % 140),
  };
});

export function getProductBySlug(slug: string): FullProduct | undefined {
  return ALL_PRODUCTS.find((p) => p.slug === slug);
}

export const TESTIMONIALS = [
  {
    name: 'Amara Chen',
    role: 'Verified Buyer',
    quote:
      'The fit is exact, the fabric holds up wash after wash, and it still looks like nothing else in my closet.',
  },
  {
    name: 'Daniel Osei',
    role: 'Verified Buyer',
    quote:
      'Ordered the overcoat expecting to return it. Kept it. The stitching detail alone justifies the price.',
  },
  {
    name: 'Priya Raman',
    role: 'Verified Buyer',
    quote: 'Shipping was fast, packaging felt like unboxing something from a flagship store.',
  },
];
