'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});
type FormValues = z.infer<typeof schema>;

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormValues) => {
    // TODO: wire to actions/contact.ts -> email/support inbox of choice
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message sent. We'll get back to you within 1 business day.");
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
      <div>
        <label className="mb-1.5 block font-body text-xs text-ash-light">Name</label>
        <input
          {...register('name')}
          className="h-11 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        />
        {errors.name && <p className="mt-1 font-body text-xs text-red-400">{errors.name.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block font-body text-xs text-ash-light">Email</label>
        <input
          {...register('email')}
          className="h-11 w-full rounded-lg border border-line bg-white/5 px-4 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        />
        {errors.email && <p className="mt-1 font-body text-xs text-red-400">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-1.5 block font-body text-xs text-ash-light">Message</label>
        <textarea
          {...register('message')}
          rows={5}
          className="w-full resize-none rounded-lg border border-line bg-white/5 px-4 py-3 font-body text-sm text-fog focus:border-silver/40 focus:outline-none"
        />
        {errors.message && (
          <p className="mt-1 font-body text-xs text-red-400">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="h-11 rounded-full bg-fog px-8 font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
