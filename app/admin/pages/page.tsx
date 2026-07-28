import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';
import { getAllAdminPages } from '@/lib/data/pages';
import { EDITABLE_PAGE_SLUGS } from '@/lib/default-pages';
import { deleteCustomPage } from '@/actions/pages';
import NewPageForm from '@/components/admin/NewPageForm';

export default async function AdminPagesPage() {
  const pages = await getAllAdminPages();

  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Content</span>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Pages
        </h1>
        <p className="mt-2 max-w-xl font-body text-sm text-ash-light">
          Edit the content shown on your footer's Support and Company links — Shipping
          Information, Return Policy, Size Guide, Contact Us, About, Careers, Sustainability,
          Press, Privacy Policy, and Terms of Service.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl2 border border-line">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-line bg-white/5 font-body text-xs uppercase tracking-wide text-ash-light">
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">URL</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.slug} className="border-b border-line last:border-0">
                    <td className="px-5 py-4 font-body text-sm text-fog">{p.title}</td>
                    <td className="px-5 py-4 font-body text-sm text-ash-light">/{p.slug}</td>
                    <td className="px-5 py-4 font-body text-xs text-ash-light">
                      {p.isCustomized ? (
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-fog">Edited</span>
                      ) : (
                        <span className="rounded-full bg-white/5 px-2.5 py-1">Default text</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/pages/${p.slug}/edit`}
                          aria-label="Edit page"
                          className="text-ash-light hover:text-fog"
                        >
                          <Pencil size={14} />
                        </Link>
                        {!EDITABLE_PAGE_SLUGS.includes(p.slug) && (
                          <form action={deleteCustomPage.bind(null, p.slug)}>
                            <button
                              type="submit"
                              aria-label="Delete page"
                              className="text-ash-dark hover:text-fog"
                            >
                              <Trash2 size={15} />
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <NewPageForm />
      </div>
    </div>
  );
}
