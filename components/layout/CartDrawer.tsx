'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';

export default function CartDrawer() {
  const { isOpen, toggleCart, items, updateQuantity, removeItem, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-matte-900 shadow-premium"
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-6">
              <h2 className="font-display text-lg font-semibold text-fog">
                Your Bag {items.length > 0 && `(${items.length})`}
              </h2>
              <button
                onClick={() => toggleCart(false)}
                aria-label="Close cart"
                className="rounded-full p-2 text-ash-light hover:bg-white/5 hover:text-fog"
              >
                <X size={20} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={40} strokeWidth={1} className="text-ash-dark" />
                <p className="font-body text-ash-light">
                  Your bag is empty. Time to find something premium.
                </p>
                <Button onClick={() => toggleCart(false)} variant="outline">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      className="flex gap-4 border-b border-line py-6"
                    >
                      <div className="h-24 w-20 shrink-0 rounded-lg bg-steel-gradient" />
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <p className="font-body text-sm text-fog">{item.name}</p>
                          <p className="mt-0.5 text-xs text-ash-light">
                            {item.color} / {item.size}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 rounded-full border border-line px-2 py-1">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, item.color, item.quantity - 1)
                              }
                              className="text-ash-light hover:text-fog"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-4 text-center text-xs text-fog">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, item.color, item.quantity + 1)
                              }
                              className="text-ash-light hover:text-fog"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="font-body text-sm text-fog">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        aria-label="Remove item"
                        className="self-start text-ash-dark hover:text-fog"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t border-line px-6 py-6">
                  <div className="mb-4 flex items-center justify-between font-body text-sm">
                    <span className="text-ash-light">Subtotal</span>
                    <span className="text-lg font-medium text-fog">{formatPrice(subtotal())}</span>
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <a href="/checkout">Checkout</a>
                  </Button>
                  <p className="mt-3 text-center text-xs text-ash-dark">
                    Shipping and taxes calculated at checkout
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
