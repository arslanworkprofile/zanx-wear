'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import type { ProductCardData } from '@/types';

function isRealImage(src: string) {
  return src.startsWith('/') || src.startsWith('http');
}

export default function ProductCard({ product }: { product: ProductCardData }) {
  const { has, toggle } = useWishlistStore();
  const wished = has(product.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl2 bg-matte-800">
          {isRealImage(product.imageUrl) ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
          ) : (
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br transition-opacity duration-500',
                product.imageUrl
              )}
            />
          )}
          {product.hoverImageUrl && isRealImage(product.hoverImageUrl) && (
            <img
              src={product.hoverImageUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          {product.hoverImageUrl && !isRealImage(product.hoverImageUrl) && (
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-tl opacity-0 transition-opacity duration-500 group-hover:opacity-100',
                product.hoverImageUrl
              )}
            />
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-fog px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-matte-black">
                New
              </span>
            )}
            {product.isSale && (
              <span className="rounded-full bg-matte-black/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-fog ring-1 ring-line">
                Sale
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggle(product.id);
            }}
            aria-label="Toggle wishlist"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-matte-black/60 text-fog opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
          >
            <Heart size={14} fill={wished ? '#F2F2F0' : 'none'} strokeWidth={1.5} />
          </button>

          {/* Quick view */}
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              onClick={(e) => e.preventDefault()}
              className="glass-panel flex w-full items-center justify-center gap-2 rounded-full py-2.5 font-body text-xs text-fog"
            >
              <Eye size={13} /> Quick View
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between">
          <div>
            <h3 className="font-body text-sm text-fog">{product.name}</h3>
            <div className="mt-1 flex gap-1.5">
              {product.colors.map((c) => (
                <span
                  key={c}
                  className="h-3 w-3 rounded-full ring-1 ring-line"
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="text-right">
            {product.discountPrice ? (
              <>
                <p className="font-body text-sm text-fog">{formatPrice(product.discountPrice)}</p>
                <p className="font-body text-xs text-ash-dark line-through">
                  {formatPrice(product.price)}
                </p>
              </>
            ) : (
              <p className="font-body text-sm text-fog">{formatPrice(product.price)}</p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
