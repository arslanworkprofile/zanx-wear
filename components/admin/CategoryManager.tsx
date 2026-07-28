'use client';

import { useEffect, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Trash2, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { createCategory, updateCategory, deleteCategory, type CategoryFormState } from '@/actions/categories';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
}

const initialState: CategoryFormState = { success: false };

export default function CategoryManager({ categories }: { categories: CategoryItem[] }) {
  const [state, formAction] = useActionState(createCategory, initialState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (state.success) toast.success('Category created.');
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-xl2 border border-line">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-white/5 font-body text-xs uppercase tracking-wide text-ash-light">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-8 text-center font-body text-sm text-ash-light">
                    No categories yet.
                  </td>
                </tr>
              ) : (
                categories.map((c) =>
                  editingId === c._id ? (
                    <EditRow key={c._id} category={c} onDone={() => setEditingId(null)} />
                  ) : (
                    <tr key={c._id} className="border-b border-line last:border-0">
                      <td className="px-5 py-4 font-body text-sm text-fog">{c.name}</td>
                      <td className="px-5 py-4 font-body text-sm text-ash-light">{c.slug}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setEditingId(c._id)}
                            aria-label="Edit category"
                            className="text-ash-light hover:text-fog"
                          >
                            <Pencil size={14} />
                          </button>
                          <form action={deleteCategory.bind(null, c._id)}>
                            <button
                              type="submit"
                              aria-label="Delete category"
                              className="text-ash-dark hover:text-fog"
                            >
                              <Trash2 size={15} />
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form action={formAction} className="h-fit space-y-4 rounded-xl2 border border-line bg-white/5 p-6">
        <h3 className="font-display text-base font-semibold text-fog">New Category</h3>
        <input
          name="name"
          required
          placeholder="e.g. Outerwear"
          className="h-11 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        />
        <SubmitButton />
      </form>
    </div>
  );
}

function EditRow({ category, onDone }: { category: CategoryItem; onDone: () => void }) {
  const action = updateCategory.bind(null, category._id);
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success('Category updated.');
      onDone();
    } else if (state.error) {
      toast.error(state.error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <tr className="border-b border-line bg-white/5 last:border-0">
      <td colSpan={2} className="px-5 py-3">
        <form id={`edit-cat-${category._id}`} action={formAction} className="flex items-center gap-2">
          <input
            name="name"
            defaultValue={category.name}
            autoFocus
            required
            className="h-9 w-full max-w-xs rounded-lg border border-line bg-white/5 px-3 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
          />
        </form>
      </td>
      <td className="px-5 py-3">
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            form={`edit-cat-${category._id}`}
            aria-label="Save"
            className="text-ash-light hover:text-fog"
          >
            <Check size={15} />
          </button>
          <button onClick={onDone} aria-label="Cancel" className="text-ash-dark hover:text-fog">
            <X size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 w-full rounded-full bg-fog font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Creating...' : 'Create Category'}
    </button>
  );
}
