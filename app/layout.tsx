import './globals.css';
import type { Metadata } from 'next';
import SiteProviders from '@/components/SiteProviders';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'NØIR BEAN — Good Coffee. Good Day.', template: '%s | NØIR BEAN' },
  description: 'A cinematic specialty coffee experience with handcrafted drinks and freshly baked croissants.',
  applicationName: 'NØIR BEAN',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website', url: '/', siteName: 'NØIR BEAN', title: 'NØIR BEAN — Good Coffee. Good Day.',
    description: 'Handcrafted coffee, cinematic atmosphere, and freshly baked croissants.',
    images: [{ url: '/social-preview.jpg?v=6', width: 1200, height: 630, alt: 'NØIR BEAN café experience' }],
    locale: 'en_US', alternateLocale: ['ar_EG'],
  },
  twitter: { card: 'summary_large_image', title: 'NØIR BEAN', description: 'Good Coffee. Good Day.', images: ['/social-preview.jpg?v=6'] },
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en" suppressHydrationWarning><body className="font-sans antialiased"><SiteProviders>{children}</SiteProviders></body></html>;
}
