'use server';

import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import User from '@/models/User';

export type ProfileState = { success: boolean; error?: string };

const profileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
});

export async function updateProfile(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'You must be signed in.' };

  const parsed = profileSchema.safeParse({ name: formData.get('name') });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  await User.findByIdAndUpdate(session.user.id, { name: parsed.data.name });
  revalidatePath('/account/profile');
  return { success: true };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export async function changePassword(
  _prevState: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'You must be signed in.' };

  const parsed = passwordSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  const user = await User.findById(session.user.id).select('+password');
  if (!user?.password) {
    return {
      success: false,
      error: 'This account has no password set. Please contact support.',
    };
  }

  const valid = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!valid) return { success: false, error: 'Current password is incorrect.' };

  user.password = await bcrypt.hash(parsed.data.newPassword, 12);
  await user.save();

  return { success: true };
}
