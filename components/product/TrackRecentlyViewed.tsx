'use client';

import { useEffect } from 'react';
import { useRecentlyViewedStore } from '@/store/recentlyViewedStore';

export default function TrackRecentlyViewed({ productId }: { productId: string }) {
  const add = useRecentlyViewedStore((s) => s.add);
  useEffect(() => {
    add(productId);
  }, [productId, add]);
  return null;
}
