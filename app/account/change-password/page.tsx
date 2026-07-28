'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { changePassword, type ProfileState } from '@/actions/profile';

const initialState: ProfileState = { success: false };

export default function ChangePasswordPage() {
  const [state, formAction] = useActionState(changePassword, initialState);

  useEffect(() => {
    if (state.success) toast.success('Password updated.');
    else if (state.error) toast.error(state.error);
  }, [state]);

  return (
    <div className="max-w-lg rounded-xl2 border border-line bg-white/5 p-6">
      <form action={formAction} className="space-y-4">
        <Field name="currentPassword" label="Current password" />
        <Field name="newPassword" label="New password" />
        <Field name="confirmPassword" label="Confirm new password" />
        <SubmitButton />
      </form>
    </div>
  );
}

function Field({ name, label }: { name: string; label: string }) {
  return (
    <div>
      <label className="mb-1.5 block font-body text-xs text-ash-light">{label}</label>
      <input
        name={name}
        type="password"
        required
        minLength={6}
        className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
      />
    </div>
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
      {pending ? 'Updating...' : 'Update Password'}
    </button>
  );
}
