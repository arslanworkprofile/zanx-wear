import { connectDB } from '@/lib/mongodb';
import CategoryModel from '@/models/Category';
import ProductForm from '@/components/admin/ProductForm';

async function getCategories() {
  try {
    await connectDB();
    const docs = await CategoryModel.find().sort({ order: 1 }).lean();
    return docs.map((d: any) => ({ _id: d._id.toString(), name: d.name }));
  } catch {
    return [];
  }
}

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Catalog</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Add Product
        </h1>
      </div>

      {categories.length === 0 && (
        <div className="mb-6 rounded-xl2 border border-line bg-white/5 p-5 font-body text-sm text-ash-light">
          No categories yet — <a href="/admin/categories" className="text-fog underline">create one first</a>,
          or connect your database if this looks wrong.
        </div>
      )}

      <ProductForm categories={categories} />
    </div>
  );
}
