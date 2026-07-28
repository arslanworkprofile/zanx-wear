'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { UploadCloud, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { createProduct, updateProduct, type ProductFormState } from '@/actions/products';

interface CategoryOption {
  _id: string;
  name: string;
}

interface UploadedImage {
  fileId: string;
  thumbFileId: string;
  url: string;
  thumbUrl: string;
  alt: string;
}

interface Variant {
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
}

export interface ExistingProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  discountPrice?: number;
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  images: UploadedImage[];
  variants: Variant[];
}

function generateSku(productName?: string) {
  const prefix = (productName ?? 'SKU')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 12) || 'SKU';
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${suffix}`;
}

const initialState: ProductFormState = { success: false };

export default function ProductForm({
  categories,
  product,
}: {
  categories: CategoryOption[];
  product?: ExistingProduct;
}) {
  const isEditing = !!product;
  const action = isEditing ? updateProduct.bind(null, product!._id) : createProduct;
  const [state, formAction] = useActionState(action, initialState);
  const router = useRouter();

  const [images, setImages] = useState<UploadedImage[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.length
      ? product.variants
      : [{ size: 'M', color: 'Black', colorHex: '#0B0B0C', stock: 10, sku: generateSku(product?.name) }]
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(isEditing ? 'Product updated.' : 'Product created.');
      router.push('/admin/products');
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state, router, isEditing]);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append('files', f));

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? 'Upload failed');
        return;
      }

      setImages((prev) => [
        ...prev,
        ...data.uploaded.map((u: any) => ({ ...u, alt: '' })),
      ]);
    } catch {
      toast.error('Upload failed. Is your dev server running with a connected database?');
    } finally {
      setUploading(false);
    }
  }

  function addVariant() {
    setVariants((v) => [
      ...v,
      { size: '', color: '', colorHex: '#000000', stock: 0, sku: generateSku(product?.name) },
    ]);
  }

  function updateVariant(i: number, patch: Partial<Variant>) {
    setVariants((v) => v.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Section title="Basic Information">
          <Field label="Product name" error={state.fieldErrors?.name}>
            <input
              name="name"
              required
              minLength={2}
              defaultValue={product?.name}
              className="input"
              placeholder="Structured Wool Overcoat"
            />
          </Field>
          <Field label="Description" hint="Minimum 10 characters" error={state.fieldErrors?.description}>
            <textarea
              name="description"
              required
              minLength={10}
              rows={5}
              defaultValue={product?.description}
              className="input resize-none"
              placeholder="Describe the fit, fabric, and details... (min. 10 characters)"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <select name="category" required defaultValue={product?.category ?? ''} className="input">
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Gender">
              <select name="gender" required className="input" defaultValue={product?.gender ?? 'unisex'}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </Field>
          </div>
        </Section>

        <Section title="Images">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl2 border border-dashed border-line py-10 text-center transition-colors hover:border-silver/40"
          >
            <UploadCloud size={22} className="mb-2 text-ash-light" />
            <p className="font-body text-sm text-fog">
              {uploading ? 'Uploading...' : 'Drag & drop images, or click to browse'}
            </p>
            <p className="mt-1 font-body text-xs text-ash-dark">JPEG, PNG, WebP — up to 8MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>

          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={img.fileId} className="group relative aspect-square overflow-hidden rounded-lg bg-matte-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.thumbUrl} alt={img.alt} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-matte-black/70 text-fog opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input type="hidden" name="imagesJson" value={JSON.stringify(images)} readOnly />
        </Section>

        <Section title="Variants (size / color / stock)">
          <div className="space-y-3">
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-12 items-center gap-2">
                <input
                  value={v.size}
                  onChange={(e) => updateVariant(i, { size: e.target.value })}
                  placeholder="Size"
                  className="input col-span-2"
                />
                <input
                  value={v.color}
                  onChange={(e) => updateVariant(i, { color: e.target.value })}
                  placeholder="Color"
                  className="input col-span-3"
                />
                <input
                  type="color"
                  value={v.colorHex}
                  onChange={(e) => updateVariant(i, { colorHex: e.target.value })}
                  className="col-span-1 h-11 w-full rounded-lg border border-line bg-white/5"
                />
                <input
                  type="number"
                  min={0}
                  value={v.stock}
                  onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                  placeholder="Stock"
                  className="input col-span-2"
                />
                <input
                  value={v.sku}
                  onChange={(e) => updateVariant(i, { sku: e.target.value })}
                  placeholder="SKU"
                  className="input col-span-3"
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="col-span-1 flex items-center justify-center text-ash-dark hover:text-fog"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="mt-3 flex items-center gap-2 font-body text-xs text-ash-light hover:text-fog"
          >
            <Plus size={13} /> Add variant
          </button>
          <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} readOnly />
        </Section>
      </div>

      <div className="space-y-6">
        <Section title="Pricing">
          <Field label="Price (USD)">
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={product?.price}
              className="input"
            />
          </Field>
          <Field label="Discount price (optional)">
            <input
              name="discountPrice"
              type="number"
              step="0.01"
              min="0"
              defaultValue={product?.discountPrice}
              className="input"
            />
          </Field>
        </Section>

        <Section title="Organization">
          <Field label="Tags (comma separated)">
            <input
              name="tags"
              defaultValue={product?.tags?.join(', ')}
              className="input"
              placeholder="wool, winter, outerwear"
            />
          </Field>
          <div className="space-y-2 pt-1">
            <Checkbox name="isFeatured" label="Featured" defaultChecked={product?.isFeatured} />
            <Checkbox name="isTrending" label="Trending" defaultChecked={product?.isTrending} />
            <Checkbox name="isNewArrival" label="New Arrival" defaultChecked={product?.isNewArrival} />
            <Checkbox name="isBestSeller" label="Best Seller" defaultChecked={product?.isBestSeller} />
          </div>
        </Section>

        <SubmitButton isEditing={isEditing} />
      </div>

      <style jsx global>{`
        .input {
          height: 2.75rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.05);
          padding: 0 1rem;
          font-size: 0.875rem;
          color: #f2f2f0;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: rgba(200, 203, 208, 0.4);
        }
        textarea.input {
          height: auto;
          padding: 0.75rem 1rem;
        }
      `}</style>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl2 border border-line bg-white/5 p-6">
      <h3 className="mb-5 font-display text-base font-semibold text-fog">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="font-body text-xs text-ash-light">{label}</label>
        {hint && !error && <span className="font-body text-xs text-ash-dark">{hint}</span>}
      </div>
      {children}
      {error && <p className="mt-1 font-body text-xs text-red-400">{error}</p>}
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 font-body text-sm text-fog">
      <input
        name={name}
        type="checkbox"
        value="true"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-line"
      />
      {label}
    </label>
  );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-12 w-full rounded-full bg-fog font-body text-sm font-medium text-matte-black transition-opacity hover:opacity-90 disabled:opacity-50"
    >
      {pending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
    </button>
  );
}
