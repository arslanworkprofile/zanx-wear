import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import AddressModel from '@/models/Address';
import AddressManager from '@/components/account/AddressManager';

async function getAddresses(userId: string) {
  try {
    await connectDB();
    const docs = await AddressModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
    return docs.map((d: any) => ({ ...d, _id: d._id.toString() }));
  } catch {
    return null;
  }
}

export default async function AddressesPage() {
  const session = await auth();
  const addresses = session?.user?.id ? await getAddresses(session.user.id) : null;

  if (addresses === null) {
    return (
      <div className="rounded-xl2 border border-line bg-white/5 p-10 text-center">
        <p className="font-body text-sm text-ash-light">
          Connect your MongoDB Atlas database to manage saved addresses here.
        </p>
      </div>
    );
  }

  return <AddressManager addresses={addresses} />;
}
