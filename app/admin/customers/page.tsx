import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

async function getCustomers() {
  try {
    await connectDB();
    const docs = await User.find({ role: 'customer' }).sort({ createdAt: -1 }).limit(100).lean();
    return { customers: docs, connected: true };
  } catch {
    return { customers: [] as any[], connected: false };
  }
}

export default async function AdminCustomersPage() {
  const { customers, connected } = await getCustomers();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">People</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Customers
        </h1>
      </div>

      {!connected ? (
        <EmptyBox message="Connect your MongoDB Atlas database to see registered customers here." />
      ) : customers.length === 0 ? (
        <EmptyBox message="No customers have registered yet." />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-line">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-white/5 font-body text-xs uppercase tracking-wide text-ash-light">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Provider</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any) => (
                <tr key={c._id.toString()} className="border-b border-line last:border-0">
                  <td className="px-5 py-4 font-body text-sm text-fog">{c.name}</td>
                  <td className="px-5 py-4 font-body text-sm text-ash-light">{c.email}</td>
                  <td className="px-5 py-4 font-body text-sm text-ash-light">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-body text-sm capitalize text-ash-light">
                    {c.provider}
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
