'use client';

import { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, Moon, MapPin, Loader2, Bell, BellOff, Volume2 } from "lucide-react";
import { Button } from '../ui/button';

export default function IslamicCalendar() {
  const [data, setData] = useState<any>(null);
  const [locationName, setLocationName] = useState("Ibadan, NG");
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; countdown: string } | null>(null);
  
  // 🚀 Audio Reference
  const adhanAudio = useRef<HTMLAudioElement | null>(null);
  const lastNotifiedPrayer = useRef<string | null>(null);

  useEffect(() => {
    // Standard audio initialization
    adhanAudio.current = new Audio('https://www.islamcan.com/audio/adhan/azan1.mp3');
  }, []);

  const enableNotifications = async () => {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotificationsEnabled(true);
      // 🚀 Essential: Play/Pause briefly to unlock audio on mobile browsers
      adhanAudio.current?.play().then(() => {
        adhanAudio.current?.pause();
        adhanAudio.current!.currentTime = 0;
      }).catch(() => {});
    }
  };

  // Fetch Timings Logic
  useEffect(() => {
    const fetchTimings = async (lat: number, lng: number, cityLabel?: string) => {
      try {
        const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
        const result = await res.json();
        setData(result.data);
        if (cityLabel) setLocationName(cityLabel);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching timings:", error);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const geoData = await geoRes.json();
          const city = geoData.address.city || geoData.address.town || "Location";
          fetchTimings(latitude, longitude, `${city}, ${geoData.address.country_code.toUpperCase()}`);
        },
        () => fetchTimings(7.3775, 3.9470, "Ibadan, NG")
      );
    }
  }, []);

  // MASTER EFFECT: Handle Countdown AND Audio Adhan Trigger
  useEffect(() => {
    if (!data) return;

    const updateSync = () => {
      const now = new Date();
      const timings = data.timings;
      const prayerOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      const currentTimeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      
      let foundNext = false;

      for (let name of prayerOrder) {
        // 1. Check if it's EXACTLY time for Adhan
        if (notificationsEnabled && timings[name] === currentTimeStr && lastNotifiedPrayer.current !== name) {
          lastNotifiedPrayer.current = name;
          adhanAudio.current?.play().catch(e => console.warn("Audio blocked by browser", e));
          new Notification(`Allahu Akbar! It is time for ${name}`, {
            body: `Beginning prayer time for ${name} in ${locationName}.`,
            icon: '/favicon.ico'
          });
        }

        // 2. Update Countdown Logic
        const [hours, minutes] = timings[name].split(':');
        const prayerTime = new Date();
        prayerTime.setHours(parseInt(hours), parseInt(minutes), 0);

        if (prayerTime > now) {
          const diff = prayerTime.getTime() - now.getTime();
          const h = Math.floor(diff / (1000 * 60 * 60));
          const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const s = Math.floor((diff % (1000 * 60)) / 1000);
          
          setNextPrayer({ name, countdown: `${h}h ${m}m ${s}s` });
          foundNext = true;
          break;
        }
      }

      if (!foundNext) setNextPrayer({ name: 'Fajr', countdown: 'Tomorrow' });
      
      // Reset tracker at midnight
      if (currentTimeStr === "00:00") lastNotifiedPrayer.current = null;
    };

    const interval = setInterval(updateSync, 1000); // 🚀 Check every second for precision
    return () => clearInterval(interval);
  }, [data, notificationsEnabled, locationName]);

  if (loading) return (
    <div className="h-64 w-full flex items-center justify-center bg-slate-900/50 rounded-3xl border border-white/5">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/10 p-5 sm:p-8 rounded-3xl shadow-xl space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
            <CalendarIcon className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Hijri Date</h3>
            <p className="text-lg font-black text-white">
              {data.date.hijri.day} {data.date.hijri.month.en} {data.date.hijri.year}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={enableNotifications}
            className={`h-9 px-3 rounded-xl border transition-all ${
              notificationsEnabled 
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
              : 'bg-white/5 border-white/5 text-slate-400'
            }`}
          >
            {notificationsEnabled ? <Volume2 className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {notificationsEnabled ? 'Adhan Active' : 'Enable Adhan'}
            </span>
          </Button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <MapPin className="h-3 w-3 text-emerald-500" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">
              {locationName}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((name) => (
          <div key={name} className={`border p-4 rounded-2xl flex flex-col items-center transition-all ${
            nextPrayer?.name === name ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.03] border-white/5'
          }`}>
            <span className={`text-[9px] font-black uppercase mb-1 ${nextPrayer?.name === name ? 'text-emerald-500' : 'text-slate-500'}`}>{name}</span>
            <span className="text-sm font-bold text-white">{data.timings[name]}</span>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
            {nextPrayer ? `${nextPrayer.name} in ${nextPrayer.countdown}` : 'Calculating next prayer...'}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-emerald-500/50" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {data.date.hijri.month.ar}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}