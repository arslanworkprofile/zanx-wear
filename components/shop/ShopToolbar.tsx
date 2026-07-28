'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import * as Select from '@radix-ui/react-select';
import { ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ShopToolbar({
  count,
  onOpenFilters,
}: {
  count: number;
  onOpenFilters?: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') ?? 'newest';

  const setSort = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenFilters}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-body text-xs text-fog md:hidden"
        >
          <SlidersHorizontal size={13} /> Filters
        </button>
        <p className="font-body text-sm text-ash-light">{count} pieces</p>
      </div>

      <Select.Root value={currentSort} onValueChange={setSort}>
        <Select.Trigger className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 font-body text-xs text-fog">
          <Select.Value />
          <ChevronDown size={13} />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content className="overflow-hidden rounded-xl border border-line bg-matte-900 shadow-premium">
            <Select.Viewport className="p-1">
              {SORT_OPTIONS.map((opt) => (
                <Select.Item
                  key={opt.value}
                  value={opt.value}
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 font-body text-xs text-ash-light outline-none',
                    'data-[highlighted]:bg-white/5 data-[highlighted]:text-fog'
                  )}
                >
                  <Select.ItemText>{opt.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={12} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
    </div>
  );
}
