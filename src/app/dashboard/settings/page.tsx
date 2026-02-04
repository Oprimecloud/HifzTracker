'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardShell from "@/components/dashboard/DashboardShell";
import ProfileSettings from "@/components/dashboard/ProfileSettings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Cloud, 
  Bell, 
  ShieldCheck, 
  ChevronRight, 
  Loader2,
  Database,
  Info
} from "lucide-react";
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      // 1. Check for Authenticated User
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: dbProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile({ ...dbProfile, isGuest: false });
        setIsGuest(false);
      } else {
        // 2. Load Local Guest Data
        const localData = localStorage.getItem('hifz_tracker_data');
        const guestData = localData ? JSON.parse(localData) : null;
        
        setProfile({
          full_name: 'Guest User',
          preferred_reciter: guestData?.preferred_reciter || 'ar.alafasy',
          daily_goal_ayahs: guestData?.daily_goal_ayahs || 10,
          isGuest: true
        });
        setIsGuest(true);
      }

      // Load Notification/Adhan preference
      const savedAdhan = localStorage.getItem('adhan_enabled');
      setNotificationsEnabled(savedAdhan === 'true');
      
      setLoading(false);
    }
    loadSettings();
  }, []);

  const toggleAdhan = async () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      localStorage.setItem('adhan_enabled', 'false');
    } else {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setNotificationsEnabled(true);
        localStorage.setItem('adhan_enabled', 'true');
      } else {
        alert("Please enable notifications in your browser settings.");
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto space-y-8 pb-20 px-4 sm:px-0">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
          <p className="text-slate-400 text-sm">Update your profile and spiritual goals.</p>
        </header>

        {/* 🚀 Guest Sync CTA */}
        {isGuest && (
          <Card className="bg-emerald-500/10 border-emerald-500/20 p-5 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
              <Cloud className="h-12 w-12 text-emerald-500" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center justify-center sm:justify-start gap-2">
                  <Database className="h-4 w-4" /> Cloud Sync Recommended
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs">
                  Your progress is currently saved only on this device. Create an account to protect your data.
                </p>
              </div>
              <Button 
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs px-6 h-11"
              >
                SECURE MY DATA <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </Card>
        )}

        {/* 🚀 Preferences */}
        <section className="space-y-4">
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] px-1">Preferences</h2>
          <Card className="bg-[#0a0a0a] border-white/5 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/5 rounded-xl">
                <Bell className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Adhan Alerts</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Prayer & Hifz Notifications</p>
              </div>
            </div>
            <button 
              onClick={toggleAdhan}
              className={`w-11 h-6 rounded-full transition-all duration-300 relative ${notificationsEnabled ? 'bg-emerald-500' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${notificationsEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </Card>
        </section>

        {/* 🚀 Profile Configuration */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Profile Configuration</h2>
            {isGuest && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-500/80 uppercase">
                <Info className="h-3 w-3" />
                <span>Session Preview</span>
              </div>
            )}
          </div>
          <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden">
             <ProfileSettings profile={profile} />
          </div>
        </section>

        <div className="flex items-center justify-center gap-2 pt-4">
           <ShieldCheck className="h-4 w-4 text-emerald-500/50" />
           <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
             End-to-End Spiritual Privacy
           </p>
        </div>
      </div>
    </DashboardShell>
  );
}