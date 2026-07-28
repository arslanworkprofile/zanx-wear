'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import type { ProductCardData } from '@/types';

export default function ProductSection({
  eyebrow,
  title,
  viewAllHref,
  products,
}: {
  eyebrow: string;
  title: string;
  viewAllHref: string;
  products: ProductCardData[];
}) {
  return (
    <section className="container-fluid py-20 md:py-28">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightest2 text-fog md:text-5xl">
            {title}
          </h2>
        </motion.div>
        <Link
          href={viewAllHref}
          className="group inline-flex items-center gap-2 font-body text-sm text-ash-light transition-colors hover:text-fog"
        >
          View All
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
