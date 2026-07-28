'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import Review from '@/models/Review';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    throw new Error('Unauthorized');
  }
}

export async function approveReview(reviewId: string) {
  await requireAdmin();
  const db = await safeConnectDB();
  if (!db.ok) return;
  await Review.findByIdAndUpdate(reviewId, { isApproved: true });
  revalidatePath('/admin/reviews');
}

export async function deleteReview(reviewId: string) {
  await requireAdmin();
  const db = await safeConnectDB();
  if (!db.ok) return;
  await Review.findByIdAndDelete(reviewId);
  revalidatePath('/admin/reviews');
}
