'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import Settings from '@/models/Settings';

export type SettingsFormState = { success: boolean; error?: string };

export async function updateSettings(
  _prevState: SettingsFormState,
  formData: FormData
): Promise<SettingsFormState> {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    return { success: false, error: 'Unauthorized' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  const update = {
    siteName: formData.get('siteName')?.toString() || 'ZANX WEAR',
    siteTagline: formData.get('siteTagline')?.toString() || '',
    supportEmail: formData.get('supportEmail')?.toString() || '',
    seo: {
      defaultTitle: formData.get('seoTitle')?.toString() || '',
      defaultDescription: formData.get('seoDescription')?.toString() || '',
    },
    shipping: {
      flatRate: Number(formData.get('flatRate') ?? 0),
      freeShippingThreshold: Number(formData.get('freeShippingThreshold') ?? 0),
    },
  };

  await Settings.findOneAndUpdate({}, update, { upsert: true, new: true });
  revalidatePath('/admin/settings');
  return { success: true };
}
