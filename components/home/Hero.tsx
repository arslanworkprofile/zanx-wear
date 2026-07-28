'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MARQUEE_WORDS = ['ZANX WEAR', 'OUTERWEAR', 'DENIM', 'ZANX WEAR', 'FOOTWEAR', 'ESSENTIALS'];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const marqueeY = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const cardsY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[720px] overflow-hidden bg-matte-black">
      {/* Ambient backdrop */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 bg-steel-gradient" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,203,208,0.10),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" />
      </motion.div>

      {/* Signature: diagonal wordmark marquee crossing the hero */}
      <motion.div
        style={{ y: marqueeY }}
        className="pointer-events-none absolute left-[-10%] top-[18%] w-[130%] -rotate-6 select-none"
      >
        <div className="flex animate-marquee gap-10 whitespace-nowrap">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
            <span
              key={i}
              className="font-display text-[13vw] font-bold leading-none tracking-tightest2 text-transparent [-webkit-text-stroke:1px_rgba(242,242,240,0.09)] md:text-[9vw]"
            >
              {word}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Main content */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container-fluid relative flex h-full flex-col justify-end pb-28 pt-32"
      >
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="eyebrow mb-6"
        >
          Fall / Winter Collection — 01
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl font-display text-6xl font-semibold leading-[0.98] tracking-tightest2 text-fog text-balance md:text-8xl"
        >
          Wear the
          <br />
          Standard.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="mt-9 flex flex-wrap items-center gap-5"
        >
          <Button size="lg" asChild>
            <Link href="/shop">
              Shop the Collection <ArrowUpRight size={17} />
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/shop?gender=women">Explore Women's</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Floating glass stat cards */}
      <motion.div
        style={{ y: cardsY }}
        className="absolute right-6 top-32 hidden flex-col gap-4 md:flex md:right-10"
      >
        <FloatingCard label="New this week" value="42 pieces" delay={0.6} />
        <FloatingCard label="Free shipping over" value="$100" delay={0.75} />
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="h-9 w-px bg-gradient-to-b from-transparent via-ash-light to-transparent"
        />
      </div>
    </section>
  );
}

function FloatingCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay }}
      className="glass-panel w-52 rounded-xl2 px-5 py-4 shadow-glass"
    >
      <p className="eyebrow mb-1">{label}</p>
      <p className="font-display text-xl font-semibold text-fog">{value}</p>
    </motion.div>
  );
}
