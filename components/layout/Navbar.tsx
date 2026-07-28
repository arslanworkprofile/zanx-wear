'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut, LogIn } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';

const NAV_LINKS = [
  { label: 'New Arrivals', href: '/shop?filter=new' },
  { label: 'Men', href: '/shop?gender=men' },
  { label: 'Women', href: '/shop?gender=women' },
  { label: 'Accessories', href: '/shop?category=accessories' },
  { label: 'Sale', href: '/shop?filter=sale' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const itemCount = useCartStore((s) => s.itemCount());
  const toggleCart = useCartStore((s) => s.toggleCart);
  const { data: session, status } = useSession();
  const isAuthed = status === 'authenticated';

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 24);
  });

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-line bg-matte-black/80 backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <nav className="container-fluid flex h-20 items-center justify-between">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-widest2 text-fog"
          >
            ZANX<span className="text-ash-light"> WEAR</span>
          </Link>

          <ul className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="group relative font-body text-sm text-ash-light transition-colors hover:text-fog"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-fog transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <IconButton label="Search">
              <Search size={19} strokeWidth={1.5} />
            </IconButton>
            <IconButton label="Wishlist" href="/account/wishlist" className="hidden sm:inline-flex">
              <Heart size={19} strokeWidth={1.5} />
            </IconButton>
            <IconButton label="Account" href="/account" className="hidden sm:inline-flex">
              <User size={19} strokeWidth={1.5} />
            </IconButton>
            <button
              aria-label="Open cart"
              onClick={() => toggleCart(true)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-fog transition-colors hover:bg-white/5"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {itemCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-fog text-[10px] font-semibold text-matte-black">
                  {itemCount}
                </span>
              )}
            </button>
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fog lg:hidden"
            >
              <Menu size={20} strokeWidth={1.5} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-matte-black lg:hidden"
          >
            <div className="container-fluid flex h-20 items-center justify-between">
              <span className="font-display text-xl font-bold tracking-widest2 text-fog">
                ZANX WEAR
              </span>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fog"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <ul className="container-fluid mt-8 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.4 }}
                  className="border-b border-line py-5"
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-display text-3xl font-semibold text-fog"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <div className="container-fluid mt-8 flex flex-col gap-1">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * NAV_LINKS.length, duration: 0.4 }}
              >
                <Link
                  href={isAuthed ? '/account' : '/login'}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-3 font-body text-base text-ash-light transition-colors hover:text-fog"
                >
                  {isAuthed ? <User size={18} strokeWidth={1.5} /> : <LogIn size={18} strokeWidth={1.5} />}
                  {isAuthed ? (session?.user?.name ? `Hi, ${session.user.name}` : 'My Account') : 'Login'}
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * (NAV_LINKS.length + 1), duration: 0.4 }}
              >
                <Link
                  href="/account/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 py-3 font-body text-base text-ash-light transition-colors hover:text-fog"
                >
                  <Heart size={18} strokeWidth={1.5} />
                  Wishlist
                </Link>
              </motion.div>
              {isAuthed && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * (NAV_LINKS.length + 2), duration: 0.4 }}
                >
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                    className="flex w-full items-center gap-3 py-3 font-body text-base text-ash-light transition-colors hover:text-fog"
                  >
                    <LogOut size={18} strokeWidth={1.5} />
                    Sign out
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconButton({
  children,
  label,
  href,
  className,
}: {
  children: React.ReactNode;
  label: string;
  href?: string;
  className?: string;
}) {
  const content = (
    <span
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full text-fog transition-colors hover:bg-white/5',
        className
      )}
      aria-label={label}
    >
      {children}
    </span>
  );
  return href ? <Link href={href}>{content}</Link> : <button>{content}</button>;
}
