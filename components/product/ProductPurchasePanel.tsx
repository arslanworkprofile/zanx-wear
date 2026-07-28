'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Minus, Plus, Heart, X, Star, Truck, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import type { FullProduct } from '@/lib/mock-data';

export default function ProductPurchasePanel({ product }: { product: FullProduct }) {
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { has, toggle } = useWishlistStore();
  const wished = has(product.id);

  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= 5;

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size first');
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      imageUrl: product.imageUrl,
      price: product.discountPrice ?? product.price,
      size,
      color,
      quantity: qty,
    });
    toast.success('Added to your bag');
  };

  return (
    <div>
      <p className="eyebrow">{product.category}</p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tightest2 text-fog md:text-4xl">
        {product.name}
      </h1>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1 text-fog">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              fill={i < Math.round(product.rating) ? '#F2F2F0' : 'none'}
              strokeWidth={1.2}
            />
          ))}
        </div>
        <span className="font-body text-xs text-ash-light">
          {product.rating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
      </div>

      <div className="mt-5 flex items-baseline gap-3">
        <span className="font-display text-2xl font-semibold text-fog">
          {formatPrice(product.discountPrice ?? product.price)}
        </span>
        {product.discountPrice && (
          <span className="font-body text-base text-ash-dark line-through">
            {formatPrice(product.price)}
          </span>
        )}
      </div>

      <p className="mt-6 font-body text-sm leading-relaxed text-ash-light">
        {product.description}
      </p>

      <div className="hairline my-7" />

      {/* Color */}
      <div>
        <p className="mb-3 font-body text-sm text-fog">Color</p>
        <div className="flex gap-3">
          {product.colors.map((hex) => (
            <button
              key={hex}
              onClick={() => setColor(hex)}
              aria-label={hex}
              className={cn(
                'h-9 w-9 rounded-full ring-2 ring-offset-2 ring-offset-matte-black transition-all',
                color === hex ? 'ring-fog' : 'ring-transparent hover:ring-line'
              )}
              style={{ backgroundColor: hex }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-body text-sm text-fog">Size</p>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="font-body text-xs text-ash-light underline-offset-4 hover:text-fog hover:underline"
          >
            Size Guide
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn(
                'flex h-11 min-w-11 items-center justify-center rounded-full border px-3 font-body text-sm transition-colors',
                size === s
                  ? 'border-fog bg-fog text-matte-black'
                  : 'border-line text-fog hover:border-silver/40'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stock status */}
      <p
        className={cn(
          'mt-4 font-body text-xs',
          !inStock ? 'text-ash-dark' : lowStock ? 'text-fog' : 'text-ash-light'
        )}
      >
        {!inStock ? 'Out of stock' : lowStock ? `Only ${product.stock} left in stock` : 'In stock'}
      </p>

      {/* Quantity + Add to cart */}
      <div className="mt-7 flex items-center gap-4">
        <div className="flex items-center gap-4 rounded-full border border-line px-4 py-3">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="text-ash-light hover:text-fog"
          >
            <Minus size={14} />
          </button>
          <span className="w-4 text-center font-body text-sm text-fog">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
            className="text-ash-light hover:text-fog"
          >
            <Plus size={14} />
          </button>
        </div>
        <Button size="lg" className="flex-1" disabled={!inStock} onClick={handleAddToCart}>
          {inStock ? 'Add to Bag' : 'Notify Me'}
        </Button>
        <button
          onClick={() => toggle(product.id)}
          aria-label="Toggle wishlist"
          className={cn(
            'flex h-14 w-14 shrink-0 items-center justify-center rounded-full border transition-colors',
            wished ? 'border-fog bg-fog text-matte-black' : 'border-line text-fog hover:border-silver/40'
          )}
        >
          <Heart size={17} fill={wished ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      </div>

      <div className="hairline my-7" />

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Truck size={16} className="mt-0.5 shrink-0 text-ash-light" />
          <p className="font-body text-xs text-ash-light">
            Free shipping on orders over $100. Standard delivery in 3–5 business days.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw size={16} className="mt-0.5 shrink-0 text-ash-light" />
          <p className="font-body text-xs text-ash-light">
            30-day returns. Items must be unworn with tags attached.
          </p>
        </div>
      </div>

      <Dialog.Root open={sizeGuideOpen} onOpenChange={setSizeGuideOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[100] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl2 border border-line bg-matte-900 p-7 shadow-premium">
            <div className="mb-5 flex items-center justify-between">
              <Dialog.Title className="font-display text-lg font-semibold text-fog">
                Size Guide
              </Dialog.Title>
              <Dialog.Close aria-label="Close" className="text-ash-light hover:text-fog">
                <X size={18} />
              </Dialog.Close>
            </div>
            <table className="w-full text-left font-body text-sm text-ash-light">
              <thead>
                <tr className="border-b border-line text-fog">
                  <th className="pb-2 font-medium">Size</th>
                  <th className="pb-2 font-medium">Chest (in)</th>
                  <th className="pb-2 font-medium">Waist (in)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['XS', '34', '28'],
                  ['S', '36', '30'],
                  ['M', '39', '32'],
                  ['L', '42', '35'],
                  ['XL', '45', '38'],
                  ['XXL', '48', '41'],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-line/50">
                    <td className="py-2">{row[0]}</td>
                    <td className="py-2">{row[1]}</td>
                    <td className="py-2">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
