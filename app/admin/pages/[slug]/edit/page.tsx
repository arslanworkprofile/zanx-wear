import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getPublicPage } from '@/lib/data/pages';
import PageEditForm from '@/components/admin/PageEditForm';

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublicPage(slug);
  if (!page) notFound();

  return (
    <div>
      <Link
        href="/admin/pages"
        className="mb-6 inline-flex items-center gap-1.5 font-body text-sm text-ash-light hover:text-fog"
      >
        <ChevronLeft size={15} /> Back to Pages
      </Link>

      <div className="mb-8">
        <span className="eyebrow">Content · /{page.slug}</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Edit {page.title}
        </h1>
      </div>

      <PageEditForm slug={page.slug} title={page.title} content={page.content} />
    </div>
  );
}
