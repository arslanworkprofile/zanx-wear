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
    social: {
      instagram: formData.get('socialInstagram')?.toString().trim() || '',
      facebook: formData.get('socialFacebook')?.toString().trim() || '',
      twitter: formData.get('socialTwitter')?.toString().trim() || '',
      tiktok: formData.get('socialTiktok')?.toString().trim() || '',
    },
  };

  await Settings.findOneAndUpdate({}, update, { upsert: true, new: true });
  revalidatePath('/admin/settings');
  // Social links render on every public page via the footer, so bust the
  // whole site's cache, not just the settings screen.
  revalidatePath('/', 'layout');
  return { success: true };
}
