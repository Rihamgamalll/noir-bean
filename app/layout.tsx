import "./globals.css";
import type { Metadata } from "next";
import SiteProviders from "@/components/SiteProviders";

const siteUrl = "https://noir-bean-three.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "NØIR BEAN — Good Coffee. Good Day.",
    template: "%s | NØIR BEAN",
  },

  description:
    "A cinematic specialty coffee experience with handcrafted drinks and freshly baked croissants.",

  applicationName: "NØIR BEAN",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "NØIR BEAN",
    title: "NØIR BEAN — Good Coffee. Good Day.",
    description:
      "Handcrafted coffee, cinematic atmosphere, and freshly baked croissants.",
    images: [
      {
        url: `${siteUrl}/social-preview.png?v=10`,
        width: 1200,
        height: 630,
        alt: "NØIR BEAN café experience",
        type: "image/png",
      },
    ],
    locale: "en_US",
    alternateLocale: ["ar_EG"],
  },

  twitter: {
    card: "summary_large_image",
    title: "NØIR BEAN — Good Coffee. Good Day.",
    description:
      "Handcrafted coffee, cinematic atmosphere, and freshly baked croissants.",
    images: [`${siteUrl}/social-preview.png?v=10`],
  },

  icons: {
    icon: [
      {
        url: "/favicon.png?v=10",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.png?v=10",
    apple: "/apple-touch-icon.png?v=10",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}