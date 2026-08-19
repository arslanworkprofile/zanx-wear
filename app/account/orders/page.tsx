import Link from 'next/link';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { formatPrice } from '@/lib/utils';
import { cn } from '@/lib/utils';
import DeleteOrderButton from '@/components/account/DeleteOrderButton';

const STATUS_STYLES: Record<string, string> = {
  pending: 'text-ash-light',
  processing: 'text-silver',
  shipped: 'text-fog',
  delivered: 'text-green-400',
  cancelled: 'text-red-400',
  refunded: 'text-ash-dark',
};

async function getOrders(userId: string, email?: string | null) {
  try {
    await connectDB();
    // Matches by linked user id (new orders) as well as guest email (orders
    // placed before accounts were linked, or if a customer checked out as a
    // guest with the same email before creating an account).
    const ownerQuery = email ? { $or: [{ user: userId }, { guestEmail: email }] } : { user: userId };
    const query = { ...ownerQuery, hiddenByCustomer: { $ne: true } };
    return await Order.find(query).sort({ createdAt: -1 }).lean();
  } catch {
    return null;
  }
}

export default async function OrdersPage() {
  const session = await auth();
  const orders = session?.user?.id
    ? await getOrders(session.user.id, session.user.email)
    : null;

  if (orders === null) {
    return (
      <EmptyState message="Connect your MongoDB Atlas database to see your order history here." />
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        message="You haven't placed any orders yet."
        cta={{ label: 'Start Shopping', href: '/shop' }}
      />
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order: any) => (
        <div key={order._id.toString()} className="rounded-xl2 border border-line bg-white/5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-body text-sm text-fog">Order #{order.orderNumber}</p>
              <p className="font-body text-xs text-ash-light">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span
              className={cn(
                'font-body text-xs font-medium capitalize',
                STATUS_STYLES[order.status] ?? 'text-ash-light'
              )}
            >
              {order.status}
            </span>
            <p className="font-body text-sm text-fog">{formatPrice(order.total)}</p>
            <DeleteOrderButton orderId={order._id.toString()} status={order.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ message, cta }: { message: string; cta?: { label: string; href: string } }) {
  return (
    <div className="rounded-xl2 border border-line bg-white/5 p-10 text-center">
      <p className="font-body text-sm text-ash-light">{message}</p>
      {cta && (
        <Link
          href={cta.href}
          className="mt-4 inline-block font-body text-sm text-fog underline underline-offset-4"
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
