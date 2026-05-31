import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Demo Hunt — doomscroll startup pitches",
  description:
    "TikTok for startup demos. Vertical-scroll, 15-30 second pitches from founders, hackathons, and demo days worldwide. Vote, watch, and contact the team.",
  openGraph: {
    title: "Demo Hunt",
    description: "Doomscroll startup pitches. Vote. Watch. Contact.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <div className="flex flex-1 min-h-0">
          <SiteSidebar />
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
