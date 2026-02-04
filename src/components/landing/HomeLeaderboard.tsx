'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from "@/components/ui/card";
import { Flame } from "lucide-react";

export default function HomeLeaderboard() {
  const [leaders, setLeaders] = useState<any[]>([]);

  useEffect(() => {
    async function getLeaders() {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, current_streak')
        .order('current_streak', { ascending: false })
        .limit(5);
      if (data) setLeaders(data);
    }
    getLeaders();
  }, []);

  if (leaders.length === 0) return null;

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tighter">Top Momentum</h2>
          <p className="text-slate-400">Join the Ummah in our race towards eternity.</p>
        </div>

        <div className="space-y-3">
          {leaders.map((leader, index) => (
            <Card 
              key={index} 
              className="bg-[#0f0f0f] border-white/5 p-4 flex items-center justify-between hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-emerald-500/40 font-mono font-bold w-6 group-hover:text-emerald-500 transition-colors">
                  0{index + 1}
                </span>
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-xs font-bold text-emerald-500 uppercase">
                  {leader.full_name?.charAt(0)}
                </div>
                <span className="text-white font-medium">{leader.full_name}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-500">
                <Flame className="h-4 w-4" />
                <span className="font-bold">{leader.current_streak}d</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}