'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import Page from '@/models/Page';
import { slugify } from '@/lib/utils';
import { EDITABLE_PAGE_SLUGS } from '@/lib/default-pages';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    throw new Error('Unauthorized');
  }
}

export type PageFormState = { success: boolean; error?: string };

const schema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters.'),
  content: z.string().min(10, 'Content must be at least 10 characters.'),
});

/**
 * Upserts content for a footer/static page. `slug` is fixed by the caller
 * (the page being edited) — this never changes a page's URL, it only ever
 * changes what's displayed at it.
 */
export async function updatePage(
  slug: string,
  _prevState: PageFormState,
  formData: FormData
): Promise<PageFormState> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = schema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  await Page.findOneAndUpdate(
    { slug },
    { slug, title: parsed.data.title, content: parsed.data.content },
    { upsert: true }
  );

  revalidatePath('/admin/pages');
  revalidatePath(`/admin/pages/${slug}/edit`);
  revalidatePath(`/${slug}`);
  return { success: true };
}

/**
 * Creates an additional custom page beyond the built-in footer set (e.g. an
 * FAQ or a lookbook page). Not linked from the footer automatically — link
 * to it manually once created.
 */
export async function createCustomPage(
  _prevState: PageFormState,
  formData: FormData
): Promise<PageFormState> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = schema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const slug = slugify(parsed.data.title);
  if (EDITABLE_PAGE_SLUGS.includes(slug)) {
    return { success: false, error: 'That page already exists — edit it instead of creating it again.' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  const existing = await Page.findOne({ slug });
  if (existing) {
    return { success: false, error: 'A page with this title already exists.' };
  }

  await Page.create({ slug, title: parsed.data.title, content: parsed.data.content });
  revalidatePath('/admin/pages');
  revalidatePath(`/${slug}`);
  return { success: true };
}

export async function deleteCustomPage(slug: string) {
  await requireAdmin();
  // Never allow deleting one of the built-in footer pages — only resetting
  // it to defaults would make sense, and that's not exposed here to avoid
  // accidental data loss. Only truly custom pages can be removed.
  if (EDITABLE_PAGE_SLUGS.includes(slug)) return;
  const db = await safeConnectDB();
  if (!db.ok) return;
  await Page.findOneAndDelete({ slug });
  revalidatePath('/admin/pages');
}
