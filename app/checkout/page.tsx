'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cartStore';
import { placeOrder } from '@/actions/checkout';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  fullName: z.string().min(2, 'Required'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  line1: z.string().min(3, 'Required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'Required'),
  state: z.string().optional(),
  postalCode: z.string().min(3, 'Required'),
  country: z.string().min(2, 'Required'),
  paymentProvider: z.enum(['stripe', 'paypal', 'jazzcash', 'easypaisa', 'cod']),
});
type FormValues = z.infer<typeof schema>;

const PAYMENT_METHODS: { value: FormValues['paymentProvider']; label: string; note: string }[] = [
  { value: 'cod', label: 'Cash on Delivery', note: 'Pay when your order arrives' },
  { value: 'stripe', label: 'Credit / Debit Card (Stripe)', note: 'Requires STRIPE_SECRET_KEY' },
  { value: 'paypal', label: 'PayPal', note: 'Requires PayPal credentials' },
  { value: 'jazzcash', label: 'JazzCash', note: 'Requires JazzCash merchant setup' },
  { value: 'easypaisa', label: 'Easypaisa', note: 'Requires Easypaisa merchant setup' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { country: 'United States', paymentProvider: 'cod' },
  });

  const paymentProvider = watch('paymentProvider');
  const sub = subtotal();
  const shipping = sub >= 100 ? 0 : 5;
  const total = sub + shipping;

  const onSubmit = async (values: FormValues) => {
    if (items.length === 0) {
      toast.error('Your bag is empty');
      return;
    }
    setSubmitting(true);
    const result = await placeOrder({
      email: values.email,
      shippingAddress: {
        fullName: values.fullName,
        phone: values.phone,
        line1: values.line1,
        line2: values.line2,
        city: values.city,
        state: values.state,
        postalCode: values.postalCode,
        country: values.country,
      },
      billingSameAsShipping: true,
      paymentProvider: values.paymentProvider,
      items: items.map((i) => ({
        productId: i.productId,
        name: i.name,
        size: i.size,
        color: i.color,
        price: i.price,
        quantity: i.quantity,
      })),
    });
    setSubmitting(false);

    if (result.success) {
      clearCart();
      toast.success('Order placed successfully');
      router.push(`/order-confirmation/${result.orderNumber}`);
    } else {
      toast.error(result.error ?? 'Something went wrong placing your order');
    }
  };

  return (
    <div className="min-h-screen bg-matte-black pb-28 pt-32">
      <div className="container-fluid">
        <h1 className="font-display text-4xl font-semibold tracking-tightest2 text-fog md:text-5xl">
          Checkout
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-12 grid gap-12 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="mb-5 font-display text-lg font-semibold text-fog">Contact</h2>
              <Field label="Email" error={errors.email?.message}>
                <input {...register('email')} type="email" className="input-field" placeholder="you@example.com" />
              </Field>
              <p className="mt-2 font-body text-xs text-ash-dark">
                Guest checkout — no account required.
              </p>
            </section>

            <section>
              <h2 className="mb-5 font-display text-lg font-semibold text-fog">Shipping Address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={errors.fullName?.message}>
                  <input {...register('fullName')} className="input-field" />
                </Field>
                <Field label="Phone" error={errors.phone?.message}>
                  <input {...register('phone')} className="input-field" />
                </Field>
                <Field label="Address line 1" error={errors.line1?.message} full>
                  <input {...register('line1')} className="input-field" />
                </Field>
                <Field label="Address line 2 (optional)" full>
                  <input {...register('line2')} className="input-field" />
                </Field>
                <Field label="City" error={errors.city?.message}>
                  <input {...register('city')} className="input-field" />
                </Field>
                <Field label="State / Province">
                  <input {...register('state')} className="input-field" />
                </Field>
                <Field label="Postal code" error={errors.postalCode?.message}>
                  <input {...register('postalCode')} className="input-field" />
                </Field>
                <Field label="Country" error={errors.country?.message}>
                  <input {...register('country')} className="input-field" />
                </Field>
              </div>
            </section>

            <section>
              <h2 className="mb-5 font-display text-lg font-semibold text-fog">Payment Method</h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.value}
                    className={cn(
                      'flex cursor-pointer items-center justify-between rounded-xl2 border px-5 py-4 transition-colors',
                      paymentProvider === method.value
                        ? 'border-fog bg-white/5'
                        : 'border-line hover:border-silver/30'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={method.value}
                        checked={paymentProvider === method.value}
                        onChange={() => setValue('paymentProvider', method.value)}
                        className="h-4 w-4 accent-fog"
                      />
                      <div>
                        <p className="font-body text-sm text-fog">{method.label}</p>
                        {method.value !== 'cod' && (
                          <p className="font-body text-xs text-ash-dark">{method.note}</p>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <div className="glass-panel h-fit rounded-xl2 p-7">
            <h2 className="mb-6 font-display text-lg font-semibold text-fog">Order Summary</h2>
            <div className="max-h-64 space-y-4 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3">
                  <div className="h-16 w-12 shrink-0 rounded-lg bg-steel-gradient" />
                  <div className="flex flex-1 justify-between">
                    <div>
                      <p className="font-body text-xs text-fog">{item.name}</p>
                      <p className="font-body text-[11px] text-ash-light">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-body text-xs text-fog">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hairline my-5" />
            <div className="space-y-2 font-body text-sm">
              <div className="flex justify-between text-ash-light">
                <span>Subtotal</span>
                <span className="text-fog">{formatPrice(sub)}</span>
              </div>
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

            <Button type="submit" size="lg" className="mt-7 w-full" disabled={submitting}>
              {submitting ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </div>

      <style>{`
        .input-field {
          height: 3rem;
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.05);
          padding: 0 1rem;
          font-family: var(--font-outfit);
          font-size: 0.875rem;
          color: #F2F2F0;
        }
        .input-field::placeholder { color: #4A4B4E; }
        .input-field:focus { outline: none; border-color: rgba(200,203,208,0.4); }
      `}</style>
    </div>
  );
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="mb-2 block font-body text-xs text-ash-light">{label}</label>
      {children}
      {error && <p className="mt-1.5 font-body text-xs text-ash-light">{error}</p>}
    </div>
  );
}
