'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const REVIEWS = [
  { name: 'Jordan M.', rating: 5, text: 'Fit true to size, fabric feels much more expensive than the price tag.' },
  { name: 'Alicia R.', rating: 4, text: 'Beautiful piece. Runs slightly large — sized down and it was perfect.' },
  { name: 'Tomás V.', rating: 5, text: 'This is the third piece I\'ve bought from ZANX. Consistent quality every time.' },
];

export default function ProductTabs({ reviewCount }: { reviewCount: number }) {
  return (
    <Tabs.Root defaultValue="details" className="mt-20">
      <Tabs.List className="flex gap-8 border-b border-line">
        {[
          { value: 'details', label: 'Details & Care' },
          { value: 'shipping', label: 'Shipping & Returns' },
          { value: 'reviews', label: `Reviews (${reviewCount})` },
        ].map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              'relative pb-4 font-body text-sm text-ash-light transition-colors',
              'data-[state=active]:text-fog',
              "data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-px data-[state=active]:after:w-full data-[state=active]:after:bg-fog"
            )}
          >
            {tab.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      <Tabs.Content value="details" className="max-w-2xl py-8">
        <ul className="space-y-2 font-body text-sm text-ash-light">
          <li>— Mid-weight structured fabric, matte finish hardware</li>
          <li>— Machine wash cold, tumble dry low</li>
          <li>— Designed in-house, ethically manufactured</li>
          <li>— Model is 6'1" wearing size M</li>
        </ul>
      </Tabs.Content>

      <Tabs.Content value="shipping" className="max-w-2xl space-y-4 py-8 font-body text-sm text-ash-light">
        <p>Standard shipping (3–5 business days) is free on orders over $100, otherwise $5 flat rate.</p>
        <p>Express shipping (1–2 business days) available at checkout for an additional fee.</p>
        <p>Returns accepted within 30 days of delivery. Items must be unworn, unwashed, and have original tags attached.</p>
      </Tabs.Content>

      <Tabs.Content value="reviews" className="max-w-2xl space-y-6 py-8">
        {REVIEWS.map((r, i) => (
          <div key={i} className={cn('pb-6', i < REVIEWS.length - 1 && 'border-b border-line')}>
            <div className="mb-2 flex items-center gap-2">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={12} fill={idx < r.rating ? '#F2F2F0' : 'none'} className="text-fog" strokeWidth={1} />
              ))}
            </div>
            <p className="font-body text-sm text-fog/90">{r.text}</p>
            <p className="mt-2 font-body text-xs text-ash-light">{r.name}</p>
          </div>
        ))}
      </Tabs.Content>
    </Tabs.Root>
  );
}
