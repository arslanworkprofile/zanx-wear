import Link from 'next/link';
import { Package, Heart, MapPin, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { formatPrice } from '@/lib/utils';

async function getRecentOrders(userId: string) {
  try {
    await connectDB();
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(3).lean();
    return orders;
  } catch {
    // DB not connected yet in this environment — render gracefully instead of crashing.
    return null;
  }
}

export default async function AccountDashboard() {
  const session = await auth();
  const userId = session?.user?.id;
  const orders = userId ? await getRecentOrders(userId) : null;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Package} label="Orders" href="/account/orders" />
        <StatCard icon={Heart} label="Wishlist" href="/account/wishlist" />
        <StatCard icon={MapPin} label="Addresses" href="/account/addresses" />
      </div>

      <div className="rounded-xl2 border border-line bg-white/5 p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-fog">Recent Orders</h2>
          <Link
            href="/account/orders"
            className="flex items-center gap-1.5 font-body text-xs text-ash-light hover:text-fog"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {orders === null ? (
          <p className="font-body text-sm text-ash-light">
            Connect your MongoDB Atlas database (see <code className="text-fog">.env.local</code>)
            to see live order data here.
          </p>
        ) : orders.length === 0 ? (
          <p className="font-body text-sm text-ash-light">
            No orders yet.{' '}
            <Link href="/shop" className="text-fog underline underline-offset-4">
              Start shopping
            </Link>
            .
          </p>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <div
                key={order._id.toString()}
                className="flex items-center justify-between border-b border-line pb-3 last:border-0"
              >
                <div>
                  <p className="font-body text-sm text-fog">#{order.orderNumber}</p>
                  <p className="font-body text-xs text-ash-light capitalize">{order.status}</p>
                </div>
                <p className="font-body text-sm text-fog">{formatPrice(order.total)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Package;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl2 border border-line bg-white/5 p-5 transition-colors hover:border-silver/30"
    >
      <div className="flex items-center gap-3">
        <Icon size={18} strokeWidth={1.5} className="text-ash-light" />
        <span className="font-body text-sm text-fog">{label}</span>
      </div>
      <ArrowRight
        size={14}
        className="text-ash-dark transition-transform group-hover:translate-x-1"
      />
    </Link>
  );
}
