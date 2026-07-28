'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlistStore';
import { getWishlistProducts } from '@/actions/products';
import ProductCard from '@/components/product/ProductCard';
import type { ProductCardData } from '@/types';

export default function WishlistPage() {
  const { productIds } = useWishlistStore();
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // The store hydrates from localStorage a tick after mount, so this
    // effect re-runs once productIds actually reflects saved wishlist items.
    let cancelled = false;

    async function load() {
      setLoading(true);
      if (productIds.length === 0) {
        if (!cancelled) {
          setProducts([]);
          setLoading(false);
        }
        return;
      }
      const results = await getWishlistProducts(productIds);
      if (!cancelled) {
        setProducts(results);
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [productIds]);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl2 border border-line bg-white/5 p-10">
        <Loader2 className="h-5 w-5 animate-spin text-ash-light" />
      </div>
    );
  }

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
