import type { Metadata } from "next";
import SchemaMarkup from "@/components/SchemaMarkup";
import "./globals.css";

export const metadata: Metadata = {
  title: "Portbahn Islay",
  description: "Holiday rental properties on Islay, Scotland",
};

export default function RootLayout({
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
      <body className="antialiased font-mono">
        {children}
      </body>
    </html>
  );
}
