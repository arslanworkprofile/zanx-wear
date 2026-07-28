'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Minus, Plus, X, ShoppingBag, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 100;
const FLAT_SHIPPING = 5;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCartStore();
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [zip, setZip] = useState('');
  const [shippingEstimate, setShippingEstimate] = useState<number | null>(null);

  const sub = subtotal();
  const discount = appliedCoupon ? sub * appliedCoupon.discount : 0;
  const shipping = shippingEstimate ?? (sub - discount >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING);
  const total = sub - discount + shipping;

  const applyCoupon = () => {
    // TODO: replace with a server action that validates against the Coupon collection
    if (coupon.trim().toUpperCase() === 'ZANX10') {
      setAppliedCoupon({ code: 'ZANX10', discount: 0.1 });
      toast.success('10% discount applied');
    } else {
      toast.error('Invalid or expired coupon code');
    }
  };

  const estimateShipping = () => {
    if (!zip.trim()) {
      toast.error('Enter a postal code first');
      return;
    }
    // TODO: replace with a real shipping-rate lookup
    setShippingEstimate(sub >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING);
    toast.success('Shipping estimated for your area');
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-5 bg-matte-black px-6 pt-20 text-center">
        <ShoppingBag size={44} strokeWidth={1} className="text-ash-dark" />
        <h1 className="font-display text-2xl font-semibold text-fog">Your bag is empty</h1>
        <p className="max-w-sm font-body text-sm text-ash-light">
          Looks like you haven't added anything yet. Explore the collection to find your next piece.
        </p>
        <Button size="lg" asChild>
          <Link href="/shop">Shop the Collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black pb-28 pt-32">
      <div className="container-fluid">
        <h1 className="font-display text-4xl font-semibold tracking-tightest2 text-fog md:text-5xl">
          Your Bag
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.color}`}
                className="flex gap-5 border-b border-line py-7"
              >
                <div className="h-32 w-24 shrink-0 rounded-xl2 bg-steel-gradient" />
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-body text-base text-fog">{item.name}</p>
                      <p className="mt-1 font-body text-sm text-ash-light">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId, item.size, item.color)}
                      aria-label="Remove item"
                      className="text-ash-dark hover:text-fog"
                    >
                      <X size={17} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 rounded-full border border-line px-3 py-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                        className="text-ash-light hover:text-fog"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-4 text-center font-body text-sm text-fog">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                        className="text-ash-light hover:text-fog"
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="font-display text-lg text-fog">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-panel h-fit rounded-xl2 p-7">
            <h2 className="mb-6 font-display text-lg font-semibold text-fog">Order Summary</h2>

            <div className="mb-5">
              <label className="mb-2 flex items-center gap-2 font-body text-xs text-ash-light">
                <Tag size={12} /> Promo code
              </label>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="ZANX10"
                  className="h-11 flex-1 rounded-full border border-line bg-white/5 px-4 font-body text-sm text-fog placeholder:text-ash-dark focus:border-silver/40 focus:outline-none"
                />
                <Button variant="outline" size="sm" onClick={applyCoupon} className="h-11 px-5">
                  Apply
                </Button>
              </div>
              {appliedCoupon && (
                <p className="mt-2 font-body text-xs text-ash-light">
                  Code {appliedCoupon.code} applied — {appliedCoupon.discount * 100}% off
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="mb-2 block font-body text-xs text-ash-light">
                Estimate shipping
              </label>
              <div className="flex gap-2">
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="Postal code"
                  className="h-11 flex-1 rounded-full border border-line bg-white/5 px-4 font-body text-sm text-fog placeholder:text-ash-dark focus:border-silver/40 focus:outline-none"
                />
                <Button variant="outline" size="sm" onClick={estimateShipping} className="h-11 px-5">
                  Estimate
                </Button>
              </div>
            </div>

            <div className="hairline mb-5" />

            <div className="space-y-3 font-body text-sm">
              <div className="flex justify-between text-ash-light">
                <span>Subtotal</span>
                <span className="text-fog">{formatPrice(sub)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-ash-light">
                  <span>Discount</span>
                  <span className="text-fog">-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ash-light">
                <span>Shipping</span>
                <span className="text-fog">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="hairline my-3" />
              <div className="flex justify-between font-display text-lg font-semibold text-fog">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button size="lg" className="mt-7 w-full" asChild>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
