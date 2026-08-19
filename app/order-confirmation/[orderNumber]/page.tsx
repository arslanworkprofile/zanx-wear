import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { formatPrice } from '@/lib/utils';

async function getOrder(orderNumber: string) {
  try {
    await connectDB();
    const doc = await Order.findOne({ orderNumber }).lean();
    return doc as any;
  } catch {
    return null;
  }
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrder(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 md:py-32">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 size={44} strokeWidth={1.25} className="text-emerald-400" />
        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tightest2 text-fog md:text-4xl">
          Thank you for your order
        </h1>
        <p className="mt-3 font-body text-sm text-ash-light">
          A confirmation has been sent to <span className="text-fog">{order.guestEmail}</span>.
          We&apos;ll notify you as soon as it ships.
        </p>
        <p className="mt-1 font-body text-sm text-ash-light">
          Order <span className="text-fog">#{order.orderNumber}</span>
        </p>
      </div>

      <div className="mt-10 overflow-hidden rounded-xl2 border border-line">
        <div className="border-b border-line bg-white/5 px-5 py-3 font-body text-xs uppercase tracking-wide text-ash-light">
          Order Summary
        </div>
        <div className="divide-y divide-line">
          {(order.items ?? []).map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-body text-sm text-fog">{item.name}</p>
                <p className="mt-0.5 font-body text-xs text-ash-light">
                  Size {item.size} · Color {item.color} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-body text-sm text-fog">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
        <div className="space-y-1.5 border-t border-line px-5 py-4 font-body text-sm">
          <div className="flex justify-between text-ash-light">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-ash-light">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-ash-light">
            <span>Shipping</span>
            <span>{order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Free'}</span>
          </div>
          <div className="flex justify-between border-t border-line pt-2 font-medium text-fog">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl2 border border-line p-5">
        <p className="mb-3 font-body text-xs uppercase tracking-wide text-ash-light">
          Shipping to
        </p>
        <div className="space-y-0.5 font-body text-sm text-ash-light">
          <p className="text-fog">{order.shippingAddress?.fullName}</p>
          <p>{order.shippingAddress?.line1}</p>
          {order.shippingAddress?.line2 && <p>{order.shippingAddress.line2}</p>}
          <p>
            {order.shippingAddress?.city}
            {order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}{' '}
            {order.shippingAddress?.postalCode}
          </p>
          <p>{order.shippingAddress?.country}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/account/orders"
          className="flex-1 rounded-full border border-line py-3 text-center font-body text-sm text-fog transition-colors hover:border-silver/40"
        >
          View My Orders
        </Link>
        <Link
          href="/shop"
          className="flex-1 rounded-full bg-fog py-3 text-center font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
