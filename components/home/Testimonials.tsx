'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/mock-data';

export default function Testimonials() {
  return (
    <section className="container-fluid py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <span className="eyebrow">What They're Saying</span>
        <h2 className="mt-3 font-display text-4xl font-semibold tracking-tightest2 text-fog md:text-5xl">
          Worn by the discerning
        </h2>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="glass-panel rounded-xl2 p-7"
          >
            <div className="mb-4 flex gap-1 text-fog">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star key={idx} size={14} fill="#F2F2F0" strokeWidth={0} />
              ))}
            </div>
            <p className="font-body text-[15px] leading-relaxed text-fog/90">"{t.quote}"</p>
            <div className="mt-6">
              <p className="font-body text-sm text-fog">{t.name}</p>
              <p className="font-body text-xs text-ash-light">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
