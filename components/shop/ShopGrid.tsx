'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import ShopFilters from '@/components/shop/ShopFilters';
import ShopToolbar from '@/components/shop/ShopToolbar';
import { Button } from '@/components/ui/button';
import type { FullProduct } from '@/lib/mock-data';
import type { PublicCategory } from '@/lib/data/categories';

const PAGE_SIZE = 12;

export default function ShopClient({
  products,
  categories,
}: {
  products: FullProduct[];
  categories?: PublicCategory[];
}) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const shown = products.slice(0, visible);

  return (
    <div className="container-fluid flex gap-10 pb-28 pt-10">
      <div className="hidden md:block">
        <ShopFilters categories={categories} />
      </div>

      <div className="flex-1">
        <ShopToolbar count={products.length} onOpenFilters={() => setMobileFiltersOpen(true)} />

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-display text-2xl text-fog">No pieces match those filters</p>
            <p className="mt-2 font-body text-sm text-ash-light">
              Try widening your price range or clearing a filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
              {shown.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {visible < products.length && (
              <div className="mt-14 flex justify-center">
                <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-y-0 left-0 z-[80] w-full max-w-xs overflow-y-auto bg-matte-900 p-6 md:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-display text-lg font-semibold text-fog">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={20} className="text-ash-light" />
                </button>
              </div>
              <ShopFilters categories={categories} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
