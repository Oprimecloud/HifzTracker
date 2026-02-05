'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle2, RefreshCw, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface RevisionItem {
  surah: number;
  daysAgo: number;
  lastRead: string;
}

export default function SmartRevision({ userId }: { userId: string | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [revisionList, setRevisionList] = useState<RevisionItem[]>([]);

  const processLogs = (logs: any[]) => {
    // ... (Keep your existing logic here)
    const lastReadMap: Record<number, string> = {};
    logs.forEach((log) => {
      const current = new Date(log.created_at).getTime();
      const existing = lastReadMap[log.surah_number] ? new Date(lastReadMap[log.surah_number]).getTime() : 0;
      if (current > existing) lastReadMap[log.surah_number] = log.created_at;
    });

    const today = new Date().getTime();
    const needsReview: RevisionItem[] = [];

    Object.keys(lastReadMap).forEach((surahStr) => {
      const surah = parseInt(surahStr);
      const lastReadTime = new Date(lastReadMap[surah]).getTime();
      const diffTime = Math.abs(today - lastReadTime);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      if (diffDays > 7) needsReview.push({ surah, daysAgo: diffDays, lastRead: lastReadMap[surah] });
    });

    return needsReview.sort((a, b) => b.daysAgo - a.daysAgo).slice(0, 3);
  };

  useEffect(() => {
    async function fetchHistory() {
      let logs = [];
      if (userId === 'guest') {
        logs = JSON.parse(localStorage.getItem('hifz_progress_logs') || '[]');
      } else if (userId) {
        const { data } = await supabase.from('progress_logs').select('surah_number, created_at').eq('user_id', userId);
        logs = data || [];
      }
      setRevisionList(processLogs(logs));
      setLoading(false);
    }
    fetchHistory();
  }, [userId]);

  if (loading) return null;

  return (
    <Card className="border-white/5 bg-[emerald] overflow-hidden relative group p-6 rounded-[2rem]">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <RefreshCw className="h-24 w-24 text-amber-500" />
      </div>

      <div className="relative z-10 space-y-6">
        <div>
          <h3 className="text-white flex items-center gap-2 font-bold text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500" /> Weak Hifz Detected
          </h3>
          <p className="text-slate-400 text-xs mt-1">Surahs you haven't reviewed in 7+ days.</p>
        </div>

        {revisionList.length === 0 ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-sm font-bold text-emerald-400">All Caught Up!</p>
              <p className="text-[10px] text-emerald-500/70">Your revision cycle is healthy.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {revisionList.map((item) => (
              <div key={item.surah} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-500 border border-amber-500/20">
                    {item.surah}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Surah {item.surah}</p>
                    <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">{item.daysAgo} Days Ago</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => router.push('/recite')} className="h-8 w-8 p-0 rounded-full text-slate-400 hover:text-white hover:bg-white/10">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}