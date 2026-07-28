import type { Metadata } from 'next';
import ShopClient from '@/components/shop/ShopGrid';
import { ALL_PRODUCTS, type FullProduct } from '@/lib/mock-data';
import { getPublicCategories } from '@/lib/data/categories';
import { getShopProducts, hasAnyProducts } from '@/lib/data/products';

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse the full ZANX WEAR catalog — outerwear, knitwear, denim, footwear and accessories.',
};

function parseList(value?: string) {
  return value ? value.split(',').filter(Boolean) : [];
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const categories = await getPublicCategories();

  const categorySlugs = parseList(params.category);
  const genders = parseList(params.gender);
  const sizes = parseList(params.size);
  const colors = parseList(params.color);
  const min = params.min ? Number(params.min) : 0;
  const max = params.max ? Number(params.max) : 100000;
  const filter = params.filter; // 'new' | 'sale' | 'trending' | 'featured'
  const sort = params.sort ?? 'newest';

  // Once real products exist in the database, the shop shows those instead
  // of the placeholder catalog. Filtering by category/gender/price happens
  // at the DB level; size/color still filter client-side below since those
  // live on individual variants.
  const usingRealCatalog = await hasAnyProducts();

  let products: FullProduct[];

  if (usingRealCatalog) {
    products = await getShopProducts({ categorySlugs, genders, min, max, filter });
    if (sizes.length) products = products.filter((p) => p.sizes.some((s) => sizes.includes(s)));
  } else {
    products = ALL_PRODUCTS.filter((p) => {
      const price = p.discountPrice ?? p.price;
      if (categorySlugs.length && !categorySlugs.includes(p.category)) return false;
      if (genders.length && !genders.includes(p.gender)) return false;
      if (sizes.length && !p.sizes.some((s) => sizes.includes(s))) return false;
      if (colors.length) return true; // color swatches are illustrative in the demo catalog
      if (price < min || price > max) return false;
      if (filter === 'new' && !p.isNew) return false;
      if (filter === 'sale' && !p.isSale) return false;
      return true;
    });
  }

  switch (sort) {
    case 'price-asc':
      products = [...products].sort((a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price));
      break;
    case 'price-desc':
      products = [...products].sort((a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price));
      break;
    case 'rating':
      products = [...products].sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return (
    <div className="min-h-screen bg-matte-black">
      <div className="container-fluid pt-32">
        <span className="eyebrow">Full Catalog</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tightest2 text-fog md:text-6xl">
          Shop All
        </h1>
      </div>
      <ShopClient products={products} categories={categories} />
    </div>
  );
}
