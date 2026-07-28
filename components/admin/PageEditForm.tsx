'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { updatePage, type PageFormState } from '@/actions/pages';

const initialState: PageFormState = { success: false };

export default function PageEditForm({
  slug,
  title,
  content,
}: {
  slug: string;
  title: string;
  content: string;
}) {
  const action = updatePage.bind(null, slug);
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success('Page saved.');
      router.push('/admin/pages');
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="max-w-2xl space-y-5 rounded-xl2 border border-line bg-white/5 p-6">
      <div>
        <label className="mb-1.5 block font-body text-xs text-ash-light">Title</label>
        <input
          name="title"
          required
          minLength={2}
          defaultValue={title}
          className="h-11 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        />
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label className="font-body text-xs text-ash-light">Content</label>
          <span className="font-body text-xs text-ash-dark">
            Leave a blank line between paragraphs
          </span>
        </div>
        <textarea
          name="content"
          required
          minLength={10}
          rows={14}
          defaultValue={content}
          className="w-full resize-none rounded-lg border border-line bg-white/5 px-4 py-3 font-body text-sm leading-relaxed text-fog focus:border-silver/40 focus:outline-none"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-full bg-fog px-8 font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  );
}
