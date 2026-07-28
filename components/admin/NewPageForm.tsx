'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { createCustomPage, type PageFormState } from '@/actions/pages';

const initialState: PageFormState = { success: false };

export default function NewPageForm() {
  const [state, formAction] = useActionState(createCustomPage, initialState);

  useEffect(() => {
    if (state.success) toast.success('Page created.');
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form
      action={formAction}
      key={state.success ? Math.random() : 'form'}
      className="h-fit space-y-4 rounded-xl2 border border-line bg-white/5 p-6"
    >
      <h3 className="font-display text-base font-semibold text-fog">New Page</h3>
      <p className="font-body text-xs text-ash-light">
        For anything beyond the built-in footer pages — an FAQ, a lookbook, etc. Not linked from
        the footer automatically.
      </p>
      <input
        name="title"
        required
        placeholder="Page title"
        className="h-11 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
      />
      <textarea
        name="content"
        required
        minLength={10}
        rows={6}
        placeholder="Page content..."
        className="w-full resize-none rounded-lg border border-line bg-white/5 px-4 py-3 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
      />
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
      className="h-11 w-full rounded-full bg-fog font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Creating...' : 'Create Page'}
    </button>
  );
}
