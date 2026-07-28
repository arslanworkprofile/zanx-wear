import { connectDB } from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import CouponManager from '@/components/admin/CouponManager';

async function getCoupons() {
  try {
    await connectDB();
    const docs = await Coupon.find().sort({ createdAt: -1 }).lean();
    return { coupons: docs.map((d: any) => ({ ...d, _id: d._id.toString() })), connected: true };
  } catch {
    return { coupons: [], connected: false };
  }
}

export default async function AdminCouponsPage() {
  const { coupons, connected } = await getCoupons();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Promotions</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Coupons
        </h1>
      </div>

      {!connected && (
        <div className="mb-6 rounded-xl2 border border-line bg-white/5 p-5 font-body text-sm text-ash-light">
          Not connected to MongoDB Atlas — the form below will show an error on save until{' '}
          <code className="text-fog">MONGODB_URI</code> in <code className="text-fog">.env.local</code>{' '}
          points to a reachable database.
        </div>
      )}

      <CouponManager coupons={coupons} />
    </div>
  );
}
