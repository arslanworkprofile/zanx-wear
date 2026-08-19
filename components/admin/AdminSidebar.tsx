'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Users,
  Ticket,
  Star,
  FileText,
  Settings,
  Instagram,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: ShoppingBag },
  { label: 'Orders', href: '/admin/orders', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tags },
  { label: 'Community', href: '/admin/community', icon: Instagram },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Pages', href: '/admin/pages', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the route changes (e.g. after tapping a link).
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent the page behind the drawer from scrolling while it's open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const sidebarContent = (
    <>
      <Link href="/admin" className="mb-10 font-display text-lg font-bold tracking-widest2 text-fog">
        ZANX<span className="text-ash-light"> ADMIN</span>
      </Link>
      <nav className="flex-1 space-y-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-body text-sm transition-colors',
                active ? 'bg-white/8 text-fog' : 'text-ash-light hover:bg-white/5 hover:text-fog'
              )}
            >
              <Icon size={16} strokeWidth={1.5} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-body text-sm text-ash-light transition-colors hover:bg-white/5 hover:text-fog"
      >
        <LogOut size={16} strokeWidth={1.5} />
        Logout
      </button>
    </>
  );

  return (
    <>
      {/* Mobile top bar with hamburger toggle — only shown below md */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-line bg-matte-900 px-5 py-4 md:hidden">
        <Link href="/admin" className="font-display text-base font-bold tracking-widest2 text-fog">
          ZANX<span className="text-ash-light"> ADMIN</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="rounded-lg p-2 text-fog transition-colors hover:bg-white/5"
        >
          <Menu size={22} strokeWidth={1.5} />
        </button>
      </div>

      {/* Backdrop, mobile only, shown while drawer is open */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-in drawer */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-matte-900 px-5 py-8 transition-transform duration-300 ease-out md:hidden',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close admin menu"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-ash-light transition-colors hover:bg-white/5 hover:text-fog"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
        {sidebarContent}
      </aside>

      {/* Static desktop sidebar — unchanged from before */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-matte-900 px-5 py-8 md:flex">
        {sidebarContent}
      </aside>
    </>
  );
}
