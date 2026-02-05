'use client';

import { Activity, Bell, Lock, Smartphone, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export default function Features() {
  // 🐍 Snake Animation Logic
  const [snakeIndex, setSnakeIndex] = useState(0);
  
  useEffect(() => {
    // Moves the "head" of the snake every 200ms
    const interval = setInterval(() => {
      setSnakeIndex((prev) => (prev + 1) % 60); // 60 dots total (12 cols * 5 rows)
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Helper to determine dot color based on snake position
  const getDotColor = (index: number) => {
    // The snake is 5 dots long
    const distance = (snakeIndex - index + 60) % 60;
    
    if (distance === 0) return 'bg-emerald-400 scale-125 shadow-[0_0_10px_#34d399]'; // Head (Glowing)
    if (distance > 0 && distance < 5) return 'bg-emerald-600/80'; // Body
    return 'bg-white/5'; // Empty Trail
  };

  return (
    <section id="features" className="relative py-32 bg-[#020617] overflow-hidden">
      
      {/* 🚀 1. Top Divider (Slanted) */}
      <div className="absolute inset-x-0 -top-5 h-5 bg-[emerald-500] -skew-y-6 origin-top-right z-20 border-b border-white/300" />
      
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-20">
        
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center mb-20">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-emerald-400 mb-6">
            <Zap className="h-3 w-3 fill-current" />
            <span>Built for Consistency</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6">
            A Spiritual Operating System
          </h2>
          <p className="text-lg leading-relaxed text-slate-400">
            HifzTracker combines modern habit psychology with traditional Hifz methods to help you build a routine that lasts eternity.
          </p>
        </div>

        {/* The Bento Grid (Dark Mode) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          
          {/* Feature 1: The Heatmap (Snake Animation) */}
          <div className="md:col-span-2 row-span-1 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden group hover:border-emerald-500/20 transition-all">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity className="h-32 w-32 text-emerald-500" />
            </div>
            
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Visual Consistency</h3>
                <p className="text-slate-400 max-w-md">
                  We track your daily momentum visually. Watch your grid fill up as you stay consistent.
                </p>
              </div>

              {/* 🐍 Snake Animation Grid */}
              <div className="flex gap-2 mt-8 opacity-90 overflow-hidden">
                {[...Array(12)].map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-2">
                    {[...Array(5)].map((_, rowIndex) => {
                      // Calculate linear index for snake logic (0 to 59)
                      // Snaking path: Down even cols, Up odd cols
                      const isEvenCol = colIndex % 2 === 0;
                      const linearIndex = isEvenCol 
                        ? (colIndex * 5) + rowIndex 
                        : (colIndex * 5) + (4 - rowIndex);

                      return (
                        <div 
                          key={rowIndex} 
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded-md transition-all duration-300 ${getDotColor(linearIndex)}`} 
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 2: Smart Revision (Tall) */}
          <div className="md:col-span-1 row-span-2 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden group hover:border-amber-500/20 transition-all">
            <div className="absolute -right-4 -top-4 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all" />
            
            <div className="h-full flex flex-col">
              <div className="mb-auto">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8 border border-amber-500/20">
                  <Bell className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Smart Muraja'ah</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Our algorithm tracks when you last recited a Surah and alerts you exactly when it's time to review, preventing "Weak Hifz".
                </p>
              </div>

              {/* Notification Mockup */}
              <div className="mt-8 space-y-4">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-300">
                   <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
                   <div>
                     <p className="text-sm font-bold text-white">Review Surah Al-Mulk</p>
                     <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">7 days ago</p>
                   </div>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex items-center gap-4 opacity-50">
                   <div className="w-2 h-2 rounded-full bg-emerald-500" />
                   <div>
                     <p className="text-sm font-bold text-white">Review Surah Ya-Sin</p>
                     <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">Upcoming</p>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3: Guest Mode (Small) */}
          <div className="md:col-span-1 row-span-1 bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between group hover:border-blue-500/20 transition-all">
             <div>
               <Lock className="h-8 w-8 text-blue-500 mb-6" />
               <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
               <p className="text-sm text-slate-400">
                 Use Guest Mode to log data locally. No account required.
               </p>
             </div>
             <div className="flex items-center gap-2 mt-4">
               <span className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-wide">
                 Local Storage
               </span>
             </div>
          </div>

          {/* Feature 4: Mobile Optimized (Small) */}
          <div className="md:col-span-1 row-span-1 bg-emerald-900/10 border border-emerald-500/20 rounded-[2.5rem] p-8 sm:p-10 flex flex-col justify-between group relative overflow-hidden">
             <div className="absolute inset-0 bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-all" />
             <div className="relative z-10">
               <Smartphone className="h-8 w-8 text-emerald-400 mb-6" />
               <h3 className="text-xl font-bold text-white mb-2">Native Feel</h3>
               <p className="text-sm text-emerald-100/70">
                 Designed to feel like a native app on iOS and Android.
               </p>
             </div>
             <div className="relative z-10 mt-4 flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
               <Zap className="h-3 w-3 fill-current" /> Fast & Responsive
             </div>
          </div>

        </div>
      </div>

      {/* 🚀 2. Bottom Divider (Wave) */}
      <div className="absolute inset-x-0 -bottom-1 z-20 leading-[0]">
         <svg className="w-full h-12 fill-[#020617] rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
             <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
         </svg>
      </div>

    </section>
  );
}