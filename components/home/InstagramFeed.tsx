'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GRADIENTS } from '@/lib/mock-data';

export default function InstagramFeed() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-fluid mb-10 flex flex-col items-center text-center">
        <span className="eyebrow flex items-center gap-2">
          <Instagram size={13} /> @zanxwear
        </span>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightest2 text-fog md:text-5xl">
          Styled by the community
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-1 md:grid-cols-6">
        {GRADIENTS.concat(GRADIENTS.slice(0, 2)).map((gradient, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
            className="group relative aspect-square overflow-hidden"
          >
            <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} />
            <div className="absolute inset-0 flex items-center justify-center bg-matte-black/0 transition-colors duration-300 group-hover:bg-matte-black/40">
              <Instagram
                size={20}
                className="text-fog opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
