'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import Address from '@/models/Address';

const addressSchema = z.object({
  label: z.string().min(1),
  fullName: z.string().min(2),
  phone: z.string().min(6),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().optional(),
  postalCode: z.string().min(2),
  country: z.string().min(2),
});

export type AddressFormState = { success: boolean; error?: string };

export async function addAddress(
  _prevState: AddressFormState,
  formData: FormData
): Promise<AddressFormState> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: 'You must be signed in.' };

  const parsed = addressSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid address' };
  }

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  await Address.create({ ...parsed.data, user: session.user.id });
  revalidatePath('/account/addresses');
  return { success: true };
}

export async function deleteAddress(addressId: string) {
  const session = await auth();
  if (!session?.user?.id) return;

  const db = await safeConnectDB();
  if (!db.ok) return;

  await Address.deleteOne({ _id: addressId, user: session.user.id });
  revalidatePath('/account/addresses');
}
