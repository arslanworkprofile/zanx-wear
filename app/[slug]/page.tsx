import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPublicPage } from '@/lib/data/pages';
import ContactForm from '@/components/content/ContactForm';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublicPage(slug);
  if (!page) return { title: 'Page not found' };
  return { title: page.title };
}

export default async function ContentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPublicPage(slug);
  if (!page) notFound();

  const paragraphs = page.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <div className="min-h-screen bg-matte-black pt-32">
      <div className="container-fluid max-w-3xl pb-28">
        <span className="eyebrow">Zanx Wear</span>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tightest2 text-fog md:text-5xl">
          {page.title}
        </h1>

        <div className="mt-8 space-y-5">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-body text-sm leading-relaxed text-ash-light md:text-base">
              {p}
            </p>
          ))}
        </div>

        {slug === 'contact' && (
          <>
            <div className="hairline my-10" />
            <ContactForm />
          </>
        )}
      </div>
    </div>
  );
}
