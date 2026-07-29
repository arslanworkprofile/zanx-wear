import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { safeConnectDB } from '@/lib/safe-connect';
import Order from '@/models/Order';
import User from '@/models/User';
import { formatPrice } from '@/lib/utils';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import OrderStatusControl from '@/components/admin/OrderStatusControl';

// Ensure the User model is registered before .populate('user') runs.
void User;

async function getOrder(id: string) {
  const db = await safeConnectDB();
  if (!db.ok) return { connected: false as const };

  const doc = await Order.findById(id).populate('user', 'name email').lean();
  if (!doc) return { connected: true as const, order: null };

  return { connected: true as const, order: doc as any };
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getOrder(id);

  if (!data.connected) {
    return (
      <div className="rounded-xl2 border border-line bg-white/5 p-10 text-center font-body text-sm text-ash-light">
        Connect your MongoDB Atlas database to view orders here.
      </div>
    );
  }

  if (!data.order) {
    notFound();
  }

  const order = data.order;
  const customerName = order.user?.name ?? order.shippingAddress?.fullName ?? 'Guest';
  const customerEmail = order.user?.email ?? order.guestEmail ?? '—';

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-6 inline-flex items-center gap-2 font-body text-sm text-ash-light transition-colors hover:text-fog"
      >
        <ArrowLeft size={15} strokeWidth={1.5} />
        Back to orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">Order</span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
            #{order.orderNumber}
          </h1>
          <p className="mt-1 font-body text-sm text-ash-light">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: items + customer/address info */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <div className="overflow-hidden rounded-xl2 border border-line">
            <div className="border-b border-line bg-white/5 px-5 py-3 font-body text-xs uppercase tracking-wide text-ash-light">
              Items
            </div>
            <div className="divide-y divide-line">
              {(order.items ?? []).map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-matte-800">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-body text-sm text-fog">{item.name}</p>
                    <p className="mt-0.5 font-body text-xs text-ash-light">
                      Size {item.size} · Color {item.color} · Qty {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-body text-sm text-fog">
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
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ash-light">
                <span>Shipping</span>
                <span>{formatPrice(order.shippingFee)}</span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-ash-light">
                  <span>Tax</span>
                  <span>{formatPrice(order.tax)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-2 font-medium text-fog">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-xl2 border border-line p-5">
            <p className="mb-3 font-body text-xs uppercase tracking-wide text-ash-light">
              Customer
            </p>
            <p className="font-body text-sm text-fog">{customerName}</p>
            <p className="font-body text-sm text-ash-light">{customerEmail}</p>
            <p className="font-body text-sm text-ash-light">{order.shippingAddress?.phone}</p>
          </div>

          {/* Shipping address */}
          <div className="rounded-xl2 border border-line p-5">
            <p className="mb-3 font-body text-xs uppercase tracking-wide text-ash-light">
              Shipping Address
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
        </div>

        {/* Right: status control + payment info */}
        <div className="space-y-6">
          <OrderStatusControl
            orderId={order._id.toString()}
            currentStatus={order.status}
            currentTracking={order.trackingNumber}
          />

          <div className="rounded-xl2 border border-line p-5">
            <p className="mb-3 font-body text-xs uppercase tracking-wide text-ash-light">
              Payment
            </p>
            <div className="space-y-1.5 font-body text-sm">
              <div className="flex justify-between">
                <span className="text-ash-light">Method</span>
                <span className="capitalize text-fog">{order.payment?.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ash-light">Status</span>
                <span className="capitalize text-fog">{order.payment?.status}</span>
              </div>
              {order.payment?.transactionId && (
                <div className="flex justify-between gap-3">
                  <span className="shrink-0 text-ash-light">Transaction ID</span>
                  <span className="truncate text-fog">{order.payment.transactionId}</span>
                </div>
              )}
              {order.payment?.paidAt && (
                <div className="flex justify-between">
                  <span className="text-ash-light">Paid At</span>
                  <span className="text-fog">
                    {new Date(order.payment.paidAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
