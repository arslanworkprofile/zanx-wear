'use client';

import { useState, useRef, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

function isRealImage(src: string) {
  return src.startsWith('/') || src.startsWith('http');
}

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoomStyle, setZoomStyle] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ x, y });
  };

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row">
      <div className="flex shrink-0 gap-3 md:flex-col">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={cn(
              'relative h-16 w-14 shrink-0 overflow-hidden rounded-lg transition-all md:h-20 md:w-16',
              !isRealImage(img) && 'bg-gradient-to-br',
              !isRealImage(img) && img,
              active === i ? 'ring-2 ring-fog' : 'opacity-60 hover:opacity-100'
            )}
          >
            {isRealImage(img) && (
              <img src={img} alt="" className="h-full w-full object-cover" />
            )}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomStyle(null)}
        className="relative aspect-[3/4] flex-1 overflow-hidden rounded-xl2 bg-matte-800"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={cn(
              'absolute inset-0',
              !isRealImage(images[active]) && 'bg-gradient-to-br',
              !isRealImage(images[active]) && images[active]
            )}
            style={
              zoomStyle
                ? {
                    transform: 'scale(1.5)',
                    transformOrigin: `${zoomStyle.x}% ${zoomStyle.y}%`,
                  }
                : undefined
            }
          >
            {isRealImage(images[active]) && (
              <img src={images[active]} alt={name} className="h-full w-full object-cover" />
            )}
          </motion.div>
        </AnimatePresence>
        <span className="absolute bottom-4 right-4 rounded-full bg-matte-black/60 px-3 py-1 font-body text-[11px] text-ash-light backdrop-blur">
          Hover to zoom
        </span>
      </div>
    </div>
  );
}
