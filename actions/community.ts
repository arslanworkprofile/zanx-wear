'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import CommunityPost from '@/models/CommunityPost';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    throw new Error('Unauthorized');
  }
}

export type CommunityActionResult = { success: boolean; error?: string };

export async function addCommunityPosts(
  items: { fileId: string; postUrl?: string }[]
): Promise<CommunityActionResult> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  if (!items.length) {
    return { success: false, error: 'No images to publish.' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  try {
    const last = await CommunityPost.findOne().sort({ order: -1 }).select('order').lean<{ order: number }>();
    let nextOrder = (last?.order ?? 0) + 1;

    await CommunityPost.insertMany(
      items.map((item) => ({
        imageFileId: item.fileId,
        postUrl: item.postUrl?.trim() || undefined,
        order: nextOrder++,
      }))
    );

    revalidatePath('/admin/community');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('addCommunityPosts failed:', err);
    return { success: false, error: 'Could not save photos.' };
  }
}

export async function deleteCommunityPost(id: string): Promise<void> {
  try {
    await requireAdmin();
  } catch {
    return;
  }
  const db = await safeConnectDB();
  if (!db.ok) return;
  await CommunityPost.findByIdAndDelete(id);
  revalidatePath('/admin/community');
  revalidatePath('/');
}

export async function moveCommunityPost(id: string, direction: 'up' | 'down'): Promise<void> {
  try {
    await requireAdmin();
  } catch {
    return;
  }
  const db = await safeConnectDB();
  if (!db.ok) return;

  const current = await CommunityPost.findById(id);
  if (!current) return;

  const neighbor = await CommunityPost.findOne(
    direction === 'up' ? { order: { $lt: current.order } } : { order: { $gt: current.order } }
  ).sort(direction === 'up' ? { order: -1 } : { order: 1 });

  if (!neighbor) return;

  const swap = current.order;
  current.order = neighbor.order;
  neighbor.order = swap;
  await current.save();
  await neighbor.save();

  revalidatePath('/admin/community');
  revalidatePath('/');
}
