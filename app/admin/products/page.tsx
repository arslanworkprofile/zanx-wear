import Link from 'next/link';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { formatPrice } from '@/lib/utils';
import { deleteProduct } from '@/actions/products';

async function getProducts() {
  try {
    await connectDB();
    const [docs, categoryDocs] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).limit(100).lean(),
      Category.find().lean(),
    ]);
    const categoryMap = new Map(categoryDocs.map((c: any) => [c._id.toString(), c.name]));
    return { products: docs, categoryMap, connected: true };
  } catch {
    return { products: [] as any[], categoryMap: new Map(), connected: false };
  }
}

export default async function AdminProductsPage() {
  const { products, categoryMap, connected } = await getProducts();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="eyebrow">Catalog</span>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
            Products
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-fog px-5 py-2.5 font-body text-sm font-medium text-matte-black hover:opacity-90"
        >
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {!connected ? (
        <EmptyBox message="Connect your MongoDB Atlas database to manage products here." />
      ) : products.length === 0 ? (
        <EmptyBox message="No products yet. Add your first one to get started." />
      ) : (
        <div className="overflow-x-auto rounded-xl2 border border-line">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-white/5 font-body text-xs uppercase tracking-wide text-ash-light">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Stock</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {products.map((p: any) => {
                const stock = (p.variants ?? []).reduce(
                  (sum: number, v: any) => sum + (v.stock ?? 0),
                  0
                );
                const categoryName = categoryMap.get(p.category?.toString()) ?? '—';
                return (
                  <tr key={p._id.toString()} className="border-b border-line last:border-0">
                    <td className="px-5 py-4 font-body text-sm text-fog">
                      <Link href={`/admin/products/${p._id.toString()}/edit`} className="hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-ash-light">{categoryName}</td>
                    <td className="px-5 py-4 font-body text-sm text-fog">
                      {formatPrice(p.discountPrice ?? p.price)}
                    </td>
                    <td className="px-5 py-4 font-body text-sm text-ash-light">{stock}</td>
                    <td className="px-5 py-4 font-body text-xs">
                      <span
                        className={
                          stock > 0
                            ? 'rounded-full bg-white/5 px-2.5 py-1 text-fog'
                            : 'rounded-full bg-white/5 px-2.5 py-1 text-ash-dark'
                        }
                      >
                        {stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${p._id.toString()}/edit`}
                          aria-label="Edit product"
                          className="text-ash-light hover:text-fog"
                        >
                          <Pencil size={15} />
                        </Link>
                        <form action={deleteProduct.bind(null, p._id.toString())}>
                          <button
                            type="submit"
                            aria-label="Delete product"
                            className="text-ash-dark hover:text-fog"
                          >
                            <Trash2 size={15} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
