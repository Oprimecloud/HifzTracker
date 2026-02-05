'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAudio } from '@/context/AudioContext';
import { Play, Pause, Repeat1, Gauge, BookOpen, ClipboardList, Sun, Moon, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
// 🚀 Importing the local JSON we built
import adhkarData from '@/data/adhkar.json';

const CATEGORIES = [
  { id: 'morning', name: 'Morning', icon: <Sun className="h-4 w-4" /> },
  { id: 'evening', name: 'Evening', icon: <Moon className="h-4 w-4" /> },
  { id: 'prayer', name: 'After Prayer', icon: <Heart className="h-4 w-4" /> }
];

export default function AdhkarReader({ userId }: { userId: string }) {
  const router = useRouter();
  const { isPlaying, playAyah, activeAyahIndex, playbackRate, setRate, toggleAudio } = useAudio();
  
  const [category, setCategory] = useState<'morning' | 'evening' | 'prayer'>('morning');
  const [items, setItems] = useState<any[]>([]);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  // 🚀 Unified Logging Logic
  const logProgress = async () => {
    const label = category.charAt(0).toUpperCase() + category.slice(1) + " Adhkar";
    try {
      if (userId && userId !== 'guest') {
        const { error } = await supabase.from('hifz_logs').insert([
          { user_id: userId, surah_name: label, status: 'completed', date: new Date().toISOString() }
        ]);
        if (!error) toast.success(`${label} logged to cloud!`);
      } else {
        const history = JSON.parse(localStorage.getItem('guest_hifz_history') || '[]');
        localStorage.setItem('guest_hifz_history', JSON.stringify([{ id: Date.now(), surah_name: label, date: new Date().toISOString() }, ...history]));
        toast.success(`${label} saved to local history!`);
      }
    } catch (e) { toast.error("Logging failed"); }
  };

  // 🚀 Switch data based on category
  useEffect(() => {
    setItems((adhkarData as any)[category] || []);
  }, [category]);

  // 🚀 Auto-Scroll and Auto-Log Continuity
  useEffect(() => {
    if (activeAyahIndex !== null && items.length > 0) {
      refs.current[activeAyahIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      if (activeAyahIndex === items.length - 1 && !isPlaying) {
        logProgress();
      }
    }
  }, [activeAyahIndex, isPlaying]);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col z-0">
      
      {/* --- Sticky Header --- */}
      <div className="flex-none p-4 border-b border-white/5 bg-[#0a0a0a]/95 backdrop-blur-xl z-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="text-emerald-500 bg-emerald-500/10 rounded-xl h-10 w-10 border border-emerald-500/20">
            <BookOpen className="h-5 w-5" />
          </Button>

          {/* <Button variant="ghost" size="icon" onClick={logProgress} className="text-amber-500 bg-amber-500/10 rounded-xl h-10 w-10 border border-amber-500/20">
            <ClipboardList className="h-5 w-5" />
          </Button> */}

          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value as any)}
            className="bg-white/5 text-white font-bold rounded-full px-4 py-2 text-xs outline-none border border-white/10 appearance-none"
          >
            {CATEGORIES.map(c => <option key={c.id} value={c.id} className="bg-[#0a0a0a]">{c.name}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-1">
          {/* 🚀 Hardware Lock Play Button */}
          {/* <Button onClick={toggleAudio} variant="ghost" size="icon" className="text-emerald-500 bg-emerald-500/10 rounded-full h-10 w-10">
            {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
          </Button> */}
        </div>
      </div>

      {/* --- Native Momentum Scroll Feed --- */}
      <div className="flex-1 overflow-y-auto touch-auto px-4 py-6">
        <div className="space-y-6 pb-64 max-w-2xl mx-auto">
          {items.map((item, index) => (
            <div 
              key={index}
              ref={el => { refs.current[index] = el; }}
              className={`p-6 rounded-[2rem] transition-all cursor-pointer ${
                activeAyahIndex === index ? 'bg-emerald-500/15 ring-2 ring-emerald-500/30' : 'bg-white/[0.03]'
              }`}
            >
              <p className="text-3xl text-right font-arabic leading-[3.5rem] mb-6 text-white" dir="rtl">
                {item.content}
              </p>
              <p className="text-xs text-slate-400 italic mb-4 leading-relaxed border-t border-white/5 pt-4">
                {item.translation}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">
                  Repeat: {item.count}x
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}