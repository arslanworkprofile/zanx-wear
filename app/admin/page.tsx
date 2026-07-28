import { ShoppingBag, Package, Users, DollarSign } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import User from '@/models/User';
import { formatPrice } from '@/lib/utils';

async function getStats() {
  try {
    await connectDB();
    const [productCount, orderCount, customerCount, orders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      Order.find({ 'payment.status': 'paid' }).select('total').lean(),
    ]);
    const revenue = orders.reduce((sum, o: any) => sum + (o.total ?? 0), 0);
    return { productCount, orderCount, customerCount, revenue, connected: true };
  } catch {
    return { productCount: 0, orderCount: 0, customerCount: 0, revenue: 0, connected: false };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Overview</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Dashboard
        </h1>
      </div>

      {!stats.connected && (
        <div className="mb-6 rounded-xl2 border border-line bg-white/5 p-5 font-body text-sm text-ash-light">
          Not connected to MongoDB Atlas yet — add <code className="text-fog">MONGODB_URI</code> to{' '}
          <code className="text-fog">.env.local</code> to see live data here.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="Revenue" value={formatPrice(stats.revenue)} />
        <StatCard icon={Package} label="Orders" value={stats.orderCount.toString()} />
        <StatCard icon={ShoppingBag} label="Products" value={stats.productCount.toString()} />
        <StatCard icon={Users} label="Customers" value={stats.customerCount.toString()} />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl2 border border-line bg-white/5 p-5">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
        <Icon size={16} strokeWidth={1.5} className="text-ash-light" />
      </div>
      <p className="font-display text-2xl font-semibold text-fog">{value}</p>
      <p className="mt-1 font-body text-xs text-ash-light">{label}</p>
    </div>
  );
}
