'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Flame, Trophy, Medal, Crown } from "lucide-react";
import Link from 'next/link';

export default function HomeLeaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    async function getLeaders() {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, current_streak')
        .neq('full_name', null)
        .order('current_streak', { ascending: false })
        .limit(5);
        
      if (data) setLeaders(data);
    }
    getLeaders();
  }, []);

  if (leaders.length === 0) return null;

  const getRankStyle = (index: number) => {
    switch(index) {
      case 0: return { icon: <Crown className="h-5 w-5 text-amber-400 fill-amber-400/20" />, border: 'border-amber-500/30', bg: 'bg-amber-500/5' };
      case 1: return { icon: <Medal className="h-5 w-5 text-slate-300" />, border: 'border-white/10', bg: 'bg-white/5' };
      case 2: return { icon: <Medal className="h-5 w-5 text-amber-700" />, border: 'border-white/5', bg: 'bg-white/5' };
      default: return { icon: <span className="text-slate-500 font-mono font-bold">0{index + 1}</span>, border: 'border-white/5', bg: 'bg-white/[0.02]' };
    }
  };

  return (
    // 🚀 Added 'border-t' and 'shadow' for separation
    <section className="py-24 bg-[#020617] relative overflow-hidden border-t border-white/5 shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.8)]">
      
      {/* 🚀 The "Borderline" Glow Effect - Acts as a separator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-20 bg-emerald-500/5 blur-[50px] pointer-events-none" />

      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            <Trophy className="h-3 w-3" /> Global Rankings
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
            Community Momentum
          </h2>
          <p className="text-slate-400 text-lg">
            Join the Ummah in our race towards eternity. <br className="hidden sm:block"/> consistency is the key to mastery.
          </p>
        </div>

        <div className="space-y-3">
          {leaders.map((leader, index) => {
            const rank = getRankStyle(index);
            
            return (
              <Card 
                key={index} 
                className={`
                  p-4 flex items-center justify-between transition-all duration-300 hover:scale-[1.01]
                  ${rank.bg} ${rank.border}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center">
                    {rank.icon}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-sm font-bold text-slate-300 uppercase">
                      {leader.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm md:text-base">
                        {leader.full_name || 'Anonymous User'}
                      </p>
                      {index === 0 && (
                        <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                          Current Leader
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#0a0a0a] px-3 py-1.5 rounded-lg border border-white/5">
                  <Flame className={`h-4 w-4 ${index === 0 ? 'text-amber-500 fill-amber-500' : 'text-emerald-500'}`} />
                  <span className="font-bold text-white tabular-nums">{leader.current_streak}</span>
                  <span className="text-xs text-slate-500 font-medium uppercase">Days</span>
                </div>
              </Card>
            );
          })}

          {/* 🚀 The "Join Now" CTA Card */}
          <Link href="/login" className="block mt-6 group">
            <Card className="bg-emerald-600 border-none p-4 flex items-center justify-between opacity-90 group-hover:opacity-100 transition-all cursor-pointer shadow-lg shadow-emerald-900/20">
               <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center text-emerald-200 font-mono font-bold">
                    0{leaders.length + 1}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold border border-white/20">
                      ?
                    </div>
                    <span className="text-white font-bold">You?</span>
                  </div>
               </div>
               <span className="text-xs font-bold text-white bg-white/20 px-3 py-1 rounded-lg uppercase tracking-wider">
                 Start Your Streak
               </span>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  );
}