'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import Category from '@/models/Category';
import { slugify } from '@/lib/utils';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    throw new Error('Unauthorized');
  }
}

export type CategoryFormState = { success: boolean; error?: string };

const schema = z.object({ name: z.string().min(2) });

export async function createCategory(
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = schema.safeParse({ name: formData.get('name') });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid name' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  const slug = slugify(parsed.data.name);
  const existing = await Category.findOne({ slug });
  if (existing) {
    return { success: false, error: 'A category with this name already exists.' };
  }

  const bannerFileId = formData.get('bannerFileId')?.toString().trim();

  await Category.create({
    name: parsed.data.name,
    slug,
    bannerFileId: bannerFileId || undefined,
  });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/shop');
  return { success: true };
}

export async function updateCategory(
  categoryId: string,
  _prevState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = schema.safeParse({ name: formData.get('name') });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid name' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  const slug = slugify(parsed.data.name);
  const existing = await Category.findOne({ slug, _id: { $ne: categoryId } });
  if (existing) {
    return { success: false, error: 'Another category with this name already exists.' };
  }

  // An empty string means the admin explicitly removed the image (vs. simply
  // not touching it) — the form always sends this field, so it's safe to use
  // "unset when blank" as the rule.
  const bannerFileId = formData.get('bannerFileId')?.toString().trim();

  await Category.findByIdAndUpdate(
    categoryId,
    bannerFileId
      ? { name: parsed.data.name, slug, bannerFileId }
      : { name: parsed.data.name, slug, $unset: { bannerFileId: '' } }
  );
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/shop');
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  const db = await safeConnectDB();
  if (!db.ok) return;
  await Category.findByIdAndDelete(categoryId);
  revalidatePath('/admin/categories');
  revalidatePath('/');
  revalidatePath('/shop');
}
