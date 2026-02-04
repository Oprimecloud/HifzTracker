import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AudioProvider } from '@/context/AudioContext';
import MiniPlayer from '@/components/dashboard/MiniPlayer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hifz Tracker | Earn Eternity Rewards",
  description: "Track your Quran journey and stay consistent during Ramadan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AudioProvider>
        {children}
        <MiniPlayer /> 
        </AudioProvider>
      </body>
    </html>
  );
}