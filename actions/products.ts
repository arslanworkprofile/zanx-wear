'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { safeConnectDB } from '@/lib/safe-connect';
import Product from '@/models/Product';
import { slugify } from '@/lib/utils';

const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  category: z.string().min(1, 'Please select a category.'),
  gender: z.enum(['men', 'women', 'unisex']),
  price: z.coerce.number().positive('Price must be a positive number.'),
  discountPrice: z.coerce.number().positive().optional().or(z.literal('')),
  tags: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  isTrending: z.coerce.boolean().optional(),
  isNewArrival: z.coerce.boolean().optional(),
  isBestSeller: z.coerce.boolean().optional(),
});

export type ProductFormState = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

function fieldErrorsFromZod(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString();
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

/**
 * Variants are edited client-side and only ever reach the server as a JSON
 * blob (`variantsJson`), so Zod can't validate each row. Guard here too:
 * a blank or duplicate SKU would otherwise trip Mongoose's `required`/
 * `unique` validators with a raw, unhelpful error.
 */
function ensureVariantSkus(variants: any[], namePrefix: string) {
  const seen = new Set<string>();
  return variants.map((v, i) => {
    let sku = typeof v.sku === 'string' ? v.sku.trim() : '';
    if (!sku || seen.has(sku)) {
      const prefix = namePrefix
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 12) || 'SKU';
      sku = `${prefix}-${Date.now().toString(36).toUpperCase()}-${i}`;
    }
    seen.add(sku);
    return { ...v, sku };
  });
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'manager')) {
    throw new Error('Unauthorized');
  }
  return session;
}

/**
 * `images` is expected as an array of { fileId, thumbFileId, alt } already
 * uploaded via POST /api/upload — the admin UI uploads files first, then
 * submits this action with the resulting GridFS ids.
 */
export async function createProduct(
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFromZod(parsed.error);
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input',
      fieldErrors,
    };
  }

  const imagesJson = formData.get('imagesJson');
  let images: any[] = [];
  try {
    images = imagesJson ? JSON.parse(imagesJson.toString()) : [];
  } catch {
    images = [];
  }

  const variantsJson = formData.get('variantsJson');
  let variants: any[] = [];
  try {
    variants = variantsJson ? JSON.parse(variantsJson.toString()) : [];
  } catch {
    variants = [];
  }

  const data = parsed.data;
  variants = ensureVariantSkus(variants, data.name);

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  const slug = `${slugify(data.name)}-${Date.now().toString(36)}`;

  await Product.create({
    name: data.name,
    slug,
    description: data.description,
    category: data.category,
    gender: data.gender,
    price: data.price,
    discountPrice: data.discountPrice || undefined,
    tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    isFeatured: !!data.isFeatured,
    isTrending: !!data.isTrending,
    isNewArrival: !!data.isNewArrival,
    isBestSeller: !!data.isBestSeller,
    images,
    variants,
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath('/shop');
  return { success: true };
}

export async function updateProduct(
  productId: string,
  _prevState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  try {
    await requireAdmin();
  } catch {
    return { success: false, error: 'Unauthorized' };
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = fieldErrorsFromZod(parsed.error);
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid input',
      fieldErrors,
    };
  }

  const imagesJson = formData.get('imagesJson');
  let images: any[] = [];
  try {
    images = imagesJson ? JSON.parse(imagesJson.toString()) : [];
  } catch {
    images = [];
  }

  const variantsJson = formData.get('variantsJson');
  let variants: any[] = [];
  try {
    variants = variantsJson ? JSON.parse(variantsJson.toString()) : [];
  } catch {
    variants = [];
  }

  const data = parsed.data;
  variants = ensureVariantSkus(variants, data.name);

  const db = await safeConnectDB();
  if (!db.ok) return { success: false, error: db.error };

  await Product.findByIdAndUpdate(productId, {
    name: data.name,
    description: data.description,
    category: data.category,
    gender: data.gender,
    price: data.price,
    discountPrice: data.discountPrice || undefined,
    tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    isFeatured: !!data.isFeatured,
    isTrending: !!data.isTrending,
    isNewArrival: !!data.isNewArrival,
    isBestSeller: !!data.isBestSeller,
    images,
    variants,
  });

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${productId}/edit`);
  revalidatePath('/');
  revalidatePath('/shop');
  return { success: true };
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  const db = await safeConnectDB();
  if (!db.ok) return;
  await Product.findByIdAndDelete(productId);
  revalidatePath('/admin/products');
  revalidatePath('/');
  revalidatePath('/shop');
}
