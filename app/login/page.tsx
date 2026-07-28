'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/account';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error === 'DatabaseConnectionError') {
      toast.error('Could not reach the database. Check MONGODB_URI in .env.local.');
      return;
    }
    if (res?.error) {
      toast.error('Invalid email or password.');
      return;
    }

    toast.success('Welcome back.');
    router.push(callbackUrl);
    router.refresh();
  };

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
          Welcome back
        </h1>
        <p className="mt-2 font-body text-sm text-ash-light">
          Sign in to track orders, manage your wishlist, and check out faster.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block font-body text-xs text-ash-light">Email</label>
            <input
              type="email"
              {...register('email')}
              className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-ash-light">{errors.email.message}</p>
            )}
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="font-body text-xs text-ash-light">Password</label>
              <Link href="/forgot-password" className="font-body text-xs text-ash-light hover:text-fog">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              {...register('password')}
              className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-ash-light">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2 w-full">
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="mt-8 text-center font-body text-sm text-ash-light">
          New to ZANX WEAR?{' '}
          <Link href="/register" className="text-fog underline underline-offset-4">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
