'use client';

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
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: ShoppingBag },
  { label: 'Orders', href: '/admin/orders', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tags },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Ticket },
  { label: 'Reviews', href: '/admin/reviews', icon: Star },
  { label: 'Pages', href: '/admin/pages', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-line bg-matte-900 px-5 py-8 md:flex">
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
    </aside>
  );
}
