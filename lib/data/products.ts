import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { GRADIENTS } from '@/lib/mock-data';
import type { FullProduct } from '@/lib/mock-data';

// Ensure the Category model is registered before any .populate('category') call.
void Category;

function imageUrlFor(fileId: unknown): string {
  return `/api/images/${fileId}`;
}

function gradientFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

/** Maps a lean, category-populated Product doc into the FullProduct shape the UI already knows how to render. */
function mapProduct(doc: any): FullProduct {
  const id = doc._id.toString();
  const images: string[] = (doc.images ?? [])
    .slice()
    .sort((a: any, b: any) => Number(b.isPrimary) - Number(a.isPrimary))
    .map((img: any) => imageUrlFor(img.fileId));

  const primary = images[0] ?? gradientFor(id);
  const hover = images[1] ?? gradientFor(id + '-hover');
  const gallery = images.length > 0 ? images : [gradientFor(id), gradientFor(id + '2'), gradientFor(id + '3')];

  const variants = doc.variants ?? [];
  const sizes = Array.from(new Set(variants.map((v: any) => v.size).filter(Boolean))) as string[];
  const colors = Array.from(new Set(variants.map((v: any) => v.colorHex).filter(Boolean))) as string[];
  const stock = variants.reduce((sum: number, v: any) => sum + (v.stock ?? 0), 0);

  return {
    id,
    name: doc.name,
    slug: doc.slug,
    price: doc.price,
    discountPrice: doc.discountPrice || undefined,
    imageUrl: primary,
    hoverImageUrl: hover,
    colors: colors.length > 0 ? colors : ['#0B0B0C'],
    category: doc.category?.slug ?? '',
    gender: doc.gender ?? 'unisex',
    isNew: !!doc.isNewArrival,
    isSale: !!doc.discountPrice,
    description: doc.description,
    sizes: sizes.length > 0 ? sizes : ['One Size'],
    images: gallery,
    stock,
    rating: doc.ratingAverage ?? 0,
    reviewCount: doc.ratingCount ?? 0,
  };
}

export type HomeSections = {
  featured: FullProduct[];
  trending: FullProduct[];
  newArrivals: FullProduct[];
};

export async function getHomeSections(): Promise<HomeSections> {
  try {
    await connectDB();
    const [featured, trending, newArrivals] = await Promise.all([
      Product.find({ isFeatured: true }).sort({ createdAt: -1 }).limit(8).populate('category').lean(),
      Product.find({ isTrending: true }).sort({ createdAt: -1 }).limit(8).populate('category').lean(),
      Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(4).populate('category').lean(),
    ]);
    return {
      featured: featured.map(mapProduct),
      trending: trending.map(mapProduct),
      newArrivals: newArrivals.map(mapProduct),
    };
  } catch {
    return { featured: [], trending: [], newArrivals: [] };
  }
}

export type ShopFilters = {
  categorySlugs?: string[];
  genders?: string[];
  min?: number;
  max?: number;
  filter?: string; // 'new' | 'sale' | 'trending' | 'featured'
};

export async function getShopProducts(filters: ShopFilters): Promise<FullProduct[]> {
  try {
    await connectDB();

    const query: Record<string, any> = {};

    if (filters.categorySlugs?.length) {
      const cats = await Category.find({ slug: { $in: filters.categorySlugs } }).lean();
      if (cats.length === 0) return []; // named categories exist but match nothing
      query.category = { $in: cats.map((c: any) => c._id) };
    }
    if (filters.genders?.length) query.gender = { $in: filters.genders };
    if (filters.filter === 'new') query.isNewArrival = true;
    if (filters.filter === 'sale') query.discountPrice = { $exists: true, $ne: null };
    if (filters.filter === 'trending') query.isTrending = true;
    if (filters.filter === 'featured') query.isFeatured = true;

    const docs = await Product.find(query).sort({ createdAt: -1 }).populate('category').lean();
    let products = docs.map(mapProduct);

    if (filters.min != null || filters.max != null) {
      const min = filters.min ?? 0;
      const max = filters.max ?? Infinity;
      products = products.filter((p) => {
        const price = p.discountPrice ?? p.price;
        return price >= min && price <= max;
      });
    }

    return products;
  } catch {
    return [];
  }
}

export async function getProductBySlugFromDB(slug: string): Promise<FullProduct | null> {
  try {
    await connectDB();
    const doc = await Product.findOne({ slug }).populate('category').lean();
    if (!doc) return null;
    return mapProduct(doc);
  } catch {
    return null;
  }
}

export async function hasAnyProducts(): Promise<boolean> {
  try {
    await connectDB();
    const count = await Product.estimatedDocumentCount();
    return count > 0;
  } catch {
    return false;
  }
}

export async function getRelatedProducts(category: string, excludeId: string): Promise<FullProduct[]> {
  try {
    await connectDB();
    const cat = await Category.findOne({ slug: category }).lean();
    if (!cat) return [];
    const docs = await Product.find({ category: (cat as any)._id, _id: { $ne: excludeId } })
      .limit(4)
      .populate('category')
      .lean();
    return docs.map(mapProduct);
  } catch {
    return [];
  }
}
