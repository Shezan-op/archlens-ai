import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "screenshot analysis",
    "design audit",
    "system architecture",
    "AI tool",
    "UI analysis",
  ],
  authors: [{ name: "Shezan", url: siteConfig.github }],
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.tagline,
    type: "website",
    url: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
