'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});
type FormValues = z.infer<typeof schema>;

export default function Newsletter() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    // TODO: wire to actions/newsletter.ts -> Settings/Notifications collection or ESP of choice
    await new Promise((r) => setTimeout(r, 600));
    toast.success('You\'re on the list. Welcome to ZANX WEAR.');
    reset();
  };

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="container-fluid flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="eyebrow"
        >
          Newsletter
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tightest2 text-fog text-balance md:text-5xl"
        >
          Early access to new drops
        </motion.h2>
        <p className="mt-4 max-w-md font-body text-sm text-ash-light">
          Join the list for first access to limited releases and private sale windows.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-9 flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1">
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className="h-13 w-full rounded-full border border-line bg-white/5 px-6 py-3.5 font-body text-sm text-fog placeholder:text-ash-dark focus:border-silver/40 focus:outline-none"
            />
            {errors.email && (
              <p className="mt-2 text-left text-xs text-ash-light">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-13 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-fog px-7 py-3.5 font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Joining...' : 'Join'} <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </section>
  );
}
