import Link from 'next/link';
import { safeConnectDB } from '@/lib/safe-connect';
import Order from '@/models/Order';
import { formatPrice } from '@/lib/utils';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
];

async function getOrders(status?: string) {
  try {
    const db = await safeConnectDB();
    if (!db.ok) return { orders: [] as any[], connected: false };

    const query = status ? { status } : {};
    const docs = await Order.find(query).sort({ createdAt: -1 }).limit(100).lean();
    return { orders: docs, connected: true };
  } catch {
    return { orders: [] as any[], connected: false };
  }
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const { orders, connected } = await getOrders(status);

  return (
    <div>
      <div className="mb-6">
        <span className="eyebrow">Fulfillment</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Orders
        </h1>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = (status ?? '') === f.value;
          return (
            <Link
              key={f.value}
              href={f.value ? `/admin/orders?status=${f.value}` : '/admin/orders'}
              className={
                active
                  ? 'rounded-full bg-fog px-3.5 py-1.5 font-body text-xs font-medium text-matte-black'
                  : 'rounded-full bg-white/5 px-3.5 py-1.5 font-body text-xs text-ash-light transition-colors hover:bg-white/10 hover:text-fog'
              }
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {!connected ? (
        <EmptyBox message="Connect your MongoDB Atlas database to manage orders here." />
      ) : orders.length === 0 ? (
        <EmptyBox message="No orders found." />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-line">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-white/5 font-body text-xs uppercase tracking-wide text-ash-light">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Payment</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Total</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr
                  key={o._id.toString()}
                  className="border-b border-line last:border-0 transition-colors hover:bg-white/5"
                >
                  <td className="px-5 py-4 font-body text-sm text-fog">
                    <Link href={`/admin/orders/${o._id.toString()}`} className="hover:underline">
                      #{o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-ash-light">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-body text-sm capitalize text-ash-light">
                    {o.payment?.provider} · {o.payment?.status}
                  </td>
                  <td className="px-5 py-4">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-4 font-body text-sm text-fog">{formatPrice(o.total)}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/orders/${o._id.toString()}`}
                      className="font-body text-xs text-ash-light underline underline-offset-4 transition-colors hover:text-fog"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmptyBox({ message }: { message: string }) {
  return (
    <div className="rounded-xl2 border border-line bg-white/5 p-10 text-center font-body text-sm text-ash-light">
      {message}
    </div>
  );
}
