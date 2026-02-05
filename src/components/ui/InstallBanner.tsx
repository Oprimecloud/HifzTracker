'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from './button';

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    // 2. Android/Chrome specific event
    // This event ONLY fires on browsers that support automatic install (Android/Desktop)
    // It does NOT fire on iOS, so this banner will naturally stay hidden on iPhones.
    const handleBeforeInstallPrompt = (e: any) => {
      console.log("✅ PWA Install event captured!");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-[100] animate-in slide-in-from-top-10 duration-500">
      <div className="bg-emerald-950 border border-emerald-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white leading-tight">Install Hifz Tracker</p>
            <p className="text-[10px] text-emerald-400/80 uppercase font-bold tracking-widest">
              Native App Experience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
            {/* 🚀 Android Install Button */}
            <Button 
              size="sm" 
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-9 text-[11px] px-4 rounded-xl shadow-lg"
            >
              INSTALL NOW
            </Button>
          
          <button onClick={dismissBanner} className="text-slate-500 hover:text-white p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}