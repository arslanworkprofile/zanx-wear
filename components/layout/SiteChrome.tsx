'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import WhatsAppButton from '@/components/layout/WhatsAppButton';
import type { SocialLinks } from '@/lib/data/settings';

export default function SiteChrome({
  children,
  social,
}: {
  children: React.ReactNode;
  social: SocialLinks;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    // Admin has its own sidebar/layout — don't show the storefront navbar,
    // cart drawer, or footer on top of it.
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main>{children}</main>
      <Footer social={social} />
      <WhatsAppButton />
    </>
  );
}
