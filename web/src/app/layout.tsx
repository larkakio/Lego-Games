import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { JetBrains_Mono, Orbitron } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const display = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lego-games.vercel.app";

/** Base App domain verification — must appear in raw HTML; keep fallback if env missing on Vercel. */
const baseAppId =
  process.env.NEXT_PUBLIC_BASE_APP_ID?.trim() ||
  "69dc9f152c63bda05673176a";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Neon Brick Grid",
  description:
    "Cyberpunk neon brick sliding puzzle — mobile swipe controls, Base check-in.",
  icons: {
    icon: "/icon.jpg",
  },
  openGraph: {
    title: "Neon Brick Grid",
    description: "Swipe the holo grid. Daily check-in on Base.",
    images: ["/thumbnail.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05060a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const cookieHeader = h.get("cookie");

  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body
        className={`${display.variable} ${mono.variable} min-h-screen bg-[#05060a] font-sans text-slate-200 antialiased`}
      >
        <Providers cookies={cookieHeader}>{children}</Providers>
      </body>
    </html>
  );
}
