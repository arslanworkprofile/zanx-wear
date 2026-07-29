import type { Metadata } from 'next';
import { Poppins, Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import SiteChrome from '@/components/layout/SiteChrome';
import AuthProvider from '@/components/providers/AuthProvider';
import { getSocialLinks } from '@/lib/data/settings';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'ZANX WEAR — Premium Clothing & Accessories',
    template: '%s | ZANX WEAR',
  },
  description: 'Modern, minimal, premium fashion for men and women. Wear the standard.',
  openGraph: {
    title: 'ZANX WEAR',
    description: 'Modern, minimal, premium fashion for men and women.',
    type: 'website',
    siteName: 'ZANX WEAR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZANX WEAR',
    description: 'Modern, minimal, premium fashion for men and women.',
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const social = await getSocialLinks();

  return (
    <html lang="en" className={`${poppins.variable} ${outfit.variable}`}>
      <body className="bg-matte-black font-body text-fog antialiased selection:bg-silver selection:text-matte-black">
        <AuthProvider>
          <SiteChrome social={social}>{children}</SiteChrome>
        </AuthProvider>
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: '#18181B',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#F2F2F0',
            },
          }}
        />
      </body>
    </html>
  );
}
