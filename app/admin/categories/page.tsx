import { connectDB } from '@/lib/mongodb';
import CategoryModel from '@/models/Category';
import CategoryManager from '@/components/admin/CategoryManager';

async function getCategories() {
  try {
    await connectDB();
    const docs = await CategoryModel.find().sort({ order: 1 }).lean();
    return { categories: docs.map((d: any) => ({ ...d, _id: d._id.toString() })), connected: true };
  } catch {
    return { categories: [], connected: false };
  }
}

export default async function AdminCategoriesPage() {
  const { categories, connected } = await getCategories();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Catalog</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Categories
        </h1>
      </div>

      {!connected && (
        <div className="mb-6 rounded-xl2 border border-line bg-white/5 p-5 font-body text-sm text-ash-light">
          Not connected to MongoDB Atlas — you can still fill out the form below, but saving
          will fail until <code className="text-fog">MONGODB_URI</code> in{' '}
          <code className="text-fog">.env.local</code> points to a reachable database.
        </div>
      )}

      <CategoryManager categories={categories} />
    </div>
  );
}
