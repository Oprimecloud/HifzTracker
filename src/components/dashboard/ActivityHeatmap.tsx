'use client';

import { useEffect, useState, useRef } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Flame, Share2, Sparkles, Activity, Zap, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toBlob } from 'html-to-image'; // 🚀 Changed from toPng to toBlob for file sharing
import AchievementPopup from './AchievementPopup';

export default function ActivityHeatmap({ userId }: { userId: string | null }) {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const [stats, setStats] = useState({ streak: 0, total: 0, activeDays: 0 });
  const [showAchievement, setShowAchievement] = useState(false);
  const [sharing, setSharing] = useState(false); // Loading state for share
  const heatmapRef = useRef<HTMLDivElement>(null);

  const calculateStats = (activityData: { date: string; count: number }[]) => {
    const total = activityData.reduce((acc, curr) => acc + curr.count, 0);
    const activeDays = activityData.filter(d => d.count > 0).length;

    const sortedDates = activityData
      .map(d => new Date(d.date).getTime())
      .sort((a, b) => b - a);

    let streak = 0;
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (sortedDates.length > 0) {
      let lastDate = new Date(sortedDates[0]);
      lastDate.setHours(0, 0, 0, 0);
      
      if (today.getTime() - lastDate.getTime() <= oneDay) {
        streak = 1;
        for (let i = 1; i < sortedDates.length; i++) {
          const currentDate = new Date(sortedDates[i]);
          currentDate.setHours(0, 0, 0, 0);
          if (lastDate.getTime() - currentDate.getTime() === oneDay) {
            streak++;
            lastDate = currentDate;
          } else {
            break;
          }
        }
      }
    }
    return { streak, total, activeDays };
  };

  // 🚀 The New "Smart Share" Engine
  const handleShare = async () => {
    if (heatmapRef.current === null) return;
    setSharing(true);

    try {
      // 1. Generate High-Res Blob
      const blob = await toBlob(heatmapRef.current, { 
        cacheBust: true,
        backgroundColor: '#020617', 
        pixelRatio: 2 
      });

      if (!blob) throw new Error("Image generation failed");

      // 2. Create File Object
      const file = new File([blob], 'hifz-momentum.png', { type: 'image/png' });
      
      const shareData = {
        title: 'My HifzTracker Momentum',
        text: `I've maintained a ${stats.streak}-day streak on HifzTracker! 🚀\n\nSecure your akhirah journey:`,
        url: 'https://hifztracker.space', // 🚀 The Link is now clickable in the share
        files: [file]
      };

      // 3. Trigger Native Share (Mobile) or Fallback (Desktop)
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: Download image + Copy link to clipboard
        const link = document.createElement('a');
        link.download = `hifz-momentum-${new Date().toISOString().split('T')[0]}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
        
        await navigator.clipboard.writeText('https://hifztracker.space');
        alert("Image downloaded & Link copied to clipboard! 📋");
      }
    } catch (err) {
      console.error('Sharing failed', err);
    } finally {
      setSharing(false);
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const counts: Record<string, number> = {};

      if (userId === 'guest') {
        const localLogs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
        localLogs.forEach((log: any) => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          counts[date] = (counts[date] || 0) + 2; 
        });
      } else if (userId) {
        const { data: hifzLogs } = await supabase
          .from('progress_logs')
          .select('created_at')
          .eq('user_id', userId);

        hifzLogs?.forEach((log) => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          counts[date] = (counts[date] || 0) + 2; 
        });
      }

      const formattedData = Object.keys(counts).map(date => ({ date, count: counts[date] }));
      setData(formattedData);
      
      const newStats = calculateStats(formattedData);
      setStats(newStats);
      
      if (newStats.streak === 7) setShowAchievement(true);
    };
    
    fetchActivity();
  }, [userId]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <div>
          <h3 className="text-white flex items-center gap-2 font-bold tracking-tight text-lg">
            <Flame className="h-5 w-5 text-emerald-500" /> Spiritual Momentum
          </h3>
        </div>
        <Button 
          onClick={handleShare}
          disabled={sharing}
          className="bg-white/5 hover:bg-white/10 text-emerald-400 border border-emerald-500/20 rounded-xl px-4 h-10 gap-2 transition-all"
        >
          {sharing ? <Sparkles className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
          <span className="text-xs font-bold uppercase tracking-wider">
            {sharing ? 'Generating...' : 'Share Journey'}
          </span>
        </Button>
      </div>

      <Card 
        ref={heatmapRef} 
        className="border-white/5 bg-[#020617] relative overflow-hidden p-8 rounded-[2rem] shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/10 rounded-full blur-[80px]" />

        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-1">
                HifzTracker<span className="text-emerald-500 text-4xl">.</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-8 bg-emerald-500/50 rounded-full"></span>
                {/* 🚀 URL VISUAL: Ensuring the link is seen in the image itself */}
                <p className="text-[10px] text-emerald-500/80 uppercase tracking-[0.2em] font-bold">hifztracker</p>
              </div>
            </div>
            
            <div className="flex gap-4">
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-end gap-1">
                    Focus Sessions <Zap className="h-3 w-3 text-emerald-500" />
                  </p>
                  <p className="text-xl font-black text-white">{stats.total}</p>
               </div>
               <div className="w-px h-8 bg-white/10" />
               <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Active Days</p>
                  <p className="text-xl font-black text-emerald-400">{stats.activeDays}</p>
               </div>
            </div>
          </div>

          <div className="custom-heatmap py-2">
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={data}
              classForValue={(value) => {
                if (!value || value.count === 0) return 'color-empty';
                const intensity = Math.min(Math.ceil(value.count / 2), 4);
                return `color-emerald-${intensity}`;
              }}
              gutterSize={3}
              showWeekdayLabels={true}
            />
          </div>

          <div className="flex justify-between items-end pt-6 border-t border-white/5">
            <div className="flex items-center gap-4">
               <div className="bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/10 flex items-center gap-2">
                  <Activity className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                     Current Streak: {stats.streak} Days
                  </span>
               </div>
            </div>
            
            <div className="flex items-center gap-2">
               <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Less</span>
               <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-white/5' : `color-emerald-${i}`}`} />
                  ))}
               </div>
               <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest ml-1">More</span>
            </div>
          </div>
        </div>

        <style jsx global>{`
          .react-calendar-heatmap text { font-size: 9px; fill: #e1e6ec; font-weight: 700; font-family: inherit; }
          .custom-heatmap .color-empty { fill: rgb(254, 254, 254); rx: 2px; }
          .color-emerald-1 { fill: #03382a; rx: 3px; }
          .color-emerald-2 { fill: #10352a; rx: 3px; }
          .color-emerald-3 { fill: #031b14; rx: 4px; filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.3)); }
          .color-emerald-4 { fill: #1b6247; rx: 4px; filter: drop-shadow(0 0 4px rgba(52, 211, 153, 0.5)); }
          rect { transition: all 0.3s ease; }
          rect:hover { stroke: #fff; stroke-width: 1px; }
        `}</style>
      </Card>

      <AchievementPopup isOpen={showAchievement} onClose={() => setShowAchievement(false)} streak={stats.streak} />
    </div>
  );
}