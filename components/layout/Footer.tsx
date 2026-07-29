import Link from 'next/link';
import { Instagram, Twitter, Facebook, Music2 } from 'lucide-react';
import type { SocialLinks } from '@/lib/data/settings';

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', href: '/shop?filter=new' },
      { label: "Men's", href: '/shop?gender=men' },
      { label: "Women's", href: '/shop?gender=women' },
      { label: 'Accessories', href: '/shop?category=accessories' },
      { label: 'Sale', href: '/shop?filter=sale' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping Information', href: '/shipping' },
      { label: 'Return Policy', href: '/returns' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About ZANX', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Press', href: '/press' },
    ],
  },
];

export default function Footer({ social }: { social: SocialLinks }) {
  const socialIcons = [
    { key: 'instagram', href: social.instagram, Icon: Instagram, label: 'Instagram' },
    { key: 'facebook', href: social.facebook, Icon: Facebook, label: 'Facebook' },
    { key: 'twitter', href: social.twitter, Icon: Twitter, label: 'Twitter' },
    { key: 'tiktok', href: social.tiktok, Icon: Music2, label: 'TikTok' },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-line bg-matte-black">
      <div className="container-fluid py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <span className="font-display text-2xl font-bold tracking-widest2 text-fog">
              ZANX WEAR
            </span>
            <p className="mt-4 max-w-xs font-body text-sm leading-relaxed text-ash-light">
              Modern clothing and accessories, engineered with restraint. Wear the standard.
            </p>
            {socialIcons.length > 0 && (
              <div className="mt-6 flex gap-3">
                {socialIcons.map(({ key, href, Icon, label }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ash-light transition-colors hover:border-silver/40 hover:text-fog"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="eyebrow mb-5 text-fog/70">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-ash-light transition-colors hover:text-fog"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col items-center justify-between gap-4 font-body text-xs text-ash-dark sm:flex-row">
          <p>© {new Date().getFullYear()} ZANX WEAR. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ash-light">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-ash-light">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
