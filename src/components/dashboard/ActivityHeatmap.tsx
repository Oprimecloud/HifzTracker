'use client';

import { useEffect, useState, useRef } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toPng } from 'html-to-image';

export default function ActivityHeatmap({ userId }: { userId: string }) {
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
  const heatmapRef = useRef<HTMLDivElement>(null);

  const exportImage = async () => {
    if (heatmapRef.current === null) return;
    try {
      const dataUrl = await toPng(heatmapRef.current, { 
        cacheBust: true,
        backgroundColor: '#020617', // Ensures a solid dark background on export
      });
      const link = document.createElement('a');
      link.download = `hifz-momentum-${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };

  useEffect(() => {
    const fetchActivity = async () => {
      const { data: logs } = await supabase
        .from('progress_logs')
        .select('created_at')
        .eq('user_id', userId);

      if (logs) {
        const counts = logs.reduce((acc: any, log: any) => {
          const date = new Date(log.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
        setData(Object.keys(counts).map(date => ({ date, count: counts[date] })));
      }
    };
    fetchActivity();
  }, [userId]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-emerald-500 flex items-center gap-2 font-bold tracking-tight">
          <Flame className="h-5 w-5" /> Spiritual Momentum
        </h3>
        <Button 
          onClick={exportImage}
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 h-9 shadow-lg shadow-emerald-900/20 gap-2"
        >
          <Share2 className="h-4 w-4" />
          <span className="text-xs font-bold">Share My Journey</span>
        </Button>
      </div>

      {/* THE SHAREABLE AREA */}
      <Card 
        ref={heatmapRef} 
        className="border-white/5 bg-slate-950 relative overflow-hidden p-8 rounded-3xl"
      >
        {/* Aesthetic Background Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-900/20 rounded-full blur-[100px]" />

        <div className="relative z-10 space-y-8">
          {/* Top Brand Branding */}
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                HifzTracker<span className="text-emerald-500">.</span>
              </h2>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Your Journey To Eternity</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
               <Sparkles className="h-3 w-3 text-emerald-400" />
               <span className="text-[10px] font-bold text-emerald-400">RAMADAN 2026</span>
            </div>
          </div>

          {/* The Heatmap Grid */}
          <div className="custom-heatmap py-4">
            <CalendarHeatmap
              startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
              endDate={new Date()}
              values={data}
              classForValue={(value) => {
                if (!value) return 'color-empty';
                return `color-emerald-${Math.min(value.count, 4)}`;
              }}
            />
          </div>

          {/* Footer of the Image */}
          <div className="flex justify-between items-end pt-4 border-t border-white/5">
            <div>
              <p className="text-xs font-bold text-white mb-1">Consistency is Key</p>
              <div className="flex gap-1 items-center">
                <span className="text-[10px] text-slate-500 mr-2">Intensity</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-3 h-3 rounded-sm ${i === 0 ? 'bg-white/5' : `color-emerald-${i}`}`} />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
               <p className="text-[10px] text-slate-400 italic mb-1">Join me at</p>
               <p className="text-sm font-black text-emerald-500">hifztracker</p>
            </div>
          </div>
        </div>

        {/* Custom Heatmap CSS for Export */}
        <style jsx global>{`
          .custom-heatmap .color-empty { fill: rgba(255, 255, 255, 0.05); }
          .color-emerald-1 { fill: #064e3b; }
          .color-emerald-2 { fill: #047857; }
          .color-emerald-3 { fill: #10b981; }
          .color-emerald-4 { fill: #34d399; }
          .react-calendar-heatmap text { font-size: 8px; fill: #475569; font-weight: 600; }
        `}</style>
      </Card>
    </div>
  );
}