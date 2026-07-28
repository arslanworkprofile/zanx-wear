import { notFound } from 'next/navigation';
import { safeConnectDB } from '@/lib/safe-connect';
import ProductModel from '@/models/Product';
import CategoryModel from '@/models/Category';
import ProductForm, { type ExistingProduct } from '@/components/admin/ProductForm';

async function getData(id: string) {
  const db = await safeConnectDB();
  if (!db.ok) return { connected: false as const };

  const [productDoc, categoryDocs] = await Promise.all([
    ProductModel.findById(id).lean(),
    CategoryModel.find().sort({ order: 1 }).lean(),
  ]);

  if (!productDoc) return { connected: true as const, product: null };

  const product: ExistingProduct = {
    _id: (productDoc as any)._id.toString(),
    name: (productDoc as any).name,
    description: (productDoc as any).description,
    category: (productDoc as any).category?.toString() ?? '',
    gender: (productDoc as any).gender,
    price: (productDoc as any).price,
    discountPrice: (productDoc as any).discountPrice,
    tags: (productDoc as any).tags ?? [],
    isFeatured: (productDoc as any).isFeatured,
    isTrending: (productDoc as any).isTrending,
    isNewArrival: (productDoc as any).isNewArrival,
    isBestSeller: (productDoc as any).isBestSeller,
    images: ((productDoc as any).images ?? []).map((img: any) => ({
      fileId: img.fileId?.toString(),
      thumbFileId: img.thumbFileId?.toString(),
      url: `/api/images/${img.fileId?.toString()}`,
      thumbUrl: `/api/images/${(img.thumbFileId ?? img.fileId)?.toString()}`,
      alt: img.alt ?? '',
    })),
    variants: (productDoc as any).variants ?? [],
  };

  const categories = categoryDocs.map((c: any) => ({ _id: c._id.toString(), name: c.name }));

  return { connected: true as const, product, categories };
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getData(id);

  if (!data.connected) {
    return (
      <div className="rounded-xl2 border border-line bg-white/5 p-10 text-center font-body text-sm text-ash-light">
        Connect your MongoDB Atlas database to edit products here.
      </div>
    );
  }

  if (!data.product) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Catalog</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Edit Product
        </h1>
      </div>
      <ProductForm categories={data.categories ?? []} product={data.product} />
    </div>
  );
}
