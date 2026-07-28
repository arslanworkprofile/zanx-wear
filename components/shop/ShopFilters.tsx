'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import * as Accordion from '@radix-ui/react-accordion';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Slider from '@radix-ui/react-slider';
import { ChevronDown, Check } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { CATEGORIES, SIZES, COLOR_SWATCHES } from '@/lib/mock-data';
import type { PublicCategory } from '@/lib/data/categories';
import { cn } from '@/lib/utils';

export default function ShopFilters({ categories }: { categories?: PublicCategory[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categoryOptions =
    categories && categories.length > 0
      ? categories.map((c) => ({ slug: c.slug, name: c.name }))
      : CATEGORIES;

  const [price, setPrice] = useState<[number, number]>([
    Number(searchParams.get('min') ?? 0),
    Number(searchParams.get('max') ?? 400),
  ]);

  useEffect(() => {
    setPrice([Number(searchParams.get('min') ?? 0), Number(searchParams.get('max') ?? 400)]);
  }, [searchParams]);

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) params.delete(key);
      else params.set(key, value);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const toggleMulti = (key: string, value: string) => {
    const current = searchParams.get(key)?.split(',').filter(Boolean) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParam(key, next.length ? next.join(',') : null);
  };

  const isChecked = (key: string, value: string) =>
    (searchParams.get(key)?.split(',') ?? []).includes(value);

  return (
    <aside className="w-full shrink-0 md:w-64">
      <Accordion.Root type="multiple" defaultValue={['category', 'gender', 'price']} className="space-y-1">
        <FilterGroup value="category" title="Category">
          {categoryOptions.map((c) => (
            <FilterCheckbox
              key={c.slug}
              label={c.name}
              checked={isChecked('category', c.slug)}
              onChange={() => toggleMulti('category', c.slug)}
            />
          ))}
        </FilterGroup>

        <FilterGroup value="gender" title="Gender">
          {['men', 'women', 'unisex'].map((g) => (
            <FilterCheckbox
              key={g}
              label={g.charAt(0).toUpperCase() + g.slice(1)}
              checked={isChecked('gender', g)}
              onChange={() => toggleMulti('gender', g)}
            />
          ))}
        </FilterGroup>

        <FilterGroup value="size" title="Size">
          <div className="flex flex-wrap gap-2 pt-1">
            {SIZES.map((s) => {
              const active = isChecked('size', s);
              return (
                <button
                  key={s}
                  onClick={() => toggleMulti('size', s)}
                  className={cn(
                    'flex h-9 min-w-9 items-center justify-center rounded-full border px-2 text-xs transition-colors',
                    active
                      ? 'border-fog bg-fog text-matte-black'
                      : 'border-line text-ash-light hover:border-silver/40'
                  )}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        <FilterGroup value="color" title="Color">
          <div className="flex flex-wrap gap-3 pt-1">
            {COLOR_SWATCHES.map((c) => {
              const active = isChecked('color', c.name);
              return (
                <button
                  key={c.name}
                  onClick={() => toggleMulti('color', c.name)}
                  aria-label={c.name}
                  className={cn(
                    'h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-matte-black transition-all',
                    active ? 'ring-fog' : 'ring-transparent hover:ring-line'
                  )}
                  style={{ backgroundColor: c.hex }}
                />
              );
            })}
          </div>
        </FilterGroup>

        <FilterGroup value="price" title="Price">
          <div className="px-1 pt-3">
            <Slider.Root
              className="relative flex h-5 w-full touch-none items-center"
              min={0}
              max={400}
              step={10}
              value={price}
              onValueChange={(v) => setPrice(v as [number, number])}
              onValueCommit={(v) => {
                updateParam('min', String(v[0]));
                updateParam('max', String(v[1]));
              }}
            >
              <Slider.Track className="relative h-1 grow rounded-full bg-matte-800">
                <Slider.Range className="absolute h-full rounded-full bg-fog" />
              </Slider.Track>
              <Slider.Thumb className="block h-4 w-4 rounded-full bg-fog shadow-md focus:outline-none" />
              <Slider.Thumb className="block h-4 w-4 rounded-full bg-fog shadow-md focus:outline-none" />
            </Slider.Root>
            <div className="mt-3 flex justify-between font-body text-xs text-ash-light">
              <span>${price[0]}</span>
              <span>${price[1]}</span>
            </div>
          </div>
        </FilterGroup>
      </Accordion.Root>

      <button
        onClick={() => router.push(pathname, { scroll: false })}
        className="mt-6 font-body text-xs text-ash-light underline-offset-4 hover:text-fog hover:underline"
      >
        Clear all filters
      </button>
    </aside>
  );
}

function FilterGroup({
  value,
  title,
  children,
}: {
  value: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Accordion.Item value={value} className="border-b border-line py-4">
      <Accordion.Trigger className="group flex w-full items-center justify-between font-body text-sm font-medium text-fog">
        {title}
        <ChevronDown size={15} className="text-ash-light transition-transform group-data-[state=open]:rotate-180" />
      </Accordion.Trigger>
      <Accordion.Content className="pt-3">{children}</Accordion.Content>
    </Accordion.Item>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5">
      <Checkbox.Root
        checked={checked}
        onCheckedChange={onChange}
        className={cn(
          'flex h-4 w-4 items-center justify-center rounded border transition-colors',
          checked ? 'border-fog bg-fog' : 'border-line'
        )}
      >
        <Checkbox.Indicator>
          <Check size={11} className="text-matte-black" strokeWidth={3} />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span className="font-body text-sm text-ash-light">{label}</span>
    </label>
  );
}
