'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GRADIENTS } from '@/lib/mock-data';
import type { CommunityPhoto } from '@/lib/data/community';

export default function InstagramFeed({ posts = [] }: { posts?: CommunityPhoto[] }) {
  // Prefer real photos uploaded from the admin panel; fall back to gradient
  // placeholder tiles only if none have been added yet.
  const hasRealPhotos = posts.length > 0;
  const tileCount = 6;
  const tiles = hasRealPhotos
    ? posts.slice(0, tileCount)
    : GRADIENTS.concat(GRADIENTS.slice(0, 2)).map((gradient) => ({ gradient }));

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
        {tiles.map((tile, i) => {
          const photo = hasRealPhotos ? (tile as CommunityPhoto) : null;
          const gradient = !hasRealPhotos ? (tile as { gradient: string }).gradient : undefined;

          const content = (
            <motion.div
              key={photo?._id ?? i}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.05 }}
              className="group relative aspect-square overflow-hidden"
            >
              {photo ? (
                <img
                  src={photo.imageUrl}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className={cn('absolute inset-0 bg-gradient-to-br', gradient)} />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-matte-black/0 transition-colors duration-300 group-hover:bg-matte-black/40">
                <Instagram
                  size={20}
                  className="text-fog opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>
            </motion.div>
          );

          return photo?.postUrl ? (
            <a
              key={photo._id}
              href={photo.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on Instagram"
            >
              {content}
            </a>
          ) : (
            content
          );
        })}
      </div>
    </section>
  );
}
