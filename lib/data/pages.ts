import { connectDB } from '@/lib/mongodb';
import Page from '@/models/Page';
import { DEFAULT_PAGES } from '@/lib/default-pages';

export type PublicPage = {
  slug: string;
  title: string;
  content: string;
  updatedAt?: Date;
};

export async function getPublicPage(slug: string): Promise<PublicPage | null> {
  try {
    await connectDB();
    const doc = await Page.findOne({ slug }).lean();
    if (doc) {
      return {
        slug,
        title: (doc as any).title,
        content: (doc as any).content,
        updatedAt: (doc as any).updatedAt,
      };
    }
  } catch {
    // fall through to default content below
  }

  const fallback = DEFAULT_PAGES[slug];
  if (!fallback) return null;
  return { slug, title: fallback.title, content: fallback.content };
}

export async function getAllAdminPages(): Promise<
  { slug: string; title: string; updatedAt?: Date; isCustomized: boolean }[]
> {
  let saved: Record<string, { title: string; updatedAt: Date }> = {};
  try {
    await connectDB();
    const docs = await Page.find().lean();
    saved = Object.fromEntries(
      docs.map((d: any) => [d.slug, { title: d.title, updatedAt: d.updatedAt }])
    );
  } catch {
    // DB unavailable — just show defaults
  }

  const defaultSlugs = Object.keys(DEFAULT_PAGES);
  const allSlugs = Array.from(new Set([...defaultSlugs, ...Object.keys(saved)]));

  return allSlugs.map((slug) => ({
    slug,
    title: saved[slug]?.title ?? DEFAULT_PAGES[slug]?.title ?? slug,
    updatedAt: saved[slug]?.updatedAt,
    isCustomized: !!saved[slug],
  }));
}
