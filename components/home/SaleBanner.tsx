'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function SaleBanner() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 bg-steel-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,203,208,0.08),transparent_60%)]" />
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="hairline absolute inset-x-0 bottom-0" />

      <div className="container-fluid relative flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="eyebrow"
        >
          Limited Time
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-4 max-w-2xl font-display text-5xl font-semibold tracking-tightest2 text-fog text-balance md:text-7xl"
        >
          Up to 40% off
          <br />
          selected pieces
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-9"
        >
          <Button size="lg" asChild>
            <Link href="/shop?filter=sale">Shop the Sale</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
