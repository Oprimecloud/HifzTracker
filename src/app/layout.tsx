import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from '@/context/AudioContext';
import MiniPlayer from '@/components/dashboard/MiniPlayer';
import InstallBanner from '@/components/ui/InstallBanner';
import InstallPrompt from "@/components/InstallPrompt";


const inter = Inter({ subsets: ["latin"] });

// 🚀 Professional Metadata for PWA & SEO
export const metadata: Metadata = {
  title: "Hifz Tracker | Earn Eternity Rewards",
  description: "Track your Quran journey and stay consistent during Ramadan.",
  manifest: "/manifest.json", // 🔗 Connects to your manifest file
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Hifz Tracker",
  },
};

// 🚀 Ensures the app colors match your brand on mobile bars
export const viewport: Viewport = {
  themeColor: "#10b981",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Manual Fallbacks for older browsers */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={inter.className}>
        <AudioProvider>
          <InstallBanner /> 
          {children}
          <MiniPlayer /> 
        </AudioProvider>
        <InstallPrompt /> {/* 🚀 Add this line at the bottom */}
      </body>
    </html>
  );
}