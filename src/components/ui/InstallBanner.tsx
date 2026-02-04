'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { Button } from './button';

export default function InstallBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // 1. Detect Platform accurately
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    setPlatform(isIOS ? 'ios' : 'android');

    // Hide if already installed
    if (isStandalone) {
      setShowBanner(false);
      return;
    }

    // 2. Android/Chrome specific event
    const handleBeforeInstallPrompt = (e: any) => {
      console.log("✅ PWA Install event captured!");
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // 3. iOS Logic: iPhone doesn't fire events, so we show manually
    if (isIOS) {
      const lastPrompt = localStorage.getItem('install_prompt_dismissed');
      const oneDay = 24 * 60 * 60 * 1000;
      if (!lastPrompt || Date.now() - parseInt(lastPrompt) > oneDay) {
        setShowBanner(true);
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    // 🚀 Only runs on Android/Chrome
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShowBanner(false);
      setDeferredPrompt(null);
    } else if (platform !== 'ios') {
      // Logic for non-iOS where the event hasn't fired yet
      alert("Browser is still preparing the install. Check your /public/icons/ folder.");
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
    localStorage.setItem('install_prompt_dismissed', Date.now().toString());
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
              {platform === 'ios' ? 'Safari Home Screen' : 'Native App Experience'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {platform === 'ios' ? (
            /* 🚀 Professional iOS Instruction UI */
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-white bg-emerald-500/10 px-3 py-2 rounded-xl border border-emerald-500/20">
              <Share className="h-4 w-4 text-emerald-400" />
              <span>Tap Share then <span className="text-emerald-400">"Add to Home Screen"</span></span>
            </div>
          ) : (
            /* 🚀 Android Install Button */
            <Button 
              size="sm" 
              onClick={handleInstallClick}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold h-9 text-[11px] px-4 rounded-xl shadow-lg"
            >
              INSTALL NOW
            </Button>
          )}
          <button onClick={dismissBanner} className="text-slate-500 hover:text-white p-2">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}