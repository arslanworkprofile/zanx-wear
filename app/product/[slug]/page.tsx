import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import ProductGallery from '@/components/product/ProductGallery';
import ProductPurchasePanel from '@/components/product/ProductPurchasePanel';
import ProductTabs from '@/components/product/ProductTabs';
import ProductSection from '@/components/home/ProductSection';
import TrackRecentlyViewed from '@/components/product/TrackRecentlyViewed';
import { getProductBySlug, ALL_PRODUCTS } from '@/lib/mock-data';
import { getProductBySlugFromDB, getRelatedProducts } from '@/lib/data/products';

async function resolveProduct(slug: string) {
  const dbProduct = await getProductBySlugFromDB(slug);
  if (dbProduct) return { product: dbProduct, fromDb: true as const };
  const mockProduct = getProductBySlug(slug);
  if (mockProduct) return { product: mockProduct, fromDb: false as const };
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveProduct(slug);
  if (!resolved) return { title: 'Product not found' };
  const { product } = resolved;
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const resolved = await resolveProduct(slug);
  if (!resolved) notFound();
  const { product, fromDb } = resolved;

  const related = fromDb
    ? await getRelatedProducts(product.category, product.id)
    : ALL_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-matte-black pt-28">
      <TrackRecentlyViewed productId={product.id} />

      <div className="container-fluid mb-8 flex items-center gap-2 font-body text-xs text-ash-light">
        <Link href="/" className="hover:text-fog">Home</Link>
        <ChevronRight size={12} />
        <Link href="/shop" className="hover:text-fog">Shop</Link>
        <ChevronRight size={12} />
        <span className="text-fog">{product.name}</span>
      </div>

      <div className="container-fluid grid gap-12 pb-10 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <ProductPurchasePanel product={product} />
      </div>

      <div className="container-fluid">
        <ProductTabs reviewCount={product.reviewCount} />
      </div>

      {related.length > 0 && (
        <ProductSection
          eyebrow="You Might Also Like"
          title="Related pieces"
          viewAllHref={`/shop?category=${product.category}`}
          products={related}
        />
      )}
    </div>
  );
}
