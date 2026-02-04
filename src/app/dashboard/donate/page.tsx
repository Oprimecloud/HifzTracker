  'use client';
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";

// This bypasses the "window is not defined" error during build
const DonateContent = dynamic(
  () => import('@/components/dashboard/DonateContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-slate-900">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
      </div>
    )
  }
);

export default function DonatePage() {
  return <DonateContent />;
}