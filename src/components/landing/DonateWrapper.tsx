'use client'; // This wrapper handles the client-only logic

import dynamic from 'next/dynamic';

const DynamicDonate = dynamic(() => import('./Donate'), { 
  ssr: false,
  loading: () => <div className="py-24 bg-emerald-900 animate-pulse" /> 
});

export default function DonateWrapper() {
  return <DynamicDonate />;
}