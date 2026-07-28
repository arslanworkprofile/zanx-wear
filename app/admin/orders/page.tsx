import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { formatPrice } from '@/lib/utils';

async function getOrders() {
  try {
    await connectDB();
    const docs = await Order.find().sort({ createdAt: -1 }).limit(100).lean();
    return { orders: docs, connected: true };
  } catch {
    return { orders: [] as any[], connected: false };
  }
}

export default async function AdminOrdersPage() {
  const { orders, connected } = await getOrders();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Fulfillment</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Orders
        </h1>
      </div>

      {!connected ? (
        <EmptyBox message="Connect your MongoDB Atlas database to manage orders here." />
      ) : orders.length === 0 ? (
        <EmptyBox message="No orders yet." />
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
              </tr>
            </thead>
            <tbody>
              {orders.map((o: any) => (
                <tr key={o._id.toString()} className="border-b border-line last:border-0">
                  <td className="px-5 py-4 font-body text-sm text-fog">#{o.orderNumber}</td>
                  <td className="px-5 py-4 font-body text-sm text-ash-light">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-body text-sm capitalize text-ash-light">
                    {o.payment?.provider} · {o.payment?.status}
                  </td>
                  <td className="px-5 py-4 font-body text-sm capitalize text-fog">{o.status}</td>
                  <td className="px-5 py-4 font-body text-sm text-fog">{formatPrice(o.total)}</td>
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
