'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import Coupon from '@/models/Coupon';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    throw new Error('Unauthorized');
  }
}

export type CouponFormState = { success: boolean; error?: string };

const schema = z.object({
  code: z.string().min(3),
  type: z.enum(['percentage', 'fixed']),
  value: z.coerce.number().positive(),
});

export async function createCoupon(
  _prevState: CouponFormState,
  formData: FormData
): Promise<CouponFormState> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const parsed = schema.safeParse({
    code: formData.get('code'),
    type: formData.get('type'),
    value: formData.get('value'),
  });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid coupon' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  const code = parsed.data.code.toUpperCase();
  const existing = await Coupon.findOne({ code });
  if (existing) return { success: false, error: 'A coupon with this code already exists.' };

  await Coupon.create({ ...parsed.data, code });
  revalidatePath('/admin/coupons');
  return { success: true };
}

export async function deleteCoupon(couponId: string) {
  await requireAdmin();
  const db = await safeConnectDB();
  if (!db.ok) return;
  await Coupon.findByIdAndDelete(couponId);
  revalidatePath('/admin/coupons');
}

export async function toggleCoupon(couponId: string, isActive: boolean) {
  await requireAdmin();
  const db = await safeConnectDB();
  if (!db.ok) return;
  await Coupon.findByIdAndUpdate(couponId, { isActive });
  revalidatePath('/admin/coupons');
}
