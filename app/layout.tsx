import type { Metadata } from "next";
import SchemaMarkup from "@/components/SchemaMarkup";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

// Only index on the production domain. Vercel preview deployments (*.vercel.app) stay
// noindex to avoid competing with the live site at portbahnislay.co.uk.
// To go live: set NEXT_PUBLIC_SITE_URL=https://portbahnislay.co.uk in Vercel env vars
// (Production environment only). VERCEL_ENV=production is set automatically by Vercel.
const isProduction =
  process.env.NEXT_PUBLIC_SITE_URL === 'https://portbahnislay.co.uk' &&
  process.env.VERCEL_ENV === 'production';

export const metadata: Metadata = {
  title: "Portbahn Islay",
  description: "Holiday rental properties on Islay, Scotland",
  robots: isProduction ? undefined : { index: false, follow: false },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Site-wide Organization schema */}
        <SchemaMarkup type="Organization" data={null} />
      </head>
      <body className="antialiased font-mono flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
