'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { registerUser, type RegisterState } from '@/actions/auth';

const initialState: RegisterState = { success: false };

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success('Account created. Sign in to continue.');
      router.push('/login');
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-matte-black px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <Link href="/" className="font-display text-xl font-bold tracking-widest2 text-fog">
          ZANX<span className="text-ash-light"> WEAR</span>
        </Link>

        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Create your account
        </h1>
        <p className="mt-2 font-body text-sm text-ash-light">
          Faster checkout, order tracking, and wishlist syncing across devices.
        </p>

        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block font-body text-xs text-ash-light">Full name</label>
            <input
              name="name"
              type="text"
              required
              className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-body text-xs text-ash-light">Email</label>
            <input
              name="email"
              type="email"
              required
              className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-body text-xs text-ash-light">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
              placeholder="At least 6 characters"
            />
          </div>

          <SubmitButton />
        </form>

        <p className="mt-8 text-center font-body text-sm text-ash-light">
          Already have an account?{' '}
          <Link href="/login" className="text-fog underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex h-14 w-full items-center justify-center rounded-full bg-fog font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Creating account...' : 'Create Account'}
    </button>
  );
}
