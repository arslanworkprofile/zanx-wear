'use client';

import Link from 'next/link';
import { useWishlistStore } from '@/store/wishlistStore';
import { ALL_PRODUCTS } from '@/lib/mock-data';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const products = ALL_PRODUCTS.filter((p) => productIds.includes(p.id));

  if (products.length === 0) {
    return (
      <div className="rounded-xl2 border border-line bg-white/5 p-10 text-center">
        <p className="font-body text-sm text-ash-light">Your wishlist is empty.</p>
        <Link
          href="/shop"
          className="mt-4 inline-block font-body text-sm text-fog underline underline-offset-4"
        >
          Browse the catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
