'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Card } from "@/components/ui/card";
import { Trophy, Medal, Flame, Loader2, Info } from "lucide-react";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    async function fetchLeaderboard() {
      // 🚀 1. Determine status safely
      const { data: { session } } = await supabase.auth.getSession();
      setIsGuest(!session);

      // 🚀 2. Fetch using the anon key (which now has public access)
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, current_streak, avatar_url')
        .order('current_streak', { ascending: false })
        .limit(10);

      if (error) {
        console.error("Leaderboard fetch error:", error.message);
      } else if (data) {
        setLeaders(data);
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
    </div>
  );

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              < Trophy className="text-emerald-500" /> Community Leaderboard
            </h1>
            <p className="text-slate-400 text-sm">Race towards good deeds with the Ummah.</p>
          </div>
          
          {isGuest && (
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
              <Info className="h-4 w-4 text-emerald-500" />
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">
                Sign in to join the rankings
              </p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {leaders.length === 0 ? (
             <p className="text-center text-slate-500 py-10 italic">No rankings available yet.</p>
          ) : (
            leaders.map((leader, index) => (
              <Card 
                key={index} 
                className={`border-white/5 p-4 flex items-center justify-between transition-all ${
                  index === 0 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-[#0a0a0a]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 text-center font-bold text-slate-500">
                    {index === 0 ? <Medal className="text-yellow-500 mx-auto" /> : index + 1}
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-500 uppercase">
                    {leader.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{leader.full_name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Active Member</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5">
                  <Flame className={`h-4 w-4 ${index === 0 ? 'text-orange-500' : 'text-slate-400'}`} />
                  <span className="font-bold text-sm text-white">{leader.current_streak}d</span>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardShell>
  );
}