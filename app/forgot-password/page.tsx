'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire to a real email-reset flow — issue a short-lived token, store its
    // hash on the User document, and email a /reset-password?token=... link via
    // your ESP of choice using the Settings.email config.
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
    toast.success('If that email exists, a reset link is on its way.');
  };

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-matte-black px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Link href="/" className="font-display text-xl font-bold tracking-widest2 text-fog">
          ZANX<span className="text-ash-light"> WEAR</span>
        </Link>

        <h1 className="mt-8 font-display text-3xl font-semibold tracking-tightest2 text-fog">
          Reset your password
        </h1>
        <p className="mt-2 font-body text-sm text-ash-light">
          Enter the email on your account and we'll send a reset link.
        </p>

        {sent ? (
          <div className="mt-8 rounded-xl2 border border-line bg-white/5 p-6 font-body text-sm text-fog">
            Check your inbox for a link to reset your password.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
              placeholder="you@example.com"
            />
            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center font-body text-sm text-ash-light">
          <Link href="/login" className="text-fog underline underline-offset-4">
            Back to sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
