'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { updateProfile, type ProfileState } from '@/actions/profile';

const initialState: ProfileState = { success: false };

export default function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  useEffect(() => {
    if (state.success) toast.success('Profile updated.');
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block font-body text-xs text-ash-light">Full name</label>
        <input
          name="name"
          defaultValue={name}
          required
          className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        />
      </div>
      <div>
        <label className="mb-1.5 block font-body text-xs text-ash-light">Email</label>
        <input
          value={email}
          disabled
          className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-ash-dark"
        />
        <p className="mt-1.5 font-body text-xs text-ash-dark">Email cannot be changed.</p>
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
      className="h-12 rounded-full bg-fog px-7 font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  );
}
