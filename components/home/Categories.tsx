'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CATEGORIES, GRADIENTS } from '@/lib/mock-data';
import type { PublicCategory } from '@/lib/data/categories';

export default function Categories({ categories }: { categories?: PublicCategory[] }) {
  // Prefer real categories from the database; fall back to the placeholder
  // set only if none exist yet (e.g. fresh install, DB not connected).
  const items =
    categories && categories.length > 0
      ? categories.map((c, i) => ({
          name: c.name,
          slug: c.slug,
          href: `/shop?category=${c.slug}`,
          featured: i === 0 || i === 3,
          bannerUrl: c.bannerUrl,
        }))
      : CATEGORIES;

  return (
    <section className="container-fluid py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12"
      >
        <span className="eyebrow">Shop by Category</span>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightest2 text-fog md:text-5xl">
          Considered essentials
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6 md:grid-rows-2">
        {items.map((cat, i) => (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={cn(
              'group relative overflow-hidden rounded-xl2',
              cat.featured ? 'col-span-2 row-span-2 aspect-square md:col-span-3' : 'aspect-square md:col-span-3'
            )}
          >
            <Link href={cat.href} className="block h-full w-full">
              {cat.bannerUrl ? (
                <img
                  src={cat.bannerUrl}
                  alt={cat.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div
                  className={cn(
                    'absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-105',
                    GRADIENTS[i % GRADIENTS.length]
                  )}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-semibold text-fog md:text-2xl">
                    {cat.name}
                  </h3>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-fog opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
