'use client';

import { useState, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Play, Pause, Music, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const adhkar = [
  { 
    id: 1, 
    title: "Morning Adhkar", 
    duration: "21:05", 
    // FIXED: Remove '/public' from the path. Next.js serves this from the root.
    url: "/MakkahLive.Net.mp3" 
  },
  { 
    id: 2, 
    title: "Evening Adhkar", 
    duration: "20:57", 
    url: "/MakkahLive.Net_athkar_04.mp3" 
  },
  { 
    id: 3, 
    title: "Dua for Hifz", 
    duration: "08:54", 
    url: "/Ep. 3： The Best Du'as for Them ｜ For Those Left Behind by Dr. Omar Suleiman.mp3" 
  },
];


export default function AdhkarPlayer() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = (item: typeof adhkar[0]) => {
    if (!audioRef.current) return;

    if (playingId === item.id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      // If we are switching tracks, update the source
      if (audioRef.current.src !== window.location.origin + item.url) {
        audioRef.current.src = item.url;
      }
      
      audioRef.current.play().catch(err => {
        console.error("Audio play failed. Check if the file exists in /public:", err);
      });
      setPlayingId(item.id);
    }
  };

  return (
    <Card className="bg-[#0a0a0a] border-white/5 p-6 shadow-2xl">
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} preload="auto" />
      
      <h3 className="text-emerald-500 font-bold flex items-center gap-2 mb-6">
        <Volume2 className="h-5 w-5" /> Adhkar & Duas
      </h3>
      
      <div className="space-y-4">
        {adhkar.map((item) => (
          <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 border ${
            playingId === item.id ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg' : 'bg-white/5 border-transparent hover:border-white/10'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl transition-colors ${playingId === item.id ? 'bg-emerald-500 text-slate-950' : 'bg-emerald-500/10 text-emerald-500'}`}>
                <Music className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-black text-white">{item.title}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{item.duration}</p>
              </div>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className={`rounded-full transition-all ${
                playingId === item.id 
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' 
                : 'bg-white/5 text-slate-400 hover:text-emerald-500'
              }`}
              onClick={() => togglePlay(item)}
            >
              {playingId === item.id ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}