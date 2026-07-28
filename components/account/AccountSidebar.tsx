'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  User,
  Lock,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { label: 'Orders', href: '/account/orders', icon: Package },
  { label: 'Wishlist', href: '/account/wishlist', icon: Heart },
  { label: 'Addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Profile', href: '/account/profile', icon: User },
  { label: 'Change Password', href: '/account/change-password', icon: Lock },
];

export default function AccountSidebar({
  name,
  email,
  role,
}: {
  name?: string | null;
  email?: string | null;
  role?: string;
}) {
  const pathname = usePathname();
  const isStaff = role === 'admin' || role === 'manager';

  return (
    <aside className="w-full shrink-0 md:w-64">
      <div className="mb-8">
        <p className="font-body text-sm text-fog">{name || 'Your Account'}</p>
        <p className="font-body text-xs text-ash-light">{email}</p>
      </div>

      {isStaff && (
        <Link
          href="/admin"
          className="mb-4 flex items-center gap-3 rounded-lg border border-line bg-white/5 px-3.5 py-2.5 font-body text-sm text-fog transition-colors hover:border-silver/40"
        >
          <ShieldCheck size={16} strokeWidth={1.5} />
          Go to Admin Panel
        </Link>
      )}

      <nav className="space-y-1">
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
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 font-body text-sm text-ash-light transition-colors hover:bg-white/5 hover:text-fog"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
