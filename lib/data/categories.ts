import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export type PublicCategory = {
  _id: string;
  name: string;
  slug: string;
  order: number;
};

/**
 * Categories created in the admin panel need to show up on the public
 * storefront (homepage category tiles, shop page filters). Call this from
 * public server components/pages instead of relying on the old hardcoded
 * mock list.
 */
export async function getPublicCategories(): Promise<PublicCategory[]> {
  try {
    await connectDB();
    const docs = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .lean();
    return docs.map((d: any) => ({
      _id: d._id.toString(),
      name: d.name,
      slug: d.slug,
      order: d.order ?? 0,
    }));
  } catch {
    // DB not reachable — let callers fall back to placeholder data.
    return [];
  }
}
